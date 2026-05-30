from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.enums import UserRole
from app.models.property import Property
from app.models.report import Report
from app.models.user import User
from app.models.verification_job import VerificationJob
from app.services.storage_service import generate_report_download_url


async def get_report(db: AsyncSession, report_id: str) -> Report:
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if report is None:
        raise NotFoundError("Report not found")
    return report


async def get_report_for_user(db: AsyncSession, report_id: str, user: User) -> Report:
    if user.role in {UserRole.VERITY_ADMIN, UserRole.VERITY_ANALYST}:
        return await get_report(db, report_id)
    result = await db.execute(
        select(Report)
        .join(VerificationJob, Report.verification_job_id == VerificationJob.id)
        .join(Property, VerificationJob.property_id == Property.id)
        .where(Report.id == report_id, Property.company_id == user.company_id)
    )
    report = result.scalar_one_or_none()
    if report is None:
        raise NotFoundError("Report not found")
    return report


async def get_report_by_reference(db: AsyncSession, reference_number: str) -> Report:
    result = await db.execute(select(Report).where(Report.reference_number == reference_number))
    report = result.scalar_one_or_none()
    if report is None:
        raise NotFoundError("Report not found")
    return report


def get_report_download_link(report: Report) -> str:
    return generate_report_download_url(report.pdf_s3_key)
