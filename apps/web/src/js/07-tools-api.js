/* ── Live data wiring (real backend, mock fallback) ── */
var API='https://foresight-backend-a5qx.onrender.com';
function fmtNum(n){return n>=1000?n.toLocaleString(undefined,{maximumFractionDigits:2}):n.toFixed(2);}
var fcCurrent='';

/* ── Last-good price cache ────────────────────────────────────────────
 * The backend sleeps on the free tier, so first-open used to mean "Sample"
 * data for up to ~90s. Every successful fetch now writes LIVE prices, the
 * forecast returns, daily HIST series (held/watched tickers only, to stay
 * well under the localStorage quota) and the market-indices payload to
 * localStorage; on boot we hydrate from it, so a returning user sees real
 * last-close numbers instantly while the server wakes. Ignored after 7 days
 * — at that point honest "Sample" beats stale realism. */
var PRICE_CACHE_KEY='fiscally.web.prices.v1',PRICE_CACHE={IDX:null};
(function hydratePriceCache(){
  try{
    var c=JSON.parse(localStorage.getItem(PRICE_CACHE_KEY)||'null');
    if(!c||!c.ts||Date.now()-c.ts>7*86400000)return;
    var t;for(t in c.LIVE||{})if(LIVE[t]==null)LIVE[t]=c.LIVE[t];
    for(t in c.FC||{})if(TRADE_FC[t]==null)TRADE_FC[t]=c.FC[t];
    for(t in c.HIST||{})if(HIST[t]==null)HIST[t]=c.HIST[t];
    PRICE_CACHE.IDX=c.IDX||null;
  }catch(e){}
})();
function savePriceCache(){
  try{
    var keep={};/* HIST only for tickers that matter to this user — LIVE/FC are tiny, keep all */
    PF.pos.forEach(function(p){keep[p.t]=1;});(PF.watch||[]).forEach(function(t){keep[t]=1;});
    keep[tradeTicker]=1;keep.AAPL=1;
    var histLite={};for(var t in keep)if(HIST[t])histLite[t]=HIST[t];
    localStorage.setItem(PRICE_CACHE_KEY,JSON.stringify({ts:Date.now(),LIVE:LIVE,FC:TRADE_FC,HIST:histLite,IDX:PRICE_CACHE.IDX}));
  }catch(e){}
}
/* Cold-start-aware fetch: Render's free tier sleeps and takes ~40s to wake, so early
   requests fail (502 or timeout). Keep retrying for a time budget that outlasts the wake,
   instead of silently leaving the mock "Sample" data on the first failed request. */
