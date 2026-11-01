import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraProfile,
})

function VibraProfile() {
  const [currentTab, setCurrentTab] = useState("home")
  const [forYouTab, setForYouTab] = useState("foryou")
  const [currentVideo, setCurrentVideo] = useState(0)
  const [showShare, setShowShare] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  
  // PROFILE DATA - SASA UNAWEZA KUIBADILISHA
  const [profile, setProfile] = useState({
    name: "Mr Vibra",
    username: "@MrVibra",
    bio: "Mombasa to the world 🌍🔥 | Coast Vibes | Support Vibra 💛",
    avatar: "V",
    followers: 1200,
    following: 89,
    location: "Mombasa, Kenya 🇰🇪"
  })
  const [editName, setEditName] = useState(profile.name)
  const [editBio, setEditBio] = useState(profile.bio)
  const [editAvatar, setEditAvatar] = useState<string | null>(null)

  const [videos, setVideos] = useState([
    { id: 1, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", caption: "Mombasa to the world 🌍🔥", tags: "#vibra #mombasa", likes: 12001, liked: true, views: "12.5K" },
    { id: 2, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", caption: "Coast vibes lazima 💃", tags: "#coast #kenya", likes: 8500, liked: false, views: "8.5K" },
    { id: 3, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", caption: "Beach life Mombasa", tags: "#beach #tiktokkenya", likes: 15200, liked: false, views: "15.2K" },
  ])

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (i === currentVideo && currentTab === "home") v.play().catch(()=>{})
        else v.pause()
      }
    })
  }, [currentVideo, currentTab])

  const handleScroll = (e: any) => {
    const h = e.target.clientHeight
    const idx = Math.round(e.target.scrollTop / h)
    if (idx !== currentVideo) setCurrentVideo(idx)
  }

  const handleLike = (id: number) => {
    setVideos(videos.map(v => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v))
  }

  const saveProfile = () => {
    setProfile({ ...profile, name: editName, bio: editBio, avatar: editAvatar || profile.avatar })
    setShowEditProfile(false)
    alert("✅ Profile imebadilishwa!")
  }

  // ========== ME PAGE NA PROFILE KAMILI ==========
  if (currentTab === "me") {
    return (
      <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>{profile.username}</span>
          <div style={{ display: "flex", gap: "15px", fontSize: "20px" }}>
            <span>⚙️</span>
            <span>☰</span>
          </div>
        </div>

        <div style={{ padding: "10px 20px", textAlign: "center" }}>
          {/* AVATAR - SASA UNAWEZA KUBADILISHA PICHA */}
          <div style={{ position: "relative", width: "90px", height: "90px", margin: "0 auto" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "35px", color: "black", fontWeight: "bold", overflow: "hidden" }}>
              {editAvatar ? <img src={editAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profile.avatar}
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, background: "#25D366", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", border: "2px solid black" }}>✓</div>
          </div>

          <h3 style={{ margin: "12px 0 5px" }}>{profile.name}</h3>
          <p style={{ fontSize: "13px", opacity: 0.6, margin: 0 }}>{profile.username} • {profile.location}</p>
          <p style={{ fontSize: "13px", marginTop: "10px", lineHeight: "1.4" }}>{profile.bio}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "18px" }}>
            <div><b>{profile.following}</b><div style={{ fontSize: "12px", opacity: 0.6 }}>Following</div></div>
            <div><b>{profile.followers.toLocaleString()}</b><div style={{ fontSize: "12px", opacity: 0.6 }}>Followers</div></div>
            <div><b>{videos.reduce((a,b)=>a+b.likes,0).toLocaleString()}</b><div style={{ fontSize: "12px", opacity: 0.6 }}>Likes</div></div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "18px" }}>
            <button onClick={()=>setShowEditProfile(true)} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>Edit profile</button>
            <button onClick={()=>setShowShare(true)} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>Share profile</button>
            <button style={{ background: "#222", padding: "10px 14px", borderRadius: "8px", border: "1px solid #333" }}>👤+</button>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "15px", fontSize: "12px" }}>
            <span style={{ background: "#111", padding: "5px 10px", borderRadius: "15px" }}>🔗 vibra.world/mrvibra</span>
            <span style={{ background: "#111", padding: "5px 10px", borderRadius: "15px" }}>📍 Mombasa</span>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid #222", marginTop: "15px" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "12px", borderBottom: "2px solid white", fontSize: "18px" }}>🎬</div>
          <div style={{ flex: 1, textAlign: "center", padding: "12px", opacity: 0.4, fontSize: "18px" }}>🔒</div>
          <div style={{ flex: 1, textAlign: "center", padding: "12px", opacity: 0.4, fontSize: "18px" }}>❤️</div>
          <div style={{ flex: 1, textAlign: "center", padding: "12px", opacity: 0.4, fontSize: "18px" }}>🔖</div>
        </div>

        {/* VIDEO GRID - ZINACHEZA LIVE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "#222" }}>
          {videos.map((v, i) => (
            <div key={v.id} onClick={() => { setCurrentTab("home"); setCurrentVideo(i) }} style={{ position: "relative", aspectRatio: "3/4", background: "black", overflow: "hidden" }}>
              <video src={v.url} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "5px", left: "5px", fontSize: "11px", display: "flex", alignItems: "center", gap: "3px", color: "white" }}>▶️ {v.views}</div>
              <div style={{ position: "absolute", top: "5px", right: "5px", fontSize: "10px", background: "rgba(0,0,0,0.5)", padding: "2px 5px", borderRadius: "4px", color: "white" }}>📌</div>
            </div>
          ))}
        </div>

        {/* EDIT PROFILE MODAL */}
        {showEditProfile && (
          <div style={{ position: "fixed", inset: 0, background: "black", zIndex: 300, padding: "15px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span onClick={()=>setShowEditProfile(false)} style={{ fontSize: "20px" }}>✕</span>
              <b>Edit profile</b>
              <span onClick={saveProfile} style={{ color: "#facc15", fontWeight: "bold" }}>Save</span>
            </div>

            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#facc15", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "black", fontWeight: "bold", overflow: "hidden" }}>
                {editAvatar ? <img src={editAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profile.avatar}
              </div>
              <label style={{ display: "inline-block", marginTop: "12px", color: "#facc15", fontSize: "13px", cursor: "pointer" }}>
                Change photo
                <input type="file" hidden accept="image/*" onChange={e=>{
                  const f = e.target.files?.[0]; if(!f) return;
                  const url = URL.createObjectURL(f);
                  setEditAvatar(url);
                }} />
              </label>
            </div>

            <div style={{ marginTop: "25px" }}>
              <p style={{ fontSize: "12px", opacity: 0.6 }}>Name</p>
              <input value={editName} onChange={e=>setEditName(e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", marginTop: "5px" }} />
              
              <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "15px" }}>Username</p>
              <input value={profile.username} disabled style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "gray", marginTop: "5px" }} />
              
              <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "15px" }}>Bio</p>
              <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} maxLength={80} style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", marginTop: "5px", height: "80px" }} />
              <p style={{ fontSize: "11px", opacity: 0.4, textAlign: "right" }}>{editBio.length}/80</p>

              <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "15px" }}>Location</p>
              <input value={profile.location} onChange={e=>setProfile({...profile, location: e.target.value})} style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", marginTop: "5px" }} />
            </div>

            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button style={{ background: "#111", border: "none", padding: "12px", borderRadius: "8px", color: "white", textAlign: "left" }}>🔗 Add link to bio</button>
              <button style={{ background: "#111", border: "none", padding: "12px", borderRadius: "8px", color: "white", textAlign: "left" }}>📧 Add email</button>
            </div>
          </div>
        )}

        {showShare && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }} onClick={()=>setShowShare(false)}>
            <div style={{ background: "#1a1a1a", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px" }} onClick={e=>e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><b>Share profile</b><span onClick={()=>setShowShare(false)}>✕</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginTop: "20px" }}>
                <a href={`https://wa.me/?text=${encodeURIComponent(profile.bio + " " + window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>WhatsApp</div></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ width: "55px", height: "55px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "white", fontWeight: "bold" }}>f</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Facebook</div></a>
                <div onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Profile link copied!") }} style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>🔗</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Copy link</div></div>
                <div style={{ textAlign: "center" }}><div style={{ width: "55px", height: "55px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>📩</div><div style={{ color: "white", fontSize: "11px", marginTop: "6px" }}>Message</div></div>
              </div>
            </div>
          </div>
        )}

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #222" }}>
          <span onClick={() => setCurrentTab("home")}>🏠 Home</span>
          <span>🔍 Discover</span>
          <span>➕</span>
          <span>📥 Inbox</span>
          <span style={{ color: "#facc15" }}>👤 Me</span>
        </div>
      </div>
    )
  }

  // HOME PAGE
  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", gap: "20px", padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
        <span onClick={()=>setForYouTab("following")} style={{ color: forYouTab==="following" ? "white" : "rgba(255,255,255,0.6)", fontWeight: forYouTab==="following" ? "bold" : "400", borderBottom: forYouTab==="following" ? "2px solid white" : "none", paddingBottom: "4px" }}>Following</span>
        <span onClick={()=>setForYouTab("foryou")} style={{ color: forYouTab==="foryou" ? "white" : "rgba(255,255,255,0.6)", fontWeight: forYouTab==="foryou" ? "bold" : "400", borderBottom: forYouTab==="foryou" ? "2px solid white" : "none", paddingBottom: "4px" }}>For You</span>
      </div>

      <div onScroll={handleScroll} style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {videos.map((v, i) => (
          <div key={v.id} style={{ height: "100vh", position: "relative", scrollSnapAlign: "start" }}>
            <video ref={el => { videoRefs.current[i] = el }} src={v.url} loop muted playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "cover" }} onClick={e => { const vid = e.currentTarget; vid.paused ? vid.play() : vid.pause() }} />
            <div style={{ position: "absolute", bottom: "90px", left: "12px", right: "85px", color: "white" }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{profile.username} {v.id === 1 ? "✓" : ""}</p>
              <p style={{ fontSize: "13px", margin: "5px 0" }}>{v.caption}</p>
              <p style={{ fontSize: "13px", color: "#facc15" }}>{v.tags}</p>
            </div>
            <div style={{ position: "absolute", right: "10px", bottom: "110px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>{profile.avatar}</div>
                <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%)", background: "#facc15", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "black" }}>+</div>
              </div>
              <div onClick={()=>handleLike(v.id)} style={{ textAlign: "center" }}><div style={{ width: "48px", height: "48px", borderRadius: "50%", background: v.liked ? "#ef4444" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{v.liked ? "❤️" : "🤍"}</div><div style={{ color: "white", fontSize: "11px", marginTop: "4px" }}>{v.likes}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</div><div style={{ color: "white", fontSize: "11px", marginTop: "4px" }}>12</div></div>
              <div onClick={()=>setShowShare(true)} style={{ textAlign: "center" }}><div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#facc15", display: "flex", alignItems: "center", justifyContent: "center" }}>↗️</div><div style={{ color: "white", fontSize: "10px", marginTop: "4px" }}>Share</div></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", display: "flex", justifyContent: "space-around", padding: "12px 0", borderTop: "1px solid #222", zIndex: 100 }}>
        <span style={{ color: "#facc15" }}>🏠 Home</span>
        <span>🔍 Discover</span>
        <span style={{ background: "white", color: "black", padding: "2px 14px", borderRadius: "8px" }}>+</span>
        <span>📥 Inbox</span>
        <span onClick={()=>setCurrentTab("me")}>👤 Me</span>
      </div>
    </div>
  )
}
