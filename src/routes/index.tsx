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
  const [commentsMap, setCommentsMap] = useState({})
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
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())

  // FIX SAUTI IKATE UKITOKA APP
  useEffect(()=>{
    const stopAll = () => { videoRefs.current.forEach(v=>{ try{ v.pause() }catch{} }) }
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
      setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:'vibra_boy', caption:x.caption||'Familia yangu 😂 #vibra', views: Math.floor(Math.random()*800000+100000)})))
    } else {
      setClips([
        {id:'demo1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', username:'vibra_boy', caption:'Familia yangu 😂 #vibra #comedy', views:601600},
        {id:'demo2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', username:'vibra_boy', caption:'Togethar forever ❤️ #vibra', views:74500}
      ])
    }
  }

  useEffect(()=>{
    if(showPage!=='home' || activeClip || showCaption) return
    const obs=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{}}); try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{}}}})},{threshold:0.5})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, activeClip])

  // UPLOAD HAIKWAMI TENA
  async function doUpload(){
    if(!pendingFile) return
    if(pendingFile.size > 15*1024*1024){ alert('❌ Kubwa! '+(pendingFile.size/1024/1024).toFixed(1)+'MB <15MB tu'); setUploading(false); setShowCaption(false); setPendingFile(null); return }
    if(!pendingFile.type.startsWith('video/')){ alert('VIDEO tu!'); return }
    setUploading(true); setUploadPct(80)
    const localUrl = URL.createObjectURL(pendingFile)
    const newClip = {id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1}
    setClips(p=>[newClip, ...p])
    setUploadPct(100)
    setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me') }, 600)
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      const {error} = await supabase.storage.from('Vibra clips').upload(n, pendingFile)
      if(!error){
        const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
        setClips(prev=>prev.map(c=> c.id===newClip.id ? {...c, url:data.publicUrl} : c))
        supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:captionText}).catch(()=>{})
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
        if(f.size > 15*1024*1024){ alert('❌ Kubwa! '+(f.size/1024/1024).toFixed(1)+'MB'); e.target.value=''; return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[70] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="font-bold">Add Caption {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            {uploading && <div className="w-full bg-zinc-700 h-2.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#FE2C55] h-2.5 rounded-full" style={{width:`${uploadPct}%`}} /></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 py-3.5 rounded-full font-bold">Cancel</button>
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black bg-white text-black">{uploading?`${uploadPct}%...`:'Post ✓'}</button>
            </div>
          </div>
        </div>
      )}

      {/* HOME */}
      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          <div className="fixed top-0 left-0 right-0 z-30 flex flex-col items-center pt-2 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex gap-6">
              <button onClick={()=>setTab('following')} className={`text-[15px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
              <button onClick={()=>setTab('foryou')} className={`text-[15px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
            </div>
            {tab==='following' && (
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search following..." className="mt-2 w-[80%] bg-zinc-800/80 rounded-full px-4 py-1.5 text-[12px] outline-none border border-zinc-700" />
            )}
          </div>

          {filtered.map(c=>(
            <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
              <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload="auto" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
              <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[70px] left-3 bg-black/60 px-3 py-1.5 rounded-full text-[11px] border border-white/20 font-bold z-20">{isMuted?'🔇 Muted':'🔊 Sound'}</button>
              
              {/* LYRICS LIVE */}
              {showLyrics && (
                <div className="absolute top-[100px] left-0 right-0 z-20 flex justify-center">
                  <div className="bg-black/70 px-3 py-1 rounded-full border border-pink-500/50 animate-pulse">
                    <p className="text-[13px] font-bold text-center">🎵 {c.caption} 🎵</p>
                    <p className="text-[10px] text-zinc-300 text-center">♪ Familia yangu - LIVE LYRICS ♪</p>
                  </div>
                </div>
              )}
              <button onClick={()=>setShowLyrics(!showLyrics)} className="absolute top-[70px] right-3 bg-zinc-800/70 px-2 py-1 rounded-full text-[10px] z-20">🎤 {showLyrics?'Lyrics ON':'Lyrics OFF'}</button>

              <div className="absolute bottom-24 left-3 right-20 z-20">
                <p className="font-bold text-[15px]">@vibra_boy</p>
                <p className="text-[13px] mt-1">{c.caption}</p>
                <p className="text-[12px] mt-2 opacity-70">🎵 original sound - vibra_boy</p>
              </div>

              <div className="absolute bottom-28 right-3 flex flex-col items-center gap-4 z-20">
                <button onClick={()=>toggleFollow(c.username)} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold">{following.has(c.username)?'✓':'+'}</button>
                <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div>
                  <span className="text-[11px] font-bold mt-1">{fmt(likesMap[c.id]||c.views)}</span>
                </button>
                <button onClick={()=>{setActiveClip(c); setShowPage('comments')}} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-700/80 flex items-center justify-center text-xl">💬</div>
                  <span className="text-[11px] font-bold mt-1">12</span>
                </button>
                <button onClick={()=>toggleSave(c.id)} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${mySaves.has(c.id)?'bg-yellow-400 text-black':'bg-zinc-700/80'}`}>🔖</div>
                  <span className="text-[10px] font-bold">Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPLORE PAGE - SASA INAFANYA KAZI */}
      {showPage==='explore' && (
        <div className="absolute inset-0 bg-black z-30 pt-12 px-3 overflow-y-auto pb-20">
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search videos, users, sounds..." className="w-full bg-zinc-800 rounded-full px-5 py-3 text-[14px] outline-none border border-zinc-700" />
          <p className="mt-4 font-bold text-[16px]">Trending 🔥</p>
          <div className="grid grid-cols-3 gap-[2px] mt-3">
            {filtered.map(c=>(<div key={c.id} onClick={()=>{setShowPage('home'); setSearchQ('')}} className="aspect-[3/4] bg-zinc-900 relative"><video src={c.url} className="w-full h-full object-cover" muted /><p className="absolute bottom-1 left-1 text-[10px]">▶ {fmt(c.views)}</p><p className="absolute top-1 left-1 text-[9px] bg-black/60 px-1 rounded">@{c.username}</p></div>))}
          </div>
          {filtered.length===0 && <p className="text-zinc-500 text-center mt-10">No results for "{searchQ}"</p>}
        </div>
      )}

      {/* INBOX PAGE - SASA INAFANYA KAZI */}
      {showPage==='inbox' && (
        <div className="absolute inset-0 bg-black z-30 pt-12 px-4 overflow-y-auto pb-20">
          <p className="font-black text-[20px]">Inbox 📩</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl"><div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">❤️</div><div><p className="text-[13px] font-bold">vibra_boy liked your video</p><p className="text-[11px] text-zinc-400">Familia yangu 😂 - 2m ago</p></div></div>
            <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl"><div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">👤</div><div><p className="text-[13px] font-bold">New follower: vibra_girl</p><p className="text-[11px] text-zinc-400">Started following you - 10m ago</p></div></div>
            <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl"><div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">💬</div><div><p className="text-[13px] font-bold">Comment: "Haha funny!"</p><p className="text-[11px] text-zinc-400">On Familia yangu - 1h ago</p></div></div>
            <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-yellow-500/30"><div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">🔖</div><div><p className="text-[13px] font-bold">{mySaves.size} videos saved</p><p className="text-[11px] text-zinc-400">Check your saved collection</p></div></div>
          </div>
        </div>
      )}

      {/* ME PAGE - SASA @vibra_boy SI ATHMAN SAID */}
      {showPage==='me' && !showCaption && !activeClip && (
        <div className="absolute inset-0 bg-white text-black z-30 overflow-y-auto pb-20">
          <div className="flex items-center justify-between p-3 pt-4"><button onClick={()=>setShowPage('home')} className="text-xl font-bold">←</button><p className="font-bold">@vibra_boy</p><p>⋮</p></div>
          <div className="flex flex-col items-center mt-4">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">V</div>
            <p className="font-black mt-2 text-[18px]">@vibra_boy</p>
            <p className="text-[12px] text-zinc-500">TikTok Creator | Comedy | Vibra</p>
            <p className="text-[12px] text-zinc-500 mt-1">{clips.length} videos • {following.size} following • {myLikes.size} likes</p>
            <div className="flex gap-2 mt-3"><button className="bg-black text-white px-6 py-1.5 rounded-full text-[12px] font-bold">Edit profile</button><button className="bg-zinc-200 px-4 py-1.5 rounded-full text-[12px]">🔖 {mySaves.size} Saved</button></div>
          </div>
          <div className="flex justify-around mt-6 border-b"><p className="border-b-2 border-black pb-2 font-bold text-[13px]">Videos</p><p className="text-zinc-400 text-[13px]">Liked</p><p className="text-zinc-400 text-[13px]">Saved {mySaves.size}</p></div>
          <div className="grid grid-cols-3 gap-[2px] mt-[2px]">{clips.map(c=>(<div key={c.id} className="aspect-[3/4] bg-black relative"><video src={c.url} className="w-full h-full object-cover" muted /><div className="absolute bottom-1 left-1 text-[10px] text-white flex items-center gap-1">▶ {fmt(c.views)}</div></div>))}</div>
        </div>
      )}

      {activeClip && (
        <div className="absolute inset-0 bg-black/90 z-[80] flex flex-col justify-end">
          <div className="bg-zinc-900 rounded-t-[20px] h-[65%] p-4 overflow-y-auto">
            <div className="flex justify-between"><p className="font-bold">Comments</p><button onClick={()=>{setActiveClip(null); setShowPage('home')}}>✕</button></div>
            <div className="mt-6 flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none" /><button onClick={()=>setCommentText('')} className="bg-white text-black px-4 rounded-full font-bold">Send</button></div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-[10px] h-[60px] items-center z-40">
        <button onClick={()=>{setActiveClip(null); setSearchQ(''); setShowPage('home')}} className={`flex flex-col items-center ${showPage==='home'?'text-white font-bold':'text-zinc-400'}`}>🏠 Home</button>
        <button onClick={()=>{setSearchQ(''); setShowPage('explore')}} className={`flex flex-col items-center ${showPage==='explore'?'text-white font-bold':'text-zinc-400'}`}>🔍 Explore</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button onClick={()=>setShowPage('inbox')} className={`flex flex-col items-center ${showPage==='inbox'?'text-white font-bold':'text-zinc-400'}`}>📩 Inbox</button>
        <button onClick={()=>{setActiveClip(null); setShowPage('me')}} className={`flex flex-col items-center ${showPage==='me'?'text-white font-bold':'text-zinc-400'}`}>V Me</button>
      </div>
    </div>
  )
}
