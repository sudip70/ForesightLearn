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
function renderMoneyHome(){
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
