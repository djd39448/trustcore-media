export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    headers[k] = k === "authorization" ? v : "[present]";
  });

  return Response.json({
    envKeySet: !!process.env.AGENT_API_KEY,
    envKeyValue: process.env.AGENT_API_KEY ?? "(not set)",
    fallback: "tcm-dev-key-change-me",
    headers,
  });
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const key = process.env.AGENT_API_KEY || "tcm-dev-key-change-me";
  const token = auth?.replace("Bearer ", "") ?? "(no auth header)";

  return Response.json({
    authHeader: auth,
    extractedToken: token,
    expectedKey: key,
    match: token === key,
    envSet: !!process.env.AGENT_API_KEY,
  });
}
