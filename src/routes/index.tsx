<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>VIBRA</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{background:#000;color:#fff;overflow:hidden;height:100vh;height:100dvh}
button{cursor:pointer;border:none;outline:none}
.top{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:center;gap:18px;padding:14px 10px 8px;background:linear-gradient(to bottom,rgba(0,0,0,.8),transparent);font-size:15px;font-weight:600}
.top span{color:#aaa;cursor:pointer;padding:4px 2px}
.top span.on{color:#fff;border-bottom:2px solid #fff}
.top .live{color:#ff2d55}
.feed{height:100vh;height:100dvh;overflow-y:scroll;scroll-snap-type:y mandatory}
.post{height:100vh;height:100dvh;scroll-snap-align:start;position:relative;background:#111;display:flex;align-items:center;justify-content:center;overflow:hidden}
.post img{width:100%;height:100%;object-fit:cover}
.post .grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 40%,transparent 70%,rgba(0,0,0,.4) 100%)}
.info{position:absolute;left:12px;bottom:90px;right:70px;z-index:5}
.info b{font-size:16px}
.info p{font-size:13px;color:#ddd;margin-top:6px;line-height:1.4}
.right{position:absolute;right:8px;bottom:110px;z-index:6;display:flex;flex-direction:column;gap:16px;align-items:center}
.act{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;color:#fff}
.act .circle{width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;font-size:22px;border:1px solid rgba(255,255,255,.2)}
.act small{font-size:11px;font-weight:700}
.act.liked .circle{color:#fe2c55}
.avatar{width:48px;height:48px;border-radius:50%;border:2px solid #fff;object-fit:cover}
.followbtn{background:#fe2c55;color:#fff;width:20px;height:20px;border-radius:50%;font-size:14px;margin-top:-12px;z-index:2;border:2px solid #000}
.bottom{position:fixed;bottom:0;left:0;right:0;z-index:60;background:#000;border-top:1px solid #222;display:flex;justify-content:space-around;padding:8px 0 calc(10px + env(safe-area-inset-bottom))}
.bottom button{background:none;color:#999;display:flex;flex-direction:column;align-items:center;font-size:10px;gap:2px}
.bottom button.on{color:#fff}
.bottom button i{font-size:22px;font-style:normal}
.plus{width:44px;height:28px;background:#fff;color:#000;border-radius:8px;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;position:relative}
.plus::before{content:"";position:absolute;inset:0;background:#25F4EE;border-radius:8px;z-index:-1;transform:translateX(-3px)}
.plus::after{content:"";position:absolute;inset:0;background:#FE2C55;border-radius:8px;z-index:-2;transform:translateX(3px)}
.modal{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.85);display:none;align-items:flex-end;justify-content:center}
.modal.open{display:flex}
.sheet{background:#151515;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;border-radius:20px 20px 0 0;padding:18px;padding-bottom:30px}
.sheet h3{font-size:17px;margin-bottom:4px}
.sheet .sub{font-size:12px;color:#aaa;margin-bottom:12px}
.close{float:right;background:none;color:#fff;font-size:20px}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:12px}
.shareBtn{background:#222;border-radius:14px;padding:14px 6px;display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font-size:11px}
.shareBtn span{font-size:24px}
.shareBtn:active{background:#333}
.me{padding:20px 14px 90px;overflow-y:auto;height:100vh}
.meHead{text-align:center;padding-top:10px}
.meHead img{width:92px;height:92px;border-radius:50%;object-fit:cover}
.meHead h2{margin-top:8px;font-size:18px}
.meHead p{font-size:12px;color:#aaa}
.stats{display:flex;justify-content:center;gap:28px;margin:16px 0}
.stats div{text-align:center}
.stats b{font-size:17px;display:block}
.stats span{font-size:11px;color:#888}
.btnRow{display:flex;gap:8px;justify-content:center}
.btnRow button{background:#222;color:#fff;padding:9px 18px;border-radius:6px;font-size:13px;font-weight:600}
.btnRow button.pink{background:#fe2c55}
.tabs{display:flex;justify-content:center;gap:24px;border-bottom:1px solid #222;margin-top:16px;padding-bottom:8px}
.tabs span{font-size:13px;color:#aaa;cursor:pointer}
.tabs span.on{color:#fff;font-weight:700}
.vgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px;margin-top:8px}
.vgrid div{aspect-ratio:9/13;background:#222;position:relative;overflow:hidden}
.vgrid img{width:100%;height:100%;object-fit:cover}
.vgrid small{position:absolute;bottom:4px;left:4px;font-size:11px;background:rgba(0,0,0,.6);padding:1px 5px;border-radius:4px}
.aiPills{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}
.aiPills button{background:#0a2a4a;color:#7ec8ff;border:1px solid #1a4a7a;padding:7px 10px;border-radius:20px;font-size:12px}
.chatBox{background:#0f0f0f;border-radius:12px;padding:10px;min-height:120px;max-height:220px;overflow-y:auto;font-size:13px;line-height:1.5}
.chatBox div{margin-bottom:8px}
.inputRow{display:flex;gap:8px;margin-top:10px}
.inputRow input{flex:1;background:#222;border:none;color:#fff;padding:11px;border-radius:20px;outline:none}
.inputRow button{background:#fe2c55;color:#fff;padding:0 16px;border-radius:20px;font-weight:700}
.setItem{background:#1c1c1c;padding:13px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;font-size:13px}
.setItem small{color:#aaa;display:block;font-size:11px}
.accRow{display:flex;align-items:center;gap:10px;background:#222;padding:10px;border-radius:10px;margin-bottom:8px}
.accRow img{width:38px;height:38px;border-radius:50%;object-fit:cover}
.accRow button{margin-left:auto;background:#fe2c55;color:#fff;padding:6px 10px;border-radius:6px;font-size:11px}
.addAcc{display:flex;gap:8px;margin-top:8px}
.addAcc input{flex:1;background:#222;border:none;color:#fff;padding:10px;border-radius:8px}
.addAcc button{background:#fff;color:#000;padding:10px 12px;border-radius:8px;font-weight:700}
</style>
</head>
<body>

<div class="top" id="topTabs">
  <span data-tab="following">Following</span>
  <span data-tab="foryou" class="on">For You</span>
  <span data-tab="live" class="live">● LIVE</span>
</div>

<div id="main"></div>

<div class="bottom">
  <button class="on" onclick="showPage('home',this)"><i>🏠</i>Home</button>
  <button onclick="showPage('live',this)"><i>📺</i>LIVE</button>
  <button onclick="openUpload()"><span class="plus">+</span></button>
  <button onclick="showPage('ai',this)"><i>✨</i>VIBRA AI</button>
  <button onclick="showPage('me',this)"><i>👤</i>Me</button>
</div>

<!-- SHARE MODAL -->
<div class="modal" id="shareModal">
  <div class="sheet">
    <button class="close" onclick="closeModal('shareModal')">✕</button>
    <h3>Share Video</h3>
    <div class="sub" id="shareCaption"></div>
    <div class="grid" id="shareGrid"></div>
    <p style="font-size:11px;color:#888;margin-top:12px;text-align:center">Instagram link itacopiwa, CapCut itafungua kuedit video.</p>
  </div>
</div>

<!-- AI MODAL / PAGE -->
<div class="modal" id="aiModal">
  <div class="sheet">
    <button class="close" onclick="closeModal('aiModal')">✕</button>
    <h3>✨ VIBRA AI</h3>
    <div class="sub">Ask VIBRA AI - Msaidizi wako wa VIBRA</div>
    <p style="font-size:11px;color:#aaa;margin-bottom:6px">Maswali ya Haraka - Bonyeza moja, AI inajibu mara moja, huhitaji kuandika</p>
    <div class="aiPills" id="aiPills"></div>
    <div class="chatBox" id="chatBox"><div><b>VIBRA AI:</b> Karibu! Bonyeza swali la blue juu, au andika swali lako chini.</div></div>
    <div class="inputRow"><input id="aiInput" placeholder="Ask VIBRA AI..."><button onclick="sendAI()">Send</button></div>
  </div>
</div>

<!-- SETTINGS / ACCOUNTS -->
<div class="modal" id="settingsModal">
  <div class="sheet">
    <button class="close" onclick="closeModal('settingsModal')">✕</button>
    <h3>Settings</h3>
    <div class="sub">Manage account & privacy</div>
    <div class="setItem"><span><b>Account Yako</b><small id="currentAccText">@vibra_user • Active</small></span><span>›</span></div>
    <h4 style="font-size:13px;margin:12px 0 8px">Accounts Zangu - Add Account</h4>
    <div id="accList"></div>
    <div class="addAcc"><input id="newAccName" placeholder="Jina la account mpya, mfano @john"><button onclick="addAccount()">+ Add Account</button></div>
    <p style="font-size:11px;color:#888;margin-top:8px">Bonyeza Switch kubadilisha account, bila kulog out.</p>
    <div class="setItem" style="margin-top:12px"><span>Push Notifications</span><span>ON</span></div>
    <div class="setItem"><span>Private Account</span><span>OFF</span></div>
    <div class="setItem"><span>Language</span><span>Kiswahili</span></div>
    <button onclick="logoutAcc()" style="width:100%;background:#333;color:#fff;padding:12px;border-radius:10px;margin-top:10px">Log Out</button>
  </div>
</div>

<script>
let videos=[
{id:1,user:"@vibra_user",name:"Vibra",caption:"Karibu VIBRA! 🔥 Video yangu ya kwanza. #vibra #tanzania",likes:12,comments:4,liked:false,img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",isMine:true},
{id:2,user:"@neema",name:"Neema",caption:"Dance challenge mpya! Unaeza? 💃 #dance",likes:245,comments:32,liked:false,img:"https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",isMine:false},
{id:3,user:"@vibra_user",name:"Vibra",caption:"Mombasa vibes 🌊 #mombasa",likes:8,comments:2,liked:false,img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",isMine:true},
{id:4,user:"@juma",name:"Juma",caption:"Jinsi ya kupata pesa mtandaoni 2026 💰",likes:189,comments:21,liked:false,img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",isMine:false},
{id:5,user:"@vibra_user",name:"Vibra",caption:"VIBRA AI ni moto! Uliza chochote ✨",likes:5,comments:1,liked:false,img:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",isMine:true},
];
let accounts=[{name:"@vibra_user",img:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",active:true},{name:"@vibra2",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",active:false}];
let currentUser="@vibra_user";
let currentTab="foryou";
let currentVideo=null;
let quickQs=["Who created Meta?","Njia za kupata pesa?","Jinsi ya kuwa maarufu TikTok?","Nipe caption ya video yangu","VIBRA ni nini?"];
let aiAnswers={
"Who created Meta?":"Meta iliundwa na Mark Zuckerberg mwaka 2004 kama Facebook, baadaye ikabadilishwa jina kuwa Meta mwaka 2021.",
"Njia za kupata pesa?":"Njia 3 rahisi: 1) TikTok Creator Rewards, 2) Affiliate marketing, 3) Kuuza bidhaa zako kupitia video.",
"Jinsi ya kuwa maarufu TikTok?":"Post video 1-2 kila siku, tumia trending sounds, jibu comments haraka, na video yako ya kwanza iwe na hook kali sekunde 2 za kwanza.",
"Nipe caption ya video yangu":"Jaribu hii: 'Siku niliyoamua kubadilisha maisha yangu 🔥 Follow kwa zaidi #vibra #motivation'",
"VIBRA ni nini?":"VIBRA ni app kama TikTok iliyotengenezwa Tanzania - unaweza kuangalia video, ku-live, na kuuliza VIBRA AI chochote."
};
function myVideos(){return videos.filter(v=>v.isMine)}
function totalLikes(){return myVideos().reduce((s,v)=>s+(v.likes||0),0)}
function renderFeed(){
  let list=videos;
  if(currentTab==="following") list=videos.filter(v=>v.user!=="@vibra_user" || v.isMine);
  if(currentTab==="live") list=videos.slice(0,2);
  let html='<div class="feed">';
  list.forEach(v=>{
    html+=`<div class="post"><img src="${v.img}"><div class="grad"></div>
    <div class="info"><b>${v.user}</b><p>${v.caption}</p><p style="font-size:12px">🎵 Original sound - ${v.name}</p></div>
    <div class="right">
      <div style="position:relative"><img class="avatar" src="${v.img}"><button class="followbtn" onclick="followUser(event)">+</button></div>
      <button class="act ${v.liked?'liked':''}" onclick="toggleLike(${v.id},this)"><span class="circle">${v.liked?'❤️':'🤍'}</span><small>${v.likes}</small></button>
      <button class="act" onclick="alert('Comments: ${v.comments} - Andika comment yako hapa!')"><span class="circle">💬</span><small>${v.comments}</small></button>
      <button class="act" onclick="openShare(${v.id})"><span class="circle">↗️</span><small>Share</small></button>
      <button class="act" onclick="openAI()"><span class="circle">✨</span><small>AI</small></button>
    </div></div>`;
  });
  html+='</div>';
  document.getElementById('main').innerHTML=html;
  document.querySelectorAll('#topTabs span').forEach(s=>s.classList.toggle('on',s.dataset.tab===currentTab));
}
function toggleLike(id,btn){
  videos=videos.map(v=>v.id===id?{...v,liked:!v.liked,likes:v.liked?v.likes-1:v.likes+1}:v);
  renderFeed();
  if(document.getElementById('mePage')) renderMe();
}
function followUser(e){e.stopPropagation();alert('Umemfollow!');}
function openShare(id){
  currentVideo=videos.find(v=>v.id===id);
  document.getElementById('shareCaption').innerText=currentVideo.caption;
  let link=location.href;
  let text=encodeURIComponent(currentVideo.caption+" - VIBRA");
  let url=encodeURIComponent(link);
  let grid=document.getElementById('shareGrid');
  grid.innerHTML=`
    <button class="shareBtn" onclick="window.open('https://wa.me/?text=${text}%20${url}')"><span>💚</span>WhatsApp</button>
    <button class="shareBtn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}')"><span>📘</span>Facebook</button>
    <button class="shareBtn" onclick="copyAndOpenInstagram()"><span>📸</span>Instagram</button>
    <button class="shareBtn" onclick="window.open('https://t.me/share/url?url=${url}&text=${text}')"><span>✈️</span>Telegram</button>
    <button class="shareBtn" onclick="window.open('https://chatgpt.com/?q=${text}')"><span>🤖</span>ChatGPT</button>
    <button class="shareBtn" onclick="window.open('https://www.capcut.com/')"><span>✂️</span>CapCut</button>
    <button class="shareBtn" onclick="copyLink()"><span>🔗</span>Copy Link</button>
    <button class="shareBtn" onclick="moreShare()"><span>•••</span>More</button>`;
  document.getElementById('shareModal').classList.add('open');
}
function copyAndOpenInstagram(){navigator.clipboard.writeText(location.href+" - "+(currentVideo?currentVideo.caption:"VIBRA"));alert('Link imecopiwa! Sasa fungua Instagram na paste kwenye Story / DM.');window.open('https://www.instagram.com/');}
function copyLink(){navigator.clipboard.writeText(location.href);alert('Link imecopiwa!');}
function moreShare(){if(navigator.share){navigator.share({title:'VIBRA',text:currentVideo.caption,url:location.href})}else{copyLink()}}
function openAI(){
  document.getElementById('aiModal').classList.add('open');
  document.getElementById('aiPills').innerHTML=quickQs.map(q=>`<button onclick="askQuick('${q}')">${q}</button>`).join('');
}
function askQuick(q){
  let box=document.getElementById('chatBox');
  box.innerHTML+=`<div><b>Wewe:</b> ${q}</div><div><b>VIBRA AI:</b> ${aiAnswers[q]||'Nimepokea swali lako, nakuandalia jibu kamili...'}</div>`;
  box.scrollTop=box.scrollHeight;
}
function sendAI(){
  let inp=document.getElementById('aiInput');
  if(!inp.value.trim())return;
  let q=inp.value; inp.value='';
  let box=document.getElementById('chatBox');
  box.innerHTML+=`<div><b>Wewe:</b> ${q}</div><div><b>VIBRA AI:</b> Swali zuri! Kuhusu "${q}" - jaribu kubonyeza maswali ya blue juu kwa majibu ya haraka, au niambie zaidi nikuwekee jibu kamili.</div>`;
  box.scrollTop=box.scrollHeight;
}
function showPage(page,btn){
  document.querySelectorAll('.bottom button').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  if(page==='home'){document.getElementById('topTabs').style.display='flex';renderFeed();}
  if(page==='live'){currentTab='live';document.getElementById('topTabs').style.display='flex';renderFeed();alert('LIVE - Karibu kwenye Live za VIBRA!');}
  if(page==='ai'){openAI();}
  if(page==='me'){renderMe();}
}
function renderMe(){
  document.getElementById('topTabs').style.display='none';
  let mine=myVideos();
  let html=`<div class="me" id="mePage">
    <div style="display:flex;justify-content:space-between"><b style="font-size:20px">VIBRA</b><button onclick="openSettings()" style="background:none;color:#fff;font-size:20px">⚙️ Settings</button></div>
    <div class="meHead"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"><h2>${currentUser}</h2><p>@${currentUser.replace('@','')} • Tanzania 🇹🇿</p></div>
    <div class="stats"><div><b>2</b><span>Following</span></div><div><b>12</b><span>Followers</span></div><div><b>${totalLikes()}</b><span>Likes</span></div></div>
    <p style="text-align:center;font-size:11px;color:#888;margin-bottom:10px">Likes = jumla ya likes watu wamekupatia kwenye video zako (${mine.length} video)</p>
    <div class="btnRow"><button class="pink" onclick="openSettings()">Edit Profile</button><button onclick="openSettings()">Settings</button><button onclick="openSettings()">+ Add Account</button></div>
    <div class="tabs"><span class="on">Videos</span><span>Liked ❤️</span><span>Saved</span></div>
    <div class="vgrid">${mine.map(v=>`<div><img src="${v.img}"><small>❤️ ${v.likes}</small></div>`).join('')||'<p style="grid-column:1/4;text-align:center;color:#888;padding:20px">Huna video bado. Bonyeza + ku-upload.</p>'}</div>
  </div>`;
  document.getElementById('main').innerHTML=html;
}
function openSettings(){
  document.getElementById('settingsModal').classList.add('open');
  renderAccounts();
}
function renderAccounts(){
  document.getElementById('currentAccText').innerText=currentUser+" • Active";
  document.getElementById('accList').innerHTML=accounts.map((a,i)=>`<div class="accRow"><img src="${a.img}"><div><b>${a.name}</b><br><small>${a.active?'Active sasa':'Bonyeza Switch'}</small></div><button onclick="switchAcc(${i})">${a.active?'Active':'Switch'}</button></div>`).join('');
}
function addAccount(){
  let inp=document.getElementById('newAccName');
  let name=inp.value.trim(); if(!name) return alert('Andika jina la account kwanza');
  if(!name.startsWith('@')) name='@'+name;
  accounts.push({name,img:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",active:false});
  inp.value=''; renderAccounts(); alert('Account '+name+' imeongezwa! Bonyeza Switch kuitumia.');
}
function switchAcc(i){
  accounts.forEach((a,idx)=>a.active=(idx===i));
  currentUser=accounts[i].name;
  renderAccounts(); alert('Umebadilisha kwenda '+currentUser);
  renderMe();
}
function logoutAcc(){alert('Umelog out. Karibu tena!');closeModal('settingsModal');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function openUpload(){alert('Upload Video - Chagua video kutoka Gallery yako ku-post kwenye VIBRA!');}
document.querySelectorAll('#topTabs span').forEach(s=>s.onclick=()=>{currentTab=s.dataset.tab;renderFeed();});
document.getElementById('aiInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendAI()});
renderFeed();
</script>
</body>
</html>
