# Verity Backend System Overview

## Purpose
This document tracks the current implementation state of the Verity backend.

It is the single operational summary for:
- architecture
- API endpoints
- database models
- services and workers
- external integrations
- implementation history

This file reflects the backend scaffold and hardening work currently implemented in `verity-backend/`.

## Architecture

### Application structure
- `app/main.py`
  Creates the FastAPI app, registers middleware, wires the `/api/v1` router, and runs startup health checks for PostgreSQL, Redis, and MongoDB.
- `app/core/`
  Shared infrastructure primitives: config loading, database engine, Redis client, MongoDB client, JWT/security helpers, session storage, and exception handling.
- `app/models/`
  SQLAlchemy models for users, companies, properties, documents, orders, reports, verification jobs, and audit logs.
- `app/schemas/`
  Pydantic request and response schemas used by the API.
- `app/api/v1/`
  Versioned route handlers for auth, users, companies, properties, documents, orders, reports, verifications, admin queue, and health.
- `app/services/`
  Business logic layer. Route handlers call services instead of embedding business logic directly.
- `app/workers/`
  Redis-backed `arq` workers for OCR, report compilation, and email tasks.
- `docker-compose.yml`
  Local Docker stack for the API, background worker, PostgreSQL, Redis, MongoDB, and LocalStack.
- `tests/`
  Async API tests and test bootstrap.
- `alembic/`
  Migration environment and initial schema migration.

### Runtime flow
- Developer dashboard flows are authenticated with JWT access tokens.
- Refresh tokens are stored server-side and can be rotated or revoked.
- Document upload is a two-step process:
  1. Request presigned upload URL
  2. Confirm upload after the file is present in S3
- Verification jobs are queued only after upload confirmation or paid order fulfillment.
- Verification dispatch attempts are tracked on each job so queue failures are visible and retryable.
- Buyer report orders are guest-first and keyed by `buyer_email`.
- Guest paid orders without a linked property still create a verification intake job so the analyst queue can see them.

### Security model
- JWT uses RS256.
- `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` can be provided as base64-encoded env values and are decoded at config load time.
- JWT key config now fails fast if the value is neither PEM nor base64-encoded PEM.
- Passwords use bcrypt hashing.
- Refresh token session state is stored in Redis, with an in-memory fallback used in test mode.
- Admin queue routes require `verity_admin` or `verity_analyst`.
- Developer write actions require `developer_admin`.
- Report and verification reads are company-scoped for authenticated non-admin users.

## API Reference

### Health
#### `GET /api/v1/health`
- Auth required: no
- Roles: public
- Purpose: returns liveness/readiness status for PostgreSQL, Redis, and MongoDB
- Request body:
```json
null
```
- Response shape:
```json
{
  "status": "ok",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "mongodb": "ok"
  }
}
```
- Possible errors: degraded dependency states are reported in-body rather than as request errors

### Auth
#### `POST /api/v1/auth/register`
- Auth required: no
- Roles: public
- Purpose: creates a developer company account and first admin user
- Request body:
```json
{
  "company_name": "Verity Estates",
  "cac_registration_number": "RC-123456",
  "contact_name": "Ladi Awolaja",
  "email": "ladi@example.com",
  "phone_number": "08030000000",
  "state": "Lagos",
  "password": "supersecurepassword"
}
```
- Response shape:
```json
{
  "user_id": "uuid",
  "company_id": "uuid",
  "detail": "Registration successful. Verify the OTP sent to your email.",
  "otp_code": "123456"
}
```
- Possible errors: `409` if email already exists

#### `POST /api/v1/auth/verify-otp`
- Auth required: no
- Roles: public
- Purpose: verifies the email OTP for a new user
- Request body:
```json
{
  "email": "ladi@example.com",
  "otp_code": "123456"
}
```
- Response shape:
```json
{
  "detail": "Email verified successfully"
}
```
- Possible errors: `403` invalid or expired OTP

#### `POST /api/v1/auth/login`
- Auth required: no
- Roles: public
- Purpose: issues access and refresh tokens
- Request body:
```json
{
  "email": "ladi@example.com",
  "password": "supersecurepassword"
}
```
- Response shape:
```json
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer"
}
```
- Possible errors: `403` invalid credentials or unverified email

