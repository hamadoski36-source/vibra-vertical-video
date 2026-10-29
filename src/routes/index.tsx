// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
export const Route = createFileRoute('/')({ component: VibraFinal })
function VibraFinal() {
  const [clips, setClips] = useState([])
  const [likesMap, setLikesMap] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [following, setFollowing] = useState(new Set())
  const [mySaves, setMySaves] = useState(new Set())
  const [activeClip, setActiveClip] = useState(null)
  const [showPage, setShowPage] = useState('home')
  const [tab, setTab] = useState('foryou')
  const [isMuted, setIsMuted] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [showCaption, setShowCaption] = useState(false)
  const [captionText, setCaptionText] = useState('😂 #viral #vibra #comedy 🔥 #fyp')
  const [pendingFile, setPendingFile] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showLyrics, setShowLyrics] = useState(false)
  const [meTab, setMeTab] = useState('videos')
  const [selectedFromMe, setSelectedFromMe] = useState(null)
  const [isFollowingMe, setIsFollowingMe] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [showAdContact, setShowAdContact] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [dataSaver, setDataSaver] = useState(true)
  const [downloaded, setDownloaded] = useState(new Set())
  const fileRef = useRef(null)
  const videoRefs = useRef(new Map())
  const meVideoRef = useRef(null)
  const myFollowers = 250800
  const isVerified = myFollowers >= 100000
  const myEarnings = 4850
  const MY_MPESA = "0740805970"
  const MY_PAYPAL = "vibra.worldwide@gmail.com"
  const MY_MTN = "+256 740 805970"

  useEffect(()=>{
    const stopAll = () => { videoRefs.current.forEach(v=>{ try{ v.pause(); }catch{} }); if(meVideoRef.current) try{ meVideoRef.current.pause() }catch{} }
    const handleVis = () => { if(document.hidden) stopAll() }
    document.addEventListener('visibilitychange', handleVis)
    window.addEventListener('blur', ()=>stopAll())
    return ()=>{ document.removeEventListener('visibilitychange', handleVis); stopAll() }
  }, [])

  useEffect(()=>{ load() }, [])
  async function load(){
    const {data} = await supabase.from('clips').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){
      setClips(data.map(x=>({id:x.id, url:x.url||x.video_url, username:'vibra_boy', caption:x.caption||'Familia yangu 😂', views: Math.floor(Math.random()*800000+100000), pinned:false})))
    } else {
      setClips([
        {id:'1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'Familia yangu 😂 - Data Saver ON 🔋 Worldwide', views:254100, pinned:true},
        {id:'2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Togethar forever ❤️', views:412800, pinned:true},
        {id:'3', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption:'SHOUT OUT TO MY BABY', views:756800, pinned:true},
        {id:'4', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption:'2025 challenge', views:554900},
        {id:'5', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption:'IMEMRCHS FEAT. D VOICE', views:451100},
        {id:'6', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption:'Love story', views:268700},
      ])
    }
  }

  useEffect(()=>{
    if(showPage!=='home' || activeClip || showCaption || selectedFromMe || isLive) return
    const obs=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v){ videoRefs.current.forEach((vv,k)=>{ if(k!==id){ try{ vv.pause(); }catch{} } }); if(!dataSaver){ try{ v.muted=isMuted; v.play().catch(()=>{}) }catch{} } } } else { const id=e.target.getAttribute('data-id'); const v=videoRefs.current.get(id); if(v) try{ v.pause() }catch{} } }) },{threshold:0.7})
    document.querySelectorAll('[data-id]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect()
  }, [clips, showPage, isMuted, showCaption, activeClip, selectedFromMe, isLive, dataSaver])

  async function doUpload(){
    if(!pendingFile) return
    setUploading(true); setUploadPct(80)
    const localUrl = URL.createObjectURL(pendingFile)
    const newClip = {id:Date.now().toString(), url:localUrl, username:'vibra_boy', caption:captionText, views:1, pinned:false}
    setClips(p=>[newClip, ...p])
    setUploadPct(100)
    setTimeout(()=>{ setUploading(false); setShowCaption(false); setPendingFile(null); setUploadPct(0); setShowPage('me') }, 600)
  }

  const toggleLike = (id)=>{ setMyLikes(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }); setLikesMap(m=>({...m, [id]:(m[id]||0)+(myLikes.has(id)?-1:1)})) }
  const toggleFollow = (user)=>{ setFollowing(s=>{ const n=new Set(s); if(n.has(user)) n.delete(user); else n.add(user); return n }) }
  const toggleSave = (id)=>{ setMySaves(s=>{ const n=new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n }) }
  const handleShare = async (clip) => {
    if(navigator.share){ try{ await navigator.share({title:'Vibra', text:clip.caption, url:window.location.href}) }catch{} } else { navigator.clipboard.writeText(window.location.href); alert('Link copied! 🔗') }
  }
  const filtered = clips.filter(c=>{
    if(searchQ) return c.caption.toLowerCase().includes(searchQ.toLowerCase()) || c.username.toLowerCase().includes(searchQ.toLowerCase())
    if(tab==='following') return following.has(c.username)
    return true
  })
  const fmt = (n)=> n>=1000000 ? (n/1000000).toFixed(1)+'M' : n>=1000 ? (n/1000).toFixed(1)+'K' : n.toString()

  const AdCard = ({index}:{index:number}) => (
    <div data-id={`ad-${index}`} className="h-screen w-full snap-start relative bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-[24px] p-5 w-full max-w-[320px] text-black text-center shadow-2xl">
        <p className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full inline-block mb-2">📢 WORLDWIDE AD • DATA SAVER OK</p>
        <p className="text-[20px] font-black">🔥 BIASHARA YAKO HAPA!</p>
        <p className="text-[11px] mt-1 font-bold text-zinc-600">{dataSaver?'🔋 Data Saver Mode - 70% less data! Worldwide!':''}</p>
        <div className="bg-zinc-100 rounded-xl p-3 mt-3 text-left">
          <p className="text-[11px] font-bold">🇰🇪 1K KES / 🌍 $10 / day</p>
          <p className="text-[10px] text-zinc-600 mt-1">Watu wana-save data na Vibra!</p>
        </div>
        <button onClick={()=>setShowAdContact(true)} className="w-full bg-[#FE2C55] text-white py-3 rounded-full font-black mt-3 text-[13px]">TANGAZA SASA WORLDWIDE 🌍</button>
        <p className="text-[9px] text-zinc-400 mt-2">M-Pesa: {MY_MPESA} • PayPal: {MY_PAYPAL}</p>
      </div>
      <button onClick={()=>{ const el=document.querySelector(`[data-id="${filtered[index+1]?.id}"]`); el?.scrollIntoView({behavior:'smooth'}) }} className="absolute bottom-24 bg-black/60 text-white px-4 py-2 rounded-full text-[11px] font-bold">Skip Ad ⏭️</button>
    </div>
  )

  return (
    <div className="h-screen bg-black relative overflow-hidden text-white">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e)=>{
        const f=e.target.files?.[0]; if(!f) return
        if(f.size > 15*1024*1024){ alert('❌ <15MB tu'); e.target.value=''; return }
        setPendingFile(f); setCaptionText('😂 #viral #vibra #comedy 🔥 #fyp'); setShowCaption(true)
      }} />

      {showAdContact && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-5 w-full max-w-[380px] text-black max-h-[92vh] overflow-y-auto">
            <p className="font-black text-[19px]">🌍 Tangaza Worldwide! 🔋</p>
            <p className="text-[11px] text-zinc-600 mt-1">Data Saver ON = Watu 2M+ wanaona ad yako!</p>
            <div className="mt-4 space-y-3">
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3">
                <p className="font-black text-[11px] text-green-700">🇰🇪 KENYA - M-PESA</p>
                <p className="text-[18px] font-black text-green-600">{MY_MPESA}</p>
                <p className="text-[11px]">✅ 1K KES / day • 🔋 70% data saved!</p>
                <a href={`https://wa.me/254${MY_MPESA.substring(1)}?text=Ad%20Kenya`} className="block w-full bg-green-600 text-white py-2.5 rounded-full font-bold mt-2 text-center text-[11px]">Lipa M-Pesa Kenya 💬</a>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-3">
                <p className="font-black text-[11px]">🇺🇬🇹🇿 UGANDA / TZ</p>
                <p className="text-[11px] font-bold">MTN: {MY_MTN}</p>
                <p className="text-[11px]">✅ 40K UGX / day • 🔋 Data Saver Worldwide!</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-3">
                <p className="font-black text-[11px] text-blue-700">🌍 WORLDWIDE - PAYPAL / CARD</p>
                <p className="text-[11px] font-bold">PayPal: {MY_PAYPAL}</p>
                <p className="text-[11px]">✅ $10 / day • $5 banner</p>
                <p className="text-[9px] font-bold text-blue-700">🔋 Data Saver - 70% less data worldwide!</p>
                <a href="https://paypal.me/vibraads" target="_blank" className="block w-full bg-blue-600 text-white py-2.5 rounded-full font-bold mt-2 text-center text-[11px]">PayPal Worldwide 💳</a>
              </div>
            </div>
            <button onClick={()=>setShowAdContact(false)} className="w-full bg-zinc-200 py-3 rounded-full font-bold mt-3">Funga Close</button>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] text-black">
            <p className="font-black text-[18px]">Withdraw Pesa! 💰</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-[12px] text-zinc-500">Balance</p>
              <p className="text-[28px] font-black">KES {myEarnings.toLocaleString()} / ${ (myEarnings/130).toFixed(2)}</p>
              <p className="text-[11px] text-green-600 font-bold">✓ 100K Verified ✅</p>
            </div>
            <button onClick={()=>{alert(`KES ${myEarnings} imetumwa kwa ${MY_MPESA} ✅`); setShowWithdraw(false)}} className="w-full bg-black text-white py-3.5 rounded-full font-bold mt-4">Withdraw M-Pesa 📲</button>
            <button onClick={()=>setShowWithdraw(false)} className="w-full bg-zinc-100 py-3 rounded-full font-bold mt-2">Funga</button>
          </div>
        </div>
      )}

      {showCaption && (
        <div className="absolute inset-0 bg-black/90 z-[70] flex flex-col justify-end p-3">
          <div className="bg-zinc-900 rounded-[24px] p-5 border border-zinc-700">
            <p className="font-bold text-white">Add Caption {uploading?`(${uploadPct}%)`:''}</p>
            <textarea value={captionText} onChange={e=>setCaptionText(e.target.value)} disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl mt-3 h-24 outline-none border-2 border-pink-500" />
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{ setUploading(false); setShowCaption(false); setPendingFile(null)}} className="flex-1 bg-zinc-700 py-3.5 rounded-full font-bold text-white">Cancel</button>
              <button disabled={uploading} onClick={doUpload} className="flex-1 py-3.5 rounded-full font-black text-white bg-[#FE2C55] border-2 border-white">POST 🔥</button>
            </div>
          </div>
        </div>
      )}

      {isLive && (
        <div className="absolute inset-0 bg-black z-[90] flex flex-col">
          <div className="flex items-center justify-between p-3 bg-black/80"><button onClick={()=>setIsLive(false)} className="text-white text-xl">←</button><span className="bg-[#FE2C55] px-2 py-1 rounded text-[10px] font-bold animate-pulse">● LIVE</span><span className="text-white">⋮</span></div>
          <div className="flex-1 bg-zinc-900 flex items-center justify-center flex-col"><p className="text-6xl">🔴</p><p className="text-white font-bold mt-4 text-xl">@vibra-boy LIVE ✅</p><button onClick={()=>setIsLive(false)} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold">End LIVE</button></div>
        </div>
      )}

      {showPage==='home' && !isLive && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-800/80 rounded-full px-3 py-1.5 flex items-center gap-2 border border-zinc-700"><span className="text-[12px]">🔍</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search" className="bg-transparent text-[12px] outline-none flex-1 text-white" /></div>
              <button onClick={()=>setDataSaver(!dataSaver)} className={`px-3 py-1.5 rounded-full text-[10px] font-black border-2 ${dataSaver?'bg-green-500 text-white border-white':'bg-zinc-800 text-zinc-400 border-zinc-600'}`}>{dataSaver?'🔋 ON':'🔋 OFF'}</button>
              <button onClick={()=>setIsLive(true)} className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FE2C55] animate-pulse border border-white">LIVE</button>
            </div>
            <div className="flex justify-center gap-4 mt-2 items-center"><button onClick={()=>setTab('following')} className={`text-[13px] font-bold ${tab==='following'?'text-white border-b-2 border-white':'text-zinc-400'}`}>Following</button><button onClick={()=>setTab('foryou')} className={`text-[13px] font-bold ${tab==='foryou'?'text-white border-b-2 border-white':'text-zinc-400'}`}>For You</button>{dataSaver && <span className="text-[9px] bg-green-500 px-2 py-0.5 rounded-full font-bold">70% SAVED WORLDWIDE</span>}</div>
          </div>

          {filtered.map((c, idx)=>(
            <>
              <div key={c.id} data-id={c.id} className="h-screen w-full snap-start relative bg-black">
                <video ref={el=>{if(el) videoRefs.current.set(c.id, el)}} src={c.url} loop playsInline muted={isMuted} preload={dataSaver?'metadata':'auto'} poster="" onClick={()=>{ const v=videoRefs.current.get(c.id); if(v){ if(v.paused) v.play().catch(()=>{}); else v.pause()} }} className="h-full w-full object-cover" />
                <button onClick={()=>setIsMuted(!isMuted)} className="absolute top-[95px] left-3 bg-black/60 px-3 py-1 rounded-full text-[11px] border border-white/20 font-bold z-20 text-white">{isMuted?'🔇 Tap to unmute':'🔊 Sound'}</button>
                {dataSaver && <div className="absolute top-[95px] right-3 bg-green-500 px-2 py-1 rounded-full text-[9px] font-black z-20">🔋 LOW DATA WORLDWIDE</div>}
                <div className="absolute bottom-24 left-3 right-20 z-20"><p className="font-bold text-[15px] text-white">@vibra-boy {isVerified && '✅'}</p><p className="text-[13px] mt-1 text-white">{c.caption}</p><div className="flex gap-2 mt-2"><button onClick={()=>{ setDownloaded(s=>{const n=new Set(s); n.add(c.id); return n}); alert('✅ Downloaded! Watch offline bila data! Worldwide!')}} className={`text-[10px] px-3 py-1 rounded-full font-bold border ${downloaded.has(c.id)?'bg-green-500 border-green-300':'bg-black/60 border-white/30'}`}>{downloaded.has(c.id)?'✓ Downloaded':'⬇ Download'}</button>{dataSaver && <span className="text-[9px] bg-black/60 px-2 py-1 rounded-full border">0.8MB vs 3.5MB saved!</span>}</div></div>
                <div className="absolute bottom-20 right-3 flex flex-col items-center gap-3 z-20">
                  <button onClick={()=>toggleFollow(c.username)} className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center font-bold text-[12px] text-white">{following.has(c.username)?'✓':'+'}</button>
                  <button onClick={()=>toggleLike(c.id)} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${myLikes.has(c.id)?'bg-[#FE2C55]':'bg-zinc-700/80'}`}>❤️</div><span className="text-[10px] font-bold mt-1 text-white">{fmt(likesMap[c.id]||c.views)}</span></button>
                  <button onClick={()=>{setActiveClip(c);}} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg">💬</div><span className="text-[10px] font-bold mt-1 text-white">12</span></button>
                  <button onClick={()=>toggleSave(c.id)} className="flex flex-col items-center"><div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg border ${mySaves.has(c.id)?'bg-yellow-500 border-yellow-300':'bg-zinc-700/80 border-zinc-600'}`}>🔖</div><span className="text-[9px] font-bold mt-1 text-white">{mySaves.has(c.id)?'Saved':'Save'}</span></button>
                  <button onClick={()=>handleShare(c)} className="flex flex-col items-center"><div className="w-11 h-11 rounded-full bg-zinc-700/80 flex items-center justify-center text-lg border border-zinc-600">↗️</div><span className="text-[10px] font-bold mt-1 text-white">Share</span></button>
                </div>
              </div>
              {(idx+1)%3===0 && <AdCard key={`ad-${idx}`} index={idx} />}
            </>
          ))}
        </div>
      )}

      {showPage==='me' && !showCaption && !activeClip && !selectedFromMe && (
        <div className="absolute inset-0 bg-white text-black z-30 overflow-y-auto pb-20">
          <div className="flex items-center justify-between p-3 pt-2"><button onClick={()=>setShowPage('home')} className="text-2xl">←</button><p className="font-bold text-[16px]">@vibra-boy {isVerified && '✅'}</p><button onClick={()=>setDataSaver(!dataSaver)} className={`text-[10px] px-3 py-1 rounded-full font-black border ${dataSaver?'bg-green-500 text-white':'bg-zinc-200'}`}>{dataSaver?'🔋 SAVER ON WORLDWIDE':'🔋 OFF'}</button></div>
          {isVerified && <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-1.5 text-[11px] font-bold">🌟 VIBRA STAR • 100K+ • Worldwide + Data Saver 🔋</div>}
          {dataSaver && <div className="bg-green-50 border border-green-200 text-center py-2 text-[11px] font-bold text-green-700">🔋 Data Saver ON Worldwide - Unasave 70% data! 1GB = 100+ videos (badala ya 30)</div>}
          <div className="flex justify-center gap-6 mt-2"><button className="text-center"><p className="font-black text-[16px]">10K</p><p className="text-[11px] text-zinc-500">Following</p></button><button className="text-center border-l pl-6"><p className="font-black text-[16px]">{fmt(myFollowers)}</p><p className="text-[11px] text-zinc-500">Followers</p></button><button className="text-center border-l pl-6"><p className="font-black text-[16px]">2.0M</p><p className="text-[11px] text-zinc-500">Likes</p></button></div>
          <div className="flex justify-center gap-2 mt-3 px-4"><button onClick={()=>setIsFollowingMe(!isFollowingMe)} className={`flex-1 py-2 rounded-[6px] font-bold text-[14px] ${isFollowingMe?'bg-zinc-200 text-black':'bg-[#FE2C55] text-white'}`}>{isFollowingMe?'Following ✓':'Follow'}</button><button onClick={()=>setShowWithdraw(true)} className="flex-1 bg-black text-white py-2 rounded-[6px] font-bold text-[12px]">💰 KES {myEarnings}</button></div>
          <div className="px-4 mt-3 grid grid-cols-3 gap-2">
            <div className="bg-zinc-100 rounded-xl p-2"><p className="text-[9px] text-zinc-500">M-Pesa</p><p className="font-black text-[11px]">{MY_MPESA}</p></div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2"><p className="text-[9px]">PayPal</p><p className="font-black text-[10px]">{MY_PAYPAL}</p></div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-2"><p className="text-[9px]">Data Saved</p><p className="font-black text-[11px] text-green-600">70% 🔋</p></div>
          </div>
          <div className="grid grid-cols-3 gap-[1px] bg-white mt-3">{clips.map(c=>(<div key={c.id} onClick={()=>setSelectedFromMe(c)} className="aspect-[4/5] bg-black relative"><video src={c.url} className="w-full h-full object-cover" muted /><div className="absolute top-1 left-1 bg-green-500 text-[8px] px-1 rounded font-bold text-white">{downloaded.has(c.id)?'⬇':'🔋'}</div></div>))}</div>
        </div>
      )}

      {selectedFromMe && (
        <div className="absolute inset-0 bg-black z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 pt-2 text-white bg-black/80 absolute top-0 left-0 right-0 z-10"><button onClick={()=>{ try{meVideoRef.current?.pause()}catch{}; setSelectedFromMe(null)}} className="text-xl">←</button><p className="font-bold text-[14px]">@vibra-boy ✅</p><p>⋮</p></div>
          <div className="flex-1 relative bg-black"><video ref={meVideoRef} src={selectedFromMe.url} autoPlay loop playsInline muted={isMuted} className="h-full w-full object-contain bg-black" /></div>
        </div>
      )}

      {activeClip && (<div className="absolute inset-0 bg-black/90 z-[80] flex flex-col justify-end"><div className="bg-zinc-900 rounded-t-[20px] h-[65%] p-4"><div className="flex justify-between"><p className="font-bold text-white">Comments</p><button onClick={()=>setActiveClip(null)} className="text-white">✕</button></div></div></div>)}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 text-[10px] h-[60px] items-center z-40">
        <button onClick={()=>{setActiveClip(null); setSelectedFromMe(null); setShowPage('home')}} className={`flex flex-col items-center ${showPage==='home'?'text-white font-bold':'text-zinc-400'}`}>🏠 Home</button>
        <button onClick={()=>setShowPage('explore')} className={`flex flex-col items-center ${showPage==='explore'?'text-white font-bold':'text-zinc-400'}`}>🔍 Explore</button>
        <button onClick={()=>fileRef.current?.click()} style={{background:'white', color:'black', width:'64px', height:'36px', borderRadius:'12px', fontWeight:'900', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
        <button onClick={()=>setShowPage('inbox')} className={`flex flex-col items-center ${showPage==='inbox'?'text-white font-bold':'text-zinc-400'}`}>📩 Inbox</button>
        <button onClick={()=>{setActiveClip(null); setShowPage('me')}} className={`flex flex-col items-center ${showPage==='me'?'text-white font-bold':'text-zinc-400'}`}>V Me</button>
      </div>
    </div>
  )
}
