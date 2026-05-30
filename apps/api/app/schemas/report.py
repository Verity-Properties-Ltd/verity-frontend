from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import ORMModel


class ReportRead(ORMModel):
    id: str
    property_id: str
    verification_job_id: str
    order_id: str | None
    reference_number: str
    status: str
    tier: str
    pdf_s3_key: str
    public_verification_slug: str
    executive_summary: str
    issued_at: datetime | None


class ReportDownloadResponse(BaseModel):
    report_id: str
    download_url: str


class QRVerifyResponse(BaseModel):
    reference_number: str
    property_id: str
    status: str
    issued_at: datetime | None
