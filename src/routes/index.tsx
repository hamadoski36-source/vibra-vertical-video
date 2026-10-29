import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [clips, setClips] = useState<any[]>([])
  const [muted, setMuted] = useState<Set<string>>(new Set())
  const [hasInteracted, setHasInteracted] = useState(false)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    const enableSound = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        setMuted(new Set())
        videoRefs.current.forEach(v => {
          v.muted = false
          v.play().catch(() => {})
        })
      }
    }
    document.addEventListener('click', enableSound, { once: true })
    document.addEventListener('touchstart', enableSound, { once: true })
    return () => {
      document.removeEventListener('click', enableSound)
      document.removeEventListener('touchstart', enableSound)
    }
  }, [hasInteracted])

  useEffect(() => {
    const fetchClips = async () => {
      const { data } = await supabase.from('clips').select('*').order('created_at', { ascending: false })
      if (data) setClips(data)
    }
    fetchClips()
  }, [])

  const handleUpload = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data } = await supabase.storage.from('clips').upload(fileName, file)
    if (data) {
      const { data: urlData } = supabase.storage.from('clips').getPublicUrl(fileName)
      await supabase.from('clips').insert({
        video_url: urlData.publicUrl,
        username: 'vibra_official',
        creator: 'VIBRA Official',
        title: file.name,
        likes: 0,
        comments: 0
      })
      const { data: newClips } = await supabase.from('clips').select('*').order('created_at', { ascending: false })
      if (newClips) setClips(newClips)
    }
  }

  return (
    <div className="h-screen w-screen bg-black overflow-y-scroll snap-y snap-mandatory">
      {!hasInteracted && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 text-black px-6 py-3 rounded-full font-bold animate-pulse">
          Tap anywhere for sound 🔊
        </div>
      )}
      {clips.map((clip) => (
        <div key={clip.id} className="h-screen w-screen snap-start relative flex items-center justify-center">
          <video
            ref={(el) => { if (el) videoRefs.current.set(clip.id, el) }}
            src={clip.video_url}
            loop
            autoPlay
            playsInline
            muted={hasInteracted ? muted.has(clip.id) : true}
            className="h-full w-full object-cover"
            onClick={() => {
              const v = videoRefs.current.get(clip.id)
              if (v) {
                setHasInteracted(true)
                if (v.muted) {
                  v.muted = false
                  setMuted(prev => { const n = new Set(prev); n.delete(clip.id); return n })
                } else {
                  v.muted = true
                  setMuted(prev => { const n = new Set(prev); n.add(clip.id); return n })
                }
              }
            }}
          />
          <div className="absolute bottom-24 left-4 text-white">
            <p className="font-bold text-lg">@{clip.username || 'vibra_official'}</p>
            <p className="text-sm opacity-80">{clip.creator || 'VIBRA Official'}</p>
            <p className="text-sm mt-1">{clip.title}</p>
          </div>
          <label className="absolute top-6 right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold cursor-pointer">
            Upload
            <input type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }} />
          </label>
        </div>
      ))}
    </div>
  )
}
