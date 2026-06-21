/* ── Stock Finder · 56 assets + live forecast ── */
var ASSETS=[
  {t:'AAPL',n:'Apple',c:'stock'},{t:'AMD',n:'Advanced Micro Devices',c:'stock'},{t:'AMZN',n:'Amazon',c:'stock'},{t:'BAC',n:'Bank of America',c:'stock'},{t:'COST',n:'Costco',c:'stock'},{t:'CRM',n:'Salesforce',c:'stock'},{t:'DIS',n:'Walt Disney',c:'stock'},{t:'GOOGL',n:'Alphabet',c:'stock'},{t:'HD',n:'Home Depot',c:'stock'},{t:'JNJ',n:'Johnson & Johnson',c:'stock'},{t:'JPM',n:'JPMorgan Chase',c:'stock'},{t:'KO',n:'Coca-Cola',c:'stock'},{t:'MA',n:'Mastercard',c:'stock'},{t:'META',n:'Meta Platforms',c:'stock'},{t:'MSFT',n:'Microsoft',c:'stock'},{t:'NFLX',n:'Netflix',c:'stock'},{t:'NVDA',n:'NVIDIA',c:'stock'},{t:'ORCL',n:'Oracle',c:'stock'},{t:'PFE',n:'Pfizer',c:'stock'},{t:'PG',n:'Procter & Gamble',c:'stock'},{t:'TSLA',n:'Tesla',c:'stock'},{t:'UNH',n:'UnitedHealth',c:'stock'},{t:'V',n:'Visa',c:'stock'},{t:'WMT',n:'Walmart',c:'stock'},{t:'XOM',n:'Exxon Mobil',c:'stock'},
  {t:'BND',n:'Vanguard Total Bond',c:'etf'},{t:'DIA',n:'Dow Jones ETF',c:'etf'},{t:'EEM',n:'MSCI Emerging Markets',c:'etf'},{t:'EFA',n:'MSCI EAFE',c:'etf'},{t:'EWC',n:'MSCI Canada',c:'etf'},{t:'GLD',n:'SPDR Gold Shares',c:'etf'},{t:'HYG',n:'High Yield Corp Bond',c:'etf'},{t:'IWM',n:'Russell 2000',c:'etf'},{t:'LQD',n:'Investment Grade Bond',c:'etf'},{t:'QQQ',n:'Invesco QQQ',c:'etf'},{t:'SLV',n:'iShares Silver',c:'etf'},{t:'SPY',n:'SPDR S&P 500',c:'etf'},{t:'TLT',n:'20+ Year Treasury',c:'etf'},{t:'VNQ',n:'Vanguard Real Estate',c:'etf'},{t:'VTI',n:'Total Stock Market',c:'etf'},{t:'XLE',n:'Energy Sector',c:'etf'},{t:'XLF',n:'Financial Sector',c:'etf'},{t:'XLK',n:'Technology Sector',c:'etf'},{t:'XLP',n:'Consumer Staples',c:'etf'},{t:'XLV',n:'Health Care Sector',c:'etf'},{t:'XLY',n:'Consumer Discretionary',c:'etf'},
  {t:'ADA-USD',n:'Cardano',c:'crypto'},{t:'AVAX-USD',n:'Avalanche',c:'crypto'},{t:'BNB-USD',n:'BNB',c:'crypto'},{t:'BTC-USD',n:'Bitcoin',c:'crypto'},{t:'DOGE-USD',n:'Dogecoin',c:'crypto'},{t:'DOT-USD',n:'Polkadot',c:'crypto'},{t:'ETH-USD',n:'Ethereum',c:'crypto'},{t:'LTC-USD',n:'Litecoin',c:'crypto'},{t:'SOL-USD',n:'Solana',c:'crypto'},{t:'XRP-USD',n:'XRP',c:'crypto'}
];
var sfCurrent=null,sfHorizon=90,SF_CACHE={},PROFILE_CACHE={},sfShowNumbers=false;
function sfFilter(){
  var q=document.getElementById('sfSearch').value.trim().toLowerCase(),res=document.getElementById('sfResults');
  var list=ASSETS.filter(function(a){return !q||a.t.toLowerCase().indexOf(q)>=0||a.n.toLowerCase().indexOf(q)>=0;});
  res.style.display='block';
  if(!list.length){res.innerHTML='<div class="sf-item"><span class="l-s">No assets match “'+q+'”</span></div>';return;}
  res.innerHTML=list.map(function(a){return '<div class="sf-item" onclick="sfSelect(\''+a.t+'\')"><div class="tkr-ic">'+a.t.replace('-USD','')+'</div><div style="min-width:0"><div class="l-n">'+a.n+'</div><div class="l-s">'+a.t+'</div></div><span class="sf-cls '+a.c+'">'+a.c+'</span></div>';}).join('');
}
function sfSelect(t){
  var a=ASSETS.filter(function(x){return x.t===t;})[0];if(!a)return;
  document.getElementById('sfResults').style.display='none';
  var inp=document.getElementById('sfSearch');inp.value='';inp.blur();
  sfCurrent=a;renderSFLoading(a);loadSF();
}
function setHorizon(h){sfHorizon=h;renderSFLoading(sfCurrent);loadSF();}
function renderSFLoading(a){
  document.getElementById('sfDetail').innerHTML='<div class="card"><div class="row" style="margin-bottom:6px"><div><div style="font-size:18px;font-weight:800">'+a.t.replace('-USD','')+'</div><div class="l-s">'+a.n+'</div></div><span class="sf-cls '+a.c+'">'+a.c+'</span></div><div class="muted-note" style="text-align:left;padding:22px 0">Loading live forecast… first load can take a few seconds if the server is waking up.</div></div>';
}
function loadSF(){
  var a=sfCurrent;if(!a)return;var key=a.t+'_'+sfHorizon;
  var pf=SF_CACHE[key]?Promise.resolve(SF_CACHE[key]):wakeFetch(API+'/api/forecasts/ticker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticker:a.t,horizon_days:sfHorizon})});
  var pp=PROFILE_CACHE[a.t]?Promise.resolve(PROFILE_CACHE[a.t]):fetch(API+'/api/tickers/'+a.t+'/profile').then(function(r){return r.json();}).catch(function(){return null;});
  Promise.all([pf,pp]).then(function(res){
    var d=res[0],p=res[1];if(!d||!d.forecast_paths)throw 0;
    SF_CACHE[key]=d;if(p&&p.fields)PROFILE_CACHE[a.t]=p;
    if(sfCurrent&&sfCurrent.t===a.t)paintSF(a,d,PROFILE_CACHE[a.t]);
  }).catch(function(){
    if(sfCurrent&&sfCurrent.t===a.t)document.getElementById('sfDetail').innerHTML='<div class="card"><div class="muted-note" style="text-align:left">Couldn\'t reach the forecast server for '+a.t+', it may be asleep.</div><button class="btn btn-soft" style="margin-top:11px" onclick="loadSF()">Retry</button></div>';
  });
}
function sfMoney(n){return n>=1000?'$'+n.toLocaleString(undefined,{maximumFractionDigits:0}):(n>=1?'$'+n.toFixed(2):'$'+n.toFixed(4));}
function fmtCap(n){if(!n)return 'n/a';if(n>=1e12)return '$'+(n/1e12).toFixed(2)+'T';if(n>=1e9)return '$'+(n/1e9).toFixed(2)+'B';if(n>=1e6)return '$'+(n/1e6).toFixed(2)+'M';return '$'+n.toFixed(0);}
function fmtVol(n){if(!n)return 'n/a';if(n>=1e9)return (n/1e9).toFixed(2)+'B';if(n>=1e6)return (n/1e6).toFixed(2)+'M';if(n>=1e3)return (n/1e3).toFixed(1)+'K';return ''+n;}
/* Forecast fan chart — wears the same skin as the Practice/Home charts: a purple
 * line with the app's signature gradient fill under the real history, then a soft
 * purple confidence band fanning out from "now" with a dashed most-likely (purple,
 * the thread continues), an upside edge (green = the app's gain colour) and a
 * downside edge (red = the app's loss colour). Padded + labelled like equityChart. */
function forecastChart(hist,bear,base,bull,w,h){
  var pad=8,padT=10,padB=20,nH=hist.length,nF=base.length,all=hist.concat(bear,base,bull);
  var mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),rg=(mx-mn)||1;
  var stepX=(w-pad*2)/(nH+nF-1);
  function X(i){return pad+i*stepX;}function Y(v){return padT+(h-padT-padB)*(1-(v-mn)/rg);}
  function path(arr,s){return arr.map(function(v,i){return (i?'L':'M')+X(s+i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' ');}
  var s=nH-1,histP=path(hist,0),bearP=path(bear,s),baseP=path(base,s),bullP=path(bull,s);
  // confidence band, upside edge down to downside edge
  var band='M'+X(s).toFixed(1)+' '+Y(bull[0]).toFixed(1);
  for(var i=1;i<bull.length;i++)band+=' L'+X(s+i).toFixed(1)+' '+Y(bull[i]).toFixed(1);
  for(var j=bear.length-1;j>=0;j--)band+=' L'+X(s+j).toFixed(1)+' '+Y(bear[j]).toFixed(1);
  band+=' Z';
  // gradient area fill beneath the real history (the app's signature look)
  var baseY=(h-padB).toFixed(1),tx=X(s).toFixed(1),gid='fc'+Math.round(Math.random()*1e6);
  var histArea=histP+' L'+tx+' '+baseY+' L'+X(0).toFixed(1)+' '+baseY+' Z';
  function dot(arr,col){return '<circle cx="'+X(nH+arr.length-2).toFixed(1)+'" cy="'+Y(arr[arr.length-1]).toFixed(1)+'" r="3.5" fill="'+col+'" stroke="#fff" stroke-width="1.6"/>';}
  function tick(x,a,t){return '<text x="'+x+'" y="'+(h-6)+'" font-size="9" fill="#aaa4c0" font-weight="700" text-anchor="'+a+'">'+t+'</text>';}
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block">'
    +'<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5cae" stop-opacity="0.16"/><stop offset="0.92" stop-color="#7a5cae" stop-opacity="0"/></linearGradient></defs>'
    +'<path d="'+band+'" fill="rgba(122,92,174,.10)"/>'
    +'<path d="'+histArea+'" fill="url(#'+gid+')"/>'
    +'<line x1="'+tx+'" y1="'+padT+'" x2="'+tx+'" y2="'+baseY+'" stroke="#cdc4e4" stroke-width="1" stroke-dasharray="2 4" opacity="0.8"/>'
    +'<path d="'+histP+'" fill="none" stroke="#7a5cae" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'
    +'<path d="'+baseP+'" fill="none" stroke="#7a5cae" stroke-width="1.9" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
    +'<path d="'+bullP+'" fill="none" stroke="#4f9c7e" stroke-width="1.7" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
    +'<path d="'+bearP+'" fill="none" stroke="#cf5a40" stroke-width="1.7" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
    +dot(bear,'#cf5a40')+dot(bull,'#4f9c7e')+dot(base,'#7a5cae')
    +tick(X(0).toFixed(1),'start','past')+tick(tx,'middle','now')+tick(X(nH+nF-2).toFixed(1),'end','ahead')
    +'</svg>';
}
function hWords(h){return h>=365?'year':(h>=180?'6 months':(h>=90?'3 months':h+' days'));}
function hChipLabel(h){return h>=365?'1 year':(h>=180?'6 months':'3 months');}
function bouncyWord(v){return v<18?'fairly steady':(v<35?'moderately bouncy':(v<60?'quite bouncy':'very bouncy'));}
function classContext(c,v){if(c==='crypto')return 'Big swings like this are normal for crypto.';if(c==='etf')return 'ETFs usually ride more gently than single stocks.';return v<25?"That's fairly calm for a single stock.":"That's pretty normal for a single stock.";}
function toggleSFNumbers(){sfShowNumbers=!sfShowNumbers;var el=document.getElementById('sfNumbers'),b=document.getElementById('sfNumBtn');if(el)el.style.display=sfShowNumbers?'block':'none';if(b)b.textContent=sfShowNumbers?'Hide the numbers ▴':'See all the numbers ▾';}
function paintSF(a,d,p){
  var nH=Math.min(90,d.historical_prices.length);
  var hist=d.historical_prices.slice(-nH).map(function(x){return x.price;});
  var bear=d.forecast_paths.bear.map(function(x){return x.price;}),base=d.forecast_paths.base.map(function(x){return x.price;}),bull=d.forecast_paths.bull.map(function(x){return x.price;});
  var rm=d.risk_metrics||{},lit=d.literacy||{},dq=d.data_quality||{},fc=d.forecast_change||{},pf=(p&&p.fields)||{};
  var H=d.horizon_days||sfHorizon,bn=a.t.replace('-USD','');
  var volPct=(rm.annualized_volatility||0)*100,ddPct=(rm.max_historical_drawdown||0)*100,conf=Math.round(d.confidence*100);
  function pc(v){return (v>=0?'+':'')+(v*100).toFixed(1)+'%';}
  var hChips=[90,180,365].map(function(h){return '<div class="hz '+(sfHorizon===h?'on':'')+'" onclick="setHorizon('+h+')">'+hChipLabel(h)+'</div>';}).join('');
  var html='<div class="sf-grid"><div class="sf-col-main">';
  // chart + header
  html+='<div class="card">'
    +'<div class="row" style="margin-bottom:11px"><div><div style="font-size:19px;font-weight:800">'+bn+'</div><div class="l-s">'+a.n+(pf.sector?' · '+pf.sector:'')+'</div></div><div style="text-align:right"><div style="font-size:18px;font-weight:800" class="tnum">'+sfMoney(d.latest_price)+'</div><span class="sf-cls '+a.c+'">'+a.c+'</span></div></div>'
    +'<div class="hz-row">'+hChips+'<span style="margin-left:auto;font-size:11px;color:var(--muted);font-weight:600">next '+hWords(H)+'</span></div>'
    +'<div id="sfChart">'+forecastChart(hist,bear,base,bull,300,152)+'</div>'
    +'<div class="sf-legend"><span><i style="background:#7a5cae"></i>Past &amp; most likely</span><span><i style="background:#4f9c7e"></i>If it goes well</span><span><i style="background:#cf5a40"></i>If it goes poorly</span><span style="color:var(--faint)">┊ now</span></div>'
    +'</div>';
  // Mia verdict, the gist in plain words
  html+='<div class="mia"><div class="face">'+avatar()+'</div><div><div class="bubble">Nobody can predict this, but over the next <b>'+hWords(H)+'</b>, '+bn+' could realistically land anywhere from ~'+sfMoney(d.target_prices.bear)+' to ~'+sfMoney(d.target_prices.bull)+', most likely near <b>'+sfMoney(d.target_prices.base)+'</b> ('+pc(d.returns.base)+').</div><button class="whats" onclick="openSheet(\'Why three numbers?\',\''+(lit.bear_base_bull||'Bear, base and bull are scenario ranges, not guaranteed prices.').replace(/'/g,"\\'")+'\')"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3 2.4c-.8.3-1 .9-1 1.6"/><line x1="12" y1="17" x2="12" y2="17"/></svg>Why three numbers?</button></div></div>';
  // scenario cards with plain micro-labels
  html+='<div class="card"><div class="scn3">'
    +'<div class="c bear"><div class="l">Rough case</div><div class="v">'+sfMoney(d.target_prices.bear)+'</div><div class="p">'+pc(d.returns.bear)+'</div></div>'
    +'<div class="c base"><div class="l">Most likely</div><div class="v">'+sfMoney(d.target_prices.base)+'</div><div class="p">'+pc(d.returns.base)+'</div></div>'
    +'<div class="c bull"><div class="l">Strong case</div><div class="v">'+sfMoney(d.target_prices.bull)+'</div><div class="p">'+pc(d.returns.bull)+'</div></div>'
    +'</div></div>';
  // one teaching point (risk, plain)
  html+='<div class="teach"><div class="teach-ic">💡</div><div><b>'+bn+'</b> is '+bouncyWord(volPct)+', its price can swing about <b>'+volPct.toFixed(0)+'%</b> in a year. '+classContext(a.c,volPct)+'</div></div>';
  // collapsible: all the numbers — lives in the side column
  html+='</div><div class="sf-col-side">';
  html+='<button class="sf-toggle" id="sfNumBtn" onclick="toggleSFNumbers()">'+(sfShowNumbers?'Hide the numbers ▴':'See all the numbers ▾')+'</button>';
  html+='<div id="sfNumbers" style="display:'+(sfShowNumbers?'block':'none')+'">';
  function mrow(name,val,sent){return '<div class="mrow"><div class="row"><span class="mrow-n">'+name+'</span><span class="mrow-v tnum">'+val+'</span></div><div class="mrow-s">'+sent+'</div></div>';}
  html+='<div class="card"><div class="row" style="margin-bottom:11px"><div class="card-t" style="margin-bottom:0">The numbers, explained</div><span class="pill pill-grn">&#9679; Live</span></div>'
    +mrow('Most-likely value','<span class="up">'+sfMoney(d.target_prices.base)+'</span>','The middle-of-the-road estimate for '+bn+' in '+hWords(H)+' ('+pc(d.returns.base)+').')
    +mrow('Bounciness (volatility)',volPct.toFixed(1)+'%','How much the price moves around. It has swung about '+volPct.toFixed(0)+'% up or down over a year.')
    +mrow('Worst drop','-'+ddPct.toFixed(0)+'%','The biggest fall from a recent high. Holding through it, your money dipped about '+ddPct.toFixed(0)+'% before recovering.')
    +mrow('Data quality',conf+'% · '+d.confidence_label,'How clean and steady the recent data is. Even with great data, nobody can predict the exact price, only a likely range.')
    +mrow('Risk level',d.risk_label,'A plain rating of how much this could swing, currently '+(d.risk_label||'').toLowerCase()+'.')
    +'</div>';
  var since=(fc&&fc.available&&fc.previous_as_of)?('Barely moved since '+fc.previous_as_of+' (base '+(fc.base_return_delta>=0?'+':'')+(fc.base_return_delta*100).toFixed(2)+'%).'):'';
  html+='<div class="card"><div class="card-t">Where this data comes from</div><div style="display:flex;gap:7px;flex-wrap:wrap'+(since?';margin-bottom:9px':'')+'"><span class="pill pill-grn">'+(dq.freshness_label||'Fresh')+'</span><span class="pill pill-pur">Daily snapshot</span><span class="pill pill-gry">'+(d.data_as_of||dq.as_of_date||'')+'</span></div>'+(since?'<div class="mrow-s" style="margin:0">'+since+'</div>':'')+'</div>';
  if(pf.last_sale||pf.market_cap){
    function r(l,v){return '<div class="lrow"><span class="l-s">'+l+'</span><span style="font-weight:800;font-size:13px" class="tnum">'+v+'</span></div>';}
    html+='<div class="card"><div class="card-t">Company snapshot</div>'
      +(pf.last_sale?r('Last price','$'+pf.last_sale.toFixed(2)):'')+(pf.market_cap?r('Company size',fmtCap(pf.market_cap)):'')
      +(pf.pe_ratio?r('P/E ratio',pf.pe_ratio.toFixed(2)):'')
      +(pf.fifty_two_week_high?r('52-week high','$'+pf.fifty_two_week_high.toFixed(2)):'')+(pf.fifty_two_week_low?r('52-week low','$'+pf.fifty_two_week_low.toFixed(2)):'')
      +(pf.volume?r('Traded today',fmtVol(pf.volume)+' sh'):'')+(pf.exchange?r('Exchange',pf.exchange):'')
      +'</div>';
  }
  html+='</div>';
  // about (brief)
  var about=(pf.sector?bn+' is a '+a.c+' in the '+pf.sector+' sector'+(pf.industry?' ('+pf.industry+')':'')+'. ':'')+(d.plain_language||'');
  html+='<div class="card"><div class="card-t">About '+bn+'</div><div style="font-size:13px;color:var(--muted);line-height:1.6">'+about+' <span style="font-size:11px">These are model estimates for learning, not advice. Data as of '+(d.data_as_of||dq.as_of_date||'')+'.</span></div></div>';
  html+=watchBtnHtml(a.t);
  html+='</div></div>';
  document.getElementById('sfDetail').innerHTML=html;
}

/* ── Forecast ────────────────────────────────── */
function pickFc(el){document.querySelectorAll('#page-tools .tchip').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');renderFc(el.dataset.t);}
function scenGrid(bear,base,bull){
  return '<div class="scen-grid">'
    +'<div class="scen bear"><div class="sl">Rough case</div><div class="sp">'+bear[0]+'</div><div class="sr">'+bear[1]+'</div></div>'
    +'<div class="scen base"><div class="sl">Most likely</div><div class="sp">'+base[0]+'</div><div class="sr">'+base[1]+'</div></div>'
    +'<div class="scen bull"><div class="sl">Strong case</div><div class="sp">'+bull[0]+'</div><div class="sr">'+bull[1]+'</div></div></div>';
}
function renderFc(t){
  fcCurrent=t;
  var d=FC[t];
  document.getElementById('fcScen').innerHTML=scenGrid(d.bear,d.base,d.bull)
    +'<div class="row" style="margin-top:11px"><span id="fcStatus" style="font-size:11px;color:var(--muted);font-weight:700">Updating…</span></div>';
  document.getElementById('fcTip').innerHTML='Nobody can predict <b>'+t+'</b>, so here\'s the <b>range</b>: a rough case, the most-likely middle, and a strong case. Plan around the middle.';
  loadForecast(t);
}

