from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.document import Document
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.document import DocumentConfirmResponse, DocumentRead, DocumentUploadRequest, PresignedURLResponse
from app.services.document_service import confirm_document_upload, create_upload_url


router = APIRouter()


@router.post("/upload-url", response_model=PresignedURLResponse)
async def get_upload_url(
    payload: DocumentUploadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> PresignedURLResponse:
    return await create_upload_url(db, current_user, payload)


@router.post("/{document_id}/confirm", response_model=DocumentConfirmResponse)
async def confirm_upload(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> DocumentConfirmResponse:
    return await confirm_document_upload(db, current_user, document_id)


@router.get("", response_model=PaginatedResponse[DocumentRead])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[DocumentRead]:
    result = await db.execute(select(Document).where(Document.uploaded_by_user_id == current_user.id).order_by(Document.created_at.desc()))
    items = result.scalars().all()
    return PaginatedResponse(items=[DocumentRead.model_validate(item) for item in items], total=len(items))
