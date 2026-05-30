from __future__ import annotations

from datetime import UTC, datetime, timedelta

from jose import JWTError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ConflictError, PermissionDeniedError
from app.core.security import create_access_token, create_refresh_token, decode_token, generate_otp, hash_password, verify_password
from app.core.session_store import is_refresh_token_active, revoke_refresh_token, store_refresh_token
from app.models.company import Company
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse, VerifyOtpRequest


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


async def register_company_user(db: AsyncSession, payload: RegisterRequest) -> RegisterResponse:
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise ConflictError("An account with this email already exists")

    verification_required = settings.auth_require_email_verification
    otp_code = generate_otp() if verification_required else None
    try:
        company = Company(
            name=payload.company_name,
            cac_registration_number=payload.cac_registration_number,
            contact_name=payload.contact_name,
            contact_email=payload.email,
            contact_phone=payload.phone_number,
            state=payload.state,
        )
        db.add(company)
        await db.flush()

        user = User(
            company_id=company.id,
            email=payload.email,
            full_name=payload.contact_name,
            phone_number=payload.phone_number,
            state=payload.state,
            role=UserRole.DEVELOPER_ADMIN,
            password_hash=hash_password(payload.password),
            is_email_verified=not verification_required,
            otp_code=otp_code,
            otp_expires_at=datetime.now(UTC) + timedelta(minutes=10) if otp_code else None,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except IntegrityError as exc:
        await db.rollback()
        raise ConflictError("An account or company record with these details already exists") from exc

    if otp_code and settings.app_env in {"local", "test"}:
        print(f"registration_otp_generated email={payload.email} otp_code={otp_code}", flush=True)

    return RegisterResponse(
        user_id=user.id,
        company_id=company.id,
        detail=(
            "Registration successful. Verify the OTP sent to your email."
            if verification_required
            else "Registration successful. You can log in immediately."
        ),
        email_verification_required=verification_required,
        otp_code=otp_code if otp_code and settings.app_env in {"local", "test"} else None,
    )


async def verify_otp(db: AsyncSession, payload: VerifyOtpRequest) -> None:
    if not settings.auth_require_email_verification:
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalar_one_or_none()
        if user is None:
            raise PermissionDeniedError("Invalid OTP code")
        if not user.is_email_verified or user.otp_code or user.otp_expires_at:
            user.is_email_verified = True
            user.otp_code = None
            user.otp_expires_at = None
            await db.commit()
        return

    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if user is None or user.otp_code != payload.otp_code:
        raise PermissionDeniedError("Invalid OTP code")
    if user.otp_expires_at is None or _as_utc(user.otp_expires_at) < datetime.now(UTC):
        raise PermissionDeniedError("OTP code has expired")

    user.is_email_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    await db.commit()


async def login(db: AsyncSession, payload: LoginRequest) -> TokenResponse:
    result = await db.execute(select(User).where(User.email == payload.email, User.is_active.is_(True)))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise PermissionDeniedError("Invalid email or password")
    if settings.auth_require_email_verification and not user.is_email_verified:
        raise PermissionDeniedError("Email must be verified before login")

    access_token = create_access_token(subject=user.id, extra_claims={"role": user.role.value})
    refresh_token, refresh_jti = create_refresh_token(subject=user.id, extra_claims={"role": user.role.value})
    await store_refresh_token(refresh_jti, user.id)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def refresh_tokens(payload_token: str) -> TokenResponse:
    try:
        decoded = decode_token(payload_token)
    except JWTError as exc:
        raise PermissionDeniedError("Invalid refresh token") from exc
    if decoded.get("type") != "refresh":
        raise PermissionDeniedError("Invalid refresh token")
    subject = decoded.get("sub")
    jti = decoded.get("jti")
    if not subject or not jti or not await is_refresh_token_active(jti, subject):
        raise PermissionDeniedError("Refresh token is not active")

    await revoke_refresh_token(jti)
    access_token = create_access_token(subject=subject, extra_claims={"role": decoded.get("role", "")})
    refresh_token, new_jti = create_refresh_token(subject=subject, extra_claims={"role": decoded.get("role", "")})
    await store_refresh_token(new_jti, subject)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def logout(payload_token: str) -> None:
    try:
        decoded = decode_token(payload_token)
    except JWTError as exc:
        raise PermissionDeniedError("Invalid refresh token") from exc
    if decoded.get("type") != "refresh":
        raise PermissionDeniedError("Invalid refresh token")
    jti = decoded.get("jti")
    if not jti:
        raise PermissionDeniedError("Invalid refresh token")
    await revoke_refresh_token(jti)
