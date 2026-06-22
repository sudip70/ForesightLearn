from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from services.api.app.core.config import get_settings
from services.api.app.schemas import HealthResponse

router = APIRouter(tags=["health"])


def _market_health(app) -> dict | None:
    repository = getattr(app.state, "market_repository", None)
    if repository is None:
        return None
    try:
        return repository.health_payload()
    except Exception as exc:  # pragma: no cover - defensive
        return {"status": "unavailable", "source": "supabase", "error": str(exc)}


@router.get("/health", response_model=HealthResponse)
def health(request: Request):
    app = request.app
    settings = get_settings()
    market_data = _market_health(app)
    repository_error = getattr(app.state, "market_repository_error", None)
    if market_data is None and repository_error is not None:
        market_data = {
            "configured": bool(settings.supabase_url and settings.supabase_service_role_key),
            "status": "unavailable",
            "source": "supabase",
            "error": str(repository_error),
        }
    ready = bool(market_data and market_data.get("status") == "ok")
    payload = {
        "status": "ok" if ready else "degraded",
        "ready": ready,
        "error": None if ready else "Supabase market data is not available",
        "market_data": market_data,
    }
    if settings.require_supabase and not ready:
        raise HTTPException(
            status_code=503,
            detail=(market_data or {}).get("error")
            or "Supabase market data is required but unavailable",
        )
    return payload
