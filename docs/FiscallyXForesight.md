# FiscallyXForesight — Product, Brand & Build Reference

**Status:** Canonical source of truth
**Date:** 2026-06-08
**Supersedes:** `FISCALLY_BRAND.md` (brand & design)
**Companion doc:** `FISCALLY_DOCS.md` (API / DB / prototype technical reference — ERDs, endpoint details, change log)

> **Build-status legend used throughout this doc**
> ✅ Built & working in `fiscally-prototype.html`
> 🔄 Partially built — exists but incomplete or off-spec
> 📋 Planned — specified in docs, not yet built
> ❌ Not started, not yet specified

---

## 1. Identity

**Fiscally is the friendly money app that teaches you investing on real numbers — so it never feels like a wall of text or a wall of numbers.**

- **Personality:** warm, plain-spoken guide. Welcoming, encouraging, credible. Calm by default; playful where it helps you learn.
- **Brand promise:** *every number arrives with a sentence; every lesson arrives with a number.* This is both the target plan's operating rule and the brand's literal job description.
- **App name:** **Fiscally** — the product surface. **ForesightLearn** is the project / company name. The backend is deployed as `foresight-backend-*`.
- **Dominant note:** trustworthy guide (everywhere). **Supporting note:** gamified play (Learn only). When in doubt, pick warm + clear over clever + busy.

**Anti-brand (what we are not):** a hype trading app, a wall-of-charts terminal, a fluffy quiz game with no real stakes, or a cold premium fintech that intimidates beginners.

---

## 2. Who It's For & the Emotional Promise

**Core loop (the heart):** *learn a concept → practice it with risk-free money → watch it work → gain confidence.* Financial literacy + a learning platform + paper trading are the core. Goal-setting and tools support it. Paper trading isn't a bolt-on — it's **where the learning becomes real, without real risk.** Fiscally is a **training ground**: practice on real market data until *you're* ready to invest for real. (The "graduation bridge" to real investing is a future target, not yet built.)

**Two overlapping audiences:**
1. **Hesitant beginners** — adults who want to start investing but won't risk real money. Need: credibility, gentle hand-holding, a safe place to build confidence.
2. **Young learners** — teens who can't yet invest real money, learning early. Need: bite-sized, playful, encouraging, zero-pressure practice.

Both share one need: **learn and practice without ever feeling overwhelmed or at risk.**

**Why investing overwhelms people — and our answer:**

| What overwhelms | Our answer |
|---|---|
| Jargon wall | Friendly names + Mia translates; plain verdict before the number |
| Number wall | One idea per screen, airy whitespace, progressive disclosure |
| Fear of losing money | Practice money, "no risk," soft pastels (never alarm-red), warm tone |
| Fear of being wrong | No hearts/punishment; ranges not predictions; Mia coaches, never scolds |
| Too many choices | Always guide to the single next step, never a 10-option dashboard |

**Aesthetic = strategy.** Soft lavender, rounded everything, generous whitespace, slow gentle motion, pastel semantics. The calm look isn't decoration — it keeps both audiences from bouncing off an intimidating topic. **Hard rule: avoid the "finance-bro" aesthetic** — no hype-green candles, no red-alert dashboards.

---

## 3. The Target Plan

> **ForesightLearn is a *learning app that happens to run on real, live market data* — not a forecasting tool that happens to teach.**

Everything else in this document follows from that.

**Operating rule:** *every number arrives with a sentence; every lesson arrives with a number — never a wall of either.*

### Five Design Tenets (acceptance criteria, not vibes)

Every feature is checked against all five. A feature passes only if:

| # | Tenet | Test |
|---|---|---|
| T1 | **Plain verdict first, dense numbers one tap deeper** | The first thing on screen is a sentence + a picture; raw metrics live behind a "See the numbers" disclosure. |
| T2 | **No naked number** | Every metric shown is paired with a plain-language anchor and a friendly name ("Bounciness", not "Annualized volatility"). |
| T3 | **No naked lesson** | Every teaching moment references a real, live number from *this* user's context. |
| T4 | **Teach uncertainty, never prediction** | Anything forward-looking is framed as a *range of plausible outcomes + what moves it*, never a point forecast presented as fact. |
| T5 | **Mia reacts to *you*** | Education is triggered by the user's own decisions and portfolio state, not generic term definitions floating in space. |

---

## 4. Five Strategic Reframes — Plan vs. Build Status

| # | From (today) | To (target) | Status |
|---|---|---|---|
| R1 | Forecast shows "most likely **$X**" | "Nobody can predict this — here's the realistic **range** and **what moves it**" | 🔄 Range exists; copy still says "most likely around $X"; drivers panel missing |
| R2 | Learning = Mia bubbles + glossary | Learning = a **visible progression** (concepts → skills → levels) you can feel yourself climb | 🔄 Path + XP + skills built; not wired to persistent backend |
| R3 | Paper trading = P&L scorekeeping | Paper trading = a **coached behavior loop**: Mia reacts to concentration, chasing, fees, panic | 🔄 Engine + pre/post-trade Mia built; no behavioral analysis service yet |
| R4 | Ephemeral prototype (nothing persists) | **Persistent** accounts, streaks, progress | 📋 Planned in PIVOT_PLAN Phases 1–2; not yet built |
| R5 | Generic "learn investing free" | **Canada-anchored** identity (TFSA/RRSP context, learning-first) | 🔄 Unit 4 + onboarding account picker built; no account-type tagging on trades |

---

## 5. App Structure — Navigation Spine

Five tabs, **one job each**. No feature lives in two places.

| Tab | One job | Owns | Build status |
|---|---|---|---|
| **Home** | Orient & point to next step | Progress, today's one nudge (Mia), portfolio glance, Continue rail | 🔄 Hero + goal card + plan stepper ✅; Mia nudge is generic quiz (not behavioral) |
| **Learn** | Teach | Lesson journey, skills, goal hero, Penny | ✅ 5 units, 20+ lessons, skill map, Penny companion |
| **Practice** | Apply it, risk-free | Paper account (buy/sell, holdings, P&L) + Scenarios | 🔄 Full trading engine ✅; not persistent; Scenarios partially locked |
| **Explore** | Look things up | Stock Finder, Market Today, Scenario Forecast, Calculators | ✅ All four surfaces built with live data |
| **Profile** | You & your why | Goals, streak/level, achievements, settings | 🔄 Level/XP/badges ✅; leaderboard ranks by % return (off-brand); all static |

**Renames (brand doc directive):** Trade → Practice · Tools → Explore · Social → Profile.
**Current prototype:** nav labels match the rename (Practice, Explore, Profile). Page IDs in HTML still use old names (`page-journey`, `page-tools`, `page-social`) — cleanup needed.

**Anti-patterns to fix:** Home re-listing nav as cards · same forecast feature reachable from two tabs (Scenario Forecast in Explore + Stock Finder) · Profile tab showing leaderboard by % return (performance contest = anti-brand) · any screen with no "what's next."

---

## 6. The Three Product Loops

