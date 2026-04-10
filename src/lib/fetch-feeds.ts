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

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 10_000,
  headers: {
    "User-Agent": "TrustCoreMedia/1.0",
  },
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

function extractImage(item: CustomItem): string {
  // 1. enclosure with image type
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }
  // 2. enclosure without type (many feeds skip the type)
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  // 3. media:content
  const mediaUrl = item["media:content"]?.$?.url;
  if (mediaUrl) return mediaUrl;
  // 4. media:thumbnail
  const thumbUrl = item["media:thumbnail"]?.$?.url;
  if (thumbUrl) return thumbUrl;
  // 5. First <img> in content HTML
  const imgMatch = (item.content ?? "").match(/src=["']([^"']+)/);
  if (imgMatch?.[1]) return imgMatch[1];
  return "";
}

async function fetchSingleFeed(source: FeedSource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items ?? []).slice(0, 15).map((item) => ({
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
  } catch (err) {
    console.error(`Failed to fetch ${source.name}: ${err}`);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((s) => fetchSingleFeed(s))
  );

  const items: FeedItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return items;
}
