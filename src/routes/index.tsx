import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Plus, Home, Search, Inbox, User, ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

type Clip = { id: string; u: string; c: string; t: string[]; user: string; likes: number };
type Ad = { title: string; url: string; color: string };

const SELF='vibra-boy';
const DEFAULTS:Clip[]=[
 {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa 🔥 Vibra Familia!',t:['#vibra','#mombasa'],user:SELF,likes:12},
 {id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'Bear Love 🐻',t:['#love'],user:SELF,likes:5},
];

const ADS:Ad[]=[
 {title:'Nike - Just Do It 🔥', url:'https://www.nike.com', color:'bg-white text-black'},
 {title:'Safaricom - Twaweza 💚', url:'https://www.safaricom.co.ke', color:'bg-green-600 text-white'},
 {title:'Jumia - Best Deals 🛒', url:'https://www.jumia.co.ke', color:'bg-orange-500 text-white'},
];

function Vibra(){
 const [all,setAll]=useState(DEFAULTS);
 const [tab,setTab]=useState('foryou');
 const [page,setPage]=useState('home');
 const [likes,setLikes]=useState(new Set<string>());
 const [saved,setSaved]=useState(new Set<string>());
 const [adIndex,setAdIndex]=useState(0);
 const [adClicks,setAdClicks]=useState(()=>{
   const s=typeof window!=='undefined'?localStorage.getItem('vibra_clicks'):null;
   return s?parseInt(s):1;
 });
 const totalEarnings = Number((adClicks * 0.06).toFixed(2));
 const fileRef=useRef<HTMLInputElement>(null);

 const clickAd = (ad:Ad)=>{
   const next=adClicks+1;
   setAdClicks(next);
   localStorage.setItem('vibra_clicks', String(next));
   window.open(ad.url,'_blank');
   setAdIndex((prev)=>(prev+1)%ADS.length);
 };

 useEffect(()=>{
   const id=setTimeout(()=>{document.querySelectorAll('video').forEach(v=>{const vv=v as HTMLVideoElement; vv.muted=true; vv.play().catch(()=>{});});},600);
   const adId=setInterval(()=>setAdIndex(p=>(p+1)%ADS.length),8000);
   return ()=>{clearTimeout(id); clearInterval(adId);};
 },[page,tab,all]);

 const toggle=(s:any,id:string)=>s((p:Set<string>)=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
 const myVideos=all.filter(x=>x.user===SELF);

 function upload(e:React.ChangeEvent<HTMLInputElement>){
  const f=e.target.files?.[0]; if(!f) return; e.target.value='';
  setAll(p=>[{id:crypto.randomUUID(),u:URL.createObjectURL(f),c:'My Vibra 🔥',t:['#vibra'],user:SELF,likes:0},...p]); setPage('me');
 }

 return(
  <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={upload}/>
   
   {/* ADS BANNER - $0.06 LIVE */}
   <div className="absolute top-0 left-0 right-0 z-30 flex flex-col">
     <button onClick={()=>clickAd(ADS[adIndex])} className={`w-full py-2 px-3 text-xs font-bold text-center animate-pulse ${ADS[adIndex].color}`}>
       📢 AD: {ADS[adIndex].title} - Tap to earn! 💰
     </button>
     <div className="bg-black/80 text-center py-1 text-[10px] text-green-400">
       Balance: ${totalEarnings.toFixed(2)} | Clicks: {adClicks} | Tap ad = +$0.06
     </div>
   </div>

   {page==='home'&&<section className="absolute inset-0 pt-[52px]">
    <header className="absolute top-[52px] left-0 right-0 z-20 flex justify-center gap-6 pt-2 pb-2 bg-gradient-to-b from-black/60 to-transparent"><button className={tab==='foryou'?'font-bold text-white':'opacity-60'} onClick={()=>setTab('foryou')}>For You</button><button className={tab==='following'?'font-bold text-white':'opacity-60'} onClick={()=>setTab('following')}>Following</button></header>
    <div className="h-full overflow-y-scroll snap-y snap-mandatory">
     {all.map(clip=><div key={clip.id} className="relative h-[calc(100vh-52px)] w-screen snap-start shrink-0"><video src={clip.u} loop muted playsInline autoPlay preload="auto" onLoadedData={e=>e.currentTarget.play().catch(()=>{})} className="w-full h-full object-cover"/><div className="absolute bottom-[100px] left-3 right-20"><p className="font-bold">@{clip.user}</p><p className="text-sm">{clip.c}</p><p className="text-xs opacity-70">{clip.t.join(' ')}</p></div><div className="absolute bottom-[130px] right-2 flex flex-col gap-4 z-20"><button onClick={()=>toggle(setLikes,clip.id)} className="flex flex-col items-center"><Heart className={likes.has(clip.id)?'fill-red-500 text-red-500':''}/><span className="text-xs">{clip.likes+Number(likes.has(clip.id))}</span></button><button className="flex flex-col items-center"><MessageCircle/><span className="text-xs">Comment</span></button><button className="flex flex-col items-center"><Music/><span className="text-xs">Lyrics</span></button><button onClick={()=>toggle(setSaved,clip.id)} className="flex flex-col items-center"><Bookmark className={saved.has(clip.id)?'fill-white':''}/><span className="text-xs">Save</span></button><button className="flex flex-col items-center"><Share2/><span className="text-xs">Share</span></button></div></div>)}
    </div>
    <nav className="absolute bottom-0 left-0 right-0 flex justify-around py-3 bg-black border-t border-white/10"><button className="flex flex-col items-center"><Home size={22}/><span className="text-[10px]">Home</span></button><button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={22}/><span className="text-[10px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-4 py-1 rounded-md"><Plus/></button><button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={22}/><span className="text-[10px]">Inbox</span></button><button onClick={()=>setPage('me')} className="flex flex-col items-center opacity-60"><User size={22}/><span className="text-[10px]">Me</span></button></nav>
   </section>}

   {page==='me'&&<section className="absolute inset-0 bg-white text-black flex flex-col pt-[52px]">
    <header className="flex justify-between items-center px-4 py-3 border-b shrink-0"><Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft/></Button><strong>Vibra - ${totalEarnings.toFixed(2)}</strong><Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus/></Button></header>
    <div className="flex-1 overflow-y-auto"><div className="flex justify-around mt-5"><div className="text-center"><strong>1</strong><p className="text-xs opacity-60">Following</p></div><div className="text-center"><strong>0</strong><p className="text-xs">Followers</p></div><div className="text-center"><strong>{myVideos.reduce((s,c)=>s+c.likes,0)+likes.size}</strong><p className="text-xs">Likes</p></div><div className="text-center"><strong>0</strong><p className="text-xs">Friends</p></div></div>
    <div className="px-4 mt-3 bg-green-50 border border-green-200 rounded-lg mx-3 p-2"><p className="text-xs font-bold text-green-700">💰 Earnings: ${totalEarnings.toFixed(2)} ( {adClicks} clicks x $0.06 )</p><p className="text-[10px] opacity-60">Saved in localStorage - inabaki hata ukifunga simu!</p></div>
    <p className="px-4 mt-4 font-bold text-sm">@vibra-boy 🌍</p><p className="px-4 text-xs opacity-60">Together Familia Worldwide | #vibra Mombasa</p><div className="grid grid-cols-2 gap-1 mt-4">{myVideos.map(v=><video key={v.id} src={v.u} autoPlay muted loop playsInline preload="auto" onLoadedData={ev=>ev.currentTarget.play().catch(()=>{})} className="aspect-[9/16] object-cover bg-black"/>)}</div></div>
    <nav className="flex justify-around py-3 border-t bg-white shrink-0"><button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><Home size={22}/><span className="text-[10px]">Home</span></button><button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={22}/><span className="text-[10px]">Explore</span></button><button onClick={()=>fileRef.current?.click()} className="bg-black text-white px-4 py-1 rounded-md"><Plus/></button><button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={22}/><span className="text-[10px]">Inbox</span></button><button className="flex flex-col items-center text-black"><User size={22}/><span className="text-[10px]">Me</span></button></nav>
   </section>}

   {page==='explore'&&<section className="absolute inset-0 bg-white text-black p-6 pt-[70px]"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-6 font-bold">Explore</h1></section>}
   {page==='inbox'&&<section className="absolute inset-0 bg-white text-black p-6 pt-[70px]"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="mt-6 font-bold">Inbox - ${totalEarnings.toFixed(2)}</h1></section>}
  </div>
 );
}
