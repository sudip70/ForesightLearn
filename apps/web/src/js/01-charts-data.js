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
  bouncy:{t:'Bounciness (volatility)',d:'How much a price swings around. Bouncier investments can grow faster, but they can also drop harder.'},
  bank_account:{t:'Bank account',d:'A safe place a bank holds your money. A chequing account is for day-to-day spending (debit, bills, e-transfers); a savings account is for money you want to set aside and grow. Most banks let you open one for free, often online in minutes.'},
  debit_card:{t:'Debit card',d:'A card tied to your chequing account. When you tap or swipe it, the money comes straight out of your own balance, no borrowing, no interest. It can only spend what you actually have.'},
  credit_card:{t:'Credit card',d:'A card that lets you borrow from the bank to pay now and settle later. Pay the full balance each month and it costs nothing, and builds your credit score. Carry a balance and you pay high interest. A powerful tool used carefully.'},
  loan_acct:{t:'Loan',d:'Money you borrow and pay back over time, usually with interest. Student loans, car loans and lines of credit are common kinds. The key questions: how much interest, and how long to repay?'},
  savings_acct:{t:'Savings account',d:'A bank account built for setting money aside. It pays a little interest and keeps your savings separate from spending, so it is easier to grow an emergency fund or save toward a goal.'},
  investing_acct:{t:'Investing account',d:'An account (like a TFSA or RRSP) you use to buy investments such as stocks, ETFs and bonds. Over years your money can grow far faster than in a savings account, in exchange for some ups and downs along the way.'},
  detail_level:{t:'Detail level',d:'Controls how much the Practice screen shows. Starter keeps it simple, just your value, buying power and easy buying. Slide to Intermediate for charts, metrics and your watchlist, or Pro to see everything, accounts, plans and price sources. Move it up as you grow more confident.'},
  buying_power:{t:'Buying power',d:'The practice cash you have available to buy with right now. Every buy uses some of it; every sell adds back to it. It is all virtual money, so there is zero real-world risk.'},
  invested:{t:'Invested',d:'The total practice money you have put in, your $10,000 starting balance plus anything you added. It is the baseline your gains and losses are measured against.'},
  unrealized:{t:'Unrealized gain/loss',d:'Paper profit or loss on holdings you still own. It moves up and down with prices every day and only becomes "real" once you sell. Nothing is locked in yet.'},
  realized:{t:'Realized gain/loss',d:'Profit or loss you have locked in by actually selling. Once realized, it no longer changes with the market, it is final.'},
  all_time_return:{t:'All-time return',d:'How much your whole portfolio is up or down since you started, shown in dollars and as a percentage of what you invested. It counts both sold (realized) and still-held (unrealized) results.'},
  avg_cost:{t:'Average cost',d:'The average price you paid per share across all your buys of one holding. Compare it to the current price to see if that position is up or down.'},
  pnl:{t:'Profit & loss (P&L)',d:'How much a holding has made or lost, the current value minus what you paid. Green means up, red means down. Shown in dollars and as a percentage.'}
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

/* ════════════════════════════════════════════════════════════════════════
 *  Interactive time-series charts — shared engine
 *  One implementation powers the Practice portfolio chart and the Stock Finder
 *  forecast chart: hover readout (date + values), scroll/pinch zoom centred on
 *  the cursor, drag to pan, double-click to reset. A chart is described by a
 *  `cfg` (see renderPortfolioChart / paintSF) and re-renders itself in place as
 *  the view window changes. Donuts/gauges/sparklines are static by design.
 * ───────────────────────────────────────────────────────────────────────── */
