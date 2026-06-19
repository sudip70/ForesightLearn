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
function renderGoalCard(){
  var el=document.getElementById('homeGoal');if(!el)return;
  var g=GOAL,gpct=Math.min(100,Math.round(g.saved/g.amt*100));
  el.innerHTML='<div class="goal-card" onclick="openGoalSetup()" style="cursor:pointer">'
    +'<div class="row"><div style="font-size:14px;font-weight:800">🎯 '+goalTitle(g)+'</div><span class="pill pill-pur">'+gpct+'%</span></div>'
    +'<div class="bar"><div class="bar-fill" style="width:'+gpct+'%"></div></div>'
    +'<div class="row"><span style="font-size:11px;color:var(--muted)">'+money0(g.saved)+' of '+money0(g.amt)+'</span><span style="font-size:11px;color:var(--purple-strong);font-weight:700">'+g.years+'-yr plan · ✏️ adjust</span></div></div>';
}
function lrow(n,v,p){return '<div class="lz-row"><div class="row"><span class="lz-n">'+n+'</span><span class="lz-v tnum">'+v+'</span></div><div class="lz-p">'+p+'</div></div>';}
var LESSONS_L={
  /* ── Unit 1 · Money foundations ── */
  f_budget:{xp:40,celeb:'You\'ve got a plan for every paycheque now.',steps:[
    {say:'Before investing, know where your money goes. One simple split keeps it easy: <b>50 / 30 / 20</b>. 🧾'},
    {say:'Of each paycheque: <b>50%</b> to needs, <b>30%</b> to wants, <b>20%</b> to saving &amp; paying off debt.',viz:function(){return '<div class="viz-split"><div style="width:50%;background:#7a5cae">50% needs</div><div style="width:30%;background:#5b8def">30% wants</div><div style="width:20%;background:#4f9c7e">20% save</div></div>';}},
    {q:'You take home $2,000 a month. Using 50/30/20, how much goes to saving &amp; debt?',opts:['$100','$400','$1,000'],correct:1,yes:'Exactly!',why:'20% of $2,000 = $400. Automate it and you barely notice it leave.'},
    {say:'Tip: <b>pay yourself first</b>, move that 20% the day you\'re paid, before it can disappear. 💪'}
  ]},
  f_emergency:{xp:40,celeb:'You built the foundation everything else stands on.',steps:[
    {say:'Life happens, a car repair, a lost job. An <b>emergency fund</b> stops a surprise becoming a crisis. 🛟'},
    {say:'Aim for <b>3–6 months</b> of essential expenses, kept in a plain savings account you can reach instantly.'},
    {q:'Where should your emergency fund live?',opts:['Invested in stocks','A savings account you can access anytime','Locked away for 5 years'],correct:1,yes:'Right.',why:'It must be safe and instant, not invested, where it could drop right when you need it most.'},
    {say:'Build this <b>before</b> investing seriously, it\'s what lets you stay calm when markets dip. 🧘'}
  ]},
  f_debt:{xp:40,celeb:'You know which dollars to attack first.',steps:[
    {say:'Not all debt is equal. A mortgage at 4% is very different from a credit card at <b>20%</b>. 💳'},
    {say:'Paying off a 20% card is like earning a <b>guaranteed 20% return</b>, better than almost any investment.'},
    {q:'Spare cash: a card charges 20%, investing might earn ~8%. What wins?',opts:['Invest the cash','Pay off the card'],correct:1,yes:'Yes.',why:'Clearing 20% interest beats earning 8%. Crush high-interest debt before investing.'},
    {say:'Rule of thumb: high-interest debt first, then invest. Low-interest debt (like a mortgage) can ride alongside. 👍'}
  ]},
  f_inflation:{xp:40,celeb:'Now you know the real reason to invest.',steps:[
    {say:'Cash feels safe, but <b>inflation</b> quietly shrinks what it can buy. 🎈'},
    {say:'At ~3% inflation, $100 today buys only about <b>$74</b> of stuff in 10 years if it just sits there.',viz:function(){return '<div class="viz-bar"><div class="viz-fill" style="width:74%">$100 → ~$74 of buying power in 10 yrs</div></div>';}},
    {q:'Why is "safe" cash actually risky long-term?',opts:['It can be stolen','Inflation erodes its buying power','Banks always lose it'],correct:1,yes:'Exactly!',why:'Money that doesn\'t grow faster than inflation loses value every year. Investing aims to outpace it.'},
    {say:'So investing isn\'t about getting rich quick, it\'s about <b>beating inflation</b> over time. 🌱'}
  ]},
  /* ── Unit 2 · Why invest ── */
  v_save:{xp:40,celeb:'You\'ll always match the tool to the timeline now.',steps:[
    {say:'Saving and investing are both good, but they do <b>different jobs</b>. 🐷'},
    {say:'<b>Save</b> (safe, instant) for short-term goals &amp; emergencies. <b>Invest</b> (grows, bounces) for goals 5+ years away.'},
    {q:'Saving for a vacation in 8 months, save or invest?',opts:['Invest it','Save it'],correct:1,yes:'Right.',why:'Short timeline = save. Investing could dip just before you need it. Long timeline = invest.'},
    {say:'Match the tool to the timeline and you\'ll never be caught short. ⏱️'}
  ]},
  v_compound:{xp:50,celeb:'You just met the most powerful force in money.',steps:[
    {say:'The closest thing to magic in money: <b>compounding</b>, earning returns on your past returns. ❄️'},
    {say:'$100 at 8%/yr becomes about <b>$466</b> in 20 years, most of that is growth <i>on the growth</i>.',viz:function(){return '<div class="viz-bar"><div class="viz-fill" style="width:100%">$100 → ~$466 in 20 yrs at 8%/yr</div></div>';}},
    {q:'What matters most for compounding?',opts:['Picking the perfect stock','Time, starting early','One huge deposit'],correct:1,yes:'Exactly!',why:'Time is the secret ingredient. Starting 10 years earlier often beats investing twice as much later.'},
    {say:'The takeaway: <b>start now</b>, even small. Your future self will thank you. 🙏'}
  ]},
  v_assets:{xp:40,celeb:'You know the three building blocks of investing.',steps:[
    {say:'Three building blocks you\'ll use forever: <b>stocks, ETFs and bonds</b>. 🧩'},
    {say:'A <b>stock</b> = a slice of one company. A <b>bond</b> = a loan that pays interest. An <b>ETF</b> = a basket of many, in one buy.'},
    {q:'You want instant diversification in one purchase. Which?',opts:['A single stock','An ETF','One company\'s bond'],correct:1,yes:'Yes!',why:'An ETF bundles hundreds of holdings, instant spread, low effort. Great for beginners.'},
    {say:'Most beginners start with a broad, low-cost <b>ETF</b>, simple and spread out. 👌'}
  ]},
  v_timing:{xp:40,celeb:'You\'ll stop trying to outguess the market.',steps:[
    {say:'Tempted to wait for the "perfect" moment to invest? Almost nobody gets it right. 🎯'},
    {say:'Markets rise over the long run, and the best days often come right after the worst, miss a few and returns crater.'},
    {q:'What beats trying to time the market?',opts:['Time IN the market','Checking prices hourly','Buying only at the bottom'],correct:0,yes:'Right!',why:'Staying invested through ups and downs, "time in the market beats timing the market."'},
    {say:'So invest regularly and <b>stay in</b>. Boring beats clever here. 🧘'}
  ]},
  /* ── Unit 3 · Build a smart portfolio ── */
  p_risk:{xp:45,celeb:'You can now match risk to your timeline.',steps:[
    {say:'Risk isn\'t bad, it\'s the engine of returns. The trick is matching it to your <b>time horizon</b>. 🛡️'},
    {say:'Money you need <b>soon</b> → keep it calm (less risk). Money for <b>years away</b> → it can ride the bumps for more growth.'},
    {q:'Retirement is 30 years away. How much short-term bounciness can you handle?',opts:['Very little','Quite a lot'],correct:1,yes:'Exactly.',why:'A long horizon lets you ride out dips, so you can take more risk for more growth.'},
    {say:'Right risk for the right timeline, that\'s the heart of smart investing. ⏳'}
  ]},
  risk_div:{xp:50,celeb:'You just learned the #1 way to protect your money.',steps:[
    {say:'Quick one, friend, let\'s see what happens when most of your money sits in <b>one</b> place. 👀'},
    {say:function(s){return 'Right now your biggest holding, <b>'+s.big.t+'</b>, is <b>'+Math.round(s.big.pct*100)+'%</b> of your invested money.';},viz:function(s){var p=Math.round(s.big.pct*100);return '<div class="viz-bar"><div class="viz-fill" style="width:'+Math.max(14,p)+'%">'+s.big.t+' · '+p+'%</div></div>';}},
    {q:function(s){return 'If <b>'+s.big.t+'</b> dropped <b>20%</b>, about how much would your <i>whole</i> portfolio fall?';},opts:function(s){return ['About 2%','About '+Math.round(s.big.pct*20)+'%','About 50%'];},correct:1,yes:'That\'s it!',why:function(s){return Math.round(s.big.pct*100)+'% × 20% ≈ '+Math.round(s.big.pct*20)+'%. One holding\'s dip becomes most of your loss.';}},
    {say:'Exactly, concentration turns one bad day into a big one. Spreading across more holdings <b>softens the swings</b>. 🛡️'},
    {say:'Try it for real next: add a different asset type in <b>Trade</b> and watch your risk drop. Penny\'s cheering you on! 🦊'}
  ]},
  p_mix:{xp:45,celeb:'You can design a mix you\'ll actually stick with.',steps:[
    {say:'Your <b>asset mix</b>, how much in stocks vs bonds, drives most of your long-run results. 🥗'},
    {say:'A classic start: more <b>stocks</b> when young (growth), shifting to more <b>bonds</b> as your goal nears (stability).',viz:function(){return '<div class="viz-split"><div style="width:80%;background:#7a5cae">80% stocks</div><div style="width:20%;background:#5b8def">20% bonds</div></div>';}},
    {q:'You\'re 25, investing for retirement. A reasonable tilt?',opts:['Mostly bonds','Mostly stocks','All cash'],correct:1,yes:'Yes.',why:'Young + long horizon = lean to stocks for growth; add bonds as the goal gets closer.'},
    {say:'Pick a mix you can <b>hold through a downturn</b>, that matters more than the perfect ratio. 🤝'}
  ]},
  p_fees:{xp:45,celeb:'You\'ll keep more of every dollar you earn.',steps:[
    {say:'Fees feel tiny but quietly eat returns. <b>1%</b> vs <b>0.1%</b> a year can cost tens of thousands over decades. 🪙'},
    {say:'<b>Index funds / ETFs</b> just track the market at very low cost, and beat most pricey "active" funds over time.'},
    {q:'Two funds hold similar things; one charges 1%, one 0.1%. Smarter pick?',opts:['The 1% one','The 0.1% one'],correct:1,yes:'Right!',why:'Lower fees = more of the return stays yours. With index funds you rarely give up performance for the savings.'},
    {say:'Always check the <b>MER</b> (the fee) before you buy. Low and boring wins. 👍'}
  ]},
  uncertainty:{xp:50,celeb:'You now read forecasts like a pro, ranges, not promises.',onDone:function(){LEARN.flags.uncertainty=true;},steps:[
    {say:'Ever seen an app promise an <b>exact</b> future price? 🤨 Truth is, nobody can know it.'},
    {say:'So instead we show a <b>range</b>: a rough case, a likely middle, and a strong case. 🔭'},
    {q:'A <b>wider</b> range means…',opts:['More certainty','Less certainty','Guaranteed profit'],correct:1,yes:'Yes!',why:'Wider = more spread of possible outcomes = less certain. Narrow ranges are the confident ones.'},
    {say:'We never show a single "prediction", that\'d be a lie. We show the range <b>and</b> what moves it. 🌱'}
  ]},
  /* ── Unit 4 · Canadian accounts ── */
  c_tfsa:{xp:45,celeb:'You\'ve unlocked Canada\'s friendliest account.',steps:[
    {say:'In Canada, the <b>TFSA</b> is a beginner\'s best friend. 🍁'},
    {say:'Everything it earns, growth, dividends, interest, is <b>completely tax-free</b>, even when you withdraw. Take money out anytime.'},
    {q:'You make $500 of gains inside a TFSA. Tax owed on it?',opts:['$0','About $100','Depends on income'],correct:0,yes:'Exactly!',why:'Zero. That\'s the magic of a TFSA, gains are never taxed.'},
    {say:'Flexible + tax-free makes the TFSA a great <b>first account</b> for most people. 🎉'}
  ]},
  c_rrsp:{xp:45,celeb:'You understand the RRSP\'s tax twist.',steps:[
    {say:'The <b>RRSP</b> is built for retirement, with a tax twist. 🏦'},
    {say:'Contributions <b>lower your taxable income now</b> (a refund today); you pay tax later when you withdraw, usually at a lower rate.'},
    {q:'When does an RRSP help most?',opts:['When your income is low','When your income is high (bigger refund now)'],correct:1,yes:'Right.',why:'Higher income → bigger deduction now, and you likely withdraw at a lower rate in retirement.'},
    {say:'Best for steady retirement saving, especially in your higher-earning years. 📈'}
  ]},
  c_which:{xp:45,celeb:'You can pick the right account with confidence.',steps:[
    {say:'So, TFSA or RRSP? A simple rule of thumb based on your income. ⚖️'},
    {say:'Lower income now → lean <b>TFSA</b> (bank the RRSP room for later). Higher income → the <b>RRSP</b> deduction is worth more.'},
    {q:'You\'re a student earning little this year. Which usually first?',opts:['RRSP','TFSA'],correct:1,yes:'Yes!',why:'At low income the RRSP deduction is small, TFSA flexibility wins, and you save RRSP room for higher-earning years.'},
    {say:'Plenty of people use <b>both</b> over time. Start where the rule points today. 🤝'}
  ]},
  c_order:{xp:45,celeb:'You know exactly where each new dollar should go.',steps:[
    {say:'A handy priority order for where new money should go. 📊'},
    {say:'1) Emergency fund → 2) crush high-interest debt → 3) any employer match → 4) TFSA / RRSP → 5) taxable account.'},
    {q:'Your employer matches retirement contributions. Where does that rank?',opts:['Last','Near the top, it\'s free money','Skip it'],correct:1,yes:'Exactly!',why:'A match is an instant 100% return, grab it before most other investing.'},
    {say:'Work down the list and your money always lands in the highest-value spot. ✅'}
  ]},
  /* ── Unit 5 · Plan & reach your goals ── */
  g_smart:{xp:45,celeb:'Your goals just got real and reachable.',steps:[
    {say:'A vague "I should save more" rarely works. A <b>SMART</b> goal does. 🎯'},
    {say:'Specific, Measurable, Achievable, Relevant, Time-based, e.g. "Save <b>$10,000</b> for a car in <b>5 years</b>."'},
    {q:'Which is a SMART goal?',opts:['"Get rich"','"Save $6,000 for a trip in 2 years"','"Invest someday"'],correct:1,yes:'Right!',why:'It names the amount and the deadline, so you can plan backwards and track it.'},
    {say:'Set yours in the <b>goal card</b> on Home and we\'ll help you reach it. 🗺️'}
  ]},
  g_buckets:{xp:45,celeb:'Every goal now has the right home.',steps:[
    {say:'Different goals need different homes for the money. 🪣'},
    {say:'<b>Short-term</b> (under ~3 yrs): keep it safe in savings. <b>Long-term</b> (5+ yrs): invest it so it grows.'},
    {q:'A down payment you need in 2 years, where?',opts:['Invested in stocks','Safe in savings'],correct:1,yes:'Yes.',why:'Too soon to risk a dip, keep near-term money safe. Long-term money can ride the market.'},
    {say:'Sort each goal into a bucket and the "save or invest" question answers itself. 👌'}
  ]},
  g_howmuch:{xp:45,celeb:'You have a contribution plan that sticks.',steps:[
    {say:'How much should you invest? Enough to matter, not so much it hurts. 💧'},
    {say:'A common start: <b>5–10%</b> of your income, automated. Nudge it up a little whenever your income rises.'},
    {q:'What makes investing actually stick?',opts:['Big one-time deposits','Automating a regular amount','Waiting for spare cash'],correct:1,yes:'Exactly!',why:'Automatic, regular contributions beat willpower, you invest before you can spend it.'},
    {say:'Set it, automate it, forget it. Consistency is the whole game. 🔁'}
  ]},
  g_ready:{xp:60,celeb:'You\'re ready to invest for real. 🎉',steps:[
    {say:'You\'ve learned the foundations and practised with no risk. How do you know you\'re <b>ready for real money</b>? 🎓'},
    {say:'A quick checklist: emergency fund ✓, high-interest debt handled ✓, a clear goal ✓, and a mix you can hold calmly through a dip ✓.'},
    {q:'The best sign you\'re ready to invest for real?',opts:['You found a hot stock tip','You have a plan and stayed calm through practice dips','The market just went up'],correct:1,yes:'That\'s it. 🎉',why:'Readiness is about your plan and temperament, not a tip or market timing.'},
    {say:'When you can check those boxes, open a real <b>TFSA</b> and start small. You\'ve got this. 🌟'}
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
var PCT=[50,63,71,63,50,37,29,37],PSTEP=104,PTOP=12;
function pcy(i){return PTOP+i*PSTEP+33;}
function renderUnitPath(u,st){
  var N=u.lessons.length,H=PTOP+(N-1)*PSTEP+96,html='<div class="path" style="height:'+H+'px">';
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
function openGoalSetup(){GOAL_DRAFT=JSON.parse(JSON.stringify(GOAL));openL(goalSheet());}
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
function saveGoal(){GOAL=Object.assign(GOAL,GOAL_DRAFT);closeL();learnXP(20);showToast('🎯 Goal saved · +20 XP');renderGoalCard();renderLearn();saveState();}
function openL(html){document.getElementById('lsheetInner').innerHTML=html;document.getElementById('lsheetOv').classList.add('open');var sh=document.querySelector('#lsheetOv .sheet');if(sh)sh.scrollTop=0;}
function closeL(){document.getElementById('lsheetOv').classList.remove('open');}
function renderLearn(){
  var g=GOAL,gpct=Math.min(100,Math.round(g.saved/g.amt*100)),daily=Math.min(LEARN.dailyXP,50);
  var h='<div class="page-title">Learn</div>';
  h+='<div class="learn-grid">';
  /* ── left: the trail ── */
  h+='<div class="learn-trail">';
  h+='<div class="dstrip"><div class="dstat"><span>🔥</span><div><div class="ds-v">'+LEARN.streak+'</div><div class="ds-k">day streak</div></div></div>'
    +'<div class="dstat">'+lring(daily,50)+'<div><div class="ds-v">'+daily+'/50</div><div class="ds-k">daily goal</div></div></div>'
    +'<div class="dstat"><span>⭐</span><div><div class="ds-v">'+LEARN.xp+'</div><div class="ds-k">XP</div></div></div></div>';
  h+=miaGuide();
  var L_states=lessonStates();
  learnUnits().forEach(function(u){
    var ud=unitDone(u),ua=unitActive(u,L_states);
    h+='<div class="unit-head'+((!ud&&!ua)?' locked':'')+'" style="--acc:'+u.acc+'"><div class="unit-ic">'+(ud?lic('check'):(ua?lic('play'):lic('lock')))+'</div><div><div class="unit-k">'+u.k+'</div><div class="unit-t">'+u.t+'</div></div><button class="unit-gb" onclick="showToast(\'📖 Unit guidebook, coming soon\')">'+lic('book')+'</button></div>';
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
  var xe=document.getElementById('pfLevelXP');if(xe)xe.textContent=LEARN.xp+' XP · '+Math.max(0,LEARN.xpToNext-LEARN.xp)+' to Level '+(LEARN.level+1);
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
  {q:'You invest <b>$100</b> and it grows about <b>8%</b> in a year. Roughly what\'s it worth?',opts:['$108','$180','$800'],correct:0,why:'8% of $100 is $8, so about $108. Small percentages snowball over many years; that\'s compounding.'},
  {q:'Which of these usually <b>bounces around</b> the most in price?',opts:['A bond ETF','A big-company stock','A crypto coin'],correct:2,why:'Crypto is the bounciest, bigger ups and bigger downs. Bonds are the calmest of the three.'},
  {q:'What does a <b>TFSA</b> let you do?',opts:['Grow money tax-free','Borrow at 0%','Guarantee profits'],correct:0,why:'A TFSA lets your investments grow, and come out, completely tax-free. Nothing guarantees profits.'},
  {q:'Spreading money across different investments is called…',opts:['Chasing','Diversifying','Day-trading'],correct:1,why:'Diversifying, it softens the blow if any one thing drops. The closest thing to a free lunch in investing.'}
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
renderOB();
renderPortfolio();renderHoldings();sfSelect('AAPL');
renderFc('AAPL');loadIndices();
checkSkillUnlocks();renderLearn();
renderQOTD();renderPlan();renderGoalCard();renderProfile();renderMoneyHome();
if(onboarded)enterApp();
refreshHeldPrices();/* load live prices up front so Home & Practice settle to the same live value at once, not only when Practice opens */
