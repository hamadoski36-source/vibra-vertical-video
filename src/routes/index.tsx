// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const [clips, setClips] = useState([])
  const [likesMap, setLikesMap] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [following, setFollowing] = useState(new Set())
  const [showPage, setShowPage] = useState('home')
  const [tab, setTab] = useState('foryou')
  const [isMuted, setIsMuted] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())

  useEffect(()=>{ load() }, [])

  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data) setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂'})))
    const {data:l} = await supabase.from('likes').select('*')
    if(l){ const m={}; const s=new Set(); l.forEach(a=>{ m[a.clip_id]=(m[a.clip_id]||0)+1; if(a.user_id==='vibra_boy') s.add(a.clip_id)}); setLikesMap(m); setMyLikes(s)}
  }

  // SAUTI INAKATA AUTOMATIC UKITOKA
  useEffect(()=>{
   
       // SAUTI INAKATA AUTOMATIC UKITOKA
  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends'){
      videoRefs.current.forEach(v=>{ v.pause() })
      document.querySelectorAll('video').forEach(v=>{ v.pause() })
    }
  }, [showPage, tab])
    }
  }, [showPage, tab])

  const filtered = tab==='following' ? clips.filter(c=>following.has(c.username)) : clips

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={async(e)=>{
        const f=e.target.files?.[0]; if(!f) return; setUploading(true)
        const n=`${Date.now()}_${f.name}`; await supabase.storage.from('Vibra clips').upload(n,f)
        const {data}=supabase.storage.from('Vibra clips').getPublicUrl(n)
        await supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:'vibra_boy', user_id:'vibra_boy', caption:'Familia yangu 😂'})
        setUploading(false); load()
      }} />

      <div className="absolute top-0 left-0 right-0 z-20 pt-2">
        <div className="flex justify-center gap-5 text-sm font-bold">
          <button onClick={()=>{setTab('following'); setShowPage('home')}} className={tab==='following'?'text-white border-b-2 border-white':'text-white/50'}>Following</button>
          <button onClick={()=>{setTab('foryou'); setShowPage('home')}} className={tab==='foryou'?'text-white border-b-2 border-white':'text-white/50'}>For You</button>
          <button onClick={()=>{setTab('live'); setShowPage('home')}} className={tab==='live'?'text-white border-b-2 border-white':'text-white/50'}>LIVE</button>
        </div>
      </div>

      {showPage!=='home' && (
        <div className="absolute inset-0 bg-black z-30 pt-16 p-4">
          <button onClick={()=>setShowPage('home')} className="bg-zinc-800 text-white px-4 py-2 rounded-full text-sm">← Back - Sauti itarudi</button>
          <h2 className="text-white font-bold text-xl mt-4">{showPage.toUpperCase()} - Sauti imezimwa ✓</h2>
          {showPage==='me' && <div className="mt-6 flex flex-col items-center"><div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-2xl">V</div><p className="text-white mt-2">@vibra_boy - {clips.length} videos</p></div>}
          {showPage==='inbox' && <p className="text-zinc-400 mt-4">Inbox - 9+ messages</p>}
          {showPage==='explore' && <div className="grid grid-cols-2 gap-2 mt-4">{clips.map(c=><video key={c.id} src={c.url} className="h-32 w-full object-cover rounded" muted />)}</div>}
          {showPage==='lyrics' && <p className="text-white mt-4">Familia yangu 😂<br/>Lyrics zote hapa...</p>}
        </div>
      )}

      {showPage==='home' && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {tab==='live' && <div className="h-screen flex items-center justify-center text-white flex-col"><p className="text-4xl">🔴 LIVE</p><p className="text-zinc-400 mt-2">Sauti imezimwa ✓</p><button onClick={()=>setTab('foryou')} className="mt-4 bg-white text-black px-6 py-2 rounded-full">For You</button></div>}
          {tab!=='live' && filtered.map(c=>{
            const liked=myLikes.has(c.id); const isF=following.has(c.username)
            return (
              <div key={c.id} className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} onClick={()=>setIsMuted(!isMuted)} className="h-full w-full object-cover" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-5 py-2 rounded-full text-white text-sm border border-white font-bold">
                  {isMuted?'🔇 Tap for sound':'🔊 ON'}
                </div>
                <div className="absolute right-2 bottom-24 flex flex-col gap-4 items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5"><div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">V</div></div>
                    <button onClick={()=>{const s=new Set(following); if(s.has(c.username)) s.delete(c.username); else s.add(c.username); setFollowing(s)}} className={`absolute -bottom-1 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${isF?'bg-zinc-600':'bg-red-500'} text-white`}>{isF?'✓':'+'}</button>
                  </div>
                  <button onClick={async()=>{ if(liked){ await supabase.from('likes').delete().eq('clip_id',c.id).eq('user_id','vibra_boy'); setMyLikes(p=>{const n=new Set(p); n.delete(c.id); return n}); setLikesMap(m=>({...m,[c.id]:Math.max(0,(m[c.id]||1)-1)}))} else { await supabase.from('likes').insert({clip_id:c.id,user_id:'vibra_boy'}); setMyLikes(p=>{const n=new Set(p); n.add(c.id); return n}); setLikesMap(m=>({...m,[c.id]:(m[c.id]||0)+1}))}}} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${liked?'bg-red-500':'bg-white/20'}`}>❤️</div><span className="text-white text-xs">{likesMap[c.id]||0}</span></button>
                  <button onClick={()=>setShowPage('lyrics')} className="w-10 h-10 rounded-full bg-zinc-800 border flex items-center justify-center text-xs">🎵</button>
                </div>
                <div className="absolute bottom-20 left-3 right-20 text-white">
                  <p className="font-bold">@{c.username} <button onClick={()=>{const s=new Set(following); if(s.has(c.username)) s.delete(c.username); else s.add(c.username); setFollowing(s)}} className={`ml-2 text-xs px-2 py-1 rounded-full ${isF?'bg-zinc-700':'bg-red-500'}`}>{isF?'Following':'Follow'}</button></p>
                  <p className="text-sm mt-1">{c.caption}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-xs z-20 items-center">
        <button onClick={()=>{setShowPage('home'); setTab('foryou')}} className="flex flex-col items-center"><span>🏠</span><span>Home</span></button>
        <button onClick={()=>setShowPage('explore')} className="flex flex-col items-center"><span>🔍</span><span>Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-16 h-10 rounded-xl font-black text-2xl flex items-center justify-center">{uploading?'...':'+'}</button>
        <button onClick={()=>setShowPage('inbox')} className="flex flex-col items-center"><span>📩</span><span>Inbox</span></button>
        <button onClick={()=>setShowPage('me')} className="flex flex-col items-center"><span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">V</span><span>Me</span></button>
      </div>
    </div>
  )
}
