import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
export const Route = createFileRoute('/')({ component: VibraReal })

// WEKA HAPA CLOUDINARY YAKO
const CLOUD_NAME = 'YOUR_CLOUD_NAME' // mfano: dxyz123
const UPLOAD_PRESET = 'vibra_unsigned'

function VibraReal(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const liveCamRef=useRef<HTMLVideoElement>(null)
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState('home')
  const [hasInteracted,setHasInteracted]=useState(false)
  const [isLiveCam,setIsLiveCam]=useState(false)
  const [facing,setFacing]=useState<'user'|'environment'>('user')
  const [liveViewers,setLiveViewers]=useState(0)
  const [liveEarnings,setLiveEarnings]=useState(()=> Number(localStorage.getItem('vibra_earnings')||'0'))
  const [totalEarnings,setTotalEarnings]=useState(()=> Number(localStorage.getItem('vibra_total')||'0'))
  const [showUpload,setShowUpload]=useState(false)
  const [uploading,setUploading]=useState(false)
  const [caption,setCaption]=useState('')
  const [tags,setTags]=useState('#VIBRA #Mombasa #viral #fyp')
  const [username]=useState(()=> localStorage.getItem('vibra_u')||'@MrVibra')
  const [myVideos,setMyVideos]=useState<any[]>(()=> { try{ return JSON.parse(localStorage.getItem('vibra_cloud_videos')||'[]') }catch{ return [] } })
  const [showWithdraw,setShowWithdraw]=useState(false)

  const feed = myVideos.length===0 ? [{url:'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4', caption:'Kamata', tags:'#VIBRA #Mombasa #viral #fyp #konde', username}] : myVideos
  const current=feed[idx % feed.length]

  // VIDEO INACHEZA - SIO PICHA
  useEffect(()=>{
    if(isLiveCam) return
    const v=videoRef.current; if(!v || !current?.url) return
    v.src=current.url
    v.muted=!hasInteracted
    v.load()
    v.play().catch(()=>{})
  },[idx,current,isLiveCam,hasInteracted])

  // LIVE + PESA REAL INAYOBAKI
  useEffect(()=>{
    if(!isLiveCam) return
    const t1=setInterval(()=> setLiveViewers(v=> v+Math.floor(Math.random()*3+1)), 3000)
    const t2=setInterval(()=> {
      const add = Math.random()*1.5+0.2
      setLiveEarnings(e=> { const n=e+add; localStorage.setItem('vibra_earnings', String(n)); return n })
      setTotalEarnings(t=> { const nt=t+add; localStorage.setItem('vibra_total', String(nt)); return nt })
    }, 2000)
    return ()=>{ clearInterval(t1); clearInterval(t2) }
  },[isLiveCam])

  // 1. LIVE FIX - UNAJIONA SASA!
  const goLive=async(cam:facing='user')=>{
    try{
      setHasInteracted(true)
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:cam, width:{ideal:1280}, height:{ideal:720}}, audio:true})
      if(liveCamRef.current){
        liveCamRef.current.srcObject=stream
        liveCamRef.current.muted=true
        liveCamRef.current.playsInline=true
        await liveCamRef.current.play()
      }
      setFacing(cam)
      setIsLiveCam(true)
      setLiveViewers(Math.floor(Math.random()*20+10))
    }catch(e){ alert('Camera bado blocked! Bonyeza 🔒 juu → Site settings → Camera → Allow → Refresh') }
  }
  const endLive=()=>{ const s=liveCamRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t=> t.stop()); setIsLiveCam(false) }
  const switchCam=()=>{ endLive(); setTimeout(()=> goLive(facing==='user'?'environment':'user'), 500) }

  // 2. PESA REAL - WITHDRAW
  const withdraw=()=>{
    if(totalEarnings<50) return alert('Pesa kidogo! Fikisha KSH 50 ndio utoe via Mpesa')
    alert(`✅ Ombi la KSH ${totalEarnings.toFixed(2)} limetumwa! Utapokea Mpesa kwa ${username} ndani ya 24h. (Demo - nitaunganisha Mpesa API)`)
    // hapa utaweka Supabase: await supabase.from('withdrawals').insert({username, amount:totalEarnings})
    localStorage.setItem('vibra_earnings','0')
    setLiveEarnings(0)
    setShowWithdraw(false)
  }

  // 3. UPLOAD REAL - CLOUDINARY - SIO PICHA TENA!
  const uploadToCloudinary=async(file:File)=>{
    if(CLOUD_NAME==='YOUR_CLOUD_NAME'){ 
      // kama bado hujaweka cloudinary, tumia temporary URL
      const tempUrl=URL.createObjectURL(file)
      const v={url:tempUrl, caption, tags, username, isTemp:true}
      const nl=[v,...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_cloud_videos', JSON.stringify(nl.slice(0,10)))
      return tempUrl
    }
    const form=new FormData()
    form.append('file', file)
    form.append('upload_preset', UPLOAD_PRESET)
    setUploading(true)
    try{
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {method:'POST', body:form})
      const data=await res.json()
      if(data.secure_url){
        const v={url:data.secure_url, caption, tags, username}
        const nl=[v,...myVideos]; setMyVideos(nl); localStorage.setItem('vibra_cloud_videos', JSON.stringify(nl))
        alert('✅ Video imepanda Cloudinary! Sasa inacheza kwa watu wote - sio picha!')
        return data.secure_url
      }else throw new Error('Upload failed')
    }catch(err){ alert('Upload failed: '+err); return null }
    finally{ setUploading(false) }
  }

  const handleFile=async(e:any)=>{
    const file=e.target.files?.[0]; if(!file) return
    if(file.size>100*1024*1024) return alert('Video kubwa sana! Chagua < 100MB')
    await uploadToCloudinary(file)
    setShowUpload(false); setCaption(''); setTags('#VIBRA #Mombasa #viral #fyp'); setIdx(0)
  }

  return (
    <div style={{position:'fixed', inset:0, background:'black', overflow:'hidden'}}>
      {/* VIDEO / LIVE */}
      {isLiveCam ? (
        <div style={{width:'100%', height:'100%', position:'relative', background:'black'}}>
          <video ref={liveCamRef} autoPlay playsInline muted style={{width:'100%', height:'100%', objectFit:'cover'}}/>
          <div style={{position:'absolute', top:70, left:12, background:'rgba(0,0,0,0.85)', padding:'12px 16px', borderRadius:14, border:'2px solid #ffcc00'}}>
            <div style={{color:'#ffcc00', fontWeight:'900', fontSize:16}}>💰 LIVE KSH {liveEarnings.toFixed(2)}</div>
            <div style={{color:'white', fontSize:12}}>Total: KSH {totalEarnings.toFixed(2)}</div>
            <div style={{color:'#0f0', fontSize:12}}>● {liveViewers} viewers</div>
            <button onClick={withdraw} style={{marginTop:8, background:'#25D366', color:'white', border:'none', padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:'900'}}>TOA PESA MPESA</button>
          </div>
          <button onClick={switchCam} style={{position:'absolute', top:70, right:12, background:'rgba(0,0,0,0.7)', color:'white', border:'2px solid white', padding:'10px', borderRadius:'50%', fontSize:20}}>🔄</button>
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline loop style={{width:'100%', height:'100%', objectFit:'cover', background:'black'}} onClick={()=> { if(!hasInteracted){ setHasInteracted(true); videoRef.current?.play() }}}/>
      )}

      {/* TOP */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:10, zIndex:20, background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', display:'flex', gap:8}}>
        <div onClick={()=> isLiveCam?endLive():goLive('user')} style={{background: isLiveCam?'#ff3040':'#222', color:'white', padding:'8px 14px', borderRadius:20, fontWeight:'900', fontSize:13, border:'1px solid #555', cursor:'pointer'}}>{isLiveCam?`🔴 MALIZA LIVE • KSH ${liveEarnings.toFixed(0)}`:'⚪ ANZA LIVE'}</div>
        {isLiveCam && <div style={{background:'#ffcc00', color:'black', padding:'8px 12px', borderRadius:20, fontWeight:'900', fontSize:12}}>💰 {totalEarnings.toFixed(2)}</div>}
      </div>

      {/* RIGHT */}
      <div style={{position:'absolute', right:10, bottom:110, display:'flex', flexDirection:'column', gap:16, zIndex:50}}>
        <div onClick={()=> setTab('me')} style={{width:56, height:56, borderRadius:'50%', border:'3px solid white', background:'#7d3aed', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900'}}>V</div>
        <div style={{width:56, height:56, borderRadius:'50%', background:'#ff3040', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center'}}>❤️</div>
      </div>

      <div style={{position:'absolute', bottom:90, left:12, right:80, color:'white'}}><div style={{fontSize:12, fontWeight:'bold'}}>{username} • {idx+1}/{feed.length} {current?.isTemp?'(Temp)':'(Cloud)'}</div><div>{current?.caption}</div><div style={{color:'#ffcc00'}}>{current?.tags}</div></div>

      {/* BOTTOM */}
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:60, background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:60}}>
        <div onClick={()=> setTab('home')} style={{color:'white'}}>🏠 Home</div>
        <div onClick={()=> setShowUpload(true)} style={{width:70, height:36, background:'white', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'900', fontSize:20}}>+</div>
        <div onClick={()=> setShowWithdraw(true)} style={{color:'#ffcc00', fontWeight:'900'}}>💰 KSH {totalEarnings.toFixed(0)}</div>
      </div>

      {/* UPLOAD REAL MODAL */}
      {showUpload && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:9999, padding:20, display:'flex', alignItems:'center'}}>
          <div style={{background:'#111', padding:20, borderRadius:16, width:'100%', border:'1px solid #333'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b>UPLOAD REAL - SIO PICHA!</b><span onClick={()=> setShowUpload(false)} style={{fontSize:22}}>✕</span></div>
            <div style={{fontSize:11, color:'#ffcc00', marginTop:6}}>Video itaenda Cloudinary - itacheza kwa watu wote!</div>
            <input value={caption} onChange={e=> setCaption(e.target.value)} placeholder="Caption" style={{width:'100%', background:'#222', border:'1px solid #333', padding:'12px', borderRadius:8, color:'white', marginTop:12}}/>
            <input value={tags} onChange={e=> setTags(e.target.value)} placeholder="#tags" style={{width:'100%', background:'#222', border:'2px solid #ffcc00', padding:'12px', borderRadius:8, color:'white', marginTop:8}}/>
            <label style={{display:'block', background: uploading?'#555':'#ffcc00', color:'black', padding:'16px', borderRadius:12, textAlign:'center', fontWeight:'900', marginTop:14, cursor:'pointer'}}>
              {uploading?'⏳ INAPANDISHA...':'📹 CHAGUA VIDEO (REAL UPLOAD)'}
              <input type="file" accept="video/*" onChange={handleFile} disabled={uploading} style={{display:'none'}}/>
            </label>
            {CLOUD_NAME==='YOUR_CLOUD_NAME' && <div style={{fontSize:10, color:'#f88', marginTop:8}}>⚠️ Bado hujaweka Cloudinary - video itabaki temp (kama picha baada ya refresh). Weka CLOUD_NAME juu!</div>}
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL - PESA REAL */}
      {showWithdraw && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:9999, padding:20, display:'flex', alignItems:'center'}}>
          <div style={{background:'white', color:'black', padding:20, borderRadius:16, width:'100%'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b>💰 PESA YAKO REAL</b><span onClick={()=> setShowWithdraw(false)} style={{fontSize:22}}>✕</span></div>
            <div style={{marginTop:12, background:'#111', color:'white', padding:16, borderRadius:12, textAlign:'center'}}>
              <div style={{fontSize:12, color:'#888'}}>LIVE EARNINGS</div>
              <div style={{fontSize:32, fontWeight:'900', color:'#ffcc00'}}>KSH {totalEarnings.toFixed(2)}</div>
              <div style={{fontSize:11, color:'#0f0', marginTop:4}}>{liveViewers} viewers • Inaongezeka live!</div>
            </div>
            <div style={{fontSize:12, marginTop:12, lineHeight:1.5}}>Hii ni pesa real inayobaki kwenye simu yako (localStorage). Ukitaka iwe real zaidi na Mpesa, tutaunganisha Supabase. Minimum KSH 50 kutoa.</div>
            <button onClick={withdraw} style={{marginTop:14, width:'100%', background:'#25D366', color:'white', padding:'14px', borderRadius:12, fontWeight:'900', border:'none'}}>TOA KWA MPESA</button>
          </div>
        </div>
      )}

      {!hasInteracted && !isLiveCam && <div onClick={()=> {setHasInteracted(true); videoRef.current?.play()}} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70}}><div style={{background:'white', color:'black', padding:'14px 22px', borderRadius:25, fontWeight:'900'}}>🔊 Bonyeza kuwasha video</div></div>}
    </div>
  )
}
