import { useEffect, useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraApp,
})

type Clip = {
  id: string
  title: string
  creator: string
  username: string
  caption: string
  video_url: string
  created_at?: number
  likes?: number
}

export default function VibraApp() {
  const [clips, setClips] = useState<Clip[]>([])
  const [myClips, setMyClips] = useState<Clip[]>([])
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [tab, setTab] = useState<'home' | 'profile' | 'friends' | 'inbox' | 'explore'>('home')
  const [topTab, setTopTab] = useState<'following' | 'friends' | 'foryou'>('foryou')
  const fileRef = useRef<HTMLInputElement>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  async function fetchWorldwide() {
    const { data } = await supabase.from('clips').select('*').order('created_at', { ascending: false }).limit(20)
    if (data) setClips(data as any)
  }
  async function fetchMyVideos() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setCurrentUser(user)
    const myUsername = user.email?.split('@')[0] || 'user'
    const { data } = await supabase.from('clips').select('*').eq('username', myUsername).order('created_at', { ascending: false })
    if (data) setMyClips(data as any)
  }

  useEffect(() => { fetchWorldwide(); fetchMyVideos() }, [])

  async function importVideo(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setNotice('Login first'); return }
      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error: upErr } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      const now = Date.now()
      await supabase.from('clips').insert({
        id: now, title: file.name.replace(/\.[^.]+$/, ''), caption: 'Vibra Worldwide #viral #fyp', video_url: urlData.publicUrl,
        creator: user.email?.split('@')[0] || 'Creator', username: user.email?.split('@')[0] || 'user', created_at: now
      })
      setNotice('Uploaded!')
      fetchWorldwide(); fetchMyVideos(); setTab('home')
    } catch (e: any) { setNotice('Failed: ' + e.message) } finally { setUploading(false) }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* JUU KAMA TIKTOK */}
      {tab === 'home' && (
        <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-xs border border-white px-2 py-0.5 rounded">LIVE</span>
          <div className="flex gap-4 text-[15px] font-semibold">
            <button onClick={()=>setTopTab('following')} className={topTab==='following'?'text-white border-b-2 border-white': 'text-zinc-400'}>Following</button>
            <button onClick={()=>setTopTab('friends')} className={topTab==='friends'?'text-white border-b-2 border-white': 'text-zinc-400'}>Friends</button>
            <button onClick={()=>setTopTab('foryou')} className={topTab==='foryou'?'text-white border-b-2 border-white': 'text-zinc-400'}>For You</button>
          </div>
          <button className="text-xl">🔍</button>
        </div>
      )}

      {notice && <div className="fixed top-12 left-1/2 -translate-x-1/2 z-30 bg-white text-black px-4 py-1 rounded-full text-xs">{notice}</div>}

      <input ref={fileRef} type="file" accept="video/*" hidden onChange={e=>importVideo(e.target.files?.[0])} />

      <div className="flex-1 pb-[60px]">
        {tab === 'home' && (
          <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
            {clips.map(clip => (
              <div key={clip.id} className="h-[100dvh] snap-start relative w-full bg-black">
                <video src={clip.video_url} className="absolute inset-0 w-full h-full object-cover" loop autoPlay playsInline muted={false} controls={false} onClick={e=>{ const v=e.currentTarget; v.paused?v.play():v.pause() }} />
                
                {/* UBAVU - KULIA KAMA TIKTOK */}
                <div className="absolute right-2 bottom-20 z-10 flex flex-col items-center gap-5">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-white flex items-center justify-center font-bold">{clip.username[0]?.toUpperCase()}</div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">+</div>
                  </div>
                  <button onClick={()=>{ const s=new Set(liked); if(s.has(clip.id)) s.delete(clip.id); else s.add(clip.id); setLiked(s) }} className="flex flex-col items-center">
                    <div className={`text-[28px] ${liked.has(clip.id)?'':''}`}>{liked.has(clip.id)?'❤️':'🤍'}</div>
                    <span className="text-xs font-semibold">649</span>
                  </button>
                  <button className="flex flex-col items-center"><span className="text-2xl">💬</span><span className="text-xs">85</span></button>
                  <button className="flex flex-col items-center"><span className="text-2xl">🔖</span><span className="text-xs">52</span></button>
                  <button className="flex flex-col items-center"><span className="text-2xl">↗️</span><span className="text-xs">32</span></button>
                </div>

                {/* CHINI - KAMA TIKTOK */}
                <div className="absolute left-0 right-14 bottom-3 z-10 px-3">
                  <h3 className="font-bold text-[15px]">@{clip.username}</h3>
                  <p className="text-[14px] mt-1 line-clamp-2">{clip.title} 😂 #viral #kenyantiktok #fyp ... <span className="font-semibold">See more</span></p>
                  <p className="text-xs opacity-70 mt-1">♫ Original sound - Vibra</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <div className="p-0">
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold">{currentUser?.email?.[0]?.toUpperCase() || 'H'}</div>
              <h2 className="mt-3 font-bold">@{currentUser?.email?.split('@')[0] || 'hamadoski'}</h2>
              <div className="flex gap-6 mt-2 text-sm"><span><b>{myClips.length}</b> Videos</span></div>
            </div>
            <div className="grid grid-cols-3 gap-[1px] bg-black">
              {myClips.map(c=>(
                <div key={c.id} className="aspect-[3/4] bg-zinc-900 relative"><video src={c.video_url} className="w-full h-full object-cover" /></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'friends' && <div className="p-20 text-center opacity-60">Friends - Following feed</div>}
        {tab === 'explore' && <div className="p-20 text-center opacity-60">Explore - Coming soon</div>}
        {tab === 'inbox' && <div className="p-20 text-center opacity-60">Inbox - Messages</div>}
      </div>

      {/* CHINI KABISA - BOTTOM NAV KAMA TIKTOK */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around items-center py-1.5 z-20">
        <button onClick={()=>setTab('home')} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[10px]">Home</span></button>
        <button onClick={()=>setTab('explore')} className="flex flex-col items-center opacity-70"><span className="text-xl">🔲</span><span className="text-[10px]">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-3 py-1 rounded-md flex items-center justify-center"><span className="text-xl font-bold">+</span></button>
        <button onClick={()=>setTab('inbox')} className="flex flex-col items-center opacity-70"><span className="text-xl">💬</span><span className="text-[10px]">Inbox</span></button>
        <button onClick={()=>setTab('profile')} className="flex flex-col items-center opacity-70"><span className="text-xl">👤</span><span className="text-[10px]">Me</span></button>
      </div>

      {uploading && <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">Uploading to Worldwide...</div>}
    </div>
  )
}
