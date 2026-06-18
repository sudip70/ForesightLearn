from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import os


# services/api/app/core/config.py -> repo root is four levels up
REPO_ROOT = Path(__file__).resolve().parents[4]


@dataclass(frozen=True)
class Settings:
    project_name: str
    api_prefix: str
    market_data_provider: str
    market_index_auto_refresh: bool
    market_index_config_path: Path
    market_index_refresh_lookback_days: int
    meta_cash_annual_return: float
    supabase_url: str
    supabase_service_role_key: str
    require_supabase: bool


_settings: Settings | None = None


def _env(name: str, default: object = "") -> str:
    """Read FISCALLY_<NAME>, falling back to the legacy FORESIGHT_<NAME> for one release."""
    for prefix in ("FISCALLY_", "FORESIGHT_"):
        value = os.getenv(f"{prefix}{name}")
        if value is not None:
            return value
    return str(default)


def _env_bool(name: str, default: str) -> bool:
    return _env(name, default).lower() in {"1", "true", "yes", "on"}


def get_settings() -> Settings:
    global _settings
    if _settings is not None:
        return _settings

    _settings = Settings(
        project_name="Fiscally API",
        api_prefix="/api",
        market_data_provider=_env("MARKET_DATA_PROVIDER", "supabase_proxy"),
        market_index_auto_refresh=_env_bool("MARKET_INDEX_AUTO_REFRESH", "false"),
        market_index_config_path=Path(
            _env(
                "MARKET_INDEX_CONFIG_PATH",
                REPO_ROOT / "data" / "config" / "market_indices.v1.json",
            )
        ),
        market_index_refresh_lookback_days=int(
            _env("MARKET_INDEX_REFRESH_LOOKBACK_DAYS", "10")
        ),
        meta_cash_annual_return=float(_env("META_CASH_ANNUAL_RETURN", "0.04")),
        supabase_url=os.getenv("SUPABASE_URL", ""),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""),
        require_supabase=_env_bool("REQUIRE_SUPABASE", "false"),
    )
    return _settings


def reset_settings() -> None:
    global _settings
    _settings = None
