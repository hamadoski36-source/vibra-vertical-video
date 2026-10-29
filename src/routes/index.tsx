import { useEffect, useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/')({ component: VibraApp })

type Clip = { id: string; title: string; creator: string; username: string; caption: string; video_url: string; created_at?: number }

export default function VibraApp() {
  const [clips, setClips] = useState<Clip[]>([])
  const [myClips, setMyClips] = useState<Clip[]>([])
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [tab, setTab] = useState<'home' | 'profile' | 'friends' | 'inbox' | 'explore'>('home')
  const [topTab, setTopTab] = useState('foryou')
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
    const { data } = await supabase.from('clips').select('*').order('created_at', { ascending: false }).limit(20)
    if (data) setClips(data as any)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUser(user)
      const myU = user.email?.split('@')[0] || 'user'
      const { data: mine } = await supabase.from('clips').select('*').eq('username', myU).order('created_at', { ascending: false })
      if (mine) setMyClips(mine as any)
    }
  }
  useEffect(()=>{ fetchAll() }, [])

  function toast(msg:string){ setNotice(msg); setTimeout(()=>setNotice(''), 2000) }

  async function importVideo(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast('Login first'); return }
      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`
      const { error } = await supabase.storage.from('Vibra clips').upload(fileName, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('Vibra clips').getPublicUrl(fileName)
      await supabase.from('clips').insert({ id: Date.now(), title: file.name.replace(/\.[^.]+$/,''), caption: 'Together Forever ❤️ Lyrics in caption...', video_url: urlData.publicUrl, creator: user.email?.split('@')[0]||'Creator', username: user.email?.split('@')[0]||'user', created_at: Date.now() })
      toast('Uploaded Worldwide ✓'); fetchAll(); setTab('home')
    } catch(e:any){ toast('Fail: '+e.message) } finally { setUploading(false) }
  }

  const filteredClips = clips.filter(c => c.title.toLowerCase().includes(searchQ.toLowerCase()) || c.username.toLowerCase().includes(searchQ.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {tab==='home' && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
          {showSearch ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <button onClick={()=>setShowSearch(false)}>←</button>
              <input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." className="flex-1 bg-zinc-800 rounded-full px-4 py-1.5 text-sm outline-none" />
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-3">
              <button onClick={()=>toast('LIVE - 12 creators live! 🔴')} className="text-[11px] border border-white/60 px-2 py-0.5 rounded">LIVE</button>
              <div className="flex gap-4 text-[15px] font-semibold">
                <button onClick={()=>setTopTab('following')} className={topTab==='following'?'text-white border-b-2 border-white pb-0.5':'text-zinc-400'}>Following</button>
                <button onClick={()=>{setTopTab('friends'); setTab('friends')}} className={topTab==='friends'?'text-white border-b-2 border-white pb-0.5':'text-zinc-400'}>Friends</button>
                <button onClick={()=>setTopTab('foryou')} className={topTab==='foryou'?'text-white border-b-2 border-white pb-0.5':'text-zinc-400'}>For You</button>
              </div>
              <button onClick={()=>setShowSearch(true)} className="text-[18px]">🔍</button>
            </div>
          )}
        </div>
      )}

      {notice && <div className="fixed top-14 left-1/2 -translate-x-1/2 z-30 bg-white text-black px-4 py-1.5 rounded-full text-xs font-semibold">{notice}</div>}

      <input ref={fileRef} type="file" accept="video/*" hidden onChange={e=>importVideo(e.target.files?.[0])} />

      <div className="flex-1 pb-[58px]">
        {tab==='home' && (
          <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
            {filteredClips.map(clip=>(
              <div key={clip.id} className="h-[100dvh] snap-start relative w-full bg-black">
                {/* VIDEO - SASA INA SAUTI! */}
                <video 
                  src={clip.video_url} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  loop autoPlay playsInline 
                  muted={muted.has(clip.id)} 
                  controls={false}
                  onClick={e=>{
                    const v=e.currentTarget as HTMLVideoElement
                    if(v.paused) v.play()
                    else v.pause()
                  }}
                />

                {/* BUTTON YA SAUTI - JUU KULIA */}
                <button 
                  onClick={()=>{
                    const s=new Set(muted)
                    if(s.has(clip.id)) {s.delete(clip.id); toast('Sound ON 🔊')} 
                    else {s.add(clip.id); toast('Muted 🔇')}
                    setMuted(s)
                  }}
                  className="absolute top-16 right-3 z-20 bg-black/50 rounded-full p-2 text-sm"
                >
                  {muted.has(clip.id)?'🔇':'🔊'}
                </button>

                {/* UBAVU KULIA */}
                <div className="absolute right-2 bottom-28 z-10 flex flex-col items-center gap-5">
                  <button onClick={()=>{ const s=new Set(followed); if(s.has(clip.id)) s.delete(clip.id); else {s.add(clip.id); toast(`Following @${clip.username} ✓`)}; setFollowed(s)}} className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center font-bold">{clip.username[0]?.toUpperCase()}</div>
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${followed.has(clip.id)?'bg-zinc-600':'bg-red-500'}`}>{followed.has(clip.id)?'✓':'+'}</div>
                  </button>
                  <button onClick={()=>{ const s=new Set(liked); if(s.has(clip.id)) s.delete(clip.id); else s.add(clip.id); setLiked(s)}} className="flex flex-col items-center">
                    <span className="text-[30px]">{liked.has(clip.id)?'❤️':'🤍'}</span>
                    <span className="text-[11px] font-semibold">{liked.has(clip.id)?650:649}</span>
                  </button>
                  <button onClick={()=>setShowComments(clip.id)} className="flex flex-col items-center"><span className="text-[26px]">💬</span><span className="text-[11px]">85</span></button>
                  <button onClick={()=>{ const s=new Set(saved); if(s.has(clip.id)) s.delete(clip.id); else s.add(clip.id); setSaved(s)}} className="flex flex-col items-center"><span className="text-[22px]">{saved.has(clip.id)?'🔖':'📑'}</span><span className="text-[11px]">52</span></button>
                  <button onClick={async()=>{ if(navigator.share){ try{ await navigator.share({title: clip.title, url: clip.video_url})} catch{} } else { navigator.clipboard.writeText(clip.video_url); toast('Link copied! ↗️')}}} className="flex flex-col items-center"><span className="text-[22px]">↗️</span><span className="text-[11px]">32</span></button>
                </div>

                {/* CHINI - NA LYRICS! */}
                <div className="absolute left-0 right-16 bottom-3 z-10 px-3">
                  <button onClick={()=>setTab('profile')} className="font-bold text-[15px]">@{clip.username}</button>
                  <p className="text-[13px] mt-1 line-clamp-2">{clip.title} 😂 #viral #fyp</p>
                  {/* LYRICS BUTTON */}
                  <button onClick={()=>setShowLyrics(showLyrics===clip.id?null:clip.id)} className="flex items-center gap-1 text-[11px] opacity-90 mt-1 bg-black/40 px-2 py-1 rounded-full">
                    <span>♫</span>
                    <span className="truncate max-w-[180px]">Original sound - {clip.username} • Lyrics</span>
                    <span>{showLyrics===clip.id?'▲':'▼'}</span>
                  </button>
                  {/* LYRICS ZINAPOFUNGUKA */}
                  {showLyrics===clip.id && (
                    <div className="mt-2 bg-black/60 p-2 rounded-lg text-[11px] leading-5 max-h-24 overflow-y-auto">
                      <p>Together forever, never apart</p>
                      <p>You are the beat of my heart ❤️</p>
                      <p>Through the night, through the day...</p>
                      <p className="opacity-60 mt-1">Lyrics by {clip.username}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='profile' && (
          <div>
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold">{currentUser?.email?.[0]?.toUpperCase()||'H'}</div>
              <h2 className="mt-3 font-bold">@{currentUser?.email?.split('@')[0]||'hamadoski'}</h2>
              <p className="text-xs opacity-60 mt-1">{myClips.length} videos</p>
            </div>
            <div className="grid grid-cols-3 gap-[1px]">
              {myClips.map(c=><div key={c.id} className="aspect-[3/4] bg-zinc-900"><video src={c.video_url} className="w-full h-full object-cover" muted /></div>)}
            </div>
          </div>
        )}
        {tab!=='home' && tab!=='profile' && <div className="p-20 text-center opacity-60 mt-20">{tab}</div>}
      </div>

      {showComments && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={()=>setShowComments(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl p-4 max-h-[60vh]" onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-3"></div>
            <h3 className="font-bold text-sm mb-3">85 comments</h3>
            <div className="space-y-3 text-sm overflow-y-auto max-h-[40vh]">
              <p><b>@mimi_ke:</b> Hii kali 😍🔥</p>
              <p><b>@brayo:</b> Together forever ❤️</p>
            </div>
            <div className="flex gap-2 mt-4">
              <input placeholder="Add comment..." className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none" onKeyDown={e=>{ if(e.key==='Enter'){ toast('Comment posted!'); setShowComments(null)} }} />
              <button onClick={()=>{toast('Comment posted!'); setShowComments(null)}} className="text-red-400 font-bold">Post</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around items-center py-1 z-30">
        <button onClick={()=>setTab('home')} className="flex flex-col items-center"><span className="text-[20px]">🏠</span><span className="text-[9px]">Home</span></button>
        <button onClick={()=>setTab('explore')} className="flex flex-col items-center opacity-60"><span className="text-[18px]">🔲</span><span className="text-[9px]">Explore</span></button>
        <button onClick={()=>fileRef.current?.click()} className="bg-white text-black px-4 py-1 rounded-md"><span className="text-[20px] font-bold">+</span></button>
        <button onClick={()=>setTab('inbox')} className="flex flex-col items-center opacity-60"><span className="text-[18px]">💬</span><span className="text-[9px]">Inbox</span></button>
        <button onClick={()=>setTab('profile')} className="flex flex-col items-center opacity-60"><span className="text-[18px]">👤</span><span className="text-[9px]">Me</span></button>
      </div>

      {uploading && <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-2"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="text-xs">Uploading...</span></div>}
    </div>
  )
}
