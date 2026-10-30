// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route=createFileRoute('/')({component:Vibra})
function Vibra(){
  const [all,setAll]=useState([
    {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Watu wa Mombasa',t:['#vibra','#mombasa'],user:'vibra_boy',v:'699.3K'},
    {id:'2',u:'https://www.w3schools.com/html/movie.mp4',k:'video',c:'Love story bear',t:['#love'],user:'vibra_boy',v:'707.6K'},
    {id:'3',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Data Saver ON',t:['#vibra'],user:'mombasa_star',v:'254K'},
  ])
  const [tab,setTab]=useState('foryou')
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [page,setPage]=useState('home')
  const [activeId,setActiveId]=useState('1')
  const [showCom,setShowCom]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [newCap,setNewCap]=useState('')
  const [newTags,setNewTags]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newKind,setNewKind]=useState('video')
  const [following,setFollowing]=useState(new Set(['mombasa_star']))
  const fileRef=useRef(null)
  const vRefs=useRef({})
  const meVRefs=useRef({})

  // HOME: only one video plays at a time
  useEffect(()=>{
    if(page!=='home')return
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        const id=e.target.getAttribute('data-vid')
        const vid=vRefs.current[id]
        if(!vid)return
        if(e.isIntersecting && e.intersectionRatio>0.6){
          setActiveId(id)
          vid.play().catch(()=>{})
        } else {
          vid.pause()
          vid.currentTime=0
        }
      })
    },{threshold:0.6})
    Object.values(vRefs.current).forEach(el=>{if(el)obs.observe(el)})
    return ()=>obs.disconnect()
  },[all,page,tab])

  // ME: play all thumbnails + stop HOME sound when entering ME
  useEffect(()=>{
    if(page==='me'){
      // Kata sauti ya HOME mara moja!
      Object.values(vRefs.current).forEach(v=>{if(v){v.pause(); v.muted=true}})
      setMuted(true)
      // Cheza thumbnails za ME
      setTimeout(()=>{
        Object.values(meVRefs.current).forEach(v=>{
          if(v){v.muted=true; v.play().catch(()=>{})}
        })
      },100)
    } else {
      // Ukitoka ME, pause Me videos
      Object.values(meVRefs.current).forEach(v=>{if(v)v.pause()})
    }
  },[page,all])

  const filtered=tab==='following'?all.filter(x=>following.has(x.user)):all
  const myVideos=all.filter(x=>x.user==='vibra_boy')
  
  const handleUpload=(e)=>{
    const f=e.target.files?.[0]
    if(!f)return
    const url=URL.createObjectURL(f)
    setNewUrl(url)
    setNewKind(f.type.startsWith('image')?'image':'video')
    setShowUp(true)
  }
  const saveVideo=()=>{
    const tags=newTags.split(' ').filter(t=>t.startsWith('#'))
    const cap=newCap||'My Vibra video'
    const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:cap,t:tags.length?tags:['#vibra'],user:'vibra_boy',v:'0'}
    setAll([vid,...all])
    setShowUp(false)
    setNewCap('');setNewTags('');setNewUrl('')
    setPage('home')
  }
  const delVideo=(id,url)=>{
    if(!confirm('Delete hii video?'))return
    try{if(url.startsWith('blob:'))URL.revokeObjectURL(url)}catch{}
    setAll(all.filter(x=>x.id!==id))
  }
  const toggleMute=()=>{
    const newMuted=!muted
    setMuted(newMuted)
    Object.values(vRefs.current).forEach(v=>{if(v)v.muted=newMuted})
    if(!newMuted && vRefs.current[activeId])vRefs.current[activeId].play().catch(()=>{})
  }

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4"><p className="font-bold">💬 Comments</p><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕ Cancel</button><button onClick={saveVideo} className="bg-[#FE2C55] px-5 py-1.5 rounded-full font-bold">Post</button></div>{newKind==='image'?<img src={newUrl} className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Add caption..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/><input value={newTags} onChange={e=>setNewTags(e.target.value)} placeholder="#vibra #mombasa" className="mt-3 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none border border-cyan-500/30"/></div>}

      {page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pb-[70px] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b"><span onClick={()=>setPage('home')} className="text-[18px]">←</span><p className="font-bold text-[16px]">@vibra-boy</p><span>⋮</span></div>
        <div className="flex justify-around mt-4 px-8"><div className="text-center"><p className="font-black text-[16px]">10K</p><p className="text-[11px] text-gray-500">Following</p></div><div className="text-center border-l border-gray-200 pl-8"><p className="font-black text-[16px]">250.8K</p><p className="text-[11px] text-gray-500">Followers</p></div><div className="text-center border-l border-gray-200 pl-8"><p className="font-black text-[16px]">2.0M</p><p className="text-[11px] text-gray-500">Likes</p></div></div>
        <div className="flex gap-2 px-4 mt-4"><button className="flex-1 bg-gray-100 py-2 rounded-[6px] font-medium text-[14px]">Following ✓</button><button className="bg-gray-100 w-10 rounded-[6px]">👤+</button></div>
        <div className="flex border-b border-gray-200 mt-4"><button className="flex-1 py-3 font-bold text-[14px] border-b-2 border-black">☰ Videos {myVideos.length}</button><button className="flex-1 py-3 text-gray-400 text-[14px]">♡ {likes.size} Liked</button></div>
        <div className="grid grid-cols-2 gap-[2px] bg-gray-200">
          {myVideos.map(c=>(
            <div key={c.id} className="aspect-[9/16] bg-black relative">
              <video ref={el=>meVRefs.current[c.id]=el} src={c.u} loop muted autoPlay playsInline preload="auto" className="w-full h-full object-cover" onLoadedData={e=>e.currentTarget.play().catch(()=>{})}/>
              <div className="absolute bottom-1 left-1 text-white text-[11px] font-bold bg-black/50 px-1 rounded">▶ {c.v}</div>
              <button onClick={()=>delVideo(c.id,c.u)} className="absolute top-1 right-1 bg-black/70 w-8 h-8 rounded-full text-white">🗑️</button>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-white/80 text-[24px]">▶</span></div>
            </div>
          ))}
        </div>
      </div>}

      {page==='home'&&<>
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 p-2">
        <div className="flex justify-between items-center mt-1 px-2"><button className="bg-[#FE2C55] px-3 py-1 rounded-full text-[11px] font-black">🔴 LIVE</button><div className="flex gap-6"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button></div><button onClick={toggleMute} className={`px-3 py-1 rounded-full text-[11px] font-black ${muted?'bg-zinc-700':'bg-green-500'}`}>{muted?'🔇':'🔊'}</button></div>
      </div>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[50px] pb-[66px]">
        {filtered.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-black">
            <video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} preload="auto" className="h-full w-full object-contain bg-black" onClick={toggleMute}/>
            {muted&&activeId===c.id&&<button onClick={toggleMute} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border-2 border-white/50 px-8 py-5 rounded-full text-[20px] font-black">🔇 TAP FOR SOUND</button>}
            {activeId===c.id&&<div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-[10px]">{muted?'Muted - Tap to unmute':'🔊 Playing'}</div>}
            <div className="absolute bottom-[100px] left-3 right-20"><p className="font-bold text-[14px]">@{c.user} ✅</p><p className="text-[13px] mt-1">{c.c}</p></div>
            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-3"><button onClick={()=>{const s=new Set(likes); if(s.has(c.id))s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[10px]">{c.v}</span></button><button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center">💬</div></button></div>
          </div>
        ))}
      </div>
      </>}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[64px] z-50">
        <button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span>🏠</span><span className="text-[9px]">Home</span></button>
        <button onClick={()=>setPage('home')} className="flex flex-col items-center text-zinc-500"><span>🔍</span><span className="text-[9px]">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[48px] h-[32px] rounded-[10px] flex items-center justify-center font-black">+</div><span className="text-[9px] text-white">Upload</span></button>
        <button className="flex flex-col items-center text-zinc-500"><span>📥</span><span className="text-[9px]">Inbox</span></button>
        <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span>👤</span><span className="text-[9px]">Me</span></button>
      </div>
    </div>
  )
}
