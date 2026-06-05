from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    property_id: Mapped[str] = mapped_column(ForeignKey("properties.id"), index=True)
    uploaded_by_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(50))
    file_size: Mapped[int] = mapped_column(Integer)
    s3_key: Mapped[str] = mapped_column(String(500), unique=True)
    upload_status: Mapped[str] = mapped_column(String(50), default="pending_upload")

    property = relationship("Property", back_populates="documents")
