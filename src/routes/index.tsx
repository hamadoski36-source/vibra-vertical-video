import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: VibraApp })

function VibraApp(){
 const vids = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4"
 ]
 return(
 <div style={{height:'100vh', background:'black', overflowY:'scroll', scrollSnapType:'y mandatory'}}>
  <div style={{position:'fixed', top:0, left:0, right:0, zIndex:10, display:'flex', justifyContent:'space-between', padding:'12px', color:'white', background:'linear-gradient(black, transparent)'}}>
   <span style={{fontWeight:'900', letterSpacing:2}}>VIBRA</span>
   <span>For You</span>
   <span>🔍</span>
  </div>
  {vids.map((url,i)=>(
   <div key={i} style={{height:'100vh', scrollSnapAlign:'start', position:'relative'}}>
    <video src={url} autoPlay muted loop playsInline controls={false}
     style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
    <div style={{position:'absolute', right:10, bottom:100, color:'white', textAlign:'center'}}>
     <div style={{width:48, height:48, background:'#7c3aed', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white'}}>M</div>
     <div style={{marginTop:15}}>❤️<br/>1.4K</div>
     <div style={{marginTop:10}}>💬<br/>25</div>
     <div style={{marginTop:10}}>🔖<br/>201</div>
    </div>
    <div style={{position:'absolute', left:10, bottom:20, color:'white'}}>
     <b>@MaRavel movie</b><br/>MONALISA#62
    </div>
   </div>
  ))}
  <div style={{position:'fixed', bottom:0, left:0, right:0, height:60, background:'black', color:'white', display:'flex', justifyContent:'space-around', alignItems:'center', borderTop:'1px solid #222'}}>
   <span>🏠</span><span>🔍</span>
   <span style={{background:'white', color:'black', width:50, height:32, borderRadius:8, display:'flex', justifyContent:'center', alignItems:'center', fontSize:24, fontWeight:'bold'}}>+</span>
   <span>📥</span><span>👤</span>
  </div>
 </div>
 )
}
