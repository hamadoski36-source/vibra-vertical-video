import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(1400)
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)

  useEffect(()=>{ if(tab==='home') videoRef.current?.play().catch(()=>{}) }, [tab])

  if(tab==='explore'){
    return (
      <div style={{background:'black', minHeight:'100vh', color:'white'}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span style={{fontWeight:900, fontSize:20}}>VIBRA</span><span>🔍</span></div>
        <div style={{padding:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
          {[1,2,3,4,5,6].map(i=><div key={i} onClick={()=> setTab('home')} style={{height:200, background:'#222', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>Video {i} ▶️</div>)}
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }
  if(tab==='inbox'){
    return (
      <div style={{background:'black', minHeight:'100vh', color:'white'}}>
        <div style={{padding:16, fontWeight:'bold', fontSize:18, borderBottom:'1px solid #222'}}>Inbox</div>
        <div style={{padding:16}}><div>🔔 MaRavel liked your video</div><div style={{marginTop:12}}>💬 New comment on MONALISA#62</div><div style={{marginTop:12}}>👤 New follower: @directorTZ</div></div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }
  if(tab==='me'){
    return (
      <div style={{background:'black', minHeight:'100vh', color:'white', textAlign:'center'}}>
        <div style={{padding:40}}><div style={{width:80, height:80, borderRadius:'50%', background:'#7d3aed', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30}}>M</div><div style={{marginTop:12, fontWeight:'bold', fontSize:18}}>@MaRavel</div><div style={{fontSize:13, color:'#888'}}>1.2K followers • 15 videos</div><button onClick={()=> alert('Edit Profile')} style={{marginTop:12, background:'white', color:'black', border:'none', padding:'6px 20px', borderRadius:4}}>Edit Profile</button></div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden', fontFamily:'sans-serif'}}>
      <video ref={videoRef} autoPlay loop playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src="https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4" onClick={()=> setMuted(!muted)} />
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'12px 16px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)'}}><span style={{color:'white', fontWeight:900, fontSize:20}}>VIBRA</span><div style={{display:'flex', gap:14, color:'white'}}><span onClick={()=> alert('Following feed')}>Following</span><span style={{borderBottom:'2px solid white', fontWeight:'bold'}}>For You</span></div><span style={{color:'white'}}>🔍</span></div>
      <div style={{position:'absolute', top:55, left:12, background:'#ff0a54', color:'white', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10}}>LIVE</div>

      <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:18, alignItems:'center', zIndex:10}}>
        <div style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>M</div>
        <div onClick={()=> {setLiked(!liked); setLikes(liked ? 1400 : 1401)}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked ? '#ff3040' : 'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🤍</div><span style={{color:'white', fontSize:12, fontWeight:'bold'}}>{liked ? '1.4K ❤️' : '1.4K'}</span></div>
        <div onClick={()=> setShowComments(true)} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><span style={{color:'white', fontSize:12, fontWeight:'bold'}}>25</span></div>
        <div onClick={()=> {navigator.clipboard.writeText(window.location.href); alert('Link copied 🚀')}} style={{cursor:'pointer', textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div><span style={{color:'white', fontSize:11}}>Share</span></div>
        <div style={{width:48, height:48, borderRadius:'50%', background:'#ffcc00', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>⭐</div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:80, color:'white', zIndex:10}}><div style={{fontWeight:'bold', fontSize:14}}>@MaRavel movie MONALISA#62</div><div style={{fontSize:13, marginTop:4}}>Epic scene — destiny awaits... <b>more</b></div><div style={{fontSize:12, marginTop:6}}>♫ original sound - MaRavel</div></div>

      {showComments && (
        <div style={{position:'absolute', bottom:65, left:0, right:0, height:'45%', background:'#111', borderRadius:'16px 16px 0 0', padding:16, zIndex:30, color:'white'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}><b>25 Comments</b><span onClick={()=> setShowComments(false)} style={{cursor:'pointer'}}>✕</span></div>
          <div style={{marginTop:12, fontSize:14}}><div><b>@user1:</b> 🔥🔥🔥 Fire!</div><div style={{marginTop:8}}><b>@user2:</b> Monalisa is best movie</div><div style={{marginTop:8}}><b>@directorTZ:</b> Coming soon!</div></div>
          <input placeholder="Add comment..." style={{position:'absolute', bottom:12, left:12, right:12, background:'#222', border:'none', padding:10, borderRadius:20, color:'white'}}/>
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab}/>
      {muted && <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', bottom:100, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.3)', color:'white', border:'none', padding:'8px 16px', borderRadius:20, zIndex:15}}>🔊 Tap for sound</button>}
    </div>
  )
}

function BottomNav({tab, setTab}: any){
  return (
    <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}>
      <div onClick={()=> setTab('home')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='home' ? 'white' : '#888', cursor:'pointer'}}><span style={{fontSize:22}}>🏠</span><span style={{fontSize:10}}>Home</span></div>
      <div onClick={()=> setTab('explore')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='explore' ? 'white' : '#888', cursor:'pointer'}}><span style={{fontSize:22}}>🔍</span><span style={{fontSize:10}}>Explore</span></div>
      <div onClick={()=> {const el=document.createElement('input'); el.type='file'; el.accept='video/*'; el.click();}} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:'bold', color:'black'}}>+</div></div>
      <div onClick={()=> setTab('inbox')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='inbox' ? 'white' : '#888', cursor:'pointer'}}><span style={{fontSize:22}}>📥</span><span style={{fontSize:10}}>Inbox</span></div>
      <div onClick={()=> setTab('me')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: tab==='me' ? 'white' : '#888', cursor:'pointer'}}><span style={{fontSize:22}}>👤</span><span style={{fontSize:10}}>Me</span></div>
    </div>
  )
}
