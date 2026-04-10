import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { verifyAgentKey, unauthorized } from "@/lib/auth";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// GET /api/brief — generate a structured daily brief (JSON)
// No auth required for read
export async function GET() {
  const items = await fetchAllFeeds();
  const now = new Date();
  const dateStr = format(now, "EEEE, MMMM d, yyyy");

  const cryptoItems = items
    .filter((i) => i.category === "crypto")
    .slice(0, 10);
  const aiItems = items.filter((i) => i.category === "ai").slice(0, 10);

  const brief = {
    date: dateStr,
    generatedAt: now.toISOString(),
    sections: [
      {
        title: "Crypto",
        items: cryptoItems.map((i) => ({
          title: i.title,
          source: i.source,
          link: i.link,
          snippet: i.snippet,
        })),
      },
      {
        title: "AI & Tech",
        items: aiItems.map((i) => ({
          title: i.title,
          source: i.source,
          link: i.link,
          snippet: i.snippet,
        })),
      },
    ],
    totalHeadlines: items.length,
  };

  return Response.json(brief);
}

// POST /api/brief — trigger sending the daily brief email
// Requires agent auth
export async function POST(request: Request) {
  if (!verifyAgentKey(request)) return unauthorized();

  // For now, return the brief data. Once Resend is configured,
  // this will actually send the email.
  const items = await fetchAllFeeds();
  const now = new Date();

  const cryptoItems = items
    .filter((i) => i.category === "crypto")
    .slice(0, 10);
  const aiItems = items.filter((i) => i.category === "ai").slice(0, 10);

  return Response.json({
    status: "brief_generated",
    message:
      "Email sending not yet configured. Set RESEND_API_KEY to enable.",
    date: format(now, "EEEE, MMMM d, yyyy"),
    crypto_headlines: cryptoItems.length,
    ai_headlines: aiItems.length,
  });
}
