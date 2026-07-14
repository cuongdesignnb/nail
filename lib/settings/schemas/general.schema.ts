import { z } from "zod";

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "VND", "CAD", "AUD"] as const;

function isIanaTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return value.includes("/");
  } catch {
    return false;
  }
}

export const generalSettingsSchema = z.object({
  timezone: z.string().trim().refine(isIanaTimezone, "Select a supported IANA timezone."),
  currency: z.string().trim().toUpperCase().pipe(z.enum(SUPPORTED_CURRENCIES)),
});
