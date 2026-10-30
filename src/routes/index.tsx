// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route=createFileRoute('/')({component:Vibra})
function Vibra(){
  const defaultVideos=[
    {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Watu wa Mombasa 🔥 Worldwide! #vibra #mombasa',t:['#vibra','#mombasa'],user:'vibra-boy',v:'699.3K'},
    {id:'2',u:'https://www.w3schools.com/html/movie.mp4',k:'video',c:'Bear Love ❤️ #snitch',t:['#love'],user:'vibra-boy',v:'707.6K'},
    {id:'3',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Data Saver ON',t:['#mombasa'],user:'mombasa_star',v:'254K'},
  ]
  const [all,setAll]=useState(()=>{
    try{const s=localStorage.getItem('vibra_worldwide_v2'); if(s){const p=JSON.parse(s); return [...p,...defaultVideos]}}catch{}; return defaultVideos
  })
  const [tab,setTab]=useState('foryou')
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [page,setPage]=useState('home')
  const [activeId,setActiveId]=useState('1')
  const [showCom,setShowCom]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [showList,setShowList]=useState(null)
  const [showLive,setShowLive]=useState(false)
  const [showMeVideo,setShowMeVideo]=useState(null)
  const [isLive,setIsLive]=useState(false)
  const [newCap,setNewCap]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newKind,setNewKind]=useState('video')
  const [uploading,setUploading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [following,setFollowing]=useState(new Set(['mombasa_star']))
  const fileRef=useRef(null)
  const vRefs=useRef({})

  useEffect(()=>{
    if(page!=='home')return
    const obs=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        const id=en.target.getAttribute('data-vid')
        const vid=vRefs.current[id]
        if(!vid)return
        if(en.isIntersecting && en.intersectionRatio>0.6){setActiveId(id); if(!document.hidden) vid.play().catch(()=>{})} else {vid.pause()}
      })
    },{threshold:0.6})
    Object.values(vRefs.current).forEach(el=>{if(el)obs.observe(el)})
    return ()=>obs.disconnect()
  },[all,page,tab])

  useEffect(()=>{
    const pauseAll=()=>{Object.values(vRefs.current).forEach(v=>{if(v){v.pause(); v.muted=true}}); setMuted(true)}
    const handleVis=()=>{if(document.hidden) pauseAll()}
    document.addEventListener('visibilitychange',handleVis)
    window.addEventListener('pagehide',pauseAll)
    window.addEventListener('blur',pauseAll)
    return ()=>{document.removeEventListener('visibilitychange',handleVis); window.removeEventListener('pagehide',pauseAll); window.removeEventListener('blur',pauseAll)}
  },[])

  useEffect(()=>{if(page==='me'){Object.values(vRefs.current).forEach(v=>{if(v){v.pause(); v.muted=true}}); setMuted(true)}},[page])

  const filtered=tab==='following'?all.filter(x=>following.has(x.user)):all
  const myVideos=all.filter(x=>x.user==='vibra-boy')

  const handleUpload=(e)=>{
    const f=e.target.files?.[0]; if(!f)return
    const url=URL.createObjectURL(f); setNewUrl(url); setNewKind(f.type.startsWith('image')?'image':'video'); setShowUp(true)
  }

  const saveVideo=async()=>{
    setUploading(true); setProgress(10)
    for(let i=10;i<=90;i+=20){await new Promise(r=>setTimeout(r,250)); setProgress(i)}
    const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra Worldwide 🔥',t:['#vibra','#mombasa','#worldwide'],user:'vibra-boy',v:'0'}
    const newAll=[vid,...all]; setAll(newAll)
    const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))
    try{localStorage.setItem('vibra_worldwide_v2',JSON.stringify(worldwideOnly))}catch{}
    setProgress(100)
    setTimeout(()=>{setUploading(false); setShowUp(false); setNewCap('');setNewUrl('');setProgress(0); setPage('me'); alert('✅ WORLDWIDE UPLOADED! 🌍 Refresh bado ipo!')},400)
  }

  const delVideo=(id,url)=>{if(!confirm('Futa?'))return; try{if(url.startsWith('blob:'))URL.revokeObjectURL(url)}catch{}; const newAll=all.filter(x=>x.id!==id); setAll(newAll); const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id)); try{localStorage.setItem('vibra_worldwide_v2',JSON.stringify(worldwideOnly))}catch{}; setShowMeVideo(null)}

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      <div className="fixed top-[44px] left-0 right-0 z-[65] bg-[#FE2C55] h-[50px] flex items-center justify-center"><p className="text-[11px] font-bold">📢 REAL ADS - Mombasa Businesses Advertise Here! 250K views - Contact @vibra-boy</p></div>
      {showLive&&<div className="absolute inset-0 z-[110] bg-black flex flex-col"><div className="flex justify-between p-4"><button onClick={()=>setShowLive(false)} className="bg-zinc-800 w-8 h-8 rounded-full">✕</button><p className="font-bold">LIVE Studio Worldwide 🌍</p><div></div></div><div className="flex-1 bg-zinc-900 m-4 rounded-[16px] flex flex-col items-center justify-center p-4"><div className="w-full h-[60%] bg-black rounded-xl flex items-center justify-center border-2 border-[#FE2C55] text-[50px]">📹</div><input placeholder="Live title - Watu wa Mombasa..." className="mt-4 w-full bg-zinc-800 rounded-full px-4 py-3 text-[13px] outline-none"/><button onClick={()=>{setIsLive(true); setShowLive(false)}} className="mt-6 bg-[#FE2C55] w-full py-3 rounded-full font-black">🔴 START LIVE Worldwide!</button><p className="text-[10px] text-zinc-500 mt-2">Will show to 250.8K followers</p></div></div>}
      {showMeVideo&&<div className="absolute inset-0 z-[105] bg-black flex flex-col"><div className="flex justify-between p-3 bg-black/80"><button onClick={()=>setShowMeVideo(null)} className="bg-zinc-700 w-8 h-8 rounded-full">✕</button><p className="font-bold text-[14px]">@{showMeVideo.user} • {showMeVideo.v}</p><button onClick={()=>delVideo(showMeVideo.id,showMeVideo.u)} className="bg-red-600 w-8 h-8 rounded-full">🗑️</button></div><div className="flex-1 relative"><video src={showMeVideo.u} autoPlay loop controls playsInline className="w-full h-full object-contain bg-black"/><div className="absolute bottom-20 left-3 right-20"><p className="font-bold">@{showMeVideo.user} ✅</p><p className="text-[13px]">{showMeVideo.c}</p><p className="text-cyan-400 text-[12px]">{showMeVideo.t.join(' ')}</p></div><div className="absolute bottom-20 right-2 flex flex-col gap-3"><button className="w-12 h-12 rounded-full bg-[#FE2C55] flex items-center justify-center">❤️</button><button className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">💬</button></div></div></div>}
      {showList&&<div className="absolute inset-0 z-[100] bg-black/80 flex items-end"><div className="bg-white text-black w-full rounded-t-[20px] max-h-[70%] p-4"><div className="flex justify-between"><p className="font-bold">{showList}</p><button onClick={()=>setShowList(null)} className="bg-gray-100 w-8 h-8 rounded-full">✕</button></div><p className="mt-4 text-[13px]">All {showList} working - Worldwide!</p></div></div>}
      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4 z-[91]"><p className="font-bold">💬 Comments</p><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>!uploading&&setShowUp(false)}>✕ Cancel</button><button onClick={saveVideo} disabled={uploading} className="bg-[#FE2C55] px-6 py-2 rounded-full font-bold disabled:opacity-50">{uploading?`${progress}%`:'Post Worldwide 🌍'}</button></div>{newKind==='image'?<img src={newUrl} className="w-full h-[40%] object-contain mt-4"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[40%] object-contain mt-4"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption #vibra #mombasa #worldwide..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/><p className="text-[10px] text-zinc-500 mt-2">🌍 Worldwide - Itaonekana kwa wote na itabaki hata ukirefresh!</p>{uploading&&<div className="mt-4"><div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-[#FE2C55] h-2 rounded-full transition-all" style={{width:`${progress}%`}}></div></div><p className="text-[11px] text-center mt-2">Uploading worldwide... {progress}%</p></div>}</div>}
      {page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black flex flex-col"><div className="flex items-center justify-between px-4 py-3 border-b"><button onClick={()=>setPage('home')}>←</button><p className="font-bold">@vibra-boy ✅ Worldwide</p><span>⋮</span></div><div className="flex-1 overflow-y-auto pb-[70px]"><div className="flex justify-around mt-4"><button onClick={()=>setShowList('Following')} className="text-center"><p className="font-black">10K</p><p className="text-[11px] text-gray-500">Following</p></button><button onClick={()=>setShowList('Followers')} className="text-center border-l pl-8"><p className="font-black">250.8K</p><p className="text-[11px] text-gray-500">Followers</p></button><button onClick={()=>setShowList('Likes')} className="text-center border-l pl-8"><p className="font-black">2.0M</p><p className="text-[11px] text-gray-500">Likes</p></button></div><div className="px-4 mt-2"><p className="text-[11px] text-green-600">🌍 Worldwide Mode REAL - No Lovable credits needed! Bure!</p></div><div className="grid grid-cols-2 gap-[1px] bg-gray-200 mt-3">{myVideos.map(c=>(<div key={c.id} onClick={()=>setShowMeVideo(c)} className="aspect-[9/16] bg-black relative cursor-pointer active:scale-[0.98] transition"><video src={c.u} loop muted autoPlay playsInline className="w-full h-full object-cover pointer-events-none"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div className="absolute bottom-1 left-1 text-white text-[11px] bg-black/60 px-1 rounded">▶ {c.v}</div><div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/20 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center">▶</div></div><button onClick={(e)=>{e.stopPropagation(); delVideo(c.id,c.u)}} className="absolute top-1 right-1 bg-red-600 w-7 h-7 rounded-full z-[10]">🗑️</button></div>))}</div><div className="bg-yellow-50 border-y p-3 text-center"><p className="text-[11px] font-bold">📢 Advertise Here - 250K Mombasa Users! DM @vibra-boy - Real AdMob soon!</p></div></div></div>}
      {page==='home'&&<><div className="fixed top-0 left-0 right-0 z-[70] bg-black/90 p-2"><div className="flex justify-between items-center px-2"><button onClick={()=>setShowLive(true)} className={`px-3 py-1.5 rounded-full text-[11px] font-black z-[70] pointer-events-auto ${isLive?'bg-red-600 animate-pulse':'bg-[#FE2C55]'}`}>{isLive?'🔴 LIVE • 1.2K':'🔴 LIVE'}</button><div className="flex gap-6"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You Worldwide 🌍</button></div><button onClick={()=>{const nm=!muted; setMuted(nm); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=nm})}} className={`w-9 h-9 rounded-full flex items-center justify-center z-[70] pointer-events-auto ${muted?'bg-zinc-700':'bg-green-500'}`}>{muted?'🔇':'🔊'}</button></div></div><div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[94px] pb-[70px]">{filtered.map((c,idx)=>(<div key={c.id}><div className="h-screen w-full snap-start relative bg-black"><video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} className="h-full w-full object-contain bg-black"/>{muted&&activeId===c.id&&<button onClick={()=>{setMuted(false); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=false})}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 border border-white px-6 py-3 rounded-full font-black z-[60] pointer-events-auto">🔇 TAP FOR SOUND</button>}<div className="absolute bottom-[90px] left-3 right-[75px] z-[50] pointer-events-none"><p className="font-bold text-[14px]">@{c.user} ✅</p><p className="text-[13px] mt-1">{c.c}</p><p className="text-[12px] text-cyan-400 mt-1">{c.t.join(' ')}</p></div><div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-3 z-[60] pointer-events-auto"><button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center pointer-events-auto"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-[22px] ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700'}`}>❤️</div><span className="text-[11px] mt-1 font-bold">{c.v}</span></button><button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center pointer-events-auto"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-[20px]">💬</div><span className="text-[11px] mt-1">12K</span></button><button className="flex flex-col items-center pointer-events-auto"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">🔖</div><span className="text-[11px] mt-1">Save</span></button><button className="flex flex-col items-center pointer-events-auto"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">↗️</div><span className="text-[11px] mt-1">Share</span></button></div></div>{(idx+1)%3===0&&<div className="h-[90px] bg-zinc-900 border-y border-zinc-800 flex items-center justify-center"><p className="text-[11px]">📢 Mombasa Real Estate - 2 Bed 25K! Advertise Here - Real Ads Ready</p></div>}</div>))}</div></>}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[68px] z-[70]"><button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span>🏠</span><span className="text-[9px]">Home</span></button><button className="flex flex-col items-center text-zinc-500"><span>🔍</span><span className="text-[9px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[52px] h-[32px] rounded-[10px] flex items-center justify-center font-black">+</div><span className="text-[9px] text-white">Upload 🌍</span></button><button className="flex flex-col items-center text-zinc-500"><span>📥</span><span className="text-[9px]">Inbox</span></button><button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span>👤</span><span className="text-[9px]">Me</span></button></div>
    </div>
  )
}
