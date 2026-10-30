// @ts-nocheck - VIBRA V11 - ULTRA CLEAN - FUTA YOTE - HII PEKEE
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})

function Vibra(){
const MY_MPESA='0740805970'
const MASKED='0740***970'

const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa mko wapi? 🔥',user:'mombasa_star',views:'33K'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'huyu nae ni moto sana ❤️',user:'vibra_queen',views:'281K'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'My Vibra Worldwide 🌍',user:'vibra-boy',views:'164K'},
]

const [all,setAll]=useState(()=>{
try{
const s=localStorage.getItem('vibra_v11')
if(s) return [...JSON.parse(s),...defaultVideos]
}catch{} return defaultVideos
})
const [muted,setMuted]=useState(true)
const [page,setPage]=useState('home')
const [username]=useState('vibra-boy')
const [showPay,setShowPay]=useState(false)
const [playing,setPlaying]=useState({})
const fileRef=useRef(null)
const vRefs=useRef({})

// AUTO PLAY FIX - VIDEO INAANZA BILA TAP + UKITOKA INANYAMAZA
useEffect(()=>{
const obs=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
const id=entry.target.getAttribute('data-vid')
const vid=vRefs.current[id] as HTMLVideoElement
if(!vid) return
if(entry.isIntersecting){
// Zima zote zingine
Object.values(vRefs.current).forEach((v:any)=>{if(v && v!==vid) v.pause()})
vid.muted=muted
vid.play().catch(()=>{}).then(()=>setPlaying(s=>({...s,[id]:true})))
}else{
vid.pause()
setPlaying(s=>({...s,[id]:false}))
}
})
},{threshold:0.3})
Object.values(vRefs.current).forEach(el=>{if(el) obs.observe(el as Element)})
return ()=>obs.disconnect()
},[all,page,muted])

useEffect(()=>{
if(page!=='home'){
Object.values(vRefs.current).forEach((v:any)=>{if(v) v.pause()})
}
},[page])

useEffect(()=>{
Object.values(vRefs.current).forEach((v:any)=>{if(v) v.muted=muted})
},[muted])

const myVideos=all.filter(v=>v.user===username || v.user==='vibra-boy')

const del=(id:string)=>{
if(!confirm('FUTA VIDEO HII?')) return
const na=all.filter(x=>x.id!==id)
setAll(na)
localStorage.setItem('vibra_v11',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id))))
}

const upload=(e:any)=>{
const f=e.target.files?.[0]; if(!f) return
const r=new FileReader()
r.onload=()=>{
const v={id:Date.now().toString(),u:r.result as string,k:f.type.startsWith('image')?'image':'video',c:'My Vibra 🔥',user:username,views:'0'}
const na=[v,...all]
setAll(na)
localStorage.setItem('vibra_v11',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id)).slice(0,20)))
}
r.readAsDataURL(f)
}

return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload} />

{/* TOP BAR */}
<div className="fixed top-0 left-0 right-0 z-50 bg-black h-[48px] flex items-center justify-between px-3 border-b border-white/10">
<div className="flex items-center gap-2">
<span className="font-black text-[14px]">Vibra {MASKED}</span>
<button onClick={()=>setMuted(!muted)} className={`${muted?'bg-red-600':'bg-green-600'} px-3 py-1 rounded-full text-[11px] font-bold`}>
{muted?'🔇 TAP SOUND':'🔊 ON'}
</button>
</div>
<button onClick={()=>setShowPay(true)} className="bg-green-600 px-3 py-1 rounded-full text-[11px] font-bold">Lipa 500</button>
</div>

{showPay&&<div className="absolute inset-0 z-[100] bg-black p-6 flex flex-col justify-center">
<button onClick={()=>setShowPay(false)} className="absolute top-4 left-4 text-xl">✕ Close</button>
<div className="text-center">
<p className="text-[20px] font-black">Lipa M-Pesa</p>
<p className="text-[32px] font-black mt-4 text-green-400">{MY_MPESA}</p>
<p className="text-[12px] mt-2">Send Money -> {MY_MPESA} -> 500</p>
<button onClick={()=>window.open(`https://wa.me/254740805970?text=Nimelipa%20500`,'_blank')} className="mt-6 w-full bg-green-600 py-3 rounded-full font-bold">Nimelipa - WhatsApp</button>
</div>
</div>}

