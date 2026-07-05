#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/www/wwwroot/aeranails.com}"
COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
ENV_FILE="${APP_DIR}/.env.production"
BACKUP_FILE="${1:-}"

if [[ -z "${BACKUP_FILE}" || ! -f "${BACKUP_FILE}" ]]; then
  echo "Usage: $0 /www/backup/aera-nail/postgres/aera_nail_YYYYMMDD_HHMMSS.sql.gz" >&2
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[ERROR] Missing ${ENV_FILE}" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

echo "Database restore is destructive."
echo "Type RESTORE_AERA_DATABASE to continue:"
read -r confirmation
if [[ "${confirmation}" != "RESTORE_AERA_DATABASE" ]]; then
  echo "[ERROR] Confirmation did not match. Aborting." >&2
  exit 1
fi

cd "${APP_DIR}"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" stop web || true
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d postgres

echo "[INFO] Restoring database from ${BACKUP_FILE}"
gunzip -c "${BACKUP_FILE}" | docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T postgres \
  psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1

docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d web
"${APP_DIR}/scripts/deploy/aapanel/healthcheck.sh" --app-dir "${APP_DIR}" --domain "${APP_DOMAIN}" --port "${APP_PORT}"
echo "[OK] Restore complete."
