import { Resend } from "resend";
import { RESEND_API_KEY, FROM_EMAIL } from "./config";
import { fetchAllFeeds } from "./fetch-feeds";
import { buildBriefEmailHtml, buildBriefEmailText } from "./email-template";
import { listSubscribers } from "./subscribers";
import { format } from "date-fns";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendDailyBrief(): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  if (!resend) {
    return { sent: 0, failed: 0, errors: ["RESEND_API_KEY not configured"] };
  }

  const items = await fetchAllFeeds();
  const now = new Date();

  const cryptoItems = items.filter((i) => i.category === "crypto").slice(0, 10);
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
  const text = buildBriefEmailText(brief);
  const subject = `TrustCore Media — ${brief.date}`;

  const subscribers = await listSubscribers();

  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, errors: ["No active subscribers"] };
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Send in batches of 50
  const batchSize = 50;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    const bcc = batch.map((s) => s.email);

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: FROM_EMAIL, // send to self
        bcc,
        subject,
        html,
        text,
      });
      sent += batch.length;
    } catch (err) {
      failed += batch.length;
      errors.push(`Batch ${i / batchSize + 1}: ${err}`);
    }
  }

  return { sent, failed, errors };
}
