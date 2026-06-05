# AWS Staging Deployment

## Recommended split

- `verity-frontend` -> Vercel
- `verity-backend/api` -> AWS ECS Fargate service behind an Application Load Balancer
- `verity-backend/worker` -> AWS ECS Fargate service with desired count `1`
- PostgreSQL -> Amazon RDS
- Redis -> Amazon ElastiCache
- Documents / reports -> Amazon S3
- Secrets -> AWS Secrets Manager

## Why this shape

- The frontend is a Vite SPA and can be served statically from Vercel.
- The backend is a long-running Dockerized API plus a separate background worker.
- Vercel is a poor fit for the backend because this repo depends on a long-lived API process, a worker, Redis-backed job dispatch, and container-style runtime configuration.

## Fastest staging scope

For frontend integration staging you can defer MongoDB for now:

- set `SKIP_STARTUP_CHECKS=true`
- do not wire Mongo yet
- expect the `/api/v1/health` Mongo check to be degraded until Mongo is provisioned

This is safe today because Mongo is not used by any active request path yet.

## 1. Create AWS resources

Create:

- `verity-staging-postgres` in RDS
- `verity-staging-redis` in ElastiCache
- `verity-staging-documents` S3 bucket
- `verity-staging-reports` S3 bucket
- `verity-staging` ECS cluster
- `verity-backend` ECR repository
- one ALB + target group for the API

## 2. Push the backend image to ECR

Run from [verity-backend](/Users/a1/Documents/Dev/verity/verity-backend):

```bash
aws ecr create-repository --repository-name verity-backend --region us-east-1
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker build -t verity-backend:staging .
docker tag verity-backend:staging <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/verity-backend:staging
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/verity-backend:staging
```

## 3. Store runtime config in Secrets Manager

This app loads its configuration from Secrets Manager automatically when `APP_ENV=staging`.

Set the ECS task environment to:

- `APP_ENV=staging`
- `AWS_SECRETS_MANAGER_PREFIX=verity/staging/`

Then create secrets whose names start with `verity/staging/`.

Example names:

- `verity/staging/database_url`
- `verity/staging/redis_url`
- `verity/staging/jwt_private_key`
- `verity/staging/jwt_public_key`
- `verity/staging/frontend_url`
- `verity/staging/backend_cors_origins`
- `verity/staging/s3_bucket_documents`
- `verity/staging/s3_bucket_reports`
- `verity/staging/aws_region`
- `verity/staging/aws_endpoint_url`
- `verity/staging/s3_public_endpoint_url`
- `verity/staging/auth_require_email_verification`
- `verity/staging/skip_startup_checks`

Use the template in [deploy/aws/secrets-manager.staging.example.json](/Users/a1/Documents/Dev/verity/verity-backend/deploy/aws/secrets-manager.staging.example.json).

## 4. Deploy ECS task definitions

Use:

- [deploy/aws/ecs/api-task-definition.template.json](/Users/a1/Documents/Dev/verity/verity-backend/deploy/aws/ecs/api-task-definition.template.json)
- [deploy/aws/ecs/worker-task-definition.template.json](/Users/a1/Documents/Dev/verity/verity-backend/deploy/aws/ecs/worker-task-definition.template.json)

Fill in:

- `ACCOUNT_ID`
- `REGION`
- `EXECUTION_ROLE_ARN`
- `TASK_ROLE_ARN`
- `SUBNET_IDS`
- `SECURITY_GROUP_IDS`
- CloudWatch log group names

API service:

- desired count `1`
- public ALB listener `443`
- target group port `8000`

Worker service:

- desired count `1`
- no load balancer

## 5. Deploy the frontend to Vercel

Run from [verity-frontend](/Users/a1/Documents/Dev/verity/verity-frontend):

```bash
npm run build
vercel
```

Set:

- `VITE_API_URL=https://<your-api-domain>/api/v1`

The Vercel SPA rewrite config already exists in [vercel.json](/Users/a1/Documents/Dev/verity/verity-frontend/vercel.json).

## 6. Staging values to use

Recommended staging values:

- `auth_require_email_verification=false`
- `skip_startup_checks=true`
- `aws_endpoint_url=` (empty)
- `s3_public_endpoint_url=` (empty)

Notes:

- Keep `aws_endpoint_url` and `s3_public_endpoint_url` empty on AWS so boto3 uses real AWS endpoints.
- `auth_require_email_verification=false` lets your frontend team self-serve signup until email delivery is implemented.
- `skip_startup_checks=true` keeps staging simple while Mongo is still unused.

## 7. Smoke test checklist

After deploy:

1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/login`
3. `GET /api/v1/users/me`
4. `POST /api/v1/properties`
5. `POST /api/v1/documents/upload-url`
6. browser `PUT` to returned S3 URL
7. `POST /api/v1/documents/{document_id}/confirm`
8. `GET /api/v1/properties`

## Current limitations

- Email OTP delivery is still not implemented.
- Report/document admin download endpoints still need to be wired for analyst review.
- The frontend build still has unrelated TypeScript issues outside the auth and deployment path, so Vercel should be treated as a preview/staging setup until those are cleaned up.
