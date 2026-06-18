from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.api.app.core.config import get_settings
from services.api.app.data.forecasting import SupabaseForecastEngine
from services.api.app.data.repository import build_market_repository
from services.api.app.routes import api_routers


def create_app() -> FastAPI:
    settings = get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.market_repository = None
        app.state.market_repository_error = None
        app.state.forecast_engine = None
        try:
            repository = build_market_repository(settings)
            if repository is not None and hasattr(repository, "validate_schema"):
                repository.validate_schema()
            app.state.market_repository = repository
            if repository is not None:
                app.state.forecast_engine = SupabaseForecastEngine(repository, settings)
        except Exception as exc:  # pragma: no cover - defensive startup path
            app.state.market_repository_error = exc
        yield

    app = FastAPI(
        title=settings.project_name,
        version="1.0.0",
        description="Real-price market data and scenario forecasts for the Fiscally app.",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for router in api_routers:
        app.include_router(router, prefix=settings.api_prefix)

    return app


app = create_app()
