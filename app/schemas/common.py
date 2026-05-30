from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict


SchemaType = TypeVar("SchemaType")


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PaginatedResponse(ORMModel, Generic[SchemaType]):
    items: list[SchemaType]
    total: int


class MessageResponse(ORMModel):
    detail: str
    timestamp: datetime | None = None
