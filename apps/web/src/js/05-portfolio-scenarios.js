/* ═══════════ Scenarios: non-destructive what-ifs run on the REAL portfolio ═══════════ */
var SCN_CLASSMULT={stock:1,etf:0.6,crypto:2.4};
var SCENARIOS=[
  {id:'gfc2008',icon:'📉',title:'The 2008 Financial Crisis',regime:'gfc2008',term:'bear',endLbl:'By end 2009',
   mia:'In 2008 the S&P 500 fell about <b>57%</b> over 17 months. Brutal, but investors who <b>held on</b> recovered, the market reached new highs years later. 📉'},
  {id:'covid2020',icon:'🦠',title:'The COVID Crash, 2020',regime:'covid2020',term:'bear',endLbl:'By end 2020',
   mia:'In early 2020 markets fell <b>34% in five weeks</b>, then staged one of the <b>fastest recoveries ever</b>. Crashes can mend faster than they fall. 🦠'},
  {id:'bull2021',icon:'🚀',title:'The 2020–21 Bull Run',regime:'bull2021',term:'bull',endLbl:'At the 2022 peak',
   mia:'From the COVID low the market <b>more than doubled</b> to a record high by January 2022. Staying invested is how you catch runs like this. 🚀'},
  {id:'compound',icon:'❄️',title:'The Compound Effect',steps:60,drift:0.0078,mktVol:0.018,idio:0.011,investAll:true,unit:'yr',stepsPer:12,term:'compound',endLbl:'In 5 years',
   mia:'Give it time and your gains start earning their own gains, that\'s <b>compounding</b>. The curve bends upward the longer you stay invested. ❄️'},
  {id:'diversify',icon:'🌐',title:'Diversify with Mia',steps:45,drift:-0.003,mktVol:0.008,idio:0.018,compare:true,term:'diversification',
   mia:'Same shock, two portfolios. <b>Spreading across more types</b> (the green line) softens the swings, that\'s diversification at work. 🌐'}
];
function scnSpec(id){return SCENARIOS.filter(function(s){return s.id===id;})[0]||SCENARIOS[0];}
function scnSnap(){var h=PF.pos.map(function(p){return {sh:p.sh,px:curPx(p.t),cls:lclsOf(p.t)};});if(!h.length){h=[{sh:1,px:Math.max(1,totals().total),cls:'etf'}];}return h;}
function scnVal(h){var v=0;h.forEach(function(x){v+=x.sh*x.px;});return v;}
/* a broadly diversified spread: many independent low-vol holdings, so idiosyncratic swings average out */
function scnDiversified(val){var n=8,out=[],i;for(i=0;i<n;i++)out.push({sh:1,px:val/n,cls:'etf'});return out;}
function scnStep(h,mktR,idio){h.forEach(function(x){var r=mktR+idio*(SCN_CLASSMULT[x.cls]||1)*gauss();if(r<-0.3)r=-0.3;if(r>0.3)r=0.3;x.px=x.px*(1+r);});}
var SCN_BETA={stock:1.1,etf:0.9,crypto:1.6};/* how hard each asset class follows the broad market in a regime */
/* Real S&P 500 closing levels for famous regimes (public market data, ~monthly anchors).
   A scenario replays these real market moves on a COPY of the user's holdings, scaled by
   each asset class's market beta. Strictly non-destructive — PF/SIM are never touched. */
