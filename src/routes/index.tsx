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
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentT[]>>({})
  const [activeClip, setActiveClip] = useState<string|null>(null)
  const [commentText, setCommentText] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const currentUser = typeof window !== 'undefined' ? (localStorage.getItem('vibra_user') || 'vibra_boy') : 'vibra_boy'

  useEffect(()=>{ loadClips(); loadLikes(); loadComments() }, [])

  async function loadClips(){
    const { data } = await supabase.from('clips').select('*').order('created_at', {ascending: false})
    if(data) setClips(data.map((c:any)=>({ id: c.id, url: c.url || c.video_url, username: c.username || c.user_id || 'vibra_boy', caption: c.caption || '' })))
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

  async function sendComment(clipId: string){
    if(!commentText.trim()) return
    const { data } = await supabase.from('comments').insert({ clip_id: clipId, user_id: currentUser, username: currentUser, text: commentText }).select().single()
    if(data){
      setCommentsMap(prev=>({...prev, [clipId]: [...(prev[clipId]||[]), data as any]}))
      setCommentText('')
    }
  }

  async function handleUpload(e:any){
    const file = e.target.files?.[0]
    if(!file) return
    setUploading(true)
    try{
      const fileName = `${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if(upErr) throw upErr
      const { data } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      await supabase.from('clips').insert({ url: data.publicUrl, video_url: data.publicUrl, username: currentUser, user_id: currentUser, caption: 'Familia yangu 😂' })
      alert('Uploaded Worldwide ✓')
      loadClips()
    } catch(err:any){ alert('Fail: '+err.message) }
    setUploading(false)
  }

  return (
    <div className="h-screen bg-black overflow-y-scroll snap-y snap-mandatory">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
      
      {clips.map(clip=>{
        const likeCount = likesMap[clip.id] || 0
        const isLiked = myLikes.has(clip.id)
        const comments = commentsMap[clip.id] || []
        return (
          <div key={clip.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
            <video src={clip.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
            
            <div className="absolute right-3 bottom-36 flex flex-col gap-6 items-center">
              <button onClick={()=>handleLike(clip.id)} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isLiked?'bg-red-500':'bg-zinc-800'}`}>❤️</div>
                <span className="text-white text-xs mt-1 font-bold">{likeCount}</span>
              </button>
              <button onClick={()=>setActiveClip(activeClip===clip.id?null:clip.id)} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl">💬</div>
                <span className="text-white text-xs mt-1 font-bold">{comments.length}</span>
              </button>
            </div>

            <div className="absolute bottom-24 left-3 right-20 text-white">
              <p className="font-bold">@{clip.username}</p>
              <p className="text-sm mt-1">{clip.caption}</p>
            </div>

            {activeClip===clip.id && (
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl p-4 max-h-[55vh] flex flex-col z-20">
                <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-3" onClick={()=>setActiveClip(null)} />
                <p className="font-bold text-white mb-3">{comments.length} comments</p>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                  {comments.map(c=>(
                    <p key={c.id} className="text-white text-sm"><b>@{c.username}:</b> {c.text}</p>
                  ))}
                  {comments.length===0 && <p className="text-zinc-500 text-sm">Hakuna comment - kuwa wa kwanza! 🔥</p>}
                </div>
                <div className="flex gap-2">
                  <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment as @vibra_boy..." className="flex-1 bg-zinc-800 text-white p-3 rounded-full text-sm" />
                  <button onClick={()=>sendComment(clip.id)} className="bg-white text-black px-5 rounded-full font-bold">➤</button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <div className="fixed top-0 left-0 right-0 p-3 z-10">
        <input placeholder="Search..." className="bg-zinc-800/80 text-white px-4 py-2 rounded-full w-full max-w-xs text-sm" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 flex justify-around p-3 text-white text-xs z-10 items-center">
        <span>🏠</span><span>🔍</span>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-7 py-2 rounded-full font-bold text-lg">{uploading?'...':'+'}</button>
        <span>📩</span><span>👤</span>
      </div>
    </div>
  )
}
