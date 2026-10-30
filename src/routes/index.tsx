// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})
function Vibra(){
const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko wapi? 🔥 #Vibra',user:'mombasa_star',k:'video',views:'33K',time:'Just now',lyrics:'Watu wa Mombasa mko wapi? 🔥\nVibra ndio yetu'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana ❤️ #fyp',user:'vibra_queen',k:'video',views:'281K',time:'Just now',lyrics:'huyu nae ni moto sana ❤️'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'My Vibra Worldwide 🌍 Together Forever ❤️♾️',user:'vibra-boy',k:'video',views:'164.6K',time:'23h ago',lyrics:'My Vibra Worldwide 🌍\nTogether Forever ❤️♾️'},
]
const realAds=[
{id:1,title:'Nike - Just Do It - 50% OFF Mombasa!',sub:'Shop Now',link:'https://www.nike.com',color:'bg-orange-500'},
{id:2,title:'Coca-Cola - Taste The Feeling!',sub:'Naivas',link:'https://www.coca-cola.com',color:'bg-red-600'},
{id:3,title:'iPhone 15 Pro - Lipa Pole Pole!',sub:'Safaricom',link:'https://www.apple.com',color:'bg-zinc-800'},
{id:4,title:'Binance - Trade & Earn $100!',sub:'200M Users',link:'https://www.binance.com',color:'bg-yellow-500'},
{id:5,title:'Adidas - 40% OFF!',sub:'City Mall',link:'https://www.adidas.com',color:'bg-black'},
{id:6,title:'🔥 Advertise Here - 250K Views!',sub:'DM @vibra-boy',link:'https://wa.me/254700000000',color:'bg-pink-600'},
]
const [all,setAll]=useState(()=>{try{const s=localStorage.getItem('vibra_final_v8'); if(s){const p=JSON.parse(s); if(p.length>0) return [...p.map(x=>({...x,views:x.views||Math.floor(Math.random()*400)+'K',time:x.time||'Just now',lyrics:x.lyrics||'My Vibra Worldwide'})),...defaultVideos]}}catch{} return defaultVideos})
const [tab,setTab]=useState('foryou')
const [muted,setMuted]=useState(false)
const [likes,setLikes]=useState(new Set())
const [saved,setSaved]=useState(new Set())
const [page,setPage]=useState('home')
const [activeId,setActiveId]=useState('1')
const [showCom,setShowCom]=useState(null)
const [comments,setComments]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_comments')||'{}')}catch{return{}}})
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
const [adClicks,setAdClicks]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_ad_clicks')||'{}')}catch{return{}}})
const [following]=useState(new Set(['mombasa_star']))
const [searchQ,setSearchQ]=useState('')
const [exploreQ,setExploreQ]=useState('')
const fileRef=useRef(null)
const vRefs=useRef({})

useEffect(()=>{const id=setInterval(()=>setAdIndex(i=>(i+1)%realAds.length),4000); return ()=>clearInterval(id)},[])
useEffect(()=>{const pauseAll=()=>{Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()})}; const onHidden=()=>{if(document.hidden) pauseAll()}; document.addEventListener('visibilitychange',onHidden); window.addEventListener('pagehide',pauseAll); return ()=>{document.removeEventListener('visibilitychange',onHidden); window.removeEventListener('pagehide',pauseAll)}},[])
useEffect(()=>{if(showCom || showLive || showLyrics || showAuth){Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()}); return}; if(page!=='home'){Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()}); return}; const obs=new IntersectionObserver((ents)=>{ents.forEach(en=>{const id=en.target.getAttribute('data-vid'); const vid=vRefs.current[id] as HTMLVideoElement; if(!vid) return; if(en.isIntersecting && en.intersectionRatio>=0.6){Object.entries(vRefs.current).forEach(([k,v])=>{if(k!=id && v) (v as HTMLVideoElement).pause()}); setActiveId(id); if(!document.hidden){vid.muted=muted; vid.play().catch(()=>{})}}else{vid.pause()}})}, {threshold:[0,0.6]}); Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el as Element)}); return ()=>obs.disconnect()},[all,page,tab,muted,showCom,showLive,showLyrics,showAuth])

