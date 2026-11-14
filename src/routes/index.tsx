// VIBRA WORLDWIDE - FULL FIXED - LIKE / COMMENT / SAVE ZA WOTE
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide - Video feed' }] }),
  component: VibraTikTok,
})

type Clip = { id: string; url: string; caption: string; owner: string; ownerName: string; isMine: boolean }
type Comment = { id: string; videoId: string; user: string; text: string; time: string }
type Chat = { id: string; name: string; last: string }

const PINK = '#FE2C55'

// --- SUPABASE - HAPA NDIO LIKE/COMMENT/SAVE ZA WOTE ZINAKAA ---
// Badilisha hizi 2 na za kwako kutoka Supabase > Settings > API
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_KEY = 'YOUR_ANON_KEY'
const HAS_SUPABASE = !SUPABASE_URL.includes('YOUR_PROJECT')

async function supa(table: string, method: string, body?: any, query = '') {
  if (!HAS_SUPABASE) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: body ? JSON.stringify(body) : undefined,
  })
  try { return await res.json() } catch { return null }
}

function getMyId() {
  let id = localStorage.getItem('vibra_my_id')
  if (!id) { id = 'user-' + Math.random().toString(36).slice(2, 8); localStorage.setItem('vibra_my_id', id) }
  return id
}

