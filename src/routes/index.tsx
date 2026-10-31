import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraReal })

function VibraReal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [muted,setMuted]=useState(true)
  const [hasInteracted,setHasInteracted]=useState(false)
  const [tab,setTab]=useState('home')
  const [progress,setProgress]=useState(0)
  const [username,setUsername]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')
  const [myVideos,setMyVideos]=useState<string[]>(()=> JSON.parse(localStorage.getItem('vibra_real_videos')||'[]').filter((s:string)=> s.startsWith('data:video')))
  const [ads,setAds]=useState<any[]>(()=> JSON.parse(localStorage.getItem('vibra_real_ads')||'[]').filter((a:any)=> a.video?.startsWith('data:video')))
  const [showUpload,setShowUpload]=useState(false)
  const [showAdUpload,setShowAdUpload]=useState(false)
  const [adTitle,setAdTitle]=useState('')
  const [adLink,setAdLink]=useState('')
  const [adBusiness,setAdBusiness]=useState('')

  const all = myVideos.length>0 ? myVideos : []
  const isAdPosition = myVideos.length>0 && (idx+1)%6===0 && ads.length>0
  const adIndex = Math.floor(idx/6) % (ads.length||1)
  const currentAd = ads[adIndex]
  const currentSrc = isAdPosition ? currentAd?.video : all[idx % (all.length||1)]
  const safeIdx = idx % (all.length||1)

  useEffect(()=>{
    const v=videoRef.current; if(!v || !currentSrc) return
    const onTime=()=> setProgress((v.currentTime/(v.duration||1))*100)
    const onEnd=()=> setIdx(i=> (i+1)%(all.length||1))
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('ended', onEnd)
    v.muted = !hasInteracted
    setMuted(!hasInteracted)
    v.load()
    v.play().catch(()=>{})
    return ()=> { v.removeEventListener('timeupdate', onTime); v.removeEventListener('ended', onEnd) }
  }, [safeIdx, hasInteracted, isAdPosition, currentSrc])

  useEffect(()=>{
    const onWheel=(e:WheelEvent)=>{ if(Math.abs(e.deltaY)>10){ e.preventDefault(); e.deltaY>0?setIdx(i=> (i+1)%(all.length||1)):setIdx(i=> (i-1+all.length)%all.length) } }
    window.addEventListener('wheel', onWheel, {passive:false})
    return ()=> window.removeEventListener('wheel', onWheel)
  }, [all.length])

  const next=()=> { if(all.length===0) return; setIdx(i=> (i+1)%all.length) }
  const prev=()=> { if(all.length===0) return; setIdx(i=> (i-1+all.length)%all.length) }
  const handleSound=()=>{
    if(!hasInteracted){ setHasInteracted(true); setMuted(false); if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play() } }
    else { setMuted(!muted); if(videoRef.current) videoRef.current.muted=!videoRef.current.muted }
  }

  const handleVideoFile=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    if(file.size>20*1024*1024){ alert('Video kubwa! Chagua chini ya 20MB'); return }
    const r=new FileReader()
    r.onload=()=>{ const b64=r.result as string; const nl=[b64, ...myVideos].slice(0,20); setMyVideos(nl); localStorage.setItem('vibra_real_videos', JSON.stringify(nl)); setShowUpload(false); setIdx(0) }
    r.readAsDataURL(file)
  }

  const handleAdFile=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    if(!adTitle || !adBusiness){ alert('Jaza jina la biashara na maelezo kwanza!'); return }
    if(file.size>20*1024*1024){ alert('Ad video kubwa! Chini ya 20MB'); return }
    const r=new FileReader()
    r.onload=()=>{
      const b64=r.result as string
      const newAd={ video:b64, title:adTitle, business:adBusiness, link:adLink, date:new Date().toLocaleDateString(), views:0 }
      const nl=[newAd, ...ads].slice(0,10)
      setAds(nl); localStorage.setItem('vibra_real_ads', JSON.stringify(nl))
      setAdTitle(''); setAdBusiness(''); setAdLink(''); setShowAdUpload(false)
      alert(`Ad ya ${newAd.business} imewekwa! Itaonekana kila video ya 6!`)
    }
    r.readAsDataURL(file)
  }

  const onSeek=(e:any)=>{ const p=Number(e.target.value); setProgress(p); if(videoRef.current?.duration) videoRef.current.currentTime=(p/100)*videoRef.current.duration }

  if(all.length===0) return <div style={{background:'black', minHeight:'100dvh', color:'white', padding:20}}><h2 style={{fontWeight:900}}>VIBRA - YA KWELI, HAKUNA DEMO</h2><div style={{marginTop:20, background:'#111', padding:20, borderRadius:12}}><b>Karibu {username}</b><div style={{color:'#aaa', marginTop:8, fontSize:14}}>Hakuna video za demo tena. Upload video zako 4 za kwanza ndio app ianze.</div><button onClick={()=> setShowUpload(true)} style={{marginTop:16, background:'#ff3040', color:'white', border:'none', padding:'14px 24px', borderRadius:8, fontWeight:'bold', width:'100%'}}>📤 UPLOAD VIDEO YAKO YA KWANZA (Ya Kweli)</button><div style={{marginTop:20, background:'#1a1a1a', padding:14, borderRadius:8}}><b style={{color:'#ffcc00'}}>💰 Jinsi ya kutengeneza pesa na Ads za kweli:</b><div style={{fontSize:12, marginTop:6, lineHeight:1.6}}>1. Upload video zako<br/>2. Nenda "Biashara Yangu" → Upload Ad ya mteja (salon, duka)<br/>3. Mteja akilipa 500 via M-Pesa, una-upload ad yake<br/>4. Ad yake inaonekana kila ya 6 kama TikTok - pesa ni yako 100%!</div></div></div><BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload} hasVideos={myVideos.length} adsCount={ads.length}/>{showUpload && <UploadReal file={handleVideoFile} setUp={setShowUpload}/>}</div>

  return (
    <div style={{position:'fixed', inset:0, background:'black', width:'100vw', height:'100dvh', overflow:'hidden'}}
      onTouchStart={e=> (e.currentTarget as any)._y=e.touches[0].clientY}
      onTouchEnd={e=>{ const dy=(e.currentTarget as any)._y - e.changedTouches[0].clientY; if(Math.abs(dy)>50) dy>0?next():prev() }}>
      <video ref={videoRef} key={`${safeIdx}-${isAdPosition}`} autoPlay playsInline loop={!isAdPosition} style={{width:'100%', height:'100%', objectFit:'cover'}} src={currentSrc} onClick={handleSound}/>
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', zIndex:10, background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}><b style={{color:'white', fontSize:19}}>VIBRA</b><span style={{color:'white', fontSize:12, borderBottom:'2px solid white'}}>{isAdPosition?'📢 AD YA KWELI':'For You'} • {safeIdx+1}/{all.length} {hasInteracted?'🔊':'🔇'}</span><span onClick={()=> setTab('me')} style={{color:'white'}}>👤</span></div>

      {isAdPosition && currentAd && <div style={{position:'absolute', top:48, left:12, right:12, background:'#ffcc00', color:'black', padding:'10px 12px', borderRadius:10, zIndex:10}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><div><div style={{fontWeight:900, fontSize:13}}>📢 {currentAd.business} - AD YA KWELI</div><div style={{fontSize:11, marginTop:2}}>{currentAd.title}</div></div><span onClick={next} style={{background:'black', color:'white', padding:'6px 12px', borderRadius:20, fontSize:12, cursor:'pointer'}}>Skip Ad ✕</span></div>
        <div style={{marginTop:8, display:'flex', gap:6}}><button onClick={()=> window.open(currentAd.link || `https://wa.me/254700000000?text=Nimeona Ad yako VIBRA - ${currentAd.business}`,'_blank')} style={{background:'#25D366', color:'white', border:'none', padding:'8px 16px', borderRadius:20, fontWeight:'bold', fontSize:12}}>💬 WhatsApp Biashara</button><button onClick={()=> window.open(currentAd.link||'#','_blank')} style={{background:'white', color:'black', border:'none', padding:'8px 16px', borderRadius:20, fontSize:12}}>Tembelea</button></div>
      </div>}

      {!isAdPosition && <div style={{position:'absolute', bottom:115, left:12, right:12, color:'white', zIndex:10}}><div style={{fontWeight:'bold'}}>{username} • Video {safeIdx+1} {hasInteracted?'🔊':'🔇 Tap for sound'}</div><div style={{fontSize:12, opacity:0.8, marginTop:4}}>Swipe up/down • ⏮️ ⏭️</div></div>}

      <div style={{position:'absolute', bottom:68, left:0, right:0, padding:'0 10px', zIndex:20, display:'flex', alignItems:'center', gap:8}}><span onClick={prev} style={{color:'white', fontSize:20, cursor:'pointer'}}>⏮️</span><input type="range" min={0} max={100} value={progress} onChange={onSeek} style={{flex:1, accentColor: isAdPosition?'#ffcc00':'white', height:4}}/><span onClick={next} style={{color:'white', fontSize:20, cursor:'pointer'}}>⏭️</span></div>

      {showUpload && <UploadReal file={handleVideoFile} setUp={setShowUpload}/>}
      {showAdUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:100, padding:20, color:'white', overflowY:'auto'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>💰 WEKA AD YA KWELI (Mteja Amelipa)</h3><span onClick={()=> setShowAdUpload(false)} style={{fontSize:26, cursor:'pointer'}}>✕</span></div><div style={{marginTop:16}}><div style={{fontSize:13, fontWeight:'bold'}}>Jina la Biashara (mfano: Salon Faraja)*</div><input value={adBusiness} onChange={e=> setAdBusiness(e.target.value)} placeholder="Salon Faraja Bamburi" style={{width:'100%', background:'#222', border:'1px solid #ffcc00', padding:12, borderRadius:8, color:'white', marginTop:6}}/></div><div style={{marginTop:12}}><div style={{fontSize:13, fontWeight:'bold'}}>Maelezo ya Ad (mfano: Ofa ya nywele 500 bob)*</div><input value={adTitle} onChange={e=> setAdTitle(e.target.value)} placeholder="Ofa - Nywele zote 500 bob leo!" style={{width:'100%', background:'#222', border:'1px solid #333', padding:12, borderRadius:8, color:'white', marginTop:6}}/></div><div style={{marginTop:12}}><div style={{fontSize:13, fontWeight:'bold'}}>Link ya WhatsApp / Website ya mteja</div><input value={adLink} onChange={e=> setAdLink(e.target.value)} placeholder="https://wa.me/2547... au https://..." style={{width:'100%', background:'#222', border:'1px solid #333', padding:12, borderRadius:8, color:'white', marginTop:6}}/></div><div style={{marginTop:16, border:'2px dashed #ffcc00', borderRadius:12, padding:20, textAlign:'center', background:'#111'}}><div style={{fontWeight:'bold', color:'#ffcc00'}}>📹 Video ya Ad ya Mteja</div><input type="file" accept="video/*" onChange={handleAdFile} style={{marginTop:12, width:'100%', background:'#222', padding:12, borderRadius:8}}/><div style={{fontSize:11, color:'#aaa', marginTop:8}}>Mteja akikulipa M-Pesa 500, upload video yake hapa. Itaonekana kila video ya 6 kwa watu wote!</div></div><div style={{marginTop:16, background:'#1a1a1a', padding:12, borderRadius:8}}><b>Mfano wa kazi:</b><div style={{fontSize:12, marginTop:4}}>Salon Faraja inakulipa 500 → Una-upload video yao ya nywele → Watu 100 wakiona VIBRA, 16 wataona Ad yake → Ana-pata wateja → Kesho anakulipa tena 500!</div></div></div>}

      <BottomNav tab={tab} setTab={setTab} setShowUpload={setShowUpload} setShowAdUpload={setShowAdUpload} hasVideos={myVideos.length} adsCount={ads.length}/>
      {!hasInteracted && <div onClick={handleSound} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.8)', color:'white', padding:'16px 24px', borderRadius:24, zIndex:15, cursor:'pointer', textAlign:'center'}}><div style={{fontSize:28}}>🔊</div><div style={{fontWeight:'bold', marginTop:6}}>Bonyeza mara moja kwa sauti</div><div style={{fontSize:11, opacity:0.8, marginTop:4}}>Baada ya hapo sauti itaendelea video zote!</div></div>}
    </div>
  )
}
function UploadReal({file,setUp}: any){
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:100, padding:20, color:'white'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3>📤 Upload Video Yako (Ya Kweli, Sio Demo)</h3><span onClick={()=> setUp(false)} style={{fontSize:26, cursor:'pointer'}}>✕</span></div><div style={{marginTop:20, border:'2px dashed #ff3040', borderRadius:12, padding:30, textAlign:'center', background:'#111'}}><div>Chagua video yako ya kweli kutoka simu</div><input type="file" accept="video/*" onChange={file} style={{marginTop:14, width:'100%', background:'#222', padding:12, borderRadius:8}}/><div style={{fontSize:11, color:'#aaa', marginTop:10}}>Max 20MB, itasave moja kwa moja, haipotei tena!</div></div></div>
}
function BottomNav({tab,setTab,setShowUpload,setShowAdUpload,hasVideos,adsCount}: any){
  const goMe=()=>{ setTab('me'); if(tab==='me') window.location.reload() }
  if(tab==='me') return <div style={{position:'fixed', inset:0, background:'black', color:'white', zIndex:60, overflowY:'auto', paddingBottom:80}}><div style={{padding:16, display:'flex', justifyContent:'space-between'}}><b onClick={()=> setTab('home')} style={{cursor:'pointer'}}>← VIBRA</b><b>YA KWELI</b></div><div style={{padding:20}}><div style={{background:'#111', padding:16, borderRadius:12}}><b>📊 Takwimu za Kweli</b><div style={{marginTop:10, fontSize:14}}>Video zako: {hasVideos}</div><div style={{fontSize:14}}>Ads za wateja: {adsCount}</div><div style={{fontSize:14, color:'#ffcc00'}}>Pesa: {adsCount*500} bob (kama kila Ad 500)</div></div><button onClick={()=> setShowUpload(true)} style={{marginTop:16, width:'100%', background:'#ff3040', color:'white', border:'none', padding:'14px', borderRadius:10, fontWeight:'bold'}}>📤 Upload Video Yako</button><button onClick={()=> setShowAdUpload(true)} style={{marginTop:10, width:'100%', background:'#ffcc00', color:'black', border:'none', padding:'14px', borderRadius:10, fontWeight:'bold'}}>💰 Weka AD ya Mteja Amelipa (Ya Kweli)</button><div style={{marginTop:16, background:'#1a1a1a', padding:14, borderRadius:10}}><b style={{color:'#ffcc00'}}>Jinsi ya kupata pesa KESHO:</b><div style={{fontSize:12, marginTop:8, lineHeight:1.7}}>1. Tembea Bamburi - Salon, Duka la nguo<br/>2. Waambie: "Nina app VIBRA, watu 200 wanaiona"<br/>3. "Nikikuekea video yako kama Ad, utanilipa 500 kwa siku"<br/>4. Akikubali, chukua M-Pesa, kisha bonyeza "Weka AD ya Mteja" hapa<br/>5. Upload video yake - Kesho akiona wateja, atakulipa tena!<br/><br/>Hii si demo - hii ni biashara yako ya kweli kama TikTok!</div></div><button onClick={()=> {if(confirm('Futa video zote?')){localStorage.removeItem('vibra_real_videos'); localStorage.removeItem('vibra_real_ads'); window.location.reload()}}} style={{marginTop:16, width:'100%', background:'#222', color:'#aaa', border:'none', padding:'12px', borderRadius:8, fontSize:12}}>Futa Zote (Anza Upya)</button></div><div style={{position:'fixed', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}><div onClick={()=> setTab('home')} style={{textAlign:'center', cursor:'pointer'}}><div>🏠</div><div style={{fontSize:10}}>Home</div></div><div style={{textAlign:'center', color:'white'}}><div>👤</div><div style={{fontSize:10}}>Biashara</div></div></div></div>
  return <div style={{position:'absolute', bottom:0, left:0, right:0, height:65, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50}}><div onClick={()=> setTab('home')} style={{color:'white', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>🏠</div><div style={{fontSize:10}}>Home</div></div><div onClick={goMe} style={{color:'white', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:22}}>💰</div><div style={{fontSize:10}}>Biashara ({hasVideos}/{adsCount})</div></div><div onClick={()=> setShowUpload(true)} style={{cursor:'pointer'}}><div style={{width:46, height:30, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'black'}}>+</div></div></div>
}
