# Cross-repo enforcement — Conventional Commits + branch protection + release automation on verity-frontend + verity-backend

## Context

The team is reversing the monorepo consolidation: `verity-backend` (Python/FastAPI) goes back to its own GitHub repo, separate from `verity-frontend` (Node frontend). Both repos need identical engineering hygiene — Conventional Commits, branch protection, automated changelog, CI gates — but they're different stacks (Node vs Python) and different repos.

The cleanest way to enforce identical rules across two repos without copy-paste drift is **three layers**:

1. **Org-level GitHub Ruleset** for branch protection (single source of truth across both repos).
2. **`Verity-Properties-Ltd/.github` repo** for shared reusable workflows + default PR template + CONTRIBUTING.md (community-health files auto-inherit to every other org repo).
3. **Per-repo configs** for stack-specific tooling (husky+commitlint for Node; gitlint for Python; release-please per repo).

Both repos are currently clean slates — zero workflows, zero hooks, no org rulesets. No baggage to undo. The actual monorepo-reversal work (deleting `apps/api/` from `verity-frontend`, updating CLAUDE.md, reconciling FND-* Notion stories) is **out of scope here** — this plan is enforcement-only and stands on its own regardless of the eventual reversal mechanics.

**Decisions captured:**
- Backend commit-msg tool: **gitlint** (Python-native, single-purpose; `contrib-title-conventional-commits` rule).
- Notion tracking: **defer** until the broader two-repo doc reversal lands. Track in GitHub only for now.

## Prerequisites

1. **Refresh `gh` auth token to include `admin:org` scope.** Current scopes are `gist, read:org, repo, workflow` — missing `admin:org` needed for org rulesets. User runs in their own terminal:
   ```
   gh auth refresh -h github.com -s admin:org
   ```
   Until this lands, **Step 3 (ruleset creation) is blocked**. Steps 1, 2, 4, 5, 6 can proceed without it.

2. **Verify GitHub org plan tier.** Org rulesets work on public repos at all tiers; on private repos (verity-backend) they require GitHub Team or higher. If the org is on Free, branch protection for verity-backend falls back to per-repo settings applied via `gh api PUT /repos/.../branches/main/protection` (identical JSON body for both repos).

## Approach — 6 steps

### Step 1 — Create `Verity-Properties-Ltd/.github` org repo

**Public visibility** (required for community-health files to inherit to private repos like verity-backend; reusable workflows in public org repos can be called from any repo in the org).

Bootstrap with:
- `README.md` — short org landing description
- `profile/README.md` — optional public org profile page

Skeleton files (filled in Step 2):
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CONTRIBUTING.md`
- `.github/CODEOWNERS` (org-wide fallback)
- `.github/workflows/conventional-commits.yml` (reusable)
- `.github/workflows/dep-audit.yml` (reusable, stretch goal)

Create via `gh repo create Verity-Properties-Ltd/.github --public --description "Org defaults: PR template, CONTRIBUTING, reusable workflows" --add-readme`, then push the skeleton files.

### Step 2 — Populate `.github` with shared workflows + community-health files

#### `.github/workflows/conventional-commits.yml` — reusable workflow

```yaml
name: Conventional Commits check
on:
  workflow_call:
    inputs:
      runtime:
        type: string
        required: true
        description: 'node | python — picks commitlint or gitlint'
      base-ref:
        type: string
        default: 'origin/main'

jobs:
  conventional-commits:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Set up Node (if runtime=node)
        if: inputs.runtime == 'node'
        uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Set up Python (if runtime=python)
        if: inputs.runtime == 'python'
        uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - name: Lint commits — Node
        if: inputs.runtime == 'node'
        run: |
          npm i -D @commitlint/cli @commitlint/config-conventional
          npx commitlint --from ${{ inputs.base-ref }} --to HEAD --verbose
      - name: Lint commits — Python
        if: inputs.runtime == 'python'
        run: |
          pip install gitlint
          gitlint --commits ${{ inputs.base-ref }}..HEAD
```

#### `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Summary
<1-3 bullets on what changed and why>

## Story / Issue
Closes #...

