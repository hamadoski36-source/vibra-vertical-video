import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: TikTokReal,
})

function TikTokReal() {
  const [page, setPage] = useState("home")
  const [tab, setTab] = useState("foryou")
  const [isLive, setIsLive] = useState(false)
  const [muted, setMuted] = useState(true)
  const homeVideoRef = useRef<HTMLVideoElement>(null)
  const liveRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const allVideos = [
    { id: 1, user: "@MrVibra", likes: "12k", cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", following: true },
    { id: 2, user: "@CoastQueen", likes: "8.5k", cap: "Coast vibes 💃🔥", tag: "#coast #dance", url: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", following: true },
    { id: 3, user: "@BeachBoy", likes: "15k", cap: "Beach life Mombasa", tag: "#beach #kenya", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", following: false },
  ]
  const [idx, setIdx] = useState(0)
  const vids = tab === "following" ? allVideos.filter(v=>v.following) : allVideos
  const current = vids[idx % vids.length]

  // VIDEO INACHEZA KWELI
  useEffect(() => {
    if (page === "home" && homeVideoRef.current) {
      homeVideoRef.current.load()
      homeVideoRef.current.play().catch(()=>{})
    }
  }, [idx, tab, page, muted])

  // LIVE CAMERA HALISI
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })
      streamRef.current = stream
      if (liveRef.current) {
        liveRef.current.srcObject = stream
        await liveRef.current.play()
      }
      setIsLive(true)
    } catch {
      alert("Ruhusu Camera: Settings > Chrome > Camera > Allow")
    }
  }
  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
    setIsLive(false)
    setPage("home")
  }

  // ========== PAGE ME ==========
  if (page === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "15px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#facc15", margin: "10px auto", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: "bold", fontSize: "24px" }}>V</div>
          <h3>@MrVibra</h3><p style={{ fontSize: "12px", opacity: 0.6 }}>Mombasa, Kenya 🇰🇪 • 89 Following • 1.2k Followers</p>
          <button style={{ marginTop: "10px", background: "white", color: "black", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: "bold" }}>Edit profile</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", marginTop: "10px" }}>
          {allVideos.map((v,i)=><div key={v.id} onClick={()=>{ setIdx(i); setPage("home") }} style={{ aspectRatio: "3/4", background: "#222" }}><video src={v.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>)}
        </div>
        <Nav page={page} setPage={setPage} />
      </div>
    )
  }

  // ========== PAGE LIVE NA CAMERA HALISI ==========
  if (page === "live") {
    return (
      <div style={{ background: "black", width: "100vw", height: "100vh", position: "relative" }}>
        <video ref={liveRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: isLive ? "scaleX(-1)" : "none", background: "#111" }} />
        {!isLive ? (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "50px" }}>📷</div><h2 style={{ color: "white" }}>Go LIVE</h2><p style={{ color: "#aaa", fontSize: "12px" }}>Camera yako itawaka</p>
            <button onClick={startCamera} style={{ marginTop: "15px", background: "#ef4444", color: "white", border: "none", padding: "14px 30px", borderRadius: "25px", fontWeight: "bold" }}>🔴 ANZA LIVE</button>
            <button onClick={()=>setPage("home")} style={{ marginTop: "10px", background: "transparent", color: "white", border: "1px solid #555", padding: "8px 20px", borderRadius: "20px" }}>Back</button>
          </div>
        ) : (
          <>
            <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between" }}>
              <button onClick={stopCamera} style={{ background: "rgba(0,0,0,0.5)", color: "white", border: "none", padding: "6px 12px", borderRadius: "20px" }}>✕ Close</button>
              <div style={{ background: "#ef4444", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>🔴 LIVE • 1 viewer</div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: "10px", right: "10px", display: "flex", gap: "10px" }}>
              <input placeholder="Comment..." style={{ flex: 1, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} />
              <button onClick={stopCamera} style={{ background: "#ef4444", color: "white", border: "none", padding: "10px 18px", borderRadius: "20px", fontWeight: "bold" }}>End</button>
            </div>
          </>
        )}
      </div>
    )
  }

  if (page === "search") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "10px", display: "flex", gap: "10px" }}><span onClick={()=>setPage("home")}>←</span><input autoFocus placeholder="Search..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} /></div>
        <p style={{ padding: "15px" }}>Trending: #vibra #mombasa #kenya</p>
        <Nav page={page} setPage={setPage} />
      </div>
    )
  }

  if (page === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span onClick={()=>setPage("home")}>✕</span><b>Upload</b><span onClick={()=>setPage("home")} style={{ color: "#facc15" }}>Post</span></div>
        <div style={{ marginTop: "20px", background: "#222", padding: "30px", borderRadius: "12px", textAlign: "center" }}>Chagua video yako hapa</div>
        <Nav page={page} setPage={setPage} />
      </div>
    )
  }

  // ========== HOME - VIDEO INACHEZA KWELI ==========
  return (
    <div style={{ background: "black", height: "100dvh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* TOP TAB - INAFANYA KAZI KWELI */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", gap: "25px", padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <span onClick={()=>{ setTab("following"); setIdx(0) }} style={{ color: tab==="following" ? "white" : "#888", fontWeight: tab==="following" ? "bold" : "normal", borderBottom: tab==="following" ? "2px solid white" : "none", cursor: "pointer" }}>Following</span>
        <span onClick={()=>{ setTab("foryou"); setIdx(0) }} style={{ color: tab==="foryou" ? "white" : "#888", fontWeight: tab==="foryou" ? "bold" : "normal", borderBottom: tab==="foryou" ? "2px solid white" : "none", cursor: "pointer" }}>For You</span>
      </div>

      <video 
        ref={homeVideoRef}
        src={current.url}
        autoPlay
        loop
        muted={muted}
        playsInline
        onClick={()=>setMuted(!muted)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div style={{ position: "absolute", top: "50px", right: "10px", zIndex: 40, background: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "15px", fontSize: "11px", color: "white" }} onClick={()=>setMuted(!muted)}>
        {muted ? "🔇 Tap for sound" : "🔊"}
      </div>

      {/* SWIPE UP/DOWN */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "40%", bottom: "40%", zIndex: 10 }} 
        onTouchEnd={(e)=>{
          // simple swipe
          const touch = e.changedTouches[0]
          if (touch.clientY < 200) setIdx(i=>i+1)
        }}
      />

      <div style={{ position: "absolute", bottom: "80px", left: "10px", right: "70px", color: "white" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>{current.user}</p>
        <p style={{ margin: "4px 0", fontSize: "13px" }}>{current.cap}</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#facc15" }}>{current.tag}</p>
        <p style={{ fontSize: "11px", marginTop: "8px" }}>⬆️ Swipe up for next video • Tap video for sound</p>
      </div>

      <div style={{ position: "absolute", right: "6px", bottom: "80px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", zIndex: 30 }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>V</div>
        <div><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>❤️</div><div style={{ color: "white", fontSize: "10px", textAlign: "center" }}>{current.likes}</div></div>
        <div onClick={()=>setIdx(i=>i+1)} style={{ cursor: "pointer" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center" }}>⬇️</div><div style={{ color: "white", fontSize: "9px", textAlign: "center" }}>Next</div></div>
        <div onClick={()=>setPage("live")} style={{ cursor: "pointer" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>🔴</div><div style={{ color: "white", fontSize: "9px", textAlign: "center" }}>LIVE</div></div>
      </div>

      <Nav page={page} setPage={setPage} />
    </div>
  )
}

function Nav({ page, setPage }: any) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 100 }}>
      <span onClick={()=>setPage("home")} style={{ color: page==="home" ? "#facc15" : "white", cursor: "pointer" }}>🏠 Home</span>
      <span onClick={()=>setPage("search")} style={{ color: page==="search" ? "#facc15" : "white", cursor: "pointer" }}>🔍 Search</span>
      <span onClick={()=>setPage("upload")} style={{ background: "white", color: "black", padding: "2px 12px", borderRadius: "6px", cursor: "pointer" }}>+</span>
      <span onClick={()=>setPage("live")} style={{ color: page==="live" ? "#facc15" : "white", cursor: "pointer" }}>📺 LIVE</span>
      <span onClick={()=>setPage("me")} style={{ color: page==="me" ? "#facc15" : "white", cursor: "pointer" }}>👤 Me</span>
    </div>
  )
}
