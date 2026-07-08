/* ── Navigation ──────────────────────────────── */
var TAB_OF={home:'home',learn:'learn',lessons:'learn',tools:'tools',social:'social',journey:'journey',scenario:'journey',risk:'journey',stockfinder:'journey',budget:'budget',goals:'budget',spending:'budget',networth:'accounts',accounts:'accounts',
  'loan-calc':'tools','mortgage-calc':'tools','compound-calc':'tools','game-swipe':'tools','game-wnb':'tools','game-scam':'tools','game-wordle':'tools','game-xword':'tools','game-quiz':'tools','game-hangman':'tools','game-invest':'tools'};
var TITLES={home:"Fiscally",learn:'Learn',lessons:'Learn',tools:'Games',social:'Profile',journey:'Investing',scenario:'Scenarios',risk:'Risk Level',stockfinder:'Stock Finder',budget:'Budget',goals:'Savings Goals',spending:'Spending',networth:'Net Worth',accounts:'My Accounts',
  'loan-calc':'Loan Calculator','mortgage-calc':'Mortgage Calculator','compound-calc':'Compound Calculator','game-swipe':'Budget Swipe','game-wnb':'Wants vs Needs','game-scam':'Scammer Scanner','game-wordle':'Finance Wordle','game-xword':'Finance Crossword','game-quiz':'Quick Count','game-hangman':"Debtor's Tower",'game-invest':'Invest Game'};
var stack=['home'];
function show(id){
  closeL();closeTipBtn();/* never leave a lesson/term sheet floating over a new tab */
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('page-'+id).classList.add('active');
  if(id==='learn')renderLearnHub();
  if(id==='lessons')renderLearn();
  if(id==='journey'){applyPracticeLevel();refreshHeldPrices();renderInvestLessons();renderGlossary();}
  if(id==='scenario')renderScenario();
  if(id==='social')renderProfile();
  if(id==='home'){renderMoneyHome();renderGoalCard();}
  if(id==='budget')renderBudget();
  if(id==='goals')renderGoals();
  if(id==='spending')renderSpending();
  if(id==='networth')renderNetworth();
  if(id==='accounts'){renderAccounts();renderMoneyHome();}
  if(id==='loan-calc')renderLoanCalc();
  if(id==='mortgage-calc')renderMortgageCalc();
  if(id==='compound-calc')renderCompoundCalc();
  if(id==='game-swipe')initBudgetSwipe();
  if(id==='game-wnb')initWantsNeeds();
  if(id==='game-scam')initScammerScanner();
  if(id==='game-wordle')initWordle();
  if(id==='game-xword')initCrossword();
  if(id==='game-quiz')initQuickCount();
  if(id==='game-hangman')initHangman();
  if(id==='game-invest')initInvestGame();
  var tab=TAB_OF[id];
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab);});
  var isSub=['lessons','scenario','risk','stockfinder','goals','spending','networth','loan-calc','mortgage-calc','compound-calc','game-swipe','game-wnb','game-scam','game-wordle','game-xword','game-quiz','game-hangman','game-invest','social'].indexOf(id)>=0;
  document.getElementById('hBack').classList.toggle('show',isSub);
  document.getElementById('hTitle').innerHTML = isSub ? TITLES[id] : (id==='home'?"Home":TITLES[id]);
  document.getElementById('pages').scrollTop=0;
  var pg=document.getElementById('page-'+id);pg.scrollTop=0;
  syncTopbar();
}
function syncTopbar(){var s=document.getElementById('tbStreak');if(s&&typeof LEARN!=='undefined')s.textContent=LEARN.streak;var l=document.getElementById('tbLevel');if(l&&typeof LEARN!=='undefined')l.textContent='Lvl '+LEARN.level;}
function goTab(id){stack=[id];show(id);}
function push(id){stack.push(id);show(id);}
function back(){stack.pop();show(stack[stack.length-1]||'home');}

