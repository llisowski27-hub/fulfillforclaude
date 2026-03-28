import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Returns the authenticated user, or null for guests. */
export async function getUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns auth.uid() for logged-in users, null for guests.
 *  Guest tracking (fallback UUID) is handled client-side via useUser(). */
export async function getEffectiveUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id ?? null;
}
