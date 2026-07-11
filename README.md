# Aera Nail Lounge

Luxury nail salon website, booking flow and admin operations dashboard built with Next.js App Router.

## Included

- Public website pages: home, about, services, service detail, packages, gallery, promotions, contact and blog.
- Five-step booking flow with service, add-ons, technician, date/time, customer details and confirmation.
- API routes for public data, bookings, availability, admin dashboard, bookings, customers, services, technicians, inventory and reports.
- Admin dashboard with sidebar, KPI cards, revenue/status widgets, schedule, booking table and module pages.
- File-backed booking store for Docker local persistence at `.data/bookings.json`.
- Prisma schema and seed script prepared for PostgreSQL.
- Dockerfile and docker-compose with PostgreSQL and Next.js app.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run lint
npm run build
```

## Docker Deploy

```bash
cp .env.example .env
docker compose up --build -d
```

Open `http://localhost:39487`.

Useful commands:

```bash
docker compose logs -f web
docker compose down
```

## aaPanel Production Deploy

Production uses a separate Docker Compose file and binds Next.js only to localhost:

```txt
127.0.0.1:31847
```

On Windows, copy `deploy\production.config.bat.example` to `deploy\production.config.bat`, set the SSH host and owner email, then run:

```bat
deploy\deploy-production.bat
```

The server root is `/www/wwwroot/aeranails.com`; the deploy script initializes or updates Git in that existing aaPanel root and preserves untracked aaPanel files such as `.well-known`, `.htaccess`, `.user.ini`, `404.html`, `502.html`, and `index.html`. See `docs/DEPLOY_AAPANEL_DOCKER.md` for reverse proxy, backup, rollback, restore, cron, and healthcheck instructions.

Never run `docker compose down -v` in production.

## Prisma

The Prisma schema targets PostgreSQL. The current app also includes a file-backed booking store so Docker can run immediately without blocking on migrations.

`npm run prisma:seed` is only for a completely fresh local or staging database. It is non-destructive and skips when admin-editable data already exists. Production deployment must use `prisma migrate deploy` only and must never run the seeder.

```bash
npx prisma db push
npm run prisma:seed
```

Default seeded admin:

- Email: `admin@aeranailounge.com`
- Password: `AeraAdmin123!`

## Environment

## Transactional Email and Gift Cards

Gift Cards are email-only and PayPal is used only for Gift Card purchases. Normal bookings remain payment-at-salon.

Configure SMTP from `Admin > Settings > Email & SMTP`, then test the connection before enabling public Gift Card checkout. See:

- `docs/SMTP_EMAIL_CONFIGURATION.md`
- `docs/GIFT_CARD_EMAIL_FLOW.md`

Retry failed transactional emails with:

```bash
npm run jobs:retry-transactional-emails
```

See `.env.example` for database, auth, Stripe, Resend, Twilio and R2 variables.
