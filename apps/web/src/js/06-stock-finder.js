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
  document.getElementById('sfDetail').innerHTML='<div class="card"><div class="row" style="margin-bottom:8px"><div><div style="font-size:18px;font-weight:800">'+a.t.replace('-USD','')+'</div><div class="l-s">'+a.n+'</div></div><span class="sf-cls '+a.c+'">'+a.c+'</span></div><div class="muted-note" style="text-align:left;padding:24px 0">Loading live forecast… first load can take a few seconds if the server is waking up.</div></div>';
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
    if(sfCurrent&&sfCurrent.t===a.t)document.getElementById('sfDetail').innerHTML='<div class="card"><div class="muted-note" style="text-align:left">Couldn\'t reach the forecast server for '+a.t+', it may be asleep.</div><button class="btn btn-soft" style="margin-top:12px" onclick="loadSF()">Retry</button></div>';
  });
}
function sfMoney(n){return n>=1000?'$'+n.toLocaleString(undefined,{maximumFractionDigits:0}):(n>=1?'$'+n.toFixed(2):'$'+n.toFixed(4));}
function fmtCap(n){if(!n)return 'n/a';if(n>=1e12)return '$'+(n/1e12).toFixed(2)+'T';if(n>=1e9)return '$'+(n/1e9).toFixed(2)+'B';if(n>=1e6)return '$'+(n/1e6).toFixed(2)+'M';return '$'+n.toFixed(0);}
function fmtVol(n){if(!n)return 'n/a';if(n>=1e9)return (n/1e9).toFixed(2)+'B';if(n>=1e6)return (n/1e6).toFixed(2)+'M';if(n>=1e3)return (n/1e3).toFixed(1)+'K';return ''+n;}
function addDaysISO(iso,days){var p=(''+iso).slice(0,10).split('-');if(p.length<3)return iso||'';var d=new Date(+p[0],(+p[1])-1,+p[2]);if(isNaN(d))return iso||'';d.setDate(d.getDate()+Math.round(days));return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
/* Forecast fan chart — wears the same skin as the Practice/Home charts (purple line +
 * gradient fill under the real history) plus a soft purple confidence band fanning out
 * from "now": dashed most-likely (purple), upside edge (green = gain), downside edge
 * (red = loss). Driven by the shared interactiveChart engine, so it hovers, zooms (scroll/
 * pinch), pans (drag) and resets (double-click). Combined index space: history 0..nH-1,
 * forecast continues from the seam s=nH-1. */
function renderForecastChart(id,hist,bear,base,bull,histDates,fcDates){
  var nH=hist.length,nF=base.length,s=nH-1,n=nH+nF-1;
  function dateAt(i){return i<s?(histDates[i]||''):(fcDates[i-s]||'');}
  var cfg={w:300,h:152,maxMarkers:3,view:{lo:0,hi:n-1,n:n},
    yRange:function(v){
      var lo=Math.max(0,Math.floor(v.lo)),hi=Math.min(n-1,Math.ceil(v.hi)),mn=Infinity,mx=-Infinity;
      for(var i=lo;i<=hi;i++){
        if(i<nH){if(hist[i]<mn)mn=hist[i];if(hist[i]>mx)mx=hist[i];}
        if(i>=s){var fi=i-s;[bull[fi],base[fi],bear[fi]].forEach(function(x){if(x<mn)mn=x;if(x>mx)mx=x;});}
      }
      if(!isFinite(mn)){mn=0;mx=1;}if(mn===mx){mx=mn+1;}
      var p=(mx-mn)*0.08;return [mn-p,mx+p];
    },
    draw:function(X,Y,v,baseY){
      function pathArr(arr,off){return arr.map(function(val,i){return (i?'L':'M')+X(off+i).toFixed(1)+' '+Y(val).toFixed(1);}).join(' ');}
      var histP=pathArr(hist,0),baseP=pathArr(base,s),bullP=pathArr(bull,s),bearP=pathArr(bear,s);
      var band='M'+X(s).toFixed(1)+' '+Y(bull[0]).toFixed(1);
      for(var i=1;i<bull.length;i++)band+=' L'+X(s+i).toFixed(1)+' '+Y(bull[i]).toFixed(1);
      for(var j=bear.length-1;j>=0;j--)band+=' L'+X(s+j).toFixed(1)+' '+Y(bear[j]).toFixed(1);
      band+=' Z';
      var tx=X(s).toFixed(1),gid='fc'+Math.round(Math.random()*1e6);
      var histArea=histP+' L'+tx+' '+baseY+' L'+X(0).toFixed(1)+' '+baseY+' Z';
      function dot(arr,off,col){return '<circle cx="'+X(off+arr.length-1).toFixed(1)+'" cy="'+Y(arr[arr.length-1]).toFixed(1)+'" r="3.5" fill="'+col+'" stroke="#fff" stroke-width="1.6"/>';}
      return '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b7cba" stop-opacity="0.16"/><stop offset="0.92" stop-color="#8b7cba" stop-opacity="0"/></linearGradient></defs>'
        +'<path d="'+band+'" fill="rgba(111,101,154,.10)"/>'
        +'<path d="'+histArea+'" fill="url(#'+gid+')"/>'
        +'<line x1="'+tx+'" y1="10" x2="'+tx+'" y2="'+baseY+'" stroke="#d5cee8" stroke-width="1" stroke-dasharray="2 4" opacity="0.8"/>'
        +'<path d="'+histP+'" fill="none" stroke="#8b7cba" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'
        +'<path d="'+baseP+'" fill="none" stroke="#8b7cba" stroke-width="1.9" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
        +'<path d="'+bullP+'" fill="none" stroke="#619f88" stroke-width="1.7" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
        +'<path d="'+bearP+'" fill="none" stroke="#cf5a40" stroke-width="1.7" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round"/>'
        +dot(bear,s,'#cf5a40')+dot(bull,s,'#619f88')+dot(base,s,'#8b7cba');
    },
    xLabels:function(v){
      var lo=Math.max(0,Math.ceil(v.lo)),hi=Math.min(n-1,Math.floor(v.hi)),mid=Math.round((lo+hi)/2);
      return [{i:lo,a:'start',t:fmtDate(dateAt(lo))},{i:mid,a:'middle',t:fmtDate(dateAt(mid))},{i:hi,a:'end',t:fmtDate(dateAt(hi))}];
    },
    pointAt:function(idx){
      if(idx>=s){var fi=idx-s;return {date:fmtDate(dateAt(idx)),anchorVal:base[fi],rows:[
        {color:'#619f88',label:'Bull',value:bull[fi],disp:sfMoney(bull[fi])},
        {color:'#8b7cba',label:'Base',value:base[fi],disp:sfMoney(base[fi])},
        {color:'#cf5a40',label:'Bear',value:bear[fi],disp:sfMoney(bear[fi])}]};}
      return {date:fmtDate(dateAt(idx)),anchorVal:hist[idx],rows:[{color:'#8b7cba',label:'Price',value:hist[idx],disp:sfMoney(hist[idx])}]};
    }
  };
  interactiveChart(id,cfg);
}
function hWords(h){return h>=365?'year':(h>=180?'6 months':(h>=90?'3 months':h+' days'));}
function hChipLabel(h){return h>=365?'1 year':(h>=180?'6 months':'3 months');}
function bouncyWord(v){return v<18?'fairly steady':(v<35?'moderately bouncy':(v<60?'quite bouncy':'very bouncy'));}
function classContext(c,v){if(c==='crypto')return 'Big swings like this are normal for crypto.';if(c==='etf')return 'ETFs usually ride more gently than single stocks.';return v<25?"That's fairly calm for a single stock.":"That's pretty normal for a single stock.";}
function toggleSFNumbers(){sfShowNumbers=!sfShowNumbers;var el=document.getElementById('sfNumbers'),b=document.getElementById('sfNumBtn');if(el)el.style.display=sfShowNumbers?'block':'none';if(b)b.textContent=sfShowNumbers?'Hide the numbers ▴':'See all the numbers ▾';}
function paintSF(a,d,p){
  var nH=Math.min(90,d.historical_prices.length);
  var histPts=d.historical_prices.slice(-nH);
  var hist=histPts.map(function(x){return x.price;});
  var histDates=histPts.map(function(x){return x.date||'';});
  var bearPts=d.forecast_paths.bear,basePts=d.forecast_paths.base,bullPts=d.forecast_paths.bull;
  var bear=bearPts.map(function(x){return x.price;}),base=basePts.map(function(x){return x.price;}),bull=bullPts.map(function(x){return x.price;});
  var rm=d.risk_metrics||{},lit=d.literacy||{},dq=d.data_quality||{},fc=d.forecast_change||{},pf=(p&&p.fields)||{};
  var H=d.horizon_days||sfHorizon,bn=a.t.replace('-USD','');
  var lastDate=histDates[histDates.length-1]||'';
  var fcDates=basePts.map(function(x,i){return x.date||addDaysISO(lastDate,H*(base.length>1?i/(base.length-1):0));});
  var volPct=(rm.annualized_volatility||0)*100,ddPct=(rm.max_historical_drawdown||0)*100,conf=Math.round(d.confidence*100);
  function pc(v){return (v>=0?'+':'')+(v*100).toFixed(1)+'%';}
  var hChips=[90,180,365].map(function(h){return '<div class="hz '+(sfHorizon===h?'on':'')+'" onclick="setHorizon('+h+')">'+hChipLabel(h)+'</div>';}).join('');
  var html='<div class="sf-grid"><div class="sf-col-main">';
  // chart + header
  html+='<div class="card">'
    +'<div class="row" style="margin-bottom:12px"><div><div style="font-size:19px;font-weight:800">'+bn+'</div><div class="l-s">'+a.n+(pf.sector?' · '+pf.sector:'')+'</div></div><div style="text-align:right"><div style="font-size:18px;font-weight:800" class="tnum">'+sfMoney(d.latest_price)+'</div><span class="sf-cls '+a.c+'">'+a.c+'</span></div></div>'
    +'<div class="hz-row">'+hChips+'<span style="margin-left:auto;font-size:11px;color:var(--muted);font-weight:600">next '+hWords(H)+'</span></div>'
    +'<div id="sfChart"></div>'
    +'<div class="chart-hint">Hover for values · scroll to zoom · drag to pan · double-click to reset</div>'
    +'<div class="sf-legend"><span><i style="background:#8b7cba"></i>Past &amp; most likely</span><span><i style="background:#619f88"></i>If it goes well</span><span><i style="background:#cf5a40"></i>If it goes poorly</span><span style="color:var(--faint)">┊ now</span></div>'
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
  html+='<div class="card"><div class="row" style="margin-bottom:12px"><div class="card-t" style="margin-bottom:0">The numbers, explained</div><span class="pill pill-grn">&#9679; Live</span></div>'
    +mrow('Most-likely value','<span class="up">'+sfMoney(d.target_prices.base)+'</span>','The middle-of-the-road estimate for '+bn+' in '+hWords(H)+' ('+pc(d.returns.base)+').')
    +mrow('Bounciness (volatility)',volPct.toFixed(1)+'%','How much the price moves around. It has swung about '+volPct.toFixed(0)+'% up or down over a year.')
    +mrow('Worst drop','-'+ddPct.toFixed(0)+'%','The biggest fall from a recent high. Holding through it, your money dipped about '+ddPct.toFixed(0)+'% before recovering.')
    +mrow('Data quality',conf+'% · '+d.confidence_label,'How clean and steady the recent data is. Even with great data, nobody can predict the exact price, only a likely range.')
    +mrow('Risk level',d.risk_label,'A plain rating of how much this could swing, currently '+(d.risk_label||'').toLowerCase()+'.')
    +'</div>';
  var since=(fc&&fc.available&&fc.previous_as_of)?('Barely moved since '+fmtDate(fc.previous_as_of)+' (base '+(fc.base_return_delta>=0?'+':'')+(fc.base_return_delta*100).toFixed(2)+'%).'):'';
  html+='<div class="card"><div class="card-t">Where this data comes from</div><div style="display:flex;gap:8px;flex-wrap:wrap'+(since?';margin-bottom:8px':'')+'"><span class="pill pill-grn">'+(dq.freshness_label||'Fresh')+'</span><span class="pill pill-pur">Daily snapshot</span><span class="pill pill-gry">'+fmtDate(d.data_as_of||dq.as_of_date||'')+'</span></div>'+(since?'<div class="mrow-s" style="margin:0">'+since+'</div>':'')+'</div>';
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
  html+='<div class="card"><div class="card-t">About '+bn+'</div><div style="font-size:13px;color:var(--muted);line-height:1.6">'+about+' <span style="font-size:11px">These are model estimates for learning, not advice. Data as of '+fmtDate(d.data_as_of||dq.as_of_date||'')+'.</span></div></div>';
  html+=watchBtnHtml(a.t);
  html+='</div></div>';
  document.getElementById('sfDetail').innerHTML=html;
  renderForecastChart('sfChart',hist,bear,base,bull,histDates,fcDates);
}

/* ── Forecast ────────────────────────────────── */
function pickFc(el){document.querySelectorAll('#page-journey .tchip').forEach(function(c){c.classList.remove('sel');});el.classList.add('sel');renderFc(el.dataset.t);}
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
    +'<div class="row" style="margin-top:12px"><span id="fcStatus" style="font-size:11px;color:var(--muted);font-weight:700">Updating…</span></div>';
  document.getElementById('fcTip').innerHTML='Nobody can predict <b>'+t+'</b>, so here\'s the <b>range</b>: a rough case, the most-likely middle, and a strong case. Plan around the middle.';
  loadForecast(t);
}

