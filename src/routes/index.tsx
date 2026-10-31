// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
export const Route = createFileRoute('/')({ component: TikTokClone });

function TikTokClone(){
 const fileRef=useRef(null);
 const [page,setPage]=useState('foryou');
 const [profileTab,setProfileTab]=useState(false);
 const [muted,setMuted]=useState(false);
 const [earn,setEarn]=useState(3.18);
 const [liked,setLiked]=useState(false);

 const videos=[
   {id:1, url:'https://www.w3schools.com/html/mov_bbb.mp4', user:'MaRavel movie', handle:'@makavelimoviestore', title:'MONALISA#61', views:'1.4K', likes:'1.4K', comments:'25', saves:'201', shares:'12', search:'monalisa episode ya 60'},
   {id:2, url:'https://www.w3schools.com/html/movie.mp4', user:'MaRavel movie', handle:'@makavelimoviestore', title:'NDOA Episode 405', views:'454.3K', likes:'12K', comments:'890', saves:'2K', shares:'300', search:'ndoa episode 405'},
 ];

 const cur=videos[0];

 return(
  <div className="w-screen h-screen bg-black text-white overflow-hidden relative font-sans">
   <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(f) alert('Video yako '+f.name+' itaongezwa!'); e.target.value='';}}/>

   {!profileTab ? (
   <>
     {/* TOP - KAMA TIKTOK */}
     <div className="fixed top-0 left-0 right-0 z-50 bg-black h-[90px]">
       <div className="flex items-center justify-between px-3 pt-2">
         <span className="text-[11px] border border-white rounded px-1">LIVE</span>
         <div className="flex gap-4 text-[15px] font-bold"><span className="opacity-60">Following</span><span className="opacity-60">Friends</span><span className="border-b-2 border-white pb-1">For You</span></div>
         <span className="text-[18px]">🔍</span>
       </div>
       <div className="mx-3 mt-3 h-[36px] bg-[#2a2a2a] rounded-full flex items-center px-3">
         <span className="opacity-50 mr-2">🔍</span>
         <input placeholder="Explore topics you love" className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/50"/>
         <span className="border-l border-white/20 pl-3 text-[13px] font-bold">Search</span>
       </div>
     </div>
     <div className="fixed top-[90px] left-0 right-0 z-40 h-[20px] bg-[#2b1a0a] text-[#ffd98a] text-[10px] flex items-center justify-center" onClick={()=>setEarn(v=>+(v+0.06).toFixed(2))}>Nike Mombasa • ${earn.toFixed(2)} +$0.06</div>

     {/* VIDEO KATI */}
     <div className="absolute top-[110px] bottom-[95px] left-0 right-0 bg-[#0a0a0a] flex items-center justify-center">
       <video 
         src={cur.url} 
         loop autoPlay playsInline 
         muted={muted}
         onClick={()=>setMuted(!muted)}
         className="w-full h-full object-contain"
         onLoadedData={e=>{e.currentTarget.muted=muted; e.currentTarget.play().catch(()=>{});}}
       />
       {/* SOUND BUTTON */}
       <button onClick={()=>setMuted(!muted)} className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full text-[11px]">{muted ? '🔇 Tap for Sound' : '🔊 Sound ON'}</button>

       {/* RIGHT BUTTONS - KAMA SCREENSHOT */}
       <div className="absolute right-2 bottom-10 flex flex-col gap-4 items-center">
         <button onClick={()=>setProfileTab(true)} className="relative"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-bold">M</div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[12px] font-bold">+</div></button>
         <button onClick={()=>setLiked(!liked)} className="flex flex-col items-center"><span className={`text-[28px] ${liked?'':''}`}>❤️</span><span className="text-[11px] font-bold">{liked ? '1.5K' : '1.4K'}</span></button>
         <button onClick={()=>alert('Comments 25 - Coming soon!')} className="flex flex-col items-center"><span className="text-[26px]">💬</span><span className="text-[11px] font-bold">25</span></button>
         <button onClick={()=>alert('Saved 201!')} className="flex flex-col items-center"><span className="text-[24px]">🔖</span><span className="text-[11px] font-bold">201</span></button>
         <button onClick={()=>alert('Shared!')} className="flex flex-col items-center"><span className="text-[26px]">↗️</span><span className="text-[11px] font-bold">12</span></button>
         <div className="w-8 h-8 rounded-full bg-[#333] animate-spin border-2 border-white/20"></div>
       </div>

       {/* BOTTOM INFO - KAMA SCREENSHOT */}
       <div className="absolute left-3 bottom-2 right-20">
         <b className="text-[14px] font-bold">{cur.user}†</b>
         <p className="text-[13px] mt-1">{cur.title}</p>
         <div className="mt-2 h-[32px] bg-[#1a1a1a] rounded-full flex items-center px-3 gap-2">
           <span className="text-[12px]">🔍</span><span className="text-[12px] flex-1 truncate">Search · {cur.search}</span><span className="text-[14px]">›</span>
         </div>
       </div>
     </div>
   </>
   ) : (
   /* PROFILE PAGE - KAMA SCREENSHOT YA PILI */
   <div className="absolute top-0 bottom-[60px] left-0 right-0 bg-white text-black overflow-y-auto">
     <div className="flex items-center justify-between p-3">
       <button onClick={()=>setProfileTab(false)} className="text-[22px]">←</button>
       <button className="text-[20px]">⋮</button>
     </div>
     <div className="flex flex-col items-center">
       <div className="w-20 h-20 rounded-full bg-gray-200"></div>
       <b className="mt-2 font-bold text-[16px]" style={{fontFamily:'serif'}}>MaRavel movie†</b>
       <p className="text-[13px] opacity-60">@makavelimoviestore</p>
       <div className="flex gap-6 mt-3 text-center text-[13px]"><div><b>7</b><p className="opacity-60">Following</p></div><div className="border-l border-r px-6"><b>407.8K</b><p className="opacity-60">Followers</p></div><div><b>3.8M</b><p className="opacity-60">Likes</p></div></div>
       <div className="flex gap-2 mt-4"><button className="bg-[#fe2c55] text-white px-12 py-2 rounded font-bold">Follow</button><button className="border px-3 rounded">👥+</button></div>
       <p className="text-[12px] mt-3 text-center px-4">kwa MATANGAZO ni cheki DM +whatsapp 0634548700 🍇🍏📈</p>
       <div className="w-full flex justify-around mt-4 border-b pb-2"><span className="border-b-2 border-black">☰</span><span className="opacity-30">♡</span></div>
     </div>
     {/* GRID - KAMA TIKTOK */}
     <div className="grid grid-cols-3 gap-[1px] bg-black">
       {[
         {p:'Pinned', v:'454.3K', t:'NDOA'}, {p:'Pinned', v:'712.1K', t:'Monalisa'}, {v:'16.6K'},
         {v:'11.1K'}, {v:'11.7K'}, {v:'9.8K'},
         {v:'6.7K'}, {v:'7.2K'}, {v:'44.3K'},
       ].map((x,i)=><div key={i} className="aspect-[3/4] bg-gray-800 relative"><div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] px-1 rounded">{x.p}</div><div className="absolute bottom-1 left-1 text-white text-[11px] flex items-center">▶ {x.v}</div><div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div></div>)}
     </div>
     <div className="fixed bottom-[70px] right-3 bg-white text-black px-3 py-1 rounded-full text-[12px] shadow">Just watched ∨</div>
   </div>
   )}

   {/* BOTTOM NAV - KAMA TIKTOK HALISI */}
   <nav className="fixed bottom-0 left-0 right-0 h-[50px] bg-black text-white flex justify-around items-center z-[200] border-t border-white/10">
     <button onClick={()=>setProfileTab(false)} className="flex flex-col items-center"><span className="text-[22px]">🏠</span><span className="text-[9px]">Home</span></button>
     <button onClick={()=>setProfileTab(false)} className="flex flex-col items-center opacity-60"><span className="text-[20px]">⊞</span><span className="text-[9px]">Explore</span></button>
     <button onClick={()=>fileRef.current?.click()} className="w-[48px] h-[32px] bg-white rounded-lg flex items-center justify-center text-black font-black text-[22px] relative"><span className="absolute -left-1 w-full h-full bg-[#25f4ee] rounded-lg -z-10"></span><span className="absolute -right-1 w-full h-full bg-[#fe2c55] rounded-lg -z-10"></span>+</button>
     <button className="flex flex-col items-center opacity-60"><span className="text-[20px]">💬</span><span className="text-[9px]">Inbox</span></button>
     <button onClick={()=>setProfileTab(true)} className={`flex flex-col items-center ${profileTab?'':'opacity-60'}`}><span className="text-[20px]">👤</span><span className="text-[9px]">Me • ${earn.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
