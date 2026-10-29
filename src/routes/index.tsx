// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:VibraFinal})
function VibraFinal(){
  const all=[
    {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Data Saver ON 🔋 Mombasa',t:['#vibra','#mombasa','#worldwide'],user:'vibra_boy',v:'254K'},
    {id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'Togethar forever ❤️',t:['#togethar','#love','#viral'],user:'mombasa_star',v:'412K'},
    {id:'3',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'SHOUT OUT WORLDWIDE',t:['#shoutout','#fyp','#vibra'],user:'vibra_boy',v:'756K'},
  ]
  const [q,setQ]=useState('')
  const [tab,setTab]=useState('foryou')
  const [dataSaver,setDS]=useState(true)
  const [showAd,setAd]=useState(false)
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [saves,setSaves]=useState(new Set())
  const [follow,setFollow]=useState(new Set())
  const [page,setPage]=useState('home')
  const [isLive,setLive]=useState(false)
  const fileRef=useRef(null)
  const vRefs=useRef(new Map())
  const MPESA="0740805970"
  const clips=q?all.filter(x=>x.c.includes(q)||x.t.join().includes(q)):all
  
  useEffect(()=>{
    const stop=()=>{vRefs.current.forEach(v=>{try{v.pause()}catch{}})}
    const onVis=()=>{if(document.hidden)stop()}
    document.addEventListener('visibilitychange',onVis)
    window.addEventListener('blur',stop)
    return()=>{document.removeEventListener('visibilitychange',onVis)}
  },[])

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden"/>
      {showAd&&<div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"><div className="bg-white text-black rounded-2xl p-5 w-full max-w-[360px]"><p className="font-black">🌍 Tangaza!</p><div className="bg-green-50 border-2 border-green-600 rounded-xl p-3 mt-3"><p className="font-black text-[11px]">M-PESA {MPESA}</p></div><button onClick={()=>setAd(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button></div></div>}
      {isLive&&<div className="absolute inset-0 bg-red-900/90 z-[90] flex items-center justify-center"><div className="text-center"><p className="text-3xl">🔴 LIVE</p><button onClick={()=>setLive(false)} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Close</button></div></div>}

      {/* SEARCH JUU */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 p-2">
        <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
          <span className="text-zinc-400">🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search #vibra #mombasa..." className="flex-1 bg-transparent text-[13px] outline-none"/>
          {q&&<button onClick={()=>setQ('')} className="text-zinc-400">✕</button>}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <button onClick={()=>setLive(true)} className="bg-[#FE2C55] px-3 py-1 rounded-full text-[11px] font-black">🔴 LIVE</button>
          <div className="flex gap-5">
            <button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
            <button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
          </div>
          <button onClick={()=>setDS(!dataSaver)} className={`px-2 py-1 rounded-full text-[9px] font-black border ${dataSaver?'bg-green-500':'bg-zinc-700'}`}>{dataSaver?'🔋 ON':'OFF'}</button>
        </div>
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[86px] pb-[66px]">
        {clips.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900">
            <video ref={el=>{if(el)vRefs.current.set(c.id,el)}} src={c.u} loop autoPlay playsInline muted={muted} preload={dataSaver?'metadata':'auto'} className="h-full w-full object-cover" onClick={e=>{const v=e.currentTarget; if(v.paused)v.play(); else v.pause()}}/>
            <button onClick={()=>setMuted(!muted)} className="absolute top-2 left-3 bg-black/60 px-2 py-1 rounded-full text-[10px]">{muted?'🔇':'🔊'}</button>
            <div className="absolute bottom-[20px] left-3 right-20 z-20">
              <p className="font-bold text-[14px]">@{c.user} ✅</p>
              <p className="text-[13px] mt-1">{c.c}</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">{c.t.map(tag=><span key={tag} onClick={()=>setQ(tag)} className="text-[11px] font-bold text-cyan-400">{tag}</span>)}</div>
            </div>
            <div className="absolute bottom-6 right-2 flex flex-col items-center gap-3 z-20">
              <div className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-black">V</div><button onClick={()=>{const s=new Set(follow); if(s.has(c.user))s.delete(c.user); else s.add(c.user); setFollow(s)}} className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full text-[10px] font-black border-2 border-black flex items-center justify-center ${follow.has(c.user)?'bg-zinc-600':'bg-[#FE2C55]'}`}>{follow.has(c.user)?'✓':'+'}</button></div>
              <div className="h-1"></div>
              <button onClick={()=>{const s=new Set(likes); if(s.has(c.id))s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-[20px] ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[10px] font-bold mt-1">{c.v}</span></button>
              <button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-[18px]">💬</div><span className="text-[10px] font-bold mt-1">12K</span></button>
              <button onClick={()=>{const s=new Set(saves); if(s.has(c.id))s.delete(c.id); else s.add(c.id); setSaves(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-[18px] ${saves.has(c.id)?'bg-yellow-500':'bg-zinc-700/80'}`}>🔖</div><span className="text-[10px] mt-1">Save</span></button>
              <button onClick={()=>setAd(true)} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-[16px]">↗️</div><span className="text-[10px] mt-1">Share</span></button>
              <button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-[14px] border border-white/20">🎵</div><span className="text-[9px] mt-1">Lyrics</span></button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[64px] px-1 z-40">
        <button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span className="text-[20px]">🏠</span><span className="text-[9px] font-bold">Home</span></button>
        <button className="flex flex-col items-center text-zinc-500"><span className="text-[20px]">🔍</span><span className="text-[9px] font-bold">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[48px] h-[32px] rounded-[10px] flex items-center justify-center text-[22px] font-black">+</div><span className="text-[9px] font-bold text-white">Upload</span></button>
        <button onClick={()=>setAd(true)} className="flex flex-col items-center text-zinc-500"><span className="text-[20px]">📥</span><span className="text-[9px] font-bold">Inbox</span></button>
        <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span className="text-[20px]">👤</span><span className="text-[9px] font-bold">Me</span></button>
      </div>
    </div>
  )
}
