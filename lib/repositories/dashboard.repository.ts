// ---------------------------------------------------------------------------
// Dashboard data repository – all Prisma queries for the admin dashboard
// ---------------------------------------------------------------------------

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { DashboardAppointment } from '@/lib/dashboard/dashboard.types';

// ---------------------------------------------------------------------------
// Prisma include shapes
// ---------------------------------------------------------------------------

const bookingWithRelations = {
  customer: true,
  technician: true,
  items: { include: { service: true } },
} satisfies Prisma.BookingInclude;

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: typeof bookingWithRelations;
}>;

// ---------------------------------------------------------------------------
// Internal mapper
// ---------------------------------------------------------------------------

function mapAppointment(booking: BookingWithRelations): DashboardAppointment {
  return {
    id: booking.id,
    bookingCode: booking.bookingCode,
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
    services: booking.items.map((i) => i.service.name),
    technicianName: booking.technician?.name ?? null,
    scheduledStartAt: booking.scheduledStartAt.toISOString(),
    scheduledEndAt: booking.scheduledEndAt.toISOString(),
    status: booking.status,
    totalAmount: Number(booking.totalAmount),
  };
}

// ---------------------------------------------------------------------------
// KPI queries
// ---------------------------------------------------------------------------

/**
 * Count non-cancelled, non-no-show bookings in a date range.
 */
export async function countAppointments(
  from: Date,
  to: Date,
): Promise<number> {
  return prisma.booking.count({
    where: {
      scheduledStartAt: { gte: from, lte: to },
      status: { notIn: ['Cancelled', 'No Show'] },
    },
  });
}

/**
 * Sum of collected (paid) revenue in a date range.
 * Uses paidAt when available, falls back to createdAt.
 */
export async function sumCollectedRevenue(
  from: Date,
  to: Date,
): Promise<number> {
  const result = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: 'paid',
      OR: [
        { paidAt: { gte: from, lte: to } },
        { paidAt: null, createdAt: { gte: from, lte: to } },
      ],
    },
  });
  return Number(result._sum.amount ?? 0);
}

/**
 * Count customers created within a date range.
 */
export async function countNewClients(
  from: Date,
  to: Date,
): Promise<number> {
  return prisma.customer.count({
    where: { createdAt: { gte: from, lte: to } },
  });
}

/**
 * Average approved review rating in a date range. Returns null if none.
 */
export async function avgRating(
  from: Date,
  to: Date,
): Promise<number | null> {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
    where: {
      approved: true,
      createdAt: { gte: from, lte: to },
    },
  });
  return result._avg.rating ?? null;
}

// ---------------------------------------------------------------------------
// Chart / breakdown queries
// ---------------------------------------------------------------------------

/**
 * Booking counts grouped by status for a date range.
 */
export async function getBookingStatusCounts(
  from: Date,
  to: Date,
): Promise<Array<{ status: string; count: number }>> {
  const groups = await prisma.booking.groupBy({
    by: ['status'],
    _count: { id: true },
    where: { scheduledStartAt: { gte: from, lte: to } },
    orderBy: { _count: { id: 'desc' } },
  });
  return groups.map((g) => ({ status: g.status, count: g._count.id }));
}

/**
 * Revenue series grouped by time period using raw SQL (date_trunc).
 */
export async function getRevenueSeries(
  from: Date,
  to: Date,
  groupBy: 'hour' | 'day' | 'week' | 'month',
): Promise<Array<{ date: string; value: number }>> {
  const rows = await prisma.$queryRaw<
    Array<{ period: Date; total: Prisma.Decimal | null }>
  >(
    Prisma.sql`
      SELECT
        date_trunc(${groupBy}, COALESCE("paidAt", "createdAt")) AS period,
        SUM(amount) AS total
      FROM "Payment"
      WHERE status = 'paid'
        AND COALESCE("paidAt", "createdAt") BETWEEN ${from} AND ${to}
      GROUP BY period
      ORDER BY period
    `,
  );

  return rows.map((r) => ({
    date: r.period.toISOString(),
    value: Number(r.total ?? 0),
  }));
}

