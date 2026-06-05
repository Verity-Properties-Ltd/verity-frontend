from __future__ import annotations

from pydantic import BaseModel, EmailStr

from app.models.enums import UserRole
from app.schemas.common import ORMModel


class CompanyRead(ORMModel):
    id: str
    name: str
    cac_registration_number: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: str
    state: str
    billing_plan: str
    billing_cycle: str


class CompanyUpdate(BaseModel):
    contact_name: str | None = None
    contact_phone: str | None = None
    state: str | None = None
    billing_plan: str | None = None
    billing_cycle: str | None = None


class TeamInviteRequest(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.DEVELOPER_VIEWER
    phone_number: str
    state: str
