import { z } from "zod";

export const BUSINESS_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export const DEFAULT_BUSINESS_HOURS = BUSINESS_DAYS.map((day) => ({
  day,
  isOpen: day !== "Sunday",
  startTime: day === "Saturday" || day === "Sunday" ? "10:00" : "09:00",
  endTime: day === "Saturday" || day === "Sunday" ? "18:00" : "19:00",
}));

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid 24-hour time.");

const daySchema = z.object({
  day: z.enum(BUSINESS_DAYS),
  isOpen: z.boolean(),
  startTime: timeSchema,
  endTime: timeSchema,
}).superRefine((value, context) => {
  if (value.isOpen && value.endTime <= value.startTime) {
    context.addIssue({ code: "custom", path: ["endTime"], message: "Closing time must be after opening time." });
  }
});

export const businessHoursSettingsSchema = z.object({
  businessHours: z.array(daySchema).length(7, "Exactly seven days are required."),
}).superRefine((value, context) => {
  const seen = new Set(value.businessHours.map((entry) => entry.day));
  if (seen.size !== BUSINESS_DAYS.length || BUSINESS_DAYS.some((day) => !seen.has(day))) {
    context.addIssue({ code: "custom", path: ["businessHours"], message: "All seven unique weekdays are required." });
  }
});

export type BusinessHoursInput = z.infer<typeof businessHoursSettingsSchema>;

export function canonicalizeBusinessHours(hours: BusinessHoursInput["businessHours"]) {
  const byDay = new Map(hours.map((entry) => [entry.day, entry]));
  return BUSINESS_DAYS.map((day) => byDay.get(day)!);
}

function formatTime(time: string) {
  const [hourText, minutes] = time.split(":");
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

export function buildBusinessHoursSummary(hours: BusinessHoursInput["businessHours"]) {
  const groups = new Map<string, string[]>();
  for (const entry of canonicalizeBusinessHours(hours)) {
    const label = entry.isOpen
      ? `${formatTime(entry.startTime)} – ${formatTime(entry.endTime)}`
      : "Closed";
    groups.set(label, [...(groups.get(label) ?? []), entry.day.slice(0, 3)]);
  }
  return Array.from(groups.entries()).map(([label, days]) => `${days.join(", ")}: ${label}`).join(" | ");
}
