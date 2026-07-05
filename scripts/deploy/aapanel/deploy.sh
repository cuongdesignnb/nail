#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR=""
REPO=""
BRANCH="main"
DOMAIN=""
APP_PORT="31847"
OWNER_EMAIL=""
LOG_DIR="/var/log/aera-nail"
BACKUP_DIR="/www/backup/aera-nail/postgres"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir) APP_DIR="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    --port) APP_PORT="$2"; shift 2 ;;
    --owner-email) OWNER_EMAIL="$2"; shift 2 ;;
    *) echo "[ERROR] Unknown argument: $1" >&2; exit 1 ;;
  esac
done

[[ -n "${APP_DIR}" ]] || { echo "[ERROR] --app-dir is required" >&2; exit 1; }
[[ -n "${REPO}" ]] || { echo "[ERROR] --repo is required" >&2; exit 1; }
[[ -n "${BRANCH}" ]] || { echo "[ERROR] --branch is required" >&2; exit 1; }
[[ -n "${DOMAIN}" ]] || { echo "[ERROR] --domain is required" >&2; exit 1; }
[[ -n "${APP_PORT}" ]] || { echo "[ERROR] --port is required" >&2; exit 1; }
[[ -n "${OWNER_EMAIL}" ]] || { echo "[ERROR] --owner-email is required" >&2; exit 1; }

mkdir -p "${LOG_DIR}" "${BACKUP_DIR}"
log_file="${LOG_DIR}/deploy-$(date +%Y%m%d_%H%M%S).log"
ln -sfn "${log_file}" "${LOG_DIR}/deploy.log"
find "${LOG_DIR}" -maxdepth 1 -type f -name 'deploy-*.log' -printf "%T@ %p\n" | sort -rn | awk 'NR>30 {print $2}' | xargs -r rm -f
exec > >(tee -a "${log_file}") 2>&1

echo "[INFO] Starting Aera Nail Lounge deployment"

command -v git >/dev/null 2>&1 || { echo "[ERROR] git is required" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "[ERROR] docker is required" >&2; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "[ERROR] Docker Compose v2 is required" >&2; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "[ERROR] openssl is required" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "[ERROR] curl is required" >&2; exit 1; }
command -v gzip >/dev/null 2>&1 || { echo "[ERROR] gzip is required" >&2; exit 1; }
command -v flock >/dev/null 2>&1 || { echo "[ERROR] flock is required" >&2; exit 1; }

first_deploy=0
backup_done=0
if [[ ! -d "${APP_DIR}/.git" ]]; then
  first_deploy=1
  mkdir -p "${APP_DIR}"
  cd "${APP_DIR}"
  echo "[INFO] Initializing Git in existing aaPanel root ${APP_DIR}"
  git init
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "${REPO}"
  git fetch --depth=1 origin "${BRANCH}"
  git checkout -B "${BRANCH}" "origin/${BRANCH}"
  git reset --hard "origin/${BRANCH}"
else
  echo "[INFO] Existing repository found"
fi

cd "${APP_DIR}"
git config --global --add safe.directory "${APP_DIR}" >/dev/null 2>&1 || true
mkdir -p .deploy

previous_commit=""
if [[ "${first_deploy}" -eq 0 ]]; then
  previous_commit="$(git rev-parse HEAD)"
  if [[ -f .deploy/current-release.env ]]; then
    cp .deploy/current-release.env .deploy/previous-release.env
  else
    cat > .deploy/previous-release.env <<EOF
DEPLOYED_AT=
COMMIT_SHA=${previous_commit}
BRANCH=${BRANCH}
DOMAIN=${DOMAIN}
APP_PORT=${APP_PORT}
EOF
  fi

  if [[ -f .env.production && -f docker-compose.production.yml && -f scripts/deploy/aapanel/backup-postgres.sh ]] && docker inspect aera-postgres >/dev/null 2>&1; then
    export APP_DIR BACKUP_DIR
    "${APP_DIR}/scripts/deploy/aapanel/backup-postgres.sh"
    backup_done=1
  else
    echo "[INFO] Existing deployment backup skipped because production compose, env, or PostgreSQL container is not ready"
  fi

  echo "[INFO] Fetching ${BRANCH}"
  git fetch origin "${BRANCH}"
  git checkout "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
fi

COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
ENV_FILE="${APP_DIR}/.env.production"

generate_secret() {
  openssl rand -base64 32 | tr -d '\n'
}

generate_hex_secret() {
  openssl rand -hex 24 | tr -d '\n'
}

set_env_value() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" "${ENV_FILE}"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "${ENV_FILE}"
  else
    printf '%s=%s\n' "${key}" "${value}" >> "${ENV_FILE}"
  fi
}

