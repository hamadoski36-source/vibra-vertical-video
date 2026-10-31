// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
export const Route = createFileRoute('/')({ component: RealTikTok });

function RealTikTok(){
 const fileRef=useRef(null);
 const [page,setPage]=useState('home');
 const [muted,setMuted]=useState(false);
 const [earn,setEarn]=useState(3.18);
 const [liked,setLiked]=useState({});

 // HIZI NDIZO ZINAFANYA IKAWE PICHA TU - Badilisha na videos zako!
 const [vids,setVids]=useState([
  {id:1, url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', poster:'https://i.imgur.com/8Km9tLL.jpg', user:'MaRavel movie†', title:'MONALISA#61', likes:'1.4K', views:'454.3K'},
  {id:2, url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', poster:'https://i.imgur.com/QkBkZ.jpg', user:'MaRavel movie†', title:'NDOA Ep 405', likes:'2.1K', views:'712.1K'},
  {id:3, url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', poster:'', user:'MaRavel movie†', title:'MONALISA#62', likes:'1.1K', views:'16.6K'},
 ]);

 const onUpload=(e)=>{
   const files=Array.from(e.target.files || []);
   files.forEach(f=>{
     const url=URL.createObjectURL(f);
     setVids(p=>[...p, {id:Date.now()+Math.random(), url, poster:'', user:'@hamadoski36', title:f.name, likes:'0', views:'0'}]);
   });
   e.target.value='';
 };

 return(
  <div className="w-screen h-screen bg-black text-white overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*" multiple className="hidden" onChange={onUpload}/>

   {page==='home' ? (
   <>
     <div className="fixed top-0 left-0 right-0 z-50 bg-black flex flex-col">
       <div className="flex items-center justify-between px-3 h-[44px]">
         <span className="text-[11px] border border-white rounded px-1">LIVE</span>
         <div className="flex gap-5 text-[14px] font-bold"><span className="opacity-60">Following</span><span className="opacity-60">Friends</span><span className="border-b-2 border-white">For You</span></div>
         <span>🔍</span>
       </div>
       <div className="mx-2 mb-2 h-[36px] bg-[#222] rounded-full flex items-center px-3"><span className="mr-2">🔍</span><span className="text-[13px] opacity-60 flex-1">Explore topics you love</span><span className="border-l pl-3 text-[13px] font-bold">Search</span></div>
       <div className="h-[20px] bg-[#2b1a0a] text-[#ffd98a] text-[10px] flex items-center justify-center" onClick={()=>setEarn(v=>+(v+0.06).toFixed(2))}>Nike Mombasa • ${earn.toFixed(2)} +$0.06</div>
     </div>

     <div className="absolute top-[100px] bottom-[60px] left-0 right-0 overflow-y-scroll snap-y snap-mandatory" style={{scrollbarWidth:'none'}}>
       {vids.map(v=>(
         <div key={v.id} className="w-full h-full snap-start relative bg-black">
           <video 
             src={v.url} 
             loop autoPlay playsInline 
             muted={muted}
             onClick={()=>setMuted(!muted)}
             className="w-full h-full object-cover" // REALITY - COVER si CONTAIN
           />
           <button onClick={()=>setMuted(!muted)} className="absolute top-2 right-2 bg-black/60 px-3 py-1 rounded-full text-[11px]">{muted?'🔇 Tap for Sound':'🔊 Sound ON'}</button>

           <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center z-10">
             <button onClick={()=>setPage('profile')} className="relative"><div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center font-bold">M</div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">+</div></button>
             <button onClick={()=>setLiked(p=>({...p,[v.id]:!p[v.id]}))} className="flex flex-col items-center"><span className="text-[30px]">{liked[v.id]?'❤️':'🤍'}</span><span className="text-[11px] font-bold">{v.likes}</span></button>
             <button className="flex flex-col items-center"><span className="text-[26px]">💬</span><span className="text-[11px]">25</span></button>
             <button className="flex flex-col items-center"><span className="text-[24px]">🔖</span><span className="text-[11px]">201</span></button>
             <button className="flex flex-col items-center"><span className="text-[26px]">↗️</span><span className="text-[11px]">12</span></button>
           </div>

           <div className="absolute left-3 bottom-3 right-20">
             <b className="text-[14px]">{v.user}</b><p className="text-[13px]">{v.title}</p>
             <div className="mt-2 bg-[#222] rounded-full flex items-center px-3 py-1 text-[12px]"><span className="mr-2">🔍</span>Search · {v.title.toLowerCase()}<span className="ml-auto">›</span></div>
           </div>
         </div>
       ))}
     </div>
   </>
   ) : (
   <div className="absolute top-0 bottom-[60px] left-0 right-0 bg-white text-black overflow-y-auto">
     <div className="flex justify-between p-3"><button onClick={()=>setPage('home')} className="text-xl">←</button><button>⋮</button></div>
     <div className="flex flex-col items-center">
       <div className="w-20 h-20 rounded-full bg-gray-200"></div>
       <b className="mt-2">MaRavel movie†</b><p className="text-xs opacity-60">@makavelimoviestore</p>
       <div className="flex gap-6 mt-3 text-center text-xs"><div><b>7</b><p className="opacity-60">Following</p></div><div className="border-l border-r px-6"><b>407.8K</b><p className="opacity-60">Followers</p></div><div><b>3.8M</b><p className="opacity-60">Likes</p></div></div>
       <div className="flex gap-2 mt-4"><button className="bg-[#fe2c55] text-white px-12 py-2 rounded font-bold">Follow</button><button className="border px-3 rounded">👥+</button></div>
       <p className="text-[11px] mt-3 px-4 text-center">kwa MATANGAZO ni cheki DM +whatsapp 0634548700</p>
     </div>
     {/* HAPA NDIPO REALITY - VIDEOS ZINAONEKANA */}
     <div className="grid grid-cols-3 gap-[2px] mt-4 bg-black">
       {vids.map(v=>(
         <div key={v.id} className="aspect-[9/16] bg-black relative overflow-hidden">
           <video src={v.url} muted loop autoPlay playsInline className="w-full h-full object-cover"/>
           <div className="absolute bottom-1 left-1 text-white text-[10px] bg-black/50 px-1 rounded">▶ {v.views}</div>
         </div>
       ))}
     </div>
     <button onClick={()=>fileRef.current?.click()} className="m-3 w-[calc(100%-24px)] border-2 border-dashed py-3 rounded-xl font-bold">+ WEKA VIDEOS ZAKO ZA MONALISA HAPA - ITAKUWA REALITY</button>
   </div>
   )}

   <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center border-t border-white/10 z-[100]">
     <button onClick={()=>setPage('home')} className="flex flex-col items-center"><span className="text-[20px]">🏠</span><span className="text-[9px]">Home</span></button>
     <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><span className="text-[18px]">⊞</span><span className="text-[9px]">Explore</span></button>
     <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-[60px] h-[36px] rounded-full font-black text-[26px] flex items-center justify-center">+</button>
     <button className="flex flex-col items-center opacity-60"><span className="text-[18px]">💬</span><span className="text-[9px]">Inbox</span></button>
     <button onClick={()=>setPage('profile')} className="flex flex-col items-center"><span className="text-[18px]">👤</span><span className="text-[8px]">Me • ${earn.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
