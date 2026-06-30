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

## Prisma

The Prisma schema targets PostgreSQL. The current app also includes a file-backed booking store so Docker can run immediately without blocking on migrations.

```bash
npx prisma db push
npm run prisma:seed
```

Default seeded admin:

- Email: `admin@aeranailounge.com`
- Password: `AeraAdmin123!`

## Environment

See `.env.example` for database, auth, Stripe, Resend, Twilio and R2 variables.
