// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const [clips] = useState([
    {id:'1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'Data Saver ON 🔋 Worldwide Mombasa'},
    {id:'2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Togethar ❤️'},
  ])
  const [dataSaver, setDataSaver] = useState(true)
  const [showAd, setShowAd] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const fileRef = useRef(null)
  const MY_MPESA="0740805970"
  const MY_PAYPAL="vibra.worldwide@gmail.com"
  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" />
      {showAd && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-[24px] p-5 w-full max-w-[360px]">
            <p className="font-black text-[18px]">🌍 Tangaza Worldwide! 🔋</p>
            <div className="mt-3 space-y-2">
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3"><p className="font-black text-[11px]">🇰🇪 M-PESA {MY_MPESA}</p><p className="text-[11px]">1K KES/day • 70% data saved</p><a href={`https://wa.me/254${MY_MPESA.substring(1)}`} className="block bg-green-600 text-white py-2 rounded-full text-center font-bold mt-2 text-[11px]">Lipa M-Pesa 💬</a></div>
              <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-3"><p className="font-black text-[11px] text-blue-700">🌍 PAYPAL {MY_PAYPAL}</p><p className="text-[11px]">$10/day • Worldwide</p><a href="https://paypal.me/vibraads" className="block bg-blue-600 text-white py-2 rounded-full text-center font-bold mt-2 text-[11px]">PayPal 💳</a></div>
            </div>
            <button onClick={()=>setShowAd(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button>
          </div>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 z-30 bg-black/80 p-3 flex items-center gap-2">
        <div className="flex-1 bg-zinc-800 rounded-full px-3 py-2 text-[12px]">🔍 Search worldwide</div>
        <button onClick={()=>setDataSaver(!dataSaver)} className={`px-3 py-2 rounded-full text-[10px] font-black border-2 ${dataSaver?'bg-green-500 border-white':'bg-zinc-700'}`}>{dataSaver?'🔋 ON':'🔋 OFF'}</button>
        <button onClick={()=>setShowAd(true)} className="px-3 py-2 rounded-full bg-yellow-500 text-black font-bold text-[11px]">💰 Ads</button>
      </div>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-14">
        {clips.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-black">
            <video src={c.url} loop playsInline muted={isMuted} className="h-full w-full object-cover" onClick={e=>{ const v=e.currentTarget; if(v.paused) v.play(); else v.pause()}} />
            <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-16 left-3 bg-black/60 px-3 py-1 rounded-full text-[11px]">{isMuted?'🔇 Tap':'🔊'}</button>
            {dataSaver && <div className="absolute top-16 right-3 bg-green-500 px-2 py-1 rounded-full text-[9px] font-black">🔋 70% SAVED WORLDWIDE</div>}
            <div className="absolute bottom-24 left-3"><p className="font-bold">@vibra-boy ✅</p><p className="text-[13px]">{c.caption}</p><p className="text-[10px] mt-1 bg-black/60 px-2 py-1 rounded-full">M-Pesa {MY_MPESA} • PayPal {MY_PAYPAL}</p></div>
            <button onClick={()=>setShowAd(true)} className="absolute bottom-20 right-3 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">💰</button>
          </div>
        ))}
      </div>
    </div>
  )
}
