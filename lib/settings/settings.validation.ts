import { z } from "zod";
import { generalSettingsSchema } from "./schemas/general.schema";

export const businessSettingsSchema = generalSettingsSchema;

export const businessHoursSchema = z.array(z.object({
  day: z.string().trim().min(1),
  isOpen: z.boolean(),
  startTime: z.string().trim(),
  endTime: z.string().trim(),
})).length(7);

export const bookingPoliciesSchema = z.object({
  minAdvanceHours: z.coerce.number().int().min(0),
  maxAdvanceDays: z.coerce.number().int().min(1),
  cancellationWindowHours: z.coerce.number().int().min(0),
  bufferMinutes: z.coerce.number().int().min(0),
});
