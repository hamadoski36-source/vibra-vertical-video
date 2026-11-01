import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const [tab, setTab] = useState('home') // home | inbox | me
  const [isLive, setIsLive] = useState(true)
  const [coins, setCoins] = useState(16)
  const [dp, setDp] = useState("")
  const [showLyrics, setShowLyrics] = useState(false)
  const [liked, setLiked] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const videos = [
    { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "VIBRA WORLDWIDE 🌍 Mombasa ni Home", lyrics: "Vibra worldwide... Mombasa to the world..." },
    { id: 2, url: "https://www.w3schools.com/html/movie.mp4", title: "Mombasa Support Vibra 💛", lyrics: "Support Vibra... 16 Coins..." },
    { id: 3, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "8 Videos - Coast Life", lyrics: "Coast life yeah..." },
    { id: 4, url: "https://www.w3schools.com/html/movie.mp4", title: "Worldwide Vibes", lyrics: "Worldwide vibes..." },
    { id: 5, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Swahili Dance", lyrics: "Cheza cheza..." },
    { id: 6, url: "https://www.w3schools.com/html/movie.mp4", title: "Beach Vibra", lyrics: "Beach vibra..." },
    { id: 7, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Mombasa Nights", lyrics: "Mombasa nights..." },
    { id: 8, url: "https://www.w3schools.com/html/movie.mp4", title: "Vibra Forever", lyrics: "Vibra forever..." },
  ]

  useEffect(() => {
    const d = localStorage.getItem("vibra_dp")
    if (d) setDp(d)
    // FORCE PLAY - ndio isibaki picha tu
    const playAll = async () => {
      for (let i=0; i<videoRefs.current.length; i++) {
        try { await videoRefs.current[i]?.play() } catch {}
      }
    }
    setTimeout(playAll, 800)
  }, [tab])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("✅ Link copied! Tuma WhatsApp")
    } catch {
      prompt("Copy link:", window.location.href)
    }
  }

  const handleDp = (e: any) => {
    const f = e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = (ev: any) => { setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result) }
    r.readAsDataURL(f)
  }

  // PAGE YA ME
  if (tab === 'me') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', paddingBottom: '70px' }}>
        <div style={{ padding: '50px 15px 20px', textAlign: 'center' }}>
          <input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp} />
          <div onClick={() => document.getElementById('dpMe')?.click()} style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #facc15', margin: '0 auto', background: dp ? `url(${dp})` : '#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!dp && '150x150'}
          </div>
          <h2 style={{ margin: '10px 0 2px' }}>@MrVibra</h2>
          <p style={{ opacity: 0.6, fontSize: '13px' }}>8 Videos • {coins} Coins • Mombasa</p>
          <p style={{ fontSize: '12px' }}>Bonyeza DP kuweka picha yako</p>
          <button onClick={handleShare} style={{ marginTop: '10px', background: 'white', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 20px', fontWeight: 'bold' }}>↗️ Share Profile</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', padding: '2px' }}>
          {videos.map(v => (
            <div key={v.id} onClick={() => setTab('home')} style={{ aspectRatio: '9/16', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>Video {v.id}</div>
          ))}
        </div>
        <BottomNav tab={tab} setTab={setTab} coins={coins} />
      </div>
    )
  }

  // PAGE YA INBOX
  if (tab === 'inbox') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px 15px 70px' }}>
        <h2 style={{ margin: 0 }}>📥 Inbox</h2>
        <p style={{ opacity: 0.6 }}>Ujumbe wako</p>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#111', padding: '12px', borderRadius: '10px' }}>🔴 @CoastVibes: "Bro video yako kali!" • 2m ago</div>
          <div style={{ background: '#111', padding: '12px', borderRadius: '10px' }}>💛 System: "Umepewa 8 Coins!" • 1h ago</div>
          <div style={{ background: '#111', padding: '12px', borderRadius: '10px' }}>🎵 @MrVibra: "Uko LIVE sasa!" • LIVE</div>
        </div>
        <BottomNav tab={tab} setTab={setTab} coins={coins} />
      </div>
    )
  }

  // HOME - VIDEO FEED
  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <div onClick={() => setIsLive(!isLive)} style={{ background: isLive ? '#ef4444' : '#333', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE • 1.2K</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span onClick={() => alert('Search - tafuta video')} style={{ fontSize: '20px' }}>🔍</span>
          <span style={{ color: '#facc15', fontWeight: 'bold', fontSize: '13px' }}>{coins} Coins</span>
        </div>
      </div>

      {isLive && <div style={{ position: 'fixed', top: '44px', left: 0, right: 0, zIndex: 99, background: '#ef4444', textAlign: 'center', padding: '4px', fontSize: '12px' }}>🔴 Uko LIVE sasa!</div>}

      <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
        {videos.map((vid, idx) => (
          <div key={vid.id} style={{ height: '100vh', width: '100vw', scrollSnapAlign: 'start', position: 'relative' }}>
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              src={vid.url}
              loop
              muted
              playsInline
              autoPlay
              onClick={(e: any) => e.target.paused ? e.target.play() : e.target.pause()}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            {/* Lyrics popup */}
            {showLyrics && <div style={{ position: 'absolute', bottom: '200px', left: '15px', right: '80px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '10px', fontSize: '13px', zIndex: 20 }}>🎵 {vid.lyrics}</div>}

            {/* KULIA - DP, LIKE, COMMENT, LYRICS, SHARE */}
            <div style={{ position: 'absolute', right: '10px', bottom: '80px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id={`dp${idx}`} hidden accept="image/*" onChange={handleDp} />
                <div onClick={() => document.getElementById(`dp${idx}`)?.click()} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #facc15', background: dp ? `url(${dp})` : '#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{!dp && '150x150'}</div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>@MrVibra</span>
              </div>

              <div onClick={() => { setLiked(!liked); if(!liked) setCoins(c=>{ const n=c+1; localStorage.setItem('vibra_coins', n.toString()); return n }) }} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '32px' }}>{liked ? '❤️' : '🤍'}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{liked ? '12.1K' : '12K'}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>💬</div>
                <div style={{ fontSize: '11px' }}>345</div>
              </div>

              <div onClick={() => setShowLyrics(!showLyrics)} style={{ textAlign: 'center', cursor: 'pointer', background: showLyrics ? '#facc15' : 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '5px 7px' }}>
                <div style={{ fontSize: '20px' }}>🎵</div>
                <div style={{ fontSize: '9px', color: showLyrics ? 'black' : 'white', fontWeight: 'bold' }}>Lyrics</div>
              </div>

              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '26px' }}>↗️</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Share</div>
              </div>

              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎧</div>
            </div>

            <div style={{ position: 'absolute', bottom: '75px', left: '12px', right: '80px' }}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: '4px 0' }}>Mombasa Support Vibra - 8 Videos • Tap video kucheza</p>
              <p style={{ fontSize: '12px' }}>🎵 Original Sound - @MrVibra</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav tab={tab} setTab={setTab} coins={coins} />
    </div>
  )
}

function BottomNav({ tab, setTab, coins }: any) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 10px' }}>
      <div onClick={() => setTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='home'?1:0.5 }}>
        <span style={{ fontSize: '22px' }}>🏠</span><span style={{ fontSize: '9px' }}>Home</span>
      </div>
      <div onClick={() => alert('Explore - videos zote')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
        <span style={{ fontSize: '22px' }}>🧭</span><span style={{ fontSize: '9px' }}>Explore</span>
      </div>
      <div onClick={() => alert('Upload - weka video yako!')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '2px 14px', color: 'black', fontSize: '24px', fontWeight: 'bold' }}>+</div>
        <span style={{ fontSize: '9px' }}>Upload</span>
      </div>
      <div onClick={() => setTab('inbox')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='inbox'?1:0.5 }}>
        <span style={{ fontSize: '22px' }}>📥</span><span style={{ fontSize: '9px' }}>Inbox</span>
      </div>
      <div onClick={() => setTab('me')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='me'?1:0.5 }}>
        <span style={{ fontSize: '22px' }}>👤</span><span style={{ fontSize: '9px' }}>Me</span>
      </div>
    </div>
  )
}
