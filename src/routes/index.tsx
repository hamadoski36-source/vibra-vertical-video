import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraApp,
})

function VibraApp() {
  const [page, setPage] = useState('home')
  const [likedIds, setLikedIds] = useState<number[]>([])
  const [followed, setFollowed] = useState(false)
  const [dp, setDp] = useState(() => localStorage.getItem('vibra_dp') || '')
  const [userName] = useState('Mr vibra')
  const [userHandle] = useState('@hamadoski')
  const fileRef = useRef<HTMLInputElement>(null)

  const videos = [
    { id: 1, user: '@hamadoski', desc: 'VIBRA yangu ya kwanza 🔥 #vibra #mombasa', likes: '12.4K', comments: '1.2K', emoji: '🔥' },
    { id: 2, user: '@vibra_tz', desc: 'Mombasa vibes 🌊 #mombasa', likes: '8.1K', comments: '890', emoji: '🌊' },
    { id: 3, user: '@doski47', desc: 'Dance challenge mpya 💃 #dance', likes: '25K', comments: '3.1K', emoji: '💃' },
    { id: 4, user: '@mr_vibra', desc: 'New song out now 🎵', likes: '30K', comments: '5K', emoji: '🎵' },
    { id: 5, user: '@hamadoski', desc: 'Leo Mombasa inawaka ☀️', likes: '9K', comments: '700', emoji: '☀️' },
  ]

  const changePhoto = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setDp(url)
      localStorage.setItem('vibra_dp', url)
      alert('DP imebadilika! ✅')
    }
    reader.readAsDataURL(file)
  }

  const toggleLike = (id: number) => {
    if (likedIds.includes(id)) setLikedIds(likedIds.filter(x => x !== id))
    else setLikedIds([...likedIds, id])
  }

  const bottomNav = (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', background: '#000', display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid #222', zIndex: 50, color: '#fff' }}>
      <span onClick={() => setPage('home')} style={{ cursor: 'pointer', fontWeight: page === 'home' ? 800 : 400 }}>🏠 Home</span>
      <span onClick={() => setPage('discover')} style={{ cursor: 'pointer' }}>🔍 Discover</span>
      <span style={{ background: '#fff', color: '#000', padding: '2px 14px', borderRadius: '8px', cursor: 'pointer' }}>➕</span>
      <span onClick={() => setPage('inbox')} style={{ cursor: 'pointer' }}>📥 Inbox</span>
      <span onClick={() => setPage('me')} style={{ cursor: 'pointer', fontWeight: page === 'me' ? 800 : 400 }}>👤 Me</span>
    </div>
  )

  // ===== ME / PROFILE PAGE =====
  if (page === 'me') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={() => setPage('home')} style={{ fontSize: '22px', cursor: 'pointer' }}>←</span>
          <b>{userHandle}</b>
          <span>⋯</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <div onClick={() => fileRef.current?.click()} style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '55px', overflow: 'hidden', cursor: 'pointer', border: '3px solid #fff' }}>
            {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <p style={{ color: '#aaa', fontSize: '13px' }}>Bonyeza picha kubadilisha</p>

          <input ref={fileRef} type="file" accept="image/*" onChange={changePhoto} style={{ display: 'none' }} />

          <button onClick={() => fileRef.current?.click()} style={{ background: '#ff2d55', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '25px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', width: '100%', maxWidth: '300px' }}>
            Change DP - Badilisha Picha
          </button>
          <br />
          <button onClick={() => { setDp(''); localStorage.removeItem('vibra_dp') }} style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '10px 20px', borderRadius: '20px', marginTop: '12px', cursor: 'pointer' }}>
            Remove DP
          </button>
        </div>

        <h2 style={{ textAlign: 'center', margin: '22px 0 0' }}>{userName}</h2>
        <p style={{ textAlign: 'center', color: '#aaa', margin: '6px 0' }}>{userHandle} • Mombasa, Kenya</p>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>🔥 VIBRA Creator • Mombasa vibes 🌊</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '20px', textAlign: 'center' }}>
          <div><b>12</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Following</span></div>
          <div><b>1.2K</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Followers</span></div>
          <div><b>45.5K</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Likes</span></div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
          <button style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700' }}>Edit Profile</button>
          <button style={{ flex: 1, background: '#222', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px' }}>Share Profile</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '24px', borderTop: '1px solid #222', paddingTop: '14px' }}>
          <span>🎬 Videos</span><span style={{ opacity: 0.5 }}>❤️ Liked</span><span style={{ opacity: 0.5 }}>🔖 Saved</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '12px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#222', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', borderRadius: '6px' }}>{v.emoji}</div>
          ))}
        </div>

        {bottomNav}
      </div>
    )
  }

  // ===== DISCOVER =====
  if (page === 'discover') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '16px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <h2>🔍 Discover</h2>
        <input placeholder="Search VIBRA..." style={{ width: '100%', padding: '12px', borderRadius: '20px', border: 'none', background: '#222', color: '#fff' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          {['#vibra', '#mombasa', '#dance', '#music', '#trending'].map(t => <span key={t} style={{ background: '#222', padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}>{t}</span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '16px' }}>
          {videos.map(v => <div key={v.id} style={{ background: '#222', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', borderRadius: '8px' }}>{v.emoji}</div>)}
        </div>
        {bottomNav}
      </div>
    )
  }

  // ===== INBOX =====
  if (page === 'inbox') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '16px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <h2>📥 Inbox</h2>
        <p style={{ color: '#aaa' }}>Notifications zako</p>
        <div style={{ background: '#111', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>❤️ @vibra_tz amekulike video yako</div>
        <div style={{ background: '#111', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>👤 @doski47 amekufollow</div>
        <div style={{ background: '#111', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>💬 @mr_vibra: "Nice video bro 🔥"</div>
        {bottomNav}
      </div>
    )
  }

  // ===== HOME FEED =====
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', position: 'fixed', top: 0, width: '100%', zIndex: 10, maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)' }}>
        <span style={{ fontWeight: '900', fontSize: '24px' }}>VIBRA</span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span style={{ opacity: 0.6 }}>Following</span>
          <span style={{ fontWeight: '700', borderBottom: '2px solid white' }}>For You</span>
        </div>
        <span onClick={() => setPage('discover')} style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</span>
      </div>

      {videos.map(v => (
        <div key={v.id} style={{ height: '100vh', position: 'relative', borderBottom: '1px solid #111' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '90px' }}>{v.emoji}</div>
            <p style={{ opacity: 0.7 }}>VIBRA Video {v.id}</p>
          </div>
          <div style={{ position: 'absolute', right: '12px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
               <div onClick={() => { if (v.user === userHandle) setPage('me') }}style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', fontSize: '24px' }}>
                {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
              </div>
              {v.user === userHandle ? null : (
              <div onClick={() => setFollowed(!followed)} style={{ background: followed ? '#555' : '#ff2d55', width: '20px', height: '20px', borderRadius: '50%', margin: '-8px auto 0', fontSize: '13px', cursor: 'pointer' }}>{followed ? '✓' : '+'}</div>)}
            </div>
            <div onClick={() => toggleLike(v.id)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px' }}>{likedIds.includes(v.id) ? '❤️' : '🤍'}</div>
              <div style={{ fontSize: '12px' }}>{v.likes}</div>
            </div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '30px' }}>💬</div><div style={{ fontSize: '12px' }}>{v.comments}</div></div>
            <div style={{ textAlign: 'center', fontSize: '30px' }}>↗️</div>
          </div>
          <div style={{ position: 'absolute', bottom: '90px', left: '14px', right: '80px' }}>
            <p style={{ fontWeight: '700', margin: 0 }}>{v.user}</p>
            <p style={{ fontSize: '14px', margin: '6px 0' }}>{v.desc}</p>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>🎵 Original sound - {v.user}</p>
          </div>
        </div>
      ))}
      {bottomNav}
    </div>
  )
}
