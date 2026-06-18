# packages/core (scaffold)

Intended home for genuinely shared, framework-free pieces used by both `apps/web`
and `apps/mobile` — e.g. the API client (`wakeFetch` + endpoint calls), the asset
universe list, and number/date formatters.

**Status:** scaffold only. `apps/web` currently ships these inline as classic global
scripts, and `apps/mobile` is still a single file on the older synthetic engine.
This package is populated when the mobile app is modularized and the two surfaces
start sharing code — see the deferred items in the reorg plan.
