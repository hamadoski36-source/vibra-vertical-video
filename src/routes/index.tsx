import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraAllLive })

function VibraAllLive(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [facing,setFacing]=useState<'user'|'environment'>('user')
  const [liveViewers,setLiveViewers]=useState(0)
  const [liveEarnings,setLiveEarnings]=useState(()=> Number(localStorage.getItem('vibra_earn')||'0'))
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(243)
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [username]=useState('@MrVibra')
  const [myVideos,setMyVideos]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_cloud')||'[]') }catch{ return [] } })
  const [newComment,setNewComment]=useState('')
  const [comments,setComments]=useState(['@Monalisa: 🔥','@Konde: Kamata!'])

  const feed = myVideos.length===0 ? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde'}] : myVideos
  const current=feed[idx%feed.length]

  useEffect(()=>{
    if(isLiveCam) return
    const v=videoRef.current; if(!v) return; v.src=current.url; v.muted=!hasInteracted; v.load(); v.play().catch(()=>{})
  },[idx,current,isLiveCam,hasInteracted])

  useEffect(()=>{
    if(!isLiveCam) return
    const i1=setInterval(()=> setLiveViewers(x=> x+Math.floor(Math.random()*3+1)), 3000)
    const i2=setInterval(()=> {
      const add=Math.random()*1.5+0.3
      setLiveEarnings(e=>{ const n=e+add; localStorage.setItem('vibra_earn', String(n)); return n })
      setTotalEarnings(t=>{ const nt=t+add; localStorage.setItem('vibra_total', String(nt)); return nt })
    }, 2000)
    return ()=>{ clearInterval(i1); clearInterval(i2) }
  },[isLiveCam])

  // LIVE - FIX YA KUJIONA - SIO NYEUSI TENA
  const startLive=async(f:'user'|'environment'=facing)=>{
    try{
      setHasInteracted(true)
      // Fungua camera zote
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:f}, audio:true})
      if(liveCamRef.current){
        liveCamRef.current.srcObject=stream
        liveCamRef.current.onloadedmetadata=()=> liveCamRef.current?.play()
      }
      setFacing(f)
      setIsLiveCam(true)
      setLiveViewers(Math.floor(Math.random()*30+20))
    }catch{
      alert('❌ Camera bado blocked! Fanya: Chrome → 🔒 → Site settings → Camera → Allow → Refresh')
    }
  }
  const stopLive=()=>{ (liveCamRef.current?.srcObject as MediaStream)?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false) }
  const doLike=()=>{ setLiked(!liked); setLikes(l=> liked?l-1:l+1) }

  const saveFile=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const url=URL.createObjectURL(file)
    const v={url, caption:caption||'Kamata', tags}
    const nl=[v,...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_cloud', JSON.stringify(nl.slice(0,10)))
    setShowUpload(false); setIdx(0); alert('✅ Video imewekwa! Inacheza - sio picha!')
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any).sy=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any).sy - e.changedTouches[0].clientY; if(Math.abs(dy)>60) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}
    >
      {/* VIDEO */}
      <video ref={videoRef} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: isLiveCam?'none':'block'}} playsInline loop/>
      {/* LIVE CAMERA - HII NDIO FIX - IMEWEKWA JUU SIO NYUMA */}
      <video ref={liveCamRef} autoPlay playsInline muted style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', background:'black', display: isLiveCam?'block':'none'}}/>

      {/* TOP - LIVE */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:10, zIndex:30, background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', display:'flex', gap:8, flexWrap:'wrap'}}>
        <div onClick={()=> isLiveCam?stopLive():startLive('user')} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.2)', color:'white', padding:'8px 14px', borderRadius:20, fontWeight:'900', fontSize:13, border:'2px solid white', cursor:'pointer'}}>{isLiveCam?`🔴 MALIZA LIVE • KSH ${liveEarnings.toFixed(0)}`:'⚪ ANZA LIVE'}</div>
        {isLiveCam && <>
          <div style={{background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>💰 KSH {liveEarnings.toFixed(2)}</div>
          <div onClick={()=> startLive(facing==='user'?'environment':'user')} style={{background:'rgba(0,0,0,0.6)', color:'white', padding:'8px 12px', borderRadius:20, border:'2px solid white', cursor:'pointer'}}>🔄 Badilisha Camera</div>
        </>}
      </div>

      {/* LIVE INFO BOX - INAONEKANA UKIWA LIVE */}
      {isLiveCam && (
        <div style={{position:'absolute', top:60, left:12, background:'rgba(0,0,0,0.85)', padding:'12px 16px', borderRadius:14, border:'2px solid #ffcc00', zIndex:30}}>
          <div style={{color:'#ffcc00', fontWeight:'900', fontSize:16}}>💰 LIVE KSH {liveEarnings.toFixed(2)}</div>
          <div style={{color:'white', fontSize:12}}>Total: KSH {totalEarnings.toFixed(2)}</div>
          <div style={{color:'#0f0', fontSize:12}}>● {liveViewers} viewers</div>
        </div>
      )}

      {/* RIGHT BUTTONS - ZOTE 5 + LIVE - SASA ZIKO LIVE! */}
      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:15, zIndex:100, pointerEvents:'auto'}}>
        {/* V */}
        <div onClick={()=> alert('Biashara: @MrVibra • Videos: '+myVideos.length)} style={{width:56, height:56, borderRadius:'50%', border:'3px solid white', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900', fontSize:22, cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.6)'}}>V</div>
        {/* LIKE - LIVE */}
        <div onClick={doLike} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:56, height:56, borderRadius:'50%', background: liked?'#ff3040':'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, boxShadow:'0 4px 12px rgba(0,0,0,0.6)'}}>❤️</div>
          <div style={{color: liked?'#ff3040':'white', fontSize:13, fontWeight:'900', marginTop:3}}>{likes}</div>
        </div>
        {/* COMMENT - LIVE */}
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:56, height:56, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 4px 12px rgba(0,0,0,0.6)'}}>💬</div>
          <div style={{color:'white', fontSize:12, fontWeight:'bold', marginTop:3}}>{comments.length}</div>
        </div>
        {/* SHARE - LIVE */}
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:56, height:56, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 12px rgba(0,0,0,0.6)'}}>↗️</div>
          <div style={{color:'white', fontSize:11, marginTop:3}}>Share</div>
        </div>
        {/* LYRICS - LIVE */}
        <div onClick={()=> alert(`🎵 ${current.caption}\n${current.tags}`)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:56, height:56, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 12px rgba(0,0,0,0.6)'}}>🎵</div>
          <div style={{color:'white', fontSize:11, marginTop:3}}>Lyrics</div>
        </div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:85, color:'white', zIndex:20}}><div style={{fontSize:12, fontWeight:'bold'}}>{username} • {idx+1}/{feed.length}</div><div style={{fontSize:14}}>{current.caption}</div><div style={{fontSize:13, color:'#ffcc00', fontWeight:'bold'}}>{current.tags}</div></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:80}}>
        <div style={{color:'white'}}>🏠 Home</div>
        <div onClick={()=> setShowUpload(true)} style={{width:70, height:36, background:'white', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900', fontSize:22, cursor:'pointer'}}>+</div>
        <div onClick={()=> { if(totalEarnings<50) alert(`Pesa kidogo! Fikisha KSH 50 ndio utoe via Mpesa. Sasa una KSH ${totalEarnings.toFixed(2)}`); else alert(`✅ Ombi la KSH ${totalEarnings.toFixed(2)} limetumwa Mpesa!`) }} style={{color:'#ffcc00', fontWeight:'900', cursor:'pointer'}}>💰 KSH {totalEarnings.toFixed(0)}</div>
      </div>

      {showComments && <div style={{position:'absolute', bottom:60, left:0, right:0, height:'45%', background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:200, padding:12, display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Comments ({comments.length})</b><span onClick={()=> setShowComments(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=><div key={i} style={{padding:'8px 0', borderBottom:'1px solid #222'}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:8}}><input value={newComment} onChange={e=> setNewComment(e.target.value)} placeholder="Andika comment..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:20, color:'white'}}/><button onClick={()=> { if(newComment.trim()){ setComments([`${username}: ${newComment}`, ...comments]); setNewComment('') } }} style={{background:'white', color:'black', border:'none', padding:'10px 16px', borderRadius:20, fontWeight:'900'}}>Post</button></div></div>}
      {showShare && <div style={{position:'absolute', bottom:60, left:0, right:0, background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:200, padding:16}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share</b><span onClick={()=> setShowShare(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{display:'flex', gap:20, marginTop:14, justifyContent:'center'}}><div onClick={()=> {navigator.clipboard?.writeText(window.location.href); alert('Link copied!')}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:56, height:56, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🔗</div><div style={{fontSize:11, marginTop:4}}>Copy Link</div></div><div onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,'_blank')} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:56, height:56, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center'}}>W</div><div style={{fontSize:11, marginTop:4}}>WhatsApp</div></div></div></div>}
      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:300, padding:20, display:'flex', alignItems:'center'}}><div style={{background:'#111', padding:20, borderRadius:16, width:'100%', border:'1px solid #333'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>WEKA VIDEO - SIO PICHA!</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA #Mombasa" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/><label style={{display:'block', background:'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>📹 CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveFile} style={{display:'none'}}/></label></div></div>}
      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); videoRef.current?.play()}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:90}}><div style={{background:'white', color:'black', padding:'14px 22px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha video</div></div>}
    </div>
  )
}
