import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraTikTokFull })

function VibraTikTokFull(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [muted,setMuted]=useState(true)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [tab,setTab]=useState('home')
  const [progress,setProgress]=useState(0)
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [likes,setLikes]=useState(()=> Number(localStorage.getItem('vibra_likes')||'243'))
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [showLyrics,setShowLyrics]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')
  const [comments,setComments]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_c')||'["@Monalisa: 🔥 Moto sana!", "@Fan: Lyrics ziko 🔥"]'))
  const [newC,setNewC]=useState('')
  const [myVideos,setMyVideos]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_real_videos')||'[]').filter((s:string)=> s.startsWith('data:video')))
  const [ads,setAds]=useState<any[]>(()=> JSON.parse(localStorage.getItem('vibra_real_ads')||'[]'))

  const all = myVideos.length>0 ? myVideos : ['https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4']
  const currentSrc = all[idx % all.length]
  const safeIdx = idx % all.length

  useEffect(()=>{
    const v=videoRef.current; if(!v) return
    const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100)
    const onEnd=()=> setIdx(i=> (i+1)%all.length)
    v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnd)
    v.muted = !hasInteracted; setMuted(!hasInteracted)
    v.load(); v.play().catch(()=>{})
    return ()=> { v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) }
  }, [safeIdx, hasInteracted])

  const next=()=> { setIdx(i=> (i+1)%all.length); setLiked(false); setSaved(false) }
  const prev=()=> { setIdx(i=> (i-1+all.length)%all.length); setLiked(false); setSaved(false) }
  const handleSound=()=>{
    if(!hasInteracted){ setHasInteracted(true); setMuted(false); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play() } }
    else { setMuted(!muted); if(videoRef.current) videoRef.current.muted=!videoRef.current.muted }
  }
  const handleLike=()=>{ if(liked){ setLikes(l=>l-1); setLiked(false)} else { setLikes(l=>l+1); setLiked(true)}; localStorage.setItem('vibra_likes', String(liked?likes-1:likes+1)) }
  const handleFile=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader(); r.onload=()=>{ const b64=r.result as string; const nl=[b64, ...myVideos].slice(0,20); setMyVideos(nl); localStorage.setItem('vibra_real_videos', JSON.stringify(nl)); setShowUpload(false); setIdx(0) }; r.readAsDataURL(file)
  }
  const addComment=()=>{ if(!newC.trim()) return; const c=`${username}: ${newC}`; const nl=[...comments,c]; setComments(nl); localStorage.setItem('vibra_c', JSON.stringify(nl)); setNewC('') }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?next():prev() }}>
      <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={currentSrc} onClick={handleSound}/>

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><b style={{color:'white', fontSize:18}}>VIBRA</b><span style={{color:'white', fontSize:12}}>For You • {safeIdx+1}/{all.length} {hasInteracted?'🔊':'🔇'}</span><span style={{color:'white'}}>🔍</span></div>

      {/* HIZI NDIZO BUTTONS ZA KANDO KAMA TIKTOK - SASA ZITAONEKANA! */}
      <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:18, alignItems:'center', zIndex:10}}>
        {/* Profile */}
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}>{username.charAt(1).toUpperCase()}</div>
        
        {/* LIKE */}
        <div onClick={handleLike} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>{liked?'❤️':'🤍'}</div><div style={{color:'white', fontSize:12, marginTop:4, fontWeight:'bold'}}>{likes}</div></div>

        {/* COMMENT */}
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>💬</div><div style={{color:'white', fontSize:12, marginTop:4}}>{comments.length}</div></div>

        {/* SHARE */}
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div><div style={{color:'white', fontSize:10, marginTop:4}}>Share</div></div>

        {/* SAVE */}
        <div onClick={()=> setSaved(!saved)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background: saved?'#ffcc00':'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>{saved?'🔖':'📑'}</div><div style={{color:'white', fontSize:10, marginTop:4}}>{saved?'Saved':'Save'}</div></div>

        {/* LYRICS */}
        <div onClick={()=> setShowLyrics(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>🎵</div><div style={{color:'white', fontSize:10, marginTop:4}}>Lyrics</div></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:80, color:'white', zIndex:10}}><div style={{fontWeight:'bold', fontSize:14}}>{username} • Video {safeIdx+1}</div><div style={{fontSize:12, marginTop:4}}>Swipe up/down • Like ❤️ Comment 💬 Share ↗️ Save 📑 Lyrics 🎵</div><div style={{fontSize:11, marginTop:6, opacity:0.8}}>🎵 Original sound - {username}</div></div>

      <div style={{position:'absolute', bottom:60, left:0, right:0, padding:'0 10px', zIndex:20, display:'flex', alignItems:'center', gap:8}}><span onClick={prev} style={{color:'white', fontSize:18, cursor:'pointer'}}>⏮️</span><input type="range" min={0} max={100} value={progress} onChange={e=>{ const p=Number(e.target.value); setProgress(p); if(videoRef.current?.duration) videoRef.current.currentTime=(p/100)*videoRef.current.duration }} style={{flex:1, accentColor:'white', height:4}}/><span onClick={next} style={{color:'white', fontSize:18, cursor:'pointer'}}>⏭️</span></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color:'white', textAlign:'center'}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:9}}>Home</div></div><div onClick={()=> setTab('me')} style={{color:'#888', textAlign:'center'}}><div style={{fontSize:20}}>👤</div><div style={{fontSize:9}}>Biashara ({myVideos.length}/{ads.length})</div></div><div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'bold'}}>+</div></div></div>

      {showComments && <div style={{position:'absolute', bottom:58, left:0, right:0, height:'55%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>{comments.length} Comments</b><span onClick={()=> setShowComments(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:12}}>{comments.map((c,i)=><div key={i} style={{marginTop:8, background:'#1e1e1e', padding:'8px 12px', borderRadius:10, fontSize:13}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:10}}><input value={newC} onChange={e=> setNewC(e.target.value)} onKeyDown={e=> e.key==='Enter' && addComment()} placeholder={`Comment as ${username}...`} style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px 14px', borderRadius:20, color:'white'}}/><button onClick={addComment} style={{background:'#ff3040', color:'white', border:'none', padding:'0 20px', borderRadius:20, fontWeight:'bold'}}>Send</button></div></div>}

      {showShare && <div style={{position:'absolute', bottom:58, left:0, right:0, background:'#121212', borderRadius:'16px 16px 0 0', padding:16, zIndex:45, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share Video {safeIdx+1}</b><span onClick={()=> setShowShare(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div><button onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(`Tazama VIBRA ${location.href}`)}`,'_blank')} style={{marginTop:14, width:'100%', background:'#25D366', color:'white', border:'none', padding:'12px', borderRadius:10, fontWeight:'bold'}}>💬 WhatsApp</button><button onClick={()=> {navigator.clipboard.writeText(location.href); alert('Link copied!')}} style={{marginTop:8, width:'100%', background:'#333', color:'white', border:'none', padding:'12px', borderRadius:10}}>🔗 Copy Link</button></div>}

      {showLyrics && <div style={{position:'absolute', bottom:58, left:0, right:0, background:'#121212', borderRadius:'16px 16px 0 0', padding:16, zIndex:45, color:'white', maxHeight:'60%', overflowY:'auto'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>🎵 Lyrics - Video {safeIdx+1}</b><span onClick={()=> setShowLyrics(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div><div style={{marginTop:12, fontSize:14, lineHeight:1.8, color:'#ddd', whiteSpace:'pre-wrap'}}>{`[Verse 1]
Niko hapa Bamburi, moyo unadunda
VIBRA inawaka, kila mtu anaangalia
@MrVibra kwenye mic, tunapandisha
Like, comment, share - ndio maana tunang'aa

[Chorus]
Save hii video, usiisahau
Lyrics ziko hapa, imba na mimi
VIBRA yetu, TikTok yetu
Mombasa nzima inaisikia!`}</div></div>}

      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:100, padding:20, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>📤 Upload Video</h3><span onClick={()=> setShowUpload(false)} style={{fontSize:26, cursor:'pointer'}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #ff3040', borderRadius:12, padding:30, textAlign:'center', background:'#111'}}><input type="file" accept="video/*" onChange={handleFile} style={{width:'100%', background:'#222', padding:12, borderRadius:8}}/><div style={{fontSize:12, color:'#aaa', marginTop:8}}>Video itaonekana na buttons zote - Like, Comment, Share, Save, Lyrics!</div></div></div>}

      {!hasInteracted && <div onClick={handleSound} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.75)', color:'white', padding:'14px 24px', borderRadius:24, zIndex:15, cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>🔊</div><div style={{fontSize:13, marginTop:4, fontWeight:'bold'}}>Tap for sound - Sauti itaendelea video zote!</div></div>}
    </div>
  )
}
