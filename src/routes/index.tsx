// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})
function Vibra(){
const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko tayari? #vibra #fyp',user:'vibra-boy',k:'video'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana 🔥 #together',user:'vibra-boy',k:'video'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'Together Forever ❤️ #love',user:'vibra-boy',k:'video'},
]
const realAds=[
{id:1,title:'Nike - Just Do It - 50% OFF Mombasa!',sub:'Shop Now',link:'https://nike.com'},
{id:2,title:'Coca-Cola - Taste The Feeling!',sub:'Naivas',link:'https://coca-cola.com'},
{id:3,title:'iPhone 15 Pro - Lipa Pole Pole!',sub:'Safaricom',link:'https://safaricom.co.ke'},
{id:4,title:'Binance - Trade & Earn $100!',sub:'200M Users',link:'https://binance.com'},
{id:5,title:'Adidas - 40% OFF!',sub:'City Mall',link:'https://adidas.com'},
{id:6,title:'🔥 Advertise Here - 250K Views!',sub:'DM @vibra-boy',link:'https://wa.me/254700000000'},
]
const [all,setAll]=useState(()=>{try{const s=localStorage.getItem('vibra_final_v2');return s?JSON.parse(s):defaultVideos}catch{return defaultVideos}})
const [tab,setTab]=useState('foryou')
const [muted,setMuted]=useState(false)
const [likes,setLikes]=useState(new Set())
const [saved,setSaved]=useState(new Set())
const [page,setPage]=useState('home')
const [activeId,setActiveId]=useState('1')
const [showCom,setShowCom]=useState(null)
const [comments,setComments]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_com')||'{}')}catch{return {}}})
const [newCom,setNewCom]=useState('')
const [showUp,setShowUp]=useState(false)
const [followed,setFollowed]=useState(false)
const [meTab,setMeTab]=useState('videos')
const [showLive,setShowLive]=useState(false)
const [showLyrics,setShowLyrics]=useState(null)
const [showAuth,setShowAuth]=useState(false)
const [isLogged,setIsLogged]=useState(()=>{try{return localStorage.getItem('vibra_logged')==='1'}catch{return false}})
const [username,setUsername]=useState(()=>{try{return localStorage.getItem('vibra_user')||'vibra-boy'}catch{return 'vibra-boy'}})
const [loginName,setLoginName]=useState('')
const [newCap,setNewCap]=useState('')
const [newUrl,setNewUrl]=useState('')
const [newKind,setNewKind]=useState('video')
const [uploading,setUploading]=useState(false)
const [progress,setProgress]=useState(0)
const [adIndex,setAdIndex]=useState(0)
const [adClicks,setAdClicks]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_clicks')||'{}')}catch{return {}}})
const [searchQ,setSearchQ]=useState('')
const [exploreQ,setExploreQ]=useState('')
const fileRef=useRef(null)
const vRefs=useRef({})

useEffect(()=>{const id=setInterval(()=>setAdIndex(i=>(i+1)%realAds.length),4000);return()=>clearInterval(id)},[])
useEffect(()=>{const pauseAll=()=>{Object.values(vRefs.current).forEach(v=>{if(v&&v.pause)try{v.pause()}catch{}})};return pauseAll},[])
useEffect(()=>{if(showCom||showLive||showLyrics||showAuth){Object.values(vRefs.current).forEach(v=>{if(v&&v.pause)try{v.pause()}catch{}})}},[showCom,showLive,showLyrics,showAuth])

