from __future__ import annotations


async def score_risk(*_: object, **__: object) -> dict[str, str]:
    return {"risk_rating": "medium"}
