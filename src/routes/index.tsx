// @ts-nocheck - VIBRA FINAL CLEAN - COPY YOTE - 2026
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})

function Vibra(){
const MY_MPESA='0740805970'
const MASKED='0740***970'

const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko wapi? 🔥 #Vibra',user:'mombasa_star',k:'video',views:'33K',lyrics:'Mombasa mko wapi?'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana ❤️ #fyp',user:'vibra_queen',k:'video',views:'281K',lyrics:'huyu nae ni moto'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'My Vibra Worldwide 🌍 Together Forever',user:'vibra-boy',k:'video',views:'164.6K',lyrics:'Vibra Worldwide'},
]

const [all,setAll]=useState(()=>{
try{
const s=localStorage.getItem('vibra_v9')
if(s){const p=JSON.parse(s); if(p.length>0) return [...p,...defaultVideos]}
}catch{} return defaultVideos
})
const [muted,setMuted]=useState(true)
const [likes,setLikes]=useState(new Set())
const [saves,setSaves]=useState(new Set())
const [page,setPage]=useState('home')
const [showCom,setShowCom]=useState(null)
const [comments,setComments]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_com')||'{}')}catch{return{}}})
const [newCom,setNewCom]=useState('')
const [showUp,setShowUp]=useState(false)
const [showLive,setShowLive]=useState(false)
const [showLyrics,setShowLyrics]=useState(null)
const [showProfile,setShowProfile]=useState(null)
const [showPay,setShowPay]=useState(false)
const [isLogged,setIsLogged]=useState(false)
const [username,setUsername]=useState('vibra-boy')
const [newCap,setNewCap]=useState('')
const [newUrl,setNewUrl]=useState('')
const [newKind,setNewKind]=useState('video')
const [followed,setFollowed]=useState(new Set())
const [adI,setAdI]=useState(0)
const [earn,setEarn]=useState(()=>{try{return parseFloat(localStorage.getItem('vibra_earn')||'0')}catch{return 0}})
const [q,setQ]=useState('')
const [playing,setPlaying]=useState({})
const fileRef=useRef(null)
const vRefs=useRef({})

const ads=[
{id:1,title:'🔥 LIPA HAPA - ADVERTISE NOW - 500 KES',sub:`M-Pesa ${MASKED} - Safe`,link:`https://wa.me/254740805970?text=Habari%20Vibra!%20500%20bob`,color:'bg-green-600'},
{id:2,title:'ADVERTISE ON VIBRA - 500 KES - PRIVATE',sub:'Click to Pay',link:`https://wa.me/254740805970`,color:'bg-pink-600'},
]

useEffect(()=>{const id=setInterval(()=>setAdI(i=>(i+1)%ads.length),3500); return ()=>clearInterval(id)},[])

useEffect(()=>{
const obs=new IntersectionObserver((ents)=>{
ents.forEach(en=>{
const id=en.target.getAttribute('data-vid')
const vid=vRefs.current[id] as HTMLVideoElement
if(!vid) return
if(en.isIntersecting && en.intersectionRatio>=0.5){
vid.muted=muted
vid.play().then(()=>setPlaying(p=>({...p,[id]:true}))).catch(()=>{})
}else{
vid.pause()
setPlaying(p=>({...p,[id]:false}))
}
})
},{threshold:0.6})
Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el as Element)})
return ()=>obs.disconnect()
},[all,page,muted])

useEffect(()=>{Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).muted=muted})},[muted])

const filtered=all.filter(x=>!q||x.c.toLowerCase().includes(q.toLowerCase()))
const myVideos=all.filter(x=>x.user===username)
const total=earn

const del=(id:string)=>{
if(!confirm('FUTA VIDEO HII?')) return
const na=all.filter(x=>x.id!==id)
setAll(na)
localStorage.setItem('vibra_v9',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id))))
}

const upload=(e:any)=>{
const f=e.target.files?.[0]; if(!f) return
const r=new FileReader()
r.onload=()=>{setNewUrl(r.result as string); setNewKind(f.type.startsWith('image')?'image':'video'); setShowUp(true)}
r.readAsDataURL(f)
}

const save=()=>{
if(!newUrl) return
const v={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'Vibra',user:username,views:'0',lyrics:newCap}
const na=[v,...all]
setAll(na)
localStorage.setItem('vibra_v9',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id)).slice(0,30)))
setShowUp(false); setNewCap(''); setNewUrl('')
}

const addCom=(vidId:string)=>{
if(!newCom.trim()) return
const ac={...comments}
if(!ac[vidId]) ac[vidId]=[]
ac[vidId]=[{id:Date.now().toString(),text:newCom,user:username},...ac[vidId]]
setComments(ac)
localStorage.setItem('vibra_com',JSON.stringify(ac))
setNewCom('')
}

