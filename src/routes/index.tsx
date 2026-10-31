import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
export const Route = createFileRoute('/')({ component: App })

function App(){
 const fileRef = useRef<HTMLInputElement>(null)
 const [page,setPage]=useState('home')
 const [vids,setVids]=useState([
  {id:1,url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',title:'MONALISA#61 - MaRavel movie',views:'454.3K'},
  {id:2,url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',title:'NDOA Ep 405',views:'712.1K'},
  {id:3,url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',title:'MONALISA#62',views:'16.6K'},
 ])
 const onUpload=(e:any)=>{
  const files=[...e.target.files]
  files.forEach((f:any)=>{
   const url=URL.createObjectURL(f)
   setVids(p=>[{id:Date.now()+Math.random(),url,title:f.name,views:'0'},...p])
  })
 }
 return(
 <div style={{width:'100vw',height:'100vh',background:'black',color:'white',position:'relative',overflow:'hidden'}}>
  <input ref={fileRef} type="file" accept="video/*" multiple style={{display:'none'}} onChange={onUpload}/>
  
  {/* HEADER */}
  <div style={{position:'absolute',top:0,left:0,right:0,zIndex:50,background:'black',padding:10}}>
   <div style={{display:'flex',justifyContent:'space-between',fontWeight:'bold'}}><span style={{border:'1px solid white',fontSize:10,padding:'2px 4px',borderRadius:4}}>LIVE</span><span>For You</span><span>🔍</span></div>
  </div>

  {page==='home'?(
   <div style={{position:'absolute',top:50,bottom:60,left:0,right:0,overflowY:'auto',scrollSnapType:'y mandatory'}}>
    {vids.map(v=>(
     <div key={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111'}}>
      <video src={v.url} autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} onClick={e=>{const vd=e.target as HTMLVideoElement; vd.muted=!vd.muted}} />
      <div style={{position:'absolute',right:10,bottom:80,display:'flex',flexDirection:'column',gap:15,textAlign:'center'}}>
       <div style={{width:45,height:45,borderRadius:'50%',background:'#a855f7',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid white',fontWeight:'bold'}} onClick={()=>setPage('profile')}>M</div>
       <div>❤️<br/><span style={{fontSize:10}}>1.4K</span></div>
       <div>💬<br/><span style={{fontSize:10}}>25</span></div>
       <div>🔖<br/><span style={{fontSize:10}}>201</span></div>
      </div>
      <div style={{position:'absolute',left:10,bottom:10,right:80}}>
       <b>@MaRavel movie</b><div style={{fontSize:13}}>{v.title}</div>
       <div style={{marginTop:5,fontSize:10,opacity:0.8}}>🔊 Gusa video kuwasha sauti</div>
      </div>
     </div>
    ))}
   </div>
  ):(
   <div style={{position:'absolute',top:0,bottom:60,left:0,right:0,background:'white',color:'black',overflowY:'auto'}}>
    <div style={{padding:10,display:'flex',justifyContent:'space-between'}}><span onClick={()=>setPage('home')} style={{fontSize:20}}>←</span><span>⋮</span></div>
    <div style={{textAlign:'center'}}><div style={{width:80,height:80,borderRadius:'50%',background:'#ddd',margin:'0 auto'}}></div><b>MaRavel movie†</b><div style={{fontSize:12,opacity:0.6}}>@makavelimoviestore</div></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,marginTop:15,background:'black'}}>
     {vids.map(v=>(
      <div key={v.id} style={{aspectRatio:'9/16',background:'black',position:'relative'}}>
       <video src={v.url} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
       <div style={{position:'absolute',bottom:2,left:2,fontSize:10,color:'white',background:'rgba(0,0,0,0.5)',padding:'1px 3px'}}>▶ {v.views}</div>
      </div>
     ))}
    </div>
    <button onClick={()=>fileRef.current?.click()} style={{margin:15,width:'calc(100% - 30px)',border:'2px dashed #ccc',padding:15,borderRadius:12,fontWeight:'bold'}}> + WEKA VIDEO YAKO YA MONALISA HAPA </button>
   </div>
  )}

  {/* NAV - + INAONEKANA SASA */}
  <div style={{position:'absolute',bottom:0,left:0,right:0,height:60,background:'black',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:100}}>
   <span onClick={()=>setPage('home')}>🏠<br/><span style={{fontSize:8}}>Home</span></span>
   <span>⊞<br/><span style={{fontSize:8}}>Explore</span></span>
   <div onClick={()=>fileRef.current?.click()} style={{width:60,height:36,background:'white',color:'black',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:'900'}}>+</div>
   <span>💬<br/><span style={{fontSize:8}}>Inbox</span></span>
   <span onClick={()=>setPage('profile')}>👤<br/><span style={{fontSize:8}}>Me</span></span>
  </div>
 </div>
 )
}
