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

**Aesthetic = strategy.** Soft warm beige, rounded everything, generous whitespace, slow gentle motion, pastel semantics. The calm look isn't decoration — it's how we keep both audiences from bouncing off an intimidating topic. Hard rule: **avoid the "finance-bro" aesthetic** entirely — no hype-green candles, no Lambos, no red-alert dashboards.

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

Warm beige is **the** brand (was lavender-purple — same lightness/saturation "shade" per token and the same [gradient recipe](#gradient-recipe-the-level-every-gradient-shares), only the hue rotated warm). Everything else is semantic and used sparingly. Token names below keep the `--purple-*` naming from the lavender era to avoid touching every call site in code — treat the *name* as legacy, the *hex* as current. **Confusingly-but-deliberately**, the original lavender-purple hex didn't disappear — it lives on as its own `--invest` feature color (see Feature colors below), so "purple" now means two different things depending on context: the `--purple-*` *token name* (→ beige hex, generic brand chrome) vs. the *color* purple (→ `--invest` hex, investing only). When in doubt, check which container you're in.

### Brand (beige)
| Token | Hex | Use |
|---|---|---|
| `--purple` | `#b4a284` | Brand accent, secondary text emphasis |
| `--purple-strong` | `#9a8765` | Labels, section headers |
| `--purple-deep` | `#726650` | Primary text-on-light emphasis, deep CTA end |
| `--purple-soft` | `#f4ede1` | Mia bubbles, soft chips, highlight fills |
| `--purple-soft2` | `#eadfcb` | Borders, rings |
| **Brand gradient** | `#fad18b → #b08946` | Primary buttons, onboarding splash, the "Trade" nav center. *Not* the Practice/portfolio hero — that's `--invest` purple, see Feature colors below. |

### Semantic
| Token | Hex | Meaning — used ONLY for this |
|---|---|---|
| `--green` / `--green-soft` | `#4f9c7e` / `#dbeee6` | Growth, gains, "strong case", bottom-nav active |
| `--gold` / `--gold-soft` / `--gold-ink` | `#e0a92f` / `#fdf0dc` / `#c8761f` | **Gamification only (Learn):** streaks, XP, rewards |
| `--red` / `--red-soft` | `#cf5a40` / `#fbeae6` | Loss, "rough case", caution — sparingly, never to scare |
| `--blue` | `#5b8def` | Forecast "if it goes well" line only |

### Feature colors — which money area a screen belongs to

A second, separate layer from the semantic table above: these identify *which feature/account area* a screen or component belongs to. They never override green (gain) or red (loss), and they are not the same thing as `--gold`/`--amber` (Learn gamification only, see above) — a Saving-yellow chip is not an XP chip.

| Feature | Token | Hex | Where it shows up |
|---|---|---|---|
| **Investing** | `--invest` / `--invest-strong` / `--invest-deep` | `#9084b4` / `#6f659a` / `#565072` | The original lavender-purple, kept as its **own** dedicated feature color (no longer "brand doing double duty" now that brand is beige — see below). Practice (portfolio hero, holdings, trade), Scenarios, the Investment Style/Risk page, Stock Finder, the Invest Game, and the Investing Accounts section in My Accounts. Anything investment-related is purple, full stop. |
| **Saving** | `--save` / `--save-soft` / `--save-deep` | `#e3b23c` / `#f6edcf` / `#b9862a` | Savings accounts section, savings goals. |
| **Spending** | `--spend` / `--spend-soft` / `--spend-deep` | `#e08a4f` / `#fbe7e0` / `#c06a34` | Spending accounts section, budget/expense tools. |
| **Loan** | `--loan` / `--loan-soft` / `--loan-deep` | `#c96a2e` / `#f5ddc9` / `#9c4f20` | Loan accounts, the Loan Calculator, the Mortgage Calculator. A deeper, more burnt shade than Spending — same orange family (loans render inside the Spending section in My Accounts today), but distinguishable as their own thing. |

For a scoped one-off screen that shares generic markup with unrelated screens (e.g. the Loan/Mortgage calculators, which share `.calc-chip`/`.game-head` with every other Tools screen), override the specific properties keyed off that screen's container id instead of touching the shared class — see `#loanBody`/`#mortBody` rules in `app.css` for the pattern.

**Investing is the one feature color that re-themes shared components wholesale** rather than overriding one property at a time: `#page-journey` (Practice), `#page-scenario`, `#page-risk`, `#page-stockfinder`, `#page-game-invest`, and `.acct-sec.invest` all locally override `--purple`/`--purple-strong`/`--purple-deep`/`--purple-soft`/`--purple-soft2`/`--purple-line`/`--grad-a`/`--grad-b` to point at `--invest*` instead of the beige brand tokens. Every shared component that already reads `var(--purple-strong)` etc. (buttons, sliders, subtabs, pills, borders) automatically renders purple inside those containers with zero per-component overrides — new Practice/investing UI gets this for free just by living inside one of those containers. When adding a new component to one of these containers, check it doesn't hardcode a literal beige hex that would fight the scope. Only hardcoded literal hexes (not `var(...)`) need a manual purple value: `.hero` (note: `#page-home .hero` is the only purple instance — the base `.hero` class is also used by Budget/Goals/Spending/Net Worth and must stay beige), `.mc-scenario`, and any inline SVG chart color (candlesticks, forecast/equity lines, `investSVG()`, the Invest Game's palette) — these should match `--invest`/`--invest-strong`/`--invest-deep` exactly. `.dash-hero` is the one deliberate exception: it keeps the original, more saturated "brand gradient" (`#a78bfa → #5546b0`) rather than the standard `--invest` mid-tone, matching how hero-weight surfaces have always used the punchier gradient variant while buttons/chips use the standard one.

### Neutrals
`--bg #f7f5fc` · `--surface #ffffff` · `--surface-soft #f1edf8` · `--ink #322e44` · `--muted #847f9c` · `--faint #aaa4c0` · `--line #eae6f4`

### Gradient recipe (the "level" every gradient shares)

Every soft gradient in the app follows the same recipe — only the hue changes:

- **Two stops, one hue family**, light/mid tone → deeper shade of the same color (never two different hues).
- **135deg diagonal** for buttons/CTAs/badges (140deg for larger hero surfaces; 90deg for horizontal progress fills).
- **Paired soft shadow**, same hue tinted at low opacity, never pure black: `0 8px 20px -6px rgba(<hue>,.5)`.

In code: there is no shared "apply this class" utility for this — every gradient is a plain `linear-gradient(...)` declaration on its own selector, hand-matched to the recipe above (same angle, same light→deep same-hue pattern, same tinted-shadow formula). When adding a new gradient, copy the *shape* of an existing one (e.g. `.btn-pur`, `.acct.tfsa`) and swap only the hue — don't invent a new angle or contrast level. The one place color is *shared* across many components at once is whole-page theming (see Investing above): a container overrides `--purple*`/`--grad-a`/`--grad-b`, and every descendant that already reads those variables re-colors for free — that's the mechanism to reach for when an entire section (not a single gradient) needs to change hue, not a new utility class.

---

**Usage laws**
- **Beige (brand) = primary action.** Greens, golds, reds never compete for "primary."
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
- **Depth:** one soft shadow, not hard borders. `--shadow: 0 4px 18px -6px rgba(86,80,114,.16)` · `--shadow-lg` for sheets/heroes. Cool neutral-tinted shadow (unchanged by the beige rebrand — it's a neutral, not a brand color), never pure black.
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
- **Charts** are hand-built SVG in the brand palette: green = past + likely, blue = good case, red = rough case, lavender = neutral/UI (chart gridlines/tracks/labels deliberately stayed cool-lavender-grey through the beige rebrand — they're neutral chart scaffolding, not brand identity; only primary/data-series purple converted to beige).

---

## 10. Logo / wordmark (direction, not final)

- **"Fiscally"** wordmark in a warm rounded sans, `--purple-deep` → brand-gradient (now beige/tan, see §4).
- Optional mark: a coin or a tiny **Penny** silhouette as the brand icon / app icon (foxes read as "clever with money").
- App icon: warm beige field + the mark. Friendly, not corporate.

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
Fiscally is a **warm, plain-language money guide** in **warm beige** (rebranded from lavender-purple, same shade/gradient recipe, hue rotated warm) — **except investing, which keeps the original purple as its own dedicated feature color** (Practice, Scenarios, Risk/Investment Style, Stock Finder, Invest Game, Investing Accounts). Voiced by **Mia** everywhere, that turns **gamified play on** (gold, XP, **Penny**) **only inside Learn**. Every metric carries a sentence, every lesson carries a number, forecasts show ranges not predictions — and the per-screen coherence map (§8) keeps the playfulness dial honest so five features read as one product.
