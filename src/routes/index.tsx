// VIBRA MPYA KABISA - NA TIKTOK CAMERA
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
    const v=document.createElement('video'); v.src=videoUrl; v.muted=true; v.playsInline=true; v.preload='auto'
    v.onloadedmetadata=()=>{ v.currentTime=Math.min(1, v.duration/3 || 1) }
    v.onseeked=()=>{
      try{
        const c=document.createElement('canvas'); c.width=270; c.height=480
        const ctx=c.getContext('2d'); if(!ctx) return res('')
        ctx.drawImage(v,0,0,270,480); res(c.toDataURL('image/jpeg',0.7))
      }catch{ res('') }
    }
    setTimeout(()=>res(''), 3000)
  })
}
function renderCaption(text:string){
  if(!text) return null
  const parts=text.split(/(#[\wÀ-ÿ]+)/g)
  return <span>{parts.map((p,i)=> p.startsWith('#') ? <span key={i} style={{color:'#25F4EE',fontWeight:'bold'}}>{p} </span> : <span key={i}>{p}</span> )}</span>
}

// ===== TIKTOK CAMERA - JUU KULIA NA RECORD =====
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
  const [caption, setCaption] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState('')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  const effects: Record<string, string> = {
    normal: 'none',
    beauty: 'brightness(1.15) contrast(1.1) saturate(1.2)',
    bw: 'grayscale(1) contrast(1.2)',
    warm: 'sepia(0.3) brightness(1.1)',
    cool: 'hue-rotate(180deg) saturate(1.2)',
    vivid: 'saturate(1.8) contrast(1.2)',
  }

  const startCamera = async (face: 'user' | 'environment') => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: face }, audio: true })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(()=>{}) }
    } catch { alert('Ruhusu kamera: Allow') }
  }
  useEffect(() => { startCamera(facing); return () => streamRef.current?.getTracks().forEach(t => t.stop()) }, [])
  useEffect(() => { startCamera(facing) }, [facing])
  useEffect(() => {
    if (flash && streamRef.current) {
      const track: any = streamRef.current.getVideoTracks()[0]
      try { track.applyConstraints({ advanced: [{ torch: true }] }) } catch {}
    }
  }, [flash])

  const doRecord = () => {
    if (isRecording) { stopRecord(); return }
    if (timer === 3) {
      setCountdown(3); let c = 3
      const iv = setInterval(() => { c--; setCountdown(c); if (c <= 0) { clearInterval(iv); setCountdown(0); startRec() } }, 1000)
      return
    }
    startRec()
  }
  const startRec = () => {
    if (!streamRef.current) return
    chunksRef.current = []
    const rec = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' })
    recorderRef.current = rec
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob); setRecordedUrl(URL.createObjectURL(blob))
    }
    rec.start(); setIsRecording(true); setTimeLeft(duration)
    const iv = setInterval(() => { setTimeLeft(v => { if (v <= 1) { clearInterval(iv); stopRecord(); return 0 } return v - 1 }) }, 1000)
  }
  const stopRecord = () => { recorderRef.current?.stop(); setIsRecording(false) }
  const useVideo = () => {
    if (!recordedBlob) return
    let cap = caption.trim()
    if (!cap) cap = '#Vibra #Mombasa'
    else if (!cap.includes('#')) cap += ' #Vibra #Mombasa'
    onDone(recordedBlob, cap)
  }
  const filterStyle = effects[effect] || 'none'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px', color: '#fff', zIndex: 10 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24 }}>✕</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>🔄</button>
          <button onClick={() => { setBeauty(!beauty); setEffect(beauty ? 'normal' : 'beauty') }} style={{ background: beauty ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>✨</button>
          <button onClick={() => setTimer(t => t === 0 ? 3 : 0)} style={{ background: timer === 3 ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 14 }}>⏱️</button>
          <button onClick={() => setFlash(!flash)} style={{ background: flash ? '#FE2C55' : 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff', width: 38, height: 38, borderRadius: '50%', fontSize: 16 }}>⚡</button>
          <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)} style={{ background: 'rgba(0,0
