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

  // Send individually so partial failures don't block other recipients
  for (const subscriber of subscribers) {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject,
      html,
      text,
    });
    if (error) {
      failed += 1;
      errors.push(`${subscriber.email}: ${JSON.stringify(error)}`);
    } else {
      sent += 1;
    }
  }

  return { sent, failed, errors };
}
