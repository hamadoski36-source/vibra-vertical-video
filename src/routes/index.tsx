import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraPro })

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
  const [searchQuery,setSearchQuery]=useState('')
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('')
  const [uploadedVideos,setUploadedVideos]=useState<string[]>([])
  const [videoIndex,setVideoIndex]=useState(0)
  const [isAd,setIsAd]=useState(false)
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_username') || '@MaRavel')
  const [currentVideo,setCurrentVideo]=useState('https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4')
  const [comments,setComments]=useState(['@user1: 🔥 Fire!','@user2: Monalisa best'])
  const [newComment,setNewComment]=useState('')

  const allVideos = [currentVideo, ...uploadedVideos]
  
  const nextVideo = () => {
    const nextIdx = (videoIndex + 1) % (allVideos.length || 1)
    setVideoIndex(nextIdx)
    // KILA VIDEO YA 6 NI AD - KAMA TIKTOK!
    if((nextIdx + 1) % 6 === 0){
      setIsAd(true)
    } else {
      setIsAd(false)
      setCurrentVideo(allVideos[nextIdx] || allVideos[0])
    }
  }

  const handleFile=(e:any)=>{
    const file=e.target.files?.[0]
    if(!file) return
    const url=URL.createObjectURL(file)
    setCurrentVideo(url)
    setUploadedVideos([url, ...uploadedVideos])
    setShowUpload(false)
    setTab('home')
    setIsAd(false)
  }

  if(showLive){
    return (
      <div style={{background:'black', height:'100dvh', color:'white', position:'relative'}}>
        <video autoPlay playsInline muted style={{width:'100%', height:'100%', objectFit:'cover'}} ref={(el)=>{ if(el && navigator.mediaDevices){ navigator.mediaDevices.getUserMedia({video:true}).then(s=> el.srcObject=s).catch(()=>{}) }}}/>
        <div style={{position:'absolute', top:0, left:0, right:0, padding:12, display:'flex', justifyContent:'space-between'}}><span onClick={()=> setShowLive(false)} style={{background:'rgba(0,0,0,0.5)', padding:'6px 12px', borderRadius:20, cursor:'pointer'}}>✕ Close</span><span style={{background:'#ff0a54', padding:'4px 10px', borderRadius:4, fontSize:12, fontWeight:'bold'}}>🔴 LIVE • 3.2K</span></div>
        <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
      </div>
    )
  }

  if(tab!=='home'){
    return (
      <div style={{background:'black', minHeight:'100dvh', color:'white', paddingBottom:70}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between'}}><b>VIBRA</b><span onClick={()=> setShowSearch(true)}>🔍</span></div>
        {tab==='explore' && <div style={{padding:8, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:3}}>{allVideos.slice(0,9).map((v,i)=><div key={i} onClick={()=> {setCurrentVideo(v); setTab('home'); setIsAd((i+1)%6===0)}} style={{height:160, background:'#222', position:'relative'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/>{(i+1)%6===0 && <span style={{position:'absolute', top:4, left:4, background:'#ffcc00', color:'black', fontSize:8, padding:'2px 4px', borderRadius:3, fontWeight:'bold'}}>Ad</span>}</div>)}</div>}
        {tab==='me' && <div><div style={{padding:30, textAlign:'center'}}><div style={{width:84, height:84, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:'bold'}}>{username.charAt(1).toUpperCase()}</div><div style={{marginTop:10, fontWeight:'bold', fontSize:18}}>{username}</div><div style={{color:'#aaa', fontSize:12}}>{uploadedVideos.length+1} videos • Video {videoIndex+1}/{allVideos.length}</div><div style={{marginTop:14, display:'flex', gap:8, justifyContent:'center'}}><button onClick={()=>{const n=prompt('Andika jina jipya:', username); if(n){const f=n.startsWith('@')?n:'@'+n.replace(/\s+/g,''); setUsername(f); localStorage.setItem('vibra_username',f); alert('✅ Sasa wewe ni '+f)}}} style={{background:'white', color:'black', border:'none', padding:'7px 20px', borderRadius:4, fontWeight:'bold'}}>Edit @Mr Vibra</button><button onClick={()=> setShowUpload(true)} style={{background:'#222', color:'white', border:'none', padding:'7px 20px', borderRadius:4}}>Upload</button></div></div><div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2}}>{allVideos.map((v,i)=><div key={i} onClick={()=> {setCurrentVideo(v); setTab('home'); setVideoIndex(i); setIsAd((i+1)%6===0)}} style={{height:140, background:'#111', position:'relative'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/>{(i+1)%6===0 && <span style={{position:'absolute', top:4, left:4, background:'#ffcc00', color:'black', fontSize:9, fontWeight:'bold', padding:'2px 4px', borderRadius:3}}>Ad • Tap to skip</span>}</div>)}</div></div>}
        <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
        {showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setCurrentVideo={setCurrentVideo} setTab={setTab}/>}
        {showUpload && <UploadModal caption={caption} setCaption={setCaption} tags={tags} setTags={setTags} handleFile={handleFile} setShowUpload={setShowUpload}/>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}>
      <video ref={videoRef} autoPlay loop playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src={isAd ? 'https://videos.pexels.com/video-files/3191570/3191570-uhd_2560_1440_25fps.mp4' : currentVideo} onClick={()=> {if(isAd) window.open('https://wa.me/254700000000?text=Nataka Premium','_blank'); else setMuted(!muted)}} onEnded={nextVideo}/>
      
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><span style={{color:'white', fontWeight:900, fontSize:19}}>VIBRA</span><div style={{display:'flex', gap:16, color:'white', fontSize:14}}><span>Following</span><span style={{borderBottom:'2px solid white', fontWeight:'bold'}}>For You • {videoIndex+1}</span></div><span onClick={()=> setShowSearch(true)} style={{color:'white', cursor:'pointer'}}>🔍</span></div>
      
      {!isAd && <div onClick={()=> setShowLive(true)} style={{position:'absolute', top:52, left:12, background:'#ff0a54', color:'white', padding:'4px 10px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10, cursor:'pointer'}}>🔴 LIVE • 3.2K</div>}
      
      {isAd && <div style={{position:'absolute', top:52, left:12, right:12, background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:6, fontSize:12, fontWeight:'bold', zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span>📢 Sponsored • Ad {Math.floor(videoIndex/6)+1} - Scroll 5 videos to see next ad like TikTok</span><span onClick={()=> setIsAd(false)} style={{background:'black', color:'white', padding:'2px 8px', borderRadius:10, cursor:'pointer'}}>Skip Ad ✕</span></div>}

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:10}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}>{username.charAt(1).toUpperCase()}</div>
        <div onClick={()=> {setLiked(!liked)}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>{liked?'❤️':'🤍'}</div><span style={{color:'white', fontSize:11}}>1.4K</span></div>
        <div onClick={()=> setShowComments(true)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><span style={{color:'white', fontSize:11}}>{comments.length}</span></div>
        <div onClick={()=> {if(navigator.share) navigator.share({title:'VIBRA', url:location.href})}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div><span style={{color:'white', fontSize:10}}>Share</span></div>
        <div onClick={()=> setSaved(!saved)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: saved?'#ffcc00':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>{saved?'⭐':'🔖'}</div><span style={{color:'white', fontSize:10}}>{saved?'Saved':'Save'}</span></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:78, color:'white', zIndex:10}}>
        {isAd ? (
          <div><div style={{fontWeight:'bold', fontSize:14, background:'#ffcc00', color:'black', display:'inline', padding:'2px 6px', borderRadius:4}}>Sponsored Ad</div><div style={{fontSize:14, marginTop:6, fontWeight:'bold'}}>Download M-Pesa App - Pata 5GB FREE! 🚀</div><div style={{fontSize:12, marginTop:4}}><button onClick={()=> window.open('https://wa.me/254700000000','_blank')} style={{background:'#25D366', color:'white', border:'none', padding:'6px 14px', borderRadius:20, fontWeight:'bold'}}>WhatsApp - Install Now</button> <button onClick={nextVideo} style={{background:'white', color:'black', border:'none', padding:'6px 14px', borderRadius:20, marginLeft:6}}>Skip Ad → Next Video</button></div></div>
        ) : (
          <div><div style={{fontWeight:'bold', fontSize:14}}>{username} • MONALISA#62 • Video {videoIndex+1}</div><div style={{fontSize:13, marginTop:4}}>{caption || 'Epic scene'} <b>{tags || '#Monalisa #Mbosso'}</b></div><div style={{fontSize:12, marginTop:6}}>♫ original sound - MaRavel • Swipe up for next</div></div>
        )}
      </div>

      <div style={{position:'absolute', bottom:66, left:0, right:0, height:3, background:'#333'}}><div style={{height:'100%', background: isAd ? '#ffcc00' : 'white', width: `${((videoIndex+1)/allVideos.length)*100}%`, transition:'width 0.3s'}}/></div>

      {showComments && <div style={{position:'absolute', bottom:65, left:0, right:0, height:'48%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>{comments.length} Comments</b><span onClick={()=> setShowComments(false)}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=><div key={i} style={{marginTop:8}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:10}}><input value={newComment} onChange={e=> setNewComment(e.target.value)} placeholder="Add comment..." style={{flex:1, background:'#222', border:'none', padding:'10px 14px', borderRadius:20, color:'white'}}/><button onClick={()=> {if(newComment){setComments([...comments, `${username}: ${newComment}`]); setNewComment('')}}} style={{background:'#ff3040', color:'white', border:'none', padding:'0 16px', borderRadius:20}}>Post</button></div></div>}

      {showUpload && <UploadModal caption={caption} setCaption={setCaption} tags={tags} setTags={setTags} handleFile={handleFile} setShowUpload={setShowUpload}/>}
      {showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setCurrentVideo={setCurrentVideo} setTab={setTab}/>}
      <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
      <button onClick={nextVideo} style={{position:'absolute', bottom:110, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.2)', color:'white', border:'none', padding:'6px 14px', borderRadius:20, zIndex:15, fontSize:12}}>↑ Swipe for next {isAd ? '(Ad)' : `(${videoIndex+1}/${allVideos.length})`}</button>
    </div>
  )
}
function UploadModal({caption,setCaption,tags,setTags,handleFile,setShowUpload}: any){
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:100, padding:20, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>📤 Upload - VIBRA</h3><span onClick={()=> setShowUpload(false)} style={{fontSize:24}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #ff3040', borderRadius:12, padding:30, textAlign:'center', background:'#111'}}><input type="file" accept="video/*" onChange={handleFile} style={{marginTop:10, background:'#222', padding:10, borderRadius:8, width:'100%'}}/></div><div style={{marginTop:20}}><div style={{fontSize:13, fontWeight:'bold'}}>✍️ CAPTION</div><textarea value={caption} onChange={(e)=> setCaption(e.target.value)} placeholder="Epic scene..." style={{width:'100%', background:'#222', border:'none', padding:10, borderRadius:8, color:'white', minHeight:60}}/></div><div style={{marginTop:14}}><div style={{fontSize:13, fontWeight:'bold'}}>#️⃣ TAGS</div><input value={tags} onChange={(e)=> setTags(e.target.value)} placeholder="#Monalisa #Mbosso #Vibra" style={{width:'100%', background:'#222', border:'1px solid #ffcc00', padding:10, borderRadius:8, color:'white'}}/></div><button onClick={()=> (document.querySelector('input[type=file]') as any)?.click()} style={{marginTop:20, width:'100%', background:'#ff3040', color:'white', border:'none', padding:14, borderRadius:8, fontWeight:'bold'}}>🚀 UPLOAD</button></div>
}
function SearchPage({searchQuery,setSearchQuery,setShowSearch,setCurrentVideo,setTab}: any){
  return <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16, color:'white'}}><div style={{display:'flex', gap:8}}><input value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} autoFocus placeholder="Search..." style={{flex:1, background:'#222', border:'1px solid #ff0a54', padding:12, borderRadius:10, color:'white'}}/><span onClick={()=> setShowSearch(false)} style={{padding:10}}>✕</span></div><div style={{marginTop:16}}>{['Monalisa','MaRavel','Mbosso'].map((s,i)=><div key={i} style={{padding:12, background:'#111', borderRadius:8, marginTop:8, display:'flex', justifyContent:'space-between'}}><span>🔍 {s}</span><div style={{display:'flex', gap:6}}><button onClick={()=> {if(navigator.share) navigator.share({title:s, url:location.href})}} style={{background:'#25D366', color:'white', border:'none', padding:'6px 12px', borderRadius:20}}>↗️ Send</button><button onClick={()=> {setTab('home'); setShowSearch(false)}} style={{background:'#ff3040', color:'white', border:'none', padding:'6px 12px', borderRadius:20}}>Play</button></div></div>)}</div></div>
}
function BottomNav({tab,setTab,setShowUpload}: any){
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color: tab==='home'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>🏠</div><div style={{fontSize:10}}>Home</div></div><div onClick={()=> setTab('explore')} style={{color: tab==='explore'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>🔍</div><div style={{fontSize:10}}>Explore</div></div><div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'black'}}>+</div></div><div onClick={()=> setTab('inbox')} style={{color: tab==='inbox'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>📥</div><div style={{fontSize:10}}>Inbox</div></div><div onClick={()=> setTab('me')} style={{color: tab==='me'?'white':'#888', cursor:'pointer', textAlign:'center'}}><div style={{fontSize:22}}>👤</div><div style={{fontSize:10}}>Me</div></div></div>
}