{page==='me'&&<div className="absolute inset-0 z-20 bg-white text-black pt-[60px] overflow-y-auto">
<div className="flex justify-between px-4">
<button onClick={()=>setPage('home')} className="text-xl">← Back</button>
<span className="font-bold">{username}</span>
</div>

<div className="flex flex-col items-center mt-4">
<div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">V</div>
<p className="font-black mt-2">@{username}</p>
<p className="text-[12px] text-black/60">{myVideos.length} Videos</p>
<button onClick={()=>fileRef.current?.click()} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-[13px] font-bold">+ Upload New Video</button>
</div>

{/* ME GRID - VIDEO SIO PICHA TENA */}
<div className="grid grid-cols-2 gap-2 p-3 mt-4">
{myVideos.map(v=>(
<div key={v.id} className="aspect-[9/16] bg-black relative rounded-xl overflow-hidden">
{v.k==='image'?(
<img src={v.u} className="w-full h-full object-cover" />
):(
<video 
src={v.u} 
loop 
muted 
playsInline 
preload="metadata"
className="w-full h-full object-cover"
onClick={e=>{const vid=e.target as HTMLVideoElement; vid.paused?vid.play():vid.pause()}}
/>
)}
{/* Inaonyesha ni VIDEO sio picha */}
<div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">🎬 VIDEO</div>
<div className="absolute top-2 right-2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer" onClick={()=>del(v.id)}>✕</div>
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<div className="bg-white/80 w-10 h-10 rounded-full flex items-center justify-center">▶️</div>
</div>
<div className="absolute bottom-2 left-2 text-white text-[11px] bg-black/60 px-2 rounded">▶ {v.views}</div>
<div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Tap to Play</div>
</div>
))}
</div>

<p className="text-center text-[11px] text-black/40 pb-10">Tap video kucheza - X kufuta - Sio picha tena!</p>
</div>}

{page==='home'&&(
<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[48px] pb-[60px]">
{all.map(c=>(
<div key={c.id} className="h-screen w-full snap-start relative bg-zinc-900 flex items-center justify-center">
{/* VIDEO - AUTO PLAY BILA TAP */}
<video 
ref={el=>vRefs.current[c.id]=el} 
data-vid={c.id} 
src={c.u} 
autoPlay 
loop 
muted={muted} 
playsInline 
preload="auto"
className="h-full w-full object-cover"
/>

{/* Play button kama bado haijaanza */}
{!playing[c.id]&&(
<button onClick={()=>{const v=vRefs.current[c.id] as HTMLVideoElement; if(v){v.muted=muted; v.play()}}} className="absolute inset-0 flex items-center justify-center">
<div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur">▶️</div>
</button>
)}

{/* Button ya sauti - inaonekana kama muted */}
{muted&&playing[c.id]&&(
<button onClick={()=>setMuted(false)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-full text-[12px] font-bold animate-pulse">
🔇 TAP FOR SOUND 🔊
</button>
)}

{/* Info chini */}
<div className="absolute bottom-[80px] left-3 right-16">
<p className="font-bold text-[14px]">@{c.user}</p>
<p className="text-[13px] mt-1">{c.c}</p>
<p className="text-[11px] mt-1 text-white/60">🎵 original sound</p>
</div>

{/* Buttons kulia */}
<div className="absolute bottom-[80px] right-2 flex flex-col gap-4">
<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">❤️</div>
<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div>
<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">↗️</div>
</div>
</div>
))}
</div>
)}

{/* Bottom nav */}
<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-3 z-50">
<button onClick={()=>setPage('home')} className={`${page==='home'?'text-white':'text-white/50'} flex flex-col items-center`}><span>🏠</span><span className="text-[10px]">Home</span></button>
<button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-10 h-7 bg-white rounded flex items-center justify-center text-black font-black">+</div><span className="text-[10px]">Upload</span></button>
<button onClick={()=>setPage('me')} className={`${page==='me'?'text-white':'text-white/50'} flex flex-col items-center`}><span>👤</span><span className="text-[10px]">Me ({myVideos.length})</span></button>
</div>

</div>
)
}