const filtered=()=>{
  try{
    let safeAll = Array.isArray(all) ? all : defaultVideos
    let f = tab==='following' ? safeAll.filter(x=>{try{return followed}catch{return false}}) : safeAll
    const q = (searchQ||'').toLowerCase().trim()
    if(q){ f = f.filter(x=> ((x.c||'')+'').toLowerCase().includes(q)) }
    return f.length ? f : safeAll
  }catch(e){ return defaultVideos }
}
const myVideos=(Array.isArray(all)?all:defaultVideos).filter(x=> (x.user||'')===username || (x.user||'')==='vibra-boy' || !x.user)
const totalEarnings=Object.values(adClicks||{}).reduce((a,b)=> (Number(a)||0)+(Number(b)||0),0)*0.34
const handleLogin=()=>{if(!loginName.trim()) return; setUsername(loginName.trim()); localStorage.setItem('vibra_user',loginName.trim()); localStorage.setItem('vibra_logged','1'); setIsLogged(true); setShowAuth(false); setLoginName('')}
const handleLogout=()=>{setIsLogged(false); localStorage.removeItem('vibra_logged'); localStorage.removeItem('vibra_user')}
const handleUpload=(e)=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{setNewUrl(r.result as string)}; r.readAsDataURL(f)}
const saveVideo=async()=>{if(!newUrl) return; setUploading(true); setProgress(0); const iv=setInterval(()=>setProgress(p=>Math.min(p+10,90)),100); const nv={id:Date.now().toString(),u:newUrl,c:newCap||'My Vibra ❤️ #fyp',user:username,k:newKind}; const na=[nv,...(Array.isArray(all)?all:defaultVideos)]; setAll(na); localStorage.setItem('vibra_final_v2',JSON.stringify(na)); clearInterval(iv); setProgress(100); setTimeout(()=>{setUploading(false); setShowUp(false); setNewUrl(''); setNewCap('')},500)}
const addComment=(vidId)=>{if(!newCom.trim()) return; const allComs={...comments,[vidId]:[...(comments[vidId]||[]),{u:username,t:newCom}]}; setComments(allComs); localStorage.setItem('vibra_com',JSON.stringify(allComs)); setNewCom('')}
const clickAd=(ad)=>{const n={...adClicks,[ad.id]:(adClicks[ad.id]||0)+1}; setAdClicks(n); localStorage.setItem('vibra_clicks',JSON.stringify(n)); if(ad.link) window.open(ad.link,'_blank')}
const ActionButtons=({c})=>(
<div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-4 z-20">
<button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><span className="text-[28px]">❤️</span><span className="text-[11px]">8.5K</span></button>
<button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><span className="text-[24px]">💬</span><span className="text-[11px]">12K</span></button>
<button onClick={()=>setShowLyrics(c)} className="flex flex-col items-center"><span>🎤</span><span className="text-[10px]">Lyrics</span></button>
<button onClick={()=>{const s=new Set(saved); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaved(s)}} className="flex flex-col items-center"><span>🔖</span></button>
<button onClick={()=>{if(navigator.share) navigator.share({text:c.c})}} className="flex flex-col items-center"><span>🚀</span></button>
<button onClick={()=>{if(navigator.share) navigator.share({text:c.c})}} className="flex flex-col items-center"><span>↗️</span></button>
</div>
)
const currentAd=realAds[(adIndex||0)%realAds.length] || realAds[0]
return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>
<div onClick={()=>clickAd(currentAd)} className={'fixed top-[0px] left-0 right-0 z-[100] bg-orange-500 text-white text-center py-1.5 text-[11px] font-bold cursor-pointer'}>{currentAd.title} - ${totalEarnings.toFixed(2)} earned! <span className="bg-white text-black px-2 py-0.5 rounded ml-2 text-[9px]">AD</span></div>

