# Fiscally — Brand & Design System

**Status:** Canonical source of truth for identity, theme, and coherence.
**Date:** 2026-06-05
**Locked decisions:** Name = **Fiscally** · Personality = **warm guide first, game scoped to Learn** · Cast = **Mia (voice) + Penny (companion)**.

Relationship to other docs: [`NORTH_STAR_PLAN.md`](NORTH_STAR_PLAN.md) is the *product strategy*; this is the *brand + visual system* every screen must derive from. [`FISCALLY_DOCS.md`](FISCALLY_DOCS.md) is the original design-deck notes (reference).

> **The job of this doc:** make five features feel like one product. If a screen can't point to a rule here, it's improvising — fix the screen or fix the rule.

---

## 1. Identity in one breath

**Fiscally is the friendly money app that teaches you investing on real numbers — so it never feels like a wall of text *or* a wall of numbers.**

- **Personality:** a warm, plain-spoken guide. Welcoming, encouraging, credible. Calm by default; playful where it helps you learn.
- **Brand promise:** *every number arrives with a sentence; every lesson arrives with a number.* (The north-star operating rule — it's also the brand's literal job.)
- **Dominant note:** trustworthy guide (everywhere). **Supporting note:** gamified play (Learn only). When in doubt, pick warm + clear over clever + busy.

**Anti-brand (what we are not):** a hype trading app, a wall-of-charts terminal, a fluffy quiz game with no real stakes, or a cold premium fintech that intimidates beginners.

---

## 1.5 Who it's for, and the feeling

**Core loop (the heart):** *learn a concept → practice it with risk-free money → watch it work → gain confidence.* Financial literacy + a learning platform + **paper trading** are the core; goal-setting and tools support it. Paper trading isn't a bolt-on feature — it's **where the learning becomes real, without real risk.** Fiscally is a **training ground**: you learn the ropes and practice on real market data until *you're* ready to invest for real. (Implies a future "you're ready" graduation bridge to real investing — a north-star moment, not built yet.)

**Audiences (two, overlapping):**
1. **Hesitant beginners** — adults who want to start investing but won't risk real money yet. Need: credibility, gentle hand-holding, a safe place to build confidence before real dollars.
2. **Young learners** — teens / young people who can't (or shouldn't yet) invest real money, learning early so they start strong when they come of age. Need: bite-sized, playful, encouraging, zero-pressure practice.

Both share one need: **learn and practice without ever feeling overwhelmed or at risk.** (This is why "warm guide first, game in Learn" is right — the young audience just gets more of the Learn-tab play, where it already lives.)

**The emotional promise — governs every pixel:** make an intimidating topic feel **soft, calm, and welcoming.** Investing overwhelms people for five reasons; design answers each:

| What overwhelms | Our answer |
|---|---|
| Jargon wall | Friendly names + Mia translates; plain verdict before the number |
| Number wall | One idea per screen, airy whitespace, progressive disclosure |
| Fear of losing money | Practice money, "no risk," soft pastels (never alarm-red), warm tone |
| Fear of being wrong / looking dumb | No hearts/punishment; ranges not predictions; Mia coaches, never scolds |
| Too many choices | Always guide to the single next step, never a 10-option dashboard |

**Aesthetic = strategy.** Soft lavender, rounded everything, generous whitespace, slow gentle motion, pastel semantics. The calm look isn't decoration — it's how we keep both audiences from bouncing off an intimidating topic. Hard rule: **avoid the "finance-bro" aesthetic** entirely — no hype-green candles, no Lambos, no red-alert dashboards.

---

## 1.6 App structure — the navigation spine

Five tabs, **one job each**, mapped to the core loop. **No feature lives in two places.**

| Tab | One job | Owns | Role |
|---|---|---|---|
| **Home** | Orient & point to the next step | Progress, today's one nudge (Mia), portfolio glance, a "continue" rail. *Guides — never a duplicate launcher.* | base camp |
| **Learn** | Teach | The lesson journey, skills, goal hero. | learn |
| **Practice** | Apply it, risk-free | The paper account (buy/sell, holdings, P&L) **+ Scenarios** (guided what-ifs run on your portfolio). | practice |
| **Explore** | Look things up | Stock Finder, Market Today, the *one* uncertainty forecast, calculators. The reference shelf. | research |
| **Profile** | You & your why | Goals, streak/level, achievements, settings, (community later). | track |

**Through-line:** *Home points you in → Learn teaches → Practice applies → Explore is the reference → Profile tracks the why.* The engine is the **Learn ↔ Practice** pair; Home is the hub; Explore + Profile support.

