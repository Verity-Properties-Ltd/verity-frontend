from __future__ import annotations

from pydantic import BaseModel, EmailStr

from app.schemas.common import ORMModel
from app.models.enums import UserRole


class UserRead(ORMModel):
    id: str
    company_id: str | None
    email: EmailStr
    full_name: str
    phone_number: str
    state: str
    role: UserRole
    is_active: bool
    is_email_verified: bool


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    state: str | None = None