var REGIMES={
  gfc2008:{label:'2008 Financial Crisis',from:'Oct 2007',to:'Dec 2009',lvl:[1565,1378,1323,1280,1166,968,752,903,826,735,677,919,1057,1115]},
  covid2020:{label:'COVID Crash 2020',from:'Feb 2020',to:'Dec 2020',lvl:[3386,2237,2912,3044,3100,3271,3500,3363,3270,3622,3756]},
  bull2021:{label:'2020–21 Bull Run',from:'Mar 2020',to:'Jan 2022',lvl:[2237,3100,3363,3756,3973,4298,4308,4766,4797]}
};
/* geometric interpolation between the monthly anchors → a smooth per-frame market return path */
function regimeReturns(reg){var lvl=reg.lvl,out=[],FR=4,i,f;for(i=1;i<lvl.length;i++){var r=Math.pow(lvl[i]/lvl[i-1],1/FR)-1;for(f=0;f<FR;f++)out.push(r);}return out;}
function simulateRegime(spec){
  var reg=REGIMES[spec.regime],rets=regimeReturns(reg);
  var A=scnSnap(),cash=PF.cash;
  function tot(h){return scnVal(h)+cash;}
  var cA=[{i:0,total:tot(A)}],pkA=cA[0].total,wA=0;
  rets.forEach(function(mktR,idx){
    A.forEach(function(x){var r=mktR*(SCN_BETA[x.cls]||1);if(r<-0.5)r=-0.5;if(r>0.5)r=0.5;x.px=x.px*(1+r);});
    var va=tot(A);if(va>pkA)pkA=va;var da=(va-pkA)/pkA;if(da<wA)wA=da;cA.push({i:idx+1,total:+va.toFixed(2)});
  });
  return {id:spec.id,compare:false,curveA:cA,curveB:null,startA:cA[0].total,endA:cA[cA.length-1].total,
    gainA:(cA[cA.length-1].total/cA[0].total-1)*100,worstA:wA*100,regime:reg};
}
function simulateScenario(spec){
  if(spec.regime)return simulateRegime(spec);
  var A=scnSnap(),B=spec.compare?scnDiversified(scnVal(A)):null;
  var cash=spec.compare?0:PF.cash; /* compare = invested-only, apples to apples */
  if(spec.investAll&&cash>0){A=A.concat([{sh:1,px:cash,cls:'etf'}]);cash=0;} /* compound: put the whole balance to work so the snowball is clear */
  function tot(h){return scnVal(h)+cash;}
  var cA=[{i:0,total:tot(A)}],cB=B?[{i:0,total:tot(B)}]:null;
  var pkA=cA[0].total,wA=0,pkB=B?cB[0].total:0,wB=0;
  for(var i=1;i<=spec.steps;i++){
    var prog=i/spec.steps,drift=(spec.recover&&prog>0.6)?-spec.drift*0.7:spec.drift;
    var mktR=drift+spec.mktVol*gauss();
    scnStep(A,mktR,spec.idio);var va=tot(A);if(va>pkA)pkA=va;var da=(va-pkA)/pkA;if(da<wA)wA=da;cA.push({i:i,total:va});
    if(B){scnStep(B,mktR,spec.idio);var vb=tot(B);if(vb>pkB)pkB=vb;var db=(vb-pkB)/pkB;if(db<wB)wB=db;cB.push({i:i,total:vb});}
  }
  return {id:spec.id,compare:!!spec.compare,curveA:cA,curveB:cB,startA:cA[0].total,endA:cA[cA.length-1].total,
    gainA:(cA[cA.length-1].total/cA[0].total-1)*100,worstA:wA*100,
    endB:cB?cB[cB.length-1].total:null,worstB:wB*100};
}
function compareChart(a,b,w,h,labelFn){
  var pad=8,padB=20,padT=10,all=a.map(function(p){return p.total;}).concat(b.map(function(p){return p.total;}));
  var mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),rg=(mx-mn)||1,n=Math.max(a.length,b.length);
  var sx=(w-pad*2)/Math.max(1,n-1),lf=labelFn||function(p){return 'Day '+p.i;};
  function X(i){return pad+i*sx;}function Y(v){return padT+(h-padT-padB)*(1-(v-mn)/rg);}
  function path(arr){return arr.map(function(p,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(p.total).toFixed(1);}).join(' ');}
  var lab='';[0,Math.floor((n-1)/2),n-1].forEach(function(i,k){var gx=X(i).toFixed(1);lab+='<text x="'+gx+'" y="'+(h-6)+'" font-size="9" fill="#aaa4c0" font-weight="700" text-anchor="'+(k===0?'start':(k===2?'end':'middle'))+'">'+lf((a[i]||a[a.length-1]))+'</text>';});
  function dot(arr,col){var e=arr[arr.length-1];return '<circle cx="'+X(arr.length-1).toFixed(1)+'" cy="'+Y(e.total).toFixed(1)+'" r="3.2" fill="'+col+'" stroke="#fff" stroke-width="1.5"/>';}
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block">'
    +'<path d="'+path(a)+'" fill="none" stroke="#9084b4" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
    +'<path d="'+path(b)+'" fill="none" stroke="#4f9c7e" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'
    +lab+dot(a,'#9084b4')+dot(b,'#4f9c7e')+'</svg>';
}
var scnCur='gfc2008',scnData=null,scnTerm='bear',scnAnim=null;
function scnLabelFn(spec,d){
  if(spec.regime){var reg=REGIMES[spec.regime],last=d?d.curveA[d.curveA.length-1].i:0;return function(p){return p.i===0?reg.from:(p.i===last?reg.to:'');};}
  return function(p){return spec.unit==='yr'?('Yr '+Math.round((p.i||0)/spec.stepsPer)):('Day '+(p.i||0));};
}
function drawScenarioChart(spec,d,upto){
  var c=document.getElementById('scenarioChart');if(!c)return;var lf=scnLabelFn(spec,d);
  if(spec.compare){c.innerHTML=compareChart(d.curveA.slice(0,upto),d.curveB.slice(0,upto),300,150,lf);}
  else{c.innerHTML=equityChart(d.curveA.slice(0,upto),300,150,'#6f659a',lf);}
}
function scnStatBox(label,val,cls){return '<div class="scn-stat"><label>'+label+'</label><div class="v '+(cls||'')+'">'+val+'</div></div>';}
function renderScnSummary(spec,d){
  var el=document.getElementById('scnResult');if(!el)return;var h='';
  if(spec.compare){
    h='<div class="scn-result"><div class="scn-legend"><span><i style="background:#9084b4"></i>Your mix</span><span><i style="background:#4f9c7e"></i>Spread out</span></div></div>'
      +'<div class="scn-result">'+scnStatBox('Your mix · worst drop',d.worstA.toFixed(0)+'%','dn')+scnStatBox('Spread out · worst drop',d.worstB.toFixed(0)+'%','up')+'</div>';
  }else{
    var up=d.gainA>=0;
    h='<div class="scn-result">'+scnStatBox('Start',money0(d.startA))+scnStatBox(spec.endLbl||'Ended',money0(d.endA),up?'up':'dn')
      +scnStatBox('Change',(up?'+':'')+d.gainA.toFixed(1)+'%',up?'up':'dn')+scnStatBox('Worst drop',d.worstA.toFixed(0)+'%','dn')+'</div>';
  }
  el.innerHTML=h;
}
function animateScenario(){
  if(scnAnim){clearInterval(scnAnim);scnAnim=null;}
  var spec=scnSpec(scnCur),d=scnData;if(!d)return;
  var btn=document.getElementById('scnRunBtn');if(btn)btn.textContent='Running… ▶';
  var res=document.getElementById('scnResult');if(res)res.innerHTML='';
  var n=d.curveA.length,k=1;drawScenarioChart(spec,d,1);
  scnAnim=setInterval(function(){
    k+=Math.max(1,Math.round(n/45));if(k>=n)k=n;
    drawScenarioChart(spec,d,k);
    if(k>=n){clearInterval(scnAnim);scnAnim=null;renderScnSummary(spec,d);if(btn)btn.textContent='Replay ▶';}
  },45);
}
function renderScenario(){
  var spec=scnSpec(scnCur);scnCur=spec.id;scnTerm=spec.term;
  [].forEach.call(document.querySelectorAll('#page-scenario .scenario-card'),function(c){c.classList.toggle('sel',c.getAttribute('data-scn')===spec.id);});
  var t=document.getElementById('scnTitle');if(t)t.innerHTML=spec.icon+' '+spec.title;
  var m=document.getElementById('scnMia');if(m)m.innerHTML=spec.mia;
  scnData=simulateScenario(spec);
  animateScenario();
}
function runScenario(id){scnCur=id;renderScenario();var pg=document.getElementById('page-scenario');if(pg)pg.scrollTop=0;}