var CHARTS={};
function clampViewSpan(v){
  var full=v.n-1,minSpan=Math.max(3,full*0.05);if(minSpan>full)minSpan=full;
  if(v.hi-v.lo<minSpan){var c=(v.lo+v.hi)/2;v.lo=c-minSpan/2;v.hi=c+minSpan/2;}
  if(v.lo<0){v.hi-=v.lo;v.lo=0;}
  if(v.hi>full){v.lo-=(v.hi-full);v.hi=full;}
  if(v.lo<0)v.lo=0;
  return v;
}
function interactiveChart(id,cfg){
  var el=document.getElementById(id);if(!el)return;
  var w=cfg.w,h=cfg.h,pad=8,padT=10,padB=20,plotW=w-pad*2,plotH=h-padT-padB;
  var v=cfg.view,baseY=h-padB,span=(v.hi-v.lo)||1;
  var yr=cfg.yRange(v),mn=yr[0],mx=yr[1],rg=(mx-mn)||1;
  function X(i){return pad+(i-v.lo)/span*plotW;}
  function Y(val){return padT+plotH*(1-(val-mn)/rg);}
  var clip='clip_'+id;
  var content=cfg.draw(X,Y,v,baseY);
  var labs=cfg.xLabels?cfg.xLabels(v):[];
  var labSvg=labs.map(function(L){return '<text x="'+X(L.i).toFixed(1)+'" y="'+(h-6)+'" font-size="9" fill="#aaa4c0" font-weight="700" text-anchor="'+L.a+'">'+L.t+'</text>';}).join('');
  var maxM=cfg.maxMarkers||3,dots='';
  for(var k=0;k<maxM;k++)dots+='<circle id="'+id+'_hd'+k+'" r="3.4" fill="#7a5cae" stroke="#fff" stroke-width="1.5" style="display:none"/>';
  var svg='<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" style="display:block;touch-action:none">'
    +'<defs><clipPath id="'+clip+'"><rect x="'+pad+'" y="0" width="'+plotW+'" height="'+h+'"/></clipPath></defs>'
    +'<g clip-path="url(#'+clip+')">'+content+'</g>'
    +labSvg
    +'<g id="'+id+'_hl" style="opacity:0;pointer-events:none"><line id="'+id+'_hv" y1="'+padT+'" y2="'+baseY+'" stroke="#b9add6" stroke-width="1" stroke-dasharray="2 3"/>'+dots+'</g>'
    +'<rect x="0" y="0" width="'+w+'" height="'+h+'" fill="transparent" style="cursor:crosshair;touch-action:none" '
      +'onwheel="chartWheel(\''+id+'\',event)" onpointerdown="chartDown(\''+id+'\',event)" onmousemove="chartHover(\''+id+'\',event)" onmouseleave="chartHoverOff(\''+id+'\')" ondblclick="chartReset(\''+id+'\')"></rect>'
    +'</svg>';
  el.style.position='relative';
  el.innerHTML=svg+'<div id="'+id+'_tip" class="chart-tip" style="display:none"></div>';
  CHARTS[id]={id:id,cfg:cfg,view:v,w:w,h:h,pad:pad,plotW:plotW,X:X,Y:Y,baseY:baseY,maxM:maxM};
}
function chartScale(c){var svg=document.querySelector('#'+c.id+' svg');if(!svg)return null;var r=svg.getBoundingClientRect();return r.width?{r:r,scale:r.width/c.w}:null;}
function chartIdxAtClient(c,clientX){var s=chartScale(c);if(!s)return null;var vbx=(clientX-s.r.left)/s.scale;return c.view.lo+(vbx-c.pad)/c.plotW*((c.view.hi-c.view.lo)||1);}
function chartRerender(id){var c=CHARTS[id];if(c){c.cfg.view=c.view;interactiveChart(id,c.cfg);}}
function chartWheel(id,e){
  var c=CHARTS[id];if(!c)return;e.preventDefault();
  var ctr=chartIdxAtClient(c,e.clientX);if(ctr==null)ctr=(c.view.lo+c.view.hi)/2;
  var f=e.deltaY>0?1.15:0.87,v=c.view;
  v.lo=ctr-(ctr-v.lo)*f;v.hi=ctr+(v.hi-ctr)*f;clampViewSpan(v);chartRerender(id);
}
function chartReset(id){var c=CHARTS[id];if(!c)return;c.view.lo=0;c.view.hi=c.view.n-1;chartRerender(id);}
/* pointer gestures: 1 finger = pan, 2 fingers = pinch-zoom */
var gesture=null;
function gptDist(p){var k=Object.keys(p);var a=p[k[0]],b=p[k[1]];return Math.hypot(a.x-b.x,a.y-b.y);}
function gptMidX(p){var k=Object.keys(p);return (p[k[0]].x+p[k[1]].x)/2;}
function chartDown(id,e){
  var c=CHARTS[id];if(!c)return;
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(!gesture||gesture.id!==id)gesture={id:id,ptrs:{}};
  gesture.ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  var n=Object.keys(gesture.ptrs).length;
  if(n===1){gesture.mode='pan';gesture.lastX=e.clientX;}
  else if(n===2){gesture.mode='pinch';gesture.startDist=gptDist(gesture.ptrs);gesture.startLo=c.view.lo;gesture.startHi=c.view.hi;gesture.ctr=chartIdxAtClient(c,gptMidX(gesture.ptrs));}
  chartHoverOff(id);
  window.addEventListener('pointermove',chartGmove);
  window.addEventListener('pointerup',chartGup);window.addEventListener('pointercancel',chartGup);
  e.preventDefault();
}
function chartGmove(e){
  if(!gesture)return;var c=CHARTS[gesture.id];if(!c)return;
  if(!(e.pointerId in gesture.ptrs))return;
  gesture.ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  var s=chartScale(c);if(!s)return;var v=c.view;
  if(gesture.mode==='pinch'&&Object.keys(gesture.ptrs).length>=2){
    var f=gesture.startDist/(gptDist(gesture.ptrs)||1),ctr=gesture.ctr;
    v.lo=ctr-(ctr-gesture.startLo)*f;v.hi=ctr+(gesture.startHi-ctr)*f;clampViewSpan(v);chartRerender(gesture.id);
  }else if(gesture.mode==='pan'){
    var dxVbx=(e.clientX-gesture.lastX)/s.scale;gesture.lastX=e.clientX;
    var span=v.hi-v.lo,dIdx=-dxVbx/c.plotW*span;v.lo+=dIdx;v.hi+=dIdx;
    if(v.lo<0){v.lo=0;v.hi=span;}if(v.hi>v.n-1){v.hi=v.n-1;v.lo=v.n-1-span;}if(v.lo<0)v.lo=0;
    chartRerender(gesture.id);
  }
}
function chartGup(e){
  if(!gesture)return;delete gesture.ptrs[e.pointerId];
  var n=Object.keys(gesture.ptrs).length;
  if(n===0){window.removeEventListener('pointermove',chartGmove);window.removeEventListener('pointerup',chartGup);window.removeEventListener('pointercancel',chartGup);gesture=null;}
  else if(n===1){gesture.mode='pan';gesture.lastX=gesture.ptrs[Object.keys(gesture.ptrs)[0]].x;}
}
function chartHover(id,e){
  if(gesture)return;var c=CHARTS[id];if(!c)return;
  var fi=chartIdxAtClient(c,e.clientX);if(fi==null)return;
  var idx=Math.round(fi);
  idx=Math.max(0,Math.min(c.view.n-1,idx));
  idx=Math.max(Math.ceil(c.view.lo-1e-6),Math.min(Math.floor(c.view.hi+1e-6),idx));
  var pt=c.cfg.pointAt(idx),lx=c.X(idx);
  document.getElementById(id+'_hv').setAttribute('x1',lx);
  document.getElementById(id+'_hv').setAttribute('x2',lx);
  for(var k=0;k<c.maxM;k++){var d=document.getElementById(id+'_hd'+k);if(!d)continue;
    if(k<pt.rows.length){d.style.display='';d.setAttribute('cx',lx);d.setAttribute('cy',c.Y(pt.rows[k].value));d.setAttribute('fill',pt.rows[k].color);}
    else d.style.display='none';}
  var g=document.getElementById(id+'_hl');if(g)g.style.opacity='1';
  var tip=document.getElementById(id+'_tip');if(!tip)return;
  tip.innerHTML='<div class="chart-tip-d">'+(pt.date||'—')+'</div>'+pt.rows.map(function(r){return '<div class="chart-tip-r"><span class="chart-tip-sw" style="background:'+r.color+'"></span><span class="chart-tip-l">'+r.label+'</span><span class="chart-tip-v tnum">'+r.disp+'</span></div>';}).join('');
  tip.style.display='block';
  var s=chartScale(c);if(!s)return;var cx=lx*s.scale,tw=tip.offsetWidth,th=tip.offsetHeight;
  var ay=c.Y(pt.anchorVal!=null?pt.anchorVal:pt.rows[0].value);
  var left=cx+14;if(left+tw>s.r.width)left=cx-tw-14;if(left<0)left=2;
  var top=ay*s.scale-th/2;top=Math.max(2,Math.min(s.r.height-th-2,top));
  tip.style.left=Math.round(left)+'px';tip.style.top=Math.round(top)+'px';
}
function chartHoverOff(id){var g=document.getElementById(id+'_hl');if(g)g.style.opacity='0';var t=document.getElementById(id+'_tip');if(t)t.style.display='none';}

/* ── Render charts ───────────────────────────── */
/* journeyChart is rendered by renderPortfolioChart() inside renderPortfolio (needs PF/totals) */
/* scenarioChart is rendered lazily by renderScenario() when the Scenarios page opens */
/* Stock Finder now renders a live forecast fan chart (see sfSelect) */
renderGauge(20);renderDonut(10);
/* NOTE: live-data init (renderFc/loadIndices) runs at the very end of the script;
   it depends on `var API` which is assigned further down. */

function renderDonut(pct){
  var segs=[{v:pct/100,c:'#9084b4'},{v:0.30,c:'#609c84'},{v:0.22,c:'#d9b84e'},{v:0.18,c:'#cc5a3c'},{v:1-pct/100-0.70,c:'#c0b4d8'}];
  document.getElementById('obDonut').innerHTML=donutChart(segs,190,pct);
}
function renderGauge(v){document.getElementById('gaugeWrap').innerHTML=gaugeChart(v/100);}

