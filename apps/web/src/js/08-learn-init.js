/* ═══════════ Learn tab: Duolingo-style path + goals (integrated) ═══════════ */
var GOAL={what:'a car',amt:10000,years:5,saved:4700,pct:10,account:'TFSA',why:'So my money can grow safely',income:2500};
var GOAL_DRAFT=null;
var LEARN={level:3,levelName:'Building Confidence',xp:340,xpToNext:500,streak:5,dailyXP:30,gems:120,checked:{},flags:{},done:{f_budget:1,f_emergency:1,f_debt:1,f_inflation:1,v_save:1,v_compound:1,v_assets:1,v_timing:1,p_risk:1}};
var PET={emoji:'🦊',name:'Penny'};
var RECAP={m1:'Money is a tool for trading your time and effort, investing puts it to work. ✓',m2:'Saving keeps money safe; investing grows it over the years. ✓',m3:'Unit 1 complete, the basics are locked in! ⭐',i1:'A stock is a tiny slice of a real company. ✓',i2:'Stocks, ETFs and bonds, different tools, different risk. ✓',i3:'Unit 2 complete, you know the building blocks! ⭐',why_risk:'Every investment can swing up or down, that swing is what we call risk. ✓'};
var SKILLS=[
  {id:'first',icon:'🌱',name:'First Step',how:'Make your first practice trade'},
  {id:'uncertainty',icon:'🔭',name:'Reads Uncertainty',how:'Explore what moves a price'},
  {id:'diversify',icon:'🧺',name:'Diversification',how:'Hold 3+ asset types at once'},
  {id:'rightsize',icon:'⚖️',name:'Right-Sizing',how:'Keep every holding under 25%'},
  {id:'patience',icon:'🧘',name:'Patience',how:'Hold through a 5%+ dip'}
];
var WHYS=['To save for a big expense','So my money can grow safely','To save for the future','As a way to make money'];
var ACCTS=[{k:'TFSA',d:'Tax-free growth · recommended',cls:'tfsa'},{k:'RRSP',d:'Retirement plan',cls:'rrsp'},{k:'ETFs',d:'Bundled funds',cls:'etf'}];
function money0(n){return '$'+Math.round(n).toLocaleString();}
function lclsOf(t){var a=ASSETS.filter(function(x){return x.t===t;})[0];return a?a.c:'stock';}
function pfStats(){var inv=0,byCls={},big={t:'',v:0};PF.pos.forEach(function(p){var v=p.sh*curPx(p.t);inv+=v;var c=lclsOf(p.t);byCls[c]=(byCls[c]||0)+v;if(v>big.v)big={t:p.t,v:v};});return {inv:inv,classes:Object.keys(byCls).length,big:{t:big.t,pct:inv?big.v/inv:0}};}
function pfClasses(){return pfStats().classes;}
function skillGot(id){var s=pfStats();if(id==='first')return PF.pos.length>0;if(id==='diversify')return s.classes>=3;if(id==='rightsize')return PF.pos.length>=3&&s.big.pct<0.25;return !!LEARN.flags[id];}
var _gotSnap=null;
function checkSkillUnlocks(){
  if(_gotSnap===null){_gotSnap={};SKILLS.forEach(function(s){_gotSnap[s.id]=skillGot(s.id);});return;}
  SKILLS.forEach(function(s){var g=skillGot(s.id);if(g&&!_gotSnap[s.id]){learnXP(80);showToast('🏅 Skill unlocked: '+s.name+' · +80 XP');}_gotSnap[s.id]=g;});
}
function learnXP(n){LEARN.xp+=n;LEARN.dailyXP=Math.min(99,LEARN.dailyXP+n);if(LEARN.xp>=LEARN.xpToNext){LEARN.xp-=LEARN.xpToNext;LEARN.level++;LEARN.xpToNext=Math.round(LEARN.xpToNext*1.25);setTimeout(function(){showToast('🎉 Level up! Level '+LEARN.level);},900);}saveState();}
function refreshLearn(){checkSkillUnlocks();if(document.getElementById('page-learn').classList.contains('active'))renderLearn();}
function lring(val,max){var r=11,c=2*Math.PI*r,off=c*(1-Math.min(1,val/max));return '<svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="'+r+'" fill="none" stroke="#e9e4f3" stroke-width="4"/><circle cx="15" cy="15" r="'+r+'" fill="none" stroke="#e0a92f" stroke-width="4" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'" transform="rotate(-90 15 15)"/></svg>';}
function ldonutSVG(pct){var r=34,c=2*Math.PI*r,off=c*(1-Math.min(1,pct/20));return '<svg width="120" height="120" viewBox="0 0 90 90"><circle cx="45" cy="45" r="'+r+'" fill="none" stroke="#e7e1f4" stroke-width="11"/><circle cx="45" cy="45" r="'+r+'" fill="none" stroke="#6f659a" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'" transform="rotate(-90 45 45)"/></svg>';}
function ldonutInner(pct,m){return ldonutSVG(pct)+'<div class="ldonut-c"><div class="ldonut-a">'+money0(m)+'</div><div class="ldonut-k">/month · '+pct+'%</div></div>';}
function goalTitle(g){return 'Save '+money0(g.amt)+' for '+g.what;}
/* Home "My Goals" now reflects the unified GOALS list (see 07b-money.js) and opens the Goals page. */
function renderGoalCard(){
  var el=document.getElementById('homeGoal');if(!el)return;
  var list=(typeof GOALS!=='undefined'&&GOALS)?GOALS:[];
  if(!list.length){
    el.innerHTML='<div class="goal-card" onclick="push(\'goals\')" style="cursor:pointer">'
      +'<div class="row"><div style="font-size:14px;font-weight:800">🎯 Set a savings goal</div><span class="pill pill-pur">+ Add</span></div>'
      +'<div class="muted-note" style="text-align:left;margin-top:4px">Tap to create your first goal and track it here.</div></div>';
    return;
  }
  var saved=0,target=0;list.forEach(function(g){saved+=(+g.saved||0);target+=(+g.target||0);});
  var pct=target>0?Math.min(100,Math.round(saved/target*100)):0;
  var h='<div class="goal-card" onclick="push(\'goals\')" style="cursor:pointer">'
    +'<div class="row"><div style="font-size:14px;font-weight:800">🎯 My Goals</div><span class="pill pill-pur">'+pct+'%</span></div>';
  list.slice(0,3).forEach(function(g){
    var gp=(+g.target>0)?Math.min(100,Math.round((+g.saved||0)/(+g.target)*100)):0;
    h+='<div style="margin-top:9px"><div class="row" style="margin-bottom:4px"><span style="font-size:12px;font-weight:700">'+g.what+'</span>'
      +'<span style="font-size:11px;color:var(--muted)" class="tnum">'+money0(g.saved)+' / '+money0(g.target)+'</span></div>'
      +'<div class="bar"><div class="bar-fill" style="width:'+gp+'%"></div></div></div>';
  });
  var more=list.length>3?(' · +'+(list.length-3)+' more'):'';
  h+='<div class="row" style="margin-top:10px"><span style="font-size:11px;color:var(--muted)">'+money0(saved)+' of '+money0(target)+' saved'+more+'</span>'
    +'<span style="font-size:11px;color:var(--purple-strong);font-weight:700">View all ›</span></div></div>';
  el.innerHTML=h;
}
function lrow(n,v,p){return '<div class="lz-row"><div class="row"><span class="lz-n">'+n+'</span><span class="lz-v tnum">'+v+'</span></div><div class="lz-p">'+p+'</div></div>';}
var LESSONS_L={
  /* ── Unit 1 · Money foundations ── */
  f_budget:{xp:40,celeb:'You\'ve got a plan for every paycheque now.',steps:[
    {say:'Before investing, know where your money goes. One simple split keeps it automatic: <b>50 / 30 / 20</b>. 🧾'},
    {say:'<b>50%</b> to needs (rent, groceries), <b>30%</b> to wants (fun, takeout), <b>20%</b> to saving &amp; paying off debt.',viz:function(){return '<div class="viz-split"><div style="width:50%;background:#7a5cae">50% needs</div><div style="width:30%;background:#5b8def">30% wants</div><div style="width:20%;background:#4f9c7e">20% save</div></div>';}},
    {q:'You take home $2,000 a month. Using 50/30/20, how much goes to saving &amp; debt?',opts:['$100','$400','$1,000'],correct:1,yes:'Exactly!',why:'20% × $2,000 = $400. Even automating a piece of this changes everything.'},
    {say:'The <b>pay-yourself-first</b> trick: move that 20% on payday — before it can disappear on wants. Future-you always wins this one. 💪'},
    {q:'Which best describes "pay yourself first"?',opts:['Spend freely, save whatever\'s left','Transfer savings the moment you\'re paid','Invest only when you have extra'],correct:1,yes:'Yes!',why:'Moving money before you can spend it is what actually makes saving happen. Willpower alone rarely works.'},
    {say:'Start today — even $50 a month adds up to <b>$600 a year</b>, and it builds the habit that matters most. 🌱'}
  ]},
  f_emergency:{xp:40,celeb:'You built the foundation everything else stands on.',steps:[
    {say:'Life happens — a car repair, a sudden job loss, a medical bill. An <b>emergency fund</b> stops a surprise from becoming a crisis. 🛟'},
    {say:'Aim for <b>3–6 months</b> of essential expenses (rent, groceries, transport) kept in a savings account you can reach <i>the same day</i>.'},
    {q:'Where should your emergency fund live?',opts:['In stocks for better returns','A high-interest savings account you can reach today','Locked in a GIC for 5 years'],correct:1,yes:'Right.',why:'It must be safe and instant. Stocks could drop 30% right when you need the money.'},
    {say:'<b>How much is enough?</b> Take your monthly essentials and multiply by 3. That\'s your starter target — track it in the Goals card on Home. 🎯'},
    {q:'Your monthly essentials total $1,500. What\'s your 3-month emergency fund target?',opts:['$500','$1,500','$4,500'],correct:2,yes:'Nailed it!',why:'$1,500 × 3 months = $4,500. Build this before investing seriously — it\'s what lets you ride out market dips without panic-selling.'},
    {say:'Build the fund first, <i>then</i> invest. Without it, a small surprise can force you to sell investments at the worst moment. 🧘'}
  ]},
  f_debt:{xp:40,celeb:'You know which dollars to attack first.',steps:[
    {say:'Not all debt is equal. A mortgage at 4% is manageable. A credit card at <b>20%</b> is draining you every single month. 💳'},
    {say:'Paying off a 20% card is like earning a <b>guaranteed 20% return</b> — better than almost any investment, with zero risk.'},
    {q:'Spare cash: a card charges 20%, investing might earn ~8%. What wins?',opts:['Invest the cash','Pay off the card first'],correct:1,yes:'Yes.',why:'Clearing 20% interest beats earning 8% every time. No investment consistently returns more than your highest rate.'},
    {say:'A simple rule: <b>highest interest first</b> (cards, payday loans), then invest. Low-interest debt (mortgage) can ride alongside once the expensive stuff is gone.'},
    {q:'Which debt should you attack first?',opts:['Student loan at 5%','Credit card at 22%','Mortgage at 3%'],correct:1,yes:'Exactly!',why:'Always hit the highest interest rate first — that\'s where your money works hardest for you (or against you).'},
    {say:'Crush the expensive debt, then redirect those payments into investing. It\'s like giving yourself a raise. 💪'}
  ]},
  f_inflation:{xp:40,celeb:'Now you know the real reason to invest.',steps:[
    {say:'Cash feels safe. But there\'s a silent force quietly shrinking what it can buy, year after year. It\'s called <b>inflation</b>. 🎈'},
    {say:'At a steady 3% inflation, $100 today has the buying power of only about <b>$74</b> in 10 years if it just sits there.',viz:function(){return '<div class="viz-bar"><div class="viz-fill" style="width:74%">$100 → ~$74 of buying power in 10 yrs</div></div>';}},
    {q:'Why is "keeping cash safe" actually risky long-term?',opts:['It can be stolen','Inflation slowly erodes its buying power','Banks always lose cash'],correct:1,yes:'Exactly!',why:'Money that doesn\'t grow faster than inflation loses value every year. Silent, but real.'},
    {say:'Investing aims to <b>outpace inflation</b> — ideally growing 4–5% per year above it. That\'s not getting rich quick; that\'s protecting what you earn. 🛡️'},
    {q:'Inflation is 3%/yr. A savings account pays 1%/yr. Are you winning or losing buying power?',opts:['Winning — you have more dollars','Losing — your money buys less each year','Breaking even'],correct:1,yes:'Right.',why:'1% growth minus 3% inflation = −2% real return. You have more dollars but each one buys less. Stocks historically return ~7% nominal.'},
    {say:'Investing isn\'t gambling — it\'s the responsible move to keep your money\'s value intact over time. 🌱'}
  ]},
  /* ── Unit 2 · Why invest ── */
  v_save:{xp:40,celeb:'You\'ll always match the tool to the timeline now.',steps:[
    {say:'Saving and investing are both good — but they\'re completely different tools for different jobs. Mixing them up is an expensive mistake. 🐷'},
    {say:'<b>Save</b> = safe, stable, instant. Great for emergencies and anything under 3 years. <b>Invest</b> = grows over time, but bounces. Best for goals 5+ years away.'},
    {q:'You\'re saving for a vacation in 8 months. Save or invest?',opts:['Invest it — more growth','Save it — too soon to risk a dip'],correct:1,yes:'Right.',why:'8 months is too short. Markets can drop 20% right before your trip. Keep near-term money safe.'},
    {say:'The golden rule: <b>time horizon determines the tool</b>. Match them and you\'ll never be caught short — and never miss out on growth you deserved.'},
    {q:'Retirement is 30 years away. Where should those savings be?',opts:['Safe in a HISA','Invested — long enough to ride the ups and downs'],correct:1,yes:'Yes!',why:'30 years gives you time to recover from every dip the market has ever thrown. That\'s exactly when investing shines.'},
    {say:'Match the tool to the timeline and your money is always working the right way. ⏱️'}
  ]},
  v_compound:{xp:50,celeb:'You just met the most powerful force in money.',steps:[
    {say:'The closest thing to magic in money: <b>compounding</b> — when your returns start earning their own returns. The longer you wait to start, the less magic you get. ❄️'},
    {say:'$200/month invested at 7%/yr grows to about <b>$243,000</b> in 30 years. You only contributed $72,000 — the rest is compounding doing the heavy lifting.',viz:function(){return '<div class="viz-split"><div style="width:30%;background:#7a5cae">$72K you put in</div><div style="width:70%;background:#4f9c7e">$171K growth</div></div>';}},
    {q:'What matters most for compounding to work?',opts:['Picking the perfect stock','Starting early and staying in','Making one huge deposit'],correct:1,yes:'Exactly!',why:'Time is the secret ingredient. Starting 10 years earlier often beats investing twice as much later.'},
    {say:'You invest $1,000 today vs waiting 10 years to invest the same $1,000. At 7%/yr and 30-year horizon, the early start gives you <b>roughly twice the outcome</b>. 😬'},
    {q:'Friend A invests $1,000 today. Friend B waits 10 years, then invests $1,000. At 7%/yr over 30 years, who has more?',opts:['Friend A — started today','Friend B — saved longer before investing','They end up equal'],correct:0,yes:'Right!',why:'Friend A: ~$7,600. Friend B: ~$3,870. One decade of delay costs almost half the final amount.'},
    {say:'Start now, even small. Your future self will thank you far more for an early start than a bigger amount later. 🙏'}
  ]},
  v_assets:{xp:40,celeb:'You know the three building blocks of investing.',steps:[
    {say:'Three building blocks you\'ll use forever: <b>stocks</b>, <b>ETFs</b>, and <b>bonds</b>. Know what each one does and you\'ve got the basics down. 🧩'},
    {say:'<b>Stock</b> = a tiny slice of ownership in one company. <b>Bond</b> = a loan you make that pays interest. <b>ETF</b> = a basket of many stocks or bonds in one purchase.'},
    {q:'You want instant diversification in one purchase. Which?',opts:['A single stock','An ETF','One company\'s bond'],correct:1,yes:'Yes!',why:'An ETF bundles hundreds of holdings — instant spread, low cost, low effort. Perfect for beginners.'},
    {say:'Risk spectrum: <b>crypto</b> (most volatile) → <b>single stocks</b> (bouncy) → <b>broad ETFs</b> (smoother) → <b>government bonds</b> (calmest). Match to your timeline.'},
    {q:'Which best describes a bond?',opts:['A slice of ownership in a company','A loan you make that pays you interest','A fund holding many assets'],correct:1,yes:'Right.',why:'Bonds are loans. You lend money to a company or government; they pay you interest, then return the principal. Calmer than stocks.'},
    {say:'Most beginners start with a broad, low-cost <b>ETF</b> — simple, diversified, and hard to get wrong. 👌'}
  ]},
  v_timing:{xp:40,celeb:'You\'ll stop trying to outguess the market.',steps:[
    {say:'Tempted to wait for the "perfect" moment to invest? Almost nobody — including professional fund managers — gets it right consistently. 🎯'},
    {say:'Miss just the <b>10 best days</b> of the S&P 500 over 20 years and your return drops by more than half. Those best days usually arrive right after the worst ones.'},
    {q:'What beats trying to time the market?',opts:['Time <i>in</i> the market','Checking prices hourly','Buying only at the bottom'],correct:0,yes:'Right!',why:'"Time in the market beats timing the market" — one of the most reliable rules in investing.'},
    {say:'<b>Dollar-cost averaging</b>: invest the same amount every month, no matter what. When prices fall, your money buys more shares. When prices rise, you\'re already in. 📅'},
    {q:'What is dollar-cost averaging?',opts:['Only buying when prices drop','Investing a fixed amount on a regular schedule, no matter what','Averaging costs across multiple brokers'],correct:1,yes:'Exactly!',why:'Fixed, regular investments remove the need to "time" anything. It\'s boring, automatic, and it works.'},
    {say:'Invest regularly, stay in, and let time do the heavy lifting. Boring beats clever here. 🧘'}
  ]},
  /* ── Unit 3 · Build a smart portfolio ── */
  p_risk:{xp:45,celeb:'You can now match risk to your timeline.',steps:[
    {say:'Risk isn\'t your enemy — it\'s the engine that produces returns. The trick is matching the right level to your <b>time horizon</b>. 🛡️'},
    {say:'Money you need <b>soon</b> → keep it calm (lower risk, lower growth). Money for <b>years away</b> → it can ride the bumps for more growth. Time absorbs risk.'},
    {q:'Your retirement is 30 years away. How much short-term bounciness can you absorb?',opts:['Very little — even small dips feel scary','Quite a lot — 30 years to recover'],correct:1,yes:'Exactly.',why:'A long horizon lets you wait out every dip the market has thrown — historically, every one has recovered.'},
    {say:'Two things shape your risk choice: <b>risk capacity</b> (how long you can hold) and <b>risk tolerance</b> (how much volatility you can sleep through). Both matter.'},
    {q:'You need $20,000 for a house down payment in 18 months. Where should it be?',opts:['In stocks for higher returns','In a high-interest savings account','In crypto — highest potential'],correct:1,yes:'Right.',why:'18 months is not enough recovery time if stocks drop. Short timeline + money you need = low risk. Non-negotiable.'},
    {say:'Right risk for the right timeline — that\'s the heart of smart investing. Get this right and everything else follows. ⏳'}
  ]},
  risk_div:{xp:50,celeb:'You just learned the #1 way to protect your money.',steps:[
    {say:'Quick one — let\'s see what happens when most of your money sits in <b>one</b> place. 👀'},
    {say:function(s){return 'Right now your biggest holding, <b>'+s.big.t+'</b>, is <b>'+Math.round(s.big.pct*100)+'%</b> of your invested money.';},viz:function(s){var p=Math.round(s.big.pct*100);return '<div class="viz-bar"><div class="viz-fill" style="width:'+Math.max(14,p)+'%">'+s.big.t+' · '+p+'%</div></div>';}},
    {q:function(s){return 'If <b>'+s.big.t+'</b> dropped <b>20%</b>, about how much would your <i>whole</i> portfolio fall?';},opts:function(s){return ['About 2%','About '+Math.round(s.big.pct*20)+'%','About 50%'];},correct:1,yes:'That\'s it!',why:function(s){return Math.round(s.big.pct*100)+'% × 20% ≈ '+Math.round(s.big.pct*20)+'%. One holding\'s dip becomes most of your loss.';}},
    {say:'Diversification doesn\'t mean owning 50 things — even <b>3 different asset types</b> (a stock, an ETF, and a bond) dramatically smooths your ride.'},
    {q:'What\'s the main benefit of holding multiple asset types?',opts:['Guaranteed profits','One bad day can\'t sink your whole portfolio','More exciting to track'],correct:1,yes:'Yes!',why:'When one asset drops, others often hold steady or rise. Less risk for the same expected return — that\'s the free lunch of diversification.'},
    {say:'Try it for real: add a different asset type in <b>Trade</b> and watch your concentration drop. Penny\'s cheering you on! 🦊'}
  ]},
  p_mix:{xp:45,celeb:'You can design a mix you\'ll actually stick with.',steps:[
    {say:'Your <b>asset mix</b> — how much in stocks vs bonds vs other — shapes most of your long-run results. Get this right and you can sleep through any dip. 🥗'},
    {say:'A classic start for a 25-year-old: <b>80% stocks / 20% bonds</b> — lean to growth when young, shift toward stability as your goal nears.',viz:function(){return '<div class="viz-split"><div style="width:80%;background:#7a5cae">80% stocks</div><div style="width:20%;background:#5b8def">20% bonds</div></div>';}},
    {q:'You\'re 25, investing for retirement in 40 years. A reasonable tilt?',opts:['Mostly bonds — safe','Mostly stocks — long horizon','All cash — wait and see'],correct:1,yes:'Yes.',why:'40 years gives you time to ride out every dip stocks throw. Lean into growth when your horizon is long.'},
    {say:'<b>Rebalancing</b>: if stocks boom and grow to 90% of your portfolio, sell a little and buy bonds to drift back to your 80/20 target. Once a year is usually enough.'},
    {q:'Your target is 80% stocks. After a great year it\'s grown to 90% stocks. What do you do?',opts:['Do nothing — let it run','Sell some stocks, buy bonds to get back to 80/20','Sell everything and restart'],correct:1,yes:'Right!',why:'Rebalancing keeps your risk at the level you chose. Let stocks run unchecked and one bad year hits far harder.'},
    {say:'Pick a mix you can hold calmly through a dip — that matters more than finding the "perfect" ratio. Consistency wins. 🤝'}
  ]},
  p_fees:{xp:45,celeb:'You\'ll keep more of every dollar you earn.',steps:[
    {say:'Fees feel tiny but they compound <i>negatively</i> — every dollar you pay in fees is a dollar that never gets to compound for you. 🪙'},
    {say:'The math: $10,000 at 7%/yr over 30 years with a <b>0.1% fee</b> → ~$73,000. With a <b>1% fee</b> → ~$57,000. That\'s a <b>$16,000 difference</b> from one percentage point.'},
    {q:'Two funds hold similar things; one charges 1%/yr, one 0.1%/yr. Smarter pick?',opts:['The 1% one — more expensive must mean better','The 0.1% one — keep more of your return'],correct:1,yes:'Right!',why:'Lower fees = more of the return stays yours. Index funds charge less and historically beat most active funds over 10+ years.'},
    {say:'<b>MER</b> (Management Expense Ratio) is the annual fee built into the fund — you never write a cheque, it just quietly reduces your gains. Look for under 0.25%.'},
    {q:'What does MER stand for?',opts:['Market Earnings Rate','Management Expense Ratio','Minimum Equity Requirement'],correct:1,yes:'Exactly.',why:'The MER is automatically deducted from the fund\'s return. For broad Canadian index ETFs (like XEQT, VEQT), it\'s around 0.20%.'},
    {say:'Always check the MER before you buy. Under 0.25% is excellent. Boring, cheap index funds win in the long run. 👍'}
  ]},
  uncertainty:{xp:50,celeb:'You now read forecasts like a pro — ranges, not promises.',onDone:function(){LEARN.flags.uncertainty=true;},steps:[
    {say:'Ever seen an app promise an <b>exact</b> future price? 🤨 Nobody — not a computer, not a hedge fund, not Mia — can know it for certain.'},
    {say:'That\'s why we show a <b>range</b>: a rough (bear) case, a most-likely middle (base), and a strong (bull) case. No single number is "the prediction."'},
    {q:'A <b>wider</b> range between bear and bull means…',opts:['More certainty — the model is confident','Less certainty — more possible outcomes','Guaranteed profit near the middle'],correct:1,yes:'Yes!',why:'Wider = more spread of possible outcomes = higher uncertainty. The model is saying "it could go quite differently either way."'},
    {say:'What <b>moves</b> a price? Earnings surprises, interest rate changes, investor sentiment, news cycles. The range captures those uncertainties — a map of possibilities, not a promise.'},
    {say:'We never show one "prediction" because that would be dishonest. We show the range <b>and</b> what moves it — so you invest with eyes open. 🌱'}
  ]},
  /* ── Unit 4 · Canadian accounts ── */
  c_tfsa:{xp:45,celeb:'You\'ve unlocked Canada\'s friendliest account.',steps:[
    {say:'In Canada, the <b>TFSA</b> (Tax-Free Savings Account) is arguably the most powerful savings tool available to any Canadian. 🍁'},
    {say:'Everything inside it — growth, dividends, interest — is completely <b>tax-free</b>, even when you withdraw. No tax. Ever. On any of the gains.'},
    {q:'You make $500 of gains inside a TFSA. Tax owed when you withdraw?',opts:['$0 — completely tax-free','About $100','Depends on your income'],correct:0,yes:'Exactly!',why:'Zero. That\'s the magic. Unlike regular accounts or RRSPs, TFSA withdrawals are never taxed.'},
    {say:'You get <b>new contribution room every January</b> ($7,000 in 2024). Withdraw anytime — that room comes back the following year. No tax slip. No penalty.'},
    {q:'You withdraw $5,000 from your TFSA this year. What happens to that contribution room?',opts:['It\'s gone forever','It comes back on January 1st next year','You must re-contribute within 90 days'],correct:1,yes:'Right.',why:'TFSA room is re-credited January 1. Unlike an RRSP, you can re-contribute what you withdrew next year — flexible for life.'},
    {say:'Flexible + tax-free makes the TFSA a great <b>first account</b> for most people, especially if you\'re under 40. 🎉'}
  ]},
  c_rrsp:{xp:45,celeb:'You understand the RRSP\'s tax twist.',steps:[
    {say:'The <b>RRSP</b> (Registered Retirement Savings Plan) is built for retirement, with a tax trick that works best when you\'re earning well. 🏦'},
    {say:'Contributions <b>reduce your taxable income right now</b> — potentially a real refund this spring. You pay tax later, when you withdraw in retirement, usually at a lower rate.'},
    {q:'When does an RRSP help most?',opts:['When your income is low — smaller tax bill','When your income is high — bigger refund now','When you want to access money anytime'],correct:1,yes:'Right.',why:'Higher income = bigger deduction today. Then you withdraw in retirement at a lower rate. That spread is what makes it powerful.'},
    {say:'You must convert your RRSP to a <b>RRIF</b> by age 71 and withdraw a minimum each year. The money was always meant for retirement — the rules ensure that.'},
    {q:'You contribute $10,000 to your RRSP at a 30% marginal tax rate. Your approximate refund?',opts:['$0','$3,000','$10,000'],correct:1,yes:'Yes!',why:'RRSP refund = contribution × marginal rate. $10,000 × 30% = $3,000 back. At 45% it\'s $4,500. Worth more the more you earn.'},
    {say:'RRSP + TFSA together is a powerful combination. RRSP for the tax break in high-earning years, TFSA for flexibility. 📈'}
  ]},
  c_which:{xp:45,celeb:'You can pick the right account with confidence.',steps:[
    {say:'TFSA or RRSP first? Most people wonder this at some point. Here\'s a simple rule of thumb. ⚖️'},
    {say:'Lower income now → lean <b>TFSA</b> (the RRSP deduction isn\'t worth much; bank that room for later). Higher income → the <b>RRSP</b> deduction is worth more right now.'},
    {q:'You\'re a student earning $18,000 this year. Which usually wins?',opts:['RRSP — always prioritize retirement','TFSA — low income means a small RRSP deduction; save that room'],correct:1,yes:'Yes!',why:'At $18k, you\'re in a low tax bracket — the RRSP deduction barely saves anything. TFSA is flexible and gains are still tax-free.'},
    {say:'Rough split: under ~$50k → favour TFSA. Over ~$70k → RRSP is usually worth the deduction. Between $50–70k? Both are reasonable.'},
    {q:'You\'re earning $95,000 and want to reduce your tax bill now. Which wins?',opts:['TFSA — tax-free growth is always best','RRSP — the deduction at your income rate is significant'],correct:1,yes:'Exactly.',why:'At $95k you\'re likely in a 43%+ marginal rate. Each $1,000 RRSP contribution saves ~$430 in tax this year — an immediate, guaranteed return.'},
    {say:'Plenty of people use <b>both</b> over time — TFSA for flexibility, RRSP for the tax break in high-earning years. Start where the rule points today. 🤝'}
  ]},
  c_order:{xp:45,celeb:'You know exactly where each new dollar should go.',steps:[
    {say:'Money is finite. When you have spare cash, a simple priority ladder helps you always put it in the highest-value spot. 📊'},
    {say:'<b>1)</b> Emergency fund → <b>2)</b> High-interest debt → <b>3)</b> Any employer match → <b>4)</b> TFSA / RRSP → <b>5)</b> Everything else (taxable account, RESP, etc.)'},
    {q:'Your employer matches 4% of salary in retirement contributions. Where does that rank?',opts:['Last — focus on debt first','Right after emergency fund and expensive debt','Third — always behind TFSA'],correct:1,yes:'Exactly!',why:'An employer match is an instant 100% return. Don\'t leave free money behind — it comes right after your emergency fund and high-rate debt.'},
    {say:'The only things above an employer match: not carrying expensive debt (anything over ~8%) and having your emergency fund set. Those two protect you from crisis.'},
    {q:'After building your emergency fund, the most important step before investing is:',opts:['Open a brokerage account right away','Pay off high-interest debt (over ~8%)','Read every investing book you can find'],correct:1,yes:'Right.',why:'Eliminating 20% credit card debt gives a guaranteed 20% "return" — better than almost any investment. Then you\'re free to invest with a clear head.'},
    {say:'Work down the ladder and your money always lands in the highest-value spot. Not exciting, but reliably wealth-building. ✅'}
  ]},
  /* ── Unit 5 · Plan & reach your goals ── */
  g_smart:{xp:45,celeb:'Your goals just got real and reachable.',steps:[
    {say:'A vague "I should save more" rarely works. Your brain needs a clear target to aim at. That\'s where <b>SMART goals</b> come in. 🎯'},
    {say:'<b>S</b>pecific · <b>M</b>easurable · <b>A</b>chievable · <b>R</b>elevant · <b>T</b>ime-based. Example: "Save <b>$6,000</b> for a Japan trip in <b>2 years</b>."'},
    {q:'Which is a SMART goal?',opts:['"Get rich someday"','"Save $6,000 for a trip in 2 years"','"Invest when I have spare cash"'],correct:1,yes:'Right!',why:'It has a specific amount, a purpose, and a deadline. That\'s enough to plan backwards from and automate.'},
    {say:'<b>Work backwards</b>: $6,000 ÷ 24 months = $250/month. Now you know exactly what to automate. No guessing, no guilt, no willpower required.'},
    {q:'You want to save $4,800 in 2 years. How much per month?',opts:['$150/month','$200/month','$400/month'],correct:1,yes:'Nailed it!',why:'$4,800 ÷ 24 months = $200. Work backwards from the goal and the monthly number reveals itself. Automate it the day you\'re paid.'},
    {say:'Set yours in the <b>goal card</b> on Home — Fiscally will track it for you. Clear target → automatic deposit → it happens. 🗺️'}
  ]},
  g_buckets:{xp:45,celeb:'Every goal now has the right home.',steps:[
    {say:'Not all savings goals belong in the same place. Mixing them up is one of the most common — and painful — mistakes in personal finance. 🪣'},
    {say:'<b>Short-term goals</b> (under ~3 years): keep in a HISA or GIC — safe and liquid. <b>Long-term goals</b> (5+ years): invest so it can actually grow.'},
    {q:'Down payment you need in 2 years. Where does the money live?',opts:['Invested in stocks — better returns','In a high-interest savings account or short GIC'],correct:1,yes:'Yes.',why:'Too soon to risk a market dip. If stocks fall 30% in month 22, you can\'t buy the house. Near-term money stays safe.'},
    {say:'Safety net for short-term: a <b>HISA</b> paying 3–5% is real growth with zero market risk. A 1-year GIC can lock in even better rates — explore them at your bank.'},
    {q:'Your retirement is 35 years away. Where should those savings be?',opts:['HISA — safety first','Invested in a diversified portfolio — time absorbs the risk'],correct:1,yes:'Right.',why:'35 years of compounding in a diversified portfolio will vastly outpace any savings account. Time is what makes investing appropriate for long-horizon goals.'},
    {say:'Sort each goal into a bucket — near-term safe, long-term invested — and the "save or invest?" question answers itself every time. 👌'}
  ]},
  g_howmuch:{xp:45,celeb:'You have a contribution plan that sticks.',steps:[
    {say:'One of the biggest questions: <b>how much should I invest?</b> The short answer: enough to matter, not so much it hurts. 💧'},
    {say:'A common starting point: <b>5–10% of take-home income</b>, automated on payday. Even $50/month matters — the habit matters more than the amount at first.'},
    {q:'What makes investing actually stick long-term?',opts:['Large one-time windfalls','Automating a regular amount every paycheque','Waiting until you have "spare" cash'],correct:1,yes:'Exactly!',why:'Automatic and regular beats willpower. You invest before you see the money, so it never feels like a sacrifice.'},
    {say:'As your income grows, nudge it up — even 1% more per raise. Going from 5% to 6% to 8% over a few years is how steady wealth gets built without feeling deprived.'},
    {q:'You get a $200/month raise. The smartest move?',opts:['Spend it all — you earned it','Invest half, spend half — grow without feeling deprived','Put it all in savings'],correct:1,yes:'Yes!',why:'Balanced is sustainable. Going from nothing to investing half of a raise is far more impactful than an all-or-nothing approach.'},
    {say:'Set it, automate it, forget it — and nudge it up every time you earn more. Consistency is literally the whole game. 🔁'}
  ]},
  g_ready:{xp:60,celeb:'You\'re ready to invest for real. 🎉',steps:[
    {say:'You\'ve learned the foundations, practised on real data, and built some confidence. How do you know you\'re actually ready for real money? 🎓'},
    {say:'A quick four-box checklist: ✓ Emergency fund built → ✓ High-interest debt cleared → ✓ A goal with a timeline → ✓ A calm mix you can hold through a dip.'},
    {q:'The best sign you\'re ready to invest real money?',opts:['Someone gave you a hot stock tip','You have a plan and stayed calm through practice dips','The market just went up a lot'],correct:1,yes:'That\'s it. 🎉',why:'Readiness is about your plan and mindset, not a tip or market timing. If you held calmly through dips in practice, you\'ve got the muscle.'},
    {say:'Starting small is fine — even $500 in a diversified ETF inside a TFSA is a real investment. The goal is to <b>begin</b>, not to be perfect.'},
    {q:'Where should most beginners open their first real account?',opts:['A taxable brokerage account','A TFSA — tax-free gains, flexible withdrawals','An RRSP — always prioritize retirement'],correct:1,yes:'Right.',why:'TFSA first for most beginners. Tax-free gains, withdraw whenever you need to, no tax slip. Simple, flexible, powerful.'},
    {say:'When you can check those four boxes — open a real TFSA and start small. You\'ve practised with us; now the stage is yours. 🌟'}
  ]}
};
/* ── lesson/path progression ── */
/* ── Learn: duotone icon set (filled silhouette + line detail, inherits node colour) ── */
var ICN={
 receipt:{f:'<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2Z"/>',s:'<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2Z"/><path d="M9 7.5h6"/><path d="M9 11.5h6"/><path d="M9 15.5h4"/>'},
 umbrella:{f:'<path d="M3.5 12a8.5 8.5 0 0 1 17 0Z"/>',s:'<path d="M12 12v7a2 2 0 0 0 4 0"/><path d="M3.5 12a8.5 8.5 0 0 1 17 0Z"/><path d="M12 3v2"/>'},
 card:{f:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/>',s:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 14.5h4"/>'},
 balloon:{f:'<path d="M12 3c-2.9 0-5.2 2.2-5.2 5.3 0 3.4 2.8 6 5.2 6.5 2.4-.5 5.2-3.1 5.2-6.5C17.2 5.2 14.9 3 12 3Z"/>',s:'<path d="M12 3c-2.9 0-5.2 2.2-5.2 5.3 0 3.4 2.8 6 5.2 6.5 2.4-.5 5.2-3.1 5.2-6.5C17.2 5.2 14.9 3 12 3Z"/><path d="M10.8 14.6 12 16l1.2-1.4"/><path d="M12 16c-1.1.8-1.1 2.1 0 2.9s1.1 2.1 0 2.9"/>'},
 coins:{f:'<path d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3v12c0 1.7-3.1 3-7 3s-7-1.3-7-3V6Z"/>',s:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>'},
 trend:{f:'<path d="M3 17L9 11l4 4 8-8v14H3Z"/>',s:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'},
 layers:{f:'<path d="M12 2 2 7l10 5 10-5L12 2Z"/>',s:'<path d="M12 2 2 7l10 5 10-5L12 2Z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/>'},
 clock:{f:'<circle cx="12" cy="12" r="9"/>',s:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'},
 shield:{f:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 7.7-7.5 9-4.3-1.3-7.5-4.4-7.5-9V6L12 3Z"/>',s:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 7.7-7.5 9-4.3-1.3-7.5-4.4-7.5-9V6L12 3Z"/><path d="M9 12l2 2 4-4"/>'},
 pie:{f:'<path d="M22 12A10 10 0 0 0 12 2v10Z"/>',s:'<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10Z"/>'},
 sliders:{f:'<circle cx="4" cy="13" r="2.3"/><circle cx="12" cy="7" r="2.3"/><circle cx="20" cy="15" r="2.3"/>',s:'<path d="M4 21v-6M4 11V3M12 21v-9M12 9V3M20 21v-4M20 13V3"/><circle cx="4" cy="13" r="2.3"/><circle cx="12" cy="7" r="2.3"/><circle cx="20" cy="15" r="2.3"/>'},
 percent:{f:'<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',s:'<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'},
 chart:{f:'<path d="M7 14L10 11l3 3 5-5v12H7Z"/>',s:'<path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/>'},
 trophy:{f:'<path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/>',s:'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v1a3 3 0 0 0 3 3"/><path d="M17 5h3v1a3 3 0 0 1-3 3"/>'},
 leaf:{f:'<path d="M11 20A7 7 0 0 1 4 13C4 6 11 4 20 4c0 9-2 16-9 16Z"/>',s:'<path d="M11 20A7 7 0 0 1 4 13C4 6 11 4 20 4c0 9-2 16-9 16Z"/><path d="M4 13c5-1 9-3 12-7"/>'},
 bank:{f:'<path d="M12 3l8 5H4l8-5Z"/>',s:'<path d="M3 21h18"/><path d="M4 10h16"/><path d="M5.5 10v8M9.5 10v8M14.5 10v8M18.5 10v8"/><path d="M12 3l8 5H4l8-5Z"/>'},
 scale:{f:'<path d="M5 7.5l-3 5a3 3 0 0 0 6 0Z"/><path d="M19 7.5l3 5a3 3 0 0 1-6 0Z"/>',s:'<path d="M12 4v17"/><path d="M7.5 21h9"/><path d="M5 7.5h14"/><path d="M5 7.5l-3 5a3 3 0 0 0 6 0Z"/><path d="M19 7.5l3 5a3 3 0 0 1-6 0Z"/><path d="M5 7.5 12 5l7 2.5"/>'},
 order:{f:'<rect x="9.5" y="5" width="11.5" height="2.2" rx="1.1"/><rect x="9.5" y="10.9" width="11.5" height="2.2" rx="1.1"/><rect x="9.5" y="16.8" width="11.5" height="2.2" rx="1.1"/>',s:'<path d="M4 10V5l-1.3 1"/><path d="M3 15c.3-1 2.3-.9 2.3.3 0 .9-2.3 1.5-2.3 2.7h2.4"/><path d="M10 6.1h11"/><path d="M10 12h11"/><path d="M10 17.9h11"/>'},
 target:{f:'<circle cx="12" cy="12" r="9"/>',s:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'},
 bucket:{f:'<path d="M5 8h14l-1.3 11.2a1 1 0 0 1-1 .8H7.3a1 1 0 0 1-1-.8L5 8Z"/>',s:'<path d="M5 8h14l-1.3 11.2a1 1 0 0 1-1 .8H7.3a1 1 0 0 1-1-.8L5 8Z"/><path d="M4 8c0-2.2 3.6-4 8-4s8 1.8 8 4"/>'},
 calc:{f:'<rect x="5" y="3" width="14" height="18" rx="2"/>',s:'<rect x="5" y="3" width="14" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01"/>'},
 cap:{f:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/>',s:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/><path d="M22 10v6"/>'},
 check:{s:'<polyline points="20 6 9 17 4 12"/>'},
 play:{f:'<polygon points="6 4 20 12 6 20"/>',s:'<polygon points="6 4 20 12 6 20"/>'},
 lock:{f:'<rect x="5" y="11" width="14" height="9" rx="2"/>',s:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'},
 book:{f:'<path d="M5 4a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2V4Z"/>',s:'<path d="M5 4a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2V4Z"/><path d="M19 18H7a2 2 0 0 0-2 2"/>'}
};
function lic(n){var o=ICN[n]||{};return '<svg viewBox="0 0 24 24" class="duo">'+(o.f?'<g class="duo-f">'+o.f+'</g>':'')+'<g class="duo-s">'+(o.s||'')+'</g></svg>';}
function learnUnits(){return [
  {k:'Unit 1',t:'Money foundations',acc:'#7a6ff0',lessons:[
    {id:'f_budget',ic:lic('receipt'),label:'Where your money goes'},
    {id:'f_emergency',ic:lic('umbrella'),label:'Your safety net'},
    {id:'f_debt',ic:lic('card'),label:'The cost of debt'},
    {id:'f_inflation',ic:lic('balloon'),label:'Inflation, the silent tax'}]},
  {k:'Unit 2',t:'Why invest',acc:'#3b8fe0',lessons:[
    {id:'v_save',ic:lic('coins'),label:'Saving vs investing'},
    {id:'v_compound',ic:lic('trend'),label:'Compounding'},
    {id:'v_assets',ic:lic('layers'),label:'Stocks, ETFs & bonds'},
    {id:'v_timing',ic:lic('clock'),label:'Time in the market'}]},
  {k:'Unit 3',t:'Build a smart portfolio',acc:'#14a39b',lessons:[
    {id:'p_risk',ic:lic('shield'),label:'Why risk matters'},
    {id:'risk_div',ic:lic('pie'),label:'Spread it out'},
    {id:'p_mix',ic:lic('sliders'),label:'Your asset mix'},
    {id:'p_fees',ic:lic('percent'),label:'Index funds & fees'},
    {id:'uncertainty',ic:lic('chart'),label:'Reading forecasts'},
    {id:'MILE',ic:lic('trophy'),label:'Hold 3+ asset types',mile:true}]},
  {k:'Unit 4',t:'Canadian accounts · TFSA & RRSP',acc:'#db6090',lessons:[
    {id:'c_tfsa',ic:lic('leaf'),label:'TFSA: tax-free growth'},
    {id:'c_rrsp',ic:lic('bank'),label:'RRSP: retirement'},
    {id:'c_which',ic:lic('scale'),label:'TFSA vs RRSP'},
    {id:'c_order',ic:lic('order'),label:'Which account first'}]},
  {k:'Unit 5',t:'Plan & reach your goals',acc:'#28a565',lessons:[
    {id:'g_smart',ic:lic('target'),label:'Set a SMART goal'},
    {id:'g_buckets',ic:lic('bucket'),label:'Short vs long-term'},
    {id:'g_howmuch',ic:lic('calc'),label:'How much to invest'},
    {id:'g_ready',ic:lic('cap'),label:'Ready for real money?'}]}
];}
function lessonStates(){
  var units=learnUnits(),map={},gate=true,activeId=null;
  units.forEach(function(u){u.lessons.forEach(function(l){
    if(l.mile){var done=pfClasses()>=3;map[l.id]=done?'done':(gate?'mileopen':'lock');if(!done)gate=false;return;}
    if(LEARN.done[l.id]){map[l.id]='done';}
    else if(gate){map[l.id]='active';if(!activeId)activeId=l.id;gate=false;}
    else{map[l.id]='lock';}
  });});
  return {map:map,activeId:activeId};
}
function unitDone(u){return u.lessons.every(function(l){return l.mile?pfClasses()>=3:!!LEARN.done[l.id];});}
function unitActive(u,st){return u.lessons.some(function(l){var s=st.map[l.id];return s==='active'||s==='mileopen';});}
var PCT=[50,63,71,63,50,37,29,37],PSTEP=126,PTOP=12,BOW=18;
function pcy(i){return PTOP+i*PSTEP+33;}
/* ── winding "road" that links the lesson nodes (Duolingo-style trail) ──
 * Drawn as one SVG behind the nodes. x is a 0–100 percentage, y is in px, so the
 * viewBox is 0 0 100 H with preserveAspectRatio="none"; vector-effect keeps the
 * road a constant width despite the non-uniform scale. Catmull-Rom → bézier gives
 * a smooth curve, and the finished part glows in the unit colour, the locked part
 * stays soft.
 *
 * Each lesson label sits in the gap directly below its node, so between two nodes
 * we add a "bow" waypoint that swings the road out to the node's outer side, high
 * up near the node — the road peels off sideways and loops *around* the title
 * instead of running through it. */
function _f(n){return Math.round(n*10)/10;}
function trailSeg(pts,i){
  var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||pts[i+1],t=0.17;
  var c1x=p1.x+(p2.x-p0.x)*t,c1y=p1.y+(p2.y-p0.y)*t,c2x=p2.x-(p3.x-p1.x)*t,c2y=p2.y-(p3.y-p1.y)*t;
  return 'M'+_f(p1.x)+' '+_f(p1.y)+'C'+_f(c1x)+' '+_f(c1y)+' '+_f(c2x)+' '+_f(c2y)+' '+_f(p2.x)+' '+_f(p2.y);
}
/* node points interleaved with bow waypoints: [node0, bow0, node1, bow1, …, nodeN-1].
 * Segment k therefore belongs to lesson gap floor(k/2) (k even = node→bow, odd = bow→node). */
function trailPoints(nodes){
  var pts=[];
  for(var i=0;i<nodes.length;i++){
    pts.push(nodes[i]);
    if(i<nodes.length-1){
      var xi=nodes[i].x,xn=nodes[i+1].x,dir=(xi<50)?-1:(xi>50)?1:(xn>=xi?1:-1);
      pts.push({x:Math.max(8,Math.min(92,xi+dir*BOW)),y:nodes[i].y+PSTEP*0.34});/* swing out high, near the node, to clear its label */
    }
  }
  return pts;
}
function trailSVG(u,st,pts,H){
  if(pts.length<2)return '';
  var full='',lit='';
  for(var k=0;k<pts.length-1;k++){
    var d=trailSeg(pts,k);full+=d;
    var l=u.lessons[Math.floor(k/2)];if(l&&st.map[l.id]==='done')lit+=d;/* trail "fills in" up to where you've reached */
  }
  return '<svg class="path-trail" viewBox="0 0 100 '+H+'" preserveAspectRatio="none" style="--acc:'+u.acc+'">'
    +'<path class="pt-track" d="'+full+'"/>'
    +(lit?'<path class="pt-lit" d="'+lit+'"/>':'')
    +'<path class="pt-dash" d="'+full+'"/></svg>';
}
function renderUnitPath(u,st){
  var N=u.lessons.length,H=PTOP+(N-1)*PSTEP+96,html='<div class="path" style="height:'+H+'px">';
  var nodes=u.lessons.map(function(l,i){return {x:PCT[i%8],y:PTOP+i*PSTEP+33};});
  html+=trailSVG(u,st,trailPoints(nodes),H);
  var ai=-1;
  u.lessons.forEach(function(l,i){
    var stt=st.map[l.id],locked=(stt==='lock'),mile=!!l.mile;
    var cls=mile?('mile'+(stt==='lock'?' milelock':'')):(stt==='active'?'active':(stt==='done'?'done':'lock'));
    var icon=(locked&&!mile)?lic('lock'):l.ic;
    var click='onclick="nodeTap(\''+l.id+'\','+(mile?'true':'false')+','+(locked?'true':'false')+')"';
    var ring=(stt==='active')?'<div class="node-ring"></div>':'';
    var bub=(stt==='active')?'<div class="start-bubble">START</div>':'';
    html+='<div class="pnode" style="left:'+PCT[i%8]+'%;top:'+(PTOP+i*PSTEP)+'px;--acc:'+u.acc+'">'+bub+ring+'<button class="node-btn '+cls+'" '+click+'>'+icon+'</button><div class="node-label">'+l.label+'</div></div>';
    if(stt==='active')ai=i;
  });
  if(ai>=0){var ax=PCT[ai%8],px=(ax>=50?21:79),py=pcy(ai),jc=LEARN.petJump?' pet-jump':'';
    html+='<div class="pet'+jc+'" style="left:'+px+'%;top:'+py+'px"><div class="pet-b">'+petSVG()+'</div><div class="pet-sh"></div></div>';}
  return html+'</div>';
}
function petSVG(){return '<svg viewBox="0 0 100 100" width="100%" height="100%">'
  /* tail */
  +'<path d="M60 66 C84 72 97 50 90 29 C85 14 66 17 61 34 C57 45 57 57 60 66 Z" fill="#e9822f"/>'
  +'<path d="M90 29 C94 17 86 9 78 13 C82 19 85 25 86 32 C88 31 89 30 90 29 Z" fill="#f6eede"/>'
  /* back paw hint */
  +'<ellipse cx="62" cy="91" rx="8" ry="5.5" fill="#5b3b24"/>'
  /* body */
  +'<ellipse cx="44" cy="64" rx="21" ry="23" fill="#ee8a37"/>'
  /* chest/belly */
  +'<path d="M37 47 C29 56 30 80 40 86 C44 88 50 88 54 86 C64 80 65 56 57 47 C51 42 43 42 37 47 Z" fill="#f6eede"/>'
  /* front legs */
  +'<rect x="33" y="74" width="11" height="22" rx="5.5" fill="#ee8a37"/>'
  +'<rect x="49" y="74" width="11" height="22" rx="5.5" fill="#ee8a37"/>'
  +'<path d="M33 86 h11 v4.5 a5.5 5.5 0 0 1 -11 0 Z" fill="#5b3b24"/>'
  +'<path d="M49 86 h11 v4.5 a5.5 5.5 0 0 1 -11 0 Z" fill="#5b3b24"/>'
  /* ears */
  +'<path d="M24 27 L12 1 L42 17 Z" fill="#ee8a37"/>'
  +'<path d="M70 27 L82 1 L52 16 Z" fill="#ee8a37"/>'
  +'<path d="M27 24 L19 8 L38 18 Z" fill="#f1cea9"/>'
  +'<path d="M67 24 L75 8 L56 17 Z" fill="#f1cea9"/>'
  /* head */
  +'<path d="M20 37 C20 18 33 9 47 9 C61 9 74 18 74 37 C74 51 62 61 47 61 C32 61 20 51 20 37 Z" fill="#ee8a37"/>'
  /* cheeks + muzzle */
  +'<path d="M47 40 C33 40 26 51 32 59 C36 63 42 64 47 64 C52 64 58 63 62 59 C68 51 61 40 47 40 Z" fill="#f6eede"/>'
  /* eyes */
  +'<ellipse cx="37" cy="38" rx="5" ry="6.3" fill="#3a2a20"/>'
  +'<ellipse cx="57" cy="38" rx="5" ry="6.3" fill="#3a2a20"/>'
  +'<circle cx="39" cy="35.4" r="1.7" fill="#fff"/><circle cx="59" cy="35.4" r="1.7" fill="#fff"/>'
  /* eyebrows */
  +'<path d="M31 28 q6 -3.6 12 -0.6" stroke="#bf6320" stroke-width="2.3" fill="none" stroke-linecap="round"/>'
  +'<path d="M51 27.4 q6 -3 12 0.6" stroke="#bf6320" stroke-width="2.3" fill="none" stroke-linecap="round"/>'
  /* nose + mouth */
  +'<path d="M47 53 C42.5 53 40.5 49.6 43.4 47.4 C45 46.1 49 46.1 50.6 47.4 C53.5 49.6 51.5 53 47 53 Z" fill="#5b3b24"/>'
  +'<path d="M47 53 v3.6 M47 56.6 q-5 4 -9 1.4 M47 56.6 q5 4 9 1.4" stroke="#5b3b24" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
  +'</svg>';}
function nodeTap(id,mile,locked){
  if(mile){openMilestone(pfClasses()>=3);return;}
  if(locked){showToast('Finish the lesson before it first 🙂');return;}
  if(LESSONS_L[id]&&LESSONS_L[id].steps){startLesson(id);return;}
  openL('<div class="ls-tag">Reviewed ✓</div><div class="lp-mia"><div class="lp-face">'+avatar()+'</div></div><div class="lp-bubble" style="margin-top:10px">'+(RECAP[id]||'You\'ve got this one down. ✓')+'</div><button class="btn-ghost-l" onclick="closeL()">Close</button>');
}
function miaGuide(){
  var st=lessonStates(),act=st.activeId,msg;
  if(pfClasses()>=3)msg='Look at you, your money\'s spread across <b>'+pfClasses()+'</b> types now. '+PET.name+' is wagging her tail! 🦊 Keep that streak alive.';
  else if(act==='risk_div')msg='Next stop on the trail: learn to <b>spread your money</b> so one dip can\'t sink you. '+PET.name+' and I are right behind you! 🐾';
  else if(act==='uncertainty')msg='Now let\'s learn why we never <i>predict</i> a price, only show a range. Tap the glowing lesson! 🔭';
  else msg='Tap the glowing lesson to keep going, '+PET.name+'\'s following your trail! 🐾';
  return '<div class="mia-guide"><div class="mg-face">'+avatar()+'</div><div class="mg-bubble"><div class="mg-name">Mia · your guide</div>'+msg+'</div></div>';
}
/* ── interactive lesson player (Mia-guided, step by step) ── */
var LP={id:null,i:0,answered:false};
function sval(x,s){return (typeof x==='function')?x(s):x;}
function startLesson(id){LP={id:id,i:0,answered:false,correct:0,wrong:0};document.getElementById('lsheetOv').classList.add('open');renderStep();}
function renderStep(){
  var L=LESSONS_L[LP.id],steps=L.steps,s=steps[LP.i],n=steps.length,sx=pfStats();
  var pct=Math.round(LP.i/n*100);
  var h='<div class="lp"><div class="lp-hd"><button class="lp-x" onclick="closeL()">✕</button><div class="lp-bar"><i style="width:'+pct+'%"></i></div><div class="lp-step">'+(LP.i+1)+'/'+n+'</div></div><div class="lp-body">';
  h+='<div class="lp-mia"><div class="lp-face">'+avatar()+'</div></div>';
  h+='<div class="lp-bubble">'+sval(s.say||s.q,sx)+'</div>';
  if(s.viz)h+=s.viz(sx);
  if(s.opts){var opts=sval(s.opts,sx);h+='<div class="lp-opts" id="lpOpts">'+opts.map(function(o,k){return '<button class="lp-opt" onclick="lpAnswer('+k+')">'+o+'</button>';}).join('')+'</div>';}
  h+='</div><div class="lp-foot" id="lpFoot">'+(s.opts?'<div class="lp-hint">Tap an answer</div>':'<button class="lp-cta" onclick="lpNext()">'+(LP.i===n-1?'Finish lesson':'Continue')+'</button>')+'</div></div>';
  document.getElementById('lsheetInner').innerHTML=h;
}
function lpAnswer(k){
  var L=LESSONS_L[LP.id],s=L.steps[LP.i],sx=pfStats(),ok=(k===s.correct),o=document.getElementById('lpOpts').children;
  for(var j=0;j<o.length;j++){o[j].disabled=true;if(j===s.correct)o[j].classList.add('right');if(j===k&&!ok)o[j].classList.add('wrong');}
  LP.answered=true;if(ok){LP.correct=(LP.correct||0)+1;learnXP(10);}else{LP.wrong=(LP.wrong||0)+1;}
  var last=(LP.i===L.steps.length-1),foot=document.getElementById('lpFoot');
  foot.className='lp-foot '+(ok?'good':'bad');
  foot.innerHTML='<div class="lp-ban"><div class="lp-ban-i">'+(ok?'✓':'✕')+'</div><div><div class="lp-ban-h">'+(ok?(s.yes||'Nice!'):'Not quite')+'</div><div class="lp-ban-w">'+sval(s.why,sx)+'</div></div></div><button class="lp-cta '+(ok?'good':'bad')+'" onclick="lpNext()">'+(last?'Finish lesson':'Continue')+'</button>';
}
function lpNext(){var L=LESSONS_L[LP.id];if(LP.i<L.steps.length-1){LP.i++;LP.answered=false;renderStep();}else finishLesson();}
function finishLesson(){
  var id=LP.id,L=LESSONS_L[id];if(L.onDone)L.onDone();LEARN.done[id]=true;learnXP(L.xp||40);
  var perfect=((LP.wrong||0)===0);
  document.getElementById('lsheetInner').innerHTML='<div class="cele"><div class="cele-burst">🎉</div><div class="cele-fox">'+petSVG()+'</div><div class="cele-h">Lesson complete!</div><div class="cele-sub">'+(L.celeb||'Nice work, you\'re leveling up.')+'</div><div class="cele-stats"><div class="cstat gold"><div class="cstat-v">+'+(L.xp||40)+'</div><div class="cstat-k">XP earned</div></div><div class="cstat '+(perfect?'green':'pur')+'"><div class="cstat-v">'+(perfect?'💯':'👍')+'</div><div class="cstat-k">'+(perfect?'No mistakes':'Nice effort')+'</div></div><div class="cstat orange"><div class="cstat-v">🔥 '+LEARN.streak+'</div><div class="cstat-k">Day streak</div></div></div><button class="lp-cta" style="margin-top:18px" onclick="closeL();afterLessonDone()">Claim reward</button></div>';
}
function afterLessonDone(){checkSkillUnlocks();LEARN.petJump=true;renderLearn();saveState();}
function openMilestone(done){
  if(done){openL('<div class="ls-tag">Milestone · done</div><div class="ls-h">🧺 Spread across 3+ types</div><div class="lp-mia"><div class="lp-face">'+avatar()+'</div></div><p class="ls-p" style="margin-top:10px">You\'re holding <b>3+ asset types</b> in your practice portfolio, earned by <b>doing</b>. '+PET.name+' is proud of you! 🦊</p><button class="btn-ghost-l" onclick="closeL()">Nice</button>');return;}
  openL('<div class="ls-tag">Milestone · do it to unlock</div><div class="ls-h">🧺 Hold 3+ asset types</div><div class="lp-mia"><div class="lp-face">'+avatar()+'</div></div><p class="ls-p" style="margin-top:10px">This one unlocks by <b>doing</b>: hold at least 3 different asset types (a stock, an ETF, a crypto) at once. You hold <b>'+pfClasses()+'</b> right now.</p><button class="btn btn-pur" style="width:100%;margin-top:6px" onclick="closeL();goTab(\'journey\')">Go to Trade</button><button class="btn-ghost-l" onclick="closeL()">Later</button>');
}
/* ── One goal, everywhere ──────────────────────────────────────────────
 * The Learn "Set your goal" sheet and the Practice → Plan tab speak through the
 * rich GOAL object; Home "My Goals" and the Savings Goals page speak through the
 * GOALS array (see 07b-money.js). GOALS[0] is the single source of truth — this
 * mirrors it into GOAL so a goal you set/contribute to in one place shows up in
 * all of them. The extra planning fields (pct/years/why/income) ride along on
 * GOALS[0] so nothing is lost. */
function syncPrimaryGoal(){
  if(typeof GOALS==='undefined'||!GOALS.length)return;/* no primary goal yet — keep GOAL's defaults */
  var g0=GOALS[0];
  GOAL.what=g0.what;
  GOAL.amt=numVal(g0.target);
  GOAL.saved=numVal(g0.saved);
  if(g0.account)GOAL.account=g0.account;
  if(g0.pct!=null)GOAL.pct=g0.pct;
  if(g0.years!=null)GOAL.years=g0.years;
  if(g0.why!=null)GOAL.why=g0.why;
  if(g0.income!=null)GOAL.income=g0.income;
}
function openGoalSetup(){syncPrimaryGoal();GOAL_DRAFT=JSON.parse(JSON.stringify(GOAL));openL(goalSheet());}
function goalSheet(){
  var d=GOAL_DRAFT,m=Math.round((d.income||2500)*d.pct/100);
  var h='<div class="ls-tag">Your goal · the "why"</div><div class="ls-h">Set your goal</div>';
  h+='<div class="gs-q">Why are you investing?</div><div class="why-grid">'+WHYS.map(function(w,i){return '<div class="why '+(d.why===w?'sel':'')+'" onclick="pickWhyG(this,'+i+')">'+w+'</div>';}).join('')+'</div>';
  h+='<div class="gs-q">Make it specific</div>';
  h+='<label class="f-label">What are you saving for?</label><input class="f-in" value="'+d.what+'" oninput="GOAL_DRAFT.what=this.value"/>';
  h+='<label class="f-label">How much will it cost?</label><input class="f-in" inputmode="numeric" value="'+money0(d.amt)+'" oninput="setGAmt(this.value)"/>';
  h+='<label class="f-label">Over how many years?</label><input class="f-in" inputmode="numeric" value="'+d.years+'" oninput="GOAL_DRAFT.years=parseInt(this.value)||1"/>';
  h+='<div class="gs-q">How much to invest?</div><div class="ls-sub">We suggest 5–10% of your earnings to start.</div>';
  h+='<div class="ldonut" id="ldonut">'+ldonutInner(d.pct,m)+'</div>';
  h+='<input type="range" min="3" max="20" value="'+d.pct+'" class="gs-slider" oninput="setGPct(+this.value)"/>';
  h+='<div class="gs-q">Which account?</div>'+ACCTS.map(function(a,i){return '<div class="acct '+a.cls+(d.account===a.k?' sel-acct':'')+'" style="cursor:pointer;margin-bottom:8px;'+(d.account===a.k?'':'opacity:.65')+'" onclick="pickAcctG(this,'+i+')"><div class="a-ic">'+a.k[0]+'</div><div class="a-b"><div class="a-t">'+a.k+'</div><div class="a-d">'+a.d+'</div></div></div>';}).join('');
  h+='<div class="gs-q">Your milestones</div>'+goalMs(d).map(function(x,i){return '<div class="milestone"><div class="ms-n">'+(i+1)+'</div><div class="ms-t">'+x+'</div></div>';}).join('');
  h+='<button class="btn btn-pur" style="width:100%;margin-top:8px" onclick="saveGoal()">Save my goal</button><button class="btn-ghost-l" onclick="closeL()">Cancel</button>';
  return h;
}
function goalMs(d){return ['Open a Fiscally '+d.account+' Journey','Learn about levels of risk','Contribute '+d.pct+'% of your earnings monthly','Open a real '+d.account+' & apply what you\'ve learned!'];}
function pickWhyG(el,i){GOAL_DRAFT.why=WHYS[i];el.parentNode.querySelectorAll('.why').forEach(function(x){x.classList.remove('sel');});el.classList.add('sel');}
function pickAcctG(el,i){GOAL_DRAFT.account=ACCTS[i].k;el.parentNode.querySelectorAll('.acct').forEach(function(x){x.classList.remove('sel-acct');x.style.opacity='.65';});el.classList.add('sel-acct');el.style.opacity='1';}
function setGAmt(v){GOAL_DRAFT.amt=parseInt((''+v).replace(/[^0-9]/g,''))||0;}
function setGPct(v){GOAL_DRAFT.pct=v;var el=document.getElementById('ldonut');if(el)el.innerHTML=ldonutInner(v,Math.round((GOAL_DRAFT.income||2500)*v/100));}
function saveGoal(){
  GOAL=Object.assign(GOAL,GOAL_DRAFT);
  /* write the edit back to the unified GOALS list (creating the primary goal if needed) */
  if(typeof GOALS!=='undefined'){
    if(!GOALS.length)GOALS.unshift({id:moneyUid(),saved:0});
    var g0=GOALS[0];
    g0.what=GOAL.what;g0.target=GOAL.amt;if(g0.saved==null)g0.saved=GOAL.saved||0;g0.account=GOAL.account;
    g0.pct=GOAL.pct;g0.years=GOAL.years;g0.why=GOAL.why;g0.income=GOAL.income;
  }
  closeL();learnXP(20);showToast('🎯 Goal saved · +20 XP');renderGoalCard();renderLearn();saveState();
}
function openL(html){document.getElementById('lsheetInner').innerHTML=html;document.getElementById('lsheetOv').classList.add('open');var sh=document.querySelector('#lsheetOv .sheet');if(sh)sh.scrollTop=0;}
function closeL(){document.getElementById('lsheetOv').classList.remove('open');}
var UNIT_GUIDES={
  'Unit 1':{t:'Unit 1 · Money foundations',body:
    '<div class="lp-say"><b>50 / 30 / 20 rule</b><br>50% needs · 30% wants · 20% save &amp; debt. Move that 20% on payday before it can disappear.</div>'
   +'<div class="lp-say"><b>Emergency fund target</b><br>Monthly essentials × 3 (min). Keep in a savings account you can reach same-day — not invested.</div>'
   +'<div class="lp-say"><b>Debt priority</b><br>Highest interest rate first (cards, payday loans). Low-interest debt (mortgage) can ride alongside investing once expensive debt is gone.</div>'
   +'<div class="lp-say"><b>Why invest at all?</b><br>Inflation runs ~3%/yr. Cash that sits still loses buying power. Investing aims to outpace it by 4–5%/yr above inflation.</div>'
   +'<div class="lp-say" style="background:var(--card)"><b>Quick numbers</b> · 20% card = 20% guaranteed return to pay it off · $100 cash → ~$74 buying power in 10 yrs at 3% inflation</div>'},
  'Unit 2':{t:'Unit 2 · Why invest',body:
    '<div class="lp-say"><b>Save vs invest — the rule</b><br>Under 3 yrs → save (safe, instant). Over 5 yrs → invest (grows, bounces). Match the tool to the timeline.</div>'
   +'<div class="lp-say"><b>Compounding</b><br>Returns earn returns. $200/mo at 7%/yr for 30 yrs → ~$243K. You put in only $72K — the rest is compounding. Starting 10 yrs early can double the outcome.</div>'
   +'<div class="lp-say"><b>Three asset types</b><br>Stock = ownership slice · Bond = loan you make that pays interest · ETF = basket of many (great starting point).</div>'
   +'<div class="lp-say"><b>Time in, not timing</b><br>Miss the 10 best S&P days over 20 yrs → returns drop by more than half. Stay invested. Use dollar-cost averaging: same amount, every month, no matter what.</div>'
   +'<div class="lp-say" style="background:var(--card)"><b>Quick numbers</b> · S&P 500 historical average: ~10%/yr nominal, ~7% after inflation</div>'},
  'Unit 3':{t:'Unit 3 · Build a smart portfolio',body:
    '<div class="lp-say"><b>Risk ↔ timeline</b><br>Short horizon → low risk. Long horizon → can take more volatility for more growth. Risk capacity (how long you can hold) + risk tolerance (how you sleep) both matter.</div>'
   +'<div class="lp-say"><b>Diversification</b><br>Spread across stocks, ETFs, bonds, or crypto. Even 3 different asset types dramatically smooths your ride — one bad day can\'t sink everything.</div>'
   +'<div class="lp-say"><b>Asset mix example</b><br>Age 25 starting point: 80% stocks / 20% bonds. Shift toward bonds as your goal nears. Rebalance back to target once a year.</div>'
   +'<div class="lp-say"><b>Fees compound negatively</b><br>0.1% vs 1% MER on $10K over 30 yrs → $16K difference. Look for MER under 0.25% on broad index ETFs (XEQT, VEQT ≈ 0.20%).</div>'
   +'<div class="lp-say" style="background:var(--card)"><b>Forecasts</b> · We show bear/base/bull ranges — never a single "prediction." Wider range = more uncertainty about the outcome.</div>'},
  'Unit 4':{t:'Unit 4 · Canadian accounts',body:
    '<div class="lp-say"><b>TFSA</b><br>Tax-free growth &amp; withdrawals. $7,000/yr room (2024). Room you withdraw comes back Jan 1 next year. Best first account for most Canadians.</div>'
   +'<div class="lp-say"><b>RRSP</b><br>Contributions lower taxable income now (refund today). Pay tax when you withdraw in retirement at (usually) a lower rate. Convert to RRIF by 71.</div>'
   +'<div class="lp-say"><b>TFSA vs RRSP rule of thumb</b><br>Income under ~$50K → TFSA first. Over ~$70K → RRSP deduction is worth more now. Between $50–70K → both are reasonable. Use both over time.</div>'
   +'<div class="lp-say" style="background:var(--card)"><b>Priority ladder</b><br>1) Emergency fund · 2) High-interest debt · 3) Employer match · 4) TFSA / RRSP · 5) Taxable account</div>'},
  'Unit 5':{t:'Unit 5 · Plan &amp; reach your goals',body:
    '<div class="lp-say"><b>SMART goals</b><br>Specific · Measurable · Achievable · Relevant · Time-based. "Save $6,000 for Japan in 2 years" → $250/month automated.</div>'
   +'<div class="lp-say"><b>Two buckets</b><br>Short-term (under 3 yrs) → HISA or GIC, safe &amp; liquid. Long-term (5+ yrs) → invest in a diversified portfolio, time absorbs the risk.</div>'
   +'<div class="lp-say"><b>How much to invest</b><br>Start at 5–10% of take-home, automated on payday. Nudge it up 1% per raise. The habit &amp; consistency beat the amount.</div>'
   +'<div class="lp-say" style="background:var(--card)"><b>Readiness checklist</b><br>✓ Emergency fund · ✓ High-interest debt gone · ✓ Clear goal with timeline · ✓ A mix you can hold through a dip → open a real TFSA &amp; start.</div>'}
};
function openUnitGuide(k){
  var g=UNIT_GUIDES[k];if(!g)return;
  openL('<div class="ls-tag">Quick reference 📖</div><h3 style="margin:4px 0 14px;font-size:16px;color:var(--text)">'+g.t+'</h3>'+g.body+'<button class="btn-sec" onclick="closeL()" style="width:100%;margin-top:18px">Got it ✓</button>');
}
function renderLearn(){
  var g=GOAL,gpct=Math.min(100,Math.round(g.saved/g.amt*100)),daily=Math.min(LEARN.dailyXP,50);
  var h='<div class="page-title">Learn</div>';
  h+='<div class="learn-grid">';
  /* ── left: the trail ── */
  h+='<div class="learn-trail">';
  h+='<div class="dstrip"><div class="dstat"><span>🔥</span><div><div class="ds-v">'+LEARN.streak+'</div><div class="ds-k">day streak</div></div></div>'
    +'<div class="dstat">'+lring(daily,50)+'<div><div class="ds-v">'+daily+'/50</div><div class="ds-k">daily goal</div></div></div>'
    +'<div class="dstat"><span>⭐</span><div><div class="ds-v">'+totalXP().toLocaleString()+'</div><div class="ds-k">XP</div></div></div></div>';
  h+=miaGuide();
  var L_states=lessonStates();
  learnUnits().forEach(function(u){
    var ud=unitDone(u),ua=unitActive(u,L_states);
    h+='<div class="unit-head'+((!ud&&!ua)?' locked':'')+'" style="--acc:'+u.acc+'"><div class="unit-ic">'+(ud?lic('check'):(ua?lic('play'):lic('lock')))+'</div><div><div class="unit-k">'+u.k+'</div><div class="unit-t">'+u.t+'</div></div><button class="unit-gb" onclick="openUnitGuide(\''+u.k+'\')">'+lic('book')+'</button></div>';
    h+=renderUnitPath(u,L_states);
  });
  h+='</div>';
  /* ── right: sticky rail (skills · glossary · progress) ── */
  h+='<div class="learn-rail">';
  h+='<div class="section-t">Skills you\'ve shown</div><div class="ls-sub">These unlock by <b>doing</b> in your practice portfolio, never a quiz.</div>';
  h+='<div class="skills">'+SKILLS.map(function(s){var g2=skillGot(s.id);return '<div class="skill '+(g2?'got':'locked')+'"><div class="skill-ic">'+s.icon+'</div><div class="skill-badge">'+(g2?'✓':'🔒')+'</div><div class="skill-n">'+s.name+'</div><div class="skill-h">'+s.how+'</div></div>';}).join('')+'</div>';
  h+='<div class="section-t">Glossary</div><div class="card"><div style="display:flex;flex-wrap:wrap;gap:7px">'+['tfsa','rrsp','etf','compound','risk','diversification','bull','bear','inflation','dividend'].map(function(k){return '<span class="whats" style="margin:0" onclick="openTip(\''+k+'\')">'+GLOSS[k].t+'</span>';}).join('')+'</div></div>';
  h+='<div class="card"><div class="row"><span style="font-size:13px;color:var(--muted);font-weight:600">Concepts explored</span><span class="pill pill-pur" id="conceptCount">'+(Object.keys(seen).length)+' explored</span></div></div>';
  h+='</div>';
  h+='</div>';
  LEARN.petJump=false;
  document.getElementById('learnBody').innerHTML=h;
}

/* ── Profile: level, XP-ranked leaderboard, behaviour-driven badges ── */
var TIERS=['Seed 🌰','Seedling 🌱','Sprout 🌱','Sprout 🌱','Sapling 🌿','Sapling 🌿','Grower 🌳','Grower 🌳'];
function tierName(lv){return TIERS[Math.min(lv,TIERS.length-1)]||'Investor 🌳';}
function totalXP(){return ((LEARN.level-1)*500)+(LEARN.xp||0);}
var PEERS=[{n:'Jordan',av:'🧑',xp:1680},{n:'Priya',av:'🐢',xp:1510},{n:'Marcus',av:'🐼',xp:980}];
var BADGES=[
  {ic:'🚀',t:'First Steps',got:function(){return PF.pos.length>0;}},
  {ic:'📊',t:'Know Before You Buy',got:function(){return Object.keys(seen).length>0||!!LEARN.flags.uncertainty;}},
  {ic:'🐻',t:'Bear Aware',got:function(){return PF.pos.some(function(p){return curPx(p.t)<p.avg;});}},
  {ic:'🌐',t:'Diversified',got:function(){return skillGot('diversify');}},
  {ic:'💰',t:'Lock It In',got:function(){return PF.realized>0;}},
  {ic:'❄️',t:'Compounder',got:function(){return !!LEARN.done.v_compound;}}
];
function renderProfile(){
  var lv=document.getElementById('pfLevel');if(lv)lv.textContent='Level '+LEARN.level+' · '+tierName(LEARN.level);
  var xe=document.getElementById('pfLevelXP');if(xe)xe.textContent=totalXP().toLocaleString()+' XP · '+Math.max(0,LEARN.xpToNext-LEARN.xp)+' to Level '+(LEARN.level+1);
  var bar=document.getElementById('pfLevelBar');if(bar)bar.style.width=Math.min(100,Math.round(LEARN.xp/LEARN.xpToNext*100))+'%';
  var rows=PEERS.map(function(p){return {n:p.n,av:p.av,xp:p.xp,me:false};});
  rows.push({n:'You',av:'__ME__',xp:totalXP(),me:true});
  rows.sort(function(a,b){return b.xp-a.xp;});
  var lb=document.getElementById('lbRows');
  if(lb)lb.innerHTML=rows.map(function(r,i){
    var av=r.me?'<div style="width:24px;height:24px;border-radius:50%;overflow:hidden">'+avatar()+'</div>':r.av;
    return '<div class="lb-row"><div class="lb-rank'+(i===0?' gold':'')+(r.me?' me':'')+'">'+(i+1)+'</div><div class="lb-av">'+av+'</div><div class="lb-n">'+r.n+'</div><div class="lb-x">'+r.xp.toLocaleString()+' XP</div></div>';
  }).join('');
  var bg=document.getElementById('badgeGrid');
  if(bg)bg.innerHTML=BADGES.map(function(b){var g=b.got();return '<div class="badge'+(g?'':' locked')+'"><div class="be">'+b.ic+'</div><div class="bt">'+b.t+'</div></div>';}).join('');
}

/* ── Home: Question of the Day (daily bite-sized learning) ── */
var QOTD=[
  {q:'You invest <b>$100</b> and it grows about <b>8%</b> in a year. Roughly what\'s it worth?',opts:['$108','$180','$800'],correct:0,why:'8% of $100 is $8, so about $108. Small percentages snowball over many years — that\'s compounding.'},
  {q:'Which of these usually <b>bounces around</b> the most in price?',opts:['A bond ETF','A big-company stock','A crypto coin'],correct:2,why:'Crypto is the bounciest — bigger ups and bigger downs. Bonds are the calmest of the three.'},
  {q:'What does a <b>TFSA</b> let you do?',opts:['Grow money tax-free','Borrow at 0%','Guarantee profits'],correct:0,why:'A TFSA lets your investments grow and come out completely tax-free. Nothing guarantees profits.'},
  {q:'Spreading money across different investments is called…',opts:['Chasing','Diversifying','Day-trading'],correct:1,why:'Diversifying — it softens the blow if any one thing drops. The closest thing to a free lunch in investing.'},
  {q:'Your emergency fund should cover how many months of essential expenses?',opts:['1–2 weeks','3–6 months','10+ years'],correct:1,why:'3–6 months of essentials gives a real cushion — enough to handle job loss or a major repair without panic-selling investments.'},
  {q:'$100 today at 3% inflation has roughly how much buying power in 10 years?',opts:['$134','About $74','Exactly $100'],correct:1,why:'At 3%/yr inflation, $100 loses about 26% of buying power in 10 years. Investing is how you fight the silent shrinkage.'},
  {q:'Paying off a credit card charging <b>20%</b> is like earning a guaranteed __% return.',opts:['5%','20%','7%'],correct:1,why:'Exactly 20%. No mainstream investment reliably beats eliminating your highest interest rate.'},
  {q:'An ETF is best described as:',opts:['A loan to a company','A basket of many stocks or bonds in one purchase','A single company\'s shares'],correct:1,why:'ETFs bundle hundreds of holdings, giving you instant diversification in one click — ideal for beginners.'},
  {q:'<b>Dollar-cost averaging</b> means:',opts:['Buying only when prices drop','Investing a fixed amount on a regular schedule','Averaging costs across multiple brokers'],correct:1,why:'Regular fixed contributions remove the need to "time" the market. When prices fall, your money automatically buys more shares.'},
  {q:'The S&P 500 has returned about how much per year on average, historically?',opts:['About 2%','About 10%','About 25%'],correct:1,why:'Roughly 10% nominal (or ~7% after inflation). Boring, broad, and reliable over decades.'},
  {q:'You should build your emergency fund <i>before</i> investing mainly because:',opts:['Savings accounts pay more','A job loss could force you to sell investments at the worst time','Investing is only for the wealthy'],correct:1,why:'Without a safety net, any financial shock could force you to cash out investments at exactly the wrong moment.'},
  {q:'What does <b>MER</b> stand for (on a fund)?',opts:['Minimum Entry Requirement','Management Expense Ratio','Market Earnings Rate'],correct:1,why:'MER (Management Expense Ratio) is the annual fee quietly deducted from the fund. Under 0.25% is excellent for index ETFs.'},
  {q:'<b>Rebalancing</b> a portfolio means:',opts:['Selling everything and starting over','Adjusting holdings back to your target asset mix','Buying more of your best performers'],correct:1,why:'If stocks grow to 95% when you wanted 80%, you sell some and buy bonds to return to your target — keeping your risk level steady.'},
  {q:'A <b>bond</b> in investing is:',opts:['A legal contract never to sell','A loan you make to a company or government that pays interest','A type of high-risk stock'],correct:1,why:'Bonds are loans. You lend money; they pay regular interest and return your principal at maturity. Calmer than stocks.'},
  {q:'Short-term goal (under 2 years) — should the money be in stocks?',opts:['Yes — even short-term needs growth','No — markets can drop right when you need it','Yes, but only Canadian stocks'],correct:1,why:'Near-term money stays safe. Markets can fall 30%+ in a year. A savings account or short GIC is the right tool.'},
  {q:'TFSA withdrawal room you use this year comes back:',opts:['Never — once used, it\'s gone','On January 1st of the following year','6 months after withdrawal'],correct:1,why:'One of the most misunderstood TFSA rules: the room you withdraw comes back the next calendar year, letting you re-contribute freely.'},
  {q:'An <b>RRSP</b> is best used for:',opts:['Tax-free short-term savings','Long-term retirement savings with a tax deduction today','An emergency fund'],correct:1,why:'RRSP contributions reduce your taxable income now, and the money grows tax-sheltered until you withdraw in retirement at (usually) a lower rate.'},
  {q:'Which strategy has historically beaten most active fund managers over 10+ years?',opts:['Picking individual stocks','Low-cost index fund investing','Switching funds frequently'],correct:1,why:'Index funds just track the market cheaply. After fees, most actively managed funds underperform the index over a decade.'},
  {q:'$200/month invested for 30 years at 7%/yr grows to roughly:',opts:['$72,000','$243,000','$2,000,000'],correct:1,why:'About $243,000 — but you only contributed $72,000. The rest ($171K) is compounding at work. Time is the multiplier.'},
  {q:'For most Canadian beginners, which account should be opened first?',opts:['A taxable brokerage account','A TFSA','An RRSP'],correct:1,why:'TFSA first for most: tax-free gains, withdraw anytime, no tax slip. Flexible, powerful, and perfect for learning to invest with real money.'}
];
var qPick=0,qOpen=true,qDone=false,qChoice=-1;/* web: show the question's options inline — there's room */
function renderQOTD(){
  var el=document.getElementById('homeQuestion');if(!el)return;
  var Q=QOTD[qPick%QOTD.length];
  var open=qOpen||qDone;
  var top='<div class="q-top"'+(!open?' onclick="openQOTD()" style="cursor:pointer"':'')+'><div class="q-face">'+avatar()+'</div><div class="q-mid"><div class="q-q">'+Q.q+'</div>'+(!open?'<div class="q-cta">Answer ›</div>':'')+'</div></div>';
  var h='<div class="qcard'+(open?' open':'')+'">'+top;
  if(open){
    if(!qDone){
      h+='<div class="q-opts">'+Q.opts.map(function(o,i){return '<button class="q-opt" onclick="answerQOTD('+i+')">'+o+'</button>';}).join('')+'</div>';
    }else{
      h+='<div class="q-opts">'+Q.opts.map(function(o,i){var c=(i===Q.correct)?' right':((i===qChoice)?' wrong':'');return '<div class="q-opt'+c+'">'+o+'</div>';}).join('')+'</div>';
      h+='<div class="q-fb '+(qChoice===Q.correct?'ok':'no')+'">'+(qChoice===Q.correct?'✓ Nice! ':'Not quite, ')+Q.why+'<div class="q-next">Come back tomorrow for a new one 🌱</div></div>';
    }
  }
  el.innerHTML=h+'</div>';
}
function openQOTD(){qOpen=true;renderQOTD();}
function answerQOTD(i){qDone=true;qChoice=i;renderQOTD();}
/* ── Home: Your plan (milestones → graduation) ── */
var PLAN=[
  {t:'Open your practice account',d:'Done, your $10,000 is ready to invest',st:'done'},
  {t:'Learn risk & diversification',d:'Lesson 3 of 5 · tap to continue',st:'now',go:"goTab('learn')"},
  {t:'Practice contributing regularly',d:'Build the habit with practice money',st:'next'},
  {t:'Open a real account & invest for real',d:'Your graduation 🎓',st:'next'}
];
var planOpen=true;/* web: show the full plan stepper by default — no need to hide it */
function renderPlan(){
  var el=document.getElementById('homePlan');if(!el)return;
  var doneN=PLAN.filter(function(s){return s.st==='done';}).length;
  if(planOpen){
    var h='<div class="plan">';/* web: full stepper sits naturally, no collapse toggle */
    PLAN.forEach(function(s,i){
      var ic=s.st==='done'?'✓':(i+1),click=s.go?(' onclick="'+s.go+'" style="cursor:pointer"'):'';
      h+='<div class="pstep '+s.st+'"'+click+'><div class="pstep-l"><div class="pstep-ic">'+ic+'</div>'+(i<PLAN.length-1?'<div class="pstep-line"></div>':'')+'</div><div class="pstep-b"><div class="pstep-t">'+s.t+'</div><div class="pstep-d">'+s.d+'</div></div>'+(s.st==='now'?'<div class="pstep-go">›</div>':'')+'</div>';
    });
    el.innerHTML=h+'</div>';
  }else{
    var cur=PLAN.filter(function(s){return s.st==='now';})[0]||PLAN.filter(function(s){return s.st==='next';})[0]||PLAN[0],
        idx=PLAN.indexOf(cur)+1,
        click=cur&&cur.go?(' onclick="'+cur.go+'" style="cursor:pointer"'):'';
    el.innerHTML='<div class="nextcard"'+click+'><div class="nextcard-k">Your next step</div>'
      +'<div class="nextstep"><div class="nextstep-ic">'+idx+'</div><div class="nextstep-b"><div class="nextstep-t">'+cur.t+'</div><div class="nextstep-d">'+cur.d+'</div></div><div class="pstep-go">›</div></div></div>'
      +'<div class="plan-more-row"><span class="plan-more" onclick="togglePlan()">See full plan · '+doneN+'/'+PLAN.length+' done ›</span></div>';
  }
}
function togglePlan(){planOpen=!planOpen;renderPlan();}

loadState();
syncPrimaryGoal();
renderOB();
renderPortfolio();renderHoldings();sfSelect('AAPL');
renderFc('AAPL');loadIndices();
checkSkillUnlocks();renderLearn();
renderQOTD();renderPlan();renderGoalCard();renderProfile();renderMoneyHome();
if(onboarded)enterApp();
refreshHeldPrices();/* load live prices up front so Home & Practice settle to the same live value at once, not only when Practice opens */
