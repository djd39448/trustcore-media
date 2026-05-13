"use client";

import { useState } from "react";
import Image from "next/image";
import type { FeedItem } from "@/lib/feeds";
import { formatDistanceToNow } from "date-fns";

/**
 * Dashboard — the section below Today's Brief.
 *
 * Layout: two asymmetric magazine columns ("Crypto column" + "AI &
 * Tech column"), each with a feature lede (image, headline, snippet)
 * and three secondary stories. Below: filter pills + search + the
 * full chronological feed with calm, spaced rows.
 *
 * One accent (terracotta). Category is signaled by mono kicker labels,
 * never by big colored splashes — keeps the eye anchored on one accent
 * so the page reads like a publication, not a dashboard.
 */
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

  // Lead column = first 4 of each category. Lede has image+snippet;
  // the three under it are condensed.
  const topCrypto = items.filter((i) => i.category === "crypto").slice(0, 4);
  const topAI = items.filter((i) => i.category === "ai").slice(0, 4);

  const showColumns = filter === "all" && !search;

  return (
    <div className="space-y-10">
      {showColumns && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <StoryColumn
            kicker="Crypto"
            kickerColor="var(--kicker-crypto)"
            items={topCrypto}
          />
          <StoryColumn
            kicker="AI & Tech"
            kickerColor="var(--kicker-ai)"
            items={topAI}
          />
        </section>
      )}

      <section>
        <div className="flex items-end justify-between border-b border-rule pb-3 mb-1 flex-wrap gap-3">
          <div>
            <p className="kicker">The full file</p>
            <h2 className="font-editorial text-fg text-2xl mt-1">
              Every headline, in order
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-0.5 text-sm">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All <span className="text-fg-muted">({items.length})</span>
              </FilterButton>
              <FilterButton
                active={filter === "crypto"}
                onClick={() => setFilter("crypto")}
              >
                Crypto <span className="text-fg-muted">({cryptoCount})</span>
              </FilterButton>
              <FilterButton
                active={filter === "ai"}
                onClick={() => setFilter("ai")}
              >
                AI <span className="text-fg-muted">({aiCount})</span>
              </FilterButton>
            </div>
            <input
              type="text"
              placeholder="Search headlines…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-elev border border-rule rounded-md px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent w-60"
            />
          </div>
        </div>

        <div>
          {filtered.length === 0 && (
            <p className="text-fg-muted text-sm py-12 text-center font-editorial italic">
              No headlines match your filter.
            </p>
          )}
          {filtered.map((item, i) => (
            <FeedRow key={`${item.link}-${i}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StoryColumn({
  kicker,
  kickerColor,
  items,
}: {
  kicker: string;
  kickerColor: string;
  items: FeedItem[];
}) {
  const [lede, ...rest] = items;
  if (!lede) return null;

  return (
    <div className="space-y-5">
      <p className="kicker" style={{ color: kickerColor }}>
        {kicker}
      </p>
      <FeatureLede item={lede} />
      <ul className="border-t border-rule divide-y divide-rule">
        {rest.map((item, i) => (
          <li key={`${item.link}-${i}`}>
            <SecondaryStory item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureLede({ item }: { item: FeedItem }) {
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
      {item.image && (
        <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-bg-elev mb-4 border border-rule">
          <Image
            src={item.image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <h3 className="font-editorial text-fg text-2xl leading-[1.15] tracking-tight group-hover:text-accent transition-colors">
        {item.title}
      </h3>
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

function SecondaryStory({ item }: { item: FeedItem }) {
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
      className="flex gap-3 py-3 group items-start"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-editorial text-fg text-base leading-snug group-hover:text-accent transition-colors">
          {item.title}
        </h4>
        <p className="kicker mt-1">
          {item.source}
          {timeAgo && <span className="text-fg-muted"> · {timeAgo}</span>}
        </p>
      </div>
      {item.image && (
        <div className="relative shrink-0 w-20 h-14 rounded-md overflow-hidden bg-bg-elev border border-rule">
          <Image
            src={item.image}
            alt=""
            fill
            unoptimized
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
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
      className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
        active
          ? "bg-fg text-bg"
          : "text-fg-dim hover:text-fg hover:bg-bg-elev"
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

  const catLabel = item.category === "crypto" ? "Crypto" : "AI";
  const catColor =
    item.category === "crypto"
      ? "var(--kicker-crypto)"
      : "var(--kicker-ai)";

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-baseline py-3.5 border-b border-rule group"
    >
      <span
        className="kicker shrink-0 w-14 truncate"
        style={{ color: catColor }}
      >
        {catLabel}
      </span>
      <span className="text-sm sm:text-[15px] text-fg leading-snug group-hover:text-accent transition-colors">
        {item.title}
      </span>
      <span className="kicker text-fg-muted shrink-0 hidden sm:inline-block">
        {item.source}
        {timeAgo && <span> · {timeAgo}</span>}
      </span>
    </a>
  );
}
