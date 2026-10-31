import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })

const VIDEOS = [
  'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4',
  'https://videos.pexels.com/video-files/18069166/18069166-uhd_1440_1440_24fps.mp4',
  'https://videos.pexels.com/video-files/3191570/3191570-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3048527/3048527-uhd_2560_1440_30fps.mp4',
  'https://videos.pexels.com/video-files/18069002/18069002-uhd_1440_1440_24fps.mp4',
]

function VibraFinal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [muted,setMuted]=useState(true)
  const [tab,setTab]=useState('home')
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [showComments,setShowComments]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [showLive,setShowLive]=useState(false)
  const [showSearch,setShowSearch]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [progress,setProgress]=useState(0)
  const [caption,setCaption]=useState('Epic scene #vibra #viral')
  const [tags,setTags]=useState('#vibra #fyp #Monalisa')
  const [uploads,setUploads]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_v')||'[]'))
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_u')||'@MaRavel')
  const [comments,setComments]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_c')||'["@Monalisa: 🔥 Fire!","@VibraFan: Best video!","@MaRavel: Love this!"]'))
  const [newC,setNewC]=useState('')

  const all = [...VIDEOS, ...uploads]
  const isAd = (idx+1)%6===0
  const currentSrc = all[idx % all.length]

  // AUTOPLAY FIX
  useEffect(()=>{
    const v=videoRef.current; if(!v) return
    v.pause(); v.load()
    const play = () => { v.muted=true; setMuted(true); v.play().catch(()=>{}) }
    const onTime = () => setProgress((v.currentTime/(v.duration||1))*100)
    const onEnd = () => next()
    v.addEventListener('loadeddata', play, {once:true})
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('ended', onEnd)
    return ()=> { v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) }
  }, [idx, tab])

  // SAUTI IKATA UKITOKA APP
  useEffect(()=>{
    const onVis=()=> { if(document.hidden) videoRef.current?.pause(); else if(tab==='home') videoRef.current?.play().catch(()=>{}) }
    document.addEventListener('visibilitychange', onVis)
    return ()=> document.removeEventListener('visibilitychange', onVis)
  }, [tab])
  useEffect(()=>{ if(tab!=='home') videoRef.current?.pause() }, [tab])

  // SCROLL FIX - WHEEL + KEYS
  useEffect(()=>{
    const onWheel=(e:WheelEvent)=>{ if(Math.abs(e.deltaY)>20){ e.preventDefault(); e.deltaY>0?next():prev() } }
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='ArrowDown') next(); if(e.key==='ArrowUp') prev(); if(e.key===' ') { e.preventDefault(); videoRef.current?.paused?videoRef.current?.play():videoRef.current?.pause() } }
    window.addEventListener('wheel', onWheel, {passive:false})
    window.addEventListener('keydown', onKey)
    return ()=> { window.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey) }
  }, [idx])

  const next=()=>{ setIdx(i=> (i+1)%all.length); setLiked(false); setProgress(0) }
  const prev=()=>{ setIdx(i=> (i-1+all.length)%all.length); setProgress(0) }
  const onSeek=(e:any)=>{ const p=Number(e.target.value); setProgress(p); if(videoRef.current?.duration) videoRef.current.currentTime=(p/100)*videoRef.current.duration }

  const addComment=()=>{
    if(!newC.trim()) return
    const c=`${username}: ${newC}`; const nl=[...comments,c]
    setComments(nl); localStorage.setItem('vibra_c', JSON.stringify(nl)); setNewC('')
  }
  const handleFile=(e:any)=>{
    const f=e.target.files?.[0]; if(!f) return
    const url=URL.createObjectURL(f); const nl=[url, ...uploads]
    setUploads(nl); localStorage.setItem('vibra_v', JSON.stringify(nl)); setShowUpload(false); setTab('me'); setIdx(VIDEOS.length)
  }

  if(showLive) return <div style={{background:'black', height:'100dvh', color:'white', position:'relative'}}><video autoPlay playsInline muted style={{width:'100%', height:'100%', objectFit:'cover'}} ref={(el)=>{ if(el && navigator.mediaDevices) navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(s=> el.srcObject=s).catch(()=>{}) }}/><div style={{position:'absolute', top:12, left:12, right:12, display:'flex', justifyContent:'space-between'}}><span onClick={()=> setShowLive(false)} style={{background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:20}}>✕ Close</span><span style={{background:'#ff0a54', padding:'4px 10px', borderRadius:4, fontSize:12, fontWeight:'bold'}}>🔴 LIVE • 3.2K viewers</span></div><BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/></div>

  if(tab!=='home') return <div style={{background:'black', minHeight:'100dvh', color:'white', paddingBottom:70}}><div style={{padding:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}><b>VIBRA</b><span onClick={()=> setShowSearch(true)} style={{fontSize:20}}>🔍</span></div>{tab==='explore' && <div style={{padding:8, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:3}}>{all.map((v,i)=><div key={i} onClick={()=> {setIdx(i); setTab('home')}} style={{height:160, background:'#222', position:'relative', cursor:'pointer'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}} muted/>{(i+1)%6===0 && <span style={{position:'absolute', top:4, left:4, background:'#ffcc00', color:'black', fontSize:8, padding:'2px 4px', borderRadius:3, fontWeight:'bold'}}>Ad</span>}</div>)}</div>}{tab==='me' && <div><div style={{padding:24, textAlign:'center'}}><div style={{width:84, height:84, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div><div style={{marginTop:10, fontWeight:'bold', fontSize:18}}>{username}</div><div style={{color:'#aaa', fontSize:12}}>{all.length} videos • Watching {idx+1}</div><div style={{marginTop:12, display:'flex', gap:8, justifyContent:'center'}}><button onClick={()=>{const n=prompt('Jina jipya:', username); if(n){const f=n.startsWith('@')?n:'@'+n.replace(/\s+/g,''); setUsername(f); localStorage.setItem('vibra_u',f)}}} style={{background:'white', color:'black', border:'none', padding:'7px 18px', borderRadius:6, fontWeight:'bold'}}>Edit @Mr Vibra</button><button onClick={()=> setShowUpload(true)} style={{background:'#222', color:'white', border:'none', padding:'7px 18px', borderRadius:6}}>Upload</button></div></div><div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2}}>{all.map((v,i)=><div key={i} onClick={()=> {setIdx(i); setTab('home')}} style={{height:140, background:'#111', cursor:'pointer'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}} muted/></div>)}</div></div>}<BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>{showSearch && <Search setSearch={setShowSearch} setIdx={setIdx} setTab={setTab}/>} {showUpload && <Upload cap={caption} setCap={setCaption} tag={tags} setTag={setTags} file={handleFile} setUp={setShowUpload}/>}</div>

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden', touchAction:'pan-y'}}
      onTouchStart={e=> { (e.currentTarget as any)._y=e.touches[0].clientY }}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50){ dy>0?next():prev() } }}>
      
      <video ref={videoRef} autoPlay playsInline muted={muted} loop={!isAd} style={{width:'100%', height:'100%', objectFit:'cover', background:'black'}} src={currentSrc} onClick={()=> { if(muted){ setMuted(false); if(videoRef.current) videoRef.current.muted=false; videoRef.current?.play() } else setLiked(!liked) }}/>

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)'}}><b style={{color:'white', fontSize:19}}>VIBRA</b><span style={{color:'white', fontSize:13, borderBottom:'2px solid white', paddingBottom:2}}>For You • {idx+1}/{all.length} {isAd?'• Ad':''}</span><span onClick={()=> setShowSearch(true)} style={{color:'white', fontSize:18, cursor:'pointer'}}>🔍</span></div>

      {!isAd && <div onClick={()=> setShowLive(true)} style={{position:'absolute', top:50, left:12, background:'#ff0a54', color:'white', padding:'4px 10px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10, cursor:'pointer'}}>🔴 LIVE • 3.2K</div>}
      {isAd && <div style={{position:'absolute', top:50, left:12, right:12, background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:'bold', zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span>📢 Ad - Sponsored • Every 6th video like TikTok</span><span onClick={()=> next()} style={{background:'black', color:'white', padding:'4px 10px', borderRadius:12, cursor:'pointer'}}>Skip Ad ✕</span></div>}

      <div style={{position:'absolute', right:10, bottom:125, display:'flex', flexDirection:'column', gap:14, alignItems:'center', zIndex:10}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}>{username.charAt(1).toUpperCase()}</div>
        <div onClick={()=> setLiked(!liked)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>{liked?'❤️':'🤍'}</div><span style={{color:'white', fontSize:11}}>{liked?'1.5K':'1.4K'}</span></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>💬</div><span style={{color:'white', fontSize:11}}>{comments.length}</span></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div><span style={{color:'white', fontSize:10}}>Send</span></div>
        <div onClick={()=> setSaved(!saved)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background: saved?'#ffcc00':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>{saved?'⭐':'🔖'}</div><span style={{color:'white', fontSize:10}}>Save</span></div>
      </div>

      <div style={{position:'absolute', bottom:115, left:12, right:78, color:'white', zIndex:10}}>
        {isAd ? <div><span style={{background:'#ffcc00', color:'black', padding:'2px 6px', borderRadius:4, fontWeight:'bold', fontSize:12}}>Sponsored</span><div style={{marginTop:6, fontWeight:'bold', fontSize:14}}>Download App - Pata 5GB FREE! 🚀</div><div style={{marginTop:6, display:'flex', gap:6}}><button onClick={()=> window.open('https://wa.me/254700000000','_blank')} style={{background:'#25D366', color:'white', border:'none', padding:'6px 14px', borderRadius:20, fontWeight:'bold'}}>Install</button><button onClick={next} style={{background:'white', color:'black', border:'none', padding:'6px 14px', borderRadius:20}}>Skip →</button></div></div>
        : <div><div style={{fontWeight:'bold', fontSize:14}}>{username} • Video {idx+1}</div><div style={{fontSize:13, marginTop:4}}>{caption} <b>{tags}</b></div><div style={{fontSize:11, marginTop:6, opacity:0.8}}>♫ original sound - {username} • Swipe up/down</div></div>}
      </div>

      <div style={{position:'absolute', bottom:68, left:0, right:0, padding:'0 10px', zIndex:20, display:'flex', alignItems:'center', gap:8, background:'rgba(0,0,0,0.3)'}}>
        <span onClick={prev} style={{color:'white', fontSize:20, cursor:'pointer', padding:'4px'}}>⏮️</span>
        <input type="range" min={0} max={100} value={progress} onChange={onSeek} style={{flex:1, accentColor: isAd?'#ffcc00':'white', height:4, cursor:'pointer'}}/>
        <span onClick={next} style={{color:'white', fontSize:20, cursor:'pointer', padding:'4px'}}>⏭️</span>
      </div>

      {showComments && <div style={{position:'absolute', bottom:65, left:0, right:0, height:'52%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><b>{comments.length} Comments • Real-time</b><span onClick={()=> setShowComments(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div>
        <div style={{flex:1, overflowY:'auto', marginTop:12}}>{comments.map((c,i)=><div key={i} style={{marginTop:8, background:'#1e1e1e', padding:'8px 12px', borderRadius:10}}><span style={{color:'#888', fontSize:11}}>{c.split(':')[0]}</span><div style={{fontSize:13, marginTop:2}}>{c.split(':').slice(1).join(':')}</div></div>)}</div>
        <div style={{display:'flex', gap:8, marginTop:10, borderTop:'1px solid #222', paddingTop:10}}>
          <input value={newC} onChange={e=> setNewC(e.target.value)} onKeyDown={e=> e.key==='Enter' && addComment()} placeholder={`Comment as ${username}...`} style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px 14px', borderRadius:20, color:'white'}}/>
          <button onClick={addComment} style={{background:'#ff3040', color:'white', border:'none', padding:'0 20px', borderRadius:20, fontWeight:'bold'}}>Send</button>
        </div>
      </div>}

      {showShare && <div style={{position:'absolute', bottom:65, left:0, right:0, background:'#121212', borderRadius:'16px 16px 0 0', padding:16, zIndex:45, color:'white'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><b>Send to</b><span onClick={()=> setShowShare(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div>
        <div style={{display:'flex', gap:16, marginTop:14}}>
          <div onClick={()=> {window.open(`https://wa.me/?text=${encodeURIComponent(`VIBRA Video ${idx+1} - ${location.href}`)}`,'_blank'); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:54, height:54, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>💬</div><div style={{fontSize:11, marginTop:4}}>WhatsApp</div></div>
          <div onClick={()=> {navigator.clipboard.writeText(location.href); alert('Link copied!'); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:54, height:54, borderRadius:'50%', background:'#333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🔗</div><div style={{fontSize:11, marginTop:4}}>Copy Link</div></div>
          <div onClick={()=> {if(navigator.share) navigator.share({title:'VIBRA', text:caption, url:location.href}); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:54, height:54, borderRadius:'50%', background:'#7d3aed', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div><div style={{fontSize:11, marginTop:4}}>More</div></div>
        </div>
        <button onClick={()=> {if(navigator.share) navigator.share({title:'VIBRA', url:location.href}); else {navigator.clipboard.writeText(location.href); alert('Link copied!')}}} style={{marginTop:16, width:'100%', background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'bold'}}>↗️ Send Video to Friends</button>
      </div>}

      {showUpload && <Upload cap={caption} setCap={setCaption} tag={tags} setTag={setTags} file={handleFile} setUp={setShowUpload}/>}
      {showSearch && <Search setSearch={setShowSearch} setIdx={setIdx} setTab={setTab}/>}
      <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
      {muted && <div onClick={()=> {setMuted(false); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play().catch(()=>{}) }}} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.65)', color:'white', padding:'12px 20px', borderRadius:24, zIndex:15, fontSize:14, cursor:'pointer'}}>🔊 Tap for sound • Swipe up/down</div>}
    </div>
  )
}
function Upload({cap,setCap,tag,setTag,file,setUp}: any){
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:100, padding:20, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>📤 Upload to VIBRA</h3><span onClick={()=> setUp(false)} style={{fontSize:26, cursor:'pointer'}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #ff3040', borderRadius:12, padding:30, textAlign:'center', background:'#111'}}><div>📹 Chagua video yako</div><input type="file" accept="video/*" onChange={file} style={{marginTop:12, width:'100%', background:'#222', padding:12, borderRadius:8}}/></div><div style={{marginTop:20}}><div style={{fontWeight:'bold', fontSize:13}}>Caption</div><textarea value={cap} onChange={e=> setCap(e.target.value)} style={{width:'100%', background:'#222', border:'none', padding:10, borderRadius:8, color:'white', minHeight:60}}/></div><div style={{marginTop:14}}><div style={{fontWeight:'bold', fontSize:13}}>#Tags</div><input value={tag} onChange={e=> setTag(e.target.value)} style={{width:'100%', background:'#222', border:'1px solid #ffcc00', padding:10, borderRadius:8, color:'white'}}/></div></div>
}
function Search({setSearch,setIdx,setTab}: any){
  return <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16, color:'white'}}><div style={{display:'flex', gap:8}}><input autoFocus placeholder="Search Monalisa, Mbosso..." style={{flex:1, background:'#222', border:'1px solid #ff0a54', padding:12, borderRadius:10, color:'white'}}/><span onClick={()=> setSearch(false)} style={{padding:10, cursor:'pointer'}}>✕</span></div><div style={{marginTop:16}}>{['Monalisa','MaRavel','Mbosso'].map((s,i)=><div key={i} style={{padding:12, background:'#111', borderRadius:8, marginTop:8, display:'flex', justifyContent:'space-between'}}><span>🔍 {s}</span><button onClick={()=> {setIdx(i); setTab('home'); setSearch(false)}} style={{background:'#ff3040', color:'white', border:'none', padding:'6px 14px', borderRadius:20}}>Play</button></div>)}</div></div>
}
function BottomNav({tab,setTab,setShowUpload}: any){
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color: tab==='home'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>🏠</div><div style={{fontSize:10}}>Home</div></div><div onClick={()=> setTab('explore')} style={{color: tab==='explore'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>🔍</div><div style={{fontSize:10}}>Explore</div></div><div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'black'}}>+</div></div><div onClick={()=> setTab('inbox')} style={{color: tab==='inbox'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>📥</div><div style={{fontSize:10}}>Inbox</div></div><div onClick={()=> setTab('me')} style={{color: tab==='me'?'white':'#888', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>👤</div><div style={{fontSize:10}}>Me</div></div></div>
}
