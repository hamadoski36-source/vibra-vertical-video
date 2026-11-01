import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraAllFixed,
})

function VibraAllFixed() {
  const [page, setPage] = useState("home") // home, search, upload, live, me
  const [topTab, setTopTab] = useState("foryou") // following, foryou
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [myAvatar, setMyAvatar] = useState<string | null>(null)
  const [videos] = useState([
    { id: 1, user: "@MrVibra", likes: 12001, tag: "#vibra #mombasa", cap: "Mombasa to the world 🌍🔥", url: "https://www.w3schools.com/html/mov_bbb.mp4", following: true },
    { id: 2, user: "@CoastQueen", likes: 8500, tag: "#coast #kenya", cap: "Coast vibes 💃", url: "https://www.w3schools.com/html/movie.mp4", following: true },
    { id: 3, user: "@BeachBoy", likes: 15200, tag: "#beach", cap: "Beach life", url: "https://www.w3schools.com/html/mov_bbb.mp4", following: false },
  ])
  const [currentIdx, setCurrentIdx] = useState(0)
  const currentVideo = videos[currentIdx]

  // ZIMA SAUTI UKITOKA HOME
  useEffect(() => {
    if (page !== "home" && videoRef.current) {
      videoRef.current.pause()
    } else if (page === "home" && videoRef.current) {
      videoRef.current.play().catch(()=>{})
    }
  }, [page, currentIdx])

  const filteredVideos = topTab === "following" ? videos.filter(v=>v.following) : videos

  // ========== PAGE: UPLOAD ==========
  if (page === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100dvh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>✕ Close</span>
          <b>Upload</b>
          <span onClick={()=>{ setPage("home"); alert("✅ Posted!") }} style={{ color: "#facc15", fontWeight: "bold" }}>Post</span>
        </div>
        <div style={{ marginTop: "20px", border: "2px dashed #444", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p>Chagua video</p>
          <label style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: "20px", display: "inline-block", marginTop: "10px", fontWeight: "bold" }}>CHAGUA VIDEO<input type="file" hidden accept="video/*" /></label>
        </div>
        <p style={{ marginTop: "15px", color: "#facc15" }}>#Tags</p><input placeholder="#vibra #mombasa" style={{ width: "100%", background: "#222", border: "2px solid #facc15", borderRadius: "10px", padding: "12px", color: "white" }} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")}>🏠 Home</span><span onClick={()=>setPage("search")}>🔍 Search</span><span style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px" }}>+</span><span onClick={()=>setPage("live")}>📺 LIVE</span><span onClick={()=>setPage("me")}>👤 Me</span>
        </div>
      </div>
    )
  }

  // ========== PAGE: LIVE ==========
  if (page === "live") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100dvh" }}>
        <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222" }}>
          <span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>← Home</span><b>🔴 LIVE • Mombasa</b><span></span>
        </div>
        <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { name: "Coast Queen", viewers: "1.2k", img: "https://i.pravatar.cc/150?img=5" },
            { name: "Beach Boy", viewers: "890", img: "https://i.pravatar.cc/150?img=8" },
          ].map((l,i)=><div key={i} style={{ background: "#111", borderRadius: "12px", display: "flex", padding: "10px", gap: "10px" }}><img src={l.img} style={{ width: "60px", height: "60px", borderRadius: "10px" }} /><div><p style={{ margin: 0, fontWeight: "bold", fontSize: "13px" }}>{l.name} 🔴 LIVE</p><p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>👁️ {l.viewers} • Tap to join</p></div></div>)}
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")}>🏠 Home</span><span onClick={()=>setPage("search")}>🔍 Search</span><span onClick={()=>setPage("upload")}>➕</span><span style={{ color: "#facc15" }}>📺 LIVE</span><span onClick={()=>setPage("me")}>👤 Me</span>
        </div>
      </div>
    )
  }

  // ========== PAGE: SEARCH ==========
  if (page === "search") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100dvh" }}>
        <div style={{ padding: "10px 15px", display: "flex", gap: "10px" }}><span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>←</span><input autoFocus placeholder="Search #tags, users..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} /></div>
        <div style={{ padding: "15px" }}><p style={{ fontWeight: "bold" }}>Trending Mombasa</p><div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>{["#vibra","#mombasa","#kenya"].map(t=><span key={t} style={{ background: "#222", padding: "6px 12px", borderRadius: "15px", fontSize: "12px" }}>{t}</span>)}</div></div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")}>🏠 Home</span><span style={{ color: "#facc15" }}>🔍 Search</span><span onClick={()=>setPage("upload")}>➕</span><span onClick={()=>setPage("live")}>📺 LIVE</span><span onClick={()=>setPage("me")}>👤 Me</span>
        </div>
      </div>
    )
  }

  // ========== PAGE: ME - SIO PICHA TENA ==========
  if (page === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100dvh", paddingBottom: "60px" }}>
        <div style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}><b>@MrVibra ✓</b><span>⚙️</span></div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <label style={{ cursor: "pointer" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto", overflow: "hidden", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "black", fontWeight: "bold" }}>
              {myAvatar ? <img src={myAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "V"}
            </div>
            <p style={{ fontSize: "11px", color: "#facc15", marginTop: "5px" }}>📸 Badilisha picha</p>
            <input type="file" hidden accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f) setMyAvatar(URL.createObjectURL(f)) }} />
          </label>
          <h3 style={{ margin: "8px 0 3px" }}>@MrVibra</h3>
          <p style={{ fontSize: "11px", opacity: 0.6 }}>Mombasa, Kenya 🇰🇪 • 3 videos</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "12px" }}><div><b>89</b><div style={{ fontSize: "10px", opacity: 0.5 }}>Following</div></div><div><b>1.2k</b><div style={{ fontSize: "10px", opacity: 0.5 }}>Followers</div></div><div><b>35k</b><div style={{ fontSize: "10px", opacity: 0.5 }}>Likes</div></div></div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #222", marginTop: "10px" }}><div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "2px solid white" }}>🎬</div><div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.4 }}>❤️</div><div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.4 }}>🔖</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setPage("home") }} style={{ aspectRatio: "3/4", background: "#111", position: "relative" }}><video src={v.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "9px", color: "white" }}>▶️ {v.likes}</div></div>)}</div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>🏠 Home</span><span onClick={()=>setPage("search")} style={{ cursor: "pointer" }}>🔍 Search</span><span onClick={()=>setPage("upload")} style={{ cursor: "pointer" }}>➕</span><span onClick={()=>setPage("live")} style={{ cursor: "pointer" }}>📺 LIVE</span><span style={{ color: "#facc15" }}>👤 Me</span>
        </div>
      </div>
    )
  }

  // ========== PAGE: HOME - VIDEO MOJA NA BUTTONS ZOTE ==========
  return (
    <div style={{ background: "black", height: "100dvh", width: "100vw", overflow: "hidden", position: "relative" }}>
      
      {/* TOP: FOLLOWING / FOR YOU - SASA ZINAFANYA KAZI, SIO PICHA */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", padding: "10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)", height: "44px" }}>
        <span onClick={()=>setTopTab("following")} style={{ color: topTab==="following" ? "white" : "rgba(255,255,255,0.5)", fontWeight: topTab==="following" ? "bold" : "normal", borderBottom: topTab==="following" ? "2px solid white" : "none", fontSize: "14px", cursor: "pointer", paddingBottom: "2px" }}>Following</span>
        <span onClick={()=>setTopTab("foryou")} style={{ color: topTab==="foryou" ? "white" : "rgba(255,255,255,0.5)", fontWeight: topTab==="foryou" ? "bold" : "normal", borderBottom: topTab==="foryou" ? "2px solid white" : "none", fontSize: "14px", cursor: "pointer", paddingBottom: "2px" }}>For You</span>
      </div>

      <div onClick={()=>{ setMuted(!muted); if(videoRef.current) videoRef.current.muted = !muted }} style={{ position: "absolute", top: "50px", right: "10px", zIndex: 40, background: "rgba(0,0,0,0.6)", padding: "5px 10px", borderRadius: "15px", fontSize: "10px", color: "white" }}>
        {muted ? "🔇 Tap for sound" : "🔊"}
      </div>

      <video 
        ref={videoRef}
        src={filteredVideos[currentIdx % filteredVideos.length]?.url || videos[0].url} 
        autoPlay 
        loop 
        muted={muted}
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
      />

      <div style={{ position: "absolute", bottom: "75px", left: "10px", right: "70px", color: "white", zIndex: 30 }}>
        <p style={{ fontWeight: "bold", margin: 0, fontSize: "14px" }}>@{filteredVideos[currentIdx % filteredVideos.length]?.user || "MrVibra"} • Follow</p>
        <p style={{ margin: "4px 0", fontSize: "12px" }}>{filteredVideos[currentIdx % filteredVideos.length]?.cap}</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#facc15", fontWeight: "bold" }}>{filteredVideos[currentIdx % filteredVideos.length]?.tag}</p>
      </div>

      {/* RIGHT BUTTONS - ZOTE 5 ZINAONEKANA */}
      <div style={{ position: "absolute", right: "6px", bottom: "75px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", zIndex: 40 }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>V</div>
        <div onClick={()=>{ const v=[...videos]; v[currentIdx].likes += 1; }} style={{ textAlign: "center" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>❤️</div><div style={{ color: "white", fontSize: "10px" }}>{currentVideo.likes}</div></div>
        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</div><div style={{ color: "white", fontSize: "10px" }}>12</div></div>
        <div style={{ textAlign: "center" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>🔖</div><div style={{ color: "white", fontSize: "9px" }}>Save</div></div>
        <div style={{ textAlign: "center" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>🎵</div><div style={{ color: "white", fontSize: "8px" }}>Lyrics</div></div>
        <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center" }}>↗️</div><div style={{ color: "white", fontSize: "9px" }}>Share</div></div>
      </div>

      {showComments && (<div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white", fontSize: "13px" }}>Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white" }}>✕</span></div><p style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>🔥 Kali sana Mombasa!</p></div>)}
      {showShare && (<div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div><div style={{ display: "flex", gap: "15px", marginTop: "10px", justifyContent: "space-around" }}><div style={{ textAlign: "center" }}><div style={{ width: "40px", height: "40px", background: "#25D366", borderRadius: "50%", margin: "0 auto" }}></div><div style={{ color: "white", fontSize: "9px" }}>WhatsApp</div></div><div style={{ textAlign: "center" }}><div style={{ width: "40px", height: "40px", background: "#1877F2", borderRadius: "50%", margin: "0 auto" }}></div><div style={{ color: "white", fontSize: "9px" }}>Facebook</div></div></div></div>)}

      {/* BOTTOM NAV - SASA ZOTE ZINAFANYA KAZI, SIO PICHA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 90, height: "50px", alignItems: "center" }}>
        <span onClick={()=>setPage("home")} style={{ color: page==="home" ? "#facc15" : "white", cursor: "pointer", fontSize: "12px" }}>🏠 Home</span>
        <span onClick={()=>setPage("search")} style={{ color: page==="search" ? "#facc15" : "white", cursor: "pointer", fontSize: "12px" }}>🔍 Search</span>
        <span onClick={()=>setPage("upload")} style={{ background: "white", color: "black", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>+</span>
        <span onClick={()=>setPage("live")} style={{ color: page==="live" ? "#facc15" : "white", cursor: "pointer", fontSize: "12px" }}>📺 LIVE</span>
        <span onClick={()=>setPage("me")} style={{ color: page==="me" ? "#facc15" : "white", cursor: "pointer", fontSize: "12px" }}>👤 Me</span>
      </div>
    </div>
  )
}
