// @ts-nocheck - VIBRA V12 - FIX KABISA - VIDEO AUTO + SAUTI INAKATA UKITOKA
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/')({component:Vibra})

function Vibra(){
const MY_MPESA='0740805970'
const MASKED='0740***970'
const defaultVideos=[
{id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Mombasa mko wapi? 🔥',user:'mombasa_star',views:'33K'},
{id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'moto sana ❤️',user:'vibra_queen',views:'281K'},
{id:'3',u:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',c:'Vibra Worldwide 🌍',user:'vibra-boy',views:'164K'},
]

const [all,setAll]=useState(()=>{
try{const s=localStorage.getItem('vibra_v12'); if(s) return [...JSON.parse(s),...defaultVideos]}catch{} return defaultVideos
})
const [muted,setMuted]=useState(true)
const [page,setPage]=useState('home')
const [username]=useState('vibra-boy')
const [showPay,setShowPay]=useState(false)
const [curIdx,setCurIdx]=useState(0)
const fileRef=useRef(null)
const containerRef=useRef(null)
const vRefs=useRef({})

// FIX 1 & 2 - VIDEO MOJA TU INACHEZA - ZINGINE ZOTE OFF!
useEffect(()=>{
const container=containerRef.current
if(!container || page!=='home') return

const onScroll=()=>{
const scrollTop=container.scrollTop
const h=window.innerHeight
const idx=Math.round(scrollTop / h)
setCurIdx(idx)
Object.entries(vRefs.current).forEach(([id,vid]:any)=>{
if(!vid) return
const vidIdx=parseInt(id.split('-')[1]||'0')
if(vidIdx===idx){
// Hii ndio inacheza
vid.muted=muted
vid.play().catch(()=>{})
}else{
// Zingine zote - ZIMA KABISA - HAKUNA SAUTI INAYOENDELEA!
vid.pause()
vid.currentTime=0
}
})
}

container.addEventListener('scroll',onScroll,{passive:true})
onScroll()
return ()=>container.removeEventListener('scroll',onScroll)
},[all,page,muted])

// Ukibadilisha page - Zima zote
useEffect(()=>{
if(page!=='home'){
Object.values(vRefs.current).forEach((v:any)=>{if(v) v.pause()})
}
},[page])

const myVideos=all.filter(v=>v.user===username || v.user==='vibra-boy')

const del=(id:string)=>{
if(!confirm('FUTA?')) return
const na=all.filter(x=>x.id!==id)
setAll(na)
localStorage.setItem('vibra_v12',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id))))
}

const upload=(e:any)=>{
const f=e.target.files?.[0]; if(!f) return
// ANGALIA - KAMA NI PICHA - KATAE!
if(f.type.startsWith('image')){
alert('Tafadhali upload VIDEO tu - sio picha! Chagua mp4 video!')
return
}
const r=new FileReader()
r.onload=()=>{
const v={id:Date.now().toString(),u:r.result as string,c:'My Vibra 🔥',user:username,views:'0'}
const na=[v,...all]
setAll(na)
localStorage.setItem('vibra_v12',JSON.stringify(na.filter(x=>!defaultVideos.find(d=>d.id===x.id)).slice(0,20)))
}
r.readAsDataURL(f)
}

