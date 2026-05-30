from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def build_engine(database_url: str) -> AsyncEngine:
    common_kwargs = {
        "echo": settings.database_echo or settings.app_env == "local",
        "pool_pre_ping": True,
    }
    if database_url.startswith("sqlite+aiosqlite"):
        return create_async_engine(database_url, **common_kwargs)
    return create_async_engine(
        database_url,
        pool_size=settings.database_pool_size,
        max_overflow=settings.database_max_overflow,
        pool_recycle=3600,
        **common_kwargs,
    )


engine = build_engine(settings.database_url)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def check_db_connection() -> None:
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))
