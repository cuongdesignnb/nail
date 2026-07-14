import { z } from "zod";

export const bookingPoliciesSettingsSchema = z.object({
  minAdvanceHours: z.coerce.number().int().min(0).max(168),
  maxAdvanceDays: z.coerce.number().int().min(1).max(365),
  cancellationWindowHours: z.coerce.number().int().min(0).max(336),
  bufferMinutes: z.coerce.number().int().min(0).max(120),
});
