import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export const SUPABASE_URL = "https://yqakrtfpdicekxxibsqo.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NvWkgHYN03BTixNNi8_NAw_9zkWVfKi";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
