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
COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
CREDS_FILE="${APP_DIR}/.deploy/initial-owner-credentials.txt"

[[ -f "${ENV_FILE}" ]] || { echo "[ERROR] Missing ${ENV_FILE}" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ "${RUN_PRODUCTION_BOOTSTRAP:-0}" != "1" ]]; then
  echo "[INFO] RUN_PRODUCTION_BOOTSTRAP is not 1. Bootstrap skipped."
  exit 0
fi

if [[ ! "${BOOTSTRAP_OWNER_EMAIL:-}" =~ ^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$ ]]; then
  echo "[ERROR] BOOTSTRAP_OWNER_EMAIL must be a valid email." >&2
  exit 1
fi

cd "${APP_DIR}"
mkdir -p .deploy

password="$(openssl rand -hex 16)"

export BOOTSTRAP_OWNER_PASSWORD="${password}"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm jobs npm run production:bootstrap
unset BOOTSTRAP_OWNER_PASSWORD

cat > "${CREDS_FILE}" <<EOF
Aera Nail Lounge initial Owner credentials

Email: ${BOOTSTRAP_OWNER_EMAIL}
Password: ${password}

Remove this file after first login:
rm -f ${CREDS_FILE}
EOF
chmod 600 "${CREDS_FILE}"

sed -i 's|^RUN_PRODUCTION_BOOTSTRAP=.*|RUN_PRODUCTION_BOOTSTRAP=0|' "${ENV_FILE}"
chmod 600 "${ENV_FILE}"

echo "[OK] Initial Owner created."
echo "[OK] Email: ${BOOTSTRAP_OWNER_EMAIL}"
echo "[OK] Password: ${password}"
echo "[WARN] Password printed once. Remove ${CREDS_FILE} after first login."
