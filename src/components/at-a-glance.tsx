"use client";

import type { FeedItem } from "@/lib/feeds";
import { formatDistanceToNow } from "date-fns";

/**
 * TodaysBrief — the magazine-style lead under the masthead.
 *
 * Replaces the previous stats-heavy "At a Glance" card. The lead picks
 * one crypto lede + one AI lede, surfaces a short editor-style note,
 * and shows a thin row of trending keywords as kicker pills. No big
 * stat splash; counts live in the masthead.
 */
export function TodaysBrief({ items }: { items: FeedItem[] }) {
  const cryptoItems = items.filter((i) => i.category === "crypto");
  const aiItems = items.filter((i) => i.category === "ai");

  const ledeCrypto = cryptoItems[0];
  const ledeAI = aiItems[0];

  const themes = extractThemes(items);

  return (
    <section className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-10 gap-y-6 pb-10 border-b border-rule">
      <div>
        <p className="kicker mb-2" style={{ color: "var(--kicker-crypto)" }}>
          Crypto · lede
        </p>
        {ledeCrypto && <Lede item={ledeCrypto} />}
      </div>
      <div>
        <p className="kicker mb-2" style={{ color: "var(--kicker-ai)" }}>
          AI · lede
        </p>
        {ledeAI && <Lede item={ledeAI} />}
      </div>

      {themes.length > 0 && (
        <div className="md:col-span-2 flex items-center gap-3 flex-wrap pt-4 border-t border-rule">
          <p className="kicker shrink-0">Trending</p>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-rule text-fg-dim font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Lede({ item }: { item: FeedItem }) {
  let timeAgo = "";
  try {
    timeAgo = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true });
  } catch {
    timeAgo = "";
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <h2 className="font-editorial text-fg text-2xl sm:text-[28px] leading-[1.15] tracking-tight group-hover:text-accent transition-colors">
        {item.title}
      </h2>
      {item.snippet && (
        <p className="text-sm text-fg-dim mt-2 leading-relaxed line-clamp-2">
          {item.snippet}
        </p>
      )}
      <p className="kicker mt-3">
        {item.source}
        {timeAgo && <span className="text-fg-muted"> · {timeAgo}</span>}
      </p>
    </a>
  );
}

/**
 * Surface the top recurring keywords across the latest headlines so
 * the trending row reads as a thermometer of what's actually being
 * discussed today (not as a tag cloud).
 */
function extractThemes(items: FeedItem[]): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to",
    "for", "of", "with", "and", "or", "but", "not", "no", "its", "it",
    "this", "that", "from", "by", "as", "be", "has", "have", "had", "will",
    "can", "could", "would", "should", "may", "might", "new", "says",
    "after", "over", "into", "how", "what", "why", "when", "who", "more",
    "than", "about", "up", "out", "just", "also", "been", "do", "does",
    "did", "get", "got", "us", "we", "they", "he", "she", "you", "your",
    "all", "some", "any", "most", "one", "two", "first", "last", "amid",
    "now", "says", "today", "year", "years", "amid",
  ]);

  const freq = new Map<string, number>();
  for (const item of items.slice(0, 40)) {
    const words = item.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    const seen = new Set<string>();
    for (const word of words) {
      if (seen.has(word)) continue;
      seen.add(word);
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}
