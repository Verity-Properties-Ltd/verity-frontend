from __future__ import annotations


async def compile_report(_: object, report_id: str) -> dict[str, str]:
    return {"report_id": report_id, "status": "compiled"}
