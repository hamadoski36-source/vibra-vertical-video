// VERSION - BUTTONS ZIMEREKEBISHWA + SAUTI
import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { readCloudVideos, uploadCloudVideo, type CloudVideo } from '@/lib/vibra-cloud'
import { demoCoinBalance } from '@/lib/vibra-rewards'
import { Button } from '@/components/ui/button'
import { VibraSheet } from '@/components/vibra-sheet'
import { VibraRewards } from '@/components/vibra-rewards'
import { VibraBanner } from '@/components/vibra-banner'
import { useAuth } from '@/hooks/use-auth'
import { readCreatorAvatar, readLocalPhoto, saveCreatorAvatar } from '@/lib/vibra-profile'

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
type VibraUser = { name: string; email: string; pass: string }

const inputStyle: React.CSSProperties = { padding:14, borderRadius:12, border:'2px solid #ddd', background:'#fff', color:'#000', fontSize:16, width:'100%', boxSizing:'border-box', outline:'none' }
const labelStyle: React.CSSProperties = { color:'#fff', fontSize:13, fontWeight:'bold', textAlign:'left', marginBottom:-4 }
// BUTTONS NDOGO - HAZIKATWI TENA
const actionBtn: React.CSSProperties = { width:52, height:52, minWidth:52, padding:0, fontSize:11, lineHeight:'1.1', borderRadius:12, background:'rgba(0,0,0,0.55)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, whiteSpace:'nowrap', overflow:'hidden' }

function VibraTikTok(){
  const hydrated = useHydrated()
  const { user } = useAuth()
  const [creatorAvatar,setCreatorAvatar]=useState<string|null>(null)
  const [avatarFailed,setAvatarFailed]=useState(false)
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveRef=useRef<HTMLVideoElement>(null)
  const liveStream=useRef<MediaStream|null>(null)
  const stageRef=useRef<HTMLDivElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('foryou')
  const [view,setView]=useState('home')
  const [search,setSearch]=useState('')
  const [soundEnabled,setSoundEnabled]=useState(false)
  const [tappedSound,setTappedSound]=useState(false)
  const [panel,setPanel]=useState('')
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState<Record<string,string[]>>({})
  const [savedIds,setSavedIds]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('vibra_saved')||'[]')}catch{return[]}})
  const [likedIds,setLikedIds]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('vibra_liked')||'[]')}catch{return[]}})
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
  const [liveOn,setLiveOn]=useState(false)
  const [liveMsg,setLiveMsg]=useState('')
  const [liveChats,setLiveChats]=useState<string[]>(['Karibu LIVE!','🔥🔥','Mombasa!'])
  const photoRef=useRef<HTMLInputElement>(null)
  const [dp,setDp]=useState('')
  const [bio,setBio]=useState('Mombasa Vibes | Kamata')
  const [name,setName]=useState('@MrVibra')
  const uploadRef=useRef<HTMLInputElement>(null)
  const searchRef=useRef<HTMLInputElement>(null)

  const [authUser,setAuthUser]=useState<VibraUser|null>(null)
  const [showAuth,setShowAuth]=useState(false)
  const [authMode,setAuthMode]=useState<'login'|'signup'>('signup')
  const [authName,setAuthName]=useState('')
  const [authEmail,setAuthEmail]=useState('')
  const [authPass,setAuthPass]=useState('')
  const [authError,setAuthError]=useState('')
  const [showPass,setShowPass]=useState(false)

  const followers = followingIds.length
  const following = followingIds.length

  useEffect(()=>{
    try{
      const cur=localStorage.getItem('vibra_current_user')
      if(cur){ const u=JSON.parse(cur); setAuthUser(u); setName(u.name.startsWith('@')?u.name:'@'+u.name.replace('@','')); setAuthName(u.name) }
      else{ setShowAuth(true) }
    }catch{ setShowAuth(true) }
  },[])

  function doSignup(){
    if(!authName.trim() || !authEmail.trim() || !authPass.trim()){ setAuthError('Jaza Jina, Email na Password zote'); return }
    if(authPass.length<4){ setAuthError('Password iwe angalau herufi 4'); return }
    try{
      const users: VibraUser[] = JSON.parse(localStorage.getItem('vibra_users')||'[]')
      if(users.find(u=>u.email.toLowerCase()===authEmail.toLowerCase())){ setAuthError('Hii Email tayari imeshatumika. Bonyeza Login.'); return }
      const newUser: VibraUser = { name: authName.trim(), email: authEmail.trim().toLowerCase(), pass: authPass }
      users.push(newUser)
      localStorage.setItem('vibra_users', JSON.stringify(users))
      localStorage.setItem('vibra_current_user', JSON.stringify(newUser))
      localStorage.setItem('vibra_name', '@'+authName.trim().replace('@',''))
      setAuthUser(newUser); setName('@'+authName.trim().replace('@','')); setAuthError(''); setShowAuth(false); setNotice('Karibu Vibra, '+authName+'! 🎉')
    }catch{ setAuthError('Imeshindwa kuhifadhi. Jaribu tena.') }
  }
  function doLogin(){
    if(!authEmail.trim() || !authPass.trim()){ setAuthError('Jaza Email na Password'); return }
    try{
      const users: VibraUser[] = JSON.parse(localStorage.getItem('vibra_users')||'[]')
      const found=users.find(u=>u.email.toLowerCase()===authEmail.trim().toLowerCase() && u.pass===authPass)
      if(!found){ setAuthError('Email au Password si sahihi. Kama huna akaunti, bonyeza Sign Up.'); return }
      localStorage.setItem('vibra_current_user', JSON.stringify(found))
      localStorage.setItem('vibra_name', '@'+found.name.replace('@',''))
      setAuthUser(found); setName('@'+found.name.replace('@','')); setAuthError(''); setShowAuth(false); setNotice('Karibu tena, '+found.name+'! 👋')
    }catch{ setAuthError('Imeshindwa kuingia. Jaribu tena.') }
  }
  function doLogout(){
    localStorage.removeItem('vibra_current_user')
    setAuthUser(null); setShowAuth(true); setView('home'); setNotice('Umetoka. Karibu tena!')
  }

  useEffect(()=>{
    let alive=true
    setCreatorAvatar(null);setAvatarFailed(false)
    if(user?.id){void readCreatorAvatar(user.id).then(url=>{if(alive) setCreatorAvatar(url)})}
    return ()=>{alive=false}
  },[user?.id])
  const profileAvatar=avatarFailed?'':creatorAvatar||dp

  useEffect(()=>{
    setCoins(demoCoinBalance(localStorage.getItem('vibra_coins')))
    setDp(localStorage.getItem('vibra_dp')||'')
    setBio(localStorage.getItem('vibra_bio')||'Mombasa Vibes | Kamata')
    if(!localStorage.getItem('vibra_current_user')){ setName(localStorage.getItem('vibra_name')||'@MrVibra') }
    try{ const s=JSON.parse(localStorage.getItem('vibra_comments')||'{}'); if(Object.keys(s).length>0) setComments(s) }catch{}
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
  const commentCount=(comments[clipKey]||[]).length
  const shareText=(current?.caption||'Angalia hii video kwenye Vibra!')+' '+window.location.href
  const shareUrl=encodeURIComponent(window.location.href)
  const shareMsg=encodeURIComponent(shareText)

  // ===== SAUTI - UKIBONYEZA VIDEO INAWAKA =====
  function toggleSound(){
    const v=videoRef.current
    if(v){
      const next=!soundEnabled
      setSoundEnabled(next); setTappedSound(true)
      v.muted=!next; v.volume=1
      if(next){ v.play().catch(()=>{}) }
      setNotice(next?'Sauti imewashwa 🔊':'Sauti imezimwa 🔇')
    }
  }

  function toggleLike(){
    if(!authUser){ setShowAuth(true); return }
    setLikedIds(v=>{
      const n=v.includes(clipKey)?v.filter(id=>id!==clipKey):[...v,clipKey]
      localStorage.setItem('vibra_liked', JSON.stringify(n))
      return n
    })
  }
  function toggleSave(){
    setSavedIds(v=>{
      const already=v.includes(clipKey)
      const n=already?v.filter(id=>id!==clipKey):[...v,clipKey]
      localStorage.setItem('vibra_saved', JSON.stringify(n))
      setNotice(already?'Imeondolewa kwenye Saved':'Ime-save! ✅ Nenda Me -> Saved kuiona. Jumla: '+n.length)
      return n
    })
  }
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
  function addComment(){
    if(!comment.trim()) return
    const text=comment.trim()
    setComments(v=>{
      const n={...v,[clipKey]:[...(v[clipKey]||[]),text]}
      localStorage.setItem('vibra_comments',JSON.stringify(n))
      return n
    })
    setComment(''); setNotice('Comment imetumwa! Sasa comments ni '+(commentCount+1))
  }

  useEffect(()=>{
    const video=videoRef.current
    if(!video) return
    if(view!=='home' || panel==='Share' || panel==='Comments' || panel==='LIVE' || panel==='Rewards' || panel==='Lyrics'){ video.pause(); video.muted=true; return }
    video.muted=!soundEnabled
    video.volume=1
    video.play().catch(()=>{})
  },[current,soundEnabled,idx,view,panel])

  useEffect(()=>{
    const stop=()=>{ const v=videoRef.current; if(v){ v.pause(); v.muted=true } }
    const onHide=()=>{ if(document.hidden){ stop(); setSoundEnabled(false) } }
    document.addEventListener('visibilitychange',onHide)
    window.addEventListener('pagehide',stop)
    window.addEventListener('blur',stop)
    return ()=>{ document.removeEventListener('visibilitychange',onHide); window.removeEventListener('pagehide',stop); window.removeEventListener('blur',stop) }
  },[])

  async function startLive(){
    if(!authUser){ setShowAuth(true); return }
    setPanel('LIVE')
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
      liveStream.current=stream; setLiveOn(true)
      setTimeout(()=>{ if(liveRef.current){ liveRef.current.srcObject=stream; liveRef.current.play().catch(()=>{}) } },100)
    }catch{ setNotice('Ruhusu kamera: Bonyeza alama ya kamera juu -> Allow'); setLiveOn(false) }
  }
  function stopLive(){ liveStream.current?.getTracks().forEach(t=>t.stop()); liveStream.current=null; setLiveOn(false); setPanel('') }

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

  function shareVideo(){if(!current) return; setPanel('Share')}
  const uploadInput=<input ref={uploadRef} type="file" accept="video/*" style={{display:'none'}} onChange={e=>uploadVideo(e.target.files?.[0])} />

  async function choosePhoto(file:File|undefined){
    if(!file) return
    setSavingPhoto(true)
    try{
      if(user?.id){
        const url=await saveCreatorAvatar(user.id,file)
        setCreatorAvatar(url);setAvatarFailed(false);setDp(url);localStorage.setItem('vibra_dp',url); setNotice('Picha imehifadhiwa!')
      }else{
        const dataUrl=await readLocalPhoto(file)
        setDp(dataUrl);localStorage.setItem('vibra_dp',dataUrl); setNotice('Picha imehifadhiwa kwenye simu hii.')
      }
    }catch(error){setNotice('Picha haijahifadhiwa: '+(error instanceof Error?error.message:'Unknown'))}
    finally{setSavingPhoto(false)}
  }

  const saveProfile=()=>{localStorage.setItem('vibra_dp',dp);localStorage.setItem('vibra_bio',bio);localStorage.setItem('vibra_name',name);setShowEdit(false);setNotice('Profile imehifadhiwa!')}
  const uploadPanel=<VibraSheet title="Upload" open={panel==='Upload'} onClose={()=>setPanel('')}><input type="file" accept="video/*" onChange={e=>uploadVideo(e.target.files?.[0])} /><input placeholder="Caption..." value={caption} onChange={e=>setCaption(e.target.value)} /><Button onClick={()=>uploadRef.current?.click()}>Chagua Video</Button></VibraSheet>
  const profileVideos=cloudReady?[...myVideos.filter(v=>!v.url.startsWith('blob:')),...cloudClips]:myVideos
  const allVideosForSaved=[...baseFeed, ...myVideos, ...cloudClips].filter((v,i,arr)=>arr.findIndex(x=>String(x.id??x.url)===String(v.id??v.url))===i)
  const savedVideos=allVideosForSaved.filter(v=>savedIds.includes(String(v.id??v.url)))
  function openClip(clip:Clip){const index=baseFeed.findIndex(entry=>entry.url===clip.url); if(index>=0){setIdx(index);setView('home')} else { setMyVideos(prev=>[clip,...prev]); setIdx(0); setView('home') }}

  const authScreen = showAuth && (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',padding:20,paddingTop:40,color:'#fff',overflowY:'auto'}}>
      <div style={{fontSize:50}}>🎬</div>
      <h1 style={{fontSize:32,fontWeight:'bold',marginTop:8}}>VIBRA</h1>
      <p style={{opacity:0.8,marginBottom:20,textAlign:'center'}}>Mombasa Vibes | Kamata<br/>Tengeneza akaunti au ingia kuendelea</p>
      <div style={{display:'flex',gap:10,marginBottom:20}}>
        <button onClick={()=>{setAuthMode('signup');setAuthError('')}} style={{padding:'10px 24px',borderRadius:20,border:'none',background:authMode==='signup'?'#FE2C55':'#333',color:'#fff',fontWeight:'bold'}}>Sign Up</button>
        <button onClick={()=>{setAuthMode('login');setAuthError('')}} style={{padding:'10px 24px',borderRadius:20,border:'none',background:authMode==='login'?'#FE2C55':'#333',color:'#fff',fontWeight:'bold'}}>Login</button>
      </div>
      <div style={{width:'100%',maxWidth:340,display:'flex',flexDirection:'column',gap:12,background:'#111',padding:16,borderRadius:16,border:'1px solid #333'}}>
        {authMode==='signup'&&<>
          <label style={labelStyle}>👤 Jina lako</label>
          <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Mfano: MrVibra" style={inputStyle} />
        </>}
        <label style={labelStyle}>📧 Email</label>
        <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Mfano: wewe@gmail.com" type="email" style={inputStyle} />
        <label style={labelStyle}>🔒 Password</label>
        <div style={{display:'flex',gap:8}}>
          <input value={authPass} onChange={e=>setAuthPass(e.target.value)} placeholder="Angalau herufi 4" type={showPass?'text':'password'} style={{...inputStyle, flex:1}} />
          <button onClick={()=>setShowPass(v=>!v)} style={{background:'#333',color:'#fff',border:'none',borderRadius:12,padding:'0 12px'}}>{showPass?'🙈':'👁️'}</button>
        </div>
        {authError&&<p style={{color:'#ff6b6b',fontSize:13,textAlign:'center',background:'#331111',padding:8,borderRadius:8}}>{authError}</p>}
        <button onClick={authMode==='signup'?doSignup:doLogin} style={{padding:14,borderRadius:12,border:'none',background:'#FE2C55',color:'#fff',fontWeight:'bold',fontSize:16,marginTop:4}}>{authMode==='signup'?'Tengeneza Akaunti 🎉':'Ingia 👋'}</button>
        <button onClick={()=>{setShowAuth(false); setNotice('Umeingia kama Mgeni.')}} style={{padding:12,borderRadius:12,border:'1px solid #555',background:'transparent',color:'#fff'}}>Endelea kama Mgeni 👀</button>
      </div>
    </div>
  )

  if(view==='me'){
    const listToShow=meTab==='saved'?savedVideos:meTab==='liked'?allVideosForSaved.filter(v=>likedIds.includes(String(v.id??v.url))):profileVideos
    return <div data-ready={hydrated} className="vibra-app bg-video text-video-text" style={{overflowY:'auto'}}>
      {authScreen}
      <header className="flex items-center justify-between p-4"><Button variant="ghost" onClick={()=>setView('home')}>← Back</Button><span style={{fontWeight:'bold'}}>Vibra</span><Button variant="ghost" onClick={doLogout}>Logout</Button></header>
      <section className="px-4 text-center" style={{paddingBottom:16}}>
        <div style={{position:'relative',width:110,height:110,margin:'0 auto'}}>
          <Button variant="ghost" className="profile-avatar bg-video-glass" style={{width:110,height:110,borderRadius:'50%',overflow:'hidden',fontSize:40}} onClick={()=>photoRef.current?.click()}>{profileAvatar?<img src={profileAvatar} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover'}} />:'👤'}</Button>
          <span style={{position:'absolute',bottom:0,right:0,background:'#fff',color:'#000',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center'}}>+</span>
        </div>
        <h1 className="font-bold" style={{fontSize:22,marginTop:10}}>{name}</h1>
        <p style={{opacity:0.8}}>{authUser?.email||''}</p>
        <p style={{opacity:0.8}}>{bio}</p>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:12}}>
          <Button variant="ghost" className="bg-video-glass text-video-text" onClick={()=>setShowEdit(true)}>✏️ Edit Profile</Button>
          <Button variant="ghost" className="bg-video-glass text-video-text" onClick={copyLink}>🔗 Share Profile</Button>
        </div>
        {!authUser&&<Button style={{marginTop:10,background:'#FE2C55'}} onClick={()=>setShowAuth(true)}>Sign Up / Login</Button>}
        <div className="flex justify-center gap-6" style={{marginTop:16}}>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{following}</p><p style={{opacity:0.7}}>Following</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{followers}</p><p style={{opacity:0.7}}>Followers</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{profileVideos.length}</p><p style={{opacity:0.7}}>Videos</p></div>
          <div><p style={{fontWeight:'bold',fontSize:18}}>{savedIds.length}</p><p style={{opacity:0.7}}>Saved</p></div>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:16,borderBottom:'1px solid #333',paddingBottom:8}}>
          <Button variant="ghost" onClick={()=>setMeTab('videos')}>🎬 Videos ({profileVideos.length})</Button>
          <Button variant="ghost" onClick={()=>setMeTab('liked')}>❤️ Liked ({likedIds.length})</Button>
          <Button variant="ghost" onClick={()=>setMeTab('saved')}>🔖 Saved ({savedIds.length})</Button>
        </div>
      </section>
      <section className="p-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,paddingBottom:100}}>
        {listToShow.map(v=>(
          <button key={String(v.id??v.url)} onClick={()=>openClip(v)} style={{position:'relative',aspectRatio:'9/16',overflow:'hidden',borderRadius:10,background:'#222',border:'none',padding:0}}>
            <video src={v.url} muted playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} />
            <span style={{position:'absolute',left:6,bottom:6,right:6,color:'#fff',fontSize:11,textAlign:'left',textShadow:'0 1px 4px #000'}}>{v.caption||'Video'}</span>
            <span style={{position:'absolute',top:6,right:6,fontSize:12}}>▶️</span>
          </button>
        ))}
      </section>
      {listToShow.length===0&&<p className="p-6 text-center">{meTab==='saved'?'Hujasave video bado. Bonyeza 🔖 kwenye video yoyote.':meTab==='liked'?'Hujalike video bado.':'Hakuna video bado.'}</p>}
      <VibraBanner placement="profile" />
      <VibraSheet title="Edit Profile" open={showEdit} onClose={()=>setShowEdit(false)}>
        <input ref={photoRef} type="file" accept="image/*" aria-label="Choose profile photo" onChange={e=>choosePhoto(e.target.files?.[0])} />
        <Button type="button" className="sheet-command w-full" disabled={savingPhoto} onClick={()=>photoRef.current?.click()}>{savingPhoto?'Inapakia...':'📸 Badilisha Picha'}</Button>
        <input aria-label="Username" value={name} onChange={e=>setName(e.target.value)} />
        <input aria-label="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
        <Button onClick={saveProfile}>Save Profile</Button>
        <Button onClick={doLogout} style={{background:'#333'}}>Logout</Button>
      </VibraSheet>
      {uploadPanel}{notice&&<p className="vibra-notice">{notice}</p>}
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3"><Button variant="ghost" onClick={()=>setView('home')}>Home</Button><Button variant="ghost" onClick={()=>searchRef.current?.focus()}>Search</Button><Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()}>+</Button><Button variant="ghost" onClick={startLive}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>Me</Button></nav>
    </div>
  }

  return(
    <div data-ready={hydrated} className="vibra-app home-bottom-scroll bg-video text-video-text" style={{overflow:'hidden'}}>
      {authScreen}
      <div ref={stageRef} className={'home-video-stage '+(idx%feed.length)} style={{overflow:'hidden'}}>
        {uploadPanel}
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10,padding:'0 8px'}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input ref={searchRef} aria-label="Search videos" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{fontSize:13}} />
            <span className="text-xs whitespace-nowrap" style={{fontSize:11}}>{coins} Coins</span>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:8,alignItems:'center'}}>
            <Button variant="ghost" onClick={()=>{setTab('following');setIdx(0)}} style={{fontWeight:tab==='following'?'bold':'normal',fontSize:13,padding:'6px 10px'}}>Following</Button>
            <Button variant="ghost" onClick={()=>{setTab('foryou');setIdx(0)}} style={{fontWeight:tab==='foryou'?'bold':'normal',fontSize:13,padding:'6px 10px'}}>For You</Button>
            {authUser?<button onClick={()=>setView('me')} style={{background:'#333',color:'#fff',border:'none',padding:'6px 10px',borderRadius:20,fontSize:11}}>{name}</button>:<button onClick={()=>setShowAuth(true)} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'6px 10px',borderRadius:20,fontSize:11,fontWeight:'bold'}}>Login / Sign Up</button>}
          </div>
        </div>
        {current?<video ref={videoRef} className="feed-video absolute inset-0" src={current.url} loop playsInline autoPlay muted={!soundEnabled} onClick={toggleSound} />:<p className="p-6 text-center">No videos yet.</p>}

        {/* SAUTI - SASA IPO NDANI, HAIKATIWI */}
        <div style={{position:'absolute',right:70,top:92,zIndex:70}}>
          <button onClick={toggleSound} style={{width:44,height:44,borderRadius:'50%',background:'rgba(0,0,0,0.7)',color:'#fff',border:'1px solid #fff',fontSize:18}}>{soundEnabled?'🔊':'🔇'}</button>
        </div>
        {!soundEnabled&&!tappedSound&&(
          <button onClick={toggleSound} style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:60,background:'rgba(0,0,0,0.7)',color:'#fff',border:'1px solid #fff',padding:'12px 18px',borderRadius:30,fontSize:14,fontWeight:'bold'}}>🔇 Bonyeza kwa Sauti 🔊</button>
        )}

        <div className="feed-caption absolute left-3" style={{bottom:90,right:70}}><p className="font-bold" style={{fontSize:13}}>{name}</p><p style={{fontSize:12}}>{current?.caption}</p></div>

        {/* BUTTONS ZA RIGHT - SASA ZIKO NDANI, FONT NDOGO */}
        <div style={{position:'absolute',right:8,top:130,bottom:110,zIndex:50,display:'flex',flexDirection:'column',gap:6,alignItems:'center',width:52}}>
          <div style={{position:'relative',width:48,height:48,marginBottom:10}}>
            <button onClick={()=>setView('me')} style={{width:48,height:48,borderRadius:'50%',overflow:'hidden',border:'2px solid #fff',background:'#333',padding:0,cursor:'pointer'}}>
              {profileAvatar?<img src={profileAvatar} alt="Creator" style={{width:'100%',height:'100%',objectFit:'cover'}} />:<span style={{fontSize:22}}>👤</span>}
            </button>
            <button onClick={toggleFollow} style={{position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',width:20,height:20,borderRadius:'50%',background:isFollowing?'#fff':'#FE2C55',color:isFollowing?'#FE2C55':'#fff',border:'none',fontSize:12,fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{isFollowing?'✓':'+'}</button>
          </div>
          <button onClick={toggleLike} style={{...actionBtn, background:liked?'#FE2C55':'rgba(0,0,0,0.55)'}}>♥<span style={{fontSize:10}}>{likes}</span></button>
          <button onClick={()=>setPanel('Comments')} style={actionBtn}>💬<span style={{fontSize:10}}>{commentCount}</span></button>
          <button onClick={toggleSave} style={{...actionBtn, background:saved?'#FE2C55':'rgba(0,0,0,0.55)'}}>{saved?'✅':'🔖'}<span style={{fontSize:10}}>{savedIds.length}</span></button>
          <button onClick={shareVideo} style={actionBtn}>↗<span style={{fontSize:10}}>Share</span></button>
          <button onClick={()=>setPanel('Lyrics')} style={actionBtn}>🎵<span style={{fontSize:10}}>Song</span></button>
          <button onClick={startLive} style={actionBtn}>🔴<span style={{fontSize:10}}>LIVE</span></button>
          <div style={{transform:'scale(0.85)',transformOrigin:'top center'}}><VibraRewards onOpenChange={open=>setPanel(open?'Rewards':'')} /></div>
        </div>
      </div>
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3">
        <Button variant="ghost" onClick={()=>{setView('home');setSearch('')}} style={{fontSize:12}}>Home</Button>
        <Button variant="ghost" onClick={()=>searchRef.current?.focus()} style={{fontSize:12}}>Search</Button>
        <Button variant="ghost" aria-label="Upload" onClick={()=>uploadRef.current?.click()} style={{fontSize:16}}>+</Button>
        <Button variant="ghost" onClick={startLive} style={{fontSize:12}}>LIVE</Button>
        <Button variant="ghost" onClick={()=>setView('me')} style={{fontSize:12}}>👤 Me</Button>
      </nav>
      <VibraBanner placement="home" />
      {panel==='Share'&&(
        <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'flex-end'}} onClick={()=>setPanel('')}>
          <div style={{background:'#fff',color:'#000',width:'100%',borderRadius:'20px 20px 0 0',padding:20}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Share hii video</b><button onClick={()=>setPanel('')} style={{fontSize:20,border:'none',background:'none'}}>✕</button></div>
            <p style={{fontSize:13,marginTop:6}}>{current?.caption||'Share hii video'}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:14}}>
              <a href={'https://wa.me/?text='+shareMsg} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#25D366',color:'#fff',padding:'14px 4px',borderRadius:12}}>💬<br/>WhatsApp</a>
              <a href={'https://www.facebook.com/sharer/sharer.php?u='+shareUrl} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#1877F2',color:'#fff',padding:'14px 4px',borderRadius:12}}>📘<br/>Facebook</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'linear-gradient(45deg,#f09433,#dc2743,#bc1888)',color:'#fff',padding:'14px 4px',borderRadius:12}}>📸<br/>Instagram</a>
              <a href={'https://chatgpt.com/?q='+encodeURIComponent('Nisaidie caption nzuri ya video hii: '+(current?.caption||''))} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#10a37f',color:'#fff',padding:'14px 4px',borderRadius:12}}>🤖<br/>ChatGPT</a>
              <a href="https://www.capcut.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'#000',color:'#fff',padding:'14px 4px',borderRadius:12}}>✂️<br/>CapCut</a>
              <button onClick={copyLink} style={{background:'#333',color:'#fff',padding:'14px 4px',borderRadius:12,border:'none'}}>🔗<br/>Copy Link</button>
            </div>
            <p style={{fontSize:12,opacity:0.7,marginTop:10,textAlign:'center'}}>Instagram na CapCut: Link imekopiwa, fungua App, paste huko.</p>
          </div>
        </div>
      )}
      {panel==='LIVE'&&(
        <div style={{position:'fixed',inset:0,zIndex:999,background:'#000',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:12,color:'#fff'}}><b>🔴 LIVE - {name}</b><button onClick={stopLive} style={{color:'#fff',background:'none',border:'none',fontSize:20}}>✕</button></div>
          <div style={{flex:1,position:'relative',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <video ref={liveRef} autoPlay playsInline muted style={{width:'100%',height:'100%',objectFit:'cover'}} />
            {!liveOn&&<p style={{position:'absolute',color:'#fff',textAlign:'center',padding:20}}>Inafungua kamera...<br/>Kama haifunguki, bonyeza alama ya kamera juu -&gt; Allow</p>}
            <div style={{position:'absolute',left:10,bottom:10,color:'#fff',fontSize:13}}>{liveChats.map((c,i)=><p key={i}>{c}</p>)}</div>
          </div>
          <div style={{padding:12,background:'#000',display:'flex',gap:8}}>
            <input value={liveMsg} onChange={e=>setLiveMsg(e.target.value)} placeholder="Andika LIVE chat..." style={{flex:1,padding:10,borderRadius:20,border:'none'}} />
            <Button onClick={()=>{if(!liveMsg.trim()) return; setLiveChats(v=>[...v,liveMsg]); setLiveMsg('')}}>Send</Button>
            <Button onClick={stopLive} style={{background:'#FE2C55'}}>Maliza LIVE</Button>
          </div>
        </div>
      )}
      <VibraSheet title={panel} open={panel==='Comments'||panel==='Lyrics'||panel==='Rewards'} onClose={()=>setPanel('')}>
        {panel==='Lyrics'?<p className="lyrics-copy">{current?.caption||'No lyrics'}</p>:panel==='Comments'?<div><p style={{fontWeight:'bold'}}>{commentCount} Comments</p>{(comments[clipKey]||[]).map((text,i)=><p key={i} style={{padding:'8px 0',borderBottom:'1px solid #eee'}}>{text}</p>)}<input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." /><Button onClick={addComment}>Send - sasa {commentCount+1}</Button></div>:<p>Coins: {coins}</p>}
      </VibraSheet>
      {notice&&<p className="vibra-notice">{notice}</p>}
      {uploadInput}
    </div>
  )
}
