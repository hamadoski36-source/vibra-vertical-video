// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({component:Vibra})

const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa 🔥 #vibra'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana 😂'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'Mambo vipi Mombasa? 🌊'},
]

const realAds=[
{id:1,title:'Nike - Just Do It - 50% OFF Mombasa!',sub:'Shop Now',link:'https://uplcm.com/4/12154689'},
{id:2,title:'Coca-Cola - Taste The Feeling!',sub:'Naivas',link:'https://uplcm.com/4/12154689'},
{id:3,title:'iPhone 15 Pro - Lipa Pole Pole!',sub:'Safaricom',link:'https://uplcm.com/4/12154689'},
]

function Vibra(){
const [all,setAll]=useState(()=>{try{const s=localStorage.getItem('vibra_all'); return s?JSON.parse(s):defaultVideos}catch{return defaultVideos}})
const [tab,setTab]=useState('foryou')
const [likes,setLikes]=useState(new Set())
const [saved,setSaved]=useState(new Set())
const [page,setPage]=useState('home')
const [activeId,setActiveId]=useState('1')
const [showCom,setShowCom]=useState(null)
const [comments,setComments]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_comments')||'{}')}catch{return{}}})
const [newCom,setNewCom]=useState('')
const [showLyrics,setShowLyrics]=useState(null)
const [showAuth,setShowAuth]=useState(false)
const [isLogged,setIsLogged]=useState(()=>{try{return localStorage.getItem('vibra_logged')==='1'}catch{return false}})
const [username,setUsername]=useState(()=>{try{return localStorage.getItem('vibra_user')||''}catch{return''}})
const [loginName,setLoginName]=useState('')
const [adIndex,setAdIndex]=useState(0)
const [adClicks,setAdClicks]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_adClicks')||'{}')}catch{return{}}})
const fileRef=useRef(null)
const vRefs=useRef({})

// MONETAG GLOBAL FUNCTION
useEffect(()=>{
(window as any).openMonetag=()=>{
window.open('https://uplcm.com/4/12154689','_blank');
};
const id=setInterval(()=>setAdIndex(i=>(i+1)%realAds.length),4000);
return ()=>clearInterval(id);
},[])

const filtered=()=>{
try{
let safeAll = Array.isArray(all) ? all : defaultVideos
return safeAll
}catch(e){ return defaultVideos }
}

const currentAd=realAds[adIndex]
const clickAd=(ad)=>{
(window as any).openMonetag?.();
const n={...adClicks,[ad.id]:(adClicks[ad.id]||0)+1};
setAdClicks(n);
try{localStorage.setItem('vibra_adClicks',JSON.stringify(n))}catch{};
if(ad.link) window.open(ad.link,'_blank')
}

const ActionButtons=({c}:any)=>(
<div className="absolute bottom-[110px] right-3 flex flex-col items-center gap-5 z-20">
<button onClick={()=>{(window as any).openMonetag?.(); const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center">
<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">❤️</div>
<span className="text-[11px] mt-1">{likes.has(c.id)?'Liked':'Like'}</span>
</button>
<button onClick={()=>{(window as any).openMonetag?.(); setShowCom(c.id)}} className="flex flex-col items-center">
<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">💬</div>
<span className="text-[11px] mt-1">Comment</span>
</button>
<button onClick={()=>{(window as any).openMonetag?.(); setShowLyrics(c)}} className="flex flex-col items-center">
<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">🎵</div>
<span className="text-[11px] mt-1">Lyrics</span>
</button>
<button onClick={()=>{(window as any).openMonetag?.(); const s=new Set(saved); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaved(s)}} className="flex flex-col items-center">
<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">🔖</div>
<span className="text-[11px] mt-1">Save</span>
</button>
<button onClick={()=>{(window as any).openMonetag?.(); if(navigator.share) navigator.share({text:c.c})}} className="flex flex-col items-center">
<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">↗️</div>
<span className="text-[11px] mt-1">Share</span>
</button>
</div>
)

return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" />

{/* VIDEO FEED */}
<div className="h-full w-full relative">
{filtered().map((v:any)=>(
<div key={v.id} className="h-screen w-full relative snap-start">
<video ref={el=>vRefs.current[v.id]=el} src={v.u} loop muted playsInline className="h-full w-full object-cover" onClick={e=>e.currentTarget.paused?e.currentTarget.play():e.currentTarget.pause()} />
<ActionButtons c={v} />
<div className="absolute bottom-6 left-3 right-20 z-20">
<p className="font-bold">@{username||'vibra_user'}</p>
<p className="text-sm mt-1">{v.c}</p>
<div onClick={()=>clickAd(currentAd)} className="mt-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 flex justify-between items-center cursor-pointer">
<div><p className="text-sm font-bold">{currentAd.title}</p><p className="text-xs opacity-70">{currentAd.sub}</p></div>
<div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">Shop</div>
</div>
</div>
</div>
))}
</div>

{/* BOTTOM NAV */}
<div className="absolute bottom-0 left-0 right-0 h-[70px] bg-black border-t border-white/10 flex justify-around items-center z-30">
<button onClick={()=>setTab('foryou')} className={tab==='foryou'?'font-bold':''}>For You</button>
<button onClick={()=>fileRef.current?.click()}>+</button>
<button onClick={()=>{if(!isLogged) setShowAuth(true); else setPage('me')}}>Me</button>
</div>

{showAuth&&<div className="absolute inset-0 z-40 bg-white text-black p-6"><h2 className="text-xl font-bold">Login to Vibra</h2><input value={loginName} onChange={e=>setLoginName(e.target.value)} placeholder="Username" className="border p-3 w-full mt-4 rounded" /><button onClick={()=>{if(!loginName.trim()) return; setUsername(loginName); setIsLogged(true); localStorage.setItem('vibra_user',loginName); localStorage.setItem('vibra_logged','1'); setShowAuth(false)}} className="bg-black text-white w-full mt-3 p-3 rounded-full">Login</button><button onClick={()=>setShowAuth(false)} className="mt-3 w-full">Cancel</button></div>}
</div>
)
}
