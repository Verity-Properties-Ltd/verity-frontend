# apps/api — Verity backend (FastAPI)

Backend service for the Verity verification platform. Lives in this monorepo (`apps/api/`), vendored via `git subtree` from [Verity-Properties-Ltd/verity-backend](https://github.com/Verity-Properties-Ltd/verity-backend).

**Full API + architecture reference: see [`SYSTEM_OVERVIEW.md`](./SYSTEM_OVERVIEW.md)** — that's the canonical doc for endpoints, data models, services, workers, and integrations. This README is just the quick-start.

## Stack

- FastAPI · Python 3.11
- SQLAlchemy + Alembic (Postgres 15)
- Redis 7 (sessions + `arq` worker queue)
- MongoDB 7 (variable-shape document metadata)
- S3 (LocalStack for dev)
- JWT (RS256) + bcrypt
- Docker Compose

Per FND-01 (PRD §7.1) — Option A FastAPI/Python is the chosen backend stack.

## Run locally

From the **repo root** (preferred — uses the root scripts that handle the cd):

```sh
npm run dev:api        # docker compose up
npm run logs:api       # tail api + worker
npm run test:api       # pytest
npm run dev:api:down   # docker compose down
```

Or from this directory directly:

```sh
docker compose up                              # full stack on :8001
pip install -r requirements-dev.txt && pytest  # tests
```

Then:
```sh
curl http://localhost:8001/api/v1/health
# {"status":"ok","checks":{"database":"ok","redis":"ok","mongodb":"ok"}}
```

## Running tests

```sh
pip install -r requirements-dev.txt
pytest                          # all tests
pytest tests/test_auth.py -v    # one file, verbose
```

Tests are async (`pytest-asyncio`) and bootstrap via `tests/conftest.py`.

## Folder map

```
app/
├── main.py             FastAPI app entry — middleware + /api/v1 router
├── api/v1/             versioned route handlers (auth, users, companies,
│                       properties, documents, orders, reports, verifications,
│                       admin, health)
├── services/           business-logic layer — routes stay thin
├── models/             SQLAlchemy models
├── schemas/            Pydantic request / response (API contract)
├── core/               config, db, security, redis, mongo, session store
├── middleware/         logging, rate_limit
└── workers/            arq workers (OCR, report compilation, email)

alembic/                Postgres migrations
tests/                  async API tests
docker-compose.yml      local stack (api, worker, postgres, redis, mongo, localstack)
Dockerfile              Python 3.11 + image deps for PDF generation (cairo, pango)
SYSTEM_OVERVIEW.md      comprehensive arch + endpoint reference
AWS_STAGING_DEPLOYMENT.md
```

## Upstream sync

When the standalone `verity-backend` repo ships changes that need to flow here:

```sh
# from repo root
git subtree pull --prefix=apps/api https://github.com/Verity-Properties-Ltd/verity-backend.git main --squash
```

Or treat this directory as canonical and let `verity-backend` be the eventual mirror. The team can decide as the standalone repo ages out.

## Issues to know

Active: FND-01 (#9), FND-04 (#12), FND-07 (#15), FND-03 (#11) — see https://github.com/Verity-Properties-Ltd/verity-dashboard/issues?q=label:foundation+is:open
