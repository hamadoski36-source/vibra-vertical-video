import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://svrjacetnlwlwesferwz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function likeVideo(videoId: string, userId: string) {
  const { error } = await supabase.from('likes').insert([{ video_id: videoId, user_id: userId }])
  if (error) {
    await supabase.from('likes').delete().eq('video_id', videoId).eq('user_id', userId)
    return false
  }
  return true
}

export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }])
  if (error) {
    await supabase.from('follows').delete().eq('follower_id', followerId).eq('following_id', followingId)
    return false
  }
  return true
}

export async function getLikesCount(videoId: string) {
  const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('video_id', videoId)
  return count || 0
}
