// @ts-nocheck
import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide' }] }),
  component: VibraTikTok,
})

const SUPABASE_URL = 'https://svrjacetnlwlwesferwz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc'
const SB_HEADERS: any = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}
const PINK = '#FE2C55'
const TEAL = '#25F4EE'
const GRADIENT = 'linear-gradient(90deg,#FE2C55,#25F4EE)'

type Clip = {
  id: string
  url: string
  caption: string
  creator: string
  creator_email: string
  likes: number
}

const DEMO_VIDEOS: Clip[] = [
  {
    id: 'demo1',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    caption: 'Karibu Vibra Worldwide! 🔥 #vibra',
    creator: 'Vibra Official',
    creator_email: 'vibra@official.com',
    likes: 1240,
  },
  {
    id: 'demo2',
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    caption: 'Dance challenge mpya! 💃',
    creator: 'Hamadoski',
    creator_email: 'hamadoski@gmail.com',
    likes: 856,
  },
  {
    id: 'demo3',
    url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
    caption: 'Mombasa vibes 🌊❤️',
    creator: 'Mombasa Queen',
    creator_email: 'queen@mombasa.com',
    likes: 432,
  },
  {
    id: 'demo4',
    url: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
    caption: 'Nairobi nights 🌃',
    creator: 'Nairobi Boy',
    creator_email: 'nairobi@boy.com',
    likes: 321,
  },
  {
    id: 'demo5',
    url: 'https://test-videos.co.uk/vids/elephantsdream/mp4/h264/720/Elephants_Dream_720_10s_1MB.mp4',
    caption: 'Funny moments 😂😂',
    creator: 'Comedy King',
    creator_email: 'comedy@king.com',
    likes: 987,
  },
]

function getS(k: string, f: any) {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : f
  } catch {
    return f
  }
}
function setS(k: string, v: any) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}

