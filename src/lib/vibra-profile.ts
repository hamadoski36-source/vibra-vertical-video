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

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Upload a chosen photo for the signed-in creator and store its public URL in
 * creator_profiles.avatar_url. Throws with a plain-language message on failure;
 * the caller decides whether to fall back to a local copy.
 */
export async function saveCreatorAvatar(userId: string, file: File): Promise<string> {
  if (!userId) throw new Error('Ingia kwenye akaunti yako kwanza ili kuhifadhi picha mtandaoni.');
  if (!file.type.startsWith('image/')) throw new Error('Chagua faili ya picha.');
  if (file.size > AVATAR_MAX_BYTES) throw new Error('Picha ni kubwa mno. Chagua picha chini ya 5MB.');
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/avatar-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  const url = safeAvatarUrl(data?.publicUrl);
  if (!url) throw new Error('Imeshindwa kupata anwani ya picha.');
  const { error: profileError } = await supabase.from('creator_profiles')
    .upsert({ user_id: userId, avatar_url: url }, { onConflict: 'user_id' });
  if (profileError) throw new Error(profileError.message);
  return url;
}

/** Read a local image file as a data URL so it can be shown and stored on this device. */
export function readLocalPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Chagua faili ya picha.')); return; }
    if (file.size > AVATAR_MAX_BYTES) { reject(new Error('Picha ni kubwa mno. Chagua picha chini ya 5MB.')); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Imeshindwa kusoma picha.'));
    reader.readAsDataURL(file);
  });
}