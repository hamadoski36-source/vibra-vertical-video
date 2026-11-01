import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: VibraHome,
})

function VibraHome() {
  const [isLive, setIsLive] = useState(false)
  const [dp, setDp] = useState("https://via.placeholder.com/150")
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const savedDp = localStorage.getItem("vibra_dp")
    if (savedDp) setDp(savedDp)
    const savedCoins = localStorage.getItem("vibra_coins")
    if (savedCoins) setCoins(parseInt(savedCoins))
  }, [])

  const handleShare = async () => {
    const text = `VIBRA WORLDWIDE 🌍 - Tazama! ${window.location.href} #vibra #mombasa`
    try {
      await navigator.clipboard.writeText(text)
      alert("✅ Link copied! Tuma WhatsApp sasa!")
    } catch {
      prompt("Copy hii:", text)
    }
  }

  const handleLive = () => {
    if (!isLive) {
      if (confirm("🔴 Anza LIVE Mombasa Worldwide?")) {
        setIsLive(true)
      }
    } else {
      setIsLive(false)
    }
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
    alert("🎉 +8 Coins! Total: " + n)
  }

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh', paddingBottom:'80px'}}>
      {/* TOP */}
      <div style={{position:'fixed', top:0, width:'100%', display:'flex', justifyContent:'space-between', padding:'12px', background:'rgba(0,0,0,0.9)', zIndex:50}}>
        <button onClick={handleLive} style={{background: isLive ? '#dc2626' : 'red', color:'white', padding:'6px 14px', borderRadius:'20px', fontWeight:'bold', border:'none'}}>
          {isLive ? '🔴 LIVE • 1.2K' : '🔴 LIVE'}
        </button>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <span style={{color:'#facc15', fontWeight:'bold'}}>{coins} Coins</span>
          <span style={{fontSize:'12px', border:'1px solid white', padding:'2px 6px', borderRadius:'10px'}}>Sound on</span>
        </div>
      </div>

      <div style={{paddingTop:'70px', textAlign:'center'}}>
        <h1 style={{color:'#facc15', fontSize:'28px', fontWeight:'bold'}}>VIBRA WORLDWIDE 🌍</h1>
        <p>Mombasa Support Vibra - 8 Videos</p>
        {isLive && <div style={{marginTop:'10px', background:'red', padding:'5px'}}>🔴 Uko LIVE sasa!</div>}
      </div>

      {/* ME / DP SECTION */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'30px', borderTop:'1px solid #333', paddingTop:'20px'}}>
        <input type="file" id="dpInput" accept="image/*" hidden onChange={handleDp} />
        <img src={dp} onClick={() => document.getElementById('dpInput')?.click()} style={{width:'90px', height:'90px', borderRadius:'50%', border:'3px solid #facc15', objectFit:'cover', cursor:'pointer'}} />
        <p style={{fontSize:'11px', color:'gray', marginTop:'5px'}}>Bonyeza kuweka DP yako</p>
        <p style={{fontWeight:'bold', marginTop:'5px'}}>@MrVibra</p>
        <p style={{fontSize:'12px', color:'gray'}}>8 Videos • {coins} Coins</p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginTop:'20px', width:'90%', maxWidth:'350px'}}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{background:'#222', height:'120px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}>Video {i}</div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{position:'fixed', bottom:0, width:'100%', background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', padding:'12px'}}>
        <span>🏠</span>
        <span>🔍</span>
        <button onClick={handleShare} style={{background:'white', color:'black', padding:'6px 14px', borderRadius:'20px', fontWeight:'bold', border:'none'}}>↗️ Share</button>
        <button onClick={claimCoins} style={{background:'#facc15', color:'black', padding:'6px 14px', borderRadius:'20px', fontWeight:'bold', border:'none'}}>8 Coins</button>
        <span>👤</span>
      </div>
    </div>
  )
}