ensure_secret() {
  local key="$1"
  local current
  current="$(grep -E "^${key}=" "${ENV_FILE}" | tail -n1 | cut -d= -f2- || true)"
  if [[ -z "${current}" ]]; then
    if [[ "${key}" == "POSTGRES_PASSWORD" ]]; then
      set_env_value "${key}" "$(generate_hex_secret)"
    else
      set_env_value "${key}" "$(generate_secret)"
    fi
  fi
}

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[INFO] Creating .env.production from template"
  cp .env.production.example "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"
fi

set_env_value APP_ENV production
set_env_value APP_DOMAIN "${DOMAIN}"
set_env_value APP_PORT "${APP_PORT}"
set_env_value NEXT_PUBLIC_SITE_URL "https://${DOMAIN}"
set_env_value NEXTAUTH_URL "https://${DOMAIN}"
set_env_value BOOTSTRAP_OWNER_EMAIL "${OWNER_EMAIL}"
set_env_value STORAGE_PROVIDER "$(grep -E '^STORAGE_PROVIDER=' "${ENV_FILE}" | cut -d= -f2- || echo local)"

ensure_secret POSTGRES_PASSWORD
ensure_secret NEXTAUTH_SECRET
ensure_secret AUTH_SECRET
ensure_secret CRON_SECRET
ensure_secret PAYMENT_SETTINGS_ENCRYPTION_KEY
ensure_secret APP_SECRETS_ENCRYPTION_KEY
chmod 600 "${ENV_FILE}"

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

export APP_DIR BACKUP_DIR
commit_sha="$(git rev-parse HEAD)"
export WEB_IMAGE="aera-nail-web:${commit_sha}"
export MIGRATOR_IMAGE="aera-nail-migrator:${commit_sha}"
export JOBS_IMAGE="aera-nail-jobs:${commit_sha}"

echo "[INFO] Building migrator and jobs images"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" build migrate jobs

echo "[INFO] Starting PostgreSQL"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d postgres

echo "[INFO] Waiting for PostgreSQL health"
for i in $(seq 1 40); do
  postgres_health="$(docker inspect -f '{{.State.Health.Status}}' aera-postgres 2>/dev/null || true)"
  [[ "${postgres_health}" == "healthy" ]] && break
  sleep 3
  if [[ "${i}" == "40" ]]; then
    echo "[ERROR] PostgreSQL healthcheck failed" >&2
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=200 postgres
    exit 1
  fi
done

if [[ "${first_deploy}" -eq 1 ]]; then
  echo "[INFO] Skipping pre-migration backup on first deployment before data exists"
elif [[ "${backup_done}" -eq 0 ]]; then
  echo "[INFO] Creating PostgreSQL backup before migration"
  "${APP_DIR}/scripts/deploy/aapanel/backup-postgres.sh"
  backup_done=1
fi

echo "[INFO] Initializing persistent volumes"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm init-volumes

echo "[INFO] Running Prisma migrations"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm migrate

if [[ "${RUN_PRODUCTION_BOOTSTRAP:-0}" == "1" ]]; then
  "${APP_DIR}/scripts/deploy/aapanel/bootstrap-production.sh" --app-dir "${APP_DIR}"
fi

echo "[INFO] Building web image after schema migration"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" build web

if [[ "${RUN_PRODUCTION_DATA_MIGRATIONS:-0}" == "1" ]]; then
  echo "[INFO] Running approved idempotent production data migrations"
  data_scripts=(
    "data:migrate-content-hub"
    "data:migrate-navigation"
    "data:migrate-brand-logo"
    "data:migrate-images-to-library"
    "data:migrate-static-seo"
  )
  for script in "${data_scripts[@]}"; do
    echo "[INFO] Running npm run ${script}"
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm jobs npm run "${script}"
  done
fi

echo "[INFO] Starting web service"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d web

echo "[INFO] Waiting for health endpoint"
for i in $(seq 1 60); do
  if curl --fail --silent --show-error "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 3
  if [[ "${i}" == "60" ]]; then
    echo "[ERROR] Web healthcheck failed" >&2
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=200 web
    exit 1
  fi
done

cat > .deploy/current-release.env <<EOF
DEPLOYED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
COMMIT_SHA=${commit_sha}
BRANCH=${BRANCH}
DOMAIN=${DOMAIN}
APP_PORT=${APP_PORT}
WEB_IMAGE=${WEB_IMAGE}
MIGRATOR_IMAGE=${MIGRATOR_IMAGE}
JOBS_IMAGE=${JOBS_IMAGE}
EOF

"${APP_DIR}/scripts/deploy/aapanel/healthcheck.sh" --app-dir "${APP_DIR}" --domain "${DOMAIN}" --port "${APP_PORT}" --commit "${commit_sha}"

if [[ "${INSTALL_CRON_JOBS:-0}" == "1" ]]; then
  "${APP_DIR}/scripts/deploy/aapanel/install-cron.sh" --app-dir "${APP_DIR}"
fi

echo "[OK] Deployment complete"
echo "[OK] Public URL: https://${DOMAIN}"
echo "[OK] Internal app: http://127.0.0.1:${APP_PORT}"
echo "[OK] Commit: ${commit_sha}"
