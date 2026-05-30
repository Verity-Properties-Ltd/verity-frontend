#!/bin/sh
set -eu

create_bucket_if_missing() {
  bucket="$1"
  if ! awslocal s3api head-bucket --bucket "$bucket" >/dev/null 2>&1; then
    awslocal s3api create-bucket --bucket "$bucket" >/dev/null
  fi
}

apply_cors() {
  bucket="$1"
  awslocal s3api put-bucket-cors \
    --bucket "$bucket" \
    --cors-configuration '{
      "CORSRules": [
        {
          "AllowedOrigins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000"
          ],
          "AllowedMethods": ["GET", "PUT", "HEAD"],
          "AllowedHeaders": ["*"],
          "ExposeHeaders": ["ETag"],
          "MaxAgeSeconds": 3000
        }
      ]
    }' >/dev/null
}

create_bucket_if_missing "verity-documents"
create_bucket_if_missing "verity-reports"
apply_cors "verity-documents"
apply_cors "verity-reports"
