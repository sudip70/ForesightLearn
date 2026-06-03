# Foresight Pivot Plan: Financial Literacy + Paper Trading

**Date:** June 2026  
**Branch:** `guided-tour-and-cleanup` → new feature branches per phase  
**Status:** Planned, not started

---

## 1. Overview

Foresight is pivoting from a market forecasting / ML portfolio tool to a **financial literacy education app with paper trading**. The existing ML-heavy features (PPO/SAC RL engine, scenario-based forecasts, backtests) are not resonating. The new direction gives users a hands-on way to learn markets by practicing with $10,000 virtual cash, completing guided challenges, and encountering contextual concept explanations — all without risking real money.

**Core value proposition:** *Learn investing by doing it, for free, with no risk.*

---

## 2. What We Are Keeping vs. Deprecating

### Keep (untouched)
| What | Why |
|---|---|
| `backend/app/market/repository.py` | Price lookups power paper trade execution |
| `backend/app/market/forecasting.py` | Scenario forecasts power the pre-trade explainer |
| `backend/app/api/routes/market.py` | Market overview tab unchanged |
| `backend/app/api/routes/forecasts.py` | Forecast tab unchanged |
| `backend/app/api/routes/portfolio.py` | Simulator tab unchanged |
| `backend/app/api/routes/health.py` | Health check unchanged |
| `frontend/render/market.js` | Market tab unchanged |
| `frontend/render/forecast.js` | Forecast tab unchanged |
| `frontend/render/simulator.js` | Simulator tab unchanged |
| `frontend/utils/dom.js` | `lessonCard()`, `termChip()`, `metricCard()`, `showToast()`, `setError()` reused throughout |
| `frontend/utils/formatters.js` | All formatters reused |
| `frontend/styles/` (all 7 files) | Extended only, not replaced |
| `.github/workflows/` (all 3) | CI/CD untouched |
| `config/asset_universe.v1.json` | 56-ticker universe is perfect for paper trading |
| Daily market data refresh pipeline | OHLCV data feeds paper trade prices |

### Deprecate (not delete)
| What | Action |
|---|---|
| `backend/app/ml/` (PPO/SAC RL engine) | Already disabled via `FORESIGHT_LOAD_ARTIFACT_ENGINE=false`; stays in repo |
| `POST /api/inference`, `POST /api/backtests` | Endpoints stay; frontend buttons hidden with CSS |
| RL allocation / backtest UI | Hidden with CSS, not removed |
| Brand kicker `"Market Intelligence"` | Changed to `"Financial Literacy"` |

---

## 3. New Database Schema

**Migration file:** `supabase/migrations/202606010001_paper_trading.sql`

All 6 tables added in one migration. Row-Level Security (RLS) ensures users cannot access each other's data. All writes go through the backend service role key; RLS enforces ownership on reads.

### `user_profiles`
Extends `auth.users`. Created on first login via `POST /api/auth/profile`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | References `auth.users(id)` |
| `display_name` | `text` | Optional |
| `paper_cash` | `numeric` | Starting cash (default `10000.00`) |
| `total_trades` | `integer` | Incremented on each trade |
| `quests_done` | `integer` | Incremented on quest completion |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

RLS: `auth.uid() = id`

---

### `paper_portfolios`
One active portfolio per user. Designed to support multiple portfolios in the future.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK` | → `user_profiles.id` |
| `name` | `text` | Default `'My Portfolio'` |
| `cash_balance` | `numeric` | Updated on every trade |
| `is_active` | `boolean` | Default `true` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated |

Index: `(user_id, is_active)`  
RLS: `user_id = auth.uid()`

---

### `paper_positions`
Current net holdings per portfolio. Updated by the backend on every trade (not by a DB trigger), so the backend controls the weighted average cost math.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | |
| `portfolio_id` | `uuid FK` | → `paper_portfolios.id` |
| `ticker` | `text FK` | → `asset_universe.ticker` |
| `shares` | `numeric` | `>= 0`; row deleted when 0 |
| `avg_cost` | `numeric` | Weighted average cost per share |
| `opened_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated |

Unique: `(portfolio_id, ticker)`  
RLS: `portfolio_id IN (SELECT id FROM paper_portfolios WHERE user_id = auth.uid())`

---

