from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.property import PropertyCreate, PropertyFilter, PropertyRead, PropertyUpdate
from app.services.property_service import create_property, get_property_for_company, list_properties, update_property


router = APIRouter()


@router.post("", response_model=PropertyRead)
async def create_property_endpoint(
    payload: PropertyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> PropertyRead:
    property_record = await create_property(db, current_user, payload)
    return PropertyRead.model_validate(property_record)


@router.get("", response_model=PaginatedResponse[PropertyRead])
async def list_properties_endpoint(
    property_type: str | None = Query(default=None),
    verification_status: str | None = Query(default=None),
    state: str | None = Query(default=None),
    lga: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[PropertyRead]:
    items, total = await list_properties(
        db,
        current_user,
        PropertyFilter(
            property_type=property_type,
            verification_status=verification_status,
            state=state,
            lga=lga,
            search=search,
        ),
    )
    return PaginatedResponse(items=[PropertyRead.model_validate(item) for item in items], total=total)


@router.get("/{property_id}", response_model=PropertyRead)
async def get_property_endpoint(
    property_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PropertyRead:
    property_record = await get_property_for_company(db, property_id, current_user.company_id)
    return PropertyRead.model_validate(property_record)


@router.patch("/{property_id}", response_model=PropertyRead)
async def patch_property(
    property_id: str,
    payload: PropertyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.DEVELOPER_ADMIN)),
) -> PropertyRead:
    property_record = await get_property_for_company(db, property_id, current_user.company_id)
    updated = await update_property(db, property_record, payload)
    return PropertyRead.model_validate(updated)
