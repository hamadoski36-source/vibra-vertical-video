// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
export const Route = createFileRoute('/')({ component: Vibra });

function Vibra(){
 const fileRef=useRef(null);
 const [page,setPage]=useState('home');
 const [earn,setEarn]=useState(3.18);
 const [muted,setMuted]=useState(false);
 const [liked,setLiked]=useState({});
 const vRefs=useRef({});

 const [vids,setVids]=useState([
  {id:1, url:'https://www.w3schools.com/html/mov_bbb.mp4', user:'@pizzy_lyricist', desc:'nimazoea. 😔 #badnation', likes:853, comments:12000},
  {id:2, url:'https://www.w3schools.com/html/movie.mp4', user:'@vibra_boy', desc:'Together Forever ❤️∞ - Original', likes:1200, comments:4500},
  {id:3, url:'https://www.w3schools.com/html/mov_bbb.mp4', user:'@hamadoski36', desc:'Built in Faraja, Bamburi - Mombasa 🔥', likes:955, comments:3200},
 ]);

 const onUpload=(e)=>{
   const f=e.target.files?.[0]; if(!f) return;
   const url=URL.createObjectURL(f);
   setVids(p=>[{id:Date.now(), url, user:'@you', desc:'My video ❤️ #together', likes:0, comments:0}, ...p]);
   e.target.value='';
 };

 // Auto-play na sauti
 useEffect(()=>{
   const playAll=()=>{
     Object.values(vRefs.current).forEach(v=>{
       if(v){ 
         v.muted=muted; 
         v.volume=1; 
         v.play().catch(()=>{ v.muted=true; v.play(); }); 
       }
     });
   };
   const t=setTimeout(playAll,300);
   return()=>clearTimeout(t);
 },[muted,vids]);

 const toggleLike=(id)=>{
   const isLiked=liked[id];
   setLiked(p=>({...p,[id]:!isLiked}));
   setVids(p=>p.map(v=> v.id===id ? {...v, likes: isLiked ? v.likes-1 : v.likes+1} : v));
 };

 const toggleSound=()=>{
   const newMuted=!muted;
   setMuted(newMuted);
   Object.values(vRefs.current).forEach(v=>{ if(v){ v.muted=newMuted; if(!newMuted) v.play(); }});
 };

 return(
  <div className="w-screen h-screen bg-black overflow-hidden relative">
   <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onUpload}/>

   {/* TOP BAR */}
   <div className="fixed top-0 left-0 right-0 z-[100] h-[32px] bg-black/80 backdrop-blur text-white text-[12px] flex items-center justify-between px-3 border-b border-white/10">
     <b>Vibra</b>
     <div className="flex gap-4"><span className="opacity-60">Following</span><span className="border-b-2 border-white">For You</span></div>
     <button onClick={toggleSound} className="bg-white/20 px-2 py-1 rounded-full text-[10px]">{muted ? '🔇 Tap for Sound' : '🔊 Sound ON'}</button>
   </div>
   <div className="fixed top-[32px] left-0 right-0 z-[100] h-[24px] bg-[#2b1a0a] text-[#ffd98a] text-[10px] flex items-center justify-center font-bold" onClick={()=>setEarn(v=>+(v+0.06).toFixed(2))}>Nike 50% OFF Mombasa • ${earn.toFixed(2)} Tap +$0.06</div>

   {/* HOME - SCROLLABLE NA SAUTI */}
   {page==='home' && (
     <div className="absolute top-[56px] bottom-[60px] left-0 right-0 overflow-y-scroll snap-y snap-mandatory" style={{scrollbarWidth:'none'}}>
       {vids.map(v=>(
         <div key={v.id} className="w-full h-full snap-start relative flex-shrink-0 bg-black">
           <video 
             ref={el=>vRefs.current[v.id]=el}
             src={v.url} 
             loop 
             playsInline 
             muted={muted}
             autoPlay
             onClick={toggleSound}
             className="w-full h-full object-contain"
           />
           {/* CENTER TAP FOR SOUND */}
           {muted && <div onClick={toggleSound} className="absolute inset-0 flex items-center justify-center"><div className="bg-black/50 px-4 py-2 rounded-full text-white text-sm">🔇 Tap for Sound 🔊</div></div>}

           {/* RIGHT BUTTONS - ZOTE ZINAFANYA */}
           <div className="absolute right-2 bottom-24 flex flex-col gap-5 items-center text-white z-10">
             <button onClick={()=>toggleLike(v.id)} className="flex flex-col items-center"><span className={`text-[32px] ${liked[v.id] ? 'text-red-500' : ''}`}>{liked[v.id] ? '❤️' : '🤍'}</span><span className="text-[11px]">{v.likes}</span></button>
             <button onClick={()=>alert('Comments: '+v.comments+' - Coming soon!')} className="flex flex-col items-center"><span className="text-[28px]">💬</span><span className="text-[11px]">{(v.comments/1000).toFixed(0)}K</span></button>
             <button onClick={()=>{ if(navigator.share) navigator.share({title:'Vibra', url: location.href}); else alert('Link copied!'); }} className="flex flex-col items-center"><span className="text-[28px]">↗️</span><span className="text-[11px]">Share</span></button>
             <button onClick={()=>fileRef.current?.click()} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs border-2 border-white">You</button>
           </div>

           {/* BOTTOM INFO */}
           <div className="absolute left-3 bottom-6 right-16 text-white z-10">
             <b className="text-[15px]">{v.user}</b>
             <p className="text-[13px] mt-1">{v.desc}</p>
             <p className="text-[12px] mt-2 opacity-80">🎵 Original sound - {v.user}</p>
           </div>
         </div>
       ))}
     </div>
   )}

   {/* ME - IKO CHONJO NA BUTTONS ZOTE */}
   {page==='me' && (
     <div className="absolute top-[56px] bottom-[60px] left-0 right-0 bg-white overflow-y-auto p-4 z-30">
       <div className="flex justify-between items-center"><button onClick={()=>setPage('home')} className="border px-3 py-1 rounded-full">← Home</button><b>Me • ${earn.toFixed(2)}</b><button onClick={()=>fileRef.current?.click()} className="bg-black text-white px-3 py-1 rounded-full">+ Add</button></div>
       <div className="flex flex-col items-center mt-6"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">H</div><b className="mt-2">@hamadoski36</b><p className="text-xs opacity-60">Mombasa • 955 Followers</p></div>
       <div className="grid grid-cols-3 gap-3 mt-5 text-center"><div className="border rounded-xl py-2"><b>1</b><p className="text-xs opacity-60">Following</p></div><div className="border rounded-xl py-2"><b>{vids.length}</b><p className="text-xs opacity-60">Videos</p></div><div className="border rounded-xl py-2"><b className="text-green-600">${earn.toFixed(2)}</b><p className="text-xs opacity-60">Earned</p></div></div>
       <button onClick={()=>setEarn(v=>+(v+0.06).toFixed(2))} className="w-full mt-4 bg-green-600 text-white py-3 rounded-full font-bold">Bonyeza Ad Pata $0.06</button>
       <button onClick={()=>fileRef.current?.click()} className="w-full mt-2 border-2 border-dashed py-3 rounded-xl font-bold">+ Weka Together Forever Yako</button>
       <div className="grid grid-cols-3 gap-1 mt-4">{vids.map(v=><div key={v.id} className="relative aspect-[9/16] bg-black rounded overflow-hidden"><video src={v.url} className="w-full h-full object-cover" muted/><span className="absolute bottom-1 left-1 text-white text-[10px]">▶ {v.likes}</span></div>)}</div>
     </div>
   )}

   {/* BOTTOM NAV - BUTTONS ZOTE ZINAFANYA - + INAONEKANA */}
   <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center z-[200] border-t border-white/20">
     <button onClick={()=>setPage('home')} className="flex flex-col items-center"><span className="text-[20px]">🏠</span><span className="text-[10px]">Home</span></button>
     <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><span className="text-[20px]">🔍</span><span className="text-[10px]">Explore</span></button>
     <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-[68px] h-[40px] rounded-full font-black text-[30px] flex items-center justify-center shadow-lg">+</button>
     <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><span className="text-[11px] font-bold text-red-400">● LIVE</span></button>
     <button onClick={()=>setPage('me')} className="flex flex-col items-center"><span className="text-[20px]">👤</span><span className="text-[9px]">Me • ${earn.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
