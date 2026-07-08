# PRODUCT.md — Fiscally

## Register
product — app UI (financial-literacy + paper-trading tool). Design serves the task; earned familiarity over surprise. The one brand-drenched surface is the welcome/onboarding flow.

## Users & Purpose
- Adult beginners who want to start investing but won't risk real money yet, and young people learning early. Both want a safe, soft, zero-pressure training ground.
- Core loop: **learn a concept → practice it risk-free on real market data → gain confidence** ("graduation" to real investing is the end state).
- Primary tasks per screen: orient (Home), learn (Learn), budget (Budget), understand accounts (Accounts), play (Games), practice investing (Investing).

## Brand personality
Warm, plain-spoken guide first; calm and un-overwhelming. Gamified play is scoped to the Learn tab only. Mia (voice, app-wide) + Penny (silent fox, Learn only). Every number ships with a plain-language sentence; ranges, not predictions.

## Anti-references
- No hype-trading/finance-bro aesthetic (no wall-of-charts terminal, no alarm-red dashboards, no hype-green candles).
- No preachy or alarmist tone; red is never an alarm.
- No gamification bleed (gold/XP/streaks) outside Learn.

## Design system (canonical: docs/FISCALLY_BRAND.md)
- 2026-07 palette: white surfaces on 4-corner mesh bg; button brown `#837C74` = primary action; earn green `#619F88`; feature colors invest purple `#AEA2D2`, save yellow `#E4DA82`, spend red `#D45C32`, share blue `#99CACF`; neutral grey `#EAE7D4`; charcoal `#242D32`; text black.
- Type: Sophia Pro (shipped as Poppins), SemiBold 600 max weight, hierarchy by size, body line-height 120%, `tabular-nums` for money.
- Corner radius intervals 4/8/12 for buttons/chips; cards 16/24; icon circles stay circles.

## Accessibility
Plain-language-first copy; contrast should meet 4.5:1 for body text; prototype is desktop-first (`apps/web`), single-file HTML + localStorage, no build step.
