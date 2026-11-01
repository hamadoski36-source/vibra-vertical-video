import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraHome,
})

function VibraHome() {
  const [isLive, setIsLive] = useState(true)
  const [coins, setCoins] = useState(16)
  const [dp, setDp] = useState("")
  const [currentVideo, setCurrentVideo] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const videos = [
    { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@MrVibra", title: "VIBRA WORLDWIDE 🌍 Mombasa" },
    { id: 2, url: "https://www.w3schools.com/html/movie.mp4", user: "@MrVibra", title: "Mombasa Support Vibra 💛" },
    { id: 3, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@MrVibra", title: "8 Videos - Coast Life 🌊" },
    { id: 4, url: "https://www.w3schools.com/html/movie.mp4", user: "@MrVibra", title: "Worldwide Vibes ✨" },
    { id: 5, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@MrVibra", title: "Swahili Dance 💃" },
    { id: 6, url: "https://www.w3schools.com/html/movie.mp4", user: "@MrVibra", title: "Beach Vibra 🏖️" },
    { id: 7, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@MrVibra", title: "Mombasa Nights 🌙" },
    { id: 8, url: "https://www.w3schools.com/html/movie.mp4", user: "@MrVibra", title: "Vibra Forever ❤️" },
  ]

  useEffect(() => {
    const savedDp = localStorage.getItem("vibra_dp")
    if (savedDp) setDp(savedDp)
    const savedCoins = localStorage.getItem("vibra_coins")
    if (savedCoins) setCoins(parseInt(savedCoins))
  }, [])

  const handleShare = async () => {
    const link = window.location.href
    try {
      await navigator.clipboard.writeText(link)
      alert("✅ Link copied! - " + link)
    } catch {
      prompt("Copy link yako:", link)
    }
  }

  const handleDpChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: any) => {
      setDp(ev.target.result)
      localStorage.setItem("vibra_dp", ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const addCoins = () => {
    const n = coins + 8
    setCoins(n)
    localStorage.setItem("vibra_coins", n.toString())
  }

  const handleVideoClick = (idx: number) => {
    const v = videoRefs.current[idx]
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
  }

  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' }}>
      
      {/* TOP BAR */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <div onClick={() => setIsLive(!isLive)} style={{ background: isLive ? '#ef4444' : '#333', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', animation: isLive ? 'pulse 1s infinite' : 'none' }}></div>
          LIVE • 1.2K
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <span style={{ color: '#facc15', fontWeight: 'bold' }}>{coins} Coins</span>
          <span style={{ border: '1px solid #555', borderRadius: '12px', padding: '3px 8px', fontSize: '11px' }}>Sound on</span>
        </div>
      </div>

      {isLive && (
        <div style={{ position: 'fixed', top: '45px', left: 0, right: 0, zIndex: 99, background: '#ef4444', textAlign: 'center', padding: '5px', fontSize: '13px', fontWeight: 'bold' }}>
          🔴 Uko LIVE sasa!
        </div>
      )}

      {/* VERTICAL VIDEO FEED - Kama TikTok */}
      <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }} onScroll={(e: any) => {
        const idx = Math.round(e.target.scrollTop / window.innerHeight)
        setCurrentVideo(idx)
      }}>
        {videos.map((vid, idx) => (
          <div key={vid.id} style={{ height: '100vh', width: '100vw', scrollSnapAlign: 'start', position: 'relative', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              src={vid.url}
              loop
              muted
              playsInline
              autoPlay={idx === 0}
              onClick={() => handleVideoClick(idx)}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            
            {/* TITLE YA CHINI */}
            <div style={{ position: 'absolute', bottom: '90px', left: '15px', right: '90px', zIndex: 10 }}>
              <p style={{ fontWeight: 'bold', fontSize: '15px', margin: 0 }}>VIBRA WORLDWIDE 🌍</p>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: '4px 0' }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>Mombasa Support Vibra - 8 Videos</p>
            </div>

            {/* BUTTONS KULIA */}
            <div style={{ position: 'absolute', right: '12px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id="dpInput" accept="image/*" hidden onChange={handleDpChange} />
                <div onClick={() => document.getElementById('dpInput')?.click()} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #facc15', background: dp ? `url(${dp})` : '#333', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', overflow: 'hidden' }}>
                  {!dp && <span>150x150</span>}
                </div>
                <span style={{ fontSize: '10px', marginTop: '4px', textAlign: 'center', maxWidth: '60px' }}>Bonyeza kuweka DP</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>@MrVibra</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>{videos.length} Videos • {coins} Coins</span>
              </div>

              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '28px' }}>❤️</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>12K</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '26px' }}>💬</div>
                <div style={{ fontSize: '11px' }}>345</div>
              </div>
              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '26px' }}>↗️</div>
                <div style={{ fontSize: '11px' }}>Share</div>
              </div>
              <div onClick={addCoins} style={{ background: '#facc15', color: 'black', borderRadius: '16px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                8 Coins
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0', paddingBottom: '15px' }}>
        <span style={{ fontSize: '20px' }}>🏠</span>
        <span style={{ fontSize: '20px', opacity: 0.5 }}>🔍</span>
        <div onClick={handleShare} style={{ background: 'white', color: 'black', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>↗️ Share</div>
        <div onClick={addCoins} style={{ background: '#facc15', color: 'black', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{coins} Coins</div>
        <span style={{ fontSize: '20px', opacity: 0.5 }}>👤</span>
      </div>

      <style>{`@keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
    </div>
  )
}