**Renames (and why):** Trade → **Practice** (it's paper/practice — de-scares it, names the purpose); Tools → **Explore** (de-junk-drawers a catch-all); Social → **Profile** (you-first; community is a *section*, not the whole tab).

**Anti-patterns to kill (these are the current confusion):** Home re-listing the nav as cards; the same feature reachable from two tabs (Scenarios, forecasts); a tab that's a junk-drawer; any screen with no "what's next."

---

## 2. Voice & tone

Mia *is* the voice. Even un-attributed UI copy should sound like her.

**Principles**
1. **Plain verdict first.** Lead with the meaning, then the number. "Most likely around $332 — that's a calm, steady stock." not "Base target: 332.08."
2. **No naked number.** Every metric ships with a one-line plain anchor.
3. **Friendly names** for scary jargon (the lexicon below).
4. **Second person, short sentences.** "Your money," "you bought," "here's what that means."
5. **Encouraging, never preachy or alarmist.** Coach the behavior, don't scold. "That's your 3rd buy after a jump — let's talk about chasing," not "Warning: poor decision."
6. **Honest about uncertainty.** Ranges, not predictions. Never imply the future is knowable.

**Friendly-name lexicon (canonical)**

| Say this | Not this |
|---|---|
| Bounciness | Volatility |
| Worst drop | Max drawdown |
| Company size | Market cap |
| Most likely / rough case / strong case | Base / bear / bull |
| Spread out | Diversified |
| How much it leans one way | Concentration |
| Practice money | Paper trading capital |

---

## 3. The cast (character bible)

Two characters, **strictly distinct roles** — this is what keeps them from feeling like clutter.

### Mia — *the voice*
- **Role:** the guide who translates numbers → meaning, teaches, and coaches your decisions.
- **Where:** **app-wide.** Any screen can have a Mia moment.
- **Behavior:** she *speaks* (always via a speech bubble or a Mia-card). She reacts to *your* data. One Mia message at a time — never a wall.
- **Look:** friendly woman, warm skin `#f0b896`, dark hair `#43301f`, in a lavender circle. Built as inline SVG (`avatar()`).

### Penny — *the companion*
- **Role:** the non-verbal buddy who embodies progress and makes the journey feel alive.
- **Where:** **Learn tab only.** She lives on the learning trail.
- **Behavior:** she **never speaks** (no dialogue). She bobs, follows you up the trail, and **jumps when you complete a lesson.** She's a reward and a presence, not a narrator.
- **Look:** a cute full-body fox — orange `#ee8a37`, cream `#f6eede`, dark paws `#5b3b24`, white-tipped bushy tail. Built as inline SVG (`petSVG()`).

**The rule:** *Mia talks, Penny doesn't. Mia is everywhere, Penny is Learn-only.* If Penny ever shows up on Trade or starts "speaking," that's a coherence bug.

---

## 4. Color system (tokens)

Lavender is **the** brand. Everything else is semantic and used sparingly. These are the real values already in the prototype — formalized with semantic intent.

### Brand (lavender)
| Token | Hex | Use |
|---|---|---|
| `--purple` | `#9084b4` | Brand accent, secondary text emphasis |
| `--purple-strong` | `#6f659a` | Labels, section headers |
| `--purple-deep` | `#565072` | Primary text-on-light emphasis, deep CTA end |
| `--purple-soft` | `#e7e1f4` | Mia bubbles, soft chips, highlight fills |
| `--purple-soft2` | `#d4cbea` | Borders, rings |
| **Brand gradient** | `#a78bfa → #5546b0` | Primary buttons, hero, the "Trade" nav center |

### Semantic
| Token | Hex | Meaning — used ONLY for this |
|---|---|---|
| `--green` / `--green-soft` | `#4f9c7e` / `#dbeee6` | Growth, gains, "strong case", bottom-nav active |
| `--gold` / `--gold-soft` / `--gold-ink` | `#e0a92f` / `#fdf0dc` / `#c8761f` | **Gamification only (Learn):** streaks, XP, rewards |
| `--red` / `--red-soft` | `#cf5a40` / `#fbeae6` | Loss, "rough case", caution — sparingly, never to scare |
| `--blue` | `#5b8def` | Forecast "if it goes well" line only |

### Neutrals
`--bg #f7f5fc` · `--surface #ffffff` · `--surface-soft #f1edf8` · `--ink #322e44` · `--muted #847f9c` · `--faint #aaa4c0` · `--line #eae6f4`

**Usage laws**
- **Purple = brand & primary action.** Greens, golds, reds never compete for "primary."
- **Gold is sacred to Learn.** A gold streak pill on the Trade screen = wrong. It signals "this is the game zone."
- **Green does double duty** (gains + nav) — that's fine; both mean "good / go."
- **Red is rare.** Loss numbers and the rough-case, nothing else. We don't paint warnings red; Mia's words carry caution.

---

## 5. Type

- **Family:** system stack (`-apple-system, "Segoe UI", Roboto, …`). Friendly, fast, native-feeling. (If we ever license a face, pick a warm geometric sans — Poppins/Nunito family — for the wordmark + display only.)
- **Weights:** 600 (body emphasis), 700–800 (labels/titles), 850 (display/numbers).
- **Numbers:** always `font-variant-numeric: tabular-nums` so money columns align.
- **Scale (mobile):** Display 28–30 · Title 19–21 · Body 14–15 · Caption 11–12 · Big number 24–30.

---

## 6. Shape, depth, motion

- **Radii:** cards `16` (`--r`), large cards/sheets `22` (`--r-lg`), small `11`, pills `20–30`, avatars/nodes full-circle.
- **Depth:** one soft shadow, not hard borders. `--shadow: 0 4px 18px -6px rgba(86,80,114,.16)` · `--shadow-lg` for sheets/heroes. Lavender-tinted shadow, never pure black.
- **Motion:** gentle and purposeful. 0.2–0.3s transitions. Progressive reveals (the "See the numbers" expand). Personality motion is **Penny's** (idle bob, completion jump) and lives in Learn. The money screens don't bounce.
- **Spacing rhythm:** 16px screen gutter, 13px between cards.

---

## 7. Component kit (the reusable pieces)

Every screen is built from these. Three of them *enforce the brand promise in code* — they structurally can't break the operating rule.

| Component | Rule it enforces |
|---|---|
| **Card** | The unit of content. Surface, `--r`, soft shadow. |
| **Primary button** | Brand gradient, 850 weight, soft glow. One per view. |
| **Secondary / ghost** | Taupe soft / transparent. Never competes with primary. |
| **Pill / badge** | Status & tags. Color = meaning (purple/green/gold/grey). |
| ★ **Number-with-sentence** | A metric can't render without its friendly name + plain anchor. *(enforces "no naked number")* |
| ★ **Progressive disclosure** | Plain verdict + picture by default; dense numbers behind "See the numbers ▾". *(enforces "verdict first")* |
| ★ **Mia card / bubble** | `{message, the number behind it, what's-this?, action}` — a lesson can't ship without a number. *(enforces "no naked lesson")* |
| **What's-That? sheet** | Bottom-sheet glossary, the universal escape hatch for any term. |
| **Bottom nav** | 5 tabs, green active icons, Trade emphasized center. |
| **(Learn only) Lesson node / Skill chip / Daily strip / Goal hero / Penny** | The gamification kit. Scoped to Learn. |

---

## 8. Coherence map — how each surface expresses the identity

**This is the most important table in the doc.** It sets the "playfulness dial" per screen so nothing drifts. 0 = calm/serious-friendly, 3 = full game.

| Surface | Its job | Play dial | Mia | Penny | Gold/XP | Notes |
|---|---|---|---|---|---|---|
| **Home** | Orient + one nudge | 1 | ✅ "Today with Mia" | ❌ | Level/streak hero OK | Calm. Portfolio value + one coach card. |
| **Learn** | Teach by doing | **3** | ✅ guides every lesson | ✅ lives here | ✅ full | The game zone. Trail, lessons, celebrations. |
| **Trade** | Act with confidence | 0–1 | ✅ pre/post-trade coach | ❌ | ❌ no confetti | Money is calm + clear. Friendly, never hypey. |
| **Tools / Understand** | Research an asset | 1 | ✅ translates numbers | ❌ | ❌ | Data-forward but plain. Uncertainty framing. |
| **Social** | Belong + compare | 2 | ✅ light | ❌ | streaks/badges OK | Warm, light gamification (leaderboards, badges). |

If a screen's playfulness doesn't match its row, that's the incoherence to fix.

---

## 9. Iconography & illustration

- **Style:** rounded, friendly, flat with soft depth. Consistent corner radius and weight.
- **Emoji** are fine as quick semantic markers (lesson icons, status). **Brand illustrations** — Mia, Penny, account types (TFSA/RRSP), the fan-chart — are custom SVG with the palette above, so they feel made-for-Fiscally, not pasted.
- **Charts** are hand-built SVG in the brand palette: green = past + likely, blue = good case, red = rough case, lavender = neutral/UI.

---

## 10. Logo / wordmark (direction, not final)

- **"Fiscally"** wordmark in a warm rounded sans, `--purple-deep` → brand-gradient.
- Optional mark: a coin or a tiny **Penny** silhouette as the brand icon / app icon (foxes read as "clever with money").
- App icon: lavender field + the mark. Friendly, not corporate.

---

## 11. Coherence to-do (make the current app match this doc)

1. **One token file.** Extract these tokens into a single shared `:root` (or `tokens.css`) that every screen/prototype imports — no per-screen palettes.
2. **Scope the gold.** Audit every gold/XP/streak element; if it's outside Learn, recolor or remove (except the small level/streak hero on Home).
3. **Penny stays in Learn.** Confirm she never renders on other tabs.
4. **Disclosure everywhere dense.** Any screen with >3 raw numbers gets the "See the numbers" pattern (Trade holdings, Tools metrics).
5. **Voice pass.** Run all copy through the lexicon + voice principles; kill stray jargon.
6. **Retire the old skin.** Drop the green "Foresight" web styling and repoint root `index.html` away from the legacy app — it's off-brand.
7. **Name cleanup.** Replace "ForesightLearn" / "Market Intelligence" kickers with "Fiscally" throughout.

---

### TL;DR
Fiscally is a **warm, plain-language money guide** in **lavender**, voiced by **Mia** everywhere, that turns **gamified play on** (gold, XP, **Penny**) **only inside Learn**. Every metric carries a sentence, every lesson carries a number, forecasts show ranges not predictions — and the per-screen coherence map (§8) keeps the playfulness dial honest so five features read as one product.
