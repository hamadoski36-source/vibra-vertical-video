import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(1400)

  useEffect(() => { videoRef.current?.play().catch(()=>{}) }, [])

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}>
      <video ref={videoRef} autoPlay loop playsInline muted={muted} style={{width:'100%', height:'100%', objectFit:'cover'}} src="https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4" onClick={()=> setMuted(!muted)} />

      <div style={{position:'absolute', top:0, left:0, right:0, padding:'12px 16px', display:'flex', justifyContent:'space-between', background:'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex:10}}>
        <span style={{color:'white', fontWeight:900, fontSize:20}}>VIBRA</span>
        <div style={{display:'flex', gap:16, color:'white'}}><span>Following</span><span style={{borderBottom:'2px solid white', fontWeight:'bold'}}>For You</span></div>
        <span style={{color:'white'}}>🔍</span>
      </div>

      <div style={{position:'absolute', top:55, left:12, background:'#ff0a54', color:'white', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10}}>LIVE</div>

      <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:18, alignItems:'center', zIndex:10}}>
        <div style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>M</div>
        <div onClick={()=> {setLiked(!liked); setLikes(liked ? 1400 : 1401)}} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background: liked ? '#ff3040' : 'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🤍</div><span style={{color:'white', fontSize:12, fontWeight:'bold'}}>{likes > 1000 ? '1.4K' : likes}</span></div>
        <div onClick={()=> alert('💬 25 Comments\n\n@user1: 🔥🔥🔥\n@user2: Monalisa is best!\n@user3: Where to watch?')} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div><span style={{color:'white', fontSize:12, fontWeight:'bold'}}>25</span></div>
        <div onClick={()=> {navigator.clipboard.writeText(window.location.href); alert('🚀 Link copied!')}} style={{textAlign:'center'}}><div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div><span style={{color:'white', fontSize:11}}>Share</span></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:80, color:'white', zIndex:10}}>
        <div style={{fontWeight:'bold', fontSize:14}}>@MaRavel movie MONALISA#62</div>
        <div style={{fontSize:13, marginTop:4}}>Epic scene — destiny awaits... <b>more</b></div>
      </div>

      {/* BOTTOM NAV - SASA IMEINULIWA JUU ILI UIONE */}
      <div style={{position:'absolute', bottom:10, left:0, right:0, height:65, background:'#000', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50, paddingBottom:5}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:'white'}}><span style={{fontSize:22}}>🏠</span><span style={{fontSize:10, marginTop:2}}>Home</span></div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:'#888'}}><span style={{fontSize:22}}>🔍</span><span style={{fontSize:10, marginTop:2}}>Explore</span></div>
        <div onClick={()=> alert('📤 Upload - Coming Soon!')}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:'bold'}}>+</div></div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:'#888'}}><span style={{fontSize:22}}>📥</span><span style={{fontSize:10, marginTop:2}}>Inbox</span></div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:'#888'}}><span style={{fontSize:22}}>👤</span><span style={{fontSize:10, marginTop:2}}>Me</span></div>
      </div>

      {muted && <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', bottom:100, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.3)', color:'white', border:'none', padding:'8px 16px', borderRadius:20, zIndex:15}}>🔊 Tap for sound</button>}
    </div>
  )
}
