# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the Verity backend.
#
# Stage 1 (builder) — installs Python deps that need C compilers. None of
# build-essential / libffi-dev / gcc lands in the final image — that's
# where the bulk of the upstream base-image CVE surface lives.
#
# Stage 2 (runtime) — only runtime system libs (weasyprint's pango/cairo
# stack + curl for healthchecks) + the already-built site-packages copied
# over from the builder.
#
# Pinning to python:3.11-slim-bookworm (not the unversioned -slim) prevents
# surprise upgrades to a newer Debian release; apt-get upgrade -y in both
# stages pulls security patches that the upstream image hasn't yet been
# rebuilt with.

# ─── Builder stage ───────────────────────────────────────────────────────
FROM python:3.11-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements-dev.txt ./
RUN pip install --user --no-cache-dir -r requirements-dev.txt

# ─── Runtime stage ───────────────────────────────────────────────────────
FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PATH=/root/.local/bin:$PATH

WORKDIR /app

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        curl \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libcairo2 \
        libgdk-pixbuf-2.0-0 \
        shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Bring pip-installed packages over from the builder stage. The --user
# install in stage 1 lands under /root/.local, which is on PATH above so
# uvicorn / arq resolve cleanly.
COPY --from=builder /root/.local /root/.local

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
