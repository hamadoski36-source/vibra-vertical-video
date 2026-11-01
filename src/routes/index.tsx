import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { VibraSheet } from '@/components/vibra-sheet'
import { VibraRewards } from '@/components/vibra-rewards'
import { VideoProgress } from '@/components/video-progress'
import { startActiveVideo, silenceVideo, watchPlaybackLifecycle } from '@/lib/vibra-playback'
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Vibra Worldwide — Video feed' },
    { name: 'description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:title', content: 'Vibra Worldwide — Video feed' },
    { property: 'og:description', content: 'Watch and share short videos with Vibra Worldwide.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: VibraTikTok,
})

type Clip = { id?: number; url: string; caption: string; thumb: string; lyrics?: string; blob?: Blob }

function VibraTikTok(){
  const hydrated=useHydrated()
  const videoRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('foryou')
  const [view,setView]=useState('home')
  const [search,setSearch]=useState('')
  const [soundEnabled,setSoundEnabled]=useState(false)
  const [suspended,setSuspended]=useState(false)
  const [panel,setPanel]=useState('')
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState<Record<string,string[]>>({})
  const [saved,setSaved]=useState(false)
  const [notice,setNotice]=useState('')
  const videos=useRef<Record<string,HTMLVideoElement|null>>({})
  const uploadRef=useRef<HTMLInputElement>(null)
  const [dp,setDp]=useState('')
  const [bio,setBio]=useState('Mombasa Vibes 🌴 | Kamata 🔥')
  const [name,setName]=useState('@MrVibra')
  const [myVideos,setMyVideos]=useState<Clip[]>([])
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(246)
  const [showEdit,setShowEdit]=useState(false)
  const followers=0
  const following=0
  const sy=useRef(0)

  useEffect(()=>{
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

  const defaultVid:Clip={url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata - Mombasa 🔥', thumb:''}
  const baseFeed=myVideos.length>0?myVideos:[defaultVid]
  const feed=search ? baseFeed.filter(v=>v.caption.toLowerCase().includes(search.toLowerCase())) : baseFeed
  const current=feed.length>0?feed[idx%feed.length]:undefined
  const clipKey=String(current?.id ?? current?.url ?? 'empty')
  const playback=useRef({ view, source: current?.url, soundEnabled, suspended, panel, showEdit })
  playback.current={view,source:current?.url,soundEnabled,suspended,panel,showEdit}

  useEffect(()=>watchPlaybackLifecycle(()=>setSuspended(true),()=>setSuspended(false)),[])
  useEffect(()=>{
    const video=videoRef.current
    if(!video) return
    videos.current['active']=video
    const active=()=>videoRef.current===video && playback.current.view==='home' && playback.current.source===current?.url && !playback.current.suspended && !playback.current.panel && !playback.current.showEdit && !document.hidden
    if(active()) void startActiveVideo(video,soundEnabled,active)
    else silenceVideo(video)
    return ()=>silenceVideo(video)
  },[current?.url,view,soundEnabled,suspended,panel,showEdit])
  useEffect(()=>{ if(!notice) return; const timer=setTimeout(()=>setNotice(''),3500); return ()=>clearTimeout(timer) },[notice])

  async function uploadVideo(file:File|undefined){
    if(!file) return
    if(!file.type.startsWith('video/')) { setNotice('Choose a video file.'); return }
    try {
      const clip:Clip={id:Date.now(),url:'',caption:file.name,thumb:'',blob:file}
      await new Promise<void>((resolve,reject)=>{
        const request=indexedDB.open('vibra_db',1)
        request.onupgradeneeded=()=>request.result.createObjectStore('videos',{keyPath:'id'})
        request.onerror=()=>reject(request.error)
        request.onsuccess=()=>{const db=request.result;const tx=db.transaction('videos','readwrite');tx.objectStore('videos').put(clip);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}}
      })
      clip.url=URL.createObjectURL(file)
      setMyVideos(list=>[clip,...list]);setSearch('');setIdx(0);setView('home');setNotice('Video saved on this device. Cloud upload is not connected.')
    } catch { setNotice('Could not save this video. Please try again.') }
  }
  async function shareVideo(){
    try { if(navigator.share) await navigator.share({title:'Vibra Worldwide',text:current?.caption||'Vibra Worldwide',url:window.location.href});else {await navigator.clipboard.writeText(window.location.href);setNotice('Link copied.')} }
    catch { setNotice('Sharing was cancelled or unavailable.') }
  }
  const uploadInput=<input ref={uploadRef} type="file" accept="video/*" aria-label="Upload file" hidden onChange={e=>{void uploadVideo(e.target.files?.[0]);e.target.value=''}} />

  const saveProfile=()=>{
    localStorage.setItem('vibra_dp', dp); localStorage.setItem('vibra_bio', bio); localStorage.setItem('vibra_name', name); setShowEdit(false)
  }

  if(view==='me'){
    return(
      <div className="vibra-app bg-video text-video-text">{uploadInput}
        <div style={{padding:10, borderBottom:'1px solid #222', position:'sticky', top:0, background:'black', zIndex:5}}>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input value={search} onChange={e=> setSearch(e.target.value)} placeholder='🔍 Search' style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:20, padding:'8px 14px', color:'white'}}/>
            <span className="text-sm text-video-text">Rewards unavailable</span>
          </div>
          <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:12, fontWeight:'900'}}>
            <span style={{opacity: tab==='following'?1:0.5, borderBottom: tab==='following'?'2px solid white':'none'}}>Following</span>
            <span style={{opacity: tab==='foryou'?1:0.5, borderBottom: tab==='foryou'?'2px solid white':'none'}}>For You</span>
          </div>
        </div>
        <div style={{padding:16, textAlign:'center'}}>
          <div onClick={()=> setShowEdit(true)} style={{width:96,height:96,borderRadius:48,margin:'0 auto',background:'#333', backgroundImage:`url(${dp})`, backgroundSize:'cover', border:'2px solid #ff0'}}></div>
          <div style={{marginTop:10, fontWeight:'900', fontSize:18}}>{name}</div>
          <div style={{marginTop:4, fontSize:13, color:'#aaa'}}>{bio}</div>

          <button onClick={()=> setShowEdit(true)} style={{marginTop:10, background:'#222', color:'white', border:'1px solid #444', borderRadius:20, padding:'6px 16px'}}>Edit Profile</button>
          <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:16}}>
            <div><b>{following}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Following</span></div>
            <div><b>{followers}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Followers</span></div>
            <div><b>{liked ? 1 : 0}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Likes</span></div>
          </div>
          <div className="mt-4"><Button onClick={()=>uploadRef.current?.click()}>＋ Upload a video</Button></div>

        </div>
        <div style={{padding:12}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4}}>
            {myVideos.map((v:any,i:number)=><div key={v.id} onClick={()=>{setView('home'); setIdx(i)}} style={{aspectRatio:'3/4', background:'#111', borderRadius:8, overflow:'hidden'}}><img src={v.thumb} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}
          </div>
        </div>
        {showEdit&&<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20}}><div style={{background:'#1a1a1a', padding:20, borderRadius:16, width:'90%'}}>
          <h3>Edit Profile</h3>
          <input value={name} onChange={e=> setName(e.target.value)} placeholder='@username' style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <input value={bio} onChange={e=> setBio(e.target.value)} placeholder='Bio' style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <input placeholder='DP image URL' value={dp} onChange={e=> setDp(e.target.value)} style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <div style={{display:'flex', gap:10, marginTop:12}}><button onClick={()=> setShowEdit(false)} style={{flex:1, padding:10, borderRadius:8, background:'#333', color:'white', border:0}}>Cancel</button><button onClick={saveProfile} style={{flex:1, padding:10, borderRadius:8, background:'#ff0', color:'black', fontWeight:'900', border:0}}>Save</button></div>
        </div></div>}
        <div style={{position:'fixed', bottom:0, left:0, right:0, height:60, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', borderTop:'1px solid #222'}}><div onClick={()=> setView('home')}>🏠 Home</div><div>🔍</div><div style={{width:36,height:24,background:'white',borderRadius:6}}></div><div>💬</div><div style={{fontWeight:'900', borderBottom:'2px solid white'}}>👤 You</div></div>
      </div>
    )
  }

  return(
    <div data-ready={hydrated} className="vibra-app bg-video text-video-text fixed inset-0 overflow-hidden" onTouchStart={e=> {const touch=e.touches[0];if(touch) sy.current=touch.clientY}} onTouchEnd={e=>{ const touch=e.changedTouches[0];if(!touch || !feed.length) return;const dy=sy.current - touch.clientY; if(Math.abs(dy)>50){ if(dy>0) setIdx(i=> (i+1)%feed.length); else setIdx(i=> (i-1+feed.length)%feed.length) } }}>
      {uploadInput}
      <div style={{position:'absolute', top:0, left:0, right:0, zIndex:10, padding:'8px 12px', background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input value={search} onChange={e=> setSearch(e.target.value)} placeholder='🔍 Search' style={{flex:1, background:'rgba(255,255,255,0.15)', border:'none', borderRadius:20, padding:'6px 12px', color:'white', fontSize:13}}/>
          <Button className="action-button" aria-label="Upload a video" onClick={()=>uploadRef.current?.click()}>＋</Button>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:8, fontWeight:'900', color:'white', fontSize:15}}>
          <span onClick={()=> setTab('following')} style={{opacity: tab==='following'?1:0.6, borderBottom: tab==='following'?'2px solid white':'none'}}>Following</span>
          <span onClick={()=> setTab('foryou')} style={{opacity: tab==='foryou'?1:0.6, borderBottom: tab==='foryou'?'2px solid white':'none'}}>For You</span>
        </div>
      </div>

      {current ? <video ref={videoRef} className="feed-video absolute inset-0" src={current.url} loop muted playsInline onPlay={e=>{if(playback.current.view!=='home'||playback.current.panel||playback.current.suspended) silenceVideo(e.currentTarget)}} onClick={()=>{const video=videoRef.current;if(!video) return;if(video.paused) void startActiveVideo(video,soundEnabled,()=>!playback.current.suspended&&!playback.current.panel);else video.pause()}} /> : <p className="empty-feed">No videos found.</p>}
      <div className="absolute right-3 top-24 z-[60]"><Button className="action-button px-3" aria-label={soundEnabled?'Sound on':'Bonyeza kuwasha sauti'} aria-pressed={soundEnabled} onClick={()=>setSoundEnabled(value=>!value)}>{soundEnabled?'🔊 Sound on':'🔇 Bonyeza kuwasha sauti'}</Button></div>
      <div className="feed-caption absolute left-3 right-20"><h1 className="font-bold">VIBRA WORLDWIDE</h1><p>{current?.caption}</p><p>#vibra #worldwide</p></div>
      {current && <VideoProgress clipId="active" source={current.url} videos={videos} />}
      <div className="action-stack right-3 bottom-32 flex flex-col gap-2">
        <Button className="action-button" aria-label="Open profile" onClick={()=>setView('me')}>👤</Button>
        <Button className="action-button" aria-label="Like video" aria-pressed={liked} onClick={()=>{setLiked(!liked);setLikes(value=>liked?value-1:value+1)}}>❤️<span>{likes}</span></Button>
        <Button className="action-button" aria-label="Comments" onClick={()=>setPanel('Comments')}>💬<span>{comments[clipKey]?.length||0}</span></Button>
        <Button className="action-button" aria-label="Save video" aria-pressed={saved} onClick={()=>setSaved(value=>!value)}>🔖<span>{saved?'Saved':'Save'}</span></Button>
        <Button className="action-button" aria-label="Share video" onClick={()=>void shareVideo()}>↗️<span>Share</span></Button>
        <Button className="action-button" aria-label="Lyrics" onClick={()=>setPanel('Lyrics')}>♫<span>Lyrics</span></Button>
        <VibraRewards onOpenChange={open=>setPanel(open?'Rewards':'')} />
      </div>
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex items-center justify-around">
        <Button variant="ghost" onClick={()=>setView('home')}>🏠 Home</Button>
        <Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>＋</Button>
        <Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button>
      </nav>
      <VibraSheet title={panel} open={panel==='Comments'||panel==='Lyrics'} onClose={()=>setPanel('')}>
        {panel==='Lyrics'?<p className="lyrics-copy">{current?.lyrics?.trim()||'Lyrics are not available for this video yet.'}</p>:<div className="space-y-3">
          {(comments[clipKey]||[]).map((text,i)=><p key={i}>{text}</p>)}
          <form onSubmit={e=>{e.preventDefault();if(!comment.trim())return;setComments(values=>({...values,[clipKey]:[...(values[clipKey]||[]),comment.trim()]}));setComment('')}} className="flex gap-2"><input aria-label="Add comment" value={comment} onChange={e=>setComment(e.target.value)} /><Button type="submit">Post</Button></form>
        </div>}
      </VibraSheet>
      {notice&&<p className="vibra-notice" role="status">{notice}</p>}
    </div>
  )
}
