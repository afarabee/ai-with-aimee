import { supabase } from '@/integrations/supabase/client';

/**
 * Returns an Authorization header using the current user's session JWT.
 * Throws if no active session — admin actions require a signed-in admin.
 */
export async function getAuthHeader(): Promise<{ Authorization: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated. Please sign in again.');
  }
  return { Authorization: `Bearer ${session.access_token}` };
}
