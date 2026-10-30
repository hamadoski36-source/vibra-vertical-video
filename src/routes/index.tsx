// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})
function Vibra(){
const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko wapi? 🔥 #Vibra',user:'mombasa_star',k:'video'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana ❤️ #fyp',user:'vibra_queen',k:'video'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'My Vibra Worldwide 🌍 Together Forever ❤️♾️',user:'vibra-boy',k:'video'},
]
const realAds=[
{id:1,title:'Nike - Just Do It - 50% OFF Mombasa!',sub:'Shop Now - Bamburi',link:'https://www.nike.com',color:'bg-orange-500'},
{id:2,title:'Coca-Cola - Taste The Feeling!',sub:'Naivas Mombasa',link:'https://www.coca-cola.com',color:'bg-red-600'},
{id:3,title:'iPhone 15 Pro - Lipa Pole Pole!',sub:'Safaricom',link:'https://www.apple.com',color:'bg-zinc-800'},
{id:4,title:'Binance - Trade & Earn $100!',sub:'200M Users',link:'https://www.binance.com',color:'bg-yellow-500'},
{id:5,title:'Adidas - 40% OFF!',sub:'City Mall',link:'https://www.adidas.com',color:'bg-black'},
{id:6,title:'🔥 Advertise Here - 250K Views!',sub:'DM @vibra-boy',link:'https://wa.me/254700000000',color:'bg-pink-600'},
]
const [all,setAll]=useState(()=>{try{const s=localStorage.getItem('vibra_final_v8'); if(s){const p=JSON.parse(s); if(p.length>0) return [...p,...defaultVideos]}}catch{} return defaultVideos})
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
const [showList,setShowList]=useState(null)
const [showLive,setShowLive]=useState(false)
const [showMeVideo,setShowMeVideo]=useState(null)
const [showLyrics,setShowLyrics]=useState(null)
const [showSearch,setShowSearch]=useState(false)
const [searchQ,setSearchQ]=useState('')
const [exploreQ,setExploreQ]=useState('')
const [newCap,setNewCap]=useState('')
const [newUrl,setNewUrl]=useState('')
const [newKind,setNewKind]=useState('video')
const [uploading,setUploading]=useState(false)
const [progress,setProgress]=useState(0)
const [adIndex,setAdIndex]=useState(0)
const [adClicks,setAdClicks]=useState(()=>{try{return JSON.parse(localStorage.getItem('vibra_ad_clicks')||'{}')}catch{return{}}})
const [following]=useState(new Set(['mombasa_star']))
const fileRef=useRef(null)
const vRefs=useRef({})

// FIX 1: AD ROTATION + FIX 2: KATA SAUTI UKITOKA APP!
useEffect(()=>{const id=setInterval(()=>setAdIndex(i=>(i+1)%realAds.length),4000); return ()=>clearInterval(id)},[])
useEffect(()=>{const pauseAll=()=>{Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()})}; const onHidden=()=>{if(document.hidden) pauseAll()}; document.addEventListener('visibilitychange',onHidden); window.addEventListener('pagehide',pauseAll); return ()=>{document.removeEventListener('visibilitychange',onHidden); window.removeEventListener('pagehide',pauseAll)}},[])
// FIX 3: SAUTI INAKATA UKI-SCROLL + UKIFUNGUA COMMENT!
useEffect(()=>{if(showCom){Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()}); return}; if(page!=='home'){Object.values(vRefs.current).forEach(v=>{if(v) (v as HTMLVideoElement).pause()}); return}; const obs=new IntersectionObserver((ents)=>{ents.forEach(en=>{const id=en.target.getAttribute('data-vid'); const vid=vRefs.current[id] as HTMLVideoElement; if(!vid) return; if(en.isIntersecting && en.intersectionRatio>=0.6){Object.entries(vRefs.current).forEach(([k,v])=>{if(k!=id && v) (v as HTMLVideoElement).pause()}); setActiveId(id); if(!document.hidden && !showCom){vid.muted=muted; vid.play().catch(()=>{})}}else{vid.pause()}})}, {threshold:[0,0.6]}); Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el as Element)}); return ()=>obs.disconnect()},[all,page,tab,muted,showCom])