#### `POST /api/v1/auth/refresh`
- Auth required: no
- Roles: public
- Purpose: rotates a refresh token and issues a new access token
- Request body:
```json
{
  "refresh_token": "jwt"
}
```
- Response shape:
```json
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer"
}
```
- Possible errors: `403` invalid or inactive refresh token

#### `POST /api/v1/auth/logout`
- Auth required: no
- Roles: public
- Purpose: revokes a refresh token
- Request body:
```json
{
  "refresh_token": "jwt"
}
```
- Response shape:
```json
{
  "detail": "Logged out successfully"
}
```
- Possible errors: `403` invalid refresh token

### Users
#### `GET /api/v1/users/me`
- Auth required: yes
- Roles: any authenticated user
- Purpose: returns the current user profile
- Request body:
```json
null
```
- Response shape:
```json
{
  "id": "uuid",
  "company_id": "uuid",
  "email": "ladi@example.com",
  "full_name": "Ladi Awolaja",
  "phone_number": "08030000000",
  "state": "Lagos",
  "role": "developer_admin",
  "is_active": true,
  "is_email_verified": true
}
```
- Possible errors: `401` invalid access token

#### `PATCH /api/v1/users/me`
- Auth required: yes
- Roles: any authenticated user
- Purpose: updates the current user profile
- Request body:
```json
{
  "full_name": "Updated Name",
  "phone_number": "08031111111",
  "state": "Abuja"
}
```
- Response shape: same as `GET /users/me`
- Possible errors: `401` invalid access token

### Companies
#### `GET /api/v1/companies/me`
- Auth required: yes
- Roles: any authenticated company user
- Purpose: returns the current company record
- Request body:
```json
null
```
- Response shape:
```json
{
  "id": "uuid",
  "name": "Verity Estates",
  "cac_registration_number": "RC-123456",
  "contact_name": "Ladi Awolaja",
  "contact_email": "ladi@example.com",
  "contact_phone": "08030000000",
  "state": "Lagos",
  "billing_plan": "starter",
  "billing_cycle": "monthly"
}
```
- Possible errors: `401`, `404`

#### `PATCH /api/v1/companies/me`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: updates company profile fields
- Request body:
```json
{
  "contact_name": "New Contact",
  "billing_plan": "growth"
}
```
- Response shape: same as `GET /companies/me`
- Possible errors: `401`, `403`, `404`

#### `POST /api/v1/companies/invite`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: creates a team member record for the current company
- Request body:
```json
{
  "email": "viewer@example.com",
  "full_name": "Viewer User",
  "role": "developer_viewer",
  "phone_number": "08032222222",
  "state": "Lagos"
}
```
- Response shape: user profile of invited member
- Possible errors: `401`, `403`, `404`

### Properties
#### `POST /api/v1/properties`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: creates a property record for the current company
- Request body:
```json
{
  "name": "Plot 7",
  "address": "Lekki Phase 1",
  "lga": "Eti-Osa",
  "state": "Lagos",
  "property_type": "landed",
  "title_type": "certificate_of_occupancy"
}
```
- Response shape:
```json
{
  "id": "uuid",
  "company_id": "uuid",
  "created_by_user_id": "uuid",
  "name": "Plot 7",
  "address": "Lekki Phase 1",
  "lga": "Eti-Osa",
  "state": "Lagos",
  "property_type": "landed",
  "title_type": "certificate_of_occupancy",
  "verification_status": "uploaded"
}
```
- Possible errors: `401`, `403`

#### `GET /api/v1/properties`
- Auth required: yes
- Roles: authenticated company users
- Purpose: lists company properties with optional filters
- Request body:
```json
null
```
- Response shape:
```json
{
  "items": [],
  "total": 0
}
```
- Possible errors: `401`

#### `GET /api/v1/properties/{property_id}`
- Auth required: yes
- Roles: authenticated company users
- Purpose: returns a single property if it belongs to the current company
- Request body:
```json
null
```
- Response shape: same as `POST /properties`
- Possible errors: `401`, `404`

#### `GET /api/v1/properties/{property_id}/documents`
- Auth required: yes
- Roles: authenticated company users
- Purpose: returns all documents uploaded for a specific property, scoped to the caller's company
- Request body:
```json
null
```
- Response shape:
```json
{
  "items": [],
  "total": 0
}
```
- Possible errors: `401`, `404`

