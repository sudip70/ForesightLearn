/* ── Mia coach chat (placeholder) ─────────────────
   A friendly money-coach chat reachable from every in-app page.
   There is no LLM yet: replies are scripted and routed through the
   single coachReply() hook below, so swapping in a real model later
   is a one-function change. Copy is seeded from GLOSS (01-charts-data.js)
   and the coachInsights patterns in the northstar prototype.            */

var COACH_NOTE = '<div class="coach-note">Mia gives general info, not financial advice · full AI coaching coming soon 💜</div>';

/* Each topic: chip = the starter pill label, keys = words that route free
   text here, a = the canned answer (the coming-soon note is appended). */
var COACH_QA = [
  { chip: "What's a TFSA?", keys: ['tfsa', 'tax free', 'tax-free'],
    a: "A <b>TFSA</b> is a Tax-Free Savings Account. Any interest, dividends or growth inside it is completely tax-free — you keep every dollar it earns, even when you withdraw. For most Canadians it's the best first account to open." },
  { chip: "How do I start investing?", keys: ['invest', 'stock', 'etf', 'portfolio', 'start'],
    a: "Start small and steady. Open a TFSA, pick a broad <b>ETF</b> (one fund that holds hundreds of companies, so you're instantly diversified), and add a little on a regular schedule. Time in the market beats timing the market — let compounding do the heavy lifting." },
  { chip: "Help me budget", keys: ['budget', 'spend', 'save money', 'paycheck', 'paycheque'],
    a: "A simple starting point is the <b>50/30/20</b> rule: ~50% of take-home pay on needs, ~30% on wants, and ~20% toward savings and paying down debt. Track it for one month first — seeing where your money actually goes is half the battle." },
  { chip: "Should I pay off debt first?", keys: ['debt', 'loan', 'credit card', 'owe', 'interest'],
    a: "Usually yes for <b>high-interest</b> debt. A credit card charging ~20% is a guaranteed 20% 'return' when you pay it off — hard for investing to beat. Clear the high-interest balances first, then redirect that money into saving and investing." },
  { chip: "How do I avoid scams?", keys: ['scam', 'fraud', 'phishing', 'fake', 'too good'],
    a: "If it promises guaranteed high returns, pressures you to act fast, or asks for gift cards / crypto to 'unlock' money — it's almost certainly a <b>scam</b>. Real investing is never urgent and never guaranteed. When in doubt, slow down and verify independently." },
  { chip: "Why a range, not a price?", keys: ['range', 'predict', 'forecast', 'uncertain', 'guarantee'],
    a: "Nobody can predict an exact price. A <b>range</b> shows the outcomes that are realistically plausible and honestly reminds you the future isn't knowable — which is exactly why we spread risk instead of betting on one number." }
];

var coachSeeded = false;

function coachRow(side, html) {
  if (side === 'me') return '<div class="coach-row me"><div class="coach-me">' + html + '</div></div>';
  return '<div class="coach-row mia"><div class="face">__AV__</div><div class="bubble">' + html + '</div></div>';
}

/* avatar() is defined in 01-charts-data.js; __AV__ in static markup is
   swapped at load, but rows we inject later need an explicit swap. */
function coachAvatarHTML() { return (typeof avatar === 'function') ? avatar() : ''; }

function coachAppend(side, html) {
  var log = document.getElementById('coachLog');
  log.insertAdjacentHTML('beforeend', coachRow(side, html));
  log.querySelectorAll('.face').forEach(function (f) {
    if (f.innerHTML.indexOf('__AV__') >= 0) f.innerHTML = coachAvatarHTML();
  });
  log.scrollTop = log.scrollHeight;
}

function renderCoachChips() {
  var h = '';
  COACH_QA.forEach(function (t, i) {
    h += '<button class="coach-chip" onclick="coachAsk(COACH_QA[' + i + '].chip)">' + t.chip + '</button>';
  });
  document.getElementById('coachChips').innerHTML = h;
}

function seedCoach() {
  if (coachSeeded) return;
  coachSeeded = true;
  coachAppend('mia', "Hi! I'm <b>Mia</b>, your money coach 👋 Ask me anything, or tap a question below to get started.");
  renderCoachChips();
}

/* Clear the conversation and start fresh. The button spins once via a
   one-shot class that's removed when the animation ends. */
function coachReset(btn) {
  document.getElementById('coachLog').innerHTML = '';
  coachSeeded = false;
  seedCoach();
  if (btn) {
    btn.classList.remove('spin');
    void btn.offsetWidth; // reflow so re-adding the class restarts the animation
    btn.classList.add('spin');
  }
  var inp = document.getElementById('coachInput');
  if (inp) inp.value = '';
}

function openCoach() {
  seedCoach();
  document.getElementById('coachOv').classList.add('open');
  var inp = document.getElementById('coachInput');
  if (inp) setTimeout(function () { inp.focus(); }, 50);
}
function closeCoach(e) {
  // close on backdrop click or explicit call (×)
  if (e && e.target !== document.getElementById('coachOv')) return;
  document.getElementById('coachOv').classList.remove('open');
}
function closeCoachBtn() { document.getElementById('coachOv').classList.remove('open'); }

/* The single swap point. Today: keyword-match the canned topics.
   Later: replace the body with a real LLM call (return a Promise<string>). */
function coachReply(text) {
  // TODO: replace with real LLM call (financial-coach system prompt)
  var t = (text || '').toLowerCase();
  for (var i = 0; i < COACH_QA.length; i++) {
    var topic = COACH_QA[i];
    for (var k = 0; k < topic.keys.length; k++) {
      if (t.indexOf(topic.keys[k]) >= 0) return topic.a + COACH_NOTE;
    }
  }
  return "Great question! I'm still learning the ropes — I'll be able to dig into that very soon 💜 In the meantime, try one of the starter questions below." + COACH_NOTE;
}

function coachAsk(text) {
  text = (text || '').trim();
  if (!text) return;
  coachAppend('me', escapeCoach(text));
  // tiny "typing" beat so Mia feels alive — keep a direct node ref so rapid
  // sends don't collide on a shared id (each send gets its own indicator)
  var log = document.getElementById('coachLog');
  var typing = document.createElement('div');
  typing.className = 'coach-row mia';
  typing.innerHTML = '<div class="face">' + coachAvatarHTML() + '</div><div class="bubble coach-typing"><span></span><span></span><span></span></div>';
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;
  setTimeout(function () {
    typing.remove();
    coachAppend('mia', coachReply(text));
  }, 480);
}

function coachSend() {
  var inp = document.getElementById('coachInput');
  var text = inp.value;
  inp.value = '';
  coachAsk(text);
}
function coachKey(e) { if (e.key === 'Enter') { e.preventDefault(); coachSend(); } }

/* escape user text before injecting into the chat log */
function escapeCoach(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