function VibraTikTok() {
  const hydrated = useHydrated()
  const [user, setUser] = useState<any>(() => getS('vibra_user', null))
  const [accounts, setAccounts] = useState<any[]>(() => getS('vibra_accounts', []))
  const [tab, setTab] = useState('foryou')
  const [idx, setIdx] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [clips, setClips] = useState<Clip[]>(DEMO_VIDEOS)
  const [likedIds, setLikedIds] = useState<string[]>(() => getS('vibra_liked', []))
  const [globalLikes, setGlobalLikes] = useState<any>(() => getS('vibra_global_likes', {}))
  const [following, setFollowing] = useState<string[]>(() => getS('vibra_following', []))
  const [savedIds, setSavedIds] = useState<string[]>(() => getS('vibra_saved', []))
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
  const [comments, setComments] = useState<any>(() => getS('vibra_comments', {}))
  const [globalComments, setGlobalComments] = useState<any>(() => getS('vibra_global_comments', {}))
  const [notifications, setNotifications] = useState<any[]>(() => getS('vibra_notifications', []))
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState(() => getS('vibra_coins', 120))
  const [creatorCoins, setCreatorCoins] = useState(() => getS('vibra_creator_coins', 90470))
  const [meTab, setMeTab] = useState('videos')
  const [chatSearch, setChatSearch] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [liveOn, setLiveOn] = useState(false)
  const [liveMsg, setLiveMsg] = useState('')
  const [liveChat, setLiveChat] = useState<any[]>([
    { name: 'Aisha', text: 'Kali sana!' },
    { name: 'Juma', text: 'Uko moto!' },
  ])
  const [giftSent, setGiftSent] = useState(0)
  const [chats, setChats] = useState<any[]>(() =>
    getS('vibra_chats', [
      {
        id: 'aisha',
        name: 'Aisha Mkomani',
        avatar: 'https://i.pravatar.cc/150?img=47',
        last: 'Video yako kali',
        msgs: [{ from: 'them', text: 'Video yako kali', time: '14:02' }],
      },
      {
        id: 'juma',
        name: 'Juma Kilindini',
        avatar: 'https://i.pravatar.cc/150?img=12',
        last: 'Tupange collab?',
        msgs: [{ from: 'them', text: 'Tupange collab?', time: '13:10' }],
      },
      {
        id: 'neema',
        name: 'Mama Neema',
        avatar: 'https://i.pravatar.cc/150?img=32',
        last: 'Asante kwa gift!',
        msgs: [{ from: 'them', text: 'Asante kwa gift!', time: '12:00' }],
      },
    ])
  )
  const fileRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (!user) return
    setS('vibra_user', user)
    setAccounts((p: any) => {
      const ex = p.find((a: any) => a.email === user.email)
      return ex ? p : [...p, user]
    })
  }, [user])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(
          SUPABASE_URL + '/rest/v1/vibra_videos?select=*&order=created_at.desc&limit=50',
          { headers: SB_HEADERS }
        )
        const j = await r.json()
        if (Array.isArray(j) && j.length > 0) {
          const m: Clip[] = j.map((v: any, i: number) => ({
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
        const rl = await fetch(SUPABASE_URL + '/rest/v1/vibra_likes?select=*&limit=500', {
          headers: SB_HEADERS,
        }).then((x) => x.json())
        if (Array.isArray(rl)) {
          const c: any = {}
          rl.forEach((l: any) => {
            const vid = String(l.video_id)
            c[vid] = (c[vid] || 0) + 1
          })
          setGlobalLikes((p: any) => ({ ...p, ...c }))
        }
      } catch {}
      try {
        const rc = await fetch(
          SUPABASE_URL + '/rest/v1/vibra_comments?select=*&order=created_at.desc&limit=200',
          { headers: SB_HEADERS }
        ).then((x) => x.json())
        if (Array.isArray(rc)) {
          const gc: any = {}
          rc.forEach((c: any) => {
            const vid = String(c.video_id)
            if (!gc[vid]) gc[vid] = []
            gc[vid].push({
              name: c.user_name || 'Mtu',
              text: c.comment_text || c.text || '',
            })
          })
          setGlobalComments((p: any) => ({ ...p, ...gc }))
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
  const allComments = current
    ? [...(globalComments[current.id] || []), ...(comments[current.id] || [])]
    : []
  const isFollowing = current ? following.includes(current.creator_email) : false
  const isSaved = current ? savedIds.includes(current.id) : false
  const unread = notifications.filter((n: any) => !n.read).length
  const myVideos = clips.filter((c) => c.creator_email === user?.email)
  const likedVideos = clips.filter((c) => likedIds.includes(c.id))
  const savedVideos = clips.filter((c) => savedIds.includes(c.id))
  const selectedChat = chats.find((c) => c.id === selectedChatId)

  const pushNotif = (to: string, type: string, text: string, from: string) => {
    const n = {
      id: Date.now() + Math.random(),
      to,
      type,
      text,
      from,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }
    setNotifications((p: any) => [n, ...p].slice(0, 50))
  }

  const toggleLike = async () => {
    if (!current) return
    const nl = !isLiked
    setLikedIds((p) => (nl ? [...p, current.id] : p.filter((x) => x !== current.id)))
    setGlobalLikes((p: any) => ({
      ...p,
      [current.id]: Math.max(0, (p[current.id] || 0) + (nl ? 1 : -1)),
    }))
    if (nl) {
      setCoins((c: number) => c + 5)
      setCreatorCoins((c: number) => c + 1)
      if (current.creator_email !== user?.email) {
        pushNotif(
          current.creator_email,
          'like',
          (user?.name || 'Mtu') + ' amekulike video yako',
          user?.name || 'Mtu'
        )
      }
    }
    try {
      if (nl) {
        await fetch(SUPABASE_URL + '/rest/v1/vibra_likes', {
          method: 'POST',
          headers: SB_HEADERS,
          body: JSON.stringify({
            video_id: current.id,
            user_email: user?.email || 'guest@vibra.com',
            user_name: user?.name || 'Guest',
          }),
        })
      }
    } catch {}
  }

  const toggleFollow = async () => {
    if (!current) return
    if (!user) {
      setShowLogin(true)
      return
    }
    const nf = !isFollowing
    setFollowing((p) =>
      nf ? [...p, current.creator_email] : p.filter((x) => x !== current.creator_email)
    )
    if (nf && current.creator_email !== user.email) {
      pushNotif(current.creator_email, 'follow', user.name + ' amekufollow!', user.name)
    }
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
    const nc: Clip = {
      id: 'my' + Date.now(),
      url: videoUrl.trim() || DEMO_VIDEOS[0].url,
      caption: caption.trim() || 'Video yangu mpya!',
      creator: user.name,
      creator_email: user.email,
      likes: 0,
    }
    setClips((p) => [nc, ...p])
    setCaption('')
    setVideoUrl('')
    setShowCamera(false)
    setTab('foryou')
    setIdx(0)
    setView('home')
    alert('Video imepakiwa!')
  }

  const handleFile = (e: any) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    const nc: Clip = {
      id: 'my' + Date.now(),
      url,
      caption: caption.trim() || f.name,
      creator: user?.name || 'Mimi',
      creator_email: user?.email || 'me@vibra.com',
      likes: 0,
    }
    setClips((p) => [nc, ...p])
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
    setGlobalComments((p: any) => ({
      ...p,
      [current.id]: [...(p[current.id] || []), c],
    }))
    setCommentText('')
    if (current.creator_email !== user?.email) {
      pushNotif(current.creator_email, 'comment', c.name + ' amecomment', c.name)
    }
    fetch(SUPABASE_URL + '/rest/v1/vibra_comments', {
      method: 'POST',
      headers: SB_HEADERS,
      body: JSON.stringify({
        video_id: current.id,
        user_email: user?.email || 'guest@vibra.com',
        user_name: c.name,
        comment_text: c.text,
      }),
    }).catch(() => {})
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
    setChats((p) =>
      p.map((ch) =>
        ch.id === selectedChatId
          ? {
              ...ch,
              last: chatInput.trim(),
              msgs: [
                ...(ch.msgs || []),
                {
                  from: 'me',
                  text: chatInput.trim(),
                  time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
              ],
            }
          : ch
      )
    )
    setChatInput('')
  }

  const sendGift = (g: any) => {
    if (coins < g.cost) {
      alert('Coins hazitoshi! Like video ili upate coins')
      return
    }
    setCoins((c: number) => c - g.cost)
    setGiftSent((x) => x + g.cost)
    setCreatorCoins((c: number) => c + g.cost)
    alert('Umetuma ' + g.name + ' ' + g.emoji)
  }

  if (!hydrated) {
    return (
      <div
        style={{
          background: '#000',
          height: '100vh',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
        }}
      >
        VIBRA...
      </div>
    )
  }

  if (showSettings) {
    return (
      <div style={{ background: '#fff', color: '#000', minHeight: '100vh', fontFamily: 'system-ui' }}>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 18 }}>Settings and privacy</b>
          <span onClick={() => setShowSettings(false)} style={{ cursor: 'pointer', fontSize: 22 }}>
            ✕
          </span>
        </div>
        <div style={{ padding: '0 16px 30px' }}>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>ACCOUNT</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span>👤 Manage account</span>
            <span
              style={{
                background: PINK,
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 15,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              @{user?.name || 'Guest'}
            </span>
          </div>
          <div
            onClick={() => {
              setShowSettings(false)
              setShowSwitch(true)
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
            }}
          >
            <span>🔄 Switch account</span>
            <span style={{ color: '#888' }}>{accounts.length} accounts ›</span>
          </div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>
            CONTENT & ACTIVITY
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>📢 Ads</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            🅰️ App language - Kiswahili
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            🌙 Display & accessibility - Dark
          </div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>
            CACHE & CELLULAR DATA
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            🧹 Free up space - 240.50 MB
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            ⬇️ Offline videos - {savedIds.length} videos
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>🎵 Media player</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            📱 Safaricom data shop
            <div style={{ fontSize: 12, color: '#888' }}>Buy discounted data bundles</div>
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            📶 Data Saver - <span style={{ color: '#00C853' }}>ON</span>
          </div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>SUPPORT</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>✏️ Report a problem</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>❓ Help Center</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>🛡️ Safety Center</div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 16 }}>ABOUT</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            👥 Community Guidelines
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>📄 Terms of Service</div>
          <div style={{ padding: '12px 0' }}>🔒 Privacy Policy</div>
          <button
            onClick={() => {
              if (confirm('Una uhakika unataka kutoka?')) {
                setUser(null)
                localStorage.removeItem('vibra_user')
                setShowSettings(false)
              }
            }}
            style={{
              width: '100%',
              background: PINK,
              color: '#fff',
              border: 'none',
              padding: 14,
              borderRadius: 12,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            🚪 Log out
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10 }}>
            v1.0.0 - Vibra Worldwide - Mombasa
          </div>
        </div>
      </div>
    )
  }

  if (view === 'chat') {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
        <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 20 }}>💬 Chats</b>
          <span onClick={() => setView('home')} style={{ cursor: 'pointer', fontSize: 22 }}>
            ✕
          </span>
        </div>
        {selectedChat ? (
          <div style={{ padding: '0 14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span onClick={() => setSelectedChatId('')} style={{ cursor: 'pointer' }}>
                ←
              </span>
              <img
                src={selectedChat.avatar}
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
              />
              <b>{selectedChat.name}</b>
              <span style={{ color: '#00C853', fontSize: 12 }}>● Online</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(selectedChat.msgs || []).map((m: any, i: number) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                    background: m.from === 'me' ? PINK : '#222',
                    padding: '10px 14px',
                    borderRadius: 16,
                    maxWidth: '80%',
                  }}
                >
                  {m.text}
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Andika ujumbe..."
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 20,
                  border: 'none',
                  background: '#222',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <button
                onClick={sendChatMsg}
                style={{
                  background: PINK,
                  color: '#fff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 20,
                  fontWeight: 800,
                }}
              >
                Tuma
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 14px' }}>
            <input
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Tafuta chat..."
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: 'none',
                background: '#222',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
              {chats
                .filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase()))
                .map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedChatId(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 0',
                      borderBottom: '1px solid #222',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={c.avatar}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <b>{c.name}</b>
                      <div style={{ fontSize: 13, opacity: 0.6 }}>{c.last}</div>
                    </div>
                    <span>›</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view === 'me') {
    const listToShow = meTab === 'videos' ? myVideos : meTab === 'liked' ? likedVideos : savedVideos
    return (
      <div
        style={{
          background: '#000',
          color: '#fff',
          minHeight: '100vh',
          fontFamily: 'system-ui',
          paddingBottom: 80,
        }}
      >
        <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span onClick={() => setView('home')} style={{ cursor: 'pointer', fontSize: 20 }}>
            ←
          </span>
          <b>@{user?.name || 'Mgeni'}</b>
          <span onClick={() => setShowSettings(true)} style={{ cursor: 'pointer', fontSize: 22 }}>
            ☰
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '10px 16px' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: GRADIENT,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            {(user?.name || 'V')[0].toUpperCase()}
          </div>
          <div style={{ fontWeight: 900, fontSize: 20, marginTop: 8 }}>@{user?.name || 'Mgeni'}</div>
          <div style={{ opacity: 0.6, fontSize: 13 }}>{user?.email || 'Ingia ili uone profile'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
            <span>
              <b>{following.length}</b>
              <br />
              <span style={{ fontSize: 12, opacity: 0.6 }}>Following</span>
            </span>
            <span>
              <b>85</b>
              <br />
              <span style={{ fontSize: 12, opacity: 0.6 }}>Followers</span>
            </span>
            <span>
              <b>{coins}</b>
              <br />
              <span style={{ fontSize: 12, opacity: 0.6 }}>Coins</span>
            </span>
          </div>
          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: PINK,
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 25,
                fontWeight: 800,
                marginTop: 14,
              }}
            >
              Ingia Sasa
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
              <button
                onClick={() => setShowSwitch(true)}
                style={{
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 20,
                  fontWeight: 800,
                }}
              >
                🔄 Switch Account
              </button>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 20,
                  fontWeight: 800,
                }}
              >
                ⚙️ Settings
              </button>
            </div>
          )}
        </div>
        <div
          style={{
            margin: 14,
            background:
