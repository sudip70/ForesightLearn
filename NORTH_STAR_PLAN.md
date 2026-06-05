# ForesightLearn — North Star Design Plan

**Date:** 2026-06-04
**Status:** Planning (no code yet)
**Scope:** Re-focus the product on the north star, end to end — frontend (Fiscally mobile) and backend.

**Relationship to other docs**
- [`PIVOT_PLAN.md`](PIVOT_PLAN.md) — the *mechanical* pivot plan (auth, paper-trading tables, quests). Still largely valid as the **persistence foundation**, but it targets the legacy `frontend/` web app and treats learning as garnish. This document sits **above** it and reorients the priorities.
- [`FISCALLY_DOCS.md`](FISCALLY_DOCS.md) — the visual/design language ("Fiscally": lavender, Mia, progressive disclosure).
- The active product surface is **`fiscally-prototype.html`** (mobile), *not* the legacy web app. See §0.

---

## 0. The one decision this plan assumes

> **ForesightLearn is a *learning app that happens to run on real, live market data* — not a forecasting tool that happens to teach.**

Everything below follows from that. Concretely:
- The **Fiscally mobile prototype** is THE product direction. The legacy `frontend/` web app and the deprecated RL engine are reference/foundation only.
- The most-built inherited feature (price forecasting) gets **reframed to serve teaching**, not removed.
- Effort rebalances toward the two things the mission actually needs and that barely exist today: a **learning spine** and a **behavioral coach**.

If the team wants to keep the forecasting *tool* as a co-equal product, this plan doesn't apply — that's a different company. (See §9 Open Decisions.)

---

## 1. The North Star, made operational

**North star:** the go-to learning app for money & investing — the intersection of *learning* AND *the numbers that back it*. Avoid both failure modes: walls of text (fluff) and overwhelming numbers. It must feel **welcoming, easy, learning-focused.**

**Operating rule:** *every number arrives with a sentence; every lesson arrives with a number — never a wall of either.*

We turn that rule into **five design tenets** that every feature is checked against:

| # | Tenet | Test (a feature passes only if…) |
|---|---|---|
| T1 | **Plain verdict first, dense numbers one tap deeper** | The first thing on screen is a sentence + a picture; raw metrics live behind a "See the numbers" disclosure. |
| T2 | **No naked number** | Every metric shown is paired with a plain-language anchor and a friendly name ("Bounciness", not "Annualized volatility"). |
| T3 | **No naked lesson** | Every teaching moment references a real, live number from *this* user's context. |
| T4 | **Teach uncertainty, never prediction** | Anything forward-looking is framed as a *range of plausible outcomes + what moves it*, never a point forecast presented as fact. |
| T5 | **Mia reacts to *you*** | Education is triggered by the user's own decisions and portfolio state, not generic term definitions floating in space. |

These tenets are **acceptance criteria**, not vibes. Each phase in §8 has a "north-star check" that re-applies them.

---

## 2. The five strategic reframes

What changes relative to the product as it stands today.

| # | From (today) | To (north star) | Why it matters |
|---|---|---|---|
| R1 | Forecast shows "most likely **$332**" | "Nobody can predict this — here's the realistic **range** and **what moves it**" | The current framing teaches beginners the future is knowable — the opposite of the #1 investing lesson. Cheapest high-value fix. |
| R2 | Learning = Mia bubbles + glossary chips | Learning = a **visible progression** (concepts → skills → levels) you can feel yourself climb | A "learning app" with no sense of leveling up isn't a learning app. |
| R3 | Paper trading = P&L scorekeeping on consequence-free cash | Paper trading = a **coached behavior loop**: Mia reacts to your concentration, chasing, fees, panic | Consequence-free money is low-engagement *unless* a coach gives the consequences meaning. This is the moat. |
| R4 | Ephemeral prototype (nothing persists) | **Persistent** accounts, streaks, progress | No retention mechanism = a demo, not a product. (PIVOT_PLAN Phase 1–2.) |
| R5 | Generic "learn investing free" | **Canada-anchored, learning-first** identity (TFSA/RRSP context) | The crowded category ignores Canadian accounts; it's the sharpest differentiator already in the design. |

---

## 3. The product as three loops

A clean mental model for the whole app. Mia is the connective tissue across all three.

### Loop A — **Understand** (any number → meaning)
Surfaces: Tools / Stock Finder, any metric anywhere.
`see a number → plain sentence + picture → "what moves it" → (tap) deeper numbers → "What's That?" glossary`
Honors T1, T2, T4.

### Loop B — **Do** (act → reflect → improve)
Surface: Trade.
`paper trade → live pre-trade explainer (uncertainty) → outcome → Mia reflects on the decision → next decision is better`
Honors T3, T5. This is where the behavioral coach lives.

