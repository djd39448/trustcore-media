import type { MetadataRoute } from "next";

/**
 * sitemap.ts — generates /sitemap.xml at build/request time.
 *
 * The aggregator is a single-page reading experience plus a privacy
 * page. The homepage is the high-priority entry; the JSON API endpoints
 * intentionally do not appear (those are programmatic, not crawlable
 * destinations). Add more URLs here when new public pages ship
 * (e.g. /about, /sources/, /briefs/<date>).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://trustcore-media.vercel.app";
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
