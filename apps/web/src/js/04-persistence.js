/* ── Persistence (localStorage, single-file, no backend) ─────────────── */
var STORE_KEY='fiscally.web.v1',onboarded=false;
/* ?demo → keep the seeded showcase state (portfolio, lessons done, ledgers) and skip
   the welcome flow. Only "activates" when there's no real saved state, and never
   persists — a stage prop, not a mode that can overwrite someone's actual progress. */
var DEMO=/[?&]demo\b/.test(location.search),demoActive=false;
function saveState(){
  if(demoActive)return;
  try{localStorage.setItem(STORE_KEY,JSON.stringify({v:1,onboarded:onboarded,PF:PF,ACTIVITY:ACTIVITY,GOAL:GOAL,LEARN:LEARN,contrib:contrib,seen:seen,initDone:initDone,BUDGET:BUDGET,GOALS:GOALS,SPENDING:SPENDING,NETWORTH:NETWORTH,LOANS:LOANS,SAVINGS:SAVINGS,CHEQUING:CHEQUING,CREDIT_CARD:CREDIT_CARD,pfLevel:pfLevel,USER:USER}));}catch(e){}
}
/* A brand-new user starts with a genuinely blank slate — no pre-done lessons, no
   seeded positions or ledgers. The literals declared in 03/07b/08 are the DEMO
   showcase state; this overrides them before first render when there's nothing
   saved. (Globals all exist by the time this runs from 08's boot sequence.) */
function freshStart(){
  PF={cash:START_CAPITAL,realized:0,deposits:0,watch:[],pos:[]};initDone=true;
  ACTIVITY=[{ic:'💵',main:'Opening deposit',sub:nowLabel()+' · Virtual cash',amt:'+$10,000.00',cls:'up'}];
  LEARN={level:1,levelName:'Getting Started',xp:0,xpToNext:500,streak:0,dailyXP:0,gems:0,checked:{},flags:{},done:{}};
  GOAL.saved=0;GOALS=[];SPENDING=[];LOANS=[];
  SAVINGS={balance:0};CHEQUING={balance:0,deposits:[]};CREDIT_CARD=null;
  NETWORTH={assets:[{name:'Savings account',value:0},{name:'Chequing',value:0}],debts:[]};
  USER={name:'',age:null};
}
function loadState(){
  try{
    var raw=localStorage.getItem(STORE_KEY);if(!raw)return false;
    var d=JSON.parse(raw);if(!d)return false;
    if(d.PF)PF=d.PF;if(d.ACTIVITY)ACTIVITY=d.ACTIVITY;if(d.GOAL)GOAL=d.GOAL;
    if(!Array.isArray(PF.watch))PF.watch=[];if(PF.deposits==null)PF.deposits=0;
    if(d.LEARN)LEARN=d.LEARN;if(d.contrib)contrib=d.contrib;if(d.seen)seen=d.seen;
    if(typeof d.initDone==='boolean')initDone=d.initDone;
    if(d.BUDGET)BUDGET=d.BUDGET;if(Array.isArray(d.GOALS))GOALS=d.GOALS;
    if(Array.isArray(d.SPENDING))SPENDING=d.SPENDING;if(d.NETWORTH)NETWORTH=d.NETWORTH;
    if(Array.isArray(d.LOANS))LOANS=d.LOANS;if(d.SAVINGS)SAVINGS=d.SAVINGS;
    if(d.CHEQUING)CHEQUING=d.CHEQUING;if(!Array.isArray(CHEQUING.deposits))CHEQUING.deposits=[];
    if(d.CREDIT_CARD)CREDIT_CARD=d.CREDIT_CARD;
    if(d.pfLevel)pfLevel=Math.max(1,Math.min(3,d.pfLevel|0))||1;
    if(d.USER)USER=d.USER;
    onboarded=!!d.onboarded;return true;
  }catch(e){return false;}
}
function resetProgress(){
  if(!confirm('Reset all progress? This clears your practice portfolio, goal and lessons, and starts you fresh.'))return;
  try{localStorage.removeItem(STORE_KEY);}catch(e){}
  location.reload();
}
function enterApp(){
  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('appHeader').classList.remove('hidden');
  document.getElementById('appNav').classList.remove('hidden');
  document.getElementById('coachFab').classList.remove('hidden');
  goTab('home');
}

