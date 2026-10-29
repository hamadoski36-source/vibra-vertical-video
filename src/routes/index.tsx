// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const [clips, setClips] = useState([])
  const [likesMap, setLikesMap] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [following, setFollowing] = useState(new Set())
  const [mySaves, setMySaves] = useState(new Set())
  const [activeClip, setActiveClip] = useState(null)
  const [showPage, setShowPage] = useState('home')
  const [tab, setTab] = useState('foryou')
  const [isMuted, setIsMuted] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [showCaption, setShowCaption] = useState(false)
  const [captionText, setCaptionText] = useState('😂 #viral #vibra #comedy 🔥 #fyp')
  const [pendingFile, setPendingFile] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showLyrics, setShowLyrics] = useState(false)
  const [meTab, setMeTab] = useState('videos')
  const [selectedFromMe, setSelectedFromMe] = useState(null)
  const [isFollowingMe, setIsFollowingMe] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [showAdContact, setShowAdContact] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [dataSaver, setDataSaver] = useState(true)
  const [downloaded, setDownloaded] = useState(new Set())
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())
  const meVideoRef = useRef(null)
  const myFollowers = 250800
  const isVerified = myFollowers >= 100000
  const myEarnings = 4850
  const MY_MPESA = "0740805970"
  const MY_PAYPAL = "vibra.worldwide@gmail.com"
  const MY_MTN = "+256 740 805970"
  useEffect(()=>{
    const stopAll = () => { videoRefs.current.forEach(v=>{ try{ v.pause(); }catch{} }); if(meVideoRef.current) try{ meVideoRef.current.pause() }catch{} }
    document.addEventListener('visibilitychange', ()=>{ if(document.hidden) stopAll() })
    window.addEventListener('blur', ()=>stopAll())
  }, [])
  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){ setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:'vibra_boy', caption:x.caption||'Familia yangu 😂', views: 100000, pinned:false}))) }
    else { setClips([{id:'1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'Data Saver ON 🔋 Worldwide 🌍', views:254100, pinned:true},{id:'2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Togethar forever ❤️', views:412800, pinned:true},{id:'3', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption:'SHOUT OUT', views:756800, pinned:true},{id:'4', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption:'2025 challenge', views:554900},{id:'5', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption:'IMEMRCHS', views:451100},{id:'6', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption:'Love story', views:268700}]) }
  }
    const toggleLike = (id)=>{ setMyLikes(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }); setLikesMap(m=>({...m, [id]:(m[id]||0)+(myLikes.has(id)?-1:1)})) }
  const toggleFollow = (user)=>{ setFollowing(s=>{ const n=new Set(s); if(n.has(user)) n.delete(user); else n.add(user); return n }) }
  const toggleSave = (id)=>{ setMySaves(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }) }
  const filtered = clips.filter(c=>{ if(searchQ) return c.caption.toLowerCase().includes(searchQ.toLowerCase()); if(tab==='following') return following.has(c.username); return true })
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n.toString()
  return (
    <div className="h-screen bg-black relative overflow-hidden text-white">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(!f) return; if(f.size > 15*1024*1024){ alert('❌ <15MB tu'); return }; setPendingFile(f); setCaptionText('😂 #viral #vibra 🔥'); setShowCaption(true) }} />
      {showAdContact && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-5 w-full max-w-[380px] text-black max-h-[92vh] overflow-y-auto">
            <p className="font-black text-[19px]">🌍 Tangaza Worldwide! 🔋</p>
            <div className="mt-4 space-y-3">
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3"><p className="font-black text-[11px] text-green-700">🇰🇪 KENYA - M-PESA {MY_MPESA}</p><p className="text-[11px]">✅ 1K KES / day • 🔋 70% saved!</p><a href={`https://wa.me/254${MY_MPESA.substring(1)}`} className="block w-full bg-green-600 text-white py-2.5 rounded-full font-bold mt-2 text-center text-[11px]">Lipa M-Pesa 💬</a></div>
              <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-3"><p className="font-black text-[11px]">🇺🇬🇹🇿 UGANDA / TZ MTN {MY_MTN}</p><p className="text-[11px]">✅ 40K UGX / day • 🔋 Worldwide!</p></div>
              <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-3"><p className="font-black text-[11px] text-blue-700">🌍 WORLDWIDE PAYPAL {MY_PAYPAL}</p><p className="text-[11px]">✅ $10 / day • 🔋 70% less data!</p><a href="https://paypal.me/vibraads" className="block w-full bg-blue-600 text-white py-2.5 rounded-full font-bold mt-2 text-center text-[11px]">PayPal Worldwide 💳</a></div>
            </div>
            <button onClick={()=>setShowAdContact(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga</button>
          </div>
        </div>
      )}
      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-800/80 rounded-full px-3 py-1.5 flex items-center gap-2 border border-zinc-700"><span>🔍</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search" className="bg-transparent text-[12px] outline-none flex-1 text-white" /></div>
              <button onClick={()=>setDataSaver(!dataSaver)} className={`px-3 py-1.5 rounded-full text-[10px] font-black border-2 ${dataSaver?'bg-green-500 text-white border-white':'bg-zinc-800 text-zinc-400 border-zinc-600'}`}>{dataSaver?'🔋 ON':'🔋 OFF'}</button>
              <button onClick={()=>setIsLive(true)} className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FE2C55] border border-white">LIVE</button>
            </div>
            <div className="flex justify-center gap-4 mt-2 items-center"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>{dataSaver && <span className="text-[9px] bg-green-500 px-2 py-0.5 rounded-full font-bold">70% SAVED WORLDWIDE</span>}</div>
          </div>
          {filtered.map((c, idx)=>(
            <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
              <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload={dataSaver?'metadata':'auto'} className="h-full w-full object-cover" />
              <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[95px] left-3 bg-black/60 px-3 py-1 rounded-full text-[11px] border border-white/20 font-bold z-20 text-white">{isMuted?'🔇 Tap':'🔊'}</button>
              {dataSaver && <div className="absolute top-[95px] right-3 bg-green-500 px-2 py-1 rounded-full text-[9px] font-black z-20">🔋 LOW DATA WORLDWIDE</div>}
              <div className="absolute bottom-24 left-3 right-20 z-20"><p className="font-bold text-[15px]">@vibra_boy ✅</p><p className="text-[13px] mt-1">{c.caption}</p></div>
              <div className="absolute bottom-20 right-3 flex flex-col items-center gap-3 z-20">
                <button onClick={()=>toggleFollow(c.username)} className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-[12px]">+</button>
                <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[10px] font-bold mt-1">{fmt(c.views)}</span></button>
                <button onClick={()=>setShowAdContact(true)} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-yellow-500 flex items-center justify-center text-lg border border-white">💰</div><span className="text-[9px] font-bold mt-1">Ad</span></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-[10px] h-[60px] items-center z-40">
        <button onClick={()=>setShowPage('home')} className="flex flex-col items-center text-white font-bold">🏠 Home</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button onClick={()=>setShowPage('me')} className="flex flex-col items-center text-zinc-400">V Me</button>
      </div>
    </div>
  )
}
