# Verity Backend Agents

This backend is intentionally modular:
- `app/api/v1` contains HTTP contracts.
- `app/services` contains business logic.
- `app/workers` contains Redis-backed `arq` job handlers.
- `app/models` and `app/schemas` define persistence and API boundaries.
