// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Trash2, Play, Pause, Music, Volume2, VolumeX, Plus, Home, Search, Inbox, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';
import { VibraProgress } from '@/components/video-progress';
import { silenceVideo, startActiveVideo, watchPlaybackLifecycle } from '@/lib/vibra-playback';
import { followGraph, followStats, SOCIAL_PLATFORMS, socialUrl, type SocialLinks } from '@/lib/vibra-social';
import '../interface.css';

export const Route = createFileRoute('/')({ component: Vibra });

type Clip = { id: string; u: string; k: string; c: string; t: string[]; user: string; likes: number; lyrics?: string };
const SELF = 'vibra-boy';
const DEFAULTS: Clip[] = [
  { id: '1', u: 'https://www.w3schools.com/html/mov_bbb.mp4', k: 'video', c: 'Watu wa Mombasa 🔥 Vibra Familia!', t: ['#vibra', '#mombasa'], user: SELF, likes: 0 },
  { id: '2', u: 'https://www.w3schools.com/html/movie.mp4', k: 'video', c: 'Bear Love Story 🐻❤️', t: ['#love'], user: SELF, likes: 0 },
  { id: '3', u: 'https://www.w3schools.com/html/mov_bbb.mp4', k: 'video', c: 'Vibra Familia Worldwide', t: ['#vibra'], user: 'mombasa_star', likes: 0 },
];

const realAds = [
  { id: 1, title: 'Nike - Just Do It - 50% OFF Mombasa!', sub: 'Shop Now', link: 'https://uplcm.com/4/12154689' },
  { id: 2, title: 'Coca-Cola - Taste The Feeling!', sub: 'Naivas', link: 'https://uplcm.com/4/12154689' },
  { id: 3, title: 'iPhone 15 Pro - Lipa Pole Pole!', sub: 'Safaricom', link: 'https://uplcm.com/4/12154689' }
];

