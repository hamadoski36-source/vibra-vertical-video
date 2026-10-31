import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })

function VibraFinal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [muted,setMuted]=useState(true)
  const [liked,setLiked]=useState(false)
  const [saved,setSaved]=useState(false)
  const [likes,setLikes]=useState(1400)
  const [tab,setTab]=useState('home')
  const [showComments,setShowComments]=useState(false)
  const [comments,setComments]=useState(['@user1: 🔥🔥🔥 Fire!','@user2: Monalisa best movie','@directorTZ: Coming soon!'])
  const [newComment,setNewComment]=useState('')
  const [searchOpen,setSearchOpen]=useState(false)
  const [feed,setFeed]=useState('foryou')

  const addComment=()=>{
    if(!newComment.trim()) return
    setComments([...comments, `@MaRavel: ${newComment}`])
    setNewComment('')
  }

  if(tab!=='home'){
    return (
      <div style={{background:'black', minHeight:'100dvh', color:'white'}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222'}}><b>VIBRA</b><span onClick={()=> setSearchOpen(true)} style={{cursor:'pointer'}}>🔍</span></div>
        {tab==='explore' && <div style={{padding:12, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4}}>{Array.from({length:9}).map((_,i)=><div key={i} onClick={()=> setTab('home')} style={{height:160, background:'#222', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>Video {i+1}</div>)}</div>}
        {tab==='inbox' && <div style={{padding:16}}><h3>Inbox</h3><div>🔔 Liked your video • 2m ago</div><div style={{marginTop:10}}>💬 New comment • 5m ago</div><div style={{marginTop:10}}>👤 New follower • 1h ago</div></div>}
        {tab==='me' && <div style={{padding:30, textAlign:'center'}}><div style={{width:80, height:80, borderRadius:'50%', background:'#7d3aed', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30}}>M</div><div style={{marginTop:10, fontWeight:'bold'}}>@MaRavel</div><div style={{color:'#888', fontSize:13}}>1.2K followers • 15 videos • {saved ? '1 saved' : '0 saved'}</div><div style={{marginTop:16, display:'flex', gap:8, justifyContent:'center'}}><button style={{background:'white', color:'black', border:'none', padding:'6px 18px', borderRadius:4}}>Edit Profile</button><button onClick={()=> setTab('home')} style={{background:'#222', color:'white', border:'none', padding:'6px 18px', borderRadius:4}}>My Videos</button></div></div>}
        {searchOpen && <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16}}><div style={{display:'flex', gap:8}}><input autoFocus placeholder="Search videos, users..." style={{flex:1, background:'#222', border:'none', padding:10, borderRadius:8, color:'white'}}/><span onClick={()=> setSearchOpen(false)} style={{cursor:'pointer', padding:10}}>✕</span></div><div style={{marginTop:20, color:'#888'}}>Try: Monalisa, MaRavel, Epic scene</div></div>}
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}>
      <video ref={videoRef} autoPlay loop playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src="https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4" onClick={()=> setMuted(!muted)}/>

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}>
        <span style={{color:'white', fontWeight:900, fontSize:19}}>VIBRA</span>
        <div style={{display:'flex', gap:16, color:'white', fontSize:14}}><span onClick={()=> setFeed('following')} style={{opacity: feed==='following'?1:0.6, borderBottom: feed==='following'?'2px solid white':'none', cursor:'pointer'}}>Following</span><span onClick={()=> setFeed('foryou')} style={{opacity: feed==='foryou'?1:0.6, borderBottom: feed==='foryou'?'2px solid white':'none', fontWeight: feed==='foryou'?'bold':'normal', cursor:'pointer'}}>For You</span></div>
        <span onClick={()=> setSearchOpen(true)} style={{color:'white', fontSize:18, cursor:'pointer'}}>🔍</span>
      </div>

      <div onClick={()=> alert('🔴 LIVE • 3.2K watching\n@directorTZ is live now!\n\nJoin LIVE?')} style={{position:'absolute', top:52, left:12, background:'#ff0a54', color:'white', padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10, cursor:'pointer'}}>LIVE • 3.2K</div>

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:16, alignItems:'center', zIndex:10}}>
        <div onClick={()=> setTab('me')} style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}>M</div>
        <div onClick={()=> {setLiked(!liked); setLikes(liked?1400:1401)}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked ? '#ff3040' : 'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, transition:'0.2s'}}>{liked ? '❤️' : '🤍'}</div><span style={{color:'white', fontSize:11, fontWeight:'bold'}}>{likes>999? '1.4K':likes}</span></div>
        <div onClick={()=> setShowComments(true)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><span style={{color:'white', fontSize:11, fontWeight:'bold'}}>{comments.length}</span></div>
        <div onClick={()=> {if(navigator.share){navigator.share({title:'VIBRA', url: location.href})} else {navigator.clipboard.writeText(location.href); alert('🚀 Link copied!\nShare to WhatsApp, IG, TikTok!')}}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>↗️</div><span style={{color:'white', fontSize:10}}>Share</span></div>
        <div onClick={()=> setSaved(!saved)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: saved ? '#ffcc00' : 'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>{saved ? '⭐' : '🔖'}</div><span style={{color: saved ? '#ffcc00':'white', fontSize:10}}>{saved ? 'Saved' : 'Save'}</span></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:78, color:'white', zIndex:10}}>
        <div style={{fontWeight:'bold', fontSize:14}}>@MaRavel movie MONALISA#62</div>
        <div style={{fontSize:13, marginTop:4, lineHeight:'1.3'}}>Epic scene — destiny awaits in Monalisa... <span style={{fontWeight:'bold'}}>more</span></div>
        <div onClick={()=> alert('🎵 Lyrics:\nDestiny awaits in the halls...\nMonalisa, Monalisa...')} style={{fontSize:12, marginTop:6, display:'flex', gap:6, cursor:'pointer'}}><span>♫</span><marquee style={{width:180}}>original sound - MaRavel • lyrics: destiny awaits... • </marquee></div>
      </div>

      {showComments && (
        <div style={{position:'absolute', bottom:65, left:0, right:0, height:'48%', background:'#121212', borderRadius:'16px 16px 0 0', padding:14, zIndex:40, color:'white', display:'flex', flexDirection:'column'}}>
          <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222', paddingBottom:8}}><b>{comments.length} Comments</b><span onClick={()=> setShowComments(false)} style={{cursor:'pointer'}}>✕</span></div>
          <div style={{flex:1, overflowY:'auto', marginTop:10, fontSize:14}}>{comments.map((c,i)=><div key={i} style={{marginTop:8}}>{c}</div>)}</div>
          <div style={{display:'flex', gap:8, marginTop:10}}><input value={newComment} onChange={e=> setNewComment(e.target.value)} onKeyDown={e=> e.key==='Enter' && addComment()} placeholder="Add comment... ❤️😂😍" style={{flex:1, background:'#222', border:'none', padding:'10px 14px', borderRadius:20, color:'white'}}/><button onClick={addComment} style={{background:'#ff3040', color:'white', border:'none', padding:'0 16px', borderRadius:20, fontWeight:'bold'}}>Post</button></div>
          <div style={{marginTop:6, fontSize:12, color:'#888'}}>Comment itasave hapa moja kwa moja!</div>
        </div>
      )}

      {searchOpen && <div style={{position:'fixed', inset:0, background:'black', zIndex:100, padding:16}}><div style={{display:'flex', gap:8, alignItems:'center'}}><input autoFocus placeholder="Search VIBRA..." style={{flex:1, background:'#222', border:'none', padding:12, borderRadius:10, color:'white'}}/><span onClick={()=> setSearchOpen(false)} style={{cursor:'pointer', fontSize:20}}>✕</span></div><div style={{marginTop:20, color:'white'}}><div onClick={()=> {setSearchOpen(false); setTab('home')}} style={{padding:10, background:'#222', borderRadius:8, marginTop:8, cursor:'pointer'}}>🔍 Monalisa</div><div onClick={()=> {setSearchOpen(false); setTab('home')}} style={{padding:10, background:'#222', borderRadius:8, marginTop:8, cursor:'pointer'}}>🔍 MaRavel movie</div></div></div>}

      <BottomNav tab={tab} setTab={setTab}/>
      {muted && <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', bottom:110, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.3)', color:'white', border:'none', padding:'8px 16px', borderRadius:20, zIndex:15}}>🔊 Tap for sound</button>}
    </div>
  )
}
function BottomNav({tab, setTab}: any){
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}>
    <div onClick={()=> setTab('home')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='home'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>🏠</span><span style={{fontSize:10}}>Home</span></div>
    <div onClick={()=> setTab('explore')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='explore'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>🔍</span><span style={{fontSize:10}}>Explore</span></div>
    <div onClick={()=> {const el=document.createElement('input'); el.type='file'; el.accept='video/*'; el.click();}} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:'bold', color:'black'}}>+</div></div>
    <div onClick={()=> setTab('inbox')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='inbox'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>📥</span><span style={{fontSize:10}}>Inbox</span></div>
    <div onClick={()=> setTab('me')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='me'?'white':'#888', cursor:'pointer'}}><span style={{fontSize:22}}>👤</span><span style={{fontSize:10}}>Me</span></div>
  </div>
}
