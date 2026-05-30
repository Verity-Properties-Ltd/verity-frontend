from __future__ import annotations

from datetime import datetime

import sqlalchemy as sa
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import VerificationStatus, enum_values


class VerificationJob(TimestampMixin, Base):
    __tablename__ = "verification_jobs"

    property_id: Mapped[str | None] = mapped_column(ForeignKey("properties.id"), nullable=True, index=True)
    order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id"), nullable=True, index=True)
    document_id: Mapped[str | None] = mapped_column(ForeignKey("documents.id"), nullable=True, index=True)
    analyst_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    status: Mapped[VerificationStatus] = mapped_column(
        sa.Enum(
            VerificationStatus,
            name="verification_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        default=VerificationStatus.UPLOADED,
    )
    extracted_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    confidence_summary: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    analyst_notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    risk_rating: Mapped[str | None] = mapped_column(String(50), nullable=True)
    dispatch_attempts: Mapped[int] = mapped_column(Integer, default=0)
    last_dispatch_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    queued_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_dispatch_error: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    property = relationship("Property", back_populates="verification_jobs")
    order = relationship("Order")
    document = relationship("Document")
