from __future__ import annotations

from secrets import token_hex

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.models.enums import VerificationStatus
from app.models.order import Order
from app.models.verification_job import VerificationJob
from app.schemas.order import OrderCreate
from app.services.verification_service import create_verification_job, ensure_verification_job_dispatched


async def create_order(db: AsyncSession, payload: OrderCreate) -> Order:
    order = Order(**payload.model_dump(), payment_reference=f"vrt_{token_hex(8)}")
    db.add(order)
    try:
        await db.commit()
        await db.refresh(order)
    except IntegrityError as exc:
        await db.rollback()
        raise ConflictError("Order creation conflicted with an existing payment reference") from exc
    return order


async def mark_order_paid(db: AsyncSession, payment_reference: str) -> Order:
    result = await db.execute(select(Order).where(Order.payment_reference == payment_reference))
    order = result.scalar_one_or_none()
    if order is None:
        raise NotFoundError("Order not found")
    order.status = "paid"
    await db.commit()
    await db.refresh(order)
    return order


async def fulfill_paid_order(db: AsyncSession, payment_reference: str) -> Order:
    order = await mark_order_paid(db, payment_reference)
    if order.property_id:
        existing_job_result = await db.execute(
            select(VerificationJob).where(
                VerificationJob.property_id == order.property_id,
                VerificationJob.status.in_(
                    [
                        VerificationStatus.UPLOADED,
                        VerificationStatus.UNDER_REVIEW,
                        VerificationStatus.AI_PROCESSING,
                        VerificationStatus.ANALYST_REVIEW,
                    ]
                ),
            )
        )
        existing_job = existing_job_result.scalar_one_or_none()
        if existing_job is None:
            await create_verification_job(db, order.property_id)
        elif existing_job.queued_at is None:
            await ensure_verification_job_dispatched(db, existing_job)
        order.status = "processing"
        await db.commit()
        await db.refresh(order)
    else:
        # Guest buyer orders without a linked developer property still need to
        # surface in the analyst queue so ops can request or attach documents.
        existing_job_result = await db.execute(
            select(VerificationJob).where(VerificationJob.order_id == order.id)
        )
        existing_job = existing_job_result.scalar_one_or_none()
        if existing_job is None:
            await create_verification_job(db, order_id=order.id)
        elif existing_job.queued_at is None:
            await ensure_verification_job_dispatched(db, existing_job)
        order.status = "processing"
        await db.commit()
        await db.refresh(order)
    return order
