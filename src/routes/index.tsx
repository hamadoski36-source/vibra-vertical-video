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
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())
  const meVideoRef = useRef(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){
      setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:'vibra_boy', caption:x.caption||'Familia yangu 😂', views: Math.floor(Math.random()*800000+100000), pinned:false})))
    } else {
      setClips([
        {id:'1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'Familia yangu 😂', views:699300, pinned:true},
        {id:'2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Togethar forever ❤️', views:707600, pinned:true},
        {id:'3', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption:'SHOUT OUT TO MY BABY', views:756800, pinned:true},
        {id:'4', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption:'2025 challenge', views:554900},
        {id:'5', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption:'IMEMRCHS FEAT. D VOICE', views:451100},
        {id:'6', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption:'Love story', views:268700},
      ])
    }
  }

  useEffect(()=>{
    if(showPage!=='home' || activeClip || showCaption || selectedFromMe || isLive) return
    const obs=new IntersectionObserver((ents)=>{ 
      ents.forEach(e=>{ 
        if(e.isIntersecting){ 
          const id=e.target.getAttribute('data-id'); 
          const v=videoRefs.current.get(id); 
          if(v){ 
            videoRefs.current.forEach((vv,k)=>{ if(k!==id){ try{ vv.pause(); }catch{} } });
            try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{}
          }
        } else {
          const id=e.target.getAttribute('data-id');
          const v=videoRefs.current.get(id);
          if(v) try{ v.pause() }catch{}
        }
      })
    },{threshold:0.7})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); 
    return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, activeClip, selectedFromMe, isLive])

  async function doUpload(){
    if(!pendingFile) return
    setUploading(true); setUploadPct(80)
    const localUrl = URL.createObjectURL(pendingFile)
    const newClip = {id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1, pinned:false}
    setClips(p=>[newClip, ...p])
    setUploadPct(100)
    setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me') }, 600)
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      const {error} = await supabase.storage.from('Vibra clips').upload(n, pendingFile)
      if(!error){
        const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
        setClips(prev=>prev.map(c=> c.id===newClip.id ? {...c, url:data.publicUrl} : c))
      }
    }catch{}
  }

  const toggleLike = (id)=>{ setMyLikes(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }); setLikesMap(m=>({...m, [id]:(m[id]||0)+(myLikes.has(id)?-1:1)})) }
  const toggleFollow = (user)=>{ setFollowing(s=>{ const n=new Set(s); if(n.has(user)) n.delete(user); else n.add(user); return n }) }
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
        if(f.size > 15*1024*1024){ alert('❌ <15MB tu'); e.target.value=''; return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[70] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="font-bold text-white">Add Caption {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 py-3.5 rounded-full font-bold text-white">Cancel</button>
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black text-white bg-[#FE2C55] border-2 border-white">POST 🔥</button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PAGE - SASA INAFANYA! */}
      {isLive && (
        <div className="absolute inset-0 bg-black z-[90] flex flex-col">
          <div className="flex items-center justify-between p-3 bg-black/80">
            <button onClick={()=>setIsLive(false)} className="text-white text-xl">←</button>
            <div className="flex items-center gap-2">
              <span className="bg-[#FE2C55] px-2 py-1 rounded text-[10px] font-bold animate-pulse">● LIVE</span>
              <span className="bg-black/60 px-2 py-1 rounded text-[10px]">👁 2.4K</span>
            </div>
            <span className="text-white">⋮</span>
          </div>
          <div className="flex-1 bg-zinc-900 flex items-center justify-center flex-col">
            <p className="text-6xl">🔴</p>
            <p className="text-white font-bold mt-4 text-xl">@vibra-boy LIVE</p>
            <p className="text-zinc-400 text-sm mt-2">Familia yangu 😂 - Live now!</p>
            <div className="mt-6 bg-zinc-800 p-3 rounded-xl w-[80%]">
              <p className="text-[12px] text-white"><b>user123:</b> 😂😂😂</p>
              <p className="text-[12px] text-white mt-1"><b>vibra_fan:</b> 🔥🔥🔥</p>
              <p className="text-[12px] text-white mt-1"><b>mama:</b> Familia yangu!</p>
            </div>
            <button onClick={()=>setIsLive(false)} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold">End LIVE</button>
          </div>
        </div>
      )}

      {showPage==='home' && !isLive && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-800/80 rounded-full px-3 py-1.5 flex items-center gap-2 border border-zinc-700">
                <span className="text-[12px]">🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search" className="bg-transparent text-[12px] outline-none flex-1 text-white" />
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setTab('following')} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${tab==='following'?'bg-white text-black':'bg-zinc-800 text-white'}`}>Follow</button>
                <button onClick={()=>setIsLive(true)} className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FE2C55] animate-pulse border border-white">LIVE 🔴</button>
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
              <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[95px] left-3 bg-black/60 px-3 py-1 rounded-full text-[11px] border border-white/20 font-bold z-20 text-white">{isMuted?'🔇 Muted':'🔊 Sound'}</button>
              <div className="absolute bottom-24 left-3 right-20 z-20">
                <p className="font-bold text-[15px] text-white">@vibra_boy</p>
                <p className="text-[13px] mt-1 text-white">{c.caption}</p>
              </div>
              <div className="absolute bottom-28 right-3 flex flex-col items-center gap-3 z-20">
                <button onClick={()=>toggleFollow(c.username)} className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-[12px] text-white">{following.has(c.username)?'✓':'+'}</button>
                <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div>
                  <span className="text-[10px] font-bold mt-1 text-white">{fmt(likesMap[c.id]||c.views)}</span>
                </button>
                <button onClick={()=>{setActiveClip(c);}} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">💬</div>
                  <span className="text-[10px] font-bold mt-1 text-white">12</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">↗️</div>
                  <span className="text-[10px] font-bold mt-1 text-white">Share</span>
                </button>
                <button onClick={()=>setShowLyrics(!showLyrics)} className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] border ${showLyrics?'bg-[#FE2C55] border-white':'bg-zinc-800 border-zinc-600'}`}>🎤</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FIX EXPLORE - SASA HAIKO BLACK TENA! */}
      {showPage==='explore' && (
        <div className="absolute inset-0 bg-black z-30 pt-2 px-2 overflow-y-auto pb-20">
          <div className="pt-2 pb-2 sticky top-0 bg-black z-10">
            <div className="bg-zinc-800 rounded-full px-4 py-3 flex items-center gap-2 border border-zinc-700">
              <span>🔍</span>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search videos, users..." className="bg-transparent flex-1 text-[14px] outline-none text-white" />
            </div>
            <p className="text-white font-bold mt-3 text-[14px]">Explore • {filtered.length} videos</p>
          </div>
          <div className="grid grid-cols-3 gap-[2px] mt-2">
            {filtered.map(c=>(
              <div key={c.id} onClick={()=>{setShowPage('home'); setTimeout(()=>{ document.querySelector(`[data-id="${c.id}"]`)?.scrollIntoView()}, 100)}} className="aspect-[3/4] bg-zinc-900 relative overflow-hidden rounded-sm">
                <video src={c.url} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <p className="absolute bottom-1 left-1 text-[10px] text-white font-bold">▶ {fmt(c.views)}</p>
                <p className="absolute top-1 right-1 text-[8px]">🔥</p>
              </div>
            ))}
          </div>
          {filtered.length===0 && <p className="text-center text-zinc-400 mt-20">Hakuna video - Clear search</p>}
        </div>
      )}

      {/* FIX INBOX - SASA HAIKO BLACK TENA! */}
      {showPage==='inbox' && (
        <div className="absolute inset-0 bg-black z-30 pt-2 px-0 overflow-y-auto pb-20">
          <div className="p-4 border-b border-zinc-800">
            <p className="font-black text-[20px] text-white">Inbox 📩</p>
            <p className="text-zinc-400 text-[12px] mt-1">All activity</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-3">
              <div className="w-10 h-10 bg-[#FE2C55] rounded-full flex items-center justify-center">❤️</div>
              <div><p className="text-[13px] font-bold text-white">vibra_boy liked your video</p><p className="text-[11px] text-zinc-400">Familia yangu 😂 - 2m ago</p></div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">💬</div>
              <div><p className="text-[13px] font-bold text-white">mama commented: 😂😂</p><p className="text-[11px] text-zinc-400">5m ago</p></div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">👤</div>
              <div><p className="text-[13px] font-bold text-white">New follower: @vibra_fan</p><p className="text-[11px] text-zinc-400">10m ago • 250.8K followers now!</p></div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-3">
              <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">🔴</div>
              <div><p className="text-[13px] font-bold text-white">@vibra-boy is LIVE now!</p><p className="text-[11px] text-zinc-400">Tap LIVE button to join - 2.4K watching</p><button onClick={()=>setIsLive(true)} className="mt-2 bg-[#FE2C55] text-white px-4 py-1 rounded-full text-[11px] font-bold">Join LIVE 🔴</button></div>
            </div>
          </div>
        </div>
      )}

      {showPage==='me' && !showCaption && !activeClip && !selectedFromMe && (
        <div className="absolute inset-0 bg-white text-black z-30 overflow-y-auto pb-20">
          <div className="flex items-center justify-between p-3 pt-2">
            <button onClick={()=>setShowPage('home')} className="text-2xl">←</button>
            <p className="font-bold text-[16px]">@vibra-boy</p>
            <p className="text-xl">⋮</p>
          </div>
          <div className="flex justify-center gap-6 mt-1">
            <button className="text-center"><p className="font-black text-[16px]">10K</p><p className="text-[11px] text-zinc-500">Following</p></button>
            <button className="text-center border-l pl-6"><p className="font-black text-[16px]">250.8K</p><p className="text-[11px] text-zinc-500">Followers</p></button>
            <button onClick={()=>setMeTab('liked')} className="text-center border-l pl-6"><p className="font-black text-[16px]">2.0M</p><p className="text-[11px] text-zinc-500">Likes</p></button>
          </div>
          <div className="flex justify-center gap-2 mt-3 px-10">
            <button onClick={()=>setIsFollowingMe(!isFollowingMe)} className={`flex-1 py-2 rounded-[6px] font-bold text-[14px] ${isFollowingMe?'bg-zinc-200 text-black':'bg-[#FE2C55] text-white'}`}>{isFollowingMe?'Following ✓':'Follow'}</button>
            <button className="bg-zinc-100 px-3 rounded-[6px]">👤+</button>
          </div>
          <div className="flex justify-around mt-3 border-b py-2">
            <button onClick={()=>setMeTab('videos')} className={`text-[16px] px-6 pb-1 ${meTab==='videos'?'border-b-2 border-black font-bold':''}`}>☰ Videos</button>
            <button onClick={()=>setMeTab('liked')} className={`text-[16px] px-6 pb-1 ${meTab==='liked'?'border-b-2 border-black font-bold':''}`}>♡ {myLikes.size} Liked</button>
          </div>
          <div className="grid grid-cols-3 gap-[1px] bg-white">
            {(meTab==='videos'?clips:clips.filter(c=>myLikes.has(c.id))).map(c=>(
              <div key={c.id} onClick={()=>setSelectedFromMe(c)} className="aspect-[4/5] bg-black relative">
                <video src={c.url} className="w-full h-full object-cover" muted />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1"><p className="text-white text-[10px] font-bold">▶ {fmt(c.views)}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFromMe && (
        <div className="absolute inset-0 bg-black z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 pt-2 text-white">
            <button onClick={()=>{ try{meVideoRef.current?.pause()}catch{}; setSelectedFromMe(null)}} className="text-xl">←</button>
            <p className="font-bold text-[14px]">@vibra-boy • {fmt(selectedFromMe.views)}</p>
            <p>⋮</p>
          </div>
          <div className="flex-1 relative">
            <video ref={meVideoRef} src={selectedFromMe.url} autoPlay loop playsInline muted={isMuted} className="h-full w-full object-contain bg-black" onClick={()=>{ if(meVideoRef.current){ if(meVideoRef.current.paused) meVideoRef.current.play(); else meVideoRef.current.pause() } }} />
            <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
              <button onClick={()=>toggleFollow(selectedFromMe.username)} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-white">{following.has(selectedFromMe.username)?'✓':'+'}</button>
              <button onClick={()=>toggleLike(selectedFromMe.id)} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${myLikes.has(selectedFromMe.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[11px] font-bold text-white mt-1">{fmt(likesMap[selectedFromMe.id]||selectedFromMe.views)}</span></button>
            </div>
          </div>
        </div>
      )}

      {activeClip && (
        <div className="absolute inset-0 bg-black/90 z-[80] flex flex-col justify-end">
          <div className="bg-zinc-900 rounded-t-[20px] h-[65%] p-4 overflow-y-auto">
            <div className="flex justify-between"><p className="font-bold text-white">Comments</p><button onClick={()=>{setActiveClip(null)}} className="text-white">✕</button></div>
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