function VibraTikTok() {
  const MY_ID = getMyId()
  const [myVideos, setMyVideos] = useState<Clip[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_my_videos') || '[]') } catch { return [] } })
  const [followingIds, setFollowingIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_following') || '[]') } catch { return [] } })
  const [likedIds, setLikedIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_liked') || '[]') } catch { return [] } })
  const [savedIds, setSavedIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_saved') || '[]') } catch { return [] } })
  const [comments, setComments] = useState<Comment[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_comments') || '[]') } catch { return [] } })
  const [counts, setCounts] = useState<Record<string, { likes: number; saves: number }>>({})
  const [chats] = useState<Chat[]>([]) // FIX 1: HAKUNA WATU WA UONGO - TUPU
  const [idx, setIdx] = useState(0)
  const [view, setView] = useState<'home' | 'me' | 'chat'>('home')
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou')
  const [caption, setCaption] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const demoFeed: Clip[] = [
    { id: 'welcome-vibra', url: 'https://videos.pexels.com/video-files/3205624/3205624-hd_720_1280_25fps.mp4', caption: 'Karibu Vibra Worldwide! Post video yako ya kwanza', owner: 'vibra-official', ownerName: 'Vibra', isMine: false },
  ]
  const baseFeed = [...myVideos, ...demoFeed]
  const feed = tab === 'following' ? baseFeed.filter(v => followingIds.includes(v.owner) || v.isMine) : baseFeed
  const current = feed.length > 0 ? feed[idx % feed.length] : undefined

  useEffect(() => { localStorage.setItem('vibra_my_videos', JSON.stringify(myVideos)) }, [myVideos])
  useEffect(() => { localStorage.setItem('vibra_following', JSON.stringify(followingIds)) }, [followingIds])
  useEffect(() => { localStorage.setItem('vibra_liked', JSON.stringify(likedIds)) }, [likedIds])
  useEffect(() => { localStorage.setItem('vibra_saved', JSON.stringify(savedIds)) }, [savedIds])
  useEffect(() => { localStorage.setItem('vibra_comments', JSON.stringify(comments)) }, [comments])

  // FIX 2: HESABU ZIMETENGANISHWA - HAZIFANANI TENA
  const myVideosCount = myVideos.length
  const followingCount = followingIds.filter(id => id !== MY_ID && id !== 'me').length
  const followersCount = 0 // Itaongezeka tu mtu mwingine akikufollow kupitia Supabase - sio kujifollow
  const totalLikesReceived = Object.values(counts).reduce((a, b) => a + b.likes, 0)

  // Soma hesabu za wote kutoka Supabase kila sekunde 5
  async function refreshCounts() {
    if (!HAS_SUPABASE || !current) return
    const likes: any = await supa('video_likes', 'GET', undefined, `?video_id=eq.${current.id}&select=*`)
    const saves: any = await supa('video_saves', 'GET', undefined, `?video_id=eq.${current.id}&select=*`)
    const comms: any = await supa('video_comments', 'GET', undefined, `?video_id=eq.${current.id}&select=*&order=created_at.desc`)
    if (Array.isArray(likes) || Array.isArray(saves)) {
      setCounts(c => ({ ...c, [current.id]: { likes: Array.isArray(likes) ? likes.length : 0, saves: Array.isArray(saves) ? saves.length : 0 } }))
    }
    if (Array.isArray(comms)) {
      const mapped = comms.map((x: any) => ({ id: String(x.id), videoId: x.video_id, user: x.username || 'Mtu', text: x.comment, time: 'sasa' }))
      setComments(prev => [...mapped, ...prev.filter(p => p.videoId !== current.id)])
    }
  }
  useEffect(() => { refreshCounts(); const t = setInterval(refreshCounts, 5000); return () => clearInterval(t) }, [current?.id])

  // FIX 3: LIKE - MTU MMOJA AKILIKE, WOTE WAONE
  async function toggleLike() {
    if (!current) return
    const already = likedIds.includes(current.id)
    setLikedIds(v => already ? v.filter(x => x !== current.id) : [...v, current.id])
    setCounts(c => ({ ...c, [current.id]: { likes: (c[current.id]?.likes || 0) + (already ? -1 : 1), saves: c[current.id]?.saves || 0 } }))
    if (HAS_SUPABASE) {
      if (already) await supa('video_likes', 'DELETE', undefined, `?video_id=eq.${current.id}&user_id=eq.${MY_ID}`)
      else await supa('video_likes', 'POST', { video_id: current.id, user_id: MY_ID })
    }
  }

  // FIX 4: SAVE - MTU MMOJA AKISAVE, WOTE WAONE
  async function toggleSave() {
    if (!current) return
    const already = savedIds.includes(current.id)
    setSavedIds(v => already ? v.filter(x => x !== current.id) : [...v, current.id])
    setCounts(c => ({ ...c, [current.id]: { likes: c[current.id]?.likes || 0, saves: (c[current.id]?.saves || 0) + (already ? -1 : 1) } }))
    if (HAS_SUPABASE) {
      if (already) await supa('video_saves', 'DELETE', undefined, `?video_id=eq.${current.id}&user_id=eq.${MY_ID}`)
      else await supa('video_saves', 'POST', { video_id: current.id, user_id: MY_ID })
    }
  }

  // FIX 5: COMMENT - MTU MMOJA AKICOMMENT, WOTE WAONE
  async function addComment() {
    if (!current || !commentText.trim()) return
    const newC: Comment = { id: Date.now().toString(), videoId: current.id, user: '@Mr Vibra', text: commentText.trim(), time: 'sasa' }
    setComments(v => [newC, ...v])
    setCommentText('')
    if (HAS_SUPABASE) await supa('video_comments', 'POST', { video_id: current.id, user_id: MY_ID, username: '@Mr Vibra', comment: newC.text })
  }

  // FIX 6: FOLLOW - HUWEZI KUJIFOLLOW
  function toggleFollow() {
    if (!current) return
    if (current.isMine) return
    if (current.owner === MY_ID || current.owner === 'me' || current.owner === 'mine') return
    setFollowingIds(v => v.includes(current.owner) ? v.filter(x => x !== current.owner) : [...v, current.owner])
  }

  function handleUpload(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    const newClip: Clip = { id: 'my-' + Date.now(), url, caption: caption || 'Video yangu mpya', owner: MY_ID, ownerName: '@Mr Vibra', isMine: true }
    setMyVideos(v => [newClip, ...v])
    setCaption(''); setShowUpload(false); setView('home'); setIdx(0)
  }

  const isLiked = current ? likedIds.includes(current.id) : false
  const isSaved = current ? savedIds.includes(current.id) : false
  const isFollowing = current ? followingIds.includes(current.owner) : false
  const likeCount = current ? (counts[current.id]?.likes || (isLiked ? 1 : 0)) : 0
  const saveCount = current ? (counts[current.id]?.saves || (isSaved ? 1 : 0)) : 0
  const videoComments = current ? comments.filter(c => c.videoId === current.id) : []

  if (view === 'me') {
    return (
      <div style={{ height: '100dvh', background: '#000', color: '#fff', padding: 20, overflowY: 'auto' }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>← Rudi</button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(90deg,#FE2C55,#25F4EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto' }}>M</div>
          <h2>@Mr Vibra</h2>
          <p style={{ color: '#aaa' }}>Moi's Bridge • Eldoret • Kenya</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
            <div><b>{followingCount}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Following</span></div>
            <div><b>{followersCount}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Followers</span></div>
            <div><b>{totalLikesReceived}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Likes</span></div>
          </div>
          <p style={{ color: '#aaa', fontSize: 13 }}>Videos zako: {myVideosCount} • Saved: {savedIds.length}</p>
          <button onClick={() => setShowUpload(true)} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 20, fontWeight: 'bold' }}>+ Post Video</button>
          <button onClick={() => setShowSaved(!showSaved)} style={{ background: '#222', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 20, marginLeft: 8 }}>{showSaved ? 'Ficha Saved' : 'Ona Saved'}</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginTop: 20 }}>
            {(showSaved ? baseFeed.filter(v => savedIds.includes(v.id)) : myVideos).map(v => (<video key={v.id} src={v.url} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} muted playsInline />))}
          </div>
          {myVideos.length === 0 && <p style={{ color: '#888' }}>Huna video bado.</p>}
        </div>
        {showUpload && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', padding: 20, zIndex: 100 }}><h3>Post Video</h3><input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption..." style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', marginBottom: 12 }} /><input type="file" accept="video/*" style={{ color: '#fff' }} onChange={e => handleUpload(e.target.files?.[0])} /><button onClick={() => setShowUpload(false)} style={{ display: 'block', marginTop: 16, background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12 }}>Funga</button></div>)}
      </div>
    )
  }

  if (view === 'chat') {
    return (
      <div style={{ height: '100dvh', background: '#000', color: '#fff', padding: 20 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>← Rudi</button>
        <h2>Chats</h2>
        {chats.length === 0 ? (<div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}><p style={{ fontSize: 40 }}>💬</p><p>Huna chat bado.</p><p style={{ fontSize: 13 }}>Mtu wa kweli akikutumia ujumbe, ataonekana hapa.</p></div>) : null}
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh', background: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', gap: 20, paddingTop: 14 }}>
        <button onClick={() => setTab('following')} style={{ background: 'none', border: 'none', color: tab === 'following' ? '#fff' : '#aaa', fontWeight: 'bold' }}>Following</button>
        <button onClick={() => setTab('foryou')} style={{ background: 'none', border: 'none', color: tab === 'foryou' ? '#fff' : '#aaa', fontWeight: 'bold' }}>For You</button>
      </div>
      {current ? (<video key={current.id} ref={videoRef} src={current.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted }} />) : (<div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}><p>Hakuna video kwenye Following bado.</p></div>)}
      {current && (
        <div style={{ position: 'absolute', right: 12, bottom: 130, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', zIndex: 10 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(90deg,#FE2C55,#25F4EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{current.ownerName.slice(0, 1)}</div>
            {!current.isMine && (<button onClick={toggleFollow} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: isFollowing ? '#fff' : PINK, color: isFollowing ? PINK : '#fff', border: 'none', fontWeight: 'bold' }}>{isFollowing ? '✓' : '+'}</button>)}
          </div>
          <button onClick={toggleLike} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 30 }}>{isLiked ? '❤️' : '🤍'}</div><div style={{ fontSize: 12 }}>{likeCount}</div><div style={{ fontSize: 10, color: '#aaa' }}>Like</div></button>
          <button onClick={() => setShowComments(true)} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 28 }}>💬</div><div style={{ fontSize: 12 }}>{videoComments.length}</div><div style={{ fontSize: 10, color: '#aaa' }}>Comment</div></button>
          <button onClick={toggleSave} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 28 }}>{isSaved ? '🔖' : '📌'}</div><div style={{ fontSize: 12 }}>{saveCount}</div><div style={{ fontSize: 10, color: '#aaa' }}>Save</div></button>
          <button onClick={() => setIdx(v => Math.max(0, v - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>⬆️</button>
          <button onClick={() => setIdx(v => v + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>⬇️</button>
        </div>
      )}
      {current && (<div style={{ position: 'absolute', left: 12, right: 70, bottom: 130, zIndex: 10 }}><p style={{ fontWeight: 'bold', margin: 0 }}>{current.ownerName}</p><p style={{ fontSize: 13 }}>{current.caption}</p><p style={{ fontSize: 11, color: '#aaa' }}>{current.isMine ? 'Video yako - haina +' : 'Gusa + kumfollow'}</p></div>)}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#000', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #222', zIndex: 20 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>🏠<br />Home</button>
        <button onClick={() => setView('chat')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>💬<br />Chat</button>
        <button onClick={() => setShowUpload(true)} style={{ background: PINK, color: '#fff', border: 'none', borderRadius: 12, width: 48, height: 36, fontSize: 22, fontWeight: 'bold' }}>+</button>
        <button onClick={() => setView('me')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>👤<br />Me</button>
      </div>
      {showComments && current && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', padding: 20, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <h3>Comments ({videoComments.length})</h3>
          <p style={{ fontSize: 12, color: '#aaa' }}>{HAS_SUPABASE ? 'Comments za wote - kila mtu anaona' : 'Unganisha Supabase ili kila mtu aone comments'}</p>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {videoComments.length === 0 ? <p style={{ color: '#888' }}>Hakuna comment bado. Kuwa wa kwanza!</p> : videoComments.map(c => (<div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid #222' }}><b>{c.user}</b><p style={{ margin: '4px 0' }}>{c.text}</p></div>))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Andika comment..." style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none' }} />
            <button onClick={addComment} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 12, fontWeight: 'bold' }}>Tuma</button>
          </div>
          <button onClick={() => setShowComments(false)} style={{ marginTop: 12, background: '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: 12 }}>Funga</button>
        </div>
      )}
      {showUpload && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', padding: 20, zIndex: 100 }}><h3>Post Video Mpya</h3><input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption..." style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', marginBottom: 12 }} /><input type="file" accept="video/*" style={{ color: '#fff' }} onChange={e => handleUpload(e.target.files?.[0])} /><button onClick={() => setShowUpload(false)} style={{ display: 'block', marginTop: 16, background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12 }}>Funga</button></div>)}
    </div>
  )
}
