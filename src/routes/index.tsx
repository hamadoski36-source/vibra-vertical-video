import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFixedV2 })

function GoogleAdBox({business, onOpen}:{business?:string, onOpen?:()=>void}){
  return (
    <div style={{width:'100%',height:'100%',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative'}}>
      <div style={{background:'white',color:'black',padding:22,borderRadius:18,width:'85%',textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:11,color:'#4285F4',fontWeight:'900',letterSpacing:1}}>GOOGLE ADSENSE • SPONSORED</div>
        <div style={{fontSize:20,fontWeight:'900',marginTop:10}}>{business||'Jumia Kenya - Offer 50%'}</div>
        <div style={{fontSize:13,color:'#555',marginTop:6}}>Pata punguzo 50% - Bonyeza kufungua!</div>
        <button onClick={onOpen} style={{marginTop:16, background:'#4285F4', color:'white', padding:'14px', borderRadius:12, fontWeight:'900', width:'100%', border:'none', fontSize:16}}>FUNGUA • OPEN</button>
        <div style={{marginTop:8, fontSize:10, color:'#999'}}>Ad itafungua Jumia / Google</div>
      </div>
    </div>
  )
}

function VibraFixedV2(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [progress,setProgress]=useState(0)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [muted,setMuted]=useState(true)
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [likes,setLikes]=useState(243)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [liveViewers,setLiveViewers]=useState(128)
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
  const [comments,setComments]=useState<string[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_c')||'["@Monalisa: 🔥"]') }catch{ return ["@Monalisa: 🔥"] } })
  const [myVideos,setMyVideos]=useState<any[]>(()=> {
    try{
      const keys=['vibra_V3_videos','vibra_real_videos','vibra_V3_videos_FINAL','vibra_V3_videos_v2']
      let all:any[]=[]; keys.forEach(k=>{ try{ const d=JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(d)) all=all.concat(d) }catch{} })
      const uniq=new Map(); all.forEach((item:any)=>{ const obj=typeof item==='string'? {url:item, caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp', username:'@MrVibra'}: item; if(obj.url) uniq.set(obj.url, obj) })
      return Array.from(uniq.values())
    }catch{ return [] }
  })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]') }catch{ return [] } })

  const saveDp=async(e:any)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ const url=r.result as string; setDp(url); localStorage.setItem('vibra_dp', url) }; r.readAsDataURL(file) }

  const feed = (()=> {
    const base = myVideos.length===0? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username}] : myVideos
    let list:any[]=[]; let adIdx=0
    base.forEach((v,i)=>{
      list.push(v)
      if((i+1)%3===0){
        if(myAds[adIdx]){ list.push({...myAds[adIdx], isAd:true, isLocalAd:true}); adIdx++ }
        else { list.push({isAd:true, isGoogleAd:true, business: i%2===0?'Jumia Kenya - Offer 50%':'Betika - Shinda Leo!', link: i%2===0?'https://www.jumia.co.ke':'https://www.betika.co.ke'}) }
      }
    })
    return list
  })()

  const current=feed[idx % feed.length]

  // SAUTI IKATE
  useEffect(()=>{
    const handleVisibility = () => { const v=videoRef.current; if(document.hidden) v?.pause(); else if(hasInteracted && !isLiveCam && tab==='home' && !current?.isGoogleAd) { if(v){ v.muted=muted; v.play().catch(()=>{}) } } }
    document.addEventListener('visibilitychange', handleVisibility)
    return ()=> document.removeEventListener('visibilitychange', handleVisibility)
  }, [hasInteracted, muted, isLiveCam, tab, current])

  useEffect(()=>{ if(!isLiveCam && tab==='home' && !current?.isGoogleAd){ const v=videoRef.current; if(!v) return; const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100); const onEnd=()=> setIdx(i=> (i+1)%feed.length); v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnd); v.muted=!hasInteracted; v.load(); v.play().catch(()=>{}); return ()=>{ v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) } } }, [idx, hasInteracted, isLiveCam, tab, feed.length, current])

  // LIVE FIX - KWA MAELEKEZO HALISI
  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true});
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; await liveCamRef.current.play() }
      setIsLiveCam(true); setShowUpload(false)
    }catch(err){
      // MAELEKEZO YA CHROME
      alert('❌ Camera Blocked! Fanya hivi:\n\n1. Bonyeza alama ya 🔒 au ⓘ kushoto kwa link juu\n2. Chagua Site settings\n3. Camera → Allow\n4. Microphone → Allow\n5. Rudi u-refresh page\n\nKisha bonyeza LIVE tena!')
    }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false) }
  const doLike=()=>{ setLiked(!liked); setLikes(l=> liked?l-1:l+1) }
  const openAd=()=>{ 
    if(current?.link) window.open(current.link,'_blank')
    else if(current?.business?.includes('Jumia')) window.open('https://www.jumia.co.ke','_blank')
    else window.open('https://www.google.com/search?q='+encodeURIComponent(current?.business||'Jumia Kenya'),'_blank')
  }

  const saveNew=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        const ad={url, caption, tags, business:adBiz, link:adLink, username}
        const nl=[ad, ...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
      }else{
        const v={url, caption: caption||'Kamata', tags, username}
        const nl=[v, ...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl))
      }
      setShowUpload(false)
    }
    r.readAsDataURL(file)
  }

  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between'}}><b>BIASHARA</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 14px', borderRadius:20}}>✕</span></div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:16, alignItems:'center', background:'#111', padding:16, borderRadius:16}}>
            <div style={{width:80, height:80, borderRadius:'50%', border:'3px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:32}}>👤</span>}
            </div>
            <div><div style={{fontWeight:'900'}}>{username}</div><label style={{background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', marginTop:10, display:'inline-block'}}>📸 WEKA DP<input type="file" accept="image/*" onChange={saveDp} style={{display:'none'}}/></label></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      
      {current?.isGoogleAd ? <GoogleAdBox business={current.business} onOpen={openAd}/> : isLiveCam ? <video ref={liveCamRef} autoPlay muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)', background:'black'}}/> : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false } }}/>}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:20, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', gap:8}}>
        <div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'6px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>{isLiveCam?`🔴 LIVE ${liveViewers} - Bonyeza kumaliza`:'⚪ LIVE - Bonyeza kuanza'}</div>
      </div>

      {current?.isGoogleAd && <div style={{position:'absolute', top:50, left:12, background:'#4285F4', color:'white', padding:'5px 12px', borderRadius:12, fontSize:12, fontWeight:'900', zIndex:10}}>📢 Google Ad • Sponsored - {current.business}</div>}
      {current?.isLocalAd && <div style={{position:'absolute', top:50, left:12, background:'#ffcc00', color:'black', padding:'5px 12px', borderRadius:12, fontSize:12, fontWeight:'900', zIndex:10}}>📢 AD • {current.business}</div>}

      {/* BUTTONS ZOTE SASA ZINAONEKANA HATA KWA GOOGLE AD! */}
      <div style={{position:'absolute', right:8, bottom:100, display:'flex', flexDirection:'column', gap:14, alignItems:'center', zIndex:30}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', border:'2px solid white', overflow:'hidden', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{color:'white',fontWeight:'900'}}>V</span>}
        </div>
        <div onClick={doLike} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>{liked?'❤️':'🤍'}</div><div style={{color: liked?'#ff3040':'white', fontSize:12, fontWeight:'900'}}>{likes}</div></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><div style={{color:'white', fontSize:12}}>{comments.length}</div></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div><div style={{color:'white', fontSize:10}}>Share</div></div>
        <div onClick={()=> alert(`Lyrics:\n${current?.caption}\n${current?.tags||''}`)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🎵</div><div style={{color:'white', fontSize:10}}>Lyrics</div></div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:80, color:'white', zIndex:10}}>
        <div style={{fontWeight:'bold', fontSize:12}}>{current?.isGoogleAd? `📢 ${current.business}`: `${username} • ${idx+1}/${feed.length}`}</div>
        <div style={{fontSize:13, marginTop:4}}>{current?.isGoogleAd? 'Bonyeza FUNGUA kuona offer!': current?.caption}</div>
        <div style={{fontSize:13, color: current?.isGoogleAd?'#4285F4':'#ffcc00', fontWeight:'bold'}}>{current?.tags||''}</div>
      </div>

      <div style={{position:'absolute', bottom:64, left:0, right:0, padding:'0 10px', zIndex:20}}><input type="range" min={0} max={100} value={progress} onChange={e=>{ if(videoRef.current?.duration) videoRef.current.currentTime=(Number(e.target.value)/100)*videoRef.current.duration }} style={{width:'100%', accentColor:'white', height:3}}/></div>
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color:'white'}}>🏠 Home</div><div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{width:42, height:26, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900'}}>+</div><div onClick={()=> setTab('me')} style={{color:'#888'}}>👤 Biashara</div></div>

      {showComments && <div style={{position:'absolute', bottom:58, left:0, right:0, height:'45%', background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:100, padding:12, display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Comments ({comments.length})</b><span onClick={()=> setShowComments(false)}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=> <div key={i} style={{padding:'6px 0', borderBottom:'1px solid #222', fontSize:13}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:8}}><input value={newC} onChange={e=> setNewC(e.target.value)} placeholder="Add comment..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:20, color:'white'}}/><button onClick={()=> { if(newC.trim()){ const nl=[`${username}: ${newC}`, ...comments]; setComments(nl); localStorage.setItem('vibra_c', JSON.stringify(nl)); setNewC('') } }} style={{background:'white', color:'black', border:'none', padding:'10px 16px', borderRadius:20, fontWeight:'900'}}>Post</button></div></div>}
      {showShare && <div style={{position:'absolute', bottom:58, left:0, right:0, background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:100, padding:16}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share Video</b><span onClick={()=> setShowShare(false)}>✕</span></div><div style={{display:'flex', gap:12, marginTop:14, justifyContent:'space-around'}}><div onClick={()=> {navigator.clipboard?.writeText(window.location.href); alert('Link copied!')}} style={{textAlign:'center'}}><div style={{width:50, height:50, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>🔗</div><div style={{fontSize:10, marginTop:4}}>Copy Link</div></div><div onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,'_blank')} style={{textAlign:'center'}}><div style={{width:50, height:50, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center'}}>W</div><div style={{fontSize:10, marginTop:4}}>WhatsApp</div></div></div></div>}
      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', marginTop:12, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white'}}/><label style={{marginTop:14, display:'block', background:'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900'}}>CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play()}}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60}}><div style={{background:'white', color:'black', padding:'12px 20px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha sauti</div></div>}
    </div>
  )
}
