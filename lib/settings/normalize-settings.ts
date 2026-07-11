import type { BusinessHour } from "./settings.types";

const DAY_ORDER = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeNullableString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized === "" ? null : normalized;
}

export function normalizeEmail(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

export function normalizeNumber(value: unknown, fallback = 0): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

export function normalizeBusinessHours(value: unknown): BusinessHour[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const row = (entry ?? {}) as Record<string, unknown>;
      return {
        day: normalizeString(row.day),
        isOpen: normalizeBoolean(row.isOpen),
        startTime: normalizeString(row.startTime),
        endTime: normalizeString(row.endTime),
      };
    })
    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}

export function normalizeSettings<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSettings(item)) as T;
  }
  if (value && typeof value === "object") {
    const normalized = Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, normalizeSettings(item)])
    );
    return normalized as T;
  }
  return (typeof value === "string" ? value.trim() : value) as T;
}

export function settingsEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeSettings(left)) === JSON.stringify(normalizeSettings(right));
}

