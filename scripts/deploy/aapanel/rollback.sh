#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/www/wwwroot/aeranails.com"
BRANCH="main"
DOMAIN=""
APP_PORT="31847"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir) APP_DIR="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    --port) APP_PORT="$2"; shift 2 ;;
    *) echo "[ERROR] Unknown argument: $1" >&2; exit 1 ;;
  esac
done

COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
ENV_FILE="${APP_DIR}/.env.production"
PREVIOUS_FILE="${APP_DIR}/.deploy/previous-release.env"

echo "[WARN] Database migrations are not automatically reversed."
echo "[WARN] Restore PostgreSQL backup manually only when required."

[[ -f "${PREVIOUS_FILE}" ]] || { echo "[ERROR] Missing previous release metadata." >&2; exit 1; }
[[ -f "${ENV_FILE}" ]] || { echo "[ERROR] Missing .env.production." >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "${PREVIOUS_FILE}"
set +a

previous_sha="${COMMIT_SHA:-}"
[[ -n "${previous_sha}" ]] || { echo "[ERROR] Previous commit SHA missing." >&2; exit 1; }

cd "${APP_DIR}"
git cat-file -e "${previous_sha}^{commit}" || { echo "[ERROR] Previous commit not found: ${previous_sha}" >&2; exit 1; }

current_sha="$(git rev-parse HEAD)"
git checkout "${BRANCH}"
git reset --hard "${previous_sha}"

if [[ -n "${WEB_IMAGE:-}" ]] && docker image inspect "${WEB_IMAGE}" >/dev/null 2>&1; then
  echo "[INFO] Reusing previous web image ${WEB_IMAGE}"
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --no-build web
else
  echo "[INFO] Previous image not available. Rebuilding web image."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" build web
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d web
fi

"${APP_DIR}/scripts/deploy/aapanel/healthcheck.sh" --app-dir "${APP_DIR}" --domain "${DOMAIN}" --port "${APP_PORT}" --commit "${previous_sha}"

cat > .deploy/current-release.env <<EOF
DEPLOYED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
COMMIT_SHA=${previous_sha}
BRANCH=${BRANCH}
DOMAIN=${DOMAIN}
APP_PORT=${APP_PORT}
WEB_IMAGE=${WEB_IMAGE:-}
MIGRATOR_IMAGE=${MIGRATOR_IMAGE:-}
JOBS_IMAGE=${JOBS_IMAGE:-}
EOF

cat > .deploy/previous-release.env <<EOF
DEPLOYED_AT=
COMMIT_SHA=${current_sha}
BRANCH=${BRANCH}
DOMAIN=${DOMAIN}
APP_PORT=${APP_PORT}
EOF

echo "[OK] Code rollback complete: ${previous_sha}"
