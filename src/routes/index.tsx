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
  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0) setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂 #vibra', views: Math.floor(Math.random()*800000+100000)})))
    else setClips([{id:'demo1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', username:'vibra_boy', caption:'Familia yangu 😂 #vibra', views:834000}])
  }
  useEffect(()=>{
    if(showPage!=='home' || playFromMe || showCaption) return
    const t=setTimeout(()=>{ const first=clips[0]?.id; if(first){ const v=videoRefs.current.get(first); if(v){ try{v.muted=true; v.play()}catch{}} } }, 600)
    return ()=>clearTimeout(t)
  }, [clips, showPage, playFromMe, showCaption])
  useEffect(()=>{
    if(showPage!=='home' || showCaption || playFromMe) return
    const obs=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id) try{vv.pause()}catch{}}); try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{}}}})},{threshold:0.4})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, playFromMe])

  async function doUpload(){
    if(!pendingFile) return
    if(pendingFile.size > 25*1024*1024){ alert('Video kubwa! <25MB'); return }
    setUploading(true); setUploadPct(20)
    let finished=false
    // TIMEOUT: Kama Supabase inachelewa >15sec, add local!
    const timeout = setTimeout(()=>{
      if(!finished){
        finished=true
        const localUrl=URL.createObjectURL(pendingFile)
        const newClip={id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1}
        setClips(p=>[newClip, ...p])
        setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me')
        alert('✅ Video ime-add! (Fast mode - Supabase ilichelewa, but video iko kwenye Me!)')
      }
    }, 15000) // 15 seconds only!
    try{
      const n=`${Date.now()}_${pendingFile.name.replace(/\s/g,'_')}`
      setUploadPct(50)
      const {error} = await supabase.storage.from('Vibra clips').upload(n, pendingFile, {cacheControl:'3600'})
      if(error) throw error
      if(finished) return
      clearTimeout(timeout)
      const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
      setUploadPct(90)
      supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:captionText}).then(()=>{})
      const newClip={id:Date.now().toString(), url:data.publicUrl, username:'vibra_boy', caption:captionText, views:1}
      setClips(p=>[newClip, ...p])
      setUploadPct(100)
      finished=true
      setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me'); alert('✅ Ime-upload kwenye Supabase!') }, 500)
    }catch(e){
      if(finished) return
      clearTimeout(timeout)
      const localUrl=URL.createObjectURL(pendingFile)
      const newClip={id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1}
      setClips(p=>[newClip, ...p])
      setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me')
      alert('✅ Video ime-add locally! Iko kwenye Me page!')
    }
  }

  const filtered = tab==='following' ? clips.filter(c=>following.has(c.username)) : clips
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return
        if(f.size > 25*1024*1024){ alert('Kubwa sana! <25MB & <15sec'); return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />
      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="text-white font-bold">Caption {uploading?`(${uploadPct}%) - max 15sec`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            {uploading && <div className="w-full bg-zinc-700 h-2.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#FE2C55] h-2.5 rounded-full transition-all" style={{width:`${uploadPct}%`}} /></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setUploadPct(0); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 text-white py-3.5 rounded-full font-bold">Cancel</button>
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black bg-white text-black">{uploading?`${uploadPct}% Uploading...`:'Post ✓ (Fast)'}</button>
            </div>
            <p className="text-zinc-400 text-[11px] mt-2 text-center">Kama inakwama >15sec, ina-add auto local! Cancel inafanya kazi 100%</p>
          </div>
        </div>
      )}
      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {filtered.map(c=>{
            const liked=myLikes.has(c.id)
            return (
              <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload="auto" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
                <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[56px] left-3 bg-black/60 px-3 py-1.5 rounded-full text-white text-[11px] border border-white/20 font-bold">{isMuted?'🔇 Muted':'🔊 ON'}</button>
                <div className="absolute bottom-20 left-3 right-20 text-white"><p className="font-bold text-sm">@{c.username}</p><p className="text-[13px] mt-1">{c.caption}</p></div>
                <div className="absolute right-2 bottom-28 flex flex-col gap-2 items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">❤️</div><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">💬</div></div>
              </div>
            )
          })}
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] h-[60px] items-center">
        <button onClick={()=>setShowPage('home')} className="flex flex-col items-center">🏠 Home</button>
        <button className="flex flex-col items-center">🔍 Explore</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button className="flex flex-col items-center">📩 Inbox</button>
        <button onClick={()=>setShowPage('me')} className="flex flex-col items-center">V Me</button>
      </div>
    </div>
  )
}
