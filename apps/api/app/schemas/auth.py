from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    company_name: str
    cac_registration_number: str
    contact_name: str
    email: EmailStr
    phone_number: str
    state: str
    password: str = Field(min_length=8)


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(min_length=6, max_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    user_id: str
    company_id: str
    detail: str
    email_verification_required: bool = True
    otp_code: str | None = None
