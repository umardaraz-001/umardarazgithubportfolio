// ===========================================================
// Velvet — Application Logic
// Screen templates, mock data, local state, and navigation.
// This is a front-end prototype: all data below is mock/local
// state, not a real backend. See README.md for what that means.
// ===========================================================

/* ---------- visual helpers (unchanged design system) ---------- */
const GRADIENTS = [
  'linear-gradient(160deg,#3B2A6B,#7C3AED)',
  'linear-gradient(160deg,#5B1E4A,#D946EF)',
  'linear-gradient(160deg,#1E3A6B,#3B82F6)',
  'linear-gradient(160deg,#6B1E3A,#EC4899)',
  'linear-gradient(160deg,#2A1E6B,#8B5CF6)',
  'linear-gradient(160deg,#1E5A6B,#3B82F6)'
];
function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; } return h; }
/* ---- Velvet imagery: realistic photo masters, cover-fit (crop only, never stretched) ---- */
const VELVET_MASTERS = {"sofia": "P01", "maya": "P02", "liam": "P03", "ivy": "P04", "noah": "P05", "zara": "P06", "theo": "P07", "mia": "P08", "kai": "P09", "alexm": "P10"};
/* Realistic photo masters P01-P10. Scene slots (onboarding, live covers, live room) reuse these same masters. */
const VELVET_SCENES = {ob1:['P07','50% 22%'], ob2:['P08','50% 24%'], ob3:['P06','50% 24%'], ob4:['P09','50% 24%'], live1:['P02','50% 30%'], live2:['P07','50% 30%'], live3:['P06','50% 28%'], room1:['P02','50% 30%']};
const VELVET_POS = {P01:'50% 22%',P02:'50% 22%',P03:'50% 22%',P04:'50% 20%',P05:'50% 22%',P06:'50% 20%',P07:'50% 22%',P08:'50% 20%',P09:'50% 22%',P10:'50% 22%'};
function velvetImg(seed){
  if(VELVET_MASTERS[seed]){ const id = VELVET_MASTERS[seed]; return {src:'img/VELVET-'+id+'.webp', pos:VELVET_POS[id]}; }
  if(VELVET_SCENES[seed]){ const [id,pos] = VELVET_SCENES[seed]; return {src:'img/VELVET-'+id+'.webp', pos:pos}; }
  const m = /^(.+)([a-f])$/.exec(seed);
  if(m && VELVET_MASTERS[m[1]]) return {src:'img/VELVET-'+VELVET_MASTERS[m[1]]+'-G'+('abcdef'.indexOf(m[2])+1)+'.webp', pos:'50% 35%'};
  return null;
}
function ph(seed, opts={}){
  const g = GRADIENTS[hash(seed) % GRADIENTS.length];
  const h = opts.h || '100%';
  const r = opts.r || '0';
  const im = velvetImg(seed);
  if(im){
    return `<div class="ph" style="background:${g}; height:${h}; border-radius:${r};${opts.fill?' position:absolute; inset:0; width:100%;':''}">
    <img src="${im.src}" alt="" draggable="false" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:${im.pos};">${seed==='room1'?'<div style="position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 26%,rgba(0,0,0,0) 52%,rgba(0,0,0,0.82) 100%);"></div>':''}
  </div>`;
  }
  return `<div class="ph" style="background:${g}; height:${h}; border-radius:${r};">
    <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9V22h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" fill="rgba(255,255,255,0.55)"/></svg>
  </div>`;
}
const ICONS = {
  discover:`<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z"/>`,
  explore:`<circle cx="12" cy="12" r="9"/><path d="M15 9l-2.5 6-6 2.5 2.5-6z"/>`,
  live:`<circle cx="12" cy="12" r="3"/><path d="M5 5a11 11 0 000 14M19 5a11 11 0 010 14M8.5 8.5a5.5 5.5 0 000 7M15.5 8.5a5.5 5.5 0 010 7"/>`,
  messages:`<path d="M4 5h16v11H8l-4 4V5z"/>`,
  profile:`<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`
};
function tabbar(active){
  const tabs = [['discover','Discover'],['explore','Explore'],['live','Live'],['messages','Messages'],['profile','Profile']];
  return `<div class="tabbar">${tabs.map(([id,label])=>`
    <div class="tab ${active===id?'active':''}" onclick="go('${id}')">
      <svg viewBox="0 0 24 24" stroke="${active===id?'url(#tabGrad)':'currentColor'}">${ICONS[id]}</svg>
      <span>${label}</span>
    </div>`).join('')}</div>`;
}
function statusbar(){ return `<div class="statusbar"><span class="fake-clock">9:41</span><span class="fake-icons">●●● 5G 🔋</span></div>`; }
function topbar(inner){ return `<div class="topbar">${inner}</div>`; }
function icon(name){
  const set = {
    bell:`<path d="M12 3a5 5 0 00-5 5v3.5L5 15h14l-2-3.5V8a5 5 0 00-5-5z"/><path d="M9.5 18a2.5 2.5 0 005 0"/>`,
    crown:`<path d="M4 8l3 3 5-6 5 6 3-3-1.5 10h-13z"/>`,
    x:`<path d="M6 6l12 12M18 6L6 18"/>`,
    star:`<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6z"/>`,
    heart:`<path d="M12 20s-7-4.4-9.5-9C.6 7.6 2.4 4 6 4c2.1 0 3.5 1.2 4.5 2.6C11.5 5.2 12.9 4 15 4c3.6 0 5.4 3.6 3.5 7-2.5 4.6-9.5 9-9.5 9z"/>`,
    bolt:`<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>`,
    back:`<path d="M15 5l-7 7 7 7"/>`,
    more:`<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>`,
    call:`<path d="M6 4l3 1 1 3-2 2c1 2.5 2.5 4 5 5l2-2 3 1 1 3c-1 1-2 2-4 2-6 0-11-5-11-11 0-2 1-3 2-4z"/>`,
    video:`<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10l6-3v10l-6-3z"/>`,
    search:`<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
    mic:`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>`,
    cam:`<rect x="3" y="7" width="14" height="11" rx="2"/><path d="M17 10l4-2v8l-4-2z"/>`,
    gift:`<rect x="3" y="9" width="18" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-1.5-4-6-4-6-1s3 1 6 1zM12 9c1.5-4 6-4 6-1s-3 1-6 1z"/>`,
    coin:`<circle cx="12" cy="12" r="8"/><path d="M9.5 15V9M14.5 15V9M9.5 12h5"/>`,
    shield:`<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>`,
    check:`<path d="M5 13l4 4 10-10"/>`,
    send:`<path d="M4 12l16-8-6 16-3-6z"/>`,
    plus:`<path d="M12 5v14M5 12h14"/>`,
    location:`<path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>`,
    settings:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>`
  };
  return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${set[name]||''}</svg>`;
}

/* ===========================================================
   MOCK DATA — stands in for a real backend during local testing.
   Everything below is local JS state, held in memory only.
   Refreshing the page resets it back to these starting values.
   =========================================================== */
const MOCK_PROFILES = [
  { seed:'sofia', name:'Sofia', age:24, distance:'2.4 km away', role:'Designer · Traveler', compat:92, online:true, willMatch:true,
    tags:['Travel','Music','Photography'], interests:['Travel','Design','Coffee','Photography','Hiking'],
    bio:"Product designer by day, terrible karaoke singer by night. Always planning the next trip.",
    compatBreak:{Personality:94,Interests:91,Lifestyle:89,Location:96},
    prompt:"Farmers market, a long walk with no destination, and a movie I've already seen." },
  { seed:'maya', name:'Maya', age:26, distance:'4.1 km away', role:'Chef · Foodie', compat:88, online:true, willMatch:false,
    tags:['Cooking','Wine','Jazz'], interests:['Cooking','Wine tasting','Jazz','Markets','Travel'],
    bio:"I'll cook for you if you do the dishes. Fair trade.",
    compatBreak:{Personality:85,Interests:90,Lifestyle:88,Location:90},
    prompt:"Sunday: farmers market, then a slow dinner with too many courses." },
  { seed:'liam', name:'Liam', age:29, distance:'1.2 km away', role:'Architect', compat:81, online:false, willMatch:false,
    tags:['Design','Cycling','Coffee'], interests:['Architecture','Cycling','Coffee','Design','Running'],
    bio:"I notice buildings more than I notice people. Working on that.",
    compatBreak:{Personality:80,Interests:83,Lifestyle:78,Location:85},
    prompt:"A long bike ride somewhere I've never been, then a good flat white." },
  { seed:'ivy', name:'Ivy', age:23, distance:'3.6 km away', role:'Photographer', compat:95, online:true, willMatch:true,
    tags:['Art','Travel','Film'], interests:['Film photography','Travel','Museums','Vinyl','Hiking'],
    bio:"Shoot film, hoard vinyl, always down for a spontaneous trip.",
    compatBreak:{Personality:96,Interests:94,Lifestyle:93,Location:97},
    prompt:"A place I want to visit... Lisbon, for the light and the tile work." },
  { seed:'noah', name:'Noah', age:31, distance:'6.0 km away', role:'Musician', compat:78, online:false, willMatch:false,
    tags:['Music','Guitar','Concerts'], interests:['Guitar','Concerts','Vinyl','Coffee','Writing'],
    bio:"Play in a band nobody's heard of yet. Give it time.",
    compatBreak:{Personality:79,Interests:80,Lifestyle:75,Location:78},
    prompt:"Something I can't live without... my guitar, obviously." },
  { seed:'zara', name:'Zara', age:27, distance:'2.9 km away', role:'Marketer', compat:84, online:true, willMatch:false,
    tags:['Yoga','Travel','Food'], interests:['Yoga','Travel','Food markets','Reading','Dogs'],
    bio:"Will talk your ear off about the book I just finished.",
    compatBreak:{Personality:86,Interests:82,Lifestyle:84,Location:84},
    prompt:"My perfect weekend... yoga, a good book, and a long dinner with friends." },
  { seed:'theo', name:'Theo', age:28, distance:'5.1 km away', role:'DJ', compat:74, online:false, willMatch:false,
    tags:['Music','Nightlife','Travel'], interests:['DJing','Vinyl','Travel','Festivals','Cooking'],
    bio:"Runs a Sunday playlist swap. Bring your worst song, I'll bring mine.",
    compatBreak:{Personality:75,Interests:76,Lifestyle:70,Location:74},
    prompt:"A place I want to visit... Tokyo, for the record shops." },
  { seed:'mia', name:'Mia', age:25, distance:'1.8 km away', role:'Nurse', compat:90, online:false, willMatch:false,
    tags:['Fitness','Hiking','Dogs'], interests:['Running','Hiking','Dogs','Baking','True crime podcasts'],
    bio:"Save lives at work, burn banana bread at home.",
    compatBreak:{Personality:91,Interests:89,Lifestyle:90,Location:92},
    prompt:"Something I can't live without... my running shoes." },
  { seed:'kai', name:'Kai', age:30, distance:'7.3 km away', role:'Product Manager', compat:70, online:true, willMatch:false,
    tags:['Tech','Chess','Coffee'], interests:['Chess','Coffee','Board games','Running','Tech'],
    bio:"Will absolutely try to teach you chess on a first date.",
    compatBreak:{Personality:71,Interests:70,Lifestyle:68,Location:72},
    prompt:"My perfect weekend... a chess tournament I definitely won't win." }
];

const PROFILE_ME = { name:'Alex Rivera', age:26, location:'New York, NY', seed:'alexm', bio:"Say hi — I don't bite.",
  followers:842, following:310, likes:'1.2K', matches:46 };

const CONVERSATIONS = {
  sofia: { name:'Sofia', seed:'sofia', online:true, unread:true, messages:[
    {from:'them', text:'Hey! Loved your photo from Kyoto 🍁'},
    {from:'me', text:'Thank you! Have you been?'},
    {from:'them', text:"Not yet, it's on my list for next spring 🌸"},
    {from:'me', text:'We should compare notes over coffee ☕'}
  ]},
  maya: { name:'Maya', seed:'maya', online:true, unread:true, messages:[
    {from:'them', text:"Haha that's hilarious 😂"}
  ]},
  liam: { name:'Liam', seed:'liam', online:false, unread:false, messages:[
    {from:'them', text:'See you Friday then!'}
  ]},
  ivy: { name:'Ivy', seed:'ivy', online:false, unread:false, messages:[
    {from:'them', text:'Sent a photo 📷'}
  ]}
};
let activeChatId = 'sofia';
let chatTyping = false;
const CANNED_REPLIES = ['Haha nice 😄','Tell me more!','That sounds great ✨',"I was just thinking about that too",'😍',"Let's do it!",'Ha, fair point.'];

const NEW_MATCHES = [
  { seed:'zara', name:'Zara' },
  { seed:'kai', name:'Kai' }
];
let MESSAGE_REQUESTS = [
  { seed:'theo', name:'Theo', text:'Hey, saw we both love vinyl — what are you spinning lately?' }
];

let NOTIFICATIONS = [
  { id:1, seed:'sofia', text:'Sofia liked your profile ❤️', time:'2m', unread:true, kind:'like' },
  { id:2, seed:'ivy', text:'You matched with Ivy! 🎉', time:'1h', unread:true, kind:'match' },
  { id:3, seed:'maya', text:'Maya sent you a Rose 🌹', time:'3h', unread:false, kind:'gift' },
  { id:4, seed:'theo', text:'Theo started a live room', time:'5h', unread:false, kind:'live' },
  { id:5, seed:'zara', text:'Zara commented on your photo', time:'1d', unread:false, kind:'social' }
];

const GIFT_CATALOG = [
  {e:'🌹', n:'Rose', p:20, cat:'Romantic'},
  {e:'💎', n:'Diamond', p:500, cat:'Luxury'},
  {e:'👑', n:'Crown', p:1000, cat:'Luxury'},
  {e:'🎆', n:'Fireworks', p:150, cat:'Popular'},
  {e:'🧸', n:'Teddy Bear', p:80, cat:'Cute'},
  {e:'🏎️', n:'Luxury Car', p:5000, cat:'Luxury'},
  {e:'🌌', n:'Galaxy', p:2200, cat:'Popular'},
  {e:'❤️', n:'Heart', p:10, cat:'Romantic'},
  {e:'🦆', n:'Rubber Duck', p:15, cat:'Funny'}
];

let BLOCKED_USERS = [ { seed:'kai', name:'Kai' } ];

/* ---------- mutable app / UI state ---------- */
let deckIndex = 0;
let matchedProfile = null;
let viewingProfile = null;
let coinBalance = 2450;
let userPlan = 'free';                 // 'free' | 'plus' | 'pro'
let exploreQuery = '';
let exploreCategory = 'Nearby';
let giftCategory = 'Popular';
let messagesTab = 'chats';             // 'chats' | 'matches' | 'requests'
let profileTab = 'photos';             // 'photos' | 'posts' | 'stories'
let notifFilter = 'All';
let authMode = 'signup';               // 'signup' | 'login'
let settingsState = { push:true, onlineStatus:true, incognito:false, location:true };
let settingsLanguage = 'English';
let liveMicMuted = false;
let activeModal = null;                // function returning modal HTML, or null
let activeToast = null;                // {msg, type}
let callTimerInterval = null;

function userIsPremium(){ return userPlan !== 'free'; }

/* ---------- toast + modal (rendered as part of the current screen) ---------- */
function showToast(msg, type='success'){
  activeToast = { msg, type };
  renderPhone();
  const myToast = activeToast;
  setTimeout(()=>{ if(activeToast === myToast){ activeToast = null; renderPhone(); } }, 2400);
}
function toastHtml(){
  if(!activeToast) return '';
  const good = activeToast.type !== 'error';
  return `<div style="position:absolute; top:calc(14px + var(--sat)); left:16px; right:16px; z-index:260; display:flex; justify-content:center;">
    <div style="background:${good?'#132A1B':'#2A1416'}; border:1px solid ${good?'rgba(34,197,94,0.4)':'rgba(239,68,68,0.4)'}; color:white; padding:10px 18px; border-radius:100px; font-size:12.5px; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,0.4); text-align:center;">${activeToast.msg}</div>
  </div>`;
}
function openModal(builderFn){ activeModal = builderFn; renderPhone(); }
function closeModal(){ activeModal = null; renderPhone(); }
function modalHtml(){
  if(!activeModal) return '';
  return `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
    <div class="modal-panel">
      <div class="modal-handle"></div>
      ${activeModal()}
    </div>
  </div>`;
}
let activeModalActions = [];
function actionSheet(title, actions){
  activeModalActions = actions.map(a=>a.onClick);
  return `<div style="font-family:var(--font-head); font-weight:700; font-size:16px; margin-bottom:16px;">${title}</div>
  <div style="display:flex; flex-direction:column; gap:8px;">
    ${actions.map((a,i)=>`<button class="btn ${a.danger?'btn-outline':'btn-ghost'} btn-block" style="${a.danger?'color:var(--error); border-color:rgba(239,68,68,0.35);':''}" onclick="runModalAction(${i})">${a.label}</button>`).join('')}
    <button class="btn btn-ghost btn-block" onclick="closeModal()">Cancel</button>
  </div>`;
}
function runModalAction(i){
  const fn = activeModalActions[i];
  if(typeof fn === 'function') fn();
}

/* ---------- discover: swipe deck ---------- */
function currentDeckProfile(){ return MOCK_PROFILES[deckIndex] || null; }
function swipe(action){
  const profile = currentDeckProfile();
  if(!profile) return;
  if((action==='like' || action==='superlike') && profile.willMatch){
    matchedProfile = profile;
    deckIndex++;
    go('match');
    return;
  }
  if(action==='like' || action==='superlike'){ showToast(`${action==='superlike'?'Super liked':'Liked'} ${profile.name}`); }
  deckIndex++;
  renderPhone();
}
function resetDeck(){ deckIndex = 0; renderPhone(); }
function viewProfile(seed){
  viewingProfile = MOCK_PROFILES.find(p=>p.seed===seed) || MOCK_PROFILES[0];
  go('profileDetail');
}
function swipeFromDetail(action){
  const p = viewingProfile;
  if(!p){ goBack(); return; }
  if(action==='like' && p.willMatch){ matchedProfile = p; go('match'); return; }
  showToast(action==='like' ? `Like sent to ${p.name}` : 'Passed');
  goBack();
}

/* ---------- messaging ---------- */
function openChat(seed){
  if(!CONVERSATIONS[seed]){
    const p = MOCK_PROFILES.find(x=>x.seed===seed);
    CONVERSATIONS[seed] = { name: p ? p.name : seed, seed, online: p ? p.online : false, unread:false, messages:[] };
  }
  CONVERSATIONS[seed].unread = false;
  activeChatId = seed;
  go('chat');
}
function sendMessage(){
  const inputEl = document.getElementById('chatInput');
  if(!inputEl) return;
  const text = inputEl.value.trim();
  if(!text) return;
  const convo = CONVERSATIONS[activeChatId];
  convo.messages.push({from:'me', text});
  inputEl.value = '';
  chatTyping = true;
  renderPhone();
  scrollChatToBottom();
  const replyDelay = 900 + Math.random()*700;
  const chatIdAtSend = activeChatId;
  setTimeout(()=>{
    chatTyping = false;
    if(current === 'chat' && activeChatId === chatIdAtSend){
      convo.messages.push({from:'them', text: CANNED_REPLIES[Math.floor(Math.random()*CANNED_REPLIES.length)]});
    }
    renderPhone();
    scrollChatToBottom();
  }, replyDelay);
}
function scrollChatToBottom(){
  requestAnimationFrame(()=>{
    const list = document.getElementById('chatMessages');
    if(list) list.scrollTop = list.scrollHeight;
  });
}
function setMessagesTab(t){ messagesTab = t; renderPhone(); }
function acceptRequest(seed){
  const req = MESSAGE_REQUESTS.find(r=>r.seed===seed);
  MESSAGE_REQUESTS = MESSAGE_REQUESTS.filter(r=>r.seed!==seed);
  if(req && !CONVERSATIONS[seed]){
    CONVERSATIONS[seed] = { name:req.name, seed, online:true, unread:false, messages:[{from:'them', text:req.text}] };
  }
  openChat(seed);
}
function declineRequest(seed){ MESSAGE_REQUESTS = MESSAGE_REQUESTS.filter(r=>r.seed!==seed); renderPhone(); }

/* ---------- explore search/filter (focus-safe re-render) ---------- */
function setExploreQuery(v){
  exploreQuery = v;
  const el = document.getElementById('exploreSearchInput');
  const hadFocus = document.activeElement && document.activeElement.id === 'exploreSearchInput';
  const caret = hadFocus ? el.selectionStart : null;
  renderPhone();
  if(hadFocus){
    const el2 = document.getElementById('exploreSearchInput');
    if(el2){ el2.focus(); if(caret!=null) el2.setSelectionRange(caret, caret); }
  }
}
function setExploreCategory(c){ exploreCategory = c; renderPhone(); }

/* ---------- gifts ---------- */
function setGiftCategory(c){ giftCategory = c; renderPhone(); }
function sendGift(emoji, name, price){
  if(coinBalance < price){ showToast(`Not enough coins for ${name}`, 'error'); return; }
  coinBalance -= price;
  showToast(`${emoji} Sent ${name}! -${price} coins`);
  renderPhone();
}

/* ---------- premium / subscription ---------- */
function setPremiumBilling(period){ screens.premium.billing = period; renderPhone(); }
function upgradePlan(planName){
  userPlan = planName.toLowerCase();
  showToast(`You're now on ${planName}! ✨`);
  renderPhone();
}

/* ---------- boost ---------- */
function activateBoost(){
  showToast('🚀 Profile boosted! You are now 10x more visible.');
  setTimeout(()=>{ if(current === 'boost') go('discover'); }, 1200);
}

/* ---------- live room ---------- */
function toggleLiveMic(){ liveMicMuted = !liveMicMuted; renderPhone(); }
function sendLiveReaction(emoji){ showToast(`${emoji} sent`); }

/* ---------- profile ---------- */
function setProfileTab(t){ profileTab = t; renderPhone(); }
function openEditProfile(){
  openModal(()=>`
    <div style="font-family:var(--font-head); font-weight:700; font-size:16px; margin-bottom:16px;">Edit Profile</div>
    <div style="display:flex; flex-direction:column; gap:12px;">
      <input id="editName" value="${PROFILE_ME.name}" placeholder="Name" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px 16px; color:white; font-size:14px;">
      <textarea id="editBio" placeholder="Bio" rows="3" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px 16px; color:white; font-size:14px; resize:none; font-family:inherit;">${PROFILE_ME.bio}</textarea>
      <button class="btn btn-primary btn-block" onclick="saveProfileEdit()">Save Changes</button>
      <button class="btn btn-ghost btn-block" onclick="closeModal()">Cancel</button>
    </div>`);
}
function saveProfileEdit(){
  const name = document.getElementById('editName');
  const bio = document.getElementById('editBio');
  if(name && name.value.trim()) PROFILE_ME.name = name.value.trim();
  if(bio) PROFILE_ME.bio = bio.value.trim();
  closeModal();
  showToast('Profile updated');
}

/* ---------- settings ---------- */
function toggleSetting(key){
  if(key === 'incognito' && !userIsPremium()){ showToast('Incognito Mode is a Pro feature', 'error'); return; }
  settingsState[key] = !settingsState[key];
  renderPhone();
}
function setLanguage(v){ settingsLanguage = v; renderPhone(); }
function openBlockedUsers(){
  openModal(()=>`
    <div style="font-family:var(--font-head); font-weight:700; font-size:16px; margin-bottom:16px;">Blocked Users</div>
    ${BLOCKED_USERS.length===0 ? `<div style="color:var(--gray); font-size:13px; text-align:center; padding:20px 0;">No blocked users.</div>` :
      BLOCKED_USERS.map(u=>`
      <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="width:40px;height:40px;border-radius:50%; overflow:hidden;">${ph(u.seed,{h:'100%'})}</div>
        <div style="flex:1; font-size:13.5px; font-weight:600;">${u.name}</div>
        <button class="btn btn-ghost btn-sm" onclick="unblockUser('${u.seed}')">Unblock</button>
      </div>`).join('')}
    <button class="btn btn-ghost btn-block" style="margin-top:16px;" onclick="closeModal()">Close</button>`);
}
function unblockUser(seed){
  BLOCKED_USERS = BLOCKED_USERS.filter(u=>u.seed!==seed);
  showToast('User unblocked');
  openBlockedUsers();
}
function confirmLogout(){
  openModal(()=>`
    <div style="font-family:var(--font-head); font-weight:700; font-size:16px; margin-bottom:8px;">Log out of Velvet?</div>
    <div style="color:var(--gray); font-size:13px; margin-bottom:18px;">You can log back in anytime.</div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-outline btn-block" style="color:var(--error); border-color:rgba(239,68,68,0.35);" onclick="doLogout()">Log Out</button>
      <button class="btn btn-ghost btn-block" onclick="closeModal()">Cancel</button>
    </div>`);
}
function doLogout(){
  closeModal();
  authMode = 'login';
  go('auth');
}
function comingSoon(label){ showToast(`${label} — coming soon`); }

/* ---------- notifications ---------- */
function unreadNotifCount(){ return NOTIFICATIONS.filter(n=>n.unread).length; }
function markNotificationRead(id){ const n = NOTIFICATIONS.find(x=>x.id===id); if(n) n.unread=false; }
function markAllNotificationsRead(){ NOTIFICATIONS.forEach(n=>n.unread=false); renderPhone(); }
function setNotifFilter(f){ notifFilter = f; renderPhone(); }
function openNotification(id){
  const n = NOTIFICATIONS.find(x=>x.id===id);
  if(!n) return;
  markNotificationRead(id);
  if(n.kind==='like' || n.kind==='match'){ viewProfile(n.seed); }
  else if(n.kind==='gift'){ openChat(n.seed); }
  else if(n.kind==='live'){ go('live'); }
  else { renderPhone(); }
}

/* ---------- auth ---------- */
function setAuthMode(m){ authMode = m; renderPhone(); }
function submitAuth(){
  const setErr = (id, msg) => { const el = document.getElementById(id); if(el) el.textContent = msg || ''; };
  setErr('fullNameError',''); setErr('emailError',''); setErr('passwordError','');
  const nameEl = document.getElementById('fullNameInput');
  const email = (document.getElementById('emailInput')||{value:''}).value.trim();
  const pass = (document.getElementById('passwordInput')||{value:''}).value;
  let ok = true;
  if(authMode==='signup' && (!nameEl || nameEl.value.trim().length < 2)){ setErr('fullNameError','Enter your full name'); ok = false; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr('emailError','Enter a valid email address'); ok = false; }
  if(pass.length < 6){ setErr('passwordError','Password must be at least 6 characters'); ok = false; }
  if(!ok) return;
  showToast(authMode==='signup' ? 'Account created!' : 'Welcome back!');
  go('discover');
}

/* ---------- calls ---------- */
function startCallTimer(){
  clearInterval(callTimerInterval);
  let secs = 0;
  const el0 = document.getElementById('callTimer');
  if(el0) el0.textContent = '00:00';
  callTimerInterval = setInterval(()=>{
    secs++;
    const el = document.getElementById('callTimer');
    if(!el){ clearInterval(callTimerInterval); callTimerInterval=null; return; }
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    el.textContent = `${m}:${s}`;
  }, 1000);
}

/* ---------- SCREENS ---------- */
const screens = {};

screens.splash = {
  eyebrow:'01 · SPLASH', title:'Splash Screen',
  desc:'Dark gradient field, soft particle glow, and a single confident wordmark — auto-advances to onboarding, like a real cold start.',
  render:()=>`
  ${statusbar()}
  <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; background:radial-gradient(circle at 50% 30%, #24133D, #0B0B10 70%); overflow:hidden;">
    ${Array.from({length:14}).map((_,i)=>`<div style="position:absolute; width:${3+ (i%4)}px; height:${3+(i%4)}px; border-radius:50%; background:${i%2?'#D946EF':'#7C3AED'}; opacity:${0.15+(i%5)*0.08}; top:${(i*37)%100}%; left:${(i*53)%100}%; filter:blur(0.5px);"></div>`).join('')}
    <div style="width:74px; height:74px; border-radius:22px; background:var(--g-primary); display:flex; align-items:center; justify-content:center; box-shadow:0 0 60px rgba(217,70,239,0.45); margin-bottom:22px;">
      <svg viewBox="0 0 24 24" width="34" height="34" fill="white"><path d="M12 20s-7-4.4-9.5-9C.6 7.6 2.4 4 6 4c2.1 0 3.5 1.2 4.5 2.6C11.5 5.2 12.9 4 15 4c3.6 0 5.4 3.6 3.5 7-2.5 4.6-9.5 9-9.5 9z"/></svg>
    </div>
    <div style="font-family:var(--font-head); font-weight:800; font-size:30px; letter-spacing:0.5px;">VELVET</div>
    <div style="color:var(--gray); font-size:13.5px; margin-top:10px; letter-spacing:0.2px;">Meet Someone Extraordinary.</div>
  </div>`
};

screens.onboarding = {
  eyebrow:'02 · ONBOARDING', title:'Onboarding',
  desc:'Four short beats — discovery, compatibility, connection, and safety.',
  state:0,
  slides:[
    {t:'Meet new people', d:'Discover interesting people around you and around the world.', seed:'ob1'},
    {t:'Find your connection', d:'Match with people who share your interests and personality.', seed:'ob2'},
    {t:'Connect your way', d:'Chat, call, join live rooms, and build real conversations.', seed:'ob3'},
    {t:'Your privacy matters', d:'Meet safely with verification and privacy controls built in.', seed:'ob4'}
  ],
  render(){
    const s = this.slides[this.state];
    return `
    <div style="position:relative; flex:1; display:flex; flex-direction:column;">
      ${ph(s.seed,{h:'62%',r:'0'})}
      <div style="position:absolute; top:0; left:0; right:0;">${statusbar()}</div>
      <div style="flex:1; background:var(--black); padding:28px 26px 22px; display:flex; flex-direction:column; gap:16px; margin-top:-24px; border-radius:28px 28px 0 0; position:relative;">
        <div style="display:flex; gap:6px;">
          ${this.slides.map((_,i)=>`<div style="height:4px; flex:1; border-radius:2px; background:${i===this.state?'linear-gradient(90deg,var(--purple),var(--pink))':'rgba(255,255,255,0.12)'}"></div>`).join('')}
        </div>
        <div style="font-family:var(--font-head); font-weight:700; font-size:22px; margin-top:6px;">${s.t}</div>
        <div style="color:var(--gray); font-size:14px; line-height:1.55;">${s.d}</div>
        <div style="flex:1;"></div>
        <div style="display:flex; gap:10px;">
          ${this.state>0?`<button class="btn btn-ghost" onclick="obNav(-1)" style="width:52px;">←</button>`:''}
          <button class="btn btn-primary btn-block" onclick="obNav(1)">${this.state<3?'Continue':'Get Started'}</button>
        </div>
        ${this.state===3?`<div style="text-align:center; color:var(--gray); font-size:13px; cursor:pointer;" onclick="setAuthMode('login'); go('auth');">I already have an account</div>`:''}
      </div>
    </div>`;
  }
};
function obNav(dir){
  const sc = screens.onboarding;
  if(sc.state+dir>3){ setAuthMode('signup'); go('auth'); return; }
  if(sc.state+dir<0) return;
  sc.state += dir; renderPhone();
}

screens.auth = {
  eyebrow:'03 · SIGN UP / LOGIN', title:'Sign Up / Login',
  desc:'Client-side validation: required name (signup only), a valid email pattern, and a 6+ character password.',
  render:()=>`
  ${statusbar()}
  <div style="flex:1; padding:20px 24px 30px; display:flex; flex-direction:column; overflow-y:auto;">
    <div style="margin:18px 0 26px;">
      <div style="width:52px; height:52px; border-radius:16px; background:var(--g-primary); margin-bottom:18px;"></div>
      <div style="font-family:var(--font-head); font-weight:800; font-size:24px;">${authMode==='signup' ? 'Create your account' : 'Welcome back'}</div>
      <div style="color:var(--gray); font-size:13.5px; margin-top:6px;">${authMode==='signup' ? 'Join Velvet and start meeting people worth meeting.' : "Log in to pick up where you left off."}</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:11px;">
      <button class="btn btn-ghost btn-block" onclick="comingSoon('Google sign-in')">${icon('check')} Continue with Google</button>
      <button class="btn btn-ghost btn-block" onclick="comingSoon('Apple sign-in')">Continue with Apple</button>
      <button class="btn btn-ghost btn-block" onclick="comingSoon('Phone sign-in')">Continue with Phone</button>
    </div>
    <div style="display:flex; align-items:center; gap:12px; margin:22px 0; color:var(--gray); font-size:12px;">
      <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div> or <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
    </div>
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${authMode==='signup' ? `
      <input id="fullNameInput" placeholder="Full name" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 16px; color:white; font-size:14px;">
      <div id="fullNameError" style="color:var(--error); font-size:11.5px; min-height:14px; padding-left:4px;"></div>` : ''}
      <input id="emailInput" placeholder="Email address" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 16px; color:white; font-size:14px;">
      <div id="emailError" style="color:var(--error); font-size:11.5px; min-height:14px; padding-left:4px;"></div>
      <input id="passwordInput" placeholder="Password" type="password" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 16px; color:white; font-size:14px;">
      <div id="passwordError" style="color:var(--error); font-size:11.5px; min-height:14px; padding-left:4px;"></div>
    </div>
    <div style="flex:1; min-height:8px;"></div>
    <button class="btn btn-primary btn-block" onclick="submitAuth()">${authMode==='signup' ? 'Create account' : 'Log in'}</button>
    <div style="text-align:center; color:var(--gray); font-size:12.5px; margin-top:16px; cursor:pointer;" onclick="setAuthMode('${authMode==='signup'?'login':'signup'}')">${authMode==='signup' ? 'Already have an account? Log in' : "New here? Sign up"}</div>
    <div style="text-align:center; color:var(--gray); font-size:11.5px; margin-top:14px; line-height:1.5;">By continuing, you agree to our Terms &amp; Privacy Policy.</div>
  </div>`
};

screens.discover = {
  eyebrow:'05 · DISCOVER', title:'Discover — home',
  desc:'A real mock swipe deck: pass/like/super-like advance through profiles; matching a "willMatch" profile opens the Match screen; running out shows an empty state.',
  render:()=>{
    const profile = currentDeckProfile();
    const unread = unreadNotifCount();
    return `
    ${statusbar()}
    ${topbar(`
      <div>
        <div style="font-size:12px; color:var(--gray);">Good evening</div>
        <div style="font-family:var(--font-head); font-weight:700; font-size:18px;">${PROFILE_ME.name.split(' ')[0]} 👋</div>
      </div>
      <div style="display:flex; gap:10px;">
        <div class="card" role="button" tabindex="0" aria-label="Notifications" onclick="go('notifications')" style="width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; position:relative;">
          ${icon('bell')}
          ${unread>0?`<span style="position:absolute; top:-2px; right:-2px; width:16px; height:16px; border-radius:50%; background:var(--pink); font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid var(--black);">${unread}</span>`:''}
        </div>
        <div role="button" tabindex="0" aria-label="View pricing" onclick="go('premium')" style="width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:var(--g-hot); cursor:pointer;">${icon('crown')}</div>
      </div>`)}
    <div style="padding:0 22px 6px;">
      <div class="chip" style="gap:6px;">${icon('location')} New York · 12 km</div>
    </div>
    <div style="flex:1; padding:14px 22px 0; position:relative;">
      ${profile ? `
      <div role="button" tabindex="0" aria-label="View ${profile.name}'s full profile" onclick="viewProfile('${profile.seed}')" style="border-radius:26px; overflow:hidden; height:78%; position:relative; cursor:pointer;">
        ${ph(profile.seed,{h:'100%',r:'0'})}
        <div style="position:absolute; top:16px; right:16px; background:var(--g-primary); padding:7px 12px; border-radius:100px; font-size:12px; font-weight:700;">${profile.compat}% Match</div>
        <div style="position:absolute; bottom:0; left:0; right:0; padding:20px; background:linear-gradient(0deg, rgba(0,0,0,0.75), transparent);">
          <div style="display:flex; align-items:center; gap:8px; font-family:var(--font-head); font-weight:700; font-size:21px;">${profile.name}, ${profile.age} <span style="color:var(--blue); font-size:16px;">✓</span></div>
          <div style="color:#E4E4EA; font-size:13px; margin-top:3px;">${profile.distance} · ${profile.role}</div>
          <div style="display:flex; gap:6px; margin-top:10px;">
            ${profile.tags.map(t=>`<span class="chip">${t}</span>`).join('')}
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:center; gap:16px; margin-top:16px;">
        <button class="btn" aria-label="Pass" style="width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:var(--error);" onclick="swipe('pass')">${icon('x')}</button>
        <button class="btn" aria-label="Super like" style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:var(--blue);" onclick="swipe('superlike')">${icon('star')}</button>
        <button class="btn" aria-label="Like" style="width:60px; height:60px; border-radius:50%; background:var(--g-primary); color:white;" onclick="swipe('like')">${icon('heart')}</button>
        <button class="btn" aria-label="Boost profile" style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:var(--warning);" onclick="go('boost')">${icon('bolt')}</button>
      </div>` : `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 20px;">
        <div style="width:56px;height:56px;border-radius:50%; background:rgba(124,58,237,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:var(--purple);">${icon('heart')}</div>
        <div style="font-weight:700; font-size:15px;">You've seen everyone nearby for now</div>
        <div style="color:var(--gray); font-size:13px; margin-top:6px;">Check back soon, or widen your distance filter.</div>
        <button class="btn btn-primary btn-sm" style="margin-top:18px; width:fit-content; padding-left:22px; padding-right:22px;" onclick="resetDeck()">Start Over (testing)</button>
      </div>`}
    </div>
    ${tabbar('discover')}
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.explore = {
  eyebrow:'08 · EXPLORE', title:'Explore',
  desc:'Search filters the grid by name live (with focus preserved across re-renders); "Online now" actually filters by mock online status; tiles open the shared Profile Details screen.',
  render:()=>{
    let list = MOCK_PROFILES.filter(p => p.name.toLowerCase().includes(exploreQuery.toLowerCase()));
    if(exploreCategory === 'Online now') list = list.filter(p=>p.online);
    return `
    ${statusbar()}
    ${topbar(`<div class="section-title">Explore</div><div style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;">${icon('search')}</div>`)}
    <div style="padding:0 22px 10px;">
      <input id="exploreSearchInput" value="${exploreQuery}" oninput="setExploreQuery(this.value)" placeholder="Search people, interests or communities" style="width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.09); border-radius:100px; padding:11px 16px; color:white; font-size:13px;">
    </div>
    <div style="padding:0 22px 10px; display:flex; gap:8px; overflow-x:auto;">
      ${['Nearby','Popular','New','Online now','Trending'].map(c=>`<span class="chip ${exploreCategory===c?'on':''}" style="white-space:nowrap; cursor:pointer;" onclick="setExploreCategory('${c}')">${c}</span>`).join('')}
    </div>
    <div style="flex:1; padding:6px 18px 18px; display:grid; grid-template-columns:1fr 1fr; gap:10px; overflow-y:auto; grid-auto-rows:max-content; align-content:start;">
      ${list.length===0 ? `<div style="grid-column:1/-1; text-align:center; color:var(--gray); font-size:13px; padding:40px 0;">No one matches "${exploreQuery}" yet.</div>` :
      list.map(p=>`
      <div role="button" tabindex="0" onclick="viewProfile('${p.seed}')" style="position:relative; border-radius:18px; overflow:hidden; aspect-ratio:3/4; cursor:pointer;">
        ${ph(p.seed,{h:'100%'})}
        ${p.online?`<div class="pill-badge badge-online" style="position:absolute; top:8px; left:8px;">● Online</div>`:''}
        <div style="position:absolute; bottom:8px; left:10px; font-size:12.5px; font-weight:700;">${p.name}, ${p.age}</div>
      </div>`).join('')}
    </div>
    ${tabbar('explore')}
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.profileDetail = {
  eyebrow:'07 · PROFILE DETAILS', title:'Profile Details',
  desc:'Reads whichever profile was tapped from Discover, Explore, or a notification — same screen, real data.',
  render:()=>{
    const p = viewingProfile || MOCK_PROFILES[0];
    return `
    <div style="position:relative;">
      ${ph(p.seed,{h:'380px'})}
      <div style="position:absolute; top:0; left:0; right:0;">${statusbar()}
        <div style="display:flex; justify-content:space-between; padding:6px 22px;">
          <div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.4); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('back')}</div>
          <div role="button" tabindex="0" aria-label="More options" onclick="openModal(()=>actionSheet('${p.name}', [{label:'Report', danger:true, onClick:()=>{ closeModal(); showToast('Report submitted'); }},{label:'Block', danger:true, onClick:()=>{ closeModal(); showToast('${p.name} blocked'); }}]))" style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.4); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('more')}</div>
        </div>
      </div>
    </div>
    <div style="padding:18px 22px 100px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="font-family:var(--font-head); font-weight:800; font-size:22px;">${p.name}, ${p.age}</div>
        <span style="color:var(--blue);">✓</span>
        <span class="pill-badge ${p.online?'badge-online':''}" style="margin-left:auto; ${p.online?'':'background:rgba(255,255,255,0.08); color:var(--gray);'}">${p.online?'● Online now':'Offline'}</span>
      </div>
      <div style="color:var(--gray); font-size:13px; margin-top:4px;">${p.distance} · ${p.role}</div>
      <div style="margin:18px 0; color:#D8D8E0; font-size:13.5px; line-height:1.6;">${p.bio}</div>

      <div class="section-title" style="font-size:15px; margin-bottom:10px;">Compatibility</div>
      <div class="card" style="padding:16px; display:flex; align-items:center; gap:16px; margin-bottom:22px;">
        <div style="width:64px; height:64px; border-radius:50%; background:conic-gradient(var(--purple) 0% ${p.compat}%, rgba(255,255,255,0.08) ${p.compat}% 100%); display:flex; align-items:center; justify-content:center;">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--charcoal);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${p.compat}%</div>
        </div>
        <div style="flex:1; font-size:12.5px; color:var(--gray);">${Object.entries(p.compatBreak).map(([k,v])=>`${k} ${v}%`).join(' · ')}</div>
      </div>

      <div class="section-title" style="font-size:15px; margin-bottom:10px;">Interests</div>
      <div style="display:flex; gap:7px; flex-wrap:wrap; margin-bottom:22px;">
        ${p.interests.map(t=>`<span class="chip">${t}</span>`).join('')}
      </div>

      <div class="section-title" style="font-size:15px; margin-bottom:10px;">A prompt...</div>
      <div class="card" style="padding:14px 16px; font-size:13.5px; color:#D8D8E0; margin-bottom:22px;">${p.prompt}</div>

      <div class="section-title" style="font-size:15px; margin-bottom:10px;">Photos</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        ${['a','b','c','d'].map(s=>`<div style="border-radius:14px; overflow:hidden; aspect-ratio:1;">${ph(p.seed+s,{h:'100%'})}</div>`).join('')}
      </div>
    </div>
    <div style="position:absolute; bottom:0; left:0; right:0; padding:16px 22px calc(26px + var(--sab)); display:flex; gap:12px; background:linear-gradient(0deg, var(--black) 60%, transparent);">
      <button class="btn" aria-label="Pass" style="width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:var(--error);" onclick="swipeFromDetail('pass')">${icon('x')}</button>
      <button class="btn btn-primary btn-block" onclick="swipeFromDetail('like')">Send Like</button>
    </div>
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.match = {
  eyebrow:'09 · MATCH', title:"It's a Match",
  desc:'Uses whichever profile just matched; "Send a Message" opens (or creates) a real conversation with that person.',
  render:()=>{
    const p = matchedProfile || MOCK_PROFILES[0];
    return `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px; background:radial-gradient(circle at 50% 30%, #3B2064, #0B0B10 75%); position:relative; overflow:hidden;">
      ${statusbar()}
      ${Array.from({length:16}).map((_,i)=>`<div style="position:absolute; font-size:${10+(i%3)*4}px; top:${(i*29)%100}%; left:${(i*61)%100}%; opacity:${0.5+(i%3)*0.15};">${['💜','✨','💗'][i%3]}</div>`).join('')}
      <div style="display:flex; align-items:center; gap:-16px; margin-bottom:26px;">
        <div style="width:104px; height:104px; border-radius:50%; overflow:hidden; border:3px solid var(--black); margin-right:-20px; position:relative; z-index:2;">${ph(PROFILE_ME.seed,{h:'100%'})}</div>
        <div style="width:104px; height:104px; border-radius:50%; overflow:hidden; border:3px solid var(--black); position:relative;">${ph(p.seed,{h:'100%'})}</div>
      </div>
      <div style="font-family:var(--font-head); font-weight:800; font-size:28px; text-align:center;">It's a Match! 💜</div>
      <div style="color:#D8D8E0; font-size:14px; margin-top:10px; text-align:center;">You and ${p.name} liked each other.</div>
      <div style="display:flex; flex-direction:column; gap:12px; width:100%; margin-top:34px;">
        <button class="btn btn-primary btn-block" onclick="openChat('${p.seed}')">Send a Message</button>
        <button class="btn btn-outline btn-block" onclick="go('discover')">Keep Discovering</button>
      </div>
    </div>`;
  }
};

screens.messages = {
  eyebrow:'10 · MESSAGES', title:'Messages',
  desc:'Three working tabs: Chats (real conversations), Matches (not yet messaged), and Requests (Accept moves it into Chats, Decline removes it).',
  render:()=>{
    const convos = Object.values(CONVERSATIONS);
    return `
    ${statusbar()}
    ${topbar(`<div class="section-title">Messages</div><div style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;">${icon('search')}</div>`)}
    <div style="padding:8px 22px; display:flex; gap:22px; border-bottom:1px solid rgba(255,255,255,0.06);">
      ${[['matches','Matches'],['chats','Chats'],['requests','Requests']].map(([id,label])=>`
      <div role="button" tabindex="0" onclick="setMessagesTab('${id}')" style="padding-bottom:10px; font-size:13.5px; font-weight:600; cursor:pointer; color:${messagesTab===id?'white':'var(--gray)'}; border-bottom:2px solid ${messagesTab===id?'var(--pink)':'transparent'};">${label}${id==='requests' && MESSAGE_REQUESTS.length ? ` (${MESSAGE_REQUESTS.length})` : ''}</div>`).join('')}
    </div>

    ${messagesTab==='chats' ? `
    <div style="flex:1; padding:16px 12px 0; overflow-y:auto;">
      ${convos.length===0 ? `<div style="text-align:center; color:var(--gray); font-size:13px; padding:40px 20px;">Start a conversation with someone interesting.</div>` :
      convos.map(c=>{
        const last = c.messages[c.messages.length-1];
        return `
      <div onclick="openChat('${c.seed}')" style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:16px; cursor:pointer;">
        <div style="width:52px;height:52px;border-radius:50%; overflow:hidden; flex-shrink:0;">${ph(c.seed,{h:'100%'})}</div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; justify-content:space-between;"><span style="font-weight:600; font-size:14px;">${c.name}</span></div>
          <div style="font-size:12.5px; color:${c.unread?'white':'var(--gray)'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">${last ? (last.from==='me'?'You: ':'') + last.text : 'Say hi 👋'}</div>
        </div>
        ${c.unread?`<div style="width:8px;height:8px;border-radius:50%; background:var(--pink); flex-shrink:0;"></div>`:''}
      </div>`;}).join('')}
    </div>` : ''}

    ${messagesTab==='matches' ? `
    <div style="flex:1; padding:16px 22px 0; overflow-y:auto;">
      ${NEW_MATCHES.length===0 ? `<div style="text-align:center; color:var(--gray); font-size:13px; padding:40px 20px;">No new matches yet — keep swiping!</div>` :
      NEW_MATCHES.map(m=>`
      <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="width:48px;height:48px;border-radius:50%; overflow:hidden;">${ph(m.seed,{h:'100%'})}</div>
        <div style="flex:1; font-weight:600; font-size:14px;">${m.name}</div>
        <button class="btn btn-primary btn-sm" onclick="openChat('${m.seed}')">Say Hi</button>
      </div>`).join('')}
    </div>` : ''}

    ${messagesTab==='requests' ? `
    <div style="flex:1; padding:16px 22px 0; overflow-y:auto;">
      ${MESSAGE_REQUESTS.length===0 ? `<div style="text-align:center; color:var(--gray); font-size:13px; padding:40px 20px;">No pending requests.</div>` :
      MESSAGE_REQUESTS.map(r=>`
      <div class="card" style="padding:14px; margin-bottom:10px;">
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
          <div style="width:40px;height:40px;border-radius:50%; overflow:hidden;">${ph(r.seed,{h:'100%'})}</div>
          <div style="font-weight:600; font-size:13.5px;">${r.name}</div>
        </div>
        <div style="font-size:12.5px; color:#D8D8E0; margin-bottom:12px;">${r.text}</div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="acceptRequest('${r.seed}')">Accept</button>
          <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="declineRequest('${r.seed}')">Decline</button>
        </div>
      </div>`).join('')}
    </div>` : ''}

    ${tabbar('messages')}
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.chat = {
  eyebrow:'11 · CHAT', title:'Chat',
  desc:'Reads/writes the active conversation. Sending a message appends it live and a canned reply arrives after a short delay (simulating a real backend round-trip).',
  render:()=>{
    const convo = CONVERSATIONS[activeChatId] || CONVERSATIONS['sofia'];
    return `
    ${statusbar()}
    ${topbar(`
      <div style="display:flex; align-items:center; gap:10px;">
        <div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div>
        <div style="width:36px;height:36px;border-radius:50%; overflow:hidden;">${ph(convo.seed,{h:'100%'})}</div>
        <div><div style="font-weight:700; font-size:14.5px;">${convo.name}</div><div style="font-size:11px; color:${convo.online?'var(--success)':'var(--gray)'};">${convo.online?'Online':'Offline'}</div></div>
      </div>
      <div style="display:flex; gap:14px;">
        <span role="button" tabindex="0" aria-label="Voice call" onclick="go('voiceCall')" style="cursor:pointer;">${icon('call')}</span>
        <span role="button" tabindex="0" aria-label="Video call" onclick="go('videoCall')" style="cursor:pointer;">${icon('video')}</span>
        <span role="button" tabindex="0" aria-label="More" onclick="openModal(()=>actionSheet('${convo.name}', [{label:'Unmatch', danger:true, onClick:()=>{ closeModal(); showToast('Unmatched'); go('messages'); }},{label:'Report', danger:true, onClick:()=>{ closeModal(); showToast('Report submitted'); }}]))" style="cursor:pointer;">${icon('more')}</span>
      </div>`)}
    <div id="chatMessages" style="flex:1; padding:14px 18px; display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
      ${convo.messages.length===0 ? `<div style="text-align:center; color:var(--gray); font-size:12.5px; padding:30px 0;">You matched with ${convo.name}! Say hi 👋</div>` :
      convo.messages.map(m=>`
      <div style="align-self:${m.from==='me'?'flex-end':'flex-start'}; background:${m.from==='me'?'var(--g-primary)':'var(--charcoal-2)'}; padding:11px 15px; border-radius:${m.from==='me'?'16px 16px 4px 16px':'16px 16px 16px 4px'}; max-width:75%; font-size:13.5px;">${m.text}</div>`).join('')}
      ${chatTyping ? `<div style="align-self:flex-start; display:flex; gap:6px; align-items:center; color:var(--gray); font-size:12px; padding:6px 4px;">${convo.name} is typing…</div>` : ''}
    </div>
    <div style="padding:10px 16px calc(20px + var(--sab)); display:flex; align-items:center; gap:10px; border-top:1px solid rgba(255,255,255,0.06);">
      <span role="button" tabindex="0" aria-label="Add attachment" onclick="comingSoon('Attachments')" style="color:var(--gray); cursor:pointer;">${icon('plus')}</span>
      <input id="chatInput" placeholder="Write a message..." onkeydown="if(event.key==='Enter') sendMessage()" style="flex:1; background:rgba(255,255,255,0.06); border:none; border-radius:100px; padding:11px 16px; font-size:13.5px; color:white;">
      <span role="button" tabindex="0" aria-label="Voice message" onclick="comingSoon('Voice messages')" style="color:var(--gray); cursor:pointer;">${icon('mic')}</span>
      <span role="button" tabindex="0" aria-label="Send" onclick="sendMessage()" style="width:36px;height:36px;border-radius:50%;background:var(--g-primary); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('send')}</span>
    </div>
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.voiceCall = {
  eyebrow:'12 · VOICE CALL', title:'Voice Call',
  desc:'Photo and name come from the active conversation; the timer actually counts up in real time via setInterval.',
  render:()=>{
    const convo = CONVERSATIONS[activeChatId] || CONVERSATIONS['sofia'];
    return `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:60px 30px 40px; position:relative;">
      ${ph(convo.seed,{h:'100%',fill:true})}
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.75));"></div>
      <div style="position:relative; z-index:2; text-align:center; width:100%;">${statusbar()}
        <div style="font-family:var(--font-head); font-weight:700; font-size:24px; margin-top:60px;">${convo.name}</div>
        <div id="callTimer" style="color:var(--gray); font-size:13.5px; margin-top:6px;">00:00</div>
      </div>
      <div style="position:relative; z-index:2; display:flex; gap:18px; padding-bottom:var(--sab);">
        <div role="button" tabindex="0" aria-label="Mute" onclick="showToast('Muted')" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.12); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('mic')}</div>
        <div role="button" tabindex="0" aria-label="End call" style="width:64px;height:64px;border-radius:50%;background:var(--error); display:flex;align-items:center;justify-content:center; cursor:pointer;" onclick="go('chat')">${icon('call')}</div>
        <div role="button" tabindex="0" aria-label="Speaker" onclick="showToast('Speaker on')" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.12); display:flex;align-items:center;justify-content:center; cursor:pointer;">🔊</div>
      </div>
    </div>
    ${toastHtml()}`;
  }
};
screens.videoCall = {
  eyebrow:'12 · VIDEO CALL', title:'Video Call',
  desc:'Full-bleed remote video with a small self-preview and a compact control dock.',
  render:()=>{
    const convo = CONVERSATIONS[activeChatId] || CONVERSATIONS['sofia'];
    return `
    <div style="flex:1; position:relative;">
      ${ph(convo.seed,{h:'100%'})}
      <div style="position:absolute; top:0; left:0; right:0;">${statusbar()}</div>
      <div style="position:absolute; top:56px; right:16px; width:88px; height:120px; border-radius:16px; overflow:hidden; border:2px solid rgba(255,255,255,0.2);">${ph(PROFILE_ME.seed,{h:'100%'})}</div>
      <div style="position:absolute; bottom:calc(26px + var(--sab)); left:0; right:0; display:flex; justify-content:center; gap:14px;">
        <div role="button" tabindex="0" aria-label="Mute" onclick="showToast('Muted')" style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.14); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('mic')}</div>
        <div role="button" tabindex="0" aria-label="Toggle camera" onclick="showToast('Camera off')" style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.14); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('cam')}</div>
        <div role="button" tabindex="0" aria-label="More" onclick="comingSoon('Call effects')" style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.14); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('more')}</div>
        <div role="button" tabindex="0" aria-label="End call" onclick="go('chat')" style="width:50px;height:50px;border-radius:50%;background:var(--error); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('call')}</div>
      </div>
    </div>
    ${toastHtml()}`;
  }
};

screens.live = {
  eyebrow:'13 · LIVE', title:'Live Social Rooms',
  desc:'Room cards route into a shared Live Room screen.',
  render:()=>`
  ${statusbar()}
  ${topbar(`<div class="section-title">Live Now</div><span role="button" tabindex="0" style="color:var(--pink); font-size:13px; font-weight:600; cursor:pointer;" onclick="comingSoon('Starting a room')">+ Start</span>`)}
  <div style="padding:0 22px 10px; display:flex; gap:8px; overflow-x:auto;">
    ${['Dating','Music','Gaming','Talk','Party'].map((c,i)=>`<span class="chip ${i===0?'on':''}" style="white-space:nowrap;">${c}</span>`).join('')}
  </div>
  <div style="flex:1; padding:8px 22px 18px; display:flex; flex-direction:column; gap:14px; overflow-y:auto;">
    ${[['Late Night Conversations 🌙','1.8K','live1'],['Sunday Playlist Swap 🎧','642','live2'],['Speed Friending: NYC ✨','980','live3']].map(([title,count,seed])=>`
    <div onclick="go('liveRoom')" style="border-radius:20px; overflow:hidden; position:relative; height:150px; cursor:pointer;">
      ${ph(seed,{h:'100%'})}
      <div class="pill-badge" style="position:absolute; top:12px; left:12px; background:var(--error);">● LIVE</div>
      <div style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.5); font-size:11.5px; padding:5px 10px; border-radius:100px;">👁 ${count}</div>
      <div style="position:absolute; bottom:12px; left:14px; font-weight:700; font-size:14.5px;">${title}</div>
    </div>`).join('')}
  </div>
  ${tabbar('live')}
  ${toastHtml()}`
};

screens.liveRoom = {
  eyebrow:'14 · LIVE ROOM', title:'Live Room',
  desc:'Heart sends a quick reaction toast; mic toggles a local muted state; gift opens the gifting screen.',
  render:()=>`
  <div style="flex:1; position:relative;">
    ${ph('room1',{h:'100%'})}
    <div style="position:absolute; top:0; left:0; right:0;">${statusbar()}
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 18px;">
        <div style="display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.4); padding:6px 12px; border-radius:100px;">
          <div style="width:22px;height:22px;border-radius:50%; overflow:hidden;">${ph('maya',{h:'100%'})}</div>
          <span style="font-size:12.5px; font-weight:600;">Maya's Room</span>
          <span class="pill-badge" style="background:var(--error);">● 1.8K</span>
        </div>
        <div role="button" tabindex="0" onclick="go('live')" style="background:rgba(0,0,0,0.4); padding:6px 12px; border-radius:100px; font-size:12px; cursor:pointer;">Leave</div>
      </div>
    </div>
    <div style="position:absolute; bottom:96px; left:18px; right:18px; display:flex; flex-direction:column; gap:6px; font-size:12.5px;">
      <div><b>Theo</b> <span style="color:var(--gray);">joined the room 👋</span></div>
      <div><b>Ivy</b> sent 🌹 to Maya</div>
      <div><b>Noah</b> 🔥🔥🔥</div>
    </div>
    <div style="position:absolute; bottom:calc(22px + var(--sab)); left:0; right:0; padding:0 18px; display:flex; align-items:center; gap:10px;">
      <div style="flex:1; background:rgba(0,0,0,0.4); border-radius:100px; padding:10px 16px; font-size:12.5px; color:var(--gray);">Say something...</div>
      <div role="button" tabindex="0" aria-label="Send heart" onclick="sendLiveReaction('❤️')" style="width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.4); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('heart')}</div>
      <div role="button" tabindex="0" aria-label="Send gift" onclick="go('gifts')" style="width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.4); display:flex;align-items:center;justify-content:center; cursor:pointer;">${icon('gift')}</div>
      <div role="button" tabindex="0" aria-label="Toggle mic" onclick="toggleLiveMic()" style="width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.4); display:flex;align-items:center;justify-content:center; cursor:pointer; color:${liveMicMuted?'var(--error)':'white'};">${icon('mic')}</div>
    </div>
  </div>
  ${toastHtml()}`
};

screens.gifts = {
  eyebrow:'15 · VIRTUAL GIFTS', title:'Send a Gift',
  desc:"Category chips actually filter the catalog; sending a gift deducts real (local) coin balance and shows a toast, or an error toast if you can't afford it.",
  render:()=>{
    const filtered = giftCategory==='Popular' ? GIFT_CATALOG : GIFT_CATALOG.filter(g=>g.cat===giftCategory);
    return `
    ${statusbar()}
    ${topbar(`<div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div><div class="section-title">Send a Gift 🎁</div><div class="pill-badge" style="background:rgba(245,158,11,0.16); color:var(--warning);">${icon('coin')} ${coinBalance.toLocaleString()}</div>`)}
    <div style="padding:0 22px 10px; display:flex; gap:8px; overflow-x:auto;">
      ${['Popular','Romantic','Cute','Luxury','Funny'].map(c=>`<span class="chip ${giftCategory===c?'on':''}" style="white-space:nowrap; cursor:pointer;" onclick="setGiftCategory('${c}')">${c}</span>`).join('')}
    </div>
    <div style="flex:1; padding:10px 22px 18px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; overflow-y:auto;">
      ${filtered.map(g=>`
      <div class="card" role="button" tabindex="0" onclick="sendGift('${g.e}','${g.n}',${g.p})" style="padding:16px 8px; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer;">
        <div style="font-size:30px;">${g.e}</div>
        <div style="font-size:12px; font-weight:600;">${g.n}</div>
        <div style="font-size:11px; color:var(--warning); display:flex; align-items:center; gap:3px;">${icon('coin')} ${g.p}</div>
      </div>`).join('')}
    </div>
    ${toastHtml()}`;
  }
};

screens.premium = {
  eyebrow:'22 · PRICING', title:'Pricing',
  desc:'A real Free/Plus/Pro hierarchy with a monthly/yearly toggle; upgrading actually changes local state, so the CTA and "current plan" reflect what you picked.',
  billing:'monthly',
  plans:[
    {name:'Free', monthly:0, yearly:0, features:['5 likes per day','Basic filters','Standard discovery','Message your matches']},
    {name:'Plus', tag:'MOST POPULAR', monthly:14.99, yearly:9.99, features:['Unlimited Likes','See Who Liked You','Unlimited Rewinds','Advanced Filters','1 free Boost / month']},
    {name:'Pro', monthly:29.99, yearly:19.99, features:['Everything in Plus','Incognito Mode','Priority Discovery','Read Receipts','Exclusive Gifts & Badge','5 free Boosts / month']}
  ],
  render(){
    const yearly = this.billing==='yearly';
    return `
    ${statusbar()}
    <div style="flex:1; padding:20px 0 26px; overflow-y:auto; display:flex; flex-direction:column;">
      <div style="padding:0 22px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="width:44px;height:44px;border-radius:14px; background:var(--g-hot); display:flex; align-items:center; justify-content:center;">${icon('crown')}</div>
          <div role="button" tabindex="0" aria-label="Close pricing" onclick="goBack()" style="color:var(--gray); cursor:pointer;">${icon('x')}</div>
        </div>
        <div style="font-family:var(--font-head); font-weight:800; font-size:22px; line-height:1.3; margin-top:16px;">Choose the plan that fits you</div>
        <div style="color:var(--gray); font-size:13px; margin-top:6px;">You're currently on the <b style="color:white;">${userPlan[0].toUpperCase()+userPlan.slice(1)}</b> plan. Prices shown in USD.</div>

        <div style="display:flex; background:rgba(255,255,255,0.06); border-radius:100px; padding:4px; margin-top:18px; width:fit-content;">
          <div role="button" tabindex="0" onclick="setPremiumBilling('monthly')" style="padding:8px 16px; border-radius:100px; font-size:12.5px; font-weight:700; cursor:pointer; ${!yearly?'background:var(--g-primary); color:white;':'color:var(--gray);'}">Monthly</div>
          <div role="button" tabindex="0" onclick="setPremiumBilling('yearly')" style="padding:8px 16px; border-radius:100px; font-size:12.5px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; ${yearly?'background:var(--g-primary); color:white;':'color:var(--gray);'}">Yearly <span style="background:${yearly?'rgba(255,255,255,0.25)':'rgba(34,197,94,0.16)'}; color:${yearly?'white':'var(--success)'}; font-size:9.5px; padding:2px 6px; border-radius:100px;">SAVE 35%</span></div>
        </div>
      </div>

      <div style="display:flex; gap:14px; overflow-x:auto; scroll-snap-type:x mandatory; padding:22px 22px 8px; margin-top:4px;">
        ${this.plans.map(p=>{
          const price = yearly? p.yearly : p.monthly;
          const isRec = !!p.tag;
          const isCurrent = userPlan === p.name.toLowerCase();
          const ctaLabel = isCurrent ? 'Your Current Plan' : (p.name==='Free' ? 'Downgrade to Free' : `Upgrade to ${p.name}`);
          const ctaStyle = isCurrent ? 'btn-ghost' : (isRec ? 'btn-primary' : 'btn-outline');
          return `
          <div class="card" style="scroll-snap-align:center; flex:0 0 240px; padding:20px 18px; position:relative; ${isRec?'border-color:var(--pink); background:rgba(217,70,239,0.07); box-shadow:0 16px 40px -14px rgba(217,70,239,0.4); transform:scale(1.03);':''}">
            ${isRec?`<div style="position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:var(--g-hot); font-size:10px; font-weight:800; letter-spacing:0.04em; padding:5px 12px; border-radius:100px; white-space:nowrap;">${p.tag}</div>`:''}
            <div style="font-family:var(--font-head); font-weight:700; font-size:16px; margin-top:${isRec?'6px':'0'};">${p.name}</div>
            <div style="display:flex; align-items:baseline; gap:4px; margin:10px 0 2px;">
              <span style="font-family:var(--font-head); font-weight:800; font-size:26px;">$${price.toFixed(2).replace('.00','')}</span>
              <span style="color:var(--gray); font-size:12px;">/ mo</span>
            </div>
            <div style="color:var(--gray); font-size:11px; margin-bottom:16px;">${price===0?'Forever free':(yearly?'billed annually':'billed monthly')}</div>
            <div style="display:flex; flex-direction:column; gap:9px; margin-bottom:18px;">
              ${p.features.map(f=>`<div style="display:flex; align-items:flex-start; gap:8px; font-size:12px; color:#D8D8E0;"><span style="color:${isRec?'var(--pink)':'var(--success)'}; flex-shrink:0; margin-top:1px;">${icon('check')}</span>${f}</div>`).join('')}
            </div>
            <button class="btn ${ctaStyle} btn-block btn-sm" ${isCurrent?'disabled aria-disabled="true"':''} style="${isCurrent?'opacity:0.55; cursor:not-allowed;':''}" onclick="${isCurrent?'':`upgradePlan('${p.name}')`}">${ctaLabel}</button>
          </div>`;
        }).join('')}
      </div>
      <div style="text-align:center; color:var(--gray); font-size:11px; padding:6px 22px 0;">Swipe to compare plans →</div>
    </div>
    ${toastHtml()}`;
  }
};

screens.boost = {
  eyebrow:'23 · BOOST', title:'Boost',
  desc:'"Boost My Profile" shows a success toast then returns to Discover after a beat — simulating what a real boost activation would do.',
  render:()=>`
  ${statusbar()}
  <div style="flex:1; padding:30px 26px; display:flex; flex-direction:column; align-items:center; text-align:center;">
    <div role="button" tabindex="0" aria-label="Close" onclick="goBack()" style="display:flex; justify-content:flex-end; width:100%; cursor:pointer;">${icon('x')}</div>
    <div style="width:88px; height:88px; border-radius:50%; background:var(--g-hot); display:flex; align-items:center; justify-content:center; margin:20px 0 24px; box-shadow:0 0 50px rgba(236,72,153,0.4);">${icon('bolt')}</div>
    <div style="font-family:var(--font-head); font-weight:800; font-size:22px;">Get seen by more people 🚀</div>
    <div style="color:var(--gray); font-size:13.5px; margin-top:10px; line-height:1.55;">Put your profile in front of more people for the next 30 minutes.</div>
    <div class="card" style="width:100%; margin-top:26px; padding:18px; display:flex; justify-content:space-around;">
      <div><div style="font-family:var(--font-head); font-weight:700; font-size:18px;">1x</div><div style="color:var(--gray); font-size:11px;">Current reach</div></div>
      <div><div style="font-family:var(--font-head); font-weight:700; font-size:18px; color:var(--pink);">10x</div><div style="color:var(--gray); font-size:11px;">Estimated reach</div></div>
    </div>
    <div style="flex:1;"></div>
    <button class="btn btn-primary btn-block" onclick="activateBoost()">Boost My Profile</button>
  </div>
  ${toastHtml()}`
};

screens.profile = {
  eyebrow:'20 · PROFILE', title:'My Profile',
  desc:"Photos/Posts/Stories tabs switch content (Posts & Stories show a real empty state, since those flows aren't built yet); Edit Profile opens a working modal that updates the header live.",
  render:()=>`
  ${statusbar()}
  ${topbar(`<div class="section-title">Profile</div><span role="button" tabindex="0" aria-label="Settings" onclick="go('settings')" style="cursor:pointer;">${icon('more')}</span>`)}
  <div style="padding:0 22px; text-align:center;">
    <div style="width:88px;height:88px;border-radius:50%; overflow:hidden; margin:0 auto 10px; border:2px solid var(--purple);">${ph(PROFILE_ME.seed,{h:'100%'})}</div>
    <div style="display:flex; align-items:center; justify-content:center; gap:6px; font-family:var(--font-head); font-weight:700; font-size:18px;">${PROFILE_ME.name} <span style="color:var(--blue); font-size:14px;">✓</span></div>
    <div style="color:var(--gray); font-size:12.5px; margin-top:2px;">${PROFILE_ME.age} · ${PROFILE_ME.location}</div>
    ${PROFILE_ME.bio ? `<div style="color:#D8D8E0; font-size:12.5px; margin-top:8px;">${PROFILE_ME.bio}</div>` : ''}
    <div style="display:flex; justify-content:center; gap:26px; margin:18px 0;">
      ${[[PROFILE_ME.followers,'Followers'],[PROFILE_ME.following,'Following'],[PROFILE_ME.likes,'Likes'],[PROFILE_ME.matches,'Matches']].map(([n,l])=>`<div><div style="font-weight:700; font-size:15px;">${n}</div><div style="color:var(--gray); font-size:10.5px;">${l}</div></div>`).join('')}
    </div>
    <button class="btn btn-ghost btn-block btn-sm" onclick="openEditProfile()">Edit Profile</button>
  </div>
  <div style="display:flex; gap:20px; margin:20px 22px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">
    ${[['photos','Photos'],['posts','Posts'],['stories','Stories']].map(([id,label])=>`<div role="button" tabindex="0" onclick="setProfileTab('${id}')" style="padding-bottom:9px; font-size:13px; font-weight:600; cursor:pointer; color:${profileTab===id?'white':'var(--gray)'}; border-bottom:2px solid ${profileTab===id?'var(--pink)':'transparent'};">${label}</div>`).join('')}
  </div>
  ${profileTab==='photos' ? `
  <div style="flex:1; padding:6px 18px 18px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; overflow-y:auto;">
    ${['a','b','c','d','e','f'].map(s=>`<div style="border-radius:10px; overflow:hidden; aspect-ratio:1;">${ph(PROFILE_ME.seed+s,{h:'100%'})}</div>`).join('')}
  </div>` : `
  <div style="flex:1; display:flex; align-items:center; justify-content:center; color:var(--gray); font-size:13px; text-align:center; padding:0 40px;">No ${profileTab} yet.</div>`}
  ${tabbar('profile')}
  ${toastHtml()}${modalHtml()}`
};

screens.settings = {
  eyebrow:'26 · SETTINGS', title:'Settings',
  desc:'Real toggles with local state; Incognito is gated behind a paid plan and shows an error toast if you try to enable it on Free; Log Out opens a confirm modal and returns you to the auth screen.',
  render:()=>`
  ${statusbar()}
  ${topbar(`<div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div><div class="section-title">Settings</div><div></div>`)}
  <div style="flex:1; padding:6px 22px 26px; overflow-y:auto;">

    <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin:14px 0 10px;">NOTIFICATIONS & PRIVACY</div>
    ${[
      ['push','Push Notifications'],
      ['onlineStatus','Show Online Status'],
      ['location','Location Sharing']
    ].map(([key,label])=>`
    <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="flex:1; font-size:13.5px;">${label}</div>
      <div class="toggle ${settingsState[key]?'on':''}" role="button" tabindex="0" aria-label="Toggle ${label}" onclick="toggleSetting('${key}')"></div>
    </div>`).join('')}
    <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="flex:1; font-size:13.5px; display:flex; align-items:center; gap:6px;">Incognito Mode ${!userIsPremium()?`<span style="font-size:9px; font-weight:800; color:var(--warning); background:rgba(245,158,11,0.14); padding:2px 6px; border-radius:100px;">PRO</span>`:''}</div>
      <div class="toggle ${settingsState.incognito?'on':''} ${!userIsPremium()?'disabled':''}" role="button" tabindex="0" aria-label="Toggle Incognito Mode" onclick="toggleSetting('incognito')"></div>
    </div>

    <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin:20px 0 10px;">LANGUAGE</div>
    <select onchange="setLanguage(this.value)" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:12px 14px; color:white; font-size:13.5px;">
      ${['English','Español','Français','اردو'].map(l=>`<option ${settingsLanguage===l?'selected':''}>${l}</option>`).join('')}
    </select>

    <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin:20px 0 10px;">ACCOUNT</div>
    ${[
      ['Subscription — ' + userPlan[0].toUpperCase()+userPlan.slice(1) + ' plan', "go('premium')"],
      ['Safety Center', "go('safety')"],
      ['Blocked Users' + (BLOCKED_USERS.length?` (${BLOCKED_USERS.length})`:''), "openBlockedUsers()"],
      ['Help Center', "comingSoon('Help Center')"]
    ].map(([label,handler])=>`
    <div role="button" tabindex="0" onclick="${handler}" style="display:flex; align-items:center; gap:14px; padding:14px 4px; border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer;">
      <div style="flex:1; font-size:13.5px;">${label}</div>
      <span style="color:var(--gray);">›</span>
    </div>`).join('')}

    <button class="btn btn-block" style="margin-top:22px; background:rgba(239,68,68,0.12); color:var(--error); border:1px solid rgba(239,68,68,0.3);" onclick="confirmLogout()">Log Out</button>
  </div>
  ${toastHtml()}${modalHtml()}`
};

screens.notifications = {
  eyebrow:'19 · NOTIFICATIONS', title:'Notifications',
  desc:'Tapping a notification marks it read and routes contextually (a like/match opens that profile, a gift opens the chat). "Mark all read" clears the unread badge shown on Discover.',
  render:()=>{
    const kindMap = {All:null, Matches:'match', Messages:'gift', Likes:'like', Live:'live'};
    const filterKind = kindMap[notifFilter];
    const list = filterKind ? NOTIFICATIONS.filter(n=>n.kind===filterKind) : NOTIFICATIONS;
    return `
    ${statusbar()}
    ${topbar(`<div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div><div class="section-title">Notifications</div><span role="button" tabindex="0" style="color:var(--pink); font-size:12px; font-weight:600; cursor:pointer;" onclick="markAllNotificationsRead()">Mark all read</span>`)}
    <div style="padding:0 22px 10px; display:flex; gap:8px; overflow-x:auto;">
      ${['All','Matches','Messages','Likes','Live'].map(c=>`<span class="chip ${notifFilter===c?'on':''}" style="white-space:nowrap; cursor:pointer;" onclick="setNotifFilter('${c}')">${c}</span>`).join('')}
    </div>
    <div style="flex:1; padding:6px 12px 18px; overflow-y:auto;">
      ${list.length===0 ? `<div style="text-align:center; color:var(--gray); font-size:13px; padding:40px 0;">You're all caught up ✨</div>` :
      list.map(n=>`
      <div role="button" tabindex="0" onclick="openNotification(${n.id})" style="display:flex; align-items:center; gap:12px; padding:12px 10px; border-radius:14px; cursor:pointer; background:${n.unread?'rgba(124,58,237,0.08)':'transparent'};">
        <div style="width:42px;height:42px;border-radius:50%; overflow:hidden; flex-shrink:0;">${ph(n.seed,{h:'100%'})}</div>
        <div style="flex:1; font-size:13px;">${n.text}</div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
          <span style="font-size:10.5px; color:var(--gray);">${n.time}</span>
          ${n.unread?`<span style="width:7px;height:7px;border-radius:50%;background:var(--pink);"></span>`:''}
        </div>
      </div>`).join('')}
    </div>
    ${toastHtml()}${modalHtml()}`;
  }
};

screens.safety = {
  eyebrow:'24 · SAFETY CENTER', title:'Safety Center',
  desc:'Each row is either wired to a real modal (Report/Block) or an honest "coming soon" toast — nothing here silently does nothing.',
  render:()=>`
  ${statusbar()}
  ${topbar(`<div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div><div class="section-title">Safety Center</div><div></div>`)}
  <div style="flex:1; padding:6px 22px 22px; overflow-y:auto;">
    <div class="card" style="padding:16px; display:flex; align-items:center; gap:12px; margin-bottom:18px; background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.25);">
      <div style="color:var(--blue);">${icon('shield')}</div>
      <div style="font-size:13px; color:#D8D8E0;">You're verified. Your badge helps others know you're real.</div>
    </div>
    ${[
      ['shield','Profile & Photo Verification', "comingSoon('Verification flow')"],
      ['x','Report or Block a User', "openModal(()=>actionSheet('Report or Block', [{label:'Report a user', danger:true, onClick:()=>{ closeModal(); showToast('Report submitted'); }},{label:'Block a user', danger:true, onClick:()=>{ closeModal(); showToast('User blocked'); }}]))"],
      ['location','Location Privacy', "toggleSetting('location'); goBack();"],
      ['messages','Message Controls', "comingSoon('Message controls')"],
      ['check','Date Safety Tips', "comingSoon('Date safety tips')"],
      ['heart','Emergency Contact', "comingSoon('Emergency contact setup')"],
      ['crown','Community Guidelines', "comingSoon('Community guidelines')"]
    ].map(([i,t,handler])=>`
    <div role="button" tabindex="0" onclick="${handler}" style="display:flex; align-items:center; gap:14px; padding:14px 4px; border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer;">
      <div style="width:36px;height:36px;border-radius:10px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center;">${icon(i)}</div>
      <div style="flex:1; font-size:13.5px;">${t}</div>
      <span style="color:var(--gray);">›</span>
    </div>`).join('')}
    <button class="btn btn-block" style="margin-top:20px; background:rgba(239,68,68,0.12); color:var(--error); border:1px solid rgba(239,68,68,0.3);" onclick="comingSoon('Reporting a problem')">Report a Problem</button>
  </div>
  ${toastHtml()}${modalHtml()}`
};

screens.states = {
  eyebrow:'37 · SYSTEM STATES', title:'Loading, Empty, Error & Disabled',
  desc:'Internal QA reference, not part of the user-facing flow — a static gallery of the states a real backend integration would drive.',
  render:()=>`
  ${statusbar()}
  ${topbar(`<div role="button" tabindex="0" aria-label="Back" onclick="goBack()" style="cursor:pointer;">${icon('back')}</div><div class="section-title">Component States</div><div></div>`)}
  <div style="flex:1; padding:6px 22px 26px; overflow-y:auto; display:flex; flex-direction:column; gap:26px;">

    <div>
      <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin-bottom:10px;">LOADING · SKELETON</div>
      <div class="card" style="padding:14px; display:flex; gap:12px; align-items:center;">
        <div style="width:52px;height:52px;border-radius:50%; background:linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06)); background-size:200% 100%; animation:shimmer 1.4s infinite;"></div>
        <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
          <div style="height:11px; width:60%; border-radius:6px; background:linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06)); background-size:200% 100%; animation:shimmer 1.4s infinite;"></div>
          <div style="height:9px; width:40%; border-radius:6px; background:linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05)); background-size:200% 100%; animation:shimmer 1.4s infinite;"></div>
        </div>
      </div>
    </div>

    <div>
      <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin-bottom:10px;">EMPTY STATE</div>
      <div class="card" style="padding:26px 20px; text-align:center;">
        <div style="width:52px;height:52px;border-radius:50%; background:rgba(124,58,237,0.14); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--purple);">${icon('heart')}</div>
        <div style="font-weight:700; font-size:14px;">Your next connection might be one swipe away.</div>
        <button class="btn btn-primary btn-sm" style="margin:14px auto 0; width:fit-content; padding-left:22px; padding-right:22px;" onclick="go('discover')">Discover People</button>
      </div>
    </div>

    <div>
      <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin-bottom:10px;">ERROR STATE</div>
      <div class="card" style="padding:16px; display:flex; gap:12px; align-items:flex-start; border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.06);">
        <span style="color:var(--error); flex-shrink:0;">${icon('x')}</span>
        <div style="flex:1;">
          <div style="font-weight:700; font-size:13px;">Couldn't load your matches</div>
          <div style="color:var(--gray); font-size:12px; margin-top:3px;">Check your connection and try again.</div>
        </div>
        <button class="btn btn-ghost btn-sm" id="retryBtn" style="flex-shrink:0;" onclick="simulateRetry()">Retry</button>
      </div>
    </div>

    <div>
      <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin-bottom:10px;">SUCCESS · TOAST</div>
      <div class="card" style="padding:14px 16px; display:flex; align-items:center; gap:10px; border-color:rgba(34,197,94,0.3); background:rgba(34,197,94,0.08); cursor:pointer;" onclick="showToast('Profile boosted! You are now 10x more visible.')">
        <span style="color:var(--success);">${icon('check')}</span>
        <div style="font-size:13px; font-weight:600;">Tap to trigger this toast live</div>
      </div>
    </div>

    <div>
      <div style="font-size:11px; color:var(--gray); font-weight:700; letter-spacing:0.05em; margin-bottom:10px;">DISABLED · DEPENDENT ACTIONS</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn btn-primary btn-block" disabled aria-disabled="true" style="opacity:0.5; cursor:not-allowed;">Send Like (upload a photo first)</button>
        <button class="btn btn-ghost btn-block" disabled aria-disabled="true" style="opacity:0.5; cursor:not-allowed;">Start Video Call (verify your account)</button>
      </div>
    </div>

  </div>
  <style>@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}</style>
  ${toastHtml()}`
};
function simulateRetry(){
  const btn = document.getElementById('retryBtn');
  if(!btn) return;
  btn.textContent = 'Retrying…';
  btn.disabled = true;
  setTimeout(()=>{ showToast('Still offline — this is a mock error state', 'error'); }, 900);
}

/* ---------- nav + render ---------- */
const NAV = [
  {group:'Onboard', items:[['splash','Splash'],['onboarding','Onboarding'],['auth','Sign Up / Login']]},
  {group:'Core', items:[['discover','Discover'],['explore','Explore'],['profileDetail','Profile Details'],['match','Match']]},
  {group:'Connect', items:[['messages','Messages'],['chat','Chat'],['voiceCall','Voice Call'],['videoCall','Video Call']]},
  {group:'Live & Gifting', items:[['live','Live Rooms'],['liveRoom','Live Room'],['gifts','Gifts']]},
  {group:'Growth & Trust', items:[['premium','Pricing'],['boost','Boost'],['profile','My Profile'],['notifications','Notifications'],['settings','Settings'],['safety','Safety Center']]},
  {group:'System States', items:[['states','Loading / Empty / Error']]},
];
const TOP_LEVEL = ['discover','explore','live','messages','profile'];
let current = 'splash';
let historyStack = ['splash'];

function buildSidebar(){
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `
    <div class="brand"><div class="brand-mark">V</div><div class="brand-name">Velvet</div></div>
    <div class="brand-sub">Product UI System</div>
    ${NAV.map(g=>`
      <div class="nav-group-label">${g.group}</div>
      ${g.items.map(([id,label])=>`<div class="nav-item" id="nav-${id}" onclick="go('${id}')"><span class="dot"></span>${label}</div>`).join('')}
    `).join('')}
  `;
}
function syncChrome(){
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el=>el.classList.remove('active'));
  const active = document.getElementById('nav-'+current);
  if(active) active.classList.add('active');
  const activeMobile = document.getElementById('mnav-'+current);
  if(activeMobile) activeMobile.classList.add('active');
  const sc = screens[current];
  const eb = document.getElementById('stageEyebrow'), tt = document.getElementById('stageTitle'), ds = document.getElementById('stageDesc');
  if(eb) eb.textContent = sc.eyebrow;
  if(tt) tt.textContent = sc.title;
  if(ds) ds.textContent = sc.desc;
}
function go(id){
  if(!screens[id]){ console.warn('Unknown screen:', id); return; }
  const leaving = current;
  if(leaving === 'voiceCall' && id !== 'voiceCall' && callTimerInterval){ clearInterval(callTimerInterval); callTimerInterval = null; }
  activeModal = null;
  if(TOP_LEVEL.includes(id)) historyStack = [id];
  else if(historyStack[historyStack.length-1] !== id) historyStack.push(id);
  current = id;
  syncChrome();
  renderPhone();
  toggleMobileSheet(false);
  if(id === 'voiceCall') startCallTimer();
  if(id === 'splash') setTimeout(()=>{ if(current === 'splash') go('onboarding'); }, 1600);
  if(id === 'chat') scrollChatToBottom();
}
function goBack(){
  if(current === 'voiceCall' && callTimerInterval){ clearInterval(callTimerInterval); callTimerInterval = null; }
  activeModal = null;
  if(historyStack.length > 1) historyStack.pop();
  current = historyStack[historyStack.length-1];
  syncChrome();
  renderPhone();
}
function buildMobileSheet(){
  const panel = document.getElementById('mobileSheetPanel');
  panel.innerHTML = `<div class="mobile-sheet-handle"></div>` + NAV.map(g=>`
    <div class="nav-group-label">${g.group}</div>
    ${g.items.map(([id,label])=>`<div class="nav-item mobile-nav-item ${id===current?'active':''}" id="mnav-${id}" onclick="go('${id}')"><span class="dot"></span>${label}</div>`).join('')}
  `).join('');
}
function toggleMobileSheet(open){
  const sheet = document.getElementById('mobileSheet');
  if(!sheet) return;
  if(open) buildMobileSheet();
  sheet.classList.toggle('open', open);
}
function renderPhone(){
  const el = document.getElementById('phoneScreen');
  if(!el) return;
  el.innerHTML = screens[current].render();
  if(document.getElementById('chatMessages')) scrollChatToBottom();
}
buildSidebar();
go('splash');
