from __future__ import annotations

import logging
import time
from uuid import uuid4

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


logger = logging.getLogger("verity.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("x-request-id", str(uuid4()))
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            # Prevent unhandled exceptions from escaping BaseHTTPMiddleware as an
            # ExceptionGroup — if they did, they would propagate above the CORS layer
            # and the browser would see a connection abort with no CORS headers ("network error").
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.exception(
                "unhandled_exception",
                extra={
                    "request_id": request_id,
                    "path": request.url.path,
                    "method": request.method,
                    "latency_ms": duration_ms,
                },
            )
            response = JSONResponse(status_code=500, content={"detail": "Internal server error"})
        else:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
        response.headers["x-request-id"] = request_id
        logger.info(
            "request_completed",
            extra={
                "request_id": request_id,
                "path": request.url.path,
                "method": request.method,
                "status_code": response.status_code,
                "latency_ms": duration_ms,
            },
        )
        return response