var pfRange='1M';
function setRange(r,el){
  pfRange=r;
  if(el)[].forEach.call(el.parentNode.children,function(b){b.classList.toggle('on',b===el);});
  renderPortfolioChart();
}
/* ── Detail level: 1 Starter · 2 Intermediate · 3 Pro ─────────────────── */
var pfLevel=1;
var LVL_NAME={1:'Starter',2:'Intermediate',3:'Pro'};
var LVL_HELP={1:'Few numbers · welcoming. Slide right for more detail.',2:'More metrics, watchlist, activity and scenarios.',3:'Everything: accounts, plan and price sources.'};
var LVL_VIS={hold:1,trade:1,watch:2,act:2,plan:3}; /* min level each sub-tab needs */
/* fill % for a raw slider value (1..3); matches the thumb centre, with a small
   nub at level 1 so the track never looks unset. Continuous so dragging is smooth. */
function lvlFill(raw){return Math.max(14,(raw-1)/2*100);}
function applyPracticeLevel(keepSlider){
  var pg=document.getElementById('page-journey');
  if(pg){pg.classList.remove('lvl-1','lvl-2','lvl-3');pg.classList.add('lvl-'+pfLevel);}
  var sl=document.getElementById('pfLevelSlider');
  /* keepSlider: leave the thumb/fill where the finger is mid-drag; otherwise snap to level */
  if(sl&&!keepSlider){sl.value=pfLevel;sl.style.setProperty('--fill',lvlFill(pfLevel).toFixed(1)+'%');}
  if(sl)sl.setAttribute('aria-valuetext',LVL_NAME[pfLevel]);
  var nm=document.getElementById('pfLevelName');if(nm)nm.textContent=LVL_NAME[pfLevel];
  var hp=document.getElementById('pfLevelHelp');if(hp)hp.textContent=LVL_HELP[pfLevel];
  document.querySelectorAll('.lvl-stops span').forEach(function(s){s.classList.toggle('on',+s.dataset.lvl===pfLevel);});
  /* if Starter forces 1M range but a higher-only range was active, fall back */
  if(pfLevel===1&&pfRange!=='1M'&&pfRange!=='ALL'){
    var rts=document.querySelectorAll('#page-journey .rt');
    setRange('1M',rts[2]||null);
  }
}
/* live drag: glide the thumb/fill continuously, only re-render when the level flips */
function pfLevelInput(raw){
  var sl=document.getElementById('pfLevelSlider');
  if(sl)sl.style.setProperty('--fill',lvlFill(raw).toFixed(1)+'%');
  var lvl=Math.max(1,Math.min(3,Math.round(raw)));
  if(lvl!==pfLevel)setPfLevel(lvl,true);
}
/* on release: snap thumb + fill to the chosen level */
function pfLevelSnap(){applyPracticeLevel(false);}
/* keyboard moves whole levels (step is tiny for smooth dragging, so override arrows) */
function pfLevelKey(e){
  var k=e.key;
  if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();setPfLevel(pfLevel-1);}
  else if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();setPfLevel(pfLevel+1);}
  else if(k==='Home'){e.preventDefault();setPfLevel(1);}
  else if(k==='End'){e.preventDefault();setPfLevel(3);}
}
function setPfLevel(v,fromDrag){
  pfLevel=Math.max(1,Math.min(3,v|0))||1;
  applyPracticeLevel(fromDrag);
  /* a now-hidden sub-tab falls back to Holdings */
  if(LVL_VIS[jCur]>pfLevel){
    var st=document.querySelectorAll('#page-journey .subtab');
    st.forEach(function(x,i){x.classList.toggle('active',i===0);});
    jTab(null,'hold');
  }
  renderPortfolio();
  if(jCur==='hold')renderHoldings();else if(jCur==='trade')renderTradePanel();
  saveState();
}
function pfMix(){var by={},inv=0;PF.pos.forEach(function(p){var v=p.sh*curPx(p.t);inv+=v;var c=lclsOf(p.t);by[c]=(by[c]||0)+v;});return {by:by,inv:inv,classes:Object.keys(by).length};}
function renderPortfolio(){
  var T=totals();
  document.getElementById('pfValue').textContent=money(T.total);
  document.getElementById('pfCash').textContent=money(PF.cash);
  var sgain=T.unreal+PF.realized;
  document.getElementById('scStatVal').textContent=pfLevel===1
    ?(sgain>=0?'You\'re up '+money(sgain)+' so far':'Down '+money(Math.abs(sgain))+' so far')+' · all practice money'
    :signed(sgain);
  var u=document.getElementById('pfUnreal');u.textContent=signed(T.unreal);u.className='tnum '+(T.unreal>=0?'up':'down');
  var r=document.getElementById('pfReal');r.textContent=PF.realized?signed(PF.realized):'$0.00';r.className='tnum '+(PF.realized>0?'up':(PF.realized<0?'down':''));
  // true investment gain excludes deposited cash; % is over capital actually put in
  var invested=START_CAPITAL+(PF.deposits||0),gain=T.unreal+PF.realized,pct=gain/invested*100,ap=document.getElementById('pfAllPct');
  ap.textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%';ap.className='pill '+(pct>=0?'pill-grn':'pill-red');
  var inv=document.getElementById('pfInvested');if(inv)inv.textContent=money0(invested);
  var src=document.getElementById('pfPxSrc');if(src){var real=PF.pos.some(function(p){return LIVE[p.t]!=null;});src.textContent=real?'Real prices':'Sample prices';src.className='pill '+(real?'pill-grn':'pill-gry');}
  var td=document.getElementById('pfToday'),dm=acctDayMove();
  if(td)td.innerHTML=dm?(' &nbsp;·&nbsp; <span class="'+(dm.abs>=0?'up':'down')+'" style="font-weight:800">'+(dm.abs>=0?'+':'-')+'$'+Math.abs(dm.abs).toFixed(2)+' ('+(dm.pct>=0?'+':'')+dm.pct.toFixed(2)+'%) today</span>'):'';
  if(jCur==='watch')renderWatch();
  // Home hero mirrors the live portfolio
  var hv=document.getElementById('homeVal');
  if(hv){hv.textContent=money(T.total);
    document.getElementById('homeChg').textContent=(gain>=0?'▲ ':'▼ ')+signed(gain)+' ('+(pct>=0?'+':'')+pct.toFixed(1)+'%) all time';
    document.getElementById('homeGrowth').textContent=signed(gain);
    var hi=document.getElementById('homeInvested');if(hi)hi.textContent=money(invested);
    var hc=document.getElementById('homeCash');if(hc)hc.textContent=money(PF.cash);}
  var hs=document.getElementById('homeSpark');
  if(hs){hs.innerHTML=sparkline(portfolioHistory(40).map(function(p){return p.total;}),200,80,'#ffffff');}
  renderPortfolioChart();
}
/* tiny decorative-but-real sparkline for the Home hero (stretches to fill) */
function sparkline(vals,w,h,color){
  var pad=3,mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),rg=(mx-mn)||1,n=vals.length,sx=(w-pad*2)/(n-1);
  var pts=vals.map(function(v,i){return [pad+i*sx,pad+(h-pad*2)*(1-(v-mn)/rg)];});
  var line=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
  var area=line+' L'+pts[n-1][0].toFixed(1)+' '+(h-pad)+' L'+pts[0][0].toFixed(1)+' '+(h-pad)+' Z';
  var id='sp'+Math.floor(Math.random()*1e6);
  return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" style="display:block">'
    +'<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity=".4"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'
    +'<path d="'+area+'" fill="url(#'+id+')"/>'
    +'<path d="'+line+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}
