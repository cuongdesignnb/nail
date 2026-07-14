import { addHours, addDays } from "date-fns";
import type { BookingPolicies } from "./settings.types";

export function validateBookingWindow(input: {
  start: Date;
  now: Date;
  policies: BookingPolicies;
}) {
  if (input.start < addHours(input.now, input.policies.minAdvanceHours)) {
    return { valid: false, reason: "MIN_ADVANCE" as const };
  }
  if (input.start > addDays(input.now, input.policies.maxAdvanceDays)) {
    return { valid: false, reason: "MAX_ADVANCE" as const };
  }
  return { valid: true, reason: null };
}

export function isCancellationAllowed(input: {
  scheduledStart: Date;
  now: Date;
  policies: BookingPolicies;
}) {
  return input.scheduledStart.getTime() - input.now.getTime()
    >= input.policies.cancellationWindowHours * 3_600_000;
}
