from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.company import CompanyRead, CompanyUpdate, TeamInviteRequest
from app.schemas.user import UserRead
from app.services.company_service import get_company_for_user, invite_team_member, update_company


router = APIRouter()


@router.get("/me", response_model=CompanyRead)
async def get_company(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CompanyRead:
    company = await get_company_for_user(db, current_user.company_id)
    return CompanyRead.model_validate(company)


@router.patch("/me", response_model=CompanyRead)
async def patch_company(
    payload: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> CompanyRead:
    company = await get_company_for_user(db, current_user.company_id)
    updated = await update_company(db, company, payload)
    return CompanyRead.model_validate(updated)


@router.post("/invite", response_model=UserRead)
async def invite_member(
    payload: TeamInviteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> UserRead:
    company = await get_company_for_user(db, current_user.company_id)
    invited = await invite_team_member(db, company, payload)
    return UserRead.model_validate(invited)
