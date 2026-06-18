/* ── Mia avatar (inline SVG) ─────────────────── */
function avatar(){return '<svg viewBox="0 0 48 48" width="100%" height="100%">'
+'<rect width="48" height="48" fill="#e7e1f4"/>'
+'<path d="M9 27 Q9 7 24 7 Q39 7 39 27 L39 40 Q33 44 24 44 Q15 44 9 40 Z" fill="#43301f"/>'
+'<circle cx="24" cy="27" r="13" fill="#f0b896"/>'
+'<path d="M11 24 Q12 9 24 9 Q36 9 37 24 Q34 16 24 16 Q14 16 11 24 Z" fill="#43301f"/>'
+'<path d="M11 24 Q9 35 13 41 L16 40 Q12 32 13 25 Z" fill="#43301f"/>'
+'<path d="M37 24 Q39 35 35 41 L32 40 Q36 32 35 25 Z" fill="#43301f"/>'
+'<circle cx="19.5" cy="27" r="1.5" fill="#3a2a20"/>'
+'<circle cx="28.5" cy="27" r="1.5" fill="#3a2a20"/>'
+'<circle cx="17" cy="30.5" r="2" fill="#ef9f8f" opacity=".55"/>'
+'<circle cx="31" cy="30.5" r="2" fill="#ef9f8f" opacity=".55"/>'
+'<path d="M20.5 32.5 Q24 35.5 27.5 32.5" stroke="#b9694b" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
+'</svg>';}
document.querySelectorAll('.face,.sc-av,.av').forEach(el=>{if(el.innerHTML.includes('__AV__'))el.innerHTML=avatar();});
// replace remaining placeholders
document.body.innerHTML=document.body.innerHTML.replace(/__AV__/g,avatar()).replace(/__AVMINI__/g,'<div style="width:24px;height:24px;border-radius:50%;overflow:hidden">'+avatar()+'</div>');

/* ── Data ────────────────────────────────────── */
var GLOSS={
  tfsa:{t:'TFSA',d:'A Tax-Free Savings Account. Any interest, dividends or growth you earn inside it is completely tax-free, you never pay tax on the gains, even when you withdraw. The best first account for most Canadians.'},
  rrsp:{t:'RRSP',d:'A Registered Retirement Savings Plan. Contributions lower your taxable income today, and you only pay tax later when you withdraw in retirement, usually at a lower rate.'},
  etf:{t:'ETF',d:'An Exchange-Traded Fund bundles many stocks or bonds into one. Buy a single ETF and you instantly own a slice of all of them, instant diversification, low effort.'},
  compound:{t:'Compound Interest',d:'Earning returns on your returns. Each period your gains get added to your balance, so the next period earns even more. Over years it snowballs, the earlier you start, the bigger it grows.'},
  risk:{t:'Risk',d:'How much an investment can swing up or down. Higher risk can mean bigger gains, and bigger losses. Matching risk to your time horizon is the heart of smart investing.'},
  diversification:{t:'Diversification',d:'Spreading your money across different assets so one bad pick can\'t sink you. The classic line: don\'t put all your eggs in one basket.'},
  bull:{t:'Bull Market',d:'A stretch when prices rise 20%+ from a recent low, often over months. Optimism is high and investors expect gains to continue.'},
  bear:{t:'Bear Market',d:'A stretch when prices fall 20%+ from a recent high. It feels scary, but for long-term investors it can be a chance to buy at lower prices.'},
  inflation:{t:'Inflation',d:'The gradual rise in prices over time, which quietly erodes the buying power of cash. Investing aims to grow your money faster than inflation shrinks it.'},
  dividend:{t:'Dividend',d:'A slice of a company\'s profit paid out to shareholders, usually every quarter. Reinvesting dividends is a powerful way to compound faster.'},
  concentration:{t:'Concentration',d:'How much of your money sits in one place, one holding or one sector. High concentration means one bad move hits you hard.'},
  position_sizing:{t:'Position sizing',d:'Deciding how much to put into one holding. A common guardrail: keep any single position under about 25% of your money.'},
  uncertainty:{t:'Why a range, not a number',d:'Nobody can predict a price. A range shows the outcomes that are realistically plausible, and honestly reminds you the future isn\'t knowable.'},
  bouncy:{t:'Bounciness (volatility)',d:'How much a price swings around. Bouncier investments can grow faster, but they can also drop harder.'}
};
var FC={
  AAPL:{bear:['$162','-11%'],base:['$196','+8%'],bull:['$218','+20%']},
  NVDA:{bear:['$710','-19%'],base:['$950','+9%'],bull:['$1120','+28%']},
  SPY:{bear:['$482','-8%'],base:['$548','+4%'],bull:['$582','+11%']},
  BTC:{bear:['$52K','-23%'],base:['$74K','+10%'],bull:['$95K','+41%']}
};

