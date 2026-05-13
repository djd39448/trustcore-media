import Parser from "rss-parser";
import { FEED_SOURCES, type FeedItem, type FeedSource } from "./feeds";

type CustomItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: { url?: string; type?: string };
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
};

// Some sources (CryptoSlate via Cloudflare, etc.) reject the bare
// "TrustCoreMedia/1.0" UA. The polite-bot pattern below — browser-
// shaped Mozilla token + a contact URL — works against most WAFs while
// still self-identifying. For the stricter ones we fall back to a full
// browser UA in fetchRawWithFallback below.
const POLITE_UA =
  "Mozilla/5.0 (compatible; TrustCoreMediaBot/1.0; +https://trustcore-media.vercel.app)";
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const COMMON_HEADERS = {
  Accept:
    "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
  "Accept-Language": "en-US,en;q=0.9",
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 10_000,
  headers: {
    "User-Agent": POLITE_UA,
    ...COMMON_HEADERS,
  },
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

function extractImage(item: CustomItem): string {
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }
  if (item.enclosure?.url) return item.enclosure.url;
  const mediaUrl = item["media:content"]?.$?.url;
  if (mediaUrl) return mediaUrl;
  const thumbUrl = item["media:thumbnail"]?.$?.url;
  if (thumbUrl) return thumbUrl;
  const imgMatch = (item.content ?? "").match(/src=["']([^"']+)/);
  if (imgMatch?.[1]) return imgMatch[1];
  return "";
}

/**
 * Manual fallback for sources whose RSS won't parse via rss-parser's
 * built-in fetch — either because the host blocks bot-shaped User-Agents
 * (Cloudflare-fronted sites like CryptoSlate) or because the feed
 * contains malformed XML entities that rss-parser refuses.
 *
 * Steps:
 *   1. Fetch raw bytes with native fetch + a full browser UA.
 *   2. Sanitize bare `&` characters that aren't part of a valid entity
 *      (the LangChain Blog feed ships unescaped ampersands in titles
 *      that crash the XML parser).
 *   3. Hand the cleaned text to parser.parseString.
 */
async function fetchRawWithFallback(
  source: FeedSource,
): Promise<CustomItem[]> {
  const res = await fetch(source.url, {
    headers: {
      "User-Agent": BROWSER_UA,
      ...COMMON_HEADERS,
    },
    // Default Node fetch already follows redirects.
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const raw = await res.text();
  // Replace bare `&` that aren't followed by a known entity name with
  // `&amp;`. Conservative regex: matches `&` not followed by [a-z]+;
  // or `#\d+;` or `#x[0-9a-f]+;`.
  const sanitized = raw.replace(
    /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g,
    "&amp;",
  );
  const feed = (await parser.parseString(sanitized)) as {
    items?: CustomItem[];
  };
  return feed.items ?? [];
}

function normalizeItems(
  items: CustomItem[],
  source: FeedSource,
): FeedItem[] {
  return items.slice(0, 15).map((item) => ({
    title: item.title ?? "Untitled",
    link: item.link ?? "#",
    pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
    source: source.name,
    category: source.category,
    snippet:
      (item.contentSnippet ?? item.content ?? "")
        .replace(/<[^>]*>/g, "")
        .slice(0, 200) || "",
    image: extractImage(item),
  }));
}

async function fetchSingleFeed(source: FeedSource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return normalizeItems((feed.items ?? []) as CustomItem[], source);
  } catch (primaryErr) {
    // Fall back to manual fetch + sanitize + parseString. Logs the
    // primary error once, then the fallback error once if it also
    // fails — no per-retry spam.
    try {
      const items = await fetchRawWithFallback(source);
      // Note: silent success on fallback is intentional — the source
      // is working, we just had to take the long way.
      return normalizeItems(items, source);
    } catch (fallbackErr) {
      console.warn(
        `[fetch-feeds] ${source.name} unavailable — primary: ${describeErr(primaryErr)}; fallback: ${describeErr(fallbackErr)}`,
      );
      return [];
    }
  }
}

function describeErr(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((s) => fetchSingleFeed(s)),
  );
  const items: FeedItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }
  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
  return items;
}
