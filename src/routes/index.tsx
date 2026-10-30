// @ts-nocheck - VIBRA V13 - FINAL FIX - VIDEO INAANZA - SAUTI INAKATA - ME SIO PICHA
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})

function Vibra(){
const MASKED='0740***970'
const MY_MPESA='0740805970'

const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Mombasa mko wapi? 🔥 #Vibra',user:'mombasa_star',views:'33K'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'moto sana ❤️ #fyp',user:'vibra_queen',views:'281K'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'Vibra Worldwide 🌍',user:'vibra-boy',views:'164K'},
]

// TUMIA v13 - ITAFUTA PICHA ZOTE ZA ZAMANI!
const [all,setAll]=useState(()=>{
try{
localStorage.removeItem('vibra_v9')
localStorage.removeItem('vibra_v10')
localStorage.removeItem('vibra_v11')
localStorage.removeItem('vibra_v12')
const s=localStorage.getItem('vibra_v13')
if(s){const p=JSON.parse(s); return [...p,...defaultVideos]}
}catch{} return defaultVideos
})

const [muted,setMuted]=useState(true)
const [page,setPage]=useState('home')
const [username]=useState('vibra-boy')
const [showPay,setShowPay]=useState(false)
const fileRef=useRef(null)
const vRefs=useRef({})

// FIX - VIDEO 1 TU INACHEZA - UKISCROLL YA NYUMA INAZIMA SAUTI!
useEffect(()=>{
if(page!=='home') return
const obs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{
const vid=e.target as HTMLVideoElement
if(e.isIntersecting && e.intersectionRatio>0.5){
Object.values(vRefs.current).forEach((v:any)=>{if(v && v!==vid) v.pause()})
vid.muted=muted
vid.play().catch(()=>{})
}else{
vid.pause()
}
})
},{threshold:0.5})
Object.values(vRefs.current).forEach((v:any)=>{if(v) obs.observe(v)})
return ()=>obs.disconnect()
},[all,page,muted])

useEffect(()=>{Object.values(vRefs.current).forEach((v:any)=>{if(v) v.muted=muted})},[muted])
useEffect(()=>{if(page!=='me') return},[page])

const myVideos=all.filter(v=>v.user===username)

const del=(id:string)=>{
if(!confirm('FUTA VIDEO HII?')) return
const na=all.filter(x=>x.id!==id)
setAll(na)
localStorage.setItem('vibra_v13',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id))))
}

const upload=(e:any)=>{
const f=e.target.files?.[0]; if(!f) return
if(f.type.startsWith('image')){alert('Chagua VIDEO tu - sio picha!'); return}
const r=new FileReader()
r.onload=()=>{
const v={id:Date.now().toString(),u:r.result as string,c:'My Vibra 🔥',user:username,views:'0'}
const na=[v,...all]
setAll(na)
localStorage.setItem('vibra_v13',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id)).slice(0,20)))
}
r.readAsDataURL(f)
}

return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={upload} />

<div className="fixed top-0 left-0 right-0 z-50 bg-[#ff0050] h-[36px] flex items-center justify-center">
<p className="text-[11px] font-bold">ADVERTISE 500 KES - PRIVATE {MASKED}</p>
</div>

{showPay&&<div className="absolute inset-0 z-[100] bg-black p-6 flex flex-col justify-center">
<button onClick={()=>setShowPay(false)} className="absolute top-4 left-4 text-xl">✕</button>
<p className="text-center font-black text-[28px]">{MY_MPESA}</p>
<button onClick={()=>window.open('https://wa.me/254740805970','_blank')} className="mt-6 bg-green-600 py-3 rounded-full font-bold">WhatsApp</button>
</div>}

{page==='me'&&<div className="absolute inset-0 z-20 bg-white text-black pt-[40px] overflow-y-auto">
<div className="flex justify-between px-4"><button onClick={()=>setPage('home')}>← Back</button><button onClick={()=>setShowPay(true)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px]">KSH 500</button></div>
<div className="flex flex-col items-center mt-3">
<div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl">V</div>
<p className="font-black mt-1">vibra_boy</p>
<p className="text-[12px]">@{username} • Mombasa</p>
<button onClick={()=>{localStorage.clear(); location.reload()}} className="mt-2 text-[10px] text-red-600 underline">Futa Cache Zote za Zamani</button>
<button onClick={()=>fileRef.current?.click()} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-[13px]">+ Upload VIDEO Only</button>
</div>
{/* ME - VIDEO INACHEZA AUTO - SIO PICHA TENA! */}
<div className="grid grid-cols-3 gap-[2px] mt-4 bg-black/10">
<div onClick={()=>fileRef.current?.click()} className="aspect-[9/16] bg-gray-100 flex flex-col items-center justify-center"><span>+</span><span className="text-[10px]">New</span></div>
{myVideos.map(v=>(
<div key={v.id} className="aspect-[9/16] bg-black relative">
<video src={v.u} autoPlay muted loop playsInline className="w-full h-full object-cover" />
<div className="absolute top-1 right-1 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-white" onClick={()=>del(v.id)}>✕</div>
<div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/60 px-1 rounded">▶ {v.views}</div>
</div>
))}
</div>
<p className="text-center text-[10px] py-2">Video zinacheza auto - Bonyeza X kufuta</p>
</div>}

{page==='home'&&<>
<div className="fixed top-[36px] left-0 right-0 z-40 bg-black h-[40px] flex items-center justify-between px-3 border-b border-white/10">
<span className="font-black text-[13px]">Vibra {MASKED} 💰</span>
<button onClick={()=>setMuted(!muted)} className={`${muted?'bg-red-600':'bg-green-600'} px-3 py-1 rounded-full text-[11px] font-bold`}>{muted?'🔇 TAP SOUND':'🔊 ON'}</button>
</div>

<div className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[76px] pb-[60px]">
{all.map((c,idx)=>(
<div key={c.id} className="h-screen w-full snap-start relative bg-black">
<video 
ref={el=>vRefs.current[c.id]=el} 
src={c.u} 
autoPlay 
muted={muted} 
loop 
playsInline 
preload="auto"
className="w-full h-full object-cover" 
/>
<div className="absolute bottom-[80px] left-3">
<p className="font-bold">@{c.user}</p>
<p className="text-[13px]">{c.c}</p>
</div>
{muted&&<button onClick={()=>setMuted(false)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-full text-[12px] font-bold animate-pulse">🔇 TAP FOR SOUND 🔊</button>}
</div>
))}
</div>
</>}

<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-50">
<button onClick={()=>setPage('home')} className="flex flex-col items-center"><span>🏠</span><span className="text-[10px]">Home</span></button>
<button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-8 h-6 bg-white rounded flex items-center justify-center text-black font-bold">+</div></button>
<button onClick={()=>setPage('me')} className="flex flex-col items-center text-blue-400"><span>👤</span><span className="text-[10px]">Me</span></button>
</div>
</div>
)
}
