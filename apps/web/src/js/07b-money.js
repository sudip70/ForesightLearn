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
              debts:[{name:'Student loan',value:6000},{name:'Credit card',value:450}]};
/* My Accounts ledgers (recorded from the My Accounts screen) */
var LOANS=[{id:'l_seed',name:'Student loan',balance:6000,monthly:75}];
var SAVINGS={balance:0};

function moneyUid(){return 'm'+Math.random().toString(36).slice(2,9);}
function todayISO(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function thisMonth(){return todayISO().slice(0,7);}
function numVal(v){var n=parseFloat((''+v).replace(/[^0-9.\-]/g,''));return isFinite(n)?n:0;}
function moneyInput(id,val,ph){return '<input class="f-in" id="'+id+'" inputmode="decimal" placeholder="'+(ph||'0')+'"'+(val!=null?' value="'+val+'"':'')+'/>';}

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
  var el=document.getElementById('budgetBody');if(!el)return;
  var planned=BUDGET.categories.reduce(function(a,c){return a+numVal(c.limit);},0);
  var leftToBudget=BUDGET.income-planned;
  var spent=monthTotal(),leftToSpend=BUDGET.income-spent;
  var h='<div class="hero"><div class="hero-l">Money left to spend this month</div>'
    +'<div class="hero-v tnum">'+money(leftToSpend)+'</div>'
    +'<div class="hero-row"><div class="s"><label>Income</label><span class="tnum">'+money0(BUDGET.income)+'</span></div>'
    +'<div class="s"><label>Spent</label><span class="tnum">'+money0(spent)+'</span></div>'
    +'<div class="s"><label>Budgeted</label><span class="tnum">'+money0(planned)+'</span></div></div></div>';

  h+='<div class="card"><div class="card-t">Monthly income</div>'
    +'<label class="f-label">After-tax income you expect each month</label>'
    +'<input class="f-in" inputmode="decimal" value="'+BUDGET.income+'" onchange="setBudgetIncome(this.value)"/>'
    +'<div class="muted-note" style="text-align:left">'+(leftToBudget>=0?money0(leftToBudget)+' is still unbudgeted — give every dollar a job.':'You\'ve budgeted '+money0(-leftToBudget)+' more than you earn.')+'</div></div>';

  h+='<div class="card"><div class="row" style="margin-bottom:11px"><div class="card-t" style="margin-bottom:0">Categories</div><span class="pill pill-pur">'+BUDGET.categories.length+'</span></div>';
  if(!BUDGET.categories.length)h+='<div class="muted-note" style="text-align:left">No categories yet. Add one below.</div>';
  BUDGET.categories.forEach(function(c,i){
    var sp=monthSpent(c.name),lim=numVal(c.limit),pct=lim>0?Math.min(100,Math.round(sp/lim*100)):0,over=sp>lim&&lim>0;
    h+='<div style="margin-bottom:13px"><div class="row" style="margin-bottom:5px">'
      +'<span style="font-weight:700;font-size:13px">'+c.name+'</span>'
      +'<span style="display:flex;align-items:center;gap:8px"><span class="tnum '+(over?'down':'')+'" style="font-size:12px;font-weight:700">'+money0(sp)+' / '+money0(lim)+'</span>'
      +'<button class="adjust" title="Remove" style="padding:4px 8px" onclick="delBudgetCat('+i+')">✕</button></span></div>'
      +'<div class="bar"><div class="bar-fill" style="width:'+pct+'%'+(over?';background:var(--red)':'')+'"></div></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:6px;align-items:flex-end">'
    +'<div style="flex:2"><label class="f-label">Category</label>'+'<input class="f-in" id="bcName" placeholder="e.g. Eating out"/></div>'
    +'<div style="flex:1"><label class="f-label">Limit</label>'+moneyInput('bcLimit',null,'0')+'</div>'
    +'<button class="btn btn-soft" style="flex:0 0 auto;width:auto;padding:11px 16px" onclick="addBudgetCat()">Add</button></div>';
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
    +'<button class="btn btn-soft" style="flex:0 0 auto;width:auto;padding:11px 16px" onclick="addGoal()">Add</button></div></div>';
  if(!GOALS.length)h+='<div class="card"><div class="muted-note" style="text-align:left">No goals yet — add your first above.</div></div>';
  GOALS.forEach(function(g){
    var gp=numVal(g.target)>0?Math.min(100,Math.round(numVal(g.saved)/numVal(g.target)*100)):0,done=gp>=100;
    h+='<div class="goal-card"><div class="row"><div style="font-size:14px;font-weight:800">'+(done?'🏆 ':'🎯 ')+g.what+'</div>'
      +'<span class="pill '+(done?'pill-grn':'pill-pur')+'">'+gp+'%</span></div>'
      +'<div class="bar"><div class="bar-fill" style="width:'+gp+'%"></div></div>'
      +'<div class="row"><span style="font-size:11px;color:var(--muted)">'+money0(g.saved)+' of '+money0(g.target)+(g.account?' · '+g.account:'')+'</span></div>'
      +'<div class="row" style="gap:8px;margin-top:9px">'+moneyInput('gc_'+g.id,null,'Add amount')
      +'<button class="btn btn-pur" style="width:auto;padding:9px 14px" onclick="goalContribute(\''+g.id+'\')">Add to savings</button>'
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
      +cats.map(function(c){return '<option>'+c+'</option>';}).join('')+'</select></div></div>'
    +'<label class="f-label">Note (optional)</label><input class="f-in" id="exNote" placeholder="What was it for?"/>'
    +'<label class="f-label">Date</label><input class="f-in" id="exDate" type="date" value="'+todayISO()+'"/>'
    +'<button class="btn btn-pur" style="margin-top:11px" onclick="addExpense()">Add expense</button></div>';
  // by-category this month
  var byCat={};SPENDING.forEach(function(s){if((s.date||'').slice(0,7)===thisMonth())byCat[s.category]=(byCat[s.category]||0)+numVal(s.amount);});
  var catKeys=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];});
  if(catKeys.length){
    h+='<div class="card"><div class="card-t">This month by category</div>';
    catKeys.forEach(function(c){h+='<div class="lrow"><div class="l-n">'+c+'</div><div class="l-v"><div class="l-p tnum">'+money0(byCat[c])+'</div></div></div>';});
    h+='</div>';
  }
  // recent list
  var recent=SPENDING.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,20);
  h+='<div class="card"><div class="card-t">Recent</div>';
  if(!recent.length)h+='<div class="muted-note" style="text-align:left">No expenses logged yet.</div>';
  recent.forEach(function(s){
    h+='<div class="lrow"><div style="min-width:0"><div class="l-n">'+(s.note||s.category)+'</div><div class="l-s">'+s.category+' · '+(s.date||'')+'</div></div>'
      +'<div style="display:flex;align-items:center;gap:10px"><div class="l-v"><div class="l-p tnum down">-'+money0(s.amount)+'</div></div>'
      +'<button class="adjust" title="Delete" style="padding:4px 8px" onclick="delExpense(\''+s.id+'\')">✕</button></div></div>';
  });
  h+='</div>';
  el.innerHTML=h;
}
function addExpense(){
  var amt=numVal((document.getElementById('exAmt')||{}).value);if(amt<=0){showToast('Enter an amount');return;}
  var cat=(document.getElementById('exCat')||{}).value||'Other',note=((document.getElementById('exNote')||{}).value||'').trim();
  var date=(document.getElementById('exDate')||{}).value||todayISO();
  SPENDING.push({id:moneyUid(),date:date,amount:amt,category:cat,note:note});saveState();renderSpending();showToast('✓ Logged '+money0(amt)+' · '+cat);
}
function delExpense(id){SPENDING=SPENDING.filter(function(x){return x.id!==id;});saveState();renderSpending();}

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
    h+='<div class="lrow"><div class="l-n">'+a.name+'</div><div style="display:flex;align-items:center;gap:10px"><div class="l-v"><div class="l-p tnum">'+money0(a.value)+'</div></div><button class="adjust" style="padding:4px 8px" onclick="delNW(\'assets\','+i+')">✕</button></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:9px;align-items:flex-end"><div style="flex:2"><input class="f-in" id="naName" placeholder="Asset (e.g. Car)"/></div><div style="flex:1">'+moneyInput('naVal',null,'0')+'</div><button class="btn btn-soft" style="width:auto;padding:11px 16px" onclick="addNW(\'assets\')">Add</button></div></div>';
  // debts
  h+='<div class="card"><div class="card-t">Debts</div>';
  if(!NETWORTH.debts.length)h+='<div class="muted-note" style="text-align:left">No debts — nice.</div>';
  NETWORTH.debts.forEach(function(d,i){
    h+='<div class="lrow"><div class="l-n">'+d.name+'</div><div style="display:flex;align-items:center;gap:10px"><div class="l-v"><div class="l-p tnum down">-'+money0(d.value)+'</div></div><button class="adjust" style="padding:4px 8px" onclick="delNW(\'debts\','+i+')">✕</button></div></div>';
  });
  h+='<div class="row" style="gap:8px;margin-top:9px;align-items:flex-end"><div style="flex:2"><input class="f-in" id="ndName" placeholder="Debt (e.g. Credit card)"/></div><div style="flex:1">'+moneyInput('ndVal',null,'0')+'</div><button class="btn btn-soft" style="width:auto;padding:11px 16px" onclick="addNW(\'debts\')">Add</button></div></div>';
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
function acctHelp(t,d){return "openSheet('"+t.replace(/'/g,"\\'")+"','"+d.replace(/'/g,"\\'")+"')";}
function helpDot(term){return '<button class="acct-q" onclick="openTip(\''+term+'\')" title="What\'s this?">?</button>';}
function acctChat(text,onclick){
  return '<div class="acct-chat" onclick="'+onclick+'"><div class="ac-ic">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 4z"/><path d="M8 9h6M8 12h3"/></svg>'
    +'</div><div class="ac-tx">'+text+'</div><div class="ac-go">›</div></div>';
}
/* Learn → Practice → Activate trio, echoes the welcome loop (💡 🪙 🌱). */
function lpaRow(learn,practice,activate){
  return '<div class="lpa">'
    +'<button class="lpa-btn" onclick="'+learn+'"><span class="lpa-e">💡</span>Learn</button>'
    +'<button class="lpa-btn" onclick="'+practice+'"><span class="lpa-e">🪙</span>Practice</button>'
    +'<button class="lpa-btn lpa-go" onclick="'+activate+'"><span class="lpa-e">🌱</span>Activate</button></div>';
}
/* ── inline graphics ── */
function bankCardSVG(kind){
  var c=kind==='debit'?{a:'#4f9c7e',chip:'#dbeee6',t:'DEBIT'}:{a:'#565072',chip:'#e7e1f4',t:'CREDIT'};
  return '<svg viewBox="0 0 80 52" width="62" height="40" style="display:block;border-radius:8px;box-shadow:var(--shadow);flex-shrink:0">'
    +'<rect width="80" height="52" rx="8" fill="'+c.a+'"/>'
    +'<rect width="80" height="52" rx="8" fill="url(#cardSheen)" opacity=".18"/>'
    +'<rect x="9" y="20" width="15" height="12" rx="2.5" fill="'+c.chip+'"/>'
    +'<path d="M9 26h15M16.5 20v12" stroke="'+c.a+'" stroke-width="1" opacity=".55"/>'
    +'<circle cx="62" cy="40" r="8" fill="rgba(255,255,255,.32)"/><circle cx="53" cy="40" r="8" fill="rgba(255,255,255,.2)"/>'
    +'<text x="9" y="46" font-size="6.5" font-weight="800" fill="rgba(255,255,255,.92)" font-family="\'Plus Jakarta Sans\',sans-serif" letter-spacing=".5">'+c.t+'</text>'
    +'<defs><linearGradient id="cardSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>';
}
function loanSVG(){
  return '<svg viewBox="0 0 48 48" width="48" height="48" style="flex-shrink:0"><rect x="3" y="3" width="42" height="42" rx="12" fill="#f7d9ce"/>'
    +'<path d="M13 30c3-2 6-2 9 0 3 2 7 1 9-2" stroke="#cf5a40" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    +'<circle cx="31" cy="18" r="6.5" fill="#fff" stroke="#cf5a40" stroke-width="2.4"/>'
    +'<text x="31" y="21.5" font-size="9" font-weight="800" fill="#cf5a40" text-anchor="middle" font-family="\'Plus Jakarta Sans\',sans-serif">$</text></svg>';
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
  return '<svg viewBox="0 0 48 48" width="48" height="48" style="flex-shrink:0"><rect x="2" y="2" width="44" height="44" rx="13" fill="#e7e1f4"/>'
    +'<rect x="12" y="28" width="5" height="8" rx="1.5" fill="#9084b4"/><rect x="21" y="23" width="5" height="13" rx="1.5" fill="#7a6ea8"/><rect x="30" y="18" width="5" height="18" rx="1.5" fill="#6f659a"/>'
    +'<path d="M12 24l8-6 5 4 9-9" stroke="#4f9c7e" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<path d="M31 13h4v4" stroke="#4f9c7e" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    +'<circle cx="65" cy="65" r="48" fill="none" stroke="#f0edfa" stroke-width="'+sw+'"/>';
  data.forEach(function(d,i){
    var a0=ang,a1=ang+(d.val/total)*2*Math.PI;ang=a1;
    var common='id="dnArc'+i+'" fill="none" stroke="'+d.color+'" stroke-width="'+sw+'" stroke-linecap="round" style="cursor:pointer;transition:opacity .15s" '
      +'onmouseover="donutHover('+i+')" onmouseout="donutHover(-1)" onclick="donutPick(\''+d.name.replace(/'/g,"\\'")+'\')"';
    if(data.length===1)svg+='<circle cx="65" cy="65" r="48" '+common+'/>';
    else svg+='<path d="'+arcPath(cx,cy,r,a0+gap/2,a1-gap/2)+'" '+common+'/>';
  });
  svg+='<text id="dnTop" x="65" y="63" text-anchor="middle" font-size="21" font-weight="800" fill="#322e44" font-family="\'Plus Jakarta Sans\',sans-serif">'+money0(total)+'</text>'
    +'<text id="dnSub" x="65" y="80" text-anchor="middle" font-size="9.5" font-weight="700" fill="#847f9c" font-family="\'Plus Jakarta Sans\',sans-serif">spent this month</text></svg>';
  var leg='<div class="donut-legend">';
  data.forEach(function(d,i){
    leg+='<div class="dleg" id="dnLeg'+i+'" onmouseover="donutHover('+i+')" onmouseout="donutHover(-1)" onclick="donutPick(\''+d.name.replace(/'/g,"\\'")+'\')">'
      +'<span class="dl-dot" style="background:'+d.color+'"></span><span class="dl-n">'+d.name+'</span>'
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
function donutPick(name){
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
    +tile('⚡','Buying power',money0(bp),'')
    +tile('🐷','Savings',money0(SAVINGS.balance),'up')
    +tile('📉','Owed',money0(owe),'down')
    +tile('🧾','Spent this month',money0(monthTotal()),'')
    +'</div>';
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
    +'<select class="f-in" id="axCat" style="margin:0" onchange="acctCat=this.value">'+cats.map(function(c){return '<option'+(c===acctCat?' selected':'')+'>'+c+'</option>';}).join('')+'</select>'
    +'<select class="f-in" id="axPay" style="margin:0" onchange="acctPay=this.value">'+['Debit card','Credit card','Cash'].map(function(p){return '<option'+(p===acctPay?' selected':'')+'>'+p+'</option>';}).join('')+'</select>'
    +'<button class="btn btn-pur" style="width:auto;flex:0 0 auto;padding:10px 18px" onclick="addAcctExpense()">Add</button></div>';
  /* live breakdown: interactive donut of this month's spending */
  h+=acctDonut();
  var recent=SPENDING.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).slice(0,3);
  if(recent.length){
    h+='<div style="margin-top:15px"><div class="card-t" style="margin-bottom:9px">Recent</div>';
    recent.forEach(function(s){
      h+='<div class="lrow"><div style="min-width:0"><div class="l-n">'+(s.note||s.category)+'</div>'
        +'<div class="l-s">'+s.category+(s.acct?' · '+s.acct:'')+' · '+(s.date||'')+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:10px"><div class="l-p tnum down">-'+money0(s.amount)+'</div>'
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
  saveState();renderAcctSpend();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('axAmt');if(nf){nf.value='';nf.focus();}/* ready for the next one */
  showToast('✓ Logged '+money0(amt)+' · '+cat);
}
function delAcctExpense(id){
  SPENDING=SPENDING.filter(function(x){return x.id!==id;});
  saveState();renderAcctSpend();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
}

/* ── Loans: record loans and log payments against them ── */
function renderAcctLoans(){
  var box=document.getElementById('acctLoansBox');if(!box)return;
  var owe=LOANS.reduce(function(a,l){return a+numVal(l.balance);},0);
  var mo=LOANS.reduce(function(a,l){return a+numVal(l.monthly);},0);
  var h='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:'+(LOANS.length?'12px':'10px')+'"><div style="display:flex;align-items:center;gap:11px">'+loanSVG()
    +'<div><div class="ac-name" style="margin:0">Loan Accounts</div>'+(mo>0?'<div class="ac-note" style="margin-top:2px">'+money0(mo)+'/mo in payments</div>':'')+'</div></div>'
    +'<div style="display:flex;align-items:center;gap:9px"><span class="pill pill-red">owe '+money0(owe)+'</span>'+helpDot('loan_acct')+'</div></div>';
  LOANS.forEach(function(l,i){
    h+='<div class="cat-row"><div class="cat-top"><span class="cat-n">'+l.name+'</span>'
      +'<span class="cat-v over">'+money0(l.balance)+(numVal(l.monthly)>0?' · '+money0(l.monthly)+'/mo':'')+'</span></div>'
      +'<div class="cat-add">'+moneyInput('lpay'+i,null,'Payment')
      +'<button class="btn btn-soft" onclick="payLoan('+i+')">Pay</button>'
      +'<button class="acct-q" style="width:36px;height:36px;border-color:var(--line)" title="Remove" onclick="delLoan('+i+')">✕</button></div></div>';
  });
  h+='<div style="margin-top:13px"><label class="f-label">Add a loan</label>'
    +'<div class="row" style="gap:7px;align-items:flex-end">'
    +'<div style="flex:2"><input class="f-in" id="loName" placeholder="e.g. Car loan" style="margin:0"/></div>'
    +'<div style="flex:1.1">'+moneyInput('loBal',null,'Owed')+'</div>'
    +'<div style="flex:1">'+moneyInput('loMo',null,'$/mo')+'</div>'
    +'<button class="btn btn-soft" style="width:auto;flex:0 0 auto;padding:9px 14px" onclick="addLoan()">Add</button></div></div>';
  box.innerHTML=h+'</div>';
}
function addLoan(){
  var n=((document.getElementById('loName')||{}).value||'').trim();
  if(!n){showToast('Name the loan');return;}
  LOANS.push({id:moneyUid(),name:n,balance:numVal((document.getElementById('loBal')||{}).value),monthly:numVal((document.getElementById('loMo')||{}).value)});
  saveState();renderAcctLoans();renderAcctSummary();showToast('✓ Added '+n);
}
function payLoan(i){
  var l=LOANS[i];if(!l)return;
  var amt=numVal((document.getElementById('lpay'+i)||{}).value);
  if(amt<=0){showToast('Enter a payment');return;}
  l.balance=Math.max(0,numVal(l.balance)-amt);
  saveState();renderAcctLoans();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  showToast(l.balance<=0?'🎉 '+l.name+' paid off!':'✓ Paid '+money0(amt)+' · '+l.name);
}
function delLoan(i){LOANS.splice(i,1);saveState();renderAcctLoans();renderAcctSummary();}

/* ── Savings balance: deposit / withdraw ── */
function renderAcctSave(){
  var box=document.getElementById('acctSaveBox');if(!box)return;
  box.innerHTML='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:11px"><div style="display:flex;align-items:center;gap:12px">'+piggySVG()
    +'<div><div class="ac-name" style="margin:0">Savings Account</div><div class="ac-note" style="margin-top:2px">Balance</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:9px"><span class="tnum" style="font-size:19px;font-weight:800;color:var(--green)">'+money0(SAVINGS.balance)+'</span>'+helpDot('savings_acct')+'</div></div>'
    +'<div class="cat-add"><input class="f-in" id="svAmt" inputmode="decimal" placeholder="Amount" style="margin:0" onkeydown="if(event.key===\'Enter\')addSavings()"/>'
    +'<button class="btn btn-soft" onclick="addSavings()">Deposit</button>'
    +'<button class="btn btn-ghost" style="width:auto;flex:0 0 auto;padding:8px 13px;font-size:12px" onclick="withdrawSavings()">Withdraw</button></div></div>';
}
function addSavings(){
  var f=document.getElementById('svAmt'),amt=numVal(f&&f.value);if(amt<=0){showToast('Enter an amount');return;}
  SAVINGS.balance=numVal(SAVINGS.balance)+amt;saveState();renderAcctSave();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  var nf=document.getElementById('svAmt');if(nf){nf.value='';nf.focus();}
  showToast('🐷 Added '+money0(amt)+' to savings');
}
function withdrawSavings(){
  var amt=numVal((document.getElementById('svAmt')||{}).value);if(amt<=0){showToast('Enter an amount');return;}
  SAVINGS.balance=Math.max(0,numVal(SAVINGS.balance)-amt);saveState();renderAcctSave();renderAcctSummary();if(typeof renderMoneyHome==='function')renderMoneyHome();
  showToast('✓ Withdrew '+money0(amt)+' from savings');
}

/* ── Investing: add cash → flows straight into practice buying power ── */
function renderAcctInvest(){
  var box=document.getElementById('acctInvestBox');if(!box)return;
  var bp=(typeof PF!=='undefined')?numVal(PF.cash):0;
  var live=(typeof totals==='function')?totals().total:0;
  box.innerHTML='<div class="acct-card" style="display:block">'
    +'<div class="row" style="margin-bottom:11px"><div style="display:flex;align-items:center;gap:12px">'+investSVG()
    +'<div><div class="ac-name" style="margin:0">Investing Account</div><div class="ac-note" style="margin-top:2px">TFSA · practice portfolio</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:9px"><span class="tnum" style="font-size:19px;font-weight:800;color:var(--purple-deep)">'+money0(live)+'</span>'+helpDot('investing_acct')+'</div></div>'
    +'<div class="row" style="margin:0 0 10px;padding:9px 11px;background:var(--purple-soft);border-radius:11px"><span style="font-size:12.5px;font-weight:800;color:var(--purple-deep)">⚡ Buying power</span><span class="tnum" style="font-weight:800;color:var(--purple-deep)">'+money(bp)+'</span></div>'
    +'<div class="cat-add"><input class="f-in" id="ivAmt" inputmode="decimal" placeholder="Add cash" style="margin:0" onkeydown="if(event.key===\'Enter\')addInvestCash()"/>'
    +'<button class="btn btn-soft" onclick="addInvestCash()">Add to buying power</button></div>'
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
    +'<div class="acct-card">'+bankCardSVG('debit')
      +'<div class="ac-mid"><div class="ac-name">Debit Card</div>'
      +'<div class="txn"><span>Payroll deposit</span><span class="up">+$426</span></div>'
      +'<div class="txn"><span>Interac e-Transfer</span><span class="up">+$126</span></div></div>'
      +helpDot('debit_card')+'</div>'
    +'<div class="acct-card">'+bankCardSVG('credit')
      +'<div class="ac-mid"><div class="ac-name">Credit Card</div>'
      +'<div class="ac-toggle-row"><button class="ac-toggle" onclick="'+acctHelp('Nice, you have a credit card','The golden rule: pay the full balance every month. Do that and the card is free to use, protects your purchases, and steadily builds your credit score. Carry a balance and you get charged high interest (often ~20% a year). Treat it like a debit card you pay off, not extra money.')+'">Have one</button>'
      +'<button class="ac-toggle alt" onclick="'+acctHelp('Thinking about a first credit card','Look for a no-annual-fee starter or student card with a low limit. Used well, a credit card is the easiest way to build the credit score you\'ll need for a phone plan, apartment or car loan later. The rule never changes: only charge what you can pay off in full each month.')+'">Need one</button></div></div>'
      +helpDot('credit_card')+'</div>'
    +'<div id="acctLoansBox"></div><div id="acctSpendBox"></div>'
    +acctChat('Help me set up an account',acctHelp('Setting up your first account','Pick one bank you like (many have free everyday accounts), then open a chequing account for spending and a savings account for setting money aside. You\'ll need photo ID and a SIN. Once it\'s open you get a debit card for day-to-day spending, that\'s the foundation everything else builds on.'))
    +'</div></div>';

  /* ── Saving + Investing ── */
  h+='<div class="stack">'
    +'<div class="acct-sec save"><div class="acct-sec-t">🐷 Savings Accounts</div>'
    +'<div id="acctSaveBox"></div>'
    +lpaRow("goTab('learn')","push('goals')",acctHelp('Open a savings account','Almost every bank offers a free high-interest savings account, open one online in minutes. Then automate it: set a small auto-transfer (even $25) from chequing each payday. Aim to build a starter emergency fund of about one month of expenses first.'))
    +acctChat('Help me set up a savings account',acctHelp('Open a savings account','Almost every bank offers a free high-interest savings account, open one online in minutes. Then automate it: set a small auto-transfer (even $25) from chequing each payday. Aim to build a starter emergency fund of about one month of expenses first.'))
    +'</div>'
    +'<div class="acct-sec invest"><div class="acct-sec-t">📈 Investing Accounts</div>'
    +'<div id="acctInvestBox"></div>'
    +lpaRow("openTip('tfsa')","goTab('journey')",acctHelp('Open a real investing account','When you\'re ready, most banks and brokerages let you open a TFSA online for free. Start with a TFSA (growth is tax-free), pick a low-cost broad ETF, and contribute a small amount regularly. Everything you practise here, buying, holding, diversifying, applies the same way with real money.'))
    +acctChat('Help me set up an investing account',acctHelp('Open a real investing account','When you\'re ready, most banks and brokerages let you open a TFSA online for free. Start with a TFSA (growth is tax-free), pick a low-cost broad ETF, and contribute a small amount regularly. Everything you practise here, buying, holding, diversifying, applies the same way with real money.'))
    +'</div></div>';

  h+='</div>'; // grid-2
  el.innerHTML=h;
  renderAcctSummary();renderAcctLoans();renderAcctSpend();renderAcctSave();renderAcctInvest();
}

/* ── Home tiles (informational, like the Practice / My Goals tiles) ──── */
var MONEY_PALETTE=['#6f659a','#5b8def','#4f9c7e','#e0a92f','#cf5a40','#9084b4'];
function miniDonut(segs,size,centerTop,centerSub){
  size=size||92;var r=size/2-8,C=2*Math.PI*r,cx=size/2,cy=size/2,off=0;
  var s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#f0edfa" stroke-width="13"/>';
  segs.forEach(function(g){var len=C*Math.max(0,Math.min(1,g.v));if(len<=0)return;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+g.c+'" stroke-width="13" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-off)+'" transform="rotate(-90 '+cx+' '+cy+')"/>';
    off+=len;});
  return '<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'" style="display:block">'+s
    +'<text x="'+cx+'" y="'+(cy-1)+'" text-anchor="middle" font-size="16" font-weight="800" fill="#4b4470">'+centerTop+'</text>'
    +'<text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" font-size="8" font-weight="700" fill="#9a93b3">'+(centerSub||'')+'</text></svg>';
}
/* Home greeting reflects the real streak + live portfolio, so the top of Home
 * always matches the topbar and the Practice numbers (no more hardcoded copy). */
function renderHomeGreet(){
  var el=document.getElementById('homeGreet');if(!el)return;
  var days=(typeof LEARN!=='undefined'&&LEARN.streak)?LEARN.streak:1;
  var dayWord='<b>'+days+' day'+(days===1?'':'s')+'</b> in';
  var T=totals(),invested=START_CAPITAL+(PF.deposits||0),gain=T.unreal+PF.realized;
  var line;
  if(gain>0.5)line="You're "+dayWord+", and your portfolio's <b>up "+signed(gain)+"</b>. Here's where things stand.";
  else if(gain<-0.5)line="You're "+dayWord+". Your portfolio's <b>down "+signed(gain).replace('-','')+"</b> right now — markets wobble, that's normal.";
  else line="You're "+dayWord+", and your portfolio's right where you started. Ready when you are.";
  el.innerHTML=line;
}
function renderMoneyHome(){
  renderHomeGreet();
  /* ── Budget tile: donut of how income is allocated across categories ── */
  var bt=document.getElementById('tileBudget');
  if(bt){
    var income=numVal(BUDGET.income),planned=BUDGET.categories.reduce(function(a,c){return a+numVal(c.limit);},0);
    var spent=monthTotal(),left=income-spent;
    var pctBudg=income>0?Math.round(planned/income*100):0;
    var cats=BUDGET.categories.slice().sort(function(a,b){return numVal(b.limit)-numVal(a.limit);});
    var segs=cats.slice(0,6).map(function(c,i){return {v:planned>0?numVal(c.limit)/planned:0,c:MONEY_PALETTE[i%MONEY_PALETTE.length]};});
    var legend=cats.slice(0,3).map(function(c,i){
      return '<div class="row" style="margin:0 0 3px"><span style="font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:2px;background:'+MONEY_PALETTE[i%MONEY_PALETTE.length]+'"></span>'+c.name+'</span><span class="tnum" style="font-size:11px;color:var(--muted)">'+money0(c.limit)+'</span></div>';
    }).join('')||'<div class="muted-note" style="text-align:left">No categories yet.</div>';
    bt.innerHTML='<div class="card" style="cursor:pointer;margin:0;height:100%" onclick="push(\'budget\')">'
      +'<div class="row" style="margin-bottom:9px"><div class="card-t" style="margin-bottom:0">💰 Budget</div><span class="pill '+(left>=0?'pill-grn':'pill-red')+'">'+money0(left)+' left</span></div>'
      +'<div style="display:flex;gap:13px;align-items:center"><div style="flex:0 0 auto">'+miniDonut(segs,92,pctBudg+'%','budgeted')+'</div>'
      +'<div style="flex:1;min-width:0">'+legend+'<div class="muted-note" style="text-align:left;margin:6px 0 0">'+money0(spent)+' spent of '+money0(income)+'</div></div></div></div>';
  }
  /* ── Spending tile ── */
  var st=document.getElementById('tileSpending');
  if(st){
    var inc=numVal(BUDGET.income),tot=monthTotal(),m=thisMonth();
    var rows=SPENDING.filter(function(x){return (x.date||'').slice(0,7)===m;});
    var byCat={};rows.forEach(function(x){byCat[x.category]=(byCat[x.category]||0)+numVal(x.amount);});
    var top=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];})[0];
    var sp=inc>0?Math.min(100,Math.round(tot/inc*100)):0;
    st.innerHTML='<div class="card" style="cursor:pointer;margin:0;height:100%" onclick="push(\'spending\')">'
      +'<div class="row" style="margin-bottom:8px"><div class="card-t" style="margin-bottom:0">🧾 Spending</div><span class="pill pill-pur">this month</span></div>'
      +'<div class="tnum" style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--ink)">'+money(tot)+'</div>'
      +'<div class="muted-note" style="text-align:left;margin-top:2px">'+rows.length+' transaction'+(rows.length===1?'':'s')+(top?' · top: '+top:'')+'</div>'
      +'<div class="bar" style="margin-top:10px"><div class="bar-fill" style="width:'+sp+'%"></div></div>'
      +'<div class="muted-note" style="text-align:left;margin-top:4px">'+sp+'% of '+money0(inc)+' income</div></div>';
  }
  /* ── Net Worth tile ── */
  var nt=document.getElementById('tileNetworth');
  if(nt){
    var t=networthRows(),tot2=t.assets+t.debts,aw=tot2>0?Math.round(t.assets/tot2*100):0,dw=100-aw;
    nt.innerHTML='<div class="card" style="cursor:pointer;margin:0;height:100%" onclick="push(\'networth\')">'
      +'<div class="row" style="margin-bottom:8px"><div class="card-t" style="margin-bottom:0">📊 Net Worth</div></div>'
      +'<div class="tnum" style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:var(--ink)">'+money(t.net)+'</div>'
      +'<div style="display:flex;gap:16px;margin-top:7px">'
      +'<div><div style="font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.4px">ASSETS</div><div class="tnum" style="font-weight:800;font-size:13px">'+money0(t.assets)+'</div></div>'
      +'<div><div style="font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.4px">DEBTS</div><div class="tnum down" style="font-weight:800;font-size:13px">'+money0(t.debts)+'</div></div></div>'
      +'<div style="display:flex;height:7px;border-radius:4px;overflow:hidden;margin-top:10px;background:#f0edfa">'
      +'<div style="width:'+aw+'%;background:var(--green)"></div><div style="width:'+dw+'%;background:var(--red)"></div></div></div>';
  }
}
