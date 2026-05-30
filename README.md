# verity-dashboard

Verity's product monorepo. Frontend (Next.js apps + design-system packages) and backend (FastAPI service) live here together.

The single source of truth for **what** to build is Notion — see `CLAUDE.md` for the four canonical doc URLs (PRD v2.1, UI/UX Architecture v1.3, Design System, Build Backlog). This README is just the map.

## Repo layout

```
apps/
├── landing/     verity.properties — single-page teaser (Next.js + Tailwind v4)
├── app/         app.verity.properties — buyer + developer + internal admin shell (Next.js 15)
├── public-page/ verity.properties/v/{VPID} — share-safe certificate (Next.js 15)
└── api/         FastAPI backend (Python 3.11) — vendored via git subtree

packages/
├── brand/       design tokens + jsx + logos — @verity/brand
├── fixtures/    shared fixture data — @verity/fixtures
├── reso/        RESO Data Dictionary v2.0 types + 774 NG LGAs — @verity/reso
└── storybook/   Storybook 8 for trust-critical primitives — @verity/storybook

docs/            design-system-standards.md + build-backlog-gap-analysis.md
```

## Dev scripts

Frontend (one terminal per app):

```sh
npm install
npm run dev:landing    # http://localhost:3000
npm run dev:app        # http://localhost:3001
npm run dev:public     # http://localhost:3002
npm run dev:storybook  # http://localhost:6006
```

Backend (one terminal — brings up FastAPI + Postgres + Redis + MongoDB + LocalStack):

```sh
npm run dev:api        # http://localhost:8001/api/v1/health
npm run logs:api       # tail api + worker logs
npm run test:api       # pytest in apps/api/
npm run dev:api:down   # tear it down
```

Frontend dev keeps working against mock services regardless of backend state — you don't need `dev:api` running unless you're wiring a real HTTP call.

## Build

```sh
npm run build:landing
npm run build:app
npm run build:public
npm run build:storybook
```

## Engineering conventions

See `CLAUDE.md` for: design-system rules (locked palette, banned patterns, domain primitives), voice model, mock-service seam pattern, backend layout, and the polyglot dev story.

Commit style: **Conventional Commits** (`type(scope): subject`). Branch from `main`, small semantic commits, PRs reviewed before merge.

## Issues + sprint planning

Active Sprint #1 (Wk 1-2 Foundation): https://github.com/Verity-Properties-Ltd/verity-dashboard/issues?q=label:sprint-01+is:open

Backlog (single source of truth): https://app.notion.com/p/102f472f1bd742308da6bec987bdadf6

Backend assignee: codakyello · Frontend assignee: Divineverity.
