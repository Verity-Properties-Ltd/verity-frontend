from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Report(TimestampMixin, Base):
    __tablename__ = "reports"

    property_id: Mapped[str] = mapped_column(ForeignKey("properties.id"), index=True)
    verification_job_id: Mapped[str] = mapped_column(ForeignKey("verification_jobs.id"), index=True)
    order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id"), nullable=True, index=True)
    reference_number: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="generated")
    tier: Mapped[str] = mapped_column(String(50), default="standard")
    pdf_s3_key: Mapped[str] = mapped_column(String(500))
    public_verification_slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    executive_summary: Mapped[str] = mapped_column(String(1000), default="")
    issued_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    verification_job = relationship("VerificationJob")
