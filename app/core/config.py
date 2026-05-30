from __future__ import annotations

import base64
import binascii
import json
import os
from functools import lru_cache
from typing import Any

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

LOCAL_DATABASE_URL = "postgresql+asyncpg://verity:verity_dev@localhost:5432/verity_db"
LOCAL_REDIS_URL = "redis://localhost:6379/0"


def _looks_like_pem(value: str) -> bool:
    return "-----BEGIN " in value and "-----END " in value


def _decode_base64_if_needed(value: str) -> str:
    if not value:
        return value
    if _looks_like_pem(value):
        return value
    try:
        decoded = base64.b64decode(value, validate=True).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError):
        raise ValueError("JWT key must be a PEM string or a base64-encoded PEM string")
    if not _looks_like_pem(decoded):
        raise ValueError("JWT key must decode to a PEM-formatted key")
    return decoded


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "local"
    app_name: str = "Verity API"
    app_version: str = "1.0.0"
    frontend_url: str = "http://localhost:3000"
    backend_cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    skip_startup_checks: bool = False

    database_url: str = LOCAL_DATABASE_URL
    database_pool_size: int = 10
    database_max_overflow: int = 20
    database_echo: bool = False

    mongodb_uri: str = "mongodb://localhost:27017/verity_docs"
    mongodb_database_name: str = "verity_docs"

    redis_url: str = LOCAL_REDIS_URL
    redis_auth_token: str = ""

    jwt_private_key: str = ""
    jwt_public_key: str = ""
    jwt_algorithm: str = "RS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7
    auth_require_email_verification: bool | None = None

    aws_region: str = "us-east-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_endpoint_url: str = ""
    s3_public_endpoint_url: str = ""  # browser-reachable URL for presigned URLs; defaults to aws_endpoint_url
    aws_secrets_manager_prefix: str = "verity/local/"
    s3_bucket_documents: str = "verity-documents"
    s3_bucket_reports: str = "verity-reports"
    aws_kms_key_id: str = ""

    paystack_secret_key: str = ""
    paystack_webhook_secret: str = ""
    flutterwave_secret_key: str = ""
    flutterwave_webhook_secret: str = ""

    sendgrid_api_key: str = ""
    sendgrid_from_email: str = "noreply@verity.ng"
    sendgrid_from_name: str = "Verity"

    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""

    google_maps_api_key: str = ""

    dd_service: str = "verity-api"
    dd_env: str = "local"
    datadog_api_key: str = ""
    datadog_app_key: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def fix_database_url(cls, value: Any) -> str:
        if not isinstance(value, str):
            return value
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            except json.JSONDecodeError:
                return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [str(item) for item in value]
        return ["http://localhost:3000"]

    @field_validator("jwt_private_key", "jwt_public_key", mode="before")
    @classmethod
    def decode_jwt_keys(cls, value: Any) -> str:
        if not isinstance(value, str):
            return ""
        return _decode_base64_if_needed(value)

    @model_validator(mode="after")
    def set_environment_defaults(self) -> "Settings":
        if self.auth_require_email_verification is None:
            self.auth_require_email_verification = self.app_env == "production"
        return self


def _load_from_secrets_manager(prefix: str) -> dict[str, str]:
    try:
        client = boto3.client(
            "secretsmanager",
            region_name=os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION") or "us-east-1",
            endpoint_url=os.getenv("AWS_ENDPOINT_URL") or None,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID") or None,
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY") or None,
        )
        paginator = client.get_paginator("list_secrets")
        overrides: dict[str, str] = {}
        for page in paginator.paginate(Filters=[{"Key": "name", "Values": [prefix]}]):
            for secret in page.get("SecretList", []):
                name = secret["Name"]
                payload = client.get_secret_value(SecretId=name)
                key = name.replace(prefix, "").replace("/", "_").lower()
                overrides[key] = payload.get("SecretString", "")
        return overrides
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"Failed to load configuration from AWS Secrets Manager for prefix '{prefix}'") from exc


def _validate_cloud_settings(settings: Settings, env: str) -> Settings:
    missing: list[str] = []
    if settings.database_url == LOCAL_DATABASE_URL:
        missing.append("database_url")
    if settings.redis_url == LOCAL_REDIS_URL:
        missing.append("redis_url")
    if not settings.jwt_private_key:
        missing.append("jwt_private_key")
    if not settings.jwt_public_key:
        missing.append("jwt_public_key")

    if missing:
        prefix = os.getenv("AWS_SECRETS_MANAGER_PREFIX", f"verity/{env}/")
        missing_fields = ", ".join(missing)
        raise RuntimeError(
            "Missing required staging/production configuration: "
            f"{missing_fields}. Set them via environment variables or AWS Secrets Manager "
            f"under the '{prefix}' prefix."
        )

    return settings


@lru_cache
def get_settings() -> Settings:
    env = os.getenv("APP_ENV", "local")
    if env in {"staging", "production"}:
        prefix = os.getenv("AWS_SECRETS_MANAGER_PREFIX", f"verity/{env}/")
        return _validate_cloud_settings(Settings(**_load_from_secrets_manager(prefix)), env)
    return Settings()


settings = get_settings()
