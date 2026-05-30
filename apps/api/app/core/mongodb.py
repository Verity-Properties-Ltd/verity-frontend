from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


mongo_client = AsyncIOMotorClient(settings.mongodb_uri)


def get_mongo_database() -> AsyncIOMotorDatabase:
    return mongo_client[settings.mongodb_database_name]


async def check_mongo_connection() -> None:
    await mongo_client.admin.command("ping")
