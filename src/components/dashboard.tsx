"use client";

import { useState } from "react";
import type { FeedItem } from "@/lib/feeds";
import { formatDistanceToNow } from "date-fns";

type Filter = "all" | "crypto" | "ai";

export function Dashboard({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (filter !== "all" && item.category !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const cryptoCount = items.filter((i) => i.category === "crypto").length;
  const aiCount = items.filter((i) => i.category === "ai").length;

  // Top stories: first 3 from each category
  const topCrypto = items.filter((i) => i.category === "crypto").slice(0, 3);
  const topAI = items.filter((i) => i.category === "ai").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Stories Section */}
      {filter === "all" && !search && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopStoriesColumn
            title="Crypto"
            accent="crypto"
            items={topCrypto}
          />
          <TopStoriesColumn title="AI & Tech" accent="ai" items={topAI} />
        </div>
      )}

      {/* Divider */}
      {filter === "all" && !search && (
        <div className="border-t border-border" />
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All ({items.length})
          </FilterButton>
          <FilterButton
            active={filter === "crypto"}
            onClick={() => setFilter("crypto")}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-accent-crypto mr-1.5" />
            Crypto ({cryptoCount})
          </FilterButton>
          <FilterButton
            active={filter === "ai"}
            onClick={() => setFilter("ai")}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-accent-ai mr-1.5" />
            AI ({aiCount})
          </FilterButton>
        </div>
        <input
          type="text"
          placeholder="Search headlines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-ai/30 w-72"
        />
      </div>

      {/* Full Feed — grouped by source */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <p className="text-muted text-sm py-12 text-center">
            No headlines match your filter.
          </p>
        )}
        {filtered.map((item, i) => (
          <FeedRow key={`${item.link}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function TopStoriesColumn({
  title,
  accent,
  items,
}: {
  title: string;
  accent: "crypto" | "ai";
  items: FeedItem[];
}) {
  const accentColor =
    accent === "crypto" ? "text-accent-crypto" : "text-accent-ai";
  const accentBorder =
    accent === "crypto" ? "border-accent-crypto/30" : "border-accent-ai/30";
  const accentBg =
    accent === "crypto" ? "bg-accent-crypto/5" : "bg-accent-ai/5";

  return (
    <div
      className={`rounded-xl border ${accentBorder} ${accentBg} p-5 space-y-4`}
    >
      <h2
        className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}
      >
        {title} — Top Stories
      </h2>
      {items.map((item, i) => (
        <TopStoryCard key={`${item.link}-${i}`} item={item} rank={i + 1} />
      ))}
    </div>
  );
}

function TopStoryCard({
  item,
  rank,
}: {
  item: FeedItem;
  rank: number;
}) {
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
      <div className="flex gap-3">
        <span className="text-2xl font-bold text-muted/30 leading-none mt-0.5 select-none">
          {rank}
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-white leading-snug">
            {item.title}
          </h3>
          {item.snippet && (
            <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
              {item.snippet}
            </p>
          )}
          <p className="text-[11px] text-muted/70 mt-1.5 font-medium">
            {item.source}
            {timeAgo && <span> &middot; {timeAgo}</span>}
          </p>
        </div>
      </div>
    </a>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors flex items-center ${
        active
          ? "bg-foreground text-background"
          : "text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
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
      className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-card/80 transition-colors group"
    >
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${
          item.category === "crypto" ? "bg-accent-crypto" : "bg-accent-ai"
        }`}
      />
      <span className="flex-1 text-sm text-foreground/90 group-hover:text-white truncate font-medium">
        {item.title}
      </span>
      <span className="shrink-0 text-[11px] text-muted font-medium hidden sm:block">
        {item.source}
      </span>
      <span className="shrink-0 text-[11px] text-muted/60 w-20 text-right hidden md:block">
        {timeAgo}
      </span>
    </a>
  );
}
