// VIBRA v16 FIXED - LIKE HAIKATI + VIDEO AUTOPLAY + PROFILE -> ME
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { readCloudVideos, uploadCloudVideo, deleteCloudVideo, toggleFollowCloud, getFollowCounts, toggleLikeCloud, getLikesMap, addViewCloud, getTotalViews, addCommentCloud, getCommentsMap, saveProfileCloud, sendMessageCloud, getMessagesCloud, notifyCloud, getNotificationsCloud, type CloudVideo } from '@/lib/vibra-cloud'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/')({ component: VibraTikTok })

type Clip = { id?: number | string; url: string; caption: string; username?: string }
const PINK = '#FE2C55'; const TEAL = '#25F4EE'
const GRADIENT = 'linear-gradient(90deg,#FE2C55,#25F4EE)'
const GBTN = 'linear-gradient(90deg,#FE2C55 0%,#FF6B9D 50%,#25F4EE 100%)'
const VT: React.CSSProperties = { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }
const VB: React.CSSProperties = { background: GBTN, color: '#fff', border: 'none', fontWeight: 'bold' }
const IN: React.CSSProperties = { padding: 12, borderRadius: 12, border: `2px solid ${TEAL}`, background: '#111', color: '#fff', fontSize: 13, width: '100%', boxSizing: 'border-box', outline: 'none' }
const NS: React.CSSProperties = { position: 'fixed', left: '50%', bottom: 80, transform: 'translateX(-50%)', zIndex: 9999, background: GBTN, color: '#fff', padding: '8px 14px', borderRadius: 20, fontSize: 11, fontWeight: 'bold', maxWidth: '90%', textAlign: 'center' }

