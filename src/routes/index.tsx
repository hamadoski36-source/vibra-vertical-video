import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed13,
})

function VibraFixed13() {
  const [page, setPage] = useState("home")
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([{ user: "@coast", text: "Kali sana 🔥 Mombasa to the world!" }, { user: "@beach", text: "Support Vibra 💛" }])
  const videoRef = useRef<HTMLVideoElement>(null)

  const [video, setVideo] = useState({
    like: 12001, liked: true, saved: false,
    cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  })

  // FIX SAUTI HAIKATI UKITOKA - HII NDIO SIRI
  useEffect(() => {
    if (page !== "home" && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.muted = true
      setMuted(true)
    } else if (page === "home" && videoRef.current) {
      videoRef.current.play().catch(()=>{})
    }
  }, [page])

  const toggleMute = () => {
    if (!videoRef.current) return
    const newMuted = !muted
    setMuted(newMuted)
    videoRef.current.muted = newMuted
    if (!newMuted) videoRef.current.play()
  }

  if (page === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>✕</span><b>Upload</b><span onClick={()=>{ setPage("home"); alert("✅ Posted!") }} style={{ color: "#facc15", fontWeight: "bold" }}>Post</span></div>
        <div style={{ marginTop: "20px" }}>
          <p>Caption</p><textarea placeholder="Andika..." style={{ width: "100%", background: "#222", border: "none", borderRadius: "10px", padding: "12px", color: "white", height: "60px" }} />
          <p style={{ marginTop: "15px", color: "#facc15" }}>#Tags</p><input placeholder="#vibra #mombasa" style={{ width: "100%", background: "#222", border: "2px solid #facc15", borderRadius: "10px", padding: "12px", color: "white" }} />
        </div>
      </div>
    )
  }

  if (page === "live") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222" }}>
          <span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>← Back Home</span><b>🔴 LIVE</b><span></span>
        </div>
        {/* LIVE SIO PICHA TENA - NA PICHA HALISI NA BUTTON */}
        <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {[
            { name: "Coast Queen", viewers: 1200, img: "https://i.pravatar.cc/150?img=5", title: "Dance challenge 🔥" },
            { name: "Beach Boy", viewers: 890, img: "https://i.pravatar.cc/150?img=8", title: "Mombasa beach live" },
            { name: "Mombasa Vibes", viewers: 2100, img: "https://i.pravatar.cc/150?img=32", title: "Coast to the world" },
          ].map((l,i)=>(
            <div key={i} style={{ background: "#111", borderRadius: "15px", display: "flex", padding: "12px", gap: "12px", alignItems: "center" }}>
              <img src={l.img} style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>{l.name} <span style={{ background: "#ef4444", padding: "2px 6px", borderRadius: "4px", fontSize: "9px" }}>LIVE</span></p>
                <p style={{ margin: "4px 0", fontSize: "12px", opacity: 0.8 }}>{l.title}</p>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.5 }}>👁️ {l.viewers} viewers • Mombasa</p>
              </div>
              <button style={{ background: "#facc15", color: "black", border: "none", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "12px" }}>Join</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}><button onClick={()=>setPage("home")} style={{ background: "white", color: "black", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold" }}>Rudi Home</button></div>
      </div>
    )
  }

  if (page === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", paddingBottom: "60px" }}>
        <div style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}><b>@MrVibra ✓</b><span>☰</span></div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          {/* PROFILE SIO PICHA - UNAWEZA KUBADILISHA */}
          <label style={{ cursor: "pointer" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto", overflow: "hidden", background: "#facc15", border: "3px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", color: "black", fontWeight: "bold" }}>
              {avatar ? <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "V"}
            </div>
            <p style={{ fontSize: "12px", color: "#facc15", marginTop: "8px" }}>📸 Badilisha picha (bonyeza hapa)</p>
            <input type="file" hidden accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; setAvatar(URL.createObjectURL(f)) }} />
          </label>
          <h3 style={{ margin: "10px 0 5px" }}>@MrVibra</h3>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>Mombasa, Kenya 🇰🇪</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Mombasa to the world 🌍🔥</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginTop: "15px" }}><div><b>89</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Following</div></div><div><b>1.2k</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Followers</div></div><div><b>{video.like}</b><div style={{ fontSize: "11px", opacity: 0.5 }}>Likes</div></div></div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}><button style={{ flex: 1, maxWidth: "150px", background: "white", color: "black", border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold" }}>Edit profile</button><button style={{ flex: 1, maxWidth: "150px", background: "#222", color: "white", border: "1px solid #333", padding: "8px", borderRadius: "6px" }}>Share profile</button></div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #222", marginTop: "15px" }}><div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "2px solid white" }}>🎬 Videos</div><div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.4 }}>❤️ Liked</div><div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.4 }}>🔖 Saved</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}><div style={{ aspectRatio: "3/4", background: "#111" }}><video src={video.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={()=>setPage("home")}>🏠 Home</span><span onClick={()=>setPage("search")}>🔍 Search</span><span onClick={()=>setPage("upload")}>➕</span><span onClick={()=>setPage("live")}>📺 LIVE</span><span style={{ color: "#facc15" }}>👤 Me</span>
        </div>
      </div>
    )
  }

  if (page === "search") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "10px 15px", display: "flex", gap: "10px" }}><span onClick={()=>setPage("home")} style={{ fontSize: "20px", cursor: "pointer" }}>←</span><input autoFocus placeholder="Search #tags, users..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} /></div>
        <div style={{ padding: "15px" }}><p style={{ fontWeight: "bold" }}>Trending Mombasa</p><div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>{["#vibra","#mombasa","#kenya"].map(t=><span key={t} style={{ background: "#222", padding: "6px 12px", borderRadius: "15px", fontSize: "12px" }}>{t}</span>)}</div></div>
      </div>
    )
  }

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* TOP BAR NA SEARCH NA LIVE */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <span onClick={()=>setPage("search")} style={{ fontSize: "18px", background: "rgba(255,255,255,0.2)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>🔍</span>
        <div style={{ display: "flex", gap: "15px" }}><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Following</span><span style={{ color: "white", fontWeight: "bold", borderBottom: "2px solid white", fontSize: "14px" }}>For You</span></div>
        <span onClick={()=>setPage("live")} style={{ fontSize: "11px", border: "1px solid #facc15", color: "#facc15", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}>🔴 LIVE</span>
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

      {/* SAUTI BUTTON */}
      <div onClick={toggleMute} style={{ position: "absolute", top: "55px", right: "12px", zIndex: 50, background: "rgba(0,0,0,0.6)", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", color: "white", cursor: "pointer", border: "1px solid rgba(255,255,255,0.3)" }}>
        {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
      </div>

      <div style={{ position: "absolute", bottom: "85px", left: "12px", right: "80px", color: "white" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>{video.user} • Follow</p>
        <p style={{ margin: "6px 0", fontSize: "13px" }}>{video.cap}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#facc15", fontWeight: "bold" }}>{video.tag}</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px" }}>🎵 Original Sound - Vibra</p>
      </div>

      <div style={{ position: "absolute", right: "8px", bottom: "100px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black", overflow: "hidden" }}>{avatar ? <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "V"}</div>
        <div onClick={()=>setVideo({...video, liked: !video.liked, like: video.liked ? video.like-1 : video.like+1})} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: video.liked ? "#ef4444" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{video.liked ? "❤️" : "🤍"}</div><div style={{ color: "white", fontSize: "11px", fontWeight: "bold", marginTop: "3px" }}>{video.like}</div></div>
        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "3px" }}>{comments.length}</div></div>
        <div onClick={()=>{ setVideo({...video, saved: !video.saved}); alert(video.saved ? "❌ Unsaved" : "✅ Saved!") }} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: video.saved ? "#facc15" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{video.saved ? "✅" : "🔖"}</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>{video.saved ? "Saved" : "Save"}</div></div>
        <div onClick={()=>setShowLyrics(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎵</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>Lyrics</div></div>
        <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>↗️</div><div style={{ color: "white", fontSize: "9px", fontWeight: "bold", marginTop: "3px" }}>Share</div></div>
      </div>

      {/* COMMENT SIO PICHA TENA - INAFANYA KAZI */}
      {showComments && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }} onClick={()=>setShowComments(false)}>
          <div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "15px", maxHeight: "60vh", display: "flex", flexDirection: "column" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><b style={{ color: "white" }}>{comments.length} Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white", cursor: "pointer" }}>✕ Close</span></div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {comments.map((c,i)=><div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #222", color: "white" }}><b style={{ fontSize: "12px" }}>{c.user}</b> <span style={{ fontSize: "13px" }}>{c.text}</span></div>)}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "12px", color: "white" }} />
              <button onClick={()=>{ if(!commentText.trim()) return; setComments([...comments, { user: "@MrVibra", text: commentText }]); setCommentText("") }} style={{ background: "#facc15", border: "none", borderRadius: "20px", padding: "10px 18px", fontWeight: "bold" }}>Post</button>
            </div>
          </div>
        </div>
      )}

      {showLyrics && (<div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }} onClick={()=>setShowLyrics(false)}><div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px" }} onClick={e=>e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>🎵 Lyrics</b><span onClick={()=>setShowLyrics(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div><p style={{ color: "white", textAlign: "center", marginTop: "15px", lineHeight: "1.8" }}>Mombasa to the world 🌍<br/>Coast vibes ina-rise 🔥<br/><span style={{ color: "#facc15" }}>{video.tag}</span></p></div></div>)}
      {showShare && (<div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }} onClick={()=>setShowShare(false)}><div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px" }} onClick={e=>e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share to</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}><a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>WhatsApp</div></a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold" }}>f</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Facebook</div></a><div onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Copied!") }} style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Copy</div></div><div style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>⬇️</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Save</div></div></div></div></div>)}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 90 }}>
        <span style={{ color: "#facc15" }}>🏠 Home</span><span onClick={()=>setPage("search")} style={{ color: "white", cursor: "pointer" }}>🔍 Search</span><span onClick={()=>setPage("upload")} style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px", cursor: "pointer" }}>+</span><span onClick={()=>setPage("live")} style={{ color: "white", cursor: "pointer" }}>📺 LIVE</span><span onClick={()=>setPage("me")} style={{ color: "white", cursor: "pointer" }}>👤 Me</span>
      </div>
    </div>
  )
}
