import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { verifyAgentKey, unauthorized } from "@/lib/auth";
import { sendDailyBrief } from "@/lib/send-brief";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// GET /api/brief — generate a structured daily brief (JSON)
export async function GET() {
  const items = await fetchAllFeeds();
  const now = new Date();
  const dateStr = format(now, "EEEE, MMMM d, yyyy");

  const cryptoItems = items.filter((i) => i.category === "crypto").slice(0, 10);
  const aiItems = items.filter((i) => i.category === "ai").slice(0, 10);

  return Response.json({
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
  });
}

// POST /api/brief — trigger sending the daily brief email (agent auth required)
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const key = process.env.AGENT_API_KEY || "tcm-dev-key-change-me";
  console.log("[brief POST] auth header present:", !!authHeader);
  console.log("[brief POST] auth header value:", authHeader);
  console.log("[brief POST] expected key:", key);
  console.log("[brief POST] env var set:", !!process.env.AGENT_API_KEY);

  if (!verifyAgentKey(request)) return unauthorized();

  const result = await sendDailyBrief();

  return Response.json({
    status: result.errors.length === 0 ? "sent" : "partial",
    ...result,
  });
}
