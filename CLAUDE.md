# CLAUDE.md

Guidance for Claude Code when working in this repo. Read this before making changes.

## What this project is

**Fiscally** — a financial-literacy + paper-trading app. Learn investing concepts, then practice
risk-free on real market data. See [README.md](README.md) for repo layout and how to run things.

## Canonical docs — read before assuming

- [`docs/FiscallyXForesight.md`](docs/FiscallyXForesight.md) — master reference: product strategy, feature build status, backend spec.
- [`docs/FISCALLY_BRAND.md`](docs/FISCALLY_BRAND.md) — brand & design system (voice, color, type, components). **Canonical source of truth for identity.**
- [`docs/FISCALLY_DOCS.md`](docs/FISCALLY_DOCS.md) — API endpoints, DB schema, prototype ↔ backend mapping.

If a screen or piece of copy can't point to a rule in these docs, it's improvising — fix the screen or fix the rule, don't just add a one-off exception.

## Brand quick-reference

Full system lives in [`docs/FISCALLY_BRAND.md`](docs/FISCALLY_BRAND.md); the essentials:

- **Personality:** warm, plain-spoken guide first. Gamified play is scoped to the **Learn** tab only — don't bleed gold/XP/streak styling into other tabs.
- **Brand promise:** every number ships with a plain-language sentence; every lesson ships with a real number. No naked numbers, no naked lessons.
- **Cast:** **Mia** (the voice — speaks app-wide, one message at a time) and **Penny** (the companion fox — Learn tab only, never speaks). If Penny shows up outside Learn or starts "talking," that's a bug.
- **Color (canonical = the 2026-07 redesign palette, brand doc §4):** white surfaces over a soft 4-corner **mesh** background (`--mesh-*`); **button brown `#837C74`** (`--taupe` family in code) is the primary-action color; **earn green `#619F88`** = growth/gains and the wordmark green; **charcoal `#242D32`** for dark cards; **neutral grey `#EAE7D4`** for soft fills/unselected pills; text black. Gold = gamification, **Learn only**. Red is never an alarm — loss numbers stay subdued. ⚠️ Most of `app.css` still carries the older beige-era tokens (`--purple*` = beige); migrate screen-by-screen as each redesigned screen lands — use the new palette on redesigned screens, don't half-migrate untouched ones.
- **Feature colors** (which money area a screen belongs to — separate from gain/loss and from Learn's gold): **Investing = invest purple `#AEA2D2`**, **Saving = save yellow `#E4DA82`**, **Spending = spend red `#D45C32`**, **Share/social = share blue `#99CACF`**; Loan keeps its legacy burnt-orange (`--loan`) until the redesign reaches it. Never repurpose green/red for this. Full table in [`docs/FISCALLY_BRAND.md`](docs/FISCALLY_BRAND.md#4-color-system-tokens).
- **Type:** **Sophia Pro** per the design file — shipped on web as **Poppins** (Google Fonts substitute; legacy screens still use Plus Jakarta Sans). Scale: H1 32 / H2 24 / body 20 & 16 / caption 12, body line-height 120%. **SemiBold (600) is the heaviest weight — hierarchy via size, not weight.** Money numbers always `tabular-nums`.
- **Anything investment-related is purple, full stop**: Practice (`#page-journey`), Scenarios (`#page-scenario`), Investment Style/Risk (`#page-risk`), Stock Finder (`#page-stockfinder`), Invest Game (`#page-game-invest`), and the Investing Accounts section (`.acct-sec.invest`) all locally override `--purple*`/`--grad-a`/`--grad-b` to the `--invest` tokens, so shared components (buttons, sliders, pills) go purple automatically inside them — no per-component overrides needed for new UI in those containers. Adding a new investing page/screen means adding its container id to *every* rule in that scoped block in `app.css` (there are currently 4: the variable override, `.btn-pur` shadow, `.style-chip` shadow, and the 3 slider-thumb shadow rules) — easy to forget one, so grep `#page-journey` in `app.css` to see the full list before adding a 6th container. Only hardcoded literal-hex chart/SVG colors (candlesticks, forecast lines, `investSVG()`, `.mc-scenario`) need a manual `--invest` hex; check `app.css` for the current values before adding a new one. **`.hero` is a trap**: it's shared by Budget/Goals/Spending/Net Worth (beige) *and* Home's Practice Portfolio card (purple, via `#page-home .hero` override) — don't change the base `.hero` rule without checking both. `.dash-hero` intentionally keeps the original, more saturated brand-gradient hex rather than matching `--invest` exactly — that's not a bug.
- **Gradient recipe:** every soft gradient shares one "level" — two stops, same hue family (light/mid → deeper shade), 135deg diagonal (140deg for hero surfaces, 90deg for horizontal fills), paired with a same-hue tinted shadow. Only the hue changes per use case. There's no shared utility class for this — copy the *shape* of an existing gradient (e.g. `.btn-pur`) and swap the hue, don't invent a new angle/contrast. For whole-*section* theming (not a single gradient), scope `--purple`/`--purple-strong`/`--purple-deep`/`--grad-a`/`--grad-b` on the container instead (see Investing below) — every descendant using those variables re-colors for free. Full recipe in [`docs/FISCALLY_BRAND.md`](docs/FISCALLY_BRAND.md#4-color-system-tokens).
- **Tone:** plain verdict before the number. Friendly names over jargon (see lexicon in the brand doc — "bounciness" not "volatility", etc). Encouraging, never preachy, never alarmist. Ranges, not predictions — never imply the future is knowable.
- **Anti-brand:** no hype-trading/finance-bro aesthetic, no wall-of-charts terminal, no alarm-red dashboards.
- **Nav spine:** Home (orient) → Learn (teach) → Practice (apply, risk-free) → Explore (research) → Profile (you/why). One job per tab; no feature lives in two places.

## Working rules

- Don't introduce a new color, tone, or character behavior without checking it against `FISCALLY_BRAND.md` first — extend the system deliberately, don't improvise a one-off.
- `apps/web` (desktop) and `apps/mobile` are **intentionally diverged** prototypes — don't assume changes should be ported between them; reconcile deliberately when asked.
- `legacy/` is archived Foresight-era code (old ML/RL backend, old web app). Don't build on it or restyle it — it's kept for reference only.
- Prototypes are single-file HTML + localStorage where noted in the README; don't reach for a framework/build step unless asked.
- For UI changes, verify in the browser preview per the standard workflow — don't claim a visual/behavioral change works without checking it.

<!-- Add project-specific rules and brand notes below as they come up. -->
