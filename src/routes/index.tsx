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
  const [isFollowingMe, setIsFollowingMe] = useState(false)
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())

  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0) setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂 #vibra', views: Math.floor(Math.random()*800000+100000)})))
    else {
      // fallback demo clips so app never black
      setClips([
        {id:'demo1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', username:'vibra_boy', caption:'Familia yangu 😂 #vibra #demo', views:661400},
        {id:'demo2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', username:'vibra_boy', caption:'Together Forever ❤️∞ #vibra', views:658700},
      ])
    }
    const {data:l} = await supabase.from('likes').select('*')
    if(l){ const m={}; const s=new Set(); l.forEach(a=>{ m[a.clip_id]=(m[a.clip_id]||0)+1; if(a.user_id==='vibra_boy') s.add(a.clip_id)}); setLikesMap(m); setMyLikes(s)}
    const {data:c} = await supabase.from('comments').select('*')
    if(c){ const m={}; c.forEach(x=>{ if(!m[x.clip_id]) m[x.clip_id]=[]; m[x.clip_id].push(x)}); setCommentsMap(m)}
  }

  // FORCE PLAY FIRST VIDEO
  useEffect(()=>{
    if(showPage!=='home' || playFromMe || showCaption) return
    const t = setTimeout(()=>{
      const first = clips[0]?.id
      if(first){
        const v = videoRefs.current.get(first)
        if(v){ try{ v.muted=true; v.play() }catch{} }
      }
    }, 800)
    return ()=>clearTimeout(t)
  }, [clips, showPage, playFromMe, showCaption])

  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends' || showCaption || playFromMe){
      videoRefs.current.forEach(v=>{ try{v.pause()}catch{}}); 
    }
  }, [showPage, tab, showCaption, playFromMe])

  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends' || showCaption || playFromMe) return
    const obs = new IntersectionObserver((ents)=>{ 
      ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{}}); try{ v.muted=isMuted; v.currentTime=0; v.play().catch(()=>{}) }catch{}}}})
    },{threshold:0.5})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, tab, isMuted, showCaption, playFromMe])

  async function doUpload(){
    if(!pendingFile){ alert('Chagua video!'); return }
    if(pendingFile.size > 40*1024*1024){ alert('Video kubwa sana! Tafuta <40MB'); setUploading(false); setUploadPct(0); return }
    setUploading(true); setUploadPct(15)
    const interval = setInterval(()=>setUploadPct(p=> p<85 ? p+12 : p), 500)
    let publicUrl = ''
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      const {error: upErr} = await supabase.storage.from('Vibra clips').upload(n, pendingFile)
      if(upErr) throw upErr
      const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
      publicUrl = data.publicUrl
      setUploadPct(90)
      // try db insert but don't wait
      supabase.from('clips').insert({url:publicUrl, video_url:publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:captionText}).then(()=>{})
      setUploadPct(100)
      const newClip = {id: Date.now().toString(), url: publicUrl, username:'vibra_boy', caption:captionText, views: Math.floor(Math.random()*50000)+1}
      setClips(prev=>[newClip, ...prev])
      clearInterval(interval)
      setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me'); alert('✅ Ime-upload! Iko kwenye Me!') }, 600)
    }catch(e){
      clearInterval(interval)
      // local fallback - video itaonekana tu!
      try{
        const localUrl = URL.createObjectURL(pendingFile)
        const newClip = {id: Date.now().toString(), url: localUrl, username:'vibra_boy', caption:captionText, views: 1}
        setClips(prev=>[newClip, ...prev])
        setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me')
        alert('✅ Video ime-add! (Local mode) - Iko kwenye Me page sasa!')
      }catch{
        setUploading(false); setUploadPct(0)
        alert('Upload failed: '+(e.message||'bucket check'))
      }
    }
  }

  const filtered = tab==='following' ? clips.filter(c=>following.has(c.username)) : clips
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n
  const playingClip = playFromMe ? clips.find(c=>c.id===playFromMe) : null
  const totalLikes = Object.values(likesMap).reduce((a,b)=>a+b, 0) as number

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return
        if(f.size > 40*1024*1024){ alert('Video kubwa sana! <40MB na <30sec'); return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="text-white font-bold">Andika Caption na #Tags {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-28 outline-none text-[15px] border-2 border-pink-500" />
            {uploading && <div className="w-full bg-zinc-700 h-2.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#FE2C55] h-2.5 rounded-full transition-all" style={{width:`${uploadPct}%`}} /></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setUploadPct(0); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 text-white py-3.5 rounded-full font-bold">Cancel</button>
              <button disabled={uploading} onClick={doUpload} style={{background: uploading?'#666':'#FFFFFF', color:'#000000'}} className="flex-1 py-3.5 rounded-full font-black">{uploading?`${uploadPct}% Uploading...`:'Post ✓'}</button>
            </div>
            <p className="text-zinc-400 text-[11px] mt-3 text-center">Video &lt;30sec &amp; &lt;40MB = haraka! Cancel inafanya kazi sasa.</p>
          </div>
        </div>
      )}

      {playingClip && (
        <div data-meplay className="absolute inset-0 bg-black z-[55] flex flex-col">
          <button onClick={()=>setPlayFromMe(null)} className="absolute top-4 left-4 z-10 bg-black/60 text-white w-9 h-9 rounded-full">←</button>
          <video src={playingClip.url} autoPlay loop playsInline controls className="h-full w-full object-contain bg-black" />
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 z-20 pt-2 pb-2 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex justify-center gap-6 text-[15px] font-bold">
          <button onClick={()=>{setTab('following'); setShowPage('home'); setPlayFromMe(null)}} className={tab==='following'?'text-white border-b-2 border-white pb-1':'text-white/60'}>Following</button>
          <button onClick={()=>{setTab('foryou'); setShowPage('home'); setPlayFromMe(null)}} className={tab==='foryou'?'text-white border-b-2 border-white pb-1':'text-white/60'}>For You</button>
          <button onClick={()=>{setTab('live'); setShowPage('home')}} className={tab==='live'?'text-white border-b-2 border-white pb-1':'text-white/60'}>LIVE</button>
        </div>
      </div>

      {showPage!=='home' && !showCaption && !playFromMe && (
        <div className="absolute inset-0 bg-white z-30 overflow-y-auto">
          {showPage==='me' ? (
            <div className="bg-white min-h-screen pb-20">
              <div className="flex items-center justify-between p-3 pt-4 bg-white">
                <button onClick={()=>setShowPage('home')} className="text-2xl text-black font-bold">←</button>
                <button onClick={()=>{const n=prompt('Badilisha jina:', displayName); if(n) setDisplayName(n)}} className="font-bold text-[17px] text-black">{displayName} ✏️</button>
                <button className="text-xl text-black">⋮</button>
              </div>
              <div className="flex flex-col items-center pt-2 bg-white">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[3px]"><div className="w-full h-full rounded-full bg-white flex items-center justify-center"><div className="w-16 h-16 bg-[#FF2CA0] flex items-center justify-center text-black font-black text-2xl">V</div></div></div>
                <p className="font-bold mt-3 text-[15px] text-black">@vibra_boy</p>
                <div className="flex gap-8 mt-4">
                  <div className="text-center"><p className="font-bold text-[17px] text-black">10K</p><p className="text-black text-[13px] font-medium">Following</p></div>
                  <div className="text-center border-l border-r border-zinc-300 px-8"><p className="font-bold text-[17px] text-black">250.8K</p><p className="text-black text-[13px] font-medium">Followers</p></div>
                  <div className="text-center"><p className="font-bold text-[17px] text-black">{fmt(totalLikes||2)}</p><p className="text-black text-[13px] font-medium">Likes</p></div>
                </div>
                <div className="flex gap-2 mt-5 w-full px-4">
                  <button onClick={()=>setIsFollowingMe(!isFollowingMe)} className={`flex-1 py-3 rounded-lg font-bold text-[15px] ${isFollowingMe?'bg-zinc-200 text-black border':'bg-[#FE2C55] text-white'}`}>{isFollowingMe?'Following ✓':'Follow'}</button>
                  <button className="bg-zinc-100 px-4 rounded-lg text-black border">↗️</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[2px] bg-white mt-5">
                {clips.map((c,i)=>(
                  <div key={c.id} onClick={()=>setPlayFromMe(c.id)} className="relative aspect-[4/5] bg-black cursor-pointer">
                    <video src={c.url} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute bottom-1.5 left-1.5 text-white text-[11px] font-bold">▶ {fmt(c.views)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (<div className="bg-black min-h-screen p-4 pt-16"><button onClick={()=>setShowPage('home')} className="bg-zinc-800 text-white px-5 py-2 rounded-full">← Back</button><h2 className="text-white font-bold text-xl mt-6">{showPage.toUpperCase()}</h2></div>)}
        </div>
      )}

      {showPage==='home' && !showCaption && !playFromMe && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {filtered.map(c=>{
            const liked=myLikes.has(c.id); const isF=following.has(c.username); const isSaved=mySaves.has(c.id); const comments=commentsMap[c.id]||[]
            return (
              <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload="auto" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
                <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[56px] left-3 bg-black/60 px-3 py-1.5 rounded-full text-white text-[11px] border border-white/20 font-bold z-10">{isMuted?'🔇 Muted - Tap video to play':'🔊 ON'}</button>
                <div className="absolute right-2 bottom-28 flex flex-col gap-3 items-center">
                  <div className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5"><div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">V</div></div><button onClick={()=>{const s=new Set(following); if(s.has(c.username)) s.delete(c.username); else s.add(c.username); setFollowing(s)}} className={`absolute -bottom-1 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${isF?'bg-zinc-600':'bg-[#FF3B5C]'} text-white`}>{isF?'✓':'+'}</button></div>
                  <button onClick={async()=>{ if(liked){ await supabase.from('likes').delete().eq('clip_id',c.id).eq('user_id','vibra_boy'); setMyLikes(p=>{const n=new Set(p); n.delete(c.id); return n}); setLikesMap(m=>({...m,[c.id]:Math.max(0,(m[c.id]||1)-1)}))} else { await supabase.from('likes').insert({clip_id:c.id,user_id:'vibra_boy'}); setMyLikes(p=>{const n=new Set(p); n.add(c.id); return n}); setLikesMap(m=>({...m,[c.id]:(m[c.id]||0)+1}))}}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${liked?'bg-[#FF3B5C]':'bg-white/20'}`}>❤️</div><span className="text-white text-xs font-bold">{likesMap[c.id]||0}</span></button>
                  <button onClick={()=>setActiveClip(c.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">💬</div><span className="text-white text-xs font-bold">{comments.length}</span></button>
                  <button onClick={()=>{const s=new Set(mySaves); if(s.has(c.id)) s.delete(c.id); else s.add(c.id); setMySaves(s)}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isSaved?'bg-yellow-400':'bg-white/20'}`}>🔖</div><span className="text-white text-[10px]">Save</span></button>
                  <button onClick={()=>{ if(navigator.share) navigator.share({url:c.url}); else {navigator.clipboard.writeText(c.url); alert('Copied!')}}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">↗️</div><span className="text-white text-[10px]">Share</span></button>
                </div>
                <div className="absolute bottom-20 left-3 right-20 text-white"><p className="font-bold text-sm">@{c.username}</p><p className="text-[13px] mt-1">{c.caption}</p></div>
              </div>
            )
          })}
        </div>
      )}

      {!showCaption && !playFromMe && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] z-30 items-center h-[60px]">
          <button onClick={()=>{setShowPage('home'); setTab('foryou'); setPlayFromMe(null)}} className="flex flex-col items-center"><span className="text-[20px]">🏠</span><span>Home</span></button>
          <button onClick={()=>setShowPage('explore')} className="flex flex-col items-center"><span className="text-[20px]">🔍</span><span>Explore</span></button>
          <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}>{uploading?'...':'+'}</button>
          <button onClick={()=>setShowPage('inbox')} className="flex flex-col items-center"><span className="text-[20px]">📩</span><span>Inbox</span></button>
          <button onClick={()=>setShowPage('me')} className="flex flex-col items-center"><span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center font-bold">V</span><span>Me</span></button>
        </div>
      )}
    </div>
  )
}
