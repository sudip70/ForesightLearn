/* ── Tools & Games ────────────────────────────────────────────────────────
 * Financial-literacy mini-games + calculators for the Tools tab.
 * Global-scope (classic script), wired to inline onclick handlers like the
 * rest of the app. Reuses money()/money0()/miniDonut()/avatar()/showToast().
 * ----------------------------------------------------------------------- */

function miaSays(html){
  return '<div class="mia"><div class="face">'+avatar()+'</div><div><div class="bubble">'+html+'</div></div></div>';
}
function gameHead(emoji,title,sub){
  return '<div class="game-head"><div class="gh-ico">'+emoji+'</div><div><div class="gh-t">'+title+'</div><div class="gh-s">'+sub+'</div></div></div>';
}

/* Feed a finished game into the same XP/level/streak system the Learn tab uses,
 * so progress earned here shows up on the topbar and Profile. `frac` (0–1) is how
 * well you did; a completion is always worth at least the base. Guarded by a flag
 * on the game's state object so re-renders (or re-checks) never double-count — a
 * genuine "Play again" makes a fresh state object and can earn again. */
function gameXP(state,frac,label){
  if(!state||state._xpGiven)return 0;
  state._xpGiven=true;
  var xp=10+Math.round(Math.max(0,Math.min(1,frac))*20);
  if(typeof learnXP==='function')learnXP(xp);
  if(typeof syncTopbar==='function')syncTopbar();
  if(typeof showToast==='function')showToast('🎮 '+label+' · +'+xp+' XP');
  return xp;
}

/* ════════════════════════════════════════════════════════════════════════
 *  BUDGET SWIPE — keep the needs, cut the wants, stay under budget
 * ════════════════════════════════════════════════════════════════════════ */
var BS_DECK=[
  {n:'Rent',e:'🏠',amt:1200,need:true},
  {n:'Groceries',e:'🛒',amt:350,need:true},
  {n:'Phone plan',e:'📱',amt:45,need:true},
  {n:'Internet',e:'🌐',amt:60,need:true},
  {n:'Electricity',e:'💡',amt:90,need:true},
  {n:'Health insurance',e:'🩺',amt:180,need:true},
  {n:'Transit pass',e:'🚌',amt:100,need:true},
  {n:'Student loan payment',e:'🎓',amt:220,need:true},
  {n:'Streaming service',e:'📺',amt:16,need:false},
  {n:'Gym membership',e:'🏋️',amt:40,need:false},
  {n:'Daily coffee shop',e:'☕',amt:85,need:false},
  {n:'Dining out',e:'🍽️',amt:160,need:false},
  {n:'New sneakers',e:'👟',amt:130,need:false},
  {n:'Concert tickets',e:'🎟️',amt:95,need:false},
  {n:'Video game',e:'🎮',amt:70,need:false},
  {n:'Rideshare habit',e:'🚗',amt:60,need:false},
  {n:'Impulse gadget',e:'🎧',amt:200,need:false},
  {n:'New clothes',e:'👕',amt:120,need:false},
  {n:'Subscription box',e:'📦',amt:30,need:false},
  {n:'Lottery tickets',e:'🎰',amt:40,need:false},
  {n:'Takeout lunches',e:'🥡',amt:90,need:false},
  {n:'Premium app',e:'✨',amt:12,need:false}
];
var bsState=null;
function initBudgetSwipe(){
  var deck=BS_DECK.slice();
  for(var i=deck.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=deck[i];deck[i]=deck[j];deck[j]=t;}
  deck=deck.slice(0,15);
  bsState={deck:deck,i:0,kept:0,keptItems:[],budget:3000};
  bsRender();
}
function bsRender(){
  var el=document.getElementById('bsBody');if(!el)return;var s=bsState;
  if(s.i>=s.deck.length){return bsEnd();}
  var c=s.deck[s.i];
  var pct=Math.min(100,Math.round(s.kept/s.budget*100));
  var over=s.kept>s.budget;
  el.innerHTML=gameHead('🃏','Budget Swipe','You have <b>$3,000</b> a month. Keep what matters, cut the rest.')
    +'<div class="bs-meter"><div class="row" style="margin-bottom:6px"><span style="font-size:12px;font-weight:800;color:var(--muted)">KEPT</span>'
      +'<span class="tnum" style="font-size:15px;font-weight:800;color:'+(over?'var(--red)':'var(--purple-deep)')+'">'+money0(s.kept)+' / '+money0(s.budget)+'</span></div>'
      +'<div class="bar"><div class="bar-fill" style="width:'+pct+'%;background:'+(over?'var(--red)':'linear-gradient(90deg,var(--grad-a),var(--purple-strong))')+'"></div></div></div>'
    +'<div class="bs-count">Card '+(s.i+1)+' of '+s.deck.length+'</div>'
    +'<div class="swipe-stack"><div class="swipe-card" id="bsCard">'
      +'<div class="swipe-emoji">'+c.e+'</div>'
      +'<div class="swipe-name">'+c.n+'</div>'
      +'<div class="swipe-amt tnum">'+money0(c.amt)+'<span>/mo</span></div>'
    +'</div></div>'
    +'<div class="swipe-actions"><button class="swipe-btn cut" onclick="bsSwipe(0)"><span>✕</span>Cut</button>'
      +'<button class="swipe-btn keep" onclick="bsSwipe(1)"><span>✓</span>Keep</button></div>';
}
function bsSwipe(keep){
  var s=bsState;var card=document.getElementById('bsCard');var c=s.deck[s.i];
  if(card){card.classList.add(keep?'fly-r':'fly-l');}
  if(keep){s.kept+=c.amt;s.keptItems.push(c);}
  s.i++;
  setTimeout(bsRender,180);
}
function bsEnd(){
  var s=bsState;var el=document.getElementById('bsBody');
  var needsTotal=s.deck.filter(function(d){return d.need;}).length;
  var needsKept=s.keptItems.filter(function(d){return d.need;}).length;
  var cutNeeds=s.deck.filter(function(d){return d.need;}).filter(function(d){return s.keptItems.indexOf(d)<0;});
  var keptWants=s.keptItems.filter(function(d){return !d.need;});
  var over=s.kept>s.budget;
  var needRatio=needsTotal?needsKept/needsTotal:1;
  var score=Math.round(70*needRatio)+(over?0:30);
  var grade=score>=85?'A':score>=70?'B':score>=50?'C':'D';
  var gc=grade==='A'?'var(--green)':grade==='D'?'var(--red)':'var(--amber)';
  var tip;
  if(over)tip="You went <b>over budget</b> by "+money0(s.kept-s.budget)+". When money's tight, wants are the first thing to trim.";
  else if(cutNeeds.length)tip="You cut a <b>need</b>. Needs like rent and food have to come first, then wants fill the space that's left.";
  else if(keptWants.length>3)tip="Every need is covered, but lots of wants slipped in. Trimming a few frees up cash for <b>savings</b>.";
  else tip="Nicely balanced, you kept every need and stayed under budget. That's exactly the idea.";
  // learning recap: where the choices went
  var recap='';
  if(cutNeeds.length){recap+='<div class="bs-recap"><div class="bsr-h" style="color:var(--red)">⚠️ Needs you cut</div>';
    cutNeeds.forEach(function(d){recap+='<div class="bsr-row"><span>'+d.e+' '+d.n+'</span><b class="tnum">'+money0(d.amt)+'</b></div>';});recap+='</div>';}
  if(keptWants.length){recap+='<div class="bs-recap"><div class="bsr-h" style="color:var(--amber)">Wants you kept</div>';
    keptWants.forEach(function(d){recap+='<div class="bsr-row"><span>'+d.e+' '+d.n+'</span><b class="tnum">'+money0(d.amt)+'</b></div>';});recap+='</div>';}
  if(!cutNeeds.length&&!keptWants.length)recap='<div class="bs-recap"><div class="bsr-h" style="color:var(--green)">✓ Spot on, every need kept and no wants over-spent.</div></div>';
  gameXP(s,score/100,'Budget Swipe');
  el.innerHTML=gameHead('🃏','Budget Swipe','Round complete')
    +'<div class="game-result"><div class="gr-grade" style="color:'+gc+'">'+grade+'</div>'
      +'<div class="gr-label">Budget health</div>'
      +'<div class="gr-rows">'
        +'<div class="gr-row"><span>Kept</span><b class="tnum">'+money0(s.kept)+'</b></div>'
        +'<div class="gr-row"><span>Left over</span><b class="tnum" style="color:'+(over?'var(--red)':'var(--green)')+'">'+(over?'-':'+')+money0(Math.abs(s.budget-s.kept))+'</b></div>'
        +'<div class="gr-row"><span>Needs kept</span><b>'+needsKept+' / '+needsTotal+'</b></div>'
      +'</div></div>'
    +recap
    +miaSays(tip)
    +'<button class="btn btn-pur" onclick="initBudgetSwipe()">Play again ↻</button>';
}

