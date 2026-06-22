/* ── Persistence (localStorage, single-file, no backend) ─────────────── */
var STORE_KEY='fiscally.web.v1',onboarded=false;
function saveState(){
  try{localStorage.setItem(STORE_KEY,JSON.stringify({v:1,onboarded:onboarded,PF:PF,ACTIVITY:ACTIVITY,GOAL:GOAL,LEARN:LEARN,contrib:contrib,seen:seen,initDone:initDone,SIM:SIM,BUDGET:BUDGET,GOALS:GOALS,SPENDING:SPENDING,NETWORTH:NETWORTH}));}catch(e){}
}
function loadState(){
  try{
    var raw=localStorage.getItem(STORE_KEY);if(!raw)return false;
    var d=JSON.parse(raw);if(!d)return false;
    if(d.PF)PF=d.PF;if(d.ACTIVITY)ACTIVITY=d.ACTIVITY;if(d.GOAL)GOAL=d.GOAL;
    if(!Array.isArray(PF.watch))PF.watch=[];if(PF.deposits==null)PF.deposits=0;
    if(d.LEARN)LEARN=d.LEARN;if(d.contrib)contrib=d.contrib;if(d.seen)seen=d.seen;
    if(typeof d.initDone==='boolean')initDone=d.initDone;
    if(d.SIM&&d.SIM.day!=null)SIM.day=d.SIM.day;
    if(d.BUDGET)BUDGET=d.BUDGET;if(Array.isArray(d.GOALS))GOALS=d.GOALS;
    if(Array.isArray(d.SPENDING))SPENDING=d.SPENDING;if(d.NETWORTH)NETWORTH=d.NETWORTH;
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
  goTab('home');
}

