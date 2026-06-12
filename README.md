# Fiscally

**Learn investing by doing it — on real market data, with no real risk.**

Fiscally is a financial-literacy + paper-trading app for beginners and young learners. It teaches money & investing through guided lessons, then lets you practice in a risk-free paper account with live prices. Deliberately calm, plain-language, and un-overwhelming.

---

## Run the prototype

```bash
python3 -m http.server 3333
# open http://localhost:3333/fiscally-prototype.html
```

The prototype is a single-file mobile app (no build step). Use a phone-sized viewport or browser dev tools.

**Five tabs:** Home · Learn · Practice · Explore · Profile

- **Learn** — guided lesson journey (5 units, 20+ lessons), Mia the AI guide, Penny the fox companion, skills that unlock by doing
- **Practice** — paper-trading engine on live prices across 56 assets (stocks, ETFs, crypto), with pre- and post-trade coaching from Mia
- **Explore** — Stock Finder with live uncertainty-framed forecasts, Market Today, Compound Calculator
- **Home** — portfolio snapshot, goal progress, daily nudge, graduation plan

Live market data from the deployed backend; graceful mock fallback on cold starts (~30s on free tier).

---

## Docs

| Doc | What it covers |
|---|---|
| [`FiscallyXForesight.md`](FiscallyXForesight.md) | **Master reference** — product strategy, brand system, feature build status, backend spec, quest system, sequencing |
| [`FISCALLY_DOCS.md`](FISCALLY_DOCS.md) | API endpoints, DB schema, ERDs, prototype ↔ backend mapping |
| [`FISCALLY_BRAND.md`](FISCALLY_BRAND.md) | Brand & design system (colors, type, components, voice) |
| `260602-Fiscally-Invest-screens.pdf` | Original design deck the prototype matches |

---

## Stack

| Layer | Tech |
|---|---|
| Prototype | Single-file HTML/CSS/JS, inline SVG charts, no build step |
| Backend | Python 3.11, FastAPI, deployed on Render (free tier) |
| Database | Supabase (PostgreSQL) — market data, forecasts, OHLCV |
| Data | yfinance → daily OHLCV refresh via GitHub Actions |

## Run the backend locally

```bash
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn backend.app.main:app --reload
# API at http://localhost:8000 · docs at /docs
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment, or the backend falls back to live yfinance fetches.