function cap(t: string) { if (!t) return null; const p = t.split(/(#[\wÀ-ÿ]+)/g); return <span style={{ fontSize: 11 }}>{p.map((x, i) => x.startsWith('#') ? <span key={i} style={{ color: TEAL, fontWeight: 'bold' }}>{x} </span> : <span key={i}>{x}</span>)}</span> }

function VibraTikTok() {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [idx, setIdx] = useState(0)
  const [view, setView] = useState('home')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('foryou')
  const [panel, setPanel] = useState('')
  const [comment, setComment] = useState('')
  const [notice, setNotice] = useState('')
  const [savedIds, setSavedIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_saved') || '[]') } catch { return [] } })
  const [likedIds, setLikedIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_liked') || '[]') } catch { return [] } })
  const [followingIds, setFollowingIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('vibra_following') || '[]') } catch { return [] } })
  const [cloudClips, setCloudClips] = useState<Clip[]>([])
  const [myVideos, setMyVideos] = useState<Clip[]>([])
  const [cloudReady, setCloudReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [realFollowers, setRealFollowers] = useState(0)
  const [realFollowingCount, setRealFollowingCount] = useState(0)
  const [cloudLikesMap, setCloudLikesMap] = useState<Record<string, number>>({})
  const [cloudCommentsMap, setCloudCommentsMap] = useState<Record<string, string[]>>({})
  const [realTotalViews, setRealTotalViews] = useState(0)
  const [notifs, setNotifs] = useState<any[]>([])
  const [name, setName] = useState('@MrVibra')
  const [bio, setBio] = useState('Mombasa Vibes | Kamata #Mombasa #Vibra')
  const [dp, setDp] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [meTab, setMeTab] = useState('videos')
  const [authUser, setAuthUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPass, setAuthPass] = useState('')
  const [authError, setAuthError] = useState('')
  const [chats, setChats] = useState<any[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [coins, setCoins] = useState<number>(() => { try { return parseInt(localStorage.getItem('vibra_coins') || '100') } catch { return 100 } })
  const [bigHeart, setBigHeart] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  const touchY = useRef<number | null>(null)
  const lastScroll = useRef(0)
  const tapTimeout = useRef<any>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<any>(null)

  const selectedChat = chats.find(c => c.id === selectedChatId) || null
  const followers = realFollowers
  const following = realFollowingCount > 0 ? realFollowingCount : followingIds.length

  function stopSound() { try { document.querySelectorAll('video').forEach((v: any) => { v.pause(); v.muted = true }) } catch {} setSoundEnabled(false) }
  function goView(v: string) { stopSound(); setView(v) }

  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(t) }, [notice])
  useEffect(() => { try { const cur = localStorage.getItem('vibra_current_user'); if (cur) { const u = JSON.parse(cur); setAuthUser(u); setName('@' + u.name.replace('@', '')); setAuthName(u.name) } } catch {} }, [])
  useEffect(() => { setDp(localStorage.getItem('vibra_dp') || ''); setBio(localStorage.getItem('vibra_bio') || 'Mombasa Vibes | Kamata #Mombasa #Vibra') }, [])
  useEffect(() => { readCloudVideos().then(rows => { setCloudClips(rows.map((r: CloudVideo) => ({ id: r.id, url: r.video_url, caption: r.caption || '', username: r.username || '' }))); setCloudReady(true) }).catch(() => {}) }, [])
  useEffect(() => { if (!name) return; getFollowCounts(name).then(c => { setRealFollowers(c.followers); setRealFollowingCount(c.following) }).catch(()=>{}); getLikesMap().then(r => setCloudLikesMap(r.map)).catch(()=>{}); getCommentsMap().then(m => setCloudCommentsMap(m)).catch(()=>{}); getTotalViews().then(v => setRealTotalViews(v)).catch(()=>{}); getNotificationsCloud(name).then(n => setNotifs(n)).catch(()=>{}) }, [name, cloudReady])

  const defaultVid: Clip = { url: 'https://videos.pexels.com/video-files/1806922/1806922-hd_1920_1080_24fps.mp4', caption: 'Karibu Vibra! #Vibra #Mombasa #Kamata' }
  const allBase: Clip[] = [...myVideos, ...cloudClips].filter((v, i, a) => a.findIndex(x => String(x.id ?? x.url) === String(v.id ?? v.url)) === i)
  const baseFeed: Clip[] = allBase.length > 0 ? allBase : [defaultVid]
  const filtered = search ? baseFeed.filter(v => v.caption.toLowerCase().includes(search.toLowerCase())) : baseFeed
  const feedRaw = tab === 'following' ? filtered.filter(v => followingIds.includes(String(v.id ?? v.url))) : filtered
  const feed = feedRaw
  const safeIdx = feed.length > 0 ? (idx % feed.length) : 0
  const current = feed.length > 0 ? feed[safeIdx] : undefined
  const clipKey = String(current?.id ?? current?.url ?? 'empty')
  const liked = likedIds.includes(clipKey)
  const saved = savedIds.includes(clipKey)
  const isFollowing = followingIds.includes(clipKey)

  // ===== FIX 1: LIKE HAIRUDI 0 =====
  // Tunachukua max ya cloud + localStorage. Hata kama cloud inachelewa, like inabaki.
  const localLikesCache: Record<string, number> = (() => { try { return JSON.parse(localStorage.getItem('vibra_likes_count') || '{}') } catch { return {} } })()
  const likes = Math.max(cloudLikesMap[clipKey] || 0, localLikesCache[clipKey] || 0, liked ? 1 : 0)
  const cloudComments = (cloudCommentsMap[clipKey] || [])
  const commentCount = cloudComments.length
  const isMine = !current?.username || current.username === name
  const creatorDp = isMine ? (dp || 'https://i.pravatar.cc/150?img=68') : `https://ui-avatars.com/api/?name=${encodeURIComponent((current?.username || 'V').replace('@',''))}&background=FE2C55&color=fff&size=150&bold=true`

  // ===== FIX 2: VIDEO AUTOPLAY =====
  useEffect(() => {
    if (view !== 'home') return
    const v = videoRef.current
    if (!v) return
    v.muted = !soundEnabled
    v.volume = soundEnabled ? 1 : 0
    v.playsInline = true
    const play = () => v.play().catch(() => setTimeout(() => v.play().catch(()=>{}), 500))
    // load upya ili icheze mara moja
    v.load()
    play()
  }, [clipKey, view])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !soundEnabled
    v.volume = soundEnabled ? 1 : 0
    if (soundEnabled && view === 'home') v.play().catch(()=>{})
  }, [soundEnabled])

  useEffect(() => { if (!current || view !== 'home') return; const t = setTimeout(() => { addViewCloud(clipKey, name).catch(()=>{}); setRealTotalViews(v => v + 1) }, 2000); return () => clearTimeout(t) }, [clipKey, view])

  function toggleSound() {
    const v = videoRef.current
    const n = !soundEnabled
    setSoundEnabled(n)
    if (v) { v.muted = !n; v.volume = n ? 1 : 0; if (n) v.play().catch(()=>{}) }
    setNotice(n ? '🔊 Sauti IMEWAKA' : '🔇 Sauti IMEKATIKA')
  }

  async function doLikeInstant() {
    const was = liked
    const next = was ? likedIds.filter(id => id !== clipKey) : [...likedIds, clipKey]
    setLikedIds(next)
    localStorage.setItem('vibra_liked', JSON.stringify(next))
    // Hifadhi count mara moja - isirudi 0
    try {
      const m = JSON.parse(localStorage.getItem('vibra_likes_count') || '{}')
      m[clipKey] = Math.max(0, (m[clipKey] || (cloudLikesMap[clipKey] || 0)) + (was ? -1 : 1))
      if (m[clipKey] < 0) m[clipKey] = 0
      localStorage.setItem('vibra_likes_count', JSON.stringify(m))
      setCloudLikesMap(prev => ({ ...prev, [clipKey]: m[clipKey] }))
    } catch {}
    try {
      await toggleLikeCloud(clipKey, name, was)
      await notifyCloud(current?.username || name, name, 'like', clipKey).catch(()=>{})
      const r = await getLikesMap()
      // Usiandike 0 juu ya local - chukua max
      setCloudLikesMap(prev => {
        const merged: Record<string, number> = { ...r.map }
        Object.keys(prev).forEach(k => { merged[k] = Math.max(merged[k] || 0, prev[k] || 0) })
        return merged
      })
    } catch {}
  }

  function handleVideoTap() {
    const now = Date.now()
    if (now - lastTap < 350) {
      if (tapTimeout.current) { clearTimeout(tapTimeout.current); tapTimeout.current = null }
      if (!liked) doLikeInstant()
      setBigHeart(true); setTimeout(() => setBigHeart(false), 900)
      setLastTap(0); return
    }
    setLastTap(now)
    if (tapTimeout.current) clearTimeout(tapTimeout.current)
    tapTimeout.current = setTimeout(() => { toggleSound(); tapTimeout.current = null }, 360)
  }

  function nextVideo() { if (feed.length === 0) return; setIdx(v => (v + 1) % feed.length) }
  function prevVideo() { if (feed.length === 0) return; setIdx(v => (v - 1 + feed.length) % feed.length) }
  function onTouchStart(e: React.TouchEvent) { touchY.current = e.touches[0].clientY }
  function onTouchEnd(e: React.TouchEvent) { if (touchY.current === null) return; const dy = touchY.current - e.changedTouches[0].clientY; touchY.current = null; if (Math.abs(dy) < 50) return; if (dy > 0) nextVideo(); else prevVideo() }
  function onWheel(e: React.WheelEvent) { const now = Date.now(); if (now - lastScroll.current < 400) return; lastScroll.current = now; if (e.deltaY > 0) nextVideo(); else prevVideo() }

  function doSignup() {
    if (!authName.trim() || !authEmail.trim() || !authPass.trim()) { setAuthError('Jaza Jina, Email na Password'); return }
    try {
      const users = JSON.parse(localStorage.getItem('vibra_users') || '[]')
      if (users.find((u: any) => u.email.toLowerCase() === authEmail.toLowerCase())) { setAuthError('Email tayari imeshatumika. Bonyeza Login.'); return }
      const nu = { name: authName.trim(), email: authEmail.trim().toLowerCase(), pass: authPass }
      users.push(nu); localStorage.setItem('vibra_users', JSON.stringify(users)); localStorage.setItem('vibra_current_user', JSON.stringify(nu))
      saveProfileCloud(authEmail.trim().toLowerCase(), authEmail.trim().toLowerCase(), authName.trim()).catch(()=>{})
      setAuthUser(nu); setName('@' + authName.trim().replace('@', '')); setShowAuth(false); setNotice('Karibu Vibra! 🎉')
    } catch { setAuthError('Imeshindwa.') }
  }
  function doLogin() {
    if (!authEmail.trim() || !authPass.trim()) { setAuthError('Jaza Email na Password'); return }
    try {
      const users = JSON.parse(localStorage.getItem('vibra_users') || '[]')
      const f = users.find((u: any) => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.pass === authPass)
      if (!f) { setAuthError('Email au Password si sahihi.'); return }
      localStorage.setItem('vibra_current_user', JSON.stringify(f))
      setAuthUser(f); setName('@' + f.name.replace('@', '')); setShowAuth(false); setNotice('Karibu tena!')
    } catch { setAuthError('Imeshindwa.') }
  }
  function doLogout() { if (!confirm('Toka?')) return; localStorage.removeItem('vibra_current_user'); setAuthUser(null); setShowAuth(true); setView('home') }
  function toggleSave() { setSavedIds(v => { const n = v.includes(clipKey) ? v.filter(id => id !== clipKey) : [...v, clipKey]; localStorage.setItem('vibra_saved', JSON.stringify(n)); setNotice(n.includes(clipKey) ? 'Ime-save! ✅' : 'Imeondolewa'); return n }) }
  async function toggleFollow() {
    if (isMine) return
    const was = isFollowing
    setFollowingIds(v => { const n = v.includes(clipKey) ? v.filter(id => id !== clipKey) : [...v, clipKey]; localStorage.setItem('vibra_following', JSON.stringify(n)); return n })
    try { const creator = current?.username || name; await toggleFollowCloud(name, creator, was); await notifyCloud(creator, name, 'follow', clipKey).catch(()=>{}); const c = await getFollowCounts(name); setRealFollowers(c.followers); setRealFollowingCount(c.following) } catch {}
  }
  async function addComment() {
    if (!comment.trim()) return
    const t = comment.trim(); setComment('')
    try { await addCommentCloud(clipKey, name, t); await notifyCloud(current?.username || name, name, 'comment', clipKey).catch(()=>{}); const m = await getCommentsMap(); setCloudCommentsMap(m); setNotice('Comment imetumwa!') } catch { setNotice('Comment imetumwa!') }
  }
  async function uploadVideo(file: File | Blob | undefined) {
    if (!file || uploading) return
    setUploading(true); setNotice('⏳ Inapakia Cloud...')
    try {
      let cp = caption.trim() || '#Vibra #Mombasa'
      let cloudOk = false
      try { await uploadCloudVideo(file as File, name, cp); cloudOk = true } catch (e) { console.log('Cloud fail', e) }
      try { const rows = await readCloudVideos(); setCloudClips(rows.map((r: CloudVideo) => ({ id: r.id, url: r.video_url, caption: r.caption || '', username: r.username || '' }))) } catch {}
      if (!cloudOk) { const url = URL.createObjectURL(file as Blob); const nc: Clip = { id: Date.now(), url, caption: cp, username: name }; setMyVideos(l => [nc, ...l]) }
      setCaption(''); setIdx(0); setView('home'); setPanel(''); setShowCamera(false)
      setNotice(cloudOk ? 'Video imepakiwa! ✅' : '⚠️ Cloud imeshindwa - angalia Internet')
    } catch { setNotice('Imeshindwa kupakia') } finally { setUploading(false) }
  }
  async function deleteCurrentVideo() {
    if (!current) return; if (!confirm('Futa hii video?')) return
    const k = String(current.id ?? current.url)
    setCloudClips(p => p.filter(v => String(v.id ?? v.url) !== k)); setMyVideos(p => p.filter(v => String(v.id ?? v.url) !== k))
    try { if (current.id) await deleteCloudVideo(current.id) } catch {}
    setNotice('Video imefutwa! 🗑️')
  }
  function choosePhoto(f: File | undefined) { if (!f) return; const r = new FileReader(); r.onload = () => { const u = String(r.result); setDp(u); localStorage.setItem('vibra_dp', u); setNotice('Picha imehifadhiwa!') }; r.readAsDataURL(f) }
  function saveProfile() { localStorage.setItem('vibra_dp', dp); localStorage.setItem('vibra_bio', bio); localStorage.setItem('vibra_name', name); setShowEdit(false); setNotice('Profile imehifadhiwa!') }
  async function openChat(c: any) { setSelectedChatId(c.id); const msgs = await getMessagesCloud(c.id).catch(() => []); setChats(p => p.map(x => x.id === c.id ? { ...x, messages: msgs.map((m: any) => ({ from: m.from_name === name ? 'me' : 'them', text: m.text, time: 'Now' })), unread: 0 } : x)) }
  async function sendChatMsg() { if (!chatInput.trim() || !selectedChat) return; const text = chatInput.trim(); setChatInput(''); const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); setChats(p => p.map(c => c.id === selectedChat.id ? { ...c, last: text, messages: [...c.messages, { from: 'me', text, time }] } : c)); try { await sendMessageCloud(selectedChat.id, name, selectedChat.name, text) } catch {} }

  const profileVideos = [...myVideos, ...cloudClips.filter(c => !myVideos.some(m => String(m.id) === String(c.id)))]
  const totalViews = realTotalViews > 0 ? realTotalViews : profileVideos.length * 10
  const savedVideos = [...baseFeed, ...myVideos, ...cloudClips].filter((v, i, a) => a.findIndex(x => String(x.id ?? x.url) === String(v.id ?? v.url)) === i).filter(v => savedIds.includes(String(v.id ?? v.url)))

  const tikNav = (active: string) => (
    <nav style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 12px 10px', background: '#000', borderTop: '1px solid #222' }}>
      <button onClick={() => goView('home')} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 19 }}>🏠</div><div style={{ fontSize: 9 }}>Home</div></button>
      <button onClick={() => { stopSound(); setPanel('discover') }} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 19 }}>🔍</div><div style={{ fontSize: 9 }}>Discover</div></button>
      <button onClick={() => { stopSound(); setShowCamera(true) }} style={{ width: 44, height: 30, borderRadius: 10, border: 'none', background: '#fff', color: '#000', fontSize: 19, fontWeight: 'bold' }}>+</button>
      <button onClick={() => goView('chat')} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 19 }}>💬</div><div style={{ fontSize: 9 }}>Inbox</div></button>
      <button onClick={() => goView('me')} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}><div style={{ fontSize: 19 }}>👤</div><div style={{ fontSize: 9, fontWeight: active === 'me' ? 'bold' : 'normal' }}>Me</div></button>
    </nav>
  )

  // ===== ME PAGE =====
  if (view === 'me') {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
        <div style={{ padding: 14, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => goView('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>←</button>
            <b style={{ ...VT, fontSize: 13 }}>Profile</b>
            <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>⚙️</button>
          </div>
          <img src={dp || 'https://i.pravatar.cc/150?img=68'} style={{ width: 90, height: 90, borderRadius: '50%', marginTop: 12, objectFit: 'cover', border: `2px solid ${TEAL}` }} />
          <h2 style={{ margin: '8px 0 0', fontSize: 16 }}>{name}</h2>
          <p style={{ fontSize: 11, color: '#ccc', margin: '4px 0' }}>{bio}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10 }}>
            <div><b>{followers}</b><div style={{ fontSize: 10, color: '#aaa' }}>Followers</div></div>
            <div><b>{following}</b><div style={{ fontSize: 10, color: '#aaa' }}>Following</div></div>
            <div><b>{likes}</b><div style={{ fontSize: 10, color: '#aaa' }}>Likes</div></div>
            <div><b>{totalViews}</b><div style={{ fontSize: 10, color: '#aaa' }}>Views</div></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setShowEdit(true)} style={{ flex: 1, padding: 10, borderRadius: 12, border: `1px solid ${TEAL}`, background: 'transparent', color: TEAL, fontWeight: 'bold', fontSize: 12 }}>Edit Profile</button>
            <button onClick={() => setShowAuth(true)} style={{ flex: 1, padding: 10, borderRadius: 12, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{authUser ? 'Akaunti ✅' : 'Sign Up'}</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setMeTab('videos')} style={{ flex: 1, padding: 8, borderRadius: 10, border: 'none', background: meTab === 'videos' ? PINK : '#222', color: '#fff', fontSize: 11 }}>🎬 Videos</button>
            <button onClick={() => setMeTab('saved')} style={{ flex: 1, padding: 8, borderRadius: 10, border: 'none', background: meTab === 'saved' ? PINK : '#222', color: '#fff', fontSize: 11 }}>🔖 Saved</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {(meTab === 'videos' ? profileVideos : savedVideos).map((v, i) => (
              <div key={i} onClick={() => { setView('home'); setIdx(feed.findIndex(x => String(x.id ?? x.url) === String(v.id ?? v.url)) >= 0 ? feed.findIndex(x => String(x.id ?? x.url) === String(v.id ?? v.url)) : 0) }} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#111' }}>
                <video src={v.url} muted playsInline preload="metadata" style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover' }} />
                <p style={{ fontSize: 9, padding: '4px 6px', margin: 0 }}>{v.caption.slice(0, 30)}</p>
              </div>
            ))}
          </div>
          {(meTab === 'videos' ? profileVideos : savedVideos).length === 0 && <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 30 }}>Hakuna video bado. Pakia ya kwanza! 🎬</p>}
        </div>
        {showEdit && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.9)', padding: 16, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ ...VT }}>Edit Profile</b><button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>✕</button></div>
            <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" style={{ ...IN, marginTop: 12 }} />
            <button onClick={() => photoRef.current?.click()} style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${TEAL}`, background: 'transparent', color: TEAL, fontWeight: 'bold', marginTop: 10 }}>📷 Badilisha Picha</button>
            <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => choosePhoto(e.target.files?.[0])} />
            <button onClick={saveProfile} style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold', marginTop: 10 }}>Hifadhi ✅</button>
          </div>
        )}
        {showAuth && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, color: '#fff', overflowY: 'auto' }}>
            <h1 style={{ ...VT, fontSize: 28 }}>VIBRA</h1>
            <div style={{ display: 'flex', gap: 10 }}><button onClick={() => setAuthMode('signup')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: authMode === 'signup' ? GBTN : '#333', color: '#fff', fontWeight: 'bold' }}>Sign Up</button><button onClick={() => setAuthMode('login')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: authMode === 'login' ? GBTN : '#333', color: '#fff', fontWeight: 'bold' }}>Login</button></div>
            <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10, background: '#111', padding: 14, borderRadius: 16, marginTop: 14 }}>
              {authMode === 'signup' && <><label style={{ ...VT, fontSize: 12 }}>👤 Jina</label><input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="MrVibra" style={IN} /></>}
              <label style={{ ...VT, fontSize: 12 }}>📧 Email</label><input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="wewe@gmail.com" style={IN} />
              <label style={{ ...VT, fontSize: 12 }}>🔒 Password</label><input value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="Angalau 4" type="password" style={IN} />
              {authError && <p style={{ color: PINK, fontSize: 11, textAlign: 'center' }}>{authError}</p>}
              <button onClick={authMode === 'signup' ? doSignup : doLogin} style={{ padding: 12, borderRadius: 12, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold' }}>{authMode === 'signup' ? 'Tengeneza Akaunti 🎉' : 'Ingia 👋'}</button>
              <button onClick={() => setShowAuth(false)} style={{ padding: 10, borderRadius: 12, border: `1px solid ${TEAL}`, background: 'transparent', color: TEAL }}>Funga</button>
            </div>
          </div>
        )}
        {tikNav('me')}
        {notice && <div style={NS}>{notice}</div>}
      </div>
    )
  }

  // ===== CHAT =====
  if (view === 'chat') {
    if (selectedChat) return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#111' }}>
          <button onClick={() => setSelectedChatId(null)} style={{ background: 'none', border: 'none', color: TEAL, fontSize: 18 }}>←</button>
          <img src={selectedChat.avatar} style={{ width: 38, height: 38, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}><b style={{ ...VT, fontSize: 12 }}>{selectedChat.name}</b><p style={{ fontSize: 10, margin: 0, color: TEAL }}>● Online</p></div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedChat.messages?.map((m: any, i: number) => (<div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: m.from === 'me' ? GBTN : '#222', padding: '9px 11px', borderRadius: 16, fontSize: 12 }}>{m.text}</div>))}
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 10, background: '#111' }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChatMsg() }} placeholder="Andika..." style={{ flex: 1, padding: 10, borderRadius: 24, border: `1px solid ${TEAL}`, background: '#222', color: '#fff', fontSize: 12 }} />
          <button onClick={sendChatMsg} style={{ background: GBTN, border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%' }}>➤</button>
        </div>
        {tikNav('chat')}
      </div>
    )
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
        <div style={{ padding: '14px 14px 0' }}><h1 style={{ ...VT, fontSize: 22, margin: 0 }}>Vibra Chat 💬</h1></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {chats.length === 0 && <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 30 }}>Hakuna chat bado. Anza na rafiki! 💬</p>}
          {chats.map(c => (<div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px' }}><button onClick={() => openChat(c)} style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', background: 'none', border: 'none', color: '#fff', textAlign: 'left' }}><img src={c.avatar} style={{ width: 48, height: 48, borderRadius: '50%' }} /><div style={{ flex: 1 }}><b style={{ ...VT, fontSize: 12 }}>{c.name}</b><p style={{ fontSize: 11, margin: 0 }}>{c.last}</p></div></button></div>))}
        </div>
        {tikNav('chat')}
      </div>
    )
  }

  // ===== HOME / FEED =====
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
        <h1 style={{ ...VT, fontSize: 22, margin: 0 }}>VIBRA</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ flex: 1, padding: 8, borderRadius: 20, border: `1px solid ${TEAL}`, background: '#111', color: '#fff', fontSize: 12, outline: 'none' }} />
        <button onClick={() => setShowAuth(true)} style={{ background: GBTN, border: 'none', color: '#fff', padding: '8px 12px', borderRadius: 20, fontWeight: 'bold', fontSize: 11 }}>{authUser ? '✅' : 'Sign Up'}</button>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 8px' }}>
        <button onClick={() => { setTab('foryou'); setIdx(0) }} style={{ flex: 1, padding: 8, borderRadius: 20, border: 'none', background: tab === 'foryou' ? GBTN : '#222', color: '#fff', fontWeight: 'bold', fontSize: 11 }}>For You</button>
        <button onClick={() => { setTab('following'); setIdx(0) }} style={{ flex: 1, padding: 8, borderRadius: 20, border: 'none', background: tab === 'following' ? GBTN : '#222', color: '#fff', fontWeight: 'bold', fontSize: 11 }}>Following</button>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onWheel={onWheel}>
        {current && (
          <>
            {/* VIDEO - AUTOPLAY + TAP 1x SAUTI, TAP 2x LIKE */}
            <video
              ref={videoRef}
              key={clipKey}
              src={current.url}
              autoPlay
              muted={!soundEnabled}
              playsInline
              loop
              preload="auto"
              onClick={handleVideoTap}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {bigHeart && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 90 }}>❤️</div>}
            {!soundEnabled && <button onClick={toggleSound} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: 20, fontSize: 11, fontWeight: 'bold' }}>🔇 Tap kwa Sauti</button>}
            {soundEnabled && <button onClick={toggleSound} style={{ position: 'absolute', top: 12, right: 12, background: PINK, border: 'none', color: '#fff', padding: '8px 12px', borderRadius: 20, fontSize: 11, fontWeight: 'bold' }}>🔊 Sauti ON</button>}

            {/* RIGHT ACTIONS */}
            <div style={{ position: 'absolute', right: 10, bottom: 110, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <button onClick={() => { stopSound(); setView('me'); setMeTab('videos') }} style={{ background: 'none', border: 'none', textAlign: 'center' }}>
                <img src={creatorDp} style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${TEAL}`, objectFit: 'cover' }} />
                <div style={{ fontSize: 9, color: '#fff', marginTop: 2 }}>Profile</div>
              </button>
              <button onClick={doLikeInstant} style={{ background: 'none', border: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 30 }}>{liked ? '❤️' : '🤍'}</div>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>{likes}</div>
              </button>
              <button onClick={() => setPanel(panel === 'comments' ? '' : 'comments')} style={{ background: 'none', border: 'none', textAlign: 'center' }}><div style={{ fontSize: 26 }}>💬</div><div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>{commentCount}</div></button>
              <button onClick={toggleSave} style={{ background: 'none', border: 'none', textAlign: 'center' }}><div style={{ fontSize: 26 }}>{saved ? '🔖' : '📑'}</div><div style={{ fontSize: 11, color: '#fff' }}>Save</div></button>
              <button onClick={() => { if (confirm('Futa hii video?')) deleteCurrentVideo() }} style={{ background: 'none', border: 'none', textAlign: 'center' }}><div style={{ fontSize: 22 }}>🗑️</div></button>
            </div>

            {/* BOTTOM CAPTION + CREATOR - TAP KWENDA ME */}
            <div style={{ position: 'absolute', left: 12, bottom: 100, right: 70 }}>
              <div onClick={() => { stopSound(); setView('me'); setMeTab('videos') }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img src={creatorDp} style={{ width: 38, height: 38, borderRadius: '50%', border: `2px solid ${TEAL}` }} />
                <b style={{ fontSize: 13, color: '#fff' }}>{current.username || name}</b>
                {!isMine && <button onClick={(e) => { e.stopPropagation(); toggleFollow() }} style={{ padding: '4px 10px', borderRadius: 12, border: 'none', background: isFollowing ? '#333' : PINK, color: '#fff', fontWeight: 'bold', fontSize: 10 }}>{isFollowing ? 'Following ✅' : 'Follow +'}</button>}
              </div>
              <p style={{ fontSize: 12, margin: '8px 0 0', color: '#eee' }}>{cap(current.caption)}</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button onClick={prevVideo} style={{ padding: '6px 12px', borderRadius: 20, border: 'none', background: '#222', color: '#fff', fontSize: 11 }}>↑ Prev</button>
                <button onClick={nextVideo} style={{ padding: '6px 12px', borderRadius: 20, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold', fontSize: 11 }}>Next ↓</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* COMMENTS */}
      {panel === 'comments' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ ...VT }}>Comments 💬</b><button onClick={() => setPanel('')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>✕</button></div>
          <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
            {cloudComments.length === 0 && <p style={{ color: '#888', fontSize: 12, textAlign: 'center' }}>Hakuna comment bado. Kuwa wa kwanza! 💬</p>}
            {cloudComments.map((c, i) => (<p key={i} style={{ fontSize: 12, background: '#111', padding: '8px 10px', borderRadius: 12 }}>{c}</p>))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Andika comment..." style={{ flex: 1, padding: 10, borderRadius: 20, border: `1px solid ${TEAL}`, background: '#222', color: '#fff', fontSize: 12 }} />
            <button onClick={addComment} style={{ padding: '10px 16px', borderRadius: 20, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold' }}>Tuma</button>
          </div>
        </div>
      )}

      {/* UPLOAD */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: '#000', padding: 16, color: '#fff', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ ...VT }}>Pakia Video 🎬</b><button onClick={() => setShowCamera(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>✕</button></div>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption... #Vibra #Mombasa" style={{ ...IN, marginTop: 14 }} />
          <button onClick={() => uploadRef.current?.click()} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold', marginTop: 12 }}>{uploading ? '⏳ Inapakia...' : '📁 Chagua Video Kutoka Simu'}</button>
          <input ref={uploadRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => uploadVideo(e.target.files?.[0])} />
          <button onClick={() => { setShowCamera(false); setView('me') }} style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${TEAL}`, background: 'transparent', color: TEAL, fontWeight: 'bold', marginTop: 10 }}>👤 Nenda Profile Yangu</button>
        </div>
      )}

      {showAuth && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, color: '#fff', overflowY: 'auto' }}>
          <h1 style={{ ...VT, fontSize: 28 }}>VIBRA</h1>
          <div style={{ display: 'flex', gap: 10 }}><button onClick={() => setAuthMode('signup')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: authMode === 'signup' ? GBTN : '#333', color: '#fff', fontWeight: 'bold' }}>Sign Up</button><button onClick={() => setAuthMode('login')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: authMode === 'login' ? GBTN : '#333', color: '#fff', fontWeight: 'bold' }}>Login</button></div>
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10, background: '#111', padding: 14, borderRadius: 16, marginTop: 14 }}>
            {authMode === 'signup' && <><label style={{ ...VT, fontSize: 12 }}>👤 Jina</label><input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="MrVibra" style={IN} /></>}
            <label style={{ ...VT, fontSize: 12 }}>📧 Email</label><input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="wewe@gmail.com" style={IN} />
            <label style={{ ...VT, fontSize: 12 }}>🔒 Password</label><input value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="Angalau 4" type="password" style={IN} />
            {authError && <p style={{ color: PINK, fontSize: 11, textAlign: 'center' }}>{authError}</p>}
            <button onClick={authMode === 'signup' ? doSignup : doLogin} style={{ padding: 12, borderRadius: 12, border: 'none', background: GBTN, color: '#fff', fontWeight: 'bold' }}>{authMode === 'signup' ? 'Tengeneza Akaunti 🎉' : 'Ingia 👋'}</button>
            <button onClick={() => setShowAuth(false)} style={{ padding: 10, borderRadius: 12, border: `1px solid ${TEAL}`, background: 'transparent', color: TEAL }}>Funga</button>
          </div>
        </div>
      )}

      {notice && <div style={NS}>{notice}</div>}
      {tikNav('home')}
    </div>
  )
}