### Loop C — **Grow** (encounter → demonstrate → level up)
Surfaces: Learn, Home progress hero.
`encounter a concept → demonstrate it through a behavior → skill unlocks → level up → new content opens`
Honors R2. Critically, skills are **demonstrated by doing** (Loop B feeds Loop C), not by passing quizzes.

> The magic is the loops interlock: a trade in Loop B both triggers coaching (B) and advances a skill (C), and the coaching references a number explained in Loop A.

---

## 4. Frontend plan (Fiscally mobile)

Target surface: `fiscally-prototype.html` → a real mobile app (native or PWA — see §9). Design language per `FISCALLY_DOCS.md`. Organized by surface; each item cites the tenet it serves.

### 4.1 Home — "where am I, what's next"
- **Progress hero** (replaces/augments the portfolio hero): your *learning level* + this week's streak, with the portfolio value as a secondary stat. Tappable into Learn or Trade. *(R2, T3)*
- **Today's nudge**: a single Mia card — one thing to do today, drawn from the coach engine (e.g., "Your money is 70% in tech — want to see why that's risky?"). *(R3, T5)*
- **Continue** rail: resume the active lesson / open the coach's last insight.

### 4.2 Learn — the spine (today's weakest surface; biggest build)
- **Tracks**: 3–5 ordered tracks (e.g., *Money basics → Investing basics → Risk & diversification → Canadian accounts → Reading the market*). Each track is a sequence of short lessons. *(R2)*
- **Lessons are "number-anchored"**: every lesson pulls a live number to make its point ("Inflation ate X% of idle cash last year — here's what investing it might have done"). No lesson is pure prose. *(T3)*
- **Skill map**: a lightweight visual of concepts unlocked vs locked; completing behaviors in Trade lights them up. *(R2, Loop C)*
- **"Prove it" steps**: a lesson can ask you to *do* the thing in the paper account (a guided trade), not answer a quiz. Ties Learn → Trade. *(T3, R3)*

### 4.3 Trade — the Do loop + coach
- **Pre-trade explainer (uncertainty-first)**: when a ticker is selected, show the bear/base/bull **range** framed as *"this is a range of plausible outcomes, not a prediction"* + a **"What moves this?"** mini-panel (drivers). Point targets are de-emphasized / behind disclosure. *(R1, T1, T4)*
- **Position-sizing nudge**: before confirming, Mia notes what this trade does to concentration ("this would make NVDA 40% of your money"). *(R3, T5)*
- **Post-trade reflection**: on sell, a plain realized-P&L lesson ("bought $X, sold $Y, that's Z% — and here's what drove it"). On buy after a run-up, a gentle "you're buying after a 20% climb" note. *(R3, T5)*
- **Portfolio view stays learning-first**: holdings show a one-line health read ("well spread" / "very concentrated") before the numbers table. *(T1, T2)*

### 4.4 Tools / Stock Finder — the Understand loop
- Keep the learning-first forecast page already prototyped (verdict + chart + Mia sentence + Rough/Most-likely/Strong cards + one teaching point + "See all the numbers"). *(T1, T2)*
- **Apply R1 here too**: replace "most likely around $X" copy with uncertainty language and add the **"What moves it"** drivers panel. *(R1, T4)*

### 4.5 Mia system (cross-cutting)
- **One voice, three jobs**: translate (Loop A), coach (Loop B), encourage (Loop C). Same character, consistent tone.
- **Trigger-driven, not decorative**: Mia appears because something in *your* data warrants it (§7), not as ambient narration. *(T5)*
- **"What's That?"** bottom-sheet glossary stays the universal escape hatch for any term.

### 4.6 Shared component contracts (enforce the operating rule in code)
- **`NumberWithSentence`**: the only sanctioned way to render a metric — takes `{friendlyName, value, plain}` and never renders a value without its sentence. *(T2)*
- **`ProgressiveDisclosure`**: verdict + picture by default; a "See the numbers ▾" reveal for density. *(T1)*
- **`MiaCard`**: `{message, theNumberBehindIt, whatsThis?, action?}` — structurally cannot ship a lesson without a number. *(T3)*

---

## 5. Backend plan

The backend already has the strongest asset: a live Supabase OHLCV → forecasting engine with `literacy` / `plain_language` fields. The work is to (a) adopt the persistence foundation, and (b) add three new services the north star requires.

### 5.1 Adopt the persistence foundation (from PIVOT_PLAN, mostly as-is)
- Supabase Auth + JWT validation, `user_profiles`, `paper_portfolios`, `paper_positions`, `paper_trades`. *(R4)*
- Reuse `repository.py` for trade-execution pricing and `forecasting.py` for the pre-trade explainer — exactly as PIVOT_PLAN specifies.

