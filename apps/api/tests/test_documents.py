import pytest
from sqlalchemy import select

from app.models.verification_job import VerificationJob
from tests.test_properties import _create_and_login


@pytest.mark.asyncio
async def test_document_upload_url(client):
    login_payload = await _create_and_login(client)
    headers = {"Authorization": f"Bearer {login_payload['access_token']}"}
    property_response = await client.post(
        "/api/v1/properties",
        headers=headers,
        json={
            "name": "Block A",
            "address": "Ikoyi",
            "lga": "Eti-Osa",
            "state": "Lagos",
            "property_type": "apartment",
            "title_type": "deed_of_assignment",
        },
    )
    property_id = property_response.json()["id"]

    response = await client.post(
        "/api/v1/documents/upload-url",
        headers=headers,
        json={
            "property_id": property_id,
            "file_name": "title.pdf",
            "file_type": "application/pdf",
            "file_size": 1024,
        },
    )
    assert response.status_code == 200
    assert "upload_url" in response.json()

    confirm_response = await client.post(
        f"/api/v1/documents/{response.json()['document_id']}/confirm",
        headers=headers,
    )
    assert confirm_response.status_code == 200
    assert confirm_response.json()["detail"] == "Document confirmed and verification queued"


@pytest.mark.asyncio
async def test_document_confirm_is_idempotent(client, db_session):
    login_payload = await _create_and_login(client)
    headers = {"Authorization": f"Bearer {login_payload['access_token']}"}
    property_response = await client.post(
        "/api/v1/properties",
        headers=headers,
        json={
            "name": "Block B",
            "address": "Lekki",
            "lga": "Eti-Osa",
            "state": "Lagos",
            "property_type": "apartment",
            "title_type": "deed_of_assignment",
        },
    )
    property_id = property_response.json()["id"]

    response = await client.post(
        "/api/v1/documents/upload-url",
        headers=headers,
        json={
            "property_id": property_id,
            "file_name": "survey.pdf",
            "file_type": "application/pdf",
            "file_size": 2048,
        },
    )
    document_id = response.json()["document_id"]

    first_confirm = await client.post(f"/api/v1/documents/{document_id}/confirm", headers=headers)
    second_confirm = await client.post(f"/api/v1/documents/{document_id}/confirm", headers=headers)

    assert first_confirm.status_code == 200
    assert second_confirm.status_code == 200
    assert first_confirm.json()["verification_job_id"] == second_confirm.json()["verification_job_id"]

    job = (
        await db_session.execute(
            select(VerificationJob).where(VerificationJob.id == first_confirm.json()["verification_job_id"])
        )
    ).scalar_one()
    assert job.dispatch_attempts == 1
    assert job.queued_at is not None
