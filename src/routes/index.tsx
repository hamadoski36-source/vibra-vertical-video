import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: VibraFinal,
})

function VibraFinal() {
  const [tab, setTab] = useState('home')
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState("")
  const [dp, setDp] = useState("")
  const [myVideoUrl, setMyVideoUrl] = useState<string|null>(null)
  const [myVideoTags, setMyVideoTags] = useState("")
  const [likes, setLikes] = useState([12000,8900,5400,12000,9800,7600,5400,3200])
  const [liked, setLiked] = useState([false,false,false,false,false,false,false,false])
  const videoRef = useRef<HTMLVideoElement|null>(null)

  const baseVideos = [
    { id:1, title:"VIBRA WORLDWIDE 🌍", user:"@MrVibra", poster:"https://picsum.photos/id/1015/720/1280", url:"https://www.w3schools.com/html/mov_bbb.mp4", tags:"#vibra #mombasa #worldwide" },
    { id:2, title:"Mombasa Support 💛", user:"@MrVibra", poster:"https://picsum.photos/id/1016/720/1280", url:"https://www.w3schools.com/html/movie.mp4", tags:"#mombasa #support #vibra" },
    { id:3, title:"Coast Life 🌊", user:"@CoastVibes", poster:"https://picsum.photos/id/1025/720/1280", url:"https://www.w3schools.com/html/mov_bbb.mp4", tags:"#coast #beach #vibra" },
    { id:4, title:"Beach Vibra 🏖️", user:"@BeachBoy", poster:"https://picsum.photos/id/1062/720/1280", url:"https://www.w3schools.com/html/movie.mp4", tags:"#beach #mombasa" },
  ]

  useEffect(()=>{
    const d=localStorage.getItem("vibra_dp"); if(d) setDp(d)
    const handleVis = () => { if(document.hidden && videoRef.current) videoRef.current.pause() }
    document.addEventListener('visibilitychange', handleVis)
    return ()=>document.removeEventListener('visibilitychange', handleVis)
  },[])

  const allVideos = myVideoUrl ? [{id:99, title: caption || "My Video 💛", user:"@MrVibra", poster:myVideoUrl, url:myVideoUrl, tags:myVideoTags}, ...baseVideos] : baseVideos

  // LIKE INAONGEZEKA HALISI
  const handleLike = (idx:number) => {
    const newLiked = [...liked]; const newLikes = [...likes]
    newLiked[idx] = !newLiked[idx]
    if(newLiked[idx]) newLikes[idx] = newLikes[idx] + 1
    else newLikes[idx] = newLikes[idx] - 1
    setLiked(newLiked); setLikes(newLikes)
  }

  const handleUpload = (file:File) => {
    const url = URL.createObjectURL(file)
    setMyVideoUrl(url)
    setMyVideoTags(tags)
    setCurrentIdx(0)
    setTab('home')
    alert(`✅ Video uploaded!\nCaption: ${caption}\nTags: ${tags}\nSasa inaonekana Home!`)
  }

  // SHARE NA WHATSAPP HALISI
  const ShareModal = () => (
    <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-end'}} onClick={()=>setShowShare(false)}>
      <div style={{background:'#1a1a1a',width:'100%',borderRadius:'15px 15px 0 0',padding:'20px'}} onClick={e=>e.stopPropagation()}>
        <div style
