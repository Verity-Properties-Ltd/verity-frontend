from __future__ import annotations

import secrets
from base64 import b64encode
from datetime import UTC, datetime, timedelta
from hashlib import sha256
from typing import Any
from uuid import UUID
from uuid import uuid4

import bcrypt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import PermissionDeniedError, UnauthorizedError
from app.models.enums import UserRole
from app.models.user import User


BCRYPT_ROUNDS = 12
_BCRYPT_SHA256_PREFIX = "bcrypt_sha256$"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def _password_bytes(password: str) -> bytes:
    return password.encode("utf-8")


def _bcrypt_sha256_password(password: str) -> bytes:
    return b64encode(sha256(_password_bytes(password)).digest())


def hash_password(password: str) -> str:
    password_bytes = _password_bytes(password)
    if len(password_bytes) <= 72:
        return bcrypt.hashpw(password_bytes, bcrypt.gensalt(rounds=BCRYPT_ROUNDS)).decode("utf-8")
    hashed = bcrypt.hashpw(_bcrypt_sha256_password(password), bcrypt.gensalt(rounds=BCRYPT_ROUNDS)).decode("utf-8")
    return f"{_BCRYPT_SHA256_PREFIX}{hashed}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith(_BCRYPT_SHA256_PREFIX):
        stored_hash = hashed_password.removeprefix(_BCRYPT_SHA256_PREFIX).encode("utf-8")
        return bcrypt.checkpw(_bcrypt_sha256_password(plain_password), stored_hash)

    try:
        return bcrypt.checkpw(_password_bytes(plain_password), hashed_password.encode("utf-8"))
    except ValueError:
        return False


def generate_otp(length: int = 6) -> str:
    digits = "0123456789"
    return "".join(secrets.choice(digits) for _ in range(length))


def _get_signing_key() -> str:
    if not settings.jwt_private_key:
        raise ValueError("JWT_PRIVATE_KEY is not configured")
    return settings.jwt_private_key


def _get_verification_key() -> str:
    if not settings.jwt_public_key:
        raise ValueError("JWT_PUBLIC_KEY is not configured")
    return settings.jwt_public_key


def create_access_token(subject: str, expires_delta: timedelta | None = None, extra_claims: dict[str, Any] | None = None) -> str:
    now = datetime.now(UTC)
    expire = now + (expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes))
    payload: dict[str, Any] = {"sub": subject, "type": "access", "iat": int(now.timestamp()), "exp": int(expire.timestamp())}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, _get_signing_key(), algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str, extra_claims: dict[str, Any] | None = None) -> tuple[str, str]:
    now = datetime.now(UTC)
    expire = now + timedelta(days=settings.jwt_refresh_token_expire_days)
    jti = str(uuid4())
    payload = {"sub": subject, "type": "refresh", "jti": jti, "iat": int(now.timestamp()), "exp": int(expire.timestamp())}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, _get_signing_key(), algorithm=settings.jwt_algorithm), jti


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, _get_verification_key(), algorithms=[settings.jwt_algorithm])


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        token_type = payload.get("type")
        if not subject or token_type != "access":
            raise UnauthorizedError("Could not validate credentials")
        user_id = UUID(subject)
    except (JWTError, ValueError):
        raise UnauthorizedError("Could not validate credentials") from None

    result = await db.execute(select(User).where(User.id == str(user_id), User.is_active.is_(True)))
    user = result.scalar_one_or_none()
    if user is None:
        raise UnauthorizedError("Could not validate credentials")
    return user


def require_roles(*allowed_roles: UserRole):
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise PermissionDeniedError("You do not have permission to perform this action")
        return current_user

    return dependency
