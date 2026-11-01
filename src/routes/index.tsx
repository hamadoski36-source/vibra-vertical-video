import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraLiveCamera,
})

function VibraLiveCamera() {
  const [page, setPage] = useState("home")
  const [isLive, setIsLive] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const liveVideoRef = useRef<HTMLVideoElement>(null)
  const homeVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [video, setVideo] = useState({
    like: 12001, liked: true,
    cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  })

  // ZIMA VIDEO YA HOME UKIENDA LIVE
  useEffect(() => {
    if (page !== "home" && homeVideoRef.current) {
      homeVideoRef.current.pause()
    }
    if (page !== "live" && streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
      setIsLive(false)
    }
  }, [page])

  // ANZA CAMERA YA LIVE
  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      })
      streamRef.current = stream
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream
        await liveVideoRef.current.play()
      }
      setIsLive(true)
    } catch (err) {
      alert("❌ Camera imekataliwa! Ruhusu camera kwenye Settings > Browser > Camera")
      console.log(err)
    }
  }

  const stopLive = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setIsLive(false)
    setPage("home")
  }

  if (page === "live") {
    return (
      <div style={{ background: "black", color: "white", height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
        {/* CAMERA INAONYESHA HAPA */}
        <video 
          ref={liveVideoRef}
          autoPlay 
          muted 
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", background: "#111", transform: "scaleX(-1)" }} 
        />

        {!isLive && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ width: "80px", height: "80px", background: "#222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>📷</div>
            <h3 style={{ marginTop: "15px" }}>Uko tayari kwenda LIVE?</h3>
            <p style={{ fontSize: "12px", opacity: 0.6, textAlign: "center", marginTop: "5px" }}>Camera yako ya mbele itawaka. Watu wa Mombasa watakuona live</p>
            <button onClick={startLive} style={{ marginTop: "20px", background: "#ef4444", color: "white", border: "none", padding: "14px 35px", borderRadius: "30px", fontWeight: "bold", fontSize: "16px" }}>🔴 ANZA LIVE</button>
            <button onClick={()=>setPage("home")} style={{ marginTop: "15px", background: "transparent", color: "white", border: "1px solid #444", padding: "10px 25px", borderRadius: "20px" }}>Rudi Home</button>
          </div>
        )}

        {/* TOP BAR YA LIVE */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}>
          <span onClick={stopLive} style={{ background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: "20px", fontSize: "13px", cursor: "pointer" }}>✕ Close</span>
          {isLive && <div style={{ background: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", background: "white", borderRadius: "50%", display: "inline-block" }}></span> LIVE • 0 viewers</div>}
          <span style={{ background: "rgba(0,0,0,0.5)", padding: "6px 10px", borderRadius: "20px", fontSize: "14px" }}>🔄</span>
        </div>

        {isLive && (
          <>
            <div style={{ position: "absolute", bottom: "100px", left: "12px", right: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <img src="https://i.pravatar.cc/100?img=5" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
                <div><p style={{ margin: 0, fontSize: "12px", fontWeight: "bold" }}>Coast Queen alijiunga</p><p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>Mombasa 🔥</p></div>
              </div>
              <p style={{ marginTop: "10px", fontSize: "13px" }}>Karibu LIVE yangu! {video.tag}</p>
            </div>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px", display: "flex", gap: "10px", alignItems: "center", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <input placeholder="Add comment..." style={{ flex: 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px", padding: "10px 15px", color: "white" }} />
              <button onClick={stopLive} style={{ background: "#ef4444", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold" }}>End LIVE</button>
            </div>
          </>
        )}
      </div>
    )
  }

  // HOME NA VIDEO MOJA TU NA SAUTI
  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <span style={{ fontSize: "18px", background: "rgba(255,255,255,0.2)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔍</span>
        <div style={{ display: "flex", gap: "15px" }}><span style={{ color: "white", fontWeight: "bold", borderBottom: "2px solid white" }}>For You</span></div>
        <span onClick={()=>setPage("live")} style={{ fontSize: "11px", background: "#ef4444", color: "white", padding: "6px 12px", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>🔴 LIVE</span>
      </div>

      <video 
        ref={homeVideoRef}
        src={video.url} 
        autoPlay 
        loop 
        muted={muted}
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
      />

      <div onClick={()=>setMuted(!muted)} style={{ position: "absolute", top: "60px", right: "12px", background: "rgba(0,0,0,0.6)", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", color: "white", cursor: "pointer" }}>
        {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
      </div>

      <div style={{ position: "absolute", bottom: "85px", left: "12px", right: "80px", color: "white" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>@MrVibra • Follow</p>
        <p style={{ margin: "6px 0", fontSize: "13px" }}>{video.cap}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#facc15" }}>{video.tag}</p>
      </div>

      <div style={{ position: "absolute", right: "8px", bottom: "100px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
        <div onClick={()=>setVideo({...video, liked: !video.liked, like: video.liked ? video.like-1 : video.like+1})} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: video.liked ? "#ef4444" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{video.liked ? "❤️" : "🤍"}</div><div style={{ color: "white", fontSize: "11px", marginTop: "3px" }}>{video.like}</div></div>
        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</div><div style={{ color: "white", fontSize: "11px" }}>12</div></div>
        <div onClick={()=>setPage("live")} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center" }}>📹</div><div style={{ color: "white", fontSize: "9px" }}>Go LIVE</div></div>
      </div>

      {showComments && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "15px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div><p style={{ color: "white", marginTop: "10px" }}>Kali sana 🔥</p></div>)}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
        <span style={{ color: "#facc15" }}>🏠 Home</span><span>🔍 Search</span><span style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px" }}>+</span><span onClick={()=>setPage("live")} style={{ color: "white", cursor: "pointer" }}>📺 LIVE</span><span>👤 Me</span>
      </div>
    </div>
  )
}
