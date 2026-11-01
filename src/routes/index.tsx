import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraOne,
})

function VibraOne() {
  const [page, setPage] = useState("home")
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [video, setVideo] = useState({
    user: "@MrVibra",
    like: 12001,
    liked: true,
    saved: false,
    cap: "Mombasa to the world 🌍🔥",
    tag: "#vibra #mombasa #kenya",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "",
    tags: ""
  })

  const [lives] = useState([
    { name: "Coast Queen", viewers: "1.2k", img: "https://i.pravatar.cc/100?img=5" },
    { name: "Beach Boy", viewers: "890", img: "https://i.pravatar.cc/100?img=8" },
    { name: "Mombasa Live", viewers: "2.1k", img: "https://i.pravatar.cc/100?img=12" },
  ])

  const [file, setFile] = useState<File | null>(null)
  const [cap, setCap] = useState("")
  const [tag, setTag] = useState("")

  const toggleMute = () => {
    setMuted(!muted)
    if (videoRef.current) videoRef.current.muted = !muted
  }

  const handleLike = () => {
    setVideo({ ...video, liked: !video.liked, like: video.liked ? video.like - 1 : video.like + 1 })
  }

  const handleSave = () => {
    setVideo({ ...video, saved: !video.saved })
    alert(video.saved ? "❌ Unsaved" : "✅ Saved kwenye profile!")
  }

  const handlePost = () => {
    if (!file) { alert("Chagua video kwanza!"); return }
    const url = URL.createObjectURL(file)
    setVideo({ ...video, url, cap: cap || "New video", tag: tag || "#vibra" })
    setPage("home")
    alert("✅ Video 1 imebadilishwa! Sasa ni yako")
  }

  if (page === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>✕</span><b>Upload Video Moja</b><span onClick={handlePost} style={{ color: "#facc15", fontWeight: "bold", cursor: "pointer" }}>Post</span></div>
        <div style={{ marginTop: "20px", border: "2px dashed #555", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p>{file ? "✅ "+file.name : "Chagua video yako"}</p>
          <label style={{ background: "white", color: "black", padding: "12px 20px", borderRadius: "20px", display: "inline-block", marginTop: "10px", fontWeight: "bold", cursor: "pointer" }}>CHAGUA VIDEO<input type="file" hidden accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)} /></label>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold" }}>Caption</p><textarea value={cap} onChange={e=>setCap(e.target.value)} placeholder="Andika caption..." style={{ width: "100%", background: "#222", border: "none", borderRadius: "10px", padding: "12px", color: "white", height: "60px", marginTop: "5px" }} />
          <p style={{ fontWeight: "bold", marginTop: "15px", color: "#facc15" }}>#Tags - HAPA ANDIKA</p><input value={tag} onChange={e=>setTag(e.target.value)} placeholder="#vibra #mombasa #kenya" style={{ width: "100%", background: "#222", border: "2px solid #facc15", borderRadius: "10px", padding: "12px", color: "white", marginTop: "5px" }} />
        </div>
      </div>
    )
  }

  if (page === "live") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222" }}>
          <span onClick={()=>setPage("home")} style={{ fontSize: "20px", cursor: "pointer" }}>← Back</span><b style={{ color: "#facc15" }}>🔴 LIVE • Mombasa</b><span>⚙️</span>
        </div>
        <div style={{ padding: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {lives.map((l,i)=>(
            <div key={i} style={{ background: "#111", borderRadius: "15px", overflow: "hidden", position: "relative" }}>
              <img src={l.img} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "8px", left: "8px", background: "#ef4444", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>🔴 LIVE</div>
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "10px", fontSize: "10px" }}>👁️ {l.viewers}</div>
              <div style={{ padding: "8px" }}><p style={{ margin: 0, fontWeight: "bold", fontSize: "13px" }}>{l.name}</p><p style={{ margin: "2px 0 0", fontSize: "11px", opacity: 0.6 }}>Mombasa • Coast vibes</p></div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", opacity: 0.5, fontSize: "12px", marginTop: "20px" }}>Tap kuingia LIVE ya Mombasa</p>
      </div>
    )
  }

  if (page === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}><b>@MrVibra</b><span>☰</span></div>
        <div style={{ textAlign: "center", padding: "10px 20px" }}>
          <label style={{ cursor: "pointer" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto", overflow: "hidden", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold", color: "black" }}>
              {avatar ? <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "V"}
            </div>
            <p style={{ fontSize: "11px", color: "#facc15", marginTop: "6px" }}>Tap kubadilisha picha</p>
            <input type="file" hidden accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; setAvatar(URL.createObjectURL(f)) }} />
          </label>
          <h3 style={{ margin: "10px 0 5px" }}>@MrVibra</h3>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>Mombasa, Kenya 🇰🇪 • 1 video</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Mombasa to the world 🌍🔥 Support Vibra 💛</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}><div><b>89</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Following</div></div><div><b>1.2k</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Followers</div></div><div><b>{video.like}</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Likes</div></div></div>
          <button style={{ marginTop: "12px", background: "#222", color: "white", border: "1px solid #333", padding: "8px 20px", borderRadius: "8px" }}>Edit profile</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", marginTop: "15px" }}>
          <div style={{ aspectRatio: "3/4", background: "#111" }}><video src={video.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")}>🏠 Home</span><span onClick={()=>setPage("search")}>🔍 Search</span><span onClick={()=>setPage("upload")}>➕</span><span onClick={()=>setPage("live")}>📺 LIVE</span><span style={{ color: "#facc15" }}>👤 Me</span>
        </div>
      </div>
    )
  }

  if (page === "search") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "10px 15px", display: "flex", gap: "10px", alignItems: "center" }}><span onClick={()=>setPage("home")} style={{ fontSize: "20px" }}>←</span><input autoFocus placeholder="Search #tags, users..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} /></div>
        <div style={{ padding: "15px" }}><p style={{ fontWeight: "bold" }}>Trending #tags Mombasa</p><div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>{["#vibra","#mombasa","#kenya","#coast"].map(t=><span key={t} style={{ background: "#222", padding: "6px 12px", borderRadius: "15px", fontSize: "12px" }}>{t}</span>)}</div></div>
      </div>
    )
  }

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <span onClick={()=>setPage("search")} style={{ fontSize: "20px", background: "rgba(255,255,255,0.2)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔍</span>
        <div style={{ display: "flex", gap: "15px" }}><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Following</span><span style={{ color: "white", fontWeight: "bold", borderBottom: "2px solid white", fontSize: "14px" }}>For You</span></div>
        <span onClick={()=>setPage("live")} style={{ fontSize: "11px", border: "1px solid #facc15", color: "#facc15", padding: "5px 10px", borderRadius: "15px" }}>🔴 LIVE</span>
      </div>

      <video 
        ref={videoRef}
        src={video.url} 
        autoPlay 
        loop 
        muted={muted}
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
      />

      {/* SAUTI BUTTON - SASA VIDEO INA SAUTI */}
      <div onClick={toggleMute} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 40, background: "rgba(0,0,0,0.5)", width: "70px", height: "70px", borderRadius: "50%", display: muted ? "flex" : "none", alignItems: "center", justifyContent: "center", fontSize: "30px", cursor: "pointer" }}>
        {muted ? "🔇" : "🔊"}
      </div>
      <div onClick={toggleMute} style={{ position: "absolute", top: "60px", right: "15px", zIndex: 50, background: "rgba(0,0,0,0.5)", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", color: "white", cursor: "pointer" }}>
        {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
      </div>

      <div style={{ position: "absolute", bottom: "85px", left: "12px", right: "80px", color: "white" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>{video.user} • Follow</p>
        <p style={{ margin: "6px 0", fontSize: "13px" }}>{video.cap}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#facc15", fontWeight: "bold" }}>{video.tag}</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px" }}>🎵 Original Sound - Vibra</p>
      </div>

      <div style={{ position: "absolute", right: "8px", bottom: "100px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
        <div><div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black", overflow: "hidden" }}>{avatar ? <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "V"}</div><div style={{ background: "#facc15", width: "16px", height: "16px", borderRadius: "50%", margin: "-8px auto 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "black" }}>+</div></div>
        <div onClick={handleLike} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: video.liked ? "#ef4444" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{video.liked ? "❤️" : "🤍"}</div><div style={{ color: "white", fontSize: "11px", fontWeight: "bold", marginTop: "3px" }}>{video.like}</div></div>
        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "3px" }}>12</div></div>
        <div onClick={handleSave} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: video.saved ? "#facc15" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{video.saved ? "✅" : "🔖"}</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>{video.saved ? "Saved" : "Save"}</div></div>
        <div onClick={()=>setShowLyrics(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎵</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>Lyrics</div></div>
        <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>↗️</div><div style={{ color: "white", fontSize: "9px", fontWeight: "bold", marginTop: "3px" }}>Share</div></div>
      </div>

      {showComments && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "15px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Comments (12)</b><span onClick={()=>setShowComments(false)} style={{ color: "white" }}>✕</span></div><p style={{ color: "white", marginTop: "10px", fontSize: "13px" }}>Mombasa 🔥🔥 - Kali sana! Support Vibra 💛</p></div>)}
      {showLyrics && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "20px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>🎵 Lyrics</b><span onClick={()=>setShowLyrics(false)} style={{ color: "white" }}>✕</span></div><p style={{ color: "white", marginTop: "15px", textAlign: "center", lineHeight: "1.8" }}>Mombasa to the world 🌍<br/>Coast vibes ina-rise 🔥<br/><span style={{ color: "#facc15" }}>{video.tag}</span></p></div>)}
      {showShare && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "20px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share to</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}><a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>WhatsApp</div></a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold" }}>f</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Facebook</div></a><div onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Link copied!") }} style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Copy</div></div><div style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>⬇️</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Save</div></div></div></div>)}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 90 }}>
        <span onClick={()=>setPage("home")} style={{ color: page==="home" ? "#facc15" : "white" }}>🏠 Home</span>
        <span onClick={()=>setPage("search")} style={{ color: "white" }}>🔍 Search</span>
        <span onClick={()=>setPage("upload")} style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px" }}>+</span>
        <span onClick={()=>setPage("live")} style={{ color: "white" }}>📺 LIVE</span>
        <span onClick={()=>setPage("me")} style={{ color: "white" }}>👤 Me</span>
      </div>
    </div>
  )
}