/* ════════════════════════════════════════════════════════════════════════
 *  WANTS vs NEEDS — sort the list, then check your instincts
 * ════════════════════════════════════════════════════════════════════════ */
var WNB_ITEMS=[
  {n:'Rent',e:'🏠',a:'need',why:'A roof over your head is essential.'},
  {n:'Groceries',e:'🛒',a:'need',why:'Food you cook is a basic need.'},
  {n:'Netflix',e:'📺',a:'want',why:'Entertainment is nice, not essential.'},
  {n:'Coffee out',e:'☕',a:'want',why:'You can make coffee at home for cents.'},
  {n:'Health insurance',e:'🩺',a:'need',why:'Protects you from huge medical bills.'},
  {n:'Gym membership',e:'🏋️',a:'want',why:'Useful, but you can exercise for free.'},
  {n:'Phone plan',e:'📱',a:'need',why:'A basic plan is needed for work and safety.'},
  {n:'Vacation',e:'✈️',a:'want',why:'A treat to save up for, not a necessity.'},
  {n:'Eating out',e:'🍽️',a:'want',why:'Restaurants cost far more than home cooking.'},
  {n:'Basic clothing',e:'👕',a:'need',why:'You need clothes, but not designer ones.'},
  {n:'Internet',e:'🌐',a:'need',why:'Essential for work, school and bills today.'},
  {n:'Emergency fund',e:'🛟',a:'need',why:'Savings for surprises is a true need.'}
];
var wnbState=null;
function initWantsNeeds(){
  wnbState={pick:WNB_ITEMS.map(function(){return null;}),done:false};
  wnbRender();
}
function wnbRender(){
  var el=document.getElementById('wnbBody');if(!el)return;var s=wnbState;
  var h=gameHead('✅','Wants vs Needs','A <b>need</b> keeps you housed, fed, safe or working. A <b>want</b> is everything else.');
  if(!s.done){
    var unset=s.pick.filter(function(p){return p===null;}).length;
    h+='<div class="wnb-legend">Tap an item: once for <span class="wnb-key want">Want</span>, again for <span class="wnb-key need">Need</span></div>';
    h+='<div class="wnb-grid">';
    WNB_ITEMS.forEach(function(it,i){
      var p=s.pick[i];
      h+='<div class="wnb-item '+(p||'')+'" onclick="wnbToggle('+i+')">'
        +'<div class="wnb-e">'+it.e+'</div><div class="wnb-n">'+it.n+'</div>'
        +'<div class="wnb-tag">'+(p==='need'?'NEED':p==='want'?'WANT':'Tap to sort')+'</div></div>';
    });
    h+='</div>';
    h+='<button class="btn btn-pur" '+(unset?'disabled style="opacity:.5"':'')+' onclick="wnbSubmit()">'+(unset?unset+' left to sort':'Check my answers')+'</button>';
  }else{
    var correct=0;
    h+='<div class="wnb-grid">';
    WNB_ITEMS.forEach(function(it,i){
      var ok=s.pick[i]===it.a;if(ok)correct++;
      h+='<div class="wnb-item rev '+(ok?'ok':'no')+'">'
        +'<div class="wnb-e">'+it.e+'</div><div class="wnb-n">'+it.n+'</div>'
        +'<div class="wnb-tag">'+it.a.toUpperCase()+(ok?' ✓':' ✗')+'</div>'
        +'<div class="wnb-why">'+it.why+'</div></div>';
    });
    h+='</div>';
    gameXP(s,correct/WNB_ITEMS.length,'Wants vs Needs');
    var tip=correct===WNB_ITEMS.length?"Perfect sort! You've got a sharp eye for what's essential."
      :correct>=9?"Strong work, "+correct+"/12. The tricky ones are 'comfortable' wants that feel like needs."
      :"You got "+correct+"/12. A need keeps you safe, housed, fed or working, everything else is a want.";
    h+='<div class="game-result"><div class="gr-grade" style="color:var(--purple-deep);font-size:34px">'+correct+'/12</div><div class="gr-label">Sorted correctly</div></div>';
    h+=miaSays(tip);
    h+='<button class="btn btn-pur" onclick="initWantsNeeds()">Play again ↻</button>';
  }
  el.innerHTML=h;
}
function wnbToggle(i){
  var p=wnbState.pick[i];
  wnbState.pick[i]=p===null?'want':p==='want'?'need':null;
  wnbRender();
}
function wnbSubmit(){wnbState.done=true;wnbRender();}

/* ════════════════════════════════════════════════════════════════════════
 *  SCAMMER SCANNER — read the message, decide Scam or Legit, learn the tells
 * ════════════════════════════════════════════════════════════════════════ */