/* ── Onboarding ──────────────────────────────── */
var obStep=1,OB_MAX=3;
var USER={name:'',age:null};/* filled from OB1 (name+age+confidence), persisted via saveState */
var OB_ARROW_NEXT='<svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
(function initDots(){var h='';for(var i=1;i<=OB_MAX;i++)h+='<div class="ob-dot'+(i===1?' on':'')+'"></div>';document.getElementById('obDots').innerHTML=h;})();
function renderOB(){
  document.querySelectorAll('.ob-screen').forEach(function(s){s.classList.toggle('active',+s.dataset.ob===obStep);});
  document.querySelectorAll('.ob-dot').forEach(function(d,i){d.classList.toggle('on',i===obStep-1);});
  var nb=document.getElementById('obNextBtn'),bb=document.getElementById('obBackBtn');
  nb.classList.toggle('wide',obStep===OB_MAX);
  nb.innerHTML=obStep===OB_MAX?"Let's Start! 🚀":OB_ARROW_NEXT;
  if(bb)bb.style.visibility=obStep===1?'hidden':'visible';
  document.getElementById('onboarding').classList.toggle('ob-wide',obStep===3);/* budget screen is a 2-card spread */
  if(obStep===3)initOBBudget();
  document.querySelector('.ob-body').scrollTop=0;
}
function obNext(){if(obStep<OB_MAX){obStep++;renderOB();}else finishOB();}
function obBack(){if(obStep>1){obStep--;renderOB();}}
/* OB1 name+age → USER (used by the Home greeting; persisted with everything else) */
function applyOBUser(){
  USER.name=((document.getElementById('obName')||{}).value||'').trim().slice(0,24);
  var a=parseInt((document.getElementById('obAge')||{}).value,10);
  USER.age=(a>0&&a<120)?a:null;
  USER.confidence=obConf;USER.topGoal=obWhy;
}
/* OB3 no longer shapes a dollar goal \u2014 it records the top financial goal (obWhy).
   Annotate the primary goal if one exists; never fabricate a placeholder goal. */
function applyOBGoal(){
  if(obStep<2)return;/* skipped before the goal screen \u2014 keep the defaults */
  if(typeof GOALS!=='undefined'&&GOALS.length){GOALS[0].why=obWhy;GOALS[0].pct=obPct;}
  if(typeof syncPrimaryGoal==='function')syncPrimaryGoal();
}
/* budget-setup onboarding screen (OB3, 2026-07 redesign): income slider + donut on the
   left, Current/Goal dollar sliders per money area (save/spend/invest) on the right. */
var obIncome=2500;
var obCur={save:300,spend:1500,invest:200},obGoal={save:450,spend:1300,invest:300};
/* literal hex (not var()) to match how every other inline-SVG donut in this app colors
   its segments — save/spend/invest feature colors + earn green for what's left over */
var OBB_C={save:'#e4da82',spend:'#d45c32',invest:'#aea2d2',left:'#619f88'};
function obbPaint(id,color,v,max){
  var el=document.getElementById(id);if(!el)return;
  var p=max>0?Math.min(100,v/max*100):0;
  el.style.background='linear-gradient(90deg,'+color+' '+p+'%,#ececec '+p+'%)';
}
function obbSync(area,which){
  var v=(which==='Cur'?obCur:obGoal)[area];
  var id='ob'+area.charAt(0).toUpperCase()+area.slice(1)+which;
  obbPaint(id,OBB_C[area],v,obIncome);
  var lb=document.getElementById(id+'Val');if(lb)lb.textContent='$'+(+v).toLocaleString();
}
function obBudget(key,v){
  var m=key.match(/^(save|spend|invest)(Cur|Goal)$/);if(!m)return;
  (m[2]==='Cur'?obCur:obGoal)[m[1]]=+v;
  obbSync(m[1],m[2]);
  if(key==='investGoal')obPct=Math.max(1,Math.round(+v/Math.max(1,obIncome)*100));
  renderObSplitDonut();
}
function onObIncome(v){
  obIncome=+v;
  var lb=document.getElementById('obIncomeVal');if(lb)lb.textContent='$'+obIncome.toLocaleString();
  obbPaint('obIncomeSlider',OBB_C.left,obIncome,10000);
  ['save','spend','invest'].forEach(function(a){['Cur','Goal'].forEach(function(w){
    var el=document.getElementById('ob'+a.charAt(0).toUpperCase()+a.slice(1)+w);
    if(el){el.max=obIncome;}
    var st=(w==='Cur'?obCur:obGoal);if(st[a]>obIncome){st[a]=obIncome;if(el)el.value=obIncome;}
    obbSync(a,w);
  });});
  renderObSplitDonut();
}
/* paint every slider + the donut from state — called when the step opens */
function initOBBudget(){
  onObIncome(obIncome);
}
function renderObSplitDonut(){
  var total=Math.max(obIncome,obGoal.save+obGoal.spend+obGoal.invest,1);
  var left=Math.max(0,obIncome-obGoal.save-obGoal.spend-obGoal.invest);
  var pc=function(v){return Math.round(v/total*100);};
  var segs=[{v:obGoal.spend/total,c:OBB_C.spend},{v:obGoal.save/total,c:OBB_C.save},{v:obGoal.invest/total,c:OBB_C.invest},{v:left/total,c:OBB_C.left}];
  var el=document.getElementById('obSplitDonut');if(el)el.innerHTML=donutChart(segs,150,'');
  var leg=document.getElementById('obSplitLegend');
  if(leg)leg.innerHTML='<span class="ob-split-dot" style="background:'+OBB_C.spend+'"></span>'+pc(obGoal.spend)+'%'
    +'<span class="ob-split-dot" style="background:'+OBB_C.save+'"></span>'+pc(obGoal.save)+'%'
    +'<span class="ob-split-dot" style="background:'+OBB_C.invest+'"></span>'+pc(obGoal.invest)+'%'
    +'<span class="ob-split-dot" style="background:'+OBB_C.left+'"></span>'+pc(left)+'%';
}
/* write the GOAL sliders into the real BUDGET (income + Savings category + scaled remaining
   categories) so Home/Budget reflect what was set here, same pattern as applyOBGoal above */
