import { AGENT_API_KEY } from "./config";

export function verifyAgentKey(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === AGENT_API_KEY;
}

export function unauthorized() {
  return Response.json(
    { error: "Unauthorized. Include Authorization: Bearer <AGENT_API_KEY>" },
    { status: 401 }
  );
}
