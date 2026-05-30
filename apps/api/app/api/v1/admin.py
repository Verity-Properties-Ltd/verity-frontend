from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import require_roles
from app.models.document import Document
from app.models.enums import UserRole, VerificationStatus
from app.models.property import Property
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.document import DocumentRead
from app.schemas.verification import VerificationJobRead
from app.models.verification_job import VerificationJob
from app.services.verification_service import can_transition, reconcile_verification_dispatches


router = APIRouter()


@router.get("/properties/{property_id}/documents", response_model=PaginatedResponse[DocumentRead])
async def get_property_documents(
    property_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST)),
) -> PaginatedResponse[DocumentRead]:
    property_result = await db.execute(select(Property.id).where(Property.id == property_id))
    property_exists = property_result.scalar_one_or_none()
    if property_exists is None:
        raise NotFoundError("Property not found")

    result = await db.execute(
        select(Document)
        .where(Document.property_id == property_id)
        .order_by(Document.created_at.desc())
    )
    items = result.scalars().all()
    return PaginatedResponse(items=[DocumentRead.model_validate(item) for item in items], total=len(items))


@router.get("/queue", response_model=PaginatedResponse[VerificationJobRead])
async def get_admin_queue(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST)),
) -> PaginatedResponse[VerificationJobRead]:
    result = await db.execute(select(VerificationJob).order_by(VerificationJob.created_at.desc()))
    jobs = result.scalars().all()
    return PaginatedResponse(items=[VerificationJobRead.model_validate(job) for job in jobs], total=len(jobs))


@router.post("/queue/reconcile-dispatch", response_model=PaginatedResponse[VerificationJobRead])
async def reconcile_dispatch_queue(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST)),
) -> PaginatedResponse[VerificationJobRead]:
    jobs = await reconcile_verification_dispatches(db)
    return PaginatedResponse(items=[VerificationJobRead.model_validate(job) for job in jobs], total=len(jobs))


@router.post("/queue/{job_id}/approve", response_model=VerificationJobRead)
async def approve_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST)),
) -> VerificationJobRead:
    result = await db.execute(select(VerificationJob).where(VerificationJob.id == job_id))
    job = result.scalar_one_or_none()
    if job is None:
        raise NotFoundError("Verification job not found")
    if not can_transition(job.status, VerificationStatus.VERIFIED):
        raise ConflictError("Verification job cannot be approved from its current state")
    job.status = VerificationStatus.VERIFIED
    await db.commit()
    await db.refresh(job)
    return VerificationJobRead.model_validate(job)


@router.post("/queue/{job_id}/flag", response_model=VerificationJobRead)
async def flag_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST)),
) -> VerificationJobRead:
    result = await db.execute(select(VerificationJob).where(VerificationJob.id == job_id))
    job = result.scalar_one_or_none()
    if job is None:
        raise NotFoundError("Verification job not found")
    if not can_transition(job.status, VerificationStatus.FLAGGED):
        raise ConflictError("Verification job cannot be flagged from its current state")
    job.status = VerificationStatus.FLAGGED
    await db.commit()
    await db.refresh(job)
    return VerificationJobRead.model_validate(job)