function Vibra() {
  const [all, setAll] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('foryou');
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState(new Set<string>());
  const [saved, setSaved] = useState(new Set<string>());
  const [page, setPage] = useState('home');
  const [activeId, setActiveId] = useState('1');
  const [showCom, setShowCom] = useState<string | null>(null);
  const [lyricsId, setLyricsId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUp, setShowUp] = useState(false);
  const [showList, setShowList] = useState<string | null>(null);
  const [newCap, setNewCap] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newKind, setNewKind] = useState('video');
  const [following, setFollowing] = useState(new Set<string>(['mombasa_star']));
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [bio, setBio] = useState('Together Familia Worldwide | #vibra #worldwide');
  const [socials, setSocials] = useState<SocialLinks>({});
  const [adIndex, setAdIndex] = useState(0);
  const [adClicks, setAdClicks] = useState<Record<number, number>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const vRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const meVRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const mediaCallbacks = useRef<Record<string, (el: HTMLVideoElement | null) => void>>({});

  function mediaRef(kind: 'feed' | 'profile', id: string) {
    const key = `${kind}:${id}`; if (mediaCallbacks.current[key]) return mediaCallbacks.current[key];
    const refs = kind === 'feed' ? vRefs : meVRefs;
    const cb = (el: HTMLVideoElement | null) => { const prev = refs.current[id]; if (prev && prev !== el) silenceVideo(prev); refs.current[id] = el; };
    mediaCallbacks.current[key] = cb; return cb;
  }

  const context = useRef({ page, activeId, suspended: false, overlay: false, muted });
  const overlay = !!(showCom || lyricsId || deleteId || showUp || showList);
  context.current = { ...context.current, page, activeId, overlay, muted };
  const filtered = tab === 'following' ? all.filter(x => following.has(x.user)) : all;
  const myVideos = all.filter(x => x.user === SELF);
  const totalLikes = myVideos.reduce((sum, c) => sum + c.likes + Number(likes.has(c.id)), 0);
  const statistics = followStats(SELF, followGraph(SELF, [...following]));
  const currentAd = realAds[adIndex];

  // MONETAG - Salama, haivunji chochote
  useEffect(() => {
    (window as any).openMonetag = () => { window.open('https://uplcm.com/4/12154689', '_blank'); };
    const id = setInterval(() => setAdIndex(i => (i + 1) % realAds.length), 4000);
    return () => clearInterval(id);
  }, []);

  const triggerMonetag = () => { try { (window as any).openMonetag?.(); } catch {} };
  
  function clickAd(ad: any) {
    triggerMonetag();
    const n = { ...adClicks, [ad.id]: (adClicks[ad.id] || 0) + 1 };
    setAdClicks(n);
    try { localStorage.setItem('vibra_adClicks', JSON.stringify(n)); } catch {}
    if (ad.link) window.open(ad.link, '_blank');
  }

  function activate(id: string) {
    context.current.activeId = id; setActiveId(id);
    Object.entries(vRefs.current).forEach(([k, v]) => { if (v && k !== id) silenceVideo(v); });
    const video = vRefs.current[id]; if (!video || context.current.suspended || context.current.overlay || document.hidden) return;
    const still = () => context.current.page === 'home' && context.current.activeId === id && !context.current.suspended && !context.current.overlay && !document.hidden;
    void startActiveVideo(video, !context.current.muted, still).then(r => {
      if (r === 'muted-fallback' && still()) { setMuted(true); setNotice('Tap for sound'); }
      if (r === 'blocked' && still()) setNotice('Tap Play');
    });
  }

  useEffect(() => { setReady(true); }, []);
  useEffect(() => watchPlaybackLifecycle(() => { context.current.suspended = true; }, () => {
    context.current.suspended = false; if (context.current.overlay) return;
    if (context.current.page === 'home') activate(context.current.activeId);
  }), []);

  useEffect(() => {
    Object.values(vRefs.current).forEach(v => v && silenceVideo(v));
    if (overlay || context.current.suspended || document.hidden) return;
    if (page !== 'home') return;
    const obs = new IntersectionObserver(ents => {
      for (const e of ents) {
        const id = e.target.getAttribute('data-vid'); if (!id) continue;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) activate(id); else { const vid = vRefs.current[id]; if (vid) silenceVideo(vid); }
      }
    }, { root: feedRef.current, threshold: 0.6 });
    feedRef.current?.querySelectorAll('[data-vid]')?.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page, tab, all, overlay]);

  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(t); }, [notice]);

  function toggle(setter: any, id: string) { setter((p: Set<string>) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); if (setter === setLikes) triggerMonetag(); }
  function openClip(id: string) { setTab('foryou'); setShowList(null); setPage('home'); setTimeout(() => { const el = document.querySelector(`[data-vid="${id}"]`); el?.scrollIntoView(); }, 100); }
  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; e.target.value = '';
    if (!f.type.startsWith('video/') && !f.type.startsWith('image/')) { setNotice('Choose video or image'); return; }
    const url = URL.createObjectURL(f); setNewUrl(url); setNewKind(f.type.startsWith('image/') ? 'image' : 'video'); setShowUp(true);
  }
  function post() {
    if (!newUrl) return;
    setAll(p => [{ id: crypto.randomUUID(), u: newUrl, k: newKind, c: newCap || 'My Vibra 🔥', t: ['#vibra'], user: SELF, likes: 0 }, ...p]);
    setShowUp(false); setNewUrl(''); setNewCap(''); setPage('me'); setNotice('Added');
  }
  function confirmDelete() {
    const sel = all.find(c => c.id === deleteId); if (!sel) { setDeleteId(null); return; }
    setAll(p => p.filter(c => c.id !== sel.id)); setDeleteId(null); setNotice('Deleted');
  }
  async function share(clip: Clip) {
    triggerMonetag();
    const url = new URL('', location.origin); url.searchParams.set('clip', clip.id);
    const text = `${clip.c} - Vibra Worldwide`;
    try {
      if (navigator.share) await navigator.share({ title: 'Vibra', text, url: clip.u.startsWith('https:') ? clip.u : url.href });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text}\n${clip.u}`); setNotice('Link copied'); }
    } catch {}
  }

  function actions(clip: Clip, profile = false) {
    return <div className={profile ? 'profile-actions absolute bottom-1 right-1 flex gap-1' : 'action-stack absolute bottom-[130px] right-2 flex flex-col gap-3 z-20'}>
      {!profile && <Button variant="ghost" size="icon" className="action-button bg-white/20" onClick={() => openClip(clip.id)}><Play className="w-5 h-5" /></Button>}
      <button onClick={() => { triggerMonetag(); toggle(setLikes, clip.id); }} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Heart className={`w-6 h-6 ${likes.has(clip.id) ? 'fill-red-500 text-red-500' : ''}`} /></div><span className="text-[11px] mt-1">{likes.has(clip.id) ? 'Liked' : 'Like'}</span></button>
      <button onClick={() => { triggerMonetag(); setComment(''); setShowCom(clip.id); }} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><MessageCircle className="w-6 h-6" /></div><span className="text-[11px] mt-1">{comments[clip.id]?.length || 0} Comment</span></button>
      <button onClick={() => { triggerMonetag(); setLyricsId(clip.id); }} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Music className="w-5 h-5" /></div><span className="text-[11px] mt-1">Lyrics</span></button>
      <button onClick={() => { triggerMonetag(); toggle(setSaved, clip.id); }} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Bookmark className={`w-5 h-5 ${saved.has(clip.id) ? 'fill-white' : ''}`} /></div><span className="text-[11px] mt-1">Save</span></button>
      <button onClick={() => share(clip)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Share2 className="w-5 h-5" /></div><span className="text-[11px] mt-1">Share</span></button>
      {clip.user === SELF && <button onClick={() => setDeleteId(clip.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Trash2 className="w-5 h-5" /></div><span className="text-[11px] mt-1">Del</span></button>}
    </div>;
  }

  function thumbnail(clip: Clip) {
    return <article key={clip.id} className="relative aspect-[9/16] bg-black overflow-hidden rounded">
      {clip.k === 'image' ? <img src={clip.u} className="w-full h-full object-cover" /> : <video ref={mediaRef('profile', clip.id)} src={clip.u} loop muted autoPlay playsInline className="w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><p className="absolute bottom-1 left-1 text-[10px] truncate w-20">{clip.c}</p>{actions(clip, true)}
    </article>;
  }

  const collection = showList === 'Saved' ? all.filter(c => saved.has(c.id)) : showList === 'Liked' ? all.filter(c => likes.has(c.id)) : myVideos;

  return <div data-ready={ready} className="vibra-app bg-black text-white relative h-screen overflow-hidden">
    <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={upload} />
    {notice && <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm z-50">{notice}</div>}

    {page === 'me' && <section className="absolute inset-0 bg-zinc-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"><Button variant="ghost" size="icon" onClick={() => setPage('home')}><ArrowLeft /></Button><strong>Vibra Worldwide</strong><Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()}><Plus /></Button></header>
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-around mt-5">{[['Following', statistics.following], ['Followers', statistics.followers], ['Likes', totalLikes], ['Friends', statistics.friends]].map(([l, v]) => <button key={l as string} onClick={() => setShowList(l as string)} className="flex flex-col items-center"><strong>{v as number}</strong><span className="text-xs opacity-60">{l as string}</span></button>)}</div>
        <div className="flex gap-2 px-4 mt-5"><Button variant="secondary" className="flex-1" onClick={() => setShowList('Edit profile')}>Edit profile</Button><Button variant="secondary" className="flex-1" onClick={() => fileRef.current?.click()}><Plus /> Upload</Button></div>
        <div className="px-4 mt-3"><strong className="text-sm">@{SELF} 🌍</strong><p className="text-xs opacity-70 mt-1">{bio}</p></div>
        <div className="grid grid-cols-3 gap-1 mt-4 p-1">{myVideos.map(thumbnail)}</div>
      </div>
      <nav className="flex justify-around py-2 border-t border-white/10 shrink-0"><button onClick={() => setPage('home')} className="flex flex-col items-center opacity-60"><Home className="w-5 h-5" />Home</button><button onClick={() => setPage('explore')} className="flex flex-col items-center opacity-60"><Search className="w-5 h-5" />Explore</button><button onClick={() => fileRef.current?.click()} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"><Plus /></button><button onClick={() => setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox className="w-5 h-5" />Inbox</button><button className="flex flex-col items-center"><User className="w-5 h-5" />Me</button></nav>
    </section>}

    {page === 'home' && <section className="absolute inset-0 flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-center gap-6 pt-12 pb-2"><button className={tab === 'foryou' ? 'font-bold' : 'opacity-60'} onClick={() => setTab('foryou')}>For You</button><button className={tab === 'following' ? 'font-bold' : 'opacity-60'} onClick={() => setTab('following')}>Following</button></header>
      <div ref={feedRef} className="flex-1 overflow-y-scroll snap-y snap-mandatory">
        {filtered.map(clip => <div key={clip.id} data-vid={clip.id} className="relative h-screen w-screen snap-start shrink-0">
          {clip.k === 'image' ? <img src={clip.u} className="w-full h-full object-cover" /> : <video ref={mediaRef('feed', clip.id)} src={clip.u} loop playsInline muted={muted} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute bottom-20 left-3 right-20 z-10"><p className="font-bold">@{clip.user}</p><p className="text-sm mt-1">{clip.c}</p>
            <div onClick={() => clickAd(currentAd)} className="mt-3 bg-white/10 backdrop-blur rounded-lg p-2 flex justify-between items-center"><div><p className="text-sm font-bold">{currentAd.title}</p><p className="text-xs opacity-70">{currentAd.sub}</p></div><div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">Shop</div></div>
          </div>
          {actions(clip)}
          <Button variant="ghost" size="icon" className="absolute top-20 right-2 z-20" onClick={() => setMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>)}
      </div>
      <nav className="absolute bottom-0 left-0 right-0 flex justify-around py-3 bg-black/60 backdrop-blur z-20"><button className="flex flex-col items-center"><Home className="w-5 h-5" />Home</button><button onClick={() => setPage('explore')} className="flex flex-col items-center opacity-60"><Search className="w-5 h-5" />Explore</button><button onClick={() => fileRef.current?.click()} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"><Plus /></button><button onClick={() => setPage('inbox')} className="flex flex-col items-center opacity-60"><Inbox className="w-5 h-5" />Inbox</button><button onClick={() => setPage('me')} className="flex flex-col items-center opacity-60"><User className="w-5 h-5" />Me</button></nav>
    </section>}

    {page === 'explore' && <section className="absolute inset-0 bg-black text-white flex flex-col"><header className="flex items-center gap-2 px-4 py-3"><Button variant="ghost" size="icon" onClick={() => setPage('home')}><ArrowLeft /></Button><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Vibra..." className="flex-1 bg-white/10 rounded px-3 py-2" /></header><div className="flex-1 overflow-auto p-1 grid grid-cols-3 gap-1">{all.filter(c => c.c.toLowerCase().includes(query.toLowerCase())).map(thumbnail)}</div></section>}
    {page === 'inbox' && <section className="absolute inset-0 bg-black text-white flex flex-col"><header className="flex items-center gap-2 px-4 py-3 border-b border-white/10"><Button variant="ghost" size="icon" onClick={() => setPage('home')}><ArrowLeft /></Button><strong>Inbox - Live 🔴</strong></header><div className="flex-1 flex flex-col items-center justify-center opacity-60"><p>Live coming soon 🔴</p><Button className="mt-4" onClick={() => { triggerMonetag(); setNotice('Live will start soon!'); }}>Join Live</Button></div></section>}

    {showCom && <VibraSheet title="Comments" onClose={() => setShowCom(null)}><div className="space-y-2">{(comments[showCom] ?? []).map((c, i) => <p key={i} className="text-sm bg-white/10 p-2 rounded">{c}</p>)}<div className="flex gap-2 mt-4"><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment..." className="flex-1 bg-white/10 rounded px-3 py-2" /><Button onClick={() => { if (!comment) return; setComments(p => ({ ...p, [showCom!]: [...(p[showCom!] ?? []), comment] })); setComment(''); triggerMonetag(); }}>Send</Button></div></VibraSheet>}
    {lyricsId && <VibraSheet title="Lyrics" onClose={() => setLyricsId(null)}><p className="text-sm">{all.find(c => c.id === lyricsId)?.c}</p><p className="text-xs opacity-60 mt-2">Vibra Worldwide #vibra</p></VibraSheet>}
    {deleteId && <VibraSheet title="Delete?" onClose={() => setDeleteId(null)}><p>Delete this video?</p><div className="flex gap-2 mt-4"><Button variant="destructive" className="flex-1" onClick={confirmDelete}>Delete</Button><Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button></div></VibraSheet>}
    {showUp && <VibraSheet title="Post Vibra" onClose={() => setShowUp(false)}><input value={newCap} onChange={e => setNewCap(e.target.value)} placeholder="Caption..." className="w-full bg-white/10 rounded px-3 py-2 mb-3" />{newUrl && (newKind === 'image' ? <img src={newUrl} className="w-full h-64 object-cover rounded mb-3" /> : <video src={newUrl} className="w-full h-64 object-cover rounded mb-3" muted loop autoPlay />)}<div className="flex gap-2"><Button className="flex-1" onClick={post}>Post</Button><Button variant="secondary" className="flex-1" onClick={() => setShowUp(false)}>Cancel</Button></div></VibraSheet>}
    {showList && <VibraSheet title={showList} onClose={() => setShowList(null)}><div className="grid grid-cols-3 gap-1">{collection.map(thumbnail)}</div>{collection.length === 0 && <p className="text-center opacity-60 py-10">No videos</p>}</VibraSheet>}
  </div>;
}
