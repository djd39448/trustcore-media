import { fetchAllFeeds } from "@/lib/fetch-feeds";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/feeds?category=crypto|ai&limit=50&search=bitcoin
// No auth required (public read)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") ?? "100", 10);
  const search = searchParams.get("search")?.toLowerCase();

  let items = await fetchAllFeeds();

  if (category === "crypto" || category === "ai") {
    items = items.filter((i) => i.category === category);
  }
  if (search) {
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(search) ||
        i.snippet.toLowerCase().includes(search)
    );
  }
  items = items.slice(0, limit);

  return Response.json({
    items,
    count: items.length,
    fetchedAt: new Date().toISOString(),
  });
}
