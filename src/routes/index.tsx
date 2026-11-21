
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: VibraApp,
})

type Video = {
  id: number
  user: string
  desc: string
  emoji: string
}

type Comment = {
  id: number
  video_id: string
  username: string
  text: string
  created_at: string
}

const videos: Video[] = [
  { id: 1, user: '@hamadoski', desc: 'VIBRA yangu ya kwanza 🔥 #vibra #mombasa', emoji: '🔥' },
  { id: 2, user: '@vibra_tz', desc: 'Mombasa vibes 🌊 #mombasa', emoji: '🌊' },
  { id: 3, user: '@doski47', desc: 'Dance challenge mpya 💃 #dance', emoji: '💃' },
  { id: 4, user: '@mr_vibra', desc: 'New song out now 🎵', emoji: '🎵' },
  { id: 5, user: '@hamadoski', desc: 'Leo Mombasa inawaka ☀️', emoji: '☀️' },
]

function VibraApp() {
  const [page, setPage] = useState('home')
  const [userId, setUserId] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')
  const [likedIds, setLikedIds] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({})
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({})
  const [followed, setFollowed] = useState(false)
  const [dp, setDp] = useState(() => localStorage.getItem('vibra_dp') || '')
  const [userName] = useState('Mr vibra')
  const [userHandle] = useState('@hamadoski')
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [workingLike, setWorkingLike] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Pata utambulisho wa kipekee bila mtumiaji kujisajili.
  useEffect(() => {
    let mounted = true

    async function startAnonymousSession() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) throw sessionError

        let currentUser = sessionData.session?.user

        if (!currentUser) {
          const { data, error } = await supabase.auth.signInAnonymously()
          if (error) throw error
          currentUser = data.user
        }

        if (!currentUser) throw new Error('Imeshindikana kupata utambulisho.')

        if (mounted) {
          setUserId(currentUser.id)
          setAuthReady(true)
        }
      } catch (error: any) {
        if (mounted) {
          setAuthError(error?.message || 'Imeshindikana kuunganisha Supabase.')
          setAuthReady(true)
        }
      }
    }

    startAnonymousSession()

    return () => {
      mounted = false
    }
  }, [])

  // Pakua likes na comments kutoka Supabase.
  useEffect(() => {
    if (!userId) return

    async function loadActivity() {
      const { data: likes, error: likesError } = await supabase
        .from('vibra_likes')
        .select('video_id,user_email')

      if (!likesError && likes) {
        const counts: Record<number, number> = {}
        const mine: number[] = []

        likes.forEach((like: any) => {
          const id = Number(like.video_id)
          counts[id] = (counts[id] || 0) + 1

          if (like.user_email === userId) {
            mine.push(id)
          }
        })

        setLikeCounts(counts)
        setLikedIds(mine)
      }

      const { data: allComments, error: commentsError } = await supabase
        .from('vibra_comments')
        .select('video_id')

      if (!commentsError && allComments) {
        const counts: Record<number, number> = {}

        allComments.forEach((comment: any) => {
          const id = Number(comment.video_id)
          counts[id] = (counts[id] || 0) + 1
        })

        setCommentCounts(counts)
      }
    }

    loadActivity()
  }, [userId])

  const toggleLike = async (id: number) => {
    if (!userId || workingLike !== null) return

    setWorkingLike(id)
    const alreadyLiked = likedIds.includes(id)
    const videoId = String(id)

    // Badilisha UI mara moja.
    setLikedIds(previous =>
      alreadyLiked
        ? previous.filter(item => item !== id)
        : [...previous, id]
    )
    setLikeCounts(previous => ({
      ...previous,
      [id]: Math.max(0, (previous[id] || 0) + (alreadyLiked ? -1 : 1)),
    }))

    try {
      if (alreadyLiked) {
        const { error } = await supabase
          .from('vibra_likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_email', userId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('vibra_likes')
          .insert({
            video_id: videoId,
            user_email: userId,
          })

        if (error) throw error
      }
    } catch (error: any) {
      // Rudisha hali ya awali kama kuhifadhi kumeshindikana.
      setLikedIds(previous =>
        alreadyLiked
          ? [...previous, id]
          : previous.filter(item => item !== id)
      )
      setLikeCounts(previous => ({
        ...previous,
        [id]: Math.max(0, (previous[id] || 0) + (alreadyLiked ? 1 : -1)),
      }))
      alert(error?.message || 'Like haijahifadhiwa. Jaribu tena.')
    } finally {
      setWorkingLike(null)
    }
  }

  const openComments = async (id: number) => {
    setActiveVideo(id)
    setComments([])
    setCommentText('')
    setLoadingComments(true)

    const { data, error } = await supabase
      .from('vibra_comments')
      .select('id,video_id,username,text,created_at')
      .eq('video_id', String(id))
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message || 'Imeshindikana kupakia comments.')
    } else {
      setComments((data || []) as Comment[])
    }

    setLoadingComments(false)
  }

  const addComment = async () => {
    if (!userId || activeVideo === null || !commentText.trim()) return

    setSendingComment(true)

    const newText = commentText.trim()

    const { data, error } = await supabase
      .from('vibra_comments')
      .insert({
        video_id: String(activeVideo),
        user_email: userId,
        username: userHandle,
        avatar: dp || '',
        text: newText,
      })
      .select('id,video_id,username,text,created_at')
      .single()

    if (error) {
      alert(error.message || 'Comment haijahifadhiwa.')
    } else {
      setComments(previous => [data as Comment, ...previous])
      setCommentCounts(previous => ({
        ...previous,
        [activeVideo]: (previous[activeVideo] || 0) + 1,
      }))
      setCommentText('')
    }

    setSendingComment(false)
  }

  const changePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setDp(url)
      localStorage.setItem('vibra_dp', url)
      alert('DP imebadilika! ✅')
    }
    reader.readAsDataURL(file)
  }

  const bottomNav = (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '500px',
      background: '#000',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '14px 0',
      borderTop: '1px solid #222',
      zIndex: 50,
      color: '#fff',
    }}>
      <span onClick={() => setPage('home')} style={{ cursor: 'pointer', fontWeight: page === 'home' ? 800 : 400 }}>🏠 Home</span>
      <span onClick={() => setPage('discover')} style={{ cursor: 'pointer' }}>🔍 Discover</span>
      <span onClick={() => alert('Upload itaongezwa kwenye hatua inayofuata.')} style={{ background: '#fff', color: '#000', padding: '2px 14px', borderRadius: '8px', cursor: 'pointer' }}>➕</span>
      <span onClick={() => setPage('inbox')} style={{ cursor: 'pointer' }}>📥 Inbox</span>
      <span onClick={() => setPage('me')} style={{ cursor: 'pointer', fontWeight: page === 'me' ? 800 : 400 }}>👤 Me</span>
    </div>
  )

  if (!authReady) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#ff2d55', fontSize: '38px' }}>VIBRA</h1>
        <p>Inaunganisha VIBRA WORLDWIDE...</p>
      </div>
    )
  }

  if (authError) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#ff2d55' }}>VIBRA</h1>
        <h3>Imeshindikana kuunganisha akaunti ya muda.</h3>
        <p style={{ color: '#aaa' }}>{authError}</p>
        <p>Hakikisha Anonymous Sign-Ins imewashwa kwenye Supabase Authentication.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 20px', border: 0, borderRadius: '8px' }}>Jaribu tena</button>
      </div>
    )
  }

  // PROFILE
  if (page === 'me') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={() => setPage('home')} style={{ fontSize: '22px', cursor: 'pointer' }}>←</span>
          <b>{userHandle}</b>
          <span>⋯</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <div onClick={() => fileRef.current?.click()} style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '55px', overflow: 'hidden', cursor: 'pointer', border: '3px solid #fff' }}>
            {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <p style={{ color: '#aaa', fontSize: '13px' }}>Bonyeza picha kubadilisha</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={changePhoto} style={{ display: 'none' }} />

          <button onClick={() => fileRef.current?.click()} style={{ background: '#ff2d55', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '25px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', width: '100%', maxWidth: '300px' }}>
            Change DP - Badilisha Picha
          </button>
          <br />
          <button onClick={() => { setDp(''); localStorage.removeItem('vibra_dp') }} style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '10px 20px', borderRadius: '20px', marginTop: '12px', cursor: 'pointer' }}>
            Remove DP
          </button>
        </div>

        <h2 style={{ textAlign: 'center', margin: '22px 0 0' }}>{userName}</h2>
        <p style={{ textAlign: 'center', color: '#aaa', margin: '6px 0' }}>{userHandle} • Mombasa, Kenya</p>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>🔥 VIBRA Creator • Mombasa vibes 🌊</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '20px', textAlign: 'center' }}>
          <div><b>0</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Following</span></div>
          <div><b>0</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Followers</span></div>
          <div><b>{likedIds.length}</b><br /><span style={{ color: '#aaa', fontSize: '13px' }}>Likes</span></div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
          <button onClick={() => alert('Edit Profile itaongezwa baadaye.')} style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700' }}>Edit Profile</button>
          <button onClick={() => navigator.clipboard?.writeText(window.location.href)} style={{ flex: 1, background: '#222', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px' }}>Share Profile</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '24px', borderTop: '1px solid #222', paddingTop: '14px' }}>
          <span>🎬 Videos</span><span style={{ opacity: 0.5 }}>❤️ Liked</span><span style={{ opacity: 0.5 }}>🔖 Saved</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '12px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#222', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', borderRadius: '6px' }}>{v.emoji}</div>
          ))}
        </div>
        {bottomNav}
      </div>
    )
  }

  // DISCOVER
  if (page === 'discover') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '16px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <h2>🔍 Discover</h2>
        <input placeholder="Search VIBRA..." style={{ width: '100%', padding: '12px', borderRadius: '20px', border: 'none', background: '#222', color: '#fff' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          {['#vibra', '#mombasa', '#dance', '#music', '#trending'].map(t => <span key={t} style={{ background: '#222', padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}>{t}</span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '16px' }}>
          {videos.map(v => <div key={v.id} style={{ background: '#222', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', borderRadius: '8px' }}>{v.emoji}</div>)}
        </div>
        {bottomNav}
      </div>
    )
  }

  // INBOX
  if (page === 'inbox') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '16px 16px 90px', maxWidth: '500px', margin: '0 auto' }}>
        <h2>📥 Inbox</h2>
        <p style={{ color: '#aaa' }}>Notifications zako</p>
        <div style={{ background: '#111', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>❤️ VIBRA likes na comments</div>
        <div style={{ background: '#111', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>👤 Karibu VIBRA WORLDWIDE</div>
        {bottomNav}
      </div>
    )
  }

  // HOME FEED
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', position: 'fixed', top: 0, width: '100%', zIndex: 10, maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)' }}>
        <span style={{ fontWeight: '900', fontSize: '24px' }}>VIBRA</span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span style={{ opacity: 0.6 }}>Following</span>
          <span style={{ fontWeight: '700', borderBottom: '2px solid white' }}>For You</span>
        </div>
        <span onClick={() => setPage('discover')} style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</span>
      </div>

      {videos.map(v => (
        <div key={v.id} style={{ height: '100vh', position: 'relative', borderBottom: '1px solid #111' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '90px' }}>{v.emoji}</div>
            <p style={{ opacity: 0.7 }}>VIBRA Video {v.id}</p>
          </div>

          <div style={{ position: 'absolute', right: '12px', bottom: '110px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div onClick={() => { if (v.user === userHandle) setPage('me') }} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', fontSize: '24px' }}>
                {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
              </div>
              {v.user !== userHandle && (
                <div onClick={() => setFollowed(!followed)} style={{ background: followed ? '#555' : '#ff2d55', width: '20px', height: '20px', borderRadius: '50%', margin: '-8px auto 0', fontSize: '13px', cursor: 'pointer' }}>{followed ? '✓' : '+'}</div>
              )}
            </div>

            <div onClick={() => toggleLike(v.id)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px' }}>{likedIds.includes(v.id) ? '❤️' : '🤍'}</div>
              <div style={{ fontSize: '12px' }}>{likeCounts[v.id] || 0}</div>
            </div>

            <div onClick={() => openComments(v.id)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '30px' }}>💬</div>
              <div style={{ fontSize: '12px' }}>{commentCounts[v.id] || 0}</div>
            </div>

            <div onClick={() => navigator.clipboard?.writeText(window.location.href)} style={{ textAlign: 'center', fontSize: '30px', cursor: 'pointer' }}>↗️</div>
          </div>

          <div style={{ position: 'absolute', bottom: '90px', left: '14px', right: '80px' }}>
            <p style={{ fontWeight: '700', margin: 0 }}>{v.user}</p>
            <p style={{ fontSize: '14px', margin: '6px 0' }}>{v.desc}</p>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>🎵 Original sound - {v.user}</p>
          </div>
        </div>
      ))}

      {bottomNav}

      {activeVideo !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', height: '70vh', background: '#171717', borderRadius: '18px 18px 0 0', color: '#fff', display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
              <b>Comments ({comments.length})</b>
              <span onClick={() => setActiveVideo(null)} style={{ fontSize: '24px', cursor: 'pointer' }}>✕</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              {loadingComments ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Inapakia comments...</p>
              ) : comments.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Hakuna comment bado. Kuwa wa kwanza!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} style={{ padding: '10px 0', borderBottom: '1px solid #292929' }}>
                    <b style={{ fontSize: '13px' }}>{comment.username || 'VIBRA User'}</b>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{comment.text}</p>
                    <small style={{ color: '#888' }}>{new Date(comment.created_at).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #333' }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addComment() }}
                placeholder="Andika comment..."
                style={{ flex: 1, minWidth: 0, padding: '12px', borderRadius: '22px', border: '1px solid #444', background: '#292929', color: '#fff' }}
              />
              <button
                onClick={addComment}
                disabled={sendingComment || !commentText.trim()}
                style={{ background: '#ff2d55', color: '#fff', border: 0, borderRadius: '22px', padding: '0 16px', fontWeight: 700 }}
              >
                {sendingComment ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
