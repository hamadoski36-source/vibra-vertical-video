import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })

function VibraFinal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [progress,setProgress]=useState(0)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [likes,setLikes]=useState(243)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [liveViewers,setLiveViewers]=useState(130)
  const [liveEarnings,setLiveEarnings]=useState(14.25)
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [uploadMode,setUploadMode]=useState('video')
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [adBiz,setAdBiz]=useState('')
  const [adLink,setAdLink]=useState('')
  const [username]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')
  const [dp,setDp]=useState(()=> localStorage.getItem('vibra_dp')||'')
  const [newC,setNewC]=useState('')
  const [showCamHelp,setShowCamHelp]=useState(false)
  const [comments,setComments]=useState<string[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_c')||'["@Monalisa: 🔥"]') }catch{ return ["@Monalisa: 🔥"] } })
  const [myVideos,setMyVideos]=useState<any[]>(()=> {
    try{
      const keys=['vibra_V3_videos','vibra_real_videos','vibra_V3_videos_FINAL','vibra_V3_videos_v2']
      let all:any[]=[]; keys.forEach(k=>{ try{ const d=JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(d)) all=all.concat(d.filter((x:any)=> x?.url && !x?.business)) }catch{} })
      const uniq=new Map(); all.forEach((item:any)=>{ const o=typeof item==='string'? {url:item, caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp', username:'@MrVibra'}: item; if(o.url) uniq.set(o.url,o) })
      let f=Array.from(uniq.values()); if(f.length===0) f=[{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username:'@MrVibra'}]
      return f
    }catch{ return [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username:'@MrVibra'}] }
  })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]') }catch{ return [] } })

  const saveDp=async(e:any)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ const u=r.result as string; setDp(u); localStorage.setItem('vibra_dp',u) }; r.readAsDataURL(file) }

  const feed=(()=>{
    const base=myVideos; let list:any[]=[]; let adI=0
    base.forEach((v,i)=>{
      list.push(v)
      if((i+1)%3===0){
        if(myAds[adI]){ list.push({...myAds[adI], isAd:true, isLocalAd:true}); adI++ }
        else list.push({isAd:true, isGoogleAd:true, business: i%2===0?'Jumia Kenya - Offer 50%':'Betika - Shinda Leo!', link: i%2===0?'https://www.jumia.co.ke':'https://www.betika.co.ke'})
      }
    })
    return list
  })()
  const current=feed[idx % feed.length]

  useEffect(()=>{
    const h=()=>{ if(document.hidden) videoRef.current?.pause(); else if(hasInteracted && !isLiveCam && !current?.isGoogleAd) videoRef.current?.play().catch(()=>{}) }
    document.addEventListener('visibilitychange',h); return ()=> document.removeEventListener('visibilitychange',h)
  },[hasInteracted,isLiveCam,current])

  useEffect(()=>{ if(!isLiveCam && !current?.isGoogleAd){ const v=videoRef.current; if(!v) return; const onT=()=> setProgress((v.currentTime/(v.duration||1))*100); const onE=()=> setIdx(i=> (i+1)%feed.length); v.addEventListener('timeupdate',onT); v.addEventListener('ended',onE); v.muted=!hasInteracted; v.load(); v.play().catch(()=>{}); return ()=>{ v.removeEventListener('timeupdate',onT); v.removeEventListener('ended',onE) } } },[idx,hasInteracted,isLiveCam,current])

  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user', width:1280, height:720}, audio:true});
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; await liveCamRef.current.play() }
      setIsLiveCam(true)
      const t1=setInterval(()=> setLiveViewers(v=> v+Math.floor(Math.random()*5)), 2500)
      const t2=setInterval(()=> setLiveEarnings(e=> e+(Math.random()*3+0.5)), 1500)
      ;(window as any)._lt=[t1,t2]
    }catch{ setShowCamHelp(true) }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false); (window as any)._lt?.forEach((t:any)=> clearInterval(t)); }
  const doLike=()=>{ setLiked(!liked); setLikes(l=> liked?l-1:l+1); if((navigator as any).vibrate) (navigator as any).vibrate(50) }
  const saveNew=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return; const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        const ad={url, caption, tags, business:adBiz||'Biashara', link:adLink, username}
        const nl=[ad,...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
      }else{
        const v={url, caption:caption||'Kamata', tags, username}
        const nl=[v,...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl)); localStorage.setItem('vibra_V3_videos', JSON.stringify(nl))
      }
      setShowUpload(false); setCaption(''); setTags('#VIBRA #Mombasa #viral #fyp')
    }
    r.readAsDataURL(file)
  }

  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>BIASHARA • {myVideos.length} Videos</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 14px', borderRadius:20, cursor:'pointer'}}>✕ Funga</span></div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:16, alignItems:'center', background:'#111', padding:16, borderRadius:16, border:'1px solid #222'}}>
            <div style={{width:80, height:80, borderRadius:'50%', border:'3px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:32}}>👤</span>}
            </div>
            <div><div style={{fontWeight:'900', fontSize:18}}>{username}</div><div style={{fontSize:11, color:'#888'}}>{myVideos.length} Videos • {myAds.length} Ads + Google</div><label style={{background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', marginTop:8, display:'inline-block', cursor:'pointer'}}>📸 WEKA DP<input type="file" accept="image/*" onChange={saveDp} style={{display:'none'}}/></label></div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:14}}><button onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{flex:1, background:'white', color:'black', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>＋ Video</button><button onClick={()=> {setUploadMode('ad'); setShowUpload(true)}} style={{flex:1, background:'#ffcc00', color:'black', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>📢 + AD</button></div>
          <div style={{marginTop:20}}><b>📹 Videos zako ({myVideos.length})</b><div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>{myVideos.map((v,i)=><div key={i} style={{background:'#111', borderRadius:12, overflow:'hidden', border:'1px solid #222'}}><video src={v.url} style={{width:'100%', height:140, objectFit:'cover'}} muted/><div style={{padding:8}}><div style={{fontSize:11, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:9, color:'#ffcc00'}}>{v.tags}</div></div></div>)}</div></div>
        </div>
        <div style={{position:'fixed', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div onClick={()=> setTab('home')} style={{color:'#888', cursor:'pointer'}}>🏠 Home</div><div style={{color:'white'}}>👤 Biashara</div></div>
        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD {uploadMode}</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24, cursor:'pointer'}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', marginTop:12, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white'}}/>{uploadMode==='ad' && <><input value={adBiz} onChange={e=> setAdBiz(e.target.value)} placeholder="Biashara" style={{width:'100%', marginTop:8, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white'}}/><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="Link" style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:8, color:'white'}}/></>}<label style={{marginTop:14, display:'block', background:'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', cursor:'pointer'}}>CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      
      {current?.isGoogleAd ? (
        <div style={{width:'100%',height:'100%',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',padding:22,borderRadius:18,width:'85%',textAlign:'center'}}>
            <div style={{fontSize:11,color:'#4285F4',fontWeight:'900'}}>GOOGLE AD • SPONSORED</div>
            <div style={{fontSize:20,fontWeight:'900',marginTop:10}}>{current.business}</div>
            <button onClick={()=> window.open(current.link,'_blank')} style={{marginTop:16, background:'#4285F4', color:'white', padding:'14px', borderRadius:12, fontWeight:'900', width:'100%', border:'none', fontSize:16}}>FUNGUA • OPEN</button>
          </div>
        </div>
      ) : isLiveCam ? (
        <div style={{width:'100%',height:'100%', position:'relative', background:'#000'}}>
          <video ref={liveCamRef} autoPlay playsInline muted style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)'}}/>
          <div style={{position:'absolute', top:70, left:12, background:'rgba(0,0,0,0.8)', padding:'12px 16px', borderRadius:14, border:'1px solid #222'}}>
            <div style={{fontSize:16, fontWeight:'900', color:'#ffcc00'}}>💰 KSH {liveEarnings.toFixed(2)}</div>
            <div style={{fontSize:12, color:'#0f0', marginTop:2}}>● LIVE • {liveViewers} viewers</div>
            <div style={{fontSize:10, color:'#fff', marginTop:4}}>Pesa inahesabu live!</div>
          </div>
        </div>
      ) : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false } }}/>}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:30, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', gap:8}}>
        <div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'8px 14px', borderRadius:20, fontWeight:'900', fontSize:13, cursor:'pointer', border:'1px solid rgba(255,255,255,0.3)'}}>{isLiveCam?`🔴 LIVE ${liveViewers} • KSH ${liveEarnings.toFixed(0)} - Maliza`:'⚪ LIVE'}</div>
      </div>

      {/* BUTTONS SIO PICHA TENA - ZIKO JUU NA ZINA-CLICK! */}
      <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:9999, pointerEvents:'auto'}}>
        <div onClick={()=> setTab('me')} style={{width:54, height:54, borderRadius:'50%', border:'3px solid white', overflow:'hidden', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>
          {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{color:'white',fontWeight:'900', fontSize:22}}>V</span>}
        </div>
        <div onClick={doLike} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:54, height:54, borderRadius:'50%', background: liked?'#ff3040':'#333', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>❤️</div>
          <div style={{color: liked?'#ff3040':'white', fontSize:13, fontWeight:'900', marginTop:4}}>{likes}</div>
        </div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:54, height:54, borderRadius:'50%', background:'#333', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>💬</div>
          <div style={{color:'white', fontSize:12, fontWeight:'bold', marginTop:4}}>{comments.length}</div>
        </div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:54, height:54, borderRadius:'50%', background:'#333', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>↗️</div>
          <div style={{color:'white', fontSize:11, marginTop:4}}>Share</div>
        </div>
        <div onClick={()=> alert(`🎵 Lyrics:\n${current?.caption}\n${current?.tags||''}`)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:54, height:54, borderRadius:'50%', background:'#333', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>🎵</div>
          <div style={{color:'white', fontSize:11, marginTop:4}}>Lyrics</div>
        </div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:80, color:'white', zIndex:20, pointerEvents:'none'}}><div style={{fontWeight:'bold', fontSize:12}}>{current?.isGoogleAd? current.business: `${username} • ${idx+1}/${feed.length}`}</div><div style={{fontSize:14, marginTop:4}}>{current?.isGoogleAd? 'Bonyeza FUNGUA!': current?.caption}</div><div style={{fontSize:13, color:'#ffcc00', fontWeight:'bold'}}>{current?.tags}</div></div>
      <div style={{position:'absolute', bottom:64, left:0, right:0, padding:'0 10px', zIndex:20}}><input type="range" min={0} max={100} value={progress} onChange={e=>{ if(videoRef.current?.duration) videoRef.current.currentTime=(Number(e.target.value)/100)*videoRef.current.duration }} style={{width:'100%', accentColor:'white', height:4}}/></div>
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:40}}><div style={{color:'white'}}>🏠 Home</div><div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{width:48, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900', cursor:'pointer'}}>+</div><div onClick={()=> setTab('me')} style={{color:'#888', cursor:'pointer'}}>👤 Biashara ({myVideos.length})</div></div>

      {showComments && <div style={{position:'absolute', bottom:58, left:0, right:0, height:'45%', background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:100, padding:12, display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Comments ({comments.length})</b><span onClick={()=> setShowComments(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=> <div key={i} style={{padding:'8px 0', borderBottom:'1px solid #222', fontSize:13}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:8}}><input value={newC} onChange={e=> setNewC(e.target.value)} placeholder="Add comment..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:20, color:'white'}}/><button onClick={()=> { if(newC.trim()){ const nl=[`${username}: ${newC}`, ...comments]; setComments(nl); localStorage.setItem('vibra_c', JSON.stringify(nl)); setNewC('') } }} style={{background:'white', color:'black', border:'none', padding:'10px 16px', borderRadius:20, fontWeight:'900'}}>Post</button></div></div>}
      {showShare && <div style={{position:'absolute', bottom:58, left:0, right:0, background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:100, padding:16}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share</b><span onClick={()=> setShowShare(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div><div style={{display:'flex', gap:12, marginTop:14, justifyContent:'space-around'}}><div onClick={()=> {navigator.clipboard?.writeText(window.location.href); alert('Link copied!')}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:50, height:50, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>🔗</div><div style={{fontSize:10, marginTop:4}}>Copy Link</div></div><div onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,'_blank')} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:50, height:50, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>W</div><div style={{fontSize:10, marginTop:4}}>WhatsApp</div></div></div></div>}
      {showCamHelp && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}><div style={{background:'white', color:'black', padding:20, borderRadius:16, maxWidth:320, width:'100%'}}><b style={{color:'red'}}>❌ CAMERA BLOCKED!</b><div style={{fontSize:13, marginTop:10, lineHeight:1.6}}>1. Bonyeza 🔒 juu karibu na link<br/>2. Site settings<br/>3. Camera → Allow<br/>4. Mic → Allow<br/>5. Refresh page<br/>6. Bonyeza LIVE tena</div><button onClick={()=> setShowCamHelp(false)} style={{marginTop:14, background:'black', color:'white', padding:'12px', width:'100%', borderRadius:10, fontWeight:'900', border:'none'}}>NIMELEWA - SAWA</button></div></div>}
      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play()}}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60}}><div style={{background:'white', color:'black', padding:'12px 20px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha sauti</div></div>}
    </div>
  )
}
