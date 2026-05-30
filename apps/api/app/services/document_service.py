from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.document import Document
from app.models.property import Property
from app.models.user import User
from app.models.verification_job import VerificationJob
from app.schemas.document import DocumentConfirmResponse, DocumentUploadRequest, PresignedURLResponse
from app.services.storage_service import build_document_s3_key, generate_upload_url
from app.services.verification_service import create_verification_job, ensure_verification_job_dispatched


async def create_upload_url(db: AsyncSession, user: User, payload: DocumentUploadRequest) -> PresignedURLResponse:
    property_result = await db.execute(
        select(Property).where(Property.id == payload.property_id, Property.company_id == user.company_id)
    )
    property_record = property_result.scalar_one_or_none()
    if property_record is None:
        raise NotFoundError("Property not found")
    object_key = build_document_s3_key(payload.property_id, payload.file_name)
    upload_url = generate_upload_url(object_key, payload.file_type)
    document = Document(
        property_id=payload.property_id,
        uploaded_by_user_id=user.id,
        file_name=payload.file_name,
        file_type=payload.file_type,
        file_size=payload.file_size,
        s3_key=object_key,
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return PresignedURLResponse(document_id=document.id, upload_url=upload_url, object_key=object_key)


async def confirm_document_upload(db: AsyncSession, user: User, document_id: str) -> DocumentConfirmResponse:
    result = await db.execute(
        select(Document)
        .join(Property, Document.property_id == Property.id)
        .where(Document.id == document_id, Property.company_id == user.company_id)
    )
    document = result.scalar_one_or_none()
    if document is None:
        raise NotFoundError("Document not found")
    existing_job_result = await db.execute(select(VerificationJob).where(VerificationJob.document_id == document.id))
    existing_job = existing_job_result.scalar_one_or_none()

    if document.upload_status == "uploaded":
        if existing_job is None:
            verification_job = await create_verification_job(db, property_id=document.property_id, document_id=document.id)
        else:
            verification_job = existing_job
            if verification_job.queued_at is None:
                verification_job = await ensure_verification_job_dispatched(db, verification_job)
        return DocumentConfirmResponse(
            document_id=document.id,
            verification_job_id=verification_job.id,
            detail="Document already confirmed and verification is tracked",
        )

    document.upload_status = "uploaded"
    await db.commit()
    await db.refresh(document)

    if existing_job is None:
        verification_job = await create_verification_job(db, property_id=document.property_id, document_id=document.id)
    else:
        verification_job = existing_job
        if verification_job.queued_at is None:
            verification_job = await ensure_verification_job_dispatched(db, verification_job)
    return DocumentConfirmResponse(
        document_id=document.id,
        verification_job_id=verification_job.id,
        detail="Document confirmed and verification queued",
    )