### `paper_trades`
Append-only trade log. P&L is always recomputable from this table. `price_per_share` is the closing price at trade time from `market_ohlcv_daily`, so historical P&L is reproducible. `metadata` jsonb carries context needed for quest evaluation (e.g. `bear_return`, `avg_cost_at_sell`).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | |
| `portfolio_id` | `uuid FK` | → `paper_portfolios.id` |
| `ticker` | `text FK` | → `asset_universe.ticker` |
| `action` | `text` | `CHECK (action IN ('buy', 'sell'))` |
| `shares` | `numeric` | `> 0` |
| `price_per_share` | `numeric` | Closing price at execution date |
| `total_value` | `numeric` | `shares * price_per_share` |
| `trade_date` | `date` | Date of OHLCV row used |
| `note` | `text` | Optional user annotation |
| `quest_id` | `text` | Quest this trade contributes to (if any) |
| `explainer_shown` | `boolean` | Whether user viewed pre-trade explainer |
| `metadata` | `jsonb` | Quest eval context (`bear_return`, `avg_cost_at_sell`, etc.) |
| `created_at` | `timestamptz` | |

Index: `(portfolio_id, trade_date DESC)`  
RLS: `portfolio_id IN (SELECT id FROM paper_portfolios WHERE user_id = auth.uid())`

---

### `quest_progress`
One row per user per quest. Quest definitions live in a static Python dict on the backend (no migration needed to add quests).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK` | → `user_profiles.id` |
| `quest_id` | `text` | Matches static definition key |
| `status` | `text` | `'not_started'` / `'in_progress'` / `'completed'` |
| `steps_done` | `integer` | |
| `steps_total` | `integer` | |
| `started_at` | `timestamptz` | |
| `completed_at` | `timestamptz` | |
| `metadata` | `jsonb` | Quest-specific state |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated |

Unique: `(user_id, quest_id)`  
Index: `(user_id, status)`  
RLS: `user_id = auth.uid()`

---

### `concept_events`
Lightweight log of which financial concepts each user has encountered. Powers the "N concepts explored" counter in the user badge.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK` | → `user_profiles.id` |
| `concept_key` | `text` | Glossary key (e.g. `"bear"`, `"avg_cost"`) |
| `context` | `text` | Where it appeared (`"market_tab"`, `"pre_trade"`, etc.) |
| `seen_at` | `timestamptz` | |

No unique constraint — seeing a concept multiple times is valid; deduplicated in count queries.  
Index: `(user_id, concept_key)`  
RLS: `user_id = auth.uid()`

---

## 4. Backend Changes

### 4.1 `backend/app/core/config.py`
Add two fields to the `Settings` dataclass and their env var mappings:

```python
supabase_anon_key: str   # env: SUPABASE_ANON_KEY
jwt_secret: str          # env: SUPABASE_JWT_SECRET
```

### 4.2 `backend/app/api/auth.py` *(new file)*
FastAPI dependency that validates Supabase JWTs from the `Authorization: Bearer <token>` header. Returns the decoded payload (`sub` = user UUID). Raises `HTTP 401` on missing or invalid token.

Requires `PyJWT>=2.8` (add to `requirements.txt` and `requirements-render.txt`).

```python
def get_current_user(request: Request) -> dict:
    # validates token, returns {"sub": "<user_uuid>", ...}
```

### 4.3 `backend/app/api/routes/auth_routes.py` *(new file)*
```
POST /api/auth/profile   → upsert user_profiles row (idempotent, called on every login)
GET  /api/auth/profile   → returns profile + stats (total_trades, quests_done, concepts_seen_count)
POST /api/concepts/seen  → insert into concept_events (fire-and-forget from frontend)
```

### 4.4 `backend/app/api/routes/paper_trading.py` *(new file)*
All endpoints protected by `get_current_user`. Writes use the service role key (bypasses RLS on the server side). Reads use the user JWT (RLS enforces ownership).

```
GET  /api/paper/portfolio          → cash balance + positions with live P&L
POST /api/paper/trades             → execute a paper buy or sell
GET  /api/paper/trades             → paginated trade history
GET  /api/paper/positions          → open positions with unrealized P&L
POST /api/paper/portfolio/reset    → reset cash to $10,000 (keeps trade history)
```

**Trade execution logic (`POST /api/paper/trades`):**
1. Validate JWT, extract `user_id`
2. Look up latest close price for ticker from `market_ohlcv_daily` (via existing `repository.coverage_for_ticker()`)
3. For **buy**: check `cash_balance >= shares * price`; deduct cash; upsert `paper_positions` with weighted `avg_cost`; insert `paper_trades` row; increment `user_profiles.total_trades`
4. For **sell**: check `paper_positions.shares >= requested`; credit cash; update/delete position; insert `paper_trades` row with `avg_cost_at_sell` in `metadata`
5. Return updated portfolio summary

