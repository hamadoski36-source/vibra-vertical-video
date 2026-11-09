// @ts-nocheck
import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide - Video feed' }] }),
  component: VibraTikTok,
})

const SUPABASE_URL = 'https://svrjacetnlwlwesferwz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc'
const SB_HEADERS: any = { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }

const PINK = '#FE2C55'
const TEAL = '#25F4EE'

type Clip = { id: string; url: string; caption: string; creator: string; creator_email: string; likes: number; thumb?: string }

const DEMO_VIDEOS: Clip[] = [
  { id: 'demo1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption: 'Karibu Vibra Worldwide! 🔥 #vibra #trending', creator: 'Vibra Official', creator_email: 'vibra@official.com', likes: 1240 },
  { id: 'demo2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption: 'Dance challenge mpya! 💃 Unakubali?', creator: 'Hamadoski', creator_email: 'hamadoski@gmail.com', likes: 856 },
  { id: 'demo3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: 'Mombasa vibes 🌊❤️', creator: 'Mombasa Queen', creator_email: 'queen@mombasa.com', likes: 432 },
  { id: 'demo4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption: 'Nairobi nights 🌃', creator: 'Nairobi Boy', creator_email: 'nairobi@boy.com', likes: 321 },
  { id: 'demo5', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption: 'Funny moments 😂😂', creator: 'Comedy King', creator_email: 'comedy@king.com', likes: 987 },
]

function getStored(key: string, fallback: any) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function setStored(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

function VibraTikTok() {
  const hydrated = useHydrated()
  const [user, setUser] = useState<any>(() => getStored('vibra_user', null))
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou')
  const [idx, setIdx] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [clips, setClips] = useState<Clip[]>(DEMO_VIDEOS)
  const [likedIds, setLikedIds] = useState<string[]>(() => getStored('vibra_liked', []))
  const [likeCounts, setLikeCounts] = useState<any>(() => getStored('vibra_like_counts', {}))
  const [following, setFollowing] = useState<string[]>(() => getStored('vibra_following', []))
  const [savedIds, setSavedIds] = useState<string[]>(() => getStored('vibra_saved', []))
  const [panel, setPanel] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [caption, setCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<any>(() => getStored('vibra_comments', {}))
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState(() => getStored('vibra_coins', 120))
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setStored('vibra_liked', likedIds) }, [likedIds])
  useEffect(() => { setStored('vibra_like_counts', likeCounts) }, [likeCounts])
  useEffect(() => { setStored('vibra_following', following) }, [following])
  useEffect(() => { setStored('vibra_saved', savedIds) }, [savedIds])
  useEffect(() => { setStored('vibra_coins', coins) }, [coins])
  useEffect(() => { setStored('vibra_comments', comments) }, [comments])
  useEffect(() => { if (user) setStored('vibra_user', user) }, [user])

  // Load from Supabase - kama ikifail, demo videos zinabaki
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/vibra_videos?select=*&order=created_at.desc&limit=50`, { headers: SB_HEADERS })
        const j = await r.json()
        if (Array.isArray(j) && j.length > 0) {
          const mapped: Clip[] = j.map((v: any, i: number) => ({
            id: String(v.id || 'sb' + i),
            url: v.video_url || v.url || DEMO_VIDEOS[0].url,
            caption: v.caption || v.title || 'Vibra Video',
            creator: v.creator_name || v.user_email?.split('@')[0] || 'Vibra Creator',
            creator_email: v.user_email || v.creator_email || 'creator@vibra.com',
            likes: Number(v.likes_count || v.likes || 0),
          }))
          setClips([...mapped, ...DEMO_VIDEOS])
        }
      } catch {}
    })()
  }, [])

  const visibleClips = clips.filter(c => {
    if (tab === 'following' && user) return following.includes(c.creator_email)
    if (tab === 'following' && !user) return false
    if (search) return (c.caption + c.creator).toLowerCase().includes(search.toLowerCase())
    return true
  })
  const current = visibleClips[idx] || visibleClips[0] || DEMO_VIDEOS[0]
  const safeIdx = visibleClips.indexOf(current)
  const isLiked = current ? likedIds.includes(current.id) : false
  const displayLikes = current ? (likeCounts[current.id] ?? current.likes) : 0
  const isFollowing = current ? following.includes(current.creator_email) : false
  const isSaved = current ? savedIds.includes(current.id) : false

  const toggleLike = async () => {
    if (!current) return
    const newLiked = !isLiked
    const newCount = displayLikes + (newLiked ? 1 : -1)
    setLikeCounts((p: any) => ({ ...p, [current.id]: newCount }))
    setLikedIds((p) => newLiked ? [...p, current.id] : p.filter(x => x !== current.id))
    if (newLiked) setCoins((c: number) => c + 5)
    // Jaribu Supabase - kama table haipo, local inabaki
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/vibra_likes`, { method: 'POST', headers: SB_HEADERS, body: JSON.stringify({ video_id: current.id, user_email: user?.email || 'guest@vibra.com' }) })
    } catch {}
  }

  const toggleFollow = async () => {
    if (!current) return
    if (!user) { setShowLogin(true); return }
    const newFollow = !isFollowing
    setFollowing((p) => newFollow ? [...p, current.creator_email] : p.filter(x => x !== current.creator_email))
    try {
      if (newFollow) await fetch(`${SUPABASE_URL}/rest/v1/vibra_follows`, { method: 'POST', headers: SB_HEADERS, body: JSON.stringify({ follower_email: user.email, following_email: current.creator_email }) })
      else await fetch(`${SUPABASE_URL}/rest/v1/vibra_follows?follower_email=eq.${user.email}&following_email=eq.${current.creator_email}`, { method: 'DELETE', headers: SB_HEADERS })
    } catch {}
  }

  const toggleSave = () => {
    if (!current) return
    setSavedIds((p) => isSaved ? p.filter(x => x !== current.id) : [...p, current.id])
  }

  const next = () => { if (safeIdx < visibleClips.length - 1) setIdx(safeIdx + 1) }
  const prev = () => { if (safeIdx > 0) setIdx(safeIdx - 1) }

  const handleLogin = () => {
    if (!loginName.trim() || !loginEmail.trim()) { alert('Weka jina na email!'); return }
    const u = { name: loginName.trim(), email: loginEmail.trim().toLowerCase() }
    setUser(u); setShowLogin(false); alert(`Karibu ${u.name}! 🎉`)
  }

  const handleUpload = () => {
    if (!user) { setShowLogin(true); return }
    if (!videoUrl.trim() && !caption.trim()) { alert('Weka link ya video au caption!'); return }
    const newClip: Clip = { id: 'my' + Date.now(), url: videoUrl.trim() || DEMO_VIDEOS[0].url, caption: caption.trim() || 'Video yangu mpya! 🔥', creator: user.name, creator_email: user.email, likes: 0 }
    setClips((p) => [newClip, ...p]); setCaption(''); setVideoUrl(''); setShowCamera(false); setTab('foryou'); setIdx(0); alert('Video imepakiwa! 🎉')
  }

  const handleFile = (e: any) => {
    const f = e.target.files?.[0]; if (!f) return
    const url = URL.createObjectURL(f)
    const newClip: Clip = { id: 'my' + Date.now(), url, caption: caption.trim() || f.name, creator: user?.name || 'Mimi', creator_email: user?.email || 'me@vibra.com', likes: 0 }
    setClips((p) => [newClip, ...p]); setShowCamera(false); setTab('foryou'); setIdx(0); alert('Video imepakiwa kutoka simu! 🎉')
  }

  const addComment = () => {
    if (!commentText.trim() || !current) return
    const list = comments[current.id] || []
    setComments({ ...comments, [current.id]: [...list, { name: user?.name || 'Mgeni', text: commentText.trim() }] })
    setCommentText('')
  }

  const shareVideo = () => {
    const text = `Tazama hii video kwenye Vibra! ${current?.caption}`
    if (navigator.share) navigator.share({ title: 'Vibra', text }).catch(() => {})
    else { navigator.clipboard?.writeText(text); alert('Link imecopywa! 🔗') }
  }

  if (!hydrated) return <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>VIBRA...</div>

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', position: 'relative', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'linear-gradient(180deg, rgba(0,0,0,0.85), transparent)' }}>
        <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>VIBRA<span style={{ color: PINK }}>●</span></div>
        <div style={{ display: 'flex', gap: 18, fontWeight: 700, fontSize: 15 }}>
          <span onClick={() => { setTab('following'); setIdx(0) }} style={{ cursor: 'pointer', opacity: tab === 'following' ? 1 : 0.6, borderBottom: tab === 'following' ? `2px solid ${PINK}` : 'none', paddingBottom: 3 }}>Following</span>
          <span onClick={() => { setTab('foryou'); setIdx(0) }} style={{ cursor: 'pointer', opacity: tab === 'foryou' ? 1 : 0.6, borderBottom: tab === 'foryou' ? `2px solid ${PINK}` : 'none', paddingBottom: 3 }}>For You</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ background: '#222', padding: '5px 10px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>🪙 {coins}</span>
          <span onClick={() => setPanel(panel === 'search' ? '' : 'search')} style={{ fontSize: 20, cursor: 'pointer' }}>🔍</span>
          {user ? <span onClick={() => setPanel(panel === 'profile' ? '' : 'profile')} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(90deg,${PINK},${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' }}>{user.name[0].toUpperCase()}</span> : <button onClick={() => setShowLogin(true)} style={{ background: PINK, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 800, cursor: 'pointer' }}>Ingia</button>}
        </div>
      </div>

      {/* SEARCH PANEL */}
      {panel === 'search' && (
        <div style={{ position: 'fixed', top: 60, left: 12, right: 12, zIndex: 60, background: '#1a1a1a', padding: 12, borderRadius: 14 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tafuta video au creator..." style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#333', color: '#fff', outline: 'none' }} />
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Video zinazopatikana: {visibleClips.length}</div>
        </div>
      )}

      {/* PROFILE PANEL */}
      {panel === 'profile' && user && (
        <div style={{ position: 'fixed', top: 60, right: 12, zIndex: 60, background: '#1a1a1a', padding: 16, borderRadius: 14, width: 230 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{user.name}</div>
          <div style={{ opacity: 0.6, fontSize: 13 }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}><span><b>{following.length}</b> Following</span><span><b>{coins}</b> Coins</span><span><b>{savedIds.length}</b> Saved</span></div>
          <button onClick={() => { setUser(null); localStorage.removeItem('vibra_user'); setPanel('') }} style={{ marginTop: 14, width: '100%', background: '#333', color: '#fff', border: 'none', padding: 10, borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Toka (Logout)</button>
        </div>
      )}

      {/* MAIN VIDEO */}
      {tab === 'following' && !user ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>👥</div><div style={{ fontWeight: 900, fontSize: 20, marginTop: 10 }}>Ingia ili uone Following</div><div style={{ opacity: 0.6, marginTop: 6 }}>Watu unaowafollow wataonekana hapa</div>
          <button onClick={() => setShowLogin(true)} style={{ marginTop: 16, background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 800 }}>Ingia Sasa</button>
        </div>
      ) : tab === 'following' && visibleClips.length === 0 ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>😔</div><div style={{ fontWeight: 900, fontSize: 20, marginTop: 10 }}>Bado haujafollow mtu</div><div style={{ opacity: 0.6, marginTop: 6 }}>Nenda For You, bonyeza Follow kwa creator yeyote!</div>
          <button onClick={() => { setTab('foryou'); setIdx(0) }} style={{ marginTop: 16, background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 800 }}>Nenda For You</button>
        </div>
      ) : (
        <div style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
          <video key={current.id} ref={videoRef} src={current.url} autoPlay loop muted={!soundEnabled} playsInline controls={false} onClick={(e: any) => e.target.paused ? e.target.play() : e.target.pause()} style={{ width: '100%', height: '100%', objectFit: 'cover', maxWidth: 480 }} />
          <div onClick={() => setSoundEnabled(!soundEnabled)} style={{ position: 'absolute', top: 70, right: 16, background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>{soundEnabled ? '🔊' : '🔇'}</div>

          {/* RIGHT ACTIONS */}
          <div style={{ position: 'absolute', right: 12, bottom: 130, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', zIndex: 20 }}>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div onClick={toggleFollow} style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(90deg,${PINK},${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, cursor: 'pointer', border: '2px solid #fff' }}>{current.creator[0].toUpperCase()}</div>
              <div onClick={toggleFollow} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: isFollowing ? '#fff' : PINK, color: isFollowing ? PINK : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, cursor: 'pointer', border: '2px solid #000' }}>{isFollowing ? '✓' : '+'}</div>
            </div>
            <div onClick={toggleLike} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 32, transform: isLiked ? 'scale(1.15)' : 'scale(1)', transition: '0.15s' }}>{isLiked ? '❤️' : '🤍'}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{displayLikes >= 1000 ? (displayLikes / 1000).toFixed(1) + 'K' : displayLikes}</div></div>
            <div onClick={() => setPanel(panel === 'comments' ? '' : 'comments')} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>💬</div><div style={{ fontWeight: 800, fontSize: 13 }}>{(comments[current.id] || []).length}</div></div>
            <div onClick={toggleSave} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>{isSaved ? '🔖' : '📌'}</div><div style={{ fontWeight: 700, fontSize: 12 }}>{isSaved ? 'Saved' : 'Save'}</div></div>
            <div onClick={shareVideo} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>↗️</div><div style={{ fontWeight: 700, fontSize: 12 }}>Share</div></div>
          </div>

          {/* BOTTOM INFO */}
          <div style={{ position: 'absolute', left: 12, right: 70, bottom: 110, zIndex: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 17 }}>@{current.creator}</div>
            <div style={{ marginTop: 4, fontSize: 14, lineHeight: 1.4, opacity: 0.95 }}>{current.caption}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={toggleFollow} style={{ background: isFollowing ? '#fff' : PINK, color: isFollowing ? '#000' : '#fff', border: 'none', padding: '7px 16px', borderRadius: 20, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>{isFollowing ? 'Following ✓' : 'Follow'}</button>
              <button onClick={() => setPanel('comments')} style={{ background: '#222', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Comments</button>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>{safeIdx + 1} / {visibleClips.length} • Swipe au tumia vitufe →</div>
          </div>

          {/* PREV / NEXT */}
          <div style={{ position: 'absolute', right: 12, bottom: 260, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 20 }}>
            <button onClick={prev} disabled={safeIdx === 0} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 18, opacity: safeIdx === 0 ? 0.3 : 1 }}>↑</button>
            <button onClick={next} disabled={safeIdx >= visibleClips.length - 1} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 18, opacity: safeIdx >= visibleClips.length - 1 ? 0.3 : 1 }}>↓</button>
          </div>
        </div>
      )}

      {/* COMMENTS */}
      {panel === 'comments' && (
        <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, zIndex: 70, background: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '50vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>Comments ({(comments[current.id] || []).length})</b><span onClick={() => setPanel('')} style={{ cursor: 'pointer', fontSize: 20 }}>✕</span></div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(comments[current.id] || []).length === 0 && <div style={{ opacity: 0.6, fontSize: 13 }}>Hakuna comment bado - Kuwa wa kwanza!</div>}
            {(comments[current.id] || []).map((c: any, i: number) => <div key={i} style={{ background: '#222', padding: '10px 12px', borderRadius: 12 }}><b style={{ fontSize: 13 }}>{c.name}</b><div style={{ fontSize: 14, marginTop: 2 }}>{c.text}</div></div>)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Andika comment..." style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: '#333', color: '#fff', outline: 'none' }} /><button onClick={addComment} style={{ background: PINK, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 800 }}>Tuma</button></div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 14px' }}>
        <span onClick={() => { setTab('foryou'); setIdx(0); setPanel('') }} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>🏠</div>Home</span>
        <span onClick={() => setPanel(panel === 'search' ? '' : 'search')} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>🔍</div>Discover</span>
        <span onClick={() => { if (!user) setShowLogin(true); else setShowCamera(true) }} style={{ width: 48, height: 32, background: `linear-gradient(90deg,${PINK},${TEAL})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer' }}>+</span>
        <span onClick={() => setPanel(panel === 'comments' ? '' : 'comments')} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>💬</div>Inbox</span>
        <span onClick={() => { if (!user) setShowLogin(true); else setPanel(panel === 'profile' ? '' : 'profile') }} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>👤</div>Me</span>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 20, width: '100%', maxWidth: 360 }}>
            <div style={{ fontWeight: 900, fontSize: 22, textAlign: 'center' }}>Ingia Vibra 🔥</div>
            <div style={{ opacity: 0.6, fontSize: 13, textAlign: 'center', marginTop: 4 }}>Ingia ili u-like, u-follow na u-upload</div>
            <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Jina lako - mf: Hamadoski" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 16, outline: 'none', boxSizing: 'border-box' }} />
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email - mf: wewe@gmail.com" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 10, outline: 'none', boxSizing: 'border-box' }} />
            <button onClick={handleLogin} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontWeight: 900, marginTop: 14, cursor: 'pointer' }}>INGIA</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', background: 'transparent', color: '#aaa', border: 'none', padding: 10, marginTop: 6, cursor: 'pointer' }}>Ghairi</button>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 20, width: '100%', maxWidth: 380 }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Pakia Video 🎬</div>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Weka link ya video (mp4)..." style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 16, outline: 'none', boxSizing: 'border-box' }} />
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Andika caption... #vibra" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 10, outline: 'none', minHeight: 70, boxSizing: 'border-box' }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 800, marginTop: 10, cursor: 'pointer' }}>📁 Chagua Video Kutoka Simu</button>
            <button onClick={handleUpload} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontWeight: 900, marginTop: 10, cursor: 'pointer' }}>PAKIA VIDEO</button>
            <button onClick={() => setShowCamera(false)} style={{ width: '100%', background: 'transparent', color: '#aaa', border: 'none', padding: 10, marginTop: 6, cursor: 'pointer' }}>Ghairi</button>
          </div>
        </div>
      )}
    </div>
  )
}
