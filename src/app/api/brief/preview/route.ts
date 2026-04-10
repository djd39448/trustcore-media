import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { buildBriefEmailHtml } from "@/lib/email-template";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// GET /api/brief/preview — renders the email HTML in browser
export async function GET() {
  const items = await fetchAllFeeds();
  const now = new Date();

  const cryptoItems = items
    .filter((i) => i.category === "crypto")
    .slice(0, 10);
  const aiItems = items.filter((i) => i.category === "ai").slice(0, 10);

  const brief = {
    date: format(now, "EEEE, MMMM d, yyyy"),
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

  const html = buildBriefEmailHtml(brief);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
