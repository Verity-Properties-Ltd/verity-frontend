import pytest


async def _create_and_login(client):
    register = await client.post(
        "/api/v1/auth/register",
        json={
            "company_name": "Verity Estates",
            "cac_registration_number": "RC-654321",
            "contact_name": "Sheun Badmus",
            "email": "sheun@example.com",
            "phone_number": "08031111111",
            "state": "Lagos",
            "password": "supersecurepassword",
        },
    )
    otp_code = register.json()["otp_code"]
    await client.post("/api/v1/auth/verify-otp", json={"email": "sheun@example.com", "otp_code": otp_code})
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "sheun@example.com", "password": "supersecurepassword"},
    )
    return login.json()


@pytest.mark.asyncio
async def test_property_crud(client):
    login_payload = await _create_and_login(client)
    headers = {"Authorization": f"Bearer {login_payload['access_token']}"}

    created = await client.post(
        "/api/v1/properties",
        headers=headers,
        json={
            "name": "Plot 7",
            "address": "Lekki Phase 1",
            "lga": "Eti-Osa",
            "state": "Lagos",
            "property_type": "landed",
            "title_type": "certificate_of_occupancy",
        },
    )
    assert created.status_code == 200
    property_id = created.json()["id"]

    listed = await client.get("/api/v1/properties", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["total"] == 1

    patched = await client.patch(
        f"/api/v1/properties/{property_id}",
        headers=headers,
        json={"verification_status": "under_review"},
    )
    assert patched.status_code == 200
    assert patched.json()["verification_status"] == "under_review"
