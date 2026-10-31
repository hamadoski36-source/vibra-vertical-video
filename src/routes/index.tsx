import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Plus, Home, Search, User, ArrowLeft, Music, Download, Forward, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';
export const Route = createFileRoute('/')({ component: Vibra });
type Clip = { id: string; u: string; c: string; t: string[]; user: string; likes: string; comments: string };
const SELF='vibra_boy';
const DEFAULTS:Clip[]=[
 {id:'1',u:'https://res.cloudinary.com/dwqkvhqwu/video/upload/v1/vibra/together.mp4',c:'#together #viral #vibra #fyp',t:['#together'],user:SELF,likes:'853',comments:'12K'},
];
function Vibra(){
 const [all,setAll]=useState(DEFAULTS);
 const [page,setPage]=useState('home');
 const [earnings,setEarnings]=useState(()=>{ const s=typeof window!=='undefined'?localStorage.getItem('vibra_earnings'):null; return s?parseFloat(s):3.18; });
 const [likes,setLikes]=useState(new Set<string>());
 const fileRef=useRef<HTMLInputElement>(null);
 const clickAd=()=>{ const n=Number((earnings+0.06).toFixed(2)); setEarnings(n); localStorage.setItem('vibra_earnings',String(n)); window.open('https://www.nike.com','_blank'); };
 useEffect(()=>{ const t=setTimeout(()=>{document.querySelectorAll('video').forEach(v=>{(v as HTMLVideoElement).play().catch(()=>{});});},500); return ()=>clearTimeout(t); },[page]);
 function upload(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f) return; e.target.value=''; const url=URL.createObjectURL(f); setAll(p=>[{id:crypto.randomUUID(),u:url,c:'#together #viral #vibra',t:['#vibra'],user:SELF,likes:'0',comments:'0'},...p]); }
 return(
  <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload}/>
   {/* TOP AD BANNER - KAMA KWENYE PICHA YAKO */}
   <div className="absolute top-0 left-0 right-0 z-30 bg-[#3a2a1a] text-amber-200 text-[11px] py-1 px-2 flex justify-between items-center">
    <button onClick={clickAd} className="flex-1 text-center font-bold">Nike - Just Do It - 50% OFF Mombasa! - ${earnings.toFixed(2)} earned!</button>
    <div className="flex gap-3 ml-2"><Download size={16}/><Forward size={16}/><span className="bg-white/20 px-1 rounded text-[9px]">AD</span></div>
   </div>
   <section className="absolute inset-0 pt-7 pb-[60px]">
    <header className="absolute top-7 left-0 right-0 z-20 flex justify-between items-center px-3 py-2 bg-black/80">
     <strong className="text-[16px]">Vibra</strong>
     <div className="flex gap-3 text-[12px]"><span className="opacity-60">@@vibra-boy</span><span className="bg-red-600 px-2 rounded text-white">LIVE</span><span className="border-b">For You</span></div>
    </header>
    <div className="h-full w-full relative bg-black">
     {all.map(clip=>(
      <div key={clip.id} className="relative h-full w-full">
       <img src="https://i.pinimg.com/originals/5a/8a/7b/5a8a7b9f5c1d2e3f4a5b6c7d8e9f0a1b.jpg" alt="" className="w-full h-full object-contain bg-[#e9e6d6] hidden"/>
       {/* Badala ya image, tunatumia video ya picha yako ya Together Forever */}
       <div className="w-full h-full bg-[#f5f1e8] flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-[#ff3b6e] italic" style={{fontFamily:'cursive'}}>Together Forever ❤️♾️</h1>
        <div className="mt-4 w-full bg-white p-2 shadow-lg">
         <p className="text-center text-black/40 text-xs">Hapa video yako ya Together Forever itaonekana kama picha yako</p>
         <video src={clip.u} poster="https://i.ibb.co/5X8d6pZ/together.jpg" loop autoPlay muted playsInline preload="auto" onLoadedData={e=>e.currentTarget.play().catch(()=>{})} className="w-full h-[70vh] object-contain bg-white" />
        </div>
       </div>
       <div className="absolute bottom-20 left-3">
        <p className="font-bold text-sm">@{clip.user}</p>
        <p className="text-xs mt-1">{clip.c}</p>
        <p className="text-[11px] mt-2 bg-white/20 rounded-full px-2 py-1">🎵 Lyrics - #together #viral #vi...</p>
       </div>
       <div className="absolute bottom-24 right-2 flex flex-col gap-5 items-center">
        <button onClick={()=>setLikes(prev=>{const n=new Set(prev); n.has(clip.id)?n.delete(clip.id):n.add(clip.id); return n;})} className="flex flex-col items-center"><Heart className={likes.has(clip.id)?'fill-red-500 text-red-500':''} size={26}/><span className="text-[11px]">{clip.likes}</span></button>
        <button className="flex flex-col items-center"><MessageCircle size={24}/><span className="text-[11px]">{clip.comments}</span></button>
        <button className="flex flex-col items-center"><Mic size={20}/><span className="text-[10px]">Lyrics</span></button>
        <button className="flex flex-col items-center"><Share2 size={20}/><span className="text-[10px] text-red-400">🚀</span></button>
       </div>
       <div className="absolute top-12 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE • 0</div>
      </div>
     ))}
    </div>
   </section>
   <nav className="absolute bottom-0 left-0 right-0 h-[60px] bg-black border-t border-white/10 flex justify-around items-center z-30">
    <button onClick={()=>setPage('home')} className="flex flex-col items-center text-white"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">😊</div><span className="text-[10px] mt-1">Home</span></button>
    <button className="flex flex-col items-center opacity-60"><Search size={20}/><span className="text-[10px]">Explore</span></button>
    <button onClick={()=>fileRef.current?.click()} className="bg-[#3a3a3a] px-6 py-2 rounded-md"><Plus size={18}/></button>
    <button className="flex flex-col items-center text-red-500"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-[10px] mt-1">LIVE</span></button>
    <button className="flex flex-col items-center text-blue-400"><User size={20}/><span className="text-[10px]">Me • ${earnings.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
