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
  const [showLyrics, setShowLyrics] = useState(true)
  const [meTab, setMeTab] = useState('videos')
  const [selectedFromMe, setSelectedFromMe] = useState(null)
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())
  const meVideoRef = useRef(null)

  useEffect(()=>{
    const stopAll = () => { videoRefs.current.forEach(v=>{ try{ v.pause() }catch{} }); if(meVideoRef.current) try{meVideoRef.current.pause()}catch{} }
    const handleVis = () => { if(document.hidden) stopAll() }
    document.addEventListener('visibilitychange', handleVis)
    window.addEventListener('pagehide', stopAll)
    window.addEventListener('blur', stopAll)
    return ()=>{ document.removeEventListener('visibilitychange', handleVis); window.removeEventListener('pagehide', stopAll); window.removeEventListener('blur', stopAll) }
  }, [])

  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){
      setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:'athman said', caption:x.caption||'Familia yangu 😂', views: Math.floor(Math.random()*800000+100000), pinned:false})))
    } else {
      setClips([
        {id:'1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'SHOUT OUT TO MY BABY', views:756800, pinned:true, time:'15h ago'},
        {id:'2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Togethar forever', views:1400000, pinned:true, time:'16h ago'},
        {id:'3', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption:'2025', views:1300000, pinned:true},
        {id:'4', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption:'Familia yangu 😂', views:554900, pinned:false},
        {id:'5', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption:'IMEMRCHS FEAT. D VOICE', views:1600},
        {id:'6', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption:'Just watched', views:890},
      ])
    }
  }

  useEffect(()=>{
    if(showPage!=='home' || activeClip || showCaption || selectedFromMe) return
    const obs=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{}}); try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{}}}})},{threshold:0.5})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, activeClip, selectedFromMe])

  async function doUpload(){
    if(!pendingFile) return
    if(pendingFile.size > 15*1024*1024){ alert('❌ <15MB tu'); setUploading(false); setShowCaption(false); setPendingFile(null); return }
    if(!pendingFile.type.startsWith('video/')){ alert('VIDEO tu!'); return }
    setUploading(true); setUploadPct(80)
    const localUrl = URL.createObjectURL(pendingFile)
    const newClip = {id:Date.now().toString(), url:localUrl, username:'athman said', caption:captionText, views:1, pinned:false, time:'now'}
    setClips(p=>[newClip, ...p])
    setUploadPct(100)
    setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me') }, 600)
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      const {error} = await supabase.storage.from('Vibra clips').upload(n, pendingFile)
      if(!error){
        const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
        setClips(prev=>prev.map(c=> c.id===newClip.id ? {...c, url:data.publicUrl} : c))
        supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'athman said', caption:captionText}).catch(()=>{})
      }
    }catch{}
  }

  const toggleLike = (id)=>{ setMyLikes(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }); setLikesMap(m=>({...m, [id]:(m[id]||0)+(myLikes.has(id)?-1:1)})) }
  const toggleFollow = (user)=>{ setFollowing(s=>{ const n=new Set(s); if(n.has(user)) n.delete(user); else n.add(user); return n }) }
  const toggleSave = (id)=>{ setMySaves(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }) }
  const filtered = clips.filter(c=>{
    if(searchQ) return c.caption.toLowerCase().includes(searchQ.toLowerCase()) || c.username.toLowerCase().includes(searchQ.toLowerCase())
    if(tab==='following') return following.has(c.username)
    return true
  })
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n.toString()

  return (
    <div className="h-screen bg-black relative overflow-hidden text-white">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return
        if(!f.type.startsWith('video/')){ alert('VIDEO tu!'); e.target.value=''; return }
        if(f.size > 15*1024*1024){ alert('❌ Kubwa!'); e.target.value=''; return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {/* UPLOAD MODAL - POST BUTTON SASA RED SI WHITE TU */}
      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[70] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="font-bold">Add Caption {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            {uploading && <div className="w-full bg-zinc-700 h-2.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#FE2C55] h-2.5 rounded-full" style={{width:`${uploadPct}%`}} /></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 py-3.5 rounded-full font-bold">Cancel</button>
              {/* HAPA NDIO FIX - POST SI WHITE TU TENA, NI RED! */}
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black text-white bg-[#FE2C55] border-2 border-white shadow-lg">{uploading?`${uploadPct}%...`:'POST 🔥'}</button>
            </div>
            <p className="text-zinc-400 text-[11px] mt-2 text-center">Button sasa ni RED, si white tu!</p>
          </div>
        </div>
      )}

      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {/* JUU KUNA SEARCH BAR + FOLLOW + LIVE */}
          <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-800/80 rounded-full px-3 py-1.5 flex items-center gap-2 border border-zinc-700">
                <span className="text-[12px]">🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search" className="bg-transparent text-[12px] outline-none flex-1" />
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setTab('following')} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${tab==='following'?'bg-white text-black':'bg-zinc-800 text-white border-zinc-600'}`}>Follow</button>
                <button className="px-2 py-1 rounded-full text-[11px] font-bold bg-[#FE2C55] animate-pulse">LIVE</button>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <button onClick={()=>setTab('following')} className={`text-[14px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
              <button onClick={()=>setTab('foryou')} className={`text-[14px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
            </div>
          </div>

          {filtered.map(c=>(
            <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
              <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload="auto" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
              <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[95px] left-3 bg-black/60 px-3 py-1 rounded-full text-[11px] border border-white/20 font-bold z-20">{isMuted?'🔇 Muted':'🔊 Sound'}</button>

              <div className="absolute bottom-24 left-3 right-20 z-20">
                <p className="font-bold text-[15px]">@vibra_boy</p>
                <p className="text-[13px] mt-1">{c.caption}</p>
                <p className="text-[11px] mt-1 opacity-70">🎵 original sound - vibra_boy</p>
              </div>

              {/* RIGHT SIDE - LYRICS CHINI YA SHARE */}
              <div className="absolute bottom-28 right-3 flex flex-col items-center gap-3 z-20">
                <button onClick={()=>toggleFollow(c.username)} className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-[12px]">{following.has(c.username)?'✓':'+'}</button>
                <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div>
                  <span className="text-[10px] font-bold mt-1">{fmt(likesMap[c.id]||c.views)}</span>
                </button>
                <button onClick={()=>{setActiveClip(c); setShowPage('comments')}} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">💬</div>
                  <span className="text-[10px] font-bold mt-1">12</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">↗️</div>
                  <span className="text-[10px] font-bold mt-1">Share</span>
                </button>
                {/* LYRICS SASA CHINI YA SHARE */}
                {showLyrics && (
                  <div className="mt-1 bg-black/70 border border-pink-500/50 rounded-full px-2 py-1 max-w-[80px]">
                    <p className="text-[8px] font-bold text-center leading-tight">🎵 {c.caption.slice(0,20)} LIVE</p>
                  </div>
                )}
                <button onClick={()=>setShowLyrics(!showLyrics)} className="bg-zinc-800/70 px-2 py-0.5 rounded-full text-[8px]">🎤 {showLyrics?'ON':'OFF'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPage==='explore' && (
        <div className="absolute inset-0 bg-black z-30 pt-12 px-3 overflow-y-auto pb-20">
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search videos, users, sounds..." className="w-full bg-zinc-800 rounded-full px-5 py-3 text-[14px] outline-none border border-zinc-700" />
          <div className="grid grid-cols-3 gap-[2px] mt-3">{filtered.map(c=>(<div key={c.id} className="aspect-[3/4] bg-zinc-900 relative"><video src={c.url} className="w-full h-full object-cover" muted /><p className="absolute bottom-1 left-1 text-[10px]">▶ {fmt(c.views)}</p></div>))}</div>
        </div>
      )}

      {showPage==='inbox' && (
        <div className="absolute inset-0 bg-black z-30 pt-12 px-4 overflow-y-auto pb-20">
          <p className="font-black text-[20px]">Inbox 📩</p>
          <div className="mt-5 bg-zinc-900 p-3 rounded-xl"><p className="text-[13px] font-bold">❤️ vibra_boy liked your video - 2m ago</p></div>
        </div>
      )}

      {/* ME PAGE - KAMA TIKTOK ATHMAN SAID + UKITAP VIDEO INA BUTTONS */}
      {showPage==='me' && !showCaption && !activeClip && !selectedFromMe && (
        <div className="absolute inset-0 bg-white text-black z-30 overflow-y-auto pb-20">
          <div className="flex items-center justify-between p-3 pt-2">
            <button onClick={()=>setShowPage('home')} className="text-2xl">←</button>
            <p className="font-bold text-[16px]">athman said</p>
            <p className="text-xl">⋮</p>
          </div>

          {/* FOLLOWERS / FOLLOW / LIKE KAMA ULICHOOMBA */}
          <div className="flex justify-center gap-6 mt-1">
            <div className="text-center"><p className="font-black text-[16px]">10K</p><p className="text-[11px] text-zinc-500">Following</p></div>
            <div className="text-center border-l pl-6"><p className="font-black text-[16px]">250.8K</p><p className="text-[11px] text-zinc-500">Followers</p></div>
            <div className="text-center border-l pl-6"><p className="font-black text-[16px]">2.0M</p><p className="text-[11px] text-zinc-500">Likes</p></div>
          </div>

          <div className="flex justify-center gap-2 mt-3 px-10">
            <button className="flex-1 bg-[#FE2C55] text-white py-2 rounded-[6px] font-bold text-[14px]">Follow</button>
            <button className="bg-zinc-100 px-3 rounded-[6px]">👤+</button>
          </div>

          <div className="flex justify-around mt-3 border-b py-2">
            <button onClick={()=>setMeTab('videos')} className={`text-[16px] ${meTab==='videos'?'border-b-2 border-black':''}`}>☰</button>
            <button className="text-[18px]">♡</button>
          </div>

          <div className="grid grid-cols-3 gap-[1px] bg-white">
            {clips.map(c=>(
              <div key={c.id} onClick={()=>setSelectedFromMe(c)} className="aspect-[4/5] bg-black relative">
                <video src={c.url} className="w-full h-full object-cover" muted />
                {c.pinned && <div className="absolute top-1 left-1 bg-[#FE2C55] text-white text-[9px] px-1 rounded font-bold">Pinned</div>}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1"><p className="text-white text-[10px] font-bold">▶ {fmt(c.views)}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UKITAP VIDEO KWENYE ME - SASA INA BUTTONS ZOTE KAMA HOME! */}
      {selectedFromMe && (
        <div className="absolute inset-0 bg-black z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 pt-2 text-white">
            <button onClick={()=>setSelectedFromMe(null)} className="text-xl">←</button>
            <p className="font-bold text-[14px]">athman said • {fmt(selectedFromMe.views)} views</p>
            <p>⋮</p>
          </div>
          <div className="flex-1 relative">
            <video ref={meVideoRef} src={selectedFromMe.url} autoPlay loop playsInline controls={false} onClick={(e)=>{ if(meVideoRef.current){ if(meVideoRef.current.paused) meVideoRef.current.play(); else meVideoRef.current.pause() } }} className="h-full w-full object-contain bg-black" />
            {/* BUTTONS KAMA HOME */}
            <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
              <button onClick={()=>toggleFollow(selectedFromMe.username)} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold">{following.has(selectedFromMe.username)?'✓':'+'}</button>
              <button onClick={()=>toggleLike(selectedFromMe.id)} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${myLikes.has(selectedFromMe.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[11px] font-bold text-white mt-1">{fmt(likesMap[selectedFromMe.id]||selectedFromMe.views)}</span></button>
              <button className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-zinc-700/80 flex items-center justify-center text-xl">💬</div><span className="text-[11px] text-white">12</span></button>
              <button className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">↗️</div><span className="text-[10px] text-white">Share</span></button>
              {showLyrics && <div className="bg-black/70 border border-pink-500/50 rounded-full px-2 py-1"><p className="text-[8px] text-white text-center">🎵 {selectedFromMe.caption} LIVE</p></div>}
            </div>
            <div className="absolute bottom-20 left-3 right-20 text-white">
              <p className="font-bold">@athman said</p>
              <p className="text-[13px]">{selectedFromMe.caption}</p>
              <p className="text-[11px] mt-2">🎵 10K Following • 250.8K Followers • 2.0M Likes</p>
            </div>
          </div>
        </div>
      )}

      {activeClip && (
        <div className="absolute inset-0 bg-black/90 z-[80] flex flex-col justify-end">
          <div className="bg-zinc-900 rounded-t-[20px] h-[65%] p-4 overflow-y-auto">
            <div className="flex justify-between"><p className="font-bold">Comments</p><button onClick={()=>{setActiveClip(null); setShowPage('home')}}>✕</button></div>
            <div className="mt-6 flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none text-white" /><button className="bg-white text-black px-4 rounded-full font-bold">Send</button></div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-[10px] h-[60px] items-center z-40">
        <button onClick={()=>{setActiveClip(null); setSelectedFromMe(null); setShowPage('home')}} className={`flex flex-col items-center ${showPage==='home'?'text-white font-bold':'text-zinc-400'}`}>🏠 Home</button>
        <button onClick={()=>{setShowPage('explore')}} className={`flex flex-col items-center ${showPage==='explore'?'text-white font-bold':'text-zinc-400'}`}>🔍 Explore</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button onClick={()=>setShowPage('inbox')} className={`flex flex-col items-center ${showPage==='inbox'?'text-white font-bold':'text-zinc-400'}`}>📩 Inbox</button>
        <button onClick={()=>{setActiveClip(null); setShowPage('me')}} className={`flex flex-col items-center ${showPage==='me'?'text-white font-bold':'text-zinc-400'}`}>V Me</button>
      </div>
    </div>
  )
}