var SCAM_CASES=[
  /* ── SCAMS ── */
  {ico:'🚀',from:'@CryptoKingDM',kind:'Direct message',scam:true,
   body:"Hey friend! Get in on GuaranteedCoin before it blows up. Send me $200 in crypto today and I'll 3x it for you by Friday, promise!",
   tells:[
     {flag:true,t:'Promises a guaranteed 3x return. No real investment can promise that.'},
     {flag:true,t:'Pushes you to act today. Urgency stops you from thinking it through.'},
     {flag:true,t:'Wants you to send crypto first. Once sent, it is gone for good.'}
   ],
   lesson:"Guaranteed returns + urgency + pay-me-first is the classic investment scam combo."},
  {ico:'🏦',from:'security@bank-secure-login.co',kind:'Email',scam:true,
   body:"Your account is locked. Verify within 24 hours or lose access. Click here and enter your full password and PIN to restore it.",
   tells:[
     {flag:true,t:'The link goes to bank-secure-login.co, not your bank\'s real website.'},
     {flag:true,t:'Asks for your full password and PIN. A real bank never asks for these.'},
     {flag:true,t:'Threatens to lock you out in 24 hours to rush you.'}
   ],
   lesson:"Your bank will never ask for your full password. Don't click — go to the site yourself."},
  {ico:'🎉',from:'intl-lottery-claims@gmail.com',kind:'Email',scam:true,
   body:"Congratulations! You've won $850,000 in the International Lottery. Just pay a $200 processing fee to release your winnings.",
   tells:[
     {flag:true,t:'You won a lottery you never entered.'},
     {flag:true,t:'Asks for a fee to release a prize. Real winnings never cost you money upfront.'},
     {flag:true,t:'Sent from a free Gmail address, not an official lottery address.'}
   ],
   lesson:"If you have to pay to receive a prize, it's always a scam."},
  {ico:'💼',from:'Quick Hire HR',kind:'Job offer',scam:true,
   body:"You're hired, no interview needed! We'll mail you a $2,000 cheque. Deposit it, keep $300, and wire the other $1,700 back for equipment.",
   tells:[
     {flag:true,t:'Pays you before you\'ve done any work.'},
     {flag:true,t:'Asks you to wire money back from their cheque, which will later bounce.'},
     {flag:true,t:'Hired with no interview or real process.'}
   ],
   lesson:"Never wire back money from a cheque you were sent. Fake cheques bounce after your cash is gone."},
  {ico:'📦',from:'delivery-notice@pkg-trackr.net',kind:'Text message',scam:true,
   body:"Your Canada Post package is on hold due to an unpaid $2.99 customs fee. Pay now or it will be returned: pkg-trackr.net/pay",
   tells:[
     {flag:true,t:'The link goes to pkg-trackr.net, not canadapost.ca.'},
     {flag:true,t:'Creates panic that your package will disappear if you don\'t act fast.'},
     {flag:true,t:'Canada Post never texts you to collect fees via a random link.'}
   ],
   lesson:"Fake delivery texts are one of the most common smishing scams. Always go directly to the courier's official website."},
  {ico:'🏛️',from:'+1 (800) 959-2221',kind:'Phone call',scam:true,
   body:"This is the Canada Revenue Agency. You have an outstanding tax debt. A warrant has been issued for your arrest. To avoid being taken into custody today, you must pay by iTunes gift card immediately.",
   tells:[
     {flag:true,t:'The CRA never threatens arrest over the phone for tax debt.'},
     {flag:true,t:'No government agency accepts gift cards as payment. Ever.'},
     {flag:true,t:'The urgency — "today" — is designed to stop you thinking clearly.'}
   ],
   lesson:"The CRA contacts you by mail first. Gift cards are never a valid payment method for any government debt."},
  {ico:'💻',from:'Windows Security Alert',kind:'Pop-up',scam:true,
   body:"⚠️ VIRUS DETECTED — Your computer has been locked to prevent damage. Call Microsoft Support immediately: 1-888-248-3120. Do not close this window.",
   tells:[
     {flag:true,t:'Microsoft never locks your screen and asks you to call a phone number.'},
     {flag:true,t:'Telling you not to close the window is a pressure tactic.'},
     {flag:true,t:'Calling that number puts you in contact with a scammer, not Microsoft.'}
   ],
   lesson:"Legitimate security software never displays a phone number to call. Close the browser tab, run a real antivirus scan."},
  {ico:'❤️',from:'David_Vancouver',kind:'Dating app message',scam:true,
   body:"I feel such a strong connection with you. I'm an engineer working abroad right now. I'd love to meet, but my wallet was stolen. Could you send $300 via e-Transfer just until I get home?",
   tells:[
     {flag:true,t:'Claims a deep connection very quickly, before you\'ve even met.'},
     {flag:true,t:'Always has a reason they can\'t meet in person or video call.'},
     {flag:true,t:'Asks for money with a plausible-sounding emergency story.'}
   ],
   lesson:"Romance scammers spend weeks building trust before asking for money. If someone you've never met asks for cash, it's a scam."},
  {ico:'👨‍💼',from:'Kevin (CEO)',kind:'Text message',scam:true,
   body:"Hey, it's Kevin from the office. I'm stuck in a meeting and need a favour urgently — can you buy $500 in Google Play gift cards and send me the codes? Will explain later, it's time-sensitive.",
   tells:[
     {flag:true,t:'Impersonates your boss to create pressure to comply.'},
     {flag:true,t:'Asks for gift card codes — a major red flag, no business uses these.'},
     {flag:true,t:'"I\'ll explain later" prevents you from thinking it through.'}
   ],
   lesson:"Call your boss directly on a known number to verify any unusual request. Scammers rely on you not double-checking."},
  {ico:'🏠',from:'rental_deal_99@gmail.com',kind:'Email',scam:true,
   body:"Great news — the apartment is yours! Due to high demand, please e-Transfer the $1,800 first and last month deposit to hold it. I'm currently overseas so I'll mail you the keys.",
   tells:[
     {flag:true,t:'Landlord is conveniently overseas and can\'t show you the unit in person.'},
     {flag:true,t:'Asks for a deposit before you\'ve signed any lease or seen the place.'},
     {flag:true,t:'Sent from a free Gmail address with no verifiable business name.'}
   ],
   lesson:"Never send a rental deposit without seeing the unit in person and signing a real lease. Landlords who can't meet are almost always scammers."},
  {ico:'💳',from:'paypal-service@accounts-verify.com',kind:'Email',scam:true,
   body:"Your PayPal account has been limited. A payment of $349 is pending. If this wasn't you, click here within 12 hours to dispute and enter your card details.",
   tells:[
     {flag:true,t:'Sent from accounts-verify.com, not paypal.com.'},
     {flag:true,t:'Uses a fake pending charge to scare you into clicking.'},
     {flag:true,t:'Asks you to enter card details via email link — PayPal never does this.'}
   ],
   lesson:"Check your PayPal account directly by typing paypal.com yourself. Never follow links in payment alert emails."},
  {ico:'📱',from:'BrandCollab@promo-deals.io',kind:'Instagram DM',scam:true,
   body:"Hi! We love your profile and want to partner with you as a brand ambassador. You'll earn $800/week posting for us. Just pay a $75 starter kit fee to get your products shipped.",
   tells:[
     {flag:true,t:'Legitimate brand deals never require you to pay upfront.'},
     {flag:true,t:'Promises a specific weekly income with no real interview or vetting.'},
     {flag:true,t:'The email domain is promo-deals.io, not a real brand\'s address.'}
   ],
   lesson:"Real influencer deals pay you — they don't charge you. Any job that asks for money before you earn any is a scam."},
  {ico:'📰',from:'marketplace-buyer99',kind:'Facebook Marketplace',scam:true,
   body:"I'll buy your $400 bike! I'll send $600 by mistake — please just deposit the cheque and e-Transfer me the $200 difference right away.",
   tells:[
     {flag:true,t:'Overpayment is always deliberate — the cheque will bounce days later.'},
     {flag:true,t:'You end up sending real money before you discover the cheque is fake.'},
     {flag:true,t:'Real buyers don\'t overpay and ask for money back before picking up the item.'}
   ],
   lesson:"Marketplace overpayment is a classic. Never send back money from a cheque; wait until your bank fully clears it (which can take weeks)."},
  {ico:'🌊',from:'disaster-relief-canada@gmail.com',kind:'Email',scam:true,
   body:"Following last week\'s floods, our charity needs your help. Donate via e-Transfer or gift card to disasterreliefcanada@gmail.com. Every dollar counts — donate in the next 2 hours for double-matching!",
   tells:[
     {flag:true,t:'Legitimate charities have registered names you can verify at canada.ca/charities.'},
     {flag:true,t:'Accepts gift cards — no real charity does this.'},
     {flag:true,t:'"Next 2 hours" pressure is designed to stop you from researching the charity.'}
   ],
   lesson:"Always verify a charity at canada.ca/charities before donating. Scammers surge after disasters when people want to help fast."},
  {ico:'🎓',from:'student-loan-help@forgiveness-plan.net',kind:'Text message',scam:true,
   body:"Government student loan forgiveness approved! You qualify for up to $20,000 written off. Click to claim — offer expires in 48 hours. Small $49 application fee required.",
   tells:[
     {flag:true,t:'Government programs don\'t text you out of the blue about approval.'},
     {flag:true,t:'Charges a fee to access a government benefit — that\'s never legitimate.'},
     {flag:true,t:'The 48-hour deadline stops you from calling the actual National Student Loans Service Centre.'}
   ],
   lesson:"Student aid changes come through your official NSLSC account. If it involves a fee or a countdown, it's a scam."},

  /* ── LEGIT ── */
  {ico:'🛡️',from:'Your Bank · official app',kind:'Notification',scam:false,
   body:"We noticed a new sign-in on your account from a new device. If this was you, no action is needed. If not, call the number on the back of your card.",
   tells:[
     {flag:false,t:'Points you to the number on your card, not a random link.'},
     {flag:false,t:'Doesn\'t ask for any passwords or personal details.'},
     {flag:false,t:'No pressure or threats — it just informs you.'}
   ],
   lesson:"Genuine alerts inform you and send you to official contacts. They don't demand secrets."},
  {ico:'💸',from:'Maya (your friend)',kind:'e-Transfer',scam:false,
   body:"Sending you back the $40 for dinner last night 🙂 thanks again, that was so fun!",
   tells:[
     {flag:false,t:'A small amount you were actually expecting.'},
     {flag:false,t:'From someone you know personally, for a real shared reason.'},
     {flag:false,t:'No links, no pressure, no request for your details.'}
   ],
   lesson:"Money you're expecting, from someone you know, for a normal reason, is usually just fine."},
  {ico:'📺',from:'Netflix',kind:'Email',scam:false,
   body:"Your monthly membership of $18.99 CAD has been renewed. Your next billing date is July 20. Manage your plan anytime at netflix.com/account.",
   tells:[
     {flag:false,t:'Sent from a recognizable company for a subscription you actually have.'},
     {flag:false,t:'Directs you to the official netflix.com domain, not a lookalike.'},
     {flag:false,t:'No urgency, no threats, no request for payment info.'}
   ],
   lesson:"Routine subscription receipts from real companies are normal. The test: does the link go to the real domain, and were you expecting this charge?"},
  {ico:'🏢',from:'HR · Payroll Services',kind:'Email',scam:false,
   body:"Your direct deposit of $1,847.50 has been processed and will appear in your account by end of day Friday. Questions? Contact hr@yourcompany.ca.",
   tells:[
     {flag:false,t:'From your employer\'s official domain, matching what you\'d expect.'},
     {flag:false,t:'Just informing you — no link to click, nothing to pay.'},
     {flag:false,t:'Amount and timing are consistent with your regular pay schedule.'}
   ],
   lesson:"Payroll notifications from your employer's real domain are routine. You'd only need to worry if the email asked you to change your banking info."},
  {ico:'🙋',from:'Jordan (classmate)',kind:'Text message',scam:false,
   body:"Hey! Are you free to cover me $20 for the group lunch today? I forgot to hit the ATM. Can pay you back tomorrow on campus.",
   tells:[
     {flag:false,t:'You know this person in real life and the context makes sense.'},
     {flag:false,t:'Small, specific amount for a plausible everyday reason.'},
     {flag:false,t:'No urgency, no pressure, and they said they\'ll pay you back in person.'}
   ],
   lesson:"Asking a friend or classmate to cover a small amount is totally normal. The red flags would be if it were a stranger, a large amount, or asked via a hacked account."},
  {ico:'📦',from:'Amazon',kind:'Email',scam:false,
   body:"Your order has shipped! Your Kindle case is on its way and expected Thursday. Track your package at amazon.ca/orders.",
   tells:[
     {flag:false,t:'Refers to a specific item you actually ordered.'},
     {flag:false,t:'Links to amazon.ca — the real domain, not a lookalike.'},
     {flag:false,t:'No personal info requested, no payment, no urgency.'}
   ],
   lesson:"Shipping confirmations from real retailers are routine. Always verify that links go to the retailer\'s actual domain before clicking."}
];
var SCAM_SESSION_SIZE=5;
function scamPickSession(){
  var pool=SCAM_CASES.slice();
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=pool[i];pool[i]=pool[j];pool[j]=tmp;}
  return pool.slice(0,SCAM_SESSION_SIZE);
}
var scamState=null;
function initScammerScanner(){
  scamState={i:0,decided:null,score:0,cases:scamPickSession()};
  scamRender();
}
function scamRender(){
  var el=document.getElementById('scamBody');if(!el)return;var s=scamState;
  var n=s.cases.length;
  if(s.i>=n)return scamEnd();
  var c=s.cases[s.i];
  var h=gameHead('🚨','Scammer Scanner','Read the message. Is it a <b>scam</b> or <b>legit</b>?');
  h+='<div class="scam-count">Message '+(s.i+1)+' of '+n+' · Score '+s.score+'</div>';
  h+='<div class="scam-msg"><div class="scam-from"><span class="scam-ico">'+c.ico+'</span><div><div class="scam-name">'+c.from+'</div><div class="scam-kind">'+c.kind+'</div></div></div>'
    +'<div class="scam-body">'+c.body+'</div></div>';
  if(s.decided===null){
    h+='<div class="scam-choose">'
      +'<button class="scam-decide scam" onclick="scamDecide(true)">🚩<span>It\'s a scam</span></button>'
      +'<button class="scam-decide legit" onclick="scamDecide(false)">✅<span>Looks legit</span></button></div>';
  }else{
    var right=(s.decided===c.scam);
    h+='<div class="scam-verdict '+(right?'ok':'no')+'">'+(right?'✓ Correct':'✗ Not quite')+' — this one is <b>'+(c.scam?'a scam':'legit')+'</b>.</div>';
    h+='<div class="scam-tells">';
    c.tells.forEach(function(t){
      h+='<div class="scam-tell '+(t.flag?'is-flag':'is-safe')+'"><span class="st-ico">'+(t.flag?'🚩':'✅')+'</span><span>'+t.t+'</span></div>';
    });
    h+='</div>';
    h+=miaSays(c.lesson);
    h+='<button class="btn btn-pur" onclick="scamNext()">'+(s.i+1>=n?'See results':'Next message →')+'</button>';
  }
  el.innerHTML=h;
}
function scamDecide(isScam){
  var s=scamState,c=s.cases[s.i];
  s.decided=isScam;
  if(isScam===c.scam)s.score++;
  scamRender();
}
function scamNext(){scamState.i++;scamState.decided=null;scamRender();}
function scamEnd(){
  var s=scamState;var el=document.getElementById('scamBody');var n=s.cases.length;
  var pct=Math.round(s.score/n*100);
  var label=pct>=90?'Scam-proof 🛡️':pct>=70?'Sharp eye 👀':pct>=50?'Getting there':'Stay careful';
  var col=pct>=70?'var(--green)':pct>=50?'var(--amber)':'var(--red)';
  gameXP(s,s.score/n,'Scammer Scanner');
  el.innerHTML=gameHead('🚨','Scammer Scanner','Scan complete')
    +'<div class="game-result"><div class="gr-grade" style="color:'+col+'">'+s.score+'/'+n+'</div><div class="gr-label">'+label+'</div></div>'
    +miaSays("Most scams share four tells: <b>urgency</b>, <b>secrecy</b>, <b>guaranteed money</b>, and <b>pay or wire first</b>. Spot any one and slow right down — that pause is your best defence.")
    +'<button class="btn btn-pur" onclick="initScammerScanner()">Play again ↻</button>';
}

