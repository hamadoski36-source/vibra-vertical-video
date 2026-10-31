import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { Heart, MessageCircle, Search, Plus, Home, User, ArrowLeft, Mic, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

function Vibra(){
 const [page,setPage]=useState('home');
 const [earnings,setEarnings]=useState(()=>{
   const s=typeof window!=='undefined'?localStorage.getItem('vibra_earnings'):null;
   return s?parseFloat(s):3.18;
 });
 const fileRef=useRef<HTMLInputElement>(null);
 const [videos,setVideos]=useState<string[]>([]);

 const clickAd=()=>{
   const n=Number((earnings+0.06).toFixed(2));
   setEarnings(n);
   localStorage.setItem('vibra_earnings',String(n));
   window.open('https://www.nike.com','_blank');
 };

 const handleUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
   const f=e.target.files?.[0]; if(!f) return;
   const url=URL.createObjectURL(f);
   setVideos(prev=>[url,...prev]);
   e.target.value='';
   setPage('me');
 };

 return(
  <div className="relative w-screen h-screen bg-[#fdf8ee] text-black overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleUpload}/>

   {/* TOP AD */}
   <div className="absolute top-0 left-0 right-0 z-50 bg-[#2b1a0a] text-[#ffd98a] text-[11px] py-2 px-2 flex justify-center font-bold">
     <button onClick={clickAd} className="w-full text-center">Nike - Just Do It - 50% OFF Mombasa! - ${earnings.toFixed(2)} earned! 👆 Bonyeza hapa +$0.06</button>
   </div>

   {/* HOME PAGE - Kama kwenye screenshot yako */}
   {page==='home'&&(
    <section className="absolute inset-0 top-[32px] bottom-[60px] bg-[#fdf8ee] overflow-hidden">
     <header className="h-[40px] bg-black text-white flex justify-between items-center px-3">
      <strong>Vibra</strong>
      <div className="flex gap-3 text-xs"><span>@@vibra-boy</span><span className="bg-red-600 px-2 rounded">LIVE</span><span className="border-b">For You</span></div>
     </header>
     
     <div className="relative h-[calc(100%-40px)] w-full bg-[#fdf8ee] flex flex-col">
      <div className="text-center py-3">
        <h1 className="text-[32px] font-bold text-[#e7335d] italic">Together Forever ❤️💜</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        {videos.length>0 ? (
          <video src={videos[0]} autoPlay loop muted playsInline className="max-h-[65vh] w-full object-contain bg-white rounded-lg shadow" />
        ) : (
          <div className="bg-white p-3 shadow-lg w-full max-w-[360px]">
            <img src="https://i.imgur.com/8Km9tLL.jpeg" alt="Together Forever" className="w-full object-contain" onError={(e)=>{(e.target as HTMLImageElement).src='https://via.placeholder.com/350x500/fdf8ee/e7335d?text=Together+Forever'}} />
            <p className="text-[10px] text-center mt-2 opacity-50">Video yako ya kwanza - Bonyeza + kuweka video</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-3">
        <p className="font-bold text-sm">@vibra_boy</p>
        <p className="text-xs">#together #viral #vibra #fyp</p>
      </div>

      <div className="absolute bottom-6 right-3 flex flex-col gap-4 items-center">
        <button className="flex flex-col items-center"><Heart className="fill-red-500 text-red-500" size={28}/><span className="text-xs">853</span></button>
        <button className="flex flex-col items-center"><MessageCircle size={26}/><span className="text-xs">12K</span></button>
        <button className="flex flex-col items-center"><Mic size={20}/><span className="text-[10px]">Lyrics</span></button>
        <button className="flex flex-col items-center"><Share2 size={20}/><span className="text-xs">🚀</span></button>
      </div>

      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded">● LIVE • 0</div>
     </div>
    </section>
   )}

   {/* ME PAGE - SASA INAFANYA! */}
   {page==='me'&&(
    <section className="absolute inset-0 top-[32px] bottom-[60px] bg-white text-black flex flex-col">
     <header className="flex justify-between items-center px-4 py-3 border-b shrink-0">
      <Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft/></Button>
      <strong>@vibra-boy - ${earnings.toFixed(2)}</strong>
      <Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus/></Button>
     </header>
     <div className="flex-1 overflow-y-auto p-4">
      <div className="flex justify-around text-center">
        <div><strong>1</strong><p className="text-xs opacity-60">Following</p></div>
        <div><strong>955</strong><p className="text-xs">Followers</p></div>
        <div><strong>17</strong><p className="text-xs">Likes</p></div>
        <div><strong className="text-green-600">${earnings.toFixed(2)}</strong><p className="text-xs">Earned</p></div>
      </div>
      <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded">
        <p className="font-bold text-sm">💰 Balance: ${earnings.toFixed(2)}</p>
        <p className="text-xs opacity-60">Bonyeza ad ya Nike juu kuongeza $0.06 kila click - inabaki hata ukifunga simu!</p>
        <Button className="mt-2 w-full bg-green-600" onClick={clickAd}>Bonyeza Ad - Pata $0.06 Sasa</Button>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {videos.length===0 ? <p className="col-span-2 text-center opacity-50 py-10">Hakuna video bado - Bonyeza + kuweka</p> :
         videos.map((v,i)=><video key={i} src={v} className="aspect-[9/16] bg-black rounded object-cover" muted loop autoPlay playsInline />)
        }
      </div>
     </div>
    </section>
   )}

   {page==='explore'&&<section className="absolute inset-0 top-[32px] bottom-[60px] bg-white p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-6 font-bold">Explore</h1></section>}
   {page==='live'&&<section className="absolute inset-0 top-[32px] bottom-[60px] bg-black text-white p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-6 font-bold text-red-500">● LIVE</h1><p>Live itaanza hapa</p></section>}

   {/* BOTTOM NAV - SASA BUTTONS ZINAFANYA, SIO PICHA! */}
   <nav className="absolute bottom-0 left-0 right-0 h-[60px] bg-black text-white flex justify-around items-center z-50 border-t border-white/10">
    <button onClick={()=>setPage('home')} className={`flex flex-col items-center ${page==='home'?'text-white':'opacity-60'}`}><Home size={22}/><span className="text-[10px]">Home</span></button>
    <button onClick={()=>setPage('explore')} className={`flex flex-col items-center ${page==='explore'?'text-white':'opacity-60'}`}><Search size={22}/><span className="text-[10px]">Explore</span></button>
    <button onClick={()=>fileRef.current?.click()} className="bg-[#333] px-6 py-2 rounded-lg"><Plus size={20}/></button>
    <button onClick={()=>setPage('live')} className={`flex flex-col items-center ${page==='live'?'text-red-500':'opacity-60'}`}><div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div><span className="text-[10px]">LIVE</span></button>
    <button onClick={()=>setPage('me')} className={`flex flex-col items-center ${page==='me'?'text-blue-400':'opacity-60'}`}><User size={22}/><span className="text-[10px]">Me • ${earnings.toFixed(2)}</span></button>
   </nav>
  </div>
 );
}
