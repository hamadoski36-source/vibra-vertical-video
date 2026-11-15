const MY_URL = "https://svrjacetnlwlwesferwz.supabase.co"
const MY_KEY = "sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc"

import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(MY_URL, MY_KEY)
export type CloudVideo = { id: string; video_url: string; caption: string; username: string; created_at?: string }
export async function readCloudVideos(): Promise<CloudVideo[]> {
  const { data } = await supabase.from('vibra_videos').select('*').order('created_at', { ascending: false }).limit(100)
  return (data || []) as CloudVideo[]
}
export async function uploadCloudVideo(file: File, username: string, caption: string) {
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split('.').pop() || 'mp4'}`
  await supabase.storage.from('videos').upload(fileName, file, { upsert: true })
  const { data: pub } = supabase.storage.from('videos').getPublicUrl(fileName)
  const { data } = await supabase.from('vibra_videos').insert([{ video_url: pub.publicUrl, caption, username }]).select().single()
  return data as CloudVideo
}
export async function deleteCloudVideo(id: string | number) { await supabase.from('vibra_videos').delete().eq('id', id) }
export async function toggleFollowCloud(me: string, creator: string, was: boolean) {
  if (was) await supabase.from('vibra_follows').delete().match({ follower: me, following: creator })
  else await supabase.from('vibra_follows').insert([{ follower: me, following: creator }])
}
export async function getFollowCounts(user: string) {
  const f1 = await supabase.from('vibra_follows').select('*', { count: 'exact', head: true }).eq('following', user)
  const f2 = await supabase.from('vibra_follows').select('*', { count: 'exact', head: true }).eq('follower', user)
  return { followers: f1.count || 0, following: f2.count || 0 }
}
export async function toggleLikeCloud(videoId: string, user: string, was: boolean) {
  if (was) await supabase.from('vibra_likes').delete().match({ video_id: videoId, username: user })
  else await supabase.from('vibra_likes').insert([{ video_id: videoId, username: user }])
}
export async function getLikesMap() {
  const { data } = await supabase.from('vibra_likes').select('video_id')
  const map: Record<string, number> = {}
  ;(data || []).forEach((r: any) => { map[String(r.video_id)] = (map[String(r.video_id)] || 0) + 1 })
  return { map }
}
export async function addViewCloud(videoId: string, user: string) { await supabase.from('vibra_views').insert([{ video_id: videoId, username: user }]) }
export async function getTotalViews() { const { count } = await supabase.from('vibra_views').select('*', { count: 'exact', head: true }); return count || 0 }
export async function addCommentCloud(videoId: string, user: string, text: string) { await supabase.from('vibra_comments').insert([{ video_id: videoId, username: user, text }]) }
export async function getCommentsMap() {
  const { data } = await supabase.from('vibra_comments').select('*').order('created_at', { ascending: true })
  const m: Record<string, string[]> = {}
  ;(data || []).forEach((r: any) => { if (!m[String(r.video_id)]) m[String(r.video_id)] = []; m[String(r.video_id)].push(r.username + ': ' + r.text) })
  return m
}
export async function saveProfileCloud(email: string, username: string, name: string) { await supabase.from('vibra_profiles').upsert([{ email, username, name }], { onConflict: 'email' }) }
export async function sendMessageCloud(chatId: string, from: string, to: string, text: string) { await supabase.from('vibra_messages').insert([{ chat_id: chatId, from_name: from, to_name: to, text }]) }
export async function getMessagesCloud(chatId: string) { const { data } = await supabase.from('vibra_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true }); return data || [] }
export async function notifyCloud(to: string, from: string, type: string, videoId: string) { if (to === from) return; await supabase.from('vibra_notifications').insert([{ to_name: to, from_name: from, type, video_id: videoId }]) }
export async function getNotificationsCloud(user: string) { const { data } = await supabase.from('vibra_notifications').select('*').eq('to_name', user).order('created_at', { ascending: false }).limit(20); return data || [] }