/* ════════════════════════════════════════════════════════════════════════
 *  FINANCE WORDLE — daily 5-letter money word
 * ════════════════════════════════════════════════════════════════════════ */
var WORDLE_WORDS={
  ASSET:'Something you own that has value.',
  BONDS:'Loans to a government or company that pay interest.',
  SHARE:'A single unit of ownership in a company.',
  YIELD:"An investment's income return, as a percent.",
  DEBIT:'Money taken directly from your bank account.',
  FUNDS:'Pooled money, or cash available to spend.',
  INDEX:'A basket that tracks a market, like the S&P 500.',
  TRADE:'To buy or sell an investment.',
  TAXES:'Money you pay to the government.',
  PRICE:'What something costs.',
  STOCK:'A share of ownership in a company.',
  VALUE:'What something is worth.',
  SAVES:'Sets money aside instead of spending it.',
  LOANS:'Borrowed sums repaid with interest.',
  AUDIT:'An official check of financial records.',
  WAGES:'Pay earned for the work you do.',
  CENTS:'Hundredths of a dollar.',
  COINS:'Metal money.',
  EARNS:'Receives money as income.',
  SPEND:'To use money to buy something.',
  RATES:'Percentages charged or paid, like interest.',
  GAINS:'Profits or increases in value.',
  COSTS:'Amounts you have to pay.',
  WORTH:'The value of something.'
};
var WORDLE_KEYS=Object.keys(WORDLE_WORDS);
var wordleState=null,wordleBound=false;
function todayWord(){var d=Math.floor(Date.now()/86400000);return WORDLE_KEYS[d%WORDLE_KEYS.length];}
function initWordle(){
  wordleState={answer:todayWord(),guesses:[],cur:'',done:false,best:{},hintShown:false,daily:true};
  if(!wordleBound){document.addEventListener('keydown',wordleKey);wordleBound=true;}
  wordleRender();
}
function wordleHint(){if(wordleState){wordleState.hintShown=true;wordleRender();}}
function wordleActive(){var p=document.getElementById('page-game-wordle');return p&&p.classList.contains('active');}
function wordleKey(e){
  if(!wordleActive()||!wordleState||wordleState.done)return;
  if(e.key==='Enter')return wordleEnter();
  if(e.key==='Backspace')return wordleType('DEL');
  if(/^[a-zA-Z]$/.test(e.key))wordleType(e.key.toUpperCase());
}
function wordleType(k){
  var s=wordleState;if(s.done)return;
  if(k==='DEL')s.cur=s.cur.slice(0,-1);
  else if(s.cur.length<5)s.cur+=k;
  wordleRender();
}
function wordleEnter(){
  var s=wordleState;if(s.done||s.cur.length!==5)return;
  var guess=s.cur;s.guesses.push(guess);s.cur='';
  // mark keyboard best states
  scoreWordle(guess).forEach(function(st,i){
    var ch=guess[i];var rank={absent:0,present:1,correct:2};
    if(rank[st]>(rank[s.best[ch]]||-1))s.best[ch]=st;
  });
  if(guess===s.answer||s.guesses.length>=6){
    s.done=true;
    var won=guess===s.answer;
    gameXP(s,won?(7-s.guesses.length)/6:0,'Finance Wordle');
  }
  wordleRender();
}
function scoreWordle(guess){
  var ans=wordleState.answer.split('');var res=['absent','absent','absent','absent','absent'];
  var used=[false,false,false,false,false];
  for(var i=0;i<5;i++){if(guess[i]===ans[i]){res[i]='correct';used[i]=true;ans[i]=null;}}
  for(var j=0;j<5;j++){if(res[j]==='correct')continue;var k=ans.indexOf(guess[j]);if(k>=0){res[j]='present';ans[k]=null;}}
  return res;
}
function wordleRender(){
  var el=document.getElementById('wordleBody');if(!el)return;var s=wordleState;
  var h=gameHead('🟩','Finance Wordle','Guess the 5-letter money word in 6 tries.');
  h+='<div class="wordle-grid">';
  for(var r=0;r<6;r++){
    var guess=s.guesses[r];var score=guess?scoreWordle(guess):null;
    var typed=(!guess&&r===s.guesses.length&&!s.done)?s.cur:'';
    h+='<div class="wordle-row">';
    for(var c=0;c<5;c++){
      var ch=guess?guess[c]:(typed[c]||'');
      var st=score?score[c]:'';
      h+='<div class="wordle-tile '+st+(ch&&!st?' filled':'')+'">'+ch+'</div>';
    }
    h+='</div>';
  }
  h+='</div>';
  if(s.done){
    var won=s.guesses[s.guesses.length-1]===s.answer;
    h+=miaSays((won?'Nice, got it in <b>'+s.guesses.length+'</b>! ':'The word was <b>'+s.answer+'</b>. ')+WORDLE_WORDS[s.answer]);
    if(s.daily){
      h+='<div class="wordle-done">🗓️ That\'s today\'s word. <b>Come back tomorrow</b> for a new one!</div>';
      h+='<button class="btn btn-soft" onclick="wordleNewWord()">Practice another word ↻</button>';
    }else{
      h+='<button class="btn btn-pur" onclick="wordleNewWord()">Play another word ↻</button>';
    }
  }else{
    h+=wordleHintBlock();
    h+=wordleKeyboard();
  }
  el.innerHTML=h;
}
function wordleHintBlock(){
  var s=wordleState;
  if(!s.hintShown){
    return '<div class="mia"><div class="face">'+avatar()+'</div><div><div class="bubble">Stuck? I can give you a hint 💡'
      +'<button class="hint-btn" onclick="wordleHint()">Show me a hint</button></div></div></div>';
  }
  return '<div class="mia"><div class="face">'+avatar()+'</div><div><div class="bubble">💡 <b>Hint:</b> '+WORDLE_WORDS[s.answer]+'</div></div></div>';
}
function wordleNewWord(){
  var s=wordleState;var pick;do{pick=WORDLE_KEYS[Math.floor(Math.random()*WORDLE_KEYS.length)];}while(pick===s.answer);
  wordleState={answer:pick,guesses:[],cur:'',done:false,best:{},hintShown:false,daily:false};wordleRender();
}
function wordleKeyboard(){
  var rows=['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];var s=wordleState;
  var h='<div class="wordle-kbd">';
  rows.forEach(function(row,ri){
    h+='<div class="wkb-row">';
    if(ri===2)h+='<button class="wkb-key wide" onclick="wordleEnter()">Enter</button>';
    row.split('').forEach(function(ch){
      h+='<button class="wkb-key '+(s.best[ch]||'')+'" onclick="wordleType(\''+ch+'\')">'+ch+'</button>';
    });
    if(ri===2)h+='<button class="wkb-key wide" onclick="wordleType(\'DEL\')">⌫</button>';
    h+='</div>';
  });
  h+='</div>';
  return h;
}

/* ════════════════════════════════════════════════════════════════════════
 *  FINANCE CROSSWORD — daily mini, solution grid + clue dictionary
 * ════════════════════════════════════════════════════════════════════════ */
var XW_CLUES={
  BUDGET:'A plan for how you will spend your money',
  FUND:'A pool of money set aside (e.g. emergency ___)',
  STOCK:'A share of ownership in a company',
  BONDS:'Loans to a government or company that pay interest',
  TAX:'Money you pay to the government',
  ASSET:'Something you own that has value',
  YIELD:"An investment's income return, as a %",
  SAVINGS:'Money you keep instead of spending',
  DEBT:'Money you owe to someone',
  CREDIT:'Borrowing power; buy now, pay later',
  LOAN:'Borrowed money you repay with interest',
  CASH:'Physical money, or readily spendable funds',
  SAVES:'Sets money aside instead of spending it',
  COINS:'Metal money you keep in your pocket',
  ATM:'Machine that dispenses cash from your account'
};
var XW_PUZZLES=[
  ['BUDGET.','O......','N.FUND.','D......','STOCK..','.A.....','.X.....'],
  ['ASSET..','.A.....','.V.....','YIELD..','.N..E..','.G..B..','.S..T..'],
  ['CREDIT.','O......','I......','N......','SAVES..','.T.....','.M.....']
];
var xwState=null;
function dayOfYear(){var n=new Date();var s=new Date(n.getFullYear(),0,0);return Math.floor((n-s)/86400000);}
function xwBuildEntries(grid){
  var R=grid.length,C=grid[0].length;
  function blk(r,c){return r<0||c<0||r>=R||c>=C||grid[r].charAt(c)==='.';}
  var numAt={},across=[],down=[],n=0;
  for(var r=0;r<R;r++)for(var c=0;c<C;c++){
    if(blk(r,c))continue;
    var sA=blk(r,c-1)&&!blk(r,c+1),sD=blk(r-1,c)&&!blk(r+1,c);
    if(sA||sD){n++;numAt[r+'_'+c]=n;}
    if(sA){var w='',cc=c;while(!blk(r,cc)){w+=grid[r].charAt(cc);cc++;}across.push({num:n,r:r,c:c,ans:w});}
    if(sD){var w2='',rr=r;while(!blk(rr,c)){w2+=grid[rr].charAt(c);rr++;}down.push({num:n,r:r,c:c,ans:w2});}
  }
  return {numAt:numAt,across:across,down:down,R:R,C:C,blk:blk};
}
function initCrossword(){
  var idx=dayOfYear()%XW_PUZZLES.length;
  var grid=XW_PUZZLES[idx];
  var meta=xwBuildEntries(grid);
  var entry={};// map "r_c" -> answer letter
  for(var r=0;r<meta.R;r++)for(var c=0;c<meta.C;c++)if(!meta.blk(r,c))entry[r+'_'+c]=grid[r].charAt(c);
  xwState={grid:grid,meta:meta,sol:entry,checked:false};
  xwRender();
}
function xwRender(){
  var el=document.getElementById('xwordBody');if(!el)return;var s=xwState,m=s.meta;
  var h=gameHead('📰','Finance Crossword','Fill the grid using the money clues below.');
  h+='<div class="xword-grid" style="grid-template-columns:repeat('+m.C+',1fr)">';
  for(var r=0;r<m.R;r++)for(var c=0;c<m.C;c++){
    if(m.blk(r,c)){h+='<div class="xword-cell blk"></div>';continue;}
    var num=m.numAt[r+'_'+c];
    h+='<div class="xword-cell"><input id="xw_'+r+'_'+c+'" maxlength="1" inputmode="text" autocomplete="off" '
      +'oninput="xwInput('+r+','+c+')" onkeydown="xwKey(event,'+r+','+c+')" onfocus="xwFocus('+r+','+c+')"/>'
      +(num?'<span class="xw-num">'+num+'</span>':'')+'</div>';
  }
  h+='</div>';
  h+='<div class="xword-clues"><div class="xwc-col"><div class="xwc-h">Across</div>';
  m.across.forEach(function(e){h+='<div class="xwc-clue" onclick="xwGo('+e.r+','+e.c+',\'A\')"><b>'+e.num+'</b> '+(XW_CLUES[e.ans]||e.ans)+'</div>';});
  h+='</div><div class="xwc-col"><div class="xwc-h">Down</div>';
  m.down.forEach(function(e){h+='<div class="xwc-clue" onclick="xwGo('+e.r+','+e.c+',\'D\')"><b>'+e.num+'</b> '+(XW_CLUES[e.ans]||e.ans)+'</div>';});
  h+='</div></div>';
  h+='<button class="btn btn-pur" onclick="xwCheck()">Check answers</button>';
  el.innerHTML=h;
  xwDir='A';
}
var xwDir='A';
function xwCell(r,c){return document.getElementById('xw_'+r+'_'+c);}
function xwFocus(r,c){
  var m=xwState.meta;
  document.querySelectorAll('.xword-cell input').forEach(function(i){i.classList.remove('hl');});
  // highlight the active word in current direction
  if(xwDir==='A'){var cc=c;while(!m.blk(r,cc-1))cc--;while(!m.blk(r,cc)){var el=xwCell(r,cc);if(el)el.classList.add('hl');cc++;}}
  else{var rr=r;while(!m.blk(rr-1,c))rr--;while(!m.blk(rr,c)){var el2=xwCell(rr,c);if(el2)el2.classList.add('hl');rr++;}}
}
function xwInput(r,c){
  var el=xwCell(r,c);if(!el)return;el.value=el.value.toUpperCase().replace(/[^A-Z]/g,'');
  el.parentNode.classList.remove('ok','no');
  if(el.value){var m=xwState.meta;
    if(xwDir==='A'&&!m.blk(r,c+1)){var nx=xwCell(r,c+1);if(nx)nx.focus();}
    else if(xwDir==='D'&&!m.blk(r+1,c)){var nx2=xwCell(r+1,c);if(nx2)nx2.focus();}
  }
}
function xwKey(e,r,c){
  var m=xwState.meta;
  if(e.key==='Backspace'&&!xwCell(r,c).value){
    if(xwDir==='A'&&!m.blk(r,c-1)){e.preventDefault();xwCell(r,c-1).focus();}
    else if(xwDir==='D'&&!m.blk(r-1,c)){e.preventDefault();xwCell(r-1,c).focus();}
  }
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){xwDir='A';}
  if(e.key==='ArrowUp'||e.key==='ArrowDown'){xwDir='D';}
}
function xwGo(r,c,dir){xwDir=dir;var el=xwCell(r,c);if(el){el.focus();xwFocus(r,c);}}
function xwCheck(){
  var s=xwState,m=s.meta,right=0,total=0;
  for(var r=0;r<m.R;r++)for(var c=0;c<m.C;c++){
    if(m.blk(r,c))continue;total++;
    var el=xwCell(r,c);var v=(el.value||'').toUpperCase();
    el.parentNode.classList.remove('ok','no');
    if(v===s.sol[r+'_'+c]){el.parentNode.classList.add('ok');right++;}
    else if(v)el.parentNode.classList.add('no');
  }
  if(right===total){
    if(!s._xpGiven)gameXP(s,1,'Finance Crossword');/* toast doubles as the solve celebration */
    else showToast('🎉 Solved! Every clue correct.');
  }
  else showToast(right+' of '+total+' letters correct');
}