const clickAd=(ad:any)=>{
const ne=earn+500
setEarn(ne)
localStorage.setItem('vibra_earn',ne.toString())
setShowPay(true)
}

const share=(c:any)=>{
if(navigator.share){navigator.share({title:'Vibra',text:c.c,url:location.href})}
else{navigator.clipboard.writeText(location.href); alert('Link copied!')}
}

const ActionBtns=({c}:any)=>(
<div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-3 z-10">
<button onClick={()=>setShowProfile(c.user)} className="relative">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[2px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold">{c.user[0].toUpperCase()}</div></div>
<div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${followed.has(c.user)?'bg-gray-500':'bg-[#fe2c55]'}`}>{followed.has(c.user)?'✓':'+'}</div>
</button>
<button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-pink-600':'bg-white/20'}`}>❤️</div><span className="text-[11px] font-bold">856</span></button>
<button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div><span className="text-[11px] font-bold">13K</span></button>
<button onClick={()=>{const s=new Set(saves); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaves(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${saves.has(c.id)?'bg-yellow-500':'bg-white/20'}`}>🔖</div><span className="text-[10px]">Save</span></button>
<button onClick={()=>share(c)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">↗️</div><span className="text-[10px]">Share</span></button>
<button onClick={()=>setShowLyrics(c)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">🎤</div><span className="text-[9px]">Lyrics</span></button>
</div>
)

const curAd=ads[adI]

return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload} />

<div onClick={()=>clickAd(curAd)} className={`fixed top-0 left-0 right-0 z-[60] ${curAd.color} h-[42px] flex items-center px-3 cursor-pointer`}>
<p className="text-[11px] font-bold flex-1 text-center">🔥 {curAd.title}</p>
<span className="bg-white text-black text-[8px] px-2 py-1 rounded font-black">PRIVATE {MASKED}</span>
</div>

{showPay&&<div className="absolute inset-0 z-[110] bg-black p-6 flex flex-col justify-center">
<button onClick={()=>setShowPay(false)} className="absolute top-4 left-4">✕</button>
<div className="text-center">
<p className="text-[22px] font-black">Lipa - Safe 🔒</p>
<div className="mt-6 bg-zinc-900 p-5 rounded-xl border-2 border-green-600">
<p className="text-[13px] font-bold text-green-400">M-PESA - 500 KES</p>
<p className="text-[34px] font-black mt-2">{MY_MPESA}</p>
<p className="text-[11px] mt-1">Send Money -> {MY_MPESA}</p>
<p className="text-[11px] text-green-400 mt-2">✅ Tuma Transaction Code WhatsApp</p>
</div>
<div className="mt-4 bg-yellow-900/20 p-3 rounded-xl text-left">
<p className="text-[11px] font-bold">🔒 Jinsi ya kujilinda:</p>
<p className="text-[10px]">1. Mtu akilipa - atume CODE WhatsApp</p>
<p className="text-[10px]">2. Angalia M-Pesa - kama iko - withdraw haraka</p>
<p className="text-[10px]">3. Baada ya 10min - haiwezi reverse!</p>
<p className="text-[10px]">4. Au Piga *334# -> Pochi la Biashara -> BURE -> No Reverse!</p>
</div>
<button onClick={()=>window.open(`https://wa.me/254740805970?text=Nimelipa%20500%20-%20Code%3A`,'_blank')} className="mt-6 w-full bg-green-600 py-3.5 rounded-full font-bold">Nimelipa - Tuma Code</button>
</div>
</div>}

{showProfile&&<div className="absolute inset-0 z-[100] bg-black p-6 flex flex-col">
<button onClick={()=>setShowProfile(null)} className="absolute top-4 left-4 text-xl">✕</button>
<div className="flex flex-col items-center mt-16">
<div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[3px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-bold">{showProfile[0].toUpperCase()}</div></div>
<p className="font-black text-[20px] mt-4">@{showProfile}</p>
<div className="flex gap-6 mt-2 text-[13px]"><span><b>1.2K</b> Following</span><span><b>45K</b> Followers</span></div>
<div className="flex gap-3 mt-6 w-full px-6">
<button onClick={()=>{const s=new Set(followed); s.has(showProfile)?s.delete(showProfile):s.add(showProfile); setFollowed(s)}} className={`flex-1 py-3 rounded-full font-bold ${followed.has(showProfile)?'bg-white/20':'bg-[#fe2c55]'}`}>{followed.has(showProfile)?'Following':'Follow'}</button>
<button className="flex-1 bg-white/10 py-3 rounded-full font-bold">Message</button>
</div>
</div>
</div>}

{showCom&&<div className="absolute inset-0 z-[80] flex items-end bg-black/60" onClick={()=>setShowCom(null)}>
<div className="bg-[#121212] w-full max-h-[75%] rounded-t-[20px] p-4 flex flex-col" onClick={e=>e.stopPropagation()}>
<div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3"></div>
<p className="font-bold">Comments</p>
<div className="flex-1 overflow-y-auto space-y-3 my-3 min-h-[200px]">
{(comments[showCom]||[]).map((c:any)=>(<div key={c.id} className="flex gap-2"><div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-[10px]">{c.user[0]}</div><div><p className="text-[13px] font-bold">{c.user}</p><p className="text-[13px]">{c.text}</p></div></div>))}
{(comments[showCom]||[]).length===0&&<p className="text-[13px] text-white/50">No comments yet - Be first!</p>}
</div>
<div className="flex gap-2 border-t border-white/10 pt-3">
<input value={newCom} onChange={e=>setNewCom(e.target.value)} placeholder="Add comment..." className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-[13px] outline-none" />
<button onClick={()=>addCom(showCom)} className="text-pink-500 font-bold px-4">Post</button>
</div>
</div>
</div>}

{showLive&&<div className="absolute inset-0 z-[90] bg-black flex flex-col">
<div className="p-4 flex justify-between items-center"><button onClick={()=>setShowLive(false)} className="text-xl">✕</button><div className="bg-red-600 px-3 py-1 rounded-full text-[12px] font-bold animate-pulse">🔴 LIVE</div><button onClick={()=>setMuted(!muted)} className="bg-white/20 px-3 py-1 rounded-full text-[12px]">{muted?'🔇':'🔊'}</button></div>
<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
<p className="text-[24px] font-black">🔴 LIVE</p>
<p className="mt-2">@{username}</p>
<button onClick={()=>setShowPay(true)} className="mt-8 bg-green-600 px-8 py-3 rounded-full font-bold">Lipa {MASKED} - 500</button>
</div>
</div>}

{showLyrics&&<div className="absolute inset-0 z-[90] bg-black/95 p-4 flex flex-col">
<div className="flex justify-between"><button onClick={()=>setShowLyrics(null)} className="text-xl">✕</button><p className="font-bold">🎤 Lyrics</p><button onClick={()=>setMuted(!muted)} className="bg-white/20 px-3 py-1 rounded-full text-[12px]">{muted?'🔇':'🔊'}</button></div>
<div className="flex-1 flex flex-col items-center justify-center text-center p-6"><p className="text-[20px] leading-9 font-bold whitespace-pre-line">{showLyrics.lyrics||showLyrics.c}</p></div>
</div>}

{showUp&&<div className="absolute inset-0 z-[90] bg-black p-4 flex flex-col">
<div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕</button><button onClick={save} className="bg-pink-600 px-6 py-2 rounded-full font-bold">Post</button></div>
{newUrl&&(newKind==='image'?<img src={newUrl} className="flex-1 object-contain mt-4 rounded-xl" />:<video src={newUrl} controls autoPlay muted className="flex-1 mt-4 rounded-xl" />)}
<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption + lyrics..." className="mt-4 bg-white/10 rounded-full px-4 py-3 text-sm outline-none" />
</div>}

{page==='explore'&&<div className="absolute inset-0 z-20 bg-black pt-[60px] p-3 overflow-y-auto">
<div className="bg-white/10 rounded-full flex items-center px-4"><span>🔍</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent px-3 py-3 outline-none text-[14px]" autoFocus /></div>
<div className="grid grid-cols-3 gap-[2px] mt-3">
{filtered.map(c=><div key={c.id} className="aspect-[9/16] bg-white/10 relative">
{c.k==='image'?<img src={c.u} className="w-full h-full object-cover" />:<video src={c.u} autoPlay loop muted playsInline className="w-full h-full object-cover" />}
<div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded">▶ {c.views}</div>
</div>)}
</div>
</div>}

{page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pt-[40px] overflow-y-auto flex flex-col">
<div className="flex justify-between px-4 py-2">
<button onClick={()=>setPage('home')} className="text-xl">←</button>
<button onClick={()=>setShowPay(true)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">KSH {total} - {MASKED}</button>
</div>
<div className="flex flex-col items-center">
<div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[2px]"><div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold">V</div></div>
<p className="font-black text-[16px] mt-3">{username}</p>
<p className="text-[13px] text-black/60">@{username} • Mombasa</p>
<div className="flex gap-6 mt-2 text-[13px]"><span><b>{followed.size}</b> Following</span><span><b>856</b> Followers</span><span><b>{myVideos.length}</b> Videos</span></div>
<div className="mt-3 bg-green-100 border border-green-600 px-4 py-1.5 rounded-full"><span className="text-green-700 font-black text-[11px]">KSH {total} PRIVATE {MASKED}</span></div>
<div className="flex gap-2 mt-3 w-full px-6"><button className="flex-1 bg-[#fe2c55] text-white py-2 rounded-full font-bold text-[13px]">Follow</button><button className="flex-1 bg-gray-200 py-2 rounded-full font-bold text-[13px]">Message</button></div>
</div>
<div className="flex border-t mt-4 text-[13px]"><button className="flex-1 py-3 font-bold border-b-2 border-black">Videos</button><button className="flex-1 py-3 text-black/50">Liked</button><button className="flex-1 py-3 text-black/50">Saved ({saves.size})</button></div>
<div className="grid grid-cols-3 gap-[2px] bg-black/5">
<div onClick={()=>fileRef.current?.click()} className="aspect-[9/16] bg-gray-100 flex flex-col items-center justify-center cursor-pointer"><span className="text-2xl">+</span><span className="text-[10px]">New</span></div>
{myVideos.map((v)=><div key={v.id} className="aspect-[9/16] bg-black relative group">
{v.k==='image'?<img src={v.u} className="w-full h-full object-cover" />:<video src={v.u} autoPlay loop muted playsInline className="w-full h-full object-cover" />}
<div className="absolute top-1 right-1 bg-red-600 w-7 h-7 rounded-full flex items-center justify-center text-white font-black cursor-pointer" onClick={()=>del(v.id)}>✕</div>
<div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/60 px-1 rounded">▶ {v.views}</div>
</div>)}
</div>
<p className="text-center text-[10px] text-black/40 py-3">DELETE iko hapa tu - Me page - Video zinacheza auto</p>
</div>}

{page==='home'&&<>
<div className="fixed top-[42px] left-0 right-0 z-[50] bg-black p-2 flex justify-between items-center h-[40px] border-b border-white/10">
<div className="flex items-center gap-2">
<p className="font-black text-[13px]">Vibra {MASKED} 💰</p>
<button onClick={()=>setMuted(!muted)} className={`${muted?'bg-red-600':'bg-green-600'} px-3 py-1 rounded-full text-[10px] font-bold`}>{muted?'🔇 TAP FOR SOUND':'🔊 Sound ON'}</button>
</div>
<button onClick={()=>setShowPay(true)} className="bg-green-600 px-2 py-1 rounded-full text-[10px] font-bold">KSH {total}</button>
</div>

<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[82px] pb-[60px]">
{filtered.map((c,idx)=>{
const ad=ads[(idx)%ads.length]
return(
<div key={c.id}>
<div className="h-screen w-full snap-start relative bg-zinc-900 flex items-center justify-center">
<video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} className="h-full w-full object-cover" />
{!playing[c.id]&&<button onClick={()=>{const v=vRefs.current[c.id] as HTMLVideoElement; if(v){v.muted=muted; v.play()}} } className="absolute inset-0 flex items-center justify-center z-[5]"><div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">▶️</div></button>}
{muted&&playing[c.id]&&<button onClick={()=>setMuted(false)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-full text-[12px] font-bold animate-pulse">🔇 TAP FOR SOUND 🔊</button>}
<div className="absolute bottom-[90px] left-3 right-20">
<p className="font-bold text-[14px]">@{c.user} {followed.has(c.user)&&<span className="text-[9px] bg-[#fe2c55] px-2 py-0.5 rounded-full ml-1">Following</span>}</p>
<p className="text-[13px] mt-1">{c.c}</p>
<p className="text-[11px] mt-1 text-white/60">🎵 {c.user} • original sound</p>
</div>
<ActionBtns c={c}/>
</div>
{(idx+1)%2===0&&<div onClick={()=>clickAd(ad)} className={`h-[80px] bg-gradient-to-r ${ad.color} flex flex-col items-center justify-center cursor-pointer`}><p className="text-[12px] font-black">{ad.title}</p><p className="text-[10px] mt-1">{ad.sub}</p></div>}
</div>
)})}
</div>
</>}

<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-[80]">
<button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-white/50'}`}><span>🏠</span><span className="text-[10px]">Home</span></button>
<button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'text-white/50'}`}><span>🔍</span><span className="text-[10px]">Explore</span></button>
<button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-10 h-7 bg-white rounded flex items-center justify-center text-black font-black">+</div></button>
<button onClick={()=>setShowLive(true)} className="flex flex-col items-center text-white/50"><span>🔴</span><span className="text-[10px]">LIVE</span></button>
<button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-white/50'}`}><span>👤</span><span className="text-[10px]">Me</span></button>
</div>

</div>
)
}
