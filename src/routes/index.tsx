import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinalComplete })

function VibraFinalComplete(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home') // home, explore, inbox, me
  const [progress,setProgress]=useState(0)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [muted,setMuted]=useState(true)
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(243)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [liveViewers,setLiveViewers]=useState(128)
  
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [uploadMode,setUploadMode]=useState('video') // video, ad, live

  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #Mbosso')
  const [adBiz,setAdBiz]=useState('')
  const [adLink,setAdLink]=useState('')
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')

  const [myVideos,setMyVideos]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_videos')||'[]') }catch{ return [] } })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]') }catch{ return [] } })

  // FEED - 1 AD kila baada ya video 3 - HII NDIO INAONYESHA ADS!
  const feed = (() => {
    if(myVideos.length===0) return [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Monalisa anapiga', tags:'#VIBRA #Mbosso #Konde', username:'@MrVibra', isSample:true}]
    let list:any[]=[]; let adP=0
    myVideos.forEach((v,i)=>{
      list.push(v)
      if((i+1)%3===0 && myAds[adP]){ list.push({...myAds[adP], isAd:true}); adP=(adP+1)%myAds.length }
    })
    return list
  })()

  const current = feed[idx % feed.length]

  // SAUTI IKATE UKITOKA APP
  useEffect(()=>{
    const onVis=()=>{ if(document.hidden) videoRef.current?.pause(); else if(hasInteracted && !isLiveCam) videoRef.current?.play().catch(()=>{}) }
    document.addEventListener('visibilitychange', onVis)
    return ()=> document.removeEventListener('visibilitychange', onVis)
  }, [hasInteracted, isLiveCam])

  useEffect(()=>{
    if(isLiveCam || tab!=='home') return
    const v=videoRef.current; if(!v) return
    const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100)
    const onEnd=()=> setIdx(i=> (i+1)%feed.length)
    v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnd)
    v.muted=!hasInteracted; v.load(); v.play().catch(()=>{})
    return ()=> { v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) }
  }, [idx, hasInteracted, isLiveCam, tab, feed.length])

  // LIVE CAMERA YA KWELI
  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true})
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; liveCamRef.current.play() }
      setIsLiveCam(true); setUploadMode('live'); setShowUpload(false); setTab('home')
      const t=setInterval(()=> setLiveViewers(v=> v+Math.floor(Math.random()*5)), 2000)
      ;(window as any).liveInterval=t
    }catch{ alert('Ruhusu Camera na Mic kwanza kwenye browser!') }
  }
  const endLive=()=>{
    const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(tr=> tr.stop())
    setIsLiveCam(false); clearInterval((window as any).liveInterval)
  }

  const saveVideo=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    if(!caption) { alert('Andika caption kwanza!'); return }
    if(!tags.includes('#')) { alert('Weka #tags! Mfano #VIBRA #Mombasa'); return }
    const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        if(!adBiz){ alert('Weka Jina la Biashara ya Mteja kwa AD!'); return }
        const ad={url, caption, tags, business:adBiz, link:adLink, username, date:new Date().toLocaleDateString()}
        const nl=[ad, ...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
        alert(`✅ AD ya ${adBiz} IMEWEKWA! Sasa itaonekana kila baada ya video 3 kwenye feed! Tags: ${tags}`)
      }else{
        const v={url, caption, tags, username, date:new Date().toLocaleDateString()}
        const nl=[v, ...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos', JSON.stringify(nl))
        alert(`✅ Video IMEWEKWA! Caption: ${caption} Tags: ${tags}`)
      }
      setShowUpload(false); setCaption(''); setTags('#VIBRA #Mombasa #Mbosso'); setAdBiz(''); setAdLink(''); setIdx(0)
    }
    r.readAsDataURL(file)
  }

  // ===== BIASHARA / ME PAGE - HII NDIO ULIYOSEMA HAIPO! =====
  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:70}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #222'}}><b>👤 BIASHARA / ME PAGE</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 12px', borderRadius:20, fontSize:12, cursor:'pointer'}}>✕ Funga</span></div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:12, alignItems:'center'}}><div style={{width:70, height:70, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div><div><div style={{fontWeight:'900', fontSize:18}}>{username}</div><div style={{fontSize:12, color:'#aaa'}}>@mrvibra • Mombasa • {myVideos.length} Videos • {myAds.length} Ads</div></div></div>
          
          <div style={{display:'flex', gap:8, marginTop:16}}>
            <div style={{flex:1, background:'#111', padding:12, borderRadius:10, textAlign:'center'}}><div style={{fontWeight:'900', fontSize:20}}>{myVideos.length}</div><div style={{fontSize:11, color:'#888'}}>Videos Zangu</div></div>
            <div style={{flex:1, background:'#111', padding:12, borderRadius:10, textAlign:'center'}}><div style={{fontWeight:'900', fontSize:20, color:'#ffcc00'}}>{myAds.length}</div><div style={{fontSize:11, color:'#888'}}>Ads Zinazoonekana</div></div>
            <div style={{flex:1, background:'#111', padding:12, borderRadius:10, textAlign:'center'}}><div style={{fontWeight:'900', fontSize:20}}>{feed.length}</div><div style={{fontSize:11, color:'#888'}}>Feed Total</div></div>
          </div>

          <div style={{marginTop:16, display:'flex', gap:8}}>
            <button onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{flex:1, background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📹 + Video + #tags</button>
            <button onClick={()=> {setUploadMode('ad'); setShowUpload(true)}} style={{flex:1, background:'#ffcc00', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📢 + AD (Pesa!)</button>
          </div>

          <div style={{marginTop:20}}><b style={{fontSize:13}}>📹 Videos Zangu ({myVideos.length}) - Zina #tags</b>{myVideos.map((v,i)=><div key={i} style={{marginTop:10, background:'#111', padding:10, borderRadius:10, display:'flex', gap:10}}><video src={v.url} style={{width:70, height:90, objectFit:'cover', borderRadius:6}}/><div style={{flex:1}}><div style={{fontSize:12, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:11, color:'#ffcc00', marginTop:4}}>{v.tags}</div><div style={{fontSize:10, color:'#666', marginTop:4}}>{v.date}</div></div><button onClick={()=> { const nl=myVideos.filter((_,j)=> j!==i); setMyVideos(nl); localStorage.setItem('vibra_V3_videos', JSON.stringify(nl)) }} style={{background:'#222', color:'#ff3040', border:'none', padding:'6px 10px', borderRadius:6, fontSize:12, height:30}}>Futa</button></div>)}{myVideos.length===0 && <div style={{color:'#666', fontSize:12, marginTop:8}}>Hakuna video bado - Bonyeza + Video + #tags juu!</div>}</div>

          <div style={{marginTop:20}}><b style={{fontSize:13, color:'#ffcc00'}}>📢 Ads Zangu ({myAds.length}) - Zinaonekana kila video 3!</b>{myAds.map((a,i)=><div key={i} style={{marginTop:10, background:'#1a1600', border:'1px solid #ffcc00', padding:10, borderRadius:10, display:'flex', gap:10}}><video src={a.url} style={{width:70, height:90, objectFit:'cover', borderRadius:6}}/><div style={{flex:1}}><div style={{fontSize:12, fontWeight:'bold'}}>📢 AD: {a.business}</div><div style={{fontSize:11, marginTop:2}}>{a.caption}</div><div style={{fontSize:11, color:'#ffcc00'}}>{a.tags}</div><div style={{fontSize:10, color:'#aaa'}}>🔗 {a.link}</div></div><button onClick={()=> { const nl=myAds.filter((_,j)=> j!==i); setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl)) }} style={{background:'#ffcc00', color:'black', border:'none', padding:'6px 10px', borderRadius:6, fontSize:12, height:30}}>Futa AD</button></div>)}{myAds.length===0 && <div style={{color:'#666', fontSize:12, marginTop:8}}>Hakuna AD bado - Bonyeza + AD (Pesa!) - AD itaonekana kila video 3 kama TikTok!</div>}</div>

          <div style={{marginTop:20, background:'#111', padding:12, borderRadius:10}}><div style={{fontSize:12, fontWeight:'bold'}}>⚙️ Username</div><input value={username} onChange={e=> {setUsername(e.target.value); localStorage.setItem('vibra_u', e.target.value)}} style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:8, color:'white'}}/></div>
        </div>

        <div style={{position:'fixed', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}>
          <div onClick={()=> setTab('home')} style={{color:'#888', textAlign:'center'}}><div>🏠</div><div style={{fontSize:9}}>Home</div></div><div style={{color:'white', textAlign:'center'}}><div>👤</div><div style={{fontSize:9, fontWeight:'bold'}}>Biashara</div></div>
        </div>

        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white', overflowY:'auto'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}><b>{uploadMode==='ad'?'📢 UPLOAD AD + #tags':'📹 UPLOAD VIDEO + #tags'}</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22}}>✕</span></div>
          <div style={{marginTop:12, background:'#111', padding:12, borderRadius:10}}>
            <div style={{fontSize:12, color:'#ffcc00', fontWeight:'bold'}}>1. Andika Caption</div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Monalisa anapiga, moyo unadunda..." style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #444', padding:'12px', borderRadius:8, color:'white'}}/>
            <div style={{fontSize:12, color:'#ffcc00', fontWeight:'bold', marginTop:12}}>2. Weka #tags HAPA - Lazima! (Hii ndio ulikuwa hutaiwona!)</div><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA #Mombasa #Mbosso #Konde #Harmonize" style={{width:'100%', marginTop:6, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', fontWeight:'bold'}}/><div style={{fontSize:10, color:'#aaa', marginTop:4}}>💡 Andika tags nyingi: #VIBRA #Mombasa #Mbosso #Konde - Zitaonekana chini ya video!</div>
            {uploadMode==='ad' && <><div style={{fontSize:12, color:'#ffcc00', fontWeight:'bold', marginTop:12}}>3. Jina la Biashara (Kwa AD)</div><input value={adBiz} onChange={e=> setAdBiz(e.target.value)} placeholder="Salon Faraja - Bamburi - 0712..." style={{width:'100%', marginTop:6, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white'}}/><div style={{fontSize:12, color:'#aaa', marginTop:8}}>🔗 Link ya WhatsApp</div><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="https://wa.me/2547..." style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/></>}
          </div>
          <label style={{marginTop:16, display:'block', background: uploadMode==='ad'?'#ffcc00':'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', cursor:'pointer'}}>{uploadMode==='ad'?'📢 CHAGUA VIDEO YA AD + UPLOAD':'📹 CHAGUA VIDEO + UPLOAD NA #TAGS'}<input type="file" accept="video/*" onChange={saveVideo} style={{display:'none'}}/></label>
          <div style={{marginTop:10, background:'#111', padding:10, borderRadius:8, fontSize:11, color:'#aaa'}}>✅ Baada ya kuchagua video: Video itahifadhiwa na #tags zako: <span style={{color:'#ffcc00'}}>{tags}</span> {uploadMode==='ad'? `• AD ya ${adBiz||'biashara'} itaonekana kila video 3!`: '• Itaonekana kwenye Home feed!'}</div>
        </div>}
      </div>
    )
  }

  // HOME FEED
  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50 && tab==='home' && !showUpload) dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      
      {isLiveCam ? <video ref={liveCamRef} autoPlay muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)'}}/> : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); setMuted(false); if(videoRef.current) videoRef.current.muted=false } else { setMuted(!muted); if(videoRef.current) videoRef.current.muted=!videoRef.current.muted } }}/>}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', alignItems:'center', gap:8}}>
        <div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.2)', color:'white', padding:'6px 12px', borderRadius:20, fontWeight:'900', fontSize:12, cursor:'pointer', border: isLiveCam?'2px solid white':''}}>{isLiveCam?`🔴 LIVE ${liveViewers} • END`:'⚪ LIVE'}</div>
        <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:20, padding:'8px 14px', display:'flex', alignItems:'center', gap:6}}><span>🔍</span><input placeholder="Search #tags, Monalisa..." style={{flex:1, background:'transparent', border:'none', color:'white', outline:'none', fontSize:12}}/></div>
        <div>🔔</div>
      </div>

      {current?.isAd && <div style={{position:'absolute', top:50, left:12, background:'#ffcc00', color:'black', padding:'5px 12px', borderRadius:12, fontSize:12, fontWeight:'900', zIndex:10}}>📢 AD • {current.business} • Kila video 3 - Swipe up!</div>}
      {isLiveCam && <div style={{position:'absolute', top:50, left:12, background:'#ff3040', color:'white', padding:'5px 12px', borderRadius:12, fontSize:11, fontWeight:'bold', zIndex:10}}>🔴 YOU ARE LIVE NOW • {liveViewers} viewers • Camera ya kweli!</div>}

      <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:14, alignItems:'center', zIndex:10}}>
        <div style={{width:44, height:44, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div>
        <div onClick={()=> setLiked(!liked)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:42, height:42, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>{liked?'❤️':'🤍'}</div><div style={{color:'white', fontSize:11}}>{likes}</div></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center'}}><div style={{width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>💬</div><div style={{color:'white', fontSize:11}}>9</div></div>
        <div style={{textAlign:'center'}}><div style={{width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>↗️</div><div style={{color:'white', fontSize:10}}>Share</div></div>
        <div style={{textAlign:'center'}}><div style={{width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>🔖</div><div style={{color:'white', fontSize:10}}>Save</div></div>
        <div style={{textAlign:'center'}}><div style={{width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>🎵</div><div style={{color:'white', fontSize:10}}>Lyrics</div></div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:70, color:'white', zIndex:10}}>
        <div style={{fontWeight:'bold', fontSize:12}}>{current?.isAd? `📢 AD • ${current.business}` : `${username} • ${idx+1}/${feed.length}`} {isLiveCam?'🔴 LIVE':''}</div>
        <div style={{fontSize:12, marginTop:4}}>{current?.caption}</div>
        <div style={{fontSize:12, color:'#ffcc00', fontWeight:'bold', marginTop:2}}>{current?.tags}</div>
        {current?.isAd && <div style={{fontSize:10, marginTop:4, background:'#ffcc00', color:'black', padding:'3px 8px', borderRadius:8, display:'inline-block'}}>🔗 {current.link} • Bonyeza Inbox kununua!</div>}
      </div>

      <div style={{position:'absolute', bottom:64, left:0, right:0, padding:'0 10px', zIndex:20, display:'flex', alignItems:'center', gap:8}}><span onClick={()=> setIdx(i=> (i-1+feed.length)%feed.length)} style={{color:'white'}}>⏮️</span><input type="range" min={0} max={100} value={progress} onChange={e=>{ const p=Number(e.target.value); if(videoRef.current?.duration) videoRef.current.currentTime=(p/100)*videoRef.current.duration }} style={{flex:1, accentColor:'white', height:3}}/><span onClick={()=> setIdx(i=> (i+1)%feed.length)} style={{color:'white'}}>⏭️</span></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}>
        <div onClick={()=> setTab('home')} style={{color: tab==='home'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:9}}>Home</div></div>
        <div style={{color:'#888', textAlign:'center'}}><div style={{fontSize:20}}>🔍</div><div style={{fontSize:9}}>Explore</div></div>
        <div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{cursor:'pointer'}}><div style={{width:42, height:26, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900'}}>+</div></div>
        <div style={{color:'#888', textAlign:'center'}}><div style={{fontSize:20}}>📥</div><div style={{fontSize:9}}>Inbox</div></div>
        <div onClick={()=> setTab('me')} style={{color: tab==='me'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:20}}>👤</div><div style={{fontSize:9, fontWeight:'bold'}}>Biashara ({myVideos.length}/{myAds.length})</div></div>
      </div>

      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white', overflowY:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><b>{uploadMode==='ad'?'📢 UPLOAD AD + #tags (Pesa!)': uploadMode==='live'?'🔴 GO LIVE':'📹 UPLOAD VIDEO + #tags'}</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div>
        <div style={{display:'flex', gap:8, marginTop:14}}><button onClick={()=> setUploadMode('video')} style={{flex:1, background: uploadMode==='video'?'white':'#222', color: uploadMode==='video'?'black':'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>Video</button><button onClick={()=> setUploadMode('ad')} style={{flex:1, background: uploadMode==='ad'?'#ffcc00':'#222', color: uploadMode==='ad'?'black':'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>AD + #tags</button><button onClick={goLive} style={{flex:1, background: '#ff3040', color:'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>🔴 LIVE CAM</button></div>
        {uploadMode!=='live' && <div style={{marginTop:14, background:'#111', padding:12, borderRadius:10}}>
          <div style={{fontSize:12, color:'#ffcc00', fontWeight:'900'}}>1. CAPTION - Andika maelezo</div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Monalisa anapiga..." style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #444', padding:'12px', borderRadius:8, color:'white'}}/>
          <div style={{fontSize:13, color:'#ffcc00', fontWeight:'900', marginTop:14, background:'#ffcc0033', padding:'8px', borderRadius:6}}>2. #TAGS - WEKA HAPA! HII NDIO ULIKOSEKA! 👇</div><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA #Mombasa #Mbosso #Konde" style={{width:'100%', marginTop:8, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white', fontWeight:'bold', fontSize:14}}/><div style={{fontSize:11, color:'#ffcc00', marginTop:6}}>👆 Andika hapa tags zako - Zitaonekana njano chini ya video kama picha yako ya Mbosso!</div>
          {uploadMode==='ad' && <><div style={{fontSize:12, color:'#ffcc00', fontWeight:'bold', marginTop:14}}>3. JINA LA BIASHARA (AD)</div><input value={adBiz} onChange={e=> setAdBiz(e.target.value)} placeholder="Salon Faraja Bamburi" style={{width:'100%', marginTop:6, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white'}}/><div style={{fontSize:11, marginTop:8}}>🔗 Link</div><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="https://wa.me/254..." style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:8, color:'white'}}/></>}
        </div>}
        <label style={{marginTop:16, display:'block', background: uploadMode==='ad'?'#ffcc00':'white', color:'black', padding:'18px', borderRadius:12, textAlign:'center', fontWeight:'900', cursor:'pointer', fontSize:14}}>{uploadMode==='ad'?'📢 CHAGUA VIDEO YA AD NA #TAGS - UPLOAD':'📹 CHAGUA VIDEO NA #TAGS - UPLOAD'}<input type="file" accept="video/*" onChange={saveVideo} style={{display:'none'}}/></label>
        {uploadMode==='live' && <button onClick={goLive} style={{marginTop:16, width:'100%', background:'#ff3040', color:'white', border:'none', padding:'18px', borderRadius:12, fontWeight:'900', fontSize:16}}>🔴 ANZA LIVE NA CAMERA YAKO YA KWELI!<br/><span style={{fontSize:11}}>Si picha - Ni camera yako LIVE!</span></button>}
      </div>}

      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); setMuted(false); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play()}}} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.75)', color:'white', padding:'12px 20px', borderRadius:20, zIndex:15, cursor:'pointer'}}><div>🔊</div><div style={{fontSize:11}}>Tap for sound</div></div>}
    </div>
  )
}
