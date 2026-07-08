/* ═══════════ Money tools: Budget · Goals · Spending · Net Worth ═══════════ */
/* All-in-one money toolkit. State persists via saveState/loadState (key fiscally.web.v1).
   Kept separate from the legacy single GOAL home card. Classic globals (inline handlers). */

var BUDGET={income:2500,categories:[
  {name:'Rent',limit:900},
  {name:'Groceries',limit:400},
  {name:'Transport',limit:150},
  {name:'Fun',limit:200},
  {name:'Savings',limit:300}
]};
var GOALS=[
  {id:'g1',what:'Emergency fund',target:3000,saved:1200,account:'TFSA'},
  {id:'g2',what:'New laptop',target:1500,saved:300,account:'Cash'}
];
var SPENDING=[];
var NETWORTH={assets:[{name:'Savings account',value:4200},{name:'Chequing',value:800}],
              debts:[{name:'Student loan',value:6000,loanId:'l_seed'},{name:'Credit card',value:450}]};
/* My Accounts ledgers (recorded from the My Accounts screen) */
var LOANS=[{id:'l_seed',name:'Student loan',balance:6000,monthly:75}];
/* Mirrors the "Savings account" asset in NETWORTH so the My Accounts hub and
   Net Worth screens show the same savings balance on load. */
var SAVINGS={balance:4200};
/* Mirrors the "Chequing" asset in NETWORTH — same pattern as Savings above. Deposits
   (paycheck, etc.) add to it; logging a Debit card purchase in My Accounts spends
   from it, same as a real chequing account. */
var CHEQUING={balance:800,deposits:[]};
/* 'have' | 'need' | null — which credit-card toggle the user picked in My Accounts */
var CREDIT_CARD=null;

/* Keep the Net Worth ledger in step with the My Accounts balances: the savings
   and chequing balances write through to their matching NETWORTH asset rows, and
   each loan writes through to the debt row linked by loanId (matching by name is
   only a fallback for saves from before rows carried ids). Only existing rows are
   updated (except addLoan, which registers the new debt, and delLoan, which
   retires it) — deleting a row on the Net Worth page is respected, we never
   resurrect it. */
function syncNetworthMirror(){
  var a=NETWORTH.assets.filter(function(x){return x.name==='Savings account';})[0];
  if(a)a.value=numVal(SAVINGS.balance);
  var c=NETWORTH.assets.filter(function(x){return x.name==='Chequing';})[0];
  if(c)c.value=numVal(CHEQUING.balance);
  NETWORTH.debts.forEach(function(d){
    var l=LOANS.filter(function(x){return d.loanId?x.id===d.loanId:x.name===d.name;})[0];
    if(l)d.value=numVal(l.balance);
  });
}

