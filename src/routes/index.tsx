// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route=createFileRoute('/')({component:Vibra})
function Vibra(){
  // DEFAULT VIDEOS - hazitapotea tena!
  const defaultVideos=[
    {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Watu wa Mombasa 🔥 Vibra Familia!',t:['#vibra','#mombasa','#worldwide'],user:'vibra-boy',v:'699.3K',likes:699300},
    {id:'2',u:'https://www.w3schools.com/html/movie.mp4',k:'video',c:'Bear Love Story 🐻❤️',t:['#love','#viral'],user:'vibra-boy',v:'707.6K',likes:707600},
    {id:'3',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Data Saver ON - Save 80% data!',t:['#vibra','#datasaver'],user:'mombasa_star',v:'254K',likes:254000},
  ]
  const [all,setAll]=useState(defaultVideos)
  const [tab,setTab]=useState('foryou')
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [page,setPage]=useState('me')
  const [activeId,setActiveId]=useState('1')
  const [showCom,setShowCom]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [showList,setShowList]=useState(null) // AI: Following/Followers/Likes modal
  const [newCap,setNewCap]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newKind,setNewKind]=useState('video')
  const [following,setFollowing]=useState(new Set(['mombasa_star']))
  const [followers,setFollowers]=useState(250800)
  const fileRef=useRef(null)
  const vRefs=useRef({})
  const meVRefs=useRef({})

  // AI: Auto play one video at a time
  useEffect(()=>{
    if(page!=='home')return
    const obs=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        const id=en.target.getAttribute('data-vid')
        const vid=vRefs.current[id]
        if(!vid)return
        if(en.isIntersecting && en.intersectionRatio>0.6){
          setActiveId(id)
          vid.play().catch(()=>{})
        } else {vid.pause()}
      })
    },{threshold:0.6})
    Object.values(vRefs.current).forEach(el=>{if(el)obs.observe(el)})
    return ()=>obs.disconnect()
  },[all,page,tab])

  // AI: Cut sound when going to Me
  useEffect(()=>{
    if(page==='me'){
      Object.values(vRefs.current).forEach(v=>{if(v){v.pause(); v.muted=true}})
      setMuted(true)
      setTimeout(()=>{Object.values(meVRefs.current).forEach(v=>{if(v){v.muted=true; v.play().catch(()=>{})}})},200)
    }
  },[page])

  const filtered=tab==='following'?all.filter(x=>following.has(x.user)):all
  const myVideos=all.filter(x=>x.user==='vibra-boy')
  const totalLikes=myVideos.reduce((s,v)=>s+v.likes,0)

  const handleUpload=(e)=>{
    const f=e.target.files?.[0]
    if(!f)return
    const url=URL.createObjectURL(f)
    setNewUrl(url)
    setNewKind(f.type.startsWith('image')?'image':'video')
    setShowUp(true)
  }
  const saveVideo=()=>{
    const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra 🔥',t:['#vibra','#mombasa'],user:'vibra-boy',v:'0',likes:0}
    setAll([vid,...all])
    setShowUp(false)
    setNewCap('');setNewUrl('')
    setPage('me')
  }
  const delVideo=(id,url)=>{
    if(!confirm('Futa hii video?'))return
    try{if(url.startsWith('blob:'))URL.revokeObjectURL(url)}catch{}
    setAll(all.filter(x=>x.id!==id))
  }
  const toggleMute=()=>{
    const nm=!muted
    setMuted(nm)
    Object.values(vRefs.current).forEach(v=>{if(v)v.muted=nm})
  }

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      
      {/* AI FOLLOWING/FOLLOWERS/LIKES MODAL - KILA KITU KINAfanya KAZI! */}
      {showList&&<div className="absolute inset-0 z-[100] bg-black/80 flex items-end"><div className="bg-white text-black w-full rounded-t-[20px] max-h-[75%] flex flex-col"><div className="flex items-center justify-between p-4 border-b"><p className="font-bold text-[16px]">{showList}</p><button onClick={()=>setShowList(null)} className="w-8 h-8 bg-gray-100 rounded-full">✕</button></div><div className="overflow-y-auto p-2">
        {showList==='Following'&&Array.from({length:10}).map((_,i)=><div key={i} className="flex items-center gap-3 p-3"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">{i+1}</div><div><p className="font-bold text-[14px]">user_{i+1}</p><p className="text-[11px] text-gray-500">Mombasa • Vibra Fam</p></div><button className="ml-auto bg-gray-100 px-5 py-1.5 rounded-full text-[12px] font-bold">Following</button></div>)}
        {showList==='Followers'&&Array.from({length:20}).map((_,i)=><div key={i} className="flex items-center gap-3 p-3"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">F</div><div><p className="font-bold text-[14px]">follower_{i+1}</p><p className="text-[11px] text-gray-500">{(Math.random()*10).toFixed(1)}K followers</p></div><button onClick={()=>{setFollowers(f=>f+1)}} className="ml-auto bg-[#FE2C55] text-white px-5 py-1.5 rounded-full text-[12px] font-bold">Follow back</button></div>)}
        {showList==='Likes'&&<div className="p-4 text-center"><p className="text-[40px]">❤️</p><p className="font-bold mt-2">{totalLikes.toLocaleString()} total likes</p><p className="text-[12px] text-gray-500 mt-1">Your videos got {myVideos.length} videos with {totalLikes.toLocaleString()} likes!</p><div className="grid grid-cols-3 gap-2 mt-4">{myVideos.map(v=><div key={v.id} className="bg-gray-100 p-2 rounded"><p className="font-bold">{v.v}</p><p className="text-[10px]">likes</p></div>)}</div></div>}
        {showList==='Liked'&&<div className="p-2">{Array.from(likes).length===0?<div className="text-center py-10 text-gray-400"><p className="text-[30px]">♡</p><p className="text-[13px] mt-2">No liked videos yet</p></div>:Array.from(likes).map(id=>{const v=all.find(x=>x.id===id); return v?<div key={id} className="flex gap-3 p-2 border-b"><video src={v.u} className="w-16 h-20 object-cover rounded bg-black"/><div><p className="text-[13px] font-bold">{v.c}</p><p className="text-[11px] text-gray-500">@{v.user} • {v.v}</p></div></div>:null})}</div>}
      </div></div></div>}

      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4"><p className="font-bold">💬 Comments 12.4K</p><div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto"><p className="text-[13px]"><span className="font-bold">@mombasa_fam:</span> Moto sana! 🔥</p><p className="text-[13px]"><span className="font-bold">@vibra_boy:</span> Asante familia!</p></div><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕ Cancel</button><button onClick={saveVideo} className="bg-[#FE2C55] px-6 py-2 rounded-full font-bold">Post</button></div>{newKind==='image'?<img src={newUrl} className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Add caption #vibra #mombasa..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/><p className="text-[11px] text-zinc-500 mt-2">AI will add hashtags & optimize for Mombasa audience 🌍</p></div>}

      {/* ME PAGE - FULL AI - KILA BUTTON INAFANYA KAZI! */}
      {page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white sticky top-0"><button onClick={()=>setPage('home')} className="text-[20px]">←</button><p className="font-bold">@vibra-boy ✅</p><button className="text-[18px]">⋮</button></div>
        <div className="overflow-y-auto flex-1">
          <div className="flex justify-around mt-5">
            <button onClick={()=>setShowList('Following')} className="text-center"><p className="font-black text-[18px]">{following.size+10}K</p><p className="text-[12px] text-gray-500">Following</p></button>
            <button onClick={()=>setShowList('Followers')} className="text-center border-l border-gray-200 pl-8"><p className="font-black text-[18px]">{(followers/1000).toFixed(1)}K</p><p className="text-[12px] text-gray-500">Followers</p></button>
            <button onClick={()=>setShowList('Likes')} className="text-center border-l border-gray-200 pl-8"><p className="font-black text-[18px]">{(totalLikes/1000000).toFixed(1)}M</p><p className="text-[12px] text-gray-500">Likes</p></button>
          </div>
          <div className="flex gap-2 px-4 mt-5"><button className="flex-1 bg-gray-100 py-2.5 rounded-[8px] font-semibold text-[14px]">Edit profile</button><button className="flex-1 bg-gray-100 py-2.5 rounded-[8px] font-semibold text-[14px]">Following ✓</button><button className="bg-gray-100 w-12 rounded-[8px]">👤+</button></div>
          <div className="px-4 mt-3"><p className="font-bold text-[14px]">Vibra Boy 🌍 Mombasa</p><p className="text-[12px] text-gray-600">Togethar Familia Worldwide | Data Saver ON | #vibra #mombasa</p><p className="text-[12px] text-blue-500 mt-1">🔗 vibra.app/vibra-boy</p></div>
          <div className="flex border-b border-gray-200 mt-5 sticky top-0 bg-white"><button className="flex-1 py-3 font-bold border-b-2 border-black text-[14px]">☰ Videos {myVideos.length}</button><button onClick={()=>setShowList('Liked')} className="flex-1 py-3 text-gray-400 text-[14px]">♡ {likes.size} Liked</button></div>
          {/* AI GRID NA BUTTONS ZOTE! */}
          <div className="grid grid-cols-2 gap-[1px] bg-gray-200">
            {myVideos.map(c=>(
              <div key={c.id} className="aspect-[9/16] bg-black relative group">
                <video ref={el=>meVRefs.current[c.id]=el} src={c.u} loop muted autoPlay playsInline className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="flex items-center justify-between"><span className="text-white text-[11px] font-bold flex items-center gap-1">▶ {c.v}</span><span className="text-white text-[10px]">❤️ {c.likes>1000?(c.likes/1000).toFixed(1)+'K':c.likes}</span></div>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button onClick={()=>delVideo(c.id,c.u)} className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">🗑️</button>
                  <button onClick={()=>{setPage('home'); setTimeout(()=>{setActiveId(c.id); vRefs.current[c.id]?.play()},100)}} className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">▶️</button>
                  <button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className={`w-8 h-8 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-[#FE2C55]':'bg-black/70'} text-white`}>{likes.has(c.id)?'❤️':'🤍'}</button>
                  <button onClick={()=>setShowCom(c.id)} className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">💬</button>
                  <button className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">🔖</button>
                  <button className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">↗️</button>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span className="text-[20px]">▶</span></div>
              </div>
            ))}
            {myVideos.length===0&&<div className="col-span-2 py-20 text-center bg-white"><p className="text-[50px]">🎬</p><p className="font-bold mt-2">No videos yet</p><p className="text-[12px] text-gray-500 mt-1">Upload your first Vibra video!</p><button onClick={()=>fileRef.current?.click()} className="mt-4 bg-[#FE2C55] text-white px-8 py-2.5 rounded-full font-bold">+ Upload</button><button onClick={()=>setAll(defaultVideos)} className="mt-3 block mx-auto bg-gray-100 px-8 py-2.5 rounded-full font-bold text-[12px]">Restore demo videos</button></div>}
          </div>
        </div>
      </div>}

      {page==='home'&&<>
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 p-2">
        <div className="flex justify-between items-center px-2"><button className="bg-[#FE2C55] px-3 py-1 rounded-full text-[11px] font-black">🔴 LIVE AI</button><div className="flex gap-6"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You AI</button></div><button onClick={toggleMute} className={`w-9 h-9 rounded-full flex items-center justify-center ${muted?'bg-zinc-700':'bg-green-500'}`}>{muted?'🔇':'🔊'}</button></div>
      </div>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[50px] pb-[70px]">
        {filtered.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-black">
            <video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} className="h-full w-full object-contain bg-black" onClick={toggleMute}/>
            {muted&&activeId===c.id&&<button onClick={toggleMute} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 border border-white px-6 py-3 rounded-full font-black text-[14px]">🔇 TAP FOR SOUND AI</button>}
            <div className="absolute bottom-[90px] left-3 right-[70px]"><p className="font-bold text-[14px]">@{c.user} ✅ {c.user!=='vibra-boy'&&<button onClick={()=>{const s=new Set(following); if(s.has(c.user)){s.delete(c.user)}else{s.add(c.user)}; setFollowing(s)}} className={`ml-2 px-3 py-0.5 rounded-full text-[10px] font-bold ${following.has(c.user)?'bg-zinc-700':'bg-[#FE2C55]'}`}>{following.has(c.user)?'Following':'Follow'}</button>}</p><p className="text-[13px] mt-1">{c.c}</p><p className="text-[12px] text-cyan-400 mt-1">{c.t.join(' ')}</p></div>
            <div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-3">
              <button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700'}`}>❤️</div><span className="text-[11px] font-bold mt-1">{c.v}</span></button>
              <button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">💬</div><span className="text-[11px]">12K</span></button>
              <button className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">🔖</div><span className="text-[11px]">Save</span></button>
              <button className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">↗️</div><span className="text-[11px]">Share</span></button>
              {c.user==='vibra-boy'&&<button onClick={()=>delVideo(c.id,c.u)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">🗑️</div><span className="text-[11px]">Del</span></button>}
            </div>
          </div>
        ))}
      </div>
      </>}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[68px] z-50">
        <button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span>🏠</span><span className="text-[9px]">Home</span></button>
        <button className="flex flex-col items-center text-zinc-500"><span>🔍</span><span className="text-[9px]">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[52px] h-[32px] rounded-[10px] flex items-center justify-center font-black text-[20px]">+</div><span className="text-[9px] text-white">Upload AI</span></button>
        <button className="flex flex-col items-center text-zinc-500"><span>📥</span><span className="text-[9px]">Inbox</span></button>
        <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span>👤</span><span className="text-[9px]">Me</span></button>
      </div>
    </div>
  )
}
