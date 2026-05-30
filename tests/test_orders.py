import pytest
import hashlib
import hmac

from app.core.config import settings


@pytest.mark.asyncio
async def test_create_order(client):
    response = await client.post(
        "/api/v1/orders",
        json={
            "buyer_name": "Ada Buyer",
            "buyer_email": "ada@example.com",
            "property_address": "Yaba, Lagos",
            "tier": "standard",
            "amount": 25000,
            "currency": "NGN",
            "payment_provider": "paystack",
        },
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


@pytest.mark.asyncio
async def test_webhook_unknown_reference_returns_200(client):
    payload = b'{"data":{"reference":"unknown-ref"}}'
    signature = hmac.new(
        settings.paystack_webhook_secret.encode("utf-8"),
        payload,
        hashlib.sha512,
    ).hexdigest()
    response = await client.post(
        "/api/v1/orders/paystack/webhook",
        headers={"X-Paystack-Signature": signature},
        content=payload,
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_webhook_invalid_json_returns_400(client):
    payload = b'{"data":'
    signature = hmac.new(
        settings.paystack_webhook_secret.encode("utf-8"),
        payload,
        hashlib.sha512,
    ).hexdigest()
    response = await client.post(
        "/api/v1/orders/paystack/webhook",
        headers={"X-Paystack-Signature": signature},
        content=payload,
    )
    assert response.status_code == 400
