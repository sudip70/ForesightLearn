from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


MAX_FORECAST_HORIZON_DAYS = 730
MAX_FORECAST_WINDOW_SIZE = 756


class HealthResponse(BaseModel):
    status: str
    ready: bool | None = None
    error: str | None = None
    market_data: dict[str, Any] | None = None


class UniverseResponse(BaseModel):
    latest_date: str
    supported_asset_classes: list[str]
    asset_classes: list[dict[str, Any]]
    tickers: list[dict[str, Any]]
    disclaimer: str
    source: str | None = None


class TickerProfileResponse(BaseModel):
    ticker: str
    asset_class: str
    display_name: str | None = None
    as_of_date: str | None = None
    data_as_of: str | None = None
    source: str
    fields: dict[str, Any]


class TickerForecastRequest(BaseModel):
    ticker: str = Field(min_length=1)
    horizon_days: int = Field(default=300, ge=1, le=MAX_FORECAST_HORIZON_DAYS)
    window_size: int = Field(default=60, ge=2, le=MAX_FORECAST_WINDOW_SIZE)
    strict_validation: bool = True


class TickerForecastResponse(BaseModel):
    ticker: str
    asset_class: str
    latest_date: str
    forecast_start_date: str | None = None
    latest_price: float
    horizon_days: int
    historical_prices: list[dict[str, Any]]
    forecast_paths: dict[str, list[dict[str, Any]]]
    target_prices: dict[str, float]
    returns: dict[str, float]
    risk_metrics: dict[str, float]
    confidence: float
    confidence_label: str
    risk_label: str
    opportunity_score: float
    return_estimator: dict[str, Any]
    literacy: dict[str, str]
    plain_language: str
    data_as_of: str | None = None
    source: str | None = None
    snapshot_used: bool | None = None
    forecast_change: dict[str, Any] | None = None
    data_quality: dict[str, Any] | None = None


class MarketForecastRequest(BaseModel):
    horizon_days: int = Field(default=300, ge=1, le=MAX_FORECAST_HORIZON_DAYS)
    risk: float = Field(default=0.5, ge=0.0, le=1.0)
    top_n: int = Field(default=10, ge=1, le=50)
    window_size: int = Field(default=60, ge=2, le=MAX_FORECAST_WINDOW_SIZE)
    strict_validation: bool = True


class MarketForecastResponse(BaseModel):
    horizon_days: int
    risk: float
    ranked_tickers: list[dict[str, Any]]
    highlights: dict[str, Any]
    macro_snapshot: dict[str, Any]
    disclaimer: str
    source: str | None = None


class MarketIndexResponse(BaseModel):
    source: str
    as_of_date: str | None = None
    indices: list[dict[str, Any]]
    disclaimer: str


class MarketIndexHistoryResponse(BaseModel):
    source: str
    symbol: str
    label: str
    display_name: str | None = None
    provider_symbol: str
    currency: str
    range: str
    lookback_days: int
    as_of_date: str | None = None
    history: list[dict[str, Any]]
    summary: dict[str, Any]
    disclaimer: str
