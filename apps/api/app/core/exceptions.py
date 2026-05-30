from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings


class NotFoundError(HTTPException):
    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ConflictError(HTTPException):
    def __init__(self, detail: str = "Resource conflict") -> None:
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class UnauthorizedError(HTTPException):
    def __init__(self, detail: str = "Authentication required") -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class PermissionDeniedError(HTTPException):
    def __init__(self, detail: str = "Permission denied") -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class BadRequestError(HTTPException):
    def __init__(self, detail: str = "Bad request") -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ServiceUnavailableError(HTTPException):
    def __init__(self, detail: str = "Service temporarily unavailable") -> None:
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail)


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Convert Pydantic RequestValidationError into a consistent, frontend-readable format."""
    errors: list[dict[str, str]] = []
    for error in exc.errors():
        # Strip location prefixes like "body", "query", "path" — keep only the field name
        loc_parts = [str(part) for part in error["loc"] if part not in ("body", "query", "path", "header")]
        field = ".".join(loc_parts) if loc_parts else "request"
        msg: str = error["msg"]
        # Pydantic v2 prefixes like "Value error, " or "String should have at least..."
        msg = msg.removeprefix("Value error, ")
        errors.append({"field": field, "message": msg})

    # Surface a single top-level detail string so the frontend always has something to display
    detail = errors[0]["message"] if len(errors) == 1 else "Validation failed. Check the errors field for details."
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": detail, "errors": errors},
    )


async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None) or {},
    )


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    content: dict[str, str] = {"detail": "Internal server error"}
    if settings.app_env != "production":
        content["error"] = type(exc).__name__
    return JSONResponse(status_code=500, content=content)


def register_exception_handlers(app: FastAPI) -> None:
    # Order matters: more specific types must be registered before broader ones
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
