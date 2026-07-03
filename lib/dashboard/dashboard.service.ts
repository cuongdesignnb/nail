// ---------------------------------------------------------------------------
// Dashboard service – orchestrates all repository calls into a single overview
// ---------------------------------------------------------------------------

import { format, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import type {
  DateRangeKey,
  DashboardOverview,
} from './dashboard.types';
import { buildDateRange } from './dashboard.range';
import { buildKpi, formatCurrency } from './dashboard.mapper';

import {
  countAppointments,
  sumCollectedRevenue,
  countNewClients,
  avgRating,
  getBookingStatusCounts,
  getRevenueSeries,
  getTodaySchedule,
  getUpcomingAppointments,
  getTopTechnicians,
  getTopServices,
  getInventoryAlerts,
  getRecentReviews,
  getServiceCategoryDistribution,
  getAtAGlance,
  getBusinessSettings,
} from '@/lib/repositories/dashboard.repository';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveGroupBy(
  days: number,
): 'hour' | 'day' | 'week' | 'month' {
  if (days <= 1) return 'hour';
  if (days <= 30) return 'day';
  if (days <= 365) return 'day';
  return 'month';
}

function formatSeriesLabel(
  isoDate: string,
  groupBy: 'hour' | 'day' | 'week' | 'month',
  timezone: string,
): string {
  const zoned = toZonedTime(new Date(isoDate), timezone);
  switch (groupBy) {
    case 'hour':
      return format(zoned, 'h:mm a');
    case 'day':
      return format(zoned, 'MMM d');
    case 'week':
      return `Week of ${format(zoned, 'MMM d')}`;
    case 'month':
      return format(zoned, 'MMM yyyy');
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function getDashboardOverview(
  rangeKey: DateRangeKey,
  customFrom?: string,
  customTo?: string,
): Promise<DashboardOverview> {
  // 1. Business settings
  const { timezone, currency } = await getBusinessSettings();

  // 2. Date range
  const range = buildDateRange(rangeKey, timezone, customFrom, customTo);

  const rangeDays = differenceInDays(range.to, range.from) + 1;
  const groupBy = resolveGroupBy(rangeDays);

  // 3. Today boundaries (for schedule widget)
  const nowUtc = new Date();
  const todayRange = buildDateRange('today', timezone);

  // 4. Run all queries in parallel
  const [
    // Current KPIs
    appointmentsCurrent,
    revenueCurrent,
    newClientsCurrent,
    avgRatingCurrent,
    // Previous KPIs
    appointmentsPrevious,
    revenuePrevious,
    newClientsPrevious,
    avgRatingPrevious,
    // Charts & lists
    revenueSeries,
    bookingStatus,
    todaySchedule,
    upcomingAppointments,
    topTechnicians,
    topServices,
    inventoryAlerts,
    recentReviews,
    serviceCategoryDistribution,
    atAGlance,
  ] = await Promise.all([
    // Current period
    countAppointments(range.from, range.to),
    sumCollectedRevenue(range.from, range.to),
    countNewClients(range.from, range.to),
    avgRating(range.from, range.to),
    // Previous period
    countAppointments(range.previousFrom, range.previousTo),
    sumCollectedRevenue(range.previousFrom, range.previousTo),
    countNewClients(range.previousFrom, range.previousTo),
    avgRating(range.previousFrom, range.previousTo),
    // Charts
    getRevenueSeries(range.from, range.to, groupBy),
    getBookingStatusCounts(range.from, range.to),
    // Schedule
    getTodaySchedule(todayRange.from, todayRange.to),
    getUpcomingAppointments(nowUtc, 10),
    // Leaderboards
    getTopTechnicians(range.from, range.to, 5),
    getTopServices(range.from, range.to, 5),
    // Alerts & misc
    getInventoryAlerts(10),
    getRecentReviews(5),
    getServiceCategoryDistribution(range.from, range.to),
    getAtAGlance(),
  ]);

  // 5. Build KPIs
  const currencyFormatter = (v: number) => formatCurrency(v, currency);
  const intFormatter = (v: number) => v.toLocaleString('en-US');
  const ratingFormatter = (v: number) =>
    v === 0 ? '—' : v.toFixed(1);

  const kpis = {
    appointments: buildKpi(
      'Appointments',
      appointmentsCurrent,
      appointmentsPrevious,
      intFormatter,
    ),
    collectedRevenue: buildKpi(
      'Collected Revenue',
      revenueCurrent,
      revenuePrevious,
      currencyFormatter,
    ),
    newClients: buildKpi(
      'New Clients',
      newClientsCurrent,
      newClientsPrevious,
      intFormatter,
    ),
    averageRating: buildKpi(
      'Average Rating',
      avgRatingCurrent ?? 0,
      avgRatingPrevious ?? 0,
      ratingFormatter,
    ),
  };

  // 6. Enrich revenue series with labels
  const enrichedRevenueSeries = revenueSeries.map((point) => ({
    ...point,
    label: formatSeriesLabel(point.date, groupBy, timezone),
  }));

  // 7. Assemble response
  return {
    meta: {
      range: {
        key: range.key,
        from: range.from.toISOString(),
        to: range.to.toISOString(),
        timezone,
        currency,
      },
      generatedAt: new Date().toISOString(),
    },
    kpis,
    revenueSeries: enrichedRevenueSeries,
    bookingStatus,
    todaySchedule,
    upcomingAppointments,
    topTechnicians,
    topServices,
    inventoryAlerts,
    recentReviews,
    serviceCategoryDistribution,
    atAGlance,
  };
}