/* ════════════════════════════════════════════════════════════════════════
 *  QUICK COUNT — beat the clock, build money-math instincts
 * ════════════════════════════════════════════════════════════════════════ */
var QC_Q=[
  {q:'You earn $4,000 a month. Rent should stay under 30%. Max rent?',ch:['$800','$1,200','$1,600','$2,000'],a:1,tip:'30% of $4,000 = $1,200.'},
  {q:'You put $1,000 in an account earning 5% a year. Interest in year one?',ch:['$5','$50','$500','$150'],a:1,tip:'5% of $1,000 = $50.'},
  {q:'Inflation is 3%. A $100 basket of goods costs about how much next year?',ch:['$97','$100','$103','$130'],a:2,tip:'$100 + 3% = $103.'},
  {q:'A credit card charges 20% APR. Rough interest on a $500 balance held a year?',ch:['$20','$50','$100','$500'],a:2,tip:'20% of $500 = $100.'},
  {q:'You save $200 a month. How much after a year (no interest)?',ch:['$1,200','$2,000','$2,400','$3,600'],a:2,tip:'$200 × 12 = $2,400.'},
  {q:'An $80 item is marked 25% off. Sale price?',ch:['$55','$60','$65','$75'],a:1,tip:'25% off $80 = $20 off = $60.'},
  {q:'You want $6,000 saved in 12 months. How much per month?',ch:['$400','$500','$600','$750'],a:1,tip:'$6,000 ÷ 12 = $500.'},
  {q:'A stock rises from $50 to $60. Percent gain?',ch:['10%','16%','20%','25%'],a:2,tip:'$10 gain ÷ $50 = 20%.'}
];
var qcState=null,qcTimer=null;
function initQuickCount(){
  if(qcTimer){clearInterval(qcTimer);qcTimer=null;}
  qcState={i:0,score:0,answered:false,t:15};
  qcRender();qcStartTimer();
}
function qcStartTimer(){
  if(qcTimer)clearInterval(qcTimer);
  qcState.t=15;
  qcTimer=setInterval(function(){
    var p=document.getElementById('page-game-quiz');
    if(!p||!p.classList.contains('active')){clearInterval(qcTimer);qcTimer=null;return;}
    if(qcState.answered)return;
    qcState.t-=0.1;
    if(qcState.t<=0){qcState.t=0;qcAnswer(-1);return;}
    var bar=document.getElementById('qcBar');if(bar)bar.style.width=(qcState.t/15*100)+'%';
    var num=document.getElementById('qcSecs');if(num)num.textContent=Math.ceil(qcState.t)+'s';
  },100);
}
function qcRender(){
  var el=document.getElementById('qcBody');if(!el)return;var s=qcState;
  if(s.i>=QC_Q.length)return qcEnd();
  var q=QC_Q[s.i];
  var h=gameHead('⚡','Quick Count','Answer fast, you have 15 seconds each.');
  h+='<div class="qc-top"><span class="qc-count">Q'+(s.i+1)+' / '+QC_Q.length+'</span>'
    +'<span class="qc-score">Score '+s.score+'</span>'
    +'<span class="qc-secs" id="qcSecs">15s</span></div>';
  h+='<div class="qc-timer"><div class="qc-bar" id="qcBar" style="width:100%"></div></div>';
  h+='<div class="qc-q">'+q.q+'</div>';
  h+='<div class="quiz-choices">';
  q.ch.forEach(function(c,i){
    var cls='';
    if(s.answered){if(i===q.a)cls='right';else if(i===s.pick)cls='wrong';}
    h+='<button class="quiz-choice '+cls+'" '+(s.answered?'disabled':'onclick="qcAnswer('+i+')"')+'>'+c+'</button>';
  });
  h+='</div>';
  if(s.answered){
    h+=miaSays((s.pick===q.a?'Correct! ':'Not quite. ')+q.tip);
  }
  el.innerHTML=h;
}
function qcAnswer(i){
  var s=qcState;if(s.answered)return;
  s.answered=true;s.pick=i;
  if(i===QC_Q[s.i].a)s.score++;
  qcRender();
  setTimeout(function(){
    s.i++;s.answered=false;s.pick=undefined;
    if(s.i>=QC_Q.length){if(qcTimer){clearInterval(qcTimer);qcTimer=null;}qcRender();}
    else{qcRender();qcStartTimer();}
  },1400);
}
function qcEnd(){
  var s=qcState;var el=document.getElementById('qcBody');
  var label=s.score>=7?'Finance Expert 🧠':s.score>=5?'Money Pro':s.score>=3?'Getting Savvy':'Rookie';
  var col=s.score>=7?'var(--green)':s.score>=5?'var(--purple-deep)':s.score>=3?'var(--amber)':'var(--muted)';
  gameXP(s,s.score/QC_Q.length,'Quick Count');
  el.innerHTML=gameHead('⚡','Quick Count','Time\'s up!')
    +'<div class="game-result"><div class="gr-grade" style="color:'+col+'">'+s.score+'/'+QC_Q.length+'</div><div class="gr-label">'+label+'</div></div>'
    +miaSays("Quick money math, what's 30% of your pay, what 5% earns, is a real superpower. The more you practise, the more it becomes instinct.")
    +'<button class="btn btn-pur" onclick="initQuickCount()">Play again ↻</button>';
}

