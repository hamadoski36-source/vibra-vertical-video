import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinalFixed })

function VibraFinalFixed(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [progress,setProgress]=useState(0)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [muted,setMuted]=useState(true)
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(243)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [liveViewers,setLiveViewers]=useState(128)
  const [liveEarnings,setLiveEarnings]=useState(0)
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
      const allKeys=['vibra_V3_videos','vibra_real_videos','vibra_V3_videos_FINAL','vibra_V3_videos_v2','vibra_V3_ads']
      let all:any[]=[]
      allKeys.forEach(k=>{ try{ const d=JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(d)) all=all.concat(d.filter((x:any)=> x.url && !x.business)) }catch{} })
      const uniq=new Map()
      all.forEach((item:any)=>{ const obj=typeof item==='string'? {url:item, caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp', username:'@MrVibra'}: item; if(obj.url) uniq.set(obj.url, obj) })
      let final=Array.from(uniq.values())
      if(final.length===0){
        final=[{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username:'@MrVibra'}]
      }
      return final
    }catch{ return [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp', username:'@MrVibra'}] }
  })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]') }catch{ return [] } })

  const saveDp=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ const u=r.result as string; setDp(u); localStorage.setItem('vibra_dp', u) }; r.readAsDataURL(f) }

  const feed = (()=> {
    const base = myVideos
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

  useEffect(()=>{
    const h=()=>{ if(document.hidden) videoRef.current?.pause(); else if(hasInteracted && !isLiveCam && !current?.isGoogleAd){ videoRef.current?.play().catch(()=>{}) } }
    document.addEventListener('visibilitychange', h)
    return ()=> document.removeEventListener('visibilitychange', h)
  }, [hasInteracted, isLiveCam, current])

  useEffect(()=>{ if(!isLiveCam && !current?.isGoogleAd){ const v=videoRef.current; if(!v) return; const onT=()=> setProgress((v.currentTime/(v.duration||1))*100); const onE=()=> setIdx(i=> (i+1)%feed.length); v.addEventListener('timeupdate', onT); v.addEventListener('ended', onE); v.muted=!hasInteracted; v.load(); v.play().catch(()=>{}); return ()=>{ v.removeEventListener('timeupdate', onT); v.removeEventListener('ended', onE) } } }, [idx, hasInteracted, isLiveCam, current])

  // LIVE NA PESA INAYOHESABU!
  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true});
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; await liveCamRef.current.play() }
      setIsLiveCam(true)
      const t1=setInterval(()=> setLiveViewers(v=> v+Math.floor(Math.random()*4)), 2500)
      const t2=setInterval(()=> setLiveEarnings(e=> e+ (Math.random()*5+1)), 1500)
      ;(window as any)._lt=[t1,t2]
    }catch{
      alert('❌ CAMERA IMEBLOCKWA!\n\nFanya hivi sasa:\n1. Bonyeza 🔒 kushoto ya al-video-jhab.vercel.app juu\n2. Site settings\n3. Camera → Allow\n4. Mic → Allow\n5. Rudi hapa → Refresh (swipe down)\n6. Bonyeza LIVE tena!')
    }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false); (window as any)._lt?.forEach((t:any)=> clearInterval(t)); }

  const saveNew=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        const ad={url, caption, tags, business:adBiz||'Biashara Yangu', link:adLink, username}
        const nl=[ad, ...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
        alert('✅ AD imewekwa!')
      }else{
        const v={url, caption: caption||'Kamata', tags, username}
        const nl=[v, ...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl)); localStorage.setItem('vibra_V3_videos', JSON.stringify(nl))
        alert('✅ Video imewekwa!')
      }
      setShowUpload(false)
    }
    r.readAsDataURL(file)
  }

  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>BIASHARA • {myVideos.length} Videos</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 14px', borderRadius:20}}>✕ Funga</span></div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:16, alignItems:'center', background:'#111', padding:16, borderRadius:16, border:'1px solid #222'}}>
            <div style={{width:80, height:80, borderRadius:'50%', border:'3px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:32}}>👤</span>}
            </div>
            <div><div style={{fontWeight:'900', fontSize:18}}>{username}</div><div style={{fontSize:11, color:'#888'}}>{myVideos.length} Videos • {myAds.length} Ads + Google Auto</div><label style={{background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', marginTop:8, display:'inline-block'}}>📸 WEKA DP<input type="file" accept="image/*" onChange={saveDp} style={{display:'none'}}/></label></div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:14}}><button onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{flex:1, background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>＋ Video + #tags</button><button onClick={()=> {setUploadMode('ad'); setShowUpload(true)}} style={{flex:1, background:'#ffcc00', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📢 + AD</button></div>
          
          <div style={{marginTop:18}}><b style={{fontSize:14}}>📹 Videos zako ({myVideos.length})</b>
            <div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              {myVideos.map((v,i)=> (
                <div key={i} style={{background:'#111', borderRadius:12, overflow:'hidden', border:'1px solid #222'}}>
                  <video src={v.url} style={{width:'100%', height:130, objectFit:'cover'}} muted/>
                  <div style={{padding:8}}><div style={{fontSize:11, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:9, color:'#ffcc00'}}>{v.tags}</div></div>
                </div>
              ))}
            </div>
          </div>

          {myAds.length>0 && <div style={{marginTop:18}}><b style={{fontSize:14}}>📢 Ads zako ({myAds.length})</b><div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>{myAds.map((v,i)=> <div key={i} style={{background:'#111', borderRadius:12, overflow:'hidden', border:'2px solid #ffcc00'}}><video src={v.url} style={{width:'100%', height:100, objectFit:'cover'}} muted/><div style={{padding:6, fontSize:10}}>{v.business}</div></div>)}</div></div>}
        </div>
        <div style={{position:'fixed', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div onClick={()=> setTab('home')} style={{color:'#888'}}>🏠 Home</div><div style={{color:'white'}}>👤 Biashara</div></div>
        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', marginTop:12, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA #Mombasa #viral #fyp" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white'}}/>{uploadMode==='ad' && <><input value={adBiz} onChange={e=> setAdBiz(e.target.value)} placeholder="Biashara jina" style={{width:'100%', marginTop:8, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white'}}/><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="WhatsApp link" style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:8, color:'white'}}/></>}<label style={{marginTop:14, display:'block', background:uploadMode==='ad'?'#ffcc00':'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900'}}>CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      
      {current?.isGoogleAd ? (
        <div style={{width:'100%',height:'100%',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',padding:22,borderRadius:18,width:'85%',textAlign:'center'}}>
            <div style={{fontSize:11,color:'#4285F4',fontWeight:'900'}}>GOOGLE AD</div>
            <div style={{fontSize:20,fontWeight:'900',marginTop:10}}>{current.business}</div>
            <button onClick={()=> window.open(current.link,'_blank')} style={{marginTop:16, background:'#4285F4', color:'white', padding:'14px', borderRadius:12, fontWeight:'900', width:'100%', border:'none'}}>FUNGUA • OPEN</button>
          </div>
        </div>
      ) : isLiveCam ? (
        <div style={{width:'100%',height:'100%', position:'relative', background:'black'}}>
          <video ref={liveCamRef} autoPlay muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)'}}/>
          <div style={{position:'absolute', top:60, left:12, background:'rgba(0,0,0,0.7)', padding:'10px 14px', borderRadius:12, color:'white'}}>
            <div style={{fontSize:14, fontWeight:'900'}}>💰 KSH {liveEarnings.toFixed(2)}</div>
            <div style={{fontSize:11, color:'#0f0'}}>● LIVE • {liveViewers} viewers</div>
            <div style={{fontSize:10, color:'#ffcc00', marginTop:4}}>Pesa inahesabu live!</div>
          </div>
        </div>
      ) : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false } }}/>}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:20, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', gap:8}}>
        <div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'6px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>{isLiveCam?`🔴 LIVE ${liveViewers} • KSH ${liveEarnings.toFixed(0)}`:'⚪ LIVE'}</div>
      </div>

      <div style={{position:'absolute', right:8, bottom:100, display:'flex', flexDirection:'column', gap:14, alignItems:'center', zIndex:30}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', border:'2px solid white', overflow:'hidden', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{color:'white',fontWeight:'900'}}>V</span>}
        </div>
        <div onClick={()=> {setLiked(!liked); setLikes(l=> liked?l-1:l+1)}} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center'}}>❤️</div><div style={{color:'white', fontSize:12}}>{likes}</div></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center'}}>💬</div><div style={{color:'white', fontSize:12}}>{comments.length}</div></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center'}}>↗️</div><div style={{fontSize:10, color:'white'}}>Share</div></div>
        <div onClick={()=> alert(current?.caption+' '+current?.tags)} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center'}}>🎵</div><div style={{fontSize:10, color:'white'}}>Lyrics</div></div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:80, color:'white'}}><div style={{fontSize:12, fontWeight:'bold'}}>{current?.isGoogleAd? current.business: `${username} • ${idx+1}/${feed.length}`}</div><div style={{fontSize:13}}>{current?.caption}</div><div style={{fontSize:13, color:'#ffcc00', fontWeight:'bold'}}>{current?.tags}</div></div>
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div style={{color:'white'}}>🏠 Home</div><div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{width:42, height:26, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900'}}>+</div><div onClick={()=> setTab('me')} style={{color:'#888'}}>👤 Biashara ({myVideos.length})</div></div>
      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play()}}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60}}><div style={{background:'white', color:'black', padding:'12px 20px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha sauti</div></div>}
    </div>
  )
}
