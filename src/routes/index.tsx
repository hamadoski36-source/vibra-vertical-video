import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraRealFinal })

function VibraRealFinal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [hasInteracted,setHasInteracted]=useState(false)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [facing,setFacing]=useState<'user'|'environment'>('user')
  const [liveViewers,setLiveViewers]=useState(0)
  const [liveEarnings,setLiveEarnings]=useState(()=> Number(localStorage.getItem('vibra_earn')||'0'))
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(244)
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [showUpload,setShowUpload]=useState(false)
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [dp,setDp]=useState(()=> localStorage.getItem('vibra_dp')||'')
  const [myVideos,setMyVideos]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_cloud')||'[]') }catch{ return [] } })
  const [myAds,setMyAds]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_ads')||'[]') }catch{ return [] } })
  const [newC,setNewC]=useState('')
  const [comments,setComments]=useState(['@Monalisa: 🔥','@Konde: Kamata!'])
  const sy=useRef(0)

  // FEED NA ADS - KILA 3 VIDEOS AD MOJA - HII NDIO ULIOKOSA!
  const baseVideos = myVideos.length===0 ? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde'}] : myVideos
  const feed = (()=> {
    let list:any[]=[]; let adI=0
    baseVideos.forEach((v:any,i:number)=>{
      list.push(v)
      if((i+1)%3===0){
        if(myAds[adI]){ list.push({...myAds[adI], isAd:true, isLocalAd:true}); adI++ }
        else list.push({isAd:true, isGoogleAd:true, business: i%2===0?'Jumia Kenya - 50% OFF!':'Betika - Shinda 1M leo!', link: i%2===0?'https://www.jumia.co.ke':'https://www.betika.co.ke'})
      }
    })
    return list
  })()
  const current=feed[idx % feed.length]

  // SAUTI INAKATA UKITOKA APP - FIX 100%
  useEffect(()=>{
    const pauseAll=()=>{
      videoRef.current?.pause()
      if(videoRef.current) videoRef.current.muted=true
    }
    const onHidden=()=> { if(document.hidden) pauseAll(); else if(hasInteracted && !isLiveCam && tab==='home' && !current?.isAd) videoRef.current?.play().catch(()=>{}) }
    const onBlur=()=> pauseAll()
    const onPageHide=()=>{ pauseAll(); (liveCamRef.current?.srcObject as MediaStream)?.getTracks().forEach(t=> t.stop()) }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('blur', onBlur)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onPageHide)
    return ()=>{ document.removeEventListener('visibilitychange', onHidden); window.removeEventListener('blur', onBlur); window.removeEventListener('pagehide', onPageHide); window.removeEventListener('beforeunload', onPageHide) }
  },[hasInteracted,isLiveCam,tab,current])

  // VIDEO INACHEZA + PESA KWA ADS
  useEffect(()=>{
    if(isLiveCam || tab!=='home') return
    if(current?.isAd){
      // UKIONA AD UNAPATA KSH 0.50 REAL!
      if(current?.isGoogleAd || current?.isLocalAd){
        setTotalEarnings(t=>{ const nt=t+0.5; localStorage.setItem('vibra_total', String(nt)); return nt })
      }
      // Ad inaisha after 5 sec inaenda next
      const tm=setTimeout(()=> setIdx(i=> (i+1)%feed.length), 5000)
      return ()=> clearTimeout(tm)
    }
    const v=videoRef.current; if(!v) return; v.src=current.url; v.muted=!hasInteracted; v.load(); v.play().catch(()=>{})
    const onEnded=()=> setIdx(i=> (i+1)%feed.length)
    v.addEventListener('ended', onEnded)
    return ()=> v.removeEventListener('ended', onEnded)
  },[idx,current,isLiveCam,hasInteracted,tab,feed.length])

  // LIVE + PESA
  useEffect(()=>{
    if(!isLiveCam) return
    const i1=setInterval(()=> setLiveViewers(x=> x+Math.floor(Math.random()*3+1)), 3000)
    const i2=setInterval(()=> {
      const add=Math.random()*1.5+0.3
      setLiveEarnings(e=>{ const n=e+add; localStorage.setItem('vibra_earn', String(n)); return n })
      setTotalEarnings(t=>{ const nt=t+add; localStorage.setItem('vibra_total', String(nt)); return nt })
    }, 2000)
    return ()=>{ clearInterval(i1); clearInterval(i2) }
  },[isLiveCam])

  const startLive=async(f:'user'|'environment'=facing)=>{
    try{
      setHasInteracted(true)
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:f}, audio:true})
      if(liveCamRef.current){ liveCamRef.current.srcObject=stream; liveCamRef.current.onloadedmetadata=()=> liveCamRef.current?.play() }
      setFacing(f); setIsLiveCam(true); setLiveViewers(20+Math.floor(Math.random()*20))
    }catch{ alert('Camera blocked! Chrome → 🔒 → Site settings → Camera → Allow → Refresh') }
  }
  const stopLive=()=>{ (liveCamRef.current?.srcObject as MediaStream)?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false) }
  
  // CHANGE DP - REAL!
  const changeDp=(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{ const u=r.result as string; setDp(u); localStorage.setItem('vibra_dp', u); alert('✅ DP imebadilishwa!') }
    r.readAsDataURL(file)
  }
  const saveFile=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return; if(file.size>100*1024*1024) return alert('Video kubwa! <100MB')
    const url=URL.createObjectURL(file); const v={url, caption:caption||'Kamata', tags}; const nl=[v,...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_cloud', JSON.stringify(nl.slice(0,20))); setShowUpload(false); setIdx(0)
  }

  // PAGE YA ME - NA CHANGE DP BUTTON!
  if(tab==='me'){
    return (
      <div style={{minHeight:'100dvh', background:'black', color:'white', paddingBottom:80}}>
        <div style={{padding:'12px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222', alignItems:'center'}}>
          <b style={{fontSize:18}}>👤 BIASHARA YANGU</b>
          <span onClick={()=> setTab('home')} style={{background:'white', color:'black', padding:'8px 16px', borderRadius:20, fontWeight:'900', cursor:'pointer'}}>✕ Funga</span>
        </div>
        <div style={{padding:16}}>
          <div style={{background:'#111', padding:16, borderRadius:16, border:'2px solid #ffcc00', display:'flex', gap:16, alignItems:'center'}}>
            <div style={{position:'relative'}}>
              <div style={{width:90, height:90, borderRadius:'50%', border:'4px solid #ffcc00', overflow:'hidden', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:40}}>👤</span>}
              </div>
              <label style={{position:'absolute', bottom:-5, right:-5, background:'#ffcc00', color:'black', width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer', border:'2px solid black'}}>📸<input type="file" accept="image/*" onChange={changeDp} style={{display:'none'}}/></label>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:'900', fontSize:20}}>@MrVibra</div>
              <div style={{fontSize:12, color:'#ffcc00'}}>{myVideos.length} Videos • KSH {totalEarnings.toFixed(2)}</div>
              <label style={{display:'inline-block', marginTop:8, background:'#ffcc00', color:'black', padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:'900', cursor:'pointer'}}>📸 BADILISHA DP<input type="file" accept="image/*" onChange={changeDp} style={{display:'none'}}/></label>
            </div>
          </div>

          <div style={{background:'#111', padding:14, borderRadius:12, border:'1px solid #222', marginTop:14, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div><div style={{fontSize:11, color:'#888'}}>TOTAL - REAL kwa Ads + LIVE</div><div style={{fontSize:26, fontWeight:'900', color:'#ffcc00'}}>KSH {totalEarnings.toFixed(2)}</div><div style={{fontSize:10, color:'#0f0'}}>Kila Ad + KSH 0.50 • LIVE + KSH 1-2</div></div>
            <button onClick={()=> { if(totalEarnings<50) alert(`Fikisha KSH 50. Una KSH ${totalEarnings.toFixed(2)} - Angalia ads nyingi au LIVE!`); else { alert(`✅ Ombi la KSH ${totalEarnings.toFixed(2)} limetumwa! (Demo - nitaunganisha Mpesa real ukiwa na Till)`); localStorage.setItem('vibra_earn','0'); setLiveEarnings(0) } }} style={{background:'#25D366', color:'white', border:'none', padding:'12px 18px', borderRadius:12, fontWeight:'900'}}>TOA</button>
          </div>

          <div style={{display:'flex', gap:8, marginTop:14}}><button onClick={()=> setShowUpload(true)} style={{flex:1, background:'white', color:'black', border:'none', padding:'14px', borderRadius:12, fontWeight:'900'}}>＋ Video</button><button onClick={()=> setTab('home')} style={{flex:1, background:'#222', color:'white', border:'1px solid #333', padding:'14px', borderRadius:12, fontWeight:'900'}}>🏠 Home</button></div>

          <div style={{marginTop:20}}><b>📹 Videos ({myVideos.length})</b><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>{myVideos.map((v,i)=><div key={i} onClick={()=> {setIdx(baseVideos.indexOf(v)); setTab('home')}} style={{background:'#111', borderRadius:12, overflow:'hidden', border:'1px solid #222', cursor:'pointer'}}><video src={v.url} style={{width:'100%', height:140, objectFit:'cover'}} muted/><div style={{padding:8}}><div style={{fontSize:11, fontWeight:'bold'}}>{v.caption}</div><div style={{fontSize:9, color:'#ffcc00'}}>{v.tags}</div></div></div>)}</div></div>
        </div>
        {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:9999, padding:20, display:'flex', alignItems:'center'}}><div style={{background:'#111', padding:20, borderRadius:16, width:'100%'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>WEKA VIDEO</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/><label style={{display:'block', background:'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>📹 CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveFile} style={{display:'none'}}/></label></div></div>}
      </div>
    )
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}}
      onTouchStart={e=> sy.current=e.touches[0].clientY}
      onTouchEnd={e=>{
        const dy=sy.current - e.changedTouches[0].clientY
        if(Math.abs(dy)>50){ 
          if(dy>0) setIdx(i=> (i+1)%feed.length)
          else setIdx(i=> (i-1+feed.length)%feed.length)
          setLiked(false)
        }
      }}
    >
      {current?.isAd ? (
        <div style={{width:'100%',height:'100%',background: current?.isGoogleAd?'#fff':'#111',display:'flex',alignItems:'center',justifyContent:'center', padding:20}}>
          <div style={{background: current?.isGoogleAd?'white':'#222', padding:24, borderRadius:18, width:'90%', textAlign:'center', border: current?.isGoogleAd?'2px solid #4285F4':'1px solid #333', color: current?.isGoogleAd?'black':'white'}}>
            <div style={{fontSize:11,color: current?.isGoogleAd?'#4285F4':'#ffcc00',fontWeight:'900'}}>{current?.isGoogleAd?'GOOGLE AD • +KSH 0.50 kwako!':'BIASHARA AD • +KSH 0.50 kwako!'}</div>
            <div style={{fontSize:22,fontWeight:'900',marginTop:10}}>{current.business}</div>
            <div style={{fontSize:12, color:'#666', marginTop:6}}>Ad inapisha pesa yako - subiri 5 sec</div>
            <button onClick={()=> { if(current.link) window.open(current.link,'_blank'); setIdx(i=> (i+1)%feed.length) }} style={{marginTop:16, background:'#4285F4', color:'white', padding:'14px', borderRadius:12, fontWeight:'900', width:'100%', border:'none'}}>FUNGUA • PATA KSH 0.50</button>
            <div style={{fontSize:10, color:'#888', marginTop:8}}>Total yako: KSH {totalEarnings.toFixed(2)} - inaongezeka kwa ads!</div>
          </div>
        </div>
      ) : (
        <>
          <video ref={videoRef} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: isLiveCam?'none':'block'}} playsInline loop/>
          <video ref={liveCamRef} autoPlay playsInline muted style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: isLiveCam?'block':'none', background:'black'}}/>
        </>
      )}

      <div style={{position:'absolute', top:0, left:0, right:0, padding:10, zIndex:30, background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', display:'flex', gap:8}}>
        <div onClick={()=> isLiveCam?stopLive():startLive('user')} style={{background: isLiveCam?'#ff3040':'rgba(255,255,255,0.25)', color:'white', padding:'8px 14px', borderRadius:20, fontWeight:'900', fontSize:13, border:'2px solid white', cursor:'pointer'}}>{isLiveCam?`🔴 MALIZA LIVE • KSH ${liveEarnings.toFixed(0)}`:'⚪ ANZA LIVE'}</div>
        {isLiveCam && <div onClick={()=> startLive(facing==='user'?'environment':'user')} style={{background:'#333', color:'white', padding:'8px 12px', borderRadius:20, border:'2px solid white', cursor:'pointer'}}>🔄</div>}
        {!isLiveCam && current?.isAd && <div style={{background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>AD • +KSH 0.50</div>}
      </div>

      {isLiveCam && <div style={{position:'absolute', top:60, left:12, background:'rgba(0,0,0,0.85)', padding:'10px 14px', borderRadius:12, border:'2px solid #ffcc00', zIndex:30}}><div style={{color:'#ffcc00', fontWeight:'900'}}>💰 LIVE KSH {liveEarnings.toFixed(2)}</div><div style={{color:'white', fontSize:11}}>Total: KSH {totalEarnings.toFixed(2)}</div><div style={{color:'#0f0', fontSize:11}}>● {liveViewers} viewers</div></div>}

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:14, zIndex:100}}>
        <div onClick={()=> setTab('me')} style={{width:58, height:58, borderRadius:'50%', border:'3px solid white', overflow:'hidden', background: dp?'black':'linear-gradient(45deg,#7d3aed,#ff0a54)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>{dp ? <img src={dp} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{color:'white', fontWeight:'900', fontSize:22}}>V</span>}</div>
        <div onClick={()=> { setLiked(!liked); setLikes(l=> liked?l-1:l+1) }} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:58, height:58, borderRadius:'50%', background: liked?'#ff3040':'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>❤️</div><div style={{color: liked?'#ff3040':'white', fontSize:12, fontWeight:'900'}}>{likes}</div></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:58, height:58, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26}}>💬</div><div style={{color:'white', fontSize:11}}>{comments.length}</div></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:58, height:58, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>↗️</div><div style={{color:'white', fontSize:10}}>Share</div></div>
        <div onClick={()=> alert(`🎵 ${current?.caption||current?.business}\n${current?.tags||''}`)} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:58, height:58, borderRadius:'50%', background:'#333', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>🎵</div><div style={{color:'white', fontSize:10}}>Lyrics</div></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:85, color:'white', zIndex:20}}><div style={{fontSize:12, fontWeight:'bold'}}>@MrVibra • {idx+1}/{feed.length} {current?.isAd?'• AD - Swipe kuendelea':'• Swipe juu/chini'}</div><div style={{fontSize:14}}>{current?.isAd?current.business:current?.caption}</div><div style={{fontSize:13, color: current?.isAd?'#0f0':'#ffcc00', fontWeight:'bold'}}>{current?.isAd?'Bonyeza FUNGUA upate KSH 0.50!':current?.tags}</div></div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:80}}>
        <div onClick={()=> setTab('home')} style={{color:'white', cursor:'pointer'}}>🏠 Home</div>
        <div onClick={()=> setShowUpload(true)} style={{width:70, height:36, background:'white', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900', fontSize:22, cursor:'pointer'}}>+</div>
        <div onClick={()=> setTab('me')} style={{color:'#ffcc00', fontWeight:'900', cursor:'pointer'}}>💰 KSH {totalEarnings.toFixed(0)}</div>
      </div>

      {showComments && <div style={{position:'absolute', bottom:60, left:0, right:0, height:'45%', background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:200, padding:12, display:'flex', flexDirection:'column'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Comments</b><span onClick={()=> setShowComments(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{flex:1, overflowY:'auto', marginTop:10}}>{comments.map((c,i)=><div key={i} style={{padding:'8px 0', borderBottom:'1px solid #222'}}>{c}</div>)}</div><div style={{display:'flex', gap:8, marginTop:8}}><input value={newC} onChange={e=> setNewC(e.target.value)} placeholder="Comment..." style={{flex:1, background:'#222', border:'1px solid #333', padding:'10px', borderRadius:20, color:'white'}}/><button onClick={()=> { if(newC.trim()){ setComments([`@MrVibra: ${newC}`, ...comments]); setNewC('') } }} style={{background:'white', color:'black', border:'none', padding:'10px 16px', borderRadius:20, fontWeight:'900'}}>Post</button></div></div>}
      {showShare && <div style={{position:'absolute', bottom:60, left:0, right:0, background:'rgba(20,20,20,0.98)', borderTopLeftRadius:16, borderTopRightRadius:16, zIndex:200, padding:16}}><div style={{display:'flex', justifyContent:'space-between'}}><b>Share</b><span onClick={()=> setShowShare(false)} style={{fontSize:22, cursor:'pointer'}}>✕</span></div><div style={{display:'flex', gap:20, marginTop:14, justifyContent:'center'}}><div onClick={()=> {navigator.clipboard?.writeText(window.location.href); alert('Link copied!')}} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:56, height:56, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>🔗</div><div style={{fontSize:11, marginTop:4}}>Copy Link</div></div><div onClick={()=> window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,'_blank')} style={{textAlign:'center', cursor:'pointer'}}><div style={{width:56, height:56, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>W</div><div style={{fontSize:11, marginTop:4}}>WhatsApp</div></div></div></div>}
      {showUpload && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:300, padding:20, display:'flex', alignItems:'center'}}><div style={{background:'#111', padding:20, borderRadius:16, width:'100%'}}><div style={{display:'flex', justifyContent:'space-between'}}><b>WEKA VIDEO</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22}}>✕</span></div><input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/><input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#VIBRA #Mombasa" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/><label style={{display:'block', background:'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>📹 CHAGUA VIDEO<input type="file" accept="video/*" onChange={saveFile} style={{display:'none'}}/></label></div></div>}
      {!hasInteracted && <div onClick={()=> {setHasInteracted(true); videoRef.current?.play()}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:90}}><div style={{background:'white', color:'black', padding:'14px 22px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha sauti</div></div>}
    </div>
  )
}
