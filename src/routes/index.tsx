import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixedUpload,
})

function VibraFixedUpload() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [coins, setCoins] = useState(24)
  const [dp, setDp] = useState("")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [likes, setLikes] = useState([12000,12000,12000,12000,12000,12000,12000,12000])
  const [liked, setLiked] = useState([false,false,false,false,false,false,false,false])
  const [saved, setSaved] = useState([false,false,false,false,false,false,false,false])
  const [myVideos, setMyVideos] = useState<{id:number, title:string, user:string, poster:string, url:string, lyrics:string}[]>([])
  const [isLiveOn, setIsLiveOn] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream|null>(null)
  const videoRefs = useRef<(HTMLVideoElement|null)[]>([])
  const liveVideoRef = useRef<HTMLVideoElement|null>(null)
  const uploadVideoRef = useRef<HTMLVideoElement|null>(null)

  const baseVideos = [
    { id: 1, title: "VIBRA WORLDWIDE 🌍", user: "@MrVibra", poster: "https://picsum.photos/id/1015/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Vibra worldwide Mombasa to the world 🌍" },
    { id: 2, title: "Mombasa Support Vibra 💛", user: "@MrVibra", poster: "https://picsum.photos/id/1016/720/1280", url: "https://www.w3schools.com/html/movie.mp4", lyrics: "Support Vibra 24 Coins 💛" },
    { id: 3, title: "Coast Life 🌊", user: "@CoastVibes", poster: "https://picsum.photos/id/1025/720/1280", url: "https://www.w3schools.com/html/mov_bbb.mp4", lyrics: "Coast life yeah 🌊" },
  ]
  const videos = [...myVideos, ...baseVideos]

  useEffect(() => {
    const d=localStorage.getItem("vibra_dp"); if(d) setDp(d)
  }, [])

  const startCamera = async (target:'live'|'upload') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:{facingMode:'user'}, audio:true })
      setCameraStream(stream)
      setTimeout(()=>{
        if(target==='live' && liveVideoRef.current){ liveVideoRef.current.srcObject=stream; liveVideoRef.current.play(); setIsLiveOn(true) }
        if(target==='upload' && uploadVideoRef.current){ uploadVideoRef.current.srcObject=stream; uploadVideoRef.current.play() }
      },200)
    } catch { alert("⚠️ Ruhusu camera permission") }
  }
  const stopCamera = () => { if(cameraStream){ cameraStream.getTracks().forEach(t=>t.stop()); setCameraStream(null) } setIsLiveOn(false) }

  const handleLike = (idx:number) => {
    const nl=[...liked]; const nL=[...likes]
    nl[idx]=!nl[idx]; nL[idx]= nl[idx] ? nL[idx]+1 : nL[idx]-1
    setLiked(nl); setLikes(nL)
    if(nl[idx]){ const n=coins+1; setCoins(n) }
  }
  const handleSave = (idx:number) => { const s=[...saved]; s[idx]=!s[idx]; setSaved(s) }
  const handleShare = async () => { try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied! Share WhatsApp/Insta")}catch{ prompt("Copy:", window.location.href)}}
  const handleDp = (e:any) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result)}; r.readAsDataURL(f)}

  // HANDLE UPLOAD - SASA INAONYESHA VIDEO NA SHARE/COMMENT
  const handleFileUpload = (file:File) => {
    if(!file) return
    const url = URL.createObjectURL(file)
    const newVid = { id: Date.now(), title: file.name.replace('.mp4','') + " - My Vibra 💛", user: "@MrVibra", poster: url, url: url, lyrics: "My new Vibra video from Mombasa 🌍" }
    setMyVideos(prev=>[newVid, ...prev])
    setLikes(prev=>[0, ...prev]); setLiked(prev=>[false, ...prev]); setSaved(prev=>[false, ...prev])
    setCurrentIdx(0); setTab('home')
    alert("✅ Video ime-upload! Sasa inaonekana juu na share, comment, like zote!")
  }

  if(tab==='live'){
    return (
      <div style={{ background:'black', color:'white', minHeight:'100vh', position:'relative', overflow:'hidden'}}>
        {!isLiveOn && <div style={{ position:'absolute', inset:0, background:`url(${baseVideos[0].poster}) center/cover`, filter:'brightness(0.3)'}}></div>}
        <video ref={liveVideoRef} autoPlay muted playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:isLiveOn?'block':'none', background:'black'}}/>
        <div style={{ position:'relative', zIndex:2, padding:'45px 15px 70px', minHeight:'100vh', display:'flex', flexDirection:'column'}}>
          <div style={{ display:'flex', justifyContent:'space-between'}}>
            <span onClick={()=>{ stopCamera(); setTab('home')}} style={{ background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:'20px', cursor:'pointer'}}>← Close</span>
            <span style={{ background:isLiveOn?'#ef4444':'#333', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>🔴 {isLiveOn?'LIVE NOW':'OFFLINE'} • 1.2K</span>
            <span onClick={handleShare} style={{ background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:'20px', cursor:'pointer'}}>↗️ Share</span>
          </div>
          {!isLiveOn ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center'}}>
              <div style={{ width:'110px', height:'110px', borderRadius:'50%', background:dp?`url(${dp})`:'#333', backgroundSize:'cover', border:'4px solid #ef4444'}}></div>
              <h2>@MrVibra Go LIVE!</h2>
              <button onClick={()=>startCamera('live')} style={{ background:'#ef4444', color:'white', border:'none', padding:'16px 45px', borderRadius:'30px', fontWeight:'bold', marginTop:'20px', fontSize:'18px'}}>📷 START CAMERA</button>
            </div>
          ):(
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:'20px'}}>
              <div style={{ background:'rgba(0,0,0,0.6)', borderRadius:'12px', padding:'12px', marginBottom:'15px'}}>
                <p style={{ fontSize:'13px', margin:'4px 0'}}>💬 @CoastVibes: Bro uko live kali!</p>
                <p style={{ fontSize:'13px', margin:'4px 0'}}>💛 Live chat inaendelea...</p>
              </div>
              <div style={{ display:'flex', gap:'10px', justifyContent:'center'}}>
                <button onClick={stopCamera} style={{ background:'white', color:'black', border:'none', padding:'12px 25px', borderRadius:'25px', fontWeight:'bold'}}>⏹️ Stop</button>
                <button onClick={handleShare} style={{ background:'#facc15', color:'black', border:'none', padding:'12px 25px', borderRadius:'25px', fontWeight:'bold'}}>↗️ Share LIVE</button>
              </div>
            </div>
          )}
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  if(tab==='upload'){
    return (
      <div style={{ background:'black', color:'white', minHeight:'100vh', padding:'45px 15px 70px'}}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span onClick={()=>{ stopCamera(); setTab('home')}} style={{ cursor:'pointer'}}>← Cancel</span>
          <b>Upload Video</b>
          <span onClick={()=>{ stopCamera(); if(myVideos.length>0){ setTab('home')} else alert('Chagua file kwanza!')}} style={{ color:'#facc15', fontWeight:'bold', cursor:'pointer'}}>Done</span>
        </div>
        <div style={{ marginTop:'20px'}}>
          <div style={{ border:'2px dashed #333', borderRadius:'15px', overflow:'hidden', background:'#111', position:'relative', height:'340px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <video ref={uploadVideoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', display:cameraStream?'block':'none'}}/>
            {!cameraStream && (
              <div style={{ textAlign:'center', padding:'20px'}}>
                <div style={{ fontSize:'50px'}}>📷</div>
                <p style={{ fontWeight:'bold', margin:'8px 0'}}>Camera au File</p>
                <p style={{ fontSize:'11px', opacity:0.6}}>Video yako itaonekana Home na Share, Comment, Like</p>
                <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginTop:'15px', flexWrap:'wrap'}}>
                  <button onClick={()=>startCamera('upload')} style={{ background:'#ef4444', color:'white', border:'none', padding:'10px 18px', borderRadius:'20px', fontWeight:'bold'}}>📷 Open Camera</button>
                  <label style={{ background:'white', color:'black', padding:'10px 18px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}>
                    📁 Choose File
                    <input type="file" accept="video/*" hidden onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleFileUpload(f) }} />
                  </label>
                </div>
                {myVideos.length>0 && <p style={{ marginTop:'12px', color:'#facc15', fontSize:'12px'}}>✅ {myVideos.length} video uploaded - angalia Home!</p>}
              </div>
            )}
            {cameraStream && (
              <div style={{ position:'absolute', bottom:'10px', left:'10px', right:'10px', display:'flex', gap:'10px', justifyContent:'center'}}>
                <button onClick={()=>{ if(uploadVideoRef.current){ /* capture frame */ alert('📸 Photo captured! Sasa chagua Post'); } }} style={{ background:'#facc15', color:'black', border:'none', padding:'10px 20px', borderRadius:'20px', fontWeight:'bold'}}>📸 Capture</button>
                <button onClick={stopCamera} style={{ background:'rgba(0,0,0,0.7)', color:'white', border:'none', padding:'10px 15px', borderRadius:'20px'}}>✕ Close</button>
              </div>
            )}
          </div>
          <div style={{ marginTop:'15px'}}>
            <input placeholder="Andika caption... VIBRA WORLDWIDE 🌍" style={{ width:'100%', background:'#222', border:'none', borderRadius:'10px', padding:'14px', color:'white', marginBottom:'10px', boxSizing:'border-box'}}/>
            <p style={{ fontSize:'11px', opacity:0.5}}>Baada ya kuchagua file, video itaenda Home moja kwa moja na utaona Share, Comment, Like kama TikTok</p>
          </div>
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  if(tab==='me') return <div style={{ background:'black', color:'white', minHeight:'100vh', paddingBottom:'70px'}}><div style={{ padding:'45px 15px 10px', textAlign:'center'}}><input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp}/><div onClick={()=>document.getElementById('dpMe')?.click()} style={{ width:'85px', height:'85px', borderRadius:'50%', border:'3px solid #facc15', margin:'0 auto', background:dp?`url(${dp})`:'#222', backgroundSize:'cover', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>{!dp && 'WEKA DP'}</div><h3 style={{ margin:'8px 0 2px'}}>@MrVibra</h3><p style={{ opacity:0.6, fontSize:'13px'}}>{videos.length} Videos • {coins} Coins • {myVideos.length} My Uploads</p></div><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'2px', padding:'2px'}}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio:'3/4', backgroundImage:`url(${v.poster})`, backgroundSize:'cover', padding:'5px', display:'flex', alignItems:'flex-end'}}><span style={{ background:'rgba(0,0,0,0.6)', borderRadius:'4px', padding:'2px 4px', fontSize:'10px'}}>▶️</span></div>)}</div><BottomNav tab={tab} setTab={setTab}/></div>
  if(tab==='inbox') return <div style={{ background:'black', color:'white', minHeight:'100vh', padding:'45px 15px 70px'}}><h2 style={{ margin:0}}>📥 Inbox</h2><div style={{ marginTop:'15px', display:'flex', flexDirection:'column', gap:'10px'}}><div style={{ background:'#111', padding:'14px', borderRadius:'12px'}}>🔴 @CoastVibes: "Bro video kali!" • 2m</div><div style={{ background:'#111', padding:'14px', borderRadius:'12px'}}>💛 System: {coins} Coins! • 1h</div></div><BottomNav tab={tab} setTab={setTab}/></div>
  if(tab==='search') return <div style={{ background:'black', color:'white', minHeight:'100vh', padding:'45px 15px 70px'}}><div style={{ display:'flex', gap:'10px'}}><span onClick={()=>setTab('home')} style={{ cursor:'pointer'}}>←</span><input autoFocus placeholder="🔍 Tafuta..." style={{ flex:1, background:'#222', border:'none', borderRadius:'20px', padding:'12px 15px', color:'white'}}/></div><div style={{ marginTop:'15px'}}>{videos.map(v=><div key={v.id} onClick={()=>{ setCurrentIdx(videos.indexOf(v)); setTab('home')}} style={{ padding:'12px', background:'#111', margin:'8px 0', borderRadius:'10px', display:'flex', gap:'10px', alignItems:'center', cursor:'pointer'}}><img src={v.poster} style={{ width:'40px', height:'60px', objectFit:'cover', borderRadius:'6px'}}/><span>{v.title}</span></div>)}</div><BottomNav tab={tab} setTab={setTab}/></div>
  if(tab==='explore') return <div style={{ background:'black', color:'white', minHeight:'100vh', padding:'45px 2px 70px'}}><div style={{ padding:'0 12px', display:'flex', justifyContent:'space-between'}}><h3 style={{ margin:0}}>🧭 Explore</h3><span onClick={()=>setTab('search')} style={{ cursor:'pointer'}}>🔍</span></div><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', marginTop:'10px'}}>{videos.map((v,i)=><div key={v.id} onClick={()=>{ setCurrentIdx(i); setTab('home')}} style={{ aspectRatio:'9/16', backgroundImage:`url(${v.poster})`, backgroundSize:'cover', padding:'8px', display:'flex', alignItems:'flex-end', cursor:'pointer'}}><span style={{ background:'rgba(0,0,0,0.