function applyOBBudget(){
  if(obStep<3||typeof BUDGET==='undefined')return;
  BUDGET.income=obIncome;
  var savings=BUDGET.categories.filter(function(c){return c.name==='Savings';})[0];
  if(savings)savings.limit=obGoal.save;else BUDGET.categories.push({name:'Savings',limit:obGoal.save});
  var others=BUDGET.categories.filter(function(c){return c.name!=='Savings';});
  var curTotal=others.reduce(function(s,c){return s+c.limit;},0)||1;
  others.forEach(function(c){c.limit=Math.round(c.limit/curTotal*obGoal.spend);});
  obPct=Math.max(1,Math.round(obGoal.invest/Math.max(1,obIncome)*100));
}
function finishOB(){
  applyOBUser();
  applyOBGoal();
  applyOBBudget();
  onboarded=true;saveState();
  enterApp();
  setTimeout(function(){showToast('🎉 Your journey has begun!');},400);
}
function startWelcome(){
  var w=document.getElementById('welcome');
  w.style.transition='opacity .4s ease';w.style.opacity='0';
  setTimeout(function(){w.classList.add('hidden');w.style.opacity='';w.style.transition='';},400);
}
function restartOnboarding(){obStep=1;renderOB();document.getElementById('welcome').classList.remove('hidden');document.getElementById('onboarding').classList.remove('hidden');document.getElementById('appHeader').classList.add('hidden');document.getElementById('appNav').classList.add('hidden');document.getElementById('coachFab').classList.add('hidden');closeCoachBtn();}
var obWhy='Grow my money through investing',obConf='New to personal finance',obPct=10;
/* OB2 + OB3 share the .why pill class, so selection is scoped to each screen's own grid */
function pickWhy(el){el.parentElement.querySelectorAll('.why').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');obWhy=el.textContent;}
function pickConf(el){el.parentElement.querySelectorAll('.why').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');obConf=el.textContent;}

/* ── In-screen tabs ──────────────────────────── */
var jCur='hold';
function jTab(el,k){
  jCur=k;
  if(el)document.querySelectorAll('#page-journey .subtab').forEach(function(t){t.classList.remove('active');}),el.classList.add('active');
  var map={hold:'jHold',trade:'jTrade',watch:'jWatch',act:'jAct',plan:'jPlan'};
  for(var n in map)document.getElementById(map[n]).style.display=(n===k)?'':'none';
  if(k==='hold')renderHoldings();
  if(k==='trade')renderTrade();
  if(k==='watch')renderWatch();
  if(k==='act')renderActivity();
  if(k==='plan')renderJourneyPlan();
}

