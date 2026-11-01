import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraWithCamera,
})

function VibraWithCamera() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [coins, setCoins] = useState(18)
  const [dp, setDp] = useState("")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [likes, setLikes] = useState([12000,12000,12000,12000,12000,12000,12000,12000])
  const [liked, setLiked] = useState([false,false,false,false,false,false,false,false])
  const [saved, setSaved] = useState([false,false,false,false,false,false,false,false])
  const [isLiveOn, setIsLiveOn] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const liveVideoRef = useRef<HTMLVideoElement | null>(null)
  const uploadVideoRef = useRef<HTMLVideoElement | null>(null)

  const videos = [
    { id: 1, title: "VIBRA WORLDWIDE 🌍", user: "@MrVibra", poster: "https://picsum.photos/id/1015/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Vibra worldwide Mombasa to the world 🌍" },
    { id: 2, title: "Mombasa Support Vibra 💛", user: "@MrVibra", poster: "https://picsum.photos/id/1016/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Support Vibra 18 Coins 💛" },
    { id: 3, title: "Coast Life 🌊", user: "@CoastVibes", poster: "https://picsum.photos/id/1025/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Coast life yeah 🌊" },
    { id: 4, title: "Worldwide Vibes ✨", user: "@MrVibra", poster: "https://picsum.photos/id/1035/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Worldwide vibes ✨" },
    { id: 5, title: "Swahili Dance 💃", user: "@MrVibra", poster: "https://picsum.photos/id/1040/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Cheza cheza 💃" },
    { id: 6, title: "Beach Vibra 🏖️", user: "@BeachBoy", poster: "https://picsum.photos/id/1062/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Beach Vibra 🏖️" },
    { id: 7, title: "Mombasa Nights 🌙", user: "@MrVibra", poster: "https://picsum.photos/id/1074/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Mombasa nights 🌙" },
    { id: 8, title: "Vibra Forever ❤️", user: "@MrVibra", poster: "https://picsum.photos/id/1080/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Vibra forever ❤️" },
  ]

  useEffect(() => {
    const d = localStorage.getItem("vibra_dp"); if (d) setDp(d)
    const c = localStorage.getItem("vibra_coins"); if (c) setCoins(parseInt(c))
  }, [])

  // START CAMERA FUNCTION
  const startCamera = async (target: 'live' | 'upload') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
      setCameraStream(stream)
      setTimeout(() => {
        if (target === 'live' && liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream
          liveVideoRef.current.play()
          setIsLiveOn(true)
        }
        if (target === 'upload' && uploadVideoRef.current) {
          uploadVideoRef.current.srcObject = stream
          uploadVideoRef.current.play()
        }
      }, 200)
    } catch (err) {
      alert("⚠️ Camera imeshindwa: Ruhusu camera permission kwenye browser")
    }
  }

  const stopCamera = () => {
    if (cameraStream) { cameraStream.getTracks().forEach(t=>t.stop()); setCameraStream(null) }
    setIsLiveOn(false)
  }

  const handleLike = (idx:number) => {
    const newLiked = [...liked]; const newLikes = [...likes]
    newLiked[idx] = !newLiked[idx]; newLikes[idx] = newLiked[idx] ? newLikes[idx]+1 : newLikes[idx]-1
    setLiked(newLiked); setLikes(newLikes)
    if (newLiked[idx]) { const n=coins+1; setCoins(n); localStorage.setItem('vibra_coins', n.toString()) }
  }
  const handleSave = (idx:number) => { const s=[...saved]; s[idx]=!s[idx]; setSaved(s); alert(s[idx]?"🔖 Saved!":"❌ Unsaved") }
  const handleShare = async () => { try { await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!") } catch { prompt("Copy:", window.location.href) } }
  const handleDp = (e:any) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result) }; r.readAsDataURL(f) }

  // LIVE PAGE NA CAMERA HALISI
  if (tab === 'live') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {!isLiveOn ? (
          <div style={{ position: 'absolute', inset: 0, background: `url(${videos[0].poster}) center/cover`, filter: 'brightness(0.3)' }}></div>
        ) : null}
        <video ref={liveVideoRef} autoPlay muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: isLiveOn?'block':'none', background: 'black' }} />
        
        <div style={{ position: 'relative', zIndex: 2, padding: '45px 15px 70px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span onClick={()=>{ stopCamera(); setTab('home')}} style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>← Close</span>
            <span style={{ background: isLiveOn?'#ef4444':'#333', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', animation: isLiveOn?'pulse 1s infinite':'' }}>🔴 {isLiveOn?'LIVE NOW':'OFFLINE'} • 1.2K</span>
            <span onClick={handleShare} style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>↗️</span>
          </div>

          {!isLiveOn ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: dp?`url(${dp})`:'#333', backgroundSize: 'cover', border: '4px solid #ef4444' }}></div>
              <h2 style={{ margin: '15px 0 5px' }}>@MrVibra is ready to go LIVE!</h2>
              <p style={{ opacity: 0.8, fontSize: '13px' }}>Watu 1.2K wanasubiri Mombasa</p>
              <button onClick={()=>startCamera('live')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '16px 45px', borderRadius: '30px', fontWeight: 'bold', marginTop: '25px', fontSize: '18px', cursor: 'pointer' }}>📷 START CAMERA - Go LIVE</button>
              <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '10px' }}>Bonyeza ruhusu camera permission</p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '12px', padding: '12px', marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', margin: '4px 0' }}>💬 @CoastVibes: Bro uko live kali! 🔥</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}>💛 @MrVibra: Asante Mombasa!</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}>🎉 18 Coins gift!</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={stopCamera} style={{ background: 'white', color: 'black', border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold' }}>⏹️ Stop LIVE</button>
                <button onClick={handleShare} style={{ background: '#facc15', color: 'black', border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold' }}>↗️ Share LIVE</button>
              </div>
            </div>
          )}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
        <style>{`@keyframes pulse {0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}`}</style>
      </div>
    )
  }

  // UPLOAD PAGE NA CAMERA
  if (tab === 'upload') {
    return (
      <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={()=>{ stopCamera(); setTab('home')}} style={{ cursor: 'pointer' }}>← Cancel</span>
          <b>Upload Video</b>
          <span onClick={()=>{ stopCamera(); alert('✅ Video uploaded!'); setTab('me')}} style={{ color: '#facc15', fontWeight: 'bold', cursor: 'pointer' }}>Post</span>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ border: '2px dashed #333', borderRadius: '15px', overflow: 'hidden', background: '#111', position: 'relative', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video ref={uploadVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraStream?'block':'none' }} />
            {!cameraStream && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '50px' }}>📷</div>
                <p style={{ fontWeight: 'bold' }}>Camera au File</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px', flexWrap: 'wrap' }}>
                  <button onClick={()=>startCamera('upload')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>📷 Open Camera</button>
                  <label style={{ background: 'white', color: 'black', padding: '10px 18px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📁 Choose File
                    <input type="file" accept="video/*" hidden onChange={(e)=>{ if(e.target.files?.[0]) alert('✅ File chosen: '+e.target.files[0].name) }} />
                  </label>
                </div>
              </div>
            )}
            {cameraStream && <button onClick={stopCamera} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '15px', padding: '5px 10px', cursor: 'pointer' }}>✕ Close Camera</button>}
          </div>

          <div style={{ marginTop: '15px' }}>
            <input placeholder="Andika caption... VIBRA WORLDWIDE 🌍" style={{ width: '100%', background: '#222', border: 'none', borderRadius: '10px', padding: '14px', color: 'white', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="🎵 Add sound - Original Sound" style={{ width: '100%', background: '#222', border: 'none', borderRadius: '10px', padding: '14px', color: 'white', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '10px' }}>📷 Camera itafunguka ukibonyeza "Open Camera" - ruhusu permission</p>
          </div>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    )
  }

  if (tab === 'me') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', paddingBottom: '70px' }}><div style={{ padding: '45px 15px 10px', textAlign: 'center' }}><input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp} /><div onClick={()=>document.getElementById('dpMe')?.click()} style={{ width: '85px', height: '85px', borderRadius: '50%', border: '3px solid #facc15', margin: '0 auto', background: dp?`url(${dp})`:'#222', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{!dp && 'WEKA DP'}</div><h3 style={{ margin: '8px 0 2px' }}>@MrVibra</h3><p style={{ opacity: 0.6, fontSize: '13px' }}>Mombasa • 8 Videos • {coins} Coins</p><div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}><button onClick={handleShare} style={{ background: 'white', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 18px', fontWeight: 'bold', fontSize: '12px' }}>Share Profile</button></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', padding: '2px' }}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '3/4', backgroundImage: `url(${v.poster})`, backgroundSize: 'cover', padding: '5px', display: 'flex', alignItems: 'flex-end' }}><span style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '4px', padding: '2px 4px', fontSize: '10px' }}>▶️ {v.id}</span></div>)}</div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'inbox') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}><h2 style={{ margin: 0 }}>📥 Inbox</h2><div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}><div style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>🔴 @CoastVibes: "Bro video yako kali!" • 2m</div><div style={{ background: '#111', padding: '14px', borderRadius: '12px' }}>💛 System: Umepewa {coins} Coins! • 1h</div><div onClick={()=>setTab('live')} style={{ background: '#111', padding: '14px', borderRadius: '12px', cursor: 'pointer' }}>🎥 @MrVibra: Uko LIVE! • LIVE</div></div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'search') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 15px 70px' }}><div style={{ display: 'flex', gap: '10px' }}><span onClick={()=>setTab('home')} style={{ cursor: 'pointer' }}>←</span><input autoFocus placeholder="🔍 Tafuta..." style={{ flex: 1, background: '#222', border: 'none', borderRadius: '20px', padding: '12px 15px', color: 'white' }} /></div><div style={{ marginTop: '15px' }}>{videos.map(v=><div key={v.id} onClick={()=>{ setCurrentIdx(v.id-1); setTab('home')}} style={{ padding: '12px', background: '#111', margin: '8px 0', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><img src={v.poster} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} /><span>{v.title}</span></div>)}</div><BottomNav tab={tab} setTab={setTab} /></div>
  if (tab === 'explore') return <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '45px 2px 70px' }}><div style={{ padding: '0 12px', display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0 }}>🧭 Explore</h3><span onClick={()=>setTab('search')} style={{ cursor: 'pointer' }}>🔍</span></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '10px' }}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio: '9/16', backgroundImage: `url(${v.poster})`, backgroundSize: 'cover', padding: '8px', display: 'flex', alignItems: 'flex-end', cursor: 'pointer' }}><span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{v.title}</span></div>)}</div><BottomNav tab={tab} setTab={setTab} /></div>

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
            <video ref={(el)=>{ videoRefs.current[idx]=el }} src={vid.url} poster={vid.poster} loop muted playsInline preload="metadata" onClick={()=>{ const v=videoRefs.current[idx]; if(v) v.paused?v.play():v.pause() }} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            {showLyrics && currentIdx===idx && <div style={{ position: 'absolute', bottom: '200px', left: '12px', right: '75px', background: 'rgba(0,0,0,0.75)', padding: '10px', borderRadius: '10px', fontSize: '13px', zIndex: 20 }}>🎵 {vid.lyrics}</div>}
            <div style={{ position: 'absolute', right: '8px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="file" id={`dp${idx}`} hidden accept="image/*" onChange={handleDp} />
                <div onClick={()=>document.getElementById(`dp${idx}`)?.click()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #facc15', background: dp?`url(${dp})`:`url(${vid.poster})`, backgroundSize: 'cover', cursor: 'pointer' }}></div>
                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{vid.user}</span>
              </div>
              <div onClick={()=>handleLike(idx)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '32px' }}>{liked[idx]?'❤️':'🤍'}</div><div style={{ fontSize: '11px', fontWeight: 'bold' }}>{(likes[idx]/1000).toFixed(1)}K</div></div>
              <div onClick={()=>setShowComments(true)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '26px' }}>💬</div><div style={{ fontSize: '11px' }}>345</div></div>
              <div onClick={()=>handleSave(idx)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ fontSize: '24px' }}>{saved[idx]?'🔖':'📑'}</div><div style={{ fontSize: '9px', fontWeight: 'bold' }}>{saved[idx]?'Saved':'Save'}</div></div>
              <div onClick={()=>setShowLyrics(!showLyrics)} style={{ textAlign: 'center', cursor: 'pointer', background: showLyrics?'#facc15':'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 6px' }}><div style={{ fontSize: '18px' }}>🎵</div><div style={{ fontSize: '8px', fontWeight: 'bold', color: showLyrics?'black':'white' }}>Lyrics</div></div>
              <div onClick={handleShare} style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 8px', border: '1px solid rgba(255,255,255,0.3)' }}><div style={{ fontSize: '22px' }}>↗️</div><div style={{ fontSize: '10px', fontWeight: 'bold' }}>Share</div></div>
            </div>
            <div style={{ position: 'absolute', bottom: '75px', left: '12px', right: '75px' }}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{vid.title}</p>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: '3px 0' }}>Mombasa Support • {likes[idx]} likes • Tap video</p>
            </div>
          </div>
        ))}
      </div>
      {showComments && <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }} onClick={()=>setShowComments(false)}><div style={{ background: '#111', width: '100%', maxHeight: '70vh', borderRadius: '15px 15px 0 0', padding: '15px' }} onClick={e=>e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between' }}><b>💬 Comments 345</b><span onClick={()=>setShowComments(false)} style={{ cursor: 'pointer' }}>✕</span></div><div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}><div style={{ background: '#222', padding: '10px', borderRadius: '8px' }}><b>@CoastVibes:</b> Bro video kali sana! 🔥</div></div></div></div>}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

function BottomNav({ tab, setTab }: any) {
  return <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0 8px' }}><div onClick={()=>setTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='home'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🏠</span><span style={{ fontSize: '9px' }}>Home</span></div><div onClick={()=>setTab('explore')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='explore'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🧭</span><span style={{ fontSize: '9px' }}>Explore</span></div><div onClick={()=>setTab('upload')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: tab==='upload'?1:0.6 }}><div style={{ background: 'white', borderRadius: '8px', padding: '2px 14px', color: 'black', fontSize: '22px', fontWeight: 'bold' }}>+</div><span style={{ fontSize: '9px' }}>Upload</span></div><div onClick={()=>setTab('inbox')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='inbox'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>📥</span><span style={{ fontSize: '9px' }}>Inbox</span></div><div onClick={()=>setTab('me')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: tab==='me'?1:0.5, cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>👤</span><span style={{ fontSize: '9px' }}>Me</span></div></div>
}
