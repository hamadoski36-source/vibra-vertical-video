import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFixed,
})

function VibraFixed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if(videoRef.current){
      videoRef.current.play().catch(()=>{})
    }
  }, [])

  return (
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{width:'100%', height:'100%', objectFit:'cover'}}
        src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
      
      {/* UI JUU */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:12, display:'flex', justifyContent:'space-between', color:'white', fontWeight:700, background:'linear-gradient(to bottom, black, transparent)'}}>
        <span>VIBRA</span>
        <span style={{borderBottom:'2px solid white'}}>For You</span>
        <span>🔍</span>
      </div>

      <div style={{position:'absolute', top:55, left:12, background:'#ff2a55', color:'white', fontSize:12, padding:'2px 8px', borderRadius:4}}>LIVE</div>

      {/* RIGHT */}
      <div style={{position:'absolute', right:10, bottom:100, color:'white', textAlign:'center', display:'flex', flexDirection:'column', gap:12}}>
        <div style={{width:50, height:50, background:'#7d3aed', borderRadius:25, border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>M</div>
        <span>🤍<br/>1.4K</span>
        <span>💬<br/>25</span>
        <span>🔖<br/>201</span>
      </div>

      {/* CAPTION */}
      <div style={{position:'absolute', left:12, bottom:75, color:'white', fontSize:14, maxWidth:'70%'}}>
        <b>@MaRavel movie MONALISA#62</b><br/>Epic scene — destiny awaits in the halls of Monalisa ... more<br/>♫ original sound - MaRavel
      </div>

      {/* BOTTOM */}
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', color:'white'}}>
        <span>🏠 Home</span><span>🔍 Discover</span><span style={{background:'white', color:'black', padding:'5px 15px', borderRadius:10, fontWeight:900}}>+</span><span>📥 Inbox</span><span>👤 Profile</span>
      </div>
    </div>
  )
}