const filtered=()=>{let f=tab==='following'?all.filter(x=>following.has(x.user)):all; const q=page==='explore'?exploreQ:searchQ; if(q) f=f.filter(x=>x.c.toLowerCase().includes(q.toLowerCase()) || x.user.toLowerCase().includes(q.toLowerCase())); return f}
const myVideos=all.filter(x=>x.user==='vibra-boy')
const handleUpload=(e)=>{const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=>{setNewUrl(reader.result as string); setNewKind(f.type.startsWith('image')?'image':'video'); setShowUp(true)}; reader.readAsDataURL(f)}
const saveVideo=async()=>{if(!newUrl) return; setUploading(true); setProgress(50); const vid={id:Date.now().toString(),u:newUrl,k:newKind,c:newCap||'My Vibra Worldwide 🌍',user:'vibra-boy'}; const newAll=[vid,...all]; setAll(newAll); try{localStorage.setItem('vibra_final_v8',JSON.stringify(newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id)).slice(0,20)))}catch{}; setProgress(100); setTimeout(()=>{setUploading(false); setShowUp(false); setNewCap(''); setNewUrl('')},500)}
const addComment=(vidId)=>{if(!newCom.trim()) return; const allComs={...comments}; if(!allComs[vidId]) allComs[vidId]=[]; allComs[vidId]=[{id:Date.now().toString(),text:newCom,user:'vibra-boy',time:'now'},...allComs[vidId]]; setComments(allComs); localStorage.setItem('vibra_comments',JSON.stringify(allComs)); setNewCom('')}
const delVideo=(id)=>{if(!confirm('Futa?')) return; const newAll=all.filter(x=>x.id!=id); setAll(newAll); try{localStorage.setItem('vibra_final_v8',JSON.stringify(newAll.filter(v=>!defaultVideos.find(d=>d.id===v.id))))}catch{}; setShowMeVideo(null)}
const clickAd=(ad)=>{const n={...adClicks,[ad.id]:(adClicks[ad.id]||0)+1}; setAdClicks(n); localStorage.setItem('vibra_ad_clicks',JSON.stringify(n)); window.open(ad.link,'_blank')}

