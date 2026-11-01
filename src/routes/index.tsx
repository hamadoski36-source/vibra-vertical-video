import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const [page, setPage] = useState("home")
  const [top, setTop] = useState("foryou")
  const [idx, setIdx] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState("")
  const [search, setSearch] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [vids, setVids] = useState([
    { id: 1, user: "@MrVibra", like: 12001, liked: true, saved: false, cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, user: "@CoastQueen", like: 8500, liked: false, saved: false, cap: "Coast vibes lazima 💃", tag: "#coast #kenya", url: "https://www.w3schools.com/html/movie.mp4" },
    { id: 3, user: "@BeachBoy", like: 15200, liked: false, saved: false, cap: "Beach life Mombasa", tag: "#beach #vibra", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ])

  const like = () => {
    const n = [...vids]; n[idx].liked = !n[idx].liked; n[idx].like += n[idx].liked ? 1 : -1; setVids(n)
  }
  const save = () => {
    const n = [...vids]; n[idx].saved = !n[idx].saved; setVids(n); alert(n[idx].saved ? "✅ Saved!" : "❌ Unsaved")
  }
  const post = () => {
    if (!file) { alert("Chagua video!"); return }
    const url = URL.createObjectURL(file)
    setVids([{ id: Date.now(), user: "@MrVibra", like: 0, liked: false, saved: false, cap: caption || "New video", tag: tags || "#vibra", url }, ...vids])
    setPage("home"); setIdx(0); setCaption(""); setTags(""); setFile(null)
  }

  if (page === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span onClick={()=>setPage("home")} style={{ cursor: "pointer" }}>✕ Close</span><b>Upload</b><span onClick={post} style={{ color: "#facc15", fontWeight: "bold", cursor: "pointer" }}>Post</span></div>
        <div style={{ marginTop: "20px", border: "2px dashed #555", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p>{file ? "✅ "+file.name : "Chagua video yako"}</p>
          <label style={{ background: "white", color: "black", padding: "12px 20px", borderRadius: "20px", display: "inline-block", marginTop: "10px", fontWeight: "bold", cursor: "pointer" }}>CHAGUA VIDEO<input type="file" hidden accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)} /></label>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold" }}>Caption</p><textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Andika caption..." style={{ width: "100%", background: "#222", border: "none", borderRadius: "10px", padding: "12px", color: "white", height: "60px", marginTop: "5px" }} />
          <p style={{ fontWeight: "bold", marginTop: "15px", color: "#facc15" }}>#Tags - HAPA ANDIKA TAGS</p><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="#vibra #mombasa #kenya" style={{ width: "100%", background: "#222", border: "2px solid #facc15", borderRadius: "10px", padding: "12px", color: "white", marginTop: "5px" }} />
          <p style={{ fontSize: "11px", opacity: 0.5, marginTop: "5px" }}>Mfano: #vibra #mombasa #coast #dance</p>
          <div style={{ marginTop: "15px", background: "#111", padding: "10px", borderRadius: "10px" }}><p style={{ fontSize: "12px", opacity: 0.6 }}>Preview:</p><p style={{ fontSize: "13px" }}>{caption} <span style={{ color: "#facc15" }}>{tags}</span></p></div>
        </div>
      </div>
    )
  }

  if (page === "search" || page === "live") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "10px 15px", display: "flex", gap: "10px", alignItems: "center", borderBottom: "1px solid #222" }}>
          <span onClick={()=>setPage("home")} style={{ fontSize: "20px", cursor: "pointer" }}>←</span>
          <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder={page==="live" ? "Search LIVE..." : "Search users, #tags..."} style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} />
        </div>
        <div style={{ padding: "15px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{["#vibra","#mombasa","#kenya","#coast","#dance"].map(t=><span key={t} onClick={()=>setSearch(t)} style={{ background: "#222", padding: "6px 12px", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{t}</span>)}</div>
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>{vids.filter(v=> search==="" || v.tag.includes(search)).map((v,i)=><div key={v.id} onClick={()=>{ setPage("home"); setIdx(i) }} style={{ background: "#111", borderRadius: "10px", overflow: "hidden" }}><video src={v.url} muted style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover" }} /><p style={{ fontSize: "11px", padding: "5px" }}>{v.cap}<br/><span style={{ color: "#facc15" }}>{v.tag}</span></p></div>)}</div>
        </div>
      </div>
    )
  }

  if (page === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "20px", textAlign: "center" }}><div style={{ width: "80px", height: "80px", background: "#facc15", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", color: "black", fontWeight: "bold" }}>V</div><h3 style={{ margin: "10px 0 5px" }}>@MrVibra</h3><p style={{ fontSize: "12px", opacity: 0.6 }}>Mombasa • {vids.length} videos</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>{vids.map((v,i)=><div key={v.id} onClick={()=>{ setPage("home"); setIdx(i) }} style={{ aspectRatio: "3/4", background: "#111" }}><video src={v.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>)}</div>
      </div>
    )
  }

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* JUU KABISA - SEARCH NA LIVE SASA ZIKO */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <span onClick={()=>setPage("search")} style={{ fontSize: "20px", background: "rgba(255,255,255,0.2)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>🔍</span>
        <div style={{ display: "flex", gap: "20px" }}>
          <span onClick={()=>setTop("following")} style={{ color: top==="following" ? "white" : "rgba(255,255,255,0.5)", fontWeight: top==="following" ? "bold" : "normal", borderBottom: top==="following" ? "2px solid white" : "none", fontSize: "15px", cursor: "pointer" }}>Following</span>
          <span onClick={()=>setTop("foryou")} style={{ color: top==="foryou" ? "white" : "rgba(255,255,255,0.5)", fontWeight: top==="foryou" ? "bold" : "normal", borderBottom: top==="foryou" ? "2px solid white" : "none", fontSize: "15px", cursor: "pointer" }}>For You</span>
        </div>
        <span onClick={()=>setPage("live")} style={{ fontSize: "12px", border: "1px solid #facc15", color: "#facc15", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}>🔴 LIVE</span>
      </div>

      <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }} onScroll={e=>{ const i=Math.round((e.target as any).scrollTop / (e.target as any).clientHeight); if(i!==idx) setIdx(i) }}>
        {vids.map((v,i)=>(
          <div key={v.id} style={{ height: "100vh", position: "relative", scrollSnapAlign: "start", background: "black" }}>
            <video 
              src={v.url} 
              autoPlay={i===idx} 
              loop 
              muted 
              playsInline 
              controls={false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            <div style={{ position: "absolute", bottom: "85px", left: "12px", right: "80px", color: "white" }}>
              <p style={{ fontWeight: "bold", margin: 0, fontSize: "15px" }}>{v.user} • <span style={{ border: "1px solid white", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>Follow</span></p>
              <p style={{ margin: "6px 0", fontSize: "13px" }}>{v.cap}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#facc15", fontWeight: "bold" }}>{v.tag}</p>
              <p style={{ margin: "4px 0 0", fontSize: "12px" }}>🎵 Original Sound - Vibra</p>
            </div>

            <div style={{ position: "absolute", right: "8px", bottom: "100px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
              <div style={{ position: "relative" }}><div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>V</div><div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)", background: "#facc15", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "black" }}>+</div></div>
              <div onClick={like} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: v.liked ? "#ef4444" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{v.liked ? "❤️" : "🤍"}</div><div style={{ color: "white", fontSize: "11px", fontWeight: "bold", marginTop: "3px" }}>{v.like}</div></div>
              <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "3px" }}>12</div></div>
              <div onClick={save} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: v.saved ? "#facc15" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{v.saved ? "✅" : "🔖"}</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>{v.saved ? "Saved" : "Save"}</div></div>
              <div onClick={()=>setShowLyrics(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎵</div><div style={{ color: "white", fontSize: "9px", marginTop: "3px" }}>Lyrics</div></div>
              <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>↗️</div><div style={{ color: "white", fontSize: "9px", fontWeight: "bold", marginTop: "3px" }}>Share</div></div>
            </div>
          </div>
        ))}
      </div>

      {showComments && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "15px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white", cursor: "pointer" }}>✕ Close</span></div><p style={{ color: "white", marginTop: "10px", fontSize: "13px" }}>Mombasa 🔥🔥 - Video kali sana!</p><div style={{ display: "flex", gap: "8px", marginTop: "10px" }}><input placeholder="Add comment..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px", color: "white" }} /><button style={{ background: "#facc15", border: "none", borderRadius: "20px", padding: "10px 15px", fontWeight: "bold" }}>Post</button></div></div>)}
      {showLyrics && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "20px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>🎵 Lyrics</b><span onClick={()=>setShowLyrics(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div><p style={{ color: "white", marginTop: "15px", textAlign: "center", lineHeight: "1.8" }}>Mombasa to the world 🌍<br/>Coast vibes ina-rise 🔥<br/>Support Vibra 💛<br/><br/><span style={{ color: "#facc15" }}>{vids[idx].tag}</span></p></div>)}
      {showShare && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "20px", zIndex: 100 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share to</b><span onClick={()=>setShowShare(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}><a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>WhatsApp</div></a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold" }}>f</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Facebook</div></a><div onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Link copied!") }} style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Copy</div></div><div style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>⬇️</div><div style={{ color: "white", fontSize: "11px", marginTop: "5px" }}>Save</div></div></div></div>)}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 90 }}>
        <span onClick={()=>setPage("home")} style={{ color: page==="home" ? "#facc15" : "white", cursor: "pointer" }}>🏠 Home</span>
        <span onClick={()=>setPage("search")} style={{ color: page==="search" ? "#facc15" : "white", cursor: "pointer" }}>🔍 Discover</span>
        <span onClick={()=>setPage("upload")} style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px", cursor: "pointer" }}>+</span>
        <span onClick={()=>setPage("live")} style={{ color: page==="live" ? "#facc15" : "white", cursor: "pointer" }}>📥 Inbox</span>
        <span onClick={()=>setPage("me")} style={{ color: page==="me" ? "#facc15" : "white", cursor: "pointer" }}>👤 Me</span>
      </div>
    </div>
  )
}
