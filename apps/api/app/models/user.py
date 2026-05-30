from __future__ import annotations

from datetime import datetime

import sqlalchemy as sa
from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import UserRole, enum_values


class User(TimestampMixin, Base):
    __tablename__ = "users"

    company_id: Mapped[str | None] = mapped_column(ForeignKey("companies.id"), nullable=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    phone_number: Mapped[str] = mapped_column(String(50))
    state: Mapped[str] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(
        sa.Enum(
            UserRole,
            name="user_role",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        default=UserRole.DEVELOPER_ADMIN,
    )
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    otp_code: Mapped[str | None] = mapped_column(String(10), nullable=True)
    otp_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    company = relationship("Company", back_populates="users")