/* ── Investing tab: "Continue learning" strip ── one card per investing-relevant
   Learn unit (Why invest / Build a smart portfolio / TFSA & RRSP), real progress data ── */
function renderInvestLessons(){
  var el=document.getElementById('investLessonRow');if(!el)return;
  var st=lessonStates(),units=learnUnits().filter(function(u){return u.k==='Unit 2'||u.k==='Unit 3'||u.k==='Unit 4';});
  el.innerHTML=units.map(function(u){
    var doneCt=u.lessons.filter(function(l){return st.map[l.id]==='done';}).length,total=u.lessons.length;
    var pct=Math.round(doneCt/total*100);
    var next=u.lessons.filter(function(l){return st.map[l.id]==='active'||st.map[l.id]==='mileopen';})[0]||u.lessons[0];
    return '<div class="invest-lesson-card" onclick="goTab(\'learn\');nodeTap(\''+next.id+'\',false,false)">'
      +'<div class="ilc-k">'+u.k+'</div><div class="ilc-t">'+escHtml(u.t)+'</div>'
      +'<div class="bar" style="margin:8px 0 4px"><div class="bar-fill" style="width:'+pct+'%"></div></div>'
      +'<div class="ilc-pct">'+doneCt+'/'+total+' done</div></div>';
  }).join('');
}

