from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import LoginRequest, RefreshTokenRequest, RegisterRequest, RegisterResponse, TokenResponse, VerifyOtpRequest
from app.schemas.common import MessageResponse
from app.services.auth_service import login, logout, refresh_tokens as refresh_tokens_service, register_company_user, verify_otp


router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> RegisterResponse:
    return await register_company_user(db, payload)


@router.post("/verify-otp", response_model=MessageResponse)
async def verify(payload: VerifyOtpRequest, db: AsyncSession = Depends(get_db)) -> MessageResponse:
    await verify_otp(db, payload)
    return MessageResponse(detail="Email verified successfully")


@router.post("/login", response_model=TokenResponse)
async def login_user(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    return await login(db, payload)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(payload: RefreshTokenRequest) -> TokenResponse:
    return await refresh_tokens_service(payload.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout_endpoint(payload: RefreshTokenRequest) -> MessageResponse:
    await logout(payload.refresh_token)
    return MessageResponse(detail="Logged out successfully")
