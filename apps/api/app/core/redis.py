from __future__ import annotations

import redis.asyncio as redis

from app.core.config import settings


redis_client = redis.from_url(
    settings.redis_url,
    password=settings.redis_auth_token or None,
    encoding="utf-8",
    decode_responses=True,
    max_connections=20,
)


async def check_redis_connection() -> None:
    await redis_client.ping()
