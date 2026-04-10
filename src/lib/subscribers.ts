import { supabaseAdmin } from "./supabase";

export interface Subscriber {
  id?: string;
  email: string;
  subscribed_at?: string;
  active?: boolean;
}

async function ensureTable() {
  if (!supabaseAdmin) return false;

  // Try a simple select — if the table doesn't exist, we'll know
  const { error } = await supabaseAdmin
    .from("subscribers")
    .select("id")
    .limit(1);

  if (error?.code === "42P01") {
    // Table doesn't exist — this means we need to create it via the SQL editor
    // or management API. For now, fall back to in-memory.
    console.warn(
      "subscribers table does not exist in Supabase. " +
        "Create it with: CREATE TABLE subscribers (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, email text UNIQUE NOT NULL, subscribed_at timestamptz DEFAULT now(), active boolean DEFAULT true);"
    );
    return false;
  }

  return !error;
}

// Fallback in-memory store
const memoryStore = new Map<string, Subscriber>();

let tableReady: boolean | null = null;

async function isTableReady(): Promise<boolean> {
  if (tableReady !== null) return tableReady;
  tableReady = await ensureTable();
  return tableReady;
}

export async function addSubscriber(
  email: string
): Promise<{ status: "subscribed" | "already_subscribed" | "error"; email: string }> {
  const ready = await isTableReady();

  if (ready && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .upsert({ email, active: true }, { onConflict: "email" })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { status: "error", email };
    }
    return { status: "subscribed", email: data.email };
  }

  // Fallback: in-memory
  if (memoryStore.has(email)) {
    return { status: "already_subscribed", email };
  }
  memoryStore.set(email, {
    email,
    subscribed_at: new Date().toISOString(),
    active: true,
  });
  return { status: "subscribed", email };
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const ready = await isTableReady();

  if (ready && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .select("*")
      .eq("active", true)
      .order("subscribed_at", { ascending: false });

    if (error) {
      console.error("Supabase list error:", error);
      return [];
    }
    return data ?? [];
  }

  return Array.from(memoryStore.values());
}

export async function subscriberCount(): Promise<number> {
  const ready = await isTableReady();

  if (ready && supabaseAdmin) {
    const { count, error } = await supabaseAdmin
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    if (error) return 0;
    return count ?? 0;
  }

  return memoryStore.size;
}
