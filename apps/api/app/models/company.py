from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Company(TimestampMixin, Base):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(255))
    cac_registration_number: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    contact_name: Mapped[str] = mapped_column(String(255))
    contact_email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    contact_phone: Mapped[str] = mapped_column(String(50))
    state: Mapped[str] = mapped_column(String(100))
    billing_plan: Mapped[str] = mapped_column(String(50), default="starter")
    billing_cycle: Mapped[str] = mapped_column(String(50), default="monthly")

    users = relationship("User", back_populates="company")
    properties = relationship("Property", back_populates="company")
