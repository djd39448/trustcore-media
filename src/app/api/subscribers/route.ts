import { verifyAgentKey, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

// In-memory subscriber store until Supabase is wired up
// This is intentionally simple — will be replaced with DB
const subscribers = new Map<string, { email: string; createdAt: string }>();

// GET /api/subscribers — list subscribers (agent auth required)
export async function GET(request: Request) {
  if (!verifyAgentKey(request)) return unauthorized();

  return Response.json({
    subscribers: Array.from(subscribers.values()),
    count: subscribers.size,
  });
}

// POST /api/subscribers — add a subscriber (public, for signup form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    if (subscribers.has(email)) {
      return Response.json({ status: "already_subscribed", email });
    }

    subscribers.set(email, { email, createdAt: new Date().toISOString() });

    return Response.json({ status: "subscribed", email });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