/* ════════════════════════════════════════════════════════════════════════
 *  LOAN CALCULATOR
 * ════════════════════════════════════════════════════════════════════════ */
var loanState={p:15000,rate:7,term:36};
function monthlyPayment(principal,annualPct,months){
  var r=annualPct/100/12;
  if(r===0)return principal/months;
  return principal*r/(1-Math.pow(1+r,-months));
}
function renderLoanCalc(){
  var el=document.getElementById('loanBody');if(!el)return;var s=loanState;
  var pay=monthlyPayment(s.p,s.rate,s.term);
  var totalCost=pay*s.term;var interest=totalCost-s.p;
  var iPct=totalCost>0?Math.round(interest/totalCost*100):0;
  var terms=[{m:12,l:'1 yr'},{m:24,l:'2 yr'},{m:36,l:'3 yr'},{m:60,l:'5 yr'},{m:84,l:'7 yr'}];
  var h=gameHead('💳','Loan Calculator','See what a loan really costs once interest is added.');
  h+='<div class="card calc-out"><div class="co-label">Monthly payment</div><div class="co-big tnum">'+money(pay)+'</div>'
    +'<div class="co-split"><div class="cs"><label>Principal</label><b class="tnum">'+money0(s.p)+'</b></div>'
      +'<div class="cs"><label>Total interest</label><b class="tnum" style="color:var(--red)">'+money0(interest)+'</b></div>'
      +'<div class="cs"><label>Total cost</label><b class="tnum">'+money0(totalCost)+'</b></div></div>'
    +'<div class="split-bar"><div class="sb-p" style="width:'+(100-iPct)+'%"></div><div class="sb-i" style="width:'+iPct+'%"></div></div>'
    +'<div class="split-key"><span><i class="dot-p"></i>Principal</span><span><i class="dot-i"></i>Interest '+iPct+'%</span></div></div>';
  h+='<div class="card calc-form">'
    +'<div class="cf-row"><label>Loan amount</label><span class="tnum cf-val">'+money0(s.p)+'</span></div>'
    +'<input type="range" min="1000" max="100000" step="500" value="'+s.p+'" oninput="loanState.p=+this.value;renderLoanCalc()"/>'
    +'<div class="cf-row"><label>Interest rate</label><span class="tnum cf-val">'+s.rate.toFixed(1)+'%</span></div>'
    +'<input type="range" min="0" max="25" step="0.5" value="'+s.rate+'" oninput="loanState.rate=+this.value;renderLoanCalc()"/>'
    +'<div class="cf-row" style="margin-bottom:8px"><label>Term</label></div>'
    +'<div class="chip-row">';
  terms.forEach(function(t){h+='<div class="calc-chip'+(s.term===t.m?' on':'')+'" onclick="loanState.term='+t.m+';renderLoanCalc()">'+t.l+'</div>';});
  h+='</div></div>';
  h+=miaSays("Stretching a loan over more years lowers the monthly payment but you pay <b>more interest overall</b>. A higher rate quietly does the same.");
  el.innerHTML=h;
}

