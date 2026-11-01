import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraReal,
})

function VibraReal() {
  const [tab, setTab] = useState('home') // home | explore | inbox | me | search | live
  const [showComments, setShowComments] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [coins, setCoins] = useState(16)
  const [dp, setDp] = useState("")
  const [currentIdx, setCurrentIdx] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Video halisi zinazofanya kazi Kenya - kutoka Google
  const videos = [
    { id: 1, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", title: "VIBRA WORLDWIDE 🌍 Mombasa", user: "@MrVibra", lyrics: "Vibra worldwide... Mombasa to the world 🌍" },
    { id: 2, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", title: "Mombasa Support Vibra 💛 16 Coins", user: "@MrVibra", lyrics: "Support Vibra... Tunapanda juu 💛" },
    { id: 3, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Coast Life 🌊 8 Videos", user: "@CoastVibes", lyrics: "Coast life yeah... Mombasa nights" },
    { id: 4, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Worldwide Vibes ✨", user: "@MrVibra", lyrics: "Worldwide vibes... Vibra forever" },
    { id: 5, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", title: "Swahili Dance 💃", user: "@MrVibra", lyrics: "Cheza cheza... Vibra dance" },
    { id: 6, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title: "Beach Vibra 🏖️", user: "@BeachBoy", lyrics: "Beach vibra... Mombasa beach" },
    { id: 7, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", title: "Mombasa Nights 🌙", user: "@MrVibra", lyrics: "Mombasa nights... Stars shining" },
    { id: 8, url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", title: "Vibra Forever ❤️", user: "@MrVibra", lyrics: "Vibra forever... Tunabaki juu ❤️" },
  ]

  useEffect(() => {
    const d = localStorage.getItem("vibra_dp")
    if (d) setDp(d)
    const c = localStorage.getItem("vibra_coins")
    if (c) setCoins(parseInt(c))
  }, [])

  useEffect(() => {
    // Cheza video ya sasa
    videoRefs.current.forEach((v,i) => {
      if (!v) return
      if (i === currentIdx) v.play().catch(()=>{})
      else v.pause()
    })
  }, [currentIdx, tab])

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!") } catch { prompt("Copy:", window.location.href) }
  }
  const handleDp = (e:any) => {
    const f = e.target.files[0]; if(!f) return
    const r = new FileReader(); r.onload = (ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result) }; r.readAsDataURL(f)
  }

  // SEARCH PAGE
  if (tab === 'search') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '50px 15px 70px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span onClick={()=>setTab('home')} style={{ fontSize: '20px' }}>←</span>
          <input autoFocus placeholder="🔍 Tafuta video, user..." style={{ flex:1, background: '#222', border: 'none', borderRadius: '20px', padding: '12px 15px', color: 'white' }} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <p style={{ opacity:0.6 }}>Trending Mombasa</p>
          {videos.map(v=><div key={v.id} onClick={()=>{ setCurrentIdx(v.id-1); setTab('home')}} style={{ padding: '12px', background: '#111', margin: '8px 0', borderRadius: '10px' }}>🔍 {v.title}</div>)}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  // LIVE PAGE
  if (tab === 'live') {
    return (
      <div style={{ background: '#111', color: 'white', minHeight: '100vh', padding: '50px 15px 70px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span onClick={()=>setTab('home')} style={{ fontSize: '20px' }}>← Back</span>
          <span style={{ background: '#ef4444', padding: '5px 12px', borderRadius: '15px', fontSize: '12px' }}>🔴 LIVE • 1.2K viewers</span>
        </div>
        <div style={{ marginTop: '60px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: dp?`url(${dp})`:'#333', backgroundSize: 'cover', margin: '0 auto', border: '3px solid #ef4444' }}></div>
          <h2>@MrVibra is LIVE!</h2>
          <p>Mombasa Support Vibra - 8 Videos</p>
          <button onClick={()=>setTab('home')} style={{ marginTop: '20px', background: '#ef4444', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold' }}>Join LIVE</button>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  // ME PAGE - SI PICHA, NI PAGE HALISI
  if (tab === 'me') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', paddingBottom: '70px' }}>
        <div style={{ padding: '45px 15px 15px', display: 'flex', justifyContent: 'space-between' }}>
          <span onClick={()=>setTab('home')}>←</span>
          <span style={{ fontWeight: 'bold' }}>@MrVibra</span>
          <span onClick={handleShare}>↗️</span>
        </div>
        <div style={{ textAlign: 'center', padding: '10px 15px' }}>
          <input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp} />
          <div onClick={()=>document.getElementById('dpMe')?.click()} style={{ width: '85px', height: '85px', borderRadius: '50%', border: '3px solid #facc15', margin: '0 auto', background: dp?`url(${dp})`:'#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{!dp && 'WEKA DP'}</div>
          <h3 style={{ margin: '8px 0 2px' }}>@MrVibra</h3>
          <p style={{ opacity: 0.6, fontSize: '13px', margin: 0 }}>Mombasa • 8 Videos • {coins} Coins</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
            <button onClick={handleShare} style={{ background: 'white', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 18px', fontWeight: 'bold', fontSize: '12px' }}>Share Profile</button>
            <button onClick={()=>{ const n=coins+5; setCoins(n); localStorage.setItem('vibra_coins', n.toString()) }} style={{ background: '#facc15', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 18px', fontWeight: 'bold', fontSize: '12px' }}>+5 Coins</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '10px 0', marginTop: '10px', fontSize: '13px' }}>
          <span style={{ fontWeight: 'bold', borderBottom: '2px solid white', paddingBottom: '4px' }}>🎬 8 Videos</span><span style={{ opacity: 0.5 }}>❤️ 12K Likes</span><span style={{ opacity: 0.5 }}>🔒 Private</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', padding: '2px' }}>
          {videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '3/4', background: '#111', display: 'flex', alignItems: 'flex-end', padding: '6px', fontSize: '10px', backgroundImage: `linear-gradient(transparent, black)`, position: 'relative' }}><span>▶️ {v.id}</span></div>)}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  // INBOX PAGE
  if (tab === 'inbox') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}>
        <h2 style={{ margin: '0 0 5px' }}>📥 Inbox</h2>
        <p style={{ opacity: 0.6, fontSize: '13px', margin: '0 0 15px' }}>Ujumbe wako wa Vibra</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div onClick={()=>setShowComments(true)} style={{ background: '#111', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}><span>🔴 @CoastVibes: "Bro video yako kali!"</span><span style={{ opacity: 0.5, fontSize: '11px' }}>2m</span></div>
          <div style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>💛 System: Umepewa {coins} Coins! • 1h ago</div>
          <div onClick={()=>setTab('live')} style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>🎥 @MrVibra: Uko LIVE sasa! Bonyeza kuingia • LIVE</div>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  // EXPLORE PAGE
  if (tab === 'explore') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 2px 70px' }}>
        <div style={{ padding: '0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>🧭 Explore</h3><span onClick={()=>setTab('search')} style={{ fontSize: '20px' }}>🔍</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '10px' }}>
          {videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '9/16', background: '#111', display: 'flex', alignItems: 'flex-end', padding: '8px', fontSize: '12px' }}>{v.title}</div>)}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  // HOME PAGE - VIDEO INACHEZA, SIO PICHA
  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <div onClick={()=>setTab('live')} style={{ background: '#ef4444', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>● LIVE • 1.2K</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span onClick={()=>setTab('search')} style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</span>
          <span style={{ color: '#facc15', fontWeight: 'bold', fontSize: '13px' }}>{coins} Coins</span>
        </div>
      </div>

      <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }} onScroll={(e:any)=>{ const idx=Math.round(e.target.scrollTop/window.innerHeight); if(idx!==currentIdx) setCurrentIdx(idx) }}>
        {videos.map((vid, idx) => (
          <div key={vid.id} style={{ height: '100vh', width: '100vw', scrollSnapAlign: 'start', position: 'relative', background: '#000' }}>
            <video
              ref={(el)=>{ videoRefs.current[idx]=el }}
              src={vid.url}
              loop
              muted
              playsInline
              autoPlay={idx===0}
              preload="auto"
              onClick={(e:any)=>{ const v=e.target; v.paused?v.play():v.pause() }}
              style={{ height: '100%', width: '100%', objectFit: 'cover', background: '#000' }}
            />
            
            {showLyrics && currentIdx===idx && <div style={{ position: 'absolute', bottom: '210px', left: '12px', right: '75px', background: 'rgba(0,0,0,0.75)', padding: '10px', borderRadius: '10px', fontSize: '13px', zIndex: 20 }}>🎵 {vid.lyrics}</div>}

            <div style={{ position: 'absolute', right: '8px', bottom: '75px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id={`dp${idx}`} hidden accept="image/*" onChange={handleDp} />
                <div onClick={()=>document.getElementById(`dp${idx}`)?.click()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #facc15', background: dp?`url(${dp})`:'#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}>{!dp && 'DP'}</div>
                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{vid.user}</span>
              </div>
              <div onClick={()=>{ setCoins(c=>{ const n=c+1; localStorage.setItem('vibra_coins', n.toString()); return n }) }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '30px' }}>❤️</div><div style={{ fontSize: '11px', fontWeight: 'bold' }}>12K</div>
              </div>
              <div onClick={()=>setShowComments(true)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '26px' }}>💬</div><div style={{ fontSize: '11px' }}>345</div>
              </div>
              <div onClick={()=>setShowLyrics(!showLyrics)} style={{ textAlign: 'center', cursor: 'pointer', background: showLyrics?'#facc15':'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 6px' }}>
                <div style={{ fontSize: '18px' }}>🎵</div><div style={{ fontSize: '8px', fontWeight: 'bold', color: showLyrics?'black':'white' }}>Lyrics</div>
              </div>
              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px' }}>↗️</div><div style={{ fontSize: '10px', fontWeight: 'bold' }}>Share</div>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '70px', left: '12px', right: '70px' }}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: '3px 0' }}>Mombasa Support Vibra • Tap video kucheza/pause</p>
              <p style={{ fontSize: '11px' }}>🎵 {vid.user} • Original Sound</p>
            </div>
          </div>
        ))}
      </div>

      {showComments && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }} onClick={()=>setShowComments(false)}>
          <div style={{ background: '#111', width: '100%', maxHeight: '70vh', borderRadius: '15px 15px 0 0', padding: '15px', overflowY: 'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>💬 Comments 345</b><span onClick={()=>setShowComments(false)} style={{ fontSize: '20px' }}>✕</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@CoastVibes:</b> Bro video kali sana! 🔥</div>
              <div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@MrVibra:</b> Asante Mombasa 💛</div>
              <div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@BeachBoy:</b> Vibra worldwide 🌍</div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}><input placeholder="Andika comment..." style={{ flex: 1, background: '#222', border: 'none', borderRadius: '20px', padding: '10px 12px', color: 'white' }} /><button style={{ background: '#facc15', border: 'none', borderRadius: '20px', padding: '10px 15px', fontWeight: 'bold' }}>Tuma</button></div>
          </div>
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

function BottomNav({ tab, setTab }: any) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0 8px' }}>
      <div onClick={()=>setTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='home'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🏠</span><span style={{ fontSize: '9px' }}>Home</span></div>
      <div onClick={()=>setTab('explore')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='explore'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🧭</span><span style={{ fontSize: '9px' }}>Explore</span></div>
      <div onClick={()=>alert('Upload - Hapa utaweka video yako ya Mombasa! 🎬')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}><div style={{ background: 'white', borderRadius: '8px', padding: '2px 14px', color: 'black', fontSize: '22px', fontWeight: 'bold' }}>+</div><span style={{ fontSize: '9px' }}>Upload</span></div>
      <div onClick={()=>setTab('inbox')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='inbox'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>📥</span><span style={{ fontSize: '9px' }}>Inbox</span></div>
      <div onClick={()=>setTab('me')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='me'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>👤</span><span style={{ fontSize: '9px' }}>Me</span></div>
    </div>
  )
}