// ---------------------------------------------------------------------------
// Schedule / appointment queries
// ---------------------------------------------------------------------------

/**
 * Today's schedule: all non-cancelled bookings for the given day window.
 */
export async function getTodaySchedule(
  todayStart: Date,
  todayEnd: Date,
): Promise<DashboardAppointment[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      scheduledStartAt: { gte: todayStart, lte: todayEnd },
      status: { not: 'Cancelled' },
    },
    include: bookingWithRelations,
    orderBy: { scheduledStartAt: 'asc' },
  });
  return bookings.map(mapAppointment);
}

/**
 * Upcoming appointments (future, not completed / cancelled / no-show).
 */
export async function getUpcomingAppointments(
  fromDate: Date,
  limit: number,
): Promise<DashboardAppointment[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      scheduledStartAt: { gte: fromDate },
      status: { notIn: ['Cancelled', 'No Show', 'Completed'] },
    },
    include: bookingWithRelations,
    orderBy: { scheduledStartAt: 'asc' },
    take: limit,
  });
  return bookings.map(mapAppointment);
}

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

/**
 * Top technicians by completed bookings in date range.
 */
export async function getTopTechnicians(
  from: Date,
  to: Date,
  limit: number,
): Promise<
  Array<{
    id: string;
    name: string;
    avatar: string | null;
    completedAppointments: number;
    bookedValue: number;
    rating: number | null;
  }>
> {
  const technicians = await prisma.technician.findMany({
    where: { isActive: true },
    include: {
      bookings: {
        where: {
          status: 'Completed',
          scheduledStartAt: { gte: from, lte: to },
        },
        select: { totalAmount: true },
      },
    },
  });

  return technicians
    .map((tech) => ({
      id: tech.id,
      name: tech.name,
      avatar: tech.avatar,
      completedAppointments: tech.bookings.length,
      bookedValue: tech.bookings.reduce(
        (sum, b) => sum + Number(b.totalAmount),
        0,
      ),
      rating: Number(tech.rating) || null,
    }))
    .sort((a, b) => b.completedAppointments - a.completedAppointments)
    .slice(0, limit);
}

/**
 * Top services by booking item count in date range.
 */
export async function getTopServices(
  from: Date,
  to: Date,
  limit: number,
): Promise<
  Array<{ id: string; name: string; bookingCount: number; revenue: number }>
> {
  // Use raw SQL for the grouped aggregate – Prisma groupBy can't join easily
  const rows = await prisma.$queryRaw<
    Array<{
      serviceId: string;
      name: string;
      bookingCount: bigint;
      revenue: Prisma.Decimal | null;
    }>
  >(
    Prisma.sql`
      SELECT
        bi."serviceId",
        s."name",
        COUNT(*)::bigint AS "bookingCount",
        SUM(bi."price")  AS "revenue"
      FROM "BookingItem" bi
      JOIN "Booking"  b ON b."id" = bi."bookingId"
      JOIN "Service"  s ON s."id" = bi."serviceId"
      WHERE b."scheduledStartAt" BETWEEN ${from} AND ${to}
        AND b."status" NOT IN ('Cancelled','No Show')
      GROUP BY bi."serviceId", s."name"
      ORDER BY "bookingCount" DESC
      LIMIT ${limit}
    `,
  );

  return rows.map((r) => ({
    id: r.serviceId,
    name: r.name,
    bookingCount: Number(r.bookingCount),
    revenue: Number(r.revenue ?? 0),
  }));
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

/**
 * Inventory items at or below reorder level.
 */
export async function getInventoryAlerts(
  limit: number,
): Promise<
  Array<{
    id: string;
    name: string;
    currentStock: number;
    reorderLevel: number;
    unit: string;
  }>
> {
  const items = await prisma.inventoryItem.findMany({
    where: {
      isActive: true,
      currentStock: { lte: prisma.inventoryItem.fields?.reorderLevel as never },
    },
    orderBy: { currentStock: 'asc' },
    take: limit,
  });

  // Prisma doesn't support column-to-column comparison in `where` natively,
  // so we fall back to raw SQL for the comparison.
  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      currentStock: number;
      reorderLevel: number;
      unit: string;
    }>
  >(
    Prisma.sql`
      SELECT "id", "name", "currentStock", "reorderLevel", "unit"
      FROM "InventoryItem"
      WHERE "isActive" = true
        AND "currentStock" <= "reorderLevel"
      ORDER BY ("currentStock" - "reorderLevel") ASC
      LIMIT ${limit}
    `,
  );

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    currentStock: Number(r.currentStock),
    reorderLevel: Number(r.reorderLevel),
    unit: r.unit,
  }));
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

