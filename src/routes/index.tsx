import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const [isLive, setIsLive] = useState(true)
  const [coins, setCoins] = useState(16)
  const [dp, setDp] = useState("")
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const videos = [
    { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "VIBRA WORLDWIDE 🌍" },
    { id: 2, url: "https://www.w3schools.com/html/movie.mp4", title: "Mombasa Support Vibra" },
    { id: 3, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Coast Life 🌊" },
    { id: 4, url: "https://www.w3schools.com/html/movie.mp4", title: "8 Videos Worldwide" },
    { id: 5, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Swahili Vibes 💛" },
    { id: 6, url: "https://www.w3schools.com/html/movie.mp4", title: "Beach Life 🏖️" },
    { id: 7, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Mombasa Nights" },
    { id: 8, url: "https://www.w3schools.com/html/movie.mp4", title: "Vibra Forever" },
  ]

  useEffect(() => {
    const savedDp = localStorage.getItem("vibra_dp")
    if (savedDp) setDp(savedDp)
    // Auto-play first video
    setTimeout(() => videoRefs.current[0]?.play().catch(()=>{}), 500)
  }, [])

  const handleShare = async () => {
    const link = window.location.href
    try {
      await navigator.clipboard.writeText(link)
      alert("✅ Link copied! Share kwa WhatsApp!")
    } catch {
      prompt("Copy link:", link)
    }
  }

  const handleDp = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: any) => {
      setDp(ev.target.result)
      localStorage.setItem("vibra_dp", ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSearch = () => {
    const q = prompt("Tafuta video:")
    if (q) alert("🔍 Inatafuta: " + q)
  }

  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      
      {/* TOP BAR - LIVE kushoto, SEARCH na COINS kulia */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <div onClick={() => setIsLive(!isLive)} style={{ background: '#ef4444', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
          LIVE • 1.2K
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={handleSearch} style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</div>
          <span style={{ color: '#facc15', fontWeight: 'bold', fontSize: '13px' }}>{coins} Coins</span>
          <span style={{ border: '1px solid #555', borderRadius: '10px', padding: '2px 6px', fontSize: '10px' }}>Sound on</span>
        </div>
      </div>

      {isLive && <div style={{ position: 'fixed', top: '44px', left: 0, right: 0, zIndex: 99, background: '#ef4444', textAlign: 'center', padding: '4px', fontSize: '12px', fontWeight: 'bold' }}>🔴 Uko LIVE sasa!</div>}

      {/* VIDEO FEED */}
      <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
        {videos.map((vid, idx) => (
          <div key={vid.id} style={{ height: '100vh', width: '100vw', scrollSnapAlign: 'start', position: 'relative', background: '#000' }}>
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              src={vid.url}
              loop
              playsInline
              muted={false}
              controls={false}
              onClick={(e: any) => e.target.paused ? e.target.play() : e.target.pause()}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            
            {/* RIGHT SIDE BUTTONS - Share iko hapa chini kulia */}
            <div style={{ position: 'absolute', right: '10px', bottom: '90px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', zIndex: 10 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id="dpIn" hidden accept="image/*" onChange={handleDp} />
                <div onClick={() => document.getElementById('dpIn')?.click()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #facc15', background: dp ? `url(${dp})` : '#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'pointer' }}>
                  {!dp && '150x150'}
                </div>
                <span style={{ fontSize: '9px', marginTop: '3px' }}>Bonyeza DP</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>@MrVibra</span>
                <span style={{ fontSize: '9px', opacity: 0.6 }}>8 Videos • {coins} C</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>❤️</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>12K</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '26px' }}>💬</div>
                <div style={{ fontSize: '11px' }}>345</div>
              </div>

              {/* SHARE - Sasa iko kulia chini kama ulivyotaka */}
              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '6px' }}>
                <div style={{ fontSize: '24px' }}>↗️</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Share</div>
              </div>
            </div>

            {/* TITLE CHINI KUSHOTO */}
            <div style={{ position: 'absolute', bottom: '85px', left: '12px', right: '80px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: '2px 0' }}>Mombasa Support Vibra - 8 Videos</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV - Home, Explore, Upload katikati, Coins, Profile */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 12px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span style={{ fontSize: '9px' }}>Home</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
          <span style={{ fontSize: '20px' }}>🧭</span>
          <span style={{ fontSize: '9px' }}>Explore</span>
        </div>

        {/* UPLOAD KATIKATI CHINI kama ulivyotaka */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '4px 14px' }}>
          <span style={{ fontSize: '22px', color: 'black', fontWeight: 'bold' }}>➕</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
          <span style={{ fontSize: '20px' }}>💰</span>
          <span style={{ fontSize: '9px' }}>{coins}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <span style={{ fontSize: '9px' }}>Me</span>
        </div>
      </div>
    </div>
  )
}
