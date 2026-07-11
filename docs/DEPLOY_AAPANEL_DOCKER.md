# Aera Nail Lounge aaPanel Docker Deployment

> Production safety: always back up PostgreSQL before migrations. Production deploys run `prisma migrate deploy` and never run `npm run prisma:seed`. Never use `prisma migrate reset`, `prisma db push`, or `docker compose down -v` against production.

Production domain: `aeranails.com`
Production root: `/www/wwwroot/aeranails.com`
Internal app target: `http://127.0.0.1:31847`

## Server Requirements

- aaPanel with an existing Website for `aeranails.com`.
- SSL managed by aaPanel Nginx.
- SSH key access from the Windows deployment machine.
- Server commands available: `git`, `docker`, Docker Compose v2, `openssl`, `curl`, `gzip`, and `flock`.
- Do not open firewall ports `31847` or `5432`.

Never run `docker compose down -v` in production. That can delete persistent database and upload volumes.

## aaPanel Website And SSL

Create or keep the aaPanel Website rooted at:

```txt
/www/wwwroot/aeranails.com
```

Keep aaPanel files in that root, including `.well-known/`, `.htaccess`, `.user.ini`, `404.html`, `502.html`, and `index.html`. The deployment script initializes Git inside this same root when needed and does not clone into a nested folder.

Enable SSL in aaPanel for `aeranails.com` before or after deployment. aaPanel Nginx owns TLS; Docker only serves localhost HTTP.

## Reverse Proxy

In aaPanel Website -> Reverse Proxy, target:

```txt
http://127.0.0.1:31847
```

Use the example in:

```txt
scripts/deploy/aapanel/nginx-reverse-proxy.conf.example
```

Required proxy headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Windows One-Command Deploy

Copy:

```bat
deploy\production.config.bat.example
```

to:

```bat
deploy\production.config.bat
```

Set:

```bat
set DEPLOY_HOST=YOUR_SERVER_IP
set DEPLOY_PORT=22
set DEPLOY_USER=root
set APP_DIR=/www/wwwroot/aeranails.com
set APP_DOMAIN=aeranails.com
set APP_PORT=31847
set APP_BRANCH=main
set GIT_REPO=https://github.com/cuongdesignnb/nail.git
set BOOTSTRAP_OWNER_EMAIL=owner@example.com
```

Run first deploy and normal update deploy with the same command:

```bat
deploy\deploy-production.bat
```

## First Owner Bootstrap

Edit server `.env.production` after first deploy creates it:

```env
RUN_PRODUCTION_BOOTSTRAP=1
BOOTSTRAP_OWNER_EMAIL=owner@example.com
```

Run `deploy\deploy-production.bat` again. Bootstrap runs only when the `User` table is empty, prints a strong one-time Owner password once, saves a temporary protected file at:

```txt
/www/wwwroot/aeranails.com/.deploy/initial-owner-credentials.txt
```

Remove that file after first login.

## Healthcheck

Local server check:

```bash
curl --fail --silent --show-error http://127.0.0.1:31847/api/health
```

Full deployment check:

```bash
cd /www/wwwroot/aeranails.com
scripts/deploy/aapanel/healthcheck.sh --app-dir /www/wwwroot/aeranails.com --domain aeranails.com --port 31847
```

## Docker Logs

```bash
cd /www/wwwroot/aeranails.com
docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production ps
docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production logs -f web
docker compose -p aera_nail -f docker-compose.production.yml --env-file .env.production logs -f postgres
```

PostgreSQL has no public port. Web binds only to `127.0.0.1:31847`.

## Database Backup

Deployment creates a PostgreSQL backup before migrations on existing deployments.

Manual backup:

```bash
APP_DIR=/www/wwwroot/aeranails.com /www/wwwroot/aeranails.com/scripts/deploy/aapanel/backup-postgres.sh
```

Backups are stored in:

```txt
/www/backup/aera-nail/postgres/
```

The latest 14 backups are retained.

## Rollback

Run from Windows:

```bat
deploy\rollback-production.bat
```

Rollback resets code to the previous recorded commit and reuses the previous tagged Docker image when available. Database migrations are not reversed automatically.

## Database Restore Warning

Restore is destructive and never runs automatically. Use it only when a backup must be restored:

```bash
APP_DIR=/www/wwwroot/aeranails.com \
/www/wwwroot/aeranails.com/scripts/deploy/aapanel/restore-postgres.sh \
/www/backup/aera-nail/postgres/aera_nail_YYYYMMDD_HHMMSS.sql.gz
```

You must type:

```txt
RESTORE_AERA_DATABASE
```

## Cron Jobs

Set in `.env.production`:

```env
INSTALL_CRON_JOBS=1
```

Then run:

```bash
/www/wwwroot/aeranails.com/scripts/deploy/aapanel/install-cron.sh --app-dir /www/wwwroot/aeranails.com
```

Installed jobs use `flock` and Docker Compose `jobs` service for AI content, scheduled blog publishing, PayPal reconciliation, and daily database backup.
