/* ── Navigation ──────────────────────────────── */
var TAB_OF={home:'home',learn:'learn',tools:'tools',social:'social',journey:'journey',scenario:'journey',risk:'journey',stockfinder:'tools',budget:'home',goals:'home',spending:'home',networth:'accounts',accounts:'accounts',
  'loan-calc':'tools','mortgage-calc':'tools','game-swipe':'tools','game-wnb':'tools','game-scam':'tools','game-wordle':'tools','game-xword':'tools','game-quiz':'tools','game-hangman':'tools','game-invest':'tools'};
var TITLES={home:"Fiscally",learn:'Learn',tools:'Explore',social:'Profile',journey:'Practice',scenario:'Scenarios',risk:'Risk Level',stockfinder:'Stock Finder',budget:'Budget',goals:'Savings Goals',spending:'Spending',networth:'Net Worth',accounts:'My Accounts',
  'loan-calc':'Loan Calculator','mortgage-calc':'Mortgage Calculator','game-swipe':'Budget Swipe','game-wnb':'Wants vs Needs','game-scam':'Scammer Scanner','game-wordle':'Finance Wordle','game-xword':'Finance Crossword','game-quiz':'Quick Count','game-hangman':"Debtor's Tower",'game-invest':'Invest Game'};
var stack=['home'];
function show(id){
  closeL();closeTipBtn();/* never leave a lesson/term sheet floating over a new tab */
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('page-'+id).classList.add('active');
  if(id==='learn')renderLearn();
  if(id==='journey'){applyPracticeLevel();refreshHeldPrices();}
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
  var isSub=['scenario','risk','stockfinder','budget','goals','spending','networth','loan-calc','mortgage-calc','game-swipe','game-wnb','game-scam','game-wordle','game-xword','game-quiz','game-hangman','game-invest'].indexOf(id)>=0;
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
var obStep=1,OB_MAX=6;
(function initDots(){var h='';for(var i=1;i<=OB_MAX;i++)h+='<div class="ob-dot'+(i===1?' on':'')+'"></div>';document.getElementById('obDots').innerHTML=h;})();
function renderOB(){
  document.querySelectorAll('.ob-screen').forEach(function(s){s.classList.toggle('active',+s.dataset.ob===obStep);});
  document.querySelectorAll('.ob-dot').forEach(function(d,i){d.classList.toggle('on',i===obStep-1);});
  document.getElementById('obNextBtn').textContent=obStep===OB_MAX?"Let's Start! 🚀":'Next';
  if(obStep===OB_MAX)renderOBSummary();
  document.querySelector('.ob-body').scrollTop=0;
}
function obNext(){if(obStep<OB_MAX){obStep++;renderOB();}else finishOB();}
/* what the user actually typed on the goal screen (falling back to the placeholders) */
function obGoalDraft(){
  function txt(id){return ((document.getElementById(id)||{}).value||'').trim();}
  function num(id,dflt){var n=Math.round(parseFloat(txt(id).replace(/[^0-9.]/g,'')));return n>0?n:dflt;}
  return {what:txt('goalWhat')||'A car',amt:num('goalAmt',10000),years:num('goalTime',5)};
}
function renderOBSummary(){
  var g=obGoalDraft(),el=document.getElementById('obGoalSum');
  if(el)el.innerHTML='<b style="color:var(--purple-strong);font-size:18px">Save $'+g.amt.toLocaleString()+'</b><br/>for '+escHtml(g.what.charAt(0).toLowerCase()+g.what.slice(1))+', over '+g.years+' year'+(g.years===1?'':'s');
  var m=document.getElementById('obMs3');
  if(m)m.textContent='Contribute '+obPct+'% of your earnings monthly';
}
/* write the shaped goal into the unified GOALS list (GOALS[0] = primary, same slot
   the Learn goal sheet edits) so Home/Goals/Plan all reflect what was typed here */
function applyOBGoal(){
  if(obStep<3)return;/* skipped before the goal screen — keep the defaults */
  var g=obGoalDraft();
  if(typeof GOALS!=='undefined'){
    if(!GOALS.length)GOALS.unshift({id:moneyUid(),saved:0,account:'TFSA'});
    var g0=GOALS[0];
    /* a different goal than what sat in the slot — don't inherit the old one's progress */
    if(g0.what!==g.what||g0.target!==g.amt||g0.saved==null)g0.saved=0;
    g0.what=g.what;g0.target=g.amt;
    g0.years=g.years;g0.why=obWhy;g0.pct=obPct;
  }
  if(typeof syncPrimaryGoal==='function')syncPrimaryGoal();
}
function finishOB(){
  applyOBGoal();
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
var obWhy='So my money can grow safely',obPct=10;
function pickExp(el,v){document.querySelectorAll('.exp-card').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');}
function pickWhy(el){document.querySelectorAll('.why').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');obWhy=el.textContent;}
function onPct(v){
  obPct=+v;
  renderDonut(+v);
  document.getElementById('donutHi').textContent='$'+(v*300).toLocaleString();
  document.getElementById('donutLo').textContent='$'+(v*30).toLocaleString();
}

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

