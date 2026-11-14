import { supabase } from '@/lib/supabase';

export type CloudVideo = { id: string | number; username: string; video_url: string; caption: string; created_at: string; user_id?: string };
export const VIDEO_BUCKET = 'vibra-videos';
export async function readCloudVideos() {
  const { data, error } = await supabase.from('videos').select('id,username,video_url,caption,created_at').order('created_at', { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as CloudVideo[];
}
export async function uploadCloudVideo(file: File, username: string, caption: string, onProgress: (value: number) => void) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error('Sign in to your verified account before uploading worldwide.');
  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'mp4';
  const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;
  onProgress(10);
  const { error: uploadError } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  onProgress(80);
  const { data: url } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  const { data, error } = await supabase.from('videos').insert({ username, caption, video_url: url.publicUrl, user_id: auth.user.id, created_at: new Date().toISOString() }).select('id,username,caption,video_url,created_at').single();
  if (error) {
    await supabase.storage.from(VIDEO_BUCKET).remove([path]);
    throw new Error(error.message);
  }
  onProgress(100);
  return data as CloudVideo;
}
export async function deleteCloudVideo(id: number | string) {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
}
