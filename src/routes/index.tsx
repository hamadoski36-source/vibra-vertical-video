import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: VibraApp,
})

function VibraApp() {
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)

  const videos = [
    { id: 1, user: '@hamadoski', desc: 'VIBRA yangu ya kwanza 🔥 #vibra', likes: '12.4K', comments: '892' },
    { id: 2, user: '@vibra_tz', desc: 'Mombasa vibes 🌊 #mombasa', likes: '8.1K', comments: '341' },
    { id: 3, user: '@doski47', desc: 'Dance challenge mpya 💃', likes: '25K', comments: '1.2K' },
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', maxWidth: '430px', margin: '0 auto', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <span style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '1px' }}>VIBRA</span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span style={{ opacity: 0.6 }}>Following</span>
          <span style={{ fontWeight: '700', borderBottom: '2px solid white', paddingBottom: '2px' }}>For You</span>
        </div>
        <span style={{ fontSize: '20px' }}>🔍</span>
      </div>

      {/* Feed */}
      {videos.map((v, i) => (
        <div key={v.id} style={{ height: '100vh', position: 'relative', display: i === 0 ? 'block' : 'none', background: i === 0 ? 'linear-gradient(180deg,#1a1a2e,#16213e,#0f3460)' : '#111', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '80px' }}>▶️</div>
            <p style={{ opacity: 0.7, marginTop: '10px' }}>VIBRA Video {v.id}</p>
          </div>

          {/* Right actions */}
          <div style={{ position: 'absolute', right: '12px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', zIndex: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ff2d55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{v.user[1].toUpperCase()}</div>
              <div onClick={() => setFollowing(!following)} style={{ background: following ? '#fff' : '#ff2d55', color: following ? '#000' : '#fff', borderRadius: '50%', width: '20px', height: '20px', margin: '-10px auto 0', fontSize: '14px', cursor: 'pointer' }}>{following ? '✓' : '+'}</div>
            </div>
            <div onClick={() => setLiked(!liked)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px' }}>{liked ? '❤️' : '🤍'}</div>
              <div style={{ fontSize: '12px' }}>{v.likes}</div>
            </div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '30px' }}>💬</div><div style={{ fontSize: '12px' }}>{v.comments}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '30px' }}>↗️</div><div style={{ fontSize: '12px' }}>Share</div></div>
          </div>

          {/* Bottom info */}
          <div style={{ position: 'absolute', bottom: '90px', left: '14px', right: '80px', zIndex: 10 }}>
            <p style={{ fontWeight: '700', margin: 0 }}>{v.user}</p>
            <p style={{ fontSize: '14px', margin: '6px 0' }}>{v.desc}</p>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>🎵 Original sound - {v.user}</p>
          </div>
        </div>
      ))}

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: '#000', display: 'flex', justifyContent: 'space-around', padding: '10px 0 18px', borderTop: '1px solid #222', zIndex: 20 }}>
        <span>🏠 Home</span>
        <span>🔍 Discover</span>
        <span style={{ background: '#fff', color: '#000', padding: '4px 14px', borderRadius: '8px', fontWeight: 'bold' }}>＋</span>
        <span>💬 Inbox</span>
        <span>👤 Me</span>
      </div>
    </div>
  )
}
