import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraTikTok,
})

const SUPABASE_URL = 'https://svrjacetnlwlwesferwz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc'
const SB_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}
const PINK = '#FE2C55'
const TEAL = '#25F4EE'
const GRADIENT = 'linear-gradient(90deg,#FE2C55,#25F4EE)'

const DEMO_VIDEOS = [
  { id: 'demo1', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Karibu Vibra Worldwide! 🔥 #vibra', creator: 'Vibra Official', creator_email: 'vibra@official.com', likes: 1240 },
  { id: 'demo2', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', caption: 'Dance challenge mpya! 💃', creator: 'Hamadoski', creator_email: 'hamadoski@gmail.com', likes: 856 },
  { id: 'demo3', url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4', caption: 'Mombasa vibes 🌊❤️', creator: 'Mombasa Queen', creator_email: 'queen@mombasa.com', likes: 432 },
  { id: 'demo4', url: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4', caption: 'Nairobi nights 🌃', creator: 'Nairobi Boy', creator_email: 'nairobi@boy.com', likes: 321 },
  { id: 'demo5', url: 'https://test-videos.co.uk/vids/elephantsdream/mp4/h264/720/Elephants_Dream_720_10s_1MB.mp4', caption: 'Funny moments 😂😂', creator: 'Comedy King', creator_email: 'comedy@king.com', likes: 987 },
]

const FILTERS = [
  { name: 'Normal', css: 'none' },
  { name: 'Sepia', css: 'sepia(0.8) contrast(1.1)' },
  { name: 'B&W', css: 'grayscale(1) contrast(1.2)' },
  { name: 'Vintage', css: 'sepia(0.4) brightness(1.1) saturate(1.3)' },
  { name: 'Bright', css: 'brightness(1.4) saturate(1.4)' },
  { name: 'Cool', css: 'hue-rotate(180deg) saturate(1.2)' },
  { name: 'Warm', css: 'sepia(0.2) saturate(1.6) hue-rotate(-15deg)' },
  { name: 'Neon', css: 'contrast(1.4) saturate(2) brightness(1.1)' },
]
const STICKERS = ['😂', '🔥', '❤️', '👑', '🌹', '😍', '💎', '🎉', '⭐', '🦁', '🐱', '😎', '🍕', '⚽']
const EMOJIS = ['😂', '❤️', '🔥', '😍', '👏', '🙏', '😭', '😎', '🎉', '👑', '💯', '😅']

function getS(k, f) {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : f
  } catch {
    return f
  }
}
function setS(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}

function VibraTikTok() {
  const [user, setUser] = useState(() => getS('vibra_user', null))
  const [accounts, setAccounts] = useState(() => getS('vibra_accounts', []))
  const [tab, setTab] = useState('foryou')
  const [idx, setIdx] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const saveToSupabase = async (videoUrlToSave, cap) => {
  try {
    await fetch(SUPABASE_URL + '/rest/v1/vibra_videos', {
      method: 'POST',
      headers: SB_HEADERS,
      body: JSON.stringify({
        video_url: videoUrlToSave,
        caption: cap,
        creator_name: user?.name || 'Mimi',
        user_email: user?.email || 'me@vibra.com',
        likes_count: 0,
      }),
    })
  } catch {}
}
const saveRecordedVideo = () => {
  if (!recordedUrl) return
  const cap = caption.trim() || 'Video niliyorecord na Filter ' + FILTERS[activeFilter].name
  const nc = {
    id: 'my' + Date.now(),
    url: recordedUrl,
    caption: cap,
    creator: user?.name || 'Mimi',
    creator_email: user?.email || 'me@vibra.com',
    likes: 0,
  }
  setClips((p) => [nc, ...p])
  saveToSupabase(recordedUrl, cap)
  try {
    const old = JSON.parse(localStorage.getItem('vibra_my_videos') || '[]')
    localStorage.setItem('vibra_my_videos', JSON.stringify([nc, ...old].slice(0, 20)))
  } catch {}
  setRecordedUrl('')
  setShowCamera(false)
  stopCamera()
  setView('home')
  setTab('foryou')
  setIdx(0)
  alert('Video IMESAVE KWELI! Sasa hata ukitoka na kurudi utaiona!')
}
  const [likedIds, setLikedIds] = useState(() => getS('vibra_liked', []))
  const [globalLikes, setGlobalLikes] = useState(() => getS('vibra_global_likes', {}))
  const [following, setFollowing] = useState(() => getS('vibra_following', []))
  const [savedIds, setSavedIds] = useState(() => getS('vibra_saved', []))
  const [panel, setPanel] = useState('')
  const [view, setView] = useState('home')
  const [showCamera, setShowCamera] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [caption, setCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(() => getS('vibra_comments', {}))
  const [globalComments, setGlobalComments] = useState(() => getS('vibra_global_comments', {}))
  const [notifications, setNotifications] = useState(() => getS('vibra_notifications', []))
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState(() => getS('vibra_coins', 120))
  const [creatorCoins, setCreatorCoins] = useState(() => getS('vibra_creator_coins', 90470))
  const [meTab, setMeTab] = useState('videos')
  const [chatSearch, setChatSearch] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [chatTab, setChatTab] = useState('chats')
  const [recordingVoice, setRecordingVoice] = useState(false)
  const [liveOn, setLiveOn] = useState(false)
  const [liveMsg, setLiveMsg] = useState('')
  const [liveChat, setLiveChat] = useState([{ name: 'Aisha', text: 'Kali sana!' }, { name: 'Juma', text: 'Uko moto!' }])
  const [giftSent, setGiftSent] = useState(0)
  const [liveSaved, setLiveSaved] = useState(() => getS('vibra_live_saved', []))
  const [liveCreators] = useState(['Vibra Official', 'Hamadoski', 'Mombasa Queen'])
  const [battleOn, setBattleOn] = useState(false)
  const [battleScoreMe, setBattleScoreMe] = useState(1250)
  const [battleScoreOpp, setBattleScoreOpp] = useState(980)
  const [battleTime, setBattleTime] = useState(180)
  const [battleOppName, setBattleOppName] = useState('Aisha')
  const [battlePeople] = useState([
    { name: 'Aisha', avatar: 'https://i.pravatar.cc/150?img=47', score: 850, live: true },
    { name: 'Juma', avatar: 'https://i.pravatar.cc/150?img=12', score: 720, live: true },
    { name: 'Neema', avatar: 'https://i.pravatar.cc/150?img=32', score: 640, live: true },
    { name: 'Said', avatar: 'https://i.pravatar.cc/150?img=15', score: 590, live: true },
    { name: 'Pwani', avatar: 'https://i.pravatar.cc/150?img=45', score: 510, live: false },
    { name: 'Zawadi', avatar: 'https://i.pravatar.cc/150?img=44', score: 480, live: true },
    { name: 'Baraka', avatar: 'https://i.pravatar.cc/150?img=13', score: 420, live: true },
    { name: 'Fatma', avatar: 'https://i.pravatar.cc/150?img=25', score: 380, live: true },
  ])
  const [camOn, setCamOn] = useState(false)
  const [activeFilter, setActiveFilter] = useState(0)
  const [activeStickers, setActiveStickers] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState('')
  const [facing, setFacing] = useState('user')
  const [beauty, setBeauty] = useState(0)
  const camVideoRef = useRef(null)
  const camStreamRef = useRef(null)
  const camRecorderRef = useRef(null)
  const camChunksRef = useRef([])
  const timerRef = useRef(null)
  const [liveStreamOn, setLiveStreamOn] = useState(false)
  const [liveRecording, setLiveRecording] = useState(false)
  const liveVideoRef = useRef(null)
  const liveStreamRef = useRef(null)
  const liveRecorderRef = useRef(null)
  const liveChunksRef = useRef([])
  const [chats, setChats] = useState(() =>
    getS('vibra_chats', [
      { id: 'aisha', name: 'Aisha Mkomani', avatar: 'https://i.pravatar.cc/150?img=47', last: 'Video yako kali 🔥', time: '14:02', unread: 2, online: true, msgs: [{ from: 'them', text: 'Sasa! Video yako kali 🔥', time: '14:02', tick: 'seen' }, { from: 'me', text: 'Asante sana! 😍', time: '14:03', tick: 'seen' }] },
      { id: 'juma', name: 'Juma Kilindini', avatar: 'https://i.pravatar.cc/150?img=12', last: 'Tupange collab?', time: '13:10', unread: 1, online: true, msgs: [{ from: 'them', text: 'Tupange collab kesho beach?', time: '13:10', tick: 'seen' }] },
      { id: 'neema', name: 'Mama Neema Nyali', avatar: 'https://i.pravatar.cc/150?img=32', last: 'Asante kwa gift! 🎁', time: '12:00', unread: 0, online: false, msgs: [{ from: 'them', text: 'Asante kwa gift! 🎁', time: '12:00', tick: 'seen' }] },
      { id: 'said', name: 'Said Old Town', avatar: 'https://i.pravatar.cc/150?img=15', last: 'Niko LIVE sasa, ingia!', time: '11:20', unread: 0, online: true, msgs: [{ from: 'them', text: 'Niko LIVE sasa, ingia!', time: '11:20', tick: 'seen' }] },
      { id: 'pwani', name: 'Pwani Crew', avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', last: 'Leo tunashoot beach', time: '10:05', unread: 3, online: false, msgs: [{ from: 'them', text: 'Leo tunashoot beach', time: '10:05', tick: 'delivered' }] },
    ])
  )
  const fileRef = useRef(null)

  useEffect(() => setS('vibra_liked', likedIds), [likedIds])
  useEffect(() => setS('vibra_following', following), [following])
  useEffect(() => setS('vibra_saved', savedIds), [savedIds])
  useEffect(() => setS('vibra_coins', coins), [coins])
  useEffect(() => setS('vibra_creator_coins', creatorCoins), [creatorCoins])
  useEffect(() => setS('vibra_comments', comments), [comments])
  useEffect(() => setS('vibra_global_comments', globalComments), [globalComments])
  useEffect(() => setS('vibra_global_likes', globalLikes), [globalLikes])
  useEffect(() => setS('vibra_notifications', notifications), [notifications])
  useEffect(() => setS('vibra_accounts', accounts), [accounts])
  useEffect(() => setS('vibra_chats', chats), [chats])
  useEffect(() => setS('vibra_live_saved', liveSaved), [liveSaved])
  useEffect(() => {
    if (!user) return
    setS('vibra_user', user)
    setAccounts((p) => {
      const ex = p.find((a) => a.email === user.email)
      return ex ? p : [...p, user]
    })
  }, [user])
  useEffect(() => {
    if (!isRecording) return
    timerRef.current = setInterval(() => setRecordTime((t) => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [isRecording])
  useEffect(() => {
    if (!battleOn) return
    const t = setInterval(() => setBattleTime((x) => (x > 0 ? x - 1 : 180)), 1000)
    return () => clearInterval(t)
  }, [battleOn])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: true })
      camStreamRef.current = stream
      if (camVideoRef.current) {
        camVideoRef.current.srcObject = stream
        camVideoRef.current.play()
      }
      setCamOn(true)
    } catch {
      alert('Ruhusu kamera ili kurecord! Nenda Settings Ruhusu Camera')
    }
  }
  const stopCamera = () => {
    if (camStreamRef.current) camStreamRef.current.getTracks().forEach((t) => t.stop())
    setCamOn(false)
    setIsRecording(false)
  }
  const startRecording = () => {
    if (!camStreamRef.current) {
      alert('Washa kamera kwanza!')
      return
    }
    camChunksRef.current = []
    const rec = new MediaRecorder(camStreamRef.current)
    camRecorderRef.current = rec
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) camChunksRef.current.push(e.data)
    }
    rec.onstop = () => {
      const blob = new Blob(camChunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
      setRecordTime(0)
    }
    rec.start()
    setIsRecording(true)
    setRecordTime(0)
  }
  const stopRecording = () => {
    if (camRecorderRef.current) camRecorderRef.current.stop()
    setIsRecording(false)
  }
  const saveRecordedVideo = () => {
    if (!recordedUrl) return
    const nc = {
      id: 'my' + Date.now(),
      url: recordedUrl,
      caption: caption.trim() || 'Video niliyorecord na Filter ' + FILTERS[activeFilter].name,
      creator: user?.name || 'Mimi',
      creator_email: user?.email || 'me@vibra.com',
      likes: 0,
    }
    setClips((p) => [nc, ...p])
    setRecordedUrl('')
    setShowCamera(false)
    stopCamera()
    setView('home')
    setTab('foryou')
    setIdx(0)
    alert('Video imesave na kupakiwa!')
  }
  const toggleFacing = async () => {
    stopCamera()
    setFacing(facing === 'user' ? 'environment' : 'user')
    setTimeout(() => startCamera(), 300)
  }
  const startLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      liveStreamRef.current = stream
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream
        liveVideoRef.current.play()
      }
      setLiveStreamOn(true)
    } catch {
      alert('Ruhusu kamera ili uende LIVE!')
    }
  }
  const stopLiveCamera = () => {
    if (liveStreamRef.current) liveStreamRef.current.getTracks().forEach((t) => t.stop())
    setLiveStreamOn(false)
  }
  const startLiveRecord = () => {
    if (!liveStreamRef.current) {
      alert('Washa kamera ya LIVE kwanza!')
      return
    }
    liveChunksRef.current = []
    const rec = new MediaRecorder(liveStreamRef.current)
    liveRecorderRef.current = rec
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) liveChunksRef.current.push(e.data)
    }
    rec.onstop = () => {
      const blob = new Blob(liveChunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const saved = { id: 'live' + Date.now(), url, caption: 'LIVE yangu iliyosave - ' + new Date().toLocaleString(), creator: user?.name || 'Mimi', creator_email: user?.email || 'me@vibra.com', likes: 0 }
      setLiveSaved((p) => [saved, ...p])
      setClips((p) => [saved, ...p])
      alert('LIVE IMESAVE KWELI! Ipo kwenye Videos zako sasa!')
    }
    rec.start()
    setLiveRecording(true)
  }
  const stopLiveRecord = () => {
    if (liveRecorderRef.current) liveRecorderRef.current.stop()
    setLiveRecording(false)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(SUPABASE_URL + '/rest/v1/vibra_videos?select=*&order=created_at.desc&limit=50', { headers: SB_HEADERS })
        const j = await r.json()
        if (Array.isArray(j) && j.length > 0) {
          const m = j.map((v, i) => ({
            id: String(v.id || 'sb' + i),
            url: v.video_url || v.url || DEMO_VIDEOS[0].url,
            caption: v.caption || v.title || 'Vibra Video',
            creator: v.creator_name || 'Vibra Creator',
            creator_email: v.user_email || 'creator@vibra.com',
            likes: Number(v.likes_count || v.likes || 0),
          }))
          setClips([...m, ...DEMO_VIDEOS])
        }
      } catch {}
      try {
        const rl = await fetch(SUPABASE_URL + '/rest/v1/vibra_likes?select=*&limit=500', { headers: SB_HEADERS }).then((x) => x.json())
        if (Array.isArray(rl)) {
          const c = {}
          rl.forEach((l) => {
            const vid = String(l.video_id)
            c[vid] = (c[vid] || 0) + 1
          })
          setGlobalLikes((p) => ({ ...p, ...c }))
        }
      } catch {}
      try {
        const rc = await fetch(SUPABASE_URL + '/rest/v1/vibra_comments?select=*&order=created_at.desc&limit=200', { headers: SB_HEADERS }).then((x) => x.json())
        if (Array.isArray(rc)) {
          const gc = {}
          rc.forEach((c) => {
            const vid = String(c.video_id)
            if (!gc[vid]) gc[vid] = []
            gc[vid].push({ name: c.user_name || 'Mtu', text: c.comment_text || c.text || '' })
          })
          setGlobalComments((p) => ({ ...p, ...gc }))
        }
      } catch {}
    }
    load()
  }, [])

  const visibleClips = clips.filter((c) => {
    if (tab === 'following' && user) return following.includes(c.creator_email)
    if (tab === 'following' && !user) return false
    if (search) return (c.caption + c.creator).toLowerCase().includes(search.toLowerCase())
    return true
  })
  const current = visibleClips[idx] || visibleClips[0] || DEMO_VIDEOS[0]
  const safeIdx = visibleClips.indexOf(current)
  const isLiked = current ? likedIds.includes(current.id) : false
  const displayLikes = current ? current.likes + (globalLikes[current.id] || 0) + (isLiked ? 1 : 0) : 0
  const allComments = current ? [...(globalComments[current.id] || []), ...(comments[current.id] || [])] : []
  const isFollowing = current ? following.includes(current.creator_email) : false
  const isSaved = current ? savedIds.includes(current.id) : false
  const unread = notifications.filter((n) => !n.read).length
  const myVideos = [...clips.filter((c) => c.creator_email === user?.email), ...liveSaved.filter((c) => c.creator_email === user?.email)]
  const likedVideos = clips.filter((c) => likedIds.includes(c.id))
  const savedVideos = clips.filter((c) => savedIds.includes(c.id))
  const selectedChat = chats.find((c) => c.id === selectedChatId)

  const pushNotif = (to, type, text, from) => {
    const n = { id: Date.now() + Math.random(), to, type, text, from, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }
    setNotifications((p) => [n, ...p].slice(0, 50))
  }
  const toggleLike = async () => {
    if (!current) return
    const nl = !isLiked
    setLikedIds((p) => (nl ? [...p, current.id] : p.filter((x) => x !== current.id)))
    setGlobalLikes((p) => ({ ...p, [current.id]: Math.max(0, (p[current.id] || 0) + (nl ? 1 : -1)) }))
    if (nl) {
      setCoins((c) => c + 5)
      setCreatorCoins((c) => c + 1)
      if (current.creator_email !== user?.email) pushNotif(current.creator_email, 'like', (user?.name || 'Mtu') + ' amekulike video yako', user?.name || 'Mtu')
    }
    try {
      if (nl) await fetch(SUPABASE_URL + '/rest/v1/vibra_likes', { method: 'POST', headers: SB_HEADERS, body: JSON.stringify({ video_id: current.id, user_email: user?.email || 'guest@vibra.com', user_name: user?.name || 'Guest' }) })
    } catch {}
  }
  const toggleFollow = () => {
    if (!current) return
    if (!user) {
      setShowLogin(true)
      return
    }
    const nf = !isFollowing
    setFollowing((p) => (nf ? [...p, current.creator_email] : p.filter((x) => x !== current.creator_email)))
    if (nf && current.creator_email !== user.email) pushNotif(current.creator_email, 'follow', user.name + ' amekufollow!', user.name)
  }
  const toggleSave = () => {
    if (!current) return
    setSavedIds((p) => (isSaved ? p.filter((x) => x !== current.id) : [...p, current.id]))
  }
  const next = () => {
    if (safeIdx < visibleClips.length - 1) setIdx(safeIdx + 1)
  }
  const prev = () => {
    if (safeIdx > 0) setIdx(safeIdx - 1)
  }
  const handleLogin = () => {
    if (!loginName.trim() || !loginEmail.trim()) {
      alert('Weka jina na email!')
      return
    }
    const u = { name: loginName.trim(), email: loginEmail.trim().toLowerCase(), pass: loginPass }
    setUser(u)
    setShowLogin(false)
    setShowSwitch(false)
    setLoginName('')
    setLoginEmail('')
    setLoginPass('')
    alert('Karibu ' + u.name + '!')
  }
  const handleUpload = () => {
    if (!user) {
      setShowLogin(true)
      return
    }
    if (!videoUrl.trim() && !caption.trim()) {
      alert('Weka link ya video au caption!')
      return
    }
    const nc = { id: 'my' + Date.now(), url: videoUrl.trim() || DEMO_VIDEOS[0].url, caption: caption.trim() || 'Video yangu mpya!', creator: user.name, creator_email: user.email, likes: 0 }
    setClips((p) => [nc, ...p])saveToSupabase(nc.url, nc.caption)
    setCaption('')
    setVideoUrl('')
    setShowCamera(false)
    setTab('foryou')
    setIdx(0)
    setView('home')
    alert('Video imepakiwa!')
  }
  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    const nc = { id: 'my' + Date.now(), url, caption: caption.trim() || f.name, creator: user?.name || 'Mimi', creator_email: user?.email || 'me@vibra.com', likes: 0 }
    setClips((p) => [nc, ...p])saveToSupabase(nc.url, nc.caption)
    setShowCamera(false)
    setTab('foryou')
    setIdx(0)
    setView('home')
    alert('Video imepakiwa kutoka simu!')
  }
  const addComment = () => {
    if (!commentText.trim() || !current) return
    const c = { name: user?.name || 'Mgeni', text: commentText.trim() }
    setComments({ ...comments, [current.id]: [...(comments[current.id] || []), c] })
    setGlobalComments((p) => ({ ...p, [current.id]: [...(p[current.id] || []), c] }))
    setCommentText('')
    if (current.creator_email !== user?.email) pushNotif(current.creator_email, 'comment', c.name + ' amecomment', c.name)
    fetch(SUPABASE_URL + '/rest/v1/vibra_comments', { method: 'POST', headers: SB_HEADERS, body: JSON.stringify({ video_id: current.id, user_email: user?.email || 'guest@vibra.com', user_name: c.name, comment_text: c.text }) }).catch(() => {})
  }
  const shareVideo = () => {
    const t = 'Tazama hii video kwenye Vibra! ' + current?.caption
    if (navigator.share) navigator.share({ title: 'Vibra', text: t }).catch(() => {})
    else {
      navigator.clipboard?.writeText(t)
      alert('Link imecopywa!')
    }
  }
  const sendChatMsg = () => {
    if (!chatInput.trim() || !selectedChatId) return
    const msgText = chatInput.trim()
    setChats((p) =>
      p.map((ch) =>
        ch.id === selectedChatId
          ? { ...ch, last: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), unread: 0, msgs: [...(ch.msgs || []), { from: 'me', text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), tick: 'sent' }] }
          : ch
      )
    )
    setChatInput('')
    setShowEmoji(false)
    setTimeout(() => {
      setChats((p) =>
        p.map((ch) =>
          ch.id === selectedChatId
            ? { ...ch, msgs: ch.msgs.map((m, i) => (i === ch.msgs.length - 1 ? { ...m, tick: 'seen' } : m)) }
            : ch
        )
      )
    }, 1500)
  }
  const sendVoiceNote = () => {
    if (!selectedChatId) return
    setRecordingVoice(true)
    setTimeout(() => {
      setRecordingVoice(false)
      setChats((p) =>
        p.map((ch) =>
          ch.id === selectedChatId
            ? { ...ch, last: 'Voice note (0:07)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msgs: [...(ch.msgs || []), { from: 'me', text: 'Voice note - Bonyeza kucheza (0:07)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), tick: 'sent', isVoice: true }] }
            : ch
        )
      )
      alert('Voice note imetumwa!')
    }, 2000)
  }
  const sendGift = (g) => {
    if (coins < g.cost) {
      alert('Coins hazitoshi! Like video ili upate coins')
      return
    }
    setCoins((c) => c - g.cost)
    setGiftSent((x) => x + g.cost)
    setCreatorCoins((c) => c + g.cost)
    alert('Umetuma ' + g.name + ' ' + g.emoji)
  }
  const addNewChat = () => {
    const name = prompt('Jina la rafiki mpya? (mf: Neema)')
    if (!name) return
    const newChat = { id: 'chat' + Date.now(), name, avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70), last: 'Hey! Karibu Vibra', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), unread: 0, online: true, msgs: [{ from: 'them', text: 'Hey! Karibu Vibra', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), tick: 'seen' }] }
    setChats((p) => [newChat, ...p])
    setSelectedChatId(newChat.id)
    setChatTab('chats')
  }

  if (showSettings) {
    return (
      <div style={{ background: '#fff', color: '#000', minHeight: '100vh', fontFamily: 'system-ui' }}>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 18 }}>Settings and privacy</b>
          <span onClick={() => setShowSettings(false)} style={{ cursor: 'pointer', fontSize: 22 }}>✕</span>
        </div>
        <div style={{ padding: '0 16px 30px' }}>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>ACCOUNT</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #eee' }}>
            <span>Manage account</span>
            <span style={{ background: PINK, color: '#fff', padding: '6px 12px', borderRadius: 15, fontSize: 13, fontWeight: 800 }}>@{user?.name || 'Guest'}</span>
          </div>
          <div onClick={() => { setShowSettings(false); setShowSwitch(true) }} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
            <span>Switch account</span>
            <span style={{ color: '#888' }}>{accounts.length} accounts</span>
          </div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>CONTENT</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Ads</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>App language - Kiswahili</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Display - Dark</div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>CACHE</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Free up space - 240.50 MB</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Offline videos - {savedIds.length} videos</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Media player</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Safaricom data shop</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Data Saver - ON</div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>SUPPORT</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Report a problem</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Help Center</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Safety Center</div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>ABOUT</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Community Guidelines</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>Terms of Service</div>
          <div style={{ padding: '12px 0' }}>Privacy Policy</div>
          <button onClick={() => { if (confirm('Una uhakika unataka kutoka?')) { setUser(null); localStorage.removeItem('vibra_user'); setShowSettings(false) } }} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontWeight: 900, marginTop: 10 }}>Log out</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10 }}>v1.0.0 - Vibra Worldwide - Mombasa</div>
        </div>
      </div>
    )
  }

  if (view === 'chat') {
    return (
      <div style={{ background: '#0b141a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column' }}>
        {!selectedChatId ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ background: '#202c33', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ fontSize: 20 }}>Vibra Chats</b>
                <div style={{ display: 'flex', gap: 16, fontSize: 20 }}>
                  <span onClick={addNewChat} style={{ cursor: 'pointer' }}>💬+</span>
                  <span onClick={() => setView('home')} style={{ cursor: 'pointer' }}>✕</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 14, fontSize: 14, fontWeight: 700 }}>
                <span onClick={() => setChatTab('chats')} style={{ color: chatTab === 'chats' ? '#00a884' : '#8696a0', borderBottom: chatTab === 'chats' ? '2px solid #00a884' : 'none', paddingBottom: 6, cursor: 'pointer' }}>Chats</span>
                <span onClick={() => setChatTab('status')} style={{ color: chatTab === 'status' ? '#00a884' : '#8696a0', borderBottom: chatTab === 'status' ? '2px solid #00a884' : 'none', paddingBottom: 6, cursor: 'pointer' }}>Status</span>
                <span onClick={() => setChatTab('calls')} style={{ color: chatTab === 'calls' ? '#00a884' : '#8696a0', borderBottom: chatTab === 'calls' ? '2px solid #00a884' : 'none', paddingBottom: 6, cursor: 'pointer' }}>Calls</span>
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <input value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} placeholder="Tafuta chat..." style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#202c33', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {chatTab === 'chats' && (
              <div style={{ flex: 1, overflow: 'auto', padding: '0 6px' }}>
                {chats.filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase())).map((c) => (
                  <div key={c.id} onClick={() => { setSelectedChatId(c.id); setChats((p) => p.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x))) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', cursor: 'pointer', borderBottom: '1px solid #1a2a33' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={c.avatar} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                      {c.online && <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#00a884', border: '2px solid #0b141a' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b style={{ fontSize: 16 }}>{c.name}</b>
                        <span style={{ fontSize: 12, color: c.unread > 0 ? '#00a884' : '#8696a0' }}>{c.time}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <span style={{ fontSize: 14, color: '#8696a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</span>
                        {c.unread > 0 && <span style={{ background: '#00a884', color: '#000', fontSize: 12, fontWeight: 800, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{c.unread}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addNewChat} style={{ margin: 16, width: 'calc(100% - 32px)', background: '#00a884', color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontWeight: 800 }}>+ Chat Mpya</button>
              </div>
            )}
            {chatTab === 'status' && (
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                  <span style={{ width: 52, height: 52, borderRadius: '50%', background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>+</span>
                  <div><b>My Status</b><div style={{ fontSize: 13, color: '#8696a0' }}>Bonyeza kuweka status</div></div>
                </div>
                <div style={{ fontSize: 13, color: '#8696a0', marginTop: 10 }}>RECENT UPDATES</div>
                {chats.slice(0, 3).map((c) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                    <img src={c.avatar} style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid #00a884', objectFit: 'cover' }} />
                    <div><b>{c.name}</b><div style={{ fontSize: 13, color: '#8696a0' }}>Leo, {c.time}</div></div>
                  </div>
                ))}
              </div>
            )}
            {chatTab === 'calls' && (
              <div style={{ padding: 16 }}>
                {chats.slice(0, 3).map((c) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #1a2a33' }}>
                    <img src={c.avatar} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}><b>{c.name}</b><div style={{ fontSize: 13, color: '#8696a0' }}>Leo, {c.time}</div></div>
                    <span style={{ fontSize: 20 }}>📞</span>
                    <span style={{ fontSize: 20 }}>📹</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0b141a' }}>
            <div style={{ background: '#202c33', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span onClick={() => setSelectedChatId('')} style={{ cursor: 'pointer', fontSize: 22 }}>←</span>
              <img src={selectedChat.avatar} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <b>{selectedChat.name}</b>
                <div style={{ fontSize: 12, color: selectedChat.online ? '#00a884' : '#8696a0' }}>{selectedChat.online ? 'Online' : 'Last seen leo'}</div>
              </div>
              <span style={{ fontSize: 20 }}>📹</span>
              <span style={{ fontSize: 20 }}>📞</span>
              <span style={{ fontSize: 20 }}>⋮</span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, background: '#0b141a' }}>
              <div style={{ alignSelf: 'center', background: '#182229', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#ffd279' }}>Messages zime-encryptiwa</div>
              {(selectedChat.msgs || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', background: m.from === 'me' ? '#005c4b' : '#202c33', padding: '8px 10px', borderRadius: 12, maxWidth: '80%', fontSize: 15 }}>
                  <div>{m.text}</div>
                  <div style={{ fontSize: 11, color: '#8696a0', textAlign: 'right', marginTop: 2 }}>{m.time} {m.from === 'me' && <span style={{ color: m.tick === 'seen' ? '#53bdeb' : '#8696a0' }}>{m.tick === 'seen' ? '✓✓' : m.tick === 'delivered' ? '✓✓' : '✓'}</span>}</div>
                </div>
              ))}
              {recordingVoice && <div style={{ alignSelf: 'flex-end', background: '#005c4b', padding: '10px 14px', borderRadius: 16 }}>Inarecord...</div>}
            </div>
            {showEmoji && (
              <div style={{ background: '#202c33', padding: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {EMOJIS.map((e) => (
                  <span key={e} onClick={() => setChatInput((p) => p + e)} style={{ fontSize: 26, cursor: 'pointer' }}>{e}</span>
                ))}
              </div>
            )}
            <div style={{ padding: '10px', display: 'flex', gap: 8, alignItems: 'center', background: '#202c33' }}>
              <span onClick={() => setShowEmoji(!showEmoji)} style={{ fontSize: 26, cursor: 'pointer' }}>😊</span>
              <span onClick={() => alert('Chagua picha kutuma!')} style={{ fontSize: 22, cursor: 'pointer' }}>📎</span>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Andika ujumbe..." style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: '#2a3942', color: '#fff', outline: 'none' }} />
              {chatInput.trim() ? (
                <button onClick={sendChatMsg} style={{ background: '#00a884', color: '#fff', border: 'none', width: 44, height: 44, borderRadius: '50%', fontSize: 20 }}>➤</button>
              ) : (
                <button onClick={sendVoiceNote} style={{ background: '#00a884', color: '#fff', border: 'none', width: 44, height: 44, borderRadius: '50%', fontSize: 20 }}>🎤</button>
              )}
              <span style={{ fontSize: 22 }}>📷</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view === 'me') {
    const listToShow = meTab === 'videos' ? myVideos : meTab === 'liked' ? likedVideos : savedVideos
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', paddingBottom: 80 }}>
        <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span onClick={() => setView('home')} style={{ cursor: 'pointer', fontSize: 20 }}>←</span>
          <b>@{user?.name || 'Mgeni'}</b>
          <span onClick={() => setShowSettings(true)} style={{ cursor: 'pointer', fontSize: 22 }}>☰</span>
        </div>
        <div style={{ textAlign: 'center', padding: '10px 16px' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: GRADIENT, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900 }}>{(user?.name || 'V')[0].toUpperCase()}</div>
          <div style={{ fontWeight: 900, fontSize: 20, marginTop: 8 }}>@{user?.name || 'Mgeni'}</div>
          <div style={{ opacity: 0.6, fontSize: 13 }}>{user?.email || 'Ingia ili uone profile'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
            <span><b>{following.length}</b><br /><span style={{ fontSize: 12, opacity: 0.6 }}>Following</span></span>
            <span><b>85</b><br /><span style={{ fontSize: 12, opacity: 0.6 }}>Followers</span></span>
            <span><b>{coins}</b><br /><span style={{ fontSize: 12, opacity: 0.6 }}>Coins</span></span>
          </div>
          {!user ? (
            <button onClick={() => setShowLogin(true)} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 800, marginTop: 14 }}>Ingia Sasa</button>
          ) : (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
              <button onClick={() => setShowSwitch(true)} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 800 }}>Switch Account</button>
              <button onClick={() => setShowSettings(true)} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 800 }}>Settings</button>
            </div>
          )}
        </div>
        <div style={{ margin: 14, background: 'linear-gradient(90deg,#FE2C55,#FF6B9D)', borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Creator Fund</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{creatorCoins.toLocaleString()} / 1,000,000</div>
          <div style={{ background: 'rgba(255,255,255,0.3)', height: 8, borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: Math.min(100, creatorCoins / 10000) + '%', background: '#fff', height: '100%' }} />
          </div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Like na Gifts zinaongeza Fund yako!</div>
        </div>
        <div onClick={() => alert('Tangaza Biashara - Tsh 10,000 / wiki!')} style={{ margin: '0 14px', background: '#1a1a1a', borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div><div style={{ fontWeight: 900 }}>Tangaza Biashara</div><div style={{ fontSize: 12, opacity: 0.6 }}>Tsh 10,000 / wiki - Watu 50K+ wanaona</div></div>
          <span style={{ background: PINK, padding: '8px 14px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>Tangaza</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 18, borderBottom: '1px solid #222' }}>
          <span onClick={() => setMeTab('videos')} style={{ padding: '10px 0', fontWeight: 800, borderBottom: meTab === 'videos' ? '2px solid ' + PINK : 'none', cursor: 'pointer' }}>Videos ({myVideos.length})</span>
          <span onClick={() => setMeTab('liked')} style={{ padding: '10px 0', fontWeight: 800, borderBottom: meTab === 'liked' ? '2px solid ' + PINK : 'none', cursor: 'pointer' }}>Liked ({likedVideos.length})</span>
          <span onClick={() => setMeTab('saved')} style={{ padding: '10px 0', fontWeight: 800, borderBottom: meTab === 'saved' ? '2px solid ' + PINK : 'none', cursor: 'pointer' }}>Saved ({savedVideos.length})</span>
        </div>
        <div style={{ padding: '8px 14px', fontSize: 13, color: '#00a884' }}>LIVE zilizosave: {liveSaved.length} - Ziko hapa kwenye Videos!</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, padding: 2 }}>
          {listToShow.map((v) => (
            <div key={v.id} style={{ position: 'relative', aspectRatio: '9/16', background: '#222' }}>
              <video src={v.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 12 }}>❤️ {v.likes}</div>
            </div>
          ))}
          {listToShow.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 30, opacity: 0.6 }}>Hakuna video hapa bado</div>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'linear-gradient(180deg, rgba(0,0,0,0.85), transparent)' }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>VIBRA<span style={{ color: PINK }}>●</span></div>
        <div style={{ display: 'flex', gap: 18, fontWeight: 700, fontSize: 15 }}>
          <span onClick={() => { setTab('following'); setIdx(0) }} style={{ cursor: 'pointer', opacity: tab === 'following' ? 1 : 0.6, borderBottom: tab === 'following' ? '2px solid ' + PINK : 'none' }}>Following</span>
          <span onClick={() => { setTab('foryou'); setIdx(0) }} style={{ cursor: 'pointer', opacity: tab === 'foryou' ? 1 : 0.6, borderBottom: tab === 'foryou' ? '2px solid ' + PINK : 'none' }}>For You</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ background: '#222', padding: '5px 10px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>🪙 {coins}</span>
          <span onClick={() => { setPanel(panel === 'notifications' ? '' : 'notifications'); setNotifications((p) => p.map((n) => ({ ...n, read: true }))) }} style={{ position: 'relative', fontSize: 22, cursor: 'pointer' }}>
            🔔{unread > 0 && <span style={{ position: 'absolute', top: -4, right: -6, background: PINK, fontSize: 10, minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{unread > 9 ? '9+' : unread}</span>}
          </span>
          <span onClick={() => setPanel(panel === 'search' ? '' : 'search')} style={{ fontSize: 20, cursor: 'pointer' }}>🔍</span>
          {user ? (
            <span onClick={() => setView('me')} style={{ width: 32, height: 32, borderRadius: '50%', background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' }}>{user.name[0].toUpperCase()}</span>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ background: PINK, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 800 }}>Ingia</button>
          )}
        </div>
      </div>

      {panel === 'search' && (
        <div style={{ position: 'fixed', top: 60, left: 12, right: 12, zIndex: 60, background: '#1a1a1a', padding: 12, borderRadius: 14 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tafuta video au creator..." style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#333', color: '#fff', outline: 'none' }} />
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Video: {visibleClips.length} - Likes za wote zinaonekana!</div>
        </div>
      )}
      {panel === 'notifications' && (
        <div style={{ position: 'fixed', top: 60, left: 12, right: 12, zIndex: 70, background: '#1a1a1a', borderRadius: 16, padding: 16, maxHeight: '60vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Notifications ({notifications.length})</b><span onClick={() => setPanel('')} style={{ cursor: 'pointer', fontSize: 20 }}>✕</span></div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.length === 0 && <div style={{ opacity: 0.6, fontSize: 13, textAlign: 'center', padding: 20 }}>Hakuna notification bado.<br />Ukilike-wa itaonekana hapa!</div>}
            {notifications.map((n) => (
              <div key={n.id} style={{ background: '#222', padding: 12, borderRadius: 12 }}><div>{n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'follow' ? '👥' : '📢'} <b>{n.from}</b></div><div style={{ fontSize: 14, marginTop: 3 }}>{n.text}</div><div style={{ fontSize: 11, opacity: 0.5 }}>{n.time || ''}</div></div>
            ))}
          </div>
          {notifications.length > 0 && <button onClick={() => setNotifications([])} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', padding: 10, borderRadius: 10, marginTop: 12 }}>Futa Zote</button>}
        </div>
      )}

      {tab === 'following' && !user ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>👥</div>
          <div style={{ fontWeight: 900, fontSize: 20, marginTop: 10 }}>Ingia ili uone Following</div>
          <button onClick={() => setShowLogin(true)} style={{ marginTop: 16, background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 800 }}>Ingia Sasa</button>
        </div>
      ) : tab === 'following' && visibleClips.length === 0 ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>😔</div>
          <div style={{ fontWeight: 900, fontSize: 20, marginTop: 10 }}>Bado haujafollow mtu</div>
          <button onClick={() => { setTab('foryou'); setIdx(0) }} style={{ marginTop: 16, background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 800 }}>Nenda For You</button>
        </div>
      ) : (
        <div style={{ height: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
          <video key={current.id} src={current.url} autoPlay loop muted={!soundEnabled} playsInline onClick={(e) => (e.target.paused ? e.target.play() : e.target.pause())} style={{ width: '100vw', height: '100vh', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
          {liveCreators.includes(current.creator) && (
            <div style={{ position: 'absolute', top: 70, left: 12, background: '#FF0000', padding: '6px 12px', borderRadius: 20, fontWeight: 900, fontSize: 13, zIndex: 30 }}>
              LIVE • Wanaangalia 342
            </div>
          )}
          {liveCreators.includes(current.creator) && (
            <div style={{ position: 'absolute', top: 105, left: 12, background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 20, fontSize: 12, zIndex: 30 }}>
              Video hii inaongezeka • {displayLikes} likes
            </div>
          )}
          <div onClick={() => setSoundEnabled(!soundEnabled)} style={{ position: 'absolute', top: 70, right: 16, background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: 20, cursor: 'pointer', zIndex: 30 }}>🔊 {soundEnabled ? 'ON' : 'OFF'}</div>
          <div style={{ position: 'absolute', right: 12, bottom: 130, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', zIndex: 20 }}>
            <div style={{ position: 'relative' }}>
              <div onClick={toggleFollow} style={{ width: 52, height: 52, borderRadius: '50%', background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, cursor: 'pointer', border: '2px solid #fff' }}>{current.creator[0].toUpperCase()}</div>
              <div onClick={toggleFollow} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: isFollowing ? '#fff' : PINK, color: isFollowing ? PINK : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, cursor: 'pointer' }}>{isFollowing ? '✓' : '+'}</div>
            </div>
            <div onClick={toggleLike} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 32 }}>{isLiked ? '❤️' : '🤍'}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{displayLikes >= 1000 ? (displayLikes / 1000).toFixed(1) + 'K' : displayLikes}</div><div style={{ fontSize: 10, opacity: 0.6 }}>Wote</div></div>
            <div onClick={() => setPanel(panel === 'comments' ? '' : 'comments')} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>💬</div><div style={{ fontWeight: 800, fontSize: 13 }}>{allComments.length}</div><div style={{ fontSize: 10, opacity: 0.6 }}>Wote</div></div>
            <div onClick={toggleSave} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>{isSaved ? '🔖' : '📌'}</div><div style={{ fontSize: 12 }}>{isSaved ? 'Saved' : 'Save'}</div></div>
            <div onClick={shareVideo} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 30 }}>↗️</div><div style={{ fontSize: 12 }}>Share</div></div>
            <div onClick={() => setPanel(panel === 'gifts' ? '' : 'gifts')} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: 28 }}>🎁</div><div style={{ fontSize: 12 }}>Gift</div></div>
          </div>
          <div style={{ position: 'absolute', left: 12, right: 70, bottom: 110, zIndex: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 17 }}>@{current.creator}</div>
            <div style={{ marginTop: 4, fontSize: 14 }}>{current.caption}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={toggleFollow} style={{ background: isFollowing ? '#fff' : PINK, color: isFollowing ? '#000' : '#fff', border: 'none', padding: '7px 16px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>{isFollowing ? 'Following ✓' : 'Follow'}</button>
              <button onClick={() => setPanel('comments')} style={{ background: '#222', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13 }}>Comments ({allComments.length})</button>
              <button onClick={() => setLiveOn(true)} style={{ background: '#FF0000', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>LIVE</button>
              <button onClick={() => setBattleOn(true)} style={{ background: '#FFD700', color: '#000', border: 'none', padding: '7px 14px', borderRadius: 20, fontWeight: 900, fontSize: 13 }}>BATTLE 8</button>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>{safeIdx + 1} / {visibleClips.length} - FULL SCREEN</div>
          </div>
          <div style={{ position: 'absolute', right: 12, bottom: 260, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 20 }}>
            <button onClick={prev} disabled={safeIdx === 0} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 18, opacity: safeIdx === 0 ? 0.3 : 1 }}>↑</button>
            <button onClick={next} disabled={safeIdx >= visibleClips.length - 1} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 18, opacity: safeIdx >= visibleClips.length - 1 ? 0.3 : 1 }}>↓</button>
          </div>
        </div>
      )}

      {panel === 'comments' && (
        <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, zIndex: 70, background: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '50vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Comments za Wote ({allComments.length})</b><span onClick={() => setPanel('')} style={{ cursor: 'pointer', fontSize: 20 }}>✕</span></div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allComments.length === 0 && <div style={{ opacity: 0.6, fontSize: 13 }}>Hakuna comment bado - Kuwa wa kwanza!</div>}
            {allComments.map((c, i) => (
              <div key={i} style={{ background: '#222', padding: '10px 12px', borderRadius: 12 }}><b style={{ fontSize: 13 }}>{c.name}</b><div style={{ fontSize: 14, marginTop: 2 }}>{c.text}</div></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Andika comment - wote wataiona..." style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: '#333', color: '#fff', outline: 'none' }} />
            <button onClick={addComment} style={{ background: PINK, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 800 }}>Tuma</button>
          </div>
        </div>
      )}
      {panel === 'gifts' && (
        <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, zIndex: 70, background: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Tuma Gift kwa @{current.creator}</b><span onClick={() => setPanel('')} style={{ cursor: 'pointer', fontSize: 20 }}>✕</span></div>
          <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>Coins zako: {coins} - Umetuma: {giftSent}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            {[{ emoji: '🌹', name: 'Rose', cost: 1 }, { emoji: '❤️', name: 'Heart', cost: 5 }, { emoji: '🔥', name: 'Fire', cost: 10 }, { emoji: '💎', name: 'Diamond', cost: 50 }, { emoji: '👑', name: 'Crown', cost: 100 }].map((g) => (
              <button key={g.name} onClick={() => sendGift(g)} style={{ background: '#222', color: '#fff', border: 'none', padding: '12px 14px', borderRadius: 14, cursor: 'pointer' }}><div style={{ fontSize: 24 }}>{g.emoji}</div><div style={{ fontSize: 12, fontWeight: 800 }}>{g.name}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{g.cost}</div></button>
            ))}
          </div>
        </div>
      )}

      {battleOn && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 95, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b style={{ fontSize: 18 }}>BATTLE LIVE - {Math.floor(battleTime / 60)}:{String(battleTime % 60).padStart(2, '0')}</b>
            <span onClick={() => setBattleOn(false)} style={{ cursor: 'pointer', fontSize: 22 }}>✕</span>
          </div>
          <div style={{ padding: '0 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontWeight: 900 }}>MIMI {battleScoreMe}</span>
            <div style={{ flex: 1, height: 12, background: '#333', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: (battleScoreMe / (battleScoreMe + battleScoreOpp) * 100) + '%', background: PINK }} />
              <div style={{ flex: 1, background: TEAL }} />
            </div>
            <span style={{ fontWeight: 900 }}>{battleScoreOpp} OPP</span>
          </div>
          <div style={{ display: 'flex', flex: 1, gap: 8, padding: 12 }}>
            <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textAlign: 'center', color: '#aaa' }}>WATU 8 KUSHOTO</div>
              {battlePeople.map((p) => (
                <div key={p.name} onClick={() => { setBattleScoreOpp(p.score); setBattleOppName(p.name); alert('Sasa unabattle na ' + p.name + '!') }} style={{ background: '#1a1a1a', borderRadius: 12, padding: 8, textAlign: 'center', cursor: 'pointer', border: p.live ? '2px solid #FF0000' : 'none' }}>
                  <img src={p.avatar} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ fontSize: 11, fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#00C853' }}>{p.live ? 'LIVE' : 'Offline'}</div>
                  <div style={{ fontSize: 11 }}>{p.score}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ flex: 1, background: GRADIENT, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 50 }}>👤</div>
                <b>MIMI - @{user?.name || 'Mgeni'}</b>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{battleScoreMe}</div>
                <div style={{ fontSize: 12 }}>{battleScoreMe > battleScoreOpp ? 'UNAONGOZA!' : 'PIGANA!'}</div>
              </div>
              <div style={{ flex: 1, background: '#222', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 50 }}>⚔️</div>
                <b>VS - {battleOppName}</b>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{battleScoreOpp}</div>
                <button onClick={() => { setBattleScoreMe((s) => s + 50); setCoins((c) => c + 10) }} style={{ background: PINK, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 20, fontWeight: 900, marginTop: 8 }}>NIPIGIE KURA +50</button>
              </div>
            </div>
          </div>
          <div style={{ padding: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => { setBattleScoreMe((s) => s + 10); alert('Umetuma Rose!') }} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 12 }}>Rose</button>
            <button onClick={() => { setBattleScoreMe((s) => s + 50); alert('Umetuma Diamond!') }} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 12 }}>Diamond</button>
            <button onClick={() => { setBattleScoreMe((s) => s + 100); alert('Umetuma Crown!') }} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 12 }}>Crown</button>
          </div>
        </div>
      )}

      {liveOn && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 90, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ background: '#FF0000', padding: '6px 12px', borderRadius: 20, fontWeight: 900, fontSize: 13 }}>LIVE {liveRecording ? 'REC' : ''}</span>
            <span onClick={() => { stopLiveCamera(); setLiveOn(false) }} style={{ cursor: 'pointer', fontSize: 22 }}>✕</span>
          </div>
          <div style={{ flex: 1, position: 'relative', background: '#111', overflow: 'hidden' }}>
            {liveStreamOn ? (
              <video ref={liveVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 60 }}>📹</div>
                <div style={{ fontWeight: 900, fontSize: 18, marginTop: 10 }}>Uko tayari kwenda LIVE?</div>
                <div style={{ opacity: 0.6, fontSize: 13, marginTop: 6 }}>Bonyeza Washa Kamera - Uso wako utaonekana LIVE kweli!</div>
                <button onClick={startLiveCamera} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 900, marginTop: 14 }}>WASHA KAMERA YA LIVE</button>
              </div>
            )}
            {liveStreamOn && (
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', gap: 8 }}>
                {!liveRecording ? (
                  <button onClick={startLiveRecord} style={{ flex: 1, background: '#FF0000', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 900 }}>ANZA KURECORD LIVE - ITASAVE KWELI!</button>
                ) : (
                  <button onClick={stopLiveRecord} style={{ flex: 1, background: '#00C853', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 900 }}>MALIZA NA SAVE LIVE</button>
                )}
              </div>
            )}
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: '#00a884' }}>LIVE zilizosave: {liveSaved.length} - Zitaonekana kwenye Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, maxHeight: 100, overflow: 'auto' }}>
              {liveChat.map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: 12, fontSize: 13 }}><b>{m.name}:</b> {m.text}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input value={liveMsg} onChange={(e) => setLiveMsg(e.target.value)} placeholder="Chat LIVE..." style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: '#222', color: '#fff', outline: 'none' }} />
              <button onClick={() => { if (!liveMsg.trim()) return; setLiveChat((p) => [...p, { name: user?.name || 'Mimi', text: liveMsg }]); setLiveMsg('') }} style={{ background: PINK, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 20, fontWeight: 800 }}>Tuma</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 14px' }}>
        <span onClick={() => { setView('home'); setTab('foryou'); setIdx(0); setPanel('') }} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>🏠</div>Home</span>
        <span onClick={() => setPanel(panel === 'search' ? '' : 'search')} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>🔍</div>Discover</span>
        <span onClick={() => { if (!user) setShowLogin(true); else setShowCamera(true) }} style={{ width: 48, height: 32, background: GRADIENT, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer' }}>+</span>
        <span onClick={() => setView('chat')} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>💬</div>Chat</span>
        <span onClick={() => { if (!user) setShowLogin(true); else setView('me') }} style={{ textAlign: 'center', cursor: 'pointer', fontSize: 12 }}><div style={{ fontSize: 22 }}>👤</div>Me</span>
      </div>

      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 20, width: '100%', maxWidth: 360 }}>
            <div style={{ fontWeight: 900, fontSize: 22, textAlign: 'center' }}>Ingia Vibra 🔥</div>
            <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Jina lako" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 16, outline: 'none', boxSizing: 'border-box' }} />
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 10, outline: 'none', boxSizing: 'border-box' }} />
            <input value={loginPass} onChange={(e) => setLoginPass(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#333', color: '#fff', marginTop: 10, outline: 'none', boxSizing: 'border-box' }} />
            <button onClick={handleLogin} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontWeight: 900, marginTop: 14 }}>INGIA</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', background: 'transparent', color: '#aaa', border: 'none', padding: 10, marginTop: 6 }}>Ghairi</button>
          </div>
        </div>
      )}
      {showSwitch && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1a1a1a', padding: 22, borderRadius: 20, width: '100%', maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ fontSize: 19 }}>Switch Account</b><span onClick={() => setShowSwitch(false)} style={{ cursor: 'pointer', fontSize: 20 }}>✕</span></div>
            <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>Chagua akaunti</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {accounts.length === 0 && <div style={{ opacity: 0.6, fontSize: 13 }}>Hakuna akaunti nyingine - Ongeza mpya chini!</div>}
              {accounts.map((a) => (
                <div key={a.email} onClick={() => { setUser(a); setS('vibra_user', a); setShowSwitch(false); alert('Ume-switch kwenda @' + a.name) }} style={{ display: 'flex', alignItems: 'center', gap: 12, background: user?.email === a.email ? '#333' : '#222', padding: 12, borderRadius: 12, cursor: 'pointer', border: user?.email === a.email ? '2px solid ' + PINK : 'none' }}>
                  <span style={{ width: 38, height: 38, borderRadius: '50%', background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{a.name[0].toUpperCase()}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 800 }}>{a.name} {user?.email === a.email && <span style={{ fontSize: 11, color: TEAL }}>Active</span>}</div><div style={{ fontSize: 12, opacity: 0.6 }}>{a.email}</div></div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #333', marginTop: 14, paddingTop: 14 }}>
              <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Jina la akaunti mpya" style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#333', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email ya akaunti mpya" style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#333', color: '#fff', marginTop: 8, outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleLogin} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontWeight: 900, marginTop: 10 }}>+ ONGEZA NA SWITCH</button>
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
            <span onClick={() => { stopCamera(); setShowCamera(false) }} style={{ cursor: 'pointer', fontSize: 22 }}>✕</span>
            <b>Record Video - Kama TikTok</b>
            <span onClick={toggleFacing} style={{ cursor: 'pointer', fontSize: 22 }}>🔄</span>
          </div>
          <div style={{ flex: 1, position: 'relative', background: '#111', overflow: 'hidden' }}>
            {camOn ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <video ref={camVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: FILTERS[activeFilter].css }} />
                {activeStickers.map((s, i) => (
                  <span key={i} onClick={() => setActiveStickers((p) => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 20 + i * 50, left: 20 + (i % 3) * 60, fontSize: 48, cursor: 'pointer' }}>{s}</span>
                ))}
                {isRecording && <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: '#FF0000', padding: '6px 14px', borderRadius: 20, fontWeight: 900, fontSize: 13 }}>REC {Math.floor(recordTime / 60)}:{String(recordTime % 60).padStart(2, '0')}</div>}
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 60 }}>📷</div>
                <div style={{ fontWeight: 900, fontSize: 18, marginTop: 10 }}>Record Video Yako!</div>
                <div style={{ opacity: 0.6, fontSize: 13, marginTop: 6 }}>Kamera yako ya kweli itafunguka hapa - Chagua Filter na Sticker!</div>
                <button onClick={startCamera} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 25, fontWeight: 900, marginTop: 14 }}>WASHA KAMERA</button>
                <div style={{ marginTop: 14, width: '100%' }}>
                  <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Au weka link ya video..." style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: '#222', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Andika caption... #vibra" style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: '#222', color: '#fff', marginTop: 8, outline: 'none', minHeight: 60, boxSizing: 'border-box' }} />
                  <button onClick={handleUpload} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 900, marginTop: 8 }}>PAKIA KWA LINK</button>
                  <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
                  <button onClick={() => fileRef.current?.click()} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 800, marginTop: 8 }}>Chagua Video Kutoka Simu</button>
                </div>
              </div>
            )}
            {recordedUrl && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ fontWeight: 900 }}>Video Imerecordiwa!</div>
                <video src={recordedUrl} controls autoPlay loop style={{ width: '100%', maxHeight: 300, marginTop: 12, borderRadius: 12, objectFit: 'cover', filter: FILTERS[activeFilter].css }} />
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Andika caption..." style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: '#222', color: '#fff', marginTop: 12, outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={saveRecordedVideo} style={{ width: '100%', background: PINK, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontWeight: 900, marginTop: 10 }}>SAVE NA PAKIA VIDEO</button>
                <button onClick={() => { setRecordedUrl(''); startCamera() }} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', padding: 12, borderRadius: 12, marginTop: 8 }}>Record Tena</button>
              </div>
            )}
          </div>
          {camOn && (
            <div style={{ background: '#000', padding: '10px 12px 16px' }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                {FILTERS.map((f, i) => (
                  <button key={f.name} onClick={() => setActiveFilter(i)} style={{ background: activeFilter === i ? PINK : '#222', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontWeight: 800, fontSize: 13 }}>{f.name}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                {STICKERS.map((s) => (
                  <span key={s} onClick={() => setActiveStickers((p) => [...p, s])} style={{ fontSize: 28, cursor: 'pointer', background: '#222', padding: '6px 8px', borderRadius: 12 }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13 }}>Beauty</span>
                <input type="range" min="0" max="50" value={beauty} onChange={(e) => setBeauty(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontSize: 13 }}>{beauty}%</span>
                <button onClick={() => setActiveStickers([])} style={{ background: '#222', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 10, fontSize: 12 }}>Futa Stickers</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                {!isRecording ? (
                  <button onClick={startRecording} style={{ width: 72, height: 72, borderRadius: '50%', background: '#FF0000', border: '4px solid #fff', fontSize: 28, cursor: 'pointer' }}>●</button>
                ) : (
                  <button onClick={stopRecording} style={{ width: 72, height: 72, borderRadius: 12, background: '#FF0000', border: '4px solid #fff', fontSize: 20, cursor: 'pointer' }}>⏹️</button>
                )}
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.6, marginTop: 6 }}>Bonyeza Sticker kuweka - Bonyeza Filter kubadilisha</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
