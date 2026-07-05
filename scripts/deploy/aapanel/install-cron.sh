#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/www/wwwroot/aeranails.com"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir) APP_DIR="$2"; shift 2 ;;
    *) echo "[ERROR] Unknown argument: $1" >&2; exit 1 ;;
  esac
done

ENV_FILE="${APP_DIR}/.env.production"
[[ -f "${ENV_FILE}" ]] || { echo "[ERROR] Missing ${ENV_FILE}" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ "${INSTALL_CRON_JOBS:-0}" != "1" ]]; then
  echo "[INFO] INSTALL_CRON_JOBS is not 1. Cron install skipped."
  exit 0
fi

mkdir -p /var/log/aera-nail/cron

marker_start="# BEGIN AERA NAIL CRON"
marker_end="# END AERA NAIL CRON"
tmp_file="$(mktemp)"

crontab -l 2>/dev/null | sed "/${marker_start}/,/${marker_end}/d" > "${tmp_file}" || true
cat >> "${tmp_file}" <<EOF
${marker_start}
* * * * cd ${APP_DIR} && flock -n /tmp/aera-ai-content.lock docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production run --rm jobs npm run jobs:ai-content >> /var/log/aera-nail/cron/ai-content.log 2>&1
* * * * cd ${APP_DIR} && flock -n /tmp/aera-publish-blog.lock docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production run --rm jobs npm run jobs:publish-blog >> /var/log/aera-nail/cron/publish-blog.log 2>&1
*/15 * * * * cd ${APP_DIR} && flock -n /tmp/aera-paypal-reconcile.lock docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production run --rm jobs npm run payments:reconcile-paypal >> /var/log/aera-nail/cron/paypal-reconcile.log 2>&1
30 2 * * * APP_DIR=${APP_DIR} ${APP_DIR}/scripts/deploy/aapanel/backup-postgres.sh >> /var/log/aera-nail/cron/postgres-backup.log 2>&1
${marker_end}
EOF

crontab "${tmp_file}"
rm -f "${tmp_file}"
echo "[OK] Cron jobs installed."
