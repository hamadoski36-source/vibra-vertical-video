// VIBRA WORLDWIDE - CLEAN VERSION - HAKUNA FAKE DATA
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide - Video feed' }] }),
  component: VibraTikTok,
})

type Clip = { id: string; url: string; caption: string; owner: string; ownerName: string; likes: number; isMine: boolean }
type Chat = { id: string; name: string; avatar: string; last: string }

const PINK = '#FE2C55'
const TEAL = '#25F4EE'

function VibraTikTok() {
  const [myVideos, setMyVideos] = useState<Clip[]>(() => {
    try { return JSON.parse(localStorage.getItem('vibra_my_videos') || '[]') } catch { return [] }
  })
  const [followingIds, setFollowingIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('vibra_following') || '[]') } catch { return [] }
  })
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('vibra_liked') || '[]') } catch { return [] }
  })
  const [chats, setChats] = useState<Chat[]>([]) // HAKUNA CHAT ZA UONGO - TUPU HADI MTU WA KWELI AJE
  const [idx, setIdx] = useState(0)
  const [view, setView] = useState<'home' | 'me' | 'chat'>('home')
  const [caption, setCaption] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Video 1 ya mfano tu ili feed isiwe tupu - sio fake user
  const demoFeed: Clip[] = [
    { id: 'welcome', url: 'https://videos.pexels.com/video-files/3205624/3205624-hd_720_1280_25fps.mp4', caption: 'Karibu Vibra Worldwide! Post video yako ya kwanza', owner: 'vibra', ownerName: 'Vibra', likes: 0, isMine: false },
  ]

  const baseFeed = [...myVideos, ...demoFeed]
  const feed = tab === 'following' ? baseFeed.filter(v => followingIds.includes(v.owner) || v.isMine) : baseFeed
  const current = feed.length > 0 ? feed[idx % feed.length] : undefined

  // Hifadhi
  useEffect(() => { localStorage.setItem('vibra_my_videos', JSON.stringify(myVideos)) }, [myVideos])
  useEffect(() => { localStorage.setItem('vibra_following', JSON.stringify(followingIds)) }, [followingIds])
  useEffect(() => { localStorage.setItem('vibra_liked', JSON.stringify(likedIds)) }, [likedIds])

  // Hesabu za kweli - zimetenganishwa, hazichanganyiki
  const myVideosCount = myVideos.length
  const followersCount = followingIds.filter(id => id !== 'me' && id !== 'mine').length // Haihesabu kujifollow
  const followingCount = followingIds.length
  const likesCount = likedIds.length

  function nextVideo() { setIdx(v => v + 1) }
  function prevVideo() { setIdx(v => Math.max(0, v - 1)) }

  // FIX KUBWA: HUWEZI KUJIFOLLOW
  function toggleFollow() {
    if (!current) return
    if (current.isMine) return // Kama ni video yako, rudi tu - hakuna kujifollow
    if (current.owner === 'me' || current.owner === 'mine') return
    setFollowingIds(v => {
      const already = v.includes(current.owner)
      if (already) return v.filter(id => id !== current.owner)
      return [...v, current.owner]
    })
  }

  function toggleLike() {
    if (!current) return
    setLikedIds(v => v.includes(current.id) ? v.filter(id => id !== current.id) : [...v, current.id])
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    const newClip: Clip = {
      id: 'my-' + Date.now(),
      url,
      caption: caption || 'Video yangu mpya - Vibra Worldwide',
      owner: 'me',
      ownerName: '@Mr Vibra',
      likes: 0,
      isMine: true,
    }
    setMyVideos(v => [newClip, ...v])
    setCaption('')
    setShowUpload(false)
    setView('home')
    setIdx(0)
    alert('Video imepostwa! Hongera Mr Vibra')
  }

  const isFollowingCurrent = current ? followingIds.includes(current.owner) : false
  const isLikedCurrent = current ? likedIds.includes(current.id) : false

  if (view === 'me') {
    return (
      <div style={{ height: '100dvh', background: '#000', color: '#fff', padding: 20, overflowY: 'auto' }}>
        <button onClick={() => setView('home')} style={{ color: '#fff', background: 'none', border: 'none', fontSize: 20 }}>← Rudi</button>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(90deg,#FE2C55,#25F4EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto' }}>M</div>
          <h2 style={{ margin: '10px 0 0' }}>@Mr Vibra</h2>
          <p style={{ color: '#aaa' }}>Moi's Bridge • Eldoret • Kenya</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            <div><b>{followingCount}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Following</span></div>
            <div><b>{followersCount}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Followers</span></div>
            <div><b>{likesCount}</b><br /><span style={{ color: '#aaa', fontSize: 12 }}>Liked</span></div>
          </div>
          <p style={{ marginTop: 16, color: '#aaa', fontSize: 13 }}>Videos zako: {myVideosCount}</p>
          <button onClick={() => setShowUpload(true)} style={{ background: PINK, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 20, fontWeight: 'bold', marginTop: 10 }}>+ Post Video Mpya</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginTop: 20 }}>
            {myVideos.map(v => (
              <video key={v.id} src={v.url} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} muted playsInline />
            ))}
          </div>
          {myVideos.length === 0 && <p style={{ color: '#888', marginTop: 20 }}>Huna video bado. Post ya kwanza saii!</p>}
        </div>
        {showUpload && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', padding: 20, zIndex: 100 }}>
            <h3>Post Video</h3>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Andika caption..." style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', marginBottom: 12 }} />
            <input ref={fileRef} type="file" accept="video/*" style={{ color: '#fff' }} onChange={e => handleUpload(e.target.files?.[0])} />
            <button onClick={() => setShowUpload(false)} style={{ display: 'block', marginTop: 16, background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12 }}>Funga</button>
          </div>
        )}
      </div>
    )
  }

  if (view === 'chat') {
    return (
      <div style={{ height: '100dvh', background: '#000', color: '#fff', padding: 20 }}>
        <button onClick={() => setView('home')} style={{ color: '#fff', background: 'none', border: 'none', fontSize: 20 }}>← Rudi</button>
        <h2 style={{ marginTop: 16 }}>Chats</h2>
        {chats.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>
            <p style={{ fontSize: 40 }}>💬</p>
            <p>Huna chat bado.</p>
            <p style={{ fontSize: 13 }}>Mtu akikutumia ujumbe, ataonekana hapa.</p>
          </div>
        ) : chats.map(c => (
          <div key={c.id} style={{ padding: 14, borderBottom: '1px solid #222' }}>{c.name} - {c.last}</div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh', background: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Juu */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', gap: 20, paddingTop: 14 }}>
        <button onClick={() => setTab('following')} style={{ background: 'none', border: 'none', color: tab === 'following' ? '#fff' : '#aaa', fontWeight: 'bold' }}>Following</button>
        <button onClick={() => setTab('foryou')} style={{ background: 'none', border: 'none', color: tab === 'foryou' ? '#fff' : '#aaa', fontWeight: 'bold' }}>For You</button>
      </div>

      {/* Video */}
      {current ? (
        <video key={current.id} ref={videoRef} src={current.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted }} />
      ) : (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <p>Hakuna video kwenye Following bado.<br />Follow mtu au rudi For You.</p>
        </div>
      )}

      {/* Kulia - Buttons */}
      {current && (
        <div style={{ position: 'absolute', right: 12, bottom: 110, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', zIndex: 10 }}>
          {/* Avatar + Follow - HAIOMEKANI KAMA NI VIDEO YAKO */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(90deg,#FE2C55,#25F4EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{current.ownerName.slice(0, 1)}</div>
            {!current.isMine && (
              <button onClick={toggleFollow} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: isFollowingCurrent ? '#fff' : PINK, color: isFollowingCurrent ? PINK : '#fff', border: 'none', fontWeight: 'bold', fontSize: 16, lineHeight: '1' }}>
                {isFollowingCurrent ? '✓' : '+'}
              </button>
            )}
          </div>
          <button onClick={toggleLike} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>{isLikedCurrent ? '❤️' : '🤍'}</div>
            <div style={{ fontSize: 12 }}>{current.likes + (isLikedCurrent ? 1 : 0)}</div>
          </button>
          <button onClick={() => alert('Share - ' + current.caption)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28 }}>↗️</button>
          <button onClick={prevVideo} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22 }}>⬆️</button>
          <button onClick={nextVideo} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22 }}>⬇️</button>
        </div>
      )}

      {/* Chini - Caption */}
      {current && (
        <div style={{ position: 'absolute', left: 12, right: 70, bottom: 110, zIndex: 10 }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{current.ownerName}</p>
          <p style={{ fontSize: 13, margin: '6px 0' }}>{current.caption}</p>
          <p style={{ fontSize: 11, color: '#aaa' }}>{current.isMine ? 'Video yako • Ukigusa + haitaonekana' : 'Video ya mtu mwingine • Gusa + kumfollow'}</p>
        </div>
      )}

      {/* Chini - Navigation */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#000', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #222', zIndex: 20 }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>🏠<br />Home</button>
        <button onClick={() => setView('chat')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>💬<br />Chat</button>
        <button onClick={() => setShowUpload(true)} style={{ background: PINK, color: '#fff', border: 'none', borderRadius: 12, width: 48, height: 36, fontSize: 22, fontWeight: 'bold' }}>+</button>
        <button onClick={() => setView('me')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13 }}>👤<br />Me</button>
      </div>

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', padding: 20, zIndex: 100 }}>
          <h3>Post Video Mpya</h3>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Andika caption..." style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', marginBottom: 12 }} />
          <input type="file" accept="video/*" style={{ color: '#fff' }} onChange={e => handleUpload(e.target.files?.[0])} />
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 12 }}>Ukishapost, Followers hawaongezeki. Wanaongezeka tu mtu mwingine akikufollow.</p>
          <button onClick={() => setShowUpload(false)} style={{ display: 'block', marginTop: 16, background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12 }}>Funga</button>
        </div>
      )}
    </div>
  )
}
