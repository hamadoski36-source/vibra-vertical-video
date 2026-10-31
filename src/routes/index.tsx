import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
export const Route = createFileRoute('/')({ component: VibraPro })

function VibraPro(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [muted,setMuted]=useState(true)
  const [tab,setTab]=useState('home')
  const [feed,setFeed]=useState('foryou')
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
  const [currentVideo,setCurrentVideo]=useState('https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4')
  const [comments,setComments]=useState(['@user1: 🔥 Fire!','@user2: Monalisa best','@directorTZ: Coming soon!'])
  const [newComment,setNewComment]=useState('')

  const handleFile=(e:any)=>{
    const file=e.target.files?.[0]
    if(!file) return
    const url=URL.createObjectURL(file)
    setCurrentVideo(url)
    setUploadedVideos([url, ...uploadedVideos])
    setShowUpload(false)
    setTab('home')
    alert(`✅ Video uploaded!\n\nCaption: ${caption}\nTags: ${tags}\n\nItaonekana kwenye For You!`)
    setCaption(''); setTags('')
  }

  const filteredVideos = searchQuery ? uploadedVideos.filter(()=> searchQuery.toLowerCase().includes('mona') || searchQuery.toLowerCase().includes('mbo')) : uploadedVideos

  if(showLive){
    return (
      <div style={{background:'black', height:'100dvh', color:'white', position:'relative'}}>
        <video autoPlay playsInline muted style={{width:'100%', height:'100%', objectFit:'cover'}} ref={(el)=>{ if(el && navigator.mediaDevices){ navigator.mediaDevices.getUserMedia({video:true}).then(s=> el.srcObject=s).catch(()=>{}) }}}/>
        <div style={{position:'absolute', top:0, left:0, right:0, padding:12, display:'flex', justifyContent:'space-between', background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><span onClick={()=> setShowLive(false)} style={{background:'rgba(0,0,0,0.5)', padding:'6px 12px', borderRadius:20, cursor:'pointer'}}>✕ Close LIVE</span><span style={{background:'#ff0a54', padding:'4px 10px', borderRadius:4, fontSize:12, fontWeight:'bold'}}>🔴 LIVE • 3.2K</span></div>
        <div style={{position:'absolute', bottom:80, left:12, right:12}}><div style={{background:'rgba(0,0,0,0.5)', padding:8, borderRadius:8, fontSize:13}}>💬 @fan: Mbossooo! 🔥</div><div style={{background:'rgba(0,0,0,0.5)', padding:8, borderRadius:8, fontSize:13, marginTop:6}}>💬 @MaRavel: Karibu LIVE!</div></div>
        <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload} />
      </div>
    )
  }

  if(tab!=='home'){
    return (
      <div style={{background:'black', minHeight:'100dvh', color:'white', paddingBottom:70}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>VIBRA</b><span onClick={()=> setShowSearch(true)} style={{cursor:'pointer'}}>🔍</span></div>
        {tab==='explore' && <div><div style={{padding:12, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:3}}>{[currentVideo, ...uploadedVideos, ...Array(6).fill(currentVideo)].slice(0,9).map((v,i)=><div key={i} onClick={()=> {setCurrentVideo(v); setTab('home')}} style={{height:160, background:'#222', borderRadius:4, position:'relative', overflow:'hidden', cursor:'pointer'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/><span style={{position:'absolute', bottom:4, left:4, fontSize:10}}>▶️ 1.2K</span></div>)}</div></div>}
        {tab==='inbox' && <div style={{padding:16}}><h3>Inbox</h3><div style={{marginTop:12, padding:12, background:'#111', borderRadius:8}}><b>@Mbosso</b> liked your video • <button onClick={()=> setTab('home')} style={{background:'#ff3040', color:'white', border:'none', padding:'4px 10px', borderRadius:12, marginLeft:8}}>View</button></div><div style={{marginTop:8, padding:12, background:'#111', borderRadius:8}}>💬 New comment: "Monalisa 🔥" • <button onClick={()=> setShowComments(true)} style={{background:'#222', color:'white', border:'none', padding:'4px 10px', borderRadius:12}}>Reply</button></div></div>}
        {tab==='me' && <div><div style={{padding:30, textAlign:'center'}}><div style={{width:84, height:84, borderRadius:'50%', background:'linear-gradient(45deg,#7d3aed,#ff0a54)', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:'bold'}}>M</div><div style={{marginTop:10, fontWeight:'bold', fontSize:18}}>@MaRavel</div><div style={{color:'#aaa', fontSize:12, marginTop:4}}>@maravel.official • Mombasa</div><div style={{color:'#aaa', fontSize:13, marginTop:6}}>{uploadedVideos.length+1} videos • 1.2K followers • {saved?'1 saved':'0 saved'}</div><div style={{marginTop:14, display:'flex', gap:8, justifyContent:'center'}}><button onClick={()=>{const name=prompt('New username?','@MaRavel'); if(name) alert('Saved: '+name)}} style={{background:'white', color:'black', border:'none', padding:'7px 20px', borderRadius:4, fontWeight:'bold'}}>Edit Profile</button><button onClick={()=> setShowUpload(true)} style={{background:'#222', color:'white', border:'none', padding:'7px 20px', borderRadius:4}}>Add Video</button></div></div><div style={{display:'flex', borderTop:'1px solid #222', borderBottom:'1px solid #222'}}><div style={{flex:1, textAlign:'center', padding:10, borderBottom:'2px solid white'}}>🎬 Videos</div><div style={{flex:1, textAlign:'center', padding:10, color:'#888'}}>🔖 Saved</div><div style={{flex:1, textAlign:'center', padding:10, color:'#888'}}>❤️ Liked</div></div><div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, padding:2}}>{[currentVideo, ...uploadedVideos].map((v,i)=><div key={i} onClick={()=> {setCurrentVideo(v); setTab('home')}} style={{height:140, background:'#111', cursor:'pointer'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}</div></div>}
        <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
        {showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setCurrentVideo={setCurrentVideo} setTab={setTab} filteredVideos={filteredVideos}/>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}>
      <video ref={videoRef} autoPlay loop playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src={currentVideo} onClick={()=> setMuted(!muted)}/>
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><span style={{color:'white', fontWeight:900, fontSize:19}}>VIBRA</span><div style={{display:'flex', gap:16, color:'white', fontSize:14}}><span onClick={()=> setFeed('following')} style={{opacity: feed==='following'?1:0.6, borderBottom: feed==='following'?'2px solid white':'none', cursor:'pointer'}}>Following</span><span onClick={()=> setFeed('foryou')} style={{opacity: feed==='foryou'?1:0.6, borderBottom: feed==='foryou'?'2px solid white':'none', fontWeight: feed==='foryou'?'bold':'normal', cursor:'pointer'}}>For You</span></div><span onClick={()=> setShowSearch(true)} style={{color:'white', cursor:'pointer'}}>🔍</span></div>
      <div onClick={()=> setShowLive(true)} style={{position:'absolute', top:52, left:12, background:'#ff0a54', color:'white', padding:'4px 10px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10, cursor:'pointer', animation:'pulse 1s infinite'}}>🔴 LIVE • 3.2K - Tap to Join</div>
      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:10}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}>M</div>
        <div onClick={()=> {setLiked(!liked)}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked?'#ff3040':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>{liked?'❤️':'🤍'}</div><span style={{color:'white', fontSize:11, fontWeight:'bold'}}>1.4K</span></div>
        <div onClick={()=> setShowComments(true)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><span style={{color:'white', fontSize:11}}>{comments.length}</span></div>
        <div onClick={()=> {if(navigator.share){navigator.share({title:'VIBRA', text:caption, url:location.href})} else {navigator.clipboard.writeText(location.href); alert('Link copied!')}}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div><span style={{color:'white', fontSize:10}}>Share</span></div>
        <div onClick={()=> setSaved(!saved)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: saved?'#ffcc00':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center'}}>{saved?'⭐':'🔖'}</div><span style={{color:saved?'#ffcc00':'white', fontSize:10}}>{saved?'Saved':'Save'}</span></div>
      </div>
      <div style={{position:'absolute', bottom:85, left:12, right:78, color:'white', zIndex:10}}><div style={{fontWeight:'bold', fontSize:14}}>@MaRavel movie MONALISA#62</div><div style={{fontSize:13, marginTop:4}}>{caption || 'Epic scene — destiny awaits...'} <b>{tags || '#Monalisa #Mbosso #Vibra'}</b></div><div style={{fontSize:12, marginTop:6, display:'flex', gap:6}}><span>♫</span><span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:200}}>original sound - MaRavel • {tags}</span></div></div>

      {showComments && <div style={{position:'absolute', bottom:65, left:0, right:0, height:'48%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>{comments.length} Comments</b><span onClick={()=> setShowComments(false)} style={{cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10, fontSize:14}}>{comments.map((c,i)=><div key={i} style={{marginTop:8, display:'flex', justifyContent:'space-between'}}><span>{c}</span><span onClick={()=> {if(confirm('Delete?')) setComments(comments.filter((_,j)=>j!==i))}} style={{color:'#888', cursor:'pointer'}}>🗑️</span></div>)}</div><div style={{display:'flex', gap:8, marginTop:10}}><input value={newComment} onChange={e=> setNewComment(e.target.value)} onKeyDown={e=> e.key==='Enter' && (setComments([...comments, `@MaRavel: ${newComment}`]), setNewComment(''))} placeholder="Add comment..." style={{flex:1, background:'#222', border:'none', padding:'10px 14px', borderRadius:20, color:'white'}}/><button onClick={()=> {if(newComment.trim()){setComments([...comments, `@MaRavel: ${newComment}`]); setNewComment('')}}} style={{background:'#ff3040', color:'white', border:'none', padding:'0 16px', borderRadius:20, fontWeight:'bold'}}>Post</button></div></div>}

      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:100, padding:20, color:'white', overflowY:'auto'}}><div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><h3>Upload Video</h3><span onClick={()=> setShowUpload(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #444', borderRadius:12, padding:30, textAlign:'center'}}><div style={{fontSize:40}}>📤</div><div style={{marginTop:10}}>Chagua video kutoka simu</div><input type="file" accept="video/*" onChange={handleFile} style={{marginTop:16, color:'white'}}/></div><div style={{marginTop:20}}><div style={{fontSize:13, marginBottom:6}}>Caption (maelezo)</div><textarea value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Andika caption... Epic scene..." style={{width:'100%', background:'#222', border:'none', padding:10, borderRadius:8, color:'white', minHeight:60}}/></div><div style={{marginTop:14}}><div style={{fontSize:13, marginBottom:6}}># Tags (hashtags)</div><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#Monalisa #Mbosso #Vibra #Bongo" style={{width:'100%', background:'#222', border:'none', padding:10, borderRadius:8, color:'white'}}/><div style={{fontSize:11, color:'#888', marginTop:6}}>Andika kama: #Monalisa #Mbosso #Trending</div></div><button onClick={()=> (document.querySelector('input[type=file]') as any)?.click()} style={{marginTop:20, width:'100%', background:'#ff3040', color:'white', border:'none', padding:12, borderRadius:8, fontWeight:'bold', fontSize:16}}>📤 Upload to VIBRA</button><div style={{marginTop:10, fontSize:12, color:'#888', textAlign:'center'}}>Video yako itaonekana kwenye Home na Me mara moja!</div></div>}

      {showSearch && <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} setCurrentVideo={setCurrentVideo} setTab={setTab} filteredVideos={filteredVideos}/>}
      <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload}/>
      {muted && <button onClick={()=> {setMuted(false); (videoRef.current as any)?.play()}} style={{position:'absolute', bottom:110, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.3)', color:'white', border:'none', padding:'8px 16px', borderRadius:20, zIndex:15}}>🔊 Tap for sound</button>}
    </div>
  )
}
function SearchPage({searchQuery, setSearchQuery, setShowSearch, setCurrentVideo, setTab, filteredVideos}: any){
  return <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16, color:'white'}}>
    <div style={{display:'flex', gap:8}}><input value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} autoFocus placeholder="Search Mbosso, Monalisa..." style={{flex:1, background:'#222', border:'1px solid #ff0a54', padding:12, borderRadius:10, color:'white'}}/><span onClick={()=> setShowSearch(false)} style={{cursor:'pointer', padding:10}}>✕</span></div>
    <div style={{marginTop:16}}>{['Monalisa','MaRavel movie','Mbosso','Vibra Trending'].filter(s=> !searchQuery || s.toLowerCase().includes(searchQuery.toLowerCase())).map((s,i)=><div key={i} onClick={()=> {setCurrentVideo('https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4'); setShowSearch(false); setTab('home')}} style={{padding:12, background:'#111', borderRadius:8, marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}><span>🔍 {s}</span><span style={{display:'flex', gap:8}}><button onClick={(e)=>{e.stopPropagation(); if(navigator.share) navigator.share({title:s, url:location.href}); else {navigator.clipboard.writeText(location.href); alert('Link copied for '+s)}}} style={{background:'#222', color:'white', border:'none', padding:'6px 12px', borderRadius:20, fontSize:12}}>↗️ Send</button><button onClick={(e)=>{e.stopPropagation(); setCurrentVideo('https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4'); setShowSearch(false); setTab('home')}} style={{background:'#ff3040', color:'white', border:'none', padding:'6px 12px', borderRadius:20, fontSize:12}}>Play</button></span></div>)}
    {filteredVideos?.length>0 && <div style={{marginTop:20}}><b>Your uploads matching "{searchQuery}"</b><div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginTop:8}}>{filteredVideos.map((v:any,i:number)=><div key={i} onClick={()=> {setCurrentVideo(v); setShowSearch(false); setTab('home')}} style={{height:100, background:'#222'}}><video src={v} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}</div></div>}
    </div>
  </div>
}
function BottomNav({tab, setTab, setShowUpload}: any){
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}>
    <div onClick={()=> setTab('home')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='home'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>🏠</span><span style={{fontSize:10}}>Home</span></div>
    <div onClick={()=> setTab('explore')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='explore'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>🔍</span><span style={{fontSize:10}}>Explore</span></div>
    <div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:'bold', color:'black'}}>+</div></div>
    <div onClick={()=> setTab('inbox')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='inbox'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>📥</span><span style={{fontSize:10}}>Inbox</span></div>
    <div onClick={()=> setTab('me')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='me'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>👤</span><span style={{fontSize:10}}>Me</span></div>
  </div>
}
