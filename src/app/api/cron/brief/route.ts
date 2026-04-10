import { sendDailyBrief } from "@/lib/send-brief";

export const dynamic = "force-dynamic";

// Vercel Cron hits this endpoint. Protected by CRON_SECRET.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDailyBrief();

  return Response.json({
    status: result.errors.length === 0 ? "sent" : "partial",
    ...result,
    timestamp: new Date().toISOString(),
  });
}
