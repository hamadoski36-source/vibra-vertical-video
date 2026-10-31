import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })

function VibraFinal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [hasInteracted,setHasInteracted]=useState(false)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [facing,setFacing]=useState<'user'|'environment'>('user')
  const [liveViewers,setLiveViewers]=useState(0)
  const [liveEarnings,setLiveEarnings]=useState(()=> Number(localStorage.getItem('vibra_earn')||'0'))
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [dp,setDp]=useState(()=> localStorage.getItem('vibra_dp')||'')
  const [myVideos,setMyVideos]=useState<any[]>(()=> { try{ const r=JSON.parse(localStorage.getItem('vibra_vids_v2')||'[]'); return r.filter((v:any)=> v.thumb) }catch{ return [] } })
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [showUpload,setShowUpload]=useState(false)
  const [uploading,setUploading]=useState(false)
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [comments,setComments]=useState(['@Monalisa: 🔥','@Konde: Kamata!'])
  const [newC,setNewC]=useState('')
  const sy=useRef(0)

  const defaultVid={url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata - Default', tags:'#VIBRA #Mombasa #viral', thumb:'', isDefault:true}
  const feed=myVideos.length>0?myVideos:[defaultVid]
  const current=feed[idx%feed.length]

  // SAUTI INAKATA UKITOKA APP
  useEffect(()=>{
    const pause=()=> videoRef.current?.pause()
    const onHidden=()=> { if(document.hidden) pause(); else if(hasInteracted && !isLiveCam && tab==='home') videoRef.current?.play().catch(()=>{}) }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('blur', pause)
    window.addEventListener('pagehide', ()=>{ pause(); (liveCamRef.current?.srcObject as MediaStream)?.getTracks().forEach(t=>t.stop()) })
    return ()=>{ document.removeEventListener('visibilitychange', onHidden); window.removeEventListener('blur', pause) }
  },[hasInteracted,isLiveCam,tab])

  useEffect(()=>{
    if(isLiveCam || tab!=='home' || !current) return
    const v=videoRef.current; if(!v) return
    if(current.url){ v.src=current.url; v.muted=!hasInteracted; v.playsInline=true; v.loop=true; v.load(); v.play().catch(()=>{}) }
  },[idx,current,isLiveCam,hasInteracted,tab])

  useEffect(()=>{
    if(!isLiveCam) return
    const a=setInterval(()=> setLiveViewers(x=>x+Math.floor(Math.random()*3+1)),3000)
    const b=setInterval(()=>{ const add=Math.random()*1.5+0.3; setLiveEarnings(e=>{ const n=e+add; localStorage.setItem('vibra_earn',String(n)); return n }); setTotalEarnings(t=>{ const nt=t+add; localStorage.setItem('vibra_total',String(nt)); return nt }) },2000)
    return ()=>{ clearInterval(a); clearInterval(b) }
  },[isLiveCam])

  const startLive=async(f:'user'|'environment'=facing)=>{
    try{
      setHasInteracted(true)
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:f}, audio:true})
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; liveCamRef.current.onloadedmetadata=()=>liveCamRef.current?.play() }
      setFacing(f); setIsLiveCam(true); setLiveViewers(20+Math.floor(Math.random()*20))
    }catch{ alert('Camera blocked! Chrome → 🔒 → Camera → Allow → Refresh') }
  }
  const stopLive=()=>{ (liveCamRef.current?.srcObject as MediaStream)?.getTracks().forEach(t=>t.stop()); setIsLiveCam(false) }
  const changeDp=(e:any)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ const u=r.result as string; setDp(u); localStorage.setItem('vibra_dp',u) }; r.readAsDataURL(file) }

  const handleUpload=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    if(file.size>15*1024*1024) return alert('Video kubwa! Chagua <15MB. Compress: freeconvert.com/video-compressor')
    setUploading(true)
    try{
      const url=URL.createObjectURL(file)
      const ve=document.createElement('video'); ve.src=url; ve.muted=true; ve.playsInline=true
      await new Promise(res=> ve.onloadeddata=res as any); ve.currentTime=1; await new Promise(res=> ve.onseeked=res as any)
      const canvas=document.createElement('canvas'); canvas.width=320; canvas.height=400
      canvas.getContext('2d')?.drawImage(ve,0,0,320,400)
      const thumb=canvas.toDataURL('image/jpeg',0.6)
      const v={url, thumb, caption:caption||'Kamata', tags, id:Date.now()}
      const nl=[v,...myVideos].slice(0,20)
      setMyVideos(nl)
      // Save only thumb + meta - not blob - so no black!
      localStorage.setItem('vibra_vids_v2', JSON.stringify(nl.map((x:any)=>({thumb:x.thumb, caption:x.caption, tags:x.tags, id:x.id, url:x.url})) ))
      setShowUpload(false); setIdx(0); alert('✅ Video imewekwa! Sio black tena!')
    }catch(err){ alert('Error '+err) } finally{ setUploading(false) }
  }

  const clearAll=()=>{
    if(!confirm(`Futa video zote ${myVideos.length} black na KSH ${totalEarnings.toFixed(0)}?`)) return
    localStorage.removeItem('vibra_vids_v2'); localStorage.removeItem('vibra_cloud'); localStorage.removeItem('vibra_vids_fixed'); localStorage.removeItem('vibra_cloud_videos')
    localStorage.setItem('vibra_total','0'); localStorage.setItem('vibra_earn','0')
    setMyVideos([]); setTotalEarnings(0); setLiveEarnings(0); setIdx(0); alert('✅ Imefutwa! Sasa weka video moja ndogo <15MB'); location.reload()
  }

  if(tab==='me'){
    return(
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>👤 BIASHARA YANGU</b><span onClick={()=> setTab('home')} style={{background:'white', color:'black', padding:'8px 16px', borderRadius:20, fontWeight:'900', cursor:'pointer'}}>✕ Funga</span></div>
        <div style={{padding:16}}>
          <div style={{background:'#111', padding:16, borderRadius:16, border:'2px solid #ffcc00', display:'flex', gap:16, alignItems:'center'}}>
            <div style={{position:'relative'}}><div style={{width:90, height:90, borderRadius:'50%', border:'4px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{dp?<img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:40}}>👤</span>}</div><label style={{position:'absolute', bottom:-5, right:-5, background:'#ffcc00', color:'black', width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>📸<input type="file" accept="image/*" onChange={changeDp} style={{display:'none'}}/></label></div>
            <div><div style={{fontWeight:'900', fontSize:20}}>@MrVibra</div><div style={{fontSize:12, color:'#ffcc00'}}>{myVideos.length} Videos • KSH {totalEarnings.toFixed(2)}</div><label style={{display:'inline-block', marginTop:8, background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', cursor:'pointer'}}>📸 BADILISHA DP<input type="file" accept="image/*" onChange={changeDp} style={{display:'none'}}/></label></div>
          </div>

          <div style={{background:'#111', padding:14, borderRadius:12, border:'1px solid #222', marginTop:14, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div><div style={{fontSize:11, color:'#888'}}>TOTAL - Demo, real na Mpesa API</div><div style={{fontSize:26, fontWeight:'900', color:'#ffcc00'}}>KSH {totalEarnings.toFixed(2)}</div><div style={{fontSize:10, color:'#0f0'}}>0740805970 - itatumwa hapa ikija real</div></div>
            <button onClick={()=> alert(`Demo bado! Una KSH ${totalEarnings.toFixed(2)}. Ili iwe real tuma Daraja Consumer Key/Secret kutoka developer.safaricom.co.ke`)} style={{background:'#25D366', color:'white', border:'none', padding:'12px 18px', borderRadius:12, fontWeight:'900'}}>TOA</button>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:14}}>
            <div style={{display:'flex', gap:8}}><button onClick={()=> setShowUpload(true)} style={{flex:1, background:'white', color:'black', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>＋ Video</button><button onClick={()=> setTab('home')} style={{flex:1, background:'#222', color:'white', border:'1px solid #333', padding:'14px', borderRadius:12, fontWeight:'900'}}>🏠 Home</button></div>
            <button onClick={clearAll} style={{background:'#ff3040', color:'white', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>🗑️ FUTA VIDEO ZOTE BLACK ({myVideos.length}) - KSH {totalEarnings.toFixed(0)} - BON'YEZA HAPA!</button>
            <div style={{fontSize:10, color:'#888', textAlign:'center'}}>Hii ndio itafuta black screen zote - bonyeza kisha refresh</div>
          </div>

          <div style={{marginTop:20}}><b>📹 Videos ({myVideos.length})</b><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>{myVideos.map((v:any,i:number)=><div key={v.id||i} onClick={()=>{setIdx(i); setTab('home')}} style={{background:'#111', borderRadius:12, overflow:'hidden', border:'1px solid #222', cursor:'pointer'}}>{v.thumb?<img src={v.thumb} style={{width:'100%', height:160, objectFit:'cover'}}/>:<div style={{width:'100%', height:160, background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>🎬</div>}<div style={{padding:8}}><div style={{fontSize:11, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:9, color:'#ffcc00'}}>{v.tags}</div></div></div>)}</div>{myVideos.length===0&&<div style={{textAlign:'center', color:'#666', marginTop:20}}>Hakuna video. Bonyeza + Video - chagua chini ya 15MB</div>}</div>
        </div>
        {showUpload&&<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:9999, padding:20, display:'flex', alignItems:'center'}}><div style={{background:'#111', padding:20, borderRadius:16, width:'100%'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>WEKA VIDEO &lt;15MB</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/><label style={{display:'block', background: uploading?'#555':'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>{uploading?'⏳...':'📹 CHAGUA VIDEO (<15MB)'}<input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} style={{display:'none'}}/></label></div></div>}
      </div>
    )
  }

  return(
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}}
      onTouchStart={e=> sy.current=e.touches[0].clientY}
      onTouchEnd={e=>{
        const dy=sy.current - e.changedTouches[0].clientY
        if(Math.abs(dy)>50){ if(dy>0) setIdx(i=> (i+1)%feed.length); else setIdx(i=> (i-1+feed.length)%feed.length) }
      }}
    >
      <video ref={videoRef} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: isLiveCam?'none':'block', background:'black'}} playsInline loop onClick={()=>{ if(!hasInteracted){ setHasInteracted(true); videoRef.current?.play() } }}/>
      <video ref={liveCamRef} autoPlay playsInline muted style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: isLiveCam?'block':'none', background:'black'}}/>

      <div style={{position:'absolute', top:0, left:0, right:0, padding:10, zIndex:30, background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', display:'flex', gap:8}}>
        <div onClick={()=> isLiveCam?stopLive():startLive('user')} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'8px 14px', borderRadius:20, fontWeight:'900', fontSize:13, border:'2px solid white', cursor:'pointer'}}>{isLiveCam?`🔴 MALIZA LIVE • KSH ${liveEarnings.toFixed(0)}`:'⚪ ANZA LIVE'}</div>
        {isLiveCam&&<div onClick={()=> startLive(facing==='user'?'environment':'user')} style={{background:'#333', color:'white', padding:'8px 12px', borderRadius:20, border:'2px solid white', cursor:'pointer'}}>🔄</div>}
      </div>

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:14, zIndex:100}}>
        <div onClick={()=> setTab('me')} style={{width:58, height:58, borderRadius:'50%', border:'3px solid white', overflow:'hidden', background: dp?'black':'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>{dp?<img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{color:'white', fontWeight:'900'}}>V</span>}</div>
        <div style={{width:58, height:58, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>❤️</div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:85, color:'white', zIndex:20}}><div style={{fontSize:12, fontWeight:'bold'}}>@MrVibra • {idx+1}/{feed.length} • Swipe juu/chini</div><div style={{fontSize:14}}>{current.caption}</div><div style={{fontSize:13, color:'#ffcc00', fontWeight:'bold'}}>{current.tags}</div></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:80}}>
        <div onClick={()=> setTab('home')} style={{color:'white', cursor:'pointer'}}>🏠 Home</div>
        <div onClick={()=> setShowUpload(true)} style={{width:70, height:36, background:'white', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900', fontSize:22, cursor:'pointer'}}>+</div>
        <div onClick={()=> setTab('me')} style={{color:'#ffcc00', fontWeight:'900', cursor:'pointer'}}>💰 KSH {totalEarnings.toFixed(0)}</div>
      </div>

      {showUpload&&<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:300, padding:20, display:'flex', alignItems:'center'}}><div style={{background:'#111', padding:20, borderRadius:16, width:'100%'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>WEKA VIDEO</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/><label style={{display:'block', background: uploading?'#555':'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>{uploading?'⏳...':'📹 CHAGUA VIDEO (<15MB)'}<input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} style={{display:'none'}}/></label></div></div>}
      {!hasInteracted&&<div onClick={()=>{setHasInteracted(true); videoRef.current?.play()}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:90}}><div style={{background:'white', color:'black', padding:'14px 22px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha</div></div>}
    </div>
  )
}
