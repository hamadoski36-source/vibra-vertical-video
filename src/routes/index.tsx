import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFullFix,
})

function VibraFullFix() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState(12000)
  const [liked, setLiked] = useState(false)
  const [coins, setCoins] = useState(24)
  const [dp, setDp] = useState("")
  const [myVideoUrl, setMyVideoUrl] = useState<string|null>(null)
  const [bio, setBio] = useState("Mombasa Support Vibra 🌍 8 Videos")
  const videoRef = useRef<HTMLVideoElement|null>(null)

  useEffect(()=>{
    const d=localStorage.getItem("vibra_dp"); if(d) setDp(d)
    const b=localStorage.getItem("vibra_bio"); if(b) setBio(b)
  },[])

  const handleLike = () => {
    if(!liked){ setLikes(l=>l+1); setLiked(true); setCoins(c=>c+1) }
    else { setLikes(l=>l-1); setLiked(false) }
  }

  const handleUpload = (file:File) => {
    const url = URL.createObjectURL(file)
    setMyVideoUrl(url)
    setTab('home')
    alert("✅ Video uploaded na SAUTI! Bonyeza 🔊 kuweka sauti")
  }

  const handleDp = (e:any) => {
    const f=e.target.files[0]; if(!f) return
    const r=new FileReader()
    r.onload=(ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp", ev.target.result) }
    r.readAsDataURL(f)
  }

  const toggleSound = () => {
    if(videoRef.current){
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  // ME PAGE - SIO PICHA, NI PAGE HALISI NA BUTTONS ZOTE
  if(tab==='me'){
    return (
      <div style={{background:'black',color:'white',minHeight:'100vh',paddingBottom:'70px'}}>
        <div style={{padding:'15px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #222'}}>
          <b style={{fontSize:'18px'}}>@MrVibra</b>
          <div style={{display:'flex',gap:'15px'}}>
            <span onClick={()=>alert("Settings - hapa utabadilisha password, privacy")} style={{fontSize:'20px',cursor:'pointer'}}>⚙️</span>
            <span onClick={async()=>{ try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Profile link copied!")}catch{}} } style={{fontSize:'20px',cursor:'pointer'}}>↗️</span>
          </div>
        </div>

        <div style={{padding:'20px 15px',textAlign:'center'}}>
          <input type="file" id="dpMe" hidden accept="image/*" onChange={handleDp}/>
          <div onClick={()=>document.getElementById('dpMe')?.click()} 
               style={{width:'95px',height:'95px',borderRadius:'50%',border:'3px solid #facc15',margin:'0 auto',background:dp?`url(${dp})`:'#333',backgroundSize:'cover',backgroundPosition:'center',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative'}}>
            {!dp && <span style={{fontSize:'12px'}}>WEKA DP</span>}
            <div style={{position:'absolute',bottom:'0',right:'0',background:'#facc15',borderRadius:'50%',width:'28px',height:'28px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>📷</div>
          </div>

          <h2 style={{margin:'12px 0 4px'}}>@MrVibra</h2>
          <p style={{fontSize:'13px',opacity:0.8,margin:'0 0 5px'}}>{bio}</p>
          <p style={{fontSize:'12px',opacity:0.5}}>Mombasa, Kenya • {coins} Coins</p>

          <div style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'15px'}}>
            <button onClick={()=>{
              const newBio = prompt("Andika Bio mpya:", bio)
              if(newBio){ setBio(newBio); localStorage.setItem("vibra_bio", newBio) }
            }} style={{background:'#222',color:'white',border:'1px solid #333',borderRadius:'20px',padding:'8px 20px',fontWeight:'bold',fontSize:'13px',cursor:'pointer'}}>✏️ Edit Profile</button>
            <button onClick={async()=>{ try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!")}catch{}}} style={{background:'white',color:'black',border:'none',borderRadius:'20px',padding:'8px 20px',fontWeight:'bold',fontSize:'13px',cursor:'pointer'}}>↗️ Share Profile</button>
          </div>

          <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px',borderTop:'1px solid #222',paddingTop:'15px'}}>
            <div style={{textAlign:'center'}}><b>{myVideoUrl?1:8}</b><div style={{fontSize:'12px',opacity:0.6}}>Videos</div></div>
            <div style={{textAlign:'center'}}><b>{(likes/1000).toFixed(1)}K</b><div style={{fontSize:'12px',opacity:0.6}}>Likes</div></div>
            <div style={{textAlign:'center'}}><b>{coins}</b><div style={{fontSize:'12px',opacity:0.6}}>Coins</div></div>
            <div style={{textAlign:'center'}}><b>1.2K</b><div style={{fontSize:'12px',opacity:0.6}}>Followers</div></div>
          </div>
        </div>

        <div style={{display:'flex',borderTop:'1px solid #222',borderBottom:'1px solid #222'}}>
          <div style={{flex:1,textAlign:'center',padding:'12px',borderBottom:'2px solid white',fontWeight:'bold',fontSize:'14px'}}>🎬 Videos</div>
          <div onClick={()=>alert("Saved videos - hapa utaona video ulizo-save 🔖")} style={{flex:1,textAlign:'center',padding:'12px',opacity:0.5,fontSize:'14px',cursor:'pointer'}}>🔖 Saved</div>
          <div onClick={()=>alert("Liked videos - hapa utaona video ulizo-like ❤️")} style={{flex:1,textAlign:'center',padding:'12px',opacity:0.5,fontSize:'14px',cursor:'pointer'}}>❤️ Liked</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'2px',padding:'2px'}}>
          {[1,2,3,4,5,6,7,8].map(i=>(
            <div key={i} onClick={()=>setTab('home')} style={{aspectRatio:'9/16',background:'#111',backgroundImage:myVideoUrl && i===1 ? `url(https://picsum.photos/id/1015/200/300)` : `url(https://picsum.photos/id/${1015+i}/200/300)`,backgroundSize:'cover',display:'flex',alignItems:'flex-end',padding:'6px',cursor:'pointer',position:'relative'}}>
              <span style={{background:'rgba(0,0,0,0.6)',padding:'2px 5px',borderRadius:'4px',fontSize:'10px'}}>▶️ {i===1 && myVideoUrl ? 'MY' : i}</span>
              {i===1 && myVideoUrl && <span style={{position:'absolute',top:'5px',right:'5px',background:'#facc15',color:'black',fontSize:'8px',padding:'2px 4px',borderRadius:'4px',fontWeight:'bold'}}>NEW</span>}
            </div>
          ))}
        </div>

        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  if(tab==='upload'){
    return (
      <div style={{background:'black',color:'white',minHeight:'100vh',padding:'50px 15px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span onClick={()=>setTab('home')} style={{cursor:'pointer'}}>← Cancel</span><b>Upload Video</b><span style={{color:'#facc15'}}>Post</span></div>
        <div style={{marginTop:'30px',border:'2px dashed #444',borderRadius:'15px',padding:'40px 20px',textAlign:'center'}}>
          <div style={{fontSize:'50px'}}>🎬</div>
          <p style={{fontWeight:'bold'}}>Chagua Video Yako na Sauti</p>
          <label style={{background:'white',color:'black',padding:'14px 28px',borderRadius:'25px',fontWeight:'bold',display:'inline-block',marginTop:'15px',cursor:'pointer'}}>
            📁 Choose Video na Sauti
            <input type="file" accept="video/*" hidden onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleUpload(f) }} />
          </label>
          <p style={{fontSize:'11px',opacity:0.6,marginTop:'12px'}}>Video itakuwa na sauti - bonyeza 🔊 kwenye Home kuweka sauti</p>
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  // HOME - VIDEO NA SAUTI
  return (
    <div style={{background:'black',color:'white',height:'100vh',width:'100vw',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',justifyContent:'space-between',padding:'12px',background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <span style={{background:'#ef4444',borderRadius:'20px',padding:'5px 10px',fontSize:'12px'}}>● LIVE 1.2K</span>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          <span onClick={toggleSound} style={{background:'rgba(255,255,255,0.2)',borderRadius:'20px',padding:'6px 10px',cursor:'pointer',fontSize:'14px'}}>{isMuted ? '🔇 Sauti' : '🔊 Sauti'}</span>
          <span style={{color:'#facc15',fontWeight:'bold',fontSize:'13px'}}>{coins} Coins</span>
        </div>
      </div>

      <video 
        ref={videoRef}
        src={myVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
        poster="https://picsum.photos/id/1015/720/1280"
        autoPlay loop playsInline muted={isMuted}
        onClick={toggleSound}
        style={{height:'100%',width:'100%',objectFit:'cover'}}
      />

      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',borderRadius:'50%',width:'70px',height:'70px',display:isMuted?'flex':'none',alignItems:'center',justifyContent:'center',fontSize:'30px',cursor:'pointer',zIndex:20}} onClick={toggleSound}>🔇<br/><span style={{fontSize:'10px'}}>Tap for sound</span></div>

      {/* RIGHT SIDE - IMEINULIWA JUU - HAIZIBWI */}
      <div style={{position:'absolute',right:'12px',bottom:'200px',display:'flex',flexDirection:'column',gap:'12px',alignItems:'center',zIndex:50}}>
        <div style={{textAlign:'center',cursor:'pointer'}} onClick={()=>setTab('me')}>
          <div style={{width:'46px',height:'46px',borderRadius:'50%',border:'2px solid #facc15',background:dp?`url(${dp})`:'#333',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center'}}>DP</div>
          <div style={{fontSize:'9px',fontWeight:'bold'}}>@MrVibra</div>
        </div>

        <div onClick={handleLike} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:'34px'}}>{liked?'❤️':'🤍'}</div>
          <div style={{fontSize:'11px',fontWeight:'bold'}}>{(likes/1000).toFixed(1)}K</div>
        </div>

        <div onClick={()=>setShowComments(true)} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:'28px'}}>💬</div>
          <div style={{fontSize:'11px'}}>345</div>
        </div>

        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'24px'}}>🔖</div>
          <div style={{fontSize:'9px'}}>Save</div>
        </div>

        <div onClick={toggleSound} style={{textAlign:'center',cursor:'pointer',background:isMuted?'rgba(255,255,255,0.15)':'#facc15',borderRadius:'10px',padding:'5px 7px'}}>
          <div style={{fontSize:'20px'}}>{isMuted?'🔇':'🔊'}</div>
          <div style={{fontSize:'8px',fontWeight:'bold',color:isMuted?'white':'black'}}>{isMuted?'Mute':'Sound'}</div>
        </div>

        <div onClick={async()=>{ try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!")}catch{}}} 
             style={{textAlign:'center',cursor:'pointer',background:'#facc15',borderRadius:'12px',padding:'8px 10px',border:'2px solid white'}}>
          <div style={{fontSize:'22px'}}>↗️</div>
          <div style={{fontSize:'10px',fontWeight:'bold',color:'black'}}>Share</div>
        </div>
      </div>

      <div style={{position:'absolute',bottom:'75px',left:'12px',right:'80px'}}>
        <p style={{fontWeight:'bold',margin:0,fontSize:'14px'}}>{myVideoUrl ? "My Video - Bonyeza 🔊 kwa sauti" : "VIBRA WORLDWIDE 🌍 - Tap 🔊 for sound"}</p>
        <p style={{fontSize:'12px',margin:'4px 0'}}>{likes} likes • {isMuted ? '🔇 Tap video kwa sauti' : '🔊 Sauti iko ON'}</p>
      </div>

      {showComments && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'#111',borderRadius:'15px 15px 0 0',padding:'15px',maxHeight:'40vh'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><b>💬 Comments 345</b><span onClick={()=>setShowComments(false)} style={{cursor:'pointer'}}>✕</span></div>
          <div style={{background:'#222',padding:'10px',borderRadius:'8px'}}><b>@CoastVibes:</b> Bro video kali sana! 🔥</div>
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab}/>
    </div>
  )
}

function BottomNav({ tab, setTab }:any){
  return <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:100,background:'black',display:'flex',justifyContent:'space-around',padding:'8px 0',borderTop:'1px solid #222'}}><div onClick={()=>setTab('home')} style={{textAlign:'center',opacity:tab==='home'?1:0.5,cursor:'pointer'}}><div>🏠</div><div style={{fontSize:'9px'}}>Home</div></div><div onClick={()=>setTab('home')} style={{textAlign:'center',opacity:0.5}}><div>🧭</div><div style={{fontSize:'9px'}}>Explore</div></div><div onClick={()=>setTab('upload')} style={{textAlign:'center',cursor:'pointer'}}><div style={{background:'white',color:'black',borderRadius:'8px',padding:'2px 14px'}}> + </div><div style={{fontSize:'9px'}}>Upload</div></div><div style={{textAlign:'center',opacity:0.5}}><div>📥</div><div style={{fontSize:'9px'}}>Inbox</div></div><div onClick={()=>setTab('me')} style={{textAlign:'center',opacity:tab==='me'?1:0.5,cursor:'pointer'}}><div>👤</div><div style={{fontSize:'9px'}}>Me</div></div></div>
}
