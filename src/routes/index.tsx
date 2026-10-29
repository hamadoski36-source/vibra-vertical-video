import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

type Clip = { id: string, url: string, username: string, caption: string }
type CommentT = { id: string, clip_id: string, username: string, text: string }

function VibraFinal() {
  const [clips, setClips] = useState<Clip[]>([])
  const [likesMap, setLikesMap] = useState<Record<string, number>>({})
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set())
  const [mySaves, setMySaves] = useState<Set<string>>(new Set())
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentT[]>>({})
  const [activeClip, setActiveClip] = useState<string|null>(null)
  const [commentText, setCommentText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [tab, setTab] = useState<'following'|'friends'|'foryou'|'live'>('foryou')
  const [showPage, setShowPage] = useState<'home'|'explore'|'inbox'|'me'|'lyrics'>('home')
  const [currentId, setCurrentId] = useState('')
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [searchQ, setSearchQ] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const currentUser = 'vibra_boy'

  useEffect(()=>{ loadAll() }, [])

  // SAUTI INAKATA AUTOMATIC UKITOKA HOME
  useEffect(()=>{
    if(showPage!=='home' || tab==='live' || tab==='friends'){
      videoRefs.current.forEach(v=>{ v.pause(); v.muted=true })
    } else {
      const v = videoRefs.current.get(currentId)
      if(v){ v.muted=isMuted; v.play().catch(()=>{}) }
    }
  }, [showPage, tab, currentId, isMuted])

  // VIDEO 1 INAZIMA VIDEO 2 INAPOINGIA - HAIINGILIANI TENA
  useEffect(()=>{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        const id = (e.target as HTMLElement).dataset.clipid!
        const video = videoRefs.current.get(id)
        if(!video) return
        if(e.isIntersecting && showPage==='home' && tab!=='live' && tab!=='friends'){
          setCurrentId(id)
          videoRefs.current.forEach((v,k)=>{ if(k!==id) v.pause() })
          video.muted=isMuted
          video.play().catch(()=>{})
        } else {
          video.pause()
        }
      })
    }, {threshold:0.8})
    setTimeout(()=>{ document.querySelectorAll('[data-clipid]').forEach(el=>obs.observe(el)) }, 600)
    return ()=>obs.disconnect()
  }, [clips, showPage, tab])

  async function loadAll(){
    const { data: c } = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(c) setClips(c.map((x:any)=>({id:x.id, url:x.url||x.video_url, username:x.username||'vibra_boy', caption:x.caption||'Familia yangu 😂'})))
    const { data: l } = await supabase.from('likes').select('*')
    if(l){ const m:Record<string,number>={}; const mine=new Set<string>(); l.forEach((li:any)=>{ m[li.clip_id]=(m[li.clip_id]||0)+1; if(li.user_id===currentUser) mine.add(li.clip_id)}); setLikesMap(m); setMyLikes(mine)}
    const { data: co } = await supabase.from('comments').select('*').order('created_at',{ascending:true})
    if(co){ const m:Record<string,CommentT[]>={}; co.forEach((cm:any)=>{ if(!m[cm.clip_id]) m[cm.clip_id]=[]; m[cm.clip_id].push(cm)}); setCommentsMap(m)}
  }

  const filtered = clips.filter(c=> (tab==='following'?following.has(c.username):true) && (searchQ?c.caption.toLowerCase().includes(searchQ.toLowerCase()):true))

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={async(e:any)=>{
        const file=e.target.files?.[0]; if(!file) return; setUploading(true)
        try{ const name=`${Date.now()}_${file.name}`; await supabase.storage.from('Vibra clips').upload(name,file); const {data}=supabase.storage.from('Vibra clips').getPublicUrl(name); await supabase.from('clips').insert({url:data.publicUrl, video_url:data.publicUrl, username:currentUser, user_id:currentUser, caption:'Familia yangu 😂'}); loadAll() }catch(err:any){ alert(err.message)} setUploading(false)
      }} />

      {/* TOP - ZOTE ZINAFANYA KAZI SASA */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent pt-2 pb-2">
        <div className="flex justify-center gap-5 text-[14px] font-bold">
          <button onClick={()=>{setShowPage('home'); setTab('following')}} className={tab==='following'&&showPage==='home'?'text-white border-b-2 border-white':'text-white/50'}>Following</button>
          <button onClick={()=>{setShowPage('home'); setTab('friends')}} className={tab==='friends'&&showPage==='home'?'text-white border-b-2 border-white':'text-white/50'}>Friends</button>
          <button onClick={()=>{setShowPage('home'); setTab('foryou')}} className={tab==='foryou'&&showPage==='home'?'text-white border-b-2 border-white':'text-white/50'}>For You</button>
          <button onClick={()=>{setShowPage('home'); setTab('live')}} className={tab==='live'&&showPage==='home'?'text-white border-b-2 border-white':'text-white/50'}>LIVE</button>
        </div>
        <div className="px-3 mt-2"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search Familia..." className="w-full bg-zinc-800/80 text-white px-4 py-2 rounded-full text-sm outline-none" /></div>
      </div>

      {/* PAGES - ME / INBOX / LYRICS / EXPLORE - SIO PICHA TENA */}
      {showPage!=='home' && (
        <div className="absolute inset-0 bg-black z-40 pt-20 p-4 overflow-y-auto">
          <button onClick={()=>setShowPage('home')} className="bg-zinc-800 text-white px-4 py-2 rounded-full text-sm mb-4">← Back - Sauti itarudi</button>
          {showPage==='explore' && <><h2 className="text-white font-bold text-xl mb-3">Explore 🔍</h2><div className="grid grid-cols-2 gap-2">{filtered.map(c=><div key={c.id} onClick={()=>setShowPage('home')}><video src={c.url} muted className="w-full h-48 object-cover rounded-xl"/><p className="text-white text-xs mt-1">@{c.username}</p></div>)}</div></>}
          {showPage==='inbox' && <><h2 className="text-white font-bold text-xl">Inbox 📩</h2><div className="mt-4 space-y-2"><div className="bg-zinc-900 p-3 rounded-xl text-white text-sm">❤️ @mimi_ke liked your video</div><div className="bg-zinc-900 p-3 rounded-xl text-white text-sm">💬 New comment on Familia yangu</div><div className="bg-zinc-900 p-3 rounded-xl text-white text-sm">👤 @hamado followed you</div></div></>}
          {showPage==='me' && <div className="flex flex-col items-center"><div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">V</div><h2 className="text-white font-bold text-xl mt-2">@vibra_boy</h2><p className="text-zinc-400 text-sm">{clips.length} videos • {following.size} Following • {Object.values(likesMap).reduce((a,b)=>a+b,0)} Likes</p><div className="grid grid-cols-3 gap-1 mt-6 w-full">{clips.map(c=><video key={c.id} src={c.url} muted className="h-32 object-cover rounded" />)}</div></div>}
          {showPage==='lyrics' && <><h2 className="text-white font-bold text-xl">🎵 Familia yangu - Lyrics</h2><p className="text-white mt-6 leading-8 text-base">Familia yangu 😂<br/>Familia yangu ni kali<br/>Baba, Mama, na sisi<br/>Tunacheka kila siku 😂😂<br/><br/>Original sound - vibra_boy</p></>}
        </div>
      )}

      {/* HOME FEED */}
      {showPage==='home' && (
        <>
          {tab==='live' && <div className="h-screen bg-black flex flex-col items-center justify-center text-white"><p className="text-5xl">🔴 LIVE</p><p className="mt-2 text-zinc-400 text-sm">Sauti imezimwa automatic ✓</p><div className="flex gap-3 mt-6"><div className="w-20 h-32 bg-zinc-800 rounded-xl flex items-center justify-center flex-col">👩<span className="text-xs">Aisha LIVE</span></div><div className="w-20 h-32 bg-zinc-800 rounded-xl flex items-center justify-center flex-col">👨<span className="text-xs">Hamado LIVE</span></div></div><button onClick={()=>setTab('foryou')} className="mt-8 bg-white text-black px-8 py-2 rounded-full font-bold">Back to For You</button></div>}
          {tab==='friends' && <div className="h-screen bg-black flex flex-col items-center justify-center text-white px-6"><p className="font-bold text-xl">Friends 👥</p><p className="text-zinc-400 text-sm mt-1">Sauti imezimwa ✓</p><div className="w-full mt-6 space-y-2">{['mimi_ke','hamado','aisha'].map(n=><div key={n} className="bg-zinc-900 p-3 rounded-xl flex justify-between items-center"><span>@{n}</span><button onClick={()=>{const s=new Set(following); if(s.has(n)) s.delete(n); else s.add(n); setFollowing(s)}} className={`${following.has(n)?'bg-zinc-700':'bg-white text-black'} px-4 py-1 rounded-full text-xs font-bold`}>{following.has(n)?'Following':'Follow'}</button></div>)}</div><button onClick={()=>setTab('foryou')} className="mt-6 text-zinc-400 text-sm">← For You</button></div>}
          {(tab==='foryou' || tab==='following') && (
            <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
              {filtered.length===0 && <div className="h-screen flex items-center justify-center text-white flex-col"><p>{tab==='following'?'Hakuna Following - Follow kwanza':'Hakuna video'}</p><button onClick={()=>setTab('foryou')} className="mt-3 bg-white text-black px-6 py-2 rounded-full text-sm">For You</button></div>}
              {filtered.map(clip=>{
                const isLiked=myLikes.has(clip.id); const isFollowing=following.has(clip.username); const comments=commentsMap[clip.id]||[]; const isSaved=mySaves.has(clip.id)
                return (
                  <div key={clip.id} data-clipid={clip.id} className="h-screen w-full snap-start relative bg-black">
                    <video ref={el=>{if(el) videoRefs.current.set(clip.id, el)}} src={clip.url} loop playsInline muted={isMuted} onClick={()=>setIsMuted(!isMuted)} className="h-full w-full object-cover" />
                    
                    {/* SOUND BUTTON - KATIKATI */}
                    <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-5 py-2 rounded-full text-white text-sm z-10 border border-white/20">
                      {isMuted?'🔇 Tap for sound':'🔊 Sound ON'}
                    </button>

                    {/* KULIA - ZOTE HALISI SIO PICHA */}
                    <div className="absolute right-2 bottom-28 flex flex-col gap-4 items-center">
                      <div className="relative">
                        <button onClick={()=>setShowPage('me')} className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]"><div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-white">V</div></button>
                        <button onClick={()=>{const s=new Set(following); if(s.has(clip.username)) s.delete(clip.username); else s.add(clip.username); setFollowing(s)}} className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${isFollowing?'bg-zinc-600':'bg-[#FF2D55]'}`}>{isFollowing?'✓':'+'}</button>
                      </div>
                      <button onClick={async()=>{ if(isLiked){ await supabase.from('likes').delete().eq('clip_id',clip.id).eq('user_id',currentUser); setMyLikes(p=>{const n=new Set(p); n.delete(clip.id); return n}); setLikesMap(m=>({...m,[clip.id]:Math.max(0,(m[clip.id]||1)-1)});} else { await supabase.from('likes').insert({clip_id:clip.id,user_id:currentUser}); setMyLikes(p=>{const n=new Set(p); n.add(clip.id); return n}); setLikesMap(m=>({...m,[clip.id]:(m[clip.id]||0)+1})); } }} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isLiked?'bg-[#FF2D55]':'bg-white/20'}`}>❤️</div><span className="text-white text-xs font-bold mt-1">{likesMap[clip.id]||0}</span></button>
                      <button onClick={()=>setActiveClip(activeClip===clip.id?null:clip.id)} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">💬</div><span className="text-white text-xs font-bold mt-1">{comments.length}</span></button>
                      <button onClick={()=>{ const s=new Set(mySaves); if(s.has(clip.id)) s.delete(clip.id); else s.add(clip.id); setMySaves(s); }} className="flex flex-col items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isSaved?'bg-yellow-400':'bg-white/20'}`}>🔖</div><span className="text-white text-[10px] mt-1">Save</span></button>
                      <button onClick={()=>{ if(navigator.share) navigator.share({title:'Vibra', url:clip.url}); else {navigator.clipboard.writeText(clip.url); alert('Link copied!')}}} className="flex flex-col items-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">↗️</div><span className="text-white text-[10px] mt-1">Share</span></button>
                      <button onClick={()=>setShowPage('lyrics')} className="w-10 h-10 rounded-full bg-zinc-800 border border-white flex items-center justify-center text-xs animate-spin">🎵</button>
                    </div>

                    <div className="absolute bottom-20 left-3 right-20 text-white">
                      <p className="font-bold flex gap-2 items-center">@{clip.username}<button onClick={()=>{const s=new Set(following); if(s.has(clip.username)) s.delete(clip.username); else s.add(clip.username); setFollowing(s)}} className={`text-xs px-3 py-1 rounded-full font-bold ${isFollowing?'bg-zinc-700':'bg-[#FF2D55]'}`}>{isFollowing?'Following':'Follow'}</button></p>
                      <p className="text-sm mt-1">{clip.caption}</p>
                      <button onClick={()=>setShowPage('lyrics')} className="text-xs mt-2 opacity-80">🎵 Original sound - {clip.username} • Lyrics ♪</button>
                    </div>

                    {activeClip===clip.id && (
                      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl p-4 max-h-[50vh] flex flex-col z-30">
                        <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-3" onClick={()=>setActiveClip(null)} />
                        <div className="flex-1 overflow-y-auto space-y-2 mb-3">{comments.map(c=><p key={c.id} className="text-white text-sm"><b>@{c.username}:</b> {c.text}</p>)}{comments.length===0 && <p className="text-zinc-500 text-sm">Hakuna comment</p>}</div>
                        <div className="flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-zinc-800 text-white p-3 rounded-full text-sm"/><button onClick={async()=>{ if(!commentText.trim()) return; const {data}=await supabase.from('comments').insert({clip_id:clip.id,user_id:currentUser,username:currentUser,text:commentText}).select().single(); if(data){ setCommentsMap(m=>({...m,[clip.id]:[...(m[clip.id]||[]),data as any]})); setCommentText('')}}} className="bg-white text-black px-5 rounded-full font-bold">➤</button></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* BOTTOM - ZOTE HALISI */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] z-30 items-center">
        <button onClick={()=>{setShowPage('home'); setTab('foryou')}} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className={showPage==='home'&&tab==='foryou'?'font-bold':''}>Home</span></button>
        <button onClick={()=>setShowPage('explore')} className="flex flex-col items-center"><span className="text-xl">🔍</span><span className={showPage==='explore'?'font-bold':''}>Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-12 h-8 rounded-lg font-bold text-xl flex items-center justify-center">{uploading?'...':'+'}</button>
        <button onClick={()=>setShowPage('inbox')} className="flex flex-col items-center"><span className="text-xl">📩</span><span className={showPage==='inbox'?'font-bold':''}>Inbox</span></button>
        <button onClick={()=>setShowPage('me')} className="flex flex-col items-center"><div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${showPage==='me'?'bg-white text-black':'bg-zinc-700'}`}>V</div><span className={showPage==='me'?'font-bold':''}>Me</span></button>
      </div>
    </div>
  )
}
