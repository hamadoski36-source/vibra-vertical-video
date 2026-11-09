// @ts-nocheck
// VIBRA WORLDWIDE - FINAL YOTE + A: LIKE ZA WOTE + B: FOLLOW - TUSIHARIBU!
import { createFileRoute, useHydrated } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
const SUPABASE_URL = 'https://svrjacetnlwlwesferwz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iXum9XuFOTo261UcV49ZNQ_LtZBp5kc'
const SB_HEADERS: any = { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }
type CloudVideo = { id: string; url: string; caption: string; user_email?: string; creator?: string }
const readCloudVideos = async (): Promise<CloudVideo[]> => { try { const r = await fetch(`${SUPABASE_URL}/rest/v1/vibra_videos?select=*&order=created_at.desc&limit=50`, { headers: SB_HEADERS }); const j = await r.json(); return Array.isArray(j) ? j : [] } catch { return [] } }
const uploadCloudVideo = async () => null
import { demoCoinBalance } from '@/lib/vibra-rewards'
import { useAuth } from '@/hooks/use-auth'
import { readLocalAvatar, saveCreatorAvatar } from '@/lib/avatar'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide - Video feed' },{ name: 'description', content: 'Vibra Worldwide' }] }),
})

type Clip = { id?: number | string; url: string; caption: string; thumb?: string; user_email?: string; creator?: string }
type VibraUser = { name: string; email: string; pass: string }
type ChatMsg = { from: 'me' | 'them'; text: string; time: string; audio?: string }
type Chat = { id: string; name: string; avatar: string; last: string; msgs: ChatMsg[] }
type StatusItem = { id: string; name: string; avatar: string; img: string; text: string }

