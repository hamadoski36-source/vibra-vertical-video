import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixedButtons,
})

function VibraFixedButtons() {
  const [page, setPage] = useState("home")
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [video, setVideo] = useState({
    like: 12001, liked: true, saved: false,
    cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  })

  useEffect(() => {
    if (page !== "home" && videoRef.current) {
      videoRef.current.pause()
    }
  }, [page])

  return (
    <div style={{ background: "black", height: "100dvh", width: "100vw", overflow: "hidden", position: "relative" }}>
      
      {/* TOP */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)", height: "44px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🔍</div>
        <div style={{ display: "flex", gap: "15px" }}>
          <span style={{ color: "white", fontWeight: "bold", borderBottom: "2px solid white", fontSize: "14px" }}>For You</span>
        </div>
        <div onClick={()=>alert("LIVE - Camera inakuja!")} style={{ fontSize: "10px", background: "#ef4444", color: "white", padding: "5px 10px", borderRadius: "15px", fontWeight: "bold" }}>🔴 LIVE</div>
      </div>

      <div style={{ position: "absolute", top: "46px", right: "10px", zIndex: 40, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "15px", fontSize: "10px", color: "white" }} onClick={()=>{ setMuted(!muted); if(videoRef.current) videoRef.current.muted = !muted }}>
        {muted ? "🔇 Tap for sound" : "🔊"}
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

      <div style={{ position: "absolute", bottom: "75px", left: "10px", right: "75px", color: "white", zIndex: 30 }}>
        <p style={{ fontWeight: "bold", margin: 0, fontSize: "14px" }}>@MrVibra • Follow</p>
        <p style={{ margin: "4px 0", fontSize: "12px" }}>{video.cap}</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#facc15", fontWeight: "bold" }}>{video.tag}</p>
      </div>

      {/* RIGHT BUTTONS - SASA ZIMEPANDISHWA JUU, ZINAONEKANA ZOTE 5 */}
      <div style={{ 
        position: "absolute", 
        right: "6px", 
        bottom: "80px", 
        top: "auto",
        display: "flex", 
        flexDirection: "column", 
        gap: "12px", 
        alignItems: "center",
        zIndex: 40,
        maxHeight: "calc(100dvh - 160px)",
        justifyContent: "flex-end"
      }}>
        {/* PROFILE */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black", fontSize: "18px" }}>V</div>
          <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", background: "#facc15", width: "14px", height: "14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "black", border: "1px solid black" }}>+</div>
        </div>

        <div onClick={()=>setVideo({...video, liked: !video.liked, like: video.liked ? video.like-1 : video.like+1})} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: video.liked ? "#ef4444" : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{video.liked ? "❤️" : "🤍"}</div>
          <div style={{ color: "white", fontSize: "10px", fontWeight: "bold", marginTop: "2px" }}>{video.like}</div>
        </div>

        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💬</div>
          <div style={{ color: "white", fontSize: "10px", marginTop: "2px" }}>12</div>
        </div>

        <div onClick={()=>{ setVideo({...video, saved: !video.saved}); alert(video.saved ? "❌ Unsaved" : "✅ Saved!") }} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: video.saved ? "#facc15" : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{video.saved ? "✅" : "🔖"}</div>
          <div style={{ color: "white", fontSize: "9px", marginTop: "2px" }}>{video.saved ? "Saved" : "Save"}</div>
        </div>

        <div onClick={()=>alert("🎵 Lyrics: Mombasa to the world 🌍 #vibra")} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎵</div>
          <div style={{ color: "white", fontSize: "8px", marginTop: "2px" }}>Lyrics</div>
        </div>

        <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>↗️</div>
          <div style={{ color: "white", fontSize: "9px", fontWeight: "bold", marginTop: "2px" }}>Share</div>
        </div>
      </div>

      {showComments && (
        <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100, maxHeight: "40vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white", fontSize: "13px" }}>12 Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white", fontSize: "14px" }}>✕</span></div>
          <p style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>🔥 Mombasa to the world! Support Vibra 💛</p>
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}><input placeholder="Add comment..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "15px", padding: "8px 12px", color: "white", fontSize: "12px" }} /><button style={{ background: "#facc15", border: "none", borderRadius: "15px", padding: "8px 12px", fontSize: "12px", fontWeight: "bold" }}>Post</button></div>
        </div>
      )}

      {showShare && (
        <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white", fontSize: "13px" }}>Share to</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div>
          <div style={{ display: "flex", gap: "15px", marginTop: "12px", justifyContent: "space-around" }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "44px", height: "44px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "9px", marginTop: "4px" }}>WhatsApp</div></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "44px", height: "44px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold" }}>f</div><div style={{ color: "white", fontSize: "9px", marginTop: "4px" }}>Facebook</div></a>
            <div style={{ textAlign: "center" }}><div style={{ width: "44px", height: "44px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "9px", marginTop: "4px" }}>Copy</div></div>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "8px 0", borderTop: "1px solid #222", zIndex: 90, height: "50px", alignItems: "center" }}>
        <span style={{ color: "#facc15", fontSize: "12px" }}>🏠 Home</span>
        <span style={{ color: "white", fontSize: "12px" }}>🔍 Discover</span>
        <span style={{ background: "white", color: "black", padding: "4px 12px", borderRadius: "6px", fontSize: "14px" }}>+</span>
        <span style={{ color: "white", fontSize: "12px" }}>📥 Inbox</span>
        <span style={{ color: "white", fontSize: "12px" }}>👤 Me</span>
      </div>
    </div>
  )
}