A clean mental model for the whole app. Mia is the connective tissue across all three.

### Loop A — Understand (any number → meaning)
`see a number → plain sentence + picture → "what moves it" → (tap) deeper numbers → "What's That?" glossary`
Honors T1, T2, T4.

**Build status:** Progressive disclosure ✅ · "What's That?" bottom sheet ✅ · Plain anchors on most metrics ✅ · "What moves it?" drivers panel ❌

### Loop B — Do (act → reflect → improve)
`paper trade → live pre-trade explainer (uncertainty) → outcome → Mia reflects on the decision → next decision is better`
Honors T3, T5. The behavioral coach lives here.

**Build status:** Pre-trade explainer ✅ · Post-trade Mia outcome sheet ✅ · Mia reacting to *your specific* portfolio state 📋 · Behavioral analysis service 📋

### Loop C — Grow (encounter → demonstrate → level up)
`encounter a concept → demonstrate it through a behavior → skill unlocks → level up → new content opens`
Honors R2. Skills are **demonstrated by doing** (Loop B feeds Loop C), not by passing quizzes.

**Build status:** Lesson player ✅ · Skill unlocks via behavior ✅ (5 skills, 3 auto-detected) · XP + level system ✅ · Persistent progress 📋

> **The magic is the loops interlock:** a trade in Loop B both triggers coaching (B) and advances a skill (C), and the coaching references a number explained in Loop A. This interlocking is partially working in the prototype; it's fully working once the behavioral coach and persistence land.

---

## 7. Surface-by-Surface: Plan, Design Rules & Build Status

### 7.1 Onboarding (6 steps)

**What it does:** experience quiz → goals → investment amount (interactive donut + slider) → account type (TFSA, with Mia) → milestones → "Let's Start!"

| Step | Design rule | Status |
|---|---|---|
| Experience quiz (Beginner / Intermediate / Experienced) | T5 — tailor from the start | ✅ |
| Goals & "why" picker | T3 — ground learning in a real reason | ✅ |
| Investment amount (donut + slider) | T1 — visual first, number second | ✅ |
| Account type: TFSA, RRSP — with Mia | R5 — Canada-anchored | ✅ |
| Milestones summary | Loop C — set the progression expectation | ✅ |
| Skippable | Reduces friction for returners | ✅ |

Onboarding is skippable but experience quiz result is not yet wired to personalize content order or Mia's tone.

---

### 7.2 Home — "Where am I, what's next"

**Play dial: 1** · Mia ✅ · Penny ❌ · Gold/XP: level/streak hero only

| Element | Design rule | Status |
|---|---|---|
| Portfolio hero (live value, all-time change) | T1, T3 — portfolio as the anchor | ✅ |
| Goal progress card (tappable → goal setup) | T3 — ties the number to a real "why" | ✅ |
| "Today's question" (Mia quiz card) | T5 — *should* be behavioral nudge | 🔄 Generic quiz; must become portfolio-triggered |
| "Your plan" stepper (4-step graduation path) | Loop C — shows the path to real investing | ✅ |
| Continue rail (resume active lesson) | Loop C — frictionless re-entry | 🔄 Static label; not wired to real lesson state |
| Three menu cards (Scenarios, Explore, Tools) | Navigation aid | 🔄 Redundant with nav tabs; anti-pattern per §5 |

