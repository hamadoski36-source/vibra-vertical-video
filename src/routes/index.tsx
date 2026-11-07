// VIBRA FINAL - VIDEOS + CHAT + LIVE - RANGI MOJA PINK + TEAL
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

type Clip = { id?: number | string; url: string; caption: string; thumb?: string }
type VibraUser = { name: string; email: string; pass: string }
type ChatMsg = { from: 'me' | 'them'; text: string; time: string }
type Chat = { id: string; name: string; avatar: string; last: string; time: string; unread: number; online: boolean; isGroup?: boolean; messages: ChatMsg[] }

const inputStyle: React.CSSProperties = { padding:14, borderRadius:12, border:'2px solid #ddd', background:'#fff', color:'#000', fontSize:16, width:'100%', boxSizing:'border-box', outline:'none' }
const labelStyle: React.CSSProperties = { color:'#fff', fontSize:13, fontWeight:'bold', textAlign:'left', marginBottom:-4 }
const actionBtn: React.CSSProperties = { width:52, height:52, minWidth:52, padding:0, fontSize:11, lineHeight:'1.1', borderRadius:12, background:'rgba(0,0,0,0.55)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, whiteSpace:'nowrap', overflow:'hidden' }
const noticeStyle: React.CSSProperties = { position:'fixed', left:'50%', bottom:80, transform:'translateX(-50%)', zIndex:9999, background:'#fff', color:'#000', padding:'10px 16px', borderRadius:20, fontSize:13, fontWeight:'bold', boxShadow:'0 4px 20px rgba(0,0,0,0.4)', maxWidth:'90%', textAlign:'center' }

function openDB(): Promise<IDBDatabase>{
  return new Promise((res,rej)=>{
    const req=indexedDB.open('vibra-db',1)
    req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains('videos')) req.result.createObjectStore('videos',{keyPath:'id'}) }
    req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error)
  })
}
async function saveVideoDB(id:number, file:Blob, caption:string){
  try{ const db=await openDB(); const tx=db.transaction('videos','readwrite'); tx.objectStore('videos').put({id, blob:file, caption}); await new Promise(r=>tx.oncomplete=r) }catch{}
}
async function loadVideosDB(): Promise<Clip[]>{
  try{
    const db=await openDB(); const tx=db.transaction('videos','readonly')
    const all:any[]=await new Promise((res,rej)=>{ const r=tx.objectStore('videos').getAll(); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error) })
    return all.sort((a,b)=>b.id-a.id).map(v=>({id:v.id, url:URL.createObjectURL(v.blob), caption:v.caption}))
  }catch{ return [] }
}
function makeThumb(videoUrl:string): Promise<string>{
  return new Promise((res)=>{
    const v=document.createElement('video'); v.src=videoUrl; v.muted=true; v.playsInline=true; v.preload='auto'; v.crossOrigin='anonymous'
    v.onloadedmetadata=()=>{ try{ v.currentTime=Math.min(0.5, v.duration/3 || 0.5) }catch{} }
    v.onseeked=()=>{
      try{
        const c=document.createElement('canvas'); c.width=270; c.height=480
        const ctx=c.getContext('2d'); if(!ctx) return res('')
        ctx.drawImage(v,0,0,270,480); res(c.toDataURL('image/jpeg',0.7))
      }catch{ res('') }
    }
    v.onerror=()=>res('')
    setTimeout(()=>res(''), 8000)
  })
}
function renderCaption(text:string){
  if(!text) return null
  const parts=text.split(/(#[\wÀ-ÿ]+)/g)
  return <span>{parts.map((p,i)=> p.startsWith('#') ? <span key={i} style={{color:'#25F4EE',fontWeight:'bold'}}>{p} </span> : <span key={i}>{p}</span> )}</span>
}

function VibraCamera({ onDone, onClose }: { onDone: (file: Blob, caption: string) => void, onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [facing, setFacing] = useState<'user' | 'environment'>('user')
  const [beauty, setBeauty] = useState(true)
  const [flash, setFlash] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [duration, setDuration] = useState(15)
  const [timer, setTimer] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [effect, setEffect] = useState('beauty')
  const [faceEffect, setFaceEffect] = useState('none')
  const [facePos, setFacePos] = useState({ x: 50, y: 48 })
  const [faceSize, setFaceSize] = useState(160)
  const [caption, setCaption] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState('')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const effects: Record<string, string> = { normal: 'none', beauty: 'brightness(1.15) contrast(1.1) saturate(1.2)', bw: 'grayscale(1) contrast(1.2)', warm: 'sepia(0.3) brightness(1.1)', cool: 'hue-rotate(180deg) saturate(1.2)', vivid: 'saturate(1.8) contrast(1.2)' }
  const startCamera = async (face: 'user' | 'environment') => {
    try { streamRef.current?.getTracks().forEach(t => t.stop()); const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: face }, audio: true }); streamRef.current = stream; if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(()=>{}) } } catch { alert('Ruhusu kamera: Allow') }
  }
  useEffect(() => { startCamera(facing); return () => streamRef.current?.getTracks().forEach(t => t.stop()) }, [])
  useEffect(() => { startCamera(facing) }, [facing])
  useEffect(() => { if (flash && streamRef.current) { const track: any = streamRef.current.getVideoTracks()[0]; try { track.applyConstraints({ advanced: [{ torch: true }] }) } catch {} } }, [flash])
  const doRecord = () => { if (isRecording) { stopRecord(); return }; if (timer === 3) { setCountdown(3); let c = 3; const iv = setInterval(() => { c--; setCountdown(c); if (c <= 0) { clearInterval(iv); setCountdown(0); startRec() } }, 1000); return }; startRec() }
  const startRec = () => { if (!streamRef.current) return; chunksRef.current = []; const rec = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' }); recorderRef.current = rec; rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }; rec.onstop = () => { const blob = new Blob(chunksRef.current, { type: 'video/webm' }); setRecordedBlob(blob); setRecordedUrl(URL.createObjectURL(blob)) }; rec.start(); setIsRecording(true); setTimeLeft(duration); const iv = setInterval(() => { setTimeLeft(v => { if (v <= 1) { clearInterval(iv); stopRecord(); return 0 } return v - 1 }) }, 1000) }
  const stopRecord = () => { recorderRef.current?.stop(); setIsRecording(false) }
  const useVideo = () => { if (!recordedBlob) return; let cap = caption.trim(); if (!cap) cap = '#Vibra #Mombasa'; else if (!cap.includes('#')) cap += ' #Vibra #Mombasa'; onDone(recordedBlob, cap) }
  const filterStyle = effects[effect] || 'none'
  const renderFace = () => {
    if (faceEffect === 'dog') return <div style={{ textAlign: 'center', lineHeight: 0.9 }}><div style={{ fontSize: faceSize * 1.3 }}>🐶</div><div style={{ fontSize: 45, marginTop: -5 }}>👅</div></div>
    if (faceEffect === 'glasses') return <div style={{ fontSize: faceSize * 1.4 }}>😎</div>
    if (faceEffect === 'crown') return <div style={{ textAlign: 'center', lineHeight: 1 }}><div style={{ fontSize: faceSize * 1.5 }}>👑</div><div style={{ fontSize: faceSize * 1.2, marginTop: 8 }}>😎</div></div>
    if (faceEffect === 'rabbit') return <div style={{ fontSize: faceSize * 1.5 }}>🐰</div>
    if (faceEffect === 'clown') return <div style={{ fontSize: faceSize * 1.5 }}>🤡</div>
    if (faceEffect === 'fire') return <div style={{ fontSize: faceSize * 1.3 }}>🔥😎🔥</div>
    if (faceEffect === 'heart') return <div style={{ textAlign: 'center' }}><div style={{ fontSize: faceSize * 1.4 }}>😍</div><div style={{ fontSize: 45 }}>💖💖💖</div></div>
    if (faceEffect === 'alien') return <div style={{ fontSize: faceSize * 1.5 }}>👽</div>
    if (faceEffect === 'cat') return <div style={{ fontSize: faceSize * 1.5 }}>🐱</div>
    return null
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px', color: '#fff', zIndex: 10 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24 }}>✕</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>🔄</button>
          <button onClick={() => { setBeauty(!beauty); setEffect(beauty ? 'normal' : 'beauty') }} style={{ background: beauty ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>✨</button>
          <button onClick={() => setTimer(t => t === 0 ? 3 : 0)} style={{ background: timer === 3 ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 14 }}>⏱️</button>
          <button onClick={() => setFlash(!flash)} style={{ background: flash ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>⚡</button>
          <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', padding: '6px 8px', borderRadius: 20, fontSize: 12, fontWeight: 'bold' }}>{speed}x</button>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: '#111', overflow: 'hidden' }}>
        {!recordedUrl ? (<video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: filterStyle, transform: facing === 'user' ? 'scaleX(-1)' : 'none' }} />) : (<video src={recordedUrl} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)}
        {faceEffect !== 'none' && !recordedUrl && (<div onTouchMove={(e) => { const rect = e.currentTarget.parentElement?.getBoundingClientRect(); if (!rect) return; const t = e.touches[0]; setFacePos({ x: ((t.clientX - rect.left) / rect.width) * 100, y: ((t.clientY - rect.top) / rect.height) * 100 }) }} style={{ position: 'absolute', left: `${facePos.x}%`, top: `${facePos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 20, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))', touchAction: 'none' }}>{renderFace()}</div>)}
        {faceEffect !== 'none' && !recordedUrl && (<p style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 12, whiteSpace: 'nowrap', zIndex: 21 }}>👆 Shika uso usogeze</p>)}
        {countdown > 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, color: '#fff', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)' }}>{countdown}</div>}
        {isRecording && <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: '#FE2C55', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 'bold' }}>🔴 {timeLeft}s</div>}
      </div>
      {!recordedUrl && (<><div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 12px 4px', background: '#000', alignItems: 'center' }}><span style={{ color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>Rangi:</span>{[['normal','Normal'],['beauty','Beauty ✨'],['bw','B&W'],['warm','Warm ☀️'],['cool','Cool ❄️'],['vivid','Vivid 🌈']].map(([key,label]) => (<button key={key} onClick={() => { setEffect(key); setBeauty(key === 'beauty') }} style={{ background: effect === key ? '#FE2C55' : '#222', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}>{label}</button>))}</div><div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 12px 6px', background: '#000', alignItems: 'center' }}><span style={{ color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>Uso:</span>{[['none','❌ Hakuna'],['dog','🐶 Mbwa'],['cat','🐱 Paka'],['glasses','😎 Miwani'],['crown','👑 Taji'],['rabbit','🐰 Sungura'],['clown','🤡 Clown'],['fire','🔥 Moto'],['heart','😍 Moyo'],['alien','👽 Alien']].map(([key,label]) => (<button key={key} onClick={() => setFaceEffect(key)} style={{ background: faceEffect === key ? '#FE2C55' : '#333', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}>{label}</button>))}</div><div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 12px 8px', background: '#000' }}><span style={{ color: '#888', fontSize: 12 }}>Ukubwa:</span><button onClick={() => setFaceSize(s => Math.max(40, s - 20))} style={{ background: '#333', color: '#fff', border: 'none', width: 30, height: 30, borderRadius: '50%' }}>-</button><span style={{ color: '#fff', fontSize: 12 }}>{faceSize}</span><button onClick={() => setFaceSize(s => Math.min(280, s + 20))} style={{ background: '#333', color: '#fff', border: 'none', width: 30, height: 30, borderRadius: '50%' }}>+</button><button onClick={() => { setFacePos({ x: 50, y: 48 }); setFaceSize(160) }} style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 12, marginLeft: 'auto' }}>🔄 Katikati</button></div></>)}
      {recordedUrl && (<div style={{ padding: '12px', background: '#000' }}><input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption... #Vibra #Mombasa" style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', fontSize: 14 }} /><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{['#Mombasa','#Vibra','#Kamata','#ForYou','#Dance'].map(t => (<button key={t} onClick={() => setCaption(v => v.includes(t) ? v.replace(t,'').trim() : (v+' '+t).trim())} style={{ background: caption.includes(t) ? '#FE2C55' : '#222', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 13 }}>{t}</button>))}</div><div style={{ display: 'flex', gap: 10, marginTop: 12 }}><button onClick={() => { setRecordedUrl(''); setRecordedBlob(null) }} style={{ flex: 1, padding: 14, borderRadius: 12, background: '#333', color: '#fff', border: 'none', fontWeight: 'bold' }}>🔄 Rekodi Tena</button><button onClick={useVideo} style={{ flex: 2, padding: 14, borderRadius: 12, background: '#FE2C55', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }}>✅ Tumia Video Hii</button></div></div>)}
      {!recordedUrl && (<div style={{ padding: '10px 12px 18px', background: '#000' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>{[15,60,180].map(s => (<button key={s} onClick={() => setDuration(s)} style={{ background: 'none', border: 'none', color: duration === s ? '#fff' : '#888', fontWeight: duration === s ? 'bold' : 'normal', fontSize: 14 }}>{s === 180 ? '3m' : s + 's'}</button>))}</div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ color: '#fff', fontSize: 13, textAlign: 'center' }}>✨<br/>Effects</span><button onClick={doRecord} style={{ width: 72, height: 72, borderRadius: '50%', background: '#FE2C55', border: '4px solid #fff', color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{isRecording ? '⏹️' : '🔴'}</button><label style={{ color: '#fff', fontSize: 13, textAlign: 'center', cursor: 'pointer' }}>📁<br/>Upload<input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onDone(f, '#Vibra #Mombasa') }} /></label></div></div>)}
    </div>
  )
}

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
  const [soundEnabled,setSoundEnabled]=useState(()=>{ try{ return localStorage.getItem('vibra_sound')!=='off' }catch{ return true } })
  const [panel,setPanel]=useState('')
  const [showCamera,setShowCamera]=useState(false)
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
  const [liveOverlay,setLiveOverlay]=useState('')
  const [liveOverlayPos,setLiveOverlayPos]=useState({ x: 50, y: 25 })
  const [liveOverlaySize,setLiveOverlaySize]=useState(180)
  const [liveOverlayType,setLiveOverlayType]=useState<'image'|'video'>('image')
  const [liveCoins,setLiveCoins]=useState(500)
  const [giftAnim,setGiftAnim]=useState('')
  const [giftFrom,setGiftFrom]=useState('')
  const [totalGifts,setTotalGifts]=useState(0)
  const [showGiftBar,setShowGiftBar]=useState(false)
  const [guests,setGuests]=useState<string[]>(['','','','','','','',''])
  const [guestNames,setGuestNames]=useState(['Guest 1','Guest 2','Guest 3','Guest 4','Guest 5','Guest 6','Guest 7','Guest 8'])
  const [talking,setTalking]=useState(0)
  const [showGuests,setShowGuests]=useState(false)
  const [battleOn,setBattleOn]=useState(false)
  const [battleTime,setBattleTime]=useState(60)
  const [myScore,setMyScore]=useState(0)
  const [guestScore,setGuestScore]=useState(0)
  const [battleWinner,setBattleWinner]=useState('')
  const [realLive,setRealLive]=useState(false)
  const [roomName,setRoomName]=useState('')
  const [jitsiKey,setJitsiKey]=useState(0)
  const hasGuest = guests.some(g=>g!=='')
  const guestName = guestNames[0]
  const photoRef=useRef<HTMLInputElement>(null)
  const [dp,setDp]=useState('')
  const [bio,setBio]=useState('Mombasa Vibes | Kamata #Mombasa #Vibra')
  const [name,setName]=useState('@MrVibra')
  const uploadRef=useRef<HTMLInputElement>(null)
  const searchRef=useRef<HTMLInputElement>(null)
  const touchY=useRef<number|null>(null)
  const lastScroll=useRef(0)
  const [thumbs,setThumbs]=useState<Record<string,string>>({})
  const [authUser,setAuthUser]=useState<VibraUser|null>(null)
  const [showAuth,setShowAuth]=useState(false)
  const [authMode,setAuthMode]=useState<'login'|'signup'>('signup')
  const [authName,setAuthName]=useState('')
  const [authEmail,setAuthEmail]=useState('')
  const [authPass,setAuthPass]=useState('')
  const [authError,setAuthError]=useState('')
  const [showPass,setShowPass]=useState(false)
  // CHAT STATE - MPYA, RANGI MOJA!
  const [chatSearch,setChatSearch]=useState('')
  const [selectedChatId,setSelectedChatId]=useState<string|null>(null)
  const [chatInput,setChatInput]=useState('')
  const [chats,setChats]=useState<Chat[]>([
    { id:'aisha', name:'Aisha Mkomani', avatar:'🧕', last:'Pole! Nimefika Old Town, tuko sawa 😊', time:'Now', unread:2, online:true, messages:[{from:'them',text:'Pole! Nimefika Old Town, tuko sawa 😊',time:'09:40'},{from:'them',text:'Video yako ya Sunset kali sana! 🔥',time:'09:41'},{from:'me',text:'Asante! Karibu Vibra ❤️',time:'09:42'}] },
    { id:'juma', name:'Juma Kilindini', avatar:'👨🏾', last:'Sawa, nimepanga dhow ride kesho asubuhi 🌊', time:'09:12', unread:0, online:true, messages:[{from:'them',text:'Sawa, nimepanga dhow ride kesho asubuhi 🌊',time:'09:12'},{from:'me',text:'Poa! Nitaweka video yake Vibra!',time:'09:13'}] },
    { id:'neema', name:'Mama Neema • Nyali', avatar:'👩🏾', last:'Asante kwa picha! Beach imekuwa poa Leo', time:'Yesterday', unread:0, online:false, messages:[{from:'them',text:'Asante kwa picha! Beach imekuwa poa Leo',time:'Yesterday'}] },
    { id:'said', name:'Said - Old Town', avatar:'🧔🏾', last:'Vibra iko poa sana! Love the new update ✨', time:'Yesterday', unread:0, online:false, messages:[{from:'them',text:'Vibra iko poa sana! Love the new update ✨',time:'Yesterday'}] },
    { id:'pwani', name:'Pwani Crew 🌴', avatar:'👥', last:'Zawadi: Tutakutana Fort Jesus at 5pm?', time:'Mon', unread:0, online:true, isGroup:true, messages:[{from:'them',text:'Zawadi: Tutakutana Fort Jesus at 5pm?',time:'Mon'},{from:'me',text:'Sawa! Nitaleta kamera 📷',time:'Mon'}] },
  ])
  const selectedChat = chats.find(c=>c.id===selectedChatId) || null
  const totalUnread = chats.reduce((s,c)=>s+c.unread,0)
  function sendChatMsg(){
    if(!chatInput.trim() || !selectedChat) return
    const text=chatInput.trim(); const time=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
    setChats(prev=>prev.map(c=> c.id===selectedChat.id ? {...c, last:text, time:'Now', unread:0, messages:[...c.messages, {from:'me',text,time}]} : c))
    setChatInput('')
    setTimeout(()=>{
      const replies=['Poa sana! 🔥','Sawa, tuko pamoja!','Hahaha 😂','Nimeipenda hiyo! ❤️','Twende Mombasa! 🌊']
      const reply=replies[Math.floor(Math.random()*replies.length)]
      setChats(prev=>prev.map(c=> c.id===selectedChat.id ? {...c, last:reply, time:'Now', messages:[...c.messages, {from:'them',text:reply,time}]} : c))
    }, 1200)
  }
  function chatWithCreator(){
    setView('chat'); setSelectedChatId('aisha'); setNotice('Uko kwenye Chat na Aisha!')
  }
  const followers = followingIds.length
  const following = followingIds.length

  useEffect(()=>{ try{ const cur=localStorage.getItem('vibra_current_user'); const savedUsers=localStorage.getItem('vibra_users'); if(cur){ const u=JSON.parse(cur); setAuthUser(u); setName(u.name.startsWith('@')?u.name:'@'+u.name.replace('@','')); setAuthName(u.name); setShowAuth(false) } else if(savedUsers && JSON.parse(savedUsers).length>0){ setAuthMode('login'); setShowAuth(true) } else { setShowAuth(true) } }catch{ setShowAuth(true) } },[])
  useEffect(()=>{ if(!notice) return; const t=setTimeout(()=>setNotice(''), 3000); return ()=>clearTimeout(t) },[notice])
  function doSignup(){ if(!authName.trim() || !authEmail.trim() || !authPass.trim()){ setAuthError('Jaza Jina, Email na Password zote'); return }; if(authPass.length<4){ setAuthError('Password iwe angalau herufi 4'); return }; try{ const users: VibraUser[] = JSON.parse(localStorage.getItem('vibra_users')||'[]'); if(users.find(u=>u.email.toLowerCase()===authEmail.toLowerCase())){ setAuthError('Hii Email tayari imeshatumika. Bonyeza Login.'); return }; const newUser: VibraUser = { name: authName.trim(), email: authEmail.trim().toLowerCase(), pass: authPass }; users.push(newUser); localStorage.setItem('vibra_users', JSON.stringify(users)); localStorage.setItem('vibra_current_user', JSON.stringify(newUser)); localStorage.setItem('vibra_session', 'active'); localStorage.setItem('vibra_name', '@'+authName.trim().replace('@','')); setAuthUser(newUser); setName('@'+authName.trim().replace('@','')); setAuthError(''); setShowAuth(false); setNotice('Karibu Vibra!') }catch{ setAuthError('Imeshindwa kuhifadhi.') } }
  function doLogin(){ if(!authEmail.trim() || !authPass.trim()){ setAuthError('Jaza Email na Password'); return }; try{ const users: VibraUser[] = JSON.parse(localStorage.getItem('vibra_users')||'[]'); const found=users.find(u=>u.email.toLowerCase()===authEmail.trim().toLowerCase() && u.pass===authPass); if(!found){ setAuthError('Email au Password si sahihi.'); return }; localStorage.setItem('vibra_current_user', JSON.stringify(found)); localStorage.setItem('vibra_session', 'active'); localStorage.setItem('vibra_name', '@'+found.name.replace('@','')); setAuthUser(found); setName('@'+found.name.replace('@','')); setAuthError(''); setShowAuth(false); setNotice('Karibu tena!') }catch{ setAuthError('Imeshindwa kuingia.') } }
  function doLogout(){ if(!confirm('Una uhakika unataka kutoka?')) return; localStorage.removeItem('vibra_current_user'); localStorage.removeItem('vibra_session'); setAuthUser(null); setAuthName(''); setAuthEmail(''); setAuthPass(''); setShowAuth(true); setView('home'); setNotice('Umetoka. Ingia tena au tengeneza akaunti mpya.') }
  useEffect(()=>{ const unlock=()=>{ const v=videoRef.current; if(v && soundEnabled){ v.muted=false; v.volume=1; v.play().catch(()=>{}) } }; document.addEventListener('touchstart', unlock); document.addEventListener('click', unlock); return ()=>{ document.removeEventListener('touchstart', unlock); document.removeEventListener('click', unlock) } },[soundEnabled])
  useEffect(()=>{ let alive=true; setCreatorAvatar(null); setAvatarFailed(false); if(user?.id){void readCreatorAvatar(user.id).then(url=>{if(alive) setCreatorAvatar(url)})}; return ()=>{alive=false} },[user?.id])
  const profileAvatar=avatarFailed?'':creatorAvatar||dp
  useEffect(()=>{ setCoins(demoCoinBalance(localStorage.getItem('vibra_coins'))); setDp(localStorage.getItem('vibra_dp')||''); setBio(localStorage.getItem('vibra_bio')||'Mombasa Vibes | Kamata #Mombasa #Vibra'); if(!localStorage.getItem('vibra_current_user')){ setName(localStorage.getItem('vibra_name')||'@MrVibra') }; try{ const s=JSON.parse(localStorage.getItem('vibra_comments')||'{}'); if(Object.keys(s).length>0) setComments(s) }catch{}; void loadVideosDB().then(v=>{ if(v.length>0) setMyVideos(v) }) },[])
  useEffect(()=>{ let alive=true; readCloudVideos().then(rows=>{if(!alive) return; setCloudClips(rows.map((r:CloudVideo)=>({id:r.id,url:r.video_url,caption:r.caption||''}))); setCloudReady(true)}).catch(()=>{}); return ()=>{alive=false} },[])
  useEffect(()=>{ const all=[...myVideos, ...cloudClips]; all.forEach(async v=>{ const key=String(v.id??v.url); if(thumbs[key]) return; const t=await makeThumb(v.url); if(t) setThumbs(prev=>({...prev, [key]:t})) }) },[myVideos, cloudClips])

  const defaultVid:Clip={url:'https://videos.pexels.com/video-files/1806922/1806922-hd_1920_1080_24fps.mp4',caption:'Karibu Vibra! #Vibra #Mombasa #Kamata'}
  const baseFeed:Clip[] = myVideos.length>0 ? [...myVideos, ...cloudClips.filter(c=>!myVideos.some(m=>String(m.id)===String(c.id)))] : (cloudReady?cloudClips:[defaultVid])
  const filteredClips=search?baseFeed.filter(v=>v.caption.toLowerCase().includes(search.toLowerCase())):baseFeed
  const feed=tab==='following'?filteredClips.filter(v=>followingIds.includes(String(v.id??v.url))):filteredClips
  const current=feed.length>0?feed[idx%feed.length]:undefined
  const clipKey=String(current?.id??current?.url??'empty')
  const liked=likedIds.includes(clipKey)
  const saved=savedIds.includes(clipKey)
  const isFollowing=followingIds.includes(clipKey)
  const isMyVideo = myVideos.some(v => String(v.id ?? v.url) === clipKey)
  const baseLikes = isMyVideo ? 247 : 0
  const likes = baseLikes + (liked ? 1 : 0)
  const commentCount=(comments[clipKey]||[]).length
  const shareText=(current?.caption||'Angalia hii video kwenye Vibra!')+' '+window.location.href
  const shareUrl=encodeURIComponent(window.location.href)
  const shareMsg=encodeURIComponent(shareText)

  function nextVideo(){ setIdx(v=> v+1 ) }
  function prevVideo(){ setIdx(v=> Math.max(0, v-1) ) }
  function onTouchStart(e:React.TouchEvent){ touchY.current=e.touches[0].clientY }
  function onTouchEnd(e:React.TouchEvent){ if(touchY.current===null) return; const dy=touchY.current - e.changedTouches[0].clientY; if(Math.abs(dy)>50){ if(dy>0) nextVideo(); else prevVideo() }; touchY.current=null }
  function onWheel(e:React.WheelEvent){ const now=Date.now(); if(now-lastScroll.current<500) return; lastScroll.current=now; if(e.deltaY>0) nextVideo(); else prevVideo() }
  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{ if(view!=='home' || panel) return; if(e.key==='ArrowDown'){ e.preventDefault(); nextVideo() } if(e.key==='ArrowUp'){ e.preventDefault(); prevVideo() } }; window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey) },[view,panel])
  function toggleSound(){ const v=videoRef.current; if(!v) return; const next=!soundEnabled; setSoundEnabled(next); localStorage.setItem('vibra_sound', next?'on':'off'); v.muted=!next; v.volume=1; if(next){ v.play().catch(()=>{}) }; setNotice(next?'Sauti imewashwa 🔊':'Sauti imezimwa 🔇') }
  function toggleLike(){ if(!authUser){ setShowAuth(true); return }; setLikedIds(v=>{ const n=v.includes(clipKey)?v.filter(id=>id!==clipKey):[...v,clipKey]; localStorage.setItem('vibra_liked', JSON.stringify(n)); return n }) }
  function toggleSave(){ setSavedIds(v=>{ const already=v.includes(clipKey); const n=already?v.filter(id=>id!==clipKey):[...v,clipKey]; localStorage.setItem('vibra_saved', JSON.stringify(n)); setNotice(already?'Imeondolewa':'Ime-save! ✅'); return n }) }
  function toggleFollow(){ setFollowingIds(v=>{ const already=v.includes(clipKey); const n=already?v.filter(id=>id!==clipKey):[...v,clipKey]; localStorage.setItem('vibra_following',JSON.stringify(n)); setNotice(already?'Ume-unfollow':'Umemfollow!'); return n }) }
  function copyLink(){navigator.clipboard?.writeText(window.location.href).then(()=>setNotice('Link imekopiwa!')).catch(()=>setNotice(window.location.href))}
  function addComment(){ if(!comment.trim()) return; const text=comment.trim(); setComments(v=>{ const n={...v,[clipKey]:[...(v[clipKey]||[]),text]}; localStorage.setItem('vibra_comments',JSON.stringify(n)); return n }); setComment(''); setNotice('Comment imetumwa!') }
  useEffect(()=>{ const video=videoRef.current; if(!video) return; if(view!=='home' || panel==='Share' || panel==='Comments' || panel==='LIVE' || panel==='Rewards' || panel==='Lyrics'){ video.pause(); return }; video.muted=!soundEnabled; video.volume=1; video.play().catch(()=>{}) },[current,soundEnabled,idx,view,panel])
  useEffect(()=>{ const stop=()=>{ const v=videoRef.current; if(v){ v.pause() } }; const onHide=()=>{ if(document.hidden){ stop() } }; document.addEventListener('visibilitychange',onHide); window.addEventListener('pagehide',stop); return ()=>{ document.removeEventListener('visibilitychange',onHide); window.removeEventListener('pagehide',stop) } },[])

  const GIFTS = [
    { emoji:'🌹', name:'Rose', cost:1 },
    { emoji:'❤️', name:'Heart', cost:5 },
    { emoji:'🔥', name:'Moto', cost:10 },
    { emoji:'🎁', name:'Gift', cost:20 },
    { emoji:'💎', name:'Almasi', cost:50 },
    { emoji:'👑', name:'Taji', cost:100 },
    { emoji:'🚀', name:'Rocket', cost:200 },
  ]
  function sendGift(g:{emoji:string,name:string,cost:number}, to:'me'|'guest'='me'){
    if(liveCoins < g.cost){ setNotice('Coins hazitoshi! Una '+liveCoins); return }
    setLiveCoins(c=>c-g.cost); setTotalGifts(t=>t+g.cost)
    setGiftAnim(g.emoji); setGiftFrom(g.name+' - '+g.cost+' Coins')
    if(battleOn){ if(to==='me') setMyScore(s=>s+g.cost); else setGuestScore(s=>s+g.cost) } else { setMyScore(s=>s+g.cost) }
    setLiveChats(v=>[...v, `🎁 Mtu ametuma ${g.emoji} ${g.name} (${g.cost})`])
    setTimeout(()=>setGiftAnim(''), 2500)
  }
  function startBattle(){
    if(!hasGuest && !realLive){ setNotice('Weka Guest kwanza! Bonyeza + kwenye slot au LIVE REAL'); return }
    setBattleOn(true); setBattleTime(60); setMyScore(0); setGuestScore(0); setBattleWinner(''); setNotice('⚔️ BATTLE IMEANZA! 60s!')
  }
  useEffect(()=>{
    if(!battleOn) return
    if(battleTime<=0){ setBattleOn(false); const w = myScore>=guestScore ? name : guestName; setBattleWinner(w); setNotice('🏆 '+w+' ameshinda Battle!'); return }
    const t=setTimeout(()=>setBattleTime(v=>v-1),1000); return ()=>clearTimeout(t)
  },[battleOn,battleTime])
  useEffect(()=>{
    if(!battleOn || (!hasGuest && !realLive)) return
    const iv=setInterval(()=>{ if(Math.random()>0.4){ const g=GIFTS[Math.floor(Math.random()*4)]; setGuestScore(s=>s+g.cost); setLiveChats(v=>[...v, `🎁 ${guestNames[Math.floor(Math.random()*guestNames.length)]} kapata ${g.emoji} ${g.name}`]) } },4000)
    return ()=>clearInterval(iv)
  },[battleOn,hasGuest,realLive])

  async function startLive(){
    if(!authUser){ setShowAuth(true); return }
    setPanel('LIVE')
    try{ const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true}); liveStream.current=stream; setLiveOn(true); setTimeout(()=>{ if(liveRef.current){ liveRef.current.srcObject=stream; liveRef.current.play().catch(()=>{}) } },100) }catch{ setNotice('Ruhusu kamera: Allow'); setLiveOn(false) }
  }
  function startRealLive(){
    const clean = name.replace('@','').replace(/[^a-zA-Z0-9]/g,'') || 'MrVibra'
    const room = 'Vibra-' + clean + '-' + Math.floor(Math.random()*9999)
    setRoomName(room); setRealLive(true); setPanel('LIVE'); setJitsiKey(k=>k+1)
    setNotice('Tuma link hii kwa marafiki: meet.jit.si/' + room + ' - Ukisema Waiting, bonyeza Log-in na Google mara moja uwe Moderator!')
  }
  function stopLive(){ liveStream.current?.getTracks().forEach(t=>t.stop()); liveStream.current=null; setLiveOn(false); setPanel(''); setLiveOverlay(''); setBattleOn(false); setGuests(['','','','','','','','']); setShowGiftBar(false); setTalking(0); setShowGuests(false); setRealLive(false); setRoomName('') }

  async function uploadVideo(file:File|Blob|undefined, forcedCaption?:string){
    if(!file) return; if(file instanceof File && !file.type.startsWith('video/')){setNotice('Chagua video.');return}; if(uploading) return; setUploading(true)
    try{ let finalCaption=(forcedCaption || caption).trim(); if(!finalCaption) finalCaption = '#Vibra #Mombasa'; else if(!finalCaption.includes('#')) finalCaption = finalCaption + ' #Vibra #Mombasa'; const newId=Date.now(); await saveVideoDB(newId, file as Blob, finalCaption); const newUrl=URL.createObjectURL(file as Blob); const newClip:Clip={id:newId, url:newUrl, caption:finalCaption}; const thumb=await makeThumb(newUrl); if(thumb) setThumbs(prev=>({...prev, [String(newId)]:thumb})); setMyVideos(list=>[newClip,...list]); if(cloudReady){ try{ await uploadCloudVideo(file as File,name,finalCaption) }catch{} }; setCaption(''); setSearch(''); setIdx(0); setView('home'); setPanel(''); setNotice('Video imepakiwa! ✅') }catch(error){ setNotice('Video imehifadhiwa.') } finally{setUploading(false)}
  }
  function shareVideo(){if(!current) return; setPanel('Share')}
  const uploadInput=<input ref={uploadRef} type="file" accept="video/*" style={{display:'none'}} onChange={e=>uploadVideo(e.target.files?.[0])} />
  async function choosePhoto(file:File|undefined){ if(!file) return; setSavingPhoto(true); try{ if(user?.id){ const url=await saveCreatorAvatar(user.id,file); setCreatorAvatar(url); setAvatarFailed(false); setDp(url); localStorage.setItem('vibra_dp',url); setNotice('Picha imehifadhiwa!') } else{ const dataUrl=await readLocalPhoto(file); setDp(dataUrl); localStorage.setItem('vibra_dp',dataUrl); setNotice('Picha imehifadhiwa.') } }catch(error){setNotice('Picha haijahifadhiwa.')} finally{setSavingPhoto(false)} }
  const saveProfile=()=>{localStorage.setItem('vibra_dp',dp);localStorage.setItem('vibra_bio',bio);localStorage.setItem('vibra_name',name);setShowEdit(false);setNotice('Profile imehifadhiwa!')}
  const cameraPanel = showCamera ? <VibraCamera onClose={()=>setShowCamera(false)} onDone={async (blob, cap)=>{ setShowCamera(false); await uploadVideo(blob, cap) }} /> : null
  const profileVideos=cloudReady?[...myVideos,...cloudClips]:myVideos
  const totalViews = profileVideos.length * 1000 + likedIds.length * 50 + savedIds.length * 20
  const viewsTo1M = Math.max(0, 1000000 - totalViews)
  const progress1M = Math.min(100, (totalViews / 1000000) * 100)
  const allVideosForSaved=[...baseFeed, ...myVideos, ...cloudClips].filter((v,i,arr)=>arr.findIndex(x=>String(x.id??x.url)===String(v.id??v.url))===i)
  const savedVideos=allVideosForSaved.filter(v=>savedIds.includes(String(v.id??v.url)))
  function openClip(clip:Clip){const index=baseFeed.findIndex(entry=>entry.url===clip.url); if(index>=0){setIdx(index);setView('home')} else { setMyVideos(prev=>[clip,...prev]); setIdx(0); setView('home') }}
  const jitsiUrl = roomName ? `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.requireDisplayName=false&userInfo.displayName=${encodeURIComponent(name)}` : ''

  const authScreen = showAuth && (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',padding:20,paddingTop:40,color:'#fff',overflowY:'auto'}}>
      <div style={{fontSize:50}}>🎬</div><h1 style={{fontSize:32,fontWeight:'bold',marginTop:8}}>VIBRA</h1><p style={{opacity:0.8,marginBottom:6,textAlign:'center'}}>Mombasa Vibes | Kamata</p><p style={{opacity:0.6,marginBottom:20,textAlign:'center',fontSize:12}}>🔒 Akaunti yako itabaki imeingia kudumu</p>
      <div style={{display:'flex',gap:10,marginBottom:20}}><button onClick={()=>{setAuthMode('signup');setAuthError('')}} style={{padding:'10px 24px',borderRadius:20,border:'none',background:authMode==='signup'?'#FE2C55':'#333',color:'#fff',fontWeight:'bold'}}>Sign Up</button><button onClick={()=>{setAuthMode('login');setAuthError('')}} style={{padding:'10px 24px',borderRadius:20,border:'none',background:authMode==='login'?'#FE2C55':'#333',color:'#fff',fontWeight:'bold'}}>Login</button></div>
      <div style={{width:'100%',maxWidth:340,display:'flex',flexDirection:'column',gap:12,background:'#111',padding:16,borderRadius:16,border:'1px solid #333'}}>{authMode==='signup'&&<><label style={labelStyle}>👤 Jina lako</label><input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Mfano: MrVibra" style={inputStyle} /></>}<label style={labelStyle}>📧 Email</label><input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Mfano: wewe@gmail.com" type="email" style={inputStyle} /><label style={labelStyle}>🔒 Password</label><div style={{display:'flex',gap:8}}><input value={authPass} onChange={e=>setAuthPass(e.target.value)} placeholder="Angalau herufi 4" type={showPass?'text':'password'} style={{...inputStyle, flex:1}} /><button onClick={()=>setShowPass(v=>!v)} style={{background:'#333',color:'#fff',border:'none',borderRadius:12,padding:'0 12px'}}>{showPass?'🙈':'👁️'}</button></div>{authError&&<p style={{color:'#ff6b6b',fontSize:13,textAlign:'center',background:'#331111',padding:8,borderRadius:8}}>{authError}</p>}<button onClick={authMode==='signup'?doSignup:doLogin} style={{padding:14,borderRadius:12,border:'none',background:'#FE2C55',color:'#fff',fontWeight:'bold',fontSize:16,marginTop:4}}>{authMode==='signup'?'Tengeneza Akaunti 🎉':'Ingia Kudumu 👋'}</button><button onClick={()=>{setShowAuth(false); setNotice('Umeingia kama Mgeni.')}} style={{padding:12,borderRadius:12,border:'1px solid #555',background:'transparent',color:'#fff'}}>Endelea kama Mgeni 👀</button></div>
      <p style={{fontSize:12,opacity:0.6,marginTop:16,textAlign:'center'}}>📩 Contact Creators: mrvibraworldwide@gmail.com<br/>🏆 Fikisha 1M Views ujilipie!</p>
    </div>
  )

  // ===== CHAT VIEW - MPYA! =====
  if(view==='chat'){
    const filteredChats = chatSearch ? chats.filter(c=>c.name.toLowerCase().includes(chatSearch.toLowerCase())) : chats
    if(selectedChat){
      return <div style={{height:'100dvh',display:'flex',flexDirection:'column',background:'#000',color:'#fff'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px',background:'#111',borderBottom:'1px solid #333'}}>
          <button onClick={()=>setSelectedChatId(null)} style={{background:'none',border:'none',color:'#fff',fontSize:20}}>←</button>
          <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(45deg,#FE2C55,#25F4EE)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{selectedChat.avatar}</div>
          <div style={{flex:1}}><b style={{fontSize:14}}>{selectedChat.name}</b><p style={{fontSize:11,margin:0,color: selectedChat.online ? '#25F4EE' : '#888'}}>{selectedChat.online ? '● Online' : '○ Offline'}</p></div>
          <button onClick={()=>setNotice('Video Call inakuja Version 2!')} style={{background:'none',border:'none',fontSize:20}}>📹</button>
          <button onClick={()=>setNotice('Voice Call inakuja Version 2!')} style={{background:'none',border:'none',fontSize:20}}>📞</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:12,display:'flex',flexDirection:'column',gap:8,background:'#0a0a0a'}}>
          {selectedChat.messages.map((m,i)=>(
            <div key={i} style={{alignSelf: m.from==='me'?'flex-end':'flex-start',maxWidth:'75%',background: m.from==='me' ? '#FE2C55' : '#222',color:'#fff',padding:'10px 12px',borderRadius: m.from==='me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',fontSize:14}}>{m.text}<div style={{fontSize:10,opacity:0.7,textAlign:'right',marginTop:2}}>{m.time} {m.from==='me' ? '✓✓' : ''}</div></div>
          ))}
          <p style={{textAlign:'center',fontSize:11,opacity:0.4,marginTop:10}}>🔒 Ujumbe umelindwa • Vibra Chat</p>
        </div>
        <div style={{display:'flex',gap:8,padding:10,background:'#111',alignItems:'center'}}>
          <button onClick={()=>setNotice('Picha na Voice Note inakuja Version 2!')} style={{background:'#222',border:'none',color:'#fff',width:40,height:40,borderRadius:'50%',fontSize:18}}>+</button>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') sendChatMsg() }} placeholder="Andika ujumbe..." style={{flex:1,padding:12,borderRadius:24,border:'none',background:'#222',color:'#fff',outline:'none'}} />
          <button onClick={sendChatMsg} style={{background:'#FE2C55',border:'none',color:'#fff',width:44,height:44,borderRadius:'50%',fontSize:18}}>➤</button>
        </div>
        <nav style={{display:'flex',justifyContent:'space-around',padding:12,background:'#000',borderTop:'1px solid #333'}}><Button variant="ghost" onClick={()=>{setView('home');setSelectedChatId(null)}}>🎬 Videos</Button><Button variant="ghost" onClick={()=>setSelectedChatId(null)} style={{color:'#FE2C55',fontWeight:'bold'}}>💬 Chat {totalUnread>0?`(${totalUnread})`:''}</Button><Button variant="ghost" onClick={()=>setShowCamera(true)}>+</Button><Button variant="ghost" onClick={startLive}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button></nav>
        {notice&&<div style={noticeStyle}>{notice}</div>}
      </div>
    }
    return <div style={{height:'100dvh',display:'flex',flexDirection:'column',background:'#000',color:'#fff'}}>{authScreen}
      <div style={{padding:'16px 16px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1 style={{fontSize:26,fontWeight:'bold',margin:0}}>Vibra <span style={{color:'#FE2C55'}}>Chat</span> <span style={{color:'#25F4EE'}}>💬</span></h1><span style={{fontSize:12,color:'#25F4EE'}}>Karibu Mombasa • {chats.filter(c=>c.online).length} online</span></div>
        <input value={chatSearch} onChange={e=>setChatSearch(e.target.value)} placeholder="🔍 Search chats, messages..." style={{width:'100%',padding:12,borderRadius:24,border:'1px solid #25F4EE',background:'#111',color:'#fff',marginTop:12,outline:'none',boxSizing:'border-box'}} />
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 0 0'}}>
        {filteredChats.map(c=>(
          <button key={c.id} onClick={()=>{ setSelectedChatId(c.id); setChats(prev=>prev.map(x=> x.id===c.id ? {...x, unread:0} : x)) }} style={{width:'100%',display:'flex',gap:12,alignItems:'center',padding:'12px 16px',background:'none',border:'none',color:'#fff',textAlign:'left',cursor:'pointer'}}>
            <div style={{position:'relative'}}><div style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(45deg,#FE2C55,#25F4EE)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>{c.avatar}</div>{c.online && <span style={{position:'absolute',bottom:2,right:2,width:12,height:12,borderRadius:'50%',background:'#25F4EE',border:'2px solid #000'}} />}</div>
            <div style={{flex:1,minWidth:0}}><div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:14}}>{c.name}</b><span style={{fontSize:11,color:'#888'}}>{c.time}</span></div><p style={{fontSize:13,margin:'2px 0 0',opacity:0.7,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.last}</p></div>
            {c.unread>0 && <span style={{background:'#FE2C55',color:'#fff',minWidth:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold',padding:'0 6px'}}>{c.unread}</span>}
          </button>
        ))}
        <button onClick={()=>{ const n=prompt('Jina la rafiki mpya?'); if(n){ const id='chat'+Date.now(); setChats(prev=>[{id, name:n, avatar:'👤', last:'Sema! Karibu Vibra Chat 👋', time:'Now', unread:0, online:true, messages:[{from:'them',text:'Sema! Karibu Vibra Chat 👋',time:'Now'}]}, ...prev]); setSelectedChatId(id) } }} style={{width:'90%',margin:'16px 5%',padding:12,borderRadius:24,border:'1px dashed #FE2C55',background:'transparent',color:'#FE2C55',fontWeight:'bold'}}>+ Chat Mpya</button>
      </div>
      <nav style={{display:'flex',justifyContent:'space-around',padding:12,background:'#000',borderTop:'1px solid #333'}}><Button variant="ghost" onClick={()=>setView('home')}>🎬 Videos</Button><Button variant="ghost" style={{color:'#FE2C55',fontWeight:'bold'}}>💬 Chat {totalUnread>0?`(${totalUnread})`:''}</Button><Button variant="ghost" onClick={()=>setShowCamera(true)}>+</Button><Button variant="ghost" onClick={startLive}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>👤 Me</Button></nav>
      {notice&&<div style={noticeStyle}>{notice}</div>}
      {cameraPanel}
    </div>
  }

  if(view==='me'){
    const listToShow=meTab==='saved'?savedVideos:meTab==='liked'?allVideosForSaved.filter(v=>likedIds.includes(String(v.id??v.url))):profileVideos
    return <div data-ready={hydrated} className="vibra-app bg-video text-video-text" style={{overflowY:'auto'}}>{authScreen}{cameraPanel}<header className="flex items-center justify-between p-4"><Button variant="ghost" onClick={()=>setView('home')}>← Back</Button><span style={{fontWeight:'bold'}}>Vibra</span><Button variant="ghost" onClick={()=>setShowCamera(true)}>📷</Button></header><section className="px-4 text-center" style={{paddingBottom:16}}><div style={{position:'relative',width:110,height:110,margin:'0 auto'}}><Button variant="ghost" className="profile-avatar bg-video-glass" style={{width:110,height:110,borderRadius:'50%',overflow:'hidden',fontSize:40}} onClick={()=>photoRef.current?.click()}>{profileAvatar?<img src={profileAvatar} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover'}} />:'👤'}</Button><span style={{position:'absolute',bottom:0,right:0,background:'#fff',color:'#000',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center'}}>+</span></div><h1 className="font-bold" style={{fontSize:22,marginTop:10}}>{name}</h1><p style={{opacity:0.8}}>{authUser?.email||'Guest - Ingia kuona email'}</p><p style={{opacity:0.8}}>{renderCaption(bio)}</p>
    <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:12,flexWrap:'wrap'}}>
      <Button variant="ghost" className="bg-video-glass text-video-text" onClick={()=>setShowEdit(true)}>✏️ Edit</Button>
      <Button variant="ghost" className="bg-video-glass text-video-text" onClick={copyLink}>🔗 Share</Button>
      <Button onClick={chatWithCreator} style={{background:'#25F4EE',color:'#000',fontWeight:'bold'}}>💬 Chat</Button>
      {authUser ? <Button onClick={doLogout} style={{background:'#FE2C55',color:'#fff',fontWeight:'bold'}}>🚪 Logout</Button> : <Button onClick={()=>setShowAuth(true)} style={{background:'#FE2C55',color:'#fff',fontWeight:'bold'}}>🔑 Login / Sign Up</Button>}
      <Button onClick={()=>{ setNotice('Wasiliana: mrvibraworldwide@gmail.com'); window.location.href='mailto:mrvibraworldwide@gmail.com?subject=Contact Creator - Vibra - '+name }} style={{background:'#25F4EE',color:'#000',fontWeight:'bold'}}>📩 Contact Creators</Button>
    </div>
    <div style={{background:'linear-gradient(45deg,#FFD700,#FF8A00)',color:'#000',borderRadius:12,padding:12,margin:'14px 0 0',textAlign:'left'}}>
      <b>🏆 VIBRA CREATOR FUND</b>
      <p style={{fontSize:12,margin:'4px 0'}}>Fikisha <b>1,000,000 Views</b> ujilipie! 💰</p>
      <div style={{background:'rgba(0,0,0,0.2)',height:10,borderRadius:10,overflow:'hidden'}}><div style={{width: progress1M+'%',background:'#000',height:'100%'}} /></div>
      <p style={{fontSize:11,marginTop:5}}>Views zako: {totalViews.toLocaleString()} / 1,000,000 • {progress1M.toFixed(2)}% • {viewsTo1M.toLocaleString()} zimebaki!</p>
      <button onClick={()=>{ setNotice('Umeomba kulipwa! Tutakujibu kwa email.'); window.location.href='mailto:mrvibraworldwide@gmail.com?subject=Nataka Kulipwa - 1M Views - '+name+' - Views '+totalViews }} style={{background:'#000',color:'#FFD700',border:'none',padding:'8px 14px',borderRadius:20,fontWeight:'bold',fontSize:12,marginTop:4}}>💰 Omba Kulipwa</button>
    </div>
    <div style={{background:'#111',border:'1px solid #333',borderRadius:12,padding:10,marginTop:10,display:'flex',gap:10,alignItems:'center',textAlign:'left'}}>
      <span style={{fontSize:28}}>📢</span>
      <div style={{flex:1}}><b style={{fontSize:13}}>Tangaza Biashara Yako Hapa!</b><p style={{fontSize:11,opacity:0.7,margin:0}}>Watu 10,000+ wanaona Vibra kila siku • Tsh 10,000 / siku</p></div>
      <button onClick={()=>{ window.location.href='mailto:mrvibraworldwide@gmail.com?subject=Nataka Tangazo Vibra' }} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'8px 12px',borderRadius:20,fontSize:12,fontWeight:'bold'}}>Tangaza</button>
    </div>
    <div className="flex justify-center gap-6" style={{marginTop:16}}><div><p style={{fontWeight:'bold',fontSize:18}}>{following}</p><p style={{opacity:0.7}}>Following</p></div><div><p style={{fontWeight:'bold',fontSize:18}}>{followers}</p><p style={{opacity:0.7}}>Followers</p></div><div><p style={{fontWeight:'bold',fontSize:18}}>{profileVideos.length}</p><p style={{opacity:0.7}}>Videos</p></div><div><p style={{fontWeight:'bold',fontSize:18}}>{savedIds.length}</p><p style={{opacity:0.7}}>Saved</p></div></div><div style={{display:'flex',justifyContent:'center',gap:20,marginTop:16,borderBottom:'1px solid #333',paddingBottom:8}}><Button variant="ghost" onClick={()=>setMeTab('videos')}>🎬 Videos ({profileVideos.length})</Button><Button variant="ghost" onClick={()=>setMeTab('liked')}>❤️ Liked ({likedIds.length})</Button><Button variant="ghost" onClick={()=>setMeTab('saved')}>🔖 Saved ({savedIds.length})</Button></div></section><section className="p-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,paddingBottom:100}}>{listToShow.map(v=>{ const key=String(v.id??v.url); const thumb=thumbs[key]; return (<button key={key} onClick={()=>openClip(v)} style={{position:'relative',aspectRatio:'9/16',overflow:'hidden',borderRadius:10,background:'#222',border:'none',padding:0}}>{thumb ? <img src={thumb} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <video src={v.url} muted playsInline preload="auto" onLoadedData={(e)=>{ try{ if(e.currentTarget.currentTime===0) e.currentTarget.currentTime=0.5 }catch{} }} style={{width:'100%',height:'100%',objectFit:'cover',background:'#000'}} />}<span style={{position:'absolute',left:6,bottom:6,right:6,color:'#fff',fontSize:11,textAlign:'left',textShadow:'0 1px 4px #000'}}>{v.caption||'Video'}</span><span style={{position:'absolute',top:6,right:6,fontSize:12}}>▶️</span></button>)})}</section>{listToShow.length===0&&<p className="p-6 text-center">Hakuna video bado.</p>}<VibraBanner placement="profile" /><VibraSheet title="Edit Profile" open={showEdit} onClose={()=>setShowEdit(false)}><input ref={photoRef} type="file" accept="image/*" aria-label="Choose profile photo" onChange={e=>choosePhoto(e.target.files?.[0])} /><Button type="button" className="sheet-command w-full" disabled={savingPhoto} onClick={()=>photoRef.current?.click()}>{savingPhoto?'Inapakia...':'📸 Badilisha Picha'}</Button><input aria-label="Username" value={name} onChange={e=>setName(e.target.value)} /><input aria-label="Bio" value={bio} onChange={e=>setBio(e.target.value)} /><Button onClick={saveProfile}>Save Profile</Button><Button onClick={doLogout} style={{background:'#FE2C55',color:'#fff'}}>🚪 Logout</Button><Button onClick={()=>{ window.location.href='mailto:mrvibraworldwide@gmail.com?subject=Contact Creator' }} style={{background:'#25F4EE',color:'#000'}}>📩 Contact Creators</Button></VibraSheet>{notice&&<div style={noticeStyle}>{notice}</div>}<nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3"><Button variant="ghost" onClick={()=>setView('home')}>🎬 Videos</Button><Button variant="ghost" onClick={()=>setView('chat')}>💬 Chat {totalUnread>0?`(${totalUnread})`:''}</Button><Button variant="ghost" aria-label="Upload" onClick={()=>setShowCamera(true)}>+</Button><Button variant="ghost" onClick={startLive}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')}>Me</Button></nav></div>
  }

  return(
    <div data-ready={hydrated} className="vibra-app home-bottom-scroll bg-video text-video-text" style={{overflow:'hidden'}}>
      {authScreen}{cameraPanel}
      <div ref={stageRef} className={'home-video-stage '+(idx%feed.length)} style={{overflow:'hidden',position:'relative'}} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onWheel={onWheel}>
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10,padding:'0 8px'}}><div style={{display:'flex',gap:8,alignItems:'center'}}><input ref={searchRef} aria-label="Search videos" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find related content..." style={{fontSize:13}} /><button onClick={()=>setShowCamera(true)} style={{background:'#222',color:'#fff',border:'1px solid #fff',width:38,height:38,borderRadius:'50%',fontSize:16}}>📷</button><span className="text-xs whitespace-nowrap" style={{fontSize:11}}>{coins} Coins</span></div><div style={{display:'flex',justifyContent:'center',gap:8,marginTop:8,alignItems:'center'}}><Button variant="ghost" onClick={()=>{setTab('following');setIdx(0)}} style={{fontWeight:tab==='following'?'bold':'normal',fontSize:13,padding:'6px 10px'}}>Following</Button><Button variant="ghost" onClick={()=>{setTab('foryou');setIdx(0)}} style={{fontWeight:tab==='foryou'?'bold':'normal',fontSize:13,padding:'6px 10px'}}>For You</Button>{authUser?<button onClick={()=>setView('me')} style={{background:'#333',color:'#fff',border:'none',padding:'6px 10px',borderRadius:20,fontSize:11}}>{name}</button>:<button onClick={()=>setShowAuth(true)} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'6px 10px',borderRadius:20,fontSize:11,fontWeight:'bold'}}>Login / Sign Up</button>}</div></div>
        {current?<video ref={videoRef} className="feed-video absolute inset-0" src={current.url} loop playsInline autoPlay preload="auto" onClick={toggleSound} />:<p className="p-6 text-center" style={{paddingTop:180}}>Hakuna video.</p>}
        <div style={{position:'absolute',right:12,top:92,zIndex:70}}><button onClick={toggleSound} style={{width:44,height:44,borderRadius:'50%',background:'rgba(0,0,0,0.7)',color:'#fff',border:'1px solid #fff',fontSize:18}}>{soundEnabled?'🔊':'🔇'}</button></div>
        {!soundEnabled&&(<button onClick={toggleSound} style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:60,background:'rgba(0,0,0,0.75)',color:'#fff',border:'1px solid #fff',padding:'12px 18px',borderRadius:30,fontSize:14,fontWeight:'bold'}}>🔇 Bonyeza kwa Sauti 🔊</button>)}
        <div style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',zIndex:40,display:'flex',flexDirection:'column',gap:8,opacity:0.8}}><button onClick={prevVideo} style={{width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.5)',color:'#fff',border:'1px solid #fff',fontSize:12}}>↑</button><button onClick={nextVideo} style={{width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.5)',color:'#fff',border:'1px solid #fff',fontSize:12}}>↓</button></div>
        <div style={{position:'absolute',left:12,bottom:110,right:70,zIndex:45}}><p style={{fontWeight:'bold',fontSize:14,color:'#fff',textShadow:'0 1px 4px #000'}}>{name}</p><p style={{fontSize:13,lineHeight:'1.4',marginTop:4,color:'#fff',textShadow:'0 1px 4px #000'}}>{current?renderCaption(current.caption):''}</p></div>
        <div style={{position:'absolute',right:8,bottom:115,top:'auto',zIndex:50,display:'flex',flexDirection:'column',gap:7,alignItems:'center',width:52,justifyContent:'flex-end'}}><div style={{position:'relative',width:48,height:48,marginBottom:6}}><button onClick={()=>setView('me')} style={{width:48,height:48,borderRadius:'50%',overflow:'hidden',border:'2px solid #fff',background:'#333',padding:0,cursor:'pointer'}}>{profileAvatar?<img src={profileAvatar} alt="Creator" style={{width:'100%',height:'100%',objectFit:'cover'}} />:<span style={{fontSize:22}}>👤</span>}</button><button onClick={toggleFollow} style={{position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',width:20,height:20,borderRadius:'50%',background:isFollowing?'#fff':'#FE2C55',color:isFollowing?'#FE2C55':'#fff',border:'none',fontSize:12,fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{isFollowing?'✓':'+'}</button></div><button onClick={toggleLike} style={{...actionBtn, background:liked?'#FE2C55':'rgba(0,0,0,0.55)'}}>♥<span style={{fontSize:10}}>{likes}</span></button><button onClick={()=>setPanel('Comments')} style={actionBtn}>💬<span style={{fontSize:10}}>{commentCount}</span></button><button onClick={toggleSave} style={{...actionBtn, background:saved?'#FE2C55':'rgba(0,0,0,0.55)'}}>{saved?'✅':'🔖'}<span style={{fontSize:10}}>{savedIds.length}</span></button><button onClick={shareVideo} style={actionBtn}>↗<span style={{fontSize:10}}>Share</span></button><button onClick={()=>setPanel('Lyrics')} style={actionBtn}>🎵<span style={{fontSize:10}}>Song</span></button><button onClick={startLive} style={actionBtn}>🔴<span style={{fontSize:10}}>LIVE</span></button><div style={{transform:'scale(0.85)',transformOrigin:'bottom center'}}><VibraRewards onOpenChange={open=>setPanel(open?'Rewards':'')} /></div></div>
      </div>
      <nav className="bottom-nav absolute bottom-0 inset-x-0 bg-video flex justify-around p-3"><Button variant="ghost" onClick={()=>{setView('home');setSearch('')}} style={{fontSize:12}}>🎬 Videos</Button><Button variant="ghost" onClick={()=>setView('chat')} style={{fontSize:12, color:'#FE2C55', fontWeight:'bold'}}>💬 Chat {totalUnread>0?`(${totalUnread})`:''}</Button><Button variant="ghost" aria-label="Upload" onClick={()=>setShowCamera(true)} style={{fontSize:16}}>+</Button><Button variant="ghost" onClick={startLive} style={{fontSize:12}}>LIVE</Button><Button variant="ghost" onClick={()=>setView('me')} style={{fontSize:12}}>👤 Me</Button></nav>
      <div style={{position:'fixed',bottom:52,left:0,right:0,zIndex:40,background:'#111',borderTop:'1px solid #333',padding:'6px 10px',display:'flex',gap:8,alignItems:'center'}}><span style={{fontSize:16}}>📢</span><span style={{fontSize:11,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Tangaza hapa! Tsh 10,000/siku • mrvibraworldwide@gmail.com</span><button onClick={()=>{ window.location.href='mailto:mrvibraworldwide@gmail.com?subject=Nataka Tangazo Vibra' }} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:'bold'}}>Tangaza</button></div>
      <VibraBanner placement="home" />
      {panel==='Share'&&(<div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'flex-end'}} onClick={()=>setPanel('')}><div style={{background:'#fff',color:'#000',width:'100%',borderRadius:'20px 20px 0 0',padding:20}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Share hii video</b><button onClick={()=>setPanel('')} style={{fontSize:20,border:'none',background:'none'}}>✕</button></div><p style={{fontSize:13,marginTop:6}}>{current?.caption||'Share hii video'}</p><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:14}}><a href={'https://wa.me/?text='+shareMsg} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#25D366',color:'#fff',padding:'14px 4px',borderRadius:12}}>💬<br/>WhatsApp</a><a href={'https://www.facebook.com/sharer/sharer.php?u='+shareUrl} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#1877F2',color:'#fff',padding:'14px 4px',borderRadius:12}}>📘<br/>Facebook</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'linear-gradient(45deg,#f09433,#dc2743,#bc1888)',color:'#fff',padding:'14px 4px',borderRadius:12}}>📸<br/>Instagram</a><a href={'https://chatgpt.com/?q='+encodeURIComponent('Nisaidie caption nzuri ya video hii: '+(current?.caption||''))} target="_blank" rel="noreferrer" style={{textAlign:'center',textDecoration:'none',background:'#10a37f',color:'#fff',padding:'14px 4px',borderRadius:12}}>🤖<br/>ChatGPT</a><a href="https://www.capcut.com/" target="_blank" rel="noreferrer" onClick={()=>copyLink()} style={{textAlign:'center',textDecoration:'none',background:'#000',color:'#fff',padding:'14px 4px',borderRadius:12}}>✂️<br/>CapCut</a><button onClick={copyLink} style={{background:'#333',color:'#fff',padding:'14px 4px',borderRadius:12,border:'none'}}>🔗<br/>Copy Link</button></div></div></div>)}
      {panel==='LIVE'&&(
        <div style={{position:'fixed',inset:0,zIndex:999,background:'#000',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',gap:6,padding:8,background:'#111',flexWrap:'wrap',alignItems:'center'}}>
            <button onClick={startRealLive} style={{background:'#00FF00',color:'#000',border:'none',padding:'8px 12px',borderRadius:20,fontWeight:'bold',fontSize:12}}>📡 LIVE REAL - Watu Waingie!</button>
            {roomName && <button onClick={()=>{ navigator.clipboard?.writeText('https://meet.jit.si/'+roomName); setNotice('Link imekopiwa! Mtumie rafiki!') }} style={{background:'#333',color:'#fff',border:'none',padding:'8px 12px',borderRadius:20,fontSize:12}}>🔗 Copy Link: meet.jit.si/{roomName}</button>}
            {realLive && <button onClick={()=>setRealLive(false)} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'8px 12px',borderRadius:20,fontSize:12}}>Back kwa Picha</button>}
            {realLive && <button onClick={()=>{ setJitsiKey(k=>k+1); setNotice('Inarefresh LIVE...') }} style={{background:'#25F4EE',color:'#000',border:'none',padding:'8px 12px',borderRadius:20,fontWeight:'bold',fontSize:12}}>🔄 Refresh LIVE</button>}
            {realLive && <a href={jitsiUrl} target="_blank" rel="noreferrer" style={{background:'#fff',color:'#000',padding:'8px 12px',borderRadius:20,fontWeight:'bold',fontSize:12,textDecoration:'none'}}>↗ Fungua LIVE Nje</a>}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',padding:10,color:'#fff',alignItems:'center',gap:6,flexWrap:'wrap'}}>
            <b style={{fontSize:13}}>🔴 LIVE - {name} | 🪙 {liveCoins} | 🎁 {totalGifts}</b>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              <label style={{background:'#333',color:'#fff',padding:'6px 8px',borderRadius:20,fontSize:11,cursor:'pointer',whiteSpace:'nowrap'}}>🖼️ Picha Juu<input type="file" accept="image/*,video/*" style={{display:'none'}} onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setLiveOverlay(url); setLiveOverlayType(f.type.startsWith('video')?'video':'image'); setLiveOverlayPos({x:50,y:25}); setLiveOverlaySize(180) }} /></label>
              <button onClick={()=>{ setShowGuests(v=>!v); setNotice(showGuests ? 'Guests wamefichwa' : 'Chagua Guest - bonyeza + kwenye slot') }} style={{background: showGuests ? '#FE2C55' : '#333',color:'#fff',padding:'6px 8px',borderRadius:20,fontSize:11,border:'none'}}>👥 Guests 8</button>
              <button onClick={stopLive} style={{color:'#fff',background:'none',border:'none',fontSize:20}}>✕</button>
            </div>
          </div>
          {(battleOn || battleWinner) && (
            <div style={{padding:'8px 12px',background: battleWinner ? '#FFD700' : '#111',color: battleWinner ? '#000' : '#fff'}}>
              {battleWinner ? <p style={{textAlign:'center',fontWeight:'bold',fontSize:14}}>🏆 {battleWinner} ameshinda Battle! {name} {myScore} - {guestScore} {guestName}</p> : (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:'bold'}}><span>{name} {myScore}</span><span>⏱️ {battleTime}s ⚔️ BATTLE</span><span>{guestScore} {guestName}</span></div>
                  <div style={{display:'flex',height:10,borderRadius:10,overflow:'hidden',marginTop:4,background:'#333'}}><div style={{width: `${myScore+guestScore===0?50:(myScore/(myScore+guestScore))*100}%`,background:'#FE2C55'}} /><div style={{flex:1,background:'#25F4EE'}} /></div>
                </>
              )}
            </div>
          )}
          {realLive ? (
            <div style={{flex:1,position:'relative',background:'#000'}}>
              <iframe key={jitsiKey} src={jitsiUrl} allow="camera; microphone; fullscreen; display-capture; autoplay" style={{width:'100%',height:'100%',border:'none'}} />
              <p style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.7)',color:'#fff',padding:'6px 10px',borderRadius:20,fontSize:11}}>📡 LIVE REAL - Ukiona Waiting, bonyeza Log-in na Google mara moja uwe Moderator!</p>
            </div>
          ) : (
          <div style={{flex:1,position:'relative',background:'#111',display:'flex',overflow:'hidden'}}>
            <div style={{flex:1, position:'relative', borderRight: showGuests?'2px solid #FE2C55':'none', minWidth: showGuests?'45%':'100%'}}>
              <video ref={liveRef} autoPlay playsInline muted style={{width:'100%',height:'100%',objectFit:'cover'}} />
              <span onClick={()=>{setTalking(0); setLiveChats(v=>[...v, `🎤 ${name} anaongea sasa!`])}} style={{position:'absolute',top:8,left:8,background: talking===0 ? '#00FF00' : 'rgba(0,0,0,0.6)',color: talking===0 ? '#000' : '#fff',padding:'4px 8px',borderRadius:12,fontSize:11,cursor:'pointer'}}>{name} 🎤 {talking===0?'Anaongea':''} {battleOn?`• ${myScore}`:''}</span>
              {!liveOn&&<p style={{position:'absolute',color:'#fff',textAlign:'center',padding:20,top:'40%'}}>Inafungua kamera...</p>}
            </div>
            {showGuests && (
              <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr 1fr 1fr',gap:2,background:'#000',padding:2,minWidth:'55%'}}>
                {guests.map((g,i)=>(
                  <div key={i} style={{position:'relative',background:'#222',borderRadius:8,overflow:'hidden',border: talking===i+1 ? '3px solid #00FF00' : '1px solid #333',minHeight:50}}>
                    {g ? <img src={g} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <label style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:22,cursor:'pointer'}}>👤 +<input type="file" accept="image/*,video/*" style={{display:'none'}} onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setGuests(prev=>prev.map((x,idx)=>idx===i?url:x)); const n=prompt('Jina la Guest '+(i+1)+'?','@Guest'+(i+1)); if(n) setGuestNames(prev=>prev.map((x,idx)=>idx===i?n:x)); setNotice('Guest '+(i+1)+' amejiunga!') }} /></label>}
                    <span style={{position:'absolute',bottom:2,left:4,color:'#fff',fontSize:9,background:'rgba(0,0,0,0.6)',padding:'2px 5px',borderRadius:8}}>{guestNames[i]}</span>
                    {g && <span onClick={()=>{ setTalking(i+1); setLiveChats(v=>[...v, `🎤 ${guestNames[i]} anaongea sasa!`])}} style={{position:'absolute',top:2,right:2,background: talking===i+1 ? '#00FF00' : '#333',color: talking===i+1 ? '#000' : '#fff',padding:'2px 6px',borderRadius:10,fontSize:9,cursor:'pointer'}}>🎤 {talking===i+1?'Anaongea':'Ongea'}</span>}
                    {g && <span onClick={()=>setGuests(prev=>prev.map((x,idx)=>idx===i?'':x))} style={{position:'absolute',top:2,left:2,background:'#FE2C55',color:'#fff',width:18,height:18,borderRadius:'50%',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>✕</span>}
                  </div>
                ))}
              </div>
            )}
            {liveOverlay && !showGuests && (
              <div onTouchMove={(e)=>{ const rect=e.currentTarget.parentElement?.getBoundingClientRect(); if(!rect) return; const t=e.touches[0]; setLiveOverlayPos({ x: ((t.clientX-rect.left)/rect.width)*100, y: ((t.clientY-rect.top)/rect.height)*100 }) }} style={{position:'absolute',left:`${liveOverlayPos.x}%`,top:`${liveOverlayPos.y}%`,transform:'translate(-50%,-50%)',width:liveOverlaySize,height:liveOverlaySize*1.4,borderRadius:12,overflow:'hidden',border:'3px solid #fff',boxShadow:'0 4px 20px rgba(0,0,0,0.6)',zIndex:20,touchAction:'none'}}>{liveOverlayType==='video' ? <video src={liveOverlay} autoPlay loop muted playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <img src={liveOverlay} style={{width:'100%',height:'100%',objectFit:'cover'}} />}<button onClick={()=>setLiveOverlay('')} style={{position:'absolute',top:2,right:2,background:'#FE2C55',color:'#fff',border:'none',borderRadius:'50%',width:24,height:24}}>✕</button></div>
            )}
            {giftAnim && <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:30,pointerEvents:'none'}}><div style={{fontSize:110}}>{giftAnim}</div><p style={{background:'rgba(0,0,0,0.7)',color:'#fff',padding:'8px 16px',borderRadius:20,fontWeight:'bold'}}>🎁 {giftFrom}</p></div>}
            <div style={{position:'absolute',left:10,bottom:10,color:'#fff',fontSize:13,zIndex:15}}>{liveChats.slice(-3).map((c,i)=><p key={i} style={{textShadow:'0 1px 3px #000'}}>{c}</p>)}</div>
            {liveOverlay && !showGuests && (<div style={{position:'absolute',bottom:60,right:10,display:'flex',gap:6,zIndex:25}}><button onClick={()=>setLiveOverlaySize(s=>Math.max(100,s-30))} style={{background:'rgba(0,0,0,0.7)',color:'#fff',border:'1px solid #fff',width:32,height:32,borderRadius:'50%'}}>-</button><button onClick={()=>setLiveOverlaySize(s=>Math.min(320,s+30))} style={{background:'rgba(0,0,0,0.7)',color:'#fff',border:'1px solid #fff',width:32,height:32,borderRadius:'50%'}}>+</button></div>)}
          </div>
          )}
          {showGiftBar && (
            <div style={{background:'#111',padding:'10px 12px',borderTop:'1px solid #333'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{color:'#fff',fontSize:12}}>🎁 Tuma Gift - Una 🪙 {liveCoins} Coins</span><button onClick={()=>setShowGiftBar(false)} style={{background:'none',border:'none',color:'#fff'}}>✕</button></div>
              <div style={{display:'flex',gap:8,overflowX:'auto'}}>
                {GIFTS.map(g=>(
                  <button key={g.name} onClick={()=>sendGift(g,'me')} style={{background:'#222',border:'1px solid #444',borderRadius:12,padding:'10px 12px',minWidth:70,textAlign:'center',color:'#fff'}}>
                    <div style={{fontSize:28}}>{g.emoji}</div><div style={{fontSize:11}}>{g.name}</div><div style={{fontSize:11,color:'#FFD700'}}>🪙 {g.cost}</div>
                  </button>
                ))}
              </div>
              {battleOn && <p style={{color:'#25F4EE',fontSize:12,marginTop:6}}>⚔️ Battle inaendelea - Gift zako zinaenda kwa {name}!</p>}
            </div>
          )}
          <div style={{padding:10,background:'#000',display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input value={liveMsg} onChange={e=>setLiveMsg(e.target.value)} placeholder="Andika LIVE chat..." style={{flex:1,minWidth:120,padding:10,borderRadius:20,border:'none'}} />
            <button onClick={()=>setShowGiftBar(v=>!v)} style={{background:'#FFD700',color:'#000',border:'none',padding:'10px 12px',borderRadius:20,fontWeight:'bold',fontSize:12}}>🎁 Gift</button>
            {(hasGuest || realLive) && !battleOn && <button onClick={startBattle} style={{background:'#FE2C55',color:'#fff',border:'none',padding:'10px 12px',borderRadius:20,fontWeight:'bold',fontSize:12}}>⚔️ Battle!</button>}
            {battleOn && <button onClick={()=>{setBattleOn(false); setBattleWinner('')}} style={{background:'#333',color:'#fff',border:'none',padding:'10px 12px',borderRadius:20,fontSize:12}}>Stop Battle</button>}
            <Button onClick={()=>{if(!liveMsg.trim()) return; setLiveChats(v=>[...v,liveMsg]); setLiveMsg('')}}>Send</Button>
            <Button onClick={stopLive} style={{background:'#FE2C55'}}>Maliza LIVE</Button>
          </div>
        </div>
      )}
      <VibraSheet title={panel} open={panel==='Comments'||panel==='Lyrics'||panel==='Rewards'} onClose={()=>setPanel('')}>{panel==='Lyrics'?<p className="lyrics-copy">{current?.caption||'No lyrics'}</p>:panel==='Comments'?<div><p style={{fontWeight:'bold'}}>{commentCount} Comments</p>{(comments[clipKey]||[]).map((text,i)=><p key={i} style={{padding:'8px 0',borderBottom:'1px solid #eee'}}>{renderCaption(text)}</p>)}<input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." /><Button onClick={addComment}>Send</Button></div>:<p>Coins: {coins}</p>}</VibraSheet>
      {notice&&<div style={noticeStyle}>{notice}</div>}
      {uploadInput}
    </div>
  )
}
