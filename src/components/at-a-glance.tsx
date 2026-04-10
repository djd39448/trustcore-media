"use client";

import type { FeedItem } from "@/lib/feeds";

interface GlanceProps {
  items: FeedItem[];
}

export function AtAGlance({ items }: GlanceProps) {
  const cryptoItems = items.filter((i) => i.category === "crypto");
  const aiItems = items.filter((i) => i.category === "ai");

  // Extract top keywords/themes from titles
  const cryptoThemes = extractThemes(cryptoItems);
  const aiThemes = extractThemes(aiItems);

  // Get the most recent headline from each category
  const latestCrypto = cryptoItems[0];
  const latestAI = aiItems[0];

  // Count unique sources
  const activeSources = new Set(items.map((i) => i.source)).size;

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent-crypto to-accent-ai" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          At a Glance
        </h2>
        <span className="text-[11px] text-muted ml-auto font-mono">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            timeZone: "America/New_York",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {items.length}
            </span>
            <span className="text-xs text-muted">headlines today</span>
          </div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-accent-crypto mr-1" />
              <span className="text-muted">
                {cryptoItems.length} crypto
              </span>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-accent-ai mr-1" />
              <span className="text-muted">{aiItems.length} AI</span>
            </div>
            <div className="text-muted">{activeSources} sources</div>
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
            Trending
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cryptoThemes.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-accent-crypto/10 text-accent-crypto border border-accent-crypto/20"
              >
                {t}
              </span>
            ))}
            {aiThemes.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-accent-ai/10 text-accent-ai border border-accent-ai/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Latest from each */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
            Just In
          </p>
          {latestCrypto && (
            <a
              href={latestCrypto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-foreground/80 hover:text-white leading-snug line-clamp-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-crypto mr-1.5 relative top-[-1px]" />
              {latestCrypto.title}
            </a>
          )}
          {latestAI && (
            <a
              href={latestAI.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-foreground/80 hover:text-white leading-snug line-clamp-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-ai mr-1.5 relative top-[-1px]" />
              {latestAI.title}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple keyword extraction from headlines
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
  ]);

  const freq = new Map<string, number>();

  for (const item of items.slice(0, 30)) {
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
    .slice(0, 6)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}
