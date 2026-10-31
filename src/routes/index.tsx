import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraPro })

const WORKING_VIDEO = 'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4'

function VibraPro(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [muted,setMuted]=useState(true)
  const [tab,setTab]=useState('home')
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [showComments,setShowComments]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [showLive,setShowLive]=useState(false)
  const [showSearch,setShowSearch]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [searchQuery,setSearchQuery]=useState('')
  const [caption,setCaption]=useState('Epic scene #vibra #viral #comedy')
  const [tags,setTags]=useState('#vibra #viral #kidoge #fyp')
  const [uploadedVideos,setUploadedVideos]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_videos')||'[]'))
  const [videoIndex,setVideoIndex]=useState(0)
  const [isAd,setIsAd]=useState(false)
  const [progress,setProgress]=useState(0)
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_username') || '@MaRavel')
  const [comments,setComments]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_comments')||'["@Monalisa: 🔥 Fire!","@MaRavel: Best!","@VibraFan: 😍 Love this"]'))
  const [newComment,setNewComment]=useState('')

  const allVideos = [WORKING_VIDEO, WORKING_VIDEO, WORKING_VIDEO, WORKING_VIDEO, WORKING_VIDEO, ...uploadedVideos]

  useEffect(()=>{
    const onVis = () => { if(document.hidden) videoRef.current?.pause(); else if(tab==='home') videoRef.current?.play().catch(()=>{}) }
    document.addEventListener('visibilitychange', onVis)
    return ()=> { document.removeEventListener('visibilitychange', onVis); videoRef.current?.pause() }
  }, [tab])
  useEffect(()=>{ if(tab!=='home') videoRef.current?.pause() }, [tab])

  const goNext = () => {
    const next = (videoIndex + 1) % allVideos.length
    setVideoIndex(next); setIsAd((next+1)%6===0); setProgress(0); setTimeout(()=> videoRef.current?.play().catch(()=>{}),100)
  }
  const goPrev = () => {
    const prev = (videoIndex - 1 + allVideos.length) % allVideos.length
    setVideoIndex(prev); setIsAd((prev+1)%6===0); setProgress(0); setTimeout(()=> videoRef.current?.play().catch(()=>{}),100)
  }

  useEffect(()=>{
    const v=videoRef.current; if(!v) return
    const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100)
    v.addEventListener('timeupdate', onTime)
    return ()=> v.removeEventListener('timeupdate', onTime)
  }, [videoIndex])

  const onSeek=(e:any)=>{
    const pct=Number(e.target.value); setProgress(pct)
    if(videoRef.current?.duration) videoRef.current.currentTime = (pct/100)*videoRef.current.duration
  }

  const handleFile=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const url=URL.createObjectURL(file)
    const newList=[url, ...uploadedVideos]
    setUploadedVideos(newList); localStorage.setItem('vibra_videos', JSON.stringify(newList))
    setShowUpload(false); setTab('me')
  }

  const sendComment=()=>{
    if(!newComment.trim()) return
    const c=`${username}: ${newComment}`
    const newList=[...comments, c]
    setComments(newList); localStorage.setItem('vibra_comments', JSON.stringify(newList)); setNewComment('')
  }

  if(showLive) return <div style={{background:'black', height:'100dvh', color:'white', position:'relative'}}><video autoPlay playsInline style={{width:'100%', height:'100%', objectFit:'cover'}} ref={(el)=>{ if(el && navigator.mediaDevices) navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(s=> el.srcObject=s).catch(()=>{}) }}/><div style={{position:'absolute', top:12, left:12, right:12, display:'flex', justifyContent:'space-between'}}><span onClick={()=> setShowLive(false)} style={{background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:20}}>✕ Close</span><span style={{background:'#ff0a54', padding:'4px 10px', borderRadius:4, fontSize:12, fontWeight:'bold'}}>🔴 LIVE • 3.2K</span></div><BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/></div>

  if(tab!=='home') return <div style={{background:'black', minHeight:'100dvh', color:'white', paddingBottom:70}}><div style={{padding:12, display:'flex', justifyContent:'space-between'}}><b>VIBRA</b><span onClick={()=> setShowSearch(true)}>🔍</span></div>{tab==='explore' && <div style={{padding:8, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:3}}>{allVideos.slice(0,9).map((v,i)=><div key={i} onClick={()=> {setVideoIndex(i); setTab('home'); setIsAd((i+1)%6===0)}} style={{height:160, background:'#222'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}</div>}{tab==='me' && <div><div style={{padding:30, textAlign:'center'}}><div style={{width:84, height:84, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div><div style={{marginTop:10, fontWeight:'bold', fontSize:18}}>{username}</div><div style={{color:'#aaa', fontSize:12}}>{allVideos.length} videos • Video {videoIndex+1}</div><div style={{marginTop:14, display:'flex', gap:8, justifyContent:'center'}}><button onClick={()=>{const n=prompt('Jina jipya:', username); if(n){const f=n.startsWith('@')?n:'@'+n.replace(/\s+/g,''); setUsername(f); localStorage.setItem('vibra_username',f)}}} style={{background:'white', color:'black', border:'none', padding:'7px 20px', borderRadius:4, fontWeight:'bold'}}>Edit @Mr Vibra</button><button onClick={()=> setShowUpload(true)} style={{background:'#222', color:'white', border:'none', padding:'7px 20px', borderRadius:4}}>Upload</button></div></div><div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2}}>{allVideos.map((v,i)=><div key={i} onClick={()=> {setVideoIndex(i); setTab('home'); setIsAd((i+1)%6===0)}} style={{height:140, background:'#111'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}</div></div>}<BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>{showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setVideoIndex={setVideoIndex} setTab={setTab} setIsAd={setIsAd}/>} {showUpload && <UploadModal caption={caption} setCaption={setCaption} tags={tags} setTags={setTags} handleFile={handleFile} setShowUpload={setShowUpload}/>}</div>

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}} 
      onTouchStart={(e)=> (e.currentTarget as any)._y = e.touches[0].clientY}
      onTouchEnd={(e)=>{ const dy = (e.currentTarget as any)._y - e.changedTouches[0].clientY; if(dy>60) goNext(); if(dy<-60) goPrev() }}>
      <video ref={videoRef} key={videoIndex} autoPlay loop={!isAd} playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src={allVideos[videoIndex]} onClick={()=> setMuted(!muted)} onError={()=> { if(videoRef.current) videoRef.current.src = WORKING_VIDEO }}/>
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><span style={{color:'white', fontWeight:900, fontSize:19}}>VIBRA</span><span style={{color:'white', fontSize:13, borderBottom:'2px solid white'}}>For You • {videoIndex+1}/{allVideos.length}</span><span onClick={()=> setShowSearch(true)} style={{color:'white'}}>🔍</span></div>
      {!isAd && <div onClick={()=> setShowLive(true)} style={{position:'absolute', top:52, left:12, background:'#ff0a54', color:'white', padding:'4px 10px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10}}>🔴 LIVE • 3.2K</div>}
      {isAd && <div style={{position:'absolute', top:52, left:12, right:12, background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:6, fontSize:12, fontWeight:'bold', zIndex:10, display:'flex', justifyContent:'space-between'}}><span>📢 Ad - Sponsored</span><span onClick={()=> {setIsAd(false); goNext()}} style={{background:'black', color:'white', padding:'2px 8px', borderRadius:10}}>Skip Ad ✕</span></div>}
      <div style={{position:'absolute', right:10, bottom:130, display:'flex', flexDirection:'column', gap:14, alignItems:'center', zIndex:10}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div>
        <div onClick={()=> setLiked(!liked)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>{liked?'❤️':'🤍'}</div><span style={{color:'white', fontSize:11}}>1.4K</span></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>💬</div><span style={{color:'white', fontSize:11}}>{comments.length}</span></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>↗️</div><span style={{color:'white', fontSize:10}}>Send</span></div>
        <div onClick={()=> setSaved(!saved)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>{saved?'⭐':'🔖'}</div><span style={{color:'white', fontSize:10}}>Save</span></div>
      </div>
      <div style={{position:'absolute', bottom:115, left:12, right:78, color:'white', zIndex:10}}>
        {isAd ? <div><div style={{fontWeight:'bold', fontSize:14, background:'#ffcc00', color:'black', display:'inline', padding:'2px 6px', borderRadius:4}}>Sponsored</div><div style={{marginTop:6, fontWeight:'bold'}}>Download App - Pata 5GB FREE! 🚀</div><button onClick={()=> window.open('https://wa.me/254700000000','_blank')} style={{marginTop:6, background:'#25D366', color:'white', border:'none', padding:'6px 14px', borderRadius:20}}>Install</button> <button onClick={goNext} style={{marginLeft:6, background:'white', color:'black', border:'none', padding:'6px 14px', borderRadius:20}}>Skip →</button></div>
        : <div><div style={{fontWeight:'bold', fontSize:14}}>{username} • MONALISA#62 • Video {videoIndex+1}</div><div style={{fontSize:13, marginTop:4}}>{caption} <b>{tags}</b></div></div>}
      </div>
      <div style={{position:'absolute', bottom:68, left:0, right:0, padding:'0 12px', zIndex:20, display:'flex', alignItems:'center', gap:8}}>
        <span onClick={goPrev} style={{color:'white', fontSize:18, cursor:'pointer'}}>⏮️</span>
        <input type="range" min={0} max={100} value={progress} onChange={onSeek} style={{flex:1, accentColor: isAd?'#ffcc00':'white', height:4}}/>
        <span onClick={goNext} style={{color:'white', fontSize:18, cursor:'pointer'}}>⏭️</span>
      </div>
      <div style={{position:'absolute', bottom:65, left:0, right:0, height:3, background:'#333', zIndex:19}}><div style={{height:'100%', background: isAd?'#ffcc00':'white', width:`${progress}%`}}/></div>

      {/* COMMENTS NA SEND BUTTON YA KWELI - KAMA TIKTOK */}
      {showComments && <div style={{position:'absolute', bottom:65, left:0, right:0, height:'50%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><b>{comments.length} Comments</b><span onClick={()=> setShowComments(false)} style={{fontSize:20, cursor:'pointer'}}>✕</span></div>
        <div style={{flex:1, overflowY:'auto', marginTop:12}}>{comments.map((c,i)=><div key={i} style={{marginTop:10, padding:'8px 10px', background:'#1e1e1e', borderRadius:8}}><span style={{color:'#aaa', fontSize:12}}>{c.split(':')[0]}:</span> <span style={{fontSize:13}}>{c.split(':').slice(1).join(':')}</span></div>)}</div>
        <div style={{display:'flex', gap:8, marginTop:10, paddingTop:8, borderTop:'1px solid #222'}}>
          <input value={newComment} onChange={e=> setNewComment(e.target.value)} onKeyDown={e=> {if(e.key==='Enter') sendComment()}} placeholder="Add comment as Mr Vibra..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px 14px', borderRadius:20, color:'white'}}/>
          <button onClick={sendComment} style={{background:'#ff3040', color:'white', border:'none', padding:'0 18px', borderRadius:20, fontWeight:'bold'}}>Send</button>
        </div>
      </div>}

      {/* SEND / SHARE MODAL YA KWELI */}
      {showShare && <div style={{position:'absolute', bottom:65, left:0, right:0, background:'#121212', borderRadius:'16px 16px 0 0', padding:16, zIndex:45, color:'white'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><b>Send to</b><span onClick={()=> setShowShare(false)}>✕</span></div>
        <div style={{display:'flex', gap:12, marginTop:14, overflowX:'auto'}}>
          <div onClick={()=> {window.open(`https://wa.me/?text=VIBRA Video ${videoIndex+1} ${location.href}`,'_blank'); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:52, height:52, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>💬</div><div style={{fontSize:11, marginTop:4}}>WhatsApp</div></div>
          <div onClick={()=> {navigator.clipboard.writeText(location.href); alert('Link copied!'); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:52, height:52, borderRadius:'50%', background:'#444', display:'flex', alignItems:'center', justifyContent:'center'}}>🔗</div><div style={{fontSize:11, marginTop:4}}>Copy</div></div>
          <div onClick={()=> {if(navigator.share) navigator.share({title:'VIBRA', url:location.href}); setShowShare(false)}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:52, height:52, borderRadius:'50%', background:'#7d3aed', display:'flex', alignItems:'center', justifyContent:'center'}}>↗️</div><div style={{fontSize:11, marginTop:4}}>More</div></div>
        </div>
        <button onClick={()=> {if(navigator.share) navigator.share({title:'VIBRA', url:location.href})}} style={{marginTop:16, width:'100%', background:'white', color:'black', border:'none', padding:'12px', borderRadius:10, fontWeight:'bold'}}>↗️ Send Video</button>
      </div>}

      {showUpload && <UploadModal caption={caption} setCaption={setCaption} tags={tags} setTags={setTags} handleFile={handleFile} setShowUpload={setShowUpload}/>}
      {showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setVideoIndex={setVideoIndex} setTab={setTab} setIsAd={setIsAd}/>}
      <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
      {muted && <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.6)', color:'white', border:'none', padding:'10px 18px', borderRadius:20, zIndex:15}}>🔊 Tap for sound</button>}
    </div>
  )
}
function UploadModal({caption,setCaption,tags,setTags,handleFile,setShowUpload}: any){
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:100, padding:20, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>📤 Upload</h3><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #ff3040', borderRadius:12, padding:30, textAlign:'center', background:'#111'}}><input type="file" accept="video/*" onChange={handleFile} style={{width:'100%', background:'#222', padding:10, borderRadius:8}}/></div><div style={{marginTop:20}}><div>Caption</div><textarea value={caption} onChange={(e)=> setCaption(e.target.value)} style={{width:'100%', background:'#222', border:'none', padding:10, borderRadius:8, color:'white', minHeight:60}}/></div><div style={{marginTop:14}}><div>#Tags</div><input value={tags} onChange={(e)=> setTags(e.target.value)} placeholder="#vibra #viral" style={{width:'100%', background:'#222', border:'1px solid #ffcc00', padding:10, borderRadius:8, color:'white'}}/></div><button onClick={()=> (document.querySelector('input[type=file]') as any)?.click()} style={{marginTop:20, width:'100%', background:'#ff3040', color:'white', border:'none', padding:14, borderRadius:8, fontWeight:'bold'}}>UPLOAD</button></div>
}
function SearchPage({searchQuery,setSearchQuery,setShowSearch,setVideoIndex,setTab,setIsAd}: any){
  return <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16, color:'white'}}><div style={{display:'flex', gap:8}}><input value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} autoFocus placeholder="Search..." style={{flex:1, background:'#222', border:'1px solid #ff0a54', padding:12, borderRadius:10, color:'white'}}/><span onClick={()=> setShowSearch(false)} style={{padding:10}}>✕</span></div><div style={{marginTop:16}}>{['Monalisa','MaRavel','Mbosso'].map((s,i)=><div key={i} style={{padding:12, background:'#111', borderRadius:8, marginTop:8, display:'flex', justifyContent:'space-between'}}><span>🔍 {s}</span><div style={{display:'flex', gap:6}}><button onClick={()=> {if(navigator.share) navigator.share({title:s, url:location.href})}} style={{background:'#25D366', color:'white', border:'none', padding:'6px 12px', borderRadius:20}}>↗️ Send</button><button onClick={()=> {setVideoIndex(i); setTab('home'); setIsAd(false); setShowSearch(false)}} style={{background:'#ff3040', color:'white', border:'none', padding:'6px 12px', borderRadius:20}}>Play</button></div></div>)}</div></div>
}
function BottomNav({tab,setTab,setShowUpload}: any){
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color: tab==='home'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>🏠</div><div style={{fontSize:10}}>Home</div></div><div onClick={()=> setTab('explore')} style={{color: tab==='explore'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>🔍</div><div style={{fontSize:10}}>Explore</div></div><div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'black'}}>+</div></div><div onClick={()=> setTab('inbox')} style={{color: tab==='inbox'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>📥</div><div style={{fontSize:10}}>Inbox</div></div><div onClick={()=> setTab('me')} style={{color: tab==='me'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>👤</div><div style={{fontSize:10}}>Me</div></div></div>
}
