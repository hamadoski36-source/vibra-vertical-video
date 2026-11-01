import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinalFix,
})

function VibraFinalFix() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [likes, setLikes] = useState(12000)
  const [liked, setLiked] = useState(false)
  const [myVideoUrl, setMyVideoUrl] = useState<string|null>(null)

  const handleLike = () => {
    if(!liked){ setLikes(l=>l+1); setLiked(true) } 
    else { setLikes(l=>l-1); setLiked(false) }
  }

  const handleUpload = (file:File) => {
    const url = URL.createObjectURL(file)
    setMyVideoUrl(url)
    setTab('home')
    alert("✅ Video ime-upload! Sasa utaona Share na Comment upande wa kulia juu!")
  }

  if(tab==='upload'){
    return (
      <div style={{background:'black',color:'white',minHeight:'100vh',padding:'50px 15px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span onClick={()=>setTab('home')}>← Cancel</span><b>Upload Video</b><span style={{color:'#facc15'}}>Done</span></div>
        <div style={{marginTop:'30px',border:'2px dashed #444',borderRadius:'15px',padding:'40px 20px',textAlign:'center'}}>
          <div style={{fontSize:'50px'}}>📁</div>
          <p style={{fontWeight:'bold'}}>Chagua Video Yako</p>
          <label style={{background:'white',color:'black',padding:'12px 25px',borderRadius:'25px',fontWeight:'bold',display:'inline-block',marginTop:'15px',cursor:'pointer'}}>
            📁 Choose File
            <input type="file" accept="video/*" hidden onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleUpload(f) }} />
          </label>
          <p style={{fontSize:'11px',opacity:0.6,marginTop:'15px'}}>Baada ya kuchagua, video itaonekana Home na Share, Comment zote</p>
        </div>
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'black',display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #222'}}>
          <span onClick={()=>setTab('home')}>🏠 Home</span><span>🧭 Explore</span><span style={{background:'white',color:'black',padding:'2px 12px',borderRadius:'8px'}}>+</span><span>📥 Inbox</span><span>👤 Me</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'black',color:'white',height:'100vh',width:'100vw',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',justifyContent:'space-between',padding:'10px 12px',background:'rgba(0,0,0,0.5)'}}>
        <span style={{background:'#ef4444',borderRadius:'20px',padding:'5px 10px',fontSize:'12px'}}>● LIVE</span>
        <span style={{color:'#facc15',fontWeight:'bold'}}>24 Coins</span>
      </div>

      <video 
        src={myVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
        poster={myVideoUrl ? undefined : "https://picsum.photos/id/1015/720/1280"}
        autoPlay loop muted playsInline
        style={{height:'100%',width:'100%',objectFit:'cover'}}
      />

      {/* RIGHT SIDE - SASA NIMEINUA JUU SANA - BOTTOM 200px HATA COMMENT HAIZIBI */}
      <div style={{position:'absolute',right:'12px',bottom:'220px',display:'flex',flexDirection:'column',gap:'14px',alignItems:'center',zIndex:50}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'45px',height:'45px',borderRadius:'50%',border:'2px solid #facc15',background:'#222',display:'flex',alignItems:'center',justifyContent:'center'}}>DP</div>
          <div style={{fontSize:'9px'}}>@MrVibra</div>
        </div>

        <div onClick={handleLike} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:'32px'}}>{liked?'❤️':'🤍'}</div>
          <div style={{fontSize:'11px',fontWeight:'bold'}}>{(likes/1000).toFixed(1)}K</div>
        </div>

        <div onClick={()=>setShowComments(true)} style={{textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:'28px'}}>💬</div>
          <div style={{fontSize:'11px'}}>345</div>
        </div>

        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'24px'}}>🔖</div>
          <div style={{fontSize:'9px'}}>Save</div>
        </div>

        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'22px'}}>🎵</div>
          <div style={{fontSize:'8px'}}>Lyrics</div>
        </div>

        {/* SHARE - SASA JUU SANA NA INANG'AA */}
        <div onClick={async()=>{ try{ await navigator.clipboard.writeText(window.location.href); alert("✅ Link copied!")}catch{ prompt("Copy:",window.location.href)}}} 
             style={{textAlign:'center',cursor:'pointer',background:'#facc15',borderRadius:'12px',padding:'8px 10px',border:'2px solid white'}}>
          <div style={{fontSize:'22px',color:'black'}}>↗️</div>
          <div style={{fontSize:'10px',fontWeight:'bold',color:'black'}}>Share</div>
        </div>
      </div>

      <div style={{position:'absolute',bottom:'70px',left:'12px',right:'80px'}}>
        <p style={{fontWeight:'bold',margin:0,fontSize:'14px'}}>{myVideoUrl ? "My Uploaded Video 💛 NEW!" : "VIBRA WORLDWIDE 🌍"}</p>
        <p style={{fontSize:'12px',margin:'4px 0'}}>{likes} likes • Tap video kucheza • Share inaonekana juu!</p>
      </div>

      {showComments && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'#111',borderRadius:'15px 15px 0 0',padding:'15px',maxHeight:'35vh'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
            <b>💬 Comments 345</b>
            <span onClick={()=>setShowComments(false)} style={{fontSize:'20px',cursor:'pointer'}}>✕</span>
          </div>
          <div style={{background:'#222',padding:'10px',borderRadius:'8px'}}><b>@CoastVibes:</b> Bro video kali sana! 🔥</div>
          <div style={{marginTop:'10px',display:'flex',gap:'8px'}}>
            <input placeholder="Andika comment..." style={{flex:1,background:'#222',border:'none',borderRadius:'20px',padding:'10px',color:'white'}}/>
            <button onClick={()=>setShowComments(false)} style={{background:'#facc15',border:'none',borderRadius:'20px',padding:'10px 15px',fontWeight:'bold'}}>Tuma</button>
          </div>
        </div>
      )}

      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:100,background:'black',display:'flex',justifyContent:'space-around',padding:'8px 0',borderTop:'1px solid #222'}}>
        <div onClick={()=>setTab('home')} style={{textAlign:'center'}}><div>🏠</div><div style={{fontSize:'9px'}}>Home</div></div>
        <div style={{textAlign:'center',opacity:0.5}}><div>🧭</div><div style={{fontSize:'9px'}}>Explore</div></div>
        <div onClick={()=>setTab('upload')} style={{textAlign:'center'}}><div style={{background:'white',color:'black',borderRadius:'8px',padding:'2px 14px'}}> + </div><div style={{fontSize:'9px'}}>Upload</div></div>
        <div style={{textAlign:'center',opacity:0.5}}><div>📥</div><div style={{fontSize:'9px'}}>Inbox</div></div>
        <div style={{textAlign:'center',opacity:0.5}}><div>👤</div><div style={{fontSize:'9px'}}>Me</div></div>
      </div>
    </div>
  )
}
