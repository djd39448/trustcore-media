import Parser from "rss-parser";
import { FEED_SOURCES, type FeedItem, type FeedSource } from "./feeds";

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "TrustCoreMedia/1.0",
  },
});

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