function moneyUid(){return 'm'+Math.random().toString(36).slice(2,9);}
/* Escape user-entered text before interpolating it into HTML (category, loan, note names). */
function escHtml(s){return (''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function todayISO(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function thisMonth(){return todayISO().slice(0,7);}
function numVal(v){var n=parseFloat((''+v).replace(/[^0-9.\-]/g,''));return isFinite(n)?n:0;}
function moneyInput(id,val,ph,style){return '<input class="f-in" id="'+id+'" inputmode="decimal" placeholder="'+(ph||'0')+'"'+(val!=null?' value="'+val+'"':'')+(style?' style="'+style+'"':'')+'/>';}

/* seed a couple of sample expenses in the current month on first run */
(function seedSpending(){
  if(SPENDING.length)return;
  var m=thisMonth();
  SPENDING=[
    {id:moneyUid(),date:m+'-03',amount:62.40,category:'Groceries',note:'Weekly shop'},
    {id:moneyUid(),date:m+'-05',amount:18.00,category:'Transport',note:'Transit pass top-up'},
    {id:moneyUid(),date:m+'-08',amount:34.99,category:'Fun',note:'Movie + snacks'}
  ];
})();

function monthSpent(cat){
  var m=thisMonth(),t=0;
  SPENDING.forEach(function(s){if(s.category===cat&&(s.date||'').slice(0,7)===m)t+=numVal(s.amount);});
  return t;
}
function monthTotal(){var m=thisMonth(),t=0;SPENDING.forEach(function(s){if((s.date||'').slice(0,7)===m)t+=numVal(s.amount);});return t;}

/* ── Budget ──────────────────────────────────── */
function renderBudget(){
  if(typeof renderBudgetDonutCard==='function')renderBudgetDonutCard();
  if(typeof renderBudgetRecent==='function')renderBudgetRecent();
  if(typeof renderBudgetGoalsCard==='function')renderBudgetGoalsCard();
  if(typeof renderAdvisorCard==='function')renderAdvisorCard('budgetAdvisor');
  var el=document.getElementById('budgetBody');if(!el)return;
  var planned=BUDGET.categories.reduce(function(a,c){return a+numVal(c.limit);},0);
  var leftToBudget=BUDGET.income-planned;
  var spent=monthTotal(),leftToSpend=BUDGET.income-spent;
  var h='<div class="hero budget-hero"><div class="hero-main"><div class="hero-l">Money left to spend this month</div>'
    +'<div class="hero-v tnum">'+money(leftToSpend)+'</div></div>'
    +'<div class="hero-row"><div class="s"><label>Income</label><span class="tnum">'+money0(BUDGET.income)+'</span></div>'
    +'<div class="s"><label>Spent</label><span class="tnum">'+money0(spent)+'</span></div>'
    +'<div class="s"><label>Budgeted</label><span class="tnum">'+money0(planned)+'</span></div></div></div>';

  h+='<div class="card"><div class="card-t">Monthly income</div>'
    +'<label class="f-label">After-tax income you expect each month</label>'
    +'<input class="f-in" inputmode="decimal" value="'+BUDGET.income+'" onchange="setBudgetIncome(this.value)"/>'
    +'<div class="muted-note" style="text-align:left">'+(leftToBudget>=0?money0(leftToBudget)+' is still unbudgeted: give every dollar a job.':'You\'ve budgeted '+money0(-leftToBudget)+' more than you earn.')+'</div></div>';

  h+='<div class="card"><div class="row" style="margin-bottom:12px"><div class="card-t" style="margin-bottom:0">Categories</div><span class="pill pill-pur">'+BUDGET.categories.length+'</span></div>';
  if(!BUDGET.categories.length)h+='<div class="muted-note" style="text-align:left">No categories yet. Add one below.</div>';
  BUDGET.categories.forEach(function(c,i){
    var sp=monthSpent(c.name),lim=numVal(c.limit),pct=lim>0?Math.min(100,Math.round(sp/lim*100)):0,over=sp>lim&&lim>0;
    h+='<div style="margin-bottom:14px"><div class="row" style="margin-bottom:7px">'
      +'<span style="font-weight:700;font-size:13px">'+escHtml(c.name)+'</span>'
      +'<span style="display:flex;align-items:center;gap:8px"><span class="tnum '+(over?'down':'')+'" style="font-size:12px;font-weight:700">'+money0(sp)+' / '+money0(lim)+'</span>'
      +'<button class="adjust" title="Remove" style="padding:4px 8px" onclick="delBudgetCat('+i+')">✕</button></span></div>'
      +'<div class="bar" style="margin:0"><div class="bar-fill" style="width:'+pct+'%'+(over?';background:var(--red)':'')+'"></div></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:8px;align-items:flex-end">'
    +'<div style="flex:2"><label class="f-label">Category</label>'+'<input class="f-in" id="bcName" placeholder="e.g. Eating out"/></div>'
    +'<div style="flex:1"><label class="f-label">Limit</label>'+moneyInput('bcLimit',null,'0')+'</div>'
    +'<button class="btn btn-soft" style="flex:0 0 auto;width:auto;padding:12px 16px" onclick="addBudgetCat()">Add</button></div>';
  h+='</div>';
  el.innerHTML=h;
}
function setBudgetIncome(v){BUDGET.income=numVal(v);saveState();renderBudget();}
function setCatLimit(i,v){if(BUDGET.categories[i]){BUDGET.categories[i].limit=numVal(v);saveState();renderBudget();}}
function addBudgetCat(){
  var n=(document.getElementById('bcName')||{}).value||'',l=(document.getElementById('bcLimit')||{}).value||'';
  n=n.trim();if(!n){showToast('Name the category');return;}
  BUDGET.categories.push({name:n,limit:numVal(l)});saveState();renderBudget();showToast('✓ Added '+n);
}
function delBudgetCat(i){BUDGET.categories.splice(i,1);saveState();renderBudget();}
/* ── Budget tab: donut summary card. "This month" is the only real tab — Today/Last
   month have no matching breakdown in SPENDING, so they're labeled coming-soon
   instead of faking data that doesn't exist. Presentation-only (no hover/click),
   unlike My Accounts' acctDonut() which stays the one interactive/click-to-log donut. ── */
function budgetTab(t){if(t!=='month'){showToast('Coming soon');return;}}
function renderBudgetDonutCard(){
  var el=document.getElementById('budgetDonutCard');if(!el)return;
  var income=numVal(BUDGET.income),planned=BUDGET.categories.reduce(function(a,c){return a+numVal(c.limit);},0);
  var spent=monthTotal(),left=income-spent;
  var pctBudg=income>0?Math.round(planned/income*100):0;
  var cats=BUDGET.categories.slice().sort(function(a,b){return numVal(b.limit)-numVal(a.limit);});
  var segs=cats.slice(0,6).map(function(c,i){return {v:planned>0?numVal(c.limit)/planned:0,c:MONEY_PALETTE[i%MONEY_PALETTE.length]};});
  var rows=cats.slice(0,6).map(function(c,i){
    var pct=planned>0?Math.min(100,Math.round(numVal(c.limit)/planned*100)):0;
    return '<div style="margin-bottom:8px"><div class="row" style="margin-bottom:3px"><span style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:2px;background:'+MONEY_PALETTE[i%MONEY_PALETTE.length]+'"></span>'+escHtml(c.name)+'</span><span class="tnum" style="font-size:12px;color:var(--muted)">'+money0(c.limit)+'</span></div>'
      +'<div class="bar" style="margin:0"><div class="bar-fill" style="width:'+pct+'%;background:'+MONEY_PALETTE[i%MONEY_PALETTE.length]+'"></div></div></div>';
  }).join('')||'<div class="muted-note">No categories yet.</div>';
  el.innerHTML='<div class="card" style="margin:0">'
    +'<div class="row" style="margin-bottom:12px">'
    +'<div class="subtabs" style="margin:0"><div class="subtab active" onclick="budgetTab(\'month\')">This month</div><div class="subtab" onclick="budgetTab(\'today\')">Today</div><div class="subtab" onclick="budgetTab(\'last\')">Last month</div></div>'
    +'</div>'
    +'<div class="row" style="margin-bottom:12px"><span class="pill '+(left>=0?'pill-grn':'pill-red')+'">'+money0(left)+' left</span><span class="tnum" style="font-size:12px;color:var(--muted)">'+money0(spent)+' spent of '+money0(income)+'</span></div>'
    +'<div style="display:flex;gap:16px;align-items:flex-start"><div style="flex:0 0 auto">'+miniDonut(segs,110,pctBudg+'%','budgeted')+'</div>'
    +'<div style="flex:1;min-width:0">'+rows+'</div></div></div>';
}
/* ── Budget tab: read-only preview of the 5 most recent expenses (full editing
   stays on the dedicated Spending page — this is a summary, not a second editor) ── */
function renderBudgetRecent(){
  var el=document.getElementById('budgetRecentCard');if(!el)return;
  var recent=SPENDING.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,5);
  var rows=recent.map(function(s){
    return '<div class="lrow"><div style="min-width:0"><div class="l-n">'+escHtml(s.note||s.category)+'</div><div class="l-s">'+escHtml(s.category)+'</div></div>'
      +'<div class="l-v"><div class="l-p tnum down">-'+money0(s.amount)+'</div></div></div>';
  }).join('')||'<div class="muted-note" style="text-align:left">No expenses logged yet.</div>';
  el.innerHTML='<div class="card">'
    +'<div class="row" style="margin-bottom:8px"><div class="card-t" style="margin-bottom:0;color:var(--spend-deep)">Recent Expenses</div>'
    +'<button class="btn-taupe" style="width:auto;padding:8px 12px;font-size:12px" onclick="push(\'spending\')">View All</button></div>'
    +rows+'</div>';
}
/* ── Budget tab: goals-reached summary — a generic target icon, never Penny
   (the fox mascot is Learn-tab-only per brand rules, never appears elsewhere) ── */
function renderBudgetGoalsCard(){
  var el=document.getElementById('budgetGoalsCard');if(!el)return;
  var list=(typeof GOALS!=='undefined'?GOALS:[]),reached=list.filter(function(g){return numVal(g.saved)>=numVal(g.target)&&numVal(g.target)>0;}).length;
  var saved=list.reduce(function(a,g){return a+numVal(g.saved);},0);
  var rows=list.slice(0,4).map(function(g){
    var done=numVal(g.saved)>=numVal(g.target)&&numVal(g.target)>0;
    return '<div class="row" style="margin-top:12px"><span style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700">'
      +'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="'+(done?'#619f88':'rgba(255,255,255,.45)')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(done?'<circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>':'<circle cx="12" cy="12" r="9"/>')+'</svg>'
      +escHtml(g.what)+'</span><span style="font-size:11px;color:rgba(255,255,255,.6)">'+(done?'Reached':money0(g.saved)+' / '+money0(g.target))+'</span></div>';
  }).join('')||'<div style="font-size:12.5px;color:rgba(255,255,255,.65);margin-top:8px">No goals yet.</div>';
  el.innerHTML='<div class="darkcard">'
    +'<div class="row"><div class="dc-t">'+reached+'/'+list.length+' Goals Reached</div><span class="see-all" style="color:#fff" onclick="push(\'goals\')">View All</span></div>'
    +'<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:3px">'+money0(saved)+' saved</div>'
    +rows+'</div>';
}

/* ── Savings Goals (multi-goal list) ─────────── */
function renderGoals(){
  var el=document.getElementById('goalsBody');if(!el)return;
  var saved=GOALS.reduce(function(a,g){return a+numVal(g.saved);},0),target=GOALS.reduce(function(a,g){return a+numVal(g.target);},0);
  var pct=target>0?Math.min(100,Math.round(saved/target*100)):0;
  var h='<div class="hero"><div class="hero-l">Saved across all goals</div>'
    +'<div class="hero-v tnum">'+money0(saved)+'</div>'
    +'<div class="hero-c">'+pct+'% of '+money0(target)+' total</div></div>';
  h+='<div class="card"><div class="row" style="gap:8px;align-items:flex-end">'
    +'<div style="flex:2"><label class="f-label">New goal</label><input class="f-in" id="goName" placeholder="e.g. Trip to Japan"/></div>'
    +'<div style="flex:1"><label class="f-label">Target</label>'+moneyInput('goTarget',null,'0')+'</div>'
    +'<button class="btn btn-soft" style="flex:0 0 auto;width:auto;padding:12px 16px" onclick="addGoal()">Add</button></div></div>';
  if(!GOALS.length)h+='<div class="card"><div class="muted-note" style="text-align:left">No goals yet — add your first above.</div></div>';
  GOALS.forEach(function(g){
    var gp=numVal(g.target)>0?Math.min(100,Math.round(numVal(g.saved)/numVal(g.target)*100)):0,done=gp>=100;
    h+='<div class="goal-card"><div class="row"><div style="font-size:14px;font-weight:800">'+(done?'🏆 ':'🎯 ')+escHtml(g.what)+'</div>'
      +'<span class="pill '+(done?'pill-grn':'pill-pur')+'">'+gp+'%</span></div>'
      +'<div class="bar"><div class="bar-fill" style="width:'+gp+'%"></div></div>'
      +'<div class="row"><span style="font-size:11px;color:var(--muted)">'+money0(g.saved)+' of '+money0(g.target)+(g.account?' · '+g.account:'')+'</span></div>'
      +'<div class="row" style="gap:8px;margin-top:8px;align-items:stretch">'+moneyInput('gc_'+g.id,null,'Add amount','margin-bottom:0')
      +'<button class="btn btn-pur" style="width:auto;padding:8px 16px;white-space:nowrap" onclick="goalContribute(\''+g.id+'\')">Add to savings</button>'
      +'<button class="adjust" title="Delete goal" onclick="delGoal(\''+g.id+'\')">✕</button></div></div>';
  });
  el.innerHTML=h;
}
function syncGoalHome(){if(typeof renderGoalCard==='function')renderGoalCard();}
function addGoal(){
  var n=(document.getElementById('goName')||{}).value||'',t=(document.getElementById('goTarget')||{}).value||'';
  n=n.trim();if(!n){showToast('Name your goal');return;}
  GOALS.push({id:moneyUid(),what:n,target:numVal(t),saved:0,account:'TFSA'});saveState();renderGoals();syncGoalHome();showToast('🎯 Goal added');
}
function goalContribute(id){
  var inp=document.getElementById('gc_'+id),amt=numVal(inp&&inp.value);if(amt<=0){showToast('Enter an amount');return;}
  var g=GOALS.filter(function(x){return x.id===id;})[0];if(!g)return;
  g.saved=numVal(g.saved)+amt;saveState();renderGoals();syncGoalHome();
  showToast(numVal(g.saved)>=numVal(g.target)?'🏆 Goal reached!':'✓ Added '+money0(amt));
}
function delGoal(id){GOALS=GOALS.filter(function(x){return x.id!==id;});saveState();renderGoals();syncGoalHome();}

/* ── Spending / Expenses ─────────────────────── */
function renderSpending(){
  var el=document.getElementById('spendBody');if(!el)return;
  var cats=BUDGET.categories.map(function(c){return c.name;});if(cats.indexOf('Other')<0)cats.push('Other');
  var h='<div class="hero"><div class="hero-l">Spent this month</div><div class="hero-v tnum">'+money(monthTotal())+'</div>'
    +'<div class="hero-c">'+SPENDING.filter(function(s){return (s.date||'').slice(0,7)===thisMonth();}).length+' transactions</div></div>';
  // add form
  h+='<div class="card"><div class="card-t">Log an expense</div>'
    +'<div class="row" style="gap:8px;align-items:flex-end">'
    +'<div style="flex:1"><label class="f-label">Amount</label>'+moneyInput('exAmt',null,'0')+'</div>'
    +'<div style="flex:1.4"><label class="f-label">Category</label><select class="f-in" id="exCat">'
      +cats.map(function(c){return '<option>'+escHtml(c)+'</option>';}).join('')+'</select></div></div>'
    +'<label class="f-label">Note (optional)</label><input class="f-in" id="exNote" placeholder="What was it for?"/>'
    +'<label class="f-label">Date</label><input class="f-in" id="exDate" type="date" value="'+todayISO()+'"/>'
    +'<button class="btn btn-pur" style="margin-top:12px" onclick="addExpense()">Add expense</button></div>';
  // by-category this month
  var byCat={};SPENDING.forEach(function(s){if((s.date||'').slice(0,7)===thisMonth())byCat[s.category]=(byCat[s.category]||0)+numVal(s.amount);});
  var catKeys=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];});
  if(catKeys.length){
    h+='<div class="card"><div class="card-t">This month by category</div>';
    catKeys.forEach(function(c){h+='<div class="lrow"><div class="l-n">'+escHtml(c)+'</div><div class="l-v"><div class="l-p tnum">'+money0(byCat[c])+'</div></div></div>';});
    h+='</div>';
  }
  // recent list
  var recent=SPENDING.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,20);
  h+='<div class="card"><div class="card-t">Recent</div>';
  if(!recent.length)h+='<div class="muted-note" style="text-align:left">No expenses logged yet.</div>';
  recent.forEach(function(s){
    h+='<div class="lrow"><div style="min-width:0"><div class="l-n">'+escHtml(s.note||s.category)+'</div><div class="l-s">'+escHtml(s.category)+' · '+(s.date||'')+'</div></div>'
      +'<div style="display:flex;align-items:center;gap:8px"><div class="l-v"><div class="l-p tnum down">-'+money0(s.amount)+'</div></div>'
      +'<button class="adjust" title="Delete" style="padding:4px 8px" onclick="delExpense(\''+s.id+'\')">✕</button></div></div>';
  });
  h+='</div>';
  // reusable Financial Advisor card — Mia's live nudge + a shortcut into Coach Chat
  h+='<div id="spendAdvisor"></div>';
  el.innerHTML=h;
  if(typeof renderAdvisorCard==='function')renderAdvisorCard('spendAdvisor');
}
function addExpense(){
  var amt=numVal((document.getElementById('exAmt')||{}).value);if(amt<=0){showToast('Enter an amount');return;}
  var cat=(document.getElementById('exCat')||{}).value||'Other',note=((document.getElementById('exNote')||{}).value||'').trim();
  var date=(document.getElementById('exDate')||{}).value||todayISO();
  SPENDING.push({id:moneyUid(),date:date,amount:amt,category:cat,note:note});saveState();renderSpending();showToast('✓ Logged '+money0(amt)+' · '+cat);
}
function delExpense(id){
  var s=SPENDING.filter(function(x){return x.id===id;})[0];
  if(s&&s.acct==='Debit card'){CHEQUING.balance=numVal(CHEQUING.balance)+numVal(s.amount);syncNetworthMirror();}
  SPENDING=SPENDING.filter(function(x){return x.id!==id;});
  saveState();renderSpending();if(typeof renderAcctDebit==='function')renderAcctDebit();
}

