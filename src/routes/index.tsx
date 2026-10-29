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
  const [playFromMe, setPlayFromMe] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [displayName, setDisplayName] = useState('athman said')
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())

  // === FIX 1: SAUTI IKATE UKITOKA APP ===
  useEffect(()=>{
    const stopAll = () => {
      videoRefs.current.forEach(v=>{ try{ v.pause() }catch{} })
    }
    const handleVis = () => { if(document.hidden) stopAll() }
    document.addEventListener('visibilitychange', handleVis)
    window.addEventListener('pagehide', stopAll)
    window.addEventListener('blur', stopAll)
    window.addEventListener('beforeunload', stopAll)
    return ()=>{
      document.removeEventListener('visibilitychange', handleVis)
      window.removeEventListener('pagehide', stopAll)
      window.removeEventListener('blur', stopAll)
      window.removeEventListener('beforeunload', stopAll)
    }
  }, [])

  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){
      setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂 #vibra', views: Math.floor(Math.random()*800000+100000)})))
    } else {
      setClips([{id:'demo1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', username:'vibra_boy', caption:'Familia yangu 😂 #vibra', views:834000}])
    }
  }

  useEffect(()=>{
    if(showPage!=='home' || playFromMe || showCaption || activeClip) return
    const t=setTimeout(()=>{ const first=clips[0]?.id; if(first){ const v=videoRefs.current.get(first); if(v){ try{v.muted=true; v.play()}catch{}} } }, 600)
    return ()=>clearTimeout(t)
  }, [clips, showPage, playFromMe, showCaption, activeClip])

  useEffect(()=>{
    if(showPage!=='home' || showCaption || playFromMe || activeClip) return
    const obs=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{}}); try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{}}}})},{threshold:0.5})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, playFromMe, activeClip])

  // === FIX 2: VIDEO KUBWA BLOCK ===
  async function doUpload(){
    if(!pendingFile) return
    if(pendingFile.size > 15*1024*1024){
      alert('❌ Kubwa mno! '+(pendingFile.size/1024/1024).toFixed(1)+'MB\nChagua <15MB & <15sec')
      setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0);
      return
    }
    setUploading(true); setUploadPct(15)
    let finished=false
    const timeout = setTimeout(()=>{
      if(!finished){
        finished=true
        const localUrl=URL.createObjectURL(pendingFile)
        const newClip={id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1}
        setClips(p=>[newClip, ...p])
        setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me')
        alert('✅ Ime-add Fast Mode! (Supabase ilichelewa)')
      }
    }, 10000)
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      setUploadPct(40)
      const {error} = await supabase.storage.from('Vibra clips').upload(n, pendingFile, {cacheControl:'3600'})
      if(error) throw error
      if(finished) return
      clearTimeout(timeout)
      const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
      setUploadPct(85)
      await supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:captionText}).catch(()=>{})
      const newClip={id:Date.now().toString(), url:data.publicUrl, username:'vibra_boy', caption:captionText, views:1}
      setClips(p=>[newClip, ...p])
      setUploadPct(100)
      finished=true
      setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me'); }, 400)
    }catch(e){
      if(finished) return
      clearTimeout(timeout)
      console.log(e)
      const localUrl=URL.createObjectURL(pendingFile)
      const newClip={id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1}
      setClips(p=>[newClip, ...p])
      setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me')
    }
  }

  const toggleLike = (id)=>{
    setMyLikes(s=>{
      const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n
    })
    setLikesMap(m=>({...m, [id]:(m[id]||0)+(myLikes.has(id)?-1:1)}))
  }
  const toggleFollow = (user)=>{
    setFollowing(s=>{ const n=new Set(s); if(n.has(user)) n.delete(user); else n.add(user); return n })
  }
  const toggleSave = (id)=>{
    setMySaves(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n })
  }
  const filtered = tab==='following' ? clips.filter(c=>following.has(c.username)) : clips
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n.toString()

  return (
    <div className="h-screen bg-black relative overflow-hidden text-white">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return
        if(f.size > 15*1024*1024){
          alert('❌ Video kubwa! '+(f.size/1024/1024).toFixed(1)+'MB\nTumia video <15MB & <15sec')
          e.target.value=''; return
        }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[70] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="font-bold">Add Caption {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            {uploading && <div className="w-full bg-zinc-700 h-2.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#FE2C55] h-2.5 rounded-full transition-all" style={{width:`${uploadPct}%`}} /></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setUploadPct(0); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 py-3.5 rounded-full font-bold">Cancel</button>
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black bg-white text-black">{uploading?`${uploadPct}%...`:'Post ✓'}</button>
            </div>
            <p className="text-zinc-400 text-[11px] mt-2 text-center">&lt;15MB = Fast! Sauti inakata ukitoka app!</p>
          </div>
        </div>
      )}

      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {/* TOP TABS */}
          <div className="fixed top-0 left-0 right-0 z-30 flex justify-center gap-6 pt-3 pb-2 bg-gradient-to-b from-black/70 to-transparent">
            <button onClick={()=>setTab('following')} className={`text-[15px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button>
            <button onClick={()=>setTab('foryou')} className={`text-[15px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>
          </div>

          {filtered.map(c=>(
            <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
              <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload="auto" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
              
              <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[58px] left-3 bg-black/60 px-3 py-1.5 rounded-full text-white text-[11px] border border-white/20 font-bold z-20">{isMuted?'🔇 Muted':'🔊 Sound'}</button>

              <div className="absolute bottom-24 left-3 right-20 z-20">
                <p className="font-bold text-[15px]">@{c.username}</p>
                <p className="text-[13px] mt-1 leading-4">{c.caption}</p>
                <p className="text-[12px] mt-2 opacity-70">🎵 original sound - {c.username}</p>
              </div>

              <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5 z-20">
                <button onClick={()=>toggleFollow(c.username)} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-xs">{following.has(c.username)?'✓':' +'}</button>
                <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div>
                  <span className="text-[11px] font-bold mt-1">{fmt((likesMap[c.id]||c.views||834000))}</span>
                </button>
                <button onClick={()=>{setActiveClip(c); setShowPage('comments')}} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-700/80 flex items-center justify-center text-2xl">💬</div>
                  <span className="text-[11px] font-bold mt-1">{(commentsMap[c.id]?.length||12)}</span>
                </button>
                <button onClick={()=>toggleSave(c.id)} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${mySaves.has(c.id)?'bg-yellow-400 text-black':'bg-zinc-700/80'}`}>🔖</div>
                  <span className="text-[11px] font-bold mt-1">{mySaves.has(c.id)?'Saved':'Save'}</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-700/80 flex items-center justify-center">↗️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPage==='me' && !showCaption && !activeClip && (
        <div className="absolute inset-0 bg-white text-black z-30 overflow-y-auto pb-20">
          <div className="flex items-center justify-between p-3 pt-4"><button onClick={()=>setShowPage('home')} className="text-2xl font-bold">←</button><p className="font-bold">{displayName}</p><p>⋮</p></div>
          <div className="flex flex-col items-center mt-4">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">V</div>
            <p className="font-bold mt-2">@{displayName}</p>
            <p className="text-[12px] text-zinc-500">{clips.length} videos • {following.size} following</p>
          </div>
          <div className="grid grid-cols-3 gap-[2px] mt-4">{clips.map(c=>(<div key={c.id} className="aspect-[3/4] bg-black relative"><video src={c.url} className="w-full h-full object-cover" muted /><div className="absolute bottom-1 left-1 text-[10px] text-white">▶ {fmt(c.views)}</div></div>))}</div>
        </div>
      )}

      {activeClip && (
        <div className="absolute inset-0 bg-black/90 z-[80] flex flex-col justify-end">
          <div className="bg-zinc-900 rounded-t-[20px] h-[70%] p-4 overflow-y-auto">
            <div className="flex justify-between"><p className="font-bold">Comments {commentsMap[activeClip.id]?.length||0}</p><button onClick={()=>{setActiveClip(null); setShowPage('home')}}>✕</button></div>
            <div className="mt-4 space-y-3">
              <p className="text-zinc-400 text-sm">No comments yet. Be first!</p>
            </div>
            <div className="flex gap-2 mt-4"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none" /><button onClick={()=>{ if(!commentText) return; setCommentsMap(m=>({...m, [activeClip.id]:[...(m[activeClip.id]||[]), commentText]})); setCommentText('')}} className="bg-white text-black px-4 rounded-full font-bold">Send</button></div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] h-[60px] items-center z-40">
        <button onClick={()=>{setActiveClip(null); setShowPage('home')}} className="flex flex-col items-center">🏠 Home</button>
        <button className="flex flex-col items-center">🔍 Explore</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button className="flex flex-col items-center">📩 Inbox</button>
        <button onClick={()=>{setActiveClip(null); setShowPage('me')}} className="flex flex-col items-center">V Me</button>
      </div>
    </div>
  )
}
