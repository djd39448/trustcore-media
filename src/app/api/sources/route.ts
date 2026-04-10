import { FEED_SOURCES } from "@/lib/feeds";

// GET /api/sources — list all configured RSS sources
// No auth required (read-only, public info)
export async function GET() {
  return Response.json({
    sources: FEED_SOURCES,
    count: FEED_SOURCES.length,
  });
}