function renderHoldings(){
  var html='';
  var mix=pfMix();
  if(mix.inv&&pfLevel>=2){
    var COLW={stock:'#9084b4',etf:'#6f8fd6',crypto:'#c19a34'};/* --invest / --blue / --amber — gold stays Learn-only */
    var seg=Object.keys(mix.by).map(function(c){return '<div style="width:'+(mix.by[c]/mix.inv*100)+'%;background:'+(COLW[c]||'#9084b4')+'"></div>';}).join('');
    var labels=Object.keys(mix.by).map(function(c){return Math.round(mix.by[c]/mix.inv*100)+'% '+c;}).join(' · ');
    var read=mix.classes>=3?'Nicely spread across '+mix.classes+' asset types 🧺':'Mostly in '+mix.classes+' type'+(mix.classes>1?'s':'')+', spreading out lowers risk';
    html+='<div class="card"><div class="card-t" style="margin-bottom:10px">Portfolio analytics</div><div class="mixbar">'+seg+'</div><div class="mininote" style="margin-top:9px"><b style="color:var(--ink)">'+read+'</b><br>'+labels+'</div></div>';
  }
  if(!PF.pos.length){html='<div class="card"><div class="muted-note" style="text-align:left">No holdings yet. Tap <b>Trade</b> to make your first paper investment, virtual cash, zero risk.</div></div>';}
  else{
    var posHelp=pfLevel>=2?'<button type="button" class="qd" onclick="event.stopPropagation();openTip(\'pnl\')" aria-label="What is profit and loss?">?</button>':'';
    html+='<div class="card"><div class="row" style="margin-bottom:13px"><div class="card-t" style="margin-bottom:0">Positions'+posHelp+'</div><span class="pill pill-pur">'+PF.pos.length+' holdings</span></div>';
    PF.pos.forEach(function(p){
      var cur=curPx(p.t),val=p.sh*cur,pl=(cur-p.avg)*p.sh,plp=(cur/p.avg-1)*100,cls=pl>=0?'up':'down',sg=pl>=0?'+':'-';
      var dm=posDayMove(p),today=(pfLevel>=2&&dm)?' · <span class="'+(dm.pct>=0?'up':'down')+'" style="font-weight:700">'+(dm.pct>=0?'+':'')+dm.pct.toFixed(2)+'% today</span>':'';
      var plHtml=pfLevel>=2
        ?'<div class="l-c '+cls+'">'+sg+'$'+Math.abs(pl).toFixed(2)+' ('+sg+Math.abs(plp).toFixed(1)+'%)</div>'
        :'<div class="l-c '+cls+'" style="font-size:13px">'+(pl>=0?'▲':'▼')+'</div>';
      html+='<div class="lrow" style="cursor:pointer" onclick="openTradeFor(\''+p.t+'\')">'
        +'<div style="display:flex;align-items:center;gap:11px"><div class="tkr-ic">'+p.t+'</div><div><div class="l-n">'+p.t+' <span style="font-size:10px;color:var(--faint);font-weight:700">'+p.acct+'</span></div><div class="l-s">'+fmtSh(p.sh)+' sh · avg '+money(p.avg)+today+'</div></div></div>'
        +'<div class="l-v"><div class="l-p tnum">'+money(val)+'</div>'+plHtml+'</div></div>';
    });
    html+='</div>';
  }
  var byAcct={};PF.pos.forEach(function(p){(byAcct[p.acct]=byAcct[p.acct]||[]).push(p);});
  if(pfLevel>=3&&Object.keys(byAcct).length){
    html+='<div class="card-t" style="margin:4px 2px 10px">Accounts · risk plans</div>';
    Object.keys(byAcct).forEach(function(ac){
      var v=0;byAcct[ac].forEach(function(p){v+=p.sh*curPx(p.t);});
      var c=ac==='TFSA'?'tfsa':(ac==='RRSP'?'rrsp':'etf');
      html+='<div class="acct '+c+'"><div class="a-ic">'+ac[0]+'</div><div class="a-b"><div class="a-t">'+ac+'</div><div class="a-d">'+byAcct[ac].length+' holding'+(byAcct[ac].length>1?'s':'')+' · Simple plan</div></div><div class="a-r"><div class="a-v">'+money(v)+'</div><button class="adjust" onclick="event.stopPropagation();push(\'risk\')">Adjust</button></div></div>';
    });
  }
  document.getElementById('jHold').innerHTML=html;
}
function renderTrade(){
  document.getElementById('jTrade').innerHTML=
    '<div class="card"><div class="card-t">Trade</div>'
    +'<input class="f-in" id="tradeSearch" placeholder="🔍 Search any of 56 assets…" autocomplete="off" oninput="tradeFilter()"/>'
    +'<div id="tradeResults" class="sf-results" style="display:none;margin-top:8px"></div>'
    +'<div id="tradePanel" style="margin-top:13px"></div></div>';
  if(tradeTicker)selectTradeAsset(tradeTicker);
}
function tradeFilter(){
  var q=document.getElementById('tradeSearch').value.trim().toLowerCase(),res=document.getElementById('tradeResults');
  if(!q){res.style.display='none';return;}
  var list=ASSETS.filter(function(a){return a.t.toLowerCase().indexOf(q)>=0||a.n.toLowerCase().indexOf(q)>=0;}).slice(0,8);
  res.style.display='block';
  res.innerHTML=list.length?list.map(function(a){return '<div class="sf-item" onclick="selectTradeAsset(\''+a.t+'\')"><div class="tkr-ic">'+a.t.replace('-USD','')+'</div><div style="min-width:0"><div class="l-n">'+a.n+'</div><div class="l-s">'+a.t+'</div></div><span class="sf-cls '+a.c+'">'+a.c+'</span></div>';}).join(''):'<div class="sf-item"><span class="l-s">No asset matches that.</span></div>';
}
function selectTradeAsset(t){
  tradeTicker=t;pendingSh=0;var a=ASSETS.filter(function(x){return x.t===t;})[0];
  var s=document.getElementById('tradeSearch');if(s)s.value=a?a.n:t;
  var r=document.getElementById('tradeResults');if(r)r.style.display='none';
  renderTradePanel();
  fetchLive(t,function(){if(tradeTicker===t)renderTradePanel();});
}
function renderTradePanel(){
  var el=document.getElementById('tradePanel');if(!el)return;var t=tradeTicker;if(!t){el.innerHTML='';return;}
  var a=ASSETS.filter(function(x){return x.t===t;})[0]||{t:t,n:t,c:'stock'},px=curPx(t),live=!!LIVE[t],bn=t.replace('-USD','');
  var have=PF.pos.filter(function(x){return x.t===t;})[0];
  var sh=parseFloat((document.getElementById('tradeSh')||{}).value)||pendingSh||0;
  var h='<div class="trade-asset"><div><div class="ta-t">'+bn+' <span class="sf-cls '+a.c+'">'+a.c+'</span></div><div class="ta-n">'+a.n+(have?' · you hold '+fmtSh(have.sh):'')+'</div></div><div class="ta-px"><div class="tnum">'+money(px)+'</div><span class="pill '+(live?'pill-grn':'pill-gry')+'" style="font-size:10px">'+(live?'● Live':'~ est.')+'</span></div></div>';
  h+='<div class="toggle" style="margin-top:13px"><button class="tg buy'+(tradeAction==='buy'?' on':'')+'" onclick="setTrade(\'buy\')">Buy</button><button class="tg sell'+(tradeAction==='sell'?' on':'')+'" onclick="setTrade(\'sell\')">Sell</button></div>';
  h+='<label class="f-label">Shares<button type="button" class="qd" onclick="openTip(\'avg_cost\')" aria-label="What does shares and average cost mean?">?</button></label><input class="f-in" type="number" id="tradeSh" min="0" step="0.0001" placeholder="0" value="'+(sh||'')+'" oninput="updateCost()"/>';
  h+='<div class="row" style="margin:10px 0 13px"><span style="font-size:13px;color:var(--muted);font-weight:600" id="costLbl">'+(tradeAction==='buy'?'Estimated cost':'Estimated proceeds')+'</span><span style="font-size:17px;font-weight:800;color:var(--purple-deep)" class="tnum" id="tradeCost">'+money(sh*px)+'</span></div>';
  if(tradeAction==='buy'&&pfLevel===1){
    h+='<div class="muted-note" style="text-align:left">Buying is practice with virtual cash, so there\'s zero risk. Pick how many shares and review your order.</div>';
  }else if(tradeAction==='buy'){
    var fc=TRADE_FC[t];
    if(fc){var lo=px*(1+fc.bear),hi=px*(1+fc.bull),mid=px*(1+fc.base);
      h+='<div class="pretrade-card"><div class="pretrade-title" style="color:var(--purple-deep)">🔭 A range, not a prediction</div><div style="font-size:12.5px;color:var(--purple-strong);line-height:1.5">Over the next 3 months, '+bn+' could realistically sit between <b>'+money(lo)+'</b> and <b>'+money(hi)+'</b>, most likely near '+money(mid)+'. Nobody can call which; that\'s exactly why we practice first.</div></div>';
    }else h+='<div class="muted-note" style="text-align:left">Loading '+bn+'\'s outlook…</div>';
  }else{
    if(have){var pl=(px-have.avg)*Math.min(sh||have.sh,have.sh);
      h+='<div class="pretrade-card" style="background:var(--purple-soft);border-color:var(--purple-line)"><div class="pretrade-title" style="color:var(--purple-deep)">You hold '+fmtSh(have.sh)+' × '+bn+' · avg '+money(have.avg)+'</div><div style="font-size:12.5px;color:var(--purple-strong)">Selling '+fmtSh(sh||have.sh)+' now locks in about <b>'+signed(pl)+'</b> as realized P&amp;L, that part becomes final.</div></div>';
    }else h+='<div class="muted-note" style="text-align:left">You don\'t hold any '+bn+' yet, switch to <b>Buy</b> to start a position.</div>';
  }
  h+='<button class="btn btn-pur" style="margin-top:12px" onclick="reviewTrade()">Review '+(tradeAction==='buy'?'buy':'sell')+' order</button>';
  el.innerHTML=h;
}
function setTrade(a){tradeAction=a;renderTradePanel();}
function updateCost(){var sh=parseFloat(document.getElementById('tradeSh').value)||0,px=curPx(tradeTicker);var cl=document.getElementById('costLbl');if(cl)cl.textContent=tradeAction==='buy'?'Estimated cost':'Estimated proceeds';var tc=document.getElementById('tradeCost');if(tc)tc.textContent=money(sh*px);}
function openTradeFor(t){tradeTicker=t;tradeAction='sell';document.querySelectorAll('#page-journey .subtab').forEach(function(x,i){x.classList.toggle('active',i===1);});jTab(null,'trade');}
function execTrade(){
  /* shares come from the review ticket if present, else the live input (defensive) */
  var inEl=document.getElementById('tradeSh');
  var sh=parseFloat(inEl?inEl.value:pendingSh);
  if(!sh||sh<=0){showToast('Enter how many shares');return;}
  var t=tradeTicker,p=curPx(t),val=sh*p,bn=t.replace('-USD','');
  if(tradeAction==='buy'){
    if(val>PF.cash){showToast('Not enough buying power, you have '+money(PF.cash));return;}
    PF.cash-=val;
    var ex=PF.pos.filter(function(x){return x.t===t;})[0];
    if(ex){var tot=ex.sh+sh;ex.avg=(ex.sh*ex.avg+sh*p)/tot;ex.sh=tot;}
    else PF.pos.push({t:t,acct:'TFSA',sh:sh,avg:p,dt:barDate(t)});
    ACTIVITY.unshift({ic:'🟢',main:'Bought '+fmtSh(sh)+' × '+bn,sub:nowLabel()+' · @ '+money(p),amt:'-'+money(val),cls:''});
    showToast('✓ Bought '+fmtSh(sh)+' × '+bn);
  }else{
    var pos=PF.pos.filter(function(x){return x.t===t;})[0];
    if(!pos||pos.sh<sh){showToast('You only hold '+(pos?fmtSh(pos.sh):0)+' × '+bn);return;}
    var realized=(p-pos.avg)*sh;PF.cash+=val;PF.realized+=realized;pos.sh-=sh;
    if(pos.sh<=0.0001)PF.pos=PF.pos.filter(function(x){return x.t!==t;});
    ACTIVITY.unshift({ic:'🔴',main:'Sold '+fmtSh(sh)+' × '+bn,sub:nowLabel()+' · @ '+money(p),amt:'+'+money(val),cls:realized>=0?'up':'down'});
    showToast((realized>=0?'✓ Sold for a gain':'Sold')+' '+fmtSh(sh)+' × '+bn);
    openSheet((realized>=0?'🎉 ':'')+'Trade complete, '+signed(realized)+' realized','You bought '+bn+' at an average of '+money(pos.avg)+' and sold at '+money(p)+'. That\'s a '+signed(realized)+' '+(realized>=0?'gain':'loss')+', now locked in as realized P&L. '+(realized>=0?'Nice work!':'Every trade is a lesson on the way.'));
  }
  pendingSh=0;
  if(typeof touchStreak==='function')touchStreak();/* a practice trade counts as today's activity */
  renderPortfolio();renderTradePanel();refreshLearn();saveState();
}
function renderActivity(){
  if(!ACTIVITY.length){document.getElementById('jAct').innerHTML='<div class="card"><div class="card-t">Activity</div><div class="muted-note" style="text-align:left">No trades yet. Head to <b>Trade</b> to make your first paper investment, it all shows up here.</div></div>';return;}
  document.getElementById('jAct').innerHTML='<div class="card"><div class="card-t">Activity</div>'+ACTIVITY.map(function(a){
    return '<div class="lrow"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:17px">'+a.ic+'</div><div><div class="l-n">'+a.main+'</div><div class="l-s">'+a.sub+'</div></div></div><div class="l-v"><div class="l-p tnum '+a.cls+'">'+a.amt+'</div></div></div>';
  }).join('')+'</div>';
}
function renderJourneyPlan(){
  var el=document.getElementById('jPlan');if(!el)return;
  if(typeof syncPrimaryGoal==='function')syncPrimaryGoal();/* mirror GOALS[0] → GOAL so Plan matches Home/Savings */
  var g=GOAL,gpct=g.amt>0?Math.min(100,Math.round(g.saved/g.amt*100)):0;
  el.innerHTML=
    '<div class="card"><div class="card-t">Auto-contribution</div>'
    +'<div class="row" style="margin-bottom:0"><span style="font-size:13px;font-weight:700">Amount</span><span style="font-size:17px;font-weight:800;color:var(--purple-deep)" id="contribAmt">$'+contrib.amt+'</span></div>'
    +'<input type="range" min="50" max="1000" step="50" value="'+contrib.amt+'" oninput="contrib.amt=+this.value;document.getElementById(\'contribAmt\').textContent=\'$\'+this.value;document.getElementById(\'contribNote\').textContent=planNote()">'
    +'<label class="f-label">Frequency</label>'
    +'<div class="toggle"><button class="tg buy'+(contrib.freq==='Weekly'?' on':'')+'" onclick="setFreq(\'Weekly\')">Weekly</button><button class="tg buy'+(contrib.freq==='Monthly'?' on':'')+'" onclick="setFreq(\'Monthly\')">Monthly</button></div>'
    +'<div class="muted-note" style="text-align:left" id="contribNote">'+planNote()+'</div></div>'
    +'<div class="goal-card" onclick="openGoalSetup()" style="cursor:pointer"><div class="row"><div style="font-size:14px;font-weight:800">🎯 '+goalTitle(g)+'</div><span class="pill pill-pur">'+gpct+'%</span></div><div class="bar"><div class="bar-fill" style="width:'+gpct+'%"></div></div><div class="row"><span style="font-size:11px;color:var(--muted)">'+money0(g.saved)+' of '+money0(g.amt)+'</span><span style="font-size:11px;color:var(--purple-strong);font-weight:700">'+g.years+'-yr plan · ✏️ adjust</span></div></div>'
    +'<div class="card-t" style="margin:4px 2px 10px">Milestones</div>'
    +goalMs(g).map(function(m,i){return '<div class="milestone"><div class="ms-n"'+(i===0?' style="background:var(--green-soft);color:var(--green)"':'')+'>'+(i===0?'✓':(i+1))+'</div><div class="ms-t">'+m+'</div></div>';}).join('');
}
function planNote(){var yr=contrib.amt*(contrib.freq==='Weekly'?52:12);return 'Fiscally will remind you to invest $'+contrib.amt+' '+contrib.freq.toLowerCase()+', about '+('$'+yr.toLocaleString())+'/yr toward your goal.';}
function setFreq(f){contrib.freq=f;renderJourneyPlan();}
function openSheet(term,def){document.getElementById('sheetTerm').textContent=term;document.getElementById('sheetDef').textContent=def;document.getElementById('sheetOv').classList.add('open');}
