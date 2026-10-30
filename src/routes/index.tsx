// @ts-nocheck - VIBRA FULL FEATURES + SOUND + DELETE ON ME ONLY
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})
function Vibra(){
const MY_MPESA='0740805970'
const MASKED='0740***970'
const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko wapi? 🔥 Siuliniacha Nyoko #Vibra',user:'mombasa_star',k:'video',views:'33K',time:'Just now',lyrics:'Watu wa Mombasa mko wapi? Siuliniacha Nyoko'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana ❤️ #fyp #love',user:'vibra_queen',k:'video',views:'281K',time:'Just now',lyrics:'huyu nae ni moto sana'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'My Vibra Worldwide 🌍 Together Forever ❤️♾️',user:'vibra-boy',k:'video',views:'164.6K',time:'23h ago',lyrics:'My Vibra Worldwide Together Forever'},
]
const [all,setAll]=useState(()=>{try{const s=localStorage.getItem('vibra_final_v8'); if(s){const p=JSON.parse(s); if(p.length>0) return [...p,...defaultVideos]}}catch{} return defaultVideos})
const [muted,setMuted]=useState(false)
const [likes,setLikes]=useState(new Set())
const [saves,setSaves]=useState(new Set())
const [page,setPage]=useState('home')
const [activeId,setActiveId]=useState('1')
const [showCom,setShowCom]=useState(null)
const [comments,setComments]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_comments')||'{}')}catch{return{}}})
const [newCom,setNewCom]=useState('')
const [showUp,setShowUp]=useState(false)
const [showLive,setShowLive]=useState(false)
const [showLyrics,setShowLyrics]=useState(null)
const [showAuth,setShowAuth]=useState(false)
const [showWithdraw,setShowWithdraw]=useState(false)
const [showProfile,setShowProfile]=useState(null)
const [isLogged,setIsLogged]=useState(()=>{try{return localStorage.getItem('vibra_logged')==='1'}catch{return false}})
const [username,setUsername]=useState(()=>{try{return localStorage.getItem('vibra_user')||'vibra-boy'}catch{return 'vibra-boy'}})
const [loginName,setLoginName]=useState('')
const [newCap,setNewCap]=useState('')
const [newUrl,setNewUrl]=useState('')
const [newKind,setNewKind]=useState('video')
const [followedUsers,setFollowedUsers]=useState(new Set())
const [followingCount,setFollowingCount]=useState(0)
const [adIndex,setAdIndex]=useState(0)
const [adClicks,setAdClicks]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_ad_clicks')||'{}')}catch{return{}}})
const [realEarnings,setRealEarnings]=useState(()=>{try{return parseFloat(localStorage.getItem('vibra_real_earn')||'0')}catch{return 0}})
const [exploreQ,setExploreQ]=useState('')
const [playing,setPlaying]=useState({})
const fileRef=useRef(null)
const vRefs=useRef({})
const realAds=[
{id:1,title:'ADVERTISE ON VIBRA - 500 KES',sub:'Click to Pay via M-Pesa',link:`https://wa.me/254740805970?text=Habari%20Vibra!%20500%20bob%20advertise`,color:'bg-pink-600',pay:'PRIVATE'},
{id:2,title:'🔥 LIPA HAPA - ADVERTISE NOW',sub:'WhatsApp - Pesa kwa owner',link:`https://wa.me/254740805970?text=Mambo%20Vibra!%20Nataka%20kulipa`,color:'bg-green-600',pay:'CLICK'},
]

useEffect(()=>{const id=setInterval(()=>setAdIndex(i=>(i+1)%realAds.length),4000); return ()=>clearInterval(id)},[])
useEffect(()=>{
const obs=new IntersectionObserver((ents)=>{
ents.forEach(en=>{
const id=en.target.getAttribute('data-vid')
const vid=vRefs.current[id] as HTMLVideoElement
if(!vid) return
if(en.isIntersecting && en.intersectionRatio>=0.5){
setActiveId(id)
vid.muted=muted
vid.play().then(()=>setPlaying(p=>({...p,[id]:true}))).catch(()=>{})
}else{
vid.pause()
setPlaying(p=>({...p,[id]:false}))
}
})
},{threshold:0.5})
Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el as Element)})
return ()=>obs.disconnect()
},[all,page,muted])

