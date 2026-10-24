import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Bookmark, Camera, Check, Compass, Film, Heart, Home, Inbox, MessageCircle,
  Pause, Play, Plus, Search, Send, Share2, Sparkles, UserRound, X, Radio,
  ArrowUpRight, ImagePlus, Camera as CameraIcon,
} from "lucide-react";

import "../vibra.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibra — Your daily frequency" },
      {
        name: "description",
        content:
          "Vibra is a vertical short-video feed for your moments: watch clips, like, comment, save, follow creators, and add your own videos.",
      },
      { property: "og:title", content: "Vibra — Your daily frequency" },
      {
        property: "og:description",
        content:
          "A vertical short-video feed for your moments: watch clips, like, comment, save, follow creators, and add your own videos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VibraApp,
});

type Clip = {
  id: string; title: string; creator: string; username: string; palette: string;
  shape: string; caption: string; createdAt: number; blobKey?: string; url?: string;
};
type LocalComment = { id: string; text: string; createdAt: number };
type View = 'home' | 'explore' | 'live' | 'inbox' | 'profile';
const STORE = 'vibra-state-v1';
const DATABASE = 'vibra-media-v1';
const SOUND_PREFERENCE = 'vibra-sound-enabled';
type Profile = { name: string; handle: string; bio: string; photo?: string | undefined };
type DemoCreator = { name: string; handle: string; bio: string; followers: number; following: number; photo?: string | undefined };
const DEMO_CREATORS: Record<string, DemoCreator> = {
  vibrastudio: { name: 'Vibra Studio', handle: 'vibrastudio', bio: 'A small studio for big feelings. Preview identity, not a real account.', followers: 128, following: 32 },
  afterglow: { name: 'Mina Sol', handle: 'afterglow', bio: 'Collecting color, movement, and the hours after dark. Demo creator preview.', followers: 74, following: 91 },
  softsignal: { name: 'Noa Vale', handle: 'softsignal', bio: 'Quiet frames for loud days. Demo creator preview.', followers: 46, following: 58 },
};
const DEMO_CLIPS: Clip[] = [
  { id: 'demo-1', title: 'A little color, a lot of feeling', creator: 'Vibra Studio', username: 'vibrastudio', palette: 'coral', shape: 'orb', caption: 'Make room for the unexpected.', createdAt: 1 },
  { id: 'demo-2', title: 'After-hours frequency', creator: 'Mina Sol', username: 'afterglow', palette: 'violet', shape: 'ribbons', caption: 'Somewhere between the beat and the lights.', createdAt: 2 },
  { id: 'demo-3', title: 'Soft focus / big mood', creator: 'Noa Vale', username: 'softsignal', palette: 'lime', shape: 'flower', caption: 'Keep the good parts close.', createdAt: 3 },
];
type Persisted = {
  clips: Clip[]; liked: string[]; saved: string[]; comments: Record<string, LocalComment[]>;
  profile: Profile; follows: string[]; seenTip: boolean;
};
const initial: Persisted = {
  clips: [], liked: [], saved: [], comments: {},
  profile: { name: 'Your space', handle: 'yourhandle', bio: 'Making little moments feel like something.' }, follows: [],
  seenTip: false,
};

function Avatar({ profile, size = 'normal' }: { profile: Profile | DemoCreator; size?: 'normal' | 'large' | 'small' }) {
  const initial = profile.name.trim().slice(0, 1).toUpperCase() || 'V';
  return <span className={`creator-avatar avatar-${size}`} aria-hidden="true">{profile.photo ? <img src={profile.photo} alt="" /> : initial}</span>;
}

function compressPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) { URL.revokeObjectURL(source); reject(new Error('Image processing is unavailable.')); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error('This photo could not be opened.')); };
    image.src = source;
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('Video storage is not available in this browser.')); return; }
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('clips');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open video storage.'));
  });
}
async function saveBlob(key: string, file: Blob) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('clips', 'readwrite'); tx.objectStore('clips').put(file, key);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
  db.close();
}
async function getBlob(key: string): Promise<Blob | undefined> {
  const db = await openDatabase();
  const value = await new Promise<Blob | undefined>((resolve, reject) => {
    const request = db.transaction('clips').objectStore('clips').get(key);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close(); return value;
}

function IconButton({ label, onClick, children, className = '', active = false }: {
  label: string; onClick: () => void; children: ReactNode; className?: string; active?: boolean;
}) {
  return <button aria-label={label} title={label} onClick={onClick} className={`icon-button ${active ? 'is-active' : ''} ${className}`} data-testid={`button-${label.toLowerCase().replaceAll(' ', '-')}`}>{children}</button>;
}

function VibraApp() {
  const [view, setView] = useState<View>('home');
  const [state, setState] = useState<Persisted>(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return initial;
      const saved = JSON.parse(raw) as Partial<Persisted>;
      return { ...initial, ...saved, profile: { ...initial.profile, ...(saved.profile ?? {}) }, follows: saved.follows ?? [] };
    } catch { return initial; }
  });
  const [clipUrls, setClipUrls] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'comments' | 'profile' | null>(null);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem(SOUND_PREFERENCE) !== 'false'; } catch { return true; }
  });
  const [activeFeedVideoId, setActiveFeedVideoId] = useState<string | null>(null);
  const [soundPromptClipId, setSoundPromptClipId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [tipVisible, setTipVisible] = useState(!state.seenTip);
  const [profileForm, setProfileForm] = useState(state.profile);
  const [profilePhotoRef, setProfilePhotoRef] = useState<HTMLInputElement | null>(null);
  const [profilePhotoBusy, setProfilePhotoBusy] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'clips' | 'liked' | 'saved'>('clips');
  const [draftTitle, setDraftTitle] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { setNotice('Could not save app settings in this browser.'); }
  }, [state]);
  useEffect(() => {
    let alive = true;
    state.clips.forEach(async clip => {
      if (!clip.blobKey) return;
      try {
        const blob = await getBlob(clip.blobKey);
        if (blob && alive) setClipUrls(prev => prev[clip.id] ? prev : ({ ...prev, [clip.id]: URL.createObjectURL(blob) }));
      } catch { if (alive) setNotice('A saved video could not be opened. Try importing it again.'); }
    });
    return () => { alive = false; };
  }, [state.clips]);
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 3600);
    return () => window.clearTimeout(id);
  }, [notice]);

  const allClips = useMemo(() => [...state.clips].reverse(), [state.clips]);
  const activeClipData = useMemo(() => [...allClips, ...DEMO_CLIPS].find(c => c.id === activeClip) ?? null, [activeClip, allClips]);
  const profileClips = allClips;
  const isOwnProfile = !profileUsername || profileUsername === state.profile.handle;
  const viewedCreator: Profile | DemoCreator = isOwnProfile
    ? state.profile
    : DEMO_CREATORS[profileUsername] ?? { name: 'Preview creator', handle: profileUsername, bio: 'Demo creator preview. This identity is not a real account.', followers: 0, following: 0 };
  const creatorIsOwn = (clip: Clip) => !!clip.blobKey || clip.username === state.profile.handle;
  const creatorForClip = (clip: Clip): Profile | DemoCreator => creatorIsOwn(clip)
    ? state.profile
    : DEMO_CREATORS[clip.username] ?? { name: clip.creator, handle: clip.username, bio: 'Demo creator preview. This identity is not a real account.', followers: 0, following: 0 };
  const displayedClips = view === 'profile'
    ? isOwnProfile ? profileClips : [...allClips, ...DEMO_CLIPS].filter(c => c.username === profileUsername)
    : view === 'explore'
      ? [...allClips, ...DEMO_CLIPS].filter(c => `${c.title} ${c.caption} ${c.creator}`.toLowerCase().includes(search.toLowerCase()))
      : [...allClips, ...DEMO_CLIPS];
  const feedClipKey = displayedClips.map(clip => clip.id).join('|');
  const activeFeedVideoUrl = activeFeedVideoId ? clipUrls[activeFeedVideoId] ?? null : null;

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    try { localStorage.setItem(SOUND_PREFERENCE, String(soundEnabled)); } catch { /* Keep the choice for this app session. */ }
    Object.values(videoRefs.current).forEach(video => {
      if (video) video.muted = !soundEnabled;
    });
    if (!soundEnabled) setSoundPromptClipId(null);
  }, [soundEnabled]);

  useEffect(() => {
    if (view !== 'home') {
      setActiveFeedVideoId(null);
      return;
    }
    const feed = feedRef.current;
    if (!feed) return;
    const items = Array.from(feed.querySelectorAll<HTMLElement>('.feed-item'));
    if (!items.length) {
      setActiveFeedVideoId(null);
      return;
    }

    let frame = 0;
    const selectMostVisible = () => {
      frame = 0;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const visible = items.map(item => {
        const rect = item.getBoundingClientRect();
        const width = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
        const height = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        return { id: item.id.replace(/^clip-/, ''), ratio: rect.width * rect.height ? (width * height) / (rect.width * rect.height) : 0 };
      }).sort((a, b) => b.ratio - a.ratio)[0];
      if (visible && visible.ratio > 0) {
        setActiveFeedVideoId(current => current === visible.id ? current : visible.id);
      }
    };
    const scheduleSelection = () => {
      if (!frame) frame = window.requestAnimationFrame(selectMostVisible);
    };
    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(scheduleSelection, { threshold: [0, 0.15, 0.35, 0.55, 0.75, 0.95] });
    items.forEach(item => observer?.observe(item));
    window.addEventListener('scroll', scheduleSelection, { passive: true });
    feed.addEventListener('scroll', scheduleSelection, { passive: true });
    scheduleSelection();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', scheduleSelection);
      feed.removeEventListener('scroll', scheduleSelection);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [view, feedClipKey]);

  function playFeedVideo(clipId: string, video: HTMLVideoElement, isCurrent: () => boolean = () => true) {
    video.muted = !soundEnabledRef.current;
    video.playsInline = true;
    try {
      void video.play().then(() => {
        if (!isCurrent() || videoRefs.current[clipId] !== video) {
          video.pause();
          return;
        }
        setIsPlaying(current => ({ ...current, [clipId]: true }));
        setSoundPromptClipId(current => current === clipId ? null : current);
      }).catch(error => {
        if (!isCurrent() || videoRefs.current[clipId] !== video) return;
        setIsPlaying(current => ({ ...current, [clipId]: false }));
        const errorName = error instanceof Error ? error.name : '';
        if (soundEnabledRef.current && errorName === 'NotAllowedError') {
          setSoundPromptClipId(clipId);
        } else if (errorName !== 'AbortError') {
          setNotice('This video could not be played. Try another video file.');
        }
      });
    } catch {
      setNotice('This video could not be played. Try another video file.');
    }
  }

  function changeSoundPreference(enabled: boolean, clipId?: string) {
    soundEnabledRef.current = enabled;
    setSoundEnabled(enabled);
    try { localStorage.setItem(SOUND_PREFERENCE, String(enabled)); } catch { /* The choice remains active for this app session. */ }
    Object.values(videoRefs.current).forEach(video => {
      if (video) video.muted = !enabled;
    });
    if (!enabled) {
      setSoundPromptClipId(null);
      return;
    }
    const video = clipId ? videoRefs.current[clipId] : null;
    if (video?.paused) playFeedVideo(clipId!, video);
  }

  useEffect(() => {
    let cancelled = false;
    const activeId = view === 'home' ? activeFeedVideoId : null;
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && id !== activeId) video.pause();
    });
    setIsPlaying(current => {
      let changed = false;
      const next = { ...current };
      Object.keys(videoRefs.current).forEach(id => {
        if (id !== activeId && next[id]) {
          next[id] = false;
          changed = true;
        }
      });
      return changed ? next : current;
    });
    if (!activeId) {
      setSoundPromptClipId(null);
      return () => { cancelled = true; };
    }
    const video = videoRefs.current[activeId];
    if (!video) return () => { cancelled = true; };
    setSoundPromptClipId(current => current === activeId ? current : null);
    playFeedVideo(activeId, video, () => !cancelled);
    return () => { cancelled = true; };
  }, [view, activeFeedVideoId, activeFeedVideoUrl]);

  function dismissTip() {
    setTipVisible(false); setState(s => ({ ...s, seenTip: true }));
  }
  function toggleItem(key: 'liked' | 'saved', id: string) {
    setState(s => ({ ...s, [key]: s[key].includes(id) ? s[key].filter(x => x !== id) : [...s[key], id] }));
  }
  async function importVideo(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('video/')) { setNotice('Choose a video file to add it to Vibra.'); return; }
    if (file.size > 400 * 1024 * 1024) { setNotice('This video is over 400 MB. Choose a smaller clip.'); return; }
    setIsImporting(true);
    try {
      const id = `clip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await saveBlob(id, file);
      const clip: Clip = {
        id, title: draftTitle.trim() || file.name.replace(/\.[^/.]+$/, '').slice(0, 60) || 'A moment',
        creator: state.profile.name, username: state.profile.handle, palette: 'coral', shape: 'orb',
        caption: 'A moment from my camera roll.', createdAt: Date.now(), blobKey: id,
      };
      setClipUrls(prev => ({ ...prev, [id]: URL.createObjectURL(file) }));
      setState(s => ({ ...s, clips: [...s.clips, clip] }));
      setDraftTitle(''); setComposerOpen(false); setView('home'); setNotice('Your clip is ready in your local Vibra feed.');
    } catch {
      setNotice('Video storage is unavailable. Check browser storage permissions and try again.');
    } finally { setIsImporting(false); if (galleryRef.current) galleryRef.current.value = ''; if (cameraRef.current) cameraRef.current.value = ''; }
  }
  async function shareClip(clip: Clip) {
    const shareData = { title: `${clip.title} · Vibra`, text: clip.caption };
    if (navigator.share) {
      try {
        if (clip.blobKey && typeof navigator.canShare === 'function') {
          const blob = await getBlob(clip.blobKey);
          if (!blob) throw new Error('The saved video could not be found.');
          const extension = blob.type.split('/')[1]?.split(';')[0] || 'mp4';
          const file = new File([blob], `${clip.title}.${extension}`, { type: blob.type || 'video/mp4' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ ...shareData, files: [file] });
            return;
          }
          setNotice('This browser can share clip details, but not the video file.');
        }
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') setNotice('Sharing was not available. Try again from your phone.');
      }
    } else {
      try { await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`); setNotice('Clip details copied to clipboard.'); }
      catch { setNotice('Sharing and clipboard are unavailable in this browser.'); }
    }
  }
  function addComment() {
    const text = commentText.trim();
    if (!text || !activeClip) return;
    setState(s => ({ ...s, comments: { ...s.comments, [activeClip]: [...(s.comments[activeClip] ?? []), { id: `${Date.now()}`, text, createdAt: Date.now() }] } }));
    setCommentText('');
  }
  function saveProfile(e: FormEvent) {
    e.preventDefault();
    const nextProfile = { ...profileForm, handle: profileForm.handle.trim().replace(/^@/, '').replace(/\s+/g, '').toLowerCase() || 'yourhandle' };
    setState(s => ({ ...s, profile: nextProfile, clips: s.clips.map(clip => clip.blobKey ? { ...clip, creator: nextProfile.name, username: nextProfile.handle } : clip) }));
    setProfileUsername(null);
    setModal(null); setNotice('Your profile is saved on this device.');
  }
  async function selectProfilePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('Choose an image for your profile photo.'); return; }
    setProfilePhotoBusy(true);
    try { const photo = await compressPhoto(file); setProfileForm(p => ({ ...p, photo })); }
    catch { setNotice('That photo could not be prepared. Try another image.'); }
    finally { setProfilePhotoBusy(false); if (profilePhotoRef) profilePhotoRef.value = ''; }
  }
  function navTo(next: View) {
    setView(next); setSearch('');
    if (next === 'profile') setProfileUsername(null);
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }
  function openCreator(username: string) {
    setProfileUsername(username === state.profile.handle ? null : username);
    setView('profile'); setProfileTab('clips');
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }
  function toggleFollow(username: string) {
    if (username === state.profile.handle) return;
    setState(s => ({ ...s, follows: s.follows.includes(username) ? s.follows.filter(item => item !== username) : [...s.follows, username] }));
  }
  function openClip(clip: Clip) {
    setActiveClip(clip.id); setView('home'); setProfileUsername(null);
    window.setTimeout(() => document.getElementById(`clip-${clip.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  }
  function startCreate() { setComposerOpen(true); }
  const navItems: { key: View; label: string; icon: typeof Home }[] = [
    { key: 'home', label: 'Home', icon: Home }, { key: 'explore', label: 'Explore', icon: Compass },
    { key: 'live', label: 'Live', icon: Radio }, { key: 'inbox', label: 'Inbox', icon: Inbox },
    { key: 'profile', label: 'Profile', icon: UserRound },
  ];
  const pageTitle = view === 'profile' && !isOwnProfile ? `@${viewedCreator.handle}` : { home: 'For you', explore: 'Explore', live: 'Live', inbox: 'Inbox', profile: 'Your profile' }[view];

  // Server-side rendering has no access to this device's saved clips and
  // settings, so the first paint is an empty shell; the real feed appears
  // immediately after the app loads in the browser.
  if (!mounted) return <div className="app-shell grain" />;

  return (
    <div className="app-shell grain">
      <header className="mobile-header">
        <button className="brand brand-type" onClick={() => navTo('home')} aria-label="Vibra home">vibra<span>.</span></button>
        <div className="header-actions">
          <IconButton label="Search clips" onClick={() => navTo('explore')}><Search size={20}/></IconButton>
          <button className="create-small" onClick={startCreate} aria-label="Create a clip"><Plus size={19}/></button>
        </div>
      </header>
      <aside className="desktop-rail">
        <button className="brand brand-type" onClick={() => navTo('home')} aria-label="Vibra home">vibra<span>.</span></button>
        <div className="rail-links">
          {navItems.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => navTo(key)} className={`rail-link ${view === key ? 'selected' : ''}`} aria-current={view === key ? 'page' : undefined}><Icon size={20}/><span>{label}</span></button>)}
          <button className="rail-link create-link" onClick={startCreate}><Plus size={20}/><span>Create</span></button>
        </div>
        <div className="rail-note"><span className="online-dot"/><span>Made for your moments</span></div>
      </aside>

      <main className={`main-content view-${view}`}>
        <div className="page-heading">
          <div><span className="eyebrow">{view === 'home' ? 'YOUR DAILY FREQUENCY' : 'VIBRA / YOUR SPACE'}</span><h1>{pageTitle}<span className="heading-period">.</span></h1></div>
          {view === 'home' && <button className="text-link" onClick={() => navTo('explore')}>Find a new mood <ArrowUpRight size={16}/></button>}
        </div>

        {tipVisible && view === 'home' && <div className="tip-banner"><Sparkles size={17}/><span><strong>Start with a moment.</strong> Add a video from your gallery or capture one on your phone. Your clips stay on this device.</span><button aria-label="Dismiss first use tip" onClick={dismissTip}><X size={17}/></button></div>}

        {view === 'home' && <div className="feed-tabs"><button className="feed-tab active">For you <span/></button><button className="feed-tab" onClick={() => { navTo('profile'); setNotice('Your profile is your personal collection on this device.'); }}>Your clips</button><span className="feed-hint">A little scroll, a new perspective</span></div>}

        {view === 'explore' && <section className="explore-search"><div className="search-wrap"><Search size={20}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clips and moods" aria-label="Search clips and moods" data-testid="input-search"/></div><div className="search-tags"><span>TRY A MOOD</span>{['Color', 'After-hours', 'Soft focus'].map(tag => <button key={tag} onClick={() => setSearch(tag)}>{tag}</button>)}</div></section>}

        {view === 'live' && <section className="feature-panel live-panel"><div className="feature-icon live-mark"><Radio size={25}/></div><div className="eyebrow">LIVE DISCOVERY</div><h2>Something is<br/><em>on the horizon.</em></h2><p>Live streaming is not connected yet. Vibra is a local-first preview, so there are no live broadcasts to watch right now.</p><div className="feature-foot"><span className="status-pill"><i/> NOT CONNECTED</span><button className="outline-button" onClick={() => navTo('explore')}>Explore clips <ArrowUpRight size={16}/></button></div></section>}

        {view === 'inbox' && <section className="feature-panel inbox-panel"><div className="feature-icon"><Inbox size={25}/></div><div className="eyebrow">YOUR INBOX</div><h2>A quieter<br/><em>kind of connection.</em></h2><p>Messaging is not connected. This demo does not send messages to other people. Comments you leave are saved only on this device.</p><button className="outline-button" onClick={() => navTo('home')}>Back to your feed <ArrowUpRight size={16}/></button></section>}

        {view === 'profile' && <section className={`profile-top ${isOwnProfile ? 'own-profile' : 'creator-profile'}`}><Avatar profile={viewedCreator} size="large"/><div className="profile-copy"><span className="eyebrow">{isOwnProfile ? 'LOCAL PROFILE' : 'DEMO CREATOR · PREVIEW'}</span><h2>{viewedCreator.name}</h2><span className="handle">@{viewedCreator.handle}</span><p>{viewedCreator.bio}</p>{isOwnProfile ? <button className="outline-button edit-profile" onClick={() => { setProfileForm(state.profile); setModal('profile'); }}>Edit profile</button> : <button className={`follow-button profile-follow ${state.follows.includes(viewedCreator.handle) ? 'following' : ''}`} onClick={() => toggleFollow(viewedCreator.handle)}>{state.follows.includes(viewedCreator.handle) ? <Check size={15}/> : <Plus size={15}/>} {state.follows.includes(viewedCreator.handle) ? 'Following' : 'Follow'}</button>}</div><div className="profile-stats"><div><strong>{isOwnProfile ? state.clips.length : [...allClips, ...DEMO_CLIPS].filter(c => c.username === viewedCreator.handle).length}</strong><span>clips</span></div><div><strong>{isOwnProfile ? '0' : (DEMO_CREATORS[viewedCreator.handle]?.followers ?? 0) + Number(state.follows.includes(viewedCreator.handle))}</strong><span>{isOwnProfile ? 'local followers' : 'preview followers'}</span></div><div><strong>{isOwnProfile ? state.follows.length : `${DEMO_CREATORS[viewedCreator.handle]?.following ?? 0}`}</strong><span>{isOwnProfile ? 'following' : 'preview following'}</span></div></div><div className="local-note"><span className="online-dot"/>{isOwnProfile ? 'Profile and activity are stored on this device' : 'Preview creator · counts are illustrative, not server-backed'}</div></section>}

        {(view === 'home' || view === 'explore') && <div className={`feed-scroll ${view === 'explore' ? 'explore-grid' : ''}`} ref={feedRef}>
          {displayedClips.length === 0
             ? <div className="empty-state"><div className="empty-symbol"><Film size={28}/></div><h2>{view === 'home' ? 'Your feed is ready for a moment.' : 'Nothing in this mood yet.'}</h2><p>{view === 'home' ? 'Add a video from your phone to start your local feed.' : 'Try another search, or add a video to your local feed.'}</p>{view === 'home' && <button className="primary-button" onClick={startCreate}><Plus size={17}/> Add your first clip</button>}</div>
             : displayedClips.map((clip, index) => <article id={`clip-${clip.id}`} key={clip.id} className={`feed-item ${view === 'explore' ? 'explore-card' : ''}`} data-testid={`card-clip-${clip.id}`}>
              <div className={`clip-art art-${clip.palette} shape-${clip.shape}`} onClick={() => clipUrls[clip.id] ? setIsPlaying(p => ({ ...p, [clip.id]: !p[clip.id] })) : undefined}>
                {clipUrls[clip.id] ? <video ref={el => { videoRefs.current[clip.id] = el; }} src={clipUrls[clip.id]} playsInline loop controls={false} autoPlay={isPlaying[clip.id] ?? false} onClick={e => { e.stopPropagation(); const video = e.currentTarget; if (video.paused) void video.play(); else video.pause(); setIsPlaying(p => ({ ...p, [clip.id]: !p[clip.id] })); }} /> :
                  <div className="art-graphic" aria-hidden="true"><div className="art-halo"/><div className="art-object"/><div className="art-grid"/><span className="art-number">0{index + 1}</span><span className="art-word">{clip.palette === 'violet' ? 'FREQUENCY' : clip.palette === 'lime' ? 'SOFT FOCUS' : 'FEEL MORE'}</span></div>}
                 {!clipUrls[clip.id] && <button className="demo-play" onClick={e => { e.stopPropagation(); setIsPlaying(p => ({ ...p, [clip.id]: !p[clip.id] })); }} aria-label={isPlaying[clip.id] ? 'Pause preview' : 'Play preview'}>{isPlaying[clip.id] ? <Pause size={22} fill="currentColor"/> : <Play size={22} fill="currentColor"/>}</button>}
                <div className="clip-shade"/>
                  <div className="creator-byline"><button className="creator-identity" onClick={e => { e.stopPropagation(); openCreator(clip.username); }} aria-label={`Open ${clip.creator}'s profile`}>{view === 'explore' && <Avatar profile={creatorForClip(clip)} size="small"/>}<span><strong>{clip.creator}</strong><small>@{clip.username}{!clip.blobKey && <i>PREVIEW</i>}</small></span></button>{view === 'explore' && !creatorIsOwn(clip) && <button className={`follow-button ${state.follows.includes(clip.username) ? 'following' : ''}`} onClick={() => toggleFollow(clip.username)}>{state.follows.includes(clip.username) ? <Check size={13}/> : <Plus size={13}/>}<span>{state.follows.includes(clip.username) ? 'Following' : 'Follow'}</span></button>}</div>
                 <div className="clip-meta"><div className="clip-kicker"><span className="local-chip">{clip.blobKey ? 'YOUR CLIP · LOCAL' : 'STUDIO PREVIEW'}</span></div><h2>{clip.title}</h2><p>{clip.caption}</p>{clip.blobKey && <span className="local-disclaimer">Saved only on this device</span>}</div>
                <div className="clip-actions">
                  {view === 'home' && <div className="action-creator">
                    <button className="action-creator-profile" onClick={e => { e.stopPropagation(); openCreator(clip.username); }} aria-label={`Open ${clip.creator}'s profile`}><Avatar profile={creatorForClip(clip)} size="small"/></button>
                    {!creatorIsOwn(clip) && <button className={`action-follow-badge ${state.follows.includes(clip.username) ? 'following' : ''}`} aria-label={state.follows.includes(clip.username) ? `Unfollow @${clip.username}` : `Follow @${clip.username}`} aria-pressed={state.follows.includes(clip.username)} onClick={e => { e.stopPropagation(); toggleFollow(clip.username); }}>{state.follows.includes(clip.username) ? <Check size={12}/> : <Plus size={12}/>}</button>}
                  </div>}
                  <IconButton label={state.liked.includes(clip.id) ? 'Unlike clip' : 'Like clip'} active={state.liked.includes(clip.id)} onClick={() => toggleItem('liked', clip.id)}><Heart size={23} fill={state.liked.includes(clip.id) ? 'currentColor' : 'none'}/></IconButton>
                  <span className="action-count">{state.liked.includes(clip.id) ? 'Liked' : 'Like'}</span>
                  <IconButton label="Comments" onClick={() => { setActiveClip(clip.id); setModal('comments'); }}><MessageCircle size={22}/></IconButton>
                  <span className="action-count">{state.comments[clip.id]?.length ?? 0}</span>
                  <IconButton label={state.saved.includes(clip.id) ? 'Unsave clip' : 'Save clip'} active={state.saved.includes(clip.id)} onClick={() => toggleItem('saved', clip.id)}><Bookmark size={22} fill={state.saved.includes(clip.id) ? 'currentColor' : 'none'}/></IconButton>
                  <IconButton label="Share clip" onClick={() => void shareClip(clip)}><Share2 size={21}/></IconButton>
                </div>
              </div>
            </article>)}
        </div>}
         {view === 'profile' && <div className="profile-collection">
            {isOwnProfile && <div className="collection-tabs"><button className={profileTab === 'clips' ? 'chosen' : ''} onClick={() => setProfileTab('clips')}>Your clips <span>{state.clips.length}</span></button><button className={profileTab === 'liked' ? 'chosen' : ''} onClick={() => setProfileTab('liked')}>Liked <span>{state.liked.length}</span></button><button className={profileTab === 'saved' ? 'chosen' : ''} onClick={() => setProfileTab('saved')}>Saved <span>{state.saved.length}</span></button></div>}
          {(() => {
             const selectedIds = profileTab === 'liked' ? state.liked : state.saved;
             const collection = !isOwnProfile ? [...allClips, ...DEMO_CLIPS].filter(clip => clip.username === viewedCreator.handle) : profileTab === 'clips' ? profileClips : [...allClips, ...DEMO_CLIPS].filter(clip => selectedIds.includes(clip.id));
             return (
               <div className="collection-grid">
                 {collection.length > 0 ? collection.map(clip => (
                    <button className="collection-item" key={clip.id} onClick={() => openClip(clip)}>
                     <div className={`mini-art art-${clip.palette}`}>
                       <span>{clip.title.slice(0, 1).toUpperCase()}</span>
                        {clipUrls[clip.id] && <video src={clipUrls[clip.id]} muted playsInline />}
                     </div>
                     <span>{clip.title}</span>
                   </button>
                 )) : (
                    <div className="profile-empty">
                     <Film size={22} />
                      <span>{!isOwnProfile ? 'This creator has no preview clips yet.' : profileTab === 'clips' ? 'Your uploaded clips will live here.' : profileTab === 'liked' ? 'Clips you like will show up here.' : 'Saved moments will be waiting here.'}</span>
                      {isOwnProfile && profileTab === 'clips' && <button onClick={startCreate}>Add a clip</button>}
                   </div>
                  )}
               </div>
             );
          })()}
        </div>}
      </main>

      <aside className="right-rail">
        <div className="rail-card mood-card"><div className="eyebrow">A NOTE FOR TODAY</div><p>“The little things are not little.”</p><span>MAKE SOMETHING OF IT</span><div className="mood-orbit"/></div>
        <div className="rail-card quick-card"><div className="eyebrow">YOUR SPACE</div><p>Keep your favorite moments close. Your videos and activity stay right here on this device.</p><button onClick={() => navTo('profile')}>Open profile <ArrowUpRight size={15}/></button></div>
        <div className="rail-footer">VIBRA PREVIEW <span>·</span> LOCAL ONLY</div>
      </aside>

      <nav className="mobile-nav" aria-label="Main navigation">
        {navItems.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => navTo(key)} className={view === key ? 'current' : ''} aria-label={label} aria-current={view === key ? 'page' : undefined}><Icon size={20}/><span>{label}</span></button>)}
        <button className="mobile-create" onClick={startCreate} aria-label="Upload a clip"><span className="mobile-create-icon"><Plus size={20}/></span><span>Upload</span></button>
      </nav>

      {composerOpen && <div className="modal-scrim" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setComposerOpen(false); }}><section className="dialog composer-dialog" role="dialog" aria-modal="true" aria-labelledby="create-title">
        <div className="dialog-head"><div><span className="eyebrow">MAKE IT YOURS</span><h2 id="create-title">Add a moment</h2></div><IconButton label="Close create panel" onClick={() => setComposerOpen(false)}><X size={20}/></IconButton></div>
        <p className="dialog-copy">Choose a video from your gallery or capture a new clip. It will be saved on this device, not uploaded.</p>
        <label className="field-label" htmlFor="clip-title">Give it a title <span>OPTIONAL</span></label><input id="clip-title" className="text-field" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="A name for this moment" maxLength={60}/>
        <div className="create-options"><button className="create-option" disabled={isImporting} onClick={() => galleryRef.current?.click()}><span className="option-icon"><ImagePlus size={21}/></span><strong>Choose from gallery</strong><small>Import a video saved on your phone</small></button><button className="create-option" disabled={isImporting} onClick={() => cameraRef.current?.click()}><span className="option-icon camera-option"><Camera size={21}/></span><strong>Capture a clip</strong><small>Open your device camera if supported</small></button></div>
        {isImporting && <div className="import-status"><span className="loading-bar"/>Saving video to this device…</div>}
        <p className="privacy-foot"><Bookmark size={14}/> Video files use browser storage, not your local settings space.</p>
      </section></div>}
      <input ref={galleryRef} className="visually-hidden" type="file" accept="video/*" multiple={false} aria-label="Choose a video from your gallery" onChange={e => void importVideo(e.target.files?.[0])}/>
      <input ref={cameraRef} className="visually-hidden" type="file" accept="video/*" capture="environment" aria-label="Capture a video with your camera" onChange={e => void importVideo(e.target.files?.[0])}/>

      {modal === 'comments' && activeClipData && <div className="modal-scrim" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><section className="dialog comments-dialog" role="dialog" aria-modal="true" aria-labelledby="comments-title"><div className="dialog-head"><div><span className="eyebrow">LOCAL ACTIVITY</span><h2 id="comments-title">Comments</h2></div><IconButton label="Close comments" onClick={() => setModal(null)}><X size={20}/></IconButton></div><p className="dialog-copy">Comments are saved only on this device. They are not sent to anyone.</p><div className="comment-list">{(state.comments[activeClipData.id] ?? []).length ? (state.comments[activeClipData.id] ?? []).map(comment => <div className="comment-row" key={comment.id}><div className="comment-avatar">{state.profile.name.slice(0, 1).toUpperCase()}</div><div><strong>{state.profile.name}</strong><p>{comment.text}</p></div></div>) : <div className="comment-empty"><MessageCircle size={24}/><span>No comments here yet.</span><small>Leave a note for yourself.</small></div>}</div><form className="comment-form" onSubmit={e => { e.preventDefault(); addComment(); }}><input value={commentText} onChange={e => setCommentText(e.target.value)} maxLength={240} placeholder="Add a local comment" aria-label="Add a local comment"/><button disabled={!commentText.trim()} aria-label="Post local comment"><Send size={18}/></button></form></section></div>}

      {modal === 'profile' && <div className="modal-scrim" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><section className="dialog profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div className="dialog-head"><div><span className="eyebrow">YOUR CORNER</span><h2 id="profile-title">Edit profile</h2></div><IconButton label="Close profile editor" onClick={() => setModal(null)}><X size={20}/></IconButton></div><form onSubmit={saveProfile}><div className="photo-edit-row"><Avatar profile={profileForm} size="large"/><div><strong>Profile photo</strong><small>Saved on this device, resized for your profile.</small><button type="button" className="outline-button" onClick={() => profilePhotoRef?.click()}><CameraIcon size={15}/>{profilePhotoBusy ? 'Preparing photo…' : 'Choose photo'}</button>{profileForm.photo && <button type="button" className="remove-photo" onClick={() => setProfileForm(p => ({ ...p, photo: undefined }))}>Remove photo</button>}</div></div><input ref={setProfilePhotoRef} className="visually-hidden" type="file" accept="image/*" aria-label="Choose profile photo" onChange={e => void selectProfilePhoto(e.target.files?.[0])}/><label className="field-label" htmlFor="profile-name">Display name</label><input id="profile-name" className="text-field" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} maxLength={40} required/><label className="field-label" htmlFor="profile-handle">Username / handle</label><div className="handle-input"><span>@</span><input id="profile-handle" value={profileForm.handle} onChange={e => setProfileForm(p => ({ ...p, handle: e.target.value }))} maxLength={24}/></div><label className="field-label" htmlFor="profile-bio">A line about you</label><textarea id="profile-bio" className="text-field bio-field" value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} maxLength={140}/><div className="dialog-actions"><button type="button" className="outline-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button" type="submit"><Check size={17}/> Save changes</button></div></form></section></div>}

      {notice && <div className="toast-message" role="status"><span className="toast-dot"/>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15}/></button></div>}
    </div>
  );
}
