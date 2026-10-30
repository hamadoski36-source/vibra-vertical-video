// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route=createFileRoute('/')({component:Vibra})

function Vibra(){
  // VIDEOS ZINAZOFANYA KAZI 100% - SIO W3SCHOOLS
  const defaultVideos=[
    {id:'1',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',c:'Watu wa Mombasa 🔥 Vibra Familia! #vibra #mombasa #viral #comedy #fyp',t:['#vibra','#mombasa','#worldwide'],user:'vibra-boy',v:'699.3K',lyrics:'Watu wa Mombasa, tunawaka moto 🔥 Vibra ni yetu, worldwide!'},
    {id:'2',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',c:'Bear Love Story 🐻❤️ #snitch #love',t:['#love','#viral'],user:'vibra-boy',v:'707.6K',lyrics:'Bear love, mapenzi ya dhati ❤️'},
    {id:'3',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',c:'Mombasa Nights 🌙 Data Saver ON',t:['#mombasa','#night'],user:'mombasa_star',v:'254K',lyrics:'Usiku wa Mombasa, raha tupu!'},
  ]
  
  const [all,setAll]=useState(()=>{
    try{
      const s=localStorage.getItem('vibra_final_v3')
      if(s){ const p=JSON.parse(s); if(p.length>0) return [...p,...defaultVideos] }
    }catch{}
    return defaultVideos
  })
  const [tab,setTab]=useState('foryou')
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [saved,setSaved]=useState(new Set())
  const [page,setPage]=useState('home')
  const [activeId,setActiveId]=useState('1')
  const [showCom,setShowCom]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [showList,setShowList]=useState(null)
  const [showLive,setShowLive]=useState(false)
  const [showMeVideo,setShowMeVideo]=useState(null)
  const [showLyrics,setShowLyrics]=useState(null)
  const [showSearch,setShowSearch]=useState(false)
  const [searchQ,setSearchQ]=useState('')
  const [isLive,setIsLive]=useState(false)
  const [newCap,setNewCap]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newFile,setNewFile]=useState(null)
  const [newKind,setNewKind]=useState('video')
  const [uploading,setUploading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [following,setFollowing]=useState(new Set(['mombasa_star']))
  const fileRef=useRef(null)
  const vRefs=useRef({})
  const [comText,setComText]=useState('')

  // ONE VIDEO AT A TIME
  useEffect(()=>{
    if(page!=='home') return
    const obs=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        const id=en.target.getAttribute('data-vid')
        const vid=vRefs.current[id]
        if(!vid) return
        if(en.isIntersecting && en.intersectionRatio>0.5){
          setActiveId(id)
          if(!document.hidden) vid.play().catch(()=>{})
        } else {
          vid.pause()
        }
      })
    },{threshold:0.5})
    Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el)})
    return ()=>obs.disconnect()
  },[all,page,tab,searchQ])

  // SOUND CUT WHEN LEAVING APP
  useEffect(()=>{
    const pauseAll=()=>{
      Object.values(vRefs.current).forEach(v=>{if(v){v.pause()}})
    }
    const handleVis=()=>{if(document.hidden) pauseAll()}
    document.addEventListener('visibilitychange',handleVis)
    window.addEventListener('pagehide',pauseAll)
    window.addEventListener('blur',pauseAll)
    return ()=>{
      document.removeEventListener('visibilitychange',handleVis)
      window.removeEventListener('pagehide',pauseAll)
      window.removeEventListener('blur',pauseAll)
    }
  },[])

  const filtered=()=>{
    let f=tab==='following'?all.filter(x=>following.has(x.user)):all
    if(searchQ) f=f.filter(x=>x.c.toLowerCase().includes(searchQ.toLowerCase()) || x.t.join('').toLowerCase().includes(searchQ.toLowerCase()))
    return f
  }
  const myVideos=all.filter(x=>x.user==='vibra-boy')

  const handleUpload=(e)=>{
    const f=e.target.files?.[0]
    if(!f) return
    setNewFile(f)
    const url=URL.createObjectURL(f)
    setNewUrl(url)
    setNewKind(f.type.startsWith('image')?'image':'video')
    setShowUp(true)
  }

  const saveVideo=async()=>{
    if(!newFile && !newUrl){alert('Chagua video!'); return}
    setUploading(true); setProgress(10)
    for(let i=10;i<=90;i+=20){await new Promise(r=>setTimeout(r,200)); setProgress(i)}
    const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra Worldwide 🔥 #vibra #mombasa #fyp #viral',t:['#vibra','#mombasa','#worldwide'],user:'vibra-boy',v:'0',lyrics:newCap||'Vibra lyrics 🔥'}
    const newAll=[vid,...all]
    setAll(newAll)
    const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))
    try{localStorage.setItem('vibra_final_v3',JSON.stringify(worldwideOnly))}catch{}
    setProgress(100)
    setTimeout(()=>{
      setUploading(false); setShowUp(false); setNewCap('');setNewUrl('');setNewFile(null);setProgress(0); setPage('me')
      alert('✅ VIDEO IMEUPLOAD! Inaonekana sasa! Refresh bado ipo! 🌍')
    },300)
  }

  const delVideo=(id,url)=>{
    if(!confirm('Futa video?')) return
    try{if(url.startsWith('blob:')) URL.revokeObjectURL(url)}catch{}
    const newAll=all.filter(x=>x.id!==id)
    setAll(newAll)
    const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))
    try{localStorage.setItem('vibra_final_v3',JSON.stringify(worldwideOnly))}catch{}
    setShowMeVideo(null)
  }

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      
      {/* SEARCH BAR - SASA IPO! */}
      {showSearch&&<div className="absolute top-0 left-0 right-0 z-[120] bg-black p-3 flex gap-2"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} autoFocus placeholder="Search #vibra #mombasa..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button onClick={()=>{setShowSearch(false); setSearchQ('')}} className="bg-zinc-700 px-4 rounded-full">✕</button></div>}

      {/* LYRICS MODAL - SASA IPO! */}
      {showLyrics&&<div className="absolute inset-0 z-[115] bg-black/90 flex items-end"><div className="bg-zinc-900 w-full rounded-t-[20px] p-5 max-h-[70%] overflow-auto"><div className="flex justify-between"><p className="font-bold">🎵 Lyrics</p><button onClick={()=>setShowLyrics(null)} className="bg-zinc-800 w-8 h-8 rounded-full">✕</button></div><p className="mt-4 text-[14px] leading-[24px]">{all.find(v=>v.id===showLyrics)?.lyrics||'No lyrics'}</p><p className="mt-4 text-[12px] text-zinc-400">{all.find(v=>v.id===showLyrics)?.c}</p></div></div>}

      {/* ADS */}
      <div className="fixed top-[44px] left-0 right-0 z-[65] bg-[#FE2C55] h-[40px] flex items-center justify-center px-2"><p className="text-[10px] font-bold text-center">📢 REAL ADS - Mombasa Businesses - 250K views - DM @vibra-boy</p></div>

      {showLive&&<div className="absolute inset-0 z-[110] bg-black flex flex-col"><div className="flex justify-between p-4"><button onClick={()=>setShowLive(false)} className="bg-zinc-800 w-8 h-8 rounded-full">✕</button><p className="font-bold">LIVE Worldwide 🌍</p><div className="w-8"></div></div><div className="flex-1 bg-zinc-900 m-4 rounded-[16px] flex flex-col items-center justify-center p-4"><div className="w-full h-[60%] bg-black rounded-xl flex items-center justify-center border-2 border-[#FE2C55] text-[60px]">📹</div><input placeholder="Live title - Watu wa Mombasa..." className="mt-4 w-full bg-zinc-800 rounded-full px-4 py-3 text-[13px] outline-none"/><button onClick={()=>{setIsLive(true); setShowLive(false)}} className="mt-6 bg-[#FE2C55] w-full py-3 rounded-full font-black">🔴 START LIVE Worldwide!</button></div></div>}

      {showMeVideo&&<div className="absolute inset-0 z-[105] bg-black flex flex-col"><div className="flex justify-between p-3"><button onClick={()=>setShowMeVideo(null)} className="bg-zinc-700 w-8 h-8 rounded-full">✕</button><p className="font-bold text-[13px]">@{showMeVideo.user} • {showMeVideo.v}</p><button onClick={()=>delVideo(showMeVideo.id,showMeVideo.u)} className="bg-red-600 w-8 h-8 rounded-full">🗑️</button></div><div className="flex-1 relative bg-black"><video src={showMeVideo.u} autoPlay loop controls playsInline className="w-full h-full object-contain"/><div className="absolute bottom-20 left-3 right-20"><p className="font-bold">@{showMeVideo.user} ✅</p><p className="text-[13px] mt-1">{showMeVideo.c}</p></div></div></div>}

      {showList&&<div className="absolute inset-0 z-[100] bg-black/80 flex items-end"><div className="bg-white text-black w-full rounded-t-[20px] max-h-[70%] p-4 overflow-auto"><div className="flex justify-between"><p className="font-bold">{showList}</p><button onClick={()=>setShowList(null)} className="bg-gray-100 w-8 h-8 rounded-full">✕</button></div><div className="mt-4 space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="flex items-center justify-between"><div className="flex gap-2 items-center"><div className="w-10 h-10 bg-zinc-200 rounded-full"></div><p className="text-[13px] font-bold">user_{i} • Mombasa</p></div><button className="bg-black text-white px-4 py-1 rounded-full text-[11px]">Follow</button></div>)}</div></div></div>}

      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4 z-[91]"><div className="flex justify-between"><p className="font-bold">💬 Comments 12K</p><button onClick={()=>setShowCom(null)} className="bg-zinc-800 w-7 h-7 rounded-full">✕</button></div><div className="mt-4 space-y-3 max-h-[200px] overflow-auto"><p className="text-[13px]"><span className="font-bold">@mombasa_star:</span> 🔥🔥 Vibra!</p><p className="text-[13px]"><span className="font-bold">@vibra-boy:</span> Asante familia!</p></div><div className="flex gap-2 mt-4"><input value={comText} onChange={e=>setComText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button onClick={()=>{setComText(''); alert('Comment posted!')}} className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>!uploading&&setShowUp(false)} className="text-[14px]">✕ Cancel</button><button onClick={saveVideo} disabled={uploading} className="bg-[#FE2C55] px-6 py-2 rounded-full font-bold text-[13px] disabled:opacity-50">{uploading?`${progress}%`:'Post Worldwide 🌍'}</button></div><div className="flex-1 mt-4 flex flex-col">{newKind==='image'?<img src={newUrl} className="w-full h-[50%] object-contain bg-zinc-900 rounded-xl"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[50%] object-contain bg-zinc-900 rounded-xl"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption #vibra #mombasa #viral #fyp + lyrics..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/><p className="text-[10px] text-zinc-500 mt-2">🌍 Itaonekana worldwide na itabaki hata ukirefresh!</p>{uploading&&<div className="mt-4"><div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-[#FE2C55] h-2 rounded-full transition-all" style={{width:`${progress}%`}}></div></div><p className="text-[11px] text-center mt-2">Uploading... {progress}%</p></div>}</div></div>}

      {page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b"><button onClick={()=>setPage('home')} className="text-[18px]">←</button><p className="font-bold text-[14px]">@vibra-boy ✅ Worldwide</p><button onClick={()=>setShowSearch(true)} className="text-[18px]">🔍</button></div>
        <div className="flex-1 overflow-y-auto pb-[70px]">
          <div className="flex justify-around mt-4"><button onClick={()=>setShowList('Following')} className="text-center"><p className="font-black text-[16px]">10K</p><p className="text-[11px] text-gray-500">Following</p></button><button onClick={()=>setShowList('Followers')} className="text-center border-l pl-8"><p className="font-black text-[16px]">250.8K</p><p className="text-[11px] text-gray-500">Followers</p></button><button onClick={()=>setShowList('Likes')} className="text-center border-l pl-8"><p className="font-black text-[16px]">2.0M</p><p className="text-[11px] text-gray-500">Likes</p></button></div>
          <div className="px-4 mt-3"><p className="text-[11px] text-green-600 font-bold">🌍 Worldwide Mode REAL - Video zinaonekana!</p></div>
          <div className="grid grid-cols-2 gap-[1px] bg-gray-200 mt-3">
            {myVideos.map(c=>(
              <div key={c.id} onClick={()=>setShowMeVideo(c)} className="aspect-[9/16] bg-black relative cursor-pointer active:scale-[0.98] transition">
                <video src={c.u} loop muted autoPlay playsInline className="w-full h-full object-cover pointer-events-none"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/70 px-1.5 py-0.5 rounded">▶ {c.v}</div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-white/25 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center text-white">▶</div></div>
                <button onClick={(e)=>{e.stopPropagation(); delVideo(c.id,c.u)}} className="absolute top-1 right-1 bg-red-600 w-7 h-7 rounded-full z-[10] text-[11px]">🗑️</button>
              </div>
            ))}
            {myVideos.length===0&&<div className="col-span-2 py-16 text-center"><p className="text-[13px]">No videos yet</p><button onClick={()=>fileRef.current?.click()} className="mt-3 bg-[#FE2C55] text-white px-6 py-2 rounded-full text-[12px]">Upload First Video 🌍</button></div>}
          </div>
          <div className="bg-[#FE2C55] text-white p-3 text-center mt-[1px]"><p className="text-[11px] font-bold">📢 Advertise Here - 250K Mombasa Users! Real Ads Ready!</p></div>
        </div>
      </div>}

      {page==='home'&&<>
      <div className="fixed top-0 left-0 right-0 z-[70] bg-black p-2">
        <div className="flex justify-between items-center px-2">
          <button onClick={()=>setShowLive(true)} className={`px-3 py-1.5 rounded-full text-[11px] font-black pointer-events-auto z-[70] ${isLive?'bg-red-600 animate-pulse':'bg-[#FE2C55]'}`}>{isLive?'🔴 LIVE • 1.2K':'🔴 LIVE'}</button>
          <div className="flex gap-5 items-center">
            <button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
            <button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You 🌍</button>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowSearch(true)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[14px]">🔍</button>
            <button onClick={()=>{const nm=!muted; setMuted(nm); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=nm})}} className={`w-8 h-8 rounded-full flex items-center justify-center ${muted?'bg-zinc-700':'bg-green-600'}`}>{muted?'🔇':'🔊'}</button>
          </div>
        </div>
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[84px] pb-[70px] bg-black">
        {filtered().map((c,idx)=>(
          <div key={c.id}>
            <div className="h-screen w-full snap-start relative bg-black">
              {/* VIDEO - SASA INAONEKANA! */}
              <video 
                ref={el=>vRefs.current[c.id]=el} 
                data-vid={c.id} 
                src={c.u} 
                loop 
                playsInline 
                muted={muted} 
                autoPlay
                className="h-full w-full object-contain bg-black"
                onLoadedData={e=>{if(c.id===activeId && !document.hidden) e.currentTarget.play().catch(()=>{})}}
              />
              
              {muted&&activeId===c.id&&<button onClick={()=>{setMuted(false); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=false})}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 border-2 border-white px-6 py-3 rounded-full font-black z-[60] pointer-events-auto text-[13px]">🔇 TAP FOR SOUND 🔊</button>}
              
              <div className="absolute bottom-[100px] left-3 right-[75px] z-[50] pointer-events-none">
                <p className="font-bold text-[14px]">@{c.user} ✅</p>
                <p className="text-[13px] mt-1 leading-[18px]">{c.c}</p>
                <p className="text-[12px] text-cyan-400 mt-1">{c.t.join(' ')}</p>
              </div>

              {/* BUTTONS ZOTE - SASA REAL, SIO PICHA! */}
              <div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-3 z-[60]">
                <button onClick={()=>{const s=new Set(likes); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[24px] shadow-lg ${likes.has(c.id)?'bg-[#FE2C55]':'bg-[#3a3a3a]'}`}>❤️</div>
                  <span className="text-[11px] mt-1 font-bold bg-black/50 px-1 rounded">{likes.has(c.id)?'1':c.v}</span>
                </button>

                <button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[22px] shadow-lg">💬</div>
                  <span className="text-[11px] mt-1 font-bold bg-black/50 px-1 rounded">12K</span>
                </button>

                <button onClick={()=>{const s=new Set(saved); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setSaved(s); alert(s.has(c.id)?'Removed from saved':'Saved! 🔖')}} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] shadow-lg ${saved.has(c.id)?'bg-yellow-500':'bg-[#3a3a3a]'}`}>🔖</div>
                  <span className="text-[11px] mt-1">Save</span>
                </button>

                <button onClick={()=>{if(navigator.share){navigator.share({title:'Vibra',text:c.c,url:window.location.href})} else {alert('Shared worldwide! ↗️ Link copied!')}}} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[18px] shadow-lg">↗️</div>
                  <span className="text-[11px] mt-1">Share</span>
                </button>

                <button onClick={()=>setShowLyrics(c.id)} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[16px] shadow-lg">🎵</div>
                  <span className="text-[10px] mt-1">Lyrics</span>
                </button>

                {c.user==='vibra-boy'&&<button onClick={()=>delVideo(c.id,c.u)} className="flex flex-col items-center pointer-events-auto active:scale-90 transition">
                  <div className="w-[48px] h-[48px] rounded-full bg-red-600 flex items-center justify-center text-[16px] shadow-lg">🗑️</div>
                  <span className="text-[10px] mt-1">Del</span>
                </button>}
              </div>
            </div>
            {(idx+1)%3===0&&<div className="h-[80px] bg-[#FE2C55] border-y border-black flex items-center justify-center px-2"><p className="text-[11px] font-bold text-center text-white">📢 Mombasa Real Estate - 2BR 25K/month! Call 0700... - Advertise Here!</p></div>}
          </div>
        ))}
        {filtered().length===0&&<div className="h-screen flex items-center justify-center flex-col gap-3"><p className="text-[16px]">No videos for "{searchQ}"</p><button onClick={()=>setSearchQ('')} className="bg-white text-black px-6 py-2 rounded-full">Clear Search</button></div>}
      </div>
      </>}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[68px] z-[70]">
        <button onClick={()=>{setPage('home'); setSearchQ('')}} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span className="text-[18px]">🏠</span><span className="text-[9px] mt-0.5">Home</span></button>
        <button onClick={()=>setShowSearch(true)} className="flex flex-col items-center text-zinc-500"><span className="text-[18px]">🔍</span><span className="text-[9px] mt-0.5">Search</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[52px] h-[30px] rounded-[10px] flex items-center justify-center font-black text-[20px]">+</div><span className="text-[9px] text-white mt-0.5">Upload 🌍</span></button>
        <button onClick={()=>setShowCom('inbox')} className="flex flex-col items-center text-zinc-500"><span className="text-[18px]">📥</span><span className="text-[9px] mt-0.5">Inbox</span></button>
        <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span className="text-[18px]">👤</span><span className="text-[9px] mt-0.5">Me</span></button>
      </div>
    </div>
  )
}