return(
<div className="h-screen bg-black text-white relative overflow-hidden">
<input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={upload} />

<div className="fixed top-0 left-0 right-0 z-50 bg-[#ff0050] h-[36px] flex items-center justify-center px-3">
<p className="text-[11px] font-bold">ADVERTISE ON VIBRA - 500 KES - {MASKED}</p>
</div>

{showPay&&<div className="absolute inset-0 z-[100] bg-black p-6 flex flex-col justify-center">
<button onClick={()=>setShowPay(false)} className="absolute top-4 left-4">✕</button>
<p className="text-center font-black text-[24px]">{MY_MPESA}</p>
<button onClick={()=>window.open(`https://wa.me/254740805970?text=Nimelipa`,'_blank')} className="mt-6 w-full bg-green-600 py-3 rounded-full font-bold">WhatsApp</button>
</div>}

{page==='me'&&<div className="absolute inset-0 z-20 bg-white text-black pt-[40px] overflow-y-auto">
<div className="flex justify-between px-4 py-2">
<button onClick={()=>setPage('home')}>← Back</button>
<button onClick={()=>setShowPay(true)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px]">KSH 500 - {MASKED}</button>
</div>
<div className="flex flex-col items-center mt-2">
<div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-2xl font-bold text-black">V</div>
<p className="font-black mt-2">vibra_boy</p>
<p className="text-[12px]">@vibra_boy • Mombasa</p>
<div className="flex gap-4 mt-1 text-[13px]"><span><b>1</b> Following</span><span><b>856</b> Followers</span><span><b>{myVideos.length}</b> Videos</span></div>
<button onClick={()=>fileRef.current?.click()} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-[13px]">+ Upload VIDEO Only (Not Pic!)</button>
<p className="text-[10px] text-red-600 mt-1">Usichague picha - Chagua VIDEO mp4 tu!</p>
</div>

<div className="grid grid-cols-3 gap-[2px] mt-4 bg-black/5">
<div onClick={()=>fileRef.current?.click()} className="aspect-[9/16] bg-gray-100 flex flex-col items-center justify-center"><span>+</span><span className="text-[10px]">New</span></div>
{myVideos.map(v=>(
<div key={v.id} className="aspect-[9/16] bg-black relative">
<video src={v.u} muted loop playsInline className="w-full h-full object-cover" />
<div className="absolute top-1 right-1 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px]" onClick={()=>del(v.id)}>✕</div>
<div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/60 px-1 rounded">▶ {v.views}</div>
<div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-[10px]">▶️</span></div>
</div>
))}
</div>
<p className="text-center text-[10px] py-3">Futa ile picha ya emoji - Upload VIDEO mp4!</p>
</div>}

{page==='home'&&(
<>
<div className="fixed top-[36px] left-0 right-0 z-40 bg-black h-[40px] flex items-center justify-between px-3 border-b border-white/10">
<span className="font-black text-[13px]">Vibra {MASKED} 💰</span>
<button onClick={()=>setMuted(!muted)} className={`${muted?'bg-red-600':'bg-green-600'} px-3 py-1 rounded-full text-[11px] font-bold`}>
{muted?'🔇 TAP FOR SOUND':'🔊 Sound ON'}
</button>
</div>

<div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory pt-[76px] pb-[60px]">
{all.map((c,idx)=>(
<div key={c.id} className="h-screen w-full snap-start relative bg-black flex items-center justify-center">
<video 
ref={el=>vRefs.current[`vid-${idx}`]=el} 
src={c.u} 
autoPlay={idx===0}
loop 
muted={muted} 
playsInline 
preload="auto"
className="w-full h-full object-cover"
/>

<div className="absolute bottom-[80px] left-3 right-16">
<p className="font-bold text-[14px]">@{c.user}</p>
<p className="text-[13px]">{c.c}</p>
</div>

{muted&&<button onClick={()=>setMuted(false)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-full text-[12px] font-bold animate-pulse">
🔇 TAP FOR SOUND 🔊
</button>}

<div className="absolute bottom-[80px] right-2 flex flex-col gap-3">
<div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">❤️</div>
<div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">💬</div>
<div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">↗️</div>
</div>
</div>
))}
</div>
</>
)}

<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-2 z-50">
<button onClick={()=>setPage('home')} className="flex flex-col items-center"><span>🏠</span><span className="text-[10px]">Home</span></button>
<button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="w-8 h-6 bg-white rounded flex items-center justify-center text-black font-bold">+</div></button>
<button onClick={()=>setPage('me')} className="flex flex-col items-center text-blue-400"><span>👤</span><span className="text-[10px]">Me • KSH 500</span></button>
</div>

</div>
)
}