{page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pt-[40px] overflow-y-auto">
<div className="flex justify-between px-4 py-2"><button className="text-xl" onClick={()=>setPage('home')}>←</button><button className="text-xl">☰</button></div>
<div className="flex flex-col items-center"><div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl">👤</div><p className="font-black text-[18px] mt-3">{username}</p><p className="text-[14px] text-black/60">@{username}</p>
{isLogged&&<div className="mt-3 bg-green-50 border border-green-200 px-4 py-2 rounded-lg text-center"><p className="text-[12px]">💰 Total Earnings: ${totalEarnings.toFixed(2)}</p><p className="text-[10px] text-black/60">{Object.values(adClicks).reduce((a,b)=>a+b,0)} clicks</p></div>}
<div className="flex gap-6 mt-3"><div className="text-center"><p className="font-black text-[16px]">{myVideos.length}</p><p className="text-[11px] text-black/60">Videos</p></div><div className="w-[1px] bg-black/10"></div><div className="text-center"><p className="font-black text-[16px]">955.3K</p><p className="text-[11px] text-black/60">Followers</p></div><div className="w-[1px] bg-black/10"></div><div className="text-center"><p className="font-black text-[16px]">15.7M</p><p className="text-[11px] text-black/60">Likes</p></div></div>
<div className="flex gap-2 mt-4 w-full px-6"><button onClick={()=>setFollowed(!followed)} className={'flex-1 py-2.5 rounded bg-black text-white'}>{followed?'Following':'Follow'}</button><button onClick={()=>setShowAuth(true)} className="w-12 bg-gray-100 rounded">✉️</button></div>
<p className="text-[13px] mt-3 text-center px-6">My Vibra Worldwide 🌍 Together Forever ❤️</p></div>
<div className="flex border-t mt-4 border-black/10"><button onClick={()=>setMeTab('videos')} className={'flex-1 py-3 flex justify-center'}>🎬</button><button onClick={()=>setMeTab('liked')} className={'flex-1 py-3 flex justify-center'}>❤️</button></div>
{meTab==='videos'?<div className="grid grid-cols-3 gap-[2px] bg-black/5">{myVideos.map((v,i)=><div key={v.id} className="aspect-[9/16] bg-black relative"><div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">{v.k==='image'?'🖼️':'🎥'} {v.c?.substring(0,12)}</div>{v.k==='image'?<img src={v.u} className="w-full h-full object-cover"/>:<video src={v.u} className="w-full h-full object-cover"/>}{i==0&&<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 text-black text-[10px] px-2 py-1 rounded">Pinned</div>}<div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[10px]">▶️ {Math.floor(Math.random()*900)+100}K</div></div>)}{Array.from({length:6}).map((_,i)=><div key={'fake'+i} className="aspect-[9/16] bg-gray-100 flex items-center justify-center"><span className="text-black/20 text-[20px]">+</span></div>)}</div>:<div className="p-10 text-center text-black/50"><p>❤️</p><p className="text-[13px] mt-2">No liked videos yet</p></div>}
<div className="bg-white text-black text-center py-4 text-[12px] border-t">Vibra © 2025 - @vibra-boy - ${totalEarnings.toFixed(2)}</div>
</div>}

{page==='home'&&
<div className="fixed top-[36px] left-0 right-0 z-[70] bg-black p-2 flex justify-between">
<div className="font-black">Vibra</div>
<div className="flex gap-2"><span className="bg-white/20 px-2 py-1 rounded text-[12px]">@{username}</span><button onClick={()=>setShowLive(true)} className="bg-red-600 px-2 rounded text-[12px]">LIVE</button><button className="underline text-[13px]">For You</button></div>
</div>}
{page==='home'&&
<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[80px] pb-[60px]">
{filtered().map((c,idx)=>{const ad=realAds[(idx+adIndex)%realAds.length]; return(
<div key={c.id} className="h-[calc(100vh-80px)] snap-start relative flex items-center justify-center bg-black">
<video ref={el=>vRefs.current[c.id]=el} src={c.k!=='image'?c.u:undefined} loop muted={muted} autoPlay playsInline className="h-full w-full object-cover" onClick={()=>{const v=vRefs.current[c.id]; if(v){v.muted? v.play(): v.pause()}}}></video>
{c.k==='image'&&<img src={c.u} className="h-full w-full object-cover"/>}
<div className="absolute bottom-[80px] left-3 right-14"><p className="font-bold text-[14px]">@{c.user||'vibra-boy'}</p><p className="text-[13px] mt-1">{c.c}</p><p className="text-[12px] mt-1 bg-white/20 inline-block px-2 rounded">🎵 Lyrics - {c.c.substring(0,15)}</p></div>
<ActionButtons c={c}/>
</div>
)})}
</div>}

<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 flex justify-around py-2 z-[80]">
<button onClick={()=>setPage('home')} className="flex flex-col items-center text-[10px]">🏠 Home</button>
<button onClick={()=>setPage('explore')} className="flex flex-col items-center text-[10px]">🔍 Explore</button>
<button onClick={()=>setShowUp(true)} className="bg-white text-black w-10 h-7 rounded flex items-center justify-center">+</button>
<button onClick={()=>setShowLive(true)} className="flex flex-col items-center text-[10px]">🔴 LIVE</button>
<button onClick={()=>setPage('me')} className="flex flex-col items-center text-[10px]">👤 Me • ${totalEarnings.toFixed(2)}</button>
</div>
</div>
)
}
