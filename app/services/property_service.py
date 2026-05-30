from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.property import Property
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyFilter, PropertyUpdate


async def create_property(db: AsyncSession, user: User, payload: PropertyCreate) -> Property:
    property_record = Property(company_id=user.company_id, created_by_user_id=user.id, **payload.model_dump())
    db.add(property_record)
    await db.commit()
    await db.refresh(property_record)
    return property_record


async def list_properties(db: AsyncSession, user: User, filters: PropertyFilter) -> tuple[list[Property], int]:
    query = select(Property).where(Property.company_id == user.company_id)
    count_query = select(func.count(Property.id)).where(Property.company_id == user.company_id)

    conditions = []
    if filters.property_type:
        conditions.append(Property.property_type == filters.property_type)
    if filters.verification_status:
        conditions.append(Property.verification_status == filters.verification_status)
    if filters.state:
        conditions.append(Property.state == filters.state)
    if filters.lga:
        conditions.append(Property.lga == filters.lga)
    if filters.search:
        conditions.append(or_(Property.name.ilike(f"%{filters.search}%"), Property.address.ilike(f"%{filters.search}%")))

    for condition in conditions:
        query = query.where(condition)
        count_query = count_query.where(condition)

    query = query.order_by(Property.created_at.desc())
    items = (await db.execute(query)).scalars().all()
    total = (await db.execute(count_query)).scalar_one()
    return items, total


async def get_property_for_company(db: AsyncSession, property_id: str, company_id: str) -> Property:
    result = await db.execute(select(Property).where(Property.id == property_id, Property.company_id == company_id))
    property_record = result.scalar_one_or_none()
    if property_record is None:
        raise NotFoundError("Property not found")
    return property_record


async def update_property(db: AsyncSession, property_record: Property, payload: PropertyUpdate) -> Property:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(property_record, field, value)
    await db.commit()
    await db.refresh(property_record)
    return property_record
