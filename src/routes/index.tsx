// VIBRA WORLDWIDE - FINAL - ADD KWA NAMBA KAMA WHATSAPP - TUMALIZE!
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
type ChatMsg = { from: 'me' | 'them'; text: string; time: string; audioUrl?: string; mediaType?: 'voice'|'image'|'video'; seen?: boolean }
type Chat = { id: string; name: string; avatar: string; last: string; time: string; unread: number; online: boolean; isGroup?: boolean; messages: ChatMsg[]; typing?: boolean; lastSeen?: string; phone?: string }
type StatusItem = { id: string; name: string; avatar: string; img: string; caption: string; time: string; seen: boolean; mediaType?: 'image'|'video'|'text' }

const PINK = '#FE2C55'
const TEAL = '#25F4EE'
const GRADIENT = 'linear-gradient(90deg,#FE2C55,#25F4EE)'
const GRADIENT_BTN = 'linear-gradient(90deg,#FE2C55 0%,#FF6B9D 50%,#25F4EE 100%)'
const vibraText: React.CSSProperties = { background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }
const vibraTextPink: React.CSSProperties = { color: PINK, fontWeight: 'bold' }
const vibraTextTeal: React.CSSProperties = { color: TEAL, fontWeight: 'bold' }
const vibraBtn: React.CSSProperties = { background: GRADIENT_BTN, color: '#fff', border: 'none', fontWeight: 'bold' }
const inputStyle: React.CSSProperties = { padding:14, borderRadius:12, border:`2px solid ${TEAL}`, background:'#111', color:'#fff', fontSize:16, width:'100%', boxSizing:'border-box', outline:'none' }
const labelStyle: React.CSSProperties = { ...vibraText, fontSize:13, textAlign:'left', marginBottom:-4 }
const actionBtn: React.CSSProperties = { width:52, height:52, minWidth:52, padding:0, fontSize:11, lineHeight:'1.1', borderRadius:12, background: GRADIENT_BTN, color:'#fff', border:`1px solid ${TEAL}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, whiteSpace:'nowrap', overflow:'hidden' }
const noticeStyle: React.CSSProperties = { position:'fixed', left:'50%', bottom:80, transform:'translateX(-50%)', zIndex:9999, background: GRADIENT_BTN, color:'#fff', padding:'10px 16px', borderRadius:20, fontSize:13, fontWeight:'bold', boxShadow:'0 4px 20px rgba(254,44,85,0.5)', maxWidth:'90%', textAlign:'center' }

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
  return <span>{parts.map((p,i)=> p.startsWith('#') ? <span key={i} style={vibraTextTeal}>{p} </span> : <span key={i} style={{color:'#fff'}}>{p}</span> )}</span>
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
          <button onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')} style={{ background: GRADIENT_BTN, border: `1px solid ${TEAL}`, color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>🔄</button>
          <button onClick={() => { setBeauty(!beauty); setEffect(beauty ? 'normal' : 'beauty') }} style={{ background: beauty ? GRADIENT_BTN : 'rgba(0,0,0,0.5)', border: `1px solid ${TEAL}`, color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>✨</button>
          <button onClick={() => setTimer(t => t === 0 ? 3 : 0)} style={{ background: timer === 3 ? GRADIENT_BTN : 'rgba(0,0,0,0.5)', border: `1px solid ${TEAL}`, color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 14 }}>⏱️</button>
          <button onClick={() => setFlash(!flash)} style={{ background: flash ? GRADIENT_BTN : 'rgba(0,0,0,0.5)', border: `1px solid ${TEAL}`, color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>⚡</button>
          <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)} style={{ background: GRADIENT_BTN, border: `1px solid ${TEAL}`, color: '#fff', padding: '6px 8px', borderRadius: 20, fontSize: 12, fontWeight: 'bold' }}>{speed}x</button>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: '#111', overflow: 'hidden' }}>
        {!recordedUrl ? (<video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: filterStyle, transform: facing === 'user' ? 'scaleX(-1)' : 'none' }} />) : (<video src={recordedUrl} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)}
        {faceEffect !== 'none' && !recordedUrl && (<div onTouchMove={(e) => { const rect = e.currentTarget.parentElement?.getBoundingClientRect(); if (!rect) return; const t = e.touches[0]; setFacePos({ x: ((t.clientX - rect.left) / rect.width) * 100, y: ((t.clientY - rect.top) / rect.height) * 100 }) }} style={{ position: 'absolute', left: `${facePos.x}%`, top: `${facePos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 20, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))', touchAction: 'none' }}>{renderFace()}</div>)}
        {faceEffect !== 'none' && !recordedUrl && (<p style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: GRADIENT_BTN, color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 12, whiteSpace: 'nowrap', zIndex: 21 }}>👆 Shika uso usogeze</p>)}
        {countdown > 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, color: '#fff', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)' }}>{countdown}</div>}
        {isRecording && <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: GRADIENT_BTN, color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 'bold' }}>🔴 {timeLeft}s</div>}
      </div>
      {!recordedUrl && (<><div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 12px 4px', background: '#000', alignItems: 'center' }}><span style={vibraTextTeal}>Rangi:</span>{[['normal','Normal'],['beauty','Beauty ✨'],['bw','B&W'],['warm','Warm ☀️'],['cool','Cool ❄️'],['vivid','Vivid 🌈']].map(([key,label]) => (<button key={key} onClick={() => { setEffect(key); setBeauty(key === 'beauty') }} style={{ background: effect === key ? GRADIENT_BTN : '#222', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}>{label}</button>))}</div><div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 12px 6px', background: '#000', alignItems: 'center' }}><span style={vibraTextTeal}>Uso:</span>{[['none','❌ Hakuna'],['dog','🐶 Mbwa'],['cat','🐱 Paka'],['glasses','😎 Miwani'],['crown','👑 Taji'],['rabbit','🐰 Sungura'],['clown','🤡 Clown'],['fire','🔥 Moto'],['heart','😍 Moyo'],['alien','👽 Alien']].map(([key,label]) => (<button key={key} onClick={() => setFaceEffect(key)} style={{ background: faceEffect === key ? GRADIENT_BTN : '#333', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}>{label}</button>))}</div><div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 12px 8px', background: '#000' }}><span style={vibraTextTeal}>Ukubwa:</span><button onClick={() => setFaceSize(s => Math.max(40, s - 20))} style={{ background: '#333', color: '#fff', border: 'none', width: 30, height: 30, borderRadius: '50%' }}>-</button><span style={{ color: '#fff', fontSize: 12 }}>{faceSize}</span><button onClick={() => setFaceSize(s => Math.min(280, s + 20))} style={{ background: '#333', color: '#fff', border: 'none', width: 30, height: 30, borderRadius: '50%' }}>+</button><button onClick={() => { setFacePos({ x: 50, y: 48 }); setFaceSize(160) }} style={{ background: GRADIENT_BTN, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 12, marginLeft: 'auto' }}>🔄 Katikati</button></div></>)}
      {recordedUrl && (<div style={{ padding: '12px', background: '#000' }}><input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption... #Vibra #Mombasa" style={{ width: '100%', padding: 12, borderRadius: 12, border: `2px solid ${TEAL}`, background: '#111', color: '#fff', fontSize: 14 }} /><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{['#Mombasa','#Vibra','#Kamata','#ForYou','#Dance'].map(t => (<button key={t} onClick={() => setCaption(v => v.includes(t) ? v.replace(t,'').trim() : (v+' '+t).trim())} style={{ background: caption.includes(t) ? GRADIENT_BTN : '#222', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 13 }}>{t}</button>))}</div><div style={{ display: 'flex', gap: 10, marginTop: 12 }}><button onClick={() => { setRecordedUrl(''); setRecordedBlob(null) }} style={{ flex: 1, padding: 14, borderRadius: 12, background: '#333', color: '#fff', border: 'none', fontWeight: 'bold' }}>🔄 Rekodi Tena</button><button onClick={useVideo} style={{ flex: 2, padding: 14, borderRadius: 12, background: GRADIENT_BTN, color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }}>✅ Tumia Video Hii</button></div></div>)}
      {!recordedUrl && (<div style={{ padding: '10px 12px 18px', background: '#000' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>{[15,60,180].map(s => (<button key={s} onClick={() => setDuration(s)} style={{ background: 'none', border: 'none', color: duration === s ? TEAL : '#888', fontWeight: duration === s ? 'bold' : 'normal', fontSize: 14 }}>{s === 180 ? '3m' : s + 's'}</button>))}</div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={vibraText}>✨<br/>Effects</span><button onClick={doRecord} style={{ width: 72, height: 72, borderRadius: '50%', background: GRADIENT_BTN, border: `4px solid ${TEAL}`, color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{isRecording ? '⏹️' : '🔴'}</button><label style={vibraText}>📁<br/>Upload<input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onDone(f, '#Vibra #Mombasa') }} /></label></div></div>)}
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
  // CHAT + ADD KWA NAMBA KAMA WHATSAPP - FINAL!
  const [chatSearch,setChatSearch]=useState('')
  const [selectedChatId,setSelectedChatId]=useState<string|null>(null)
  const [chatInput,setChatInput]=useState('')
  const [chatTab,setChatTab]=useState<'chats'|'status'>('chats')
  const [viewStatus,setViewStatus]=useState<StatusItem|null>(null)
  const [isRecordingVoice,setIsRecordingVoice]=useState(false)
  const voiceRecRef=useRef<MediaRecorder|null>(null)
  const voiceChunksRef=useRef<Blob[]>([])
  const voiceStreamRef=useRef<MediaStream|null>(null)
  const [showAddContact,setShowAddContact]=useState(false)
  const [newName,setNewName]=useState('')
  const [newPhone,setNewPhone]=useState('')
  const [chats,setChats]=useState<Chat[]>([
    { id:'aisha', name:'Aisha Mkomani', avatar:'https://i.pravatar.cc/150?img=47', last:'Poa sana! 🔥', time:'Now', unread:0, online:true, lastSeen:'Online', phone:'+254712345678', messages:[{from:'them',text:'Pole! Nimefika Old Town, tuko sawa 😊',time:'09:40', seen:true},{from:'them',text:'Video yako ya Sunset kali sana! 🔥',time:'09:41', seen:true},{from:'me',text:'Asante! Karibu Vibra ❤️',time:'09:42', seen:true}] },
    { id:'juma', name:'Juma Kilindini', avatar:'https://i.pravatar.cc/150?img=12', last:'Sawa, tuko pamoja!', time:'Now', unread:0, online:true, lastSeen:'Online', phone:'+254723456789', messages:[{from:'them',text:'Sawa, nimepanga dhow ride kesho asubuhi 🌊',time:'09:12', seen:true},{from:'me',text:'Poa! Nitaweka video yake Vibra!',time:'09:13', seen:true}] },
    { id:'neema', name:'Mama Neema • Nyali', avatar:'https://i.pravatar.cc/150?img=32', last:'Poa sana! 🔥', time:'Now', unread:0, online:false, lastSeen:'Last seen 1h ago', phone:'+254734567890', messages:[{from:'them',text:'Asante kwa picha! Beach imekuwa poa Leo',time:'Yesterday', seen:true}] },
    { id:'said', name:'Said - Old Town', avatar:'https://i.pravatar.cc/150?img=53', last:'Vibra iko poa sana! Love the new update ✨', time:'Yesterday', unread:0, online:false, lastSeen:'Last seen 2h ago', phone:'+254745678901', messages:[{from:'them',text:'Vibra iko poa sana! Love the new update ✨',time:'Yesterday', seen:true}] },
    { id:'pwani', name:'Pwani Crew 🌴', avatar:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop', last:'Twende Mombasa! 🌊', time:'Now', unread:0, online:true, lastSeen:'Online', isGroup:true, messages:[{from:'them',text:'Zawadi: Tutakutana Fort Jesus at 5pm?',time:'Mon', seen:true},{from:'me',text:'Sawa! Nitaleta kamera 📷',time:'Mon', seen:true}] },
  ])
  const [statuses,setStatuses]=useState<StatusItem[]>([
    { id:'s1', name:'Aisha Mkomani', avatar:'https://i.pravatar.cc/150?img=47', img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop', caption:'Old Town vibes! 🌊 #Mombasa', time:'12 min ago', seen:false, mediaType:'image' },
    { id:'s2', name:'Juma Kilindini', avatar:'https://i.pravatar.cc/150?img=12', img:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=800&fit=crop', caption:'Dhow ride kesho! ⛵', time:'45 min ago', seen:false, mediaType:'image' },
    { id:'s3', name:'Pwani Crew 🌴', avatar:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop', img:'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&h=800&fit=crop', caption:'Fort Jesus at 5pm! Tuko pamoja!', time:'1h ago', seen:true, mediaType:'image' },
  ])
  const selectedChat = chats.find(c=>c.id===selectedChatId) || null
  const totalUnread = chats.reduce((s,c)=>s+c.unread,0)
  function addContactByPhone(){
    if(!newName.trim() || !newPhone.trim()){ setNotice('Jaza Jina na Namba!'); return }
    let phone = newPhone.trim()
    if(phone.startsWith('0')) phone = '+254' + phone.slice(1)
    if(!phone.startsWith('+')) phone = '+254' + phone
    if(phone.length < 10){ setNotice('Namba si sahihi! Mfano: 0712345678'); return }
    if(chats.some(c=>c.phone===phone)){ setNotice('Huyu mtu tayari yupo kwenye Chat!'); setShowAddContact(false); return }
    const id = 'chat'+Date.now()
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName.trim())}&background=FE2C55&color=fff&size=150&bold=true`
    setChats(prev=>[{id, name:newName.trim(), avatar, last:'Sema! Karibu Vibra Chat 👋', time:'Now', unread:0, online:true, lastSeen:'Online', phone, messages:[{from:'them',text:'Sema! Karibu Vibra Chat 👋',time:'Now', seen:true}]}, ...prev])
    setSelectedChatId(id)
    setShowAddContact(false)
    const savedName = newName.trim()
    setNewName(''); setNewPhone
