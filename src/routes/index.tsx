import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: Page })

function Page(){
  return(
    <div style={{height:'100vh', background:'#000', overflowY:'scroll', scrollSnapType:'y mandatory', margin:0}}>
      {/* HEADER */}
      <div style={{position:'fixed', top:0, width:'100%', zIndex:10, display:'flex', justifyContent:'space-between', padding:'12px', color:'white', background:'linear-gradient(black, transparent)'}}>
        <b>VIBRA</b><b style={{borderBottom:'2px solid white'}}>For You</b><span>🔍</span>
      </div>
      <div style={{position:'fixed', top:55, left:12, zIndex:10, background:'#ff2d55', color:'white', fontSize:12, padding:'2px 8px', borderRadius:4, fontWeight:700}}>LIVE</div>

      {/* VIDEO 1 - HII NDIO INAONDOA NYEUSI */}
      <div style={{height:'100vh', scrollSnapAlign:'start', position:'relative', background:'#111'}}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          crossOrigin="anonymous"
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0}}
          onError={(e)=>console.log('video error', e)}
        />
        {/* RIGHT BUTTONS */}
        <div style={{position:'absolute', right:10, bottom:120, color:'white', textAlign:'center'}}>
          <div style={{width:52, height:52, background:'#7c3aed', borderRadius:26, border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20}}>M</div>
          <div style={{marginTop:14}}>🤍<br/><small>1.4K</small></div>
          <div style={{marginTop:10}}>💬<br/><small>25</small></div>
          <div style={{marginTop:10}}>🔖<br/><small>201</small></div>
        </div>
        <div style={{position:'absolute', left:10, bottom:80, color:'white', fontSize:14}}>
          <b>@MaRavel movie MONALISA#62</b><br/>
          Epic scene — destiny awaits in the halls of Monalisa ... more<br/>
          ♫ original sound - MaRavel
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{position:'fixed', bottom:0, width:'100%', height:62, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', color:'white', borderTop:'1px solid #222'}}>
        <span>🏠<br/><small>Home</small></span>
        <span>🔍<br/><small>Discover</small></span>
        <span style={{background:'white', color:'black', padding:'6px 18px', borderRadius:10, fontWeight:900, fontSize:20}}>+</span>
        <span>📥<br/><small>Inbox</small></span>
        <span>👤<br/><small>Profile</small></span>
      </div>
    </div>
  )
}
