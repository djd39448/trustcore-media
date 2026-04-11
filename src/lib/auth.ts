export function verifyAgentKey(request: Request): boolean {
  const key = process.env.AGENT_API_KEY || "tcm-dev-key-change-me";
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === key;
}

export function unauthorized() {
  return Response.json(
    { error: "Unauthorized. Include Authorization: Bearer <AGENT_API_KEY>" },
    { status: 401 }
  );
}
