import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/')({
  component: VibraReal,
})

function VibraReal() {
  const [isLive, setIsLive] = useState(false)
  const [dp, setDp] = useState("https://via.placeholder.com/150")
  const [coins, setCoins] = useState(0)
  const [videos, setVideos] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  // Load DP & Coins & Videos
  useEffect(() => {
    const savedDp = localStorage.getItem("vibra_dp")
    if (savedDp) setDp(savedDp)
    const savedCoins = localStorage.getItem("vibra_coins")
    if (savedCoins) setCoins(parseInt(savedCoins))

    // Jaribu kuchukua video kutoka Supabase
    const loadVideos = async () => {
      try {
        const { data } = await supabase.from('videos').select('*').limit(8)
        if (data && data.length > 0) {
          setVideos(data)
        } else {
          // Kama hakuna, weka demo 8
          setVideos([
            { id:1, url:"https://www.w3schools.com/html/mov_bbb.mp4", title:"Mombasa Vibes 1" },
            { id:2, url:"https://www.w3schools.com/html/movie.mp4", title:"Vibra Dance 2" },
            { id:3, url:"https://www.w3schools.com/html/mov_bbb.mp4", title:"Coast Life 3" },
            { id:4, url:"https://www.w3schools.com/html/movie.mp4", title:"Swahili 4" },
            { id:5, url:"https://www.w3schools.com/html/mov_bbb.mp4", title:"Beach 5" },
            { id:6, url:"https://www.w3schools.com/html/movie.mp4", title:"Vibra 6" },
            { id:7, url:"https://www.w3schools.com/html/mov_bbb.mp4", title:"Mombasa 7" },
            { id:8, url:"https://www.w3schools.com/html/movie.mp4", title:"Worldwide 8" },
          ])
        }
      } catch {
        // fallback demo
        setVideos([
          { id:1, url:"https://www.w3schools.com/html/mov_bbb.mp4", title:"Video 1" },
          { id:2, url:"https://www.w3schools.com/html/movie.mp4", title:"Video 2" },
        ])
      }
    }
    loadVideos()
  }, [])

  const handleShare = async (title: string) => {
    const text = `VIBRA WORLDWIDE 🌍 ${title} - ${window.location.href}`
    await navigator.clipboard.writeText(text)
    alert("✅ Link copied! Tuma WhatsApp!")
  }

  const handleDp = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: any) => {
      setDp(ev.target.result)
      localStorage.setItem("vibra_dp", ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const claimCoins = () => {
    const n = coins + 8
    setCoins(n)
    localStorage.setItem("vibra_coins", n.toString())
    alert("🎉 +8 Coins!")
  }

  return (
    <div style={{background:'black', color:'white', height:'100vh', overflow:'hidden', position:'relative'}}>
      {/* TOP */}
      <div style={{position:'fixed', top:0, width:'100%', display:'flex', justifyContent:'space-between', padding:'12px', background:'rgba(0,0,0,0.7)', zIndex:100}}>
        <button onClick={() => setIsLive(!isLive)} style={{background: isLive ? '#dc2626' : 'red', color:'white', padding:'6px 14px', borderRadius:'20px', fontWeight:'bold', border:'none'}}>
          {isLive ? '🔴 LIVE • 1.2K' : '🔴 LIVE'}
        </button>
        <div style={{color:'#facc15', fontWeight:'bold'}}>{coins} Coins</div>
      </div>

      {isLive && <div style={{position:'fixed', top:'50px', width:'100%', background:'red', textAlign:'center', padding:'4px', zIndex:99}}>🔴 Uko LIVE sasa! - Mombasa inakuona!</div>}

      {/* VIDEO FEED - Vertical kama TikTok */}
      <div style={{height:'100vh', overflowY:'scroll', scrollSnapType:'y mandatory'}}>
        {videos.map((v, i) => (
          <div key={v.id} style={{height:'100vh', scrollSnapAlign:'start', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:'#111'}}>
            <video 
              src={v.url} 
              loop 
              autoPlay={i===current} 
              muted 
              playsInline
              onClick={(e:any) => e.target.paused ? e.target.play() : e.target.pause()}
              style={{height:'100%', width:'100%', objectFit:'cover'}}
            />
            {/* Info juu ya video */}
            <div style={{position:'absolute', bottom:'90px', left:'15px', right:'80px'}}>
              <p style={{fontWeight:'bold'}}>@MrVibra • {v.title || `Video ${i+1}`}</p>
              <p style={{fontSize:'13px', opacity:0.8}}>VIBRA WORLDWIDE 🌍 Mombasa Support</p>
            </div>
            {/* Buttons kulia kama TikTok */}
            <div style={{position:'absolute', right:'15px', bottom:'100px', display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
              <input type="file" id="dpIn" hidden onChange={handleDp} />
              <img src={dp} onClick={()=>document.getElementById('dpIn')?.click()} style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid #facc15'}} />
              <button style={{fontSize:'24px'}}>❤️<div style={{fontSize:'12px'}}>12K</div></button>
              <button style={{fontSize:'24px'}}>💬<div style={{fontSize:'12px'}}>345</div></button>
              <button onClick={()=>handleShare(v.title)} style={{fontSize:'24px'}}>↗️<div style={{fontSize:'12px'}}>Share</div></button>
              <button onClick={claimCoins} style={{background:'#facc15', color:'black', padding:'5px 10px', borderRadius:'15px', fontSize:'12px', fontWeight:'bold', border:'none'}}>8 Coins</button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:'fixed', bottom:0, width:'100%', background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', padding:'12px', zIndex:100}}>
        <span>🏠 Home</span>
        <span>🔍 Discover</span>
        <span>➕</span>
        <span>💬 Inbox</span>
        <span>👤 Me</span>
      </div>
    </div>
  )
}
