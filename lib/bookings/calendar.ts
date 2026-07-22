import { addDays, format, isValid, parseISO, startOfDay, startOfWeek } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type BookingCalendarRange = {
  fromUtc: Date;
  toUtc: Date;
  weekStart: string;
  weekEnd: string;
};

export function buildBookingCalendarRange(
  requestedWeek: string,
  timeZone: string,
  now = new Date(),
): BookingCalendarRange {
  let zonedDate: Date;
  if (requestedWeek === "current") {
    zonedDate = toZonedTime(now, timeZone);
  } else {
    if (!DATE_KEY_PATTERN.test(requestedWeek)) throw new Error("INVALID_CALENDAR_WEEK");
    zonedDate = parseISO(requestedWeek);
    if (!isValid(zonedDate) || format(zonedDate, "yyyy-MM-dd") !== requestedWeek) {
      throw new Error("INVALID_CALENDAR_WEEK");
    }
  }

  const weekStartZoned = startOfWeek(startOfDay(zonedDate), { weekStartsOn: 1 });
  const weekEndExclusiveZoned = addDays(weekStartZoned, 7);
  return {
    fromUtc: fromZonedTime(weekStartZoned, timeZone),
    toUtc: fromZonedTime(weekEndExclusiveZoned, timeZone),
    weekStart: format(weekStartZoned, "yyyy-MM-dd"),
    weekEnd: format(addDays(weekStartZoned, 6), "yyyy-MM-dd"),
  };
}

export function bookingCalendarPosition(isoDate: string, timeZone: string) {
  const zoned = toZonedTime(parseISO(isoDate), timeZone);
  return {
    dateKey: format(zoned, "yyyy-MM-dd"),
    hour: zoned.getHours(),
    minute: zoned.getMinutes(),
    zoned,
  };
}
