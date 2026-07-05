#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/www/wwwroot/aeranails.com}"
BACKUP_DIR="${BACKUP_DIR:-/www/backup/aera-nail/postgres}"
COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
ENV_FILE="${APP_DIR}/.env.production"

mkdir -p "${BACKUP_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[ERROR] Missing ${ENV_FILE}" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

timestamp="$(date +%Y%m%d_%H%M%S)"
backup_file="${BACKUP_DIR}/${POSTGRES_DB:-aera_nail}_${timestamp}.sql.gz"

cd "${APP_DIR}"

if ! docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps postgres >/dev/null 2>&1; then
  echo "[ERROR] PostgreSQL service is not available." >&2
  exit 1
fi

echo "[INFO] Creating PostgreSQL backup ${backup_file}"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T postgres \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --no-owner --no-acl | gzip > "${backup_file}"

test -s "${backup_file}"

find "${BACKUP_DIR}" -maxdepth 1 -type f -name "${POSTGRES_DB}_*.sql.gz" -printf "%T@ %p\n" \
  | sort -rn \
  | awk 'NR>14 {print $2}' \
  | xargs -r rm -f

echo "[OK] Backup complete: ${backup_file}"
