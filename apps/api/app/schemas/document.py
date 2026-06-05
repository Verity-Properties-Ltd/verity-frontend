from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ORMModel


class DocumentUploadRequest(BaseModel):
    property_id: str
    file_name: str
    file_type: str
    file_size: int


class PresignedURLResponse(BaseModel):
    document_id: str
    upload_url: str
    object_key: str


class DocumentConfirmResponse(BaseModel):
    document_id: str
    verification_job_id: str
    detail: str


class DocumentRead(ORMModel):
    id: str
    property_id: str
    uploaded_by_user_id: str
    file_name: str
    file_type: str
    file_size: int
    s3_key: str
    upload_status: str
