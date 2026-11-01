import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixedFinal,
})

function VibraFixedFinal() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [coins, setCoins] = useState(18)
  const [dp, setDp] = useState("")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [liked, setLiked] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Picha + Video ndogo zinazofanya kazi Mombasa
  const videos = [
    { id: 1, title: "VIBRA WORLDWIDE 🌍", user: "@MrVibra", poster: "https://picsum.photos/id/1015/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Vibra worldwide Mombasa to the world 🌍" },
    { id: 2, title: "Mombasa Support Vibra 💛", user: "@MrVibra", poster: "https://picsum.photos/id/1016/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Support Vibra 18 Coins tunapanda 💛" },
    { id: 3, title: "Coast Life 🌊 8 Videos", user: "@CoastVibes", poster: "https://picsum.photos/id/1025/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Coast life yeah Mombasa nights 🌊" },
    { id: 4, title: "Worldwide Vibes ✨", user: "@MrVibra", poster: "https://picsum.photos/id/1035/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Worldwide vibes Vibra forever ✨" },
    { id: 5, title: "Swahili Dance 💃", user: "@MrVibra", poster: "https://picsum.photos/id/1040/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Cheza cheza Vibra dance 💃" },
    { id: 6, title: "Beach Vibra 🏖️", user: "@BeachBoy", poster: "https://picsum.photos/id/1062/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Beach Vibra Mombasa beach 🏖️" },
    { id: 7, title: "Mombasa Nights 🌙", user: "@MrVibra", poster: "https://picsum.photos/id/1074/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Mombasa nights stars shining 🌙" },
    { id: 8, title: "Vibra Forever ❤️", user: "@MrVibra", poster: "https://picsum.photos/id/1080/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Vibra forever tunabaki juu ❤️" },
  ]

  useEffect(() => {
    const d = localStorage.getItem("vibra_dp"); if (d) setDp(d)
    const c = localStorage.getItem("vibra_coins"); if (c) setCoins(parseInt(c))
  }, [])

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied! - " + window.location.href) } catch { prompt("Copy link:", window.location.href) }
  }
  const handleDp = (e:any) => {
    const f = e.target.files[0]; if(!f) return
    const r = new FileReader(); r.onload = (ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result) }; r.readAsDataURL(f)
  }

  const playVideo = (idx:number) => {
    const v = videoRefs.current[idx]; if(!v) return
    if (v.paused) v.play().catch(()=>{}); else v.pause()
  }

  // ME PAGE - NA PICHA SIO NYEUSI
  if (tab === 'me') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', paddingBottom: '70px' }}>
        <div style={{ padding: '45px 15px 10px', textAlign: 'center' }}>
          <input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp} />
          <div onClick={()=>document.getElementById('dpMe')?.click()} style={{ width: '85px', height: '85px', borderRadius: '50%', border: '3px solid #facc15', margin: '0 auto', background: dp?`url(${dp})`:'#222', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{!dp && 'WEKA DP'}</div>
          <h3 style={{ margin: '8px 0 2px' }}>@MrVibra</h3>
          <p style={{ opacity: 0.6, fontSize: '13px' }}>Mombasa • 8 Videos • {coins} Coins</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={handleShare} style={{ background: 'white', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 18px', fontWeight: 'bold', fontSize: '12px' }}>Share Profile</button>
            <button onClick={()=>{ const n=coins+5; setCoins(n); localStorage.setItem('vibra_coins', n.toString()) }} style={{ background: '#facc15', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 18px', fontWeight: 'bold', fontSize: '12px' }}>+5 Coins</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '10px 0', marginTop: '10px', fontSize: '13px' }}>
          <span style={{ fontWeight: 'bold', borderBottom: '2px solid white' }}>🎬 8 Videos</span><span>❤️ 12K Likes</span><span>🔒 Private</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', padding: '2px' }}>
          {videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '3/4', backgroundImage: `url(${v.poster})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '5px' }}><span style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '4px', padding: '2px 4px', fontSize: '10px' }}>▶️ {v.id}</span></div>)}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  if (tab === 'inbox') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}><h2 style={{ margin: 0 }}>📥 Inbox</h2><p style={{ opacity: 0.6, fontSize: '13px' }}>Ujumbe wako wa Vibra</p><div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}><div style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>🔴 @CoastVibes: "Bro video yako kali!" • 2m ago</div><div style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>💛 System: Umepewa {coins} Coins! • 1h ago</div><div onClick={()=>setTab('live')} style={{ background: '#111', padding: '14px', borderRadius: '12px', cursor: 'pointer' }}>🎥 @MrVibra: Uko LIVE sasa! Bonyeza kuingia • LIVE</div></div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'search') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}><div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span onClick={()=>setTab('home')} style={{ fontSize: '20px', cursor: 'pointer' }}>←</span><input autoFocus placeholder="🔍 Tafuta video..." style={{ flex: 1, background: '#222', border: 'none', borderRadius: '20px', padding: '12px 15px', color: 'white' }} /></div><div style={{ marginTop: '15px' }}>{videos.map(v=><div key={v.id} onClick={()=>{ setCurrentIdx(v.id-1); setTab('home')}} style={{ padding: '12px', background: '#111', margin: '8px 0', borderRadius: '10px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}><img src={v.poster} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} /><span>🔍 {v.title}</span></div>)}</div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'live') return <div style={{ background: '#111', color: 'white', minHeight: '100vh', padding: '45px 15px 70px', textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span onClick={()=>setTab('home')} style={{ cursor: 'pointer' }}>← Back</span><span style={{ background: '#ef4444', padding: '5px 12px', borderRadius: '15px', fontSize: '12px' }}>🔴 LIVE • 1.2K</span></div><div style={{ marginTop: '50px' }}><div style={{ width: '100px', height: '100px', borderRadius: '50%', background: dp?`url(${dp})`:'#333', backgroundSize: 'cover', margin: '0 auto', border: '3px solid #ef4444' }}></div><h2>@MrVibra is LIVE!</h2><p>Mombasa Support Vibra</p><button onClick={()=>setTab('home')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold', marginTop: '15px' }}>Watch LIVE</button></div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'explore') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 2px 70px' }}><div style={{ padding: '0 12px', display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0 }}>🧭 Explore</h3><span onClick={()=>setTab('search')} style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</span></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '10px' }}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '9/16', backgroundImage: `url(${v.poster})`, backgroundSize: 'cover', position: 'relative', padding: '8px', display: 'flex', alignItems: 'flex-end' }}><span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{v.title}</span></div>)}</div><BottomNav tab={tab} setTab={setTab} /></div>

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
          <div key={vid.id} style={{ height: '100vh', width: '100vw', scrollSnapAlign: 'start', position: 'relative', background: `url(${vid.poster}) center/cover no-repeat #000` }}>
            <video
              ref={(el)=>{ videoRefs.current[idx]=el }}
              src={vid.url}
              poster={vid.poster}
              loop
              muted
              playsInline
              preload="metadata"
              onClick={()=>playVideo(idx)}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            {showLyrics && currentIdx===idx && <div style={{ position: 'absolute', bottom: '210px', left: '12px', right: '75px', background: 'rgba(0,0,0,0.75)', padding: '10px', borderRadius: '10px', fontSize: '13px', zIndex: 20 }}>🎵 {vid.lyrics}</div>}
            <div style={{ position: 'absolute', right: '8px', bottom: '75px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id={`dp${idx}`} hidden accept="image/*" onChange={handleDp} />
                <div onClick={()=>document.getElementById(`dp${idx}`)?.click()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #facc15', background: dp?`url(${dp})`:`url(${vid.poster})`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}></div>
                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{vid.user}</span>
              </div>
              <div onClick={()=>{ setLiked(!liked); const n=coins+(liked? -1:1); setCoins(n); localStorage.setItem('vibra_coins', n.toString()) }} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '30px' }}>{liked?'❤️':'🤍'}</div><div style={{ fontSize: '11px', fontWeight: 'bold' }}>{liked?'12.1K':'12K'}</div></div>
              <div onClick={()=>setShowComments(true)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '26px' }}>💬</div><div style={{ fontSize: '11px' }}>345</div></div>
              <div onClick={()=>setShowLyrics(!showLyrics)} style={{ textAlign: 'center', cursor: 'pointer', background: showLyrics?'#facc15':'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 6px' }}><div style={{ fontSize: '18px' }}>🎵</div><div style={{ fontSize: '8px', fontWeight: 'bold', color: showLyrics?'black':'white' }}>Lyrics</div></div>
              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '24px' }}>↗️</div><div style={{ fontSize: '10px', fontWeight: 'bold' }}>Share</div></div>
            </div>
            <div style={{ position: 'absolute', bottom: '70px', left: '12px', right: '70px' }}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: '3px 0' }}>Mombasa Support Vibra • Tap video kucheza</p>
              <p style={{ fontSize: '11px' }}>🎵 {vid.user} • Original Sound</p>
            </div>
          </div>
        ))}
      </div>

      {showComments && <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }} onClick={()=>setShowComments(false)}><div style={{ background: '#111', width: '100%', maxHeight: '70vh', borderRadius: '15px 15px 0 0', padding: '15px', overflowY: 'auto' }} onClick={e=>e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>💬 Comments 345</b><span onClick={()=>setShowComments(false)} style={{ fontSize: '20px', cursor: 'pointer' }}>✕</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@CoastVibes:</b> Bro video kali sana! 🔥</div><div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@MrVibra:</b> Asante Mombasa 💛</div><div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@BeachBoy:</b> Vibra worldwide 🌍</div></div><div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}><input placeholder="Andika comment..." style={{ flex: 1, background: '#222', border: 'none', borderRadius: '20px', padding: '10px 12px', color: 'white' }} /><button onClick={()=>setShowComments(false)} style={{ background: '#facc15', border: 'none', borderRadius: '20px', padding: '10px 15px', fontWeight: 'bold' }}>Tuma</button></div></div></div>}

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

function BottomNav({ tab, setTab }: any) {
  return <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0 8px' }}><div onClick={()=>setTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='home'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🏠</span><span style={{ fontSize: '9px' }}>Home</span></div><div onClick={()=>setTab('explore')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='explore'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🧭</span><span style={{ fontSize: '9px' }}>Explore</span></div><div onClick={()=>alert('Upload - Hapa utaweka video yako! 🎬')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}><div style={{ background: 'white', borderRadius: '8px', padding: '2px 14px', color: 'black', fontSize: '22px', fontWeight: 'bold' }}>+</div><span style={{ fontSize: '9px' }}>Upload</span></div><div onClick={()=>setTab('inbox')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='inbox'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>📥</span><span style={{ fontSize: '9px' }}>Inbox</span></div><div onClick={()=>setTab('me')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='me'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>👤</span><span style={{ fontSize: '9px' }}>Me</span></div></div>
}
