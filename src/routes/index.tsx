<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>VIBRA</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;-webkit-tap-highlight-color:transparent}
body{background:#000;color:#fff;overflow:hidden;height:100dvh}
button{cursor:pointer;border:none}
input{outline:none}
.VT{background:linear-gradient(90deg,#ff2d55,#00e5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900}
.top{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);padding:10px 12px 8px}
.search{display:flex;gap:8px;align-items:center}
.search input{flex:1;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:9px 14px;color:#fff;font-size:13px}
.search b{font-size:18px}
.tabs{display:flex;gap:8px;margin-top:10px}
.tabs button{flex:1;padding:7px;border-radius:20px;background:#1a1a1a;color:#888;font-size:12px;font-weight:700}
.tabs button.on{background:linear-gradient(90deg,#ff2d55,#00e5ff);color:#fff}
.feed{height:100dvh;overflow-y:scroll;scroll-snap-type:y mandatory;padding-top:0}
.video{height:100dvh;scroll-snap-align:start;position:relative;background:#111;display:flex;align-items:center;justify-content:center;overflow:hidden}
.video img,.video video{width:100%;height:100%;object-fit:cover}
.video .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 35%,rgba(0,0,0,.3) 100%)}
.side{position:absolute;right:10px;bottom:100px;display:flex;flex-direction:column;gap:16px;align-items:center;z-index:10}
.side button{background:rgba(0,0,0,.4);border:none;width:48px;height:48px;border-radius:50%;font-size:22px;color:#fff;display:flex;align-items:center;justify-content:center}
.side span{font-size:11px;margin-top:-12px;font-weight:700}
.info{position:absolute;left:12px;bottom:95px;right:70px;z-index:10}
.info b{font-size:14px}
.info p{font-size:12px;color:#ddd;margin-top:4px;line-height:1.4}
.bottom{position:fixed;bottom:0;left:0;right:0;background:#000;border-top:1px solid #222;display:flex;justify-content:space-around;padding:8px 0 calc(8px + env(safe-area-inset-bottom));z-index:60}
.bottom button{background:none;color:#888;font-size:10px;display:flex;flex-direction:column;align-items:center;gap:2px}
.bottom button.on{color:#fff}
.bottom .plus{background:#fff;color:#000;width:44px;height:28px;border-radius:8px;font-size:20px;line-height:1;display:flex;align-items:center;justify-content:center}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:flex;align-items:flex-end;justify-content:center}
.sheet{background:#151515;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:16px;max-height:85dvh;overflow-y:auto}
.sheet input,.sheet textarea{width:100%;background:#222;border:1px solid #333;border-radius:12px;padding:11px;color:#fff;margin:6px 0;font-size:14px}
.btn{width:100%;padding:12px;border-radius:12px;background:linear-gradient(90deg,#ff2d55,#00e5ff);color:#fff;font-weight:800;font-size:14px;margin-top:8px}
.btn2{width:100%;padding:11px;border-radius:12px;background:#222;color:#fff;font-weight:700;margin-top:8px}
.pill{border:1px solid #00e5ff;color:#00e5ff;background:rgba(0,229,255,.08);border-radius:20px;padding:7px 10px;font-size:11px}
.chip{padding:6px 10px;border-radius:20px;background:#222;color:#fff;font-size:12px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.grid3 img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;background:#222}
.acct{display:flex;align-items:center;gap:10px;background:#222;border-radius:14px;padding:10px;margin:8px 0}
.acct img{width:44px;height:44px;border-radius:50%;object-fit:cover}
</style>
</head>
<body>

<div id="app"></div>

<script>
let accounts = JSON.parse(localStorage.getItem('vibra_accounts')||'null') || [{id:1,name:'Mr Vibra',user:'@Mr Vibra',bio:'Worldwide Vibes 🌍 | Kamata 🔥',dp:'https://i.pravatar.cc/150?img=12',active:true}];
let currentAcc = accounts.find(a=>a.active) || accounts[0];
let videos = JSON.parse(localStorage.getItem('vibra_videos')||'null') || [
{id:1,user:'@Mr Vibra',name:'Mr Vibra',caption:'We used to hide under the covers ❤️ #vibra #viral #comedy #music #drama #fyp',img:'https://picsum.photos/600/900?random=1',likes:12,comments:4,liked:false},
{id:2,user:'@Mr Vibra',name:'Mr Vibra',caption:'Who is your guy? (Spyro) 🎵 Na only me, walahi',img:'https://picsum.photos/600/900?random=2',likes:8,comments:2,liked:false},
{id:3,user:'@Mr Vibra',name:'Mr Vibra',caption:"God's plan are always the best 🙏😇",img:'https://picsum.photos/600/900?random=3',likes:15,comments:6,liked:false},
{id:4,user:'@Pizzy_027',name:'Pizzy',caption:'PIZZY_027 🔥 New vibe',img:'https://picsum.photos/600/900?random=4',likes:20,comments:9,liked:false},
];
let page='home', tab='For You', showShare=null, showAI=false, showSettings=false, showAddAcc=false, showProfile=false;
let aiChats=[{role:'ai',text:'Hello! I am VIBRA AI. I speak English and Swahili only. Ask in Swahili, answer in Swahili. Ask in English, answer in English. You can also send a picture or use voice like Meta AI.'}];
let aiInput='';

function save(){localStorage.setItem('vibra_videos',JSON.stringify(videos));localStorage.setItem('vibra_accounts',JSON.stringify(accounts));}
function totalLikes(){return videos.filter(v=>v.user===currentAcc.user).reduce((s,v)=>s+v.likes,0);}
function myVideos(){return videos.filter(v=>v.user===currentAcc.user);}

const quickQs=['Who created Meta?','Nani alianzisha Meta?','Ways to earn money?','Njia za kupata pesa?','Who is president of America?','Rais wa Kenya ni nani?','Advantage of being a farmer','Niambie jinsi yakupika pilau','Jinsi yakupenda tomato','Faida za kufuga ngombe'];

function askAI(q){
  if(!q) q=aiInput; if(!q) return;
  aiChats.push({role:'me',text:q});
  let low=q.toLowerCase(); let ans='';
  if(low.includes('meta')) ans = low.includes('nani')||low.includes('alianzisha') ? 'Meta ilianzishwa na Mark Zuckerberg mwaka 2004 kama Facebook. Sasa inamiliki Facebook, Instagram na WhatsApp.' : 'Meta was created by Mark Zuckerberg in 2004 as Facebook. Now it owns Facebook, Instagram and WhatsApp.';
  else if(low.includes('pesa')||low.includes('money')||low.includes('earn')) ans='Njia za kupata pesa: 1) TikTok/VIBRA content 2) Biashara mtandaoni 3) Freelancing 4) Kilimo 5) Kuuza mitandaoni. Chagua moja uanze leo!';
  else if(low.includes('rais')||low.includes('president')||low.includes('kenya')) ans='Rais wa Kenya ni William Ruto. Rais wa America ni Donald Trump (2026).';
  else if(low.includes('pilau')) ans='Pilau: Kaanga kitunguu, weka nyama, pilau masala, mchele, maji. Pika moto mdogo dakika 20. Tayari!';
  else if(low.includes('farmer')||low.includes('mkulima')) ans='Faida ya kuwa mkulima: Unapata chakula chako, kipato kila msimu, na soko kubwa Kenya.';
  else if(low.includes('ngombe')||low.includes('kufuga')) ans='Faida za kufuga ngombe: Maziwa kila siku, mbolea, na kipato ukiuza ndama.';
  else if(low.includes('tomato')||low.includes('nyanya')) ans='Kupanda tomato: Panda mbegu, weka maji kila siku, weka mbolea baada ya wiki 2, vuna baada ya miezi 2-3.';
  else ans = /[aeiou]/.test(q) && /[a-z]/.test(q) ? 'Asante kwa swali lako: "'+q+'". Kwenye VIBRA unaweza ku-post video, ku-like, ku-comment na kushare. Uliza kingine kuhusu pesa, pilau, kilimo au Meta!' : 'Thank you! Ask me about money, pilau, farming, Meta or Kenya and I will answer in your language.';
  setTimeout(()=>{aiChats.push({role:'ai',text:ans}); render();},400);
  aiInput=''; render();
}

function render(){
  let current = videos[0];
  let feedVideos = tab==='For You'? videos : tab==='Following'? videos.slice(0,2) : videos;
  let html='';
  if(page==='home'){
    html+=`<div class="top"><div class="search"><b class="VT">VIBRA</b><input placeholder="Search..." oninput="this.value"><b>🔍</b></div><div class="tabs"><button class="${tab==='For You'?'on':''}" onclick="tab='For You';render()">For You</button><button class="${tab==='Following'?'on':''}" onclick="tab='Following';render()">Following</button><button class="${tab==='LIVE'?'on':''}" onclick="tab='LIVE';render()">LIVE</button></div></div>`;
    html+=`<div class="feed">`+feedVideos.map((v,i)=>`
      <div class="video"><img src="${v.img}"><div class="overlay"></div>
      <div style="position:absolute;top:95px;right:10px;background:rgba(0,0,0,.5);padding:5px 10px;border-radius:20px;font-size:11px">Tap for Sound</div>
      <div class="side">
        <button onclick="switchAccFromFeed()"> <span style="font-size:22px;background:linear-gradient(90deg,#ff2d55,#00e5ff);width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900">V</span></button>
        <button onclick="toggleLike(${v.id})" style="color:${v.liked?'#ff2d55':'#fff'}">${v.liked?'❤️':'🤍'}</button><span>${v.likes}</span>
        <button onclick="alert('Comments: ${v.comments}')">💬</button><span>${v.comments}</span>
        <button onclick="showShare=${v.id};render()">↗️</button><span>Share</span>
        <button onclick="showAI=true;render()">✨</button><span>AI</span>
      </div>
      <div class="info"><b>${v.user}</b><p>${v.caption}</p><p style="color:#aaa;font-size:11px">🎵 Original Sound - VIBRA</p></div>
      </div>`).join('')+`</div>`;
  }
  if(page==='me'){
    let mine=myVideos(); let tl=totalLikes();
    html+=`<div style="padding:16px;padding-bottom:90px;overflow-y:auto;height:100dvh;background:#fff;color:#000">
    <div style="display:flex;justify-content:space-between;align-items:center"><span onclick="page='home';render()">←</span><b>Me</b><span onclick="showSettings=true;render()" style="font-size:20px">⚙️</span></div>
    <center><div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(90deg,#ff2d55,#00e5ff);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#fff;margin-top:14px;overflow:hidden">${currentAcc.dp?`<img src="${currentAcc.dp}" style="width:100%;height:100%;object-fit:cover">`:'V'}</div>
    <div style="margin-top:8px"><button class="chip" onclick="showAddAcc=true;render()">📷 Change DP - Badilisha Picha</button></div>
    <b style="display:block;margin-top:8px">${currentAcc.name}</b><span style="color:#888;font-size:12px">${currentAcc.user}</span>
    <div style="display:flex;justify-content:center;gap:28px;margin-top:10px;text-align:center"><div><b>0</b><div style="font-size:11px;color:#888">Following</div></div><div><b>0</b><div style="font-size:11px;color:#888">Follower</div></div><div><b>${tl}</b><div style="font-size:11px;color:#888">Likes</div></div></div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button class="chip">Offline videos</button><button class="chip">Media player</button></div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="chip" style="color:#00bcd4;border:1px solid #00bcd4">EDIT TEXT / BIO</button><button class="chip" style="color:red;border:1px solid red" onclick="currentAcc.bio='';render()">DELETE TEXT</button></div>
    <p style="font-size:12px;color:#555;margin-top:6px">${currentAcc.bio}</p></center>
    <div class="grid3" style="margin-top:14px">${mine.map(v=>`<div style="position:relative"><img src="${v.img}"><span style="position:absolute;top:4px;right:4px;font-size:12px">❤️ ${v.likes}</span></div>`).join('') || '<p style="grid-column:1/4;text-align:center;color:#888">Hakuna video bado. Bonyeza + ku-upload</p>'}</div>
    </div>`;
  }
  if(page==='ai'){ html+=`<div style="padding:14px;height:100dvh;display:flex;flex-direction:column;background:#000"><div style="display:flex;justify-content:space-between"><b class="VT">✨ VIBRA AI</b><span onclick="page='home';render()">✕</span></div><p style="font-size:11px;color:#aaa;margin:6px 0">English and Swahili only. Ask in Swahili, answer in Swahili. Ask in English, answer in English. Send picture or voice like Meta AI.</p><div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px">${aiChats.map(c=>`<div style="align-self:${c.role==='me'?'flex-end':'flex-start'};max-width:85%;background:${c.role==='me'?'#ff2d55':'#222'};padding:10px 12px;border-radius:14px;font-size:13px;line-height:1.5">${c.text}</div>`).join('')}<button onclick="aiChats=[aiChats[0]];render()" style="background:red;color:#fff;padding:5px 10px;border-radius:10px;font-size:11px;align-self:flex-start">Delete</button></div><p style="font-size:11px;color:#ffcc00;margin:8px 0">👉 Maswali ya Haraka - Bonyeza moja, AI inajibu mara moja, huhitaji kuandika:</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">${quickQs.map(q=>`<button class="pill" onclick="askAI('${q.replace(/'/g,"\\'")}')">${q}</button>`).join('')}</div><div style="display:flex;gap:8px"><button style="background:#222;width:42px;height:42px;border-radius:50%;font-size:18px">📷</button><button style="background:#222;width:42px;height:42px;border-radius:50%;font-size:18px">🎤</button><input id="aiIn" value="${aiInput}" oninput="aiInput=this.value" placeholder="Ask VIBRA AI... au tuma picha / voice" style="flex:1;background:#111;border:1px solid #00e5ff;border-radius:20px;padding:10px;color:#fff"><button onclick="askAI()" style="background:linear-gradient(90deg,#ff2d55,#00e5ff);color:#fff;padding:10px 16px;border-radius:20px;font-weight:800">Send</button></div></div>`; }
  html+=`<div class="bottom">
    <button class="${page==='home'?'on':''}" onclick="page='home';render()">🏠<span>Home</span></button>
    <button onclick="alert('Discover - Tafuta video mpya')">🔍<span>Discover</span></button>
    <button onclick="uploadVideo()"><span class="plus">+</span></button>
    <button class="${page==='ai'?'on':''}" onclick="page='ai';render()">✨<span>VIBRA AI</span></button>
    <button onclick="alert('Inbox')">💬<span>Inbox</span></button>
    <button class="${page==='me'?'on':''}" onclick="page='me';render()">👤<span>Me</span></button>
  </div>`;

  // SHARE - YOTE
  if(showShare!==null){
    let v=videos.find(x=>x.id===showShare)||videos[0];
    let link=location.href; let txt=encodeURIComponent(v.caption+' - VIBRA');
    html+=`<div class="modal" onclick="if(event.target===this){showShare=null;render()}"><div class="sheet"><div style="display:flex;justify-content:space-between"><b class="VT">Share Video</b><span onclick="showShare=null;render()">✕</span></div><p style="font-size:11px;color:#aaa;margin:6px 0">${v.caption}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px">
    <button class="btn2" style="background:#25D366" onclick="window.open('https://wa.me/?text=${txt}%20${encodeURIComponent(link)}','_blank')">💬<br>WhatsApp</button>
    <button class="btn2" style="background:#1877F2" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}','_blank')">f<br>Facebook</button>
    <button class="btn2" style="background:#E1306C" onclick="navigator.clipboard.writeText('${link}');alert('Link imecopiwa! Fungua Instagram > Story / DM > Paste');window.open('https://www.instagram.com/','_blank')">📸<br>Instagram</button>
    <button class="btn2" style="background:#0088cc" onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(link)}&text=${txt}','_blank')">✈️<br>Telegram</button>
    <button class="btn2" style="background:#10a37f" onclick="window.open('https://chatgpt.com/?q=${txt}','_blank')">🤖<br>ChatGPT</button>
    <button class="btn2" style="background:#000;border:1px solid #fff" onclick="window.open('https://www.capcut.com/','_blank')">✂️<br>CapCut</button>
    <button class="btn2" onclick="navigator.clipboard.writeText('${link}');alert('Link imecopiwa!')">🔗<br>Copy Link</button>
    <button class="btn2" style="background:linear-gradient(90deg,#ff2d55,#00e5ff)" onclick="if(navigator.share){navigator.share({title:'VIBRA',text:'${v.caption}',url:'${link}'})}else{navigator.clipboard.writeText('${link}');alert('Link imecopiwa')}">•••<br>More</button>
    </div><p style="font-size:10px;color:#888;margin-top:10px">Instagram: Link itacopiwa, paste kwenye Story / DM. CapCut: Itafungua CapCut uedit video.</p></div></div>`;
  }

  // SETTINGS + ADD ACCOUNT
  if(showSettings){
    html+=`<div class="modal"><div class="sheet"><div style="display:flex;justify-content:space-between"><b>Settings</b><span onclick="showSettings=false;render()">✕</span></div>
    <p style="font-size:12px;color:#aaa;margin:8px 0">Accounts zako - Badilisha bila kutoka</p>
    ${accounts.map(a=>`<div class="acct"><img src="${a.dp}"><div style="flex:1"><b style="font-size:13px">${a.name}</b><div style="font-size:11px;color:#aaa">${a.user} ${a.active?'• Active ✅':''}</div></div>${!a.active?`<button class="chip" onclick="switchAcc(${a.id})">Switch</button>`:''}<button class="chip" style="color:red" onclick="removeAcc(${a.id})">✕</button></div>`).join('')}
    <button class="btn" onclick="showSettings=false;showAddAcc=true;render()">+ Add Account / Ongeza Account</button>
    <button class="btn2" onclick="alert('Privacy, Notifications, Language - Swahili / English')">Privacy & Notifications</button>
    <button class="btn2" onclick="showSettings=false;page='me';render()">Back to Profile</button>
    </div></div>`;
  }
  if(showAddAcc){
    html+=`<div class="modal"><div class="sheet"><div style="display:flex;justify-content:space-between"><b>+ Add Account</b><span onclick="showAddAcc=false;render()">✕</span></div><p style="font-size:11px;color:#aaa">Andika jina, username na picha. Account ya zamani haitapotea.</p>
    <input id="newName" placeholder="Jina - mfano Mr Vibra 2"><input id="newUser" placeholder="@username"><input id="newDP" placeholder="Link ya picha (hiari)"><input id="newBio" placeholder="Bio">
    <button class="btn" onclick="addAcc()">Add Account - Ongeza</button><button class="btn2" onclick="showAddAcc=false;render()">Cancel</button></div></div>`;
  }
  document.getElementById('app').innerHTML=html;
}
function toggleLike(id){let v=videos.find(x=>x.id===id); v.liked=!v.liked; v.likes+=v.liked?1:-1; save(); render();}
function switchAcc(id){accounts.forEach(a=>a.active=(a.id===id)); currentAcc=accounts.find(a=>a.active); save(); showSettings=false; page='me'; render();}
function switchAccFromFeed(){showSettings=true;render();}
function removeAcc(id){if(accounts.length<=1){alert('Huwezi kufuta account pekee iliyobaki');return;} accounts=accounts.filter(a=>a.id!==id); if(!accounts.find(a=>a.active)){accounts[0].active=true;currentAcc=accounts[0];} else currentAcc=accounts.find(a=>a.active); save(); render();}
function addAcc(){let n=document.getElementById('newName').value||'New User'; let u=document.getElementById('newUser').value||'@user'+Date.now(); let dp=document.getElementById('newDP').value||'https://i.pravatar.cc/150?img='+(Math.floor(Math.random()*70)+1); let bio=document.getElementById('newBio').value||'Worldwide Vibes 🌍'; accounts.forEach(a=>a.active=false); let na={id:Date.now(),name:n,user:u.startsWith('@')?u:'@'+u,bio,dp,active:true}; accounts.push(na); currentAcc=na; save(); showAddAcc=false; page='me'; render(); alert('Account imeongezwa! Karibu '+n);}
function uploadVideo(){let cap=prompt('Andika caption ya video:'); if(!cap) return; let img=prompt('Weka link ya picha/video (au acha tupu):')||'https://picsum.photos/600/900?random='+Date.now(); videos.unshift({id:Date.now(),user:currentAcc.user,name:currentAcc.name,caption:cap,img,likes:0,comments:0,liked:false}); save(); page='me'; render();}
render();
</script>
</body>
</html>
