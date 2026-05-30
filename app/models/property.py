from __future__ import annotations

import sqlalchemy as sa
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import VerificationStatus, enum_values


class Property(TimestampMixin, Base):
    __tablename__ = "properties"

    company_id: Mapped[str] = mapped_column(ForeignKey("companies.id"), index=True)
    created_by_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    address: Mapped[str] = mapped_column(String(500))
    lga: Mapped[str] = mapped_column(String(120))
    state: Mapped[str] = mapped_column(String(120))
    property_type: Mapped[str] = mapped_column(String(50))
    title_type: Mapped[str] = mapped_column(String(100))
    verification_status: Mapped[VerificationStatus] = mapped_column(
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

    company = relationship("Company", back_populates="properties")
    documents = relationship("Document", back_populates="property")
    verification_jobs = relationship("VerificationJob", back_populates="property")