const ActionButtons=({c})=>(
<div className="absolute bottom-[90px] right-2 flex flex-col items-center gap-5 z-10">
<button onClick={()=>{const s=new Set(likes); s.has(c.id)?s.delete(c.id):s.add(c.id); setLikes(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${likes.has(c.id)?'bg-pink-600':'bg-white/20'}`}>❤️</div><span className="text-[11px] mt-1">{likes.has(c.id)?'1.2K':'856'}</span></button>
<button onClick={()=>setShowCom(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div><span className="text-[11px] mt-1">{(comments[c.id]?.length||0)+12}K</span></button>
<button onClick={()=>{const s=new Set(saved); s.has(c.id)?s.delete(c.id):s.add(c.id); setSaved(s)}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">🔖</div></button>
<button onClick={()=>{if(navigator.share) navigator.share({text:c.c})}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">↗️</div></button>
</div>
)
const currentAd=realAds[adIndex]
return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload} />
{showSearch&&<div className="absolute top-0 left-0 right-0 z-[120] bg-black p-3 flex gap-2"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm outline-none" autoFocus /><button onClick={()=>setShowSearch(false)}>✕</button></div>}
<div onClick={()=>clickAd(currentAd)} className={`fixed top-[44px] left-0 right-0 z-[60] ${currentAd.color} h-[36px] flex items-center px-3 cursor-pointer`}><p className={`text-[10px] font-bold flex-1 text-center ${currentAd.color.includes('yellow')?'text-black':'text-white'}`}>{currentAd.title}</p><span className="bg-white text-black text-[8px] px-2 py-1 rounded font-black">AD</span></div>
{showCom&&<div className="absolute inset-0 z-[80] flex items-end justify-center bg-black/60" onClick={()=>setShowCom(null)}><div className="bg-[#121212] w-full max-h-[75%] rounded-t-[20px] p-4 flex flex-col" onClick={e=>e.stopPropagation()}><div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3"></div><p className="font-bold mb-3">Comments {(comments[showCom]?.length||0)+12400}</p><div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[200px]">{(comments[showCom]||[]).map((c:any)=>(<div key={c.id} className="flex gap-2"><div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-[10px]">{c.user[0]}</div><div><p className="text-[13px] font-bold">{c.user}</p><p className="text-[13px]">{c.text}</p></div></div>))}</div><div className="flex gap-2 border-t border-white/10 pt-3"><input value={newCom} onChange={e=>setNewCom(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addComment(showCom)} placeholder="Add a comment..." className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-[13px] outline-none" autoFocus /><button onClick={()=>addComment(showCom)} className="text-pink-500 font-bold px-4">Post</button></div></div></div>}
{showUp&&<div className="absolute inset-0 z-[90] bg-black p-4 flex flex-col"><div className="flex justify-between"><button onClick={()=>setShowUp(false)}>✕</button><button onClick={saveVideo} className="bg-pink-600 px-6 py-1 rounded-full font-bold">Post</button></div>{newUrl&&(newKind==='image'?<img src={newUrl} className="flex-1 object-contain mt-4" />:<video src={newUrl} controls className="flex-1 mt-4" />)}<input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder="Caption..." className="mt-4 bg-white/10 rounded-full px-4 py-3 text-sm outline-none" />{uploading&&<p className="text-center mt-2">{progress}%</p>}</div>}
{page==='explore'&&<div className="absolute inset-0 z-20 bg-black pt-[90px] p-2 overflow-y-auto"><input value={exploreQ} onChange={e=>setExploreQ(e.target.value)} placeholder="Search..." className="w-full bg-white/10 rounded-full px-4 py-2.5 mb-3 outline-none" /><div className="grid grid-cols-3 gap-1">{filtered().map(c=><div key={c.id} className="aspect-[9/16] bg-white/10">{c.k==='image'?<img src={c.u} className="w-full h-full object-cover" />:<video src={c.u} className="w-full h-full object-cover" />}</div>)}</div></div>}
{page==='me'&&<div className="absolute inset-0 z-30 bg-white text-black pt-12 overflow-y-auto"><div className="p-4 text-center"><div className="w-20 h-20 bg-pink-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">V</div><p className="font-bold mt-2">@vibra-boy</p><p className="text-sm text-black/60">My Vibra Worldwide 🌍</p></div><div className="grid grid-cols-3 gap-1 p-1">{myVideos.map(v=><div key={v.id} onClick={()=>setShowMeVideo(v.id)} className="aspect-[9/16] bg-black/10">{v.k==='image'?<img src={v.u} className="w-full h-full object-cover" />:<video src={v.u} className="w-full h-full object-cover" />}</div>)}</div></div>}
{page==='home'&&<>
<div className="fixed top-0 left-0 right-0 z-[70] bg-black p-2 flex justify-between items-center h-[44px]"><p className="font-black text-[18px]">Vibra</p><div className="flex gap-4 text-[14px]"><button onClick={()=>setTab('foryou')} className={tab==='foryou'?'font-bold border-b-2 border-white':''}>For You</button><button onClick={()=>setTab('following')} className={tab==='following'?'font-bold border-b-2 border-white':''}>Following</button><button onClick={()=>setShowSearch(true)}>🔍</button></div></div>
<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[80px] pb-[60px]">
{filtered().map((c,idx)=>{const ad=realAds[(idx+adIndex)%realAds.length]; return(<div key={c.id}><div className="h-screen w-full snap-start relative bg-zinc-900 flex items-center justify-center"><video ref={el=>vRefs.current[c.id]=el} data-vid={c.id} src={c.u} loop playsInline className="h-full w-full object-cover" onClick={e=>(e.target as HTMLVideoElement).paused?(e.target as HTMLVideoElement).play():(e.target as HTMLVideoElement).pause()} /><div className="absolute bottom-[100px] left-3 right-20"><p className="font-bold text-[14px]">@{c.user}</p><p className="text-[13px] mt-1">{c.c}</p></div><ActionButtons c={c}/></div>{(idx+1)%2===0&&<div onClick={()=>clickAd(ad)} className={`h-[90px] bg-gradient-to-r ${ad.color} flex flex-col items-center justify-center cursor-pointer`}><p className="text-[12px] font-black">{ad.title}</p><p className="text-[10px] mt-1">{ad.sub}</p></div>}</div>)})}
</div>
</>}
<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-[80]"><button onClick={()=>setPage('home')} className="flex flex-col items-center"><span>🏠</span><span className="text-[10px]">Home</span></button><button onClick={()=>setPage('explore')} className="flex flex-col items-center"><span>🔍</span><span className="text-[10px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-10 h-7 bg-white rounded flex items-center justify-center text-black font-black">+</div></button><button className="flex flex-col items-center text-white/50"><span>📥</span><span className="text-[10px]">Inbox</span></button><button onClick={()=>setPage('me')} className="flex flex-col items-center"><span>👤</span><span className="text-[10px]">Me</span></button></div>
</div>
)
}