function wakeFetch(url,opts,onWaking){
  var BUDGET=90000,perTimeout=12000,start=Date.now();
  function attempt(i){
    var ctl=new AbortController(),to=setTimeout(function(){ctl.abort();},perTimeout);
    var o=opts?Object.assign({},opts):{};o.signal=ctl.signal;
    return fetch(url,o).then(function(r){clearTimeout(to);if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
      .catch(function(err){
        clearTimeout(to);
        if(Date.now()-start>=BUDGET)throw err;
        if(onWaking)onWaking(i+1);
        return new Promise(function(res){setTimeout(res,i===0?2000:6000);}).then(function(){return attempt(i+1);});
      });
  }
  return attempt(0);
}
function setMarketPill(text,cls){var b=document.getElementById('marketSrc');if(b){b.textContent=text;b.className='pill '+cls;}}
function renderIndexRows(d){
  var proxy={SP500:'SPY',NASDAQ:'QQQ',DOW:'DIA',TSX:'EWC'};
  document.getElementById('marketRows').innerHTML=d.indices.map(function(ix){
    var pct=ix.change_percent*100,cls=pct>=0?'up':'down',sg=pct>=0?'+':'';
    return '<div class="lrow"><div><div class="l-n">'+ix.label+'</div><div class="l-s">'+(proxy[ix.symbol]||'')+' · '+ix.provider_symbol+'</div></div>'
      +'<div class="l-v"><div class="l-p tnum">'+fmtNum(ix.value)+'</div><div class="l-c '+cls+'">'+sg+pct.toFixed(2)+'%</div></div></div>';
  }).join('');
}
function loadIndices(){
  /* cached last-close beats the "Sample" placeholder while the server wakes */
  var cached=PRICE_CACHE.IDX&&PRICE_CACHE.IDX.indices&&PRICE_CACHE.IDX.indices.length?PRICE_CACHE.IDX:null;
  if(cached){renderIndexRows(cached);setMarketPill('Last close · cached','pill-gry');}
  else setMarketPill('Loading…','pill-gry');
  wakeFetch(API+'/api/market/indices',null,function(){if(!cached)setMarketPill('Waking server…','pill-gry');}).then(function(d){
    if(!d||!d.indices||!d.indices.length){if(!cached)setMarketPill('Sample','pill-gry');return;}
    renderIndexRows(d);
    setMarketPill('● Live','pill-grn');
    PRICE_CACHE.IDX=d;savePriceCache();
  }).catch(function(){setMarketPill(cached?'Last close · offline':'Sample · offline','pill-gry');});
}
function loadForecast(t){
  var map={BTC:'BTC-USD',ETH:'ETH-USD'},sym=map[t]||t;
  function st(){return document.getElementById('fcStatus');}
  wakeFetch(API+'/api/forecasts/ticker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticker:sym,horizon_days:90})},function(){var s=st();if(s)s.textContent='Waking server…';})
   .then(function(d){
     if(fcCurrent!==t)return;
     if(!d||!d.target_prices)throw 0;
     var tp=d.target_prices,rt=d.returns;
     function money(v){return v>=1000?'$'+(v/1000).toFixed(1)+'K':'$'+v.toFixed(0);}
     function pc(v){return (v>=0?'+':'')+(v*100).toFixed(0)+'%';}
     document.getElementById('fcScen').innerHTML=scenGrid([money(tp.bear),pc(rt.bear)],[money(tp.base),pc(rt.base)],[money(tp.bull),pc(rt.bull)])
       +'<div class="row" style="margin-top:12px"><span style="font-size:11px;color:var(--muted);font-weight:700">Bounciness: '+d.risk_label+' · a range, not a promise</span><span class="pill pill-grn">● Live</span></div>';
     if(d.plain_language)document.getElementById('fcTip').innerHTML=d.plain_language;
   }).catch(function(){
     if(fcCurrent!==t)return;
     var s=st();if(s)s.innerHTML='Showing sample numbers, <a href="#" onclick="renderFc(\''+t+'\');return false;" style="color:#8b7cba;font-weight:800;text-decoration:none">retry</a>';
   });
}

/* ── Compound calculator math (page + renderer live in 09-tools-games.js) ── */
function fv(m,yrs,annual){var r=(annual==null?0.07:annual)/12,n=yrs*12;return r===0?m*n:m*((Math.pow(1+r,n)-1)/r);}

/* ── Risk gauge ──────────────────────────────── */
function onRisk(v){
  renderGauge(+v);
  var pct=(3+v/100*9).toFixed(1);
  var ret=Math.round(30+v/100*270);
  document.getElementById('riskPct').textContent=pct+'%';
  document.getElementById('riskRate').textContent=pct+'%';
  document.getElementById('riskReturn').textContent='+$'+ret;
  var tip;
  if(v<33)tip='A <b>Low</b> risk plan grows slowly but steadily, your money rarely dips. Great for short-term goals.';
  else if(v<70)tip='A <b>Medium</b> risk plan balances growth and safety. Expect some bumps, but stronger long-run returns.';
  else tip='A <b>High</b> risk plan can grow fast, but can also drop sharply. Best when you won\'t need the money for years.';
  document.getElementById('riskTip').innerHTML=tip;
}

/* Legacy fake "Speed Up" removed — Scenarios now run on the real portfolio (see scenario engine above). */

/* ── Bottom sheet (What's That?) ─────────────── */
var seen={};
function openTip(k){
  var g=GLOSS[k];if(!g)return;
  document.getElementById('sheetTerm').textContent=g.t;
  document.getElementById('sheetDef').textContent=g.d;
  document.getElementById('sheetOv').classList.add('open');
  if(!seen[k]){seen[k]=1;var n=Object.keys(seen).length;var cc=document.getElementById('conceptCount');if(cc)cc.textContent=n+' explored';saveState();}
}
function closeTip(e){if(e.target===document.getElementById('sheetOv'))closeTipBtn();}
function closeTipBtn(){document.getElementById('sheetOv').classList.remove('open');}

/* ── Toast ───────────────────────────────────── */
var tt;
function showToast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show');},2600);}

