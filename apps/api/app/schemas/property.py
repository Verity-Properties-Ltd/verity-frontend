from __future__ import annotations

from pydantic import BaseModel

from app.models.enums import VerificationStatus
from app.schemas.common import ORMModel


class PropertyCreate(BaseModel):
    name: str
    address: str
    lga: str
    state: str
    property_type: str
    title_type: str


class PropertyUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    lga: str | None = None
    state: str | None = None
    property_type: str | None = None
    title_type: str | None = None
    verification_status: VerificationStatus | None = None


class PropertyRead(ORMModel):
    id: str
    company_id: str
    created_by_user_id: str
    name: str
    address: str
    lga: str
    state: str
    property_type: str
    title_type: str
    verification_status: VerificationStatus


class PropertyFilter(BaseModel):
    property_type: str | None = None
    verification_status: VerificationStatus | None = None
    state: str | None = None
    lga: str | None = None
    search: str | None = None