/* ── SVG charts ──────────────────────────────── */
function areaChart(vals,w,h,color){
  color=color||'#8b7fd1';var pad=8;
  var mn=Math.min.apply(0,vals),mx=Math.max.apply(0,vals),rg=(mx-mn)||1;
  var sx=(w-pad*2)/(vals.length-1);
  var pts=vals.map(function(v,i){return [pad+i*sx, pad+(h-pad*2)*(1-(v-mn)/rg)];});
  var line=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
  var area=line+' L '+pts[pts.length-1][0].toFixed(1)+' '+(h-pad)+' L '+pts[0][0].toFixed(1)+' '+(h-pad)+' Z';
  var id='g'+Math.floor(Math.random()*1e6);
  var last=pts[pts.length-1];
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block">'
    +'<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'
    +'<stop offset="0" stop-color="'+color+'" stop-opacity=".30"/>'
    +'<stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'
    +'<path d="'+area+'" fill="url(#'+id+')"/>'
    +'<path d="'+line+'" fill="none" stroke="'+color+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<circle cx="'+last[0].toFixed(1)+'" cy="'+last[1].toFixed(1)+'" r="4.5" fill="'+color+'" stroke="#fff" stroke-width="2"/></svg>';
}
function candleChart(data,w,h){
  var pad=8,mn=Math.min.apply(0,data.map(function(d){return d.lo;})),mx=Math.max.apply(0,data.map(function(d){return d.hi;})),rg=(mx-mn)||1;
  var slot=(w-pad*2)/data.length,cw=slot*0.52;
  function Y(v){return pad+(h-pad*2)*(1-(v-mn)/rg);}
  var s='';
  data.forEach(function(d,i){
    var x=pad+i*slot+slot/2,up=d.c>=d.o,col=up?'#7d72a8':'#c0b4d8';
    s+='<line x1="'+x+'" y1="'+Y(d.hi)+'" x2="'+x+'" y2="'+Y(d.lo)+'" stroke="'+col+'" stroke-width="1.3"/>';
    var yt=Y(Math.max(d.o,d.c)),yb=Y(Math.min(d.o,d.c));
    s+='<rect x="'+(x-cw/2)+'" y="'+yt+'" width="'+cw+'" height="'+Math.max(1.5,yb-yt)+'" rx="1.5" fill="'+col+'"/>';
  });
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block">'+s+'</svg>';
}
function donutChart(segs,size,centerPct){
  var r=size/2-16,C=2*Math.PI*r,cx=size/2,cy=size/2,off=0,s='';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#f0edfa" stroke-width="26"/>';
  segs.forEach(function(seg){
    var len=C*seg.v;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+seg.c+'" stroke-width="26" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-off)+'" stroke-linecap="butt" transform="rotate(-90 '+cx+' '+cy+')"/>';
    off+=len;
  });
  s+='<text x="'+cx+'" y="'+(cy+2)+'" text-anchor="middle" dominant-baseline="middle" class="donut-val">'+centerPct+'%</text>';
  return '<svg viewBox="0 0 '+size+' '+size+'" width="190" height="190">'+s+'</svg>';
}
function gaugeChart(pct){
  var w=220,h=128,cx=110,cy=112,r=88;
  function P(a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
  function arc(f,t,col,wd){var a=P(f),b=P(t),lg=(t-f)>Math.PI?1:0;return '<path d="M '+a[0].toFixed(1)+' '+a[1].toFixed(1)+' A '+r+' '+r+' 0 '+lg+' 1 '+b[0].toFixed(1)+' '+b[1].toFixed(1)+'" stroke="'+col+'" stroke-width="'+wd+'" fill="none" stroke-linecap="round"/>';}
  var a0=Math.PI,a1=2*Math.PI;
  var va=a0+(a1-a0)*pct;
  var id='gg'+Math.floor(Math.random()*1e6);
  var nd=[cx+(r-6)*Math.cos(va),cy+(r-6)*Math.sin(va)];
  return '<svg viewBox="0 0 '+w+' '+h+'" width="220" height="128">'
    +'<defs><linearGradient id="'+id+'" x1="0" x2="1"><stop offset="0" stop-color="#c0b4d8"/><stop offset="1" stop-color="#6f659a"/></linearGradient></defs>'
    +arc(a0,a1,'#f0edfa',16)
    +arc(a0,va,'url(#'+id+')',16)
    +'<line x1="'+cx+'" y1="'+cy+'" x2="'+nd[0].toFixed(1)+'" y2="'+nd[1].toFixed(1)+'" stroke="#565072" stroke-width="4" stroke-linecap="round"/>'
    +'<circle cx="'+cx+'" cy="'+cy+'" r="8" fill="#fff" stroke="#565072" stroke-width="3"/></svg>';
}
function genCandles(n,start){
  var d=[],p=start;
  var seed=42;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
  for(var i=0;i<n;i++){var o=p,c=p*(1+(rnd()-0.42)*0.06);var hi=Math.max(o,c)*(1+rnd()*0.02),lo=Math.min(o,c)*(1-rnd()*0.02);d.push({o:o,c:c,hi:hi,lo:lo});p=c;}
  return d;
}

/* ── Render charts ───────────────────────────── */
/* journeyChart is rendered by renderPortfolioChart() inside renderPortfolio (needs PF/totals) */
/* scenarioChart is rendered lazily by renderScenario() when the Scenarios page opens */
/* Stock Finder now renders a live forecast fan chart (see sfSelect) */
renderGauge(20);renderDonut(10);onCalc();
/* NOTE: live-data init (renderFc/loadIndices) runs at the very end of the script;
   it depends on `var API` which is assigned further down. */

function renderDonut(pct){
  var segs=[{v:pct/100,c:'#9084b4'},{v:0.30,c:'#609c84'},{v:0.22,c:'#d9b84e'},{v:0.18,c:'#cc5a3c'},{v:1-pct/100-0.70,c:'#c0b4d8'}];
  document.getElementById('obDonut').innerHTML=donutChart(segs,190,pct);
}
function renderGauge(v){document.getElementById('gaugeWrap').innerHTML=gaugeChart(v/100);}