### 4.5 `backend/app/quests/definitions.py` *(new file)*
Static Python dict — no migration needed to add quests. Only progress rows live in the DB.

### 4.6 `backend/app/api/routes/quests.py` *(new file)*
```
GET  /api/quests                   → all quest definitions + user progress rows
POST /api/quests/{quest_id}/check  → evaluate completion criteria, update status
GET  /api/quests/{quest_id}        → single quest state
```

Completion criteria are evaluated server-side against the user's trade/position data. The `paper_trades.metadata` jsonb carries context captured at trade time (e.g. `bear_return`, `avg_cost_at_sell`) so quest evaluation is based on what the user knew when they traded.

### 4.7 `backend/app/api/routes/__init__.py`
Register three new routers: `auth_router`, `paper_trading_router`, `quests_router`.

### 4.8 `backend/app/main.py` — CORS update
```python
CORSMiddleware(
    allow_origins=["https://sudip70.github.io", "http://localhost:8080", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
```

### 4.9 `render.yaml`
Add two new env vars (both `sync: false` — set manually in Render dashboard):
```yaml
- key: SUPABASE_ANON_KEY
  sync: false
- key: SUPABASE_JWT_SECRET
  sync: false
```

### 4.10 New Pydantic schemas (added to `backend/app/api/schemas.py`)
```
PaperTradeRequest        — ticker, action (buy/sell), shares, note?, quest_id?, explainer_shown
PaperPositionResponse    — ticker, asset_class, shares, avg_cost, current_price, current_value, unrealized_pl, unrealized_pl_pct
PaperPortfolioResponse   — cash_balance, total_invested, total_current_value, total_unrealized_pl, positions[]
QuestProgressResponse    — quest_id, title, description, status, steps_done, steps_total, reward_xp, steps[]
UserProfileResponse      — display_name, paper_cash, total_trades, quests_done, concepts_seen_count
```

---

## 5. Frontend Changes

### 5.1 New file: `frontend/auth/supabase.js`
Thin wrapper around the Supabase JS SDK (loaded from CDN). Exports: `supabase` client instance, `getSession()`, `signIn(email, password)`, `signUp(email, password)`, `signOut()`, `onAuthChange(callback)`.

Supabase URL and anon key injected as `window.FORESIGHT_SUPABASE_*` globals in `index.html` (anon key is safe to expose — RLS enforces security server-side).

### 5.2 Updated `frontend/api/client.js`
Add auth header injection:
```javascript
async function getAuthHeader() {
  const session = await getSession();
  return session?.access_token
    ? { "Authorization": `Bearer ${session.access_token}` }
    : {};
}
```
Update `callApi()` to accept `options.requiresAuth` flag and inject the header. All paper trading and quest calls pass `{ requiresAuth: true }`.

### 5.3 New file: `frontend/render/auth.js`
- `renderAuthModal(mode)` — login/signup form; reuses `showToast()`, `setLoading()`, `setError()`
- `renderUserBadge(user, profile)` — shows email + cash balance + concepts-seen count in sidebar
- `renderAuthGate()` — shown on Paper Trade / Quests tabs when logged out

### 5.4 New file: `frontend/render/paperTrading.js`
All functions reuse existing `utils/dom.js` helpers and CSS classes.

| Function | What it renders | Reuses |
|---|---|---|
| `renderPortfolioSummary(portfolio)` | Total value, unrealized P&L, cash, trade count | `metricCard()` |
| `renderPositionsTable(positions)` | Open holdings table with P&L per row | `.data-table` pattern from `render/simulator.js` |
| `renderTradeHistory(trades)` | Buy/sell log with action pill | `.data-table` + `badge()` |
| `renderTradeForm(ticker)` | Ticker dropdown, shares input, buy/sell toggle | `elements` from store |
| `renderPreTradeExplainer(forecast, ticker)` | Bear/base/bull context before confirming a trade | `lessonCard()` + `termChip()` |
| `renderTradeOutcomeExplainer(trade)` | Realized P&L explanation after selling | `lessonCard()` + `termChip("realized_gain")` |