### 5.2 Formalize the **Plain-Language Layer** as an API contract *(T2, operating rule)*
Today `plain_language` / `literacy` exist ad hoc. Make it a rule: **every numeric field any client renders ships with its plain anchor.** A shared response shape:
```
metric: { key, friendly_name, value, unit, plain, whats_this_key }
```
- Centralize friendly names + anchor sentences server-side (one source of truth, reused web + mobile).
- The forecast, profile, and (new) portfolio endpoints all return metrics in this shape.

### 5.3 Reframe the **Forecast service** toward uncertainty *(R1, T4)*
- Change response copy from point-prediction to range/uncertainty language.
- Add a **`drivers`** field: a short, plain list of what moves this asset ("earnings, interest rates, tech-sector sentiment") to power the "What moves it?" panel.
- Keep numeric targets available but mark them clearly as *scenario endpoints of a range*, surfaced behind disclosure.

### 5.4 New: **Behavioral Analysis service** (the differentiator) *(R3, R5, T5)*
A read-model over the user's portfolio + trade log that computes, in plain terms:
- **Concentration** (largest position %, sector mix) → "well spread" vs "very concentrated"
- **Diversification** across asset classes (stock/etf/crypto) and accounts (TFSA/RRSP)
- **Chase score** — did buys cluster after run-ups?
- **Cash drag** — idle cash %
- **Behavior flags** — overtrading, panic-selling near drawdowns
- **Realized vs paper behavior** — held through a dip vs sold the bottom
Output is structured so the coach engine (5.6) can turn each into a Mia message. Endpoint: `GET /api/coach/portfolio-read`.

