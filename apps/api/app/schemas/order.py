from __future__ import annotations

from pydantic import BaseModel, EmailStr

from app.schemas.common import ORMModel


class OrderCreate(BaseModel):
    property_id: str | None = None
    buyer_name: str
    buyer_email: EmailStr
    property_address: str
    tier: str
    amount: int
    currency: str = "NGN"
    payment_provider: str = "paystack"


class OrderRead(ORMModel):
    id: str
    user_id: str | None
    property_id: str | None
    buyer_name: str
    buyer_email: EmailStr
    property_address: str
    tier: str
    amount: int
    currency: str
    payment_provider: str
    payment_reference: str
    status: str


class PaystackWebhookPayload(BaseModel):
    event: str
    data: dict


class FlutterwaveWebhookPayload(BaseModel):
    event: str
    data: dict
