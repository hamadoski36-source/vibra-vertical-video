import { useEffect, useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/')({ component: VibraApp })

type Clip = { id: string; title: string; creator: string; username: string; video_url: string; likes?: number }

export default function VibraApp() {
  const [clips, setClips] = useState<Clip[]>([])
  const [myClips, setMyClips] = useState<Clip[]>([])
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [tab, setTab] = useState<'home' | 'profile' | 'friends' | 'inbox' | 'explore'>('home')
  const [topTab, setTopTab] = useState<'foryou' | 'following' | 'friends'>('foryou')
  const [showSearch, setShowSearch] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [showComments, setShowComments] = useState<string | null>(null)
  const [showLyrics, setShowLyrics] = useState<string | null>(null)
  const [muted, setMuted] = useState<Set<string>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  async function fetchAll() {
    const { data } = await supabase.from('clips').select('*').order('id', { ascending: false })
    if (data) setClips(data as any)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUser(user)
      const myU = user.email?.split('@')[0] || 'user'
      const { data: mine } = await supabase.from('clips').select('*').eq('creator', user.id)
      if (mine) setMyClips(mine as any)
    } else {
      // Angalia login yetu ya /auth
      const local = localStorage.getItem('vibra_user')
      if (local) setCurrentUser({ email: local, id: local })
    }
  }
  useEffect(()=>{ fetchAll() }, [])

  function toast(msg:string){ setNotice(msg); setTimeout(()=>setNotice(''), 3000) }

  async function importVideo(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      let userId = 'guest_user'
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
      } else {
        const local = localStorage.getItem('vibra_user')
        if (local) userId = local.replace(/[^a-zA-Z0-9]/g, '_')
        else {
          toast('Ingia kwanza...')
          window.location.href = '/auth'
          return
        }
      }
      const fileName = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      await supabase.from('clips').insert({ id: Date.now(), title: file.name, video_url: urlData.publicUrl, creator: userId, username: userId })
      toast('Uploaded Worldwide ✓'); fetchAll(); setTab('home')
    } catch(e:any){ toast('Fail: '+e.message) } finally { setUploading(false) }
  }

  const filteredClips = clips.filter(c => c.title.toLowerCase().includes(searchQ.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {tab==='home' && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent">
          {showSearch ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <button onClick={()=>setShowSearch(false)}>←</button>
              <input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." className="flex-1 bg-zinc-800 p-2 rounded-full px-4" />
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-3">
              <button onClick={()=>toast('LIVE - 12 creators live! 🔴')} className="border border-white/30 px-2 py-1 rounded text-xs">LIVE</button>
              <div className="flex gap-4 text-[15px] font-semibold">
                <button onClick={()=>setTopTab('following')} className={topTab==='following'?'border-b-2 border-white':''}>Following</button>
                <button onClick={()=>{setTopTab('friends'); setTab('friends' as any)}}>Friends</button>
                <button onClick={()=>setTopTab('foryou')} className={topTab==='foryou'?'border-b-2 border-white':''}>For You</button>
              </div>
              <button onClick={()=>setShowSearch(true)}>🔍</button>
            </div>
          )}
        </div>
      )}

      {notice && <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm z-50">{notice}</div>}

      <input ref={fileRef} type="file" accept="video/*" hidden onChange={e=>importVideo(e.target.files?.[0] || undefined)} />

      <div className="flex-1 pb-[58px]">
        {tab==='home' && (
          <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
            {filteredClips.map(clip=>(
              <div key={clip.id} className="h-[100dvh] snap-start relative flex items-center justify-center bg-black">
                <video src={clip.video_url} className="absolute inset-0 w-full h-full object-cover" loop autoPlay playsInline muted={muted.has(clip.id)} onClick={e=>{ const v=e.currentTarget as HTMLVideoElement; if(v.paused) v.play(); else v.pause()}} />
                <button onClick={()=>{ const s=new Set(muted); if(s.has(clip.id)){s.delete(clip.id); toast('Sound On')} else {s.add(clip.id); toast('Muted 🔇')}; setMuted(s)}} className="absolute top-16 right-3 z-20 bg-black/50 w-8 h-8 rounded-full"> {muted.has(clip.id)?'🔇':'🔊'} </button>
                <div className="absolute right-2 bottom-28 z-10 flex flex-col gap-4 items-center">
                  <button onClick={()=>{ const s=new Set(followed); if(s.has(clip.id))s.delete(clip.id); else s.add(clip.id); setFollowed(s)}}><div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">{clip.username?.[0] || 'V'}</div></button>
                  <button onClick={()=>{ const s=new Set(liked); if(s.has(clip.id))s.delete(clip.id); else s.add(clip.id); setLiked(s)}}><span className="text-[30px]">{liked.has(clip.id)?'❤️':'🤍'}</span><span className="text-[11px] font-semibold block">{(clip.likes||649)+(liked.has(clip.id)?1:0)}</span></button>
                  <button onClick={()=>setShowComments(clip.id)} className="text-2xl">💬<span className="text-[11px] block">65</span></button>
                  <button onClick={()=>{ const s=new Set(saved); if(s.has(clip.id))s.delete(clip.id); else s.add(clip.id); setSaved(s)}} className="text-2xl">🔖<span className="text-[11px] block">52</span></button>
                  <button onClick={async()=>{ if(navigator.share){ try{await navigator.share({title:clip.title, url: clip.video_url})}catch{}} else {toast('Link copied!')}}} className="text-2xl">↗️<span className="text-[11px] block">32</span></button>
                </div>
                <div className="absolute left-0 right-16 bottom-3 z-10 px-3">
                  <button onClick={()=>setTab('profile')} className="font-bold text-[13px]">@{clip.username || 'vibra_official'}</button>
                  <p className="text-[13px] mt-1 line-clamp-2">{clip.title} 😊 #viral #fyp</p>
                  <button onClick={()=>setShowLyrics(showLyrics===clip.id?null:clip.id)} className="mt-2 flex items-center gap-2 text-xs bg-black/40 px-2 py-1 rounded-full"><span>♫</span><span className="truncate max-w-[180px]">Original sound - {clip.username}</span><span>{showLyrics===clip.id?'▲':'▼'}</span></button>
                  {showLyrics===clip.id && (<div className="mt-2 bg-black/60 p-2 rounded-lg text-xs"><p>Together forever, never apart</p><p>You are the beat of my heart ❤️</p><p>Through the night, through the day...</p></div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='profile' && (
          <div>
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">👤</div>
              <h2 className="mt-3 font-bold">@{currentUser?.email?.split('@')[0] || 'guest'}</h2>
              <p className="text-xs opacity-60 mt-1">{myClips.length} videos • {currentUser?.email || 'Not logged in'}</p>
              {!currentUser && <a href="/auth" className="mt-3 bg-white text-black px-6 py-2 rounded-full text-sm font-bold">Login / Signup</a>}
            </div>
            <div className="grid grid-cols-3 gap-[1px]">{myClips.map(c=><div key={c.id} className="aspect-[3/4] bg-zinc-900"><video src={c.video_url} className="w-full h-full object-cover" /></div>)}</div>
          </div>
        )}

        {tab!=='home' && tab!=='profile' && <div className="p-20 text-center opacity-60">Coming soon: {tab}</div>}
      </div>

      {showComments && (<div className="fixed inset-0 z-40 bg-black/60" onClick={()=>setShowComments(null)}><div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl p-4" onClick={e=>e.stopPropagation()}><div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-3"></div><h3 className="font-bold text-sm mb-3">85 comments</h3><div className="space-y-3 text-sm overflow-y-auto max-h-[40vh]"><p><b>@mimi_ke:</b> Hii kali 😍🔥</p><p><b>@brayo:</b> Together forever ❤️</p></div><div className="flex gap-2 mt-4"><input placeholder="Add comment..." className="flex-1 bg-zinc-800 p-2 rounded-full px-4" /><button onClick={()=>{toast('Comment posted!'); setShowComments(null)}}>➤</button></div></div></div>)}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around py-1 text-[10px]">
        <button onClick={()=>setTab('home')} className="flex flex-col items-center">🏠<span>Home</span></button>
        <button onClick={()=>setTab('explore')} className="flex flex-col items-center opacity-60">🔲<span>Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-10 h-7 rounded-md flex items-center justify-center font-bold text-lg">+</button>
        <button onClick={()=>setTab('inbox')} className="flex flex-col items-center opacity-60">💬<span>Inbox</span></button>
        <button onClick={()=>setTab('profile')} className="flex flex-col items-center opacity-60">👤<span>Me</span></button>
      </div>

      {uploading && <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-white rounded-full"></div><p className="mt-4">Uploading Worldwide... 🌍</p></div>}
    </div>
  )
}