// Update mute for all videos when muted changes
useEffect(()=>{Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).muted=muted})},[muted])

const filtered=()=>{let f=all; if(exploreQ) f=f.filter(x=>x.c.toLowerCase().includes(exploreQ.toLowerCase())); return f}
const myVideos=all.filter(x=>x.user===username || x.user==='vibra-boy')
const totalReal=realEarnings+Object.values(adClicks).reduce((a:any,b:any)=>a+b,0)*0.02
const deleteVideo=(id)=>{if(!confirm('FUTA VIDEO HII KABISA? Hii iko kwa Me tu - hakuna kurudi!')) return; const na=all.filter(x=>x.id!==id); setAll(na); localStorage.setItem('vibra_final_v8',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id)).slice(0,20))); alert('✅ Imefutwa kutoka Me!')}
const handleFollow=(user)=>{const s=new Set(followedUsers); if(s.has(user)){s.delete(user); setFollowingCount(c=>c-1)}else{s.add(user); setFollowingCount(c=>c+1)} setFollowedUsers(s)}
const handleLogin=()=>{if(!loginName.trim()) return; setUsername(loginName); setIsLogged(true); localStorage.setItem('vibra_logged','1'); localStorage.setItem('vibra_user',loginName); setShowAuth(false)}
const handleUpload=(e)=>{const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=>{setNewUrl(reader.result as string); setNewKind(f.type.startsWith('image')?'image':'video')}; reader.readAsDataURL(f); setShowUp(true)}
const saveVideo=()=>{if(!newUrl) return; const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'Vibra',user:username,views:'0',time:'now',lyrics:newCap}; const newAll=[vid,...all]; setAll(newAll); localStorage.setItem('vibra_final_v8',JSON.stringify(newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id)).slice(0,20))); setShowUp(false); setNewCap(''); setNewUrl('')}
const addComment=(vidId)=>{if(!newCom.trim()) return; const allComs={...comments}; if(!allComs[vidId]) allComs[vidId]=[]; allComs[vidId]=[{id:Date.now().toString(),text:newCom,user:username,time:'now'},...allComs[vidId]]; setComments(allComs); localStorage.setItem('vibra_comments',JSON.stringify(allComs)); setNewCom('')}
const clickAd=(ad)=>{const n={...adClicks,[ad.id]:(adClicks[ad.id]||0)+1}; setAdClicks(n); localStorage.setItem('vibra_ad_clicks',JSON.stringify(n)); const earn=500; const newReal=realEarnings+earn; setRealEarnings(newReal); localStorage.setItem('vibra_real_earn',newReal.toString()); window.open(ad.link,'_blank')}
const togglePlay=(id)=>{const vid=vRefs.current[id] as HTMLVideoElement; if(!vid) return; if(vid.paused){vid.muted=muted; vid.play(); setPlaying(p=>({...p,[id]:true}))}else{vid.pause(); setPlaying(p=>({...p,[id]:false}))}}
const handleShare=(c)=>{if(navigator.share){navigator.share({title:'Vibra',text:c.c,url:window.location.href})}else{navigator.clipboard.writeText(window.location.href); alert('Link copied! 📋')}}

