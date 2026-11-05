import { supabase } from '@/lib/supabase';

export function safeAvatarUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

/** The caller supplies the authenticated session ID, never the local display name. */
export async function readCreatorAvatar(userId: string): Promise<string | null> {
  if (!userId) return null;
  const { data, error } = await supabase.from('creator_profiles')
    .select('avatar_url').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return safeAvatarUrl(data?.avatar_url);
}