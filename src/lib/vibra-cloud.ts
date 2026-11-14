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

// --- REAL SOCIAL - Followers / Likes / Views / Comments ---
export async function toggleFollowCloud(follower: string, following: string, isFollowing: boolean) {
  if (isFollowing) {
    await supabase.from('vibra_follows').delete().eq('follower_name', follower).eq('following_name', following)
  } else {
    await supabase.from('vibra_follows').insert({ follower_name: follower, following_name: following })
  }
}
export async function getFollowCounts(myName: string) {
  const { data: followers } = await supabase.from('vibra_follows').select('id').eq('following_name', myName)
  const { data: following } = await supabase.from('vibra_follows').select('id').eq('follower_name', myName)
  return { followers: followers?.length || 0, following: following?.length || 0 }
}
export async function toggleLikeCloud(videoId: string, userName: string, isLiked: boolean) {
  if (isLiked) {
    await supabase.from('vibra_likes').delete().eq('video_id', videoId).eq('user_name', userName)
  } else {
    await supabase.from('vibra_likes').insert({ video_id: videoId, user_name: userName })
  }
}
export async function getLikesMap() {
  const { data } = await supabase.from('vibra_likes').select('video_id, user_name')
  const map: Record<string, number> = {}
  const mine: string[] = []
  data?.forEach(r => { map[r.video_id] = (map[r.video_id] || 0) + 1 })
  return { map, data: data || [] }
}
export async function addViewCloud(videoId: string, userName: string) {
  await supabase.from('vibra_views').insert({ video_id: videoId, user_name: userName })
}
export async function getTotalViews() {
  const { count } = await supabase.from('vibra_views').select('*', { count: 'exact', head: true })
  return count || 0
}
export async function addCommentCloud(videoId: string, userName: string, comment: string) {
  await supabase.from('vibra_comments').insert({ video_id: videoId, user_name: userName, comment })
}
export async function getCommentsMap() {
  const { data } = await supabase.from('vibra_comments').select('video_id, user_name, comment').order('id', { ascending: true })
  const map: Record<string, string[]> = {}
  data?.forEach(r => { if (!map[r.video_id]) map[r.video_id] = []; map[r.video_id].push(r.user_name + ': ' + r.comment) })
  return map
}
export async function deleteCloudVideo(id: number | string) {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
}
