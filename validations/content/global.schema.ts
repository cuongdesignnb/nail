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
  alt: z.string().default(""),
  title: z.string().nullable().optional(),
});

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
      .array(navLinkSchema)
      .min(1)
      .max(10)
      .refine(uniqueIds, "Navigation IDs must be unique"),
    cta: buttonFieldSchema,
  }),
  footer: z.object({
    brandText: z.string().trim().max(3000),
    quickLinks: z
      .array(navLinkSchema)
      .max(10)
      .refine(uniqueIds, "Quick link IDs must be unique"),
    serviceLinks: z
      .array(navLinkSchema)
      .max(10)
      .refine(uniqueIds, "Service link IDs must be unique"),
    contact: globalContactSchema,
    newsletter: z.object({
      title: requiredText(120),
      description: requiredText(300),
      placeholder: requiredText(120),
    }),
    copyright: requiredText(160),
  }),
  socialLinks: z.object({
    instagramUrl: hrefSchema,
    facebookUrl: hrefSchema,
    tiktokUrl: hrefSchema,
  }),
  defaultContact: globalContactSchema.extend({
    website: optionalText(500),
    hours: optionalText(500),
  }).passthrough(),
  businessHours: z.array(z.object({
    day: requiredText(20),
    isOpen: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }).passthrough()).max(7).optional(),
  bookingPolicies: z.object({
    minAdvanceHours: z.coerce.number().int().min(0),
    maxAdvanceDays: z.coerce.number().int().min(1),
    cancellationWindowHours: z.coerce.number().int().min(0),
    bufferMinutes: z.coerce.number().int().min(0),
  }).passthrough().optional(),
  defaultShareImage: imageFieldSchema,
}).passthrough();

export type GlobalContentInput = z.infer<typeof globalContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const globalContentDraftSchema = makeDraftSchema(globalContentSchema);

export type GlobalContentDraftInput = z.infer<
  typeof globalContentDraftSchema
>;
