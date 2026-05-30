from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from arq.connections import create_pool
from redis.exceptions import RedisError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import NotFoundError, ServiceUnavailableError
from app.models.property import Property
from app.models.enums import UserRole, VerificationStatus
from app.models.user import User
from app.models.verification_job import VerificationJob
from app.workers.queue import build_redis_settings


logger = logging.getLogger("verity.verification")

ALLOWED_VERIFICATION_TRANSITIONS: dict[VerificationStatus, set[VerificationStatus]] = {
    VerificationStatus.UPLOADED: {VerificationStatus.UNDER_REVIEW, VerificationStatus.FLAGGED},
    VerificationStatus.UNDER_REVIEW: {VerificationStatus.AI_PROCESSING, VerificationStatus.FLAGGED},
    VerificationStatus.AI_PROCESSING: {VerificationStatus.ANALYST_REVIEW, VerificationStatus.FLAGGED},
    VerificationStatus.ANALYST_REVIEW: {VerificationStatus.VERIFIED, VerificationStatus.FLAGGED},
    VerificationStatus.VERIFIED: set(),
    VerificationStatus.FLAGGED: set(),
}

DISPATCHABLE_STATUSES: set[VerificationStatus] = {
    VerificationStatus.UPLOADED,
    VerificationStatus.UNDER_REVIEW,
    VerificationStatus.AI_PROCESSING,
    VerificationStatus.ANALYST_REVIEW,
}


async def get_verification_job(db: AsyncSession, job_id: str) -> VerificationJob:
    result = await db.execute(select(VerificationJob).where(VerificationJob.id == job_id))
    job = result.scalar_one_or_none()
    if job is None:
        raise NotFoundError("Verification job not found")
    return job


def can_transition(current_status: VerificationStatus, next_status: VerificationStatus) -> bool:
    return next_status in ALLOWED_VERIFICATION_TRANSITIONS[current_status]


async def enqueue_verification_job(job_id: str) -> None:
    if settings.app_env == "test":
        return
    redis = await create_pool(build_redis_settings())
    try:
        await redis.enqueue_job("process_document", job_id)
    finally:
        await redis.aclose()


async def ensure_verification_job_dispatched(db: AsyncSession, job: VerificationJob) -> VerificationJob:
    dispatch_time = datetime.now(UTC)
    job.dispatch_attempts += 1
    job.last_dispatch_attempt_at = dispatch_time
    try:
        await enqueue_verification_job(job.id)
    except (RedisError, OSError, TimeoutError) as exc:
        logger.exception("verification_dispatch_failed", extra={"job_id": job.id})
        job.last_dispatch_error = str(exc)[:1000]
        await db.commit()
        await db.refresh(job)
        raise ServiceUnavailableError(
            "Verification job was created but dispatch is temporarily unavailable. Retry will be required."
        ) from exc

    job.queued_at = dispatch_time
    job.last_dispatch_error = None
    await db.commit()
    await db.refresh(job)
    return job


async def reconcile_verification_dispatches(
    db: AsyncSession,
    *,
    older_than_minutes: int = 5,
    limit: int = 50,
) -> list[VerificationJob]:
    cutoff = datetime.now(UTC) - timedelta(minutes=older_than_minutes)
    result = await db.execute(
        select(VerificationJob)
        .where(
            VerificationJob.queued_at.is_(None),
            VerificationJob.status.in_(list(DISPATCHABLE_STATUSES)),
            (VerificationJob.last_dispatch_attempt_at.is_(None))
            | (VerificationJob.last_dispatch_attempt_at <= cutoff),
        )
        .order_by(VerificationJob.created_at.asc())
        .limit(limit)
    )
    jobs = result.scalars().all()
    requeued: list[VerificationJob] = []
    for job in jobs:
        try:
            requeued.append(await ensure_verification_job_dispatched(db, job))
        except ServiceUnavailableError:
            break
    return requeued


async def create_verification_job(
    db: AsyncSession,
    property_id: str | None = None,
    order_id: str | None = None,
    document_id: str | None = None,
    initial_status: VerificationStatus = VerificationStatus.UPLOADED,
) -> VerificationJob:
    job = VerificationJob(property_id=property_id, order_id=order_id, document_id=document_id, status=initial_status)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return await ensure_verification_job_dispatched(db, job)


async def get_verification_job_for_user(db: AsyncSession, job_id: str, user: User) -> VerificationJob:
    if user.role in {UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST}:
        return await get_verification_job(db, job_id)
    result = await db.execute(
        select(VerificationJob)
        .join(Property, VerificationJob.property_id == Property.id)
        .where(VerificationJob.id == job_id, Property.company_id == user.company_id)
    )
    job = result.scalar_one_or_none()
    if job is None:
        raise NotFoundError("Verification job not found")
    return job
