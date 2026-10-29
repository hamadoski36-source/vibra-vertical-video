// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraAllInOne,
})

function VibraAllInOne() {
  const [clips, setClips] = useState([])
  const [likesMap, setLikesMap] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [following, setFollowing] = useState(new Set())
  const [mySaves, setMySaves] = useState(new Set())
  const [commentsMap, setCommentsMap] = useState({})
  const [activeClip, setActiveClip] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [showPage, setShowPage] = useState('home')
  const [tab, setTab] = useState('foryou')
  const [isMuted, setIsMuted] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [captionText, setCaptionText] = useState('Familia yangu 😂 #vibra #familia #comedy')
  const [pendingFile, setPendingFile] = useState(null)
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())

  useEffect(()=>{ load() }, [])

  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data) setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂 #vibra', views: Math.floor(Math.random()*1500000+500)})))
    const {data:l} = await supabase.from('likes').select('*')
    if(l){ const m={}; const s=new Set(); l.forEach(a=>{ m[a.clip_id]=(m[a.clip_id]||0)+1; if(a.user_id==='vibra_boy') s.add(a.clip_id)}); setLikesMap(m); setMyLikes(s)}
    const {data:c} = await supabase.from('comments').select('*')
    if(c){ const m={}; c.forEach(x=>{ if(!m[x.clip_id]) m[x.clip_id]=[]; m[x.clip_id].push(x)}); setCommentsMap(m)}
  }

  // FIX 1 & 2: SAUTI INAKATA UKITOKA PAGE + UKITOKA KWENYE APP
  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends'){
      videoRefs.current.forEach(v=>{ try{v.pause()}catch{}})
      document.querySelectorAll('video').forEach(v=>{ try{v.pause()}catch{}})
    }
  }, [showPage, tab])

  useEffect(()=>{
    const stopAll = ()=>{
      videoRefs.current.forEach(v=>{ try{v.pause()}catch{}})
      document.querySelectorAll('video').forEach(v=>{ try{v.pause()}catch{}})
    }
    const handleVis = ()=>{ if(document.hidden) stopAll() }
    document.addEventListener('visibilitychange', handleVis)
    window.addEventListener('blur', stopAll)
    window.addEventListener('pagehide', stopAll)
    return ()=>{
      document.removeEventListener('visibilitychange', handleVis)
      window.removeEventListener('blur', stopAll)
      window.removeEventListener('pagehide', stopAll)
    }
  }, [])

  // AUTO-PLAY SCROLL
  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends') return
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const id = e.target.getAttribute('data-id')
          const v = videoRefs.current.get(id)
          if(v){ 
            videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{} })
            try{ v.muted=isMuted; v.play() }catch{}
          }
        }
      })
    }, {threshold:0.6})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el))
    return ()=>obs.disconnect()
  }, [clips, showPage, tab, isMuted])

  async function doUpload(){
    if(!pendingFile) return
    setUploading(true)
    const n=`${Date.now()}_${pendingFile.name}`
    await supabase.storage.from('Vibra clips').upload(n,pendingFile)
    const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
    await supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:captionText})
    setUploading(false); setShowCaption(false); setPendingFile(null); load()
  }

  const filtered = tab==='following' ? clips.filter(c=>following.has(c.username)) : clips
  const totalLikes = Object.values(likesMap).reduce((a,b)=>a+b, 0)
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return; setPendingFile(f); setShowCaption(true)
      }} />

      {/* #TAGS MODAL */}
      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col justify-end p-4">
          <div className="bg-zinc-900 rounded-3xl p-5">
            <h3 className="text-white font-bold">Andika Caption na #Tags</h3>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} className="w-full bg-zinc-800 text-white p-4 rounded-xl mt-3 h-28 outline-none text-sm" placeholder="#familia #comedy #vibra" />
            <p className="text-zinc-400 text-xs mt-2">Mfano: Familia yangu 😂 #familia #comedy #tanzania</p>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 text-white py-3 rounded-full font-bold">Cancel</button>
              <button onClick={doUpload} className="flex-1 bg-white text-black py-3 rounded-full font-bold">{uploading?'Uploading...':'Post ✓'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 z-20 pt-2 pb-2 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex justify-center gap-6 text-[15px] font-bold">
          <button onClick={()=>{setTab('following'); setShowPage('home')}} className={tab==='following'?'text-white border-b-2 border-white pb-1':'text-white/60'}>Following</button>
          <button onClick={()=>{setTab('foryou'); setShowPage('home')}} className={tab==='foryou'?'text-white border-b-2 border-white pb-1':'text-white/60'}>For You</button>
          <button onClick={()=>{setTab('live'); setShowPage('home')}} className={tab==='live'?'text-white border-b-2 border-white pb-1':'text-white/60'}>LIVE</button>
        </div>
      </div>

      {showPage!=='home' && (
        <div className="absolute inset-0 bg-white z-30 overflow-y-auto">
          {showPage==='me' ? (
            <div className="bg-white min-h-screen">
              <div className="flex items-center justify-between p-3 pt-4">
                <button onClick={()=>setShowPage('home')} className="text-2xl">←</button>
                <p className="font-bold text-[16px]">athman said</p>
                <button className="text-xl">⋮</button>
              </div>
              <div className="flex flex-col items-center pt-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-zinc-200 flex items-center justify-center text-3xl font-bold">V</div>
                </div>
                <p className="font-bold mt-3 text-[15px]">@vibra_boy</p>
                <div className="flex gap-8 mt-4">
                  <div className="text-center"><p className="font-bold text-[16px]">10K</p><p className="text-zinc-500 text-[12px]">Following</p></div>
                  <div className="text-center border-l border-r border-zinc-200 px-8"><p className="font-bold text-[16px]">250.8K</p><p className="text-zinc-500 text-[12px]">Followers</p></div>
                  <div className="text-center"><p className="font-bold text-[16px]">{fmt(totalLikes||2000000)}</p><p className="text-zinc-500 text-[12px]">Likes</p></div>
                </div>
                <div className="flex gap-2 mt-5 w-full px-4">
                  <button className="flex-1 bg-[#FE2C55] text-white py-3 rounded-lg font-bold text-[15px]">Follow</button>
                  <button className="bg-zinc-100 px-4 rounded-lg">👤+</button>
                </div>
                <p className="text-[13px] text-zinc-600 mt-3 px-4 text-center">Familia yangu 😂 #familia #vibra #comedy 🔥</p>
                <div className="flex w-full mt-5 border-b border-zinc-200">
                  <button className="flex-1 py-3 flex justify-center border-b-2 border-black"><span className="text-[18px]">☰</span></button>
                  <button className="flex-1 py-3 flex justify-center text-zinc-400"><span className="text-[18px]">♡</span></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[2px]">
                {clips.map((c,i)=>(
                  <div key={c.id} className="relative aspect-[3/4] bg-black">
                    <video src={c.url} className="w-full h-full object-cover" muted />
                    {i<3 && <span className="absolute top-1 left-1 bg-[#FE2C55] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Pinned</span>}
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[11px] font-bold drop-shadow">▷ {fmt(c.views)}</div>
                    <div className="absolute bottom-6 left-1 text-white text-[8px] bg-black/50 px-1 rounded">{i===0?'15h ago': i===1?'16h ago': i===2?'Just watched': `${Math.floor(Math.random()*20+1)}h ago`}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-black min-h-screen p-4 pt-16">
              <button onClick={()=>setShowPage('home')} className="bg-zinc-800 text-white px-5 py-2 rounded-full text-sm font-bold">← Back - Sauti OFF ✓</button>
              <h2 className="text-white font-bold text-xl mt-6">{showPage.toUpperCase()}</h2>
            </div>
          )}
        </div>
      )}

      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {filtered.map(c=>{
            const liked=myLikes.has(c.id); const isF=following.has(c.username); const comments=commentsMap[c.id]||[]
            return (
              <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} onClick={()=>setIsMuted(!isMuted)} className="h-full w-full object-cover" />
                <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-5 py-2 rounded-full text-white text-sm border border-white font-bold z-10">
                  {isMuted?'🔇 Tap for sound':'🔊 ON'}
                </button>
                <div className="absolute right-2 bottom-28 flex flex-col gap-4 items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5"><div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">V</div></div>
                    <button onClick={()=>{const s=new Set(following); if(s.has(c.username)) s.delete(c.username); else s.add(c.username); setFollowing(s)}} className={`absolute -bottom-1 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${isF?'bg-zinc-600':'bg-[#FF3B5C]'} text-white`}>{isF?'✓':'+'}</button>
                  </div>
                  <button onClick={async()=>{ if(liked){ await supabase.from('likes').delete().eq('clip_id',c.id).eq('user_id','vibra_boy'); setMyLikes(p=>{const n=new Set(p); n.delete(c.id); return n}); setLikesMap(m=>({...m,[c.id]:Math.max(0,(m[c.id]||1)-1)}))} else { await supabase.from('likes').insert({clip_id:c.id,user_id:'vibra_boy'}); setMyLikes(p=>{const n=new Set(p); n.add(c.id); return n}); setLikesMap(m=>({...m,[c.id]:(m[c.id]||0)+1}))}}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${liked?'bg-[#FF3B5C]':'bg-white/20'}`}>❤️</div><span className="text-white text-xs font-bold">{likesMap[c.id]||0}</span></button>
                  <button onClick={()=>setActiveClip(activeClip===c.id?null:c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">💬</div><span className="text-white text-xs font-bold">{comments.length}</span></button>
                </div>
                <div className="absolute bottom-20 left-3 right-20 text-white">
                  <p className="font-bold text-sm">@{c.username}</p>
                  <p className="text-[13px] mt-1">{c.caption}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] z-30 items-center h-[60px]">
        <button onClick={()=>{setShowPage('home'); setTab('foryou')}} className="flex flex-col items-center"><span className="text-[20px]">🏠</span><span>Home</span></button>
        <button onClick={()=>setShowPage('explore')} className="flex flex-col items-center"><span className="text-[20px]">🔍</span><span>Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}>{uploading?'...':'+'}</button>
        <button onClick={()=>setShowPage('inbox')} className="flex flex-col items-center"><span className="text-[20px]">📩</span><span>Inbox</span></button>
        <button onClick={()=>setShowPage('me')} className="flex flex-col items-center"><span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center font-bold">V</span><span>Me</span></button>
      </div>
    </div>
  )
}
