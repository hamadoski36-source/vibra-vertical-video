import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const [likes, setLikes] = useState(12000)
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [myVideo, setMyVideo] = useState<string | null>(null)
  const [comments, setComments] = useState(["Mombasa 🔥🔥", "Video kali sana!", "Support Vibra 💛"])
  const [newComment, setNewComment] = useState("")
  const [tab, setTab] = useState("home")
  const videoRef = useRef<HTMLVideoElement>(null)

  // LIKE - SASA INAONGEZEKA UKIBONYEZA
  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1)
      setLiked(true)
    } else {
      setLikes(likes - 1)
      setLiked(false)
    }
  }

  // UPLOAD - SASA VIDEO INAONYESHA MOJA KWA MOJA
  const handleUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setMyVideo(url)
    setTab("home")
    alert("✅ Video imepanda! Sasa utaiona Home")
  }

  if (tab === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
        <h2 onClick={() => setTab("home")} style={{ cursor: "pointer" }}>← Back Home</h2>
        <div style={{ marginTop: "100px", textAlign: "center", border: "2px dashed #333", padding: "40px", borderRadius: "20px" }}>
          <h3>Upload Video Yako</h3>
          <p style={{ opacity: 0.6, fontSize: "13px" }}>Chagua video, itaonekana moja kwa moja Home</p>
          <label style={{ background: "white", color: "black", padding: "15px 30px", borderRadius: "30px", display: "inline-block", marginTop: "20px", fontWeight: "bold", cursor: "pointer" }}>
            📁 CHAGUA VIDEO
            <input type="file" accept="video/*" onChange={handleUpload} hidden />
          </label>
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around", background: "black", padding: "10px", borderTop: "1px solid #222" }}>
          <span onClick={() => setTab("home")}>🏠 Home</span>
          <span onClick={() => setTab("upload")} style={{ color: "#facc15" }}>➕ Upload</span>
          <span>👤 Me</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "black", color: "white", height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {/* VIDEO - SASA INAONYESHA YAKO UKI-UPLOAD */}
      <video
        ref={videoRef}
        src={myVideo || "https://www.w3schools.com/html/mov_bbb.mp4"}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause()}
      />

      {/* LEFT BOTTOM - INFO */}
      <div style={{ position: "absolute", bottom: "80px", left: "12px", right: "90px" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>@MrVibra • Mombasa</p>
        <p style={{ fontSize: "12px", margin: "4px 0" }}>{myVideo ? "Video Yangu 🔥" : "VIBRA WORLDWIDE 🌍"} - {likes} likes</p>
        <p style={{ fontSize: "11px", opacity: 0.7 }}>🎵 Original Sound - Support Vibra</p>
      </div>

      {/* RIGHT SIDE - SIO PICHA TENA - BUTTONS HALISI */}
      <div style={{ position: "absolute", right: "10px", bottom: "120px", display: "flex", flexDirection: "column", gap: "18px", alignItems: "center", zIndex: 50 }}>

        {/* LIKE - INAFANYA KAZI */}
        <div onClick={handleLike} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: "32px", background: liked ? "#ef4444" : "rgba(255,255,255,0.15