/* ── Net Worth ───────────────────────────────── */
function networthRows(){
  /* live practice portfolio shown as a read-only asset */
  var live=(typeof totals==='function')?totals().total:0;
  var assets=NETWORTH.assets.reduce(function(a,x){return a+numVal(x.value);},0)+live;
  var debts=NETWORTH.debts.reduce(function(a,x){return a+numVal(x.value);},0);
  return {assets:assets,debts:debts,net:assets-debts,live:live};
}
function renderNetworth(){
  var el=document.getElementById('nwBody');if(!el)return;
  var t=networthRows();
  var h='<div class="hero"><div class="hero-l">Net worth</div><div class="hero-v tnum">'+money(t.net)+'</div>'
    +'<div class="hero-row"><div class="s"><label>Assets</label><span class="tnum">'+money0(t.assets)+'</span></div>'
    +'<div class="s"><label>Debts</label><span class="tnum">'+money0(t.debts)+'</span></div></div></div>';
  // assets
  h+='<div class="card"><div class="card-t">Assets</div>';
  h+='<div class="lrow"><div class="l-n">Practice portfolio <span class="pill pill-grn" style="font-size:10px">live</span></div><div class="l-v"><div class="l-p tnum">'+money0(t.live)+'</div></div></div>';
  NETWORTH.assets.forEach(function(a,i){
    h+='<div class="lrow"><div class="l-n">'+escHtml(a.name)+'</div><div style="display:flex;align-items:center;gap:8px"><div class="l-v"><div class="l-p tnum">'+money0(a.value)+'</div></div><button class="adjust" style="padding:4px 8px" onclick="delNW(\'assets\','+i+')">✕</button></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:8px;align-items:flex-end"><div style="flex:2"><input class="f-in" id="naName" placeholder="Asset (e.g. Car)"/></div><div style="flex:1">'+moneyInput('naVal',null,'0')+'</div><button class="btn btn-soft" style="width:auto;padding:12px 16px" onclick="addNW(\'assets\')">Add</button></div></div>';
  // debts
  h+='<div class="card"><div class="card-t">Debts</div>';
  if(!NETWORTH.debts.length)h+='<div class="muted-note" style="text-align:left">No debts — nice.</div>';
  NETWORTH.debts.forEach(function(d,i){
    h+='<div class="lrow"><div class="l-n">'+escHtml(d.name)+'</div><div style="display:flex;align-items:center;gap:8px"><div class="l-v"><div class="l-p tnum down">-'+money0(d.value)+'</div></div><button class="adjust" style="padding:4px 8px" onclick="delNW(\'debts\','+i+')">✕</button></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:8px;align-items:flex-end"><div style="flex:2"><input class="f-in" id="ndName" placeholder="Debt (e.g. Credit card)"/></div><div style="flex:1">'+moneyInput('ndVal',null,'0')+'</div><button class="btn btn-soft" style="width:auto;padding:12px 16px" onclick="addNW(\'debts\')">Add</button></div></div>';
  el.innerHTML=h;
}
function addNW(kind){
  var pre=kind==='assets'?'na':'nd';
  var n=((document.getElementById(pre+'Name')||{}).value||'').trim(),v=numVal((document.getElementById(pre+'Val')||{}).value);
  if(!n){showToast('Name it first');return;}
  NETWORTH[kind].push({name:n,value:v});saveState();renderNetworth();showToast('✓ Added '+n);
}
function delNW(kind,i){NETWORTH[kind].splice(i,1);saveState();renderNetworth();}

/* ═══════════ My Accounts hub (educational discovery screen) ═══════════ */
/* Mirrors the real-life money map: Spending · Saving · Investing. No balances to
 * edit here, it's a guided intro that hands off to Learn / Practice / a help sheet.
 * Net Worth stays the place to record numbers. */
/* the result is always embedded inside a double-quoted onclick="..." attribute, so
 * escape both JS-string quotes (') and HTML-attribute quotes (") — a literal " in t/d
 * used to silently truncate the handler (e.g. help text quoting a term like "avalanche"). */
function acctHelp(t,d){function esc(s){return (''+s).replace(/'/g,"\\'").replace(/"/g,'&quot;');}return "openSheet('"+esc(t)+"','"+esc(d)+"')";}
function helpDot(term){return '<button class="acct-q" onclick="openTip(\''+term+'\')" title="What\'s this?">?</button>';}
function acctChat(text,onclick){
  return '<div class="acct-chat" onclick="'+onclick+'"><div class="ac-ic">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 4z"/><path d="M8 9h6M8 12h3"/></svg>'
    +'</div><div class="ac-tx">'+text+'</div><div class="ac-go">›</div></div>';
}
/* ── inline graphics ── */
function bankCardSVG(kind){
  var c=kind==='debit'?{a:'#619f88',chip:'#e2efe9',t:'DEBIT'}:{a:'#55504a',chip:'#efece2',t:'CREDIT'};
  var gid='cardSheen_'+kind;
  return '<svg viewBox="0 0 80 52" width="62" height="40" style="display:block;border-radius:8px;box-shadow:var(--shadow);flex-shrink:0">'
    +'<rect width="80" height="52" rx="8" fill="'+c.a+'"/>'
    +'<rect width="80" height="52" rx="8" fill="url(#'+gid+')" opacity=".18"/>'
    +'<rect x="9" y="20" width="15" height="12" rx="2.5" fill="'+c.chip+'"/>'
    +'<path d="M9 26h15M16.5 20v12" stroke="'+c.a+'" stroke-width="1" opacity=".55"/>'
    +'<circle cx="62" cy="40" r="8" fill="rgba(255,255,255,.32)"/><circle cx="53" cy="40" r="8" fill="rgba(255,255,255,.2)"/>'
    +'<text x="9" y="46" font-size="6.5" font-weight="800" fill="rgba(255,255,255,.92)" font-family="\'Poppins\',sans-serif" letter-spacing=".5">'+c.t+'</text>'
    +'<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>';
}
function loanSVG(){
  return '<svg viewBox="0 0 48 48" width="48" height="48" style="flex-shrink:0"><rect x="3" y="3" width="42" height="42" rx="12" fill="#f5ddc9"/>'
    +'<path d="M13 30c3-2 6-2 9 0 3 2 7 1 9-2" stroke="#c96a2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    +'<circle cx="31" cy="18" r="6.5" fill="#fff" stroke="#c96a2e" stroke-width="2.4"/>'
    +'<text x="31" y="21.5" font-size="9" font-weight="800" fill="#c96a2e" text-anchor="middle" font-family="\'Poppins\',sans-serif">$</text></svg>';
}
function piggySVG(){
  return '<svg viewBox="0 0 48 48" width="48" height="48" style="flex-shrink:0"><rect x="2" y="2" width="44" height="44" rx="13" fill="#f4eccf"/>'
    +'<ellipse cx="23" cy="27" rx="13" ry="10" fill="#d98fb0"/>'
    +'<path d="M12 20l-2-4 6 1.5z" fill="#d98fb0"/>'
    +'<ellipse cx="34" cy="27" rx="6" ry="6.5" fill="#e6a3c0"/>'
    +'<circle cx="35" cy="26" r="1.3" fill="#9a5d77"/><circle cx="33" cy="26" r="1.3" fill="#9a5d77"/>'
    +'<circle cx="20" cy="24" r="1.5" fill="#7d4a60"/>'
    +'<rect x="20" y="16.5" width="8" height="2.4" rx="1.2" fill="#9a5d77"/>'
    +'<rect x="16" y="35" width="3" height="4.5" rx="1.4" fill="#c97ba1"/><rect x="27" y="35" width="3" height="4.5" rx="1.4" fill="#c97ba1"/></svg>';
}
function investSVG(){
  return '<svg viewBox="0 0 48 48" width="48" height="48" style="flex-shrink:0"><rect x="2" y="2" width="44" height="44" rx="13" fill="#edeaf6"/>'
    +'<rect x="12" y="28" width="5" height="8" rx="1.5" fill="#aea2d2"/><rect x="21" y="23" width="5" height="13" rx="1.5" fill="#8b7cba"/><rect x="30" y="18" width="5" height="18" rx="1.5" fill="#8b7cba"/>'
    +'<path d="M12 24l8-6 5 4 9-9" stroke="#619f88" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<path d="M31 13h4v4" stroke="#619f88" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

/* My Accounts is a tracker first: each account section owns its own container and
 * re-renders in isolation, so logging several things in a row never resets the
 * "paid with" choice, drops focus, or wipes a half-typed field elsewhere. */
var acctPay='Debit card',acctCat='';
var DONUT=[],DONUT_TOTAL=0;

/* Interactive spending donut: hover a slice → centre updates; click → sets the
 * logger category. Re-rendered on every add, so it stays live. Soft pastel ring. */
function arcPath(cx,cy,r,a0,a1){
  var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
  var large=(a1-a0)>Math.PI?1:0;
  return 'M'+x0.toFixed(2)+' '+y0.toFixed(2)+' A'+r+' '+r+' 0 '+large+' 1 '+x1.toFixed(2)+' '+y1.toFixed(2);
}
function acctDonut(){
  var cats=BUDGET.categories.map(function(c){return c.name;});
  if(cats.indexOf('Other')<0)cats.push('Other');
  var data=[];cats.forEach(function(c){var v=monthSpent(c);if(v>0)data.push({name:c,val:v});});
  data.sort(function(a,b){return b.val-a.val;});
  var total=data.reduce(function(a,d){return a+d.val;},0);
  DONUT=data;DONUT_TOTAL=total;
  if(!total)return '<div class="donut-empty"><div class="de-ic">🧾</div><div class="de-t">No spending logged yet</div>'
    +'<div class="de-d">Add an expense above and it\'ll appear here as a live breakdown.</div></div>';
  data.forEach(function(d,i){d.pct=Math.round(d.val/total*100);d.color=MONEY_PALETTE[i%MONEY_PALETTE.length];});
  var cx=65,cy=65,r=48,sw=18,gap=data.length>1?0.05:0,ang=-Math.PI/2;
  var svg='<svg viewBox="0 0 130 130" width="122" height="122" style="display:block;flex:0 0 auto">'
    +'<circle cx="65" cy="65" r="48" fill="none" stroke="#f2efe4" stroke-width="'+sw+'"/>';
  data.forEach(function(d,i){
    var a0=ang,a1=ang+(d.val/total)*2*Math.PI;ang=a1;
    var common='id="dnArc'+i+'" fill="none" stroke="'+d.color+'" stroke-width="'+sw+'" stroke-linecap="round" style="cursor:pointer;transition:opacity .15s" '
      +'onmouseover="donutHover('+i+')" onmouseout="donutHover(-1)" onclick="donutPick('+i+')"';
    if(data.length===1)svg+='<circle cx="65" cy="65" r="48" '+common+'/>';
    else svg+='<path d="'+arcPath(cx,cy,r,a0+gap/2,a1-gap/2)+'" '+common+'/>';
  });
  svg+='<text id="dnTop" x="65" y="63" text-anchor="middle" font-size="21" font-weight="800" fill="#000000" font-family="\'Poppins\',sans-serif">'+money0(total)+'</text>'
    +'<text id="dnSub" x="65" y="80" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6f6b64" font-family="\'Poppins\',sans-serif">spent this month</text></svg>';
  var leg='<div class="donut-legend">';
  data.forEach(function(d,i){
    leg+='<div class="dleg" id="dnLeg'+i+'" onmouseover="donutHover('+i+')" onmouseout="donutHover(-1)" onclick="donutPick('+i+')">'
      +'<span class="dl-dot" style="background:'+d.color+'"></span><span class="dl-n">'+escHtml(d.name)+'</span>'
      +'<span class="dl-v tnum">'+money0(d.val)+'</span></div>';
  });
  return '<div class="donut-wrap">'+svg+leg+'</div></div>';
}
function donutHover(i){
  var top=document.getElementById('dnTop');if(!top)return;
  var sub=document.getElementById('dnSub');
  if(i<0||!DONUT[i]){top.textContent=money0(DONUT_TOTAL);sub.textContent='spent this month';}
  else{top.textContent=money0(DONUT[i].val);sub.textContent=DONUT[i].name+' · '+DONUT[i].pct+'%';}
  DONUT.forEach(function(d,k){
    var a=document.getElementById('dnArc'+k);if(a)a.style.opacity=(i<0||k===i)?'1':'0.28';
    var l=document.getElementById('dnLeg'+k);if(l)l.style.background=(k===i)?'var(--surface-soft)':'';
  });
}
function donutPick(i){
  var d=DONUT[i];if(!d)return;var name=d.name;
  acctCat=name;var sel=document.getElementById('axCat');if(sel)sel.value=name;
  var amt=document.getElementById('axAmt');if(amt)amt.focus();
  showToast('Logging to '+name+' — enter an amount');
}

/* ── Summary strip: the glanceable snapshot at the top ── */
function renderAcctSummary(){
  var box=document.getElementById('acctSummary');if(!box)return;
  var bp=(typeof PF!=='undefined')?numVal(PF.cash):0;
  var owe=LOANS.reduce(function(a,l){return a+numVal(l.balance);},0);
  function tile(ic,label,val,cls){return '<div class="sum-tile"><div class="st-l">'+ic+' '+label+'</div><div class="st-v tnum '+(cls||'')+'">'+val+'</div></div>';}
  box.innerHTML='<div class="acct-sum">'
    +tile('💳','Chequing',money0(CHEQUING.balance),numVal(CHEQUING.balance)<0?'down':'')
    +tile('🐷','Savings',money0(SAVINGS.balance),'up')
    +tile('⚡','Buying power',money0(bp),'')
    +tile('📉','Owed',money0(owe),'down')
    +tile('🧾','Spent this month',money0(monthTotal()),'')
    +'</div>';
}

/* ── Debit Card: a real chequing balance, like Savings — "Add money" deposits into
 * it, and logging a Debit-card purchase below spends from it. Recent purchases are
 * filtered from the same SPENDING ledger the logger writes to. ── */
function renderAcctDebit(){
  var box=document.getElementById('acctDebitBox');if(!box)return;
  var bal=numVal(CHEQUING.balance);
  var deps=(CHEQUING.deposits||[]).map(function(d){return {date:d.date,label:escHtml(d.source||'Deposit'),amount:d.amount,cls:'up',sign:'+'};});
  var purchases=SPENDING.filter(function(s){return s.acct==='Debit card';})
    .map(function(s){return {date:s.date,label:escHtml(s.note||s.category),amount:s.amount,cls:'down',sign:'-'};});
  var txns=deps.concat(purchases).sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,3);
  var h='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:12px">'+bankCardSVG('debit')
    +'<div><div class="ac-name" style="margin:0">Debit Card</div><div class="ac-note" style="margin-top:2px">Balance</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:8px"><span class="tnum" style="font-size:19px;font-weight:800;color:'+(bal<0?'var(--red)':'var(--green)')+'">'+money0(bal)+'</span>'+helpDot('debit_card')+'</div></div>';
  if(txns.length){
    txns.forEach(function(x){h+='<div class="txn"><span>'+x.label+'</span><span class="'+x.cls+'">'+x.sign+money0(x.amount)+'</span></div>';});
  }else{
    h+='<div class="ac-note" style="margin-bottom:2px">No debit activity logged yet</div>';
  }
  h+='<div class="cat-add" style="margin-top:8px"><input class="f-in" id="chAmt" inputmode="decimal" placeholder="Amount" style="margin:0" onkeydown="if(event.key===\'Enter\')addChequing()"/>'
    +'<input class="f-in" id="chSrc" placeholder="Source (e.g. Paycheck)" style="margin:0" onkeydown="if(event.key===\'Enter\')addChequing()"/>'
    +'<button class="btn btn-soft" onclick="addChequing()">Add money</button></div>';
  box.innerHTML=h+'</div>';
}
function addChequing(){
  var f=document.getElementById('chAmt'),amt=numVal(f&&f.value);if(amt<=0){showToast('Enter an amount');return;}
  var src=((document.getElementById('chSrc')||{}).value||'').trim();
  CHEQUING.balance=numVal(CHEQUING.balance)+amt;
  if(!Array.isArray(CHEQUING.deposits))CHEQUING.deposits=[];
  CHEQUING.deposits.unshift({id:moneyUid(),date:todayISO(),amount:amt,source:src||'Deposit'});
  syncNetworthMirror();saveState();renderAcctDebit();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('chAmt');if(nf)nf.value='';
  var sf=document.getElementById('chSrc');if(sf)sf.value='';
  if(nf)nf.focus();
  showToast('💳 Added '+money0(amt)+' to chequing'+(src?' · '+src:''));
}

/* ── Credit Card: a real, persisted toggle (not just two tooltip triggers) ── */
var CREDIT_HELP={
  have:{t:'Nice, you have a credit card',d:'The golden rule: pay the full balance every month. Do that and the card is free to use, protects your purchases, and steadily builds your credit score. Carry a balance and you get charged high interest (often ~20% a year). Treat it like a debit card you pay off, not extra money.'},
  need:{t:'Thinking about a first credit card',d:'Look for a no-annual-fee starter or student card with a low limit. Used well, a credit card is the easiest way to build the credit score you\'ll need for a phone plan, apartment or car loan later. The rule never changes: only charge what you can pay off in full each month.'}
};
function renderAcctCredit(){
  var box=document.getElementById('acctCreditBox');if(!box)return;
  box.innerHTML='<div class="ac-toggle-row">'
    +'<button class="ac-toggle'+(CREDIT_CARD==='have'?' sel':'')+'" onclick="pickCreditCard(\'have\')">Have one</button>'
    +'<button class="ac-toggle alt'+(CREDIT_CARD==='need'?' sel':'')+'" onclick="pickCreditCard(\'need\')">Need one</button></div>';
}
function pickCreditCard(which){
  CREDIT_CARD=which;saveState();renderAcctCredit();
  var h=CREDIT_HELP[which];openSheet(h.t,h.d);
}

/* ── Spending: one logger row + read-only category bars + recent ── */
function renderAcctSpend(){
  var box=document.getElementById('acctSpendBox');if(!box)return;
  var cats=BUDGET.categories.map(function(c){return c.name;});
  if(cats.indexOf('Other')<0)cats.push('Other');
  if(cats.indexOf(acctCat)<0)acctCat=cats[0];
  var h='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:12px"><div class="ac-name" style="margin:0">🧾 Log spending</div><span class="pill pill-pur">'+money0(monthTotal())+' this month</span></div>'
    +'<div class="logrow">'
    +'<input class="f-in" id="axAmt" inputmode="decimal" placeholder="Amount" style="margin:0" onkeydown="if(event.key===\'Enter\')addAcctExpense()"/>'
    +'<select class="f-in" id="axCat" style="margin:0" onchange="acctCat=this.value">'+cats.map(function(c){return '<option'+(c===acctCat?' selected':'')+'>'+escHtml(c)+'</option>';}).join('')+'</select>'
    +'<select class="f-in" id="axPay" style="margin:0" onchange="acctPay=this.value">'+['Debit card','Credit card','Cash'].map(function(p){return '<option'+(p===acctPay?' selected':'')+'>'+p+'</option>';}).join('')+'</select>'
    +'<button class="btn btn-pur" style="width:auto;flex:0 0 auto;padding:8px 16px" onclick="addAcctExpense()">Add</button></div>';
  /* live breakdown: interactive donut of this month's spending */
  h+=acctDonut();
  var recent=SPENDING.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,3);
  if(recent.length){
    h+='<div style="margin-top:16px"><div class="card-t" style="margin-bottom:8px">Recent</div>';
    recent.forEach(function(s){
      h+='<div class="lrow"><div style="min-width:0"><div class="l-n">'+escHtml(s.note||s.category)+'</div>'
        +'<div class="l-s">'+escHtml(s.category)+(s.acct?' · '+escHtml(s.acct):'')+' · '+(s.date||'')+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:8px"><div class="l-p tnum down">-'+money0(s.amount)+'</div>'
        +'<button class="acct-q" style="width:28px;height:28px;font-size:14px;border-color:var(--line)" title="Delete" onclick="delAcctExpense(\''+s.id+'\')">✕</button></div></div>';
    });
    h+='</div>';
  }
  box.innerHTML=h+'</div>';
}
function addAcctExpense(){
  var f=document.getElementById('axAmt'),amt=numVal(f&&f.value);
  if(amt<=0){showToast('Enter an amount');if(f)f.focus();return;}
  var cat=(document.getElementById('axCat')||{}).value||acctCat||'Other';
  var pay=(document.getElementById('axPay')||{}).value||acctPay||'';
  acctCat=cat;acctPay=pay;
  SPENDING.push({id:moneyUid(),date:todayISO(),amount:amt,category:cat,note:'',acct:pay});
  if(pay==='Debit card'){CHEQUING.balance=numVal(CHEQUING.balance)-amt;syncNetworthMirror();}
  saveState();renderAcctSpend();renderAcctSummary();renderAcctDebit();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('axAmt');if(nf){nf.value='';nf.focus();}/* ready for the next one */
  showToast('✓ Logged '+money0(amt)+' · '+cat);
}
function delAcctExpense(id){
  var s=SPENDING.filter(function(x){return x.id===id;})[0];
  /* deleting a logged purchase is a correction — credit the chequing balance back */
  if(s&&s.acct==='Debit card'){CHEQUING.balance=numVal(CHEQUING.balance)+numVal(s.amount);syncNetworthMirror();}
  SPENDING=SPENDING.filter(function(x){return x.id!==id;});
  saveState();renderAcctSpend();renderAcctSummary();renderAcctDebit();if(typeof renderMoneyHome==='function')renderMoneyHome();
}

/* ── Loans: record loans and log payments against them ── */
function renderAcctLoans(){
  var box=document.getElementById('acctLoansBox');if(!box)return;
  var owe=LOANS.reduce(function(a,l){return a+numVal(l.balance);},0);
  var mo=LOANS.reduce(function(a,l){return a+numVal(l.monthly);},0);
  var sub=LOANS.length?(mo>0?money0(mo)+'/mo total':LOANS.length+' loan'+(LOANS.length===1?'':'s')):'No loans added yet';
  var h='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:16px"><div style="display:flex;align-items:center;gap:12px">'+loanSVG()
    +'<div><div class="ac-name" style="margin:0">Loan Accounts</div><div class="ac-note" style="margin-top:2px">'+sub+'</div></div></div>'
    +(LOANS.length?'<div style="display:flex;align-items:center;gap:8px"><span class="pill pill-loan">owe '+money0(owe)+'</span>'+helpDot('loan_acct')+'</div>':helpDot('loan_acct'))+'</div>';
  LOANS.forEach(function(l,i){
    h+='<div class="loan-row">'
      +'<div class="loan-row-head"><span class="loan-row-name">'+escHtml(l.name)+'</span><span class="loan-row-bal">'+money0(l.balance)+'</span></div>'
      +(numVal(l.monthly)>0?'<div class="loan-row-mo">'+money0(l.monthly)+'/mo</div>':'')
      +'<div class="loan-row-pay">'+moneyInput('lpay'+i,null,'Payment amount','margin:0')
      +'<button class="btn btn-soft" onclick="payLoan('+i+')">Pay</button>'
      +'<button class="loan-row-x" title="Remove loan" onclick="delLoan('+i+')">✕</button></div></div>';
  });
  h+='<div class="loan-add"><label class="f-label">Add a loan</label>'
    +'<input class="f-in" id="loName" placeholder="Loan name (e.g. Car loan)"/>'
    +'<div style="display:flex;gap:8px">'
    +'<div style="flex:1">'+moneyInput('loBal',null,'Amount owed')+'</div>'
    +'<div style="flex:1">'+moneyInput('loMo',null,'Monthly payment')+'</div></div>'
    +'<button class="btn btn-soft" style="width:100%" onclick="addLoan()">Add loan</button></div>';
  box.innerHTML=h+'</div>';
}
function addLoan(){
  var n=((document.getElementById('loName')||{}).value||'').trim();
  if(!n){showToast('Name the loan');return;}
  var bal=numVal((document.getElementById('loBal')||{}).value);
  var loan={id:moneyUid(),name:n,balance:bal,monthly:numVal((document.getElementById('loMo')||{}).value)};
  LOANS.push(loan);
  /* adopt a legacy same-named row (pre-loanId saves); otherwise each loan gets its own debt row */
  var d=NETWORTH.debts.filter(function(x){return !x.loanId&&x.name===n;})[0];
  if(d){d.value=bal;d.loanId=loan.id;}else NETWORTH.debts.push({name:n,value:bal,loanId:loan.id});
  saveState();renderAcctLoans();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();showToast('✓ Added '+n);
}
function payLoan(i){
  var l=LOANS[i];if(!l)return;
  var amt=numVal((document.getElementById('lpay'+i)||{}).value);
  if(amt<=0){showToast('Enter a payment');return;}
  l.balance=Math.max(0,numVal(l.balance)-amt);
  syncNetworthMirror();
  saveState();renderAcctLoans();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  showToast(l.balance<=0?'🎉 '+l.name+' paid off!':'✓ Paid '+money0(amt)+' · '+l.name);
}
function delLoan(i){
  var l=LOANS.splice(i,1)[0];
  if(l)NETWORTH.debts=NETWORTH.debts.filter(function(d){return d.loanId?d.loanId!==l.id:d.name!==l.name;});
  saveState();renderAcctLoans();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
}

/* ── Savings balance: deposit / withdraw ── */
function renderAcctSave(){
  var box=document.getElementById('acctSaveBox');if(!box)return;
  box.innerHTML='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:12px">'+piggySVG()
    +'<div><div class="ac-name" style="margin:0">Savings Account</div><div class="ac-note" style="margin-top:2px">Balance</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:8px"><span class="tnum" style="font-size:19px;font-weight:800;color:var(--green)">'+money0(SAVINGS.balance)+'</span>'+helpDot('savings_acct')+'</div></div>'
    +'<div class="cat-add"><input class="f-in" id="svAmt" inputmode="decimal" placeholder="Amount" style="margin:0" onkeydown="if(event.key===\'Enter\')addSavings()"/>'
    +'<button class="btn btn-soft" onclick="addSavings()">Deposit</button>'
    +'<button class="btn btn-ghost" style="width:auto;flex:0 0 auto;padding:8px 12px;font-size:12px" onclick="withdrawSavings()">Withdraw</button></div></div>';
}
function addSavings(){
  var f=document.getElementById('svAmt'),amt=numVal(f&&f.value);if(amt<=0){showToast('Enter an amount');return;}
  SAVINGS.balance=numVal(SAVINGS.balance)+amt;syncNetworthMirror();saveState();renderAcctSave();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('svAmt');if(nf){nf.value='';nf.focus();}
  showToast('🐷 Added '+money0(amt)+' to savings');
}
function withdrawSavings(){
  var amt=numVal((document.getElementById('svAmt')||{}).value);if(amt<=0){showToast('Enter an amount');return;}
  SAVINGS.balance=Math.max(0,numVal(SAVINGS.balance)-amt);syncNetworthMirror();saveState();renderAcctSave();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  showToast('✓ Withdrew '+money0(amt)+' from savings');
}

/* ── Investing: add cash → flows straight into practice buying power ── */
function renderAcctInvest(){
  var box=document.getElementById('acctInvestBox');if(!box)return;
  var bp=(typeof PF!=='undefined')?numVal(PF.cash):0;
  var live=(typeof totals==='function')?totals().total:0;
  box.innerHTML='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:12px">'+investSVG()
    +'<div><div class="ac-name" style="margin:0">Investing Account</div><div class="ac-note" style="margin-top:2px">TFSA · practice portfolio</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:8px"><span class="tnum" style="font-size:19px;font-weight:800;color:var(--purple-deep)">'+money0(live)+'</span>'+helpDot('investing_acct')+'</div></div>'
    +'<div class="row" style="margin:0 0 8px;padding:8px 12px;background:var(--purple-soft);border-radius:12px"><span style="font-size:12.5px;font-weight:800;color:var(--purple-deep)">⚡ Buying power</span><span class="tnum" style="font-weight:800;color:var(--purple-deep)">'+money(bp)+'</span></div>'
    +'<div class="cat-add"><input class="f-in" id="ivAmt" inputmode="decimal" placeholder="Add cash" style="margin:0" onkeydown="if(event.key===\'Enter\')addInvestCash()"/>'
    +'<button class="btn btn-soft" onclick="addInvestCash()">Add to investment account</button></div>'
    +'<div class="ac-note" style="margin-top:8px">Deposits become virtual cash you can invest over in <b>Practice</b>.</div></div>';
}
function addInvestCash(){
  var f=document.getElementById('ivAmt'),amt=numVal(f&&f.value);if(amt<=0){showToast('Enter an amount');return;}
  PF.cash=+(numVal(PF.cash)+amt).toFixed(2);
  PF.deposits=numVal(PF.deposits)+amt;
  if(typeof ACTIVITY!=='undefined'&&typeof nowLabel==='function')
    ACTIVITY.unshift({ic:'💵',main:'Deposit to investing',sub:nowLabel()+' · Buying power',amt:'+'+money(amt),cls:'up'});
  saveState();
  if(typeof renderPortfolio==='function')renderPortfolio();
  renderAcctInvest();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('ivAmt');if(nf){nf.value='';nf.focus();}
  showToast('⚡ Added '+money0(amt)+' to buying power');
}

function renderAccounts(){
  var el=document.getElementById('acctBody');if(!el)return;

  /* skeleton: summary + Mia intro + section containers. The per-section content
     is filled by the render* calls below so each can refresh independently. */
  var h='<div id="acctSummary"></div>'
    +'<div class="mia" style="margin:2px 0 16px"><div class="face">'+avatar()+'</div><div>'
    +'<div class="bubble">Track what you actually have here, balances, loans, savings and buying power. Tap <b>?</b> on anything to learn what it is.</div>'
    +'<button class="whats" onclick="'+acctHelp("I don't have a bank account yet","No problem, that's exactly who this is for. A bank account is just a safe place a bank holds your money. Most Canadian banks let you open a free chequing + savings account online in about 10 minutes with photo ID and a SIN. Start with one bank's free everyday account, you can always add more later.")+'">'
    +'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3 2.4c-.8.3-1 .9-1 1.6"/><line x1="12" y1="17" x2="12" y2="17"/></svg>I don\'t have a bank account</button></div></div>';

  h+='<div class="grid-2"><div class="stack">';
  /* ── Spending ── */
  h+='<div class="acct-sec spend"><div class="acct-sec-t">🪙 Spending Accounts</div>'
    +'<div id="acctDebitBox"></div>'
    +'<div class="acct-card">'+bankCardSVG('credit')
      +'<div class="ac-mid"><div class="ac-name">Credit Card</div><div id="acctCreditBox"></div></div>'
      +helpDot('credit_card')+'</div>'
    +'<div id="acctSpendBox"></div>'
    +acctChat('Help me set up an account',acctHelp('Setting up your first account','Pick one bank you like (many have free everyday accounts), then open a chequing account for spending and a savings account for setting money aside. You\'ll need photo ID and a SIN. Once it\'s open you get a debit card for day-to-day spending, that\'s the foundation everything else builds on.'))
    +'</div></div>';

  /* ── Saving + Investing ── */
  h+='<div class="stack">'
    +'<div class="acct-sec save"><div class="acct-sec-t">🐷 Savings Accounts</div>'
    +'<div id="acctSaveBox"></div>'
    +'<div style="display:flex;align-items:stretch;gap:8px;margin:2px 0 8px">'
    +'<button class="lpa-btn" style="flex:1" onclick="goTab(\'learn\')"><span class="lpa-e">💡</span>Learn</button>'
    +'<div style="flex:0 0 auto;display:flex">'+acctChat('Help me set up a savings account',acctHelp('Open a savings account','Almost every bank offers a free high-interest savings account, open one online in minutes. Then automate it: set a small auto-transfer (even $25) from chequing each payday. Aim to build a starter emergency fund of about one month of expenses first.'))+'</div>'
    +'</div>'
    +'</div>'
    +'<div class="acct-sec invest"><div class="acct-sec-t">📈 Investing Accounts</div>'
    +'<div id="acctInvestBox"></div>'
    +'<div style="display:flex;align-items:stretch;gap:8px;margin:2px 0 8px">'
    +'<button class="lpa-btn" style="flex:1" onclick="openTip(\'tfsa\')"><span class="lpa-e">💡</span>Learn</button>'
    +'<div style="flex:0 0 auto;display:flex">'+acctChat('Help me set up an investing account',acctHelp('Open a real investing account','When you\'re ready, most banks and brokerages let you open a TFSA online for free. Start with a TFSA (growth is tax-free), pick a low-cost broad ETF, and contribute a small amount regularly. Everything you practise here, buying, holding, diversifying, applies the same way with real money.'))+'</div>'
    +'</div>'
    +'</div>'
    +'<div class="acct-sec loan"><div class="acct-sec-t">🏦 Loan Accounts</div>'
    +'<div id="acctLoansBox"></div>'
    +'<div style="display:flex;align-items:stretch;gap:8px;margin:2px 0 8px">'
    +'<button class="lpa-btn" style="flex:1" onclick="push(\'loan-calc\')"><span class="lpa-e">💡</span>Learn</button>'
    +'<div style="flex:0 0 auto;display:flex">'+acctChat('Help me pay off debt faster',acctHelp('Paying off debt faster','List your debts by interest rate. Send any extra money to the highest-rate debt first (the "avalanche" method) — it saves the most interest overall. Prefer quick wins to stay motivated? Pay off the smallest balance first (the "snowball" method) instead. Either way, keep paying at least the minimum on everything else.'))+'</div>'
    +'</div>'
    +'</div></div>';

  h+='</div>'; // grid-2
  el.innerHTML=h;
  renderAcctSummary();renderAcctDebit();renderAcctCredit();renderAcctLoans();renderAcctSpend();renderAcctSave();renderAcctInvest();
}

/* ── Home tiles (informational, like the Practice / My Goals tiles) ──── */
/* Categorical palette for the money donuts — stays inside the money families
 * (brand beige, --save gold, --spend orange, --blue, --loan burnt, taupe).
 * Semantic green/red are deliberately absent: green means gains and red means
 * loss app-wide, so neither may color an arbitrary "Transport" slice. */
var MONEY_PALETTE=['#837c74','#e4da82','#d45c32','#5b9aa4','#c96a2e','#a49d94'];
function miniDonut(segs,size,centerTop,centerSub,sw){
  size=size||92;sw=sw||13;var r=size/2-sw/2-1,C=2*Math.PI*r,cx=size/2,cy=size/2,off=0;
  var ftop=Math.max(14,Math.round(size*0.145)),fsub=Math.max(8,Math.round(size*0.068));
  var s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#f2efe4" stroke-width="'+sw+'"/>';
  segs.forEach(function(g){var len=C*Math.max(0,Math.min(1,g.v));if(len<=0)return;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+g.c+'" stroke-width="'+sw+'" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-off)+'" transform="rotate(-90 '+cx+' '+cy+')"/>';
    off+=len;});
  return '<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'" style="display:block">'+s
    +'<text x="'+cx+'" y="'+(cy-1)+'" text-anchor="middle" font-size="'+ftop+'" font-weight="800" fill="#665b93">'+centerTop+'</text>'
    +'<text x="'+cx+'" y="'+(cy+ftop*0.82)+'" text-anchor="middle" font-size="'+fsub+'" font-weight="700" fill="#a19b91">'+(centerSub||'')+'</text></svg>';
}
/* Home greeting reflects the real streak + live portfolio, so the top of Home
 * always matches the topbar and the Practice numbers (no more hardcoded copy). */
function renderHomeGreet(){
  var t=document.getElementById('homeTitle');
  var name=(typeof USER!=='undefined'&&USER.name)?(', '+USER.name):'';
  if(t)t.textContent='Welcome Back'+name;
  var el=document.getElementById('homeGreet');if(!el)return;
  var goal=(typeof USER!=='undefined'&&USER.topGoal)?USER.topGoal:'';
  if(goal)el.innerHTML='Continue your progress, you’re on your way to <b>'+escHtml(goal.charAt(0).toLowerCase()+goal.slice(1))+'</b>.';
  else el.innerHTML='Here’s where things stand today, one small step at a time.';
}
function renderMoneyHome(){
  renderHomeGreet();
  if(typeof renderHomeQuickActions==='function')renderHomeQuickActions();
  if(typeof renderHomeBudgetBig==='function')renderHomeBudgetBig();
  if(typeof renderHomeInvest==='function')renderHomeInvest();
  if(typeof renderAdvisorCard==='function')renderAdvisorCard('homeAdvisor');
  /* ── Net Worth tile ── */
  var nt=document.getElementById('tileNetworth');
  if(nt){
    var t=networthRows(),tot2=t.assets+t.debts,aw=tot2>0?Math.round(t.assets/tot2*100):0,dw=100-aw;
    nt.innerHTML='<div class="card" style="cursor:pointer;margin:0;height:100%" onclick="push(\'networth\')">'
      +'<div class="row" style="margin-bottom:8px"><div class="card-t" style="margin-bottom:0">📊 Net Worth</div></div>'
      +'<div class="tnum" style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--ink)">'+money(t.net)+'</div>'
      +'<div style="display:flex;gap:16px;margin-top:8px">'
      +'<div><div style="font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.4px">ASSETS</div><div class="tnum" style="font-weight:800;font-size:13px">'+money0(t.assets)+'</div></div>'
      +'<div><div style="font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.4px">DEBTS</div><div class="tnum down" style="font-weight:800;font-size:13px">'+money0(t.debts)+'</div></div></div>'
      +'<div style="display:flex;height:7px;border-radius:4px;overflow:hidden;margin-top:8px;background:#f2efe4">'
      +'<div style="width:'+aw+'%;background:var(--green)"></div><div style="width:'+dw+'%;background:var(--red)"></div></div></div>';
  }
}
/* ── Home quick-action tiles: the app's 3 real feature-colored areas (not the
   credit/mortgage copy from the reference design, which has no backing feature here) ── */
function renderHomeQuickActions(){
  var el=document.getElementById('homeQuick');if(!el)return;
  /* invest: how much of your practice money is actually deployed (cash put to work) */
  var T=totals(),investPct=T.total>0?Math.round((T.total-PF.cash)/T.total*100):0;
  /* savings: dollars saved toward your goals, as a share of their combined target */
  var gSaved=0,gTarget=0;(typeof GOALS!=='undefined'?GOALS:[]).forEach(function(g){gSaved+=(+g.saved||0);gTarget+=(+g.target||0);});
  var goalsPct=gTarget>0?Math.min(100,Math.round(gSaved/gTarget*100)):0;
  /* budget: share of this month's planned budget used so far */
  var budgPlanned=(BUDGET&&BUDGET.categories?BUDGET.categories:[]).reduce(function(a,c){return a+numVal(c.limit);},0);
  var budgPct=budgPlanned>0?Math.min(100,Math.round(monthTotal()/budgPlanned*100)):0;
  /* colors ordered purple → red → yellow to match the reference; each still points at a
     real feature area (investing / budget / savings) with real progress. */
  function tile(cls,title,pct,go){
    return '<div class="qa-tile '+cls+'" onclick="'+go+'"><div class="qa-t">'+title+'</div>'
      +'<div class="qa-prog"><span class="qa-lbl">Progress</span><span class="qa-pct tnum">'+pct+'%</span></div>'
      +'<div class="qa-bar"><div class="qa-bar-fill" style="width:'+pct+'%"></div></div>'
      +'<button class="qa-btn" onclick="event.stopPropagation();'+go+'">Continue</button></div>';
  }
  el.innerHTML=tile('qa-invest','Grow my money through investing',investPct,"goTab('journey')")
    +tile('qa-spend','Stay on top of my budget',budgPct,"goTab('budget')")
    +tile('qa-save','Reach my savings goals',goalsPct,"push('goals')");
}
/* ── "Your Monthly Budget" card (target redesign): donut + right-side legend where each
   row is Label / progress-bar / $spent-of-$limit, from real BUDGET categories ── */
function renderHomeBudgetBig(){
  var el=document.getElementById('homeBudgetBig');if(!el)return;
  var income=numVal(BUDGET.income),planned=BUDGET.categories.reduce(function(a,c){return a+numVal(c.limit);},0);
  var pctBudg=income>0?Math.round(planned/income*100):0;
  var m=thisMonth(),byCat={};SPENDING.forEach(function(s){if((s.date||'').slice(0,7)===m)byCat[s.category]=(byCat[s.category]||0)+numVal(s.amount);});
  var cats=BUDGET.categories.slice().sort(function(a,b){return numVal(b.limit)-numVal(a.limit);});
  var segs=cats.slice(0,6).map(function(c,i){return {v:planned>0?numVal(c.limit)/planned:0,c:MONEY_PALETTE[i%MONEY_PALETTE.length]};});
  var rows=cats.slice(0,5).map(function(c,i){
    var lim=numVal(c.limit),spent=byCat[c.name]||0,pct=lim>0?Math.min(100,Math.round(spent/lim*100)):0,col=MONEY_PALETTE[i%MONEY_PALETTE.length];
    return '<div class="hb-row"><div class="hb-row-head"><span class="hb-lbl">'+escHtml(c.name)+'</span>'
      +'<span class="hb-amt tnum">'+money0(spent)+'<span class="hb-tot">/'+money0(lim)+'</span></span></div>'
      +'<div class="bar" style="margin:0"><div class="bar-fill" style="width:'+pct+'%;background:'+col+'"></div></div></div>';
  }).join('')||'<div class="muted-note">No categories yet.</div>';
  el.innerHTML='<div class="card" style="margin:0">'
    +'<div class="hc-head"><span class="hc-title">Your Monthly Budget</span><button class="hc-btn" onclick="goTab(\'budget\')">View Full</button></div>'
    +'<div class="hb-body"><div class="hb-donut">'+miniDonut(segs,220,pctBudg+'%','budgeted',40)+'</div>'
    +'<div class="hb-legend">'+rows+'</div></div></div>';
}
/* ── "Investing" summary card (target redesign): left copy + View Investments button,
   right purple stat panel (Practice Portfolio / Total Invested / all-time Return) ── */
function renderHomeInvest(){
  var el=document.getElementById('homeInvest');if(!el)return;
  var T=totals(),invested=START_CAPITAL+(PF.deposits||0),gain=T.unreal+PF.realized;
  var up=gain>=0;
  /* third stat is today's move (falls back to 0.0% when no live day-basis yet) */
  var dm=(typeof acctDayMove==='function')?acctDayMove():null,todayPct=dm?dm.pct:0;
  var sub=up
    ? 'Your practice portfolio is <b>up '+signed(gain)+'</b> all-time. Keep learning and practising before you invest for real.'
    : 'Your practice portfolio is <b>down '+signed(gain).replace('-','')+'</b> right now. Dips are normal, this is the safe place to learn.';
  /* real portfolio-value line for the panel background (falls back to nothing if the
     series is too short to plot) */
  var hist=(typeof portfolioHistory==='function')?portfolioHistory(48).map(function(p){return p.total;}):[];
  var hasMove=hist.length>=8&&Math.max.apply(null,hist)!==Math.min.apply(null,hist);
  var chart=hasMove?'<div class="hi-chart">'+sparkline(hist,600,150,'#ffffff')+'</div>':'';
  el.innerHTML='<div class="card home-invest">'
    +'<div class="hi-left"><div class="hi-title">Investing</div>'
    +'<div class="hi-sub">'+sub+'</div>'
    +'<button class="btn-taupe hi-btn" onclick="goTab(\'journey\')">View Investments</button></div>'
    +'<div class="hi-panel">'
    +'<div class="hi-stats">'
    +'<div class="hi-stat"><div class="hi-k">Practice Portfolio</div><div class="hi-v tnum">'+money(T.total)+'</div></div>'
    +'<div class="hi-stat"><div class="hi-k">Total Invested</div><div class="hi-v tnum">'+money0(invested)+'</div></div>'
    +'<div class="hi-stat"><div class="hi-k">Today’s Return</div><div class="hi-v tnum">'+(todayPct>=0?'+':'')+todayPct.toFixed(1)+'%</div></div>'
    +'</div>'+chart
    +'</div></div>';
}
/* ── "Financial Advisor" card (Home + Budget): a preview of Mia's one real thing to
   say today (homeNudge(), 08-learn-init.js) plus an input that forwards straight into
   the existing floating Coach Chat — not a second, independent chat engine. ── */
/* Reusable Financial Advisor card: white card, charcoal header + message bubble,
   soft input pill that forwards into the real Coach Chat. Render into any container
   by id — currently Home (#homeAdvisor), Budget (#budgetAdvisor), Spending
   (#spendAdvisor), Learn (#learnAdvisor). One voice (Mia), so every instance shows
   the same live nudge. */
function renderAdvisorCard(targetId){
  var el=document.getElementById(targetId);if(!el)return;
  var n=(typeof homeNudge==='function')?homeNudge():{msg:'Ask me anything about your money.'};
  var inId=targetId+'Input';
  el.innerHTML='<div class="advisor-card">'
    +'<div class="advisor-head"><div class="advisor-t">Financial Advisor</div>'
    +'<button class="advisor-expand" onclick="openCoach()" aria-label="Open full chat"><svg viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="M20 4l-8 8"/><path d="M10 20H4v-6"/><path d="M4 20l8-8"/></svg></button></div>'
    +'<div class="advisor-body">'
    +'<div class="advisor-bubble-row"><div class="advisor-bubble">'+n.msg+'</div>'
    +'<button class="advisor-copy" onclick="copyAdvisorMsg(this)" aria-label="Copy message"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>'
    +'<div class="advisor-input-row"><div class="advisor-inpwrap">'
    +'<input class="advisor-input" id="'+inId+'" placeholder="Ask about your money…" onkeydown="if(event.key===\'Enter\')advisorAsk(\''+inId+'\')"/></div>'
    +'<button class="advisor-send" onclick="advisorAsk(\''+inId+'\')" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div>'
    +'</div></div>';
}
function advisorAsk(inputId){
  var inp=document.getElementById(inputId),text=((inp&&inp.value)||'').trim();
  openCoach();
  if(text){document.getElementById('coachInput').value=text;coachSend();}
  if(inp)inp.value='';
}
function copyAdvisorMsg(btn){
  var bub=btn.parentElement&&btn.parentElement.querySelector('.advisor-bubble');
  var txt=bub?(bub.innerText||bub.textContent||''):'';
  if(txt&&navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){if(typeof showToast==='function')showToast('Copied');}).catch(function(){});
  }
}
