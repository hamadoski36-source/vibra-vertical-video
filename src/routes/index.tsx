import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: TikTokButtonsFixed,
})

function TikTokButtonsFixed() {
  const [page, setPage] = useState("home")
  const [tab, setTab] = useState("foryou")
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [saved, setSaved] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div style={{ background: "black", height: "100dvh", width: "100vw", overflow: "hidden", position: "relative" }}>
      
      {/* JUU - SEARCH NA LIVE */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", height: "40px" }}>
        <div onClick={()=>setPage("search")} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>🔍</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span onClick={()=>setTab("following")} style={{ color: tab==="following" ? "white" : "#888", fontSize: "13px", borderBottom: tab==="following" ? "2px solid white" : "none", cursor: "pointer" }}>Following</span>
          <span onClick={()=>setTab("foryou")} style={{ color: tab==="foryou" ? "white" : "#888", fontSize: "13px", borderBottom: tab==="foryou" ? "2px solid white" : "none", fontWeight: "bold", cursor: "pointer" }}>For You</span>
        </div>
        <div onClick={()=>setPage("live")} style={{ background: "#ef4444", color: "white", padding: "5px 10px", borderRadius: "15px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>🔴 LIVE</div>
      </div>

      <video 
        ref={videoRef}
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        autoPlay loop muted={muted} playsInline
        onClick={()=>setMuted(!muted)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div onClick={()=>setMuted(!muted)} style={{ position: "absolute", top: "48px", right: "8px", background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", color: "white" }}>
        {muted ? "🔇 Tap for sound" : "🔊"}
      </div>

      <div style={{ position: "absolute", bottom: "65px", left: "10px", right: "62px", color: "white", zIndex: 20 }}>
        <p style={{ fontWeight: "bold", margin: 0, fontSize: "13px" }}>@MrVibra</p>
        <p style={{ margin: "2px 0", fontSize: "11px" }}>Mombasa to the world 🌍🔥 #vibra #mombasa</p>
      </div>

      {/* KULIA - ZOTE 7 BUTTONS SASA ZITAONEKANA - NIMEZIFINYA NA KUZIPANDISHA */}
      <div style={{ position: "absolute", right: "4px", bottom: "62px", top: "45px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", justifyContent: "flex-end", zIndex: 30 }}>
        
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black", fontSize: "14px" }}>V</div>
        
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>❤️</div>
          <div style={{ color: "white", fontSize: "9px", fontWeight: "bold" }}>12k</div>
        </div>

        <div onClick={()=>setShowComments(true)} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>💬</div>
          <div style={{ color: "white", fontSize: "8px" }}>342</div>
        </div>

        <div onClick={()=>{ setSaved(!saved); alert(saved ? "Unsaved" : "Saved!") }} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: saved ? "#facc15" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{saved ? "✅" : "🔖"}</div>
          <div style={{ color: "white", fontSize: "7px" }}>{saved ? "Saved" : "Save"}</div>
        </div>

        <div onClick={()=>alert("🎵 Lyrics:\nMombasa to the world\nCoast vibes ina-rise")} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🎵</div>
          <div style={{ color: "white", fontSize: "7px" }}>Lyrics</div>
        </div>

        <div onClick={()=>setShowShare(true)} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>↗️</div>
          <div style={{ color: "white", fontSize: "7px", fontWeight: "bold" }}>Share</div>
        </div>

        <div onClick={()=>setPage("live")} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "white" }}>LIVE</div>
        </div>
      </div>

      {showComments && (
        <div style={{ position: "fixed", bottom: "50px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white", fontSize: "12px" }}>342 Comments</b><span onClick={()=>setShowComments(false)} style={{ color: "white" }}>✕</span></div>
          <p style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>🔥 Mombasa to the world!</p>
        </div>
      )}

      {showShare && (
        <div style={{ position: "fixed", bottom: "50px", left: 0, right: 0, background: "#1a1a1a", borderRadius: "15px 15px 0 0", padding: "12px", zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white", fontSize: "12px" }}>Share</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div>
          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <a href="https://wa.me/?text=al-video-jhab.vercel.app" target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "40px", height: "40px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "9px" }}>WhatsApp</div></a>
            <div style={{ textAlign: "center" }}><div style={{ width: "40px", height: "40px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "9px" }}>Copy</div></div>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "8px 0", borderTop: "1px solid #222", zIndex: 90, height: "44px", alignItems: "center" }}>
        <span style={{ color: "#facc15", fontSize: "11px" }}>🏠 Home</span>
        <span onClick={()=>setPage("search")} style={{ color: "white", fontSize: "11px", cursor: "pointer" }}>🔍 Search</span>
        <span style={{ background: "white", color: "black", padding: "3px 10px", borderRadius: "6px", fontSize: "12px" }}>+</span>
        <span onClick={()=>setPage("live")} style={{ color: "white", fontSize: "11px", cursor: "pointer" }}>📺 LIVE</span>
        <span onClick={()=>setPage("me")} style={{ color: "white", fontSize: "11px", cursor: "pointer" }}>👤 Me</span>
      </div>
    </div>
  )
}