## Test plan
- [ ] ...
```

#### `.github/CONTRIBUTING.md`

Document:
- Conventional Commits format (`type(scope): subject`)
- Allowed types: feat, fix, perf, refactor, docs, build, chore, test, style
- Allowed scopes per repo:
  - **verity-frontend:** `app`, `landing`, `public`, `brand`, `fixtures`, `reso`, `storybook`, plus subject keywords (`vpid`, `vpr`, `kyc`)
  - **verity-backend:** `auth`, `properties`, `documents`, `orders`, `verifications`, `admin`, `workers`, `core`, `alembic` (matching `app/api/v1/` route handler names + workers + migrations)
- Branch + PR conventions
- Local hook setup pointer per repo

#### `.github/CODEOWNERS` (fallback)

```
# Default org-level CODEOWNERS — overridden by per-repo CODEOWNERS where present
* @codakyello @Divineverity
```

### Step 3 — Org-level branch protection ruleset

After token refresh, create one ruleset that targets `main` on both `verity-frontend` and `verity-backend`:

```json
{
  "name": "Default main protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] },
    "repository_name": {
      "include": ["verity-frontend", "verity-backend"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true
      }
    },
    { "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          { "context": "conventional-commits" },
          { "context": "ci" }
        ]
      }
    },
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "creation" }
  ]
}
```

Create via:
```
gh api -X POST orgs/Verity-Properties-Ltd/rulesets --input ruleset.json
```

**Required status check names (`conventional-commits` and `ci`) must match the job IDs the per-repo workflows produce — coordinate naming in Steps 4 + 5.**

If GitHub plan tier doesn't include ruleset coverage for private repos, fall back to:
```
gh api -X PUT repos/Verity-Properties-Ltd/{repo}/branches/main/protection --input branch-protection.json
```
applied identically to both repos.

### Step 4 — Per-repo CI workflows

#### `verity-frontend/.github/workflows/ci.yml`

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

jobs:
  conventional-commits:
    uses: Verity-Properties-Ltd/.github/.github/workflows/conventional-commits.yml@main
    with: { runtime: node }

  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint --workspaces --if-present
      - run: npm run typecheck --workspaces --if-present
      - run: npm test --workspaces --if-present
      - run: npm run build:landing
      - run: npm run build:app
      - run: npm run build:public
```

#### `verity-backend/.github/workflows/ci.yml`

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

jobs:
  conventional-commits:
    uses: Verity-Properties-Ltd/.github/.github/workflows/conventional-commits.yml@main
    with: { runtime: python }

  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11', cache: 'pip' }
      - run: pip install -r requirements-dev.txt
      - run: ruff check .
      - run: ruff format --check .
      - run: mypy app
      - run: pytest
      - name: Docker build smoke
        run: docker build -t verity-backend:ci .
```

### Step 5 — Per-repo local commit-msg hooks

#### `verity-frontend` — husky + commitlint

Add to `package.json` devDeps: `@commitlint/cli`, `@commitlint/config-conventional`, `husky`.

`commitlint.config.cjs`:
```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'app', 'landing', 'public', 'brand', 'fixtures', 'reso', 'storybook',
      'deps', 'release', 'ci'
    ]],
    'subject-case': [0]
  }
};
```

`.husky/commit-msg`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx commitlint --edit "$1"
```

`package.json` add `"prepare": "husky install"`.

#### `verity-backend` — gitlint

Add to `requirements-dev.txt`: `gitlint`.

`.gitlint`:
```ini
[general]
contrib=contrib-title-conventional-commits
ignore=body-is-missing,body-min-length

[contrib-title-conventional-commits]
types=feat,fix,perf,refactor,docs,build,chore,test,style
```

Manual git hook install (devs run once after clone):
```bash
gitlint install-hook
```
Document this step in `verity-backend/README.md` under "Local dev setup".

### Step 6 — Per-repo release-please

#### `verity-frontend/.github/workflows/release-please.yml`

