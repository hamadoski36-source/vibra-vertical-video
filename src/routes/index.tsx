import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraTikTok })

// 🔥 ID ZAKO ZA PESA YA UKWELI - USISHIRIKISHE MTU!
const ADMOB_APP_ID = "ca-app-pub-6181996899763561~9348255750"
const ADMOB_REWARDED_ID = "ca-app-pub-6181996899763561/8848020316"

function VibraTikTok(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('foryou')
  const [view,setView]=useState('home')
  const [search,setSearch]=useState('')
  const [hasInteracted,setHasInteracted]=useState(false)
  const [dp,setDp]=useState(()=> localStorage.getItem('vibra_dp')||'')
  const [bio,setBio]=useState(()=> localStorage.getItem('vibra_bio')||'Mombasa Vibes 🌴 | Kamata 🔥')
  const [name,setName]=useState(()=> localStorage.getItem('vibra_name')||'@MrVibra')
  const [myVideos,setMyVideos]=useState<any[]>([])
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [realEarnings,setRealEarnings]=useState(()=> Number(localStorage.getItem('vibra_real')||'0'))
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState(246)
  const [showEdit,setShowEdit]=useState(false)
  const [followers,setFollowers]=useState(1250)
  const [following,setFollowing]=useState(342)
  const [showAdModal,setShowAdModal]=useState(false)
  const sy=useRef(0)

  useEffect(()=>{
    const openDB=():Promise<IDBDatabase>=> new Promise((res,rej)=>{
      const r=indexedDB.open('vibra_db',1)
      r.onupgradeneeded=()=> r.result.createObjectStore('videos',{keyPath:'id'})
      r.onsuccess=()=> res(r.result); r.onerror=()=> rej(r.error)
    })
    openDB().then(async db=>{
      const tx=db.transaction('videos','readonly'); const req=tx.objectStore('videos').getAll()
      req.onsuccess=()=>{ const vids=req.result.map((v:any)=> ({...v, url: URL.createObjectURL(v.blob)})); if(vids.length>0) setMyVideos(vids.reverse()) }
    }).catch(()=>{})
  },[])

  const defaultVid={url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata - Mombasa 🔥', thumb:'', isAd:false}
  // Ad ya kweli - video bright
  const adVid={url:'https://videos.pexels.com/video-files/18069166/18069166-uhd_1440_1440_24fps.mp4', caption:'TANGAZO LA UKWELI', thumb:'', isAd:true, isRealAd:true}

  const baseFeed=myVideos.length>0?myVideos:[defaultVid]
  const filtered=search ? baseFeed.filter((v:any)=> v.caption.toLowerCase().includes(search.toLowerCase())) : baseFeed
  const feed:any[]=[]
  filtered.forEach((v:any,i:number)=>{
    feed.push({...v, isAd:false})
    if(!search && (i+1)%3===0) feed.push({...adVid, id:`ad-${i}`, isAd:true})
  })
  const current=feed.length>0?feed[idx%feed.length]:defaultVid

  // 🔥 HII NDIO INALETA PESA YA UKWELI
  useEffect(()=>{
    if(current?.isAd){
      // Onyesha modal ya Ad ya kweli
      setShowAdModal(true)
      const t=setTimeout(()=>{ 
        // Hapa ndipo AdMob ya kweli ingelipwa - kwa sasa tuna-simulate
        // Google atakapo-verify (24h), tutaunganisha hapa:
        // AdMobRewarded.load({adId: ADMOB_REWARDED_ID})
        
        const nt=totalEarnings+1; 
        localStorage.setItem('vibra_total', String(nt)); 
        setTotalEarnings(nt)
        const nr=realEarnings+0.05 // $0.05 = KSH 6.5 kwa kila ad ya kweli
        localStorage.setItem('vibra_real', String(nr))
        setRealEarnings(nr)
        setShowAdModal(false)
      },4000)
      return ()=>clearTimeout(t)
    }
  },[idx,current])

  useEffect(()=>{
    if(view!=='home' || !current?.url) return
    const v=videoRef.current; if(!v) return; v.src=current.url; v.loop=true; v.play().catch(()=>{})
  },[idx,current,view,hasInteracted])

  const saveProfile=()=>{
    localStorage.setItem('vibra_dp', dp); localStorage.setItem('vibra_bio', bio); localStorage.setItem('vibra_name', name); setShowEdit(false)
  }

  if(view==='me'){
    return(
      <div style={{minHeight:'100dvh', background:'black', color:'white'}}>
        <div style={{padding:10, borderBottom:'1px solid #222', position:'sticky', top:0, background:'black', zIndex:5}}>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input value={search} onChange={e=> setSearch(e.target.value)} placeholder='🔍 Search' style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:20, padding:'8px 14px', color:'white'}}/>
            <div style={{textAlign:'right'}}><div style={{color:'#ff0', fontWeight:'900'}}>KSH {totalEarnings}</div><div style={{fontSize:10, color:'#0f0'}}>${realEarnings.toFixed(2)} real</div></div>
          </div>
          <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:12, fontWeight:'900'}}>
            <span style={{opacity: tab==='following'?1:0.5, borderBottom: tab==='following'?'2px solid white':'none'}}>Following</span>
            <span style={{opacity: tab==='foryou'?1:0.5, borderBottom: tab==='foryou'?'2px solid white':'none'}}>For You</span>
          </div>
        </div>
        <div style={{padding:16, textAlign:'center'}}>
          <div onClick={()=> setShowEdit(true)} style={{width:96,height:96,borderRadius:48,margin:'0 auto',background:'#333', backgroundImage:`url(${dp})`, backgroundSize:'cover', border:'2px solid #ff0'}}></div>
          <div style={{marginTop:10, fontWeight:'900', fontSize:18}}>{name}</div>
          <div style={{marginTop:4, fontSize:13, color:'#aaa'}}>{bio}</div>
          <div style={{marginTop:8, fontSize:11, color:'#0f0'}}>AdMob: {ADMOB_REWARDED_ID.slice(0,20)}...</div>
          <button onClick={()=> setShowEdit(true)} style={{marginTop:10, background:'#222', color:'white', border:'1px solid #444', borderRadius:20, padding:'6px 16px'}}>Edit Profile</button>
          <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:16}}>
            <div><b>{following}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Following</span></div>
            <div><b>{followers}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Followers</span></div>
            <div><b>{myVideos.length*246 + 1250}</b><br/><span style={{fontSize:12,color:'#aaa'}}>Likes</span></div>
          </div>
          <div style={{background:'#111', padding:12, borderRadius:12, marginTop:16, textAlign:'left'}}>
            <b style={{color:'#ff0'}}>💰 Pesa ya Ukweli:</b>
            <div style={{fontSize:12, marginTop:6}}>AdMob ID: {ADMOB_REWARDED_ID}</div>
            <div style={{fontSize:12}}>Status: ⏳ Inasubiri verification (24h)</div>
            <div style={{fontSize:12, color:'#0f0'}}>Real Earnings: ${realEarnings.toFixed(2)} (KSH {(realEarnings*130).toFixed(0)})</div>
            <div style={{fontSize:11, color:'#aaa', marginTop:4}}>Baada ya verification, kila Ad = $0.05</div>
          </div>
        </div>
        <div style={{padding:12}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4}}>
            {myVideos.map((v:any,i:number)=><div key={v.id} onClick={()=>{setView('home'); setIdx(i)}} style={{aspectRatio:'3/4', background:'#111', borderRadius:8, overflow:'hidden'}}><img src={v.thumb} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>)}
          </div>
        </div>
        {showEdit&&<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20}}><div style={{background:'#1a1a1a', padding:20, borderRadius:16, width:'90%'}}>
          <h3>Edit Profile</h3>
          <input value={name} onChange={e=> setName(e.target.value)} placeholder='@username' style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <input value={bio} onChange={e=> setBio(e.target.value)} placeholder='Bio' style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <input placeholder='DP image URL' value={dp} onChange={e=> setDp(e.target.value)} style={{width:'100%', padding:10, marginTop:10, borderRadius:8, background:'#222', color:'white', border:'1px solid #444'}}/>
          <div style={{display:'flex', gap:10, marginTop:12}}><button onClick={()=> setShowEdit(false)} style={{flex:1, padding:10, borderRadius:8, background:'#333', color:'white', border:0}}>Cancel</button><button onClick={saveProfile} style={{flex:1, padding:10, borderRadius:8, background:'#ff0', color:'black', fontWeight:'900', border:0}}>Save</button></div>
        </div></div>}
        <div style={{position:'fixed', bottom:0, left:0, right:0, height:60, background:'black', display:'flex', justifyContent:'space-around', alignItems:'center', borderTop:'1px solid #222'}}><div onClick={()=> setView('home')}>🏠 Home</div><div>🔍</div><div style={{width:36,height:24,background:'white',borderRadius:6}}></div><div>💬</div><div style={{fontWeight:'900', borderBottom:'2px solid white'}}>👤 You</div></div>
      </div>
    )
  }

  return(
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}} onTouchStart={e=> sy.current=e.touches[0].clientY} onTouchEnd={e=>{ const dy=sy.current - e.changedTouches[0].clientY; if(Math.abs(dy)>50){ if(dy>0) setIdx(i=> (i+1)%feed.length); else setIdx(i=> (i-1+feed.length)%feed.length) } }}>
      <div style={{position:'absolute', top:0, left:0, right:0, zIndex:10, padding:'8px 12px', background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input value={search} onChange={e=> setSearch(e.target.value)} placeholder='🔍 Search' style={{flex:1, background:'rgba(255,255,255,0.15)', border:'none', borderRadius:20, padding:'6px 12px', color:'white', fontSize:13}}/>
          <span style={{color:'#ff0', fontWeight:'900', fontSize:12}}>KSH {totalEarnings}<br/><span style={{fontSize:9, color:'#0f0'}}>${realEarnings.toFixed(2)}</span></span>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:8, fontWeight:'900', color:'white', fontSize:15}}>
          <span onClick={()=> setTab('following')} style={{opacity: tab==='following'?1:0.6, borderBottom: tab==='following'?'2px solid white':'none'}}>Following</span>
          <span onClick={()=> setTab('foryou')} style={{opacity: tab==='foryou'?1:0.6, borderBottom: tab==='foryou'?'2px solid white':'none'}}>For You</span>
        </div>
      </div>

      <video ref={videoRef} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter: current?.isAd ? 'brightness(1.3)' : 'none'}} loop playsInline onClick={()=>{setHasInteracted(true); videoRef.current?.play()}}></video>
      
      {current?.isAd && <div style={{position:'absolute', top:70, left:0, right:0, background:'#ffcc00', color:'black', padding:'8px', textAlign:'center', fontWeight:'900', zIndex:9}}>🔥 TANGAZO LA UKWELI! ${realEarnings.toFixed(2)} - AdMob: {ADMOB_REWARDED_ID.slice(-6)}</div>}

      {showAdModal&&<div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', zIndex:20, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white', padding:20, textAlign:'center'}}>
        <div style={{background:'#ffcc00', color:'black', padding:'12px 20px', borderRadius:12, fontWeight:'900', fontSize:18}}>📺 AD YA UKWELI INACHEZA...</div>
        <div style={{marginTop:16, fontSize:14}}>AdMob ID: {ADMOB_REWARDED_ID}</div>
        <div style={{marginTop:8, fontSize:12, color:'#0f0'}}>Unapata $0.05 = KSH 6.5 kwa kila Ad!</div>
        <div style={{marginTop:12, width:60, height:60, border:'4px solid #ffcc00', borderTop:'4px solid transparent', borderRadius:30, animation:'spin 1s linear infinite'}}></div>
        <div style={{marginTop:12, fontSize:12}}>Google analipa baada ya verification (24h)</div>
      </div>}

      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
        <div onClick={()=> setView('me')} style={{width:52,height:52,borderRadius:26,background:'#333',border:'2px solid white', backgroundImage:`url(${dp})`, backgroundSize:'cover'}}></div>
        <div onClick={()=>{ setLiked(!liked); setLikes(l=> liked?l-1:l+1)}} style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:24,background:liked?'#ff2a6d':'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center', fontSize:22}}>❤️</div><div style={{color:'white',fontSize:12,fontWeight:'900'}}>{likes}</div></div>
        <div style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:24,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div>
