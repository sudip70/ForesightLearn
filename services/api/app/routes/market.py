from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request

from services.api.app.core.config import get_settings
from services.api.app.data.errors import ArtifactValidationError
from services.api.app.data.indices import (
    fetch_market_index_history,
    fetch_market_index_history_from_repository,
    fetch_market_index_snapshots,
    fetch_market_index_snapshots_from_repository,
)
from services.api.app.data.repository import MarketDataUnavailable
from services.api.app.schemas import (
    MarketIndexHistoryResponse,
    MarketIndexResponse,
    TickerProfileResponse,
    UniverseResponse,
)

router = APIRouter(tags=["market"])


def _engine(app):
    engine = getattr(app.state, "forecast_engine", None)
    if engine is None:
        raise HTTPException(status_code=503, detail="Supabase market data is not available")
    return engine


def _index_payload_from_rows(result: dict, *, source: str, disclaimer: str) -> dict:
    rows = result.get("rows", []) or []
    as_of_dates = [str(row["as_of_date"]) for row in rows if row.get("as_of_date")]
    return {
        "source": source,
        "as_of_date": result.get("as_of_date") or (max(as_of_dates) if as_of_dates else None),
        "indices": sorted(rows, key=lambda row: int(row.get("display_order") or 0)),
        "disclaimer": disclaimer,
    }


@router.get("/universe", response_model=UniverseResponse)
def universe(request: Request):
    try:
        return _engine(request.app).universe_payload()
    except HTTPException:
        raise
    except (ArtifactValidationError, MarketDataUnavailable) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/tickers/{ticker}/profile", response_model=TickerProfileResponse)
def ticker_profile(ticker: str, request: Request):
    try:
        return _engine(request.app).ticker_profile_payload(ticker)
    except HTTPException:
        raise
    except ArtifactValidationError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except MarketDataUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/market/indices", response_model=MarketIndexResponse)
def market_indices(request: Request):
    app = request.app
    settings = get_settings()
    engine = getattr(app.state, "forecast_engine", None)
    repository = getattr(app.state, "market_repository", None)

    # 1) Supabase market_index_snapshots via the engine (primary in production).
    if engine is not None:
        try:
            payload = engine.market_indices_payload()
            if payload.get("indices"):
                return payload
        except MarketDataUnavailable:
            pass

    # 2) Supabase ETF-proxy history fallback.
    if repository is not None:
        try:
            result = fetch_market_index_snapshots_from_repository(settings, repository=repository)
            payload = _index_payload_from_rows(
                result,
                source="supabase_proxy",
                disclaimer=(
                    "Index cards use Supabase ETF proxy history when direct index "
                    "snapshots are unavailable."
                ),
            )
            if payload["indices"]:
                return payload
        except Exception:  # pragma: no cover - proxy fallback is best-effort
            pass

    # 3) Live provider fetch as a last resort.
    try:
        result = fetch_market_index_snapshots(settings, repository=repository)
        payload = _index_payload_from_rows(
            result,
            source=result.get("provider") or "live",
            disclaimer="Index levels are delayed provider data for market context.",
        )
        if payload["indices"]:
            return payload
    except Exception as exc:  # pragma: no cover - provider/network defensive path
        raise HTTPException(status_code=503, detail=str(exc) or "Market index data is unavailable") from exc

    raise HTTPException(status_code=503, detail="Market index data is unavailable")


@router.get("/market/indices/{symbol}/history", response_model=MarketIndexHistoryResponse)
def market_index_history(
    symbol: str,
    request: Request,
    history_range: str = Query(default="1y", alias="range", pattern="^(1m|3m|6m|1y|5y)$"),
):
    app = request.app
    settings = get_settings()
    normalized_symbol = symbol.strip().upper()
    normalized_range = history_range.strip().lower()
    repository = getattr(app.state, "market_repository", None)
    repository_error: Exception | None = None

    if repository is not None:
        try:
            return fetch_market_index_history_from_repository(
                settings,
                repository=repository,
                symbol=normalized_symbol,
                history_range=normalized_range,
            )
        except ValueError as exc:
            if "Unsupported market index symbol" in str(exc):
                raise HTTPException(status_code=404, detail=str(exc)) from exc
            repository_error = exc
        except Exception as exc:
            repository_error = exc

    try:
        return fetch_market_index_history(
            settings,
            symbol=normalized_symbol,
            history_range=normalized_range,
        )
    except ValueError as exc:
        message = str(exc)
        if "Unsupported market index symbol" in message:
            raise HTTPException(status_code=404, detail=message) from exc
        raise HTTPException(status_code=503, detail=message) from exc
    except Exception as exc:
        detail = str(exc) or "Market index history is unavailable"
        if repository_error is not None and str(repository_error):
            detail = f"{detail}; Supabase proxy history unavailable: {repository_error}"
        raise HTTPException(status_code=503, detail=detail) from exc
