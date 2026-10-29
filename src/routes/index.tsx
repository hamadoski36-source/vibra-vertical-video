// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, useMemo } from 'react'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const allClips = [
    {id:'1', u:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'Data Saver ON 🔋 Worldwide Mombasa', tags:['#vibra','#mombasa','#worldwide','#datasaver'], user:'vibra_boy', views:'254K'},
    {id:'2', u:'https://www.w3schools.com/html/movie.mp4', cap:'Togethar forever with data saver', tags:['#togethar','#love','#kenya','#viral'], user:'mombasa_star', views:'412K'},
    {id:'3', u:'https://www.w3schools.com/html/mov_bbb.mp4', cap:'SHOUT OUT WORLDWIDE', tags:['#shoutout','#worldwide','#fyp','#vibra'], user:'vibra_boy', views:'756K'},
  ]
  const [q, setQ] = useState('')
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
  const clips = useMemo(()=> allClips.filter(c=> q==='' || c.cap.toLowerCase().includes(q.toLowerCase()) || c.tags.some(t=>t.toLowerCase().includes(q.toLowerCase())) ), [q])
  
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
      {showAd && (<div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"><div className="bg-white text-black rounded-[24px] p-5 w-full max-w-[360px]"><p className="font-black">🌍 Tangaza Worldwide!</p><div className="bg-green-50 border-2 border-green-600 rounded-xl p-3 mt-3"><p className="font-black text-[11px]">🇰🇪 M-PESA {MPESA}</p></div><button onClick={()=>setShowAd(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button></div></div>)}
      {isLive && <div className="absolute inset-0 bg-red-900/90 z-[90] flex items-center justify-center"><div className="text-center"><p className="text-3xl">🔴 LIVE</p><button onClick={()=>setIsLive(false)} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Close</button></div></div>}

      {/* SEARCH BAR JUU KABISA */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur p-2">
        <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 21l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search #vibra, #mombasa, users..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-zinc-500" />
          {q && <button onClick={()=>setQ('')} className="text-zinc-400">✕</button>}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <button onClick={()=>setIsLive(true)} className="flex items-center gap-1 bg-[#FE2C55] px-3 py-1 rounded-full text-[11px] font-black"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE</button>
          <div className="flex gap-5"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold pb-1 ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold pb-1 ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button></div>
          <button onClick={()=>setDataSaver(!dataSaver)} className={`px-2 py-1 rounded-full text-[9px] font-black border ${dataSaver?'bg-green-500 border-white':'bg-zinc-700'}`}>{dataSaver?'🔋 ON':'OFF'}</button>
        </div>
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[88px] pb-[68px]">
        {clips.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900">
            <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.u} loop autoPlay playsInline muted={isMuted} preload={dataSaver?'metadata':'auto'} className="h-full w-full object-cover" onClick={e=>{ const v=e.currentTarget; if(v.paused) v.play(); else v.pause()}} />
            <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-2 left-3 bg-black/60 px-2 py-1 rounded-full text-[10px]">{isMuted?'🔇':'🔊'}</button>
            
            <div className="absolute bottom-[20px] left-3 right-20 z-20">
              <p className="font-bold text-[14px]">@{c.user} ✅</p>
              <p className="text-[13px] mt-1">{c.cap}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">{c.tags.map(t=><span key={t} onClick={()=>setQ(t)} className="text-[11px] font-bold text-[#3DE2FF] cursor-pointer">{t}</span>)}</div>
              <p className="text-[10px] mt-2 bg-black/50 px-2 py-1 rounded-full inline-flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg> Original sound - {c.user}</p>
            </div>
            
            <div className="absolute bottom-6 right-2 flex flex-col items-center gap-3 z-20">
              <div className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-black">V</div><button onClick={()=>{ const s=new Set(follow); if(s.has(c.user)) s.delete(c.user); else s.add(c.user); setFollow(s)}} className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black ${follow.has(c.user)?'bg-zinc-600':'bg-[#FE2C55]'}`}>{follow.has(c.user)?'✓':'+'}</button></div>
              <div className="h-1"></div>
              {/* ICONS HALISI - SVG SIO EMOJI */}
              <button onClick={()=>{ const s=new Set(likes); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}><svg className="w-6 h-6" fill={likes.has(c.id)?"white":"none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div><span className="text-[10px] font-bold mt-1">{c.views}</span></button>
              <button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div><span className="text-[10px] font-bold mt-1">12K</span></button>
              <button onClick={()=>{ const s=new Set(saves); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setSaves(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center ${saves.has(c.id)?'bg-yellow-500':'bg-zinc-700/80'}`}><svg className="w-5 h-5" fill={saves.has(c.id)?"white":"none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg></div><span className="text-[10px] font-bold mt-1">Save</span></button>
              <button onClick={()=>setShowAd(true)} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316A3 3 0 105.367 12c0 1.418.722 2.68 1.817 3.342"/></svg></div><span className="text-[10px] font-bold mt-1">Share</span></button>
              <button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center border border-white/20"><svg className="w-5 h-5 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg></div><span className="text-[9px] font-bold mt-1">Lyrics</span></button>
            </div>
          </div>
        ))}
        {clips.length===0 && <div className="h-screen flex items-center justify-center text-zinc-400">No results for "{q}"</div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[66px] px-1 z-40">
        <button onClick={()=>setShowPage('home')} className={`flex flex-col items-center ${showPage==='home'?'text-white':'text-zinc-500'}`}><svg className="w-6 h-6" fill={showPage==='home'?"currentColor":"none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span className="text-[9px] font-bold mt-0.5">Home</span></button>
        <button className="flex flex-col items-center text-zinc-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><span className="text-[9px] font-bold mt-0.5">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[48px] h-[32px] rounded-[10px] flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M12 4v16m8-8H4"/></svg></div><span className="text-[9px] font-bold mt-0.5 text-white">Upload</span></button>
        <button onClick={()=>setShowAd(true)} className="flex flex-col items-center text-zinc-500 relative"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg><span className="text-[9px] font-bold mt-0.5">Inbox</span></button>
        <button onClick={()=>setShowPage('me')} className={`flex flex-col items-center ${showPage==='me'?'text-white':'text-zinc-500'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span className="text-[9px] font-bold mt-0.5">Me</span></button>
      </div>
    </div>
  )
}
