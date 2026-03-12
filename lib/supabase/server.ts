import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function isSupabaseConfigured() {
  return Boolean(getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getSupabaseAdmin() {
  if (cachedClient !== undefined) return cachedClient;

  if (!isSupabaseConfigured()) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return cachedClient;
}
