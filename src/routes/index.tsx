import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Trash2, Play, Music, Volume2, VolumeX, Plus, Home, Search, Inbox, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../interface.css';

export const Route = createFileRoute('/')({
  component: Vibra,
});

type Clip = { id: string; u: string; k: string; c: string; t: string[]; user: string; likes: number };

const SELF = 'vibra-boy';
const DEFAULTS: Clip[] = [
  { id: '1', u: 'https://www.w3schools.com/html/mov_bbb.mp4', k: 'video', c: 'Watu wa Mombasa 🔥 Vibra Familia!', t: ['#vibra', '#mombasa'], user: SELF, likes: 12 },
  { id: '2', u: 'https://www.w3schools.com/html/movie.mp4', k: 'video', c: 'Bear Love Story 🐻❤️', t: ['#love'], user: SELF, likes: 5 },
];

function Vibra(){
  const [all,setAll]=useState(DEFAULTS);
  const [tab,setTab]=useState('foryou');
  const [page,setPage]=useState('home');
  const [muted,setMuted]=useState(true);
  const [likes,setLikes]=useState(new Set<string>());
  const [saved,setSaved]=useState(new Set<string>());
  const [activeId,setActiveId]=useState('1');
  const fileRef=useRef<HTMLInputElement>(null);
  const feedRef=useRef<HTMLDivElement>(null);
  const vRefs=useRef<Record<string, HTMLVideoElement|null>>({});
  const following=new Set(['mombasa_star']);

  const filtered = tab==='following' ? all.filter(x=>following.has(x.user)) : all;
  const myVideos = all.filter(x=>x.user===SELF);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        const id=e.target.getAttribute('data-vid');
        if(!id) return;
        if(e.isIntersecting) setActiveId(id);
      });
    },{threshold:0.6});
    feedRef.current?.querySelectorAll('[data-vid]')?.forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  },[filtered]);

  const toggle=(setter:any,id:string)=>setter((p:Set<string>)=>{const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n;});

  function upload(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    e.target.value='';
    const url=URL.createObjectURL(f);
    setAll(p=>[{id:crypto.randomUUID(),u:url,k:'video',c:'My Vibra 🔥',t:['#vibra'],user:SELF,likes:0},...p]);
    setPage('me');
  }

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload} />
      
      {page==='home' && (
        <section className="absolute inset-0">
          <header className="absolute top-0 left-0 right-0 z-20 flex justify-center gap-6 pt-12 pb-2 bg-gradient-to-b from-black/60 to-transparent">
            <button className={tab==='foryou'?'font-bold text-white':'opacity-60'} onClick={()=>setTab('foryou')}>For You</button>
            <button className={tab==='following'?'font-bold text-white':'opacity-60'} onClick={()=>setTab('following')}>Following</button>
          </header>
          <div ref={feedRef} className="h-full overflow-y-scroll snap-y snap-mandatory">
            {filtered.map(clip=>(
              <div key={clip.id} data-vid={clip.id} className="relative h-screen w-screen snap-start shrink-0">
                <video ref={el=>{vRefs.current[clip.id]=el}} src={clip.u} loop muted={muted} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
                <div className="absolute bottom-[100px] left-3 right-20">
                  <p className="font-bold">@{clip.user}</p>
                  <p className="text-sm mt-1">{clip.c}</p>
                  <p className="text-xs opacity-80 mt-1">{clip.t.join(' ')}</p>
                </div>
                <div className="absolute bottom-[130px] right-2 flex flex-col gap-4 z-30">
                  <button onClick={()=>toggle(setLikes,clip.id)} className="flex flex-col items-center"><Heart className={likes.has(clip.id)?'fill-red-500 text-red-500':''} /><span className="text-xs">{clip.likes+Number(likes.has(clip.id))}</span></button>
                  <button className="flex flex-col items-center"><MessageCircle /><span className="text-xs">Comment</span></button>
                  <button className="flex flex-col items-center"><Music /><span className="text-xs">Lyrics</span></button>
                  <button onClick={()=>toggle(setSaved,clip.id)} className="flex flex-col items-center"><Bookmark className={saved.has(clip.id)?'fill-white':''} /><span className="text-xs">Save</span></button>
                  <button className="flex flex-col items-center"><Share2 /><span className="text-xs">Share</span></button>
                </div>
                <button onClick={()=>setMuted(!muted)} className="absolute top-20 right-3 z-20 bg-black/40 p-2 rounded-full">{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>
              </div>
            ))}
          </div>
          <nav className="absolute bottom-0 left-0 right-0 flex justify-around py-3 bg-black border-t border-white/10">
            <button className="flex flex-col items-center text-white"><Home size={22}/><span className="text-[10px]">Home</span></button>
            <button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={22}/><span className="text-[10px]">Explore</span></button>
            <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-white text-black px-4 py-1 rounded-md"><Plus/></div></button>
            <button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={22}/><span className="text-[10px]">Inbox</span></button>
            <button onClick={()=>setPage('me')} className="flex flex-col items-center opacity-60"><User size={22}/><span className="text-[10px]">Me</span></button>
          </nav>
        </section>
      )}

      {page==='me' && (
        <section className="absolute inset-0 bg-white text-black flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b shrink-0"><Button variant="ghost" size="icon" onClick={()=>setPage('home')}><ArrowLeft/></Button><strong>Vibra</strong><Button variant="ghost" size="icon" onClick={()=>fileRef.current?.click()}><Plus/></Button></header>
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-around mt-5">
              <div className="text-center"><strong>1</strong><p className="text-xs opacity-60">Following</p></div>
              <div className="text-center"><strong>0</strong><p className="text-xs opacity-60">Followers</p></div>
              <div className="text-center"><strong>{myVideos.reduce((s,c)=>s+c.likes,0)}</strong><p className="text-xs opacity-60">Likes</p></div>
              <div className="text-center"><strong>0</strong><p className="text-xs opacity-60">Friends</p></div>
            </div>
            <div className="px-4 mt-4"><p className="font-bold text-sm">@{SELF} 🌍</p><p className="text-xs opacity-60 mt-1">Together Familia Worldwide | #vibra #worldwide Mombasa</p></div>
            <div className="grid grid-cols-3 gap-1 mt-4">
              {myVideos.map(v=><div key={v.id} className="aspect-[9/16] bg-black relative"><video src={v.u} className="w-full h-full object-cover" muted loop autoPlay playsInline /></div>)}
            </div>
          </div>
          <nav className="flex justify-around py-3 border-t bg-white shrink-0">
            <button onClick={()=>setPage('home')} className="flex flex-col items-center opacity-60"><Home size={22}/><span className="text-[10px]">Home</span></button>
            <button onClick={()=>setPage('explore')} className="flex flex-col items-center opacity-60"><Search size={22}/><span className="text-[10px]">Explore</span></button>
            <button onClick={()=>fileRef.current?.click()} className="flex flex-col items-center"><div className="bg-black text-white px-4 py-1 rounded-md"><Plus/></div></button>
            <button onClick={()=>setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox size={22}/><span className="text-[10px]">Inbox</span></button>
            <button className="flex flex-col items-center text-black"><User size={22}/><span className="text-[10px]">Me</span></button>
          </nav>
        </section>
      )}

      {page==='explore' && <section className="absolute inset-0 bg-white text-black p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="text-xl font-bold mt-6">Explore</h1><p className="opacity-60 mt-2">Search coming soon...</p></section>}
      {page==='inbox' && <section className="absolute inset-0 bg-white text-black p-6"><Button variant="ghost" onClick={()=>setPage('home')}><ArrowLeft/> Back</Button><h1 className="text-xl font-bold mt-6">Inbox</h1><p className="opacity-60 mt-2">Live 🔴 - Messages here</p></section>}
    </div>
  );
}
