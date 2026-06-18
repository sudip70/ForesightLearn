/* ── Paper-trading engine ─────────────────────── */
/* Realistic seed prices for all 56 assets (instant render). LIVE overlays real backend prices. */
var SEED={AAPL:311,AMD:165,AMZN:205,BAC:42,COST:880,CRM:280,DIS:105,GOOGL:178,HD:360,JNJ:155,JPM:205,KO:62,MA:470,META:560,MSFT:420,NFLX:680,NVDA:132,ORCL:175,PFE:28,PG:168,TSLA:250,UNH:510,V:285,WMT:70,XOM:115,
BND:72,DIA:420,EEM:44,EFA:82,EWC:42,GLD:240,HYG:79,IWM:220,LQD:110,QQQ:480,SLV:28,SPY:540,TLT:92,VNQ:90,VTI:270,XLE:92,XLF:42,XLK:230,XLP:82,XLV:145,XLY:200,
'ADA-USD':0.45,'AVAX-USD':35,'BNB-USD':600,'BTC-USD':64000,'DOGE-USD':0.13,'DOT-USD':6.5,'ETH-USD':3400,'LTC-USD':85,'SOL-USD':160,'XRP-USD':0.55};
var LIVE={},TRADE_FC={},HIST={};/* HIST[t] = real daily {date,price} series from the forecast endpoint */
var START_CAPITAL=10000;
var PF={cash:4760.00,realized:0,deposits:0,watch:['NVDA','QQQ','BTC-USD'],pos:[
  {t:'AAPL',acct:'TFSA',sh:5,avg:305.00,init:1},
  {t:'SPY',acct:'TFSA',sh:6,avg:533.00,init:1},
  {t:'GLD',acct:'RRSP',sh:2,avg:238.00,init:1}
]};
var ACTIVITY=[
  {ic:'🟢',main:'Bought 2 × GLD',sub:'Day 2 · @ $228.00',amt:'-$456.00',cls:''},
  {ic:'🟢',main:'Bought 6 × SPY',sub:'Day 1 · @ $479.50',amt:'-$2,877.00',cls:''},
  {ic:'🟢',main:'Bought 5 × AAPL',sub:'Day 1 · @ $181.20',amt:'-$906.00',cls:''},
  {ic:'💵',main:'Opening deposit',sub:'Day 1 · Virtual cash',amt:'+$10,000.00',cls:'up'}
];
var contrib={amt:100,freq:'Weekly'},tradeTicker='AAPL',tradeAction='buy',explainerShown=false,pendingSh=0;
var SIM={day:4};/* vestigial day counter, kept only for the activity-log label */
function curPx(t){return LIVE[t]||SEED[t]||100;}/* real live price, seed fallback offline */
function nameOf(t){var a=ASSETS.filter(function(x){return x.t===t;})[0];return a?a.n:t;}
function fetchLive(t,cb){
  var key=t+'_90';
  if(SF_CACHE[key]&&SF_CACHE[key].latest_price){LIVE[t]=SF_CACHE[key].latest_price;if(SF_CACHE[key].returns)TRADE_FC[t]=SF_CACHE[key].returns;if(SF_CACHE[key].historical_prices)HIST[t]=SF_CACHE[key].historical_prices;if(cb)cb();return;}
  wakeFetch(API+'/api/forecasts/ticker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticker:t,horizon_days:90})})
    .then(function(d){if(d&&d.latest_price){LIVE[t]=d.latest_price;if(d.returns)TRADE_FC[t]=d.returns;if(d.historical_prices)HIST[t]=d.historical_prices;}if(cb)cb();})
    .catch(function(){if(cb)cb();});
}
var initDone=false;
/* stable per-ticker entry offset so seed holdings show a realistic MIX of P&L, not a uniform +1.5% */
function anchorOffset(t){var h=0;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))%997;return 0.95+(h/997)*0.085;}
function anchorInit(){
  if(initDone)return;
  var inits=PF.pos.filter(function(p){return p.init;});
  if(!inits.length){initDone=true;return;}
  if(inits.some(function(p){return !LIVE[p.t];}))return;
  inits.forEach(function(p){p.avg=+(LIVE[p.t]*anchorOffset(p.t)).toFixed(2);delete p.init;});
  var cost=0;PF.pos.forEach(function(p){cost+=p.sh*p.avg;});
  PF.cash=+(START_CAPITAL-cost).toFixed(2);initDone=true;saveState();
}
function refreshHeldPrices(){PF.pos.forEach(function(p){if(!LIVE[p.t]||!HIST[p.t])fetchLive(p.t,function(){anchorInit();renderPortfolio();var jh=document.getElementById('jHold');if(jh&&jh.style.display!=='none')renderHoldings();});});}
function money(n){return '$'+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
function signed(n){return (n>=0?'+':'-')+'$'+Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
function fmtSh(n){n=+n;return Number.isInteger(n)?(''+n):(''+ +n.toFixed(4));}
function totals(){var inv=0,val=0;PF.pos.forEach(function(p){inv+=p.sh*p.avg;val+=p.sh*curPx(p.t);});return {inv:inv,val:val,unreal:val-inv,total:val+PF.cash};}
/* Asset day change from the REAL daily EOD series: latest close vs the prior close.
   Used for the WATCHLIST, where we show the market's move on something you don't own. */
function prevClose(t){var h=HIST[t];if(!h||h.length<2)return null;return h[h.length-2].price;}
function barDate(t){var h=HIST[t];return (h&&h.length)?h[h.length-1].date:null;}
function dayMove(t){var pc=prevClose(t);if(pc==null)return null;var px=curPx(t);return {abs:px-pc,pct:(px/pc-1)*100};}
/* A POSITION's day change must reflect what YOU actually earned today, not the asset's
   raw EOD move. If you opened the position today (p.dt === today's bar) you bought at the
   close, so your basis is your cost (avg) → ~$0 today. Otherwise it's yesterday's close. */
function dayBasis(p){
  var h=HIST[p.t];if(!h||h.length<2)return null;var close=h[h.length-1].price;
  if(p.dt!=null)return p.dt===h[h.length-1].date?p.avg:h[h.length-2].price;
  /* legacy positions (saved before purchase-stamping): if the cost basis is essentially
     today's close, it was opened at this close → basis is your cost, so ~$0 today. */
  if(close&&Math.abs(p.avg-close)/close<0.0008)return p.avg;
  return h[h.length-2].price;
}
function posDayMove(p){var b=dayBasis(p);if(b==null)return null;var px=curPx(p.t);return {abs:p.sh*(px-b),pct:b?(px/b-1)*100:0};}
/* Account-level move today = Σ shares × (today's close − each position's day basis). */
function acctDayMove(){var abs=0,base=0,have=false;PF.pos.forEach(function(p){var b=dayBasis(p);if(b==null)return;have=true;abs+=p.sh*(curPx(p.t)-b);base+=p.sh*b;});return have?{abs:abs,pct:base?abs/base*100:0}:null;}
/* timestamp label for the activity log — real calendar date, not a synthetic day counter */
function nowLabel(){return new Date().toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}

/* ── Watchlist (persisted, live-priced) ─────────────────────────────── */
function inWatch(t){return PF.watch.indexOf(t)>=0;}
function toggleWatch(t,reRenderSF){
  var i=PF.watch.indexOf(t),bn=t.replace('-USD','');
  if(i>=0){PF.watch.splice(i,1);showToast('Removed '+bn+' from watchlist');}
  else{PF.watch.unshift(t);showToast('Added '+bn+' to watchlist ⭐');fetchLive(t,function(){if(jCur==='watch')renderWatch();});}
  saveState();
  if(jCur==='watch')renderWatch();
  if(reRenderSF&&sfCurrent&&sfCurrent.t===t){var b=document.getElementById('sfWatchBtn');if(b)b.outerHTML=watchBtnHtml(t);}
}
function watchBtnHtml(t){var on=inWatch(t);
  return '<button id="sfWatchBtn" class="btn '+(on?'btn-ghost':'btn-pur')+'" onclick="toggleWatch(\''+t+'\',true)">'+(on?'★ On your watchlist · remove':'☆ Add to Watchlist')+'</button>';
}
function renderWatch(){
  var el=document.getElementById('jWatch');if(!el)return;
  if(!PF.watch.length){el.innerHTML='<div class="card"><div class="card-t">Watchlist</div><div class="muted-note" style="text-align:left">Nothing on your watchlist yet. Open any asset in <b>Markets</b> and tap <b>☆ Add to Watchlist</b> to track it here, then trade it in one tap.</div></div>';return;}
  var html='<div class="card"><div class="row" style="margin-bottom:13px"><div class="card-t" style="margin-bottom:0">Watchlist</div><span class="pill pill-pur">'+PF.watch.length+' tracked</span></div>';
  PF.watch.forEach(function(t){
    var a=ASSETS.filter(function(x){return x.t===t;})[0]||{t:t,n:t,c:'stock'},bn=t.replace('-USD',''),px=curPx(t),live=!!LIVE[t],dm=dayMove(t);
    var dc=dm?('<div class="l-c '+(dm.abs>=0?'up':'down')+'">'+(dm.abs>=0?'+':'-')+'$'+Math.abs(dm.abs).toFixed(2)+' ('+(dm.pct>=0?'+':'')+dm.pct.toFixed(2)+'%) today</div>'):'<div class="l-s">'+(live?'':'~ est.')+'</div>';
    html+='<div class="lrow"><div style="display:flex;align-items:center;gap:11px;min-width:0"><div class="tkr-ic">'+bn+'</div><div style="min-width:0"><div class="l-n">'+bn+' <span style="font-size:10px;color:var(--faint);font-weight:700">'+a.c+'</span></div><div class="l-s" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+a.n+'</div></div></div>'
      +'<div style="display:flex;align-items:center;gap:10px"><div class="l-v"><div class="l-p tnum">'+money(px)+'</div>'+dc+'</div>'
      +'<button class="adjust" onclick="watchTrade(\''+t+'\')">Trade</button>'
      +'<button class="adjust" title="Remove" style="padding:6px 9px" onclick="toggleWatch(\''+t+'\')">✕</button></div></div>';
  });
  html+='</div>';
  el.innerHTML=html;
  /* lazily pull real prices for anything we haven't fetched yet */
  PF.watch.forEach(function(t){if(!LIVE[t])fetchLive(t,function(){if(jCur==='watch')renderWatch();});});
}
function watchTrade(t){tradeTicker=t;tradeAction='buy';jTab(document.querySelectorAll('#page-journey .subtab')[1],'trade');}

/* ── Order review → confirm (two-step, like a real broker ticket) ───── */
function reviewTrade(){
  var sh=parseFloat((document.getElementById('tradeSh')||{}).value);
  if(!sh||sh<=0){showToast('Enter how many shares');return;}
  var t=tradeTicker,p=curPx(t),val=sh*p,bn=t.replace('-USD',''),live=!!LIVE[t];
  if(tradeAction==='buy'&&val>PF.cash){showToast('Not enough buying power, you have '+money(PF.cash));return;}
  if(tradeAction==='sell'){var pos=PF.pos.filter(function(x){return x.t===t;})[0];if(!pos||pos.sh<sh){showToast('You only hold '+(pos?fmtSh(pos.sh):0)+' × '+bn);return;}}
  pendingSh=sh;
  var after=tradeAction==='buy'?PF.cash-val:PF.cash+val;
  function r(l,v,c){return '<div class="row" style="margin:0 0 7px"><span style="font-size:12.5px;color:var(--muted);font-weight:600">'+l+'</span><span class="tnum" style="font-weight:800'+(c?';color:'+c:'')+'">'+v+'</span></div>';}
  var h='<div class="pretrade-card"><div class="pretrade-title" style="color:var(--purple-deep);margin-bottom:10px">Review order · '+(tradeAction==='buy'?'Buy':'Sell')+' '+bn+'</div>'
    +r('Order type','Market')
    +r('Shares',fmtSh(sh))
    +r((live?'Last close price':'Est. price'),money(p))
    +r(tradeAction==='buy'?'Estimated cost':'Estimated proceeds',money(val))
    +'<div style="height:1px;background:var(--purple-line);margin:9px 0"></div>'
    +r('Buying power after',money(after),after<0?'var(--red)':'')
    +'<div class="mrow-s" style="margin:8px 0 0">Paper trade · virtual cash. Fills at '+bn+'\'s latest closing price ('+money(p)+'). Real brokers fill market orders at the next available market price.</div></div>';
  h+='<div class="row" style="gap:10px;margin-top:12px"><button class="btn btn-ghost" style="flex:1" onclick="renderTradePanel()">Cancel</button><button class="btn btn-pur" style="flex:1.4" onclick="execTrade()">Confirm '+(tradeAction==='buy'?'buy':'sell')+'</button></div>';
  document.getElementById('tradePanel').innerHTML=h;
}

/* standard-normal sampler, used by the scenario engine */
function gauss(){var u=1-Math.random(),v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function equityChart(hist,w,h,color,labelFn){
  color=color||'#7a5cae';var pad=8,padB=20,padT=10;
  var vals=hist.map(function(p){return p.total;});
  var lf=labelFn||function(p){return 'Day '+(p.day!=null?p.day:p.i);};
  var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),rg=(mx-mn)||1,n=vals.length;
  var sx=(w-pad*2)/Math.max(1,n-1);
  function X(i){return pad+i*sx;}function Y(v){return padT+(h-padT-padB)*(1-(v-mn)/rg);}
  var line=vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' ');
  var ex=X(n-1).toFixed(1),ey=Y(vals[n-1]).toFixed(1),gid='eq'+Math.round(Math.random()*1e6);
  var base=(h-padB).toFixed(1),area=line+' L'+ex+' '+base+' L'+X(0).toFixed(1)+' '+base+' Z';
  var ry=Y(vals[0]).toFixed(1),ref='<line x1="'+pad+'" y1="'+ry+'" x2="'+(w-pad)+'" y2="'+ry+'" stroke="'+color+'" stroke-width="1" stroke-dasharray="2 4" opacity="0.4"/>';
  var lab='';[0,Math.floor((n-1)/2),n-1].forEach(function(i,k){var gx=X(i).toFixed(1);lab+='<text x="'+gx+'" y="'+(h-6)+'" font-size="9" fill="#aaa4c0" font-weight="700" text-anchor="'+(k===0?'start':(k===2?'end':'middle'))+'">'+lf(hist[i])+'</text>';});
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block">'
    +'<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity="0.16"/><stop offset="0.92" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'
    +ref+'<path d="'+area+'" fill="url(#'+gid+')"/>'
    +'<path d="'+line+'" fill="none" stroke="'+color+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
    +lab+'<circle cx="'+ex+'" cy="'+ey+'" r="3.5" fill="'+color+'" stroke="#fff" stroke-width="1.6"/></svg>';
}
/* ── Real paper-trading portfolio history ──────────────────────────────
   Reconstructs the portfolio's value over the last N real trading days from
   each holding's real daily closes (HIST), so the Practice chart reflects
   actual market moves. Falls back to a flat line at the live total offline. */
function fmtDate(s){if(!s)return '';var d=new Date(s);return isNaN(d)?s:d.toLocaleDateString(undefined,{month:'short',day:'numeric'});}
function pxOnOrBefore(h,date){var px=h[0].price;for(var i=0;i<h.length;i++){if(h[i].date<=date)px=h[i].price;else break;}return px;}
/* Full real portfolio value series over EVERY available trading day (≈1y from the backend),
   valuing the CURRENT basket back through each day's real closes. Ranges slice this. */
function portfolioSeriesFull(){
  var T=totals();
  var withHist=PF.pos.map(function(p){return {p:p,h:HIST[p.t]};}).filter(function(x){return x.h&&x.h.length;});
  if(!withHist.length){return [{date:'',total:+T.total.toFixed(2)},{date:'',total:+T.total.toFixed(2)}];}
  var axis=withHist.reduce(function(a,b){return b.h.length>a.h.length?b:a;}).h.map(function(r){return r.date;});
  var noHist=PF.pos.filter(function(p){return !(HIST[p.t]&&HIST[p.t].length);});
  var series=axis.map(function(date){
    var val=PF.cash;
    withHist.forEach(function(x){val+=x.p.sh*pxOnOrBefore(x.h,date);});
    noHist.forEach(function(p){val+=p.sh*curPx(p.t);});/* assets without history held flat at live price */
    return {date:date,total:+val.toFixed(2)};
  });
  if(series.length)series[series.length-1].total=+T.total.toFixed(2);/* pin the last point to the live total */
  return series;
}
function portfolioHistory(N){var s=portfolioSeriesFull();return (N&&N<s.length)?s.slice(-N):s;}
/* Slice the full series to a range by real calendar date. 1D = last two closes (EOD data has no intraday). */
function rangeWindow(full,r){
  if(full.length<2||!full[full.length-1].date)return full;
  if(r==='1D')return full.slice(-2);
  var last=new Date(full[full.length-1].date);if(isNaN(last))return full;
  var from=new Date(last);
  if(r==='1W')from.setDate(from.getDate()-7);
  else if(r==='1M')from.setMonth(from.getMonth()-1);
  else if(r==='6M')from.setMonth(from.getMonth()-6);
  else if(r==='YTD')from=new Date(last.getFullYear(),0,1);
  else return full;/* ALL */
  var fromS=from.getFullYear()+'-'+('0'+(from.getMonth()+1)).slice(-2)+'-'+('0'+from.getDate()).slice(-2);
  var out=full.filter(function(pt){return pt.date>=fromS;});
  return out.length>=2?out:full.slice(-2);
}
function rangeName(r){return {'1D':'today','1W':'past week','1M':'past month','6M':'past 6 months','YTD':'year to date','ALL':'all time'}[r]||r;}
function renderPortfolioChart(){
  var c=document.getElementById('journeyChart');if(!c)return;
  var win=rangeWindow(portfolioSeriesFull(),pfRange);
  c.innerHTML=equityChart(win,300,150,'#7a5cae',function(p){return fmtDate(p.date);});
  var lab=document.getElementById('pfRangeChg');if(!lab)return;
  if(win.length>=2&&win[0].date){var a=win[0].total,b=win[win.length-1].total,d=b-a,pct=a?d/a*100:0;
    lab.innerHTML='· <span class="'+(d>=0?'up':'down')+'">'+(d>=0?'+':'-')+'$'+Math.abs(d).toFixed(2)+' ('+(d>=0?'+':'')+pct.toFixed(2)+'%)</span> '+rangeName(pfRange);
  }else lab.textContent='· '+rangeName(pfRange);
}

