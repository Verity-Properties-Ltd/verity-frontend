from __future__ import annotations


async def dispatch_email(_: object, payload: dict) -> dict[str, str]:
    return {"status": "queued", "message_type": payload.get("message_type", "generic")}
