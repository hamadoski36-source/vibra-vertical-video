import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if(videoRef.current){
      videoRef.current.play().catch(()=>{})
    }
  }, [])

  return (
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden', width:'100vw', height:'100vh'}}>
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        style={{width:'100%', height:'100%', objectFit:'cover'}}
        src="https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4"
        onClick={()=> setMuted(false)}
      />

      {/* UI TOP */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 12px', display:'flex', justifyContent:'space-between', color:'white', fontWeight:'bold'}}>
        <span>VIBRA</span>
        <span style={{borderBottom:'2px solid white'}}>For You</span>
        <span>🔍</span>
      </div>

      <div style={{position:'absolute', top:55, left:12, background:'#ff0a54', color:'white', padding:'2px 8px', borderRadius:4, fontSize:12, fontWeight:'bold'}}>LIVE</div>

      {/* RIGHT BUTTONS */}
      <div style={{position:'absolute', right:10, bottom:100, color:'white', display:'flex', flexDirection:'column', gap:18, alignItems:'center'}}>
        <div style={{width:50, height:50, background:'#7d3aed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>M</div>
        <span>🤍<br/>1.4K</span>
        <span>💬<br/>25</span>
        <span>🚀<br/>201</span>
      </div>

      {/* BOTTOM */}
      <div style={{position:'absolute', bottom:20, left:12, right:80, color:'white'}}>
        <div style={{fontWeight:'bold'}}>@MaRavel movie MONALISA#62</div>
        <div style={{fontSize:13, marginTop:4}}>Epic scene — destiny awaits in the halls of Monalisa ... more</div>
        <div style={{fontSize:12, marginTop:4}}>♫ original sound - MaRavel</div>
      </div>

      {/* SOUND BUTTON */}
      {muted && (
        <button onClick={()=> {setMuted(false); videoRef.current?.play()}} style={{position:'absolute', bottom:90, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(10px)', color:'white', border:'none', padding:'8px 16px', borderRadius:20, fontSize:13}}>
          🔊 Tap for sound
        </button>
      )}
    </div>
  )
}
