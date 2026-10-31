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
  const [bookmarked, setBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    videoRef.current?.play().catch(()=>{})
  }, [])

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes-1 : likes+1)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100vh', overflow:'hidden', fontFamily:'sans-serif'}}>
      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay loop playsInline
        muted={muted}
        style={{width:'100%', height:'100%', objectFit:'cover'}}
        src="https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4"
        onClick={()=> setMuted(!muted)}
      />

      {/* TOP BAR */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex:10}}>
        <span style={{color:'white', fontWeight:900, fontSize:20, letterSpacing:1}}>VIBRA</span>
        <div style={{display:'flex', gap:16, color:'white', fontSize:15}}>
          <span>Following</span>
          <span style={{borderBottom:'2px solid white', fontWeight:'bold'}}>For You</span>
        </div>
        <span style={{color:'white', fontSize:18}}>🔍</span>
      </div>

      <div style={{position:'absolute', top:55, left:12, background:'#ff0a54', color:'white', padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:'bold', zIndex:10}}>LIVE</div>

      {/* RIGHT BAR - REAL BUTTONS */}
      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:20, alignItems:'center', zIndex:10}}>
        <div style={{width:48, height:48, borderRadius:'50%', background:'#7d3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>M</div>
        
        <div onClick={handleLike} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
          <div style={{width:48, height:48, borderRadius:'50%', background: liked ? '#ff3040' : 'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🤍</div>
          <span style={{color:'white', fontSize:12, marginTop:4, fontWeight:'bold'}}>{likes > 1000 ? (likes/1000).toFixed(1)+'K' : likes}</span>
        </div>

        <div onClick={()=> alert('Comments: 25 comments 💬')} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
          <div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>💬</div>
          <span style={{color:'white', fontSize:12, marginTop:4, fontWeight:'bold'}}>25</span>
        </div>

        <div onClick={()=> {navigator.clipboard.writeText(window.location.href); alert('Link copied! 🚀')}} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
          <div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div>
          <span style={{color:'white', fontSize:12, marginTop:4, fontWeight:'bold'}}>Share</span>
        </div>

        <div onClick={()=> setBookmarked(!bookmarked)} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
          <div style={{width:48, height:48, borderRadius:'50%', background: bookmarked ? '#ffcc00' : 'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>{bookmarked ? '⭐' : '🔖'}</div>
        </div>
      </div>

      {/* BOTTOM INFO */}
      <div style={{position:'absolute', bottom:75, left:12, right:80, color:'white', zIndex:10}}>
        <div style={{fontWeight:'bold', fontSize:14}}>@MaRavel movie MONALISA#62</div>
        <div style={{fontSize:13, marginTop:4, lineHeight:'1.3'}}>Epic scene — destiny awaits in the halls of Monalisa ... <span style={{fontWeight:'bold'}}>more</span></div>
        <div style={{fontSize:12, marginTop:6, display:'flex', alignItems:'center', gap:6}}>♫ original sound - MaRavel movie</div>
      </div>

      {/* BOTTOM NAV - HOME EXPLORE UPLOAD INBOX ME */}
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:20}}>
        <div onClick={()=> setActiveTab('home')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: activeTab==='home' ? 'white' : '#888', cursor:'pointer'}}>
          <span style={{fontSize:20}}>🏠</span><span style={{fontSize:10, marginTop:2}}>Home</span>
        </div>
        <div onClick={()=> setActiveTab('explore')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: activeTab==='explore' ? 'white' : '#888', cursor:'pointer'}}>
          <span style={{fontSize:20}}>🔍</span><span style={{fontSize:10, marginTop:2}}>Explore</span>
        </div>
        <div onClick={()=> alert('Upload video - Coming soon! 📤')} style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
          <div style={{width:44, height:28, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontSize:20, fontWeight:'bold'}}>+</div>
        </div>
        <div onClick={()=> setActiveTab('inbox')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: activeTab==='inbox' ? 'white' : '#888', cursor:'pointer'}}>
          <span style={{fontSize:20}}>📥</span><span style={{fontSize:10, marginTop:2}}>Inbox</span>
        </div>
        <div onClick={()=> setActiveTab('me')} style={{display:'flex', flexDirection:'column', alignItems:'center', color: activeTab==='me' ? 'white' : '#888', cursor:'pointer'}}>
          <span style={{fontSize:20}}>👤</span><span style={{fontSize:10, marginTop:2}}>Me</span>
        </div>
      </div>

      {/* SOUND BUTTON */}
      {muted && (
        <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', bottom:90, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(10px)', color:'white', border:'none', padding:'8px 18px', borderRadius:20, fontSize:13, zIndex:15}}>
          🔊 Tap for sound
        </button>
      )}
    </div>
  )
}
