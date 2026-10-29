// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const [clips] = useState([
    {id:'1', url:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'Data Saver ON 🔋 Worldwide Mombasa 🌍', views:'254K'},
    {id:'2', url:'https://www.w3schools.com/html/movie.mp4', cap:'Togethar forever ❤️ #vibra', views:'412K'},
    {id:'3', url:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'SHOUT OUT WORLDWIDE 🔥', views:'756K'},
  ])
  const [dataSaver, setDataSaver] = useState(true)
  const [showAd, setShowAd] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState(new Set())
  const fileRef = useRef(null)
  const MPESA="0740805970"
  const PAYPAL="vibra.worldwide@gmail.com"
  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" />
      {showAd && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-[24px] p-5 w-full max-w-[360px]">
            <p className="font-black text-[18px]">🌍 Tangaza Worldwide! 🔋</p>
            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3 mt-3"><p className="font-black text-[12px]">🇰🇪 M-PESA {MPESA}</p><p className="text-[11px]">1K KES/day • 70% saved</p><a href={`https://wa.me/254${MPESA.substring(1)}`} className="block bg-green-600 text-white py-2 rounded-full text-center font-bold mt-2">WhatsApp 💬</a></div>
            <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-3 mt-2"><p className="font-black text-[12px] text-blue-700">🌍 PAYPAL {PAYPAL}</p><p className="text-[11px]">$10/day • Worldwide</p></div>
            <button onClick={()=>setShowAd(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button>
          </div>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 z-30 bg-black/80 p-3 flex items-center gap-2">
        <div className="flex-1 bg-zinc-800 rounded-full px-3 py-2 text-[12px] border border-zinc-700">🔍 Search worldwide</div>
        <button onClick={()=>setDataSaver(!dataSaver)} className={`px-3 py-2 rounded-full text-[10px] font-black border-2 ${dataSaver?'bg-green-500 border-white':'bg-zinc-700 border-zinc-600'}`}>{dataSaver?'🔋 ON':'🔋 OFF'}</button>
        <button onClick={()=>setShowAd(true)} className="px-3 py-2 rounded-full bg-yellow-500 text-black font-bold text-[11px]">💰 Ads</button>
      </div>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-14">
        {clips.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900">
            <video src={c.url} loop autoPlay playsInline muted={isMuted} preload={dataSaver?'metadata':'auto'} className="h-full w-full object-cover" onClick={e=>{ const v=e.currentTarget; if(v.paused) v.play(); else v.pause()}} />
            <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-16 left-3 bg-black/60 px-3 py-1 rounded-full text-[11px] border border-white/20">{isMuted?'🔇 Tap':'🔊'}</button>
            {dataSaver && <div className="absolute top-16 right-3 bg-green-500 px-2 py-1 rounded-full text-[9px] font-black">🔋 70% SAVED</div>}
            <div className="absolute bottom-28 left-3 right-20 z-20"><p className="font-bold text-[15px]">@vibra-boy ✅</p><p className="text-[13px] mt-1">{c.cap}</p><p className="text-[10px] mt-2 bg-black/60 px-2 py-1 rounded-full inline-block">M-Pesa {MPESA} • {PAYPAL}</p></div>
            <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 z-20">
              <button onClick={()=>{ const s=new Set(likes); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setLikes(s)}} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${likes.has(c.id)?'bg-[#FE2C55] border-white':'bg-zinc-700/80 border-zinc-500'}`}>❤️</button>
              <span className="text-[10px] font-bold -mt-3">{c.views}</span>
              <button onClick={()=>setShowAd(true)} className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-xl border-2 border-white">💰</button>
              <button className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-xl border border-zinc-500">💬</button>
              <button className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-xl border border-zinc-500">↗️</button>
              <button onClick={()=>fileRef.current?.click()} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-2xl font-black">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
