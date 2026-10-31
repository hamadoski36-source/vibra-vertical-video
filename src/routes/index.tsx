// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
export const Route = createFileRoute('/')({ component: Vibra });
function Vibra(){
 const [page,setPage]=useState('home');
 const fileRef=useRef(null);
 const [vids,setVids]=useState([]);
 const [earn,setEarn]=useState(3.18);
 const curTab=0;
 const onUpload=(e)=>{
   const f=e.target.files?.[0]; if(!f) return;
   const url=URL.createObjectURL(f);
   setVids(p=>[url,...p]); e.target.value='';
 };
 return(
  <div className="w-screen h-screen bg-[#fdf8ee] relative overflow-hidden text-black">
   <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={onUpload}/>
   
   <div className="absolute top-0 left-0 right-0 z-20 h-7 bg-[#2b1a0a] text-[#ffd98a] text-[11px] flex items-center justify-center font-bold" onClick={()=>setEarn(x=>+(x+0.06).toFixed(2))}>
     Nike 50% OFF Mombasa - ${earn.toFixed(2)} Tap +$0.06
   </div>

   <div className="absolute top-7 bottom-[60px] left-0 right-0 flex items-center justify-center bg-[#fdf8ee]">
     {vids.length>0 ? <video src={vids[0]} autoPlay loop muted playsInline controls className="h-full w-full object-contain bg-black"/> : (
       <div className="w-full max-w-[360px] h-full flex flex-col items-center justify-center p-2">
         <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden relative">
           <img src="https://i.ibb.co/6b0q0gK/together.jpg" alt="Together Forever" className="w-full object-contain" 
             onError={e=>e.currentTarget.src='https://res.cloudinary.com/demo/image/upload/v1/docs/sunglasses'} />
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf8ee]">
             <h1 className="text-[28px] font-bold text-[#e7335d]">Together Forever ❤️∞</h1>
             <div className="mt-4 text-[#e7335d] text-center">
               <div className="text-5xl">👩‍❤️‍👨</div>
               <p className="mt-2 font-bold">You & Me = Home ❤️</p>
               <p className="text-xs mt-2 animate-bounce">↑ Karatasi inakunjwa kama TikTok ↑</p>
             </div>
             <style>{`@keyframes fold{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
           </div>
         </div>
         <p className="text-[11px] opacity-60 mt-2">@vibra_boy • Together Forever - Original sound</p>
       </div>
     )}
   </div>

   <div className="absolute bottom-[60px] left-0 right-0 px-3 py-2 flex justify-between items-end text-white pointer-events-none">
     <div className="pointer-events-auto"><b className="text-sm text-black">@vibra_boy</b><p className="text-xs text-black/70">Together Forever ❤️∞ - video ya kwanza</p></div>
     <div className="flex flex-col gap-4 items-center pointer-events-auto text-black"><span>❤️<br/>853</span><span>💬<br/>12K</span></div>
   </div>

   <nav className="absolute bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center z-50 border-t border-white/10">
    <button onClick={()=>setPage('home')} className="flex flex-col items-center"><span>🏠</span><span className="text-[10px]">Home</span></button>
    <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><span>🔍</span><span className="text-[10px]">Explore</span></button>
    <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-[60px] h-[36px] rounded-full font-bold text-[24px] flex items-center justify-center">+</button>
    <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><span className="text-[10px]">● LIVE</span></button>
    <button onClick={()=>setPage('me')} className="flex flex-col items-center"><span>👤</span><span className="text-[10px]">Me • ${earn.toFixed(2)}</span></button>
   </nav>

   {page==='me' && (
    <div className="absolute top-7 bottom-[60px] left-0 right-0 bg-white z-40 overflow-y-auto p-4">
      <div className="flex justify-between"><button onClick={()=>setPage('home')}>← Back</button><b>Me • ${earn.toFixed(2)}</b><button onClick={()=>fileRef.current?.click()}>+</button></div>
      <div className="flex flex-col items-center mt-6"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">H</div><b className="mt-2">@hamadoski36</b><p className="text-xs opacity-60">Mombasa</p></div>
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center"><b className="text-green-600 text-xl">${earn.toFixed(2)}</b><p className="text-xs">Earned from Ads</p><button onClick={()=>setEarn(x=>+(x+0.06).toFixed(2))} className="mt-2 w-full bg-green-600 text-white py-2 rounded">Bonyeza Ad +$0.06</button></div>
      <button onClick={()=>fileRef.current?.click()} className="w-full mt-3 border py-2 rounded">Weka Together Forever Yako</button>
    </div>
   )}
  </div>
 );
}