const filtered=()=>{let f=tab==='following'?all.filter(x=>following.has(x.user)):all; const q=page==='explore'?exploreQ:searchQ; if(q) f=f.filter(x=>x.c.toLowerCase().includes(q.toLowerCase()) || x.user.toLowerCase().includes(q.toLowerCase())); return f}
const myVideos=all.filter(x=>x.user===username || x.user==='vibra-boy')
const totalEarnings=Object.values(adClicks).reduce((a:any,b:any)=>a+b,0)*0.06+0.06
const handleLogin=()=>{if(!loginName.trim()) return; setUsername(loginName); setIsLogged(true); localStorage.setItem('vibra_logged','1'); localStorage.setItem('vibra_user',loginName); setShowAuth(false)}
const handleLogout=()=>{setIsLogged(false); localStorage.removeItem('vibra_logged'); setShowAuth(false)}
const handleUpload=(e)=>{const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=>{setNewUrl(reader.result as string); setNewKind(f.type.startsWith('image')?'image':'video')}; reader.readAsDataURL(f); setShowUp(true)}
const saveVideo=async()=>{if(!newUrl) return; setUploading(true); setProgress(50); const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra Worldwide 🌍',user:username,views:'0',time:'now',lyrics:newCap}; const newAll=[vid,...all]; setAll(newAll); try{localStorage.setItem('vibra_final_v8',JSON.stringify(newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id)).slice(0,20)))}catch{}; setProgress(100); setTimeout(()=>{setUploading(false); setShowUp(false); setNewCap(''); setNewUrl('')},500)}
const addComment=(vidId)=>{if(!newCom.trim()) return; const allComs={...comments}; if(!allComs[vidId]) allComs[vidId]=[]; allComs[vidId]=[{id:Date.now().toString(),text:newCom,user:username,time:'now'},...allComs[vidId]]; setComments(allComs); localStorage.setItem('vibra_comments',JSON.stringify(allComs)); setNewCom('')}
const clickAd=(ad)=>{const n={...adClicks,[ad.id]:(adClicks[ad.id]||0)+1};setAdClicks(n);localStorage.setItem('vibra_adClicks',JSON.stringify(n));if(ad.link)window.open(ad.link,'_blank')}
const ActionButtons=({c})=>(
<div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-4 z-10">
<button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-pink-600':'bg-white/20'}`}>❤️</div><span className="text-[11px] mt-1">{likes.has(c.id)?'1.2K':'856'}</span></button>
<button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div><span className="text-[11px] mt-1">{(comments[c.id]?.length||0)+12}K</span></button>
<button onClick={()=>setShowLyrics(c)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">🎤</div><span className="text-[10px] mt-1">Lyrics</span></button>
<button onClick={()=>{const s=new Set(saved); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaved(s)}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">🔖</div></button>
<button onClick={()=>{if(navigator.share) navigator.share({text:c.c})}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">↗️</div></button>
</div>
)
const currentAd=realAds[adIndex]
return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload} />
<div onClick={()=>clickAd(currentAd)} className={`fixed top-[0px] left-0 right-0 z-[60] ${currentAd.color} h-[36px] flex items-center px-3 cursor-pointer`}><p className={`text-[10px] font-bold flex-1 text-center ${currentAd.color.includes('yellow')?'text-black':'text-white'}`}>{currentAd.title} - ${totalEarnings.toFixed(2)} earned!</p><span className="bg-white text-black text-[8px] px-2 py-1 rounded font-black">AD</span></div>

{showAuth&&<div className="absolute inset-0 z-[100] bg-black flex flex-col p-6 justify-center"><button onClick={()=>setShowAuth(false)} className="absolute top-4 left-4">✕</button><div className="text-center"><p className="text-[28px] font-black">Vibra 🌍</p><p className="text-white/60 mt-2">{isLogged?`Logged as @${username}`:'Join Vibra Worldwide'}</p>{isLogged?<><div className="mt-8 bg-zinc-900 p-4 rounded-xl"><p className="text-[14px]">Total Earnings</p><p className="text-[32px] font-black text-green-400">${totalEarnings.toFixed(2)}</p><p className="text-[12px] text-white/50">{Object.values(adClicks).reduce((a:any,b:any)=>a+b,0)} ad clicks • $0.02 per click</p></div><button onClick={handleLogout} className="mt-6 w-full bg-white/10 py-3 rounded-full font-bold">Log Out</button></>:<><input value={loginName} onChange={e=>setLoginName(e.target.value)} placeholder="Username - e.g. vibra-boy" className="mt-8 w-full bg-white/10 rounded-full px-4 py-3.5 outline-none" /><button onClick={handleLogin} className="mt-4 w-full bg-[#fe2c55] py-3.5 rounded-full font-bold">Sign Up / Log In</button><p className="text-[11px] text-white/40 mt-4">No password needed - Just username!</p></>}</div></div>}

{showCom&&<div className="absolute inset-0 z-[80] flex items-end justify-center bg-black/60" onClick={()=>setShowCom(null)}><div className="bg-[#121212] w-full max-h-[75%] rounded-t-[20px] p-4 flex flex-col" onClick={e=>e.stopPropagation()}><div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3"></div><p className="font-bold mb-3">Comments {(comments[showCom]?.length||0)+12400}</p><div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[200px]">{(comments[showCom]||[]).map((c:any)=>(<div key={c.id} className="flex gap-2"><div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-[10px]">{c.user[0]}</div><div><p className="text-[13px] font-bold">{c.user}</p><p className="text-[13px]">{c.text}</p></div></div>))}</div><div className="flex gap-2 border-t border-white/10 pt-3"><input value={newCom} onChange={e=>setNewCom(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addComment(showCom)} placeholder="Add a comment..." className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-[13px] outline-none" autoFocus /><button onClick={()=>addComment(showCom)} className="text-pink-500 font-bold px-4">Post</button></div></div></div>}

{showLive&&<div className="absolute inset-0 z-[90] bg-black flex flex-col"><div className="p-4 flex justify-between items-center"><button onClick={()=>setShowLive(false)} className="text-white">✕ Close</button><div className="bg-red-600 px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE</div></div><div className="flex-1 flex flex-col items-center justify-center p-6 text-center"><div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">V</div><p className="text-[20px] font-black">@{username} is LIVE!</p><p className="text-[14px] text-white/60 mt-2">2.3K viewers • ${totalEarnings.toFixed(2)} earned</p><p className="mt-6 bg-[#fe2c55] px-8 py-3 rounded-full font-bold">Join LIVE</p></div></div>}

{showLyrics&&<div className="absolute inset-0 z-[90] bg-black/90 flex flex-col p-4"><div className="flex justify-between"><button onClick={()=>setShowLyrics(null)}>✕</button><p className="font-bold">Lyrics</p><span></span></div><div className="flex-1 flex flex-col items-center justify-center text-center"><p className="text-[18px] leading-8 whitespace-pre-line font-bold">{showLyrics.lyrics||showLyrics.c}</p><p className="mt-6 text-pink-400">🎵 @{showLyrics.user}</p></div></div>}

{showUp&&<div className="absolute inset-0 z-[90] bg-black p-4 flex flex-col"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕</button><button onClick={saveVideo} className="bg-pink-600 px-6 py-1 rounded-full font-bold">Post</button></div>{newUrl&&(newKind==='image'?<img src={newUrl} className="flex-1 object-contain mt-4" />:<video src={newUrl} controls className="flex-1 mt-4" />)}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption + Lyrics..." className="mt-4 bg-white/10 rounded-full px-4 py-3 text-sm outline-none" />{uploading&&<p className="text-center mt-2">{progress}%</p>}</div>}

{page==='explore'&&<div className="absolute inset-0 z-20 bg-black pt-[40px] p-2 overflow-y-auto"><input value={exploreQ} onChange={e=>setExploreQ(e.target.value)} placeholder="Search..." className="w-full bg-white/10 rounded-full px-4 py-2.5 mb-3 mt-2 outline-none" /><div className="grid grid-cols-3 gap-[2px]">{filtered().map(c=><div key={c.id} className="aspect-[9/16] bg-white/10 relative"><div className="absolute top-1 left-1 bg-black/60 text-[10px] px-1 rounded">{c.time||'13h ago'}</div>{c.k==='image'?<img src={c.u} className="w-full h-full object-cover" />:<video src={c.u} className="w-full h-full object-cover" />}<div className="absolute bottom-1 left-1 flex items-center gap-1 text-[11px]"><span>▶</span><span>{c.views||'79.7K'}</span></div></div>)}</div></div>}

{page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pt-[40px] overflow-y-auto flex flex-col">
<div className="flex justify-between px-4 py-2"><button className="text-xl">←</button><div className="flex gap-2"><button onClick={()=>setShowAuth(true)} className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-bold">{isLogged?`@${username}`:'Sign Up'}</button><button onClick={()=>setShowLive(true)} className="bg-red-600 text-white px-3 py-1 rounded-full text-[12px] font-bold animate-pulse">🔴 LIVE</button></div></div>
<div className="flex flex-col items-center">
<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative"><div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">{username[0]?.toUpperCase()}</div>{true&&<div className="absolute -bottom-1 bg-black text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white">LIVE</div>}</div>
<p className="font-black text-[18px] mt-3">{username}</p>
<p className="text-[14px] text-black/60">@{username}</p>
{isLogged&&<div className="mt-3 bg-green-50 border border-green-200 px-4 py-2 rounded-full flex items-center gap-2"><span className="text-green-600 font-black">${totalEarnings.toFixed(2)}</span><span className="text-[11px] text-black/60">earned from ads • {Object.values(adClicks).reduce((a:any,b:any)=>a+b,0)} clicks</span></div>}
<div className="flex gap-6 mt-3">
<div className="text-center"><p className="font-black text-[16px]">{myVideos.length+34}</p><p className="text-[12px] text-black/60">Following</p></div>
<div className="w-[1px] bg-black/10"></div>
<div className="text-center"><p className="font-black text-[16px]">955.3K</p><p className="text-[12px] text-black/60">Followers</p></div>
<div className="w-[1px] bg-black/10"></div>
<div className="text-center"><p className="font-black text-[16px]">15.7M</p><p className="text-[12px] text-black/60">Likes</p></div>
</div>
<div className="flex gap-2 mt-4 w-full px-6">
<button onClick={()=>setFollowed(!followed)} className={`flex-1 py-2.5 rounded font-bold ${followed?'bg-gray-200 text-black':'bg-[#fe2c55] text-white'}`}>{followed?'Following':'Follow'}</button>
<button onClick={()=>setShowAuth(true)} className="w-12 bg-gray-100 rounded flex items-center justify-center">{isLogged?'$':'👤+'}</button>
</div>
<p className="text-[13px] mt-3 text-center px-6">My Vibra Worldwide 🌍 Together Forever ❤️♾️<br/>GOD FIRST 🙏 [DM FOR PROMO]</p>
</div>
<div className="flex border-t mt-4 border-black/10">
<button onClick={()=>setMeTab('videos')} className={`flex-1 py-3 flex justify-center ${meTab==='videos'?'border-b-2 border-black':''}`}><span className="text-[18px]">▦▦</span></button>
<button onClick={()=>setMeTab('liked')} className={`flex-1 py-3 flex justify-center ${meTab==='liked'?'border-b-2 border-black':''}`}><span className="text-[18px]">♡</span></button>
</div>
{meTab==='videos'?<div className="grid grid-cols-3 gap-[2px] bg-black/5">
{myVideos.map((v,i)=><div key={v.id} className="aspect-[9/16] bg-black relative">
{v.k==='image'?<img src={v.u} className="w-full h-full object-cover" />:<video src={v.u} className="w-full h-full object-cover" />}
<div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">{v.time}</div>
{i===0&&<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white text-[11px] px-2 py-1 rounded flex items-center">▶ Just watched</div>}
<div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[12px] font-bold drop-shadow"><span>▶</span><span>{v.views}</span></div>
</div>)}
{Array.from({length:6}).map((_,i)=><div key={'fake'+i} className="aspect-[9/16] bg-black relative"><div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/30">Video</div><div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">{[13,14,23,5,2,8][i]}h ago</div><div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[12px] font-bold"><span>▶</span><span>{['353.2K','308.9K','367.9K','164.6K','61.1K','79.7K'][i]}</span></div></div>)}
</div>:<div className="p-10 text-center text-black/50"><p>❤️</p><p className="text-[13px] mt-2">Videos you liked</p></div>}
<div className="bg-white text-black text-center py-4 text-[12px] border-t flex justify-center items-center gap-2"><span>{isLogged?`@${username} • $${totalEarnings.toFixed(2)} earned`:'Sign up to watch more -'}</span><button onClick={()=>setShowAuth(true)} className="bg-[#fe2c55] text-white px-3 py-1 rounded">{isLogged?'Wallet':'Sign up'}</button></div>
</div>}

{page==='home'&&<>
<div className="fixed top-[36px] left-0 right-0 z-[70] bg-black p-2 flex justify-between items-center h-[44px]"><p className="font-black text-[18px]">Vibra</p><div className="flex gap-3 text-[14px] items-center"><button onClick={()=>setShowAuth(true)} className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{isLogged?`@${username}`:'Login'}</button><button onClick={()=>setShowLive(true)} className="bg-red-600 px-2 py-0.5 rounded text-[11px] font-bold">LIVE</button><button onClick={()=>setTab('foryou')} className={tab==='foryou'?'font-bold border-b-2 border-white':''}>For You</button></div></div>
<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[80px] pb-[60px]">
{filtered().map((c,idx)=>{const ad=realAds[(idx+adIndex)%realAds.length]; return(<div key={c.id}><div className="h-screen w-full snap-start relative bg-zinc-900 flex items-center justify-center"><video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline className="h-full w-full object-cover" onClick={e=>(e.target as HTMLVideoElement).paused?(e.target as HTMLVideoElement).play():(e.target as HTMLVideoElement).pause()} /><div className="absolute top-20 left-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE • {c.views}</div><div className="absolute bottom-[100px] left-3 right-20"><p className="font-bold text-[14px]">@{c.user}</p><p className="text-[13px] mt-1">{c.c}</p><button onClick={()=>setShowLyrics(c)} className="mt-2 text-[12px] bg-white/20 px-2 py-1 rounded-full">🎤 Lyrics - {c.c.slice(0,20)}...</button></div><ActionButtons c={c}/></div>{(idx+1)%2===0&&<div onClick={()=>clickAd(ad)} className={`h-[90px] bg-gradient-to-r ${ad.color} flex flex-col items-center justify-center cursor-pointer`}><p className="text-[12px] font-black">{ad.title}</p><p className="text-[10px] mt-1">{ad.sub} • Click = $0.02</p></div>}</div>)})}
</div>
</>}
<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-[80]"><button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'text-white/50'}`}><span>🏠</span><span className="text-[10px]">Home</span></button><button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'text-white/50'}`}><span>🔍</span><span className="text-[10px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-10 h-7 bg-white rounded flex items-center justify-center text-black font-black">+</div></button><button onClick={()=>setShowLive(true)} className="flex flex-col items-center text-white/50"><span>🔴</span><span className="text-[10px]">LIVE</span></button><button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-white':'text-white/50'}`}><span>👤</span><span className="text-[10px]">Me • ${totalEarnings.toFixed(2)}</span></button></div>
</div>
)
}
