from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import update_user


router = APIRouter()


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
async def patch_me(
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserRead:
    updated = await update_user(db, current_user, payload)
    return UserRead.model_validate(updated)
