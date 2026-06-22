# Legacy (archived)

Kept for reference, **not** under active development. Nothing here is wired into the
current Fiscally product. Recover history with `git log --follow <path>`.

- **`backend-foresight/`** — the original Foresight ML/RL backend (PPO/SAC, SHAP, gymnasium,
  stable-baselines3) plus the unused `inference`/`explanations`/`backtests`/`portfolio`
  routes and `market/simulation.py`. The current API (`services/api/`) lifted only the
  market data + forecasting modules from this.
- **`frontend-foresight/`** — the old Foresight modular web app (ES modules, deployed to
  GitHub Pages). Superseded by `apps/web/`.
- **`offline-foresight/`** — PPO trainers, hyperparameter tuning, the one-off FRED macro
  dataset builder, and the artifact-repair hotfix. The live daily refresh moved to
  `pipelines/market-refresh/`.
- **`prototypes/`** — earlier UI prototypes (`mobile-prototype.html`,
  `northstar-prototype.html`, `fiscally-prototype.backup.html`) and the old root
  `index.html` redirect that pointed at `frontend-foresight/`.
