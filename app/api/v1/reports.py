from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.report import QRVerifyResponse, ReportDownloadResponse, ReportRead
from app.services.report_service import get_report_by_reference, get_report_download_link, get_report_for_user


router = APIRouter()


@router.get("/{report_id}", response_model=ReportRead)
async def get_report_endpoint(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReportRead:
    report = await get_report_for_user(db, report_id, current_user)
    return ReportRead.model_validate(report)


@router.get("/{report_id}/download", response_model=ReportDownloadResponse)
async def download_report(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReportDownloadResponse:
    report = await get_report_for_user(db, report_id, current_user)
    return ReportDownloadResponse(report_id=report.id, download_url=get_report_download_link(report))


@router.get("/verify/{reference_number}", response_model=QRVerifyResponse)
async def verify_report(reference_number: str, db: AsyncSession = Depends(get_db)) -> QRVerifyResponse:
    report = await get_report_by_reference(db, reference_number)
    return QRVerifyResponse(
        reference_number=report.reference_number,
        property_id=report.property_id,
        status=report.status,
        issued_at=report.issued_at,
    )
