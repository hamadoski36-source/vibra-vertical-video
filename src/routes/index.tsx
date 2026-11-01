import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: TikTokFinal,
})

function TikTokFinal() {
  const [page, setPage] = useState("home")
  const [tab, setTab] = useState("foryou")
  const [muted, setMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(true)
  const [isLive, setIsLive] = useState(false)
  
  const homeVideoRef = useRef<HTMLVideoElement>(null)
  const liveRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const videos = [
    { id: 1, user: "@MrVibra", likes: 12001, cap: "Mombasa to the world 🌍🔥", tag: "#vibra #mombasa", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4" },
  ]

  useEffect(() => {
    if (page === "home" && homeVideoRef.current) {
      homeVideoRef.current.play().catch(()=>{})
    }
    if (page !== "live" && streamRef.current) {
      streamRef.current.getTracks().forEach(t=>t.stop())
      setIsLive(false)
    }
  }, [page])

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })
      streamRef.current = stream
      if (liveRef.current) {
        liveRef.current.srcObject = stream
        await liveRef.current.play()
      }
      setIsLive(true)
    } catch {
      alert("Ruhusu Camera kwenye Chrome Settings")
    }
  }

  if (page === "live") {
    return (
      <div style={{ background: "black", width: "100vw", height: "100dvh", position: "relative" }}>
        <video ref={liveRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", background: "#111", transform: isLive ? "scaleX(-1)" : "none" }} />
        {!isLive ? (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <div style={{ fontSize: "60px" }}>📷</div>
            <h2 style={{ color: "white", margin: 0 }}>Go LIVE</h2>
            <button onClick={startLive} style={{ background: "#ef4444", color: "white", border: "none", padding: "14px 35px", borderRadius: "30px", fontWeight: "bold", fontSize: "16px" }}>🔴 ANZA LIVE NA CAMERA</button>
            <button onClick={()=>setPage("home")} style={{ background: "transparent", color: "white", border: "1px solid #555", padding: "10px 25px", borderRadius: "20px" }}>← Rudi Home</button>
          </div>
        ) : (
          <>
            <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between" }}>
              <button onClick={()=>{ streamRef.current?.getTracks().forEach(t=>t.stop()); setPage("home") }} style={{ background: "rgba(0,0,0,0.6)", color: "white", border: "none", padding: "8px 14px", borderRadius: "20px" }}>✕ Close</button>
              <div style={{ background: "#ef4444", color: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" }}>🔴 LIVE</div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: "10px
