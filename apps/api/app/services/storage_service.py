from __future__ import annotations

import logging
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import settings
from app.core.exceptions import ServiceUnavailableError


logger = logging.getLogger("verity.storage")


def get_s3_client():
    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        endpoint_url=settings.aws_endpoint_url or None,
        aws_access_key_id=settings.aws_access_key_id or None,
        aws_secret_access_key=settings.aws_secret_access_key or None,
    )


def get_s3_presign_client():
    """S3 client used only for generating presigned URLs.
    Uses s3_public_endpoint_url so the signed URL contains a host the browser can reach
    (e.g. localhost:4566 in local dev) rather than the Docker-internal localstack hostname.
    """
    endpoint = settings.s3_public_endpoint_url or settings.aws_endpoint_url or None
    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        endpoint_url=endpoint,
        aws_access_key_id=settings.aws_access_key_id or None,
        aws_secret_access_key=settings.aws_secret_access_key or None,
    )


def build_document_s3_key(property_id: str, file_name: str) -> str:
    return f"properties/{property_id}/documents/{uuid4()}-{file_name}"


def generate_upload_url(object_key: str, content_type: str) -> str:
    try:
        client = get_s3_presign_client()
        return client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.s3_bucket_documents,
                "Key": object_key,
                "ContentType": content_type,
            },
            ExpiresIn=900,
        )
    except (BotoCoreError, ClientError) as exc:
        logger.exception("document_upload_url_generation_failed", extra={"object_key": object_key})
        raise ServiceUnavailableError("Document storage is temporarily unavailable") from exc


def generate_report_download_url(object_key: str) -> str:
    try:
        client = get_s3_presign_client()
        return client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.s3_bucket_reports, "Key": object_key},
            ExpiresIn=900,
        )
    except (BotoCoreError, ClientError) as exc:
        logger.exception("report_download_url_generation_failed", extra={"object_key": object_key})
        raise ServiceUnavailableError("Report storage is temporarily unavailable") from exc
