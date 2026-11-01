import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: TikTokVibra,
})

function TikTokVibra() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState(12000)
  const [liked, setLiked] = useState(false)
  const [hearts, setHearts] = useState<{id:number,x:number}[]>([])
  const [comments, setComments] = useState(["@CoastVibes: Bro video kali sana! 🔥","@BeachBoy: Mombasa to the world 🌍","@MrVibra: Asante Mombasa 💛","@VibraFan: Support Vibra!"])
  const [newComment, setNewComment] = useState("")
  const [dp, setDp] = useState("")
  const [myVideoUrl, setMyVideoUrl] = useState<string|null>(null)
  const [isLiveOn, setIsLiveOn] = useState(false)
  const [liveComments, setLiveComments] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement|null>(null)
  const liveVideoRef = useRef<HTMLVideoElement|null>(null)

  // SAUTI INAKATA UKITOKA APP - KAMA TIKTOK
  useEffect(()=>{
    const handleVisibility = () => {
      if(document.hidden){
        if(videoRef.current) videoRef.current.pause()
        if(liveVideoRef.current) liveVideoRef.current.pause()
      } else {
        if(videoRef.current && tab==='home') videoRef.current.play().catch(()=>{})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return ()=>document.removeEventListener('visibilitychange', handleVisibility)
  },[tab])

  useEffect(()=>{
    const d=localStorage.getItem("vibra_dp"); if(d) setDp(d)
  },[])

  // LIKE KAMA TIKTOK - MIOYO INARUKA
  const handleLike = () => {
    const newHearts = Array.from({length:5},(_,i)=>({id:Date.now()+i, x: Math.random()*60+20}))
    setHearts(prev=>[...prev, ...newHearts])
    setTimeout(()=> setHearts(prev=>prev.slice(5)), 1000)
    
    if(!liked){ setLikes(l=>l+1); setLiked(true) }
    else { setLikes(l=>l-1); setLiked(false) }
  }

  const handleAddComment = () => {
    if(!newComment.trim()) return
    setComments(prev=>[...prev, `@MrVibra: ${newComment}`])
    setNewComment("")
  }

  const handleUpload = (file:File) => {
    const url = URL.createObjectURL(file)
    setMyVideoUrl(url)
    setTab('home')
  }

  const startLive = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true})
      if(liveVideoRef.current){ liveVideoRef.current.srcObject=stream; liveVideoRef.current.play() }
      setIsLiveOn(true)
      setLiveComments(["@CoastVibes: Uko live! 🔥","@BeachBoy: Mombasa! 🌍"])
      const interval = setInterval(()=>{
        if(!isLiveOn) clearInterval(interval)
        setLiveComments(prev=>[...prev.slice(-4), `@User${Math.floor(Math.random()*100)}: Nice live! ❤️`])
      },3000)
    } catch { alert("Ruhusu camera permission") }
  }

  // ME PAGE HALISI
  if(tab==='me'){
    return (
      <div style={{background:'black',color:'white',minHeight:'100vh',paddingBottom:'70px'}}>
        <div style={{padding:'12px',display:'flex',justifyContent:'space-between',borderBottom:'1px solid #222'}}>
          <b>@MrVibra</b>
          <div style={{display:'flex',gap:'12px'}}><span>⚙️</span><span>☰</span></div>
        </div>
        <div style={{padding:'20px',textAlign:'center'}}>
          <input type="file" id="dp" hidden accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev:any)=>{ setDp(ev.target.result); localStorage.setItem("vibra_dp",ev.target.result)}; r.readAsDataURL(f)}}/>
          <div onClick={()=>document.getElementById('dp')?.click()} style={{width:'90px',height:'90px',borderRadius:'50%',margin:'0 auto',background:dp?`url(${dp})`:'#333',backgroundSize:'cover',border:'2px solid #facc15',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{!dp && 'DP 📷'}</div>
          <h3 style={{margin:'10px 0 5px'}}>@MrVibra</h3>
          <p style={{fontSize:'13px',opacity:0.7}}>Mombasa Support Vibra 🌍</p>
          <div style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'12px'}}>
            <button style={{background:'white',color:'black',border:'none',borderRadius:'4px',padding:'8px 20px',fontWeight:'bold'}}>Edit profile</button>
            <button style={{background:'#222',color:'white',border:'none',borderRadius:'4px',padding:'8px 15px'}}>🔖</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px'}}>
            <div><b>8</b><div style={{fontSize:'12px',opacity:0.6}}>Following</div></div>
            <div><b>1.2K</b><div style={{fontSize:'12px',opacity:0.6}}>Followers</div></div>
            <div><b>{likes}</b><div style={{fontSize:'12px',opacity:0.6}}>Likes</div></div>
          </div>
        </div>
        <div style={{display:'flex',borderTop:'1px solid #222'}}><div style={{flex:1,textAlign:'center',padding:'10px',borderBottom:'2px solid white'}}>🎬 Videos</div><div style={{flex:1,textAlign:'center',padding:'10px',opacity:0.5}}>🔒 Private</div><div style={{flex:1,textAlign:'center',padding:'10px',opacity:0.5}}>❤️ Liked</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1px'}}>{[1,2,3,4,5,6].map(i=><div key={i} onClick={()=>setTab('home')} style={{aspectRatio:'9/16',background:'#111',backgroundImage:`url(https://picsum.photos/id/${1015+i}/200/300)`,backgroundSize:'cover'}}></div>)}</div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  // LIVE PAGE KAMA TIKTOK HALISI
  if(tab==='live'){
    return (
      <div style={{background:'black',color:'white',height:'100vh',position:'relative',overflow:'hidden'}}>
        <video ref={liveVideoRef} autoPlay muted playsInline style={{width:'100%',height:'100%',objectFit:'cover',display:isLiveOn?'block':'none'}}/>
        {!isLiveOn && <div style={{position:'absolute',inset:0,background:'url(https://picsum.photos/id/1015/720/1280) center/cover',filter:'brightness(0.4)'}}></div>}
        
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10,display:'flex',justifyContent:'space-between',padding:'45px 12px 10px',background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <span onClick={()=>{ setIsLiveOn(false); setTab('home')}} style={{background:'rgba(0,0,0,0.5)',padding:'6px 10px',borderRadius:'20px'}}>✕</span>
            <div style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(0,0,0,0.5)',padding:'4px 8px',borderRadius:'20px'}}>
              <div style={{width:'30px',height:'30px',borderRadius:'50%',background:dp?`url(${dp})`:'#facc15',backgroundSize:'cover'}}></div>
              <div><div style={{fontSize:'11px',fontWeight:'bold'}}>@MrVibra</div><div style={{fontSize:'9px',opacity:0.7}}>1.2K viewers</div></div>
              <button style={{background:'#facc15',color:'black',border:'none',borderRadius:'15px',padding:'4px 10px',fontSize:'10px',fontWeight:'bold',marginLeft:'5px'}}>Follow</button>
            </div>
          </div>
          <div style={{background:'#ef4444',padding:'5px 12px',borderRadius:'15px',fontSize:'11px',fontWeight:'bold'}}>🔴 LIVE</div>
        </div>

        <div style={{position:'absolute',bottom:'80px',left:'12px',right:'80px',zIndex:10}}>
          {liveComments.map((c,i)=><div key={i} style={{background:'rgba(0,0,0,0.5)',padding:'6px 10px',borderRadius:'15px',margin:'5px 0',fontSize:'12px',display:'inline-block',maxWidth:'80%'}}>{c}</div>)}
        </div>

        <div style={{position:'absolute',right:'12px',bottom:'90px',zIndex:10,display:'flex',flexDirection:'column',gap:'15px',alignItems:'center'}}>
          <div onClick={()=>{ setHearts(prev=>[...prev, {id:Date.now(), x:50}]); setTimeout(()=>setHearts(p=>p.slice(1)),1000)}} style={{textAlign:'center'}}>
            <div style={{fontSize:'32px'}}>❤️</div><div style={{fontSize:'10px'}}>{likes}</div>
          </div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'26px'}}>💬</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'26px'}}>↗️</div></div>
        </div>

        <div style={{position:'absolute',bottom:'15px',left:'12px',right:'12px',zIndex:10,display:'flex',gap:'8px'}}>
          <input placeholder="Add comment... Mombasa support!" style={{flex:1,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'20px',padding:'10px 15px',color:'white'}}/>
          <button style={{background:'white',border:'none',borderRadius:'50%',width:'40px',height:'40px'}}>➤</button>
        </div>

        {!isLiveOn && (
          <div style={{position:'absolute',inset:0,zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:'100px',height:'100px',borderRadius:'50%',background:dp?`url(${dp})`:'#333',backgroundSize:'cover',border:'3px solid #ef4444'}}></div>
            <h2 style={{margin:'15px 0 5px'}}>Go LIVE kama TikTok</h2>
            <p style={{fontSize:'13px',opacity:0.7}}>Watu 1.2K wanasubiri</p>
            <button onClick={startLive} style={{background:'#ef4444',color:'white',border:'none',padding:'14px 35px',borderRadius:'25px',fontWeight:'bold',marginTop:'20px',fontSize:'16px'}}>📷 START LIVE CAMERA</button>
          </div>
        )}

        {hearts.map(h=><div key={h.id} style={{position:'absolute',right:`${h.x}%`,bottom:'90px',fontSize:'28px',animation:'floatHeart 1s ease-out forwards',zIndex:20}}>❤️</div>)}
        <style>{`@keyframes floatHeart {0%{transform:translateY(0) scale(1); opacity:1} 100%{transform:translateY(-150px) scale(1.5); opacity:0}}`}</style>

        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  if(tab==='upload'){
    return (
      <div style={{background:'black',color:'white',minHeight:'100vh',padding:'50px 15px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span onClick={()=>setTab('home')}>← Cancel</span><b>Upload</b><span>Post</span></div>
        <div style={{marginTop:'30px',border:'2px dashed #444',borderRadius:'15px',padding:'40px 20px',textAlign:'center'}}>
          <div style={{fontSize:'50px'}}>🎬</div>
          <label style={{background:'white',color:'black',padding:'12px 25px',borderRadius:'25px',fontWeight:'bold',display:'inline-block',marginTop:'15px',cursor:'pointer'}}>
            📁 Choose Video
            <input type="file" accept="video/*" hidden onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleUpload(f) }} />
          </label>
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  // HOME - TIKTOK HALISI
  return (
    <div style={{background:'black',color:'white',height:'100vh',width:'100vw',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',justifyContent:'center',gap:'20px',padding:'10px',background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <span style={{fontWeight:'bold',borderBottom:'2px solid white',paddingBottom:'2px'}}>For You</span>
        <span style={{opacity:0.6}} onClick={()=>setTab('live')}>LIVE • 1.2K</span>
      </div>

      <video 
        ref={videoRef}
        src={myVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
        autoPlay loop playsInline muted={isMuted}
        onClick={()=>{ if(videoRef.current){ videoRef.current.muted=!videoRef.current.muted; setIsMuted(videoRef.current.muted) } }}
        style={{height:'100%',width:'100%',objectFit:'cover'}}
      />

      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.7)',borderRadius:'30px',padding:'12px 20px',display:isMuted?'flex':'none',flexDirection:'column',alignItems:'center',zIndex:20,cursor:'pointer'}} onClick={()=>{ if(videoRef.current){ videoRef.current.muted=false; setIsMuted(false) }}}>
        <div style={{fontSize:'30px'}}>🔇</div><div style={{fontSize:'11px'}}>Tap to unmute</div><div style={{fontSize:'9px',opacity:0.7}}>Sauti itakata ukitoka app</div>
      </div>

      {/* RIGHT SIDE - SIO PICHA, NI BUTTONS HALISI KAMA TIKTOK */}
      <div style={{position:'absolute',right:'10px',bottom:'160px',display:'flex',flexDirection:'column',gap:'14px',alignItems:'center',zIndex:50}}>
        <div onClick={()=>setTab('me')} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',border:'2px solid white',background:dp?`url(${dp})`:'#333',backgroundSize:'cover',position:'relative'}}>
            <div style={{position:'absolute',bottom:'-8px',left:'50%',transform:'translateX(-50%)',background:'#ef4444',borderRadius:'50%',width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'white'}}>+</div>
          </div>
        </div>

        <div onClick={handleLike} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>{liked?'❤️':'🤍'}</div>
          <div style={{fontSize:'12px',fontWeight:'bold',marginTop:'4px'}}>{likes>1000?(likes/1000).toFixed(1)+'K':likes}</div>
        </div>

        <div onClick={()=>setShowComments(true)} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px'}}>💬</div>
          <div style={{fontSize:'12px',fontWeight:'bold',marginTop:'4px'}}>{comments.length}</div>
        </div>

        <div style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>🔖</div>
          <div style={{fontSize:'10px',marginTop:'4px'}}>Save</div>
        </div>

        <div onClick={async()=>{ try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied! Share kama TikTok")}catch{}}} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>↗️</div>
          <div style={{fontSize:'10px',fontWeight:'bold',marginTop:'4px'}}>Share</div>
        </div>
      </div>

      <div style={{position:'absolute',bottom:'75px',left:'12px',right:'75px',zIndex:10}}>
        <p style={{fontWeight:'bold',margin:0,fontSize:'14px'}}>@MrVibra</p>
        <p style={{fontSize:'13px',margin:'5px 0'}}>{myVideoUrl ? "My video with sound! Tap 🔊" : "VIBRA WORLDWIDE 🌍 Mombasa support"}</p>
        <p style={{fontSize:'12px',opacity:0.8}}>🎵 Original Sound - @MrVibra • {isMuted?'🔇 Tap for sound':'🔊 Sound ON - inakata ukitoka app'}</p>
      </div>

      {hearts.map(h=><div key={h.id} style={{position:'absolute',right:`${h.x}%`,bottom:'160px',fontSize:'32px',animation:'floatHeart 1s ease-out forwards',zIndex:60,pointerEvents:'none'}}>❤️</div>)}

      {/* COMMENTS PAGE HALISI - SIO PICHA */}
      {showComments && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(false)}>
          <div style={{background:'#121212',width:'100%',maxHeight:'65vh',borderRadius:'15px 15px 0 0',padding:'15px',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{width:'40px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 10px'}}></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><b>{comments.length} comments</b><span onClick={()=>setShowComments(false)} style={{cursor:'pointer'}}>✕</span></div>
            <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px',marginBottom:'10px'}}>
              {comments.map((c,i)=><div key={i} style={{display:'flex',gap:'10px'}}><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#333',flexShrink:0}}></div><div><div style={{fontSize:'12px',opacity:0.6}}>@user{i}</div><div style={{fontSize:'13px'}}>{c}</div><div style={{fontSize:'11px',opacity:0.5,marginTop:'4px'}}>2h ago • ❤️ 12 • Reply</div></div></div>)}
            </div>
            <div style={{display:'flex',gap:'8px',borderTop:'1px solid #222',paddingTop:'10px'}}>
              <input value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleAddComment() }} placeholder="Add comment... Mombasa!" style={{flex:1,background:'#222',border:'none',borderRadius:'20px',padding:'10px 15px',color:'white'}}/>
              <button onClick={handleAddComment} style={{background:'none',border:'none',color:'#facc15',fontWeight:'bold',cursor:'pointer'}}>Post</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab}/>
      <style>{`@keyframes floatHeart {0%{transform:translateY(0) scale(1); opacity:1} 100%{transform:translateY(-180px) scale(1.6); opacity:0}}`}</style>
    </div>
  )
}

function BottomNav({ tab, setTab }:any){
  return <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:100,background:'black',display:'flex',justifyContent:'space-around',padding:'8px 0',borderTop:'1px solid #222'}}><div onClick={()=>setTab('home')} style={{textAlign:'center',opacity:tab==='home'?1:0.6,cursor:'pointer'}}><div style={{fontSize:'22px'}}>🏠</div><div style={{fontSize:'9px'}}>Home</div></div><div onClick={()=>setTab('home')} style={{textAlign:'center',opacity:0.6}}><div style={{fontSize:'22px'}}>🧭</div><div style={{fontSize:'9px'}}>Explore</div></div><div onClick={()=>setTab('upload')} style={{textAlign:'center',cursor:'pointer'}}><div style={{background:'white',color:'black',borderRadius:'8px',padding:'2px 14px',fontSize:'20px'}}>+</div></div><div onClick={()=>setTab('live')} style={{textAlign:'center',opacity:tab==='live'?1:0.6,cursor:'pointer'}}><div style={{fontSize:'22px'}}>📥</div><div style={{fontSize:'9px'}}>LIVE</div></div><div onClick={()=>setTab('me')} style={{textAlign:'center',opacity:tab==='me'?1:0.6,cursor:'pointer'}}><div style={{fontSize:'22px'}}>👤</div><div style={{fontSize:'9px'}}>Me</div></div></div>
}
