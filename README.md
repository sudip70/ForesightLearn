# Fiscally

**Learn investing by doing it — on real market data, with no real risk.**

Fiscally is a financial-literacy + paper-trading app for beginners and young learners. It teaches money & investing through guided lessons, then lets you practice in a risk-free paper account with live prices. Deliberately calm, plain-language, and un-overwhelming.

---

## Repository layout

```
apps/
  web/          Desktop app (lead surface) — modular src/ + single-file build
  mobile/       Mobile prototype (single-file, key fiscally.v1)
services/
  api/          Slim FastAPI "fiscally-api" — forecasts, profiles, market indices
pipelines/
  market_refresh/  Daily yfinance → Supabase OHLCV + forecast refresh
data/config/    Asset universe + market index config (JSON)
db/migrations/  Supabase (PostgreSQL) schema
docs/           Product strategy, brand, API/DB reference
infra/          Deploy config (render.yaml for fiscally-api)
media/          Design deck (the demo GIF is kept locally, untracked)
legacy/         Archived Foresight code (old ML/RL backend, old web app, old prototypes)
```

---

## Run the web app (lead surface)

```bash
cd apps/web
npm run dev        # serves at http://localhost:3333 — open /index.html
```

Dev needs no build: `index.html` loads the ordered `src/js/*.js` scripts and `src/styles/app.css`.
Progress persists in `localStorage` under `fiscally.web.v1`.

Build a single deployable file:

```bash
cd apps/web && npm run build      # -> dist/fiscally-web.html
cd apps/web && npm run build:min  # same, minified via esbuild (optional devDep)
```

The mobile prototype is still a single file:

```bash
python3 -m http.server 3333
# open http://localhost:3333/apps/mobile/
```

### Web app source modules (`apps/web/src/js/`, by load order)

| File | Responsibility |
|---|---|
| `01-charts-data.js` | Inline-SVG charts, `avatar()`, `GLOSS` glossary |
| `02-nav-onboarding.js` | Tab/sub-page navigation, onboarding flow |
| `03-trading-engine.js` | Paper-trading engine (`PF` state) |
| `04-persistence.js` | `localStorage` save/load (`fiscally.web.v1`) |
| `05-portfolio-scenarios.js` | Portfolio views + famous-crash/bull-run Scenarios |
| `06-stock-finder.js` | Stock Finder forecast page with interactive hover chart |
| `07-tools-api.js` / `07b-money.js` | Backend API calls + money/budget/goals |
| `08-learn-init.js` | Learn tab: lessons, XP/streaks, winding lesson trail |
| `09-tools-games.js` | Explore (Tools) tab: mini-games + loan/mortgage calculators |

### Tools — "Play & Learn" games

Self-contained mini-games in `09-tools-games.js`, each awarding XP and registered as a sub-page in `02-nav-onboarding.js`:

Finance Wordle · Wants vs Needs · Mini Crossword · Budget Swipe · Scammer Scanner · Quick Count · **Debtor's Tower** (finance-term hangman — a 5-floor tower collapses on each wrong guess; win or lose, Mia explains the term with a definition + real-world example)

Plus: **Loan Calculator** and **Mortgage Calculator** with smooth real-time sliders.

---

## Run the API locally

```bash
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r services/api/requirements.txt
uvicorn services.api.app.main:app --reload
# API at http://localhost:8000 · docs at /docs
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or use `memory://` for an empty in-memory repo).

API endpoints: `POST /api/forecasts/ticker` · `GET /api/tickers/{ticker}/profile` · `GET /api/market/indices` · `/api/market/universe` · `/api/forecasts/market` · `/api/market/indices/{symbol}/history` · `/health`

---

## Daily data refresh

```bash
scripts/refresh_supabase_daily.sh        # runs python -m pipelines.market_refresh.supabase_refresh
```

Manual dispatch available via `.github/workflows/daily-market-refresh.yml` (scheduled refresh is disabled — handled by a separate repo).

---

## Deploying the new API (cutover checklist)

The prototypes currently point at the existing `foresight-backend` URL. To cut over to `fiscally-api`:

1. Deploy `infra/render.yaml` as a new Render service (`fiscally-api`); set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
2. Verify parity: `curl` `/api/forecasts/ticker`, `/api/tickers/{t}/profile`, `/api/market/indices` for AAPL/SPY/BTC-USD and compare to the old backend.
3. Flip the `API` constant to the new host in `apps/web/src/js/07-tools-api.js` and `apps/mobile/index.html`.
4. Point the boot workflow at the new URL (repo variable `FISCALLY_BACKEND_BOOT_URL`), then decommission the old service.

---

## Docs

| Doc | What it covers |
|---|---|
| [`docs/FiscallyXForesight.md`](docs/FiscallyXForesight.md) | **Master reference** — product strategy, brand, feature build status, backend spec, sequencing |
| [`docs/FISCALLY_DOCS.md`](docs/FISCALLY_DOCS.md) | API endpoints, DB schema, ERDs, prototype ↔ backend mapping |
| [`docs/FISCALLY_BRAND.md`](docs/FISCALLY_BRAND.md) | Brand & design system (colors, type, components, voice) |
| [`apps/web/README.md`](apps/web/README.md) | Web app dev/build details and module descriptions |
| `media/260602-Fiscally-Invest-screens.pdf` | Original design deck the prototype matches |

---

## Stack

| Layer | Tech |
|---|---|
| Web app | Modular HTML/CSS/JS, inline-SVG charts, dependency-free single-file build (esbuild optional) |
| Mobile app | Single-file HTML prototype (`apps/mobile/index.html`) |
| API | Python 3.11, FastAPI, deployed on Render (free tier) |
| Database | Supabase (PostgreSQL) — market data, forecasts, OHLCV |
| Data | yfinance → daily OHLCV refresh via GitHub Actions |
