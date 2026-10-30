import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Trash2, Play, Pause, Music, Volume2, VolumeX, Plus, Home, Search, Inbox, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';
import { VideoProgress } from '@/components/video-progress';
import { silenceVideo, startActiveVideo, watchPlaybackLifecycle } from '@/lib/vibra-playback';
import { followGraph, followStats, SOCIAL_PLATFORMS, socialUrl, type SocialLinks } from '@/lib/vibra-social';
import '../interface.css';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Vibra Worldwide — Video feed' },
    { name: 'description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:title', content: 'Vibra Worldwide — Video feed' },
    { property: 'og:description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Vibra,
});
type Clip = { id: string; u: string; k: string; c: string; t: string[]; user: string; likes: number; lyrics?: string };
const SELF = 'vibra-boy';
const DEFAULTS: Clip[] = [
  { id: '1', u: 'https://www.w3schools.com/html/mov_bbb.mp4', k: 'video', c: 'Watu wa Mombasa 🔥 Vibra Familia!', t: ['#vibra', '#mombasa', '#worldwide'], user: SELF, likes: 0 },
  { id: '2', u: 'https://www.w3schools.com/html/movie.mp4', k: 'video', c: 'Bear Love Story 🐻❤️', t: ['#love', '#worldwide'], user: SELF, likes: 0 },
  { id: '3', u: 'https://www.w3schools.com/html/mov_bbb.mp4', k: 'video', c: 'Vibra Familia Worldwide', t: ['#vibra', '#worldwide'], user: 'mombasa_star', likes: 0 },
];
function Vibra() {
  const [all, setAll] = useState(DEFAULTS);
  const [tab, setTab] = useState('foryou');
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState(new Set<string>());
  const [saved, setSaved] = useState(new Set<string>());
  const [page, setPage] = useState('me');
  const [activeId, setActiveId] = useState('1');
  const [paused, setPaused] = useState(false);
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
  const [socialError, setSocialError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const vRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const meVRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const uploadedUrls = useRef(new Set<string>());
  const requestedId = useRef<string | null>(null);
  const context = useRef({ page, activeId, suspended: false, overlay: false, muted });
  const overlay = !!(showCom || lyricsId || deleteId || showUp || showList);
  context.current = { ...context.current, page, activeId, overlay, muted };
  const filtered = tab === 'following' ? all.filter(x => following.has(x.user)) : all;
  const myVideos = all.filter(x => x.user === SELF);
  const totalLikes = myVideos.reduce((sum, clip) => sum + clip.likes + Number(likes.has(clip.id)), 0);
  const statistics = followStats(SELF, followGraph(SELF, [...following]));

  function activate(id: string) {
    context.current.activeId = id;
    setActiveId(id);
    Object.entries(vRefs.current).forEach(([key, video]) => { if (video && key !== id) silenceVideo(video); });
    const video = vRefs.current[id];
    if (!video || context.current.suspended || context.current.overlay || document.hidden) return;
    const stillActive = () => context.current.page === 'home' && context.current.activeId === id && !context.current.suspended && !context.current.overlay && !document.hidden;
    void startActiveVideo(video, !context.current.muted, stillActive).then(result => {
      if (result === 'muted-fallback' && stillActive()) { setMuted(true); setNotice('Your browser requires another tap for sound.'); }
      if (result === 'blocked' && stillActive()) setNotice('Your browser blocked autoplay. Tap Play.');
    });
  }
  useEffect(() => watchPlaybackLifecycle(
    () => { context.current.suspended = true; },
    () => {
      context.current.suspended = false;
      if (context.current.overlay) return;
      if (context.current.page === 'home') activate(context.current.activeId);
      else if (context.current.page === 'me') Object.values(meVRefs.current).forEach(video => {
        if (video) void startActiveVideo(video, false, () => context.current.page === 'me' && !context.current.suspended && !context.current.overlay && !document.hidden);
      });
    },
  ), []);
  useEffect(() => {
    Object.values(vRefs.current).forEach(video => { if (video) silenceVideo(video); });
    Object.values(meVRefs.current).forEach(video => { if (video) silenceVideo(video); });
    if (overlay || context.current.suspended || document.hidden) return;
    if (page === 'me') {
      Object.values(meVRefs.current).forEach(video => {
        if (video) void startActiveVideo(video, false, () => context.current.page === 'me' && !context.current.suspended && !context.current.overlay && !document.hidden);
      });
      return;
    }
    if (page !== 'home') return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('data-vid');
        if (!id) continue;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) activate(id);
        else { const video = vRefs.current[id]; if (video) silenceVideo(video); }
      }
    }, { root: feedRef.current, threshold: 0.6 });
    feedRef.current?.querySelectorAll('[data-vid]').forEach(el => observer.observe(el));
    if (requestedId.current) {
      const item = [...(feedRef.current?.querySelectorAll<HTMLElement>('[data-vid]') ?? [])].find(el => el.dataset.vid === requestedId.current);
      if (item && feedRef.current) feedRef.current.scrollTop = item.offsetTop;
      requestedId.current = null;
    }
    return () => { observer.disconnect(); Object.values(vRefs.current).forEach(video => { if (video) silenceVideo(video); }); };
  }, [page, tab, all, overlay]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => () => { uploadedUrls.current.forEach(url => URL.revokeObjectURL(url)); }, []);

  function toggle(setter: typeof setLikes, id: string) { setter(previous => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function toggleMute() {
    const next = !muted;
    context.current.muted = next;
    setMuted(next);
    activate(context.current.activeId);
  }
  function openClip(id: string) { requestedId.current = id; setTab('foryou'); setShowList(null); setPage('home'); }
  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) { setNotice('Choose a video or image.'); return; }
    const url = URL.createObjectURL(file); uploadedUrls.current.add(url);
    setNewUrl(url); setNewKind(file.type.startsWith('image/') ? 'image' : 'video'); setShowUp(true);
  }
  function cancelUpload() { if (newUrl) { URL.revokeObjectURL(newUrl); uploadedUrls.current.delete(newUrl); } setNewUrl(''); setNewCap(''); setShowUp(false); }
  function post() {
    if (!newUrl) return;
    setAll(previous => [{ id: crypto.randomUUID(), u: newUrl, k: newKind, c: newCap || 'My Vibra 🔥', t: ['#vibra', '#worldwide'], user: SELF, likes: 0 }, ...previous]);
    setShowUp(false); setNewUrl(''); setNewCap(''); setPage('me'); setNotice('Added on this device.');
  }
  function confirmDelete() {
    const selected = all.find(clip => clip.id === deleteId && clip.user === SELF);
    if (!selected) { setDeleteId(null); return; }
    setAll(previous => previous.filter(clip => clip.id !== selected.id));
    if (selected.u.startsWith('blob:') && !all.some(clip => clip.id !== selected.id && clip.u === selected.u)) { URL.revokeObjectURL(selected.u); uploadedUrls.current.delete(selected.u); }
    setDeleteId(null); setNotice('Video deleted.');
  }
  async function share(clip: Clip) {
    const url = new URL('/', window.location.origin); url.searchParams.set('clip', clip.id);
    const text = `${clip.c} · Vibra Worldwide #vibra #worldwide`;
    try {
      if (navigator.share) await navigator.share({ title: 'Vibra Worldwide', text, url: clip.u.startsWith('https:') ? clip.u : url.href });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text}\n${clip.u.startsWith('https:') ? clip.u : url.href}`); setNotice(clip.u.startsWith('blob:') ? 'App link copied. This clip is only on your device.' : 'Video link copied.'); }
      else setShowList(`Share:${clip.id}`);
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setNotice('Sharing failed. Please try again.'); }
  }
  function actions(clip: Clip, profile = false) {
    return <div className={profile ? 'profile-actions pointer-events-auto z-[60]' : 'action-stack bottom-[130px] right-2 flex flex-col gap-2 pointer-events-auto z-[60]'}>
      {profile && <Button variant="ghost" className="action-button" aria-label={`Play ${clip.c}`} onClick={() => openClip(clip.id)}><Play /></Button>}
      <Button variant="ghost" className={`action-button ${likes.has(clip.id) ? 'is-active' : ''}`} aria-label={`Like ${clip.c}`} aria-pressed={likes.has(clip.id)} onClick={() => toggle(setLikes, clip.id)}><Heart />{!profile && <span>{clip.likes + Number(likes.has(clip.id))}</span>}</Button>
      <Button variant="ghost" className="action-button" aria-label={`Comments for ${clip.c}`} onClick={() => { setComment(''); setShowCom(clip.id); }}><MessageCircle />{!profile && <span>{comments[clip.id]?.length ?? 0}</span>}</Button>
      <Button variant="ghost" className={`action-button ${saved.has(clip.id) ? 'is-active' : ''}`} aria-label={`Save ${clip.c}`} aria-pressed={saved.has(clip.id)} onClick={() => { toggle(setSaved, clip.id); }}><Bookmark />{!profile && <span>{saved.has(clip.id) ? 'Saved' : 'Save'}</span>}</Button>
      <Button variant="ghost" className="action-button" aria-label={`Share ${clip.c}`} onClick={() => void share(clip)}><Share2 />{!profile && <span>Share</span>}</Button>
      {!profile && <Button variant="ghost" className="action-button" aria-label={`Lyrics for ${clip.c}`} onClick={() => setLyricsId(clip.id)}><Music /><span>Lyrics</span></Button>}
      {clip.user === SELF && <Button variant="ghost" className="action-button" aria-label={`Delete ${clip.c}`} onClick={() => setDeleteId(clip.id)}><Trash2 />{!profile && <span>Del</span>}</Button>}
    </div>;
  }
  function thumbnail(clip: Clip) {
    return <article className="profile-tile bg-video" key={clip.id} aria-label={`Video ${clip.c}`}>
      {clip.k === 'image' ? <img src={clip.u} alt={clip.c} className="w-full h-full object-cover" /> : <video ref={el => { meVRefs.current[clip.id] = el; }} src={clip.u} loop muted playsInline className="w-full h-full object-cover" onPlay={event => { if (context.current.page !== 'me' || context.current.suspended || context.current.overlay || document.hidden) silenceVideo(event.currentTarget); else event.currentTarget.muted = true; }} />}
      <div className="absolute inset-0 video-shade" /><p className="mini-caption">{clip.c}</p>{actions(clip, true)}
    </article>;
  }
  const lyricsClip = all.find(clip => clip.id === lyricsId);
  const collection = showList === 'Saved' ? all.filter(clip => saved.has(clip.id)) : showList === 'Liked' ? all.filter(clip => likes.has(clip.id)) : myVideos;
  return <div className="vibra-app bg-video text-video-text relative overflow-hidden">
    <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" aria-label="Upload file" onChange={upload} />
    {notice && <div className="vibra-notice" role="status">{notice}</div>}
    {page === 'me' && <section className="absolute inset-0 bg-panel text-panel-text flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-panel-line shrink-0"><Button variant="ghost" size="icon" aria-label="Back to Home" onClick={() => setPage('home')}><ArrowLeft /></Button><strong>Vibra Worldwide</strong><Button variant="ghost" size="icon" aria-label="Upload a video" onClick={() => fileRef.current?.click()}><Plus /></Button></header>
      <div className="profile-scroll overflow-y-auto flex-1">
        <div className="flex justify-around mt-5">{[['Following', statistics.following], ['Followers', statistics.followers], ['Likes', totalLikes], ['Friends', statistics.friends]].map(([label, value]) => <Button key={label} variant="ghost" className="flex flex-col h-auto gap-0" onClick={() => setShowList(String(label))}><strong className="text-lg">{value}</strong><span className="text-xs text-panel-muted">{label}</span></Button>)}</div>
        <div className="flex gap-2 px-4 mt-5"><Button variant="secondary" className="flex-1 bg-panel-control text-panel-text" onClick={() => setShowList('Edit profile')}>Edit profile</Button><Button variant="secondary" className="flex-1 bg-panel-control text-panel-text" onClick={() => fileRef.current?.click()}><Plus /> Upload</Button></div>
        <div className="px-4 mt-3"><strong className="text-sm">@{SELF} 🌍</strong><p className="text-xs text-panel-muted mt-1">{bio}</p><div className="flex gap-2 flex-wrap mt-2">{SOCIAL_PLATFORMS.map(platform => { const url = socialUrl(platform.key, socials[platform.key] || ''); return url ? <a key={platform.key} href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline">{platform.label}</a> : null; })}</div></div>
        <div className="flex border-b border-panel-line mt-5"><Button variant="ghost" className="flex-1" onClick={() => setShowList('Videos')}>Videos {myVideos.length}</Button><Button variant="ghost" className="flex-1" onClick={() => setShowList('Liked')}><Heart /> {likes.size}</Button><Button variant="ghost" className="flex-1" onClick={() => setShowList('Saved')}><Bookmark /> {saved.size}</Button></div>
        <div className="grid grid-cols-2 gap-px bg-panel-line">{myVideos.map(thumbnail)}</div>
        {!myVideos.length && <div className="py-12 text-center"><p>No videos yet</p><Button className="mt-4 bg-brand text-video-text" onClick={() => fileRef.current?.click()}><Plus /> Upload</Button><Button variant="ghost" onClick={() => setAll(DEFAULTS)}>Restore demo videos</Button></div>}
      </div>
    </section>}
    {page === 'home' && <>
      <header className="top-nav absolute top-0 left-0 right-0 bg-video-glass p-2"><div className="flex justify-between items-center gap-1"><Button className="bg-brand text-video-text px-2 text-xs" onClick={() => setShowList('LIVE')}>LIVE</Button><div className="flex gap-1"><Button variant="ghost" className="text-xs px-2" aria-pressed={tab === 'following'} onClick={() => setTab('following')}>Following</Button><Button variant="ghost" className="text-xs px-2" aria-pressed={tab === 'foryou'} onClick={() => setTab('foryou')}>For You</Button></div><Button variant="ghost" size="icon" aria-label="Upload a video" onClick={() => fileRef.current?.click()}><Plus /></Button><Button variant="ghost" size="icon" aria-label={muted ? 'Sound off' : 'Sound on'} aria-pressed={!muted} onClick={toggleMute}>{muted ? <VolumeX /> : <Volume2 />}</Button></div><p className="text-[10px] text-center">Vibra Worldwide</p></header>
      <div ref={feedRef} className="feed-viewport" aria-label="Video feed">{filtered.map(clip => <article key={clip.id} data-vid={clip.id} aria-label={`Video ${clip.c}`} className="feed-clip relative bg-video">
        {clip.k === 'image' ? <img src={clip.u} alt={clip.c} className="feed-video" /> : <video ref={el => { vRefs.current[clip.id] = el; }} src={clip.u} loop muted playsInline className="feed-video" onClick={toggleMute} onPlay={event => { if (context.current.activeId !== clip.id || context.current.page !== 'home' || context.current.suspended || context.current.overlay || document.hidden) silenceVideo(event.currentTarget); else setPaused(false); }} onPause={() => { if (context.current.activeId === clip.id) setPaused(true); }} />}
        <div className="absolute inset-0 video-shade" />
        {activeId === clip.id && clip.k === 'video' && <Button variant="ghost" size="icon" className="absolute top-[90px] left-3 z-[60] bg-video-glass" aria-label={paused ? 'Play video' : 'Pause video'} onClick={() => { const video = vRefs.current[clip.id]; if (!video) return; if (video.paused) activate(clip.id); else video.pause(); }}>{paused ? <Play /> : <Pause />}</Button>}
        <div className="feed-caption absolute left-3 right-[78px]"><strong className="text-sm">@{clip.user}</strong>{clip.user !== SELF && <Button className="ml-2 bg-brand text-video-text text-xs px-2" onClick={() => toggle(setFollowing, clip.user)}>{following.has(clip.user) ? 'Following' : 'Follow'}</Button>}<p className="text-sm mt-1">{clip.c}</p><p className="text-xs text-video-link mt-1">{clip.t.join(' ')}</p></div>
        {actions(clip)}{clip.k === 'video' && <VideoProgress clipId={clip.id} source={clip.u} videos={vRefs} />}
      </article>)}{!filtered.length && <div className="empty-feed"><p>No videos from followed creators yet.</p></div>}</div>
    </>}
    {page === 'explore' && <section className="p-4 h-full overflow-y-auto profile-scroll"><h1 className="font-bold mb-4">Explore Worldwide</h1><input aria-label="Search videos" placeholder="Search videos or creators" value={query} onChange={event => setQuery(event.target.value)} className="w-full p-3 bg-video-glass rounded-md" /><div className="mt-4 space-y-3">{all.filter(clip => `${clip.c} ${clip.user} ${clip.t.join(' ')}`.toLowerCase().includes(query.toLowerCase())).map(clip => <Button key={clip.id} variant="ghost" className="w-full justify-start whitespace-normal h-auto" onClick={() => openClip(clip.id)}><Play /><span className="text-left">{clip.c}<small className="block">@{clip.user}</small></span></Button>)}</div></section>}
    {page === 'inbox' && <section className="p-6"><h1 className="font-bold">Inbox</h1><p className="mt-4 text-sm">No notifications yet.</p></section>}
    <nav className="bottom-nav absolute bottom-0 left-0 right-0 bg-video border-t border-panel-muted flex justify-around items-center">{[['home', Home, 'Home'], ['explore', Search, 'Explore'], ['upload', Plus, 'Upload'], ['inbox', Inbox, 'Inbox'], ['me', User, 'Me']].map(([key, Icon, label]) => { const NavIcon = Icon as typeof Home; return <Button key={String(key)} variant="ghost" className={`flex flex-col h-auto gap-1 px-3 ${page === key ? 'text-video-text' : 'text-panel-muted'}`} onClick={() => key === 'upload' ? fileRef.current?.click() : setPage(String(key))}><NavIcon /><span className="text-[10px]">{String(label)}</span></Button>; })}</nav>
    <VibraSheet title="Comments" open={!!showCom} onClose={() => setShowCom(null)}><div className="space-y-3 mb-4">{(comments[showCom || ''] || []).map((text, i) => <p key={i}><strong>@{SELF}: </strong>{text}</p>)}{!(comments[showCom || ''] || []).length && <p>No comments yet.</p>}</div><form className="flex gap-2" onSubmit={event => { event.preventDefault(); if (!showCom || !comment.trim()) return; const id = showCom; setComments(previous => ({ ...previous, [id]: [...(previous[id] || []), comment.trim()] })); setComment(''); }}><input aria-label="Add comment" placeholder="Add comment..." value={comment} onChange={event => setComment(event.target.value)} /><Button type="submit" className="sheet-command" disabled={!comment.trim()}>Post</Button></form></VibraSheet>
    <VibraSheet title="Lyrics" open={!!lyricsId} onClose={() => setLyricsId(null)}><p className="lyrics-copy">{lyricsClip?.lyrics?.trim() || 'Lyrics are not available for this video yet.'}</p></VibraSheet>
    <VibraSheet title="Delete this video?" open={!!deleteId} onClose={() => setDeleteId(null)}><p>Only this selected video will be deleted. Your other videos and activity will stay.</p><div className="flex gap-3 mt-4"><Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button><Button className="sheet-command" onClick={confirmDelete}>Delete video</Button></div></VibraSheet>
    <VibraSheet title="Upload" open={showUp} onClose={cancelUpload}>{newKind === 'image' ? <img src={newUrl} alt="Upload preview" className="h-[35dvh] w-full object-contain" /> : <video src={newUrl} controls muted playsInline className="h-[35dvh] w-full object-contain" />}<label className="block mt-4">Caption<input placeholder="Add caption #vibra #worldwide..." value={newCap} onChange={event => setNewCap(event.target.value)} /></label><div className="flex justify-between mt-4"><Button variant="secondary" onClick={cancelUpload}>Cancel</Button><Button className="sheet-command" onClick={post}>Post</Button></div></VibraSheet>
    <VibraSheet title={showList?.startsWith('Share:') ? 'Share video' : showList || ''} open={!!showList} onClose={() => setShowList(null)}>
      {showList === 'Following' && <div className="space-y-3">{[...following].map(handle => <div key={handle} className="flex items-center justify-between"><span>@{handle}</span><Button variant="secondary" onClick={() => toggle(setFollowing, handle)}>Unfollow</Button></div>)}{!following.size && <p>No followed creators yet.</p>}</div>}
      {(showList === 'Followers' || showList === 'Friends') && <p>No {showList.toLowerCase()} recorded in this session yet.</p>}
      {showList === 'Likes' && <p>{totalLikes} likes on your videos in this session.</p>}
      {['Videos', 'Liked', 'Saved'].includes(showList || '') && <div className="space-y-2">{collection.map(clip => <Button key={clip.id} variant="ghost" className="w-full h-auto whitespace-normal justify-start" onClick={() => openClip(clip.id)}><Play />{clip.c}</Button>)}{!collection.length && <p>No videos yet.</p>}</div>}
      {showList === 'Edit profile' && <form className="space-y-4" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); const next: SocialLinks = {}; for (const platform of SOCIAL_PLATFORMS) { const url = socialUrl(platform.key, String(form.get(platform.key) || '')); if (url === null) { setSocialError(`Enter a valid HTTPS ${platform.label} link.`); return; } next[platform.key] = url; } setSocials(next); setBio(String(form.get('bio') || '')); setSocialError(''); setShowList(null); }}><label className="block">Bio<textarea name="bio" defaultValue={bio} /></label>{SOCIAL_PLATFORMS.map(platform => <label key={platform.key} className="block">{platform.label}<input name={platform.key} defaultValue={socials[platform.key]} /></label>)}{socialError && <p role="alert">{socialError}</p>}<Button type="submit" className="sheet-command">Save profile</Button></form>}
      {showList === 'LIVE' && <p>LIVE streaming is not connected yet.</p>}
      {showList?.startsWith('Share:') && <input aria-label="Video link" readOnly value={all.find(clip => clip.id === showList.split(':')[1])?.u || ''} />}
    </VibraSheet>
  </div>;
}
