from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.verification import VerificationJobRead
from app.services.verification_service import get_verification_job_for_user


router = APIRouter()


@router.get("/{job_id}", response_model=VerificationJobRead)
async def get_verification(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VerificationJobRead:
    job = await get_verification_job_for_user(db, job_id, current_user)
    return VerificationJobRead.model_validate(job)
