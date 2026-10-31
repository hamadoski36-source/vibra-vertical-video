import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { Heart, MessageCircle, Search, Plus, Home, User, ArrowLeft, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

function Vibra(){
 const [page,setPage]=useState('home');
 const [earnings,setEarnings]=useState(()=>{
   try{ const s=localStorage.getItem('vibra_earnings'); return s?parseFloat(s):3.18; }catch{return 3.18;}
 });
 const [vids,setVids]=useState<string[]>([]);
 const fileRef=useRef<HTMLInputElement>(null);

 const addEarn=()=>{
   const n=Number((earnings+0.06).toFixed(2));
   setEarnings(n);
   try{localStorage.setItem('vibra_earnings',String(n));}catch{}
   window.open('https://www.nike.com','_blank');
 };
 const onUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
   const f=e.target.files?.[0]; if(!f) return;
   const url=URL.createObjectURL(f);
   setVids(p=>[url,...p]);
   e.target.value='';
   setPage('me');
 };

 return(
  <div className="relative w-screen h-screen bg-[#fdf8ee] overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={onUpload}/>
   
   <div className="absolute top-0 left-0 right-0 z-50 bg-[#2b1a0a] text-[#ffd98a] text-[11px] py-2 text-center font-bold">
     <button onClick={addEarn} className="w-full">Nike - Just Do It - 50% OFF Mombasa! - ${earnings.toFixed(2)} earned! Tap +$0.06</button>
   </div>

   {page==='home'&&(
    <div className="absolute top-[32px] bottom-[60px] left-0 right-0 bg-[#fdf8ee] flex flex-col">
      <div className="h-10 bg-black text-white flex justify-between items-center px-3 text-sm"><b>Vibra</b><div className="flex gap-2 text-xs"><span>@@vibra-boy</span><span className="bg-red-600 px-2 rounded">LIVE</span><span className="border-b">For You</span></div></div>
      <div className="flex-1 relative flex flex-col items-center">
        <h1 className="text-[30px] font-bold text-[#e7335d] mt-3 italic">Together Forever ❤️∞</h1>
        <div className="flex-1 w-full flex items-center justify-center p-4">
          {vids.length>0 ? <video src={vids[0]} autoPlay loop muted playsInline className="max-h-[60vh] rounded-lg"/> :
           <div className="bg-white p-2 shadow w-[320px]"><div className="bg-[#fdf8ee] h-[400px] flex flex-col items-center justify-center"><p className="text-[#e7335d] text-2xl font-bold">Together Forever ❤️∞</p><p className="text-xs mt-4 opacity-60">Bonyeza + kuweka video yako</p></div></div>
          }
        </div>
        <div className="absolute bottom-4 left-3 text-black"><b className="text-sm">@vibra_boy</b><p className="text-xs">#together #viral #vibra</p></div>
        <div className="absolute bottom-4 right-3 flex flex-col gap-4 items-center"><Heart className="fill-red-500 text-red-500" size={28}/><span className="text-xs">853</span><MessageCircle size={24}/><span className="text-xs">12K</span><Mic size={20}/></div>
      </div>
    </div>
   )}

   {page==='me'&&(
    <div className="absolute top-[32px] bottom-[60px] left-0 right-0 bg-white p-4 overflow-y-auto">
      <div className="flex justify-between"><Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft/></Button><b>Me - ${earnings.toFixed(2)}</b><Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus/></Button></div>
      <div className="flex justify-around mt-4 text-center"><div><b>1</b><p className="text-xs">Following</p></div><div><b>955</b><p className="text-xs">Followers</p></div><div><b>17</b><p className="text-xs">Likes</p></div><div><b className="text-green-600">${earnings.toFixed(2)}</b><p className="text-xs">Earned</p></div></div>
      <Button className="w-full mt-4 bg-green-600" onClick={addEarn}>Bonyeza Ad Pata $0.06</Button>
      <div className="grid grid-cols-2 gap-2 mt-4">{vids.map((v,i)=><video key={i} src={v} className="aspect-[9/16] bg-black rounded" muted loop autoPlay playsInline/>)} {vids.length===0&&<p className="col-span-2 text-center opacity-50 py-10">Hakuna video - Bonyeza +</p>}</div>
    </div>
   )}

   {page==='explore'&&<div className="absolute top-[32px] bottom-[60px] bg-white p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-4 font-bold">Explore</h1></div>}
   {page==='live'&&<div className="absolute top-[32px] bottom-[60px] bg-black text-white p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-4 font-bold text-red-500">● LIVE</h1></div>}

   <nav className="absolute bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center z-50">
    <button onClick={()=>setPage('home')} className={page==='home'?'text-white':'opacity-60'}><Home size={22}/><div className="text-[10px]">Home</div></button>
    <button onClick={()=>setPage('explore')} className={page==='explore'?'text-white':'opacity-60'}><Search size={22}/><div className="text-[10px]">Explore</div></button>
    <button onClick={()=>fileRef.current?.click()} className="bg-[#333] px-6 py-2 rounded"><Plus/></button>
    <button onClick={()=>setPage('live')} className={page==='live'?'text-red-500':'opacity-60'}><div className="text-[10px]">● LIVE</div></button>
    <button onClick={()=>setPage('me')} className={page==='me'?'text-blue-400':'opacity-60'}><User size={22}/><div className="text-[10px]">Me • ${earnings.toFixed(2)}</div></button>
   </nav>
  </div>
 );
}
