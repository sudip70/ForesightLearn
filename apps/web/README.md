# Fiscally — desktop web app

Modular source for the desktop prototype (real-EOD paper trading, learning, scenarios).
Progress persists in `localStorage` under the key `fiscally.web.v1`.

## Layout
- `index.html` — shell: loads `src/styles/app.css` and the ordered `src/js/*.js` scripts.
- `src/styles/app.css` — all styles.
- `src/js/*.js` — the app, split into ordered **classic** scripts (numbered by load order).
  They share one global scope on purpose: inline `onclick="..."` handlers call these
  functions by name, so the scripts are concatenated, never ES-module-bundled.
- `build.mjs` — inlines CSS + JS back into one deployable file at `dist/fiscally-web.html`.

## Develop
```
npm run dev        # serves this folder at http://localhost:3333 (open /index.html)
```
Edit any `src/js/*.js` or `src/styles/app.css` and refresh — no build needed in dev.

## Build (single file)
```
npm run build      # -> dist/fiscally-web.html (faithful inline)
npm run build:min  # same, minified via esbuild (optional devDependency)
```
The backend API base lives in `src/js/07-tools-api.js` (`var API=...`).

## Source modules (`src/js/`, by load order)
| File | Responsibility |
|---|---|
| `01-charts-data.js` | Inline-SVG charts, `avatar()`, `GLOSS` glossary |
| `02-nav-onboarding.js` | Tab/sub-page navigation (`push`/`show`/`back`), onboarding |
| `03-trading-engine.js` | Paper-trading engine (`PF` state) |
| `04-persistence.js` | `localStorage` save/load (`fiscally.web.v1`) |
| `05-portfolio-scenarios.js` | Portfolio views + Scenarios |
| `06-stock-finder.js` | Stock Finder forecast page |
| `07-tools-api.js` / `07b-money.js` | Backend API + money/budget/goals |
| `08-learn-init.js` | Learn tab: lessons, XP/streaks, and the winding lesson **trail** (`renderUnitPath`/`trailSVG`) |
| `09-tools-games.js` | Tools tab mini-games + loan/mortgage calculators |

## Tools — "Play & Learn" games
Self-contained mini-games in `09-tools-games.js` (state → render → inline `onclick`), each awarding XP via `gameXP()` and registered as a sub-page in `02-nav-onboarding.js`:
Finance Wordle · Wants vs Needs · Mini Crossword · Budget Swipe · Scammer Scanner · Quick Count ·
**Debtor's Tower** — finance-term hangman where a 5-floor tower collapses on each wrong guess; win or lose, Mia explains the term with a definition + real-world example.

Adding a game: define its state/`init`/render in `09-tools-games.js`, add a tile + `page-game-*` div in `index.html`, and wire `game-*` into the four maps/lists in `02-nav-onboarding.js`.
