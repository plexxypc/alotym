import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Public Supabase settings. Only the project URL and anon key belong in frontend env vars.
 * The service-role key must stay in the Supabase dashboard and must never use a VITE_ prefix.
 */
const supabase_url = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabase_anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/**
 * True when the public Supabase settings needed by the browser are present.
 * This does not prove the database, policies, or a live submission have been verified.
 *
 * @returns Whether the frontend can attempt a stored enquiry.
 */
export function is_order_storage_configured(): boolean {
  return supabase_url.trim().length > 0 && supabase_anon_key.trim().length > 0;
}

/**
 * Creates the browser Supabase client when public settings exist.
 *
 * @returns The client, or null in demo mode.
 */
export function get_supabase_client(): SupabaseClient | null {
  if (!is_order_storage_configured()) {
    return null;
  }
  return createClient(supabase_url, supabase_anon_key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
