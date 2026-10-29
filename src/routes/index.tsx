import { useEffect, useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

// ===== VIBRA WORLDWIDE - CLEAN WORLDWIDE VERSION =====

export const Route = createFileRoute('/')({
  component: VibraApp,
  head: () => ({
    meta: [
      { title: 'Vibra Worldwide — Global short-video feed' },
      { name: 'description', content: 'Vibra Worldwide: upload and watch short videos shared by creators around the world.' },
      { property: 'og:title', content: 'Vibra Worldwide — Global short-video feed' },
      { property: 'og:description', content: 'Upload and watch short videos shared by creators around the world.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
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
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [title, setTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [page, setPage] = useState(0)

  // 1. FETCH WORLDWIDE FEED
  async function fetchWorldwide(reset = false) {
    const from = reset ? 0 : page * 10
    const to = from + 9
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
    
    if (!error && data) {
      if (reset) setClips(data as any)
      else setClips(prev => [...prev, ...data as any])
    }
  }

  useEffect(() => { fetchWorldwide(true) }, [])

  // 2. UPLOAD WORLDWIDE
  async function importVideo(file?: File) {
    if (!file) return
    if (!file.type.startsWith('video/')) { setNotice('Choose a video file'); return }
    if (file.size > 400 * 1024 * 1024) { setNotice('Video over 400MB'); return }

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setNotice('Please login first'); return }

      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/\s/g,'_')}`
      
      const { error: upErr } = await supabase.storage
        .from('Vibra clips')
        .upload(fileName, file)
      if (upErr) throw upErr

      const { data: urlData } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      
      const { error: dbErr } = await supabase.from('clips').insert({
        owner_id: user.id,
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        caption: 'Vibra Worldwide',
        video_url: urlData.publicUrl,
        visibility: 'public',
        creator: user.email?.split('@')[0] || 'Creator',
        username: user.email?.split('@')[0] || 'user'
      })
      if (dbErr) throw dbErr

      setNotice('✅ Uploaded WORLDWIDE! Dunia nzima inaiona!')
      setTitle('')
      setPage(0)
      setTimeout(() => fetchWorldwide(true), 1000)

    } catch (e:any) {
      setNotice('Failed: ' + (e.message || 'Check RLS policies'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // 3. DELETE OWN ONLY
  async function deleteClip(clip: Clip) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id !== clip.owner_id) { setNotice('You can only delete your own videos'); return }
    // Public URLs encode the space in the bucket name as %20 — handle both forms.
    const path = clip.video_url.split('/Vibra%20clips/')[1] || clip.video_url.split('/Vibra clips/')[1]
    if (path) await supabase.storage.from('Vibra clips').remove([decodeURIComponent(path)])
    await supabase.from('clips').delete().eq('id', clip.id)
    setClips(prev => prev.filter(c => c.id !== clip.id))
    setNotice('Deleted')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-zinc-800">
        <h1 className="font-bold text-xl">VIBRA WORLDWIDE</h1>
        <button onClick={() => fileRef.current?.click()} className="bg-white text-black px-4 py-2 rounded-full font-bold">+ Upload</button>
      </header>

      {notice && <div className="bg-zinc-800 p-3 text-center text-sm">{notice}</div>}

      <div className="p-4 flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" className="flex-1 bg-zinc-900 p-3 rounded-xl"/>
        <input ref={fileRef} type="file" accept="video/*" hidden onChange={e=>importVideo(e.target.files?.[0])} />
      </div>

      {uploading && <div className="p-4 text-center animate-pulse">Uploading to worldwide cloud...</div>}

      <div className="flex-1 overflow-y-auto snap-y snap-mandatory">
        {clips.length === 0 && <div className="p-10 text-center opacity-60">No worldwide videos yet. Be the first to upload!</div>}
        {clips.map(clip => (
          <div key={clip.id} className="h-[85vh] snap-start relative flex items-end">
            <video 
              src={clip.video_url} 
              className="absolute inset-0 w-full h-full object-cover"
              loop 
              playsInline
              controls
              onPlay={e=>{ document.querySelectorAll('video').forEach(v=>{ if(v!==e.currentTarget) v.pause() }) }}
            />
            <div className="relative z-10 p-5 bg-gradient-to-t from-black/80 to-transparent w-full">
              <h3 className="font-bold">{clip.title}</h3>
              <p className="text-sm opacity-80">@{clip.username} • {clip.creator}</p>
              <p className="text-sm mt-1">{clip.caption}</p>
              <button onClick={()=>deleteClip(clip)} className="mt-2 text-xs opacity-50">Delete my video</button>
            </div>
          </div>
        ))}
        <button onClick={()=>{ setPage(p=>p+1); fetchWorldwide() }} className="w-full p-6 text-center opacity-60">Load more ↓</button>
      </div>
    </div>
  )
}
