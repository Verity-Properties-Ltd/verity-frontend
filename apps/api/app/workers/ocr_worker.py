from __future__ import annotations


async def process_document(_: object, job_id: str) -> dict[str, str]:
    return {"job_id": job_id, "status": "processed"}
