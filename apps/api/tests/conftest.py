from __future__ import annotations

import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


def _generate_test_keys() -> tuple[str, str]:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_bytes = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    )
    public_bytes = key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    return private_bytes.decode(), public_bytes.decode()


PRIVATE_KEY, PUBLIC_KEY = _generate_test_keys()


os.environ["APP_ENV"] = "test"
os.environ["SKIP_STARTUP_CHECKS"] = "true"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test.db"
os.environ["MONGODB_URI"] = "mongodb://localhost:27017/verity_docs"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["AWS_REGION"] = "us-east-1"
os.environ["AWS_ACCESS_KEY_ID"] = "test"
os.environ["AWS_SECRET_ACCESS_KEY"] = "test"
os.environ["AWS_ENDPOINT_URL"] = "http://localhost:4566"
os.environ["PAYSTACK_WEBHOOK_SECRET"] = "test_paystack_secret"
os.environ["FLUTTERWAVE_WEBHOOK_SECRET"] = "test_flutterwave_secret"
os.environ["JWT_PRIVATE_KEY"] = PRIVATE_KEY
os.environ["JWT_PUBLIC_KEY"] = PUBLIC_KEY
os.environ["AUTH_REQUIRE_EMAIL_VERIFICATION"] = "true"

from app.main import app
from app.models import Base
from app.core.database import AsyncSessionLocal, engine


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)
    yield


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client


@pytest_asyncio.fixture
async def db_session():
    async with AsyncSessionLocal() as session:
        yield session
