from __future__ import annotations

from services.api.app.routes.forecasts import router as forecasts_router
from services.api.app.routes.health import router as health_router
from services.api.app.routes.market import router as market_router

api_routers = (
    health_router,
    market_router,
    forecasts_router,
)
