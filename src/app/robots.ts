import type { MetadataRoute } from "next";

/**
 * robots.ts — generates /robots.txt at build/request time.
 *
 * Allows all crawlers, points at the sitemap. Aggregator content is
 * fully public; nothing in the app is gated or sensitive enough to
 * disallow. API routes excluded from crawl by convention.
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://trustcore-media.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