#### `PATCH /api/v1/properties/{property_id}`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: updates a property record
- Request body:
```json
{
  "verification_status": "under_review"
}
```
- Response shape: same as `POST /properties`
- Possible errors: `401`, `403`, `404`

### Documents
#### `POST /api/v1/documents/upload-url`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: creates a pending document record and returns an S3 presigned upload URL
- Request body:
```json
{
  "property_id": "uuid",
  "file_name": "title.pdf",
  "file_type": "application/pdf",
  "file_size": 1024
}
```
- Response shape:
```json
{
  "document_id": "uuid",
  "upload_url": "https://...",
  "object_key": "properties/.../documents/..."
}
```
- Possible errors: `401`, `403`, `404`

#### `POST /api/v1/documents/{document_id}/confirm`
- Auth required: yes
- Roles: `developer_admin`
- Purpose: confirms the file upload and creates or re-dispatches the verification job
- Request body:
```json
null
```
- Response shape:
```json
{
  "document_id": "uuid",
  "verification_job_id": "uuid",
  "detail": "Document confirmed and verification queued"
}
```
- Possible errors: `401`, `403`, `404`, `503`

#### `GET /api/v1/documents`
- Auth required: yes
- Roles: authenticated users
- Purpose: lists documents uploaded by the current user
- Request body:
```json
null
```
- Response shape:
```json
{
  "items": [],
  "total": 0
}
```
- Possible errors: `401`

### Verifications
#### `GET /api/v1/verifications/{job_id}`
- Auth required: yes
- Roles: company-scoped users, `verity_admin`, `verity_analyst`
- Purpose: returns a verification job if the current user is allowed to see it
- Request body:
```json
null
```
- Response shape:
```json
{
  "id": "uuid",
  "property_id": "uuid",
  "order_id": null,
  "document_id": "uuid",
  "analyst_id": null,
  "status": "uploaded",
  "extracted_data": null,
  "confidence_summary": null,
  "analyst_notes": null,
  "risk_rating": null
}
```
- Possible errors: `401`, `404`

### Reports
#### `GET /api/v1/reports/{report_id}`
- Auth required: yes
- Roles: company-scoped users, `verity_admin`, `verity_analyst`
- Purpose: returns a private report record
- Request body:
```json
null
```
- Response shape:
```json
{
  "id": "uuid",
  "property_id": "uuid",
  "verification_job_id": "uuid",
  "order_id": null,
  "reference_number": "VRT-2026-000001",
  "status": "generated",
  "tier": "standard",
  "pdf_s3_key": "reports/...",
  "public_verification_slug": "slug",
  "executive_summary": "summary",
  "issued_at": null
}
```
- Possible errors: `401`, `404`

#### `GET /api/v1/reports/{report_id}/download`
- Auth required: yes
- Roles: company-scoped users, `verity_admin`, `verity_analyst`
- Purpose: returns a presigned download URL for a private report
- Request body:
```json
null
```
- Response shape:
```json
{
  "report_id": "uuid",
  "download_url": "https://..."
}
```
- Possible errors: `401`, `404`

#### `GET /api/v1/reports/verify/{reference_number}`
- Auth required: no
- Roles: public
- Purpose: verifies public report authenticity by reference number
- Request body:
```json
null
```
- Response shape:
```json
{
  "reference_number": "VRT-2026-000001",
  "property_id": "uuid",
  "status": "generated",
  "issued_at": null
}
```
- Possible errors: `404`

### Orders
#### `POST /api/v1/orders`
- Auth required: no
- Roles: public
- Purpose: creates a guest-first buyer report order
- Request body:
```json
{
  "property_id": null,
  "buyer_name": "Ada Buyer",
  "buyer_email": "ada@example.com",
  "property_address": "Yaba, Lagos",
  "tier": "standard",
  "amount": 25000,
  "currency": "NGN",
  "payment_provider": "paystack"
}
```
- Response shape:
```json
{
  "id": "uuid",
  "user_id": null,
  "property_id": null,
  "buyer_name": "Ada Buyer",
  "buyer_email": "ada@example.com",
  "property_address": "Yaba, Lagos",
  "tier": "standard",
  "amount": 25000,
  "currency": "NGN",
  "payment_provider": "paystack",
  "payment_reference": "vrt_abcd1234",
  "status": "pending"
}
```
- Possible errors: validation errors only

