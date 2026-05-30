from fastapi import APIRouter

from app.api.v1 import admin, auth, companies, documents, health, orders, properties, reports, users, verifications


api_v1_router = APIRouter()
api_v1_router.include_router(health.router, prefix="/health", tags=["system"])
api_v1_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_v1_router.include_router(users.router, prefix="/users", tags=["users"])
api_v1_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_v1_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_v1_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_v1_router.include_router(verifications.router, prefix="/verifications", tags=["verifications"])
api_v1_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_v1_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_v1_router.include_router(admin.router, prefix="/admin", tags=["admin"])
