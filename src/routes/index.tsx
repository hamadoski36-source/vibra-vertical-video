// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Search, Plus, Home, User, ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

function Vibra(){
 const [page,setPage]=useState('home');
 const [tab,setTab]=useState(0);
 const fileRef=useRef(null);
 const vRefs=useRef({});
 const [vids,setVids]=useState([
   {id:1, u:'https://www.w3schools.com/html/mov_bbb.mp4', user:'@vibra_boy', desc:'Together Forever ❤️∞ - video ya kwanza', likes:'853'},
   {id:2, u:'https://www.w3schools.com/html/movie.mp4', user:'@hamado', desc:'#together #viral #mombasa', likes:'1.2K'},
   {id:3, u:'https://www.w3schools.com/html/mov_bbb.mp4', user:'@vibra_world', desc:'Vibra worldwide 🌍', likes:'955'},
 ]);
 const [earnings,setEarnings]=useState(3.18);

 const cur = vids[tab];
 const all = [...vids];

 const addEarn=()=>{
   const n=Number((earnings+0.06).toFixed(2));
   setEarnings(n);
 };

 const onUpload=(e)=>{
   const f=e.target.files?.[0]; if(!f) return;
   const url=URL.createObjectURL(f);
   setVids(p=>[{id:Date.now(), u:url, user:'@you', desc:'My Together Forever ❤️', likes:'0'}, ...p]);
   e.target.value='';
   setPage('me');
 };

 useEffect(()=>{
   const playAll=()=>{
     Object.values(vRefs.current).forEach((v)=>{
       if(v){ v.muted=true; v.play().catch(()=>{}); }
     });
   };
   const t=setTimeout(playAll,500);
   return()=>clearTimeout(t);
 },[tab,page,all.length]);

 return(
  <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
   <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onUpload}/>

   {/* TOP AD - haivunji app */}
   <div className="absolute top-0 left-0 right-0 z-50 h-8 bg-[#2b1a0a] text-[#ffd98a] text-[11px] flex items-center justify-center font-bold cursor-pointer" onClick={addEarn}>
     Nike - Just Do It - 50% OFF Mombasa! - ${earnings.toFixed(2)} Tap +$0.06
   </div>

   {/* HOME - VIDEO INACHEZA */}
   {page==='home' && (
    <div className="absolute top-8 bottom-[60px] left-0 right-0 bg-black">
      <div className="h-full w-full relative">
        <video
          ref={el=>vRefs.current[cur.id]=el}
          key={cur.u}
          src={cur.u}
          loop muted playsInline autoPlay
          preload="auto"
          onLoadedData={e=>e.currentTarget.play().catch(()=>{})}
          onClick={e=>e.currentTarget.play().catch(()=>{})}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between text-white text-sm bg-gradient-to-b from-black/60 to-transparent">
          <b>Vibra</b>
          <div className="flex gap-3"><span className="opacity-60">Following</span><span className="border-b-2 border-white">For You</span><span className="bg-red-600 px-2 rounded text-xs py-0.5">LIVE</span></div>
        </div>

        <div className="absolute bottom-4 left-3 right-16 text-white">
          <b className="text-sm">{cur.user}</b>
          <p className="text-xs mt-1">{cur.desc}</p>
          <p className="text-xs opacity-80 mt-1">🎵 Together Forever - Original sound</p>
        </div>

        <div className="absolute bottom-4 right-2 flex flex-col gap-5 items-center text-white">
          <div className="flex flex-col items-center"><Heart className="fill-red-500 text-red-500" size={30}/><span className="text-[11px] mt-1">{cur.likes}</span></div>
          <div className="flex flex-col items-center"><MessageCircle size={26}/><span className="text-[11px]">12K</span></div>
          <div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">You</div></div>
        </div>

        {/* Swipe hint */}
        <div className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 bg-white/20 px-3 py-1 rounded-full text-white text-xs pointer-events-none">
          Gusa video ku-play
        </div>
      </div>
    </div>
   )}

   {/* ME - IKO CHONJO SASA */}
   {page==='me' && (
    <div className="absolute top-8 bottom-[60px] left-0 right-0 bg-white overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft size={20}/></Button>
          <b className="text-sm">Me - ${earnings.toFixed(2)}</b>
          <Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus size={20}/></Button>
        </div>

        <div className="flex flex-col items-center mt-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">H</div>
          <b className="mt-2">@hamadoski36</b>
          <p className="text-xs opacity-60">Mombasa, Kenya</p>
        </div>

        <div className="flex justify-around mt-5 text-center border-y py-3">
          <div><b>1</b><p className="text-xs opacity-60">Following</p></div>
          <div><b>{all.length}</b><p className="text-xs opacity-60">Videos</p></div>
          <div><b>955</b><p className="text-xs opacity-60">Followers</p></div>
          <div><b className="text-green-600">${earnings.toFixed(2)}</b><p className="text-xs opacity-60">Earned</p></div>
        </div>

        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={addEarn}>Bonyeza Ad Pata $0.06 - ${earnings.toFixed(2)}</Button>
        <Button variant="outline" className="w-full mt-2" onClick={()=>fileRef.current?.click()}><Plus size={16} className="mr-2"/> Weka Video Mpya</Button>

        <h3 className="font-bold mt-6 text-sm">Videos Zangu ({all.length})</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 pb-4">
          {all.map((v,i)=>(
            <div key={v.id} className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden" onClick={()=>{setTab(i); setPage('home');}}>
              <video src={v.u} className="w-full h-full object-cover" muted/>
              <div className="absolute bottom-1 left-1 text-white text-[10px] flex items-center gap-1"><Play size={10}/>{v.likes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
   )}

   {/* EXPLORE & LIVE - simple */}
   {page==='explore' && <div className="absolute top-8 bottom-[60px] bg-white w-full p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="font-bold mt-4">Explore - Coming soon</h1></div>}
   {page==='live' && <div className="absolute top-8 bottom-[60px] bg-black w-full p-6 text-white"><Button variant="ghost" onClick={()=>setPage('home')} className="text-white"><ArrowLeft/> Back</Button><h1 className="font-bold mt-4 text-red-500">● LIVE - 2 viewers</h1></div>}

   {/* BOTTOM NAV - BUTTONS ZOTE ZINAFANYA */}
   <nav className="absolute bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center z-[60] border-t border-white/10">
    <button onClick={()=>{setPage('home'); setTab(0);}} className={`flex flex-col items-center ${page==='home'?'text-white':'opacity-60'}`}><Home size={22}/><span className="text-[10px]">Home</span></button>
    <button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'opacity-60'}`}><Search size={22}/><span className="text-[10px]">Explore</span></button>
    <button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-6 py-2 rounded-full font-bold"><Plus size={20}/></button>
    <button onClick={()=>setPage('live')} className={`flex flex-col items-center ${page==='live'?'text-red-500':'opacity-60'}`}><span className="text-[10px] font-bold">● LIVE</span></button>
    <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-blue-400':'opacity-60'}`}><User size={22}/><span className="text-[10px]">Me • ${earnings.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
