/**
 * Validation schema for GlobalContent.
 * Validates the shared global content (brand, header nav, footer, social links).
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  imageFieldSchema,
  buttonFieldSchema,
  navLinkSchema,
  hrefSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

export const mediaReferenceSchema = z.object({
  mediaId: z.string().nullable().optional(),
  src: z.string().trim().min(1),
  alt: requiredText(160),
  title: z.string().nullable().optional(),
}).passthrough();

const legacyCompatibleMediaReferenceSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim()
      ? { mediaId: null, src: value.trim(), alt: "", title: null }
      : value,
  mediaReferenceSchema.nullable(),
);

const globalContactSchema = z.object({
  phone: z.string().trim().max(40),
  email: z.union([z.literal(""), z.string().trim().email().max(160)]),
  address: z.string().trim().max(300),
  hours: z.string().trim().max(500),
}).passthrough();

const globalNavLinkSchema = navLinkSchema.passthrough();
const globalButtonSchema = buttonFieldSchema.passthrough();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid 24-hour time.");
const businessDays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;
const globalBusinessHourSchema = z.object({
  day: z.enum(businessDays),
  isOpen: z.boolean(),
  startTime: timeSchema,
  endTime: timeSchema,
}).passthrough().superRefine((value, context) => {
  if (value.isOpen && value.startTime >= value.endTime) {
    context.addIssue({ code: "custom", path: ["endTime"], message: "Closing time must be after opening time." });
  }
});

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const globalContentSchema = z.object({
  brand: z.object({
    name: requiredText(100),
    logo: legacyCompatibleMediaReferenceSchema,
    favicon: legacyCompatibleMediaReferenceSchema.optional(),
    tagline: requiredText(300),
  }).passthrough(),
  headerNav: z.object({
    items: z
      .array(globalNavLinkSchema)
      .min(1)
      .max(10)
      .refine(uniqueIds, "Navigation IDs must be unique"),
    cta: globalButtonSchema,
  }).passthrough(),
  footer: z.object({
    brandText: z.string().trim().max(3000),
    quickLinks: z
      .array(globalNavLinkSchema)
      .max(10)
      .refine(uniqueIds, "Quick link IDs must be unique"),
    serviceLinks: z
      .array(globalNavLinkSchema)
      .max(10)
      .refine(uniqueIds, "Service link IDs must be unique"),
    contact: globalContactSchema,
    newsletter: z.object({
      title: requiredText(120),
      description: requiredText(300),
      placeholder: requiredText(120),
    }).passthrough(),
    copyright: requiredText(160),
  }).passthrough(),
  socialLinks: z.object({
    instagramUrl: hrefSchema,
    facebookUrl: hrefSchema,
    tiktokUrl: hrefSchema,
  }).passthrough(),
  defaultContact: globalContactSchema.extend({
    website: optionalText(500),
  }).passthrough(),
  businessHours: z.array(globalBusinessHourSchema).length(7).superRefine((hours, context) => {
    const seen = new Set(hours.map((entry) => entry.day));
    if (seen.size !== businessDays.length || businessDays.some((day) => !seen.has(day))) {
      context.addIssue({ code: "custom", message: "All seven unique weekdays are required." });
    }
  }),
  bookingPolicies: z.object({
    minAdvanceHours: z.coerce.number().int().min(0),
    maxAdvanceDays: z.coerce.number().int().min(1),
    cancellationWindowHours: z.coerce.number().int().min(0),
    bufferMinutes: z.coerce.number().int().min(0),
  }).passthrough(),
  defaultShareImage: imageFieldSchema.passthrough(),
}).passthrough();

export type GlobalContentInput = z.infer<typeof globalContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const globalContentDraftSchema = makeDraftSchema(globalContentSchema);

export type GlobalContentDraftInput = z.infer<
  typeof globalContentDraftSchema
>;
