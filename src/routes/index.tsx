// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})

function Vibra(){
  const defaultVideos=[
    {id:'1',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',c:'Watu wa Mombasa 🔥 faraja gar #vibra #mombasa #viral #fyp',t:['#vibra','#mombasa'],user:'vibra-boy',v:'699.3K',lyrics:'Watu wa Mombasa, tunawaka moto'},
    {id:'2',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',c:'huyu nae ni kama baba angu anatudia kila neno #ndaro #vibra',t:['#ndaro','#vibra'],user:'vibra-boy',v:'707.6K',lyrics:'huyu nae ni kama baba angu anatudia kila neno'},
    {id:'3',u:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',c:'Mombasa Nights',t:['#mombasa'],user:'mombasa_star',v:'254K',lyrics:'Usiku wa Mombasa'},
  ]
  const [all,setAll]=useState(()=>{
    try{
      const s=localStorage.getItem('vibra_final_v5')
      if(s){
        const p=JSON.parse(s)
        if(p.length>0) return [...p,...defaultVideos]
      }
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
  const [exploreQ,setExploreQ]=useState('')
  const [isLive,setIsLive]=useState(false)
  const [newCap,setNewCap]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newFile,setNewFile]=useState(null)
  const [newKind,setNewKind]=useState('video')
  const [uploading,setUploading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [following]=useState(new Set(['mombasa_star']))
  const fileRef=useRef(null)
  const vRefs=useRef({})

  useEffect(()=>{
    if(page!=='home' && page!=='explore') return
    const obs=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        const id=en.target.getAttribute('data-vid')
        const vid=vRefs.current[id]
        if(!vid) return
        if(en.isIntersecting && en.intersectionRatio>0.5){
          setActiveId(id)
          if(!document.hidden) vid.play().catch(()=>{})
        } else {vid.pause()}
      })
    },{threshold:0.5})
    Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el)})
    return ()=>obs.disconnect()
  },[all,page,tab,searchQ,exploreQ])

  useEffect(()=>{
    const pauseAll=()=>{Object.values(vRefs.current).forEach(v=>{if(v) v.pause()})}
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
    const q=page==='explore'?exploreQ:searchQ
    if(q) f=f.filter(x=>x.c.toLowerCase().includes(q.toLowerCase()) || x.t.join('').toLowerCase().includes(q.toLowerCase()))
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
    const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra 🔥 #vibra #mombasa #fyp',t:['#vibra','#mombasa'],user:'vibra-boy',v:'0',lyrics:newCap||'Vibra lyrics 🔥'}
    const newAll=[vid,...all]; setAll(newAll)
    const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))
    try{localStorage.setItem('vibra_final_v5',JSON.stringify(worldwideOnly))}catch{}
    setProgress(100)
    setTimeout(()=>{
      setUploading(false); setShowUp(false); setNewCap('');setNewUrl('');setNewFile(null);setProgress(0); setPage('me')
      alert('VIDEO IMEUPLOAD!')
    },300)
  }

  const delVideo=(id,url)=>{
    if(!confirm('Futa?')) return
    try{if(url.startsWith('blob:')) URL.revokeObjectURL(url)}catch{}
    const newAll=all.filter(x=>x.id!==id); setAll(newAll)
    const worldwideOnly=newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))
    try{localStorage.setItem('vibra_final_v5',JSON.stringify(worldwideOnly))}catch{}
    setShowMeVideo(null)
  }

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      {showSearch&&<div className="absolute top-0 left-0 right-0 z-[120] bg-black p-3 flex gap-2 border-b border-zinc-800"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} autoFocus placeholder="Search faraja gar..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2.5 text-[13px] outline-none"/><button onClick={()=>{setShowSearch(false); setSearchQ('')}} className="bg-zinc-700 px-4 rounded-full">X</button></div>}
      {showLyrics&&<div className="absolute inset-0 z-[115] bg-black/90 flex items-end"><div className="bg-zinc-900 w-full rounded-t-[20px] p-5"><div className="flex justify-between"><p className="font-bold">Lyrics</p><button onClick={()=>setShowLyrics(null)} className="bg-zinc-800 w-8 h-8 rounded-full">X</button></div><p className="mt-4 text-[14px]">{all.find(v=>v.id===showLyrics)?.lyrics}</p></div></div>}
      <div className="fixed top-[44px] left-0 right-0 z-[65] bg-[#FE2C55] h-[32px] flex items-center justify-center"><p className="text-[10px] font-bold">REAL ADS - Mombasa Businesses - 250K views</p></div>
      {showLive&&<div className="absolute inset-0 z-[110] bg-black flex flex-col"><div className="flex justify-between p-4"><button onClick={()=>setShowLive(false)} className="bg-zinc-800 w-8 h-8 rounded-full">X</button><p className="font-bold">LIVE Worldwide</p><div className="w-8"></div></div><div className="flex-1 bg-zinc-900 m-4 rounded-[16px] flex flex-col items-center justify-center p-4"><div className="w-full h-[60%] bg-black rounded-xl flex items-center justify-center border-2 border-[#FE2C55] text-[60px]">📹</div><button onClick={()=>{setIsLive(true); setShowLive(false)}} className="mt-6 bg-[#FE2C55] w-full py-3 rounded-full font-black">START LIVE</button></div></div>}
      {showMeVideo&&<div className="absolute inset-0 z-[105] bg-black flex flex-col"><div className="flex justify-between p-3"><button onClick={()=>setShowMeVideo(null)} className="bg-zinc-700 w-8 h-8 rounded-full">X</button><p className="font-bold text-[13px]">@{showMeVideo.user}</p><button onClick={()=>delVideo(showMeVideo.id,showMeVideo.u)} className="bg-red-600 w-8 h-8 rounded-full">🗑️</button></div><div className="flex-1 relative bg-black"><video src={showMeVideo.u} autoPlay loop controls playsInline className="w-full h-full object-contain"/><div className="absolute bottom-20 left-3 right-20"><p className="font-bold">@{showMeVideo.user}</p><p className="text-[13px]">{showMeVideo.c}</p></div></div></div>}
      {showList&&<div className="absolute inset-0 z-[100] bg-black/80 flex items-end"><div className="bg-white text-black w-full rounded-t-[20px] p-4"><div className="flex justify-between"><p className="font-bold">{showList}</p><button onClick={()=>setShowList(null)} className="bg-gray-100 w-8 h-8 rounded-full">X</button></div><p className="mt-4 text-[13px]">Working!</p></div></div>}
      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4 z-[91]"><div className="flex justify-between"><p className="font-bold">Comments</p><button onClick={()=>setShowCom(null)} className="bg-zinc-800 w-7 h-7 rounded-full">X</button></div><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>!uploading&&setShowUp(false)}>Cancel</button><button onClick={saveVideo} disabled={uploading} className="bg-[#FE2C55] px-6 py-2 rounded-full font-bold text-[13px]">{uploading?`${progress}%`:'Post Worldwide'}</button></div><div className="flex-1 mt-4 flex flex-col">{newKind==='image'?<img src={newUrl} className="w-full h-[50%] object-contain bg-zinc-900 rounded-xl"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[50%] object-contain bg-zinc-900 rounded-xl"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption + lyrics..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/>{uploading&&<div className="mt-4"><div className="w-full bg-zinc-800 h-2 rounded-full"><div className="bg-[#FE2C55] h-2 rounded-full" style={{width:`${progress}%`}}></div></div><p className="text-[11px] text-center mt-2">{progress}%</p></div>}</div></div>}
      {page==='explore'&&<div className="absolute inset-0 z-20 bg-black flex flex-col pt-[76px] pb-[68px]"><div className="p-3 flex gap-2"><input value={exploreQ} onChange={e=>setExploreQ(e.target.value)} placeholder="Explore #viral #comedy..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2.5 text-[13px] outline-none"/><button onClick={()=>setExploreQ('')} className="bg-zinc-700 px-3 rounded-full text-[12px]">Clear</button></div><div className="flex-1 overflow-y-auto p-1"><div className="grid grid-cols-3 gap-[2px]">{filtered().map(c=>(<div key={c.id} onClick={()=>{setPage('home'); setActiveId(c.id)}} className="aspect-[9/16] bg-zinc-900 relative"><video src={c.u} muted className="w-full h-full object-cover"/><div className="absolute bottom-1 left-1 text-[9px] bg-black/60 px-1 rounded">▶ {c.v}</div></div>))}</div></div></div>}
      {page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black flex flex-col"><div className="flex items-center justify-between px-4 py-3 border-b"><button onClick={()=>setPage('home')}>←</button><p className="font-bold text-[14px]">@vibra-boy</p><button onClick={()=>setShowSearch(true)}>🔍</button></div><div className="flex-1 overflow-y-auto pb-[70px]"><div className="flex justify-around mt-4"><button onClick={()=>setShowList('Following')} className="text-center"><p className="font-black">10K</p><p className="text-[11px] text-gray-500">Following</p></button><button onClick={()=>setShowList('Followers')} className="text-center border-l pl-8"><p className="font-black">250.8K</p><p className="text-[11px] text-gray-500">Followers</p></button><button onClick={()=>setShowList('Likes')} className="text-center border-l pl-8"><p className="font-black">2.0M</p><p className="text-[11px] text-gray-500">Likes</p></button></div><div className="grid grid-cols-2 gap-[1px] bg-gray-200 mt-4">{myVideos.map(c=>(<div key={c.id} onClick={()=>setShowMeVideo(c)} className="aspect-[9/16] bg-black relative"><video src={c.u} loop muted autoPlay playsInline className="w-full h-full object-cover pointer-events-none"/><div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/70 px-1 rounded">▶ {c.v}</div><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-white/25 w-10 h-10 rounded-full flex items-center justify-center">▶</div></div><button onClick={(e)=>{e.stopPropagation(); delVideo(c.id,c.u)}} className="absolute top-1 right-1 bg-red-600 w-7 h-7 rounded-full">🗑️</button></div>))}</div></div></div>}
      {page==='home'&&<>
        <div className="fixed top-0 left-0 right-0 z-[70] bg-black p-2">
          <div className="flex justify-between items-center px-2">
            <button onClick={()=>setShowLive(true)} className={`px-3 py-1.5 rounded-full text-[11px] font-black ${isLive?'bg-red-600 animate-pulse':'bg-[#FE2C55]'}`}>{isLive?'LIVE 1.2K':'LIVE'}</button>
            <div className="flex gap-5">
              <button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
              <button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setShowSearch(true)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">🔍</button>
              <button onClick={()=>{const nm=!muted; setMuted(nm); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=nm})}} className={`w-8 h-8 rounded-full flex items-center justify-center ${muted?'bg-zinc-700':'bg-green-600'}`}>{muted?'🔇':'🔊'}</button>
            </div>
          </div>
        </div>
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[76px] pb-[68px] bg-black">
          {filtered().map((c,idx)=>(
            <div key={c.id}>
              <div className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} autoPlay className="h-full w-full object-contain bg-black" onLoadedData={e=>{if(c.id===activeId && !document.hidden) e.currentTarget.play().catch(()=>{})}}/>
                {muted&&activeId===c.id&&<button onClick={()=>{setMuted(false); Object.values(vRefs.current).forEach(v=>{if(v)v.muted=false})}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 border-2 border-white px-6 py-3 rounded-full font-black z-[60] pointer-events-auto text-[13px]">TAP FOR SOUND</button>}
                <div className="absolute bottom-[100px] left-3 right-[75px] z-[50] pointer-events-none"><p className="font-bold text-[14px]">@{c.user}</p><p className="text-[13px] mt-1">{c.c}</p><p className="text-[12px] text-cyan-400 mt-1">{c.t.join(' ')}</p></div>
                <div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-3 z-[60]">
                  <button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[24px] ${likes.has(c.id)?'bg-[#FE2C55]':'bg-[#3a3a3a]'}`}>❤️</div><span className="text-[11px] mt-1 font-bold bg-black/50 px-1 rounded">{likes.has(c.id)?'1':c.v}</span></button>
                  <button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[22px]">💬</div><span className="text-[11px] mt-1 bg-black/50 px-1 rounded">12K</span></button>
                  <button onClick={()=>{const s=new Set(saved); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaved(s)}} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] ${saved.has(c.id)?'bg-yellow-500':'bg-[#3a3a3a]'}`}>🔖</div><span className="text-[11px] mt-1">Save</span></button>
                  <button onClick={()=>{if(navigator.share) navigator.share({title:'Vibra',text:c.c}); else alert('Shared!')}} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[18px]">↗️</div><span className="text-[11px] mt-1">Share</span></button>
                  <button onClick={()=>setShowLyrics(c.id)} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className="w-[48px] h-[48px] rounded-full bg-[#3a3a3a] flex items-center justify-center text-[16px]">🎵</div><span className="text-[10px] mt-1">Lyrics</span></button>
                  {c.user==='vibra-boy'&&<button onClick={()=>delVideo(c.id,c.u)} className="flex flex-col items-center pointer-events-auto active:scale-90"><div className="w-[48px] h-[48px] rounded-full bg-red-600 flex items-center justify-center text-[16px]">🗑️</div><span className="text-[10px] mt-1">Del</span></button>}
                </div>
              </div>
              {(idx+1)%3===0&&<div className="h-[70px] bg-[#FE2C55] flex items-center justify-center px-2"><p className="text-[11px] font-bold">Mombasa Business - Advertise Here! 250K views</p></div>}
            </div>
          ))}
        </div>
      </>}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[68px] z-[70]">
        <button onClick={()=>{setPage('home'); setSearchQ(''); setExploreQ('')}} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span className="text-[18px]">🏠</span><span className="text-[9px] mt-0.5">Home</span></button>
        <button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'text-zinc-500'}`}><span className="text-[18px]">🔍</span><span className="text-[9px] mt-0.5">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[52px] h-[30px] rounded-[10px] flex items-center justify-center font-black text-[20px]">+</div><span className="text-[9px] text-white mt-0.5">Upload</span></button>
        <button onClick={()=>setShowCom('inbox')} className="flex flex-col items-center text-zinc-500"><span className="text-[18px]">📥</span><span className="text-[9px] mt-0.5">Inbox</span></button>
        <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span className="text-[18px]">👤</span><span className="text-[9px] mt-0.5">Me</span></button>
      </div>
    </div>
  )
}
