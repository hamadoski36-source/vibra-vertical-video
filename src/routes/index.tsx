// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
export const Route=createFileRoute('/')({component:Vibra})
function Vibra(){
  const [all,setAll]=useState([
    {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',k:'video',c:'Data Saver ON Mombasa',t:['#vibra','#mombasa','#worldwide'],user:'vibra_boy',v:'254K'},
    {id:'2',u:'https://www.w3schools.com/html/movie.mp4',k:'video',c:'Togethar forever',t:['#love','#viral'],user:'mombasa_star',v:'412K'},
  ])
  const [q,setQ]=useState('')
  const [tab,setTab]=useState('foryou')
  const [ds,setDS]=useState(true)
  const [muted,setMuted]=useState(true)
  const [likes,setLikes]=useState(new Set())
  const [page,setPage]=useState('home')
  const [showCom,setShowCom]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [newCap,setNewCap]=useState('')
  const [newTags,setNewTags]=useState('')
  const [newUrl,setNewUrl]=useState('')
  const [newKind,setNewKind]=useState('video')
  const fileRef=useRef(null)
  const clips=q?all.filter(x=>x.c.toLowerCase().includes(q.toLowerCase())||x.t.join().toLowerCase().includes(q.toLowerCase())):all
  const filtered=tab==='following'?all.filter(x=>x.user==='mombasa_star'):clips

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
    setPage('home');setTab('foryou')
  }

  return(
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
      {showCom&&<div className="absolute inset-0 z-[80] flex items-end"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowCom(null)}></div><div className="relative bg-zinc-900 w-full rounded-t-[20px] p-4"><p className="font-bold">💬 Comments</p><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-[13px] outline-none"/><button className="text-[#FE2C55] font-bold">Post</button></div></div></div>}
      {showUp&&<div className="absolute inset-0 z-[90] bg-black flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕ Cancel</button><button onClick={saveVideo} className="bg-[#FE2C55] px-5 py-1.5 rounded-full font-bold">Post</button></div>{newKind==='image'?<img src={newUrl} className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>:<video src={newUrl} controls loop autoPlay muted playsInline className="w-full h-[50%] object-contain rounded-xl mt-4 bg-zinc-900"/>}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Add caption..." className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none"/><input value={newTags} onChange={e=>setNewTags(e.target.value)} placeholder="#vibra #mombasa #familia" className="mt-3 bg-zinc-800 rounded-xl px-4 py-3 text-[13px] outline-none border border-cyan-500/30"/></div>}
      {page==='explore'&&<div className="absolute inset-0 z-30 bg-black pt-[86px] pb-[66px] overflow-y-auto p-2"><p className="font-black p-2">🔍 Explore</p><div className="grid grid-cols-3 gap-1">{all.map(c=><div key={c.id} className="aspect-[9/16] bg-zinc-800">{c.k==='image'?<img src={c.u} className="w-full h-full object-cover"/>:<video src={c.u} className="w-full h-full object-cover"/>}</div>)}</div></div>}
      {page==='me'&&<div className="absolute inset-0 z-30 bg-black pt-[86px] pb-[66px] overflow-y-auto p-4 text-center"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center font-black text-[24px]">V</div><p className="font-black mt-2">@vibra_boy ✅</p><div className="grid grid-cols-3 gap-1 mt-6">{all.map(c=><div key={c.id} className="aspect-[9/16] bg-zinc-800">{c.k==='image'?<img src={c.u} className="w-full h-full object-cover"/>:<video src={c.u} className="w-full h-full object-cover"/>}</div>)}</div></div>}

      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 p-2">
        <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
          <span>🔍</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search #vibra #mombasa..." className="flex-1 bg-transparent text-[13px] outline-none"/>{q&&<button onClick={()=>setQ('')}>✕</button>}
        </div>
        <div className="flex justify-between items-center mt-2 px-2">
          <button className="bg-[#FE2C55] px-3 py-1 rounded-full text-[11px] font-black">🔴 LIVE</button>
          <div className="flex gap-6">
            <button onClick={()=>setTab('following')} className={`text-[13px] font-bold pb-1 ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
            <button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold pb-1 ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
          </div>
          <button onClick={()=>setDS(!ds)} className={`px-2 py-1 rounded-full text-[9px] font-black ${ds?'bg-green-500':'bg-zinc-700'}`}>{ds?'🔋 ON':'OFF'}</button>
        </div>
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[88px] pb-[66px]">
        {filtered.map(c=>(
          <div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900">
            {c.k==='image'?<img src={c.u} className="h-full w-full object-contain bg-black"/>:<video src={c.u} loop autoPlay playsInline muted={muted} controls={c.u.startsWith('blob:')} preload={ds?'metadata':'auto'} className="h-full w-full object-contain bg-black" onClick={e=>{const v=e.currentTarget; if(v.paused)v.play(); else v.pause()}}/>}
            <div className="absolute bottom-[100px] left-3 right-20"><p className="font-bold text-[14px]">@{c.user} ✅</p><p className="text-[13px] mt-1">{c.c}</p><div className="flex gap-1.5 mt-2 flex-wrap">{c.t.map(tag=><span key={tag} onClick={()=>setQ(tag)} className="text-[12px] font-bold text-cyan-400 bg-black/60 px-2 py-0.5 rounded-full border border-cyan-400/30">{tag}</span>)}</div></div>
            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-black">V</div><button onClick={()=>{const s=new Set(likes); if(s.has(c.id))s.delete(c.id); else s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-[20px] ${likes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[10px] font-bold">{c.v}</span></button><button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center">💬</div><span className="text-[10px]">12K</span></button><button className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center">🔖</div><span className="text-[10px]">Save</span></button></div>
          </div>
        ))}
        {filtered.length===0&&<div className="h-screen flex items-center justify-center text-zinc-400">No videos in {tab}</div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center h-[64px] px-1 z-50">
        <button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-500'}`}><span className="text-[20px]">🏠</span><span className="text-[9px]">Home</span></button>
        <button onClick={()=>setPage(page==='explore'?'home':'explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'text-zinc-500'}`}><span className="text-[20px]">🔍</span><span className="text-[9px]">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black w-[48px] h-[32px] rounded-[10px] flex items-center justify-center text-[22px] font-black">+</div><span className="text-[9px] text-white">Upload</span></button>
        <button className="flex flex-col items-center text-zinc-500"><span className="text-[20px]">📥</span><span className="text-[9px]">Inbox</span></button>
        <button onClick={()=>setPage(page==='me'?'home':'me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-zinc-500'}`}><span className="text-[20px]">👤</span><span className="text-[9px]">Me</span></button>
      </div>
    </div>
  )
}
