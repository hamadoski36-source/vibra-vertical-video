import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { readCloudVideos, uploadCloudVideo, type CloudVideo } from '@/lib/vibra-cloud'
import { demoCoinBalance } from '@/lib/vibra-rewards'
import { Button } from '@/components/ui/button'
import { VibraSheet } from '@/components/vibra-sheet'
import { VibraRewards } from '@/components/vibra-rewards'
import { VideoProgress } from '@/components/video-progress'
import { startActiveVideo, silenceVideo, watchPlaybackLifecycle } from '@/lib/vibra-playback'
import { VibraShare } from '@/components/vibra-share'
import { clipShare, type ClipShare } from '@/lib/vibra-sharing'
import { VibraBanner } from '@/components/vibra-banner'
import { useAuth } from '@/hooks/use-auth'
import { readCreatorAvatar } from '@/lib/vibra-profile'
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Vibra Worldwide — Video feed' },
    { name: 'description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:title', content: 'Vibra Worldwide — Video feed' },
    { property: 'og:description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: VibraTikTok,
})

type Clip = { id?: number | string; url: string; caption: string; thumb: string; lyrics?: string; blob?: Blob; username?: string; cloud?: boolean }

function VibraTikTok(){
  const hydrated=useHydrated()
  const { user }=useAuth()
  const [creatorAvatar,setCreatorAvatar]=useState<string|null>(null)
  const [avatarFailed,setAvatarFailed]=useState(false)
  const [avatarError,setAvatarError]=useState(false)
  const videoRef=useRef<HTMLVideoElement>(null)
  const stageRef=useRef<HTMLDivElement>(null)
  const [stageVisible,setStageVisible]=useState(true)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('foryou')
  const [view,setView]=useState('home')
  const [search,setSearch]=useState('')
  const [soundEnabled,setSoundEnabled]=useState(false)
  const [suspended,setSuspended]=useState(false)
  const [panel,setPanel]=useState('')
  const [selectedShare,setSelectedShare]=useState<ClipShare|null>(null)
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState<Record<string,string[]>>({})
  const [savedIds,setSavedIds]=useState<string[]>([])
  const [likedIds,setLikedIds]=useState<string[]>([])
  const [cloudClips,setCloudClips]=useState<Clip[]>([])
  const [cloudReady,setCloudReady]=useState(false)
  const [cloudError,setCloudError]=useState('Checking cloud configuration…')
  const [uploading,setUploading]=useState(false)
  const [uploadProgress,setUploadProgress]=useState(0)
  const [pendingFile,setPendingFile]=useState<File>()
  const [caption,setCaption]=useState('')
  const [coins,setCoins]=useState(0)
  const [notice,setNotice]=useState('')
  const videos=useRef<Record<string,HTMLVideoElement|null>>({})
  const uploadRef=useRef<HTMLInputElement>(null)
  const searchRef=useRef<HTMLInputElement>(null)
  const [dp,setDp]=useState('')
  const [bio,setBio]=useState('Mombasa Vibes 🌴 | Kamata 🔥')
  const [name,setName]=useState('@MrVibra')
  const [myVideos,setMyVideos]=useState<Clip[]>([])
  const [showEdit,setShowEdit]=useState(false)
  const followers=0
  const following=0
  const sy=useRef(0)

  useEffect(()=>{
    let alive=true
    setCreatorAvatar(null);setAvatarFailed(false);setAvatarError(false)
    if(user?.id) void readCreatorAvatar(user.id).then(url=>{if(alive)setCreatorAvatar(url)}).catch(()=>{if(alive)setAvatarError(true)})
    return()=>{alive=false}
  },[user?.id])
  const profileAvatar=avatarFailed?'':creatorAvatar||dp

  useEffect(()=>{
    setCoins(demoCoinBalance(localStorage.getItem('vibra_coins')))
    setDp(localStorage.getItem('vibra_dp')||''); setBio(localStorage.getItem('vibra_bio')||'Mombasa Vibes 🌴 | Kamata 🔥'); setName(localStorage.getItem('vibra_name')||'@MrVibra')
    const openDB=():Promise<IDBDatabase>=> new Promise((res,rej)=>{
      const r=indexedDB.open('vibra_db',1)
      r.onupgradeneeded=()=> r.result.createObjectStore('videos',{keyPath:'id'})
      r.onsuccess=()=> res(r.result); r.onerror=()=> rej(r.error)
    })
    openDB().then(async db=>{
      const tx=db.transaction('videos','readonly'); const req=tx.objectStore('videos').getAll()
      req.onsuccess=()=>{ const vids=req.result.map((v:Clip)=> ({...v, url: v.blob ? URL.createObjectURL(v.blob) : v.url})); if(vids.length>0) setMyVideos(vids.reverse()) }
    }).catch(()=>{})
  },[])

  const toClip=(row:CloudVideo):Clip=>({id:row.id,url:row.video_url,caption:row.caption,thumb:'',username:row.username,cloud:true})
   useEffect(()=>{let alive=true;readCloudVideos().then(rows=>{if(!alive)return;const clips=rows.map(toClip);setCloudClips(clips);const requested=new URLSearchParams(window.location.search).get('video');const index=clips.findIndex(clip=>String(clip.id)===requested);if(index>=0)setIdx(index);else if(requested)setNotice('This shared video is unavailable.');setCloudReady(true);setCloudError('')}).catch(error=>{if(alive){setCloudReady(false);setCloudError(error instanceof Error?error.message:'Cloud configuration unavailable')}});return()=>{alive=false}},[])

  const defaultVid:Clip={url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata - Mombasa 🔥', thumb:'', lyrics:'Uwepo wako unanikamilisha...'}
  const baseFeed=cloudReady?cloudClips:myVideos.length>0?myVideos:[defaultVid]
  const filteredClips=search ? baseFeed.filter(v=>v.caption.toLowerCase().includes(search.toLowerCase())) : baseFeed
  const feed=filteredClips
  const current=feed.length>0?feed[idx%feed.length]:undefined
  const clipKey=String(current?.id ?? current?.url ?? 'empty')
  const liked=likedIds.includes(clipKey)
  const saved=savedIds.includes(clipKey)
  const likes=246+(liked?1:0)
  function toggleLike(){setLikedIds(values=>liked?values.filter(id=>id!==clipKey):[...values,clipKey])}
  function toggleSave(){setSavedIds(values=>saved?values.filter(id=>id!==clipKey):[...values,clipKey]);setNotice(saved?'Removed from saved videos.':'Saved!')}
  const playback=useRef({ view, source: current?.url, soundEnabled, suspended, panel, showEdit, stageVisible })
  playback.current={view,source:current?.url,soundEnabled,suspended,panel,showEdit,stageVisible}

  useEffect(()=>{
    const stage=stageRef.current
    if(!stage || typeof IntersectionObserver==='undefined')return
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)setStageVisible(entry.isIntersecting&&entry.intersectionRatio>=0.6)},{threshold:0.6})
    observer.observe(stage)
    return()=>observer.disconnect()
  },[view])

  useEffect(()=>watchPlaybackLifecycle(()=>setSuspended(true),()=>setSuspended(false)),[])
  useEffect(()=>{
    const video=videoRef.current
    if(!video) return
    videos.current['active']=video
    const active=()=>videoRef.current===video && playback.current.view==='home' && playback.current.stageVisible && playback.current.source===current?.url && !playback.current.suspended && !playback.current.panel && !playback.current.showEdit && !document.hidden
    if(active()) void startActiveVideo(video,soundEnabled,active)
    else silenceVideo(video)
    return ()=>silenceVideo(video)
  },[current?.url,view,soundEnabled,suspended,panel,showEdit,stageVisible])
  useEffect(()=>{ if(!notice) return; const timer=setTimeout(()=>setNotice(''),3500); return ()=>clearTimeout(timer) },[notice])

  async function uploadVideo(file:File|undefined){
    if(!file) return
    if(!file.type.startsWith('video/')) { setNotice('Choose a video file.'); return }
    if(uploading) return
    setUploading(true);setUploadProgress(0)
    try {
      if(cloudReady){const row=await uploadCloudVideo(file,name,caption||file.name,setUploadProgress);const clip=toClip(row);setCloudClips(values=>[clip,...values]);setMyVideos(values=>[clip,...values]);setSearch('');setIdx(0);setView('home');setPanel('');setPendingFile(undefined);setNotice('Uploaded worldwide!');return}
      setUploadProgress(10)
      const clip:Clip={id:Date.now(),url:'',caption:caption||file.name,thumb:'',blob:file}
      await new Promise<void>((resolve,reject)=>{
        const request=indexedDB.open('vibra_db',1)
        request.onupgradeneeded=()=>request.result.createObjectStore('videos',{keyPath:'id'})
        request.onerror=()=>reject(request.error)
        request.onsuccess=()=>{const db=request.result;const tx=db.transaction('videos','readwrite');tx.objectStore('videos').put(clip);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}}
      })
      clip.url=URL.createObjectURL(file)
      setMyVideos(list=>[clip,...list]);setSearch('');setIdx(0);setView('home');setPanel('');setPendingFile(undefined);setUploadProgress(100);setNotice('Upload complete. Cloud Mode: Local (Connect Supabase for worldwide)')
    } catch(error) { setNotice(`Upload failed: ${error instanceof Error?error.message:'Please try again.'}`) } finally {setUploading(false)}
  }
   function shareVideo(){if(!current)return;setSelectedShare(clipShare(window.location.origin,current));setPanel('Share')}
   const sharePanel=<VibraShare share={selectedShare} onClose={()=>{setSelectedShare(null);setPanel('')}} onNotice={setNotice}/>
  const uploadInput=<input ref={uploadRef} type="file" accept="video/*" aria-label="Upload file" hidden onChange={e=>{const file=e.target.files?.[0];if(file){setPendingFile(file);setCaption(file.name);setPanel('Upload')}e.target.value=''}} />

  const saveProfile=()=>{
    localStorage.setItem('vibra_dp', dp); localStorage.setItem('vibra_bio', bio); localStorage.setItem('vibra_name', name); setShowEdit(false)
  }

  const uploadPanel=<VibraSheet title="Upload" open={panel==='Upload'} onClose={()=>{if(!uploading)setPanel('')}}><form className="space-y-4" onSubmit={e=>{e.preventDefault();void uploadVideo(pendingFile)}}><p>{pendingFile?.name}</p><label>Caption<input aria-label="Caption" value={caption} onChange={e=>setCaption(e.target.value)} /></label><p className="text-sm text-panel-muted">{cloudReady?'Cloud Mode: Worldwide':'Cloud Mode: Local (Connect Supabase for worldwide)'}</p>{!cloudReady&&<p className="text-sm text-panel-muted">Cloud setup: {cloudError}</p>}{uploading&&<div><progress className="w-full" aria-label="Upload progress" value={uploadProgress} max={100}/><p>{uploadProgress}% · Upload steps</p></div>}<Button type="submit" disabled={uploading||!pendingFile} className="sheet-command w-full">{uploading?'Uploading…':'Post'}</Button></form></VibraSheet>
  const profileVideos=cloudReady?[...myVideos.filter(v=>!v.cloud),...cloudClips.filter(v=>v.username===name)]:myVideos
  function openClip(clip:Clip){const index=baseFeed.findIndex(entry=>entry.url===clip.url);setSearch('');setIdx(index<0?0:index);setView('home')}
  if(view==='me'){
    return <div data-ready={hydrated} className="vibra-app bg-video text-video-text overflow-y-auto profile-scroll">{uploadInput}
      <header className="flex items-center justify-between p-4"><Button variant="ghost" onClick={()=>setView('home')}>← Home</Button><span>{coins} Demo Coins</span></header>
      <section className="px-4 text-center space-y-3">
        <Button variant="ghost" className="profile-avatar bg-video-glass" aria-label="Edit profile photo" onClick={()=>setShowEdit(true)}>{profileAvatar?<img src={profileAvatar} alt="Profile logo" onError={()=>setAvatarFailed(true)}/>:<span>V</span>}</Button>
        {avatarError&&<p className="text-sm" role="status">Logo yako haijapakiwa. Jaribu tena ukiingia kwenye akaunti.</p>}
        <h1 className="font-bold text-xl">{name}</h1><p>{bio}</p>
        <Button variant="ghost" className="bg-video-glass text-video-text border border-panel-muted" onClick={()=>setShowEdit(true)}>Edit Profile</Button>
        <div className="flex justify-center gap-3"><Button variant="ghost" onClick={()=>setPanel('Following')}>{following} Following</Button><Button variant="ghost" onClick={()=>setPanel('Followers')}>{followers} Followers</Button><Button variant="ghost" onClick={()=>setPanel('Likes')}>{likedIds.length} Likes</Button></div>
        <p>{profileVideos.length} Videos</p><Button onClick={()=>uploadRef.current?.click()}>＋ Upload a video</Button>
      </section>
      <section className="p-3 profile-grid">{profileVideos.map(v=><Button key={v.url} className="profile-tile" aria-label={`Play ${v.caption}`} onClick={()=>openClip(v)}><video src={v.url} muted playsInline preload="metadata" onLoadedData={e=>{const video=e.currentTarget;video.currentTime=Math.min(0.1,video.duration||0);}}/><span className="mini-caption">{v.caption}</span></Button>)}</section>
      {!profileVideos.length&&<p className="p-6 text-center">No uploaded videos yet.</p>}
      <VibraBanner placement="profile" />
      <VibraSheet title="Edit Profile" open={showEdit} onClose={()=>setShowEdit(false)}><form className="space-y-3" onSubmit={e=>{e.preventDefault();saveProfile()}}><input aria-label="Username" value={name} onChange={e=>setName(e.target.value)} /><input aria-label="Bio" value={bio} onChange={e=>setBio(e.target.value)} /><input aria-label="Profile photo URL" value={dp} onChange={e=>setDp(e.target.value)} /><Button type="submit" className="sheet-command">Save profile</Button></form></VibraSheet>
      <VibraSheet title={panel} open={['Following','Followers','Likes'].includes(panel)} onClose={()=>setPanel('')}><p>{panel==='Likes'?`${likedIds.length} videos liked in this session.`:`No ${panel.toLowerCase()} recorded. Shared follow accounts are not connected.`}</p></VibraSheet>
       {uploadPanel}{sharePanel}{notice&&<p className="vibra-notice" role="status">{notice}</p>}
      <nav className="bottom-nav fixed bottom-0 inset-x-0 bg-video flex items-center justify-around"><Button variant="ghost" onClick={()=>setView('home')}>🏠 Home</Button><Button variant="ghost" onClick={()=>{setView('home');setTimeout(()=>searchRef.current?.focus(),0)}}>🔍 Search</Button><Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>＋</Button><Button variant="ghost" aria-label="LIVE tab" onClick={()=>setPanel('LIVE')}>📺 LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button></nav>
      <VibraSheet title="LIVE" open={panel==='LIVE'} onClose={()=>setPanel('')}><div className="space-y-3"><p className="font-bold">LIVE streaming is coming soon.</p><p className="text-sm text-panel-muted">Real live video needs a streaming service, which is not connected yet. Nobody is live right now.</p><Button className="sheet-command w-full" onClick={()=>setPanel('')}>OK</Button></div></VibraSheet>
    </div>
  }

  return(
     <div data-ready={hydrated} className="vibra-app home-bottom-scroll bg-video text-video-text fixed inset-0">
      <div ref={stageRef} className={`home-video-stage ${idx<feed.length-1?'touch-pan-x':'touch-pan-y'}`} onTouchStart={e=> {const touch=e.touches[0];if(touch) sy.current=touch.clientY}} onTouchEnd={e=>{ const touch=e.changedTouches[0];if(panel || !touch || !feed.length) return;const dy=sy.current - touch.clientY; if(Math.abs(dy)>50){ if(dy>0) setIdx(i=> Math.min(i+1,feed.length-1)); else setIdx(i=> Math.max(i-1,0)) } }}>
      {uploadInput}
      {uploadPanel}
       {sharePanel}
      <div style={{position:'absolute', top:0, left:0, right:0, zIndex:10, padding:'8px 12px', background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input ref={searchRef} aria-label="Search videos" value={search} onChange={e=> setSearch(e.target.value)} placeholder='🔍 Search' style={{flex:1, background:'rgba(255,255,255,0.15)', border:'none', borderRadius:20, padding:'6px 12px', color:'white', fontSize:13}}/>
          <span className="text-xs whitespace-nowrap">{coins} Coins</span><Button className="action-button live-pill" aria-label="Open LIVE" onClick={()=>setPanel('LIVE')}>🔴 LIVE</Button><Button className="action-button" aria-label="Upload a video" onClick={()=>uploadRef.current?.click()}>＋</Button>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:8, fontWeight:'900', color:'white', fontSize:15}}>
          <Button variant="ghost" onClick={()=>{setTab('following');setNotice('Shared following accounts are not connected yet.')}} style={{opacity: tab==='following'?1:0.6, borderBottom: tab==='following'?'2px solid white':'none'}}>Following</Button>
          <Button variant="ghost" onClick={()=> setTab('foryou')} style={{opacity: tab==='foryou'?1:0.6, borderBottom: tab==='foryou'?'2px solid white':'none'}}>For You</Button>
        </div>
      </div>

      {current ? <video ref={videoRef} className="feed-video absolute inset-0" src={current.url} loop muted playsInline onPlay={e=>{if(playback.current.view!=='home'||playback.current.panel||playback.current.suspended) silenceVideo(e.currentTarget)}} onClick={()=>{const video=videoRef.current;if(!video) return;if(video.paused) void startActiveVideo(video,soundEnabled,()=>!playback.current.suspended&&!playback.current.panel);else video.pause()}} /> : <p className="empty-feed">No videos found.</p>}
      <>
      <div className="absolute right-3 top-24 z-[60]"><Button className="action-button px-3" aria-label={soundEnabled?'Sound on':'Bonyeza kuwasha sauti'} aria-pressed={soundEnabled} onClick={()=>setSoundEnabled(value=>!value)}>{soundEnabled?'🔊 Sound on':'🔇 Bonyeza kuwasha sauti'}</Button></div>
      <div className="feed-caption absolute left-3 right-20"><p className="text-xs">{cloudReady?'Worldwide':'Cloud Mode: Local'}</p><h1 className="font-bold">VIBRA WORLDWIDE</h1><p>{current?.caption}</p><p>#vibra #worldwide</p></div>
      {current && <VideoProgress clipId="active" source={current.url} videos={videos} />}
      <div className="action-stack right-3 bottom-32 flex flex-col gap-2">
        <Button className="action-button" aria-label="Open profile" onClick={()=>setView('me')}>👤</Button>
        <Button className={`action-button ${liked?'is-active':''}`} aria-label="Like video" aria-pressed={liked} onClick={toggleLike}>❤️<span>{likes}</span></Button>
        <Button className="action-button" aria-label="Comments" onClick={()=>setPanel('Comments')}>💬<span>{comments[clipKey]?.length||0}</span></Button>
        <Button className="action-button" aria-label="Save video" aria-pressed={saved} onClick={toggleSave}>🔖<span>{saved?'Saved':'Save'}</span></Button>
        <Button className="action-button" aria-label="Share video" onClick={()=>void shareVideo()}>↗️<span>Share</span></Button>
        <Button className="action-button" aria-label="Lyrics" onClick={()=>setPanel('Lyrics')}>♫<span>Lyrics</span></Button>
        <Button className="action-button" aria-label="LIVE" onClick={()=>setPanel('LIVE')}>🔴<span>LIVE</span></Button>
        <VibraRewards onOpenChange={open=>setPanel(open?'Rewards':'')} onBalanceChange={setCoins} onNotice={setNotice} />
      </div>
      </>
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex items-center justify-around">
        <Button variant="ghost" onClick={()=>{setView('home');setSearch('');setIdx(0)}}>🏠 Home</Button>
        <Button variant="ghost" onClick={()=>searchRef.current?.focus()}>🔍 Search</Button>
        <Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>＋</Button>
        <Button variant="ghost" aria-label="LIVE tab" onClick={()=>setPanel('LIVE')}>📺 LIVE</Button>
        <Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button>
      </nav>
      </div>
      <VibraBanner placement="home" />
      <VibraSheet title="LIVE" open={panel==='LIVE'} onClose={()=>setPanel('')}><div className="space-y-3"><p className="font-bold">LIVE streaming is coming soon.</p><p className="text-sm text-panel-muted">Real live video needs a streaming service, which is not connected yet. Nobody is live right now.</p><Button className="sheet-command w-full" onClick={()=>setPanel('')}>OK</Button></div></VibraSheet>
      <VibraSheet title={panel} open={panel==='Comments'||panel==='Lyrics'} onClose={()=>setPanel('')}>
        {panel==='Lyrics'?<p className="lyrics-copy">{current?.lyrics?.trim()||'Lyrics are not available for this video yet.'}</p>:<div className="space-y-3">
          {(comments[clipKey]||[]).map((text,i)=><p key={i}>{text}</p>)}
          <form onSubmit={e=>{e.preventDefault();if(!comment.trim())return;setComments(values=>({...values,[clipKey]:[...(values[clipKey]||[]),comment.trim()]}));setComment('')}} className="flex gap-2"><input placeholder="Add comment..." aria-label="Add comment" value={comment} onChange={e=>setComment(e.target.value)} /><Button type="submit">Post</Button></form>
        </div>}
      </VibraSheet>
      {notice&&<p className="vibra-notice" role="status">{notice}</p>}
    </div>
  )
}