#### `POST /api/v1/orders/paystack/webhook`
- Auth required: no
- Roles: Paystack server
- Purpose: validates Paystack webhook signature and fulfills matching orders
- Request body:
```json
{
  "data": {
    "reference": "vrt_abcd1234"
  }
}
```
- Response shape:
```json
{
  "detail": "Paystack webhook processed"
}
```
- Possible errors: `400` invalid payload, `401` invalid signature, `503` missing secret or queue outage

#### `POST /api/v1/orders/flutterwave/webhook`
- Auth required: no
- Roles: Flutterwave server
- Purpose: validates Flutterwave webhook signature and fulfills matching orders
- Request body:
```json
{
  "data": {
    "tx_ref": "vrt_abcd1234"
  }
}
```
- Response shape:
```json
{
  "detail": "Flutterwave webhook processed"
}
```
- Possible errors: `400` invalid payload, `401` invalid signature, `503` missing secret or queue outage

### Admin
#### `GET /api/v1/admin/queue`
- Auth required: yes
- Roles: `verity_admin`, `verity_analyst`
- Purpose: returns the analyst queue across verification jobs
- Request body:
```json
null
```
- Response shape:
```json
{
  "items": [],
  "total": 0
}
```
- Possible errors: `401`, `403`

#### `POST /api/v1/admin/queue/reconcile-dispatch`
- Auth required: yes
- Roles: `verity_admin`, `verity_analyst`
- Purpose: retries dispatch for older verification jobs that were created but never queued successfully
- Request body:
```json
null
```
- Response shape:
```json
{
  "items": [],
  "total": 0
}
```
- Possible errors: `401`, `403`

#### `POST /api/v1/admin/queue/{job_id}/approve`
- Auth required: yes
- Roles: `verity_admin`, `verity_analyst`
- Purpose: transitions a verification job to `verified` if the state machine allows it
- Request body:
```json
null
```
- Response shape: `VerificationJobRead`
- Possible errors: `401`, `403`, `404`, `409`

#### `POST /api/v1/admin/queue/{job_id}/flag`
- Auth required: yes
- Roles: `verity_admin`, `verity_analyst`
- Purpose: transitions a verification job to `flagged` if the state machine allows it
- Request body:
```json
null
```
- Response shape: `VerificationJobRead`
- Possible errors: `401`, `403`, `404`, `409`

## Database

### `companies`
- Purpose: developer company account
- Columns:
```text
id: string(36), primary key
name: string(255)
cac_registration_number: string(100), unique, indexed
contact_name: string(255)
contact_email: string(255), unique, indexed
contact_phone: string(50)
state: string(100)
billing_plan: string(50)
billing_cycle: string(50)
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - one-to-many with `users`
  - one-to-many with `properties`

### `users`
- Purpose: dashboard users and internal admin/analyst users
- Columns:
```text
id: string(36), primary key
company_id: string(36), nullable, indexed
email: string(255), unique, indexed
full_name: string(255)
phone_number: string(50)
state: string(100)
role: enum(user_role)
password_hash: string(255)
is_active: bool
is_email_verified: bool
otp_code: string(10), nullable
otp_expires_at: timestamptz, nullable
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - many-to-one with `companies`

### `properties`
- Purpose: developer-uploaded property listings for verification
- Columns:
```text
id: string(36), primary key
company_id: string(36), indexed
created_by_user_id: string(36), indexed
name: string(255)
address: string(500)
lga: string(120)
state: string(120)
property_type: string(50)
title_type: string(100)
verification_status: enum(verification_status)
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - many-to-one with `companies`
  - one-to-many with `documents`
  - one-to-many with `verification_jobs`

### `documents`
- Purpose: uploaded title document metadata
- Columns:
```text
id: string(36), primary key
property_id: string(36), indexed
uploaded_by_user_id: string(36), indexed
file_name: string(255)
file_type: string(50)
file_size: int
s3_key: string(500), unique
upload_status: string(50)
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - many-to-one with `properties`

