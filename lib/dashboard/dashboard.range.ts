// ---------------------------------------------------------------------------
// Date-range builder – timezone-aware via date-fns-tz
// ---------------------------------------------------------------------------

import { z } from 'zod';
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  differenceInDays,
  format,
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

import type { DateRange, DateRangeKey } from './dashboard.types';

// ---------------------------------------------------------------------------
// Zod schema for validating dashboard query params
// ---------------------------------------------------------------------------

export const dateRangeQuerySchema = z.object({
  range: z
    .enum(['today', '7d', '30d', 'month', 'year', 'custom'])
    .default('today'),
  from: z.string().optional(),
  to: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildDateRange(
  key: DateRangeKey,
  timezone: string,
  customFrom?: string,
  customTo?: string,
): DateRange {
  // "now" in the business timezone
  const nowUtc = new Date();
  const nowZoned = toZonedTime(nowUtc, timezone);

  let from: Date;
  let to: Date;
  let previousFrom: Date;
  let previousTo: Date;
  let label: string;

  switch (key) {
    case 'today': {
      from = fromZonedTime(startOfDay(nowZoned), timezone);
      to = fromZonedTime(endOfDay(nowZoned), timezone);

      const yesterdayZoned = subDays(nowZoned, 1);
      previousFrom = fromZonedTime(startOfDay(yesterdayZoned), timezone);
      previousTo = fromZonedTime(endOfDay(yesterdayZoned), timezone);

      label = format(nowZoned, 'MMM d, yyyy');
      break;
    }

    case '7d': {
      to = nowUtc;
      from = fromZonedTime(startOfDay(subDays(nowZoned, 6)), timezone);
      previousTo = new Date(from.getTime() - 1);
      previousFrom = fromZonedTime(
        startOfDay(subDays(nowZoned, 13)),
        timezone,
      );
      label = `Last 7 days`;
      break;
    }

    case '30d': {
      to = nowUtc;
      from = fromZonedTime(startOfDay(subDays(nowZoned, 29)), timezone);
      previousTo = new Date(from.getTime() - 1);
      previousFrom = fromZonedTime(
        startOfDay(subDays(nowZoned, 59)),
        timezone,
      );
      label = `Last 30 days`;
      break;
    }

    case 'month': {
      const monthStartZoned = startOfMonth(nowZoned);
      const monthEndZoned = endOfMonth(nowZoned);
      from = fromZonedTime(monthStartZoned, timezone);
      to = fromZonedTime(monthEndZoned, timezone);

      const prevMonthZoned = subMonths(nowZoned, 1);
      previousFrom = fromZonedTime(startOfMonth(prevMonthZoned), timezone);
      previousTo = fromZonedTime(endOfMonth(prevMonthZoned), timezone);

      label = format(nowZoned, 'MMMM yyyy');
      break;
    }

    case 'year': {
      const yearStartZoned = startOfYear(nowZoned);
      const yearEndZoned = endOfYear(nowZoned);
      from = fromZonedTime(yearStartZoned, timezone);
      to = fromZonedTime(yearEndZoned, timezone);

      const prevYearZoned = subYears(nowZoned, 1);
      previousFrom = fromZonedTime(startOfYear(prevYearZoned), timezone);
      previousTo = fromZonedTime(endOfYear(prevYearZoned), timezone);

      label = format(nowZoned, 'yyyy');
      break;
    }

    case 'custom': {
      if (!customFrom || !customTo) {
        throw new Error('Custom range requires both "from" and "to" dates.');
      }

      // Parse as local dates in the business timezone
      const fromZoned = toZonedTime(new Date(customFrom), timezone);
      const toZoned = toZonedTime(new Date(customTo), timezone);

      from = fromZonedTime(startOfDay(fromZoned), timezone);
      to = fromZonedTime(endOfDay(toZoned), timezone);

      const durationDays = differenceInDays(to, from) + 1;
      previousTo = new Date(from.getTime() - 1);
      previousFrom = fromZonedTime(
        startOfDay(subDays(fromZoned, durationDays)),
        timezone,
      );

      label = `${format(fromZoned, 'MMM d')} – ${format(toZoned, 'MMM d, yyyy')}`;
      break;
    }

    default: {
      const _exhaustive: never = key;
      throw new Error(`Unknown range key: ${_exhaustive}`);
    }
  }

  return { key, from, to, previousFrom, previousTo, label };
}
