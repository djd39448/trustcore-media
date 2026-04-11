// Agent API key — agents include this in Authorization: Bearer <key>
// In production, set AGENT_API_KEY env var. Falls back to a dev key.
export const AGENT_API_KEY =
  process.env.AGENT_API_KEY ?? "tcm-dev-key-change-me";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