**Target gap:** The "Today's nudge" on Home is the single highest-leverage spot in the whole app (it's the first thing users see every day). It must become a *behavioral* Mia card — one thing to do today, drawn from the coach engine — before the app has real retention. Even a simple 2-rule heuristic ("Your money is 80% in tech" or "You've been idle for 3 days") beats a random quiz.

---

### 7.3 Learn — The Spine

**Play dial: 3** · Mia ✅ (guides every lesson) · Penny ✅ (lives here) · Gold/XP ✅ (full)

#### Lesson content (5 units, 20+ lessons) ✅

| Unit | Topic | Lessons | Status |
|---|---|---|---|
| Unit 1 | Money foundations | Budget (50/30/20), Emergency fund, Debt, Inflation | ✅ All playable |
| Unit 2 | Why invest | Saving vs investing, Compounding, Stocks/ETFs/Bonds, Time in the market | ✅ All playable |
| Unit 3 | Build a smart portfolio | Risk, Diversification, Asset mix, Index funds & fees, Reading forecasts (uncertainty) | ✅ All playable |
| Unit 4 | Canadian accounts · TFSA & RRSP | TFSA, RRSP, TFSA vs RRSP, Which account first | ✅ All playable |
| Unit 5 | Plan & reach your goals | SMART goals, Short vs long-term, How much to invest, Ready for real money? | ✅ All playable |

#### Skills (demonstrated by doing, never by quiz) ✅

| Skill | Trigger | Auto-detected | Status |
|---|---|---|---|
| 🌱 First Step | Make first practice trade | ✅ `PF.pos.length > 0` | ✅ |
| 🔭 Reads Uncertainty | Complete the "uncertainty" lesson | 🔄 Via lesson flag, not behavior | 🔄 Should fire when user opens "What moves it?" |
| 🧺 Diversification | Hold 3+ asset types at once | ✅ `pfClasses() >= 3` | ✅ |
| ⚖️ Right-Sizing | Every holding under 25% with 3+ positions | ✅ `big.pct < 0.25` | ✅ |
| 🧘 Patience | Hold through a 5%+ dip | 🔄 Flag-based; dip detection not implemented | 📋 Requires persistent price history |

#### Progression mechanics ✅

- Sequential unlock: each lesson opens the next; locked lessons show 🔒
- Milestone node: "Hold 3+ asset types" — unlocks by doing in Practice, not by quiz ✅ (the Loop B→C handoff working)
- XP + level system: earn XP on lesson completion, quiz answers, skill unlocks ✅
- Streak counter (day streak) ✅ (not yet persisted)
- Daily XP goal ring ✅
- Gems currency ✅ (not yet spent anywhere)
- "Unit guidebook" button → "coming soon" toast 🔄

#### Mia guide banner ✅
Contextual message above the trail — changes based on active lesson and portfolio state. Currently 3 hardcoded cases. Needs to pull from the real coach engine once it exists.

#### Penny the fox companion ✅
Idle bob animation; jumps on lesson completion (`LEARN.petJump = true`). Positioned next to the active node on the trail. **Learn tab only** — never appears on other tabs.

#### Glossary section ✅
10 terms rendered as tappable chips at the bottom of Learn. "Concepts explored" counter.

**Target gap:** Lessons are content-only right now — they don't pull live numbers. T3 requires "every lesson arrives with a number." The `unit 3 → uncertainty` lesson mentions ranges but uses hypothetical examples, not "here's the range on AAPL *you just looked at*." This closes when lessons get a live-number injection layer.

---

### 7.4 Practice — The Do Loop

**Play dial: 0–1** · Mia ✅ (pre/post-trade coach) · Penny ❌ · Gold/XP ❌ (no confetti on Practice)

Four sub-tabs: **Holdings · Trade · Activity · Plan**

| Element | Design rule | Status |
|---|---|---|
| Holdings: positions with avg cost + live unrealized P&L | T1, T2 — numbers with plain anchors | ✅ |
| Holdings: "Adjust" button → risk gauge | T1 — progressive disclosure | ✅ |
| Holdings: account grouping (TFSA / RRSP) | R5 — Canada-anchored | 🔄 Labels present; not tied to trade-level account tagging |
| Trade: asset picker across 56 assets | Breadth of universe | ✅ |
| Trade: pre-trade explainer (bear/base/bull range) | T4, R1 — show range, not prediction | 🔄 Range shown; copy still uses "bear/base/bull" labels; point targets prominent; no "What moves it?" panel |
| Trade: position-sizing nudge before confirm | R3, T5 — Mia notes concentration impact | 📋 Not built |
| Trade: buy execution (weighted avg cost) | Accuracy | ✅ |
| Trade: sell execution with Mia outcome sheet | T3, T5 — coach the result | ✅ |
| Activity: append-only trade log | Audit trail | ✅ |
| Plan: contribution amount + frequency + goal progress + milestones | T3 — plan tied to a real goal | ✅ |
| Portfolio state persists across sessions | R4 — retention floor | 📋 Planned Phase 1–2 of PIVOT_PLAN |

**Engine note:** The trading engine (`PF` state, `START_CAPITAL = $10,000`) is a fully self-contained JS model. It correctly computes weighted average cost and realized P&L. Not yet wired to `/api/paper/*` backend endpoints.

**Target gap on Trade:** The pre-trade explainer is the *most important* place to apply R1/T4. It currently shows three target prices (bear $X, base $Y, bull $Z) with the base as the most prominent. The reframe: lead with the range and the uncertainty, downplay the point targets, and add "What moves this?" drivers. This is a copy + layout edit, not new engineering.

---

### 7.5 Explore — The Understand Loop

**Play dial: 1** · Mia ✅ (translates numbers) · Penny ❌ · Gold/XP ❌

| Surface | Design rule | Status |
|---|---|---|
| **Market Today** — live S&P, Nasdaq, Dow, TSX | T2 — live numbers with plain display | ✅ Live from `/api/market/indices` with Sample fallback |
| **Scenario Forecast** — bear/base/bull for 4 tickers | T4 — range framing | 🔄 Live; but overlaps with Stock Finder; Mia tip is generic |
| **Compound Calculator** — monthly contribution → 10/30-yr | T1, T3 — interactive + plain | ✅ Client-side math |
| **Stock Finder** — search 56 assets, live forecast | Full Understand loop | ✅ See below |

#### Stock Finder (the Understand loop's flagship surface) 🔄

| Element | Design rule | Status |
|---|---|---|
| Search bar across 56 assets | Breadth | ✅ |
| Forecast fan chart (bear/base/bull cone, today divider) | T4 — visualize range not prediction | ✅ |
| Horizon chips (3m / 6m / 1y) | T1 — summary level control | ✅ |
| Mia one-sentence verdict | T1 — plain verdict first | 🔄 Says "most likely around $X" — must reframe to uncertainty language |
| Scenario cards (Rough case / Most likely / Strong case) | T2 — friendly names ✅; but point prices prominent | 🔄 |
| Teaching point ("Bounciness" = volatility) | T2, T3 — explain the metric | ✅ |
| "See all the numbers ▾" progressive disclosure | T1 — dense layer behind reveal | ✅ |
| Dense layer: metrics with plain sentences | T2 — no naked numbers | ✅ |
| Company snapshot (market cap, P/E, etc.) | T2 | ✅ Live from `/api/tickers/{ticker}/profile` |
| **"What moves it?" drivers panel** | T4, R1 — *why* the range is what it is | ❌ Not built; needs `drivers` field from backend |
| Forecast chart colors | Brand palette | 🔄 Uses Foresight colors (bull=blue, base=green, bear=red); should match Fiscally brand |

**Overlap fix needed:** Scenario Forecast in Explore and Stock Finder both serve the Understand loop. Per the "no feature in two places" rule, Scenario Forecast should be reduced to a quick 4-ticker comparison chip row (useful for "how do these stack up?") while Stock Finder owns the full detail view.

---

### 7.6 Scenarios (sub-page from Home)

A guided "what-if" simulation. Currently accessed via the Home menu card.

| Element | Status |
|---|---|
| "Mia's Journey" animated race-track, Speed Up! animation | ✅ |
| Bear Market, Compound Effect, DCA scenarios (locked) | 🔄 Shown but locked; unlock condition unclear |
| Risk gauge + adjust slider | ✅ |
| Live compound area chart | ✅ |

**Navigation note:** Scenarios is reachable from Home but not from any nav tab — it's a dead-end in the IA. Per the brand doc, "no screen with no 'what's next.'" Should either live inside Practice (as guided what-ifs on your portfolio) or Explore (as reference scenarios).

---

### 7.7 Profile — You & Your Why

**Play dial: 2** · Mia ✅ (light) · Penny ❌ · Gold/XP: streaks + badges OK

| Element | Design rule | Status |
|---|---|---|
| Level + XP progress bar (Level 3 · Sprout 🌱) | Loop C — visible growth | ✅ |
| Weekly leaderboard (Jordan / Priya / You / Marcus) | Community | 🔄 **Ranked by % return — anti-brand.** Must rank by XP or lessons completed |
| Achievement badges (First Steps, Know Before You Buy, Bear Aware, Diversified, Lock It In, Compounder) | R2 — visible milestones | ✅ (static; not wired to quest engine) |
| "Share My Journey" button | Virality | ✅ (toast only) |
| "↺ Replay Onboarding" button | Accessibility | ✅ |
| Settings, community sections | Future | 📋 |

**Critical fix:** The leaderboard ranks by portfolio % return. This is the exact "performance contest / hype" pattern the brand explicitly rules out. Switch to XP-based ranking before any real users see it.

---

## 8. Mia — Voice, Coach & Coaching Engine

### 8.1 Character role ✅ (in prototype)

- **The voice** — translates numbers into meaning everywhere in the app.
- **The coach** — reacts to your decisions in Practice.
- **The encourager** — celebrates progress in Learn.
- **One voice, three jobs.** Same character, consistent tone. Even un-attributed UI copy should sound like her.

### 8.2 Current Mia surfaces

| Surface | Mia role | Status |
|---|---|---|
| Tools → Scenario Forecast bubble | Translates bear/base/bull | ✅ |
| Stock Finder verdict sentence | Plain verdict | 🔄 Needs uncertainty reframe |
| Learn guide banner | Contextual encouragement | ✅ (3 hardcoded cases) |
| Lesson player (step-by-step) | Teaches each concept | ✅ |
| Post-trade outcome sheet | Coaches the sell result | ✅ |
| Pre-trade explainer | Prepares for uncertainty | 🔄 Needs uncertainty copy reframe |
| "What's That?" bottom sheet | Glossary anchor | ✅ |
| Home "Today's question" | Daily nudge | 🔄 Generic quiz; must become behavioral |
| **Home behavioral nudge (portfolio-triggered)** | The real T5 | 📋 Not built |
| **Position-sizing nudge (before confirming buy)** | R3, T5 | 📋 Not built |
| **Behavioral pattern warnings (chasing, overtrading)** | R3, T5 | 📋 Not built |
| **Skill milestone celebration** | Loop C | ✅ (toast + XP) |

### 8.3 The Coaching Engine (the moat) 📋

The behavioral coach doesn't exist yet. This is the highest-leverage un-built feature — it's what separates Fiscally from "Investopedia with a quiz."

An insight always has the shape: `{ trigger, plain message, the number behind it, whats_this?, action? }`

**Trigger taxonomy (all six classes — none built yet):**

| Trigger class | Fires when | Example Mia message |
|---|---|---|
| **Pre-trade** | Ticker selected in Practice | "This is a *range*, not a prediction — it could land anywhere from ~$289 to ~$382." |
| **Position-sizing** | Before confirming a buy | "Heads up — this makes NVDA **40%** of your money." |
| **Post-trade (sell)** | A sell executes | "You bought at $X, sold at $Y — that's **+7%**. Here's what drove it." |
| **Portfolio-state** | Portfolio read changes | "Your money is **70%** in tech. Want to see why spreading out lowers risk?" |
| **Behavioral pattern** | Behavior flag set | "That's your **3rd** buy right after a price jump this week — let's talk about chasing." |
| **Progress / milestone** | Skill unlock / streak | "You just held through a **−9%** dip — that's the Patience skill unlocked." |

**Design rules for the coach:**
- **One nudge at a time.** Rank insights; show the single most relevant. Never a wall.
- **Always actionable or dismissible.** Each insight offers a next step or a clean dismiss.
- **Deterministic core.** Rules are explainable and testable; LLM only rephrases, never invents the number. Start with rules; add LLM phrasing layer later.

**Backend service needed:** `GET /api/coach/today` (the Home nudge) · inline insights returned by trade endpoints · powered by `GET /api/coach/portfolio-read` (concentration, chase score, cash drag, behavior flags).

---

## 9. Voice & Tone

Mia *is* the voice. Even un-attributed UI copy should sound like her.

**Six principles:**

1. **Plain verdict first.** Lead with the meaning, then the number. "Most likely around $332 — that's a calm, steady stock." not "Base target: 332.08."
2. **No naked number.** Every metric ships with a one-line plain anchor.
3. **Friendly names** — canonical lexicon below.
4. **Second person, short sentences.** "Your money," "you bought," "here's what that means."
5. **Encouraging, never preachy or alarmist.** Coach the behavior, don't scold. "That's your 3rd buy after a jump — let's talk about chasing," not "Warning: poor decision."
6. **Honest about uncertainty.** Ranges, not predictions. Never imply the future is knowable.

**Friendly-name lexicon (canonical — use in code, copy, and docs):**

| Say this | Not this |
|---|---|
| Bounciness | Volatility |
| Worst drop | Max drawdown |
| Company size | Market cap |
| Rough case / Most likely / Strong case | Bear / Base / Bull |
| Spread out | Diversified |
| How much it leans one way | Concentration |
| Practice money | Paper trading capital |
| Why a range, not a number | — (concept explained in glossary) |

---

## 10. The Cast

### Mia — the voice ✅ (in prototype)
- **Role:** guide who translates numbers → meaning, teaches, and coaches decisions.
- **Where:** **app-wide.** Any screen can have a Mia moment.
- **Behavior:** speaks via speech bubble or Mia-card. Reacts to *your* data. One message at a time — never a wall.
- **Look:** friendly woman, warm skin `#f0b896`, dark hair `#43301f`, in a lavender circle. Inline SVG `avatar()` function in prototype.
- **Rule:** she appears because something in *your* data warrants it — not as ambient narration.

### Penny — the companion ✅ (Learn tab only)
- **Role:** non-verbal buddy who embodies progress and makes the journey feel alive.
- **Where:** **Learn tab only.** Lives on the learning trail.
- **Behavior:** never speaks (no dialogue). Bobs idle, follows up the trail, **jumps when you complete a lesson.** A reward and a presence, not a narrator.
- **Look:** full-body fox — orange `#ee8a37`, cream `#f6eede`, dark paws `#5b3b24`, white-tipped bushy tail. Inline SVG `petSVG()` function in prototype.

**The rule:** *Mia talks, Penny doesn't. Mia is everywhere, Penny is Learn-only.* Penny appearing on Practice or speaking = coherence bug.

---

## 11. Visual Design System

### 11.1 Color tokens ✅ (in prototype)

**Brand (lavender):**

| Token | Hex | Use |
|---|---|---|
| `--purple` | `#9084b4` | Brand accent, secondary text emphasis |
| `--purple-strong` | `#6f659a` | Labels, section headers |
| `--purple-deep` | `#565072` | Primary text emphasis, deep CTA end |
| `--purple-soft` | `#e7e1f4` | Mia bubbles, soft chips, highlight fills |
| `--purple-soft2` | `#d4cbea` | Borders, rings |
| Brand gradient | `#a78bfa → #5546b0` | Primary buttons, hero, Practice nav center |

**Semantic (strict purpose, no substitution):**

| Token | Hex | Meaning — used ONLY for this |
|---|---|---|
| `--green` / `--green-soft` | `#4f9c7e` / `#dbeee6` | Growth, gains, Strong case, bottom-nav active |
| `--gold` / `--gold-soft` / `--gold-ink` | `#e0a92f` / `#fdf0dc` / `#c8761f` | **Gamification only (Learn):** streaks, XP, rewards |
| `--red` / `--red-soft` | `#cf5a40` / `#fbeae6` | Loss, Rough case, caution — sparingly, never to scare |
| `--blue` | `#5b8def` | Forecast "if it goes well" (Strong case) line only |

**Neutrals:** `--bg #f7f5fc` · `--surface #ffffff` · `--surface-soft #f1edf8` · `--ink #322e44` · `--muted #847f9c` · `--faint #aaa4c0` · `--line #eae6f4`

**Usage laws:**
- **Purple = brand & primary action.** Greens, golds, reds never compete for "primary."
- **Gold is sacred to Learn.** A gold streak pill on Practice = wrong — it signals "this is the game zone."
- **Green does double duty** (gains + nav active) — that's fine; both mean "good / go."
- **Red is rare.** Loss numbers and Rough case only. Mia's words carry caution, not red warning boxes.

**Pending:** Forecast chart in Stock Finder still uses Foresight colors (bull=blue, base=green, bear=red) rather than the brand palette (Strong case=blue, Most likely=green, Rough case=red, which happens to match — but the *labels* need to switch to friendly names). Single CSS + copy edit.

### 11.2 Typography ✅

- **Family:** system stack (`-apple-system, "Segoe UI", Roboto, …`). Friendly, fast, native-feeling. If a custom face is ever licensed, pick a warm geometric sans (Poppins / Nunito family) for wordmark + display only. Prototype currently loads **Plus Jakarta Sans** from Google Fonts for the display layer.
- **Weights:** 600 (body emphasis) · 700–800 (labels/titles) · 850 (display/numbers)
- **Numbers:** always `font-variant-numeric: tabular-nums` (`.tnum` class in prototype)
- **Mobile scale:** Display 28–30 · Title 19–21 · Body 14–15 · Caption 11–12 · Big number 24–30

### 11.3 Shape, depth, motion ✅

- **Radii:** cards `16px` (`--r`) · large cards/sheets `22px` (`--r-lg`) · small `11px` · pills `20–30px` · avatars full-circle
- **Depth:** one soft lavender-tinted shadow, not hard borders. `--shadow: 0 4px 18px -6px rgba(86,80,114,.16)` · `--shadow-lg` for sheets/heroes
- **Motion:** gentle and purposeful. 0.2–0.3s transitions. Personality motion is **Penny's** (idle bob, completion jump) and lives in Learn. Money screens don't bounce.
- **Spacing rhythm:** 16px screen gutter · 13px between cards

### 11.4 Coherence map — playfulness dial per screen

**This table is the most important design rule.** It prevents individual screens from drifting out of character.

| Surface | Play dial | Mia | Penny | Gold/XP | Notes |
|---|---|---|---|---|---|
| **Home** | 1 | ✅ one coach card | ❌ | Level/streak hero OK | Calm. Portfolio value + one behavioral nudge. |
| **Learn** | **3** | ✅ guides every lesson | ✅ lives here | ✅ full | The game zone. Trail, lessons, celebrations. |
| **Practice** | 0–1 | ✅ pre/post-trade coach | ❌ | ❌ no confetti | Money is calm + clear. Friendly, never hypey. |
| **Explore** | 1 | ✅ translates numbers | ❌ | ❌ | Data-forward but plain. Uncertainty framing. |
| **Profile** | 2 | ✅ light | ❌ | Streaks/badges OK | Warm, light gamification. **Not** performance rankings. |

If a screen's feel doesn't match its row, that's the incoherence to fix.

---

## 12. Component Kit

Three components enforce the brand promise *in code* — they structurally cannot break the operating rule.

| Component | Rule it enforces | Status |
|---|---|---|
| **Card** | Unit of content. Surface, `--r`, soft shadow. | ✅ |
| **Primary button** | Brand gradient, 850 weight, soft glow. One per view. | ✅ |
| **Secondary / ghost button** | Taupe soft / transparent. Never competes with primary. | ✅ |
| **Pill / badge** | Status & tags. Color = meaning (purple / green / gold / grey). | ✅ |
| ★ **Number-with-sentence** | A metric can't render without its friendly name + plain anchor. *(enforces "no naked number")* | 🔄 Applied manually in most places; not yet a formal component |
| ★ **Progressive disclosure** | Plain verdict + picture by default; dense numbers behind "See the numbers ▾". *(enforces "verdict first")* | ✅ Implemented in Stock Finder; should spread to Trade holdings + Tools metrics |
| ★ **Mia card / bubble** | `{message, the number behind it, whats_this?, action?}` — a lesson can't ship without a number. *(enforces "no naked lesson")* | 🔄 Structure exists; not yet a formal reusable component |
| **"What's That?" sheet** | Bottom-sheet glossary — universal escape hatch for any term. | ✅ |
| **Bottom nav** | 5 tabs, green active icons, Practice emphasized center (FAB style). | ✅ |
| *(Learn only)* Lesson node / Skill chip / Daily strip / Goal hero / Penny | The gamification kit. Strictly scoped to Learn. | ✅ |

**Pending:** Extract tokens into a single shared `:root` (or `tokens.css`) so every screen / prototype imports one source of truth — no per-screen palette definitions.

---

## 13. Backend Plan

The backend's strongest asset: a live Supabase OHLCV → forecasting engine with `plain_language` / `literacy` fields on forecast responses. The work ahead is (a) the persistence foundation and (b) three new services the target plan requires.

### 13.1 Already built ✅

| Route | Purpose | Used by prototype |
|---|---|---|
| `GET /api/health` | Service readiness | — |
| `GET /api/universe` | 56 assets grouped by class | (mirrored client-side) |
| `GET /api/tickers/{ticker}/profile` | Company snapshot (price, market cap, P/E, 52-wk…) | ✅ Stock Finder |
| `GET /api/market/indices` | Latest index snapshots (S&P, Nasdaq, Dow, TSX) | ✅ Market Today |
| `POST /api/forecasts/ticker` | Bear/base/bull forecast for one ticker | ✅ Stock Finder, Scenario Forecast |

**Key forecast response fields already present:** `plain_language`, `literacy{bear_base_bull, volatility, drawdown, confidence}`, `risk_label`, `opportunity_score`, `confidence`, `confidence_label`.

### 13.2 Planned: Persistence foundation (PIVOT_PLAN Phases 1–2) 📋

Auth (Supabase JWT), `user_profiles`, `paper_portfolios`, `paper_positions`, `paper_trades`. Endpoints: `/api/auth/profile`, `/api/paper/portfolio`, `/api/paper/trades`, `/api/paper/positions`, `/api/paper/portfolio/reset`. Full spec in `PIVOT_PLAN.md §4`.

### 13.3 Planned: Plain-language layer as a formal API contract 📋

Today `plain_language` / `literacy` exist ad hoc. Make it a rule: **every numeric field ships with its plain anchor.** Shared response shape:

```
metric: { key, friendly_name, value, unit, plain, whats_this_key }
```

Centralize friendly names + anchor sentences server-side — one source of truth, reused by web + mobile.

### 13.4 Planned: Forecast service — uncertainty reframe 📋

- Change response copy from point-prediction to range/uncertainty language.
- Add a `drivers` field: short plain list of what moves this asset ("earnings, interest rates, tech-sector sentiment") to power the "What moves it?" panel.
- Keep numeric targets but mark them as *scenario endpoints of a range*, surfaced behind disclosure.

### 13.5 Planned: Behavioral Analysis service (the moat) 📋

A read-model over portfolio + trade log. Endpoint: `GET /api/coach/portfolio-read`. Computes in plain terms:
- **Concentration** (largest position %, sector mix)
- **Chase score** — did buys cluster after run-ups?
- **Cash drag** — idle cash %
- **Behavior flags** — overtrading, panic-selling near drawdowns

Output is structured so the coach engine can turn each into a Mia message.

### 13.6 Planned: Curriculum / Progression service 📋

- Concept graph + skill model as static Python defs; progress in DB.
- A skill is demonstrated by a behavior, not a quiz.
- Endpoints: `GET /api/learn/tracks`, `GET /api/learn/progress`, `POST /api/learn/event`.

### 13.7 Planned: Coach / Insight engine 📋

- Deterministic rules first: `(portfolio-read + behavior flags + progress)` → ranked Mia insights.
- LLM phrasing as a later enhancement on top of the rule layer.
- Endpoints: `GET /api/coach/today` (the Home nudge) + inline insights from trade endpoints.

---

## 14. Data Model

### 14.1 Built — market & forecast pipeline ✅

`asset_universe` · `market_ohlcv_daily` · `asset_profile_snapshots` · `forecast_snapshots` · `market_index_snapshots` · `macro_observations` · `refresh_runs` · `refresh_run_items`

Full column specs in `FISCALLY_DOCS.md §7.1`.

### 14.2 Planned — paper trading & learning 📋

From PIVOT_PLAN. All with Row-Level Security (`auth.uid()` ownership).

`user_profiles` · `paper_portfolios` · `paper_positions` · `paper_trades` · `quest_progress` · `concept_events`

Full column specs in `FISCALLY_DOCS.md §7.2` and `PIVOT_PLAN.md §3`.

### 14.3 Planned — coach + progression layer 📋

Additional tables beyond PIVOT_PLAN:

| Table | Purpose |
|---|---|
| `skill_progress` | per-user skill state (locked / unlocked / mastered); defs static in code |
| `lesson_progress` | per-user lesson/track completion; powers the Learn trail + Home progress hero |
| `coach_insights` | log of insights surfaced (shown, dismissed, acted-on); avoids repeating same nudge; feeds Today ranking |
| `behavior_snapshots` *(optional)* | periodic snapshot of portfolio-read metrics; enables longitudinal coaching ("you've gotten less concentrated over 3 weeks") |
| `account_type` on positions/trades | TFSA / RRSP / non-registered tagging; unlocks the Canada wedge and account-aware coaching |

**Note:** Quests (PIVOT_PLAN §6) are folded into the skill/progression model — a quest becomes "a behavior that demonstrates a skill." No parallel system needed.

---

## 15. Sequencing

Each phase is independently shippable and ends with a target check (re-apply T1–T5).

### Phase 0 — Quick copy & coherence fixes (~hours, no backend) 🔄 In progress
- Replace "most likely around $X" forecast copy with uncertainty language (R1, T4)
- Change Stock Finder chart labels to friendly names (Rough / Most likely / Strong)
- Change Profile leaderboard to rank by XP not % return
- Replace generic Home quiz with even 2 simple portfolio-state rules for Mia's nudge (T5)
- Fix page IDs to match brand names (practice / explore / profile)

*Exit check: no screen implies prices are predictable; leaderboard is not a performance contest.*

### Phase 1 — Persistence foundation (R4) 📋
Supabase Auth + paper-trading tables (PIVOT_PLAN Phases 1–2) + wire the prototype's `PF` engine to `/api/paper/*` so trades persist.

*Target check: close the app, reopen, your portfolio + lesson progress are still there.*

### Phase 2 — Behavioral Coach v1 (R3, T5) — **do this early, it's the moat** 📋
Behavioral Analysis service + deterministic Coach engine (3–4 triggers: concentration, position-sizing, post-trade, chase). Surface as Home "Today" nudge + inline Practice reflections.

*Target check: Mia says something true about *your specific* portfolio.*

### Phase 3 — Uncertainty reframe in UI (R1, T4) 📋
Forecast copy → range/uncertainty; add `drivers` + "What moves it?" panel in Explore/Stock Finder and Practice pre-trade explainer.

*Target check: no screen presents a future price as a fact.*

### Phase 4 — Learning spine wired to live data (R2, T3, Loop C) 📋
Curriculum/Progression service + lessons pull live numbers + Home progress hero wired to real lesson state.

*Target check: a new user can feel themselves level up from one real behavior.*

### Phase 5 — Canada wedge (R5) 📋
Account-type tagging (TFSA/RRSP) on trades + account-aware coaching + Canadian-accounts teaching track.

*Target check: the app teaches investing inside the user's actual accounts.*

> **Rationale:** persistence is the floor; coach ships before the full spine because it's the differentiator and reuses what's built; uncertainty reframe is cheap and de-risks trust; spine is the biggest build so it follows once the loops it depends on exist.

---

## 16. How We'll Know It's Working

| Loop | Activation signal | Retention / depth signal |
|---|---|---|
| Onboard | Finishes quiz → first paper trade *with explainer shown* | Returns next day |
| **Do** (B) | Gets a coach insight that's *true about them* | Acts on ≥1 insight |
| **Understand** (A) | Opens "What moves it?" / "See the numbers" | Uses Explore again unprompted |
| **Grow** (C) | Unlocks first skill via a behavior (not a quiz) | Climbs a level; maintains a streak |

**The qualitative "aha" to watch for in user tests:** uncertainty fan chart + a paper trade going wrong + Mia's reflection landing together. If five beginners hit that moment, the thesis holds.

---

## 17. Open Decisions

1. **Platform** — native mobile, PWA, or evolve the single-file prototype into a built app? Affects all of Phase 1–5's delivery. *This decision is blocking Phase 1.*
2. **Two frontends** — formally retire the legacy `frontend/` web app, or keep it as a desktop companion? Root `index.html` still points at it.
3. **Mia's intelligence** — deterministic rules only, or LLM-rephrased on top? Trade-offs: trust, latency, cost, risk of LLM inventing a number (violates the thesis). *Recommendation: rules first, LLM as phrasing layer.*
4. **Audience** — Canada-first (sharper wedge, smaller market) vs general/US (bigger but crowded)?
5. **Scope of forecasting** — fully subordinate to teaching (this plan), or keep a "pro tool" mode for advanced users?
6. **Monetization** — affects how much to invest in the spine vs. keep lean. The "graduation bridge" to real investing is the implied future revenue moment (referral / affiliate to a real brokerage); not yet designed.

---

## 19. What We Keep vs. Deprecate

The backend was originally a market-forecasting / RL portfolio tool. This table is the contract for what to preserve, what to hide, and what to build on top of.

### Keep (untouched)

| What | Why |
|---|---|
| `backend/app/market/repository.py` | Price lookups (`coverage_for_ticker()`) power paper trade execution |
| `backend/app/market/forecasting.py` | Scenario forecasts power the pre-trade explainer |
| `backend/app/api/routes/market.py` | Market Today endpoint unchanged |
| `backend/app/api/routes/forecasts.py` | Forecast endpoint unchanged; add `drivers` field here |
| `backend/app/api/routes/health.py` | Health check unchanged |
| `config/asset_universe.v1.json` | 56-ticker universe is the paper trading universe |
| Daily market data refresh pipeline | OHLCV feeds paper trade prices and live forecasts |
| `.github/workflows/` (all 3) | CI/CD untouched |
| `fiscally-prototype.html` | **The active product surface** — all frontend work targets this file |

### Deprecate (hide, do not delete)

| What | Action |
|---|---|
| `backend/app/ml/` (PPO/SAC RL engine) | Already disabled via `FORESIGHT_LOAD_ARTIFACT_ENGINE=false`; stays in repo |
| `POST /api/inference`, `POST /api/backtests` | Endpoints stay; not called by the prototype |
| `backend/app/api/routes/portfolio.py` (RL simulator) | Keep for reference; not surfaced in Fiscally |
| Legacy `frontend/` web app | Not the active surface; keep for reference, not developed further |
| Brand kicker `"Market Intelligence"` | Already changed to `"Fiscally"` / `"Financial Literacy"` |

### ⚠️ Frontend surface reconciliation

PIVOT_PLAN §5 described changes to `frontend/app.js`, `frontend/index.html`, and `frontend/render/`. **Those files are the legacy web app, not the active product.** All frontend work must target `fiscally-prototype.html` instead. Backend changes (§20) are unaffected — they target `backend/` which is correct.

---

## 20. Quest System

Quests are the gamification layer on top of the skill system — they give users concrete short-term goals in Practice. Quest **definitions** live as a static Python dict in `backend/app/quests/definitions.py` (no migration to add new quests). Only progress rows live in the DB (`quest_progress` table).

**Build status:** 📋 Not yet built. Badges in Profile are static placeholders for these.

### Quest definitions

| quest_id | Title | Completion criteria | XP | Auto-eval on trade? |
|---|---|---|---|---|
| `first_trade` | First Steps | Execute any paper trade | 100 | ✅ |
| `read_forecast` | Know Before You Buy | Execute a trade with `explainer_shown = true` | 75 | ✅ |
| `diversify_three` | Spread It Out | Hold positions in stock + ETF + crypto simultaneously | 200 | ✅ |
| `bear_aware` | Bear Aware | Buy a ticker where `metadata.bear_return < -0.10` | 125 | ✅ |
| `buy_and_hold` | The Buy-and-Hold Experiment | Buy any stock and hold it for ≥ 3 calendar days | 150 | ❌ (time-based) |
| `sell_for_profit` | Lock It In | Sell any position at a realized gain | 250 | ✅ |
| `macro_watcher` | The Macro Watcher | Visit Market Today in 3 separate sessions | 100 | ❌ (session-based) |
| `portfolio_reset` | Start Fresh | Make ≥1 trade, then reset portfolio | 50 | ✅ |

**Auto-evaluation:** After every `POST /api/paper/trades`, the backend auto-checks `first_trade`, `read_forecast`, `bear_aware`, `diversify_three`, `sell_for_profit`, and `portfolio_reset`. The frontend re-fetches quests and fires `showToast` if any newly completed.

**Relationship to skills:** Quests and skills are the same concept — a quest is "a behavior that demonstrates a skill." In the unified model, `first_trade` → First Step skill, `diversify_three` → Diversification skill, etc. No parallel system needed; quest completion logic and skill unlock logic share the same trigger.

### Quest endpoints (planned)

```
GET  /api/quests                    → all definitions + user progress rows
POST /api/quests/{quest_id}/check   → evaluate completion criteria, update status
GET  /api/quests/{quest_id}         → single quest state
```

---

## 21. Concept Explainer System

The mechanism by which Mia surfaces plain-language explanations at the moment they're relevant — not in a separate glossary tab but inline, contextually. Three modes.

**Build status:** Mode A 🔄 (range shown, needs uncertainty copy reframe) · Mode B ✅ · Mode C ✅

### Mode A — Pre-trade explainer (inline in Practice tab) 🔄

When a user selects a ticker in the Trade sub-tab, `renderPreTradeExplainer()` calls `POST /api/forecasts/ticker` and renders the bear/base/bull scenario with Mia's uncertainty framing *before* the user confirms. If the user proceeds to trade, `explainer_shown: true` is sent in the payload — powering the "Know Before You Buy" quest.

**Current state:** Explainer exists and renders ✅. Copy still uses point targets prominently and "bear/base/bull" labels. Needs reframe per R1/T4: lead with the range, downplay point targets, use friendly names (Rough case / Most likely / Strong case), add "What moves it?" once the `drivers` backend field exists.

### Mode B — Post-trade outcome explainer (after selling) ✅

After a sell executes, a Mia outcome sheet renders:
- Realized P&L: "You bought at $X, sold at $Y — that's **+Z%**."
- Plain context for what drove it.
- Uses `lessonCard()` + `termChip("realized_gain")`.

### Mode C — Contextual glossary chips (all tabs) ✅

The existing `openTip(key)` / "What's That?" mechanism. Any term rendered as a `.whats` chip opens the bottom sheet with Mia's plain-language definition. 14 terms in `GLOSS` map currently; 8 more planned (`realized_gain`, `unrealized_pl`, `avg_cost`, `position_sizing`, `opportunity_cost`, `market_order`, `cost_basis`, `shares`).

**Concept tracking (planned 📋):** When a logged-in user taps a glossary chip, a fire-and-forget `POST /api/concepts/seen` logs it to `concept_events`. The Profile tab / user badge shows "N concepts explored."

---

## 22. Backend Implementation Spec (Phase 1 & 2)

Reference for the exact files to create or modify. Backend changes are correct as-is — they target `backend/` which is the real backend regardless of which frontend surface is active.

### New backend files

| File | Phase | What it does |
|---|---|---|
| `supabase/migrations/202606010001_paper_trading.sql` | 1 | Creates all 6 paper-trading tables with RLS |
| `backend/app/api/auth.py` | 1 | FastAPI dependency: validates Supabase JWT, returns `{"sub": "<user_uuid>"}`, raises 401 on failure. Requires `PyJWT>=2.8`. |
| `backend/app/api/routes/auth_routes.py` | 1 | `POST /api/auth/profile` (upsert, idempotent) · `GET /api/auth/profile` · `POST /api/concepts/seen` |
| `backend/app/api/routes/paper_trading.py` | 2 | All 5 paper endpoints (see §13.2) |
| `backend/app/quests/definitions.py` | 3 | Static Python dict of 8 quest definitions |
| `backend/app/api/routes/quests.py` | 3 | Quest endpoints (see §20) |

### Modified backend files

| File | Phase | Change |
|---|---|---|
| `backend/app/core/config.py` | 1 | Add `supabase_anon_key: str` and `jwt_secret: str` fields + env var mappings |
| `backend/app/api/schemas.py` | 1–3 | Add 5 Pydantic schemas (see below) |
| `backend/app/api/routes/__init__.py` | 1–3 | Register `auth_router`, `paper_trading_router`, `quests_router` |
| `backend/app/main.py` | 1 | Lock down CORS (see below) |
| `requirements.txt` + `requirements-render.txt` | 1 | Add `PyJWT>=2.8` |
| `render.yaml` | 1 | Add `SUPABASE_ANON_KEY` and `SUPABASE_JWT_SECRET` env vars (`sync: false`) |

### Pydantic schemas to add to `schemas.py`

```
PaperTradeRequest       — ticker, action (buy/sell), shares, note?, quest_id?, explainer_shown
PaperPositionResponse   — ticker, asset_class, shares, avg_cost, current_price,
                          current_value, unrealized_pl, unrealized_pl_pct
PaperPortfolioResponse  — cash_balance, total_invested, total_current_value,
                          total_unrealized_pl, positions[]
QuestProgressResponse   — quest_id, title, description, status, steps_done,
                          steps_total, reward_xp, steps[]
UserProfileResponse     — display_name, paper_cash, total_trades, quests_done,
                          concepts_seen_count
```

### Trade execution logic (`POST /api/paper/trades`)

1. Validate JWT → extract `user_id`
2. Look up latest close price for ticker via `repository.coverage_for_ticker()`
3. **Buy:** `cash_balance >= shares × price` → deduct cash → upsert `paper_positions` (weighted avg cost) → insert `paper_trades` → increment `user_profiles.total_trades`
4. **Sell:** `paper_positions.shares >= requested` → credit cash → update/delete position → insert `paper_trades` with `avg_cost_at_sell` in `metadata`
5. Auto-check eligible quests → return updated portfolio summary

### CORS lockdown (`main.py`)

Current: `allow_origins: ["*"]`. Must change to:

```python
CORSMiddleware(
    allow_origins=["https://sudip70.github.io", "http://localhost:3333", "http://127.0.0.1:3333"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
```

*(Port 3333 = the `python3 -m http.server 3333` dev server in `.claude/launch.json`)*

---

## 23. Frontend Implementation Spec (Phase 1 & 2)

All work targets **`fiscally-prototype.html`** — the single-file active product. Not `frontend/app.js` or `frontend/index.html` (those are the legacy web app, kept for reference only).

Because the prototype is one file, new functionality is added as new JS functions and HTML blocks within it, not as separate module files. The logical structure below maps to sections of the single file.

### Phase 1 — Auth layer

| What to add | Where in prototype | Notes |
|---|---|---|
| Supabase JS SDK | `<head>` CDN script tag | Anon key as `window.FISCALLY_SUPABASE_URL` / `window.FISCALLY_SUPABASE_ANON_KEY` globals |
| `getSession()`, `signIn()`, `signUp()`, `signOut()`, `onAuthChange()` | New `/* ── Auth ──` JS section | Thin wrappers over Supabase SDK |
| Auth modal HTML | New hidden `<div id="authModal">` block | Login/signup form; toggled by `openAuthModal()` |
| User badge | Inside `#appHeader` | Email + practice cash + concepts explored + sign out; hidden when logged out |
| Auth gate | Shown in Practice + Profile when logged out | Soft gate — prompt to sign in, don't block Explore/Learn |
| `callApi()` update | Existing fetch wrapper in prototype | Add optional `requiresAuth` flag → inject `Authorization: Bearer` header |
| `onAuthChange()` initialization | `finishOB()` / app init at bottom of script | Reactively update user badge and portfolio on session change |

### Phase 2 — Wire PF engine to backend

| What to change | Where in prototype | Notes |
|---|---|---|
| Replace `PF` in-memory state with backend reads | `renderPortfolio()`, `renderHoldings()` | On load: `GET /api/paper/portfolio` → populate `PF` |
| Replace `executeTrade()` with backend call | Trade sub-tab "Execute" button handler | `POST /api/paper/trades` → refresh portfolio → trigger quest check |
| Replace `PF.trades` with backend reads | `renderActivity()` | `GET /api/paper/trades` |
| Portfolio reset | "Reset" button handler | `POST /api/paper/portfolio/reset` |
| Quest board | New section in Profile tab | `GET /api/quests` → render badge grid with live progress |
| Concept tracking | Existing `openTip()` function | Add fire-and-forget `POST /api/concepts/seen` when logged in |

### 8 new glossary terms to add to `GLOSS` map

```javascript
realized_gain, unrealized_pl, avg_cost, position_sizing,
opportunity_cost, market_order, cost_basis, shares
```

---

## 24. Phase Verification Steps

Each phase ships independently. Run these checks before moving to the next phase.

### Phase 0 — Copy & coherence fixes
- [ ] Stock Finder Mia verdict uses range language, not "most likely around $X"
- [ ] Scenario cards say "Rough case / Most likely / Strong case" not "bear/base/bull"
- [ ] Profile leaderboard ranks by XP, not by portfolio % return
- [ ] Page IDs updated: `page-journey` → `page-practice`, `page-tools` → `page-explore`, `page-social` → `page-profile`
- [ ] No screen has an unanchored raw number (pass tenet T2)

### Phase 1 — Auth foundation
- [ ] Open prototype → all existing tabs work identically, no visible change
- [ ] "Sign in" → auth modal opens
- [ ] Create account → `user_profiles` row created → badge shows email + $10,000 practice cash
- [ ] Reload → session persists (Supabase stores JWT in localStorage)
- [ ] Sign out → badge disappears → Learn/Explore tabs still work without auth
- [ ] Second user cannot read first user's profile (RLS check via Supabase dashboard)

### Phase 2 — Paper trading persistence
- [ ] Login → Practice tab → portfolio shows $10,000 cash, 0 positions
- [ ] Select any asset → pre-trade explainer renders
- [ ] Buy 5 shares → cash decreases, position appears
- [ ] **Reload → position persists** (the defining test of Phase 2)
- [ ] Attempt over-buy → error shown ("Not enough practice money")
- [ ] Sell 3 shares → position reduces, activity log updates
- [ ] Sell remaining → position row disappears
- [ ] Reset portfolio → $10,000 cash, positions cleared, trade history kept
- [ ] Login as a second user → empty portfolio (RLS working)

### Phase 3 — Quest system
- [ ] Profile tab → 8 quest badge cards render, all locked
- [ ] Execute first trade → "First Steps" badge unlocks → toast fires
- [ ] Execute trade with explainer open → "Know Before You Buy" unlocks
- [ ] Hold stock + ETF + crypto simultaneously → "Spread It Out" unlocks
- [ ] Reload → completion states persist
- [ ] Concept events fire on glossary tap (verify `concept_events` table in Supabase dashboard)

### Phase 4 — Learn spine wired to live data
- [ ] Every lesson in units 1–5 still plays correctly
- [ ] At least one lesson pulls a live number (e.g. the `uncertainty` lesson shows today's AAPL range)
- [ ] Home "Continue" rail points to the correct next unfinished lesson
- [ ] Skill "Patience" fires when user holds through a real 5%+ dip (requires position history from Phase 2)

---

## 18. Coherence Checklist (use before shipping any screen)

- [ ] Does it pass all five design tenets (T1–T5)?
- [ ] Does the playfulness dial match the coherence map (§11.4)?
- [ ] Are all numbers paired with a plain-language anchor? (No naked numbers)
- [ ] Is any Mia message triggered by *this user's data*, not generic copy? (T5)
- [ ] Does anything forward-looking use range + uncertainty language, not point predictions? (T4)
- [ ] Is gold/XP used *only* in Learn? Is Penny *only* in Learn?
- [ ] Does the screen have a "what's next"?
- [ ] Does the copy pass the friendly-name lexicon (§9)?
- [ ] Is this feature owned by exactly one tab?