### `orders`
- Purpose: buyer report purchases
- Columns:
```text
id: string(36), primary key
user_id: string(36), nullable, indexed
property_id: string(36), nullable, indexed
buyer_name: string(255)
buyer_email: string(255), indexed
property_address: string(500)
tier: string(50)
amount: int
currency: string(10)
payment_provider: string(50)
payment_reference: string(255), unique, indexed
status: string(50)
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - optional link to `users`
  - optional link to `properties`

### `verification_jobs`
- Purpose: OCR/verification pipeline tracker
- Columns:
```text
id: string(36), primary key
property_id: string(36), nullable, indexed
order_id: string(36), nullable, indexed
document_id: string(36), nullable, indexed
analyst_id: string(36), nullable, indexed
status: enum(verification_status)
extracted_data: json, nullable
confidence_summary: json, nullable
analyst_notes: string(1000), nullable
risk_rating: string(50), nullable
dispatch_attempts: integer
last_dispatch_attempt_at: timestamptz, nullable
queued_at: timestamptz, nullable
last_dispatch_error: string(1000), nullable
started_at: timestamptz, nullable
completed_at: timestamptz, nullable
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - optional link to `properties`
  - optional link to `orders`
  - optional link to `documents`

### `reports`
- Purpose: generated verification report metadata
- Columns:
```text
id: string(36), primary key
property_id: string(36), indexed
verification_job_id: string(36), indexed
order_id: string(36), nullable, indexed
reference_number: string(100), unique, indexed
status: string(50)
tier: string(50)
pdf_s3_key: string(500)
public_verification_slug: string(255), unique, indexed
executive_summary: string(1000)
issued_at: timestamptz, nullable
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - link to `verification_jobs`
  - optional link to `orders`

### `audit_logs`
- Purpose: immutable-style audit trail for auth and admin actions
- Columns:
```text
id: string(36), primary key
actor_user_id: string(36), nullable, indexed
action: string(255)
entity_type: string(100)
entity_id: string(36), indexed
ip_address: string(100), nullable
user_agent: string(255), nullable
metadata: json, nullable
created_at: timestamptz
updated_at: timestamptz
```
- Relationships:
  - optional link to `users`

## Services

### `auth_service.py`
- What it does:
  - registers company admin users
  - verifies OTPs
  - logs users in
  - rotates refresh tokens
  - revokes refresh tokens on logout
- Depends on:
  - `security.py`
  - `session_store.py`
  - `User`, `Company`
- Called by:
  - `api/v1/auth.py`

### `company_service.py`
- What it does:
  - fetches company records
  - updates company details
  - creates invited team member records
- Depends on:
  - `Company`, `User`
  - password hashing helper
- Called by:
  - `api/v1/companies.py`

### `property_service.py`
- What it does:
  - creates properties
  - lists filtered properties
  - updates properties
  - enforces company ownership on property fetches
- Depends on:
  - `Property`
- Called by:
  - `api/v1/properties.py`

### `document_service.py`
- What it does:
  - validates property ownership for uploads
  - creates pending document records
  - confirms uploads
  - creates verification jobs only after confirmation
- Depends on:
  - `Document`, `Property`
  - `storage_service.py`
  - `verification_service.py`
- Called by:
  - `api/v1/documents.py`

### `verification_service.py`
- What it does:
  - owns the verification state machine
  - fetches verification jobs
  - creates verification jobs
  - enqueues OCR work to `arq`
  - records dispatch attempts, queue timestamps, and last dispatch errors
  - exposes reconciliation for undispatched jobs
  - applies company-scoped access checks for verification reads
- Depends on:
  - `VerificationJob`
  - `arq`
  - worker Redis settings
- Called by:
  - `document_service.py`
  - `order_service.py`
  - `api/v1/verifications.py`
  - `api/v1/admin.py`

### `report_service.py`
- What it does:
  - fetches reports
  - applies company-scoped access checks for private report reads
  - generates presigned report download links
- Depends on:
  - `Report`
  - `storage_service.py`
- Called by:
  - `api/v1/reports.py`

### `order_service.py`
- What it does:
  - creates guest-first buyer orders
  - marks orders as paid
  - fulfills paid orders
  - creates verification intake jobs for guest-paid orders without linked properties
- Depends on:
  - `Order`, `VerificationJob`
  - `verification_service.py`
- Called by:
  - `api/v1/orders.py`

### `storage_service.py`
- What it does:
  - creates boto3 S3 clients
  - builds S3 object keys
  - generates presigned upload and download URLs
- Depends on:
  - AWS config
- Called by:
  - `document_service.py`
  - `report_service.py`

### `user_service.py`
- What it does:
  - updates current user profile fields
- Depends on:
  - `User`
- Called by:
  - `api/v1/users.py`

### `email_service.py`
- What it does:
  - placeholder for transactional email sending
- Depends on:
  - SendGrid config
- Called by:
  - future worker and fulfillment flows

### `risk_service.py`
- What it does:
  - placeholder for risk scoring
- Depends on:
  - future SageMaker integration
- Called by:
  - future verification/report flows

### `whatsapp_service.py`
- What it does:
  - placeholder for WhatsApp notifications
- Depends on:
  - Twilio config
- Called by:
  - future delivery flows

## Workers

### `ocr_worker.process_document`
- What it does:
  - placeholder OCR job handler
- Depends on:
  - `arq`
- Triggered by:
  - `verification_service.enqueue_verification_job`

### `report_worker.compile_report`
- What it does:
  - placeholder report compilation worker
- Depends on:
  - `arq`

### `email_worker.dispatch_email`
- What it does:
  - placeholder async email worker
- Depends on:
  - `arq`

### Worker registration
- `app/workers/queue.py`
  - parses `REDIS_URL`
  - builds `RedisSettings`
  - registers callable worker functions for `arq`

## Local Docker

- `docker-compose.yml` now defines:
  - `api`
  - `worker`
  - `postgres`
  - `redis`
  - `mongo`
  - `localstack`
- The API and worker containers use Docker-network hostnames for Postgres, Redis, MongoDB, and LocalStack.

## Integrations

### PostgreSQL
- Used for system-of-record relational data
- Async SQLAlchemy engine
- Managed locally through Docker Compose

### Redis
- Used for:
  - refresh token session state
  - future rate limiting
  - `arq` job queue
- Stores:
  - refresh token keys such as `auth:refresh:{jti}` with TTL matching token lifetime
  - `arq` queue keys managed internally by the worker library
- Managed locally through Docker Compose

### MongoDB
- Wired for future document extraction storage
- Managed locally through Docker Compose

### AWS S3 / LocalStack
- Used for:
  - title document uploads
  - report downloads
- Local development uses LocalStack

### AWS Secrets Manager
- Used in staging and production to hydrate runtime config
- Secrets Manager loading now raises a clear startup error when AWS config or secret retrieval fails

### Paystack
- Used for Nigerian payments
- Webhook signature validation is implemented with HMAC-SHA512

### Flutterwave
- Used for diaspora payments
- Webhook secret validation is implemented through `verif-hash`

### Datadog
- `ddtrace.patch_all()` is enabled at app startup
- full metrics/reporting integration is still pending

## Current limitations
- OCR worker, report worker, email worker, and risk scoring are still placeholders
- no end-to-end Docker validation has been run yet
- no actual S3 existence check is performed on document confirm
- report generation and analyst edit workflows are not implemented yet
- webhook fulfillment currently advances orders and queue intake, but does not yet generate a report
- queue reconciliation exists as an admin-triggered path, but there is no scheduled automatic poller yet

## Changelog

### 2026-04-11
- Added FastAPI backend scaffold under `verity-backend/`
- Added app bootstrap, config, DB/Redis/Mongo wiring, models, schemas, services, workers, tests, Docker, and Alembic setup
- Added RS256 JWT handling with base64 env decoding support
- Added `scripts/generate_keys.sh`
- Added Redis-backed refresh token rotation and logout revocation
- Added RBAC for admin and developer write actions
- Added Paystack and Flutterwave webhook validation
- Added enum-backed verification state machine
- Added initial Alembic schema migration
- Fixed `arq` worker registration to use callables instead of strings
- Changed document upload from one-step queueing to two-step upload confirmation
- Added guest order intake job creation for ops visibility
- Added company-scoped access control for private reports and verification jobs
- Added dispatch tracking and manual reconciliation for verification jobs created during queue outages
- Added boundary error translation for Redis session state, S3 presign generation, and malformed webhook payloads
- Removed production 500-response exception type leakage
- Tightened config loading so invalid JWT key env values and Secrets Manager failures fail clearly at startup
