from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    property_id: Mapped[str | None] = mapped_column(ForeignKey("properties.id"), nullable=True, index=True)
    buyer_name: Mapped[str] = mapped_column(String(255))
    buyer_email: Mapped[str] = mapped_column(String(255), index=True)
    property_address: Mapped[str] = mapped_column(String(500))
    tier: Mapped[str] = mapped_column(String(50))
    amount: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(10), default="NGN")
    payment_provider: Mapped[str] = mapped_column(String(50))
    payment_reference: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
