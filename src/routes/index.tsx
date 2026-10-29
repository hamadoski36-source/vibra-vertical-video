import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraHome,
})

type Clip = { id: string, url: string, username: string, caption: string }
type CommentT = { id: string, clip_id: string, username: string, text: string }

function VibraHome() {
  const [clips, setClips] = useState<Clip[]>([])
  const [likesMap, setLikesMap] = useState<Record<string, number>>({})
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set())
  const [mySaves, setMySaves] = useState<Set<string>>(new Set())
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentT[]>>({})
  const [activeClip, setActiveClip] = useState<string|null>(null)
  const [commentText, setCommentText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({})
  const [tab, setTab] = useState<'foryou'|'following'|'live'|'friends'>('foryou')
  const [searchQ, setSearchQ] = useState('')
  const [showExplore, setShowExplore] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const currentUser = typeof window !== 'undefined' ? (localStorage.getItem('vibra_user') || 'vibra_boy') : 'vibra_boy'

  useEffect(()=>{ loadClips(); loadLikes(); loadComments() }, [])

  async function loadClips(){
    const { data } = await supabase.from('clips').select('*').order('created_at', {ascending: false})
    if(data){
      const list = data.map((c:any)=>({ id: c.id, url: c.url || c.video_url, username: c.username || c.user_id || 'vibra_boy', caption: c.caption || 'Familia yangu 😂' }))
      setClips(list)
      const m: Record<string, boolean> = {}
      list.forEach((cl:Clip)=> m[cl.id]=true) // start muted for autoplay, tap to unmute
      setMutedMap(m)
    }
  }
  async function loadLikes(){
    const { data } = await supabase.from('likes').select('*')
    if(!data) return
    const map: Record<string, number> = {}
    const mine = new Set<string>()
    data.forEach((l:any)=>{
      map[l.clip_id] = (map[l.clip_id]||0)+1
      if(l.user_id===currentUser) mine.add(l.clip_id)
    })
    setLikesMap(map); setMyLikes(mine)
  }
  async function loadComments(){
    const { data } = await supabase.from('comments').select('*').order('created_at', {ascending: true})
    if(!data) return
    const map: Record<string, CommentT[]> = {}
    data.forEach((c:any)=>{
      if(!map[c.clip_id]) map[c.clip_id]=[]
      map[c.clip_id].push(c)
    })
    setCommentsMap(map)
  }

  async function handleLike(clipId: string){
    const already = myLikes.has(clipId)
    if(already){
      await supabase.from('likes').delete().eq('clip_id', clipId).eq('user_id', currentUser)
      setMyLikes(prev=>{ const n=new Set(prev); n.delete(clipId); return n })
      setLikesMap(prev=>({...prev, [clipId]: Math.max(0,(prev[clipId]||1)-1) }))
    } else {
      await supabase.from('likes').insert({ clip_id: clipId, user_id: currentUser })
      setMyLikes(prev=>{ const n=new Set(prev); n.add(clipId); return n })
      setLikesMap(prev=>({...prev, [clipId]: (prev[clipId]||0)+1 }))
    }
  }
  function handleSave(clipId: string){
    const already = mySaves.has(clipId)
    if(already){ setMySaves(prev=>{ const n=new Set(prev); n.delete(clipId); return n }) }
    else { setMySaves(prev=>{ const n=new Set(prev); n.add(clipId); return n }); alert('Saved to @vibra_boy 🔖') }
  }
  function handleShare(clip: Clip){
    if(navigator.share){ navigator.share({title: 'Vibra', text: clip.caption, url: clip.url}) }
    else { navigator.clipboard.writeText(clip.url); alert('Link copied! Share WhatsApp 🚀') }
  }
  async function sendComment(clipId: string){
    if(!commentText.trim()) return
    const { data } = await supabase.from('comments').insert({ clip_id: clipId, user_id: currentUser, username: currentUser, text: commentText }).select().single()
    if(data){ setCommentsMap(prev=>({...prev, [clipId]: [...(prev[clipId]||[]), data as any]})); setCommentText('') }
  }
  async function handleUpload(e:any){
    const file = e.target.files?.[0]; if(!file) return
    setUploading(true)
    try{
      const fileName = `${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if(error) throw error
      const { data } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      await supabase.from('clips').insert({ url: data.publicUrl, video_url: data.publicUrl, username: currentUser, user_id: currentUser, caption: 'Familia yangu 😂 #vibra' })
      alert('Uploaded Worldwide ✓'); loadClips()
    } catch(err:any){ alert('Fail: '+err.message) }
    setUploading(false)
  }

  const filtered = clips.filter(c=> c.caption.toLowerCase().includes(searchQ.toLowerCase()) || c.username.toLowerCase().includes(searchQ.toLowerCase()))

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
      
      {/* TOP BAR - Following | For You | Live | Friends */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col">
        <div className="flex justify-center gap-6 pt-3 pb-2 text-sm font-bold">
          <button onClick={()=>setTab('following')} className={tab==='following'?'text-white':'text-white/50'}>Following</button>
          <button onClick={()=>setTab('friends')} className={tab==='friends'?'text-white':'text-white/50'}>Friends</button>
          <button onClick={()=>setTab('foryou')} className={`${tab==='foryou'?'text-white border-b-2 border-white': 'text-white/50'} pb-1`}>For You</button>
          <button onClick={()=>setTab('live')} className={tab==='live'?'text-white':'text-white/50'}>LIVE</button>
        </div>
        <div className="px-3">
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." className="w-full bg-zinc-800/80 text-white px-4 py-2 rounded-full text-sm outline-none" />
        </div>
      </div>

      {/* EXPLORE PAGE */}
      {showExplore ? (
        <div className="h-full pt-24 pb-20 p-3 bg-black overflow-y-auto">
          <h2 className="text-white font-bold text-lg mb-3">Explore 🔍</h2>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(c=>(
              <div key={c.id} className="relative h-64 bg-zinc-900 rounded-xl overflow-hidden">
                <video src={c.url} className="w-full h-full object-cover" />
                <p className="absolute bottom-1 left-1 text-white text-xs">@{c.username}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowExplore(false)} className="mt-4 w-full bg-white text-black py-3 rounded-full font-bold">Back to For You</button>
        </div>
      ) : (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {(tab==='live'? [] : filtered).length===0 && tab!=='live' ? <div className="h-screen flex items-center justify-center text-white">Hakuna video - Search au Upload +</div> : null}
          {tab==='live' && <div className="h-screen flex flex-col items-center justify-center text-white"><p className="text-4xl">🔴 LIVE</p><p className="mt-2 opacity-60">No live now - kuwa wa kwanza ku-LIVE!</p><button className="mt-4 bg-red-500 px-6 py-2 rounded-full">Go LIVE</button></div>}
          
          {filtered.map(clip=>{
            const likeCount = likesMap[clip.id] || 0
            const isLiked = myLikes.has(clip.id)
            const isSaved = mySaves.has(clip.id)
            const comments = commentsMap[clip.id] || []
            const isMuted = mutedMap[clip.id] ?? true
            return (
              <div key={clip.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
                <video 
                  src={clip.url} 
                  className="h-full w-full object-cover" 
                  autoPlay loop playsInline 
                  muted={isMuted}
                  onClick={()=>setMutedMap(prev=>({...prev, [clip.id]: !prev[clip.id]}))}
                />

                {/* TAP FOR SOUND */}
                {isMuted && (
                  <button onClick={()=>setMutedMap(prev=>({...prev, [clip.id]: false}))} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm">🔊 Tap for sound</button>
                )}
                {!isMuted && (
                  <div className="absolute top-20 right-3 bg-black/60 p-2 rounded-full text-white text-xs">🔊</div>
                )}

                {/* RIGHT BAR - Profile + Like + Comment + Save + Share */}
                <div className="absolute right-2 bottom-32 flex flex-col gap-5 items-center">
                  {/* Profile + Follow */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">{clip.username[0].toUpperCase()}</div>
                    </div>
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center -mt-2 text-xs">+</div>
                  </div>

                  <button onClick={()=>handleLike(clip.id)} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isLiked?'bg-red-500':'bg-white/20 backdrop-blur'}`}>❤️</div>
                    <span className="text-white text-xs mt-1 font-bold">{likeCount}</span>
                  </button>

                  <button onClick={()=>setActiveClip(activeClip===clip.id?null:clip.id)} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xl">💬</div>
                    <span className="text-white text-xs mt-1 font-bold">{comments.length}</span>
                  </button>

                  <button onClick={()=>handleSave(clip.id)} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isSaved?'bg-yellow-400':'bg-white/20 backdrop-blur'}`}>🔖</div>
                    <span className="text-white text-xs mt-1">{isSaved?'Saved':'Save'}</span>
                  </button>

                  <button onClick={()=>handleShare(clip)} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xl">↗️</div>
                    <span className="text-white text-xs mt-1">Share</span>
                  </button>

                  <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white animate-spin flex items-center justify-center text-xs">🎵</div>
                </div>

                {/* LEFT BOTTOM - Username + Caption + Lyrics */}
                <div className="absolute bottom-24 left-3 right-20 text-white">
                  <p className="font-bold text-base">@{clip.username} • Follow</p>
                  <p className="text-sm mt-1">{clip.caption}</p>
                  <p className="text-xs mt-2 flex items-center gap-1 opacity-90">🎵 Original sound - {clip.username} <span className="animate-pulse">♪ {clip.caption} Familia yangu lyrics... ♪</span></p>
                </div>

                {/* COMMENTS SHEET */}
                {activeClip===clip.id && (
                  <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl p-4 max-h-[55vh] flex flex-col z-30">
                    <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-3" onClick={()=>setActiveClip(null)} />
                    <p className="font-bold text-white mb-3">{comments.length} comments</p>
                    <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                      {comments.map(c=>(
                        <p key={c.id} className="text-white text-sm"><b>@{c.username}:</b> {c.text}</p>
                      ))}
                      {comments.length===0 && <p className="text-zinc-500 text-sm">Hakuna comment - kuwa wa kwanza! 🔥</p>}
                    </div>
                    <div className="flex gap-2">
                      <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder={`Comment as @${currentUser}...`} className="flex-1 bg-zinc-800 text-white p-3 rounded-full text-sm" />
                      <button onClick={()=>sendComment(clip.id)} className="bg-white text-black px-5 rounded-full font-bold">➤</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* BOTTOM NAV - Real buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-white text-[10px] z-20 items-center">
        <button onClick={()=>setShowExplore(false)} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className={showExplore?'opacity-50':'font-bold'}>Home</span></button>
        <button onClick={()=>setShowExplore(true)} className="flex flex-col items-center"><span className="text-xl">🔍</span><span className={showExplore?'font-bold':'opacity-50'}>Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-8 py-2 rounded-lg font-bold text-xl -mt-1">{uploading?'...':'+'}</button>
        <button className="flex flex-col items-center"><span className="text-xl">📩</span><span>Inbox</span><span className="bg-red-500 text-[8px] px-1 rounded-full -mt-1">9+</span></button>
        <button className="flex flex-col items-center"><div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold">{currentUser[0].toUpperCase()}</div><span>Me</span></button>
      </div>
    </div>
  )
}
