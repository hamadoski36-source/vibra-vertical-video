import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const [currentTab, setCurrentTab] = useState("home")
  const [forYouTab, setForYouTab] = useState("foryou") // following / foryou
  const [currentVideo, setCurrentVideo] = useState(0)
  const [searchText, setSearchText] = useState("")
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const [videos, setVideos] = useState([
    { id: 1, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "@MrVibra", name: "Mr Vibra", caption: "Mombasa to the world 🌍🔥", tags: "#vibra #mombasa", likes: 12001, liked: true, following: false },
    { id: 2, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", user: "@CoastVibes", name: "Coast Queen", caption: "Coast vibes lazima 💃", tags: "#coast #kenya", likes: 8500, liked: false, following: true },
    { id: 3, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", user: "@BeachBoy", name: "Beach Boy", caption: "Beach life Mombasa", tags: "#beach #tiktokkenya", likes: 15200, liked: false, following: false },
  ])
  
  const [showShare, setShowShare] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [myVideos, setMyVideos] = useState<any[]>([])

  // PLAY VIDEO CURRENT - HII NDIO INAFANYA VIDEO ZICHEZE LIVE, SIO PICHA
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (i === currentVideo) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      }
    })
  }, [currentVideo, currentTab, forYouTab])

  const handleScroll = (e: any) => {
    const h = e.target.clientHeight
    const idx = Math.round(e.target.scrollTop / h)
    if (idx !== currentVideo) setCurrentVideo(idx)
  }

  const handleLike = (id: number) => {
    setVideos(videos.map(v => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v))
  }

  // ME PAGE - SASA VIDEO ZINACHEZA, SIO PICHA
  if (currentTab === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", background: "#facc15", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", color: "black", fontWeight: "bold" }}>V</div>
          <h3 style={{ margin: "10px 0 5px" }}>@MrVibra</h3>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>Mombasa, Kenya 🇰🇪</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
            <div><b>{videos.length + myVideos.length}</b><div style={{ fontSize: "11px", opacity: 0.6 }}>Following</div></div>
            <div><b>1.2K</b><div style={{ fontSize: "11px", opacity: 0.6 }}>Followers</div></div>
            <div><b>{videos.reduce((a,b)=>a+b.likes,0)}</b><div style={{ fontSize: "11px", opacity: 0.6 }}>Likes</div></div>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
            <button style={{ background: "white", color: "black", border: "none", padding: "8px 20px", borderRadius: "5px", fontWeight: "bold" }}>Edit profile</button>
            <button style={{ background: "#222", color: "white", border: "none", padding: "8px 20px", borderRadius: "5px" }}>Share profile</button>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "2px solid white" }}>🎬 Videos</div>
          <div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.5 }}>❤️ Liked</div>
          <div style={{ flex: 1, textAlign: "center", padding: "10px", opacity: 0.5 }}>🔖 Saved</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", padding: "2px" }}>
          {videos.map((v, i) => (
            <div key={v.id} onClick={() => { setCurrentTab("home"); setCurrentVideo(i) }} style={{ position: "relative", aspectRatio: "9/16", background: "#111", overflow: "hidden" }}>
              <video src={v.url} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}>▶️ {v.likes}</div>
            </div>
          ))}
          {myVideos.map((v, i) => (
            <div key={v.id} onClick={() => { setCurrentTab("home"); }} style={{ position: "relative", aspectRatio: "9/16", background: "#111" }}>
              <video src={v.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={() => setCurrentTab("home")}>🏠 Home</span>
          <span onClick={() => setCurrentTab("search")}>🔍 Search</span>
          <span onClick={() => setCurrentTab("upload")}>➕</span>
          <span onClick={() => setCurrentTab("live")}>📺 LIVE</span>
          <span style={{ color: "#facc15" }}>👤 Me</span>
        </div>
      </div>
    )
  }

  if (currentTab === "search") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder="Search Vibra..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "12px 15px", color: "white" }} />
          <span onClick={()=>setCurrentTab("home")} style={{ padding: "10px" }}>✕</span>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold" }}>Discover</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
            {["#vibra", "#mombasa", "#coast", "#kenya", "#dance", "#comedy"].map(t => (
              <span key={t} onClick={()=>setSearchText(t)} style={{ background: "#222", padding: "6px 12px", borderRadius: "15px", fontSize: "12px" }}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {videos.filter(v=> v.tags.includes(searchText) || v.caption.includes(searchText) || searchText==="").map(v=>(
              <div key={v.id} onClick={()=>{ setCurrentTab("home"); setCurrentVideo(videos.indexOf(v)) }} style={{ background: "#111", borderRadius: "10px", overflow: "hidden" }}>
                <video src={v.url} muted style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover" }} />
                <p style={{ fontSize: "11px", padding: "5px" }}>{v.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={() => setCurrentTab("home")}>🏠 Home</span>
          <span style={{ color: "#facc15" }}>🔍 Search</span>
          <span onClick={() => setCurrentTab("upload")}>➕</span>
          <span onClick={() => setCurrentTab("live")}>📺 LIVE</span>
          <span onClick={() => setCurrentTab("me")}>👤 Me</span>
        </div>
      </div>
    )
  }

  if (currentTab === "live") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>🔴 LIVE</h2>
        <p style={{ opacity: 0.6 }}>Watu wa Mombasa wako LIVE sasa</p>
        <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
          {[1,2,3].map(i=>(
            <div key={i} style={{ background: "#111", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "#333", borderRadius: "50%", margin: "0 auto" }}></div>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>User {i} 🔴</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setCurrentTab("home")} style={{ marginTop: "30px", background: "white", color: "black", border: "none", padding: "10px 25px", borderRadius: "20px", fontWeight: "bold" }}>Back Home</button>
      </div>
    )
  }

  if (currentTab === "upload") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span onClick={()=>setCurrentTab("home")}>✕</span><b>Upload</b><span style={{ color: "#facc15", fontWeight: "bold" }}>Post</span></div>
        <div style={{ marginTop: "30px", border: "2px dashed #333", padding: "30px", borderRadius: "15px", textAlign: "center" }}>
          <p>Chagua video yako</p>
          <label style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: "20px", marginTop: "15px", display: "inline-block", fontWeight: "bold", cursor: "pointer" }}>
            CHAGUA VIDEO
            <input type="file" hidden accept="video/*" onChange={e=>{
              const f = e.target.files?.[0]; if(!f) return;
              const url = URL.createObjectURL(f);
              setMyVideos([{ id: Date.now(), url }, ...myVideos]);
              setCurrentTab("home");
            }} />
          </label>
        </div>
      </div>
    )
  }

  // HOME - VIDEO ZINACHEZA LIVE SASA
  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* TOP TABS - FOLLOWING / FOR YOU - SASA ZIKO */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", gap: "20px", padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
        <span onClick={()=>setForYouTab("following")} style={{ color: forYouTab==="following" ? "white" : "rgba(255,255,255,0.6)", fontWeight: forYouTab==="following" ? "bold" : "400", borderBottom: forYouTab==="following" ? "2px solid white" : "none", paddingBottom: "4px" }}>Following</span>
        <span onClick={()=>setForYouTab("foryou")} style={{ color: forYouTab==="foryou" ? "white" : "rgba(255,255,255,0.6)", fontWeight: forYouTab==="foryou" ? "bold" : "400", borderBottom: forYouTab==="foryou" ? "2px solid white" : "none", paddingBottom: "4px" }}>For You</span>
      </div>

      <div onScroll={handleScroll} style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {videos.map((v, i) => (
          <div key={v.id} style={{ height: "100vh", position: "relative", scrollSnapAlign: "start" }}>
            <video 
              ref={el => { videoRefs.current[i] = el }}
              src={v.url} 
              loop 
              muted 
              playsInline 
              preload="auto"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              onClick={e => { const vid = e.currentTarget; vid.paused ? vid.play() : vid.pause() }}
            />

            <div style={{ position: "absolute", bottom: "90px", left: "12px", right: "85px", color: "white" }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{v.user} • {v.following ? "Following" : "+ Follow"}</p>
              <p style={{ fontSize: "13px", margin: "5px 0" }}>{v.caption}</p>
              <p style={{ fontSize: "13px", color: "#facc15" }}>{v.tags}</p>
              <p style={{ fontSize: "12px" }}>🎵 Original Sound - Vibra</p>
            </div>

            <div style={{ position: "absolute", right: "10px", bottom: "110px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <div onClick={()=>handleLike(v.id)} style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: v.liked ? "#ef4444" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{v.liked ? "❤️" : "🤍"}</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "4px" }}>{v.likes}</div>
              </div>
              <div onClick={()=>setShowComments(true)} style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</div>
                <div style={{ color: "white", fontSize: "11px", marginTop: "4px" }}>12</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>🔖</div>
                <div style={{ color: "white", fontSize: "10px", marginTop: "4px" }}>Save</div>
              </div>
              <div onClick={()=>setShowShare(true)} style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center" }}>↗️</div>
                <div style={{ color: "white", fontSize: "10px", marginTop: "4px" }}>Share</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showShare && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }} onClick={()=>setShowShare(false)}>
          <div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "white" }}>Share to</b><span onClick={()=>setShowShare(false)} style={{ color: "white" }}>✕</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}>
              <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>WhatsApp</div></a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold", fontSize: "22px" }}>f</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Facebook</div></a>
              <div onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Link copied") }} style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Copy Link</div></div>
              <div style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>⬇️</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Save Video</div></div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "12px 0", borderTop: "1px solid #222", zIndex: 100 }}>
        <span onClick={()=>setCurrentTab("home")} style={{ color: currentTab==="home" ? "#facc15" : "white" }}>🏠 Home</span>
        <span onClick={()=>setCurrentTab("search")} style={{ color: currentTab==="search" ? "#facc15" : "white" }}>🔍 Search</span>
        <span onClick={()=>setCurrentTab("upload")} style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px" }}>+</span>
        <span onClick={()=>setCurrentTab("live")} style={{ color: currentTab==="live" ? "#facc15" : "white" }}>📺 LIVE</span>
        <span onClick={()=>setCurrentTab("me")} style={{ color: currentTab==="me" ? "#facc15" : "white" }}>👤 Me</span>
      </div>
    </div>
  )
}
