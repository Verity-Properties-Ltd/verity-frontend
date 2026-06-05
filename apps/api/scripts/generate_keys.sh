#!/bin/bash
set -euo pipefail

openssl genrsa -out jwt_private.pem 2048
openssl rsa -in jwt_private.pem -pubout -out jwt_public.pem
echo "Keys generated. Add base64-encoded contents to .env:"
echo "JWT_PRIVATE_KEY=$(base64 -i jwt_private.pem)"
echo "JWT_PUBLIC_KEY=$(base64 -i jwt_public.pem)"
