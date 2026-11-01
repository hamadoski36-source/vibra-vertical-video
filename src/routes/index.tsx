import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const [videos, setVideos] = useState([
    { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@MrVibra", caption: "Mombasa to the world 🌍", tags: "#vibra #mombasa", likes: 12000, liked: false, saved: false },
    { id: 2, url: "https://www.w3schools.com/html/movie.mp4", user: "@CoastVibes", caption: "Coast vibes kali 🔥", tags: "#coast #kenya", likes: 8500, liked: false, saved: false },
    { id: 3, url: "https://www.w3schools.com/html/mov_bbb.mp4", user: "@BeachBoy", caption: "Beach life Mombasa", tags: "#beach #vibra", likes: 15200, liked: false, saved: false },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [tab, setTab] = useState("home")
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // LIKE - SASA INAONGEZEKA KWELI
  const handleLike = (id: number) => {
    setVideos(videos.map(v => {
      if (v.id === id) {
        return { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
      }
      return v
    }))
  }

  // SAVE - SASA INAFANYA KAZI SIO PICHA
  const handleSave = (id: number) => {
    setVideos(videos.map(v => v.id === id ? { ...v, saved: !v.saved } : v))
    const video = videos.find(v => v.id === id)
    alert(video?.saved ? "❌ Removed from saved" : "✅ Saved! Utapata kwenye profile")
  }

  // SCROLL - SASA VIDEO NYINGI KAMA TIKTOK, HAI-REFRESH
  const handleScroll = (e: any) => {
    const scrollTop = e.target.scrollTop
    const height = e.target.clientHeight
    const newIndex = Math.round(scrollTop / height)
    if (newIndex !== currentIndex && newIndex < videos.length) {
      setCurrentIndex(newIndex)
    }
  }

  // UPLOAD NA #TAGS
  const handleUploadPost = () => {
    if (!selectedFile) {
      alert("Chagua video kwanza!")
      return
    }
    const url = URL.createObjectURL(selectedFile)
    const newVideo = {
      id: Date.now(),
      url,
      user: "@MrVibra",
      caption: caption || "My new video",
      tags: tags || "#vibra",
      likes: 0,
      liked: false,
      saved: false
    }
    setVideos([newVideo, ...videos])
    setCaption("")
    setTags("")
    setSelectedFile(null)
    setTab("home")
  }

  if (tab === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span onClick={() => setTab("home")} style={{ fontSize: "20px", cursor: "pointer" }}>✕</span>
          <b>New Post</b>
          <button onClick={handleUploadPost} style={{ background: "#facc15", color: "black", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "bold" }}>Post</button>
        </div>

        <div style={{ marginTop: "20px", background: "#111", borderRadius: "15px", padding: "15px" }}>
          <div style={{ border: "2px dashed #333", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            {selectedFile ? <p style={{ color: "#22c55e" }}>✅ {selectedFile.name}</p> : <p>📹 Chagua video</p>}
            <label style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: "20px", display: "inline-block", marginTop: "10px", cursor: "pointer", fontWeight: "bold" }}>
              CHAGUA VIDEO
              <input type="file" accept="video/*" hidden onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <p style={{ marginTop: "20px", fontWeight: "bold" }}>Caption</p>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Andika caption... Mombasa support Vibra" style={{ width: "100%", background: "#222", border: "none", borderRadius: "10px", padding: "12px", color: "white", marginTop: "8px", height: "80px" }} />

          <p style={{ marginTop: "15px", fontWeight: "bold" }}>#Tags (hapa ndipo pa kuandika #tags)</p>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="#vibra #mombasa #kenya #coast" style={{ width: "100%", background: "#222", border: "1px solid #facc15", borderRadius: "10px", padding: "12px", color: "white", marginTop: "8px" }} />
          <p style={{ fontSize: "11px", opacity: 0.5, marginTop: "5px" }}>Andika kama: #vibra #mombasa #tiktokkenya</p>

          <div style={{ marginTop: "20px", background: "#1a1a1a", padding: "12px", borderRadius: "10px" }}>
            <p style={{ fontSize: "12px" }}>Preview:</p>
            <p style={{ fontSize: "13px", marginTop: "5px" }}>{caption || "Caption yako..."} <span style={{ color: "#facc15" }}>{tags || "#vibra"}</span></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* VIDEOS NYINGI - SCROLL KAMA TIKTOK, HAII-REFRESH */}
      <div onScroll={handleScroll} style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {videos.map((video, idx) => (
          <div key={video.id} style={{ height: "100vh", width: "100vw", position: "relative", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <video src={video.url} autoPlay={idx === currentIndex} loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />

            <div style={{ position: "absolute", bottom: "90px", left: "12px", right: "85px", color: "white" }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{video.user}</p>
              <p style={{ fontSize: "13px", margin: "5px 0" }}>{video.caption}</p>
              <p style={{ fontSize: "13px", color: "#facc15", margin: 0 }}>{video.tags}</p>
              <p style={{ fontSize: "11px", opacity: 0.8, marginTop: "5px" }}>🎵 Original - Vibra • Video {idx + 1}/{videos.length}</p>
            </div>

            <div style={{ position: "absolute", right: "10px", bottom: "110px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <div onClick={() => handleLike(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: video.liked ? "#ef4444" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{video.liked ? "❤️" : "🤍"}</div>
                <div style={{ color: "white", fontSize: "11px", fontWeight: "bold", marginTop: "4px" }}>{video.likes}</div>
              </div>

              <div onClick={() => setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>💬</div>
                <div style={{ color: "white", fontSize: "11px", fontWeight: "bold", marginTop: "4px" }}>12</div>
              </div>

              {/* SAVE - SASA INAFANYA KAZI */}
              <div onClick={() => handleSave(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: video.saved ? "#facc15" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{video.saved ? "✅" : "🔖"}</div>
                <div style={{ color: "white", fontSize: "10px", marginTop: "4px" }}>{video.saved ? "Saved" : "Save"}</div>
              </div>

              <div onClick={() => setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎵</div>
                <div style={{ color: "white", fontSize: "9px", marginTop: "4px" }}>Lyrics</div>
              </div>

              {/* SHARE - NA WHATSAPP NA FACEBOOK */}
              <div onClick={() => setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>↗️</div>
                <div style={{ color: "white", fontSize: "10px", fontWeight: "bold", marginTop: "4px" }}>Share</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHARE NA WHATSAPP NA FACEBOOK HALISI */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }} onClick={() => setShowShare(false)}>
          <div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: "40px", height: "4px", background: "#333", borderRadius: "2px", margin: "0 auto 15px" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share to</b><span onClick={() => setShowShare(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}>
              <a href={`https://wa.me/?text=${encodeURIComponent("Tazama video hii kali 🔥 " + window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}>
                <div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "28px" }}>💬</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>WhatsApp</div>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}>
                <div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "24px" }}>f</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Facebook</div>
              </a>
              <div onClick={() => { navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!") }} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "24px" }}>🔗</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Copy Link</div>
              </div>
              <div onClick={() => alert("Ime-save kwenye Downloads")} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "24px" }}>⬇️</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Save Video</div>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px", overflowX: "auto" }}>
              <div style={{ background: "#222", padding: "8px 15px", borderRadius: "20px", fontSize: "12px", whiteSpace: "nowrap", color: "white" }}>😂 Send to friends</div>
              <div style={{ background: "#222", padding: "8px 15px", borderRadius: "20px", fontSize: "12px", whiteSpace: "nowrap", color: "white" }}>📩 Message</div>
              <div style={{ background: "#222", padding: "8px 15px", borderRadius: "20px", fontSize: "12px", whiteSpace: "nowrap", color: "white" }}>🚀 Share as...</div>
            </div>
          </div>
        </div>
      )}

      {showComments && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderRadius: "20px 20px 0 0", padding: "15px", zIndex: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Comments</b><span onClick={() => setShowComments(false)} style={{ color: "white", cursor: "pointer" }}>✕</span></div>
          <p style={{ color: "white", marginTop: "10px" }}>🔥 Video kali! • Mombasa to the world 🌍 • Support Vibra 💛</p>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222", zIndex: 90 }}>
        <span onClick={() => setTab("home")} style={{ color: tab === "home" ? "#facc15" : "white", cursor: "pointer" }}>🏠 Home</span>
        <span>🧭 Explore</span>
        <span onClick={() => setTab("upload")} style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px", cursor: "pointer" }}>+</span>
        <span>📥 Inbox</span>
        <span>👤 Me</span>
      </div>
    </div>
  )
}