const ActionButtons=({c})=>(
<div className="absolute bottom-[100px] right-2 flex flex-col items-center gap-4 z-10">
<button onClick={()=>setShowProfile(c.user)} className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[2px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[12px] font-bold">{c.user[0].toUpperCase()}</div></div><div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${followedUsers.has(c.user)?'bg-gray-500':'bg-[#fe2c55]'}`}>{followedUsers.has(c.user)?'✓':'+'}</div></button>
<button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-pink-600':'bg-white/20'}`}>❤️</div><span className="text-[11px] mt-1 font-bold">856</span></button>
<button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div><span className="text-[11px] mt-1 font-bold">13K</span></button>
<button onClick={()=>{const s=new Set(saves); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaves(s); alert(s.has(c.id)?'Saved! 🔖':'Unsaved')}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${saves.has(c.id)?'bg-yellow-500':'bg-white/20'}`}>🔖</div><span className="text-[10px] mt-1">{saves.has(c.id)?'Saved':'Save'}</span></button>
<button onClick={()=>handleShare(c)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">↗️</div><span className="text-[10px] mt-1">Share</span></button>
<button onClick={()=>setShowLyrics(c)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">🎤</div><span className="text-[9px] mt-1">Lyrics</span></button>
</div>
)

const currentAd=realAds[adIndex]
return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload} />
<div onClick={()=>clickAd(currentAd)} className={`fixed top-0 left-0 right-0 z-[60] ${currentAd.color} h-[42px] flex items-center px-3 cursor-pointer`}><p className="text-[11px] font-bold flex-1 text-center text-white">{currentAd.title}</p><span className="bg-white text-black text-[8px] px-2 py-1 rounded font-black">PRIVATE {MASKED}</span></div>

{showProfile&&<div className="absolute inset-0 z-[100] bg-black flex flex-col p-6"><button onClick={()=>setShowProfile(null)} className="absolute top-4 left-4 text-xl">✕</button><div className="flex flex-col items-center mt-16"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[3px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-bold">{showProfile[0].toUpperCase()}</div></div><p className="font-black text-[20px] mt-4">@{showProfile}</p><div className="flex gap-6 mt-2 text-[13px]"><span><b>1.2K</b> Following</span><span><b>45K</b> Followers</span></div><div className="flex gap-3 mt-6 w-full px-6"><button onClick={()=>handleFollow(showProfile)} className={`flex-1 py-3 rounded-full font-bold ${followedUsers.has(showProfile)?'bg-white/20':'bg-[#fe2c55]'}`}>{followedUsers.has(showProfile)?'Following':'Follow'}</button><button onClick={()=>setShowProfile(null)} className="flex-1 bg-white/10 py-3 rounded-full font-bold">Message</button></div><button onClick={()=>{setPage('me'); setShowProfile(null)}} className="mt-6 text-[13px] text-white/60">View Profile 👤</button></div></div>}

{showWithdraw&&<div className="absolute inset-0 z-[100] bg-black flex flex-col p-6 justify-center"><button onClick={()=>setShowWithdraw(false)} className="absolute top-4 left-4 text-xl">✕</button><div className="text-center"><p className="text-[22px] font-black">Wallet Private</p><div className="mt-8 bg-zinc-900 p-6 rounded-xl"><p className="text-[36px] font-black text-green-400">KSH {totalReal.toFixed(0)}</p><p className="text-[12px]">Private: {MASKED}</p><p className="text-[10px] text-white/40">{MY_MPESA} - wewe tu</p></div><button onClick={()=>window.open(`https://wa.me/254740805970`,'_blank')} className="mt-6 w-full bg-green-600 py-3 rounded-full font-bold">WhatsApp {MASKED}</button></div></div>}

{showAuth&&<div className="absolute inset-0 z-[100] bg-black flex flex-col p-6 justify-center"><button onClick={()=>setShowAuth(false)} className="absolute top-4 left-4">✕</button><div className="text-center"><p className="text-[24px] font-black">Vibra Private</p>{isLogged?<><div className="mt-8 bg-zinc-900 p-4 rounded-xl"><p className="text-[28px] font-black text-green-400">KSH {totalReal.toFixed(0)}</p><p className="text-[11px]">{MASKED}</p><div className="mt-2 flex justify-center gap-4 text-[12px]"><span>Following: {followingCount}</span><span>Followers: 856</span></div></div><button onClick={()=>{setShowAuth(false); setShowWithdraw(true)}} className="mt-4 w-full bg-green-600 py-3 rounded-full font-bold">Wallet</button><button onClick={()=>{setIsLogged(false); localStorage.removeItem('vibra_logged'); setShowAuth(false)}} className="mt-3 w-full bg-white/5 py-3 rounded-full">Log Out</button></>:<><input value={loginName} onChange={e=>setLoginName(e.target.value)} placeholder="Username" className="mt-8 w-full bg-white/10 rounded-full px-4 py-3.5 outline-none" /><button onClick={handleLogin} className="mt-4 w-full bg-[#fe2c55] py-3.5 rounded-full font-bold">Sign Up</button></>}</div></div>}

{showCom&&<div className="absolute inset-0 z-[80] flex items-end justify-center bg-black/60" onClick={()=>setShowCom(null)}><div className="bg-[#121212] w-full max-h-[75%] rounded-t-[20px] p-4 flex flex-col" onClick={e=>e.stopPropagation()}><div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3"></div><p className="font-bold">Comments 13K</p><div className="flex-1 overflow-y-auto space-y-3 my-3 min-h-[200px]">{(comments[showCom]||[]).map((c:any)=>(<div key={c.id} className="flex gap-2"><div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-[10px]">{c.user[0]}</div><div><p className="text-[13px] font-bold">{c.user}</p><p className="text-[13px]">{c.text}</p></div></div>))}</div><div className="flex gap-2 border-t border-white/10 pt-3"><input value={newCom} onChange={e=>setNewCom(e.target.value)} placeholder="Add comment..." className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-[13px] outline-none" autoFocus /><button onClick={()=>addComment(showCom)} className="text-pink-500 font-bold px-4">Post</button></div></div></div>}

{showLive&&<div className="absolute inset-0 z-[90] bg-black flex flex-col"><div className="p-4 flex justify-between items-center"><button onClick={()=>setShowLive(false)} className="text-xl">✕</button><div className="bg-red-600 px-3 py-1 rounded-full text-[12px] font-bold animate-pulse">🔴 LIVE • {followingCount} watching</div><button onClick={()=>setMuted(!muted)} className="bg-white/20 px-3 py-1 rounded-full text-[12px]">{muted?'🔇':'🔊'}</button></div><div className="flex-1 flex flex-col items-center justify-center p-6 text-center"><p className="text-[24px] font-black">🔴 LIVE</p><p className="mt-2 text-[14px]">@{username} - Live now!</p><p className="mt-1 text-white/60 text-[12px]">{MASKED} - Private</p><div className="mt-6 flex gap-3"><button className="bg-pink-600 px-6 py-2 rounded-full font-bold">❤️ Like</button><button className="bg-white/20 px-6 py-2 rounded-full">💬 Comment</button></div><button onClick={()=>window.open(`https://wa.me/254740805970`,'_blank')} className="mt-8 bg-green-600 px-8 py-3 rounded-full font-bold">WhatsApp {MASKED}</button></div><div className="p-4 border-t border-white/10"><p className="text-[12px] text-white/50">Live chat - Followers only</p></div></div>}

{showLyrics&&<div className="absolute inset-0 z-[90] bg-black/95 flex flex-col p-4"><div className="flex justify-between items-center"><button onClick={()=>setShowLyrics(null)} className="text-xl">✕</button><p className="font-bold">🎤 Lyrics</p><button onClick={()=>setMuted(!muted)} className="bg-white/20 px-3 py-1 rounded-full text-[12px]">{muted?'🔇':'🔊'}</button></div><div className="flex-1 flex flex-col items-center justify-center text-center p-6"><p className="text-[20px] leading-9 whitespace-pre-line font-bold">{showLyrics.lyrics||showLyrics.c}</p><p className="mt-6 text-[12px] text-white/50">@{showLyrics.user} • {showLyrics.views} views</p></div></div>}

{showUp&&<div className="absolute inset-0 z-[90] bg-black p-4 flex flex-col"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕</button><button onClick={saveVideo} className="bg-pink-600 px-6 py-2 rounded-full font-bold">Post</button></div>{newUrl&&(newKind==='image'?<img src={newUrl} className="flex-1 object-contain mt-4" />:<video src={newUrl} controls autoPlay muted className="flex-1 mt-4" />)}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption + lyrics..." className="mt-4 bg-white/10 rounded-full px-4 py-3 text-sm outline-none" /></div>}

{page==='explore'&&<div className="absolute inset-0 z-20 bg-black pt-[70px] p-3 overflow-y-auto"><div className="bg-white/10 rounded-full flex items-center px-4"><span>🔍</span><input value={exploreQ} onChange={e=>setExploreQ(e.target.value)} placeholder="Search users, sounds, videos..." className="flex-1 bg-transparent px-3 py-3 outline-none text-[14px]" autoFocus /></div><div className="flex gap-2 mt-3 overflow-x-auto"><button className="bg-white text-black px-4 py-1.5 rounded-full text-[12px] font-bold">For You</button><button className="bg-white/20 px-4 py-1.5 rounded-full text-[12px]">Following</button><button className="bg-white/20 px-4 py-1.5 rounded-full text-[12px]">Live</button></div><div className="grid grid-cols-3 gap-[2px] mt-3">{filtered().map(c=><div key={c.id} className="aspect-[9/16] bg-white/10 relative"><div className="absolute top-1 left-1 bg-black/60 text-[9px] px-1 rounded">{c.views}</div>{c.k==='image'?<img src={c.u} className="w-full h-full object-cover" />:<video src={c.u} muted className="w-full h-full object-cover" />}<div className="absolute bottom-1 left-1 right-1"><p className="text-[9px] truncate">@{c.user}</p></div></div>)}</div></div>}

{page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pt-[40px] overflow-y-auto flex flex-col"><div className="flex justify-between px-4 py-2"><button onClick={()=>setPage('home')} className="text-xl">←</button><div className="flex gap-2"><button onClick={()=>setShowAuth(true)} className="bg-black text-white px-3 py-1 rounded-full text-[11px]">⚙️</button><button onClick={()=>setShowWithdraw(true)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">KSH {totalReal.toFixed(0)}</button></div></div><div className="flex flex-col items-center"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-[3px]"><div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold">{username[0]?.toUpperCase()}</div></div><p className="font-black text-[18px] mt-3">{username}</p><p className="text-[13px] text-black/60">@{username} • Mombasa</p><div className="flex gap-6 mt-3 text-[13px]"><span><b>{followingCount}</b> Following</span><span><b>856</b> Followers</span><span><b>{myVideos.length}</b> Videos</span></div><div className="mt-3 bg-green-100 border border-green-300 px-4 py-2 rounded-full"><span className="text-green-700 font-black text-[12px]">KSH {totalReal.toFixed(0)} PRIVATE {MASKED}</span></div><div className="flex gap-2 mt-4 w-full px-6"><button className="flex-1 bg-[#fe2c55] text-white py-2.5 rounded-full font-bold">Follow</button><button className="flex-1 bg-gray-200 py-2.5 rounded-full font-bold">Message</button></div></div><div className="flex border-t mt-4"><button className="flex-1 py-3 font-bold border-b-2 border-black">Videos</button><button className="flex-1 py-3 text-black/50">Liked</button><button className="flex-1 py-3 text-black/50">Saved ({saves.size})</button></div><div className="grid grid-cols-3 gap-[2px] bg-black/5"><div onClick={()=>fileRef.current?.click()} className="aspect-[9/16] bg-gray-100 flex flex-col items-center justify-center"><span className="text-2xl">+</span><span className="text-[10px]">New</span></div>{myVideos.map((v)=><div key={v.id} className="aspect-[9/16] bg-black relative group">{v.k==='image'?<img src={v.u} className="w-full h-full object-cover" />:<video src={v.u} muted className="w-full h-full object-cover" />}<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2"><button onClick={()=>deleteVideo(v.id)} className="bg-red-600 text-white px-4 py-2 rounded-full text-[12px] font-bold">🗑️ DELETE</button><p className="text-white text-[10px]">Tap to delete</p></div><div className="absolute top-1 right-1 bg-red-600 w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-[14px]">✕</div><div className="absolute bottom-1 left-1 text-white text-[11px] bg-black/60 px-1 rounded">▶ {v.views}</div></div>)}</div><p className="text-center text-[11px] text-black/40 py-4">DELETE iko hapa tu - Me page - Bonyeza video ku-futa</p></div>}

{page==='home'&&<>
<div className="fixed top-[42px] left-0 right-0 z-[70] bg-black p-2 flex justify-between items-center h-[44px]"><div className="flex items-center gap-2"><p className="font-black text-[15px]">Vibra 💰 {MASKED}</p><button onClick={()=>setMuted(!muted)} className="bg-white/20 px-2 py-1 rounded-full text-[11px]">{muted?'🔇 Sauti Imefungwa':'🔊 Sauti Iko'}</button></div><div className="flex gap-2 items-center"><button onClick={()=>setPage('explore')} className="bg-white/10 px-3 py-1 rounded-full text-[12px]">🔍 Search</button><button onClick={()=>setShowWithdraw(true)} className="bg-green-600 px-2 py-1 rounded-full text-[10px] font-bold">KSH {totalReal.toFixed(0)}</button></div></div>
<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[86px] pb-[60px]">
{filtered().map((c,idx)=>{
const ad=realAds[(idx+adIndex)%realAds.length]
const isPlaying=playing[c.id]
return(
<div key={c.id}>
<div className="h-screen w-full snap-start relative bg-zinc-900 flex items-center justify-center">
<video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline muted={muted} className="h-full w-full object-cover" onClick={()=>togglePlay(c.id)} />
{!isPlaying&&<button onClick={()=>togglePlay(c.id)} className="absolute inset-0 flex items-center justify-center z-[5]"><div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">▶️</div></button>}
<div className="absolute top-20 left-3 flex gap-2"><div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">LIVE</div><div className="bg-black/60 px-2 py-0.5 rounded text-[10px]">{c.views} views</div></div>
<div className="absolute bottom-[90px] left-3 right-20 pointer-events-none"><p className="font-bold text-[15px] flex items-center gap-2">@{c.user} {followedUsers.has(c.user)&&<span className="text-[10px] bg-[#fe2c55] px-2 py-0.5 rounded-full">Following</span>}</p><p className="text-[13px] mt-1 leading-4">{c.c}</p><p className="text-[12px] mt-2 text-white/70">🎵 {c.user} • original sound</p></div>
<ActionButtons c={c}/>
</div>
{(idx+1)%2===0&&<div onClick={()=>clickAd(ad)} className={`h-[90px] bg-gradient-to-r ${ad.color} flex flex-col items-center justify-center cursor-pointer`}><p className="text-[12px] font-black">{ad.title}</p><p className="text-[10px] mt-1">{ad.sub} - PRIVATE {MASKED}</p></div>}
</div>
)})}
</div>
</>}
<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-[80]"><button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-white/50'}`}><span>🏠</span><span className="text-[10px]">Home</span></button><button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'text-white/50'}`}><span>🔍</span><span className="text-[10px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-10 h-7 bg-white rounded flex items-center justify-center text-black font-black">+</div></button><button onClick={()=>setShowLive(true)} className="flex flex-col items-center text-white/50"><span>🔴</span><span className="text-[10px]">LIVE</span></button><button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-white/50'}`}><span>👤</span><span className="text-[10px]">Me • KSH {totalReal.toFixed(0)}</span></button></div>
</div>
)
}