/* ── Investing Glossary: real GLOSS data (already used by openTip everywhere),
   just a new browsable search/A-Z UI — "View Full Definition" opens the same
   bottom-sheet modal every other term link in the app already uses. ── */
var GLOSS_INVEST_KEYS=['tfsa','rrsp','etf','compound','risk','diversification','bull','bear','inflation','dividend','concentration','position_sizing','uncertainty','bouncy','invested','unrealized','realized','all_time_return','avg_cost','pnl'];
var glossQuery='',glossLetter=null,glossOpenKey=null;
function glossEntries(){
  return GLOSS_INVEST_KEYS.map(function(k){return {k:k,t:GLOSS[k].t,d:GLOSS[k].d};}).filter(function(e){
    if(glossQuery&&e.t.toLowerCase().indexOf(glossQuery.toLowerCase())<0)return false;
    if(glossLetter&&e.t.charAt(0).toUpperCase()!==glossLetter)return false;
    return true;
  }).sort(function(a,b){return a.t.localeCompare(b.t);});
}
function renderGlossary(){
  var el=document.getElementById('investGlossaryCard');if(!el)return;
  var letters=[];GLOSS_INVEST_KEYS.forEach(function(k){var L=GLOSS[k].t.charAt(0).toUpperCase();if(letters.indexOf(L)<0)letters.push(L);});
  letters.sort();
  var common=['compound','tfsa','risk'];
  var entries=glossEntries();
  el.innerHTML='<div class="card-t">Investing Glossary</div>'
    +'<div class="gloss-search"><input id="glossSearchInput" placeholder="Search by term" value="'+escHtml(glossQuery)+'" oninput="glossSearch(this.value)"/><button class="btn-taupe gloss-search-btn" type="button" onclick="glossSearch(document.getElementById(\'glossSearchInput\').value)">Search</button></div>'
    +'<div class="muted-note" style="text-align:left;margin:8px 0 4px">Explore common terms:</div>'
    +'<div class="gloss-chips">'+common.map(function(k){return '<span class="gloss-chip" onclick="glossPick(\''+k+'\')">'+GLOSS[k].t+'</span>';}).join('')+'</div>'
    +'<div class="gloss-az">'+letters.map(function(L){return '<span class="gloss-az-l'+(glossLetter===L?' sel':'')+'" onclick="glossLetterPick(\''+L+'\')">'+L+'</span>';}).join('')+'</div>'
    +'<div class="gloss-list">'+(entries.length?entries.map(function(e){
      var open=glossOpenKey===e.k;
      var body=open?('<div class="gloss-term-b">'+(e.d.length>140?e.d.slice(0,140)+'…':e.d)+' <span class="see-all" onclick="event.stopPropagation();openTip(\''+e.k+'\')">View Full Definition</span></div>'):'';
      return '<div class="gloss-term'+(open?' open':'')+'"><div class="gloss-term-h" onclick="glossToggle(\''+e.k+'\')"><span>'+e.t+'</span><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>'+body+'</div>';
    }).join(''):'<div class="muted-note">No terms match.</div>')+'</div>';
}
function glossSearch(v){
  glossQuery=v;glossLetter=null;renderGlossary();
  var inp=document.getElementById('glossSearchInput');
  if(inp){inp.focus();inp.setSelectionRange(v.length,v.length);}
}
function glossPick(k){glossQuery='';glossLetter=null;glossOpenKey=k;renderGlossary();}
function glossLetterPick(L){glossLetter=(glossLetter===L)?null:L;renderGlossary();}
function glossToggle(k){glossOpenKey=(glossOpenKey===k)?null:k;renderGlossary();}

