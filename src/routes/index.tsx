import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Plus, Home, Search, Inbox, User, ArrowLeft, Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

type Clip = { id: string; u: string; c: string; t: string[]; user: string; likes: number };

const SELF='vibra-boy';
const DEFAULTS:Clip[]=[
 {id:'1',u:'https://www.w3schools.com/html/mov_bbb.mp4',c:'Watu wa Mombasa 🔥 Vibra Familia! #vibra #mombasa',t:['#vibra','#mombasa'],user:SELF,likes:12},
 {id:'2',u:'https://www.w3schools.com/html/movie.mp4',c:'Bear Love Story 🐻❤️ Together Familia',t:['#love','#vibra'],user:SELF,likes:5},
];

function Vibra(){
 const [all,setAll]=useState(DEFAULTS);
 const [tab,setTab]=useState('foryou');
 const [page,setPage]=useState('home');
 const [muted,setMuted]=useState(true);
 const [likes,setLikes]=useState(new Set<string>());
 const [saved,setSaved]=useState(new Set<string>());
 const fileRef=useRef<HTMLInputElement>(null);
 const feedRef=useRef<HTMLDivElement>(null);

 const myVideos=all.filter(x=>x.user===SELF);
 const toggle=(s:any,id:string)=>s((p:Set<string>)=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});

 useEffect(()=>{
  const t=setTimeout(()=>{document.querySelectorAll('video').forEach(v=>{(v as HTMLVideoElement).muted=true;(v as HTMLVideoElement).play().catch(()=>{});});},500);
  return ()=>clearTimeout(t);
 },[page,tab,all]);

 function upload(e:React.ChangeEvent<HTMLInputElement>){
  const f=e.target.files?.[0]; if(!f) return; e.target.value='';
  const url=URL.createObjectURL(f);
  setAll(p=>[{id:crypto.randomUUID(),u:url,c:'My Vibra Video 🔥',t:['#vibra'],user:SELF,likes:0},...p]);
  setPage('me');
 }

 return(
  <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
   <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload}/>

   {page==='home'&&<section className="absolute inset-0">
    <header className="absolute top-0 left-0 right-0 z-20 flex justify-center gap-6 pt-12 pb-2 bg-gradient-to-b from-black/70 to-transparent">
     <button className={tab==='foryou'?'font-bold text-white border-b-2 border-white':'opacity-60'} onClick={()=>setTab('foryou')}>For You</button>
     <button className={tab==='following'?'font-bold text-white border-b-2 border-white':'opacity-60'} onClick={()=>setTab('following')}>Following</button>
    </header>

    <div ref={feedRef} className="h-full overflow-y-scroll snap-y snap-mandatory">
     {all.map(clip=>(
      <div key={clip.id} className="relative h-screen w-screen snap-start shrink-0 bg-black" onClick={e=>{const v=e.currentTarget.querySelector('video') as HTMLVideoElement; if(v){v.play().catch(()=>{});}}}>
       <video src={clip.u} loop muted={muted} autoPlay playsInline preload="auto" onLoadedData={e=>e.currentTarget.play().catch(()=>{})} className="w-full h-full object-cover"/>
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"/>
       
       <div className="absolute bottom-[100px] left-3 right-20">
        <p className="font-bold">@{clip.user} 🌍</p>
        <p className="text-sm mt-1">{clip.c}</p>
       </div>

       <div className="absolute bottom-[130px] right-3 flex flex-col gap-5 z-30">
        <button onClick={()=>toggle(setLikes,clip.id)} className="flex flex-col items-center"><Heart className={likes.has(clip.id)?'fill-red-500 text-red-500':''} size={28}/><span className="text-xs mt-1">{clip.likes+Number(likes.has(clip.id))}</span></button>
        <button className="flex flex-col items-center"><MessageCircle size={28}/><span className="text-xs mt-1">Comment</span></button>
        <button className="flex flex-col items-center"><Music size={28}/><span className="text-xs mt-1">Lyrics</span></button>
        <button onClick={()=>toggle(setSaved,clip.id)} className="flex flex-col items-center"><Bookmark className={saved.has(clip.id)?'fill-white':''} size={28}/><span className="text-xs mt-1">Save</span></button>
        <button className="flex flex-col items-center"><Share2 size={28}/><span className="text-xs mt-1">Share</span></button>
       </div>

       <button onClick={()=>setMuted(!muted)} className="absolute top-20 right-3 z-20 bg-black/40 p-2 rounded-full">{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>
      </div>
     ))}
    </div>

    <nav className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-3 bg-black border-t border-white/10">
     <button className="flex flex-col items-center text-white"><Home size={24}/><span className="text-[10px]">Home</span></button>
     <button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={24}/><span className="text-[10px]">Explore</span></button>
     <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black px-5 py-2 rounded-lg"><Plus size={20}/></div></button>
     <button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={24}/><span className="text-[10px]">Inbox</span></button>
     <button onClick={()=>setPage('me')} className="flex flex-col items-center opacity-60"><User size={24}/><span className="text-[10px]">Me</span></button>
    </nav>
   </section>}

   {page==='me'&&<section className="absolute inset-0 bg-white text-black flex flex-col">
    <header className="flex justify-between items-center px-4 py-3 border-b shrink-0"><Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft/></Button><strong>Vibra</strong><Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus/></Button></header>
    <div className="flex-1 overflow-y-auto">
     <div className="flex justify-around mt-5 text-black">
      <div className="text-center"><strong>1</strong><p className="text-xs opacity-60">Following</p></div>
      <div className="text-center"><strong>0</strong><p className="text-xs opacity-60">Followers</p></div>
      <div className="text-center"><strong>17</strong><p className="text-xs opacity-60">Likes</p></div>
      <div className="text-center"><strong>0</strong><p className="text-xs opacity-60">Friends</p></div>
     </div>
     <div className="px-4 mt-4"><p className="font-bold text-sm">@vibra-boy 🌍</p><p className="text-xs opacity-60 mt-1">Together Familia Worldwide | #vibra #worldwide | Mombasa, Kenya</p><Button className="mt-3 w-full" variant="outline">Edit profile</Button></div>
     <div className="grid grid-cols-3 gap-1 mt-4">
      {myVideos.map(v=><div key={v.id} className="aspect-[9/16] bg-black"><video src={v.u} className="w-full h-full object-cover" muted loop autoPlay playsInline preload="auto" onLoadedData={e=>e.currentTarget.play().catch(()=>{})}/></div>)}
     </div>
    </div>
    <nav className="flex justify-around py-3 border-t bg-white shrink-0">
     <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><Home size={22}/><span className="text-[10px]">Home</span></button>
     <button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={22}/><span className="text-[10px]">Explore</span></button>
     <button onClick={()=>fileRef.current?.click()} className="bg-black text-white px-4 py-1 rounded-md"><Plus/></button>
     <button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={22}/><span className="text-[10px]">Inbox</span></button>
     <button className="flex flex-col items-center text-black"><User size={22}/><span className="text-[10px]">Me</span></button>
    </nav>
   </section>}

   {page==='explore'&&<section className="absolute inset-0 bg-white text-black p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="text-xl font-bold mt-6">Explore 🔍</h1><p className="opacity-60 mt-2">Search coming soon...</p></section>}
   {page==='inbox'&&<section className="absolute inset-0 bg-white text-black p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="text-xl font-bold mt-6">Inbox - Live 🔴</h1><p className="opacity-60 mt-2">Messages here</p></section>}
  </div>
 );
}
