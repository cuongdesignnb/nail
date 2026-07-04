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
  contactFieldSchema,
  hrefSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const globalContentSchema = z.object({
  brand: z.object({
    name: requiredText(100),
    logo: imageFieldSchema,
    tagline: requiredText(300),
  }),
  headerNav: z.object({
    items: z
      .array(navLinkSchema)
      .min(1)
      .max(10)
      .refine(uniqueIds, "Navigation IDs must be unique"),
    cta: buttonFieldSchema,
  }),
  footer: z.object({
    brandText: requiredText(500),
    quickLinks: z
      .array(navLinkSchema)
      .max(10)
      .refine(uniqueIds, "Quick link IDs must be unique"),
    serviceLinks: z
      .array(navLinkSchema)
      .max(10)
      .refine(uniqueIds, "Service link IDs must be unique"),
    contact: contactFieldSchema,
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
  defaultContact: contactFieldSchema,
  defaultShareImage: imageFieldSchema,
});

export type GlobalContentInput = z.infer<typeof globalContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const globalContentDraftSchema = makeDraftSchema(globalContentSchema);

export type GlobalContentDraftInput = z.infer<
  typeof globalContentDraftSchema
>;
