import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: Vibra })

function Vibra(){
  const videos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ]
  return (
    <div style={{background:'black', color:'white', height:'100dvh', width:'100vw', overflowY:'scroll', scrollSnapType:'y mandatory', position:'relative'}}>
      {/* HEADER VIBRA */}
      <div style={{position:'fixed', top:0, left:0, right:0, zIndex:20, display:'flex', justifyContent:'center', gap:30, padding:12, background:'linear-gradient(to bottom, black, transparent)', fontWeight:'bold'}}>
        <span style={{opacity:0.6}}>Following</span>
        <span style={{borderBottom:'2px solid white'}}>For You</span>
        <span style={{position:'absolute', left:10, fontFamily:'monospace', letterSpacing:2}}>VIBRA</span>
      </div>

      {videos.map((src,i)=>(
        <div key={i} style={{height:'100dvh', width:'100vw', scrollSnapAlign:'start', position:'relative'}}>
          <video 
            src={src} 
            autoPlay 
            muted 
            loop 
            playsInline 
            style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover'}}
          />
          {/* RIGHT BAR */}
          <div style={{position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:20, alignItems:'center'}}>
            <div style={{width:48, height:48, borderRadius:24, background:'#ff0050', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>M</div>
            <div style={{textAlign:'center'}}>❤️<br/>1.4K</div>
            <div style={{textAlign:'center'}}>💬<br/>25</div>
            <div style={{textAlign:'center'}}>🔖<br/>201</div>
            <div style={{textAlign:'center'}}>↗️<br/>Share</div>
          </div>
          {/* BOTTOM TEXT */}
          <div style={{position:'absolute', bottom:20, left:10, right:80}}>
            <b>@MaRavel movie</b><br/>
            MONALISA#61 - MaRavel movie {i+1}<br/>
            <span style={{fontSize:12}}>♫ original sound - MaRavel</span>
          </div>
        </div>
      ))}

      {/* BOTTOM NAV */}
      <div style={{position:'fixed', bottom:0, left:0, right:0, height:55, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', borderTop:'1px solid #222', zIndex:20}}>
        <span>🏠 Home</span>
        <span>🔍</span>
        <span style={{background:'white', color:'black', width:45, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:'900'}}>+</span>
        <span>📥 Inbox</span>
        <span>👤 Me</span>
      </div>
    </div>
  )
}