/* ════════════════════════════════════════════════════════════════════════
 *  MORTGAGE CALCULATOR
 * ════════════════════════════════════════════════════════════════════════ */
var mortState={price:450000,down:10,rate:5,years:25};
function renderMortgageCalc(){
  var el=document.getElementById('mortBody');if(!el)return;var s=mortState;
  var downAmt=s.price*s.down/100;var loan=s.price-downAmt;var months=s.years*12;
  var pay=monthlyPayment(loan,s.rate,months);var totalPaid=pay*months;var interest=totalPaid-loan;
  var iPct=totalPaid>0?Math.round(interest/totalPaid*100):0;
  var donut=miniDonut([{v:(100-iPct)/100,c:'#6f659a'},{v:iPct/100,c:'#cf5a40'}],108,iPct+'%','interest');
  var downs=[5,10,20];
  var amorts=[{y:15,l:'15 yr'},{y:20,l:'20 yr'},{y:25,l:'25 yr'},{y:30,l:'30 yr'}];
  var h=gameHead('🏠','Mortgage Calculator','Estimate the monthly payment on a home.');
  h+='<div class="card calc-out"><div class="co-label">Monthly payment</div><div class="co-big tnum">'+money(pay)+'</div>'
    +'<div class="mort-donut">'+donut+'<div class="md-rows">'
      +'<div class="cs"><label>Mortgage</label><b class="tnum">'+money0(loan)+'</b></div>'
      +'<div class="cs"><label>Down payment</label><b class="tnum">'+money0(downAmt)+'</b></div>'
      +'<div class="cs"><label>Total interest</label><b class="tnum" style="color:var(--red)">'+money0(interest)+'</b></div>'
      +'<div class="cs"><label>Total paid</label><b class="tnum">'+money0(totalPaid+downAmt)+'</b></div>'
    +'</div></div></div>';
  h+='<div class="card calc-form">'
    +'<div class="cf-row"><label>Home price</label><span class="tnum cf-val">'+money0(s.price)+'</span></div>'
    +'<input type="range" min="100000" max="1500000" step="10000" value="'+s.price+'" oninput="mortState.price=+this.value;renderMortgageCalc()"/>'
    +'<div class="cf-row" style="margin-bottom:8px"><label>Down payment</label><span class="cf-val">'+s.down+'%</span></div>'
    +'<div class="chip-row">';
  downs.forEach(function(d){h+='<div class="calc-chip'+(s.down===d?' on':'')+'" onclick="mortState.down='+d+';renderMortgageCalc()">'+d+'%</div>';});
  h+='</div>'
    +'<div class="cf-row"><label>Interest rate</label><span class="tnum cf-val">'+s.rate.toFixed(1)+'%</span></div>'
    +'<input type="range" min="1" max="12" step="0.25" value="'+s.rate+'" oninput="mortState.rate=+this.value;renderMortgageCalc()"/>'
    +'<div class="cf-row" style="margin-bottom:8px"><label>Amortization</label></div>'
    +'<div class="chip-row">';
  amorts.forEach(function(a){h+='<div class="calc-chip'+(s.years===a.y?' on':'')+'" onclick="mortState.years='+a.y+';renderMortgageCalc()">'+a.l+'</div>';});
  h+='</div></div>';
  var tip=s.down<20
    ?"With less than <b>20% down</b>, you'll usually pay for mortgage default insurance (CMHC in Canada), which adds to your cost."
    :"A 20%+ down payment skips mortgage insurance and shrinks your loan, less interest over the whole term.";
  h+=miaSays(tip);
  el.innerHTML=h;
}

/* ════════════════════════════════════════════════════════════════════════
 *  DEBTOR'S TOWER — finance-term Hangman. Each wrong guess collapses a floor
 *  of the tower; five wrong = bankruptcy. Win or lose, Mia explains the word so
 *  every round teaches a term. Reuses gameHead()/miaSays()/gameXP().
 * ════════════════════════════════════════════════════════════════════════ */
