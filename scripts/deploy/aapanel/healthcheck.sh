#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/www/wwwroot/aeranails.com"
DOMAIN=""
APP_PORT="31847"
EXPECTED_COMMIT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir) APP_DIR="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    --port) APP_PORT="$2"; shift 2 ;;
    --commit) EXPECTED_COMMIT="$2"; shift 2 ;;
    *) echo "[ERROR] Unknown argument: $1" >&2; exit 1 ;;
  esac
done

COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
ENV_FILE="${APP_DIR}/.env.production"

ok() { echo "[OK] $1"; }
fail() { echo "[ERROR] $1" >&2; exit 1; }

command -v docker >/dev/null 2>&1 && ok "Docker available" || fail "Docker missing"
docker compose version >/dev/null 2>&1 && ok "Docker Compose available" || fail "Docker Compose v2 missing"

[[ -d "${APP_DIR}/.git" ]] && ok "Repository cloned" || fail "Repository missing"
[[ -f "${ENV_FILE}" ]] && ok "Production environment file present" || fail ".env.production missing"

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

required=(POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD NEXT_PUBLIC_SITE_URL NEXTAUTH_URL NEXTAUTH_SECRET AUTH_SECRET CRON_SECRET PAYMENT_SETTINGS_ENCRYPTION_KEY APP_SECRETS_ENCRYPTION_KEY STORAGE_PROVIDER)
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || fail "Required environment value ${name} is missing"
done
ok "Required environment values present"

cd "${APP_DIR}"

postgres_health="$(docker inspect -f '{{.State.Health.Status}}' aera-postgres 2>/dev/null || true)"
[[ "${postgres_health}" == "healthy" ]] && ok "PostgreSQL healthy" || fail "PostgreSQL is not healthy"

web_health="$(docker inspect -f '{{.State.Health.Status}}' aera-web 2>/dev/null || true)"
[[ "${web_health}" == "healthy" ]] && ok "Web container healthy" || fail "Web container is not healthy"

curl --fail --silent --show-error "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null
ok "Application health endpoint returned 200"

docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm migrate npx prisma migrate status >/tmp/aera-prisma-status.log 2>&1 || {
  cat /tmp/aera-prisma-status.log >&2
  fail "Prisma migration status failed"
}
ok "Prisma migrations deployed"

if docker ps --format '{{.Ports}}' | grep -E '0\.0\.0\.0:5432|:::5432' >/dev/null; then
  fail "PostgreSQL host port is exposed"
fi
ok "No PostgreSQL host port exposed"

if docker port aera-web 3000/tcp 2>/dev/null | grep -v '^127\.0\.0\.1:' >/dev/null; then
  fail "Web port is not bound to localhost only"
fi
ok "Web port bound to localhost only"

current_commit="$(git rev-parse HEAD)"
if [[ -n "${EXPECTED_COMMIT}" && "${current_commit}" != "${EXPECTED_COMMIT}" ]]; then
  fail "Deployment commit mismatch: expected ${EXPECTED_COMMIT}, got ${current_commit}"
fi
ok "Deployment commit: ${current_commit}"

if [[ -n "${DOMAIN}" ]]; then
  echo "[INFO] Public domain configured: https://${DOMAIN}"
fi
