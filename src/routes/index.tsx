// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const [clips] = useState([
    {id:'1', u:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'Data Saver ON 🔋 Worldwide Mombasa', user:'vibra_boy', views:'254K'},
    {id:'2', u:'https://www.w3schools.com/html/movie.mp4', cap:'Togethar forever ❤️', user:'mombasa_star', views:'412K'},
    {id:'3', u:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'SHOUT OUT WORLDWIDE 🔥', user:'vibra_boy', views:'756K'},
  ])
  const [tab, setTab] = useState('foryou')
  const [dataSaver, setDataSaver] = useState(true)
  const [showAd, setShowAd] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState(new Set())
  const [saves, setSaves] = useState(new Set())
  const [follow, setFollow] = useState(new Set())
  const [showPage, setShowPage] = useState('home')
  const [isLive, setIsLive] = useState(false)
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())
  const MPESA="0740805970"
  const PAYPAL="vibra.worldwide@gmail.com"
  
  // SAUTI IKATE UKITOKA APP AUTOMATIC
  useEffect(()=>{
    const stopAll=()=>{ videoRefs.current.forEach(v=>{ try{v.pause()}catch{}})}
    const onVis=()=>{ if(document.hidden) stopAll() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('blur', stopAll)
    window.addEventListener('pagehide', stopAll)
    return()=>{ document.removeEventListener('visibilitychange', onVis); window.removeEventListener('blur', stopAll) }
  },[])

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" />
      {showAd && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-[24px] p-5 w-full max-w-[360px]">
            <p className="font-black">🌍 Tangaza Worldwide! 🔋</p>
            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3 mt-3"><p className="font-black text-[11px]">🇰🇪 M-PESA {MPESA}</p><a href={`https://wa.me/254${MPESA.substring(1)}`} className="block bg-green-600 text-white py-2 rounded-full text-center font-bold mt-2 text-[11px]">Lipa M-Pesa 💬</a></div>
            <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-3 mt-2"><p className="font-black text-[11px] text-blue-700">🌍 PAYPAL {PAYPAL}</p></div>
            <button onClick={()=>setShowAd(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button>
          </div>
        </div>
      )}
      {isLive && <div className="absolute inset-0 bg-red-900/90 z-[90] flex items-center justify-center"><div className="text-center"><p className="text-3xl">🔴 LIVE</p><p className="mt-2 text-[12px]">Vibra Live Worldwide - Coming Soon!</p><button onClick={()=>setIsLive(false)} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Close</button></div></div>}

      {/* JUU - LIVE + FOLLOWING + FOR YOU */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 to-transparent p-3">
        <div className="flex items-center justify-between">
          <button onClick={()=>setIsLive(true)} className="bg-[#FE2C55] border border-white px-3 py-1 rounded-full text-[11px] font-black animate-pulse">🔴 LIVE</button>
          <div className="flex gap-5">
            <button onClick={()=>setTab('following')} className={`text-[14px] font-bold pb-1 ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
            <button onClick={()=>setTab('foryou')} className={`text-[14px] font-bold pb-1 ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
          </div>
          <button onClick={()=>setDataSaver(!dataSaver)} className={`px-2 py-1 rounded-full text-[9px] font-black border ${dataSaver?'bg-green-500 border-white':'bg-zinc-700'}`}>{dataSaver?'🔋 ON':'🔋 OFF'}</button>
        </div>
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-12 pb-[70px]">
        {clips.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900">
            <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.u} loop autoPlay playsInline muted={isMuted} preload={dataSaver?'metadata':'auto'} className="h-full w-full object-cover" onClick={e=>{ const v=e.currentTarget; if(v.paused) v.play(); else v.pause()}} />
            <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-14 left-3 bg-black/60 px-2 py-1 rounded-full text-[10px] border border-white/20">{isMuted?'🔇':'🔊'}</button>
            <div className="absolute bottom-[90px] left-3 right-20 z-20"><p className="font-bold text-[14px]">@{c.user} ✅</p><p className="text-[13px] mt-1">{c.cap}</p></div>
            
            {/* KULIA - PROFILE+ JUU YA LIKE, HALAFU COMMENTS SHARE SAVE LYRICS */}
            <div className="absolute bottom-24 right-2 flex flex-col items-center gap-3.5 z-20">
              {/* Profile na + */}
              <div className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-black text-[16px]">V</div><button onClick={()=>{ const s=new Set(follow); if(s.has(c.user)) s.delete(c.user); else s.add(c.user); setFollow(s)}} className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-black border-2 border-black ${follow.has(c.user)?'bg-zinc-600':'bg-[#FE2C55]'}`}>{follow.has(c.user)?'✓':'+'}</button></div>
              <div className="h-2"></div>
              {/* Like */}
              <button onClick={()=>{ const s=new Set(likes); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-[22px] ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/70'}`}>❤️</div><span className="text-[10px] font-bold mt-1">{c.views}</span></button>
              {/* Comments */}
              <button onClick={()=>alert('💬 Comments - Coming Soon!')} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/70 flex items-center justify-center text-[20px]">💬</div><span className="text-[10px] font-bold mt-1">12K</span></button>
              {/* Save */}
              <button onClick={()=>{ const s=new Set(saves); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setSaves(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-[20px] ${saves.has(c.id)?'bg-yellow-500':'bg-zinc-700/70'}`}>🔖</div><span className="text-[10px] font-bold mt-1">Save</span></button>
              {/* Share */}
              <button onClick={()=>{ if(navigator.share) navigator.share({title:'Vibra', url:location.href}); else setShowAd(true)}} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/70 flex items-center justify-center text-[20px]">↗️</div><span className="text-[10px] font-bold mt-1">Share</span></button>
              {/* Lyrics */}
              <button onClick={()=>alert('🎵 Lyrics: Data Saver ON 🔋 Worldwide Mombasa 🌍 \n\nVibra vibra worldwide...')} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/70 flex items-center justify-center text-[16px] border border-white/30">🎵</div><span className="text-[9px] font-bold mt-1">Lyrics</span></button>
            </div>
          </div>
        ))}
      </div>

      {/* CHINI - HOME EXPLORE UPLOAD INBOX ME - ICONS HALISI */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[68px] px-1 z-40">
        <button onClick={()=>setShowPage('home')} className={`flex flex-col items-center ${showPage==='home'?'text-white':'text-zinc-500'}`}><span className="text-[22px]">🏠</span><span className="text-[9px] font-bold mt-0.5">Home</span></button>
        <button onClick={()=>alert('🔍 Explore Worldwide - Coming Soon!')} className="flex flex-col items-center text-zinc-500"><span className="text-[22px]">🔍</span><span className="text-[9px] font-bold mt-0.5">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[48px] h-[32px] rounded-[10px] flex items-center justify-center text-[24px] font-black border-2 border-white">+</div><span className="text-[9px] font-bold mt-0.5 text-white">Upload</span></button>
        <button onClick={()=>setShowAd(true)} className="flex flex-col items-center text-zinc-500 relative"><span className="text-[22px]">📥</span><span className="text-[9px] font-bold mt-0.5">Inbox</span><span className="absolute -top-1 -right-1 bg-[#FE2C55] text-white text-[8px] px-1 rounded-full">3</span></button>
        <button onClick={()=>setShowPage('me')} className={`flex flex-col items-center ${showPage==='me'?'text-white':'text-zinc-500'}`}><span className="text-[22px]">👤</span><span className="text-[9px] font-bold mt-0.5">Me</span></button>
      </div>
    </div>
  )
}
