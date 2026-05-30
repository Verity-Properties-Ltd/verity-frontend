from __future__ import annotations

from fastapi import APIRouter

from app.core.database import check_db_connection
from app.core.mongodb import check_mongo_connection
from app.core.redis import check_redis_connection


router = APIRouter()


@router.get("")
async def health_check() -> dict[str, object]:
    checks = {"database": "ok", "redis": "ok", "mongodb": "ok"}
    for name, checker in (
        ("database", check_db_connection),
        ("redis", check_redis_connection),
        ("mongodb", check_mongo_connection),
    ):
        try:
            await checker()
        except Exception:
            checks[name] = "degraded"
    status = "ok" if all(value == "ok" for value in checks.values()) else "degraded"
    return {"status": status, "checks": checks}