/**
 * Most recent approved reviews.
 */
export async function getRecentReviews(
  limit: number,
): Promise<
  Array<{
    id: string;
    customer: string;
    rating: number;
    text: string;
    createdAt: string;
  }>
> {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return reviews.map((r) => ({
    id: r.id,
    customer: r.customer,
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt.toISOString(),
  }));
}

// ---------------------------------------------------------------------------
// Service category distribution
// ---------------------------------------------------------------------------

/**
 * BookingItem → Service → ServiceCategory distribution for a date range.
 */
export async function getServiceCategoryDistribution(
  from: Date,
  to: Date,
): Promise<
  Array<{ id: string; name: string; count: number; percentage: number }>
> {
  const rows = await prisma.$queryRaw<
    Array<{ categoryId: string; categoryName: string; cnt: bigint }>
  >(
    Prisma.sql`
      SELECT
        COALESCE(sc."id", 'uncategorized')  AS "categoryId",
        COALESCE(sc."name", 'Uncategorized') AS "categoryName",
        COUNT(*)::bigint AS cnt
      FROM "BookingItem" bi
      JOIN "Booking"  b  ON b."id"  = bi."bookingId"
      JOIN "Service"  s  ON s."id"  = bi."serviceId"
      LEFT JOIN "ServiceCategory" sc ON sc."id" = s."categoryId"
      WHERE b."scheduledStartAt" BETWEEN ${from} AND ${to}
        AND b."status" NOT IN ('Cancelled','No Show')
      GROUP BY sc."id", sc."name"
      ORDER BY cnt DESC
    `,
  );

  const total = rows.reduce((sum, r) => sum + Number(r.cnt), 0);

  return rows.map((r) => ({
    id: r.categoryId,
    name: r.categoryName,
    count: Number(r.cnt),
    percentage: total > 0 ? Math.round((Number(r.cnt) / total) * 1000) / 10 : 0,
  }));
}

// ---------------------------------------------------------------------------
// At-a-glance aggregates
// ---------------------------------------------------------------------------

export async function getAtAGlance(): Promise<{
  totalClients: number;
  activeTechnicians: number;
  activeServices: number;
  activePackages: number;
  activePromotions: number;
  pendingConfirmations: number;
  lowStockItems: number;
}> {
  const [
    totalClients,
    activeTechnicians,
    activeServices,
    activePackages,
    activePromotions,
    pendingConfirmations,
    lowStockItems,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.technician.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.nailPackage.count({ where: { isActive: true } }),
    prisma.promotion.count({ where: { active: true } }),
    prisma.booking.count({ where: { status: 'Pending' } }),
    prisma.$queryRaw<[{ cnt: bigint }]>(
      Prisma.sql`
        SELECT COUNT(*)::bigint AS cnt
        FROM "InventoryItem"
        WHERE "isActive" = true AND "currentStock" <= "reorderLevel"
      `,
    ).then((rows) => Number(rows[0]?.cnt ?? 0)),
  ]);

  return {
    totalClients,
    activeTechnicians,
    activeServices,
    activePackages,
    activePromotions,
    pendingConfirmations,
    lowStockItems,
  };
}

// ---------------------------------------------------------------------------
// Business settings
// ---------------------------------------------------------------------------

export async function getBusinessSettings(): Promise<{
  timezone: string;
  currency: string;
}> {
  const setting = await prisma.businessSetting.findUnique({
    where: { key: 'default' },
  });

  return {
    timezone: setting?.timezone ?? 'America/Los_Angeles',
    currency: setting?.currency ?? 'USD',
  };
}
