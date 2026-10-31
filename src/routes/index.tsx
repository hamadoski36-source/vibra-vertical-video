import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraFixedHome })

function VibraFixedHome(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [hasInteracted,setHasInteracted]=useState(false)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [facing,setFacing]=useState<'user'|'environment'>('user')
  const [liveViewers,setLiveViewers]=useState(0)
  const [liveEarnings,setLiveEarnings]=useState(()=> Number(localStorage.getItem('vibra_live')||'0'))
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [dp,setDp]=useState(()=> localStorage.getItem('vibra_dp')||'')
  const [myVideos,setMyVideos]=useState<any[]>([])
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [showUpload,setShowUpload]=useState(false)
  const [uploading,setUploading]=useState(false)
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(246)
  const [showComments,setShowComments]=useState(false)
  const [showShare,setShowShare]=useState(false)
  const [comments,setComments]=useState(['@Monalisa: 🔥','@Konde: Kamata!'])
  const [newC,setNewC]=useState('')
  const sy=useRef(0)

  useEffect(()=>{
    const openDB=():Promise<IDBDatabase>=> new Promise((res,rej)=>{
      const r=indexedDB.open('vibra_db',1)
      r.onupgradeneeded=()=> r.result.createObjectStore('videos',{keyPath:'id'})
      r.onsuccess=()=> res(r.result); r.onerror=()=> rej(r.error)
    })
    openDB().then(async db=>{
      const tx=db.transaction('videos','readonly'); const store=tx.objectStore('videos')
      const req=store.getAll(); req.onsuccess=()=>{
        const vids=req.result.map((v:any)=> ({...v, url: URL.createObjectURL(v.blob)}))
        if(vids.length>0) setMyVideos(vids.reverse())
      }
    }).catch(()=>{})
  },[])

  const defaultVid={url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', thumb:'', isAd:false, likes:246}
  const adVid={url:'https://videos.pexels.com/video-files/5310859/5310859-uhd_1440_1440_25fps.mp4', caption:'TANGAZO', thumb:'', isAd:true, likes:9999}

  const baseFeed=myVideos.length>0?myVideos:[defaultVid]
  const feed:any[]=[]
  baseFeed.forEach((v:any,i:number)=>{
    feed.push({...v, isAd:false})
    if((i+1)%3===0) feed.push({...adVid, id:`ad-${i}`, isAd:true})
  })
  const current=feed[idx%feed.length]

  // COUNT KSH FOR ADS
  useEffect(()=>{
    if(current?.isAd){
      const t=setTimeout(()=>{
        const nt=totalEarnings+1
        localStorage.setItem('vibra_total', String(nt))
        setTotalEarnings(nt)
        const nl=liveEarnings+1
        localStorage.setItem('vibra_live', String(nl))
        setLiveEarnings(nl)
      },3000)
      return ()=>clearTimeout(t)
    }
  },[idx,current])

  useEffect(()=>{
    if(isLiveCam || tab!=='home' || !current?.url) return
    const v=videoRef.current; if(!v) return; v.src=current.url; v.loop=true; v.muted=false; v.play().catch(()=>{})
  },[idx,current,isLiveCam,tab,hasInteracted])

  const handleUpload=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return; if(file.size>30*1024*1024) return alert('File kubwa!')
    setUploading(true); try{
      const url=URL.createObjectURL(file); const ve=document.createElement('video'); ve.src=url; ve.muted=true
      await new Promise(res=> ve.onloadeddata=res as any); ve.currentTime=1
      await new Promise(res=> setTimeout(res,500))
      const canvas=document.createElement('canvas'); canvas.width=320; canvas.height=400
      canvas.getContext('2d')?.drawImage(ve,0,0,320,400); const thumb=canvas.toDataURL()
      const db=await new Promise<IDBDatabase>((res,rej)=>{ const r=indexedDB.open('vibra_db',1); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error) })
      const id=Date.now(); await new Promise<void>((resolve,reject)=>{ const tx=db.transaction('videos','readwrite'); tx.objectStore('videos').put({id, blob:file, thumb, caption:caption||'Kamata', tags}); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error) })
      const newV={id, url, thumb, caption:caption||'Kamata', tags, likes:0, isAd:false}
      setMyVideos(v=> [newV, ...v]); setShowUpload(false); setIdx(0)
    }catch(err){ alert('Error '+err) } finally{ setUploading(false) }
  }

  const withdraw=async()=>{
    if(totalEarnings<50) return alert(`Fikisha KSH 50. Una KSH ${totalEarnings}`)
    if(!confirm(`Tuma KSH ${totalEarnings} kwenda 0740805970?`)) return
    try{
      alert('⏳ Inatuma kwa M-Pesa...');
      const res=await fetch('https://vibra-vertical-video-jhab.vercel.app/api/mpesa',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ amount: Math.floor(totalEarnings), phone: '254740805970', remarks: 'Vibra Payout @MrVibra' })
      });
      const data=await res.json();
      if(data.ResponseCode==='0' || data.ConversationID){
        alert(`✅ SAFARICOM IMEOPOKEA! KSH ${totalEarnings}`); localStorage.setItem('vibra_total','0'); setTotalEarnings(0)
      }else{ alert(`❌ M-Pesa imeshindikana: ${JSON.stringify(data).slice(0,200)}`) }
    }catch(e){ const msg = e instanceof Error ? e.message : String(e); alert('Error: '+msg); }
  }

  if(tab==='me'){
    return(
      <div style={{minHeight:'100dvh', background:'black', color:'white'}}>
        <div style={{padding:12, display:'flex', justifyContent:'space-between'}}><b>VIBRA</b><b>KSH {totalEarnings.toFixed(2)}</b></div>
        <div style={{padding:16}}>
          <div style={{background:'#111', padding:16, borderRadius:16}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div style={{width:90,height:90,borderRadius:45,background:'#333', backgroundImage:`url(${dp})`, backgroundSize:'cover'}}></div><div style={{fontWeight:'900', fontSize:20}}>@MrVibra<br/>KSH {totalEarnings.toFixed(2)}<br/><button onClick={withdraw} style={{background:'#0f0', padding:'8px 16px', borderRadius:8, border:0, fontWeight:'900'}}>TOA</button></div></div>
          </div>
          <div style={{marginTop:20}}><b>📼 Videos ({myVideos.length})</b></div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12}}>
            {myVideos.map((v:any,i:number)=><div key={v.id} onClick={()=>{setTab('home'); setIdx(i)}} style={{background:'#111', borderRadius:12, overflow:'hidden'}}><img src={v.thumb} style={{width:'100%', height:160, objectFit:'cover'}}/><div style={{padding:6,fontSize:12}}>{v.caption}</div></div>)}
          </div>
        </div>
      </div>
    )
  }

  return(
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}} onTouchStart={e=> sy.current=e.touches[0].clientY} onTouchEnd={e=>{ const dy=sy.current - e.changedTouches[0].clientY; if(Math.abs(dy)>50){ if(dy>0) setIdx(i=> (i+1)%feed.length); else setIdx(i=> (i-1+feed.length)%feed.length) } }}>
      <video ref={videoRef} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover'}} loop playsInline onClick={()=>{setHasInteracted(true); videoRef.current?.play()}}></video>
      
      {/* AD BANNER - ITAONEKANA KAMA NI AD */}
      {current?.isAd && <div style={{position:'absolute', top:0, left:0, right:0, background:'#ffcc00', color:'black', padding:'10px', textAlign:'center', fontWeight:'900', fontSize:18, zIndex:10}}>🔥 TANGAZO! USISWIPE! Kaa 3sec upate KSH 1 - KSH {totalEarnings} 💰</div>}
      {!current?.isAd && current && <div style={{position:'absolute', top:60, left:12, background:'rgba(0,0,0,0.5)', padding:'4px 8px', borderRadius:20, fontSize:12, color:'white'}}>{idx+1}/{feed.length} • Swipe juu/chini</div>}

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
        <div onClick={()=> setTab('me')} style={{width:56,height:56,borderRadius:28,background:'linear-gradient(45deg,#f0f,#0ff)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900'}}>V</div>
        <div onClick={()=>{ setLiked(!liked); setLikes(l=> liked?l-1:l+1)}} style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:24,background:liked?'red':'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>❤️</div><div style={{color:'white',fontSize:12}}>{current?.isAd?9999:likes}</div></div>
        <div onClick={()=> setShowComments(true)} style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:24,background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div><div style={{color:'white',fontSize:12}}>2</div></div>
        <div onClick={()=> setShowShare(true)} style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:24,background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>↗️</div><div style={{color:'white',fontSize:10}}>Share</div></div>
      </div>

      <div style={{position:'absolute', bottom:85, left:12, right:80, color:'white'}}>
        <div style={{fontWeight:'900'}}>@MrVibra • {idx+1}/{feed.length} • {current?.isAd?'💰 TANGAZO':'🎬 Kamata'}</div>
        <div style={{marginTop:4, background: current?.isAd ? '#ffcc00' : 'transparent', color: current?.isAd ? 'black' : 'white', padding: current?.isAd ? '6px 10px' : 0, borderRadius:8, fontWeight: current?.isAd ? '900' : '400', fontSize: current?.isAd ? 18 : 14}}>{current?.isAd ? '🔥 Kaa hapa sec 3 upate KSH 1! USISWIPE!' : current?.caption}</div>
        <div style={{fontSize:12, color:'#ff0', marginTop:4}}>#VIBRA #viral #fyp</div>
      </div>

      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', borderTop:'1px solid #222'}}>
        <div onClick={()=> setTab('home')} style={{color:'white'}}>🏠 Home</div>
        <div onClick={()=> setShowUpload(true)} style={{width:60,height:36,background:'white',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'black',fontWeight:'900'}}>+</div>
        <div onClick={()=> setTab('me')} style={{color:'#ffcc00', fontWeight:'900'}}>💰 KSH {totalEarnings}</div>
      </div>

      {showUpload&&<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20}}><div style={{background:'#111', padding:20, borderRadius:16, width:'90%'}}><h3 style={{color:'white'}}>Pakia Video</h3><input placeholder='Caption' value={caption} onChange={e=> setCaption(e.target.value)} style={{width:'100%', padding:10, marginTop:10, borderRadius:8}}/><input type='file' accept='video/*' onChange={handleUpload} style={{marginTop:12, color:'white'}}/><div style={{marginTop:12, display:'flex', gap:10}}><button onClick={()=> setShowUpload(false)} style={{flex:1, padding:10, borderRadius:8}}>Funga</button></div>{uploading&&<div style={{color:'white', marginTop:10}}>Inapakia...</div>}</div></div>}
      {!hasInteracted&&<div onClick={()=>{setHasInteracted(true); videoRef.current?.play()}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:20, fontWeight:'900'}}>Bonyeza kucheza ▶️</div>}
    </div>
  )
}
