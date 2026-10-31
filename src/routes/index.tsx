import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFixed })

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
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')
  const [newC,setNewC]=useState('')
  const [comments,setComments]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_c')||'["@Monalisa: 🔥","@mbosso_: Andika neno moja kwa Konde"]'))

  // MERGE VIDEO ZOTE ZA ZAMANI - ILI USIPOTEZE VIDEO ZAKO 3!
  const [myVideos,setMyVideos]=useState<any[]>(()=> {
    try{
      const keys=['vibra_V3_videos','vibra_real_videos','vibra_V3_videos_v2','vibra_real_videos_v2']
      let all:any[]=[]
      keys.forEach(k=>{
        try{ const d=JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(d)) all=[...all, ...d] }catch{}
      })
      // Toa duplicate na convert string -> object
      const uniq=new Map()
      all.forEach((item:any)=>{
        const obj=typeof item==='string'? {url:item, caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username:'@MrVibra'} : item
        if(obj.url) uniq.set(obj.url, obj)
      })
      const final=Array.from(uniq.values())
      if(final.length>0) localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(final))
      return final
    }catch{ return [] }
  })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_V3_ads')||'[]').concat(JSON.parse(localStorage.getItem('vibra_real_ads')||'[]')).concat(JSON.parse(localStorage.getItem('vibra_V3_ads_v2')||'[]')) }catch{ return [] } })

  const feed = myVideos.length===0? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username:'@MrVibra'}] : (()=>{ let l:any[]=[]; let a=0; myVideos.forEach((v,i)=>{ l.push(v); if((i+1)%3===0 && myAds[a]){ l.push({...myAds[a], isAd:true}); a++ } }); return l })()

  const current=feed[idx % feed.length]

  useEffect(()=>{ if(!isLiveCam && tab==='home'){ const v=videoRef.current; if(!v) return; const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100); const onEnd=()=> setIdx(i=> (i+1)%feed.length); v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnd); v.muted=!hasInteracted; v.load(); v.play().catch(()=>{}); return ()=>{ v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) } } }, [idx, hasInteracted, isLiveCam, tab, feed.length])
  useEffect(()=>{ if(document.hidden) videoRef.current?.pause(); }, [])

  const goLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true})
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; liveCamRef.current.play() }
      setIsLiveCam(true); setShowUpload(false); const t=setInterval(()=> setLiveViewers(v=> v+Math.floor(Math.random()*5)), 2000); (window as any).liveT=t
    }catch{ alert('Bonyeza Allow while visiting the site kwenye popup kama picha yako ya 2!') }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false); clearInterval((window as any).liveT) }

  const doLike=()=>{ if(liked){ setLikes(l=> l-1); setLiked(false) }else{ setLikes(l=> l+1); setLiked(true); if(navigator.vibrate) navigator.vibrate(50) } }
  const doSave=()=>{ setSaved(!saved); alert(saved?'Removed from saved':'✅ Saved! Itaonekana Biashara page!') }

  const saveNew=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{
      const url=r.result as string
      if(uploadMode==='ad'){
        if(!adBiz) return alert('Weka jina la biashara!')
        const ad={url, caption, tags, business:adBiz, link:adLink, username}
        const nl=[ad, ...myAds]; setMyAds(nl); localStorage.setItem('vibra_V3_ads', JSON.stringify(nl))
        alert(`✅ AD ${adBiz} imewekwa! Itaonekana kila video 3!`)
      }else{
        const v={url, caption: caption||'Kamata', tags, username}
        const nl=[v, ...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl)); localStorage.setItem('vibra_V3_videos', JSON.stringify(nl))
        alert(`✅ Video na tags ${tags} imewekwa!`)
      }
      setShowUpload(false); setCaption(''); setTags('#VIBRA #Mombasa #viral #fyp'); setIdx(0)
    }
    r.readAsDataURL(file)
  }

  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:70}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>👤 BIASHARA / ME PAGE - VIDEO ZOTE</b><span onClick={()=> setTab('home')} style={{background:'#222', padding:'6px 14px', borderRadius:20, cursor:'pointer'}}>✕ Funga</span></div>
        <div style={{padding:16}}>
          <div style={{display:'flex', gap:12, alignItems:'center'}}><div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:22}}>M</div><div><b>@MrVibra</b><div style={{fontSize:11, color:'#aaa'}}>{myVideos.length} Videos • {myAds.length} Ads • Feed {feed.length}</div></div></div>
          <div style={{display:'flex', gap:8, marginTop:14}}><div style={{flex:1, background:'#111', padding:10, borderRadius:8, textAlign:'center'}}><b>{myVideos.length}</b><div style={{fontSize:10, color:'#888'}}>Videos</div></div><div style={{flex:1, background:'#111', padding:10, borderRadius:8, textAlign:'center'}}><b style={{color:'#ffcc00'}}>{myAds.length}</b><div style={{fontSize:10, color:'#888'}}>Ads</div></div><div style={{flex:1, background:'#111', padding:10, borderRadius:8, textAlign:'center'}}><b>{feed.length}</b><div style={{fontSize:10, color:'#888'}}>Total</div></div></div>
          <div style={{display:'flex', gap:8, marginTop:12}}><button onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{flex:1, background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📹 + Video + #tags</button><button onClick={()=> {setUploadMode('ad'); setShowUpload(true)}} style={{flex:1, background:'#ffcc00', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'900'}}>📢 + AD</button></div>
          <div style={{marginTop:18}}><b style={{fontSize:13}}>📹 Videos ({myVideos.length}) - Zina #tags kama ulivyoweka</b>{myVideos.map((v,i)=><div key={i} style={{marginTop:10, background:'#111', padding:10, borderRadius:10, display:'flex', gap:10}}><video src={v.url} style={{width:70, height:80, objectFit:'cover', borderRadius:6}}/><div style={{flex:1}}><div style={{fontSize:12, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:11, color:'#ffcc00'}}>{v.tags}</div><div style={{fontSize:10, color:'#666'}}>{v.username}</div></div><button onClick={()=> { const nl=myVideos.filter((_,j)=> j!==i); setMyVideos(nl); localStorage.setItem('vibra_V3_videos_FINAL', JSON.stringify(nl)) }} style={{background:'#222', color:'#ff3040', border:'none', height:30, padding:'0 10px', borderRadius:6}}>Futa</button></div>)}</div>
        </div>
        <div style={{position:'fixed', bottom:0, left:0, right:0, height:56, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div onClick={()=> setTab('home')} style={{color:'#888', textAlign:'center', cursor:'pointer'}}><div>🏠</div><div style={{fontSize:9}}>Home</div></div><div style={{color:'white', textAlign:'center'}}><div>👤</div><div style={{fontSize:9, fontWeight:'bold'}}>Biashara ({myVideos.length}/{myAds.length})</div></div></div>
        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD VIDEO + #tags</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{marginTop:12, background:'#111', padding:12, borderRadius:10}}><div style={{fontSize:12, color:'#ffcc00'}}>Caption</div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Kamata" style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><div style={{fontSize:12, color:'#ffcc00', marginTop:12, fontWeight:'900', background:'#ffcc0033', padding:'6px', borderRadius:6}}>#TAGS - WEKA HAPA!</div><input value={tags} onChange={e=> setTags(e.target.value)} style={{width:'100%', marginTop:6, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white', fontWeight:'bold'}}/></div><label style={{marginTop:14, display:'block', background:'white', color:'black', padding:'16px', borderRadius:10, textAlign:'center', fontWeight:'900', cursor:'pointer'}}>CHAGUA VIDEO NA #TAGS - UPLOAD<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label></div>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50 && tab==='home') dy>0?setIdx(i=> (i+1)%feed.length):setIdx(i=> (i-1+feed.length)%feed.length) }}>
      {isLiveCam ? <video ref={liveCamRef} autoPlay muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)'}}/> : <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover'}} src={current?.url} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false } }}/>}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'8px 10px', zIndex:20, background:'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)', display:'flex', gap:8, alignItems:'center'}}>
        <div onClick={isLiveCam?endLive:goLive} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'6px 12px', borderRadius:20, fontWeight:'900', fontSize:12, cursor:'pointer', border: isLiveCam?'2px solid white':''}}>{isLiveCam?`🔴 LIVE ${liveViewers} END`:'⚪ LIVE'}</div>
        <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:20, padding:'8px 14px', display:'flex', gap:6}}><span>🔍</span><input placeholder="Search #tags" style={{flex:1, background:'transparent', border:'none', color:'white', outline:'none', fontSize:12}}/></div>
      </div>

      {current?.isAd && <div style={{position:'absolute', top:50, left:12, background:'#ffcc00', color:'black', padding:'5px 12px', borderRadius:12, fontSize:12, fontWeight:'900', zIndex:10}}>📢 AD • {current.business}</div>}
      {isLiveCam && <div style={{position:'absolute', top:50, left:12, background:'#ff3040', color:'white', padding:'5px 12px', borderRadius:12, fontSize:11, fontWeight:'bold', zIndex:10}}>🔴 YOU ARE LIVE • {liveViewers} viewers</div>}

      {/* RIGHT BUTTONS - SASA ZINAFANYA KAZI - SIO PICHA TUH! */}
      <div style={{position:'absolute', right:8, bottom:110, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:30}}>
        <div onClick={()=> setTab('me')} style={{width:46, height:46, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900', cursor:'pointer'}}>M</div>
        
        <div onClick={doLike} style={{textAlign:'center', cursor:'pointer', userSelect:'none'}}>
          <div style={{width:46, height:46, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, transition:'0.2s', transform: liked?'scale(1.2)':'scale(1)'}}>{liked?'❤️':'🤍'}</div>
          <div style={{color: liked?'#ff3040':'white', fontSize:12, marginTop:4, fontWeight:'bold'}}>{likes}</div>
        </div>

        <div onClick={()=> {setShowComments(true); if(navigator.vibrate) navigator.vibrate(30)}} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:46, height:46, borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div>
          <div style={{color:'white', fontSize:12, marginTop:4}}>{comments.length}</div>
        </div>

        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:46, height:46, borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div>
          <div style={{color:'white', fontSize:10, marginTop:4}}>Share</div>
        </div>

        <div onClick={doSave} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:46, height:46, borderRadius:'50%', background: saved?'#ffcc00':'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>{saved?'🔖':'📑'}</div>
          <div style={{color: saved?'#ffcc00':'white', fontSize:10, marginTop:4}}>{saved?'Saved':'Save'}</div>
        </div>

        <div onClick={()=> alert(`Lyrics: ${current?.caption} ${current?.tags}`)} style={{textAlign:'center', cursor:'pointer'}}>
          <div style={{width:46, height:46, borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🎵</div>
          <div style={{color:'white', fontSize:10, marginTop:4}}>Lyrics</div>
        </div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:70, color:'white', zIndex:10, pointerEvents:'none'}}>
        <div style={{fontWeight:'bold', fontSize:12, pointerEvents:'auto'}}>{current?.isAd? `📢 AD • ${current.business}` : `${username} • ${idx+1}/${feed.length}`} {isLiveCam?'🔴 LIVE':''}</div>
        <div style={{fontSize:13, marginTop:4}}>{current?.caption}</div>
        <div style={{fontSize:13, color:'#ffcc00', fontWeight:'bold'}}>{current?.tags}</div>
      </div>

      <div style={{position:'absolute', bottom:64, left:0, right:0, padding:'0 10px', zIndex:20, display:'flex', gap:8, alignItems:'center'}}><span onClick={()=> setIdx(i=> (i-1+feed.length)%feed.length)} style={{color:'white', cursor:'pointer'}}>⏮️</span><input type="range" min={0} max={100} value={progress} onChange={e=>{ if(videoRef.current?.duration) videoRef.current.currentTime=(Number(e.target.value)/100)*videoRef.current.duration }} style={{flex:1, accentColor:'white', height:3}}/><span onClick={()=> setIdx(i=> (i+1)%feed.length)} style={{color:'white', cursor:'pointer'}}>⏭️</span></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:58, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}>
        <div onClick={()=> setTab('home')} style={{color: tab==='home'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:9}}>Home</div></div>
        <div style={{color:'#888', textAlign:'center'}}><div style={{fontSize:20}}>🔍</div><div style={{fontSize:9}}>Explore</div></div>
        <div onClick={()=> {setUploadMode('video'); setShowUpload(true)}} style={{cursor:'pointer'}}><div style={{width:42, height:26, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900'}}>+</div></div>
        <div style={{color:'#888', textAlign:'center'}}><div style={{fontSize:20}}>📥</div><div style={{fontSize:9}}>Inbox</div></div>
        <div onClick={()=> setTab('me')} style={{color:'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:20}}>👤</div><div style={{fontSize:9, fontWeight:'bold'}}>Biashara ({myVideos.length}/{myAds.length})</div></div>
      </div>

      {showComments && <div style={{position:'absolute', bottom:58, left:0, right:0, height:'50%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Comments ({comments.length})</b><span onClick={()=> setShowComments(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=><div key={i} style={{marginTop:8, background:'#1e1e1e', padding:'8px 12px', borderRadius:10, fontSize:13}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:10}}><input value={newC} onChange={e=> setNewC(e.target.value)} onKeyDown={e=> e.key==='Enter' && (()=>{ if(newC.trim()){ setComments([...comments, `${username}: ${newC}`]); setNewC('') } })()} placeholder="Add comment..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px 14px', borderRadius:20, color:'white'}}/><button onClick={()=> { if(newC.trim()){ setComments([...comments, `${username}: ${newC}`]); setNewC('') } }} style={{background:'#ff3040', color:'white', border:'none', padding:'0 18px', borderRadius:20, fontWeight:'bold'}}>Send</button></div></div>}

      {showShare && <div style={{position:'absolute', bottom:58, left:0, right:0, background:'#121212', borderRadius:'16px 16px 0 0', padding:16, zIndex:45, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share</b><span onClick={()=> setShowShare(false)} style={{fontSize:20}}>✕</span></div><button onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(location.href)}`,'_blank')} style={{marginTop:12, width:'100%', background:'#25D366', color:'white', border:'none', padding:'12px', borderRadius:10, fontWeight:'bold'}}>💬 WhatsApp Share</button><button onClick={()=> {navigator.clipboard.writeText(location.href); alert('Link copied!')}} style={{marginTop:8, width:'100%', background:'#333', color:'white', border:'none', padding:'12px', borderRadius:10}}>🔗 Copy Link</button></div>}

      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.98)', zIndex:200, padding:14, color:'white', overflowY:'auto'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD VIDEO + #tags - {myVideos.length} videos tayari!</b><span onClick={()=> setShowUpload(false)} style={{fontSize:24, cursor:'pointer'}}>✕</span></div><div style={{display:'flex', gap:8, marginTop:12}}><button onClick={()=> setUploadMode('video')} style={{flex:1, background: uploadMode==='video'?'white':'#222', color: uploadMode==='video'?'black':'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>Video</button><button onClick={()=> setUploadMode('ad')} style={{flex:1, background: uploadMode==='ad'?'#ffcc00':'#222', color: uploadMode==='ad'?'black':'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>AD + #tags</button><button onClick={goLive} style={{flex:1, background:'#ff3040', color:'white', border:'none', padding:'10px', borderRadius:8, fontWeight:'bold'}}>🔴 LIVE CAM</button></div><div style={{marginTop:12, background:'#111', padding:12, borderRadius:10}}><div style={{fontSize:12, color:'#ffcc00'}}>Caption</div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Kamata" style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white'}}/><div style={{fontSize:12, color:'#ffcc00', marginTop:12, fontWeight:'900', background:'#ffcc0033', padding:'6px', borderRadius:6}}>#TAGS - WEKA HAPA!</div><input value={tags} onChange={e=> setTags(e.target.value)} style={{width:'100%', marginTop:6, background:'#222', border:'3px solid #ffcc00', padding:'14px', borderRadius:8, color:'white', fontWeight:'bold'}}/>{uploadMode==='ad' && <><div style={{fontSize:12, marginTop:10}}>Biashara (AD)</div><input value={adBiz} onChange={e=> setAdBiz(e.target.value)} placeholder="Salon Faraja" style={{width:'100%', marginTop:6, background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white'}}/><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="https://wa.me/..." style={{width:'100%', marginTop:6, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:8, color:'white'}}/></>}</div><label style={{marginTop:14, display:'block', background: uploadMode==='ad'?'#ffcc00':'white', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', cursor:'pointer'}}>CHAGUA VIDEO NA #TAGS - UPLOAD<input type="file" accept="video/*" onChange={saveNew} style={{display:'none'}}/></label><button onClick={goLive} style={{marginTop:10, width:'100%', background:'#ff3040', color:'white', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>🔴 Au ANZA LIVE CAMERA - Kama picha yako ya 2 - Bonyeza Allow!</button></div>}

      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); if(videoRef.current) videoRef.current.muted=false}} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.75)', color:'white', padding:'12px 20px', borderRadius:20, zIndex:15, cursor:'pointer'}}><div>🔊</div><div style={{fontSize:11}}>Tap for sound</div></div>}
    </div>
  )
}