### 5.5 New: **Curriculum / Progression service** *(R2, Loop C)*
- **Concept graph + skill model** as static Python defs (consistent with PIVOT_PLAN's "definitions live in code, progress lives in DB" philosophy).
- A **skill is demonstrated by a behavior**, not a quiz (e.g., "Diversification" unlocks when you hold ≥3 asset classes; "Patience" when you hold through a real dip).
- Tracks/lessons as content data (see 5.7). Endpoints: `GET /api/learn/tracks`, `GET /api/learn/progress`, `POST /api/learn/event`.

### 5.6 New: **Coach / Insight engine** *(R3, T5)* — see §7
- Deterministic rules first: map `(portfolio-read + behavior flags + progress)` → ranked Mia insights `{trigger, message, the_number, whats_this?, action?}`.
- LLM-authored phrasing is a *later enhancement* on top of the rule layer, not the foundation (trust, latency, cost — §9).
- Endpoints: `GET /api/coach/today` (the home nudge), insights also returned inline by trade endpoints.

### 5.7 Content as data, not hardcode
- Lessons, concepts, glossary, friendly-name/anchor copy → a content model (start as versioned JSON/Python, graduate to Supabase tables when editing cadence demands it). Lets copy/curriculum evolve without code deploys and keeps the operating rule centrally enforceable.

---

## 6. Data model additions (beyond PIVOT_PLAN's six tables)

Keep PIVOT_PLAN's `user_profiles`, `paper_portfolios`, `paper_positions`, `paper_trades`, `quest_progress`, `concept_events`. Add:

| Table / store | Purpose | Notes |
|---|---|---|
| `skill_progress` | per-user skill state (locked / unlocked / mastered) | Defs static in code; rows track progress. Mirrors `quest_progress`. |
| `lesson_progress` | per-user lesson/track completion | Powers the spine + Home progress hero. |
| `coach_insights` | log of insights surfaced (shown, dismissed, acted-on) | Avoids repeating the same nudge; feeds "Today" ranking; analytics. |
| `behavior_snapshots` *(optional)* | periodic snapshot of portfolio-read metrics | Enables "you've gotten less concentrated over 3 weeks" longitudinal coaching. |
| `account_type` on positions/trades | TFSA / RRSP / non-registered tagging | Unlocks the Canada wedge (R5) and account-aware coaching. |

Quests (PIVOT_PLAN §6) are **folded into the skill/progression model** rather than living as a parallel system — a quest becomes "a behavior that demonstrates a skill."

---

## 7. The Mia coaching engine (deep dive)

The single highest-leverage build. An insight is always `{ trigger, plain message, the number behind it, whats_this?, action? }` — structurally honoring the operating rule.

**Trigger taxonomy**

| Trigger class | Fires when | Example Mia message (+ its number) |
|---|---|---|
| **Pre-trade** | ticker selected in Trade | "This is a *range*, not a prediction — it could land anywhere from ~$289 to ~$382." |
| **Position-sizing** | before confirming a buy | "Heads up — this makes NVDA **40%** of your money." |
| **Post-trade (sell)** | a sell executes | "You bought at $X, sold at $Y — that's **+7%**. Here's what drove it." |
| **Portfolio-state** | portfolio-read changes | "Your money is **70%** in tech. Want to see why spreading out lowers risk?" |
| **Behavioral pattern** | behavior flag set | "That's your **3rd** buy right after a price jump this week — let's talk about chasing." |
| **Progress / milestone** | skill unlock / streak | "You just held through a **−9%** dip — that's the Patience skill unlocked." |

**Design rules**
- **One nudge at a time.** Rank insights; show the single most relevant. Never a wall.
- **Always actionable or dismissible.** Each insight offers a next step or a clean dismiss (logged to `coach_insights`).
- **Deterministic core.** Rules are explainable and testable; LLM only rephrases, never invents the number.

---

## 8. Sequencing

Each phase is independently shippable and ends with a **north-star check** (re-apply T1–T5).

### Phase 0 — Commit the identity (1 decision, ~0 code)
Ratify §0: Fiscally mobile is the product; forecasting is reframed, not the headline. Reconcile the two frontends. *Exit:* everyone building knows which app is real.

### Phase 1 — Persistence foundation *(R4)*
Adopt PIVOT_PLAN Phases 1–2: Auth + paper-trading tables + execution. Wire the Fiscally prototype's `PF` engine to these endpoints so trades persist. *North-star check:* close the app, reopen, your portfolio + progress are still there.

### Phase 2 — Behavioral Coach v1 *(R3, T5)* — **do this early, it's the moat**
Behavioral Analysis service (5.4) + deterministic Coach engine (5.6, 3–4 triggers: concentration, position-sizing, post-trade, chase). Surface as Home "Today" nudge + inline Trade reflections. *North-star check:* Mia says something true about *your* specific portfolio.

### Phase 3 — Uncertainty reframe *(R1, T4)*
Forecast copy → range/uncertainty; add `drivers` + "What moves it?" panel in Tools and the Trade pre-trade explainer. *North-star check:* no screen presents a future price as a fact.

### Phase 4 — Learning spine v1 *(R2, Loop C)*
Curriculum/Progression service + one complete track end-to-end (e.g., *Risk & diversification*), with skills demonstrated by Trade behaviors and a Home progress hero. *North-star check:* a new user can feel themselves level up from one real behavior.

### Phase 5 — Canada wedge *(R5)*
Account-type tagging (TFSA/RRSP), account-aware coaching, a Canadian-accounts learning track. *North-star check:* the app teaches investing *inside the user's actual accounts*.

> Rationale for ordering: persistence is the floor; the **coach ships before the full spine** because it's the differentiator and reuses what's already built; the uncertainty reframe is cheap and de-risks trust; the spine is the biggest build so it follows once the loops it depends on exist.

---

## 9. How we'll know it's working (signals)

| Loop | Activation signal | Retention / depth signal |
|---|---|---|
| Onboard | finishes quiz → first paper trade *with explainer shown* | returns next day |
| **Do** (B) | gets a coach insight that's *true about them* | acts on ≥1 insight |
| **Understand** (A) | opens "What moves it?" / "See the numbers" | uses Tools again unprompted |
| **Grow** (C) | unlocks first skill via a behavior (not a quiz) | climbs a level; maintains a streak |

The qualitative "aha" to watch for in user tests: **uncertainty fan chart + a paper trade going wrong + Mia's reflection** landing together. If five beginners hit that moment, the thesis holds.

---

## 10. Open decisions (need the team / user)

1. **Platform** — native mobile, PWA, or evolve the single-file prototype into a built app? Affects all of §4's delivery.
2. **Two frontends** — formally retire/repoint the legacy `frontend/` web app, or keep it as a desktop companion? (Root `index.html` currently still points at it.)
3. **Mia's intelligence** — deterministic rules only, or LLM-rephrased on top? Trade-offs: trust, latency, cost, and the risk of an LLM inventing a number (which would violate the whole thesis). Recommendation: rules first, LLM as phrasing layer.
4. **Audience** — Canada-first (sharper wedge) vs general/US (bigger but crowded)?
5. **Scope of forecasting** — fully subordinate it to teaching (this plan), or keep a "pro tool" mode for advanced users?
6. **Monetization horizon** — affects how much to invest in the spine vs. keep lean.

---

### TL;DR
Adopt one identity (learning app on real data). Keep the engine but **reframe forecasts from prediction to uncertainty**. Build the two things the mission needs and barely exist: a **behavioral coach** (ship first — it's the moat and reuses what's built) and a **learning spine** (skills demonstrated by doing). Make persistence the floor and the Canada accounts the wedge. Enforce one rule everywhere, in components and API contracts alike: *every number arrives with a sentence; every lesson arrives with a number.*
