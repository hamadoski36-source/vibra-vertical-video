import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraApp,
})

function VibraApp() {
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem('vibra_dp') || ''
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const videos = [
    { id: 1, user: '@hamadoski', desc: 'VIBRA yangu ya kwanza 🔥 #vibra', likes: '12.4K', comments: '1.2K' },
    { id: 2, user: '@vibra_tz', desc: 'Mombasa vibes 🌊 #mombasa', likes: '8.1K', comments: '890' },
    { id: 3, user: '@doski47', desc: 'Dance challenge mpya 💃', likes: '25K', comments: '3.1K' },
  ]

  const changePhoto = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setProfilePic(url)
      localStorage.setItem('vibra_dp', url)
    }
    reader.readAsDataURL(file)
  }

  // ===== PROFILE PAGE =====
  if (showProfile) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={() => setShowProfile(false)} style={{ fontSize: '22px', cursor: 'pointer' }}>←</span>
          <b>@hamadoski</b>
          <span>⋯</span>
        </div>

        <div style={{ marginTop: '30px' }}>
          <div onClick={() => fileRef.current?.click()} style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', overflow: 'hidden', cursor: 'pointer', border: '2px solid #fff' }}>
            {profilePic ? <img src={profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <p style={{ color: '#aaa', fontSize: '13px' }}>Bonyeza DP kubadilisha</p>

          <input ref={fileRef} type="file" accept="image/*" onChange={changePhoto} style={{ display: 'none' }} />

          <button onClick={() => fileRef.current?.click()} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '20px', fontWeight: '700', marginTop: '10px', cursor: 'pointer' }}>
            Change Photo
          </button>
          <button onClick={() => { setProfilePic(''); localStorage.removeItem('vibra_dp') }} style={{ background: 'transparent', color: '#fff', border: '1px solid #555', padding: '12px 20px', borderRadius: '20px', marginLeft: '10px', cursor: 'pointer' }}>
            Remove
          </button>
        </div>

        <h2 style={{ margin: '20px 0 0' }}>Hamadi Mkungu</h2>
        <p style={{ color: '#aaa', margin: '5px 0' }}>@hamadoski • Mombasa</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
          <div><b>12</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Following</span></div>
          <div><b>1.2K</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Followers</span></div>
          <div><b>3</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Likes</span></div>
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', background: '#000', display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid #222' }}>
          <span onClick={() => setShowProfile(false)} style={{ cursor: 'pointer' }}>🏠 Home</span>
          <span style={{ cursor: 'pointer' }}>🔍 Discover</span>
          <span>➕</span>
          <span>📥 Inbox</span>
          <span style={{ fontWeight: '700' }}>👤 Me</span>
        </div>
      </div>
    )
  }

  // ===== HOME FEED =====
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', position: 'fixed', top: 0, width: '100%', zIndex: 10, maxWidth: '500px', left: '50%', transform: 'translateX(-50%)' }}>
        <span style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '1px' }}>VIBRA</span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span style={{ opacity: 0.6 }}>Following</span>
          <span style={{ fontWeight: '700', borderBottom: '2px solid white', paddingBottom: '2px' }}>For You</span>
        </div>
        <span style={{ fontSize: '20px' }}>🔍</span>
      </div>

      {videos.map((v, i) => (
        <div key={v.id} style={{ height: '100vh', position: 'relative', display: i === 0 ? 'block' : 'block' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '80px' }}>▶️</div>
            <p style={{ opacity: 0.7, marginTop: '10px' }}>VIBRA Video {v.id}</p>
          </div>

          <div style={{ position: 'absolute', right: '12px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div onClick={() => setShowProfile(true)} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', margin: '0 auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
                {profilePic ? <img src={profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
              </div>
              <div onClick={() => setFollowing(!following)} style={{ background: following ? '#555' : '#ff2d55', width: '20px', height: '20px', borderRadius: '50%', margin: '-8px auto 0', fontSize: '14px', cursor: 'pointer' }}>{following ? '✓' : '+'}</div>
            </div>
            <div onClick={() => setLiked(!liked)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px' }}>{liked ? '❤️' : '🤍'}</div>
              <div style={{ fontSize: '12px' }}>{v.likes}</div>
            </div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '30px' }}>💬</div><div style={{ fontSize: '12px' }}>{v.comments}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '30px' }}>↗️</div></div>
          </div>

          <div style={{ position: 'absolute', bottom: '90px', left: '14px', right: '80px' }}>
            <p style={{ fontWeight: '700', margin: 0 }}>{v.user}</p>
            <p style={{ fontSize: '14px', margin: '6px 0' }}>{v.desc}</p>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>🎵 Original sound - {v.user}</p>
          </div>
        </div>
      ))}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', background: '#000', display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid #222', zIndex: 20 }}>
        <span>🏠 Home</span>
        <span>🔍 Discover</span>
        <span style={{ background: '#fff', color: '#000', padding: '4px 14px', borderRadius: '8px' }}>➕</span>
        <span>📥 Inbox</span>
        <span onClick={() => setShowProfile(true)} style={{ cursor: 'pointer', fontWeight: '700' }}>👤 Me</span>
      </div>
    </div>
  )
}
