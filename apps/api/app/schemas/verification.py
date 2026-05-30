from __future__ import annotations

from datetime import datetime

from app.models.enums import VerificationStatus
from app.schemas.common import ORMModel


class VerificationJobRead(ORMModel):
    id: str
    property_id: str | None
    order_id: str | None
    document_id: str | None
    analyst_id: str | None
    status: VerificationStatus
    extracted_data: dict | None
    confidence_summary: dict | None
    analyst_notes: str | None
    risk_rating: str | None
    dispatch_attempts: int
    last_dispatch_attempt_at: datetime | None
    queued_at: datetime | None
    last_dispatch_error: str | None