```yaml
name: release-please
on: { push: { branches: [main] } }
permissions: { contents: write, pull-requests: write }
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

`release-please-config.json`:
```json
{
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "verity-frontend",
      "include-component-in-tag": false
    }
  }
}
```

`.release-please-manifest.json`: `{ ".": "0.0.0" }`

#### `verity-backend/.github/workflows/release-please.yml`

Same shape, but `release-type: python` and `package-name: verity-backend`. Manifest starts at `{ ".": "0.0.0" }`.

**Important:** ensure the `release-please` workflow runs on `main` are **not** required status checks in the org ruleset — the bot pushes without review by design.

## GitHub trackers

File new issues to track this work (Notion deferred per user decision):

**On verity-frontend (parent / coordination home):**
- New `[INF/org-github] Create Verity-Properties-Ltd/.github org repo + reusable workflows + PR template + CODEOWNERS` (P0, cross-cutting)
- New `[INF/ruleset] Create org-level branch protection ruleset targeting dashboard + backend main` (P0, blocked by token refresh + .github repo)
- Re-scope **#37 [FND-02/ci]** body: narrow to frontend stack; reference the reusable workflow from `.github`
- Re-scope **#38 [FND-02/commitlint]** body: narrow to frontend (husky + commitlint); reference shared CONTRIBUTING.md
- Re-scope **#39 [FND-02/release-please]** body: narrow to frontend (Node release-type)

**On verity-backend (new repo trackers):**
- New issue mirroring #37 — backend CI (ruff + mypy + pytest + docker)
- New issue mirroring #38 — gitlint commit-msg hook
- New issue mirroring #39 — release-please (Python release-type)

## Critical files

| Repo | Files to create |
|---|---|
| `Verity-Properties-Ltd/.github` (NEW) | `README.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CONTRIBUTING.md`, `.github/CODEOWNERS`, `.github/workflows/conventional-commits.yml` |
| `verity-frontend` | `.github/workflows/ci.yml`, `.github/workflows/release-please.yml`, `commitlint.config.cjs`, `.husky/commit-msg`, `release-please-config.json`, `.release-please-manifest.json`, package.json devDep additions |
| `verity-backend` | `.github/workflows/ci.yml`, `.github/workflows/release-please.yml`, `.gitlint`, `release-please-config.json`, `.release-please-manifest.json`, `requirements-dev.txt` gitlint addition |
| Org-level | One ruleset JSON applied via `gh api` to `orgs/Verity-Properties-Ltd/rulesets` |

## Verification

1. **`.github` repo live** — `gh repo view Verity-Properties-Ltd/.github` returns the repo; community-health files visible.
2. **Reusable workflow callable** — open a test PR on `verity-frontend` with a non-conventional commit message ("wip stuff"); the `conventional-commits` job fails. Reword commit message to `chore: test commit`; job passes on next push.
3. **Ruleset active** — `gh api orgs/Verity-Properties-Ltd/rulesets` lists "Default main protection" targeting both repos. Test by attempting `git push -f origin main` from a local clone — rejected.
4. **Local hooks work** — fresh clone of each repo + `npm install` (frontend) or `pip install -r requirements-dev.txt && gitlint install-hook` (backend); attempting `git commit -m "bad message"` fails locally; `git commit -m "feat: good message"` passes.
5. **release-please** — push a `feat:` commit to `main` on either repo; release-please bot opens a `chore(main): release vX.Y.Z` PR within minutes.
6. **CI gates the PR** — PR cannot merge until `conventional-commits` + `ci` status checks pass; reviewer count satisfied per ruleset.

## What this plan does NOT do

- **Doesn't touch `apps/api/` in verity-frontend.** The monorepo reversal (delete the subtree, update CLAUDE.md, update FND-* Notion stories) is a separate, larger effort the user explicitly defers.
- **Doesn't update FND-02 or any other Notion backlog story.** Notion sync deferred until the broader doc reversal.
- **Doesn't configure org secrets** (Vercel deploy token, AWS creds, Datadog API keys) — those land per-repo as each integration ships.
- **Doesn't add pre-commit framework or pre-push hooks beyond commit-msg.** gitlint covers commit messages only; if the team later wants ruff/mypy as pre-commit hooks, layer `pre-commit` framework on top of gitlint then.
- **Doesn't set up Dependabot or CodeQL** — those are FND-16 scope.
- **Doesn't archive `mvp` repo** — that's a separate decision tied to the landing-Vercel-repoint (#28 `[FND-11/vercel-landing]`).
