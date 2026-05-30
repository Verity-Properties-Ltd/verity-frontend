from __future__ import annotations

from secrets import token_hex

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import hash_password
from app.models.company import Company
from app.models.user import User
from app.schemas.company import CompanyUpdate, TeamInviteRequest


async def get_company_for_user(db: AsyncSession, company_id: str | None) -> Company:
    if company_id is None:
        raise NotFoundError("Company not found")
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if company is None:
        raise NotFoundError("Company not found")
    return company


async def update_company(db: AsyncSession, company: Company, payload: CompanyUpdate) -> Company:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    try:
        await db.commit()
        await db.refresh(company)
    except IntegrityError as exc:
        await db.rollback()
        raise ConflictError("Company profile conflicts with an existing record") from exc
    return company


async def invite_team_member(db: AsyncSession, company: Company, payload: TeamInviteRequest) -> User:
    user = User(
        company_id=company.id,
        email=payload.email,
        full_name=payload.full_name,
        phone_number=payload.phone_number,
        state=payload.state,
        role=payload.role,
        password_hash=hash_password(token_hex(8)),
    )
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as exc:
        await db.rollback()
        raise ConflictError("A user with this email already exists") from exc
    return user
