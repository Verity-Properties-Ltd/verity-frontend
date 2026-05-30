import pytest
from sqlalchemy import select

from app.models.enums import VerificationStatus
from app.models.verification_job import VerificationJob
from tests.test_properties import _create_and_login


@pytest.mark.asyncio
async def test_get_verification_job(client, db_session):
    login_payload = await _create_and_login(client)
    headers = {"Authorization": f"Bearer {login_payload['access_token']}"}
    property_response = await client.post(
        "/api/v1/properties",
        headers=headers,
        json={
            "name": "Lot 12",
            "address": "Ajah",
            "lga": "Eti-Osa",
            "state": "Lagos",
            "property_type": "landed",
            "title_type": "survey_plan",
        },
    )
    property_id = property_response.json()["id"]

    job = VerificationJob(property_id=property_id, status=VerificationStatus.AI_PROCESSING)
    db_session.add(job)
    await db_session.commit()

    created_job = (await db_session.execute(select(VerificationJob))).scalar_one()
    response = await client.get(f"/api/v1/verifications/{created_job.id}")
    assert response.status_code == 200
    assert response.json()["status"] == "ai_processing"


@pytest.mark.asyncio
async def test_admin_queue_requires_auth(client):
    response = await client.get("/api/v1/admin/queue")
    assert response.status_code == 401
