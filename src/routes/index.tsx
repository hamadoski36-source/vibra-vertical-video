import { useEffect, useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

// ===== VIBRA WORLDWIDE - PROFILE + PLUS CONNECTED =====

export const Route = createFileRoute('/')({
  component: VibraApp,
  head: () => ({
    meta: [
      { title: 'Vibra Worldwide - Global short-video feed' },
      { name: 'description', content: 'Vibra Worldwide: upload and watch short videos worldwide' },
    ],
  }),
})

type Clip = {
  id: string
  title: string
  creator: string
  username: string
  caption: string
  video_url: string
  created_at?: number
}

export default function VibraApp() {
  const [clips, setClips] = useState<Clip[]>([])
  const [myClips, setMyClips] = useState<Clip[]>([])
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [title, setTitle] = useState('')
  const [tab, setTab] = useState<'home' | 'profile' | 'friends' | 'inbox'>('home')
  const fileRef = useRef<HTMLInputElement>(null)
  const [page, setPage] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // 1. FETCH WORLDWIDE
  async function fetchWorldwide(reset = false) {
    const from = reset ? 0 : page * 10
    const to = from + 9
    const { data, error } = await supabase.from('clips').select('*').order('created_at', { ascending: false }).range(from, to)
    if (!error && data) {
      if (reset) setClips(data as any)
      else setClips(prev => [...prev, ...data as any])
    }
  }

  // 1b. FETCH MY PROFILE VIDEOS
  async function fetchMyVideos() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setCurrentUser(user)
    const myUsername = user.email?.split('@')[0] || 'user'
    const { data } = await supabase.from('clips').select('*').eq('username', myUsername).order('created_at', { ascending: false })
    if (data) setMyClips(data as any)
  }

  useEffect(() => { fetchWorldwide(true); fetchMyVideos() }, [])
  useEffect(() => { if (tab === 'profile') fetchMyVideos() }, [tab])

  // 2. UPLOAD - NOW CONNECTED TO PROFILE
  async function importVideo(file?: File) {
    if (!file) return
    if (!file.type.startsWith('video/')) { setNotice('Choose a video file'); return }
    if (file.size > 400 * 1024 * 1024) { setNotice('Video over 400MB'); return }
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setNotice('Please login first'); return }
      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error: upErr } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      const now = Date.now()
      const { error: dbErr } = await supabase.from('clips').insert({
        id: now,
        title: title || file.name.replace(/\.[^.]+$/, ''),
        caption: 'Vibra Worldwide',
        video_url: urlData.publicUrl,
        creator: user.email?.split('@')[0] || 'Creator',
        username: user.email?.split('@')[0] || 'user',
        created_at: now
      })
      if (dbErr) throw dbErr
      setNotice('Uploaded worldwide! Check Profile ✓')
      setTitle('')
      setPage(0)
      setTimeout(() => { fetchWorldwide(true); fetchMyVideos() }, 1000)
      setTab('profile')
    } catch (e: any) {
      setNotice('Failed: ' + (e.message || 'Check RLS policies'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function deleteClip(clip: Clip) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setNotice('Please login first'); return }
    const path = clip.video_url.split('/Vibra%20clips/')[1] || clip.video_url.split('/Vibra clips/')[1]
    if (path) await supabase.storage.from('Vibra clips').remove([decodeURIComponent(path)])
    await supabase.from('clips').delete().eq('id', clip.id)
    setClips(prev => prev.filter(c => c.id !== clip.id))
    setMyClips(prev => prev.filter(c => c.id !== clip.id))
    setNotice('Deleted')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-zinc-800">
        <h1 className="font-bold text-xl">VIBRA WORLDWIDE</h1>
        <span className="text-xs opacity-60">{currentUser?.email?.split('@')[0] || ''}</span>
      </header>

      {notice && <div className="bg-zinc-800 p-3 text-center text-sm">{notice}</div>}

      <div className="p-4 flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm" />
        <input ref={fileRef} type="file" accept="video/*" hidden onChange={e=>importVideo(e.target.files?.[0])} />
      </div>

      {uploading && <div className="p-4 text-center animate-pulse">Uploading to Worldwide + Profile...</div>}

      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'home' && (
          <div className="snap-y snap-mandatory">
            {clips.length === 0 && <div className="p-10 text-center opacity-60">No videos yet. Tap + to upload!</div>}
            {clips.map(clip => (
              <div key={clip.id} className="h-[85vh] snap-start relative flex flex-col justify-end">
                <video src={clip.video_url} className="absolute inset-0 w-full h-full object-cover" loop playsInline controls onPlay={e=>{ document.querySelectorAll('video').forEach(v=>{ if(v!==e.currentTarget) v.pause() }) }} />
                <div className="relative z-10 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold">{clip.title}</h3>
                  <p className="text-sm opacity-80">@{clip.username}</p>
                  <p className="text-sm mt-1">{clip.caption}</p>
                  <button onClick={()=>deleteClip(clip)} className="mt-2 text-xs opacity-60 underline">Delete</button>
                </div>
              </div>
            ))}
            <button onClick={()=>{ setPage(p=>p+1); fetchWorldwide() }} className="w-full p-4 text-center opacity-60">Load more</button>
          </div>
        )}

        {tab === 'profile' && (
          <div className="p-4">
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold">{currentUser?.email?.[0]?.toUpperCase() || 'H'}</div>
              <h2 className="mt-3 font-bold text-lg">@{currentUser?.email?.split('@')[0] || 'hamadoski'}</h2>
              <div className="flex gap-6 mt-3 text-sm">
                <span><b>{myClips.length}</b> Videos</span>
                <span><b>0</b> Followers</span>
                <span><b>0</b> Following</span>
              </div>
              <button onClick={()=>fileRef.current?.click()} className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold">Upload with +</button>
            </div>
            {myClips.length === 0 ? (
              <div className="text-center opacity-60 py-10">No videos yet - tap + to upload your first Vibra!</div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {myClips.map(c=>(
                  <div key={c.id} className="aspect-[9/16] bg-zinc-900 relative">
                    <video src={c.video_url} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded">{c.title.slice(0,12)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'friends' && <div className="p-10 text-center opacity-60">Friends feed coming soon</div>}
        {tab === 'inbox' && <div className="p-10 text-center opacity-60">Inbox coming soon</div>}
      </div>

      {/* BOTTOM NAV - PROFILE IKO NA PLUS IMEUNGANISHWA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center py-2 px-2">
        <button onClick={()=>{ setTab('home'); fetchWorldwide(true)}} className={`flex flex-col items-center text-xs ${tab==='home'?'text-white':'opacity-60'}`}><span className="text-xl">🏠</span>Home</button>
        <button onClick={()=>setTab('friends')} className={`flex flex-col items-center text-xs ${tab==='friends'?'text-white':'opacity-60'}`}><span className="text-xl">👥</span>Friends</button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black w-12 h-8 rounded-lg flex items-center justify-center text-2xl font-bold">+</button>
        <button onClick={()=>setTab('inbox')} className={`flex flex-col items-center text-xs ${tab==='inbox'?'text-white':'opacity-60'}`}><span className="text-xl">📩</span>Inbox</button>
        <button onClick={()=>setTab('profile')} className={`flex flex-col items-center text-xs ${tab==='profile'?'text-white':'opacity-60'}`}><span className="text-xl">👤</span>Profile</button>
      </div>
    </div>
  )
}
