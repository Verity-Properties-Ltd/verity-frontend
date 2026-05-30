from __future__ import annotations

import hashlib
import hmac
import json
import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import BadRequestError, NotFoundError
from app.schemas.common import MessageResponse
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import create_order, fulfill_paid_order


router = APIRouter()
logger = logging.getLogger("verity.webhooks")


@router.post("", response_model=OrderRead)
async def create_order_endpoint(payload: OrderCreate, db: AsyncSession = Depends(get_db)) -> OrderRead:
    order = await create_order(db, payload)
    return OrderRead.model_validate(order)


def _validate_paystack_signature(raw_body: bytes, provided_signature: str | None, secret: str) -> None:
    if not secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Webhook secret not configured")
    if not provided_signature:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing webhook signature")
    computed_signature = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha512).hexdigest()
    if not hmac.compare_digest(computed_signature, provided_signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature")


def _validate_flutterwave_signature(provided_signature: str | None, secret: str) -> None:
    if not secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Webhook secret not configured")
    if not provided_signature:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing webhook signature")
    if not hmac.compare_digest(provided_signature, secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature")


def _parse_webhook_payload(raw_body: bytes) -> dict:
    try:
        return json.loads(raw_body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise BadRequestError("Invalid webhook payload") from exc


@router.post("/paystack/webhook", response_model=MessageResponse)
async def paystack_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_paystack_signature: str | None = Header(default=None),
) -> MessageResponse:
    raw_body = await request.body()
    _validate_paystack_signature(raw_body, x_paystack_signature, settings.paystack_webhook_secret)
    payload = _parse_webhook_payload(raw_body)
    payment_reference = payload.get("data", {}).get("reference")
    if payment_reference:
        try:
            await fulfill_paid_order(db, payment_reference)
        except NotFoundError:
            logger.warning("unknown_paystack_reference", extra={"payment_reference": payment_reference})
    return MessageResponse(detail="Paystack webhook processed")


@router.post("/flutterwave/webhook", response_model=MessageResponse)
async def flutterwave_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    verif_hash: str | None = Header(default=None),
) -> MessageResponse:
    raw_body = await request.body()
    _validate_flutterwave_signature(verif_hash, settings.flutterwave_webhook_secret)
    payload = _parse_webhook_payload(raw_body)
    payment_reference = payload.get("data", {}).get("tx_ref")
    if payment_reference:
        try:
            await fulfill_paid_order(db, payment_reference)
        except NotFoundError:
            logger.warning("unknown_flutterwave_reference", extra={"payment_reference": payment_reference})
    return MessageResponse(detail="Flutterwave webhook processed")
