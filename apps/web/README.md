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