### 5.5 New file: `frontend/render/quests.js`
| Function | What it renders |
|---|---|
| `renderQuestBoard(quests)` | Grid of quest cards with progress bars; uses `lessonCard()` extended with `.quest-progress-bar` |
| `renderQuestDetail(quest)` | Expanded single quest view with step checklist |
| `renderQuestCompletion(quest)` | Fires `showToast("Quest complete!", "success")` + updates card state |

### 5.6 Updated `frontend/state/store.js`
New state fields:
```javascript
user: null,            // Supabase auth user object
session: null,         // Supabase session (contains access_token)
userProfile: null,     // { paper_cash, total_trades, quests_done, concepts_seen_count }
portfolio: null,       // Current paper portfolio
trades: [],            // Trade history
quests: [],            // Quest list with progress
currentQuestId: null,  // Quest being actively displayed
loaded: {
  // ...existing...
  papertrading: false,  // new
  quests: false,        // new
},
```

New glossary terms (extended in place):
```javascript
realized_gain, unrealized_pl, avg_cost, position_sizing,
opportunity_cost, market_order, cost_basis, shares
```

New DOM element refs added to `elements`: `loginModal`, `loginEmail`, `loginPassword`, `loginSubmit`, `signupSubmit`, `logoutBtn`, `userBadge`, `authToggleMode`, `paperPortfolioSummary`, `paperPositions`, `paperTradeHistory`, `paperTradeForm`, `tradeTickerSelect`, `tradeShares`, `tradeAction`, `executeTradeBtn`, `preTradeExplainer`, `questBoard`, `questDetail`.

### 5.7 Updated `frontend/app.js`
- Add `onAuthChange()` initialization at `startApp()` — reactively updates `state.user` and re-renders user badge
- Add `switchTab()` cases for `"papertrading"` and `"quests"`
- Add login/signup/logout event listeners
- Add execute-trade listener: on submit → `POST /api/paper/trades` → refresh portfolio → trigger quest re-check
- Update `buildTourDriver()` step list for new tabs
- Add keyboard shortcuts: `5` → Paper Trading, `6` → Quests
- Add new tabs to command palette array
- Add `mouseover` handler for `.glossary-chip`: fire-and-forget `POST /api/concepts/seen` when logged in

### 5.8 Updated `frontend/index.html`
**Navigation:** Add two new nav items to sidebar and mobile nav:
- Paper Trade (with trade icon SVG symbol)
- Quests (with trophy/quest icon SVG symbol)

**Auth modal** (`#loginModal`): Login/signup form, hidden by default, triggered on "Sign in" click or when unauthenticated user visits Paper Trade / Quests tab.

**User badge** (`#userBadge`): Shown in sidebar footer when logged in — displays email, cash balance, concepts-seen count, sign out button.

**New sections:**
```html
<section id="papertrading" class="workspace view"> ... </section>
<section id="quests" class="workspace view"> ... </section>
```

**Head:** Add Supabase CDN script + `window.FORESIGHT_SUPABASE_*` globals.

**Brand kicker:** `"Market Intelligence"` → `"Financial Literacy"`

### 5.9 Updated `frontend/styles/components.css`
New CSS classes added at end of file (no existing classes modified):

**Auth:**
`.auth-modal-overlay`, `.auth-modal-card`, `.user-badge`, `.user-cash`, `.text-button`, `.auth-gate-card`, `.secondary-button`

**Paper Trading:**
`.paper-trade-layout` (2-col grid: main + 340px aside), `.paper-trade-main`, `.paper-trade-side`, `.pl-positive` (accent green), `.pl-negative` (danger red), `.trade-action-toggle`, `.trade-action-btn.buy`, `.trade-action-btn.sell`

**Quests:**
`.quest-grid` (3-col grid), `.quest-card`, `.quest-progress-bar`, `.quest-progress-fill`, `.quest-badge-done`, `.quest-detail`

---

## 6. Quest System

Quests are static Python definitions in `backend/app/quests/definitions.py`. Only progress rows live in the DB. New quests can be added without a migration.

