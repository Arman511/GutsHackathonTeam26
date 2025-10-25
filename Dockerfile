FROM node:24-slim AS frontend-builder
WORKDIR /build
COPY guts-template/package*.json /build/guts-template/
COPY guts-template/vite.config.js /build/guts-template/

WORKDIR /build/guts-template

RUN node -v && npm -v

RUN npm install

WORKDIR /build
COPY guts-template /build/guts-template/

WORKDIR /build/guts-template

RUN npm run build

FROM ghcr.io/astral-sh/uv:python3.11-alpine AS backend-builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml /app/

RUN uv sync

COPY server.py /app

COPY backend /app/backend

COPY --from=frontend-builder /build/guts-template/dist /app/static

CMD ["uv", "run", "server.py"]
