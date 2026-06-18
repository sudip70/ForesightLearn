from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from services.api.app.data.errors import ArtifactValidationError
from services.api.app.data.repository import MarketDataUnavailable
from services.api.app.schemas import (
    MarketForecastRequest,
    MarketForecastResponse,
    TickerForecastRequest,
    TickerForecastResponse,
)

router = APIRouter(tags=["forecasts"])


def _engine(app):
    engine = getattr(app.state, "forecast_engine", None)
    if engine is None:
        raise HTTPException(status_code=503, detail="Supabase market data is not available")
    return engine


@router.post("/forecasts/ticker", response_model=TickerForecastResponse)
def ticker_forecast(request_body: TickerForecastRequest, request: Request):
    engine = _engine(request.app)
    try:
        return engine.run_ticker_forecast(
            ticker=request_body.ticker,
            horizon_days=request_body.horizon_days,
            window_size=request_body.window_size,
        )
    except ArtifactValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except MarketDataUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/forecasts/market", response_model=MarketForecastResponse)
def market_forecast(request_body: MarketForecastRequest, request: Request):
    engine = _engine(request.app)
    try:
        return engine.run_market_forecast(
            horizon_days=request_body.horizon_days,
            risk=request_body.risk,
            top_n=request_body.top_n,
            window_size=request_body.window_size,
        )
    except ArtifactValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except MarketDataUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail=str(exc)) from exc
