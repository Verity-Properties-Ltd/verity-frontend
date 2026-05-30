from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from redis.exceptions import RedisError

from app.core.config import settings
from app.core.exceptions import ServiceUnavailableError
from app.core.redis import redis_client


_refresh_token_fallback_store: dict[str, tuple[str, datetime]] = {}
logger = logging.getLogger("verity.auth")


def _refresh_key(jti: str) -> str:
    return f"auth:refresh:{jti}"


def _refresh_ttl_seconds() -> int:
    return settings.jwt_refresh_token_expire_days * 24 * 60 * 60


def _is_test_mode() -> bool:
    return settings.app_env == "test"


async def store_refresh_token(jti: str, subject: str) -> None:
    expires_at = datetime.now(UTC) + timedelta(days=settings.jwt_refresh_token_expire_days)
    if _is_test_mode():
        _refresh_token_fallback_store[jti] = (subject, expires_at)
        return
    try:
        await redis_client.set(_refresh_key(jti), subject, ex=_refresh_ttl_seconds())
    except RedisError as exc:
        logger.exception("refresh_token_store_failed", extra={"jti": jti, "subject": subject})
        raise ServiceUnavailableError("Authentication session store is temporarily unavailable") from exc


async def is_refresh_token_active(jti: str, subject: str) -> bool:
    if _is_test_mode():
        record = _refresh_token_fallback_store.get(jti)
        if record is None:
            return False
        stored_subject, expires_at = record
        if expires_at < datetime.now(UTC):
            _refresh_token_fallback_store.pop(jti, None)
            return False
        return stored_subject == subject
    try:
        stored_subject = await redis_client.get(_refresh_key(jti))
    except RedisError as exc:
        logger.exception("refresh_token_lookup_failed", extra={"jti": jti, "subject": subject})
        raise ServiceUnavailableError("Authentication session store is temporarily unavailable") from exc
    return stored_subject == subject


async def revoke_refresh_token(jti: str) -> None:
    if _is_test_mode():
        _refresh_token_fallback_store.pop(jti, None)
        return
    try:
        await redis_client.delete(_refresh_key(jti))
    except RedisError as exc:
        logger.exception("refresh_token_revoke_failed", extra={"jti": jti})
        raise ServiceUnavailableError("Authentication session store is temporarily unavailable") from exc
