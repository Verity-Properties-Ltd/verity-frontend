from __future__ import annotations

from ddtrace import patch_all
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

patch_all()

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.database import check_db_connection, engine
from app.core.exceptions import register_exception_handlers
from app.core.mongodb import check_mongo_connection, mongo_client
from app.core.redis import check_redis_connection, redis_client
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.rate_limit import limiter


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not settings.skip_startup_checks:
        await check_db_connection()
        await check_redis_connection()
        try:
            await check_mongo_connection()
        except Exception:
            import logging
            logging.getLogger("verity.startup").warning(
                "MongoDB unavailable at startup — report features will not work"
            )
    yield
    await engine.dispose()
    await redis_client.aclose()
    mongo_client.close()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.app_env != "production" else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# Keep request logging inside CORS so error responses still receive CORS headers.
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "local" else settings.backend_cors_origins,
    allow_credentials=settings.app_env != "local",
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_v1_router, prefix="/api/v1")
register_exception_handlers(app)


@app.get("/api/v1")
async def root() -> dict[str, str]:
    return {
        "message": "Welcome to Verity API",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/v1/health",
        "rate_limiting": "enabled",
    }
