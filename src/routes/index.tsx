import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: VibraFinal })

function VibraFinal(){
  // BADILISHA HIZI LINK 3 NA VIDEO ZAKO ZA MONALISA UKIUPLOAD
  const monalisaVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ]

  return (
    <div style={{height:'100dvh', background:'black', overflowY:'scroll', scrollSnapType:'y mandatory', fontFamily:'system-ui'}}>
      
      {/* TOP */}
      <div style={{position:'fixed', top:0, left:0, right:0, zIndex:20, color:'white', padding:'14px 12px', display:'flex', justifyContent:'space-between', background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <span style={{fontWeight:900, letterSpacing:2, fontSize:18}}>VIBRA</span>
        <span style={{fontWeight:700, fontSize:18, borderBottom:'2px solid white'}}>For You</span>
        <span style={{fontSize:18}}>🔍</span>
      </div>
      <div style={{position:'fixed', top:60, left:12, zIndex:20, background:'#ff2a4d', color:'white', padding:'2px 8px', borderRadius:4, fontSize:12, fontWeight:700}}>LIVE</div>

      {monalisaVideos.map((src, i)=>(
        <div key={i} style={{height:'100dvh', width:'100vw', scrollSnapAlign:'start', position:'relative', background:'black'}}>
          <video src={src} autoPlay muted loop playsInline preload="auto"
            style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover'}} 
          />
          
          {/* RIGHT */}
          <div style={{position:'absolute', right:10, bottom:110, color:'white', display:'flex', flexDirection:'column', alignItems:'center', gap:18}}>
            <div style={{width:52, height:52, borderRadius:26, background:'#7c3aed', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:22}}>M</div>
            <div style={{textAlign:'center', fontWeight:600}}>🤍<br/><span style={{fontSize:12}}>1.4K</span></div>
            <div style={{textAlign:'center', fontWeight:600}}>💬<br/><span style={{fontSize:12}}>25</span></div>
            <div style={{textAlign:'center', fontWeight:600}}>🔖<br/><span style={{fontSize:12}}>201</span></div>
            <div style={{textAlign:'center', fontWeight:600}}>↗️</div>
          </div>

          {/* CAPTION */}
          <div style={{position:'absolute', left:12, bottom:75, right:80, color:'white'}}>
            <div style={{fontWeight:700, fontSize:15}}>@MaRavel movie MONALISA#62</div>
            <div style={{fontSize:13, marginTop:4, opacity:0.9}}>Epic scene — destiny awaits in the halls of Monalisa ... more</div>
            <div style={{fontSize:13, marginTop:4}}>♫ original sound - MaRavel</div>
          </div>
        </div>
      ))}

      {/* BOTTOM NAV */}
      <div style={{position:'fixed', bottom:0, left:0, right:0, height:62, background:'black', borderTop:'1px solid #1f1f1f', display:'flex', justifyContent:'space-around', alignItems:'center', color:'white', zIndex:20}}>
        <span style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:11}}><span style={{fontSize:22}}>🏠</span>Home</span>
        <span style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:11, opacity:0.6}}><span style={{fontSize:22}}>🔍</span>Discover</span>
        <span style={{width:52, height:36, background:'white', color:'black', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900}}>+</span>
        <span style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:11, opacity:0.6}}><span style={{fontSize:22}}>📥</span>Inbox</span>
        <span style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:11, opacity:0.6}}><span style={{fontSize:22}}>👤</span>Profile</span>
      </div>
    </div>
  )
}
