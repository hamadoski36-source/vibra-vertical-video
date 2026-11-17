import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

type Video = { id: number; user: string; caption: string; likes: number; liked: boolean; comments: number }
type Account = { id: number; name: string; username: string; active: boolean }

const initialVideos: Video[] = [
  { id: 1, user: '@vibra_official', caption: 'Karibu VIBRA 🔥 Video ya kwanza', likes: 12, liked: false, comments: 4 },
  { id: 2, user: '@mombasa_boy', caption: 'Mombasa ni tamu sana 🌊', likes: 8, liked: false, comments: 2 },
  { id: 3, user: '@dance_queen', caption: 'Dance challenge mpya 💃', likes: 25, liked: false, comments: 9 },
  { id: 4, user: '@tech_tz', caption: 'Jinsi ya kupata pesa na AI 🤖', likes: 40, liked: false, comments: 15 },
]

function App() {
  const [tab, setTab] = useState<'foryou' | 'following' | 'live' | 'me' | 'ai'>('foryou')
  const [videos, setVideos] = useState(initialVideos)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showShare, setShowShare] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [newAccName, setNewAccName] = useState('')
  const [newAccUser, setNewAccUser] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: 'Mimi', username: '@mimi_vibra', active: true },
    { id: 2, name: 'Biashara Yangu', username: '@biashara', active: false },
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState<{ q: string; a: string }[]>([])

  const current = videos[currentIdx]
  const totalLikesReceived = videos.reduce((sum, v) => sum + v.likes, 0)
  const myVideos = videos

  const toggleLike = (id: number) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v))
  }

  const askAI = (q: string) => {
    const question = q || aiInput
    if (!question.trim()) return
    let answer = 'VIBRA AI: Hilo ni swali zuri! Jaribu kuuliza kuhusu kupata pesa, Meta, au jinsi ya kukuza account yako.'
    if (question.toLowerCase().includes('meta')) answer = 'VIBRA AI: Meta ilianzishwa na Mark Zuckerberg. Inamiliki Facebook, Instagram na WhatsApp.'
    if (question.toLowerCase().includes('pesa')) answer = 'VIBRA AI: Njia 3 za kupata pesa: 1. Post video kila siku 2. LIVE 3. Uza bidhaa zako kwenye VIBRA.'
    if (question.toLowerCase().includes('vibra')) answer = 'VIBRA AI: VIBRA ni app kama TikTok, imeundwa kwa ajili ya watu wa Mombasa na Tanzania kupost video na kupata pesa.'
    setAiMessages(prev => [...prev, { q: question, a: answer }])
    setAiInput('')
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://vibra.app'
  const shareText = current ? `${current.caption} - Tazama kwenye VIBRA` : 'Tazama VIBRA'

  const doShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl)
    const text = encodeURIComponent(shareText)
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    if (platform === 'telegram') window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
    if (platform === 'chatgpt') window.open(`https://chatgpt.com/?q=${text}`, '_blank')
    if (platform === 'capcut') window.open(`https://www.capcut.com/`, '_blank')
    if (platform === 'instagram') { navigator.clipboard.writeText(shareUrl); alert('Link imecopiwa! Sasa fungua Instagram na paste kwenye Story.'); window.open('https://www.instagram.com/', '_blank') }
    if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); alert('Link imecopiwa!') }
    if (platform === 'more' && (navigator as any).share) (navigator as any).share({ title: 'VIBRA', text: shareText, url: shareUrl })
  }

  const addAccount = () => {
    if (!newAccName.trim() || !newAccUser.trim()) { alert('Jaza jina na username'); return }
    setAccounts(prev => [...prev.map(a => ({ ...a, active: false })), { id: Date.now(), name: newAccName, username: newAccUser.startsWith('@') ? newAccUser : '@' + newAccUser, active: true }])
    setNewAccName(''); setNewAccUser(''); setShowAddAccount(false); setShowSettings(false)
    alert('Account mpya imeongezwa!')
  }

  const switchAccount = (id: number) => {
    setAccounts(prev => prev.map(a => ({ ...a, active: a.id === id })))
    setShowSettings(false)
  }

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative', paddingBottom: 70 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: 12, position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        <button onClick={() => setTab('foryou')} style={{ background: 'none', border: 'none', color: tab === 'foryou' ? '#fff' : '#888', fontWeight: 'bold', fontSize: 16 }}>For You</button>
        <button onClick={() => setTab('following')} style={{ background: 'none', border: 'none', color: tab === 'following' ? '#fff' : '#888', fontWeight: 'bold' }}>Following</button>
        <button onClick={() => setTab('live')} style={{ background: 'none', border: 'none', color: tab === 'live' ? '#ff2d55' : '#888', fontWeight: 'bold' }}>● LIVE</button>
        <button onClick={() => setTab('ai')} style={{ background: '#2563eb', border: 'none', color: '#fff', borderRadius: 20, padding: '4px 10px', fontWeight: 'bold' }}>🤖 VIBRA AI</button>
      </div>

      {(tab === 'foryou' || tab === 'following') && current && (
        <div style={{ padding: 12 }}>
          <div style={{ background: 'linear-gradient(180deg,#333,#111)', height: 520, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, left: 12, background: '#ff2d55', padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>{current.user}</div>
            <div style={{ position: 'absolute', right: 10, bottom: 90, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <button onClick={() => toggleLike(current.id)} style={{ background: '#222', border: 'none', borderRadius: '50%', width: 52, height: 52, fontSize: 22 }}>{current.liked ? '❤️' : '🤍'}</button>
              <span style={{ fontSize: 12, fontWeight: 'bold' }}>{current.likes}</span>
              <button style={{ background: '#222', border: 'none', borderRadius: '50%', width: 52, height: 52, fontSize: 20 }}>💬</button>
              <span style={{ fontSize: 12 }}>{current.comments}</span>
              <button onClick={() => setShowShare(true)} style={{ background: '#222', border: 'none', borderRadius: '50%', width: 52, height: 52, fontSize: 20 }}>↗️</button>
              <span style={{ fontSize: 11 }}>Share</span>
            </div>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{current.user}</p>
            <p style={{ fontSize: 13, color: '#ddd' }}>{current.caption}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} style={{ flex: 1, padding: 10, borderRadius: 10, background: '#222', color: '#fff', border: 'none' }}>⬆️ Iliyopita</button>
            <button disabled={currentIdx === videos.length - 1} onClick={() => setCurrentIdx(currentIdx + 1)} style={{ flex: 1, padding: 10, borderRadius: 10, background: '#ff2d55', color: '#fff', border: 'none', fontWeight: 'bold' }}>Video Inayofuata ⬇️</button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {videos.map((v, i) => (
              <button key={v.id} onClick={() => setCurrentIdx(i)} style={{ background: i === currentIdx ? '#ff2d55' : '#222', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 20, fontSize: 12 }}>{v.user}</button>
            ))}
          </div>
        </div>
      )}

      {tab === 'live' && (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>🔴 LIVE Sasa</h2>
          <p style={{ color: '#aaa' }}>Watu 3 wako LIVE sasa</p>
          <div style={{ background: '#222', padding: 20, borderRadius: 14, marginTop: 10 }}>🎥 @mombasa_boy - LIVE - Watu 128 wanatazama</div>
          <div style={{ background: '#222', padding: 20, borderRadius: 14, marginTop: 10 }}>🎥 @dance_queen - LIVE - Watu 342 wanatazama</div>
        </div>
      )}

      {tab === 'ai' && (
        <div style={{ padding: 14 }}>
          <h2 style={{ margin: 0 }}>🤖 VIBRA AI</h2>
          <p style={{ fontSize: 12, color: '#aaa' }}>Uliza chochote, AI inajibu</p>
          <p style={{ fontSize: 11, background: '#1e3a8a', padding: 8, borderRadius: 10 }}>Maswali ya Haraka - Bonyeza moja, AI inajibu mara moja, huhitaji kuandika</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {['Who created Meta?', 'Njia za kupata pesa?', 'VIBRA ni nini?', 'Jinsi ya kukuza account?'].map(q => (
              <button key={q} onClick={() => askAI(q)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: 20, fontSize: 12 }}>{q}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {aiMessages.map((m, i) => (
              <div key={i} style={{ background: '#111', padding: 10, borderRadius: 10 }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: 13 }}>Wewe: {m.q}</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#93c5fd' }}>{m.a}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask VIBRA AI..." style={{ flex: 1, padding: 11, borderRadius: 20, background: '#222', color: '#fff', border: 'none' }} />
            <button onClick={() => askAI('')} style={{ background: '#ff2d55', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 20, fontWeight: 'bold' }}>Send</button>
          </div>
        </div>
      )}

      {tab === 'me' && (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ff2d55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto' }}>😎</div>
          <h2 style={{ margin: '8px 0 0' }}>{accounts.find(a => a.active)?.name || 'Mimi'}</h2>
          <p style={{ color: '#aaa', margin: 0 }}>{accounts.find(a => a.active)?.username}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 14 }}>
            <div><b>{myVideos.length}</b><div style={{ fontSize: 11, color: '#888' }}>Videos</div></div>
            <div><b>{totalLikesReceived}</b><div style={{ fontSize: 11, color: '#888' }}>Likes</div></div>
            <div><b>1.2K</b><div style={{ fontSize: 11, color: '#888' }}>Followers</div></div>
          </div>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>Likes hapa = jumla ya likes watu wamekupatia kwenye video zako. Ukilike video zako zote, namba itaongezeka hapa.</p>
          <button onClick={() => setShowSettings(true)} style={{ marginTop: 12, background: '#222', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 20 }}>⚙️ Settings & Add Account</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
            {myVideos.map(v => (
              <div key={v.id} style={{ background: '#222', height: 140, borderRadius: 12, padding: 10, textAlign: 'left' }}>
                <p style={{ fontSize: 12, fontWeight: 'bold' }}>{v.user}</p>
                <p style={{ fontSize: 11, color: '#ccc' }}>{v.caption}</p>
                <p style={{ fontSize: 12 }}>❤️ {v.likes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <button onClick={() => setTab('foryou')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>🏠</button>
        <button onClick={() => setTab('ai')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>🤖</button>
        <button onClick={() => alert('Upload hivi karibuni - chagua video')} style={{ background: '#ff2d55', border: 'none', color: '#fff', fontSize: 22, borderRadius: 10, padding: '2px 14px' }}>+</button>
        <button onClick={() => setTab('live')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>🔴</button>
        <button onClick={() => setTab('me')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>👤</button>
      </div>

      {showShare && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 99 }}>
          <div style={{ background: '#111', width: '100%', maxWidth: 430, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Share Video</b><button onClick={() => setShowShare(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>✕</button></div>
            <p style={{ fontSize: 12, color: '#aaa' }}>{current?.caption}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
              <button onClick={() => doShare('whatsapp')} style={{ background: '#25D366', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>WhatsApp</button>
              <button onClick={() => doShare('facebook')} style={{ background: '#1877F2', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>Facebook</button>
              <button onClick={() => doShare('instagram')} style={{ background: '#E1306C', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>Instagram</button>
              <button onClick={() => doShare('telegram')} style={{ background: '#0088cc', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>Telegram</button>
              <button onClick={() => doShare('chatgpt')} style={{ background: '#10a37f', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>ChatGPT</button>
              <button onClick={() => doShare('capcut')} style={{ background: '#000', border: '1px solid #fff', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>CapCut</button>
              <button onClick={() => doShare('copy')} style={{ background: '#333', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>Copy Link</button>
              <button onClick={() => doShare('more')} style={{ background: '#333', border: 'none', padding: 12, borderRadius: 12, color: '#fff', fontWeight: 'bold' }}>More...</button>
            </div>
            <p style={{ fontSize: 11, color: '#888', marginTop: 10 }}>Instagram: Link itacopiwa, fungua Instagram paste kwenye Story. CapCut: Itafungua ku-edit video.</p>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 99 }}>
          <div style={{ background: '#111', width: '100%', maxWidth: 430, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Settings</b><button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18 }}>✕</button></div>
            <h4 style={{ margin: '14px 0 8px' }}>Accounts Zangu</h4>
            {accounts.map(a => (
              <div key={a.id} onClick={() => switchAccount(a.id)} style={{ display: 'flex', justifyContent: 'space-between', background: a.active ? '#1e3a8a' : '#222', padding: 12, borderRadius: 12, marginBottom: 8, cursor: 'pointer' }}>
                <div><b style={{ fontSize: 14 }}>{a.name}</b><div style={{ fontSize: 12, color: '#aaa' }}>{a.username}</div></div>
                <span>{a.active ? '✅ Active' : 'Bonyeza kubadilisha'}</span>
              </div>
            ))}
            {!showAddAccount ? (
              <button onClick={() => setShowAddAccount(true)} style={{ width: '100%', background: '#ff2d55', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontWeight: 'bold', marginTop: 6 }}>+ Add Account</button>
            ) : (
              <div style={{ background: '#222', padding: 12, borderRadius: 12, marginTop: 8 }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Account Mpya</p>
                <input value={newAccName} onChange={e => setNewAccName(e.target.value)} placeholder="Jina, mfano: Mimi" style={{ width: '100%', padding: 10, borderRadius: 10, background: '#111', color: '#fff', border: 'none', marginTop: 8 }} />
                <input value={newAccUser} onChange={e => setNewAccUser(e.target.value)} placeholder="Username, mfano: @mimi2" style={{ width: '100%', padding: 10, borderRadius: 10, background: '#111', color: '#fff', border: 'none', marginTop: 8 }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={addAccount} style={{ flex: 1, background: '#ff2d55', color: '#fff', border: 'none', padding: 10, borderRadius: 10, fontWeight: 'bold' }}>Save Account</button>
                  <button onClick={() => setShowAddAccount(false)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', padding: 10, borderRadius: 10 }}>Cancel</button>
                </div>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>Privacy • Notifications • Language • Logout</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})