const PINK = '#FE2C55'
const TEAL = '#25F4EE'
const GRADIENT = 'linear-gradient(90deg,#FE2C55,#25F4EE)'
const GRADIENT_BTN = 'linear-gradient(90deg,#FE2C55 0%,#FF6B9D 50%,#25F4EE 100%)'
function VibraTikTok(){
  const hydrated = useHydrated(); const { user } = useAuth()
  const [creatorAvatar, setCreatorAvatar] = useState<string|null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0); const [tab,setTab]=useState('foryou')
  const [soundEnabled,setSoundEnabled]=useState(true)
  const [panel,setPanel]=useState(''); const [showCamera,setShowCamera]=useState(false)
  const [savedIds,setSavedIds]=useState<string[]>(()=>{ try{ return JSON.parse(localStorage.getItem('vibra_saved')||'[]') }catch{ return [] } })
  const [cloudClips,setCloudClips]=useState<Clip[]>([]); const [myVideos,setMyVideos]=useState<Clip[]>([])
  const [liveOn,setLiveOn]=useState(false); const [liveMsg,setLiveMsg]=useState('')
  const [isGuest,setIsGuest]=useState(false)
  const [authUser,setAuthUser]=useState<VibraUser|null>(null); const [showAuth,setShowAuth]=useState(false)
  const [authName,setAuthName]=useState(''); const [authEmail,setAuthEmail]=useState(''); const [authPass,setAuthPass]=useState('')
  const [authMode,setAuthMode]=useState('login'); const [notice,setNotice]=useState('')
  const [likedIds,setLikedIds]=useState<string[]>(()=>{ try{ return JSON.parse(localStorage.getItem('vibra_liked')||'[]') }catch{ return [] } })
  const [followingIds,setFollowingIds]=useState<string[]>(()=>{ try{ return JSON.parse(localStorage.getItem('vibra_following')||'[]') }catch{ return [] } })
  const [comment,setComment]=useState(''); const [comments,setComments]=useState<any>({})
  const [view,setView]=useState('home'); const [search,setSearch]=useState('')
  const [showSettings,setShowSettings]=useState(false); const [appLang,setAppLang]=useState('sw')
  const [dp,setDp]=useState(''); const [avatarFailed,setAvatarFailed]=useState(false)
  const [coins,setCoins]=useState(0)

  // --- A + B: SERVER DATA ---
  const [serverLikes,setServerLikes]=useState<any>({})
  const [serverFollows,setServerFollows]=useState<string[]>([])

  async function loadServerData(){
    try{
      const r1 = await fetch(`${SUPABASE_URL}/rest/v1/vibra_likes?select=video_id`, { headers: SB_HEADERS })
      const likes:any = await r1.json()
      const counts:any = {}; if(Array.isArray(likes)) likes.forEach((l:any)=>{ counts[l.video_id]=(counts[l.video_id]||0)+1 })
      setServerLikes(counts)
      if(authUser){
        const r2 = await fetch(`${SUPABASE_URL}/rest/v1/vibra_follows?follower_email=eq.${encodeURIComponent(authUser.email)}&select=following_email`, { headers: SB_HEADERS })
        const f:any = await r2.json(); if(Array.isArray(f)) setServerFollows(f.map((x:any)=>x.following_email))
      }
    }catch(e){}
  }
  useEffect(()=>{ loadServerData() }, [authUser])

  useEffect(()=>{ try{ const cur=localStorage.getItem('vibra_current_user'); if(cur) setAuthUser(JSON.parse(cur)) }catch{} },[])
  useEffect(()=>{ setCoins(demoCoinBalance(localStorage.getItem('vibra_coins')||'0')) },[])
  useEffect(()=>{ let alive=true; readCloudVideos().then((rows:any)=>{ if(!alive) return; if(rows) setCloudClips(rows.map((r:any)=>({ id:r.id, url:r.url, caption:r.caption||'', user_email:r.user_email||r.creator_email||'', creator:r.creator||'' }))) }); return ()=>{ alive=false } },[])

  const defaultVid:Clip={ url:'https://videos.pexels.com/video-files/18069166/18069166-hd_1080_1920_24fps.mp4', caption:'Karibu Vibra Worldwide 🌍', user_email:'vibra@worldwide.com', creator:'Vibra' }
  const baseFeed:Clip[] = myVideos.length>0 ? [...myVideos, ...cloudClips] : cloudClips.length>0 ? [...cloudClips, defaultVid] : [defaultVid]
  const filteredClips = baseFeed.filter(v=> v.caption.toLowerCase().includes(search.toLowerCase()))
  // B: Following tab inaonyesha video za watu unaowafollow tu
  const feed = tab==='following' ? filteredClips.filter(v=> serverFollows.includes(v.user_email||'') || followingIds.includes(v.user_email||'')) : filteredClips
  const current = feed.length>0 ? feed[idx%feed.length] : undefined
  const clipKey = String(current?.id ?? current?.url ?? 'empty')
  const liked = likedIds.includes(clipKey)
  // A: Namba ya Like ya wote kutoka Supabase
  const likeCount = serverLikes[clipKey] || (liked ? 1 : 0)
  const shareText = (current?.caption || 'Angalia hii video kwenye Vibra!')

  // --- A: TOGGLE LIKE - SERVER + LOCAL ---
  function toggleLike(){
    if(!authUser){ setShowAuth(true); return }
    const already = likedIds.includes(clipKey)
    setLikedIds(v=> already ? v.filter(x=>x!==clipKey) : [...v, clipKey])
    localStorage.setItem('vibra_liked', JSON.stringify(already ? likedIds.filter(x=>x!==clipKey) : [...likedIds, clipKey]))
    // Update server count mara moja ili namba ionekane
    setServerLikes((p:any)=>({ ...p, [clipKey]: Math.max(0, (p[clipKey]||0) + (already ? -1 : 1)) }))
    fetch(`${SUPABASE_URL}/rest/v1/vibra_likes`, { method: already ? 'DELETE' : 'POST', headers: SB_HEADERS, body: already ? undefined : JSON.stringify({ video_id: clipKey, user_email: authUser.email }) }).then(()=> loadServerData()).catch(()=>{})
    // DELETE inahitaji query param
    if(already){
      fetch(`${SUPABASE_URL}/rest/v1/vibra_likes?video_id=eq.${encodeURIComponent(clipKey)}&user_email=eq.${encodeURIComponent(authUser.email)}`, { method:'DELETE', headers: SB_HEADERS }).then(()=> loadServerData()).catch(()=>{})
    }
  }

  // --- B: TOGGLE FOLLOW - SERVER + LOCAL ---
  function toggleFollow(){
    if(!authUser){ setShowAuth(true); return }
    const target = current?.user_email || current?.creator || ''
    if(!target || target===authUser.email){ setNotice('Huwezi kujifollow'); return }
    const already = serverFollows.includes(target) || followingIds.includes(target)
    setFollowingIds(v=> already ? v.filter(x=>x!==target) : [...v, target])
    setServerFollows(v=> already ? v.filter(x=>x!==target) : [...v, target])
    localStorage.setItem('vibra_following', JSON.stringify(already ? followingIds.filter(x=>x!==target) : [...followingIds, target]))
    if(already){
      fetch(`${SUPABASE_URL}/rest/v1/vibra_follows?follower_email=eq.${encodeURIComponent(authUser.email)}&following_email=eq.${encodeURIComponent(target)}`, { method:'DELETE', headers: SB_HEADERS }).catch(()=>{})
    } else {
      fetch(`${SUPABASE_URL}/rest/v1/vibra_follows`, { method:'POST', headers: SB_HEADERS, body: JSON.stringify({ follower_email: authUser.email, following_email: target }) }).catch(()=>{})
    }
    setNotice(already ? 'Unfollowed' : 'Umemfollow! ✅')
  }

  function toggleSave(){ setSavedIds(v=>{ const already=v.includes(clipKey); const n= already ? v.filter(x=>x!==clipKey) : [...v, clipKey]; localStorage.setItem('vibra_saved', JSON.stringify(n)); return n }) }
  function copyLink(){ navigator.clipboard?.writeText(window.location.href); setNotice('Link copied!') }
  function addComment(){ if(!comment.trim()) return; const text=comment; setComments((p:any)=>({ ...p, [clipKey]: [...(p[clipKey]||[]), { text, user: authUser?.name||'Mgeni', time: new Date().toLocaleTimeString() }] })); setComment(''); if(authUser) fetch(`${SUPABASE_URL}/rest/v1/vibra_comments`, { method:'POST', headers: SB_HEADERS, body: JSON.stringify({ video_id: clipKey, user_email: authUser.email, user_name: authUser.name, text }) }).catch(()=>{}) }

  function doSignup(){ if(!authName.trim() || !authEmail.trim() || !authPass.trim()){ setNotice('Jaza zote'); return } const u={ name:authName, email:authEmail, pass:authPass }; localStorage.setItem('vibra_current_user', JSON.stringify(u)); setAuthUser(u); setShowAuth(false); setNotice('Karibu Vibra! ✅') }
  function doLogin(){ if(!authEmail.trim() || !authPass.trim()){ setNotice('Jaza email na password'); return } const u={ name: authEmail.split('@')[0], email: authEmail, pass: authPass }; localStorage.setItem('vibra_current_user', JSON.stringify(u)); setAuthUser(u); setShowAuth(false); setNotice('Karibu tena!') }
  function doLogout(){ if(!confirm('Una uhakika unataka kutoka?')) return; localStorage.removeItem('vibra_current_user'); setAuthUser(null); setNotice('Umetoka') }

  // --- UI - HOME FEED ---
  if(showAuth){
    return <div style={{ height:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#000', color:'#fff', padding:20, gap:12 }}>
      <h1 style={{ fontSize:32, background:GRADIENT, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:900 }}>Vibra</h1>
      <input placeholder="Jina" value={authName} onChange={e=>setAuthName(e.target.value)} style={{ padding:14, borderRadius:12, width:'100%', maxWidth:320, background:'#111', color:'#fff', border:'1px solid #333' }} />
      <input placeholder="Email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} style={{ padding:14, borderRadius:12, width:'100%', maxWidth:320, background:'#111', color:'#fff', border:'1px solid #333' }} />
      <input type="password" placeholder="Password" value={authPass} onChange={e=>setAuthPass(e.target.value)} style={{ padding:14, borderRadius:12, width:'100%', maxWidth:320, background:'#111', color:'#fff', border:'1px solid #333' }} />
      <button onClick={authMode==='login'?doLogin:doSignup} style={{ background:GRADIENT_BTN, padding:'14px 20px', borderRadius:12, width:'100%', maxWidth:320, fontWeight:800, border:'none', color:'#fff' }}>{authMode==='login'?'Ingia':'Jisajili'}</button>
      <button onClick={()=>setAuthMode(authMode==='login'?'signup':'login')} style={{ background:'none', border:'none', color:TEAL }}>{authMode==='login'?'Huna akaunti? Jisajili':'Una akaunti? Ingia'}</button>
      <button onClick={()=>setShowAuth(false)} style={{ background:'none', border:'none', color:'#888' }}>Rudi</button>
    </div>
  }

  return <div data-ready={hydrated} className="vibra_app bg-video-feed" style={{ height:'100dvh', display:'flex', flexDirection:'column', background:'#000', color:'#fff', overflow:'hidden' }}>
    <div style={{ display:'flex', gap:10, padding:'10px 14px', background:'#000', alignItems:'center' }}>
      <span style={{ fontSize:22, fontWeight:900, background:GRADIENT, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Vibra</span>
      <button onClick={()=>setTab('foryou')} style={{ background: tab==='foryou'?GRADIENT_BTN:'none', border:'none', color:'#fff', padding:'6px 14px', borderRadius:20, fontWeight:700 }}>For You</button>
      <button onClick={()=>setTab('following')} style={{ background: tab==='following'?GRADIENT_BTN:'none', border:'none', color:'#fff', padding:'6px 14px', borderRadius:20, fontWeight:700 }}>Following ({serverFollows.length})</button>
      <span style={{ marginLeft:'auto', fontSize:12, color:'#aaa' }}>{authUser ? authUser.name : 'Mgeni'} • 🪙 {coins}</span>
      {!authUser && <button onClick={()=>setShowAuth(true)} style={{ background:PINK, border:'none', color:'#fff', padding:'6px 12px', borderRadius:20 }}>Ingia</button>}
      {authUser && <button onClick={doLogout} style={{ background:'#222', border:'none', color:'#fff', padding:'6px 12px', borderRadius:20 }}>Toka</button>}
    </div>

    <div style={{ flex:1, position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {current ? <video key={current.url} ref={videoRef} src={current.url} autoPlay loop playsInline muted={!soundEnabled} style={{ width:'100%', height:'100%', objectFit:'cover' }} onClick={()=>{ const v=videoRef.current; if(v) v.paused ? v.play() : v.pause() }} /> : <p>Hakuna video</p>}
      <div style={{ position:'absolute', bottom:16, left:12, right:70 }}>
        <p style={{ fontWeight:800 }}>@{current?.creator || 'Vibra'} {current?.user_email ? <span style={{ fontWeight:400, fontSize:12, color:'#ccc' }}>{current.user_email}</span> : null}</p>
        <p style={{ fontSize:14 }}>{current?.caption}</p>
        {/* B: FOLLOW BUTTON */}
        {authUser && current?.user_email && authUser.email!==current.user_email && (
          <button onClick={toggleFollow} style={{ background: (serverFollows.includes(current.user_email)||followingIds.includes(current.user_email)) ? '#fff' : PINK, color: (serverFollows.includes(current.user_email)||followingIds.includes(current.user_email)) ? '#000' : '#fff', padding:'6px 16px', borderRadius:20, fontWeight:800, border:'none', marginTop:6 }}>
            {(serverFollows.includes(current.user_email)||followingIds.includes(current.user_email)) ? 'Following ✓' : 'Follow +'}
          </button>
        )}
      </div>
      <div style={{ position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:16, alignItems:'center' }}>
        <button onClick={toggleLike} style={{ width:52, height:52, borderRadius:'50%', border:'none', background: liked ? PINK : '#222', fontSize:24 }}>❤️</button>
        <span style={{ fontSize:13, fontWeight:700, marginTop:-12 }}>{likeCount}</span>
        <button onClick={()=>setPanel('comments')} style={{ width:52, height:52, borderRadius:'50%', border:'none', background:'#222', fontSize:22 }}>💬</button>
        <span style={{ fontSize:13, marginTop:-12 }}>{(comments[clipKey]?.length||0)}</span>
        <button onClick={toggleSave} style={{ width:52, height:52, borderRadius:'50%', border:'none', background:'#222', fontSize:22 }}>🔖</button>
        <button onClick={copyLink} style={{ width:52, height:52, borderRadius:'50%', border:'none', background:'#222', fontSize:22 }}>↗️</button>
      </div>
      {notice && <div style={{ position:'fixed', left:'50%', top:70, transform:'translateX(-50%)', background:'#fff', color:'#000', padding:'8px 16px', borderRadius:20, fontWeight:700, zIndex:999 }}>{notice}</div>}
    </div>

    <div style={{ display:'flex', justifyContent:'space-around', padding:'10px 0', background:'#000', borderTop:'1px solid #222' }}>
      <button onClick={()=>setIdx((idx+1)%Math.max(1,feed.length))} style={{ background:'none', border:'none', color:'#fff', fontSize:22 }}>⬇️ Next</button>
      <button onClick={()=>setIdx((idx-1+feed.length)%Math.max(1,feed.length))} style={{ background:'none', border:'none', color:'#fff', fontSize:22 }}>⬆️ Prev</button>
      <button onClick={()=>setPanel('comments')} style={{ background:'none', border:'none', color:'#fff', fontSize:22 }}>💬 Comments</button>
    </div>

    {panel==='comments' && (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'flex-end', zIndex:1000 }} onClick={()=>setPanel('')}>
        <div style={{ background:'#111', width:'100%', maxHeight:'70%', borderRadius:'20px 20px 0 0', padding:16 }} onClick={e=>e.stopPropagation()}>
          <h3>Comments • {likeCount} likes ❤️</h3>
          <div style={{ maxHeight:200, overflow:'auto' }}>
            {(comments[clipKey]||[]).map((c:any,i:number)=>(<p key={i}><b>{c.user}:</b> {c.text}</p>))}
            {(comments[clipKey]||[]).length===0 && <p style={{ color:'#888' }}>Hakuna comment bado. Kuwa wa kwanza!</p>}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Andika comment..." style={{ flex:1, padding:12, borderRadius:12, background:'#222', color:'#fff', border:'none' }} />
            <button onClick={addComment} style={{ background:PINK, border:'none', color:'#fff', padding:'12px 16px', borderRadius:12 }}>Tuma</button>
          </div>
        </div>
      </div>
    )}
  </div>
}

export default function RouteComponent(){ return <VibraTikTok /> }