| quest_id | Title | Completion Criteria | XP |
|---|---|---|---|
| `first_trade` | First Steps | Execute any paper trade | 100 |
| `read_forecast` | Know Before You Buy | Execute a trade with `explainer_shown = true` | 75 |
| `diversify_three` | Spread It Out | Hold positions in stock + ETF + crypto simultaneously | 200 |
| `bear_aware` | Bear Aware | Buy a ticker where `metadata.bear_return < -0.10` | 125 |
| `buy_and_hold` | The Buy-and-Hold Experiment | Buy any stock and hold it for ≥ 3 calendar days | 150 |
| `sell_for_profit` | Lock It In | Sell any position at a realized gain | 250 |
| `macro_watcher` | The Macro Watcher | Visit Market tab in 3 separate sessions | 100 |
| `portfolio_reset` | Start Fresh | Make ≥1 trade, then reset portfolio | 50 |

**Auto-evaluation:** After every `POST /api/paper/trades`, the backend auto-checks `first_trade`, `read_forecast`, and `bear_aware`. The frontend re-fetches quests and shows `showToast("Quest complete!", "success")` if any newly completed.

---

## 7. Concept Explainer System

Explainers work in three modes, all using existing `dom.js` utilities:

**Mode A — Pre-trade explainer (inline in Paper Trading tab)**
When user selects a ticker in the trade form, `renderPreTradeExplainer()` automatically calls `GET /api/forecasts/ticker` (existing endpoint) and renders bear/base/bull scenario cards using `lessonCard()` + `termChip()`. If the user proceeds to trade, `explainer_shown: true` is sent in the trade payload — powering the "Know Before You Buy" quest.

**Mode B — Post-trade outcome (after selling)**
`renderTradeOutcomeExplainer()` renders a lesson card explaining realized P&L: "You bought at $X, sold at $Y, that's a Z% return." Uses `lessonCard()` + `termChip("realized_gain")`.

**Mode C — Contextual glossary chips (all tabs, existing mechanism)**
The existing `termChip(key)` hover mechanism already works everywhere. The extended glossary (8 new terms) makes more chips available with no new code.

**Concept tracking:** When a logged-in user hovers a `.glossary-chip`, a fire-and-forget `POST /api/concepts/seen` logs it to `concept_events`. The user badge shows "N concepts explored".

---

## 8. Phased Implementation

Each phase is independently shippable. Existing tabs (Market, Forecast, Simulator) remain unchanged throughout.

### Phase 1 — Auth Foundation
**Goal:** Supabase Auth works end-to-end. Existing tabs completely unchanged.

**Backend:** `config.py` (+2 fields) · `api/auth.py` (new) · `api/routes/auth_routes.py` (new) · `routes/__init__.py` · `main.py` (CORS) · `requirements.txt` + `requirements-render.txt` (+PyJWT) · `render.yaml` (+2 env vars)

**Frontend:** `auth/supabase.js` (new) · `api/client.js` (+auth header) · `render/auth.js` (new) · `state/store.js` (+user/session state) · `app.js` (+auth lifecycle) · `index.html` (+Supabase CDN, auth modal, user badge) · `styles/components.css` (+auth styles)

**Database:** Apply full `202606010001_paper_trading.sql` migration (all 6 tables).

**Verification:**
1. Open app → all existing tabs work identically, no visible change
2. Click "Sign in" → auth modal opens
3. Create account → `user_profiles` row created → badge shows email + $10,000
4. Reload → session persists (Supabase stores JWT in localStorage)
5. Sign out → badge disappears → existing tabs still work
6. Verify RLS: second user cannot read first user's profile

---

### Phase 2 — Paper Trading Core
**Goal:** Buy/sell paper trades, portfolio persists across sessions.

**Backend:** `api/routes/paper_trading.py` (new, 5 endpoints) · `api/schemas.py` (+3 schemas) · `routes/__init__.py`

**Frontend:** `render/paperTrading.js` (new) · `state/store.js` (+portfolio/trades state) · `app.js` (+paper trading tab routing + trade listener) · `index.html` (+paper trading section + nav item) · `styles/components.css` (+trading layout styles)

**Verification:**
1. Login → Paper Trading tab → portfolio shows $10,000 cash, 0 positions
2. Select AAPL → pre-trade explainer renders
3. Buy 5 shares → cash decreases, position appears
4. Reload → position persists
5. Attempt over-buy → 400 error shown via `setError()`
6. Sell 3 shares → position reduces
7. Sell remaining → position disappears
8. Reset portfolio → $10,000 cash, positions cleared, trade history kept
9. Login as second user → empty portfolio (RLS working)

---

### Phase 3 — Quest System
**Goal:** Quest board with 8 quests, auto-evaluation after every trade.

