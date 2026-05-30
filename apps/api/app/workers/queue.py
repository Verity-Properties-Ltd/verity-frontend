from __future__ import annotations

from urllib.parse import unquote, urlparse

from arq.connections import RedisSettings

from app.core.config import settings
from app.workers.email_worker import dispatch_email
from app.workers.ocr_worker import process_document
from app.workers.report_worker import compile_report


def build_redis_settings() -> RedisSettings:
    parsed = urlparse(settings.redis_url)
    password = parsed.password or settings.redis_auth_token or None
    database = int((parsed.path or "/0").lstrip("/") or "0")
    return RedisSettings(
        host=parsed.hostname or "localhost",
        port=parsed.port or 6379,
        database=database,
        username=unquote(parsed.username) if parsed.username else None,
        password=unquote(password) if password else None,
        ssl=parsed.scheme == "rediss",
    )


class WorkerSettings:
    functions = [
        process_document,
        compile_report,
        dispatch_email,
    ]
    redis_settings = build_redis_settings()
