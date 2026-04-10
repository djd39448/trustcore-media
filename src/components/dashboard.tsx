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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-card rounded-lg p-1">
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
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-ai/50 w-64"
        />
      </div>

      {/* Feed items */}
      <div className="grid gap-2">
        {filtered.length === 0 && (
          <p className="text-muted text-sm py-8 text-center">
            No headlines match your filter.
          </p>
        )}
        {filtered.map((item, i) => (
          <FeedCard key={`${item.link}-${i}`} item={item} />
        ))}
      </div>
    </div>
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

function FeedCard({ item }: { item: FeedItem }) {
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
      className="block bg-card hover:bg-card-hover border border-border rounded-lg px-4 py-3 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${
            item.category === "crypto" ? "bg-accent-crypto" : "bg-accent-ai"
          }`}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground group-hover:text-white leading-snug">
            {item.title}
          </h3>
          {item.snippet && (
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {item.snippet}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
            <span className="font-medium">{item.source}</span>
            {timeAgo && (
              <>
                <span>&middot;</span>
                <span>{timeAgo}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
