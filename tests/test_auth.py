import pytest
import bcrypt

from app.core.config import settings
from app.core.security import hash_password, verify_password


@pytest.mark.asyncio
async def test_register_verify_and_login(client):
    register_response = await client.post(
        "/api/v1/auth/register",
        json={
            "company_name": "Verity Estates",
            "cac_registration_number": "RC-123456",
            "contact_name": "Ladi Awolaja",
            "email": "ladi@example.com",
            "phone_number": "08030000000",
            "state": "Lagos",
            "password": "supersecurepassword",
        },
    )
    assert register_response.status_code == 200
    otp_code = register_response.json()["otp_code"]

    verify_response = await client.post(
        "/api/v1/auth/verify-otp",
        json={"email": "ladi@example.com", "otp_code": otp_code},
    )
    assert verify_response.status_code == 200

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "ladi@example.com", "password": "supersecurepassword"},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    assert "refresh_token" in login_response.json()


@pytest.mark.asyncio
async def test_refresh_rotation_and_logout(client):
    register_response = await client.post(
        "/api/v1/auth/register",
        json={
            "company_name": "Verity Estates",
            "cac_registration_number": "RC-987654",
            "contact_name": "Ola Admin",
            "email": "ola@example.com",
            "phone_number": "08032222222",
            "state": "Lagos",
            "password": "supersecurepassword",
        },
    )
    otp_code = register_response.json()["otp_code"]
    await client.post("/api/v1/auth/verify-otp", json={"email": "ola@example.com", "otp_code": otp_code})
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "ola@example.com", "password": "supersecurepassword"},
    )
    refresh_token = login_response.json()["refresh_token"]

    refreshed = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refreshed.status_code == 200
    rotated_refresh_token = refreshed.json()["refresh_token"]
    assert rotated_refresh_token != refresh_token

    logout_response = await client.post("/api/v1/auth/logout", json={"refresh_token": rotated_refresh_token})
    assert logout_response.status_code == 200

    stale_refresh = await client.post("/api/v1/auth/refresh", json={"refresh_token": rotated_refresh_token})
    assert stale_refresh.status_code == 403


def test_password_hashing_supports_long_passwords():
    password = "a" * 100

    hashed_password = hash_password(password)

    assert hashed_password.startswith("bcrypt_sha256$")
    assert verify_password(password, hashed_password) is True
    assert verify_password("wrong-password", hashed_password) is False


def test_password_verification_supports_existing_bcrypt_hashes():
    password = "supersecurepassword"
    legacy_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    assert verify_password(password, legacy_hash) is True
    assert verify_password("wrong-password", legacy_hash) is False


@pytest.mark.asyncio
async def test_register_and_login_without_otp_when_verification_disabled(client, monkeypatch):
    monkeypatch.setattr(settings, "auth_require_email_verification", False)

    register_response = await client.post(
        "/api/v1/auth/register",
        json={
            "company_name": "Verity Staging",
            "cac_registration_number": "RC-333222",
            "contact_name": "Stage Admin",
            "email": "stage@example.com",
            "phone_number": "08034444444",
            "state": "Lagos",
            "password": "supersecurepassword",
        },
    )
    assert register_response.status_code == 200
    register_payload = register_response.json()
    assert register_payload["email_verification_required"] is False
    assert register_payload["otp_code"] is None

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "stage@example.com", "password": "supersecurepassword"},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    assert "refresh_token" in login_response.json()