**Backend:** `quests/definitions.py` (new) · `api/routes/quests.py` (new, 4 endpoints) · `api/schemas.py` (+QuestProgressResponse) · `routes/__init__.py` · Extend `POST /api/paper/trades` to auto-check 3 quests

**Frontend:** `render/quests.js` (new) · `state/store.js` (+quests state) · `app.js` (+quests tab + post-trade re-fetch) · `index.html` (+quests section + nav item) · `styles/components.css` (+quest card styles)

**Verification:**
1. Quests tab → 8 quest cards render, all `not_started`
2. Execute trade → `first_trade` completes → `showToast` fires → card shows completion badge
3. Execute trade with explainer open → `read_forecast` completes
4. Buy stock + ETF + crypto → `diversify_three` completes
5. Reload → completion states persist
6. Concept events fire on hover (check `concept_events` table)

---

### Phase 4 — Explainer Depth + Polish
**Goal:** Concept tracking UI, remaining quests, tour update, copy refresh.

**Backend:** `POST /api/concepts/seen` endpoint · `GET /api/auth/profile` includes `concepts_seen_count` · Remaining quest evaluators (`buy_and_hold`, `sell_for_profit`, `macro_watcher`, `portfolio_reset`)

**Frontend:** `state/store.js` (+8 new glossary terms) · `app.js` (+concept tracking mouseover, tour update, keyboard shortcuts 5/6, command palette) · `render/diagnostics.js` (update project copy to literacy-focused) · `index.html` (brand kicker, concepts count in badge)

**Verification:**
1. "Buy-and-Hold" quest — buy position, return 3 days later → completes
2. "Sell for Profit" — profitable sell → outcome explainer + quest completes
3. Hover 5 glossary chips → 5 `concept_events` rows → badge shows "5 concepts explored"
4. `⌘K` palette includes Paper Trade + Quests
5. Keyboard `5` → Paper Trading, `6` → Quests
6. All existing Market, Forecast, Simulator tabs unaffected

---

## 9. File Change Summary

### New files
| File | Phase |
|---|---|
| `supabase/migrations/202606010001_paper_trading.sql` | 1 |
| `backend/app/api/auth.py` | 1 |
| `backend/app/api/routes/auth_routes.py` | 1 |
| `backend/app/api/routes/paper_trading.py` | 2 |
| `backend/app/quests/definitions.py` | 3 |
| `backend/app/api/routes/quests.py` | 3 |
| `frontend/auth/supabase.js` | 1 |
| `frontend/render/auth.js` | 1 |
| `frontend/render/paperTrading.js` | 2 |
| `frontend/render/quests.js` | 3 |

### Modified files
| File | Phase | Change |
|---|---|---|
| `backend/app/core/config.py` | 1 | +2 fields |
| `backend/app/api/schemas.py` | 1, 2, 3 | +5 schemas |
| `backend/app/api/routes/__init__.py` | 1, 2, 3 | +3 routers |
| `backend/app/main.py` | 1 | CORS update |
| `requirements.txt` | 1 | +PyJWT>=2.8 |
| `requirements-render.txt` | 1 | +PyJWT>=2.8 |
| `render.yaml` | 1 | +2 env vars |
| `frontend/api/client.js` | 1 | +auth header injection |
| `frontend/state/store.js` | 1, 2, 3, 4 | +user/portfolio/quest state, +8 glossary terms |
| `frontend/app.js` | 1, 2, 3, 4 | +auth lifecycle, new tab routing, trade listener, quest re-fetch, tour update |
| `frontend/index.html` | 1, 2, 3, 4 | +Supabase CDN, +auth modal, +user badge, +2 new sections, +2 nav items |
| `frontend/styles/components.css` | 1, 2, 3 | +auth/trading/quest CSS (append only) |
| `frontend/render/diagnostics.js` | 4 | Update project copy |

### Untouched files
`backend/app/market/repository.py` · `market/forecasting.py` · `market/index_refresh.py` · `api/routes/market.py` · `api/routes/forecasts.py` · `api/routes/portfolio.py` · `api/routes/health.py` · `api/routes/inference.py` · `backend/app/ml/` (all) · `frontend/render/market.js` · `frontend/render/forecast.js` · `frontend/render/simulator.js` · `frontend/utils/formatters.js` · `frontend/utils/validation.js` · `frontend/utils/dom.js` · `frontend/charts/` (both) · `frontend/styles/base.css` · `themes.css` · `layout.css` · `forms.css` · `charts.css` · `responsive.css` · `.github/workflows/` (all 3)
