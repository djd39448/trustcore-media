import { verifyAgentKey, unauthorized } from "@/lib/auth";
import { addSubscriber, listSubscribers, subscriberCount } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

// GET /api/subscribers — list subscribers (agent auth required)
export async function GET(request: Request) {
  if (!verifyAgentKey(request)) return unauthorized();

  const subs = await listSubscribers();
  const count = await subscriberCount();

  return Response.json({ subscribers: subs, count });
}

// POST /api/subscribers — add a subscriber (public, for signup form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const result = await addSubscriber(email);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