var HM_WORDS=[
  {w:'DIVIDEND',  cat:'Stock Market',  clue:'Companies pay this to shareholders',          def:"A slice of a company's profit paid out to shareholders, passive income from owning stock.",more:"For example, own 100 shares of a company that pays a $2 dividend and you'd collect $200, just for holding it. Many investors reinvest dividends to buy more shares and compound faster over time."},
  {w:'INFLATION', cat:'Economics',     clue:'Makes $100 buy less over time',               def:'The gradual rise in prices over time, which erodes the purchasing power of cash.',more:"At about 3% a year, a $5 coffee becomes roughly $6.70 in ten years. That's why cash sitting idle slowly loses value, and why people invest to try to stay ahead of it."},
  {w:'PORTFOLIO', cat:'Investing',     clue:'Your collection of investments',              def:'The full set of assets (stocks, ETFs, bonds, cash) that you own.',more:"A healthy portfolio is usually a mix, maybe some stock ETFs, a few bonds, and a cash cushion, so a drop in one part doesn't sink the whole thing."},
  {w:'LIQUIDITY', cat:'Finance Basics',clue:'How quickly you can turn it into cash',       def:'How fast an asset can become cash without losing value. Savings are liquid; a house is not.',more:"Cash in your chequing account is the most liquid, you can spend it instantly. A house is the opposite: selling it can take months. Keep enough liquid savings for surprises."},
  {w:'COMPOUND',  cat:'Investing',     clue:'Earning returns on your returns',             def:'Compound interest means your gains earn gains, a snowball effect that rewards patience.',more:"Invest $1,000 at 8% and leave it untouched: it grows to about $2,160 in ten years and over $10,000 in thirty, without adding a cent. Time does the heavy lifting, so start early."},
  {w:'LEVERAGE',  cat:'Risk',          clue:'Borrowing to amplify a bet',                  def:'Using borrowed money to increase potential gains, and losses. High leverage = high risk.',more:"Borrowing to invest can double your gains, but it doubles your losses too. A big drop on a leveraged position can wipe you out entirely, which is why beginners should be very cautious with it."},
  {w:'MORTGAGE',  cat:'Real Estate',   clue:'A loan secured by a property',                def:'A long-term loan used to buy property, where the property itself is the collateral.',more:"Stop paying and the bank can take the house, that's what 'secured by the property' means. The trade-off is much lower interest than an unsecured loan, since the lender takes on less risk."},
  {w:'RECESSION', cat:'Economics',     clue:'The economy shrinks for two quarters',        def:'A period of economic decline, usually two consecutive quarters of negative GDP growth.',more:"Recessions are a normal part of the economic cycle, they come and go. Long-term investors usually ride them out rather than panic-sell near the bottom and lock in losses."},
  {w:'COLLATERAL',cat:'Lending',       clue:'An asset pledged against a loan',             def:'Property or assets offered as security for a loan. If you default, the lender takes it.',more:"A car loan uses the car as collateral; a mortgage uses the house. Because the lender can seize the asset if you don't pay, these secured loans usually charge lower interest."},
  {w:'VOLATILITY',cat:'Markets',       clue:'How wildly a price swings',                   def:'The degree of price fluctuation in an asset, high volatility = big swings up and down.',more:"Crypto is highly volatile, it can swing 10% in a single day. A government bond barely moves. Higher volatility means higher potential reward but a much bumpier ride."},
  {w:'BANKRUPT',  cat:'Finance Basics',clue:'Unable to repay what you owe',                def:'A legal state where a person or company cannot repay debts, triggering a court process.',more:"Bankruptcy isn't quite the end, it's a legal reset for debts that truly can't be repaid. But it badly damages your credit for years, so it's a last resort, not a strategy."},
  {w:'DEFICIT',   cat:'Economics',     clue:'Spending more than you earn',                 def:'When spending exceeds income, a negative balance. The opposite of a surplus.',more:"If you (or a government) spend $1.10 for every $1 that comes in, you run a deficit and must borrow the difference. Repeated deficits pile up into debt over time."},
  {w:'CAPITAL',   cat:'Finance Basics',clue:'Money used to make more money',               def:'Wealth in the form of money or assets that can be invested or used to grow a business.',more:"Your savings become capital the moment you put them to work, buying stocks, starting a side business, or funding a project that can earn a return."},
  {w:'INTEREST',  cat:'Lending',       clue:'The cost of borrowing money',                 def:'The fee paid for borrowing money (or earned for lending it), shown as a percentage rate.',more:"Interest cuts both ways: you earn it in a savings account, but you pay it on a credit card, often 20%+. Clearing high-interest debt is one of the best guaranteed 'returns' there is."},
  {w:'PREMIUM',   cat:'Insurance',     clue:'Your regular insurance payment',              def:'The periodic payment made to keep an insurance policy active.',more:"You pay a premium each month or year so that if something goes wrong, a crash, a fire, an illness, the insurer covers the big bill instead of you. It's trading a small known cost for protection."},
  {w:'EQUITY',    cat:'Investing',     clue:'Your ownership stake in something',           def:"An asset's value minus what you owe on it. In stocks, equity is your ownership share.",more:"If your home is worth $400k and you still owe $250k on the mortgage, you have $150k of equity, the part you truly own. It grows as you pay down debt or the value rises."},
  {w:'REVENUE',   cat:'Business',      clue:'Total money coming into a business',          def:'The total income a business earns before expenses are taken out, the "top line".',more:"Revenue isn't profit. A company with huge revenue can still lose money if its costs are even higher, which is why investors look at the bottom line too, not just sales."},
  {w:'RETIREMENT',cat:'Planning',      clue:'When you stop working and live off savings',  def:'The phase when you leave work and draw income from savings, pensions, or investments.',more:"The earlier you start saving for it, the less you need to set aside each month, because compounding does more of the work the longer your money has to grow."},
  {w:'DEDUCTIBLE',cat:'Insurance',     clue:'What you pay before insurance kicks in',      def:'The amount you pay out of pocket on a claim before your insurance starts paying.',more:"With a $500 deductible on a $2,000 claim, you pay the first $500 and the insurer covers $1,500. Choosing a higher deductible usually lowers your monthly premium."},
  {w:'DIVERSIFY', cat:'Investing',     clue:"Don't put all eggs in one basket",            def:'Spreading investments across different assets or sectors to reduce risk.',more:"Instead of betting everything on one stock, you spread across many, so if a single company stumbles, the others can cushion the blow. An ETF does this for you in one purchase."},
  {w:'SOLVENCY',  cat:'Finance Basics',clue:'Able to meet all your financial obligations', def:'The ability to pay all debts when they come due. The opposite of insolvency.',more:"You're solvent when your assets and income comfortably cover what you owe. Lose that balance for too long and insolvency, and possibly bankruptcy, can follow."},
  {w:'BUDGET',    cat:'Finance Basics',clue:'A plan for your income and expenses',         def:'A financial plan that splits your income across needs, wants, and savings goals.',more:"A popular starting point is 50/30/20: half your income to needs, 30% to wants, and 20% to savings and debt. Adjust the mix until it fits your real life."}
];
var hmState=null;
function initHangman(){
  var pool=hmState?HM_WORDS.filter(function(x){return x.w!==hmState.word;}):HM_WORDS;
  var p=pool[Math.floor(Math.random()*pool.length)];
  hmState={word:p.w,cat:p.cat,clue:p.clue,def:p.def,more:p.more,guessed:[],wrong:0,maxWrong:5,done:false,won:false,_xpGiven:false};
  hmRender();
}
/* Five stacked floors, top floor crumbles first; bottom-up colours go safe→warn→danger.
 * Floor f (max=top … 1=bottom) has fallen once `wrong` reaches its rank from the top. */
function hmTower(wrong,max,live){
  var h='<div class="hm-tower">';
  for(var f=max;f>=1;f--){
    var rank=max-f+1;/* 1=top, max=bottom */
    var fallen=wrong>=rank,cracking=(live&&wrong>0&&rank===wrong+1);/* top standing floor wobbles as a warning */
    var color=rank<=2?'safe':(rank<=4?'warn':'danger');
    h+='<div class="hm-floor '+color+(fallen?' fallen':'')+(cracking?' cracking':'')+'"><span class="hm-floor-label">FLOOR '+f+'</span></div>';
  }
  h+='<div class="hm-base'+(wrong>=max?' bust':'')+'">'+(wrong>=max?'💀 BANKRUPT':'🏦 FISCALLY BANK')+'</div></div>';
  return h;
}
function hmRender(){
  var s=hmState,el=document.getElementById('hmBody');if(!el)return;
  var letters=s.word.split('').map(function(l){
    var got=s.guessed.indexOf(l)>=0;
    return got?'<span class="hm-l revealed">'+l+'</span>':'<span class="hm-l blank">'+(s.done?l:'')+'</span>';
  }).join('');
  var keyboard='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(l){
    var picked=s.guessed.indexOf(l)>=0,hit=picked&&s.word.indexOf(l)>=0,miss=picked&&s.word.indexOf(l)<0;
    return '<button class="hm-key'+(hit?' hit':'')+(miss?' miss':'')+'"'+((picked||s.done)?' disabled':'')+' onclick="hmGuess(\''+l+'\')">'+l+'</button>';
  }).join('');
  var end='';
  if(s.done){
    var name=s.word.charAt(0)+s.word.slice(1).toLowerCase();
    var intro=s.won?"Nicely done! Here's the term you just spelled:":"No worries, every collapse teaches you something. Here's the word:";
    end='<div class="hm-end '+(s.won?'win':'lose')+'">'+(s.won?'🎉 You saved the tower!':'💸 The tower collapsed!')+'</div>'
      +miaSays(intro+'<br><br><b>'+name+'</b> — '+s.def+(s.more?'<br><br>💡 <b>In practice:</b> '+s.more:''));
  }
  el.innerHTML=gameHead('🏦',"Debtor's Tower",s.cat+' · '+(s.maxWrong-s.wrong)+' mistakes left')
    +hmTower(s.wrong,s.maxWrong,!s.done)
    +'<div class="hm-clue">💡 '+s.clue+'</div>'
    +'<div class="hm-word">'+letters+'</div>'
    +end
    +(s.done?'':'<div class="hm-keys">'+keyboard+'</div>')
    +(s.done?'<button class="btn btn-pur hm-replay" onclick="initHangman()">Play again ↻</button>':'');
  if(s.done)gameXP(s,s.won?1:0.3,s.won?'Word solved!':'Tower fell, but you learned a word');
}
function hmGuess(l){
  if(!hmState||hmState.done||hmState.guessed.indexOf(l)>=0)return;
  hmState.guessed.push(l);
  if(hmState.word.indexOf(l)<0){
    hmState.wrong++;
    if(hmState.wrong>=hmState.maxWrong)hmState.done=true;
  }else if(hmState.word.split('').every(function(c){return hmState.guessed.indexOf(c)>=0;})){
    hmState.won=true;hmState.done=true;
  }
  hmRender();
}
