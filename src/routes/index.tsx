import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { readCloudVideos, uploadCloudVideo, type CloudVideo } from '@/lib/vibra-cloud'
import { demoCoinBalance } from '@/lib/vibra-rewards'
import { Button } from '@/components/ui/button'
import { VibraSheet } from '@/components/vibra-sheet'
import { VibraRewards } from '@/components/vibra-rewards'
import { VibraShare } from '@/components/vibra-share'
import { clipShare, type ClipShare } from '@/lib/vibra-sharing'
import { VibraBanner } from '@/components/vibra-banner'
import { useAuth } from '@/hooks/use-auth'
import { readCreatorAvatar, readLocalPhoto, saveCreatorAvatar } from '@/lib/vibra-profile'
import { VibraLive } from '@/components/vibra-live'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Vibra Worldwide - Video feed' },
    { name: 'description', content: 'Watch and share short videos with Vibra' },
    { property: 'og:title', content: 'Vibra Worldwide - Video feed' },
    { property: 'og:description', content: 'Watch and share short videos with Vibra' },
    { property: 'og:type', content: 'website' },
  ] }), component: VibraTikTok,
})

type Clip = { id?: number | string; url: string; caption: string; thumb?: string; likes?: number }

function VibraTikTok(){
  const hydrated = useHydrated()
  const { user } = useAuth()
  const [creatorAvatar,setCreatorAvatar]=useState<string|null>(null)
  const [avatarFailed,setAvatarFailed]=useState(false)
  const [avatarError,setAvatarError]=useState(false)
  const videoRef=useRef<HTMLVideoElement>(null)
  const stageRef=useRef<HTMLDivElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('foryou')
  const [view,setView]=useState('home')
  const [search,setSearch]=useState('')
  const [soundEnabled,setSoundEnabled]=useState(false)
  const [panel,setPanel]=useState('')
  const [selectedShare,setSelectedShare]=useState<ClipShare|null>(null)
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState<Record<string,string[]>>({})
  const [savedIds,setSavedIds]=useState<string[]>([])
  const [likedIds,setLikedIds]=useState<string[]>([])
  const [followingIds,setFollowingIds]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('vibra_following')||'[]')}catch{return[]}})
  const [cloudClips,setCloudClips]=useState<Clip[]>([])
  const [myVideos,setMyVideos]=useState<Clip[]>([])
  const [cloudReady,setCloudReady]=useState(false)
  const [uploading,setUploading]=useState(false)
  const [caption,setCaption]=useState('')
  const [coins,setCoins]=useState(0)
  const [notice,setNotice]=useState('')
  const [showEdit,setShowEdit]=useState(false)
  const [savingPhoto,setSavingPhoto]=useState(false)
  const [meTab,setMeTab]=useState('videos')
  const photoRef=useRef<HTMLInputElement>(null)
  const [dp,setDp]=useState('')
  const [bio,setBio]=useState('Mombasa Vibes | Kamata')
  const [name,setName]=useState('@MrVibra')
  const uploadRef=useRef<HTMLInputElement>(null)
  const searchRef=useRef<HTMLInputElement>(null)
  const followers = followingIds.length
  const following = followingIds.length

  useEffect(()=>{
    let alive=true
    setCreatorAvatar(null);setAvatarFailed(false);setAvatarError(false)
    if(user?.id){void readCreatorAvatar(user.id).then(url=>{if(alive) setCreatorAvatar(url)})}
    return ()=>{alive=false}
  },[user?.id])
  const profileAvatar=avatarFailed?'':creatorAvatar||dp

  useEffect(()=>{
    setCoins(demoCoinBalance(localStorage.getItem('vibra_coins')))
    setDp(localStorage.getItem('vibra_dp')||'')
    setBio(localStorage.getItem('vibra_bio')||'Mombasa Vibes | Kamata')
    setName(localStorage.getItem('vibra_name')||'@MrVibra')
  },[])

  useEffect(()=>{
    let alive=true
    readCloudVideos().then(rows=>{if(!alive) return; setCloudClips(rows.map((r:CloudVideo)=>({id:r.id,url:r.video_url,caption:r.caption||''}))); setCloudReady(true)}).catch(()=>{})
    return ()=>{alive=false}
  },[])

  const defaultVid:Clip={url:'https://videos.pexels.com/video-files/1806922/1806922-hd_1920_1080_24fps.mp4',caption:'Karibu Vibra!'}
  const baseFeed:Clip[]=cloudReady?cloudClips:myVideos.length>0?myVideos:[defaultVid]
  const filteredClips=search?baseFeed.filter(v=>v.caption.toLowerCase().includes(search.toLowerCase())):baseFeed
  const feed=tab==='following'?filteredClips.filter(v=>followingIds.includes(String(v.id??v.url))):filteredClips
  const current=feed.length>0?feed[idx%feed.length]:undefined
  const clipKey=String(current?.id??current?.url??'empty')
  const liked=likedIds.includes(clipKey)
  const saved=savedIds.includes(clipKey)
  const isFollowing=followingIds.includes(clipKey)
  const likes=246+(liked?1:0)
  const shareText=(current?.caption||'Angalia hii video kwenye Vibra!')+' '+window.location.href
  const shareUrl=encodeURIComponent(window.location.href)
  const shareMsg=encodeURIComponent(shareText)

  function toggleLike(){setLikedIds(v=>v.includes(clipKey)?v.filter(id=>id!==clipKey):[...v,clipKey])}
  function toggleSave(){setSavedIds(v=>v.includes(clipKey)?v.filter(id=>id!==clipKey):[...v,clipKey])}
  function toggleFollow(){
    setFollowingIds(v=>{
      const already=v.includes(clipKey)
      const n=already?v.filter(id=>id!==clipKey):[...v,clipKey]
      localStorage.setItem('vibra_following',JSON.stringify(n))
      setNotice(already?'Ume-unfollow':'Umemfollow! Angalia tab ya Following')
      return n
    })
  }
  function copyLink(){navigator.clipboard?.writeText(window.location.href).then(()=>setNotice('Link imekopiwa! Tuma popote.')).catch(()=>setNotice(window.location.href))}

  useEffect(()=>{
    const video=videoRef.current
    if(video){video.muted=!soundEnabled; video.play().catch(()=>{})}
  },[current,soundEnabled,idx,view])

  async function uploadVideo(file:File|undefined){
    if(!file) return
    if(!file.type.startsWith('video/')){setNotice('Choose a video file.');return}
    if(uploading) return
    setUploading(true)
    try{
      if(cloudReady){void await uploadCloudVideo(file,name,caption)}
      const clip:Clip={id:Date.now(),url:URL.createObjectURL(file),caption:caption||file.name,thumb:''}
      setMyVideos(list=>[clip,...list]);setSearch('');setIdx(0);setView('home')
    }catch(error){setNotice('Upload failed: '+(error instanceof Error?error.message:'Unknown'))}
    finally{setUploading(false)}
  }

  function shareVideo(){if(!current) return; setSelectedShare(clipShare(current)); setPanel('Share')}
  const sharePanel=selectedShare?<VibraShare share={selectedShare} onClose={()=>setSelectedShare(null)} />:null
  const uploadInput=<input ref={uploadRef} type="file" accept="video/*" style={{display:'none'}} onChange={e=>uploadVideo(e.target.files?.[0])} />

  async function choosePhoto(file:File|undefined){
    if(!file) return
    setSavingPhoto(true)
    try{
      if(user?.id){
        const url=await saveCreatorAvatar(user.id,file)
        setCreatorAvatar(url);setAvatarFailed(false);setDp(url);localStorage.setItem('vibra_dp',url)
        setNotice('Picha imehifadhiwa kwenye akaunti yako!')
      }else{
        const dataUrl=await readLocalPhoto(file)
        setDp(dataUrl);localStorage.setItem('vibra_dp',dataUrl)
        setNotice('Picha imehifadhiwa kwenye simu hii.')
      }
    }catch(error){setNotice('Picha haijahifadhiwa: '+(error instanceof Error?error.message:'Unknown'))}
    finally{setSavingPhoto(false)}
  }

  const saveProfile=()=>{localStorage.setItem('vibra_dp',dp);localStorage.setItem('vibra_bio',bio);localStorage.setItem('vibra_name',name);setShowEdit(false);setNotice('Profile imehifadhiwa!')}
  const uploadPanel=<VibraSheet title="Upload" open={panel==='Upload'} onClose={()=>setPanel('')}><input type="file" accept="video/*" onChange={e=>uploadVideo(e.target.files?.[0])} /><input placeholder="Caption..." value={caption} onChange={e=>setCaption(e.target.value)} /><Button onClick={()=>uploadRef.current?.click()}>Chagua Video</Button></VibraSheet>
  const profileVideos=cloudReady?[...myVideos.filter(v=>!v.url.startsWith('blob:')),...cloudClips]:myVideos
  const savedVideos=baseFeed.filter(v=>savedIds.includes(String(v.id??v.url)))

  function openClip(clip:Clip){const index=baseFeed.findIndex(entry=>entry.url===clip.url); if(index>=0){setIdx(index);setView('home')}}

  // ME PAGE MPYA - VIZURI KAMA TIKTOK
  if(view==='me'){
    const listToShow=meTab==='saved'?savedVideos:meTab==='liked'?baseFeed.filter(v=>likedIds.includes(String(v.id??v.url))):profileVideos
    return <div data-ready={hydrated} className="vibra-app bg-video text-video-text" style={{overflowY:'auto'}}>
      <header className="flex items-center justify-between p-4"><Button variant="ghost" onClick={()=>setView('home')}>← Back</Button><span style={{fontWeight:'bold'}}>Vibra</span><Button variant="ghost" onClick={()=>setShowEdit(true)}>Edit</Button></header>
      <section className="px-4 text-center" style={{paddingBottom:16}}>
        <div style={{position:'relative',width:110,height:110,margin:'0 auto'}}>
          <Button variant="ghost" className="profile-avatar bg-video-glass" style={{width:110,height:110,borderRadius:'50%',overflow:'hidden',fontSize:40}} onClick={()=>photoRef.current?.click()}>{profileAvatar?<img src={profileAvatar} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover'}} />:'👤'}</Button>
          <span style={{position:'absolute',bottom:0,right:0,background:'#fff',color:'#000',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center'}}>+</span>
        </div>
        {avatarError&&<p className="text-sm" role="status">Logo yako haijapakiwa.</p>}
        <h1 className="font-bold" style={{fontSize:22,marginTop:10}}>{name}</h1>
        <p style={{opacity:0.8}}>{bio}</p>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:12}}>
          <Button variant="ghost" className="bg-video-glass text-video-text" onClick={()=>setShowEdit(true)}>✏️ Edit Profile</Button>
          <Button variant="ghost" className="bg-video-glass text-video-text" onClick={copyLink}>🔗 Share Profile</Button>
        </div>
        <div className="flex justify-center gap-6" style={{marginTop:16}}>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{following}</p><p style={{opacity:0.7}}>Following</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{followers}</p><p style={{opacity:0.7}}>Followers</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{profileVideos.length}</p><p style={{opacity:0.7}}>Videos</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{coins}</p><p style={{opacity:0.7}}>Coins</p></div>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:16,borderBottom:'1px solid #333',paddingBottom:8}}>
          <Button variant="ghost" onClick={()=>setMeTab('videos')} style={{fontWeight:meTab==='videos'?'bold':'normal',borderBottom:meTab==='videos'?'2px solid #fff':'none'}}>🎬 Videos</Button>
          <Button variant="ghost" onClick={()=>setMeTab('liked')} style={{fontWeight:meTab==='liked'?'bold':'normal',borderBottom:meTab==='liked'?'2px solid #fff':'none'}}>❤️ Liked</Button>
          <Button variant="ghost" onClick={()=>setMeTab('saved')} style={{fontWeight:meTab==='saved'?'bold':'normal',borderBottom:meTab==='saved'?'2px solid #fff':'none'}}>🔖 Saved</Button>
        </div>
      </section>
      <section className="p-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,paddingBottom:100}}>
        {listToShow.map(v=>(
          <button key={v.url} onClick={()=>openClip(v)} style={{position:'relative',aspectRatio:'9/16',overflow:'hidden',borderRadius:10,background:'#222',border:'none',padding:0}}>
            <video src={v.url} muted playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} />
            <span style={{position:'absolute',left:6,bottom:6,right:6,color:'#fff',fontSize:11,textAlign:'left',textShadow:'0 1px 4px #000',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{v.caption||'Video'}</span>
            <span style={{position:'absolute',top:6,right:6,fontSize:12}}>▶️</span>
          </button>
        ))}
      </section>
      {listToShow.length===0&&<p className="p-6 text-center" style={{paddingBottom:100}}>{meTab==='videos'?'Hakuna video bado. Bonyeza + kupakia.':meTab==='liked'?'Hujalike video bado.':'Hujasave video bado.'}</p>}
      <VibraBanner placement="profile" />
      <VibraSheet title="Edit Profile" open={showEdit} onClose={()=>setShowEdit(false)}>
        <input ref={photoRef} type="file" accept="image/*" aria-label="Choose profile photo" onChange={e=>choosePhoto(e.target.files?.[0])} />
        <Button type="button" className="sheet-command w-full" disabled={savingPhoto} onClick={()=>photoRef.current?.click()}>{savingPhoto?'Inapakia...':'📸 Badilisha Picha'}</Button>
        <input aria-label="Username" value={name} onChange={e=>setName(e.target.value)} placeholder="@Jina lako" />
        <input aria-label="Bio" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio yako..." />
        <Button onClick={saveProfile}>Save Profile</Button>
      </VibraSheet>
      {uploadPanel}{notice&&<p className="vibra-notice">{notice}</p>}
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3"><Button variant="ghost" onClick={()=>setView('home')}>Home</Button><Button variant="ghost" onClick={()=>searchRef.current?.focus()}>Search</Button><Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>+</Button><Button variant="ghost" aria-label="LIVE tab" onClick={()=>setPanel('LIVE')}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>Me</Button></nav>
      <VibraLive open={panel==='LIVE'} onClose={()=>setPanel('')} />
    </div>
  }

  return(
    <div data-ready={hydrated} className="vibra-app home-bottom-scroll bg-video text-video-text">
      <div ref={stageRef} className={'home-video-stage '+(idx%feed.length)}>
        {uploadPanel}
        {sharePanel}
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input ref={searchRef} aria-label="Search videos" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." />
            <span className="text-xs whitespace-nowrap">{coins} Coins</span>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:24,marginTop:8}}>
            <Button variant="ghost" onClick={()=>{setTab('following');setIdx(0)}} style={{fontWeight:tab==='following'?'bold':'normal'}}>Following</Button>
            <Button variant="ghost" onClick={()=>{setTab('foryou');setIdx(0)}} style={{fontWeight:tab==='foryou'?'bold':'normal'}}>For You</Button>
          </div>
        </div>
        {current?<video ref={videoRef} className="feed-video absolute inset-0" src={current.url} loop playsInline autoPlay muted={!soundEnabled} onClick={()=>setSoundEnabled(v=>!v)} />:<p className="p-6 text-center">{tab==='following'?'Hujafollow mtu bado. Bonyeza Follow kwenye video yoyote.':'No videos yet.'}</p>}
        <div className="absolute right-3 top-24 z-[60]"><Button className="action-button" aria-label="Open profile" onClick={()=>setView('me')}>Me</Button></div>
        <div style={{position:'absolute',left:12,bottom:110,zIndex:70}}><Button className="action-button" onClick={()=>setSoundEnabled(v=>!v)}>{soundEnabled?'🔊 Sauti ON':'🔇 Bonyeza Sauti'}</Button></div>
        <div className="feed-caption absolute left-3 right-20"><p className="font-bold">{name}</p><p>{current?.caption}</p></div>
        <div className="action-stack right-3 bottom-32 flex flex-col gap-2">
          <Button className={'action-button '+(isFollowing?'is-active':'')} aria-label="Follow creator" onClick={toggleFollow}>{isFollowing?'Following ✓':'Follow +'}</Button>
          <Button className={'action-button '+(liked?'is-active':'')} aria-label="Like video" onClick={toggleLike}>♥ {likes}</Button>
          <Button className="action-button" aria-label="Comments" onClick={()=>setPanel('Comments')}>💬</Button>
          <Button className={'action-button '+(saved?'is-active':'')} aria-label="Save video" onClick={toggleSave}>🔖</Button>
          <Button className="action-button" aria-label="Share video" onClick={shareVideo}>↗ Share</Button>
          <Button className="action-button" aria-label="Lyrics" onClick={()=>setPanel('Lyrics')}>🎵</Button>
          <Button className="action-button" aria-label="LIVE" onClick={()=>setPanel('LIVE')}>LIVE</Button>
          <VibraRewards onOpenChange={open=>setPanel(open?'Rewards':'')} />
        </div>
      </div>
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3">
        <Button variant="ghost" onClick={()=>{setView('home');setSearch('')}}>Home</Button>
        <Button variant="ghost" onClick={()=>searchRef.current?.focus()}>Search</Button>
        <Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>+</Button>
        <Button variant="ghost" aria-label="LIVE tab" onClick={()=>setPanel('LIVE')}>LIVE</Button>
        <Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button>
      </nav>
      <VibraBanner placement="home" />
      <VibraLive open={panel==='LIVE'} onClose={()=>setPanel('')} />
      <VibraSheet title="Share" open={panel==='Share'} onClose={()=>setPanel('')}>
        <p style={{textAlign:'center',fontWeight:'bold'}}>{current?.caption||'Share hii video'}</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:12}}>
          <a href={'https://wa.me/?text='+shareMsg} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#25D366',color:'#fff',padding:'12px 4px',borderRadius:12}}>💬<br/>WhatsApp</a>
          <a href={'https://www.facebook.com/sharer/sharer.php?u='+shareUrl} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#1877F2',color:'#fff',padding:'12px 4px',borderRadius:12}}>📘<br/>Facebook</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'linear-gradient(45deg,#f09433,#dc2743,#bc1888)',color:'#fff',padding:'12px 4px',borderRadius:12}}>📸<br/>Instagram</a>
          <a href={'https://chatgpt.com/?q='+encodeURIComponent('Nisaidie caption nzuri ya video hii: '+(current?.caption||''))} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#10a37f',color:'#fff',padding:'12px 4px',borderRadius:12}}>🤖<br/>ChatGPT</a>
          <a href="https://www.capcut.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'#000',color:'#fff',padding:'12px 4px',borderRadius:12}}>✂️<br/>CapCut</a>
          <button onClick={copyLink} style={{background:'#333',color:'#fff',padding:'12px 4px',borderRadius:12,border:'none'}}>🔗<br/>Copy Link</button>
        </div>
        <p style={{fontSize:12,opacity:0.7,marginTop:10,textAlign:'center'}}>Instagram na CapCut: Link imekopiwa, fungua App, paste huko.</p>
        <Button onClick={()=>setPanel('')}>Funga</Button>
      </VibraSheet>
      <VibraSheet title={panel} open={panel==='Comments'||panel==='Lyrics'||panel==='Rewards'} onClose={()=>setPanel('')}>
        {panel==='Lyrics'?<p className="lyrics-copy">{current?.caption||'No lyrics'}</p>:panel==='Comments'?<div>{(comments[clipKey]||[]).map((text,i)=><p key={i}>{text}</p>)}<input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." /><Button onClick={()=>{if(!comment) return; setComments(v=>({...v,[clipKey]:[...(v[clipKey]||[]),comment]})); setComment('')}}>Send</Button></div>:<p>Coins: {coins}</p>}
      </VibraSheet>
      {notice&&<p className="vibra-notice">{notice}</p>}
      {uploadInput}
    </div>
  )
}
