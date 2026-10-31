import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFixed })

function GoogleAdBox({business}:{business?:string}){
  return (
    <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1a1a1a,#000)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',top:60,left:12,background:'#4285F4',color:'white',padding:'5px 12px',borderRadius:12,fontSize:12,fontWeight:'900'}}>📢 Google Ad • Sponsored</div>
      <div style={{background:'white',color:'black',padding:20,borderRadius:16,width:'80%',textAlign:'center',marginTop:20}}>
        <div style={{fontSize:12,color:'#4285F4',fontWeight:'bold'}}>Google AdSense</div>
        <div style={{fontSize:18,fontWeight:'900',marginTop:8}}>{business||'Jumia - Offer Leo!'}</div>
        <div style={{fontSize:12,color:'#666',marginTop:6}}>Pata punguzo 50% - Bonyeza!</div>
        <div style={{marginTop:12,background:'#4285F4',color:'white',padding:'12px',borderRadius:8,fontWeight:'bold'}}>FUNGUA</div>
      </div>
    </div>
  )
}

function VibraFixed(){
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
      let all:any[]=[]
      keys.forEach(k=>{ try{ const d=JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(d)) all=all.concat(d) }catch{} })
      const uniq=new Map()
      all.forEach((item:any)=>{ const obj=typeof item==='string'? {url:item, caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp', username:'@MrVibra'}: item; if(obj.url) uniq.set(obj.url, obj) })
      const final=Array.from(uniq.values())
      if(final.length>0) localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(final))
      return final
    }catch{ return [] }
  })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]') }catch{ return [] } })

  const saveDp=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const r=new FileReader(); r.onload=()=>{ const url=r.result as string; setDp(url); localStorage.setItem('vibra_dp', url); alert('✅ DP imewekwa!') }; r.readAsDataURL(file)
  }

  const feed = (()=> {
    const base = myVideos.length===0? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username}] : myVideos
    let list:any[]=[]
    let adIdx=0
    base.forEach((v,i)=>{
      list.push(v)
      if((i+1)%3===0){
        if(myAds[adIdx]){ list.push({...myAds[adIdx], isAd:true, isLocalAd:true}); adIdx++ }
        else { list.push({isAd:true, isGoogleAd:true, business: i%2===0?'Jumia Kenya - Offer 50%':'Betika - Shinda Leo!'}) }
      }
    })
    return list
  })()

  const current=feed[idx % feed.length]

  useEffect(()=>{
    const handleVisibility = () => {
      const v = videoRef.current
      if(document.hidden){ v?.pause() } else { if(hasInteracted && !isLiveCam && tab==='home' && !current?.isGoogleAd){ if(v){ v.muted=muted; v.play().catch(()=>{}) } } }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', ()=> videoRef.current?.pause())
    return ()=> document.removeEventListener('visibilitychange', handleVisibility)
  }, [hasInteracted, muted, isLiveCam, tab, current])

  useEffect(()=>{ if(!isLiveCam && tab==='home' && !current?.isGoogleAd){ const v=videoRef.current; if(!v) return; const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100); const onEnd=()=> setIdx(i=> (i+1)%feed.length); v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnd); v.muted=!hasInteracted; v.load(); v.play().catch(()=>{}); return ()=>{ v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) } } }, [idx, hasInteracted, isLiveCam, tab, feed.length, current])

  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true});
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; liveCamRef.current.play() }
      setIsLiveCam(true); setShowUpload(false)
    }catch{ alert('Bonyeza Allow while visiting the site') }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false) }
  const doLike=()=>{ if(liked){ setLikes(l=> l-1); setLiked(false) }else{ setLikes(l=> l+1); setLiked(true) } }
  const doSave=()=>{ setSaved(!saved) }
  const saveNew=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        if(!adBiz) return alert('Weka jina la biashara!')
        const ad={url, caption, tags, business:adBiz, link:adLink, username}
        const nl=[ad, ...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
        alert(`✅ AD ${adBiz} imewekwa!`)
      }else{
        const v={url, caption: caption||'Kamata', tags, username}
        const nl=[v, ...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl))
        alert(`✅ Video na tags ${tags} imewekwa!`)
      }
      setShowUpload(false); setCaption(''); setTags('#VIBRA #Mombasa #viral #fyp')
    }
    r.readAsDataURL(file)
  }

  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #222'}}>
          <b>BIASHARA</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 14px', borderRadius:20}}>✕ Funga</span>
        </div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:16, alignItems:'center', background:'#111', padding:16, borderRadius:16, border:'1px solid #222'}}>
            <div style={{width:80, height:80, borderRadius:'50%', border:'3px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:32}}>👤</span>}
            </div>
            <div>
              <div style={{fontWeight:'900', fontSize:18}}>{username}</div>
              <div style={{fontSize:12, color:'#888'}}>{myVideos.length} Videos • {myAds.length} Ads + Google Auto</div>
              <label style={{background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', marginTop:10, display:'inline-block'}}>
                📸 WEKA DP YAKO
                <input type="file" accept="image/*" onChange={saveDp} style={{display:'none'}}/>
              </label>
            </div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:14}}><button onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{flex:1, background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>＋ Video</button><button onClick={()=> {setUploadMode('ad'); setShowUpload(true)}} style={{flex:1, background:'#ffcc00', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📢 + AD</button></div>
        </div>
        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', marginTop:12, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white'}}/><label style={{marginTop:14, display:'block', background:'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900'}}>CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      {current?.isGoogleAd ? <GoogleAdBox business={current.business}/> : isLiveCam ? <video ref={liveCamRef} autoPlay muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)'}}/> : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false } }}/>}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:20, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', gap:8}}><div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'6px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>{isLiveCam?`🔴 LIVE ${liveViewers}`:'⚪ LIVE'}</div></div>
      <div style={{position:'absolute', right:8, bottom:110, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:30}}>
        <div onClick={()=> setTab('me')} style={{width:46, height:46, borderRadius:'50%', border:'2px solid white', overflow:'hidden', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{color:'white',fontWeight:'900'}}>M</span>}
        </div>
        <div onClick={doLike} style={{textAlign:'center'}}><div style={{width:46, height:46, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center'}}>❤️</div><div style={{color:'white', fontSize:12}}>{likes}</div></div>
      </div>
      <div style={{position:'absolute', bottom:90, left:12, right:70, color:'white'}}><div style={{fontSize:13}}>{current?.caption}</div><div style={{fontSize:13, color: current?.isGoogleAd?'#4285F4':'#ffcc00', fontWeight:'bold'}}>{current?.tags}</div></div>
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div onClick={()=> setTab('home')} style={{color:'white'}}>🏠 Home</div><div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{width:42, height:26, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900'}}>+</div><div onClick={()=> setTab('me')} style={{color:'#888'}}>👤 Biashara</div></div>
      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', marginTop:12, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white'}}/><label style={{marginTop:14, display:'block', background:'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900'}}>CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play()}}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60}}><div style={{background:'white', color:'black', padding:'12px 20px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha sauti</div></div>}
    </div>
  )
}
