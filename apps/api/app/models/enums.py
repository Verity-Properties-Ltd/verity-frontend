from __future__ import annotations

from enum import StrEnum


class UserRole(StrEnum):
    DEVELOPER_ADMIN = "developer_admin"
    DEVELOPER_VIEWER = "developer_viewer"
    BUYER = "buyer"
    VERITY_ADMIN = "verity_admin"
    VERITY_ANALYST = "verity_analyst"


class VerificationStatus(StrEnum):
    UPLOADED = "uploaded"
    UNDER_REVIEW = "under_review"
    AI_PROCESSING = "ai_processing"
    ANALYST_REVIEW = "analyst_review"
    VERIFIED = "verified"
    FLAGGED = "flagged"


def enum_values(enum_class: type[StrEnum]) -> list[str]:
    return [item.value for item in enum_class]
