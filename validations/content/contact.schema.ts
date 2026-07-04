/**
 * Validation schema for ContactPageContent.
 * Validates hero, contact info, opening hours, map, form config,
 * social links, FAQ, and CTA.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  seoFieldsSchema,
  heroFieldsSchema,
  ctaFieldsSchema,
  faqItemSchema,
  hrefSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const contactPageContentSchema = z.object({
  seo: seoFieldsSchema,
  hero: heroFieldsSchema,
  contactInfo: z.object({
    phone: requiredText(40),
    email: requiredText(160),
    address: requiredText(300),
    googleMapsUrl: z.string().url(),
  }),
  openingHours: z.object({
    title: requiredText(160),
    schedule: z
      .array(
        z.object({
          id: requiredText(80),
          days: requiredText(80),
          hours: requiredText(80),
        }),
      )
      .min(1)
      .max(7)
      .refine(uniqueIds, "Schedule IDs must be unique"),
  }),
  mapLocation: z.object({
    title: requiredText(160),
    googleMapsEmbedUrl: z.string().url(),
  }),
  contactForm: z.object({
    title: requiredText(160),
    description: requiredText(500),
    submitLabel: requiredText(60),
  }),
  socialLinks: z.object({
    instagramUrl: hrefSchema,
    facebookUrl: hrefSchema,
    tiktokUrl: hrefSchema,
  }),
  faq: z.object({
    title: requiredText(160),
    items: z
      .array(faqItemSchema)
      .min(1)
      .max(20)
      .refine(uniqueIds, "FAQ IDs must be unique"),
  }),
  finalCta: ctaFieldsSchema,
});

export type ContactPageContentInput = z.infer<
  typeof contactPageContentSchema
>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const contactPageContentDraftSchema = makeDraftSchema(
  contactPageContentSchema,
);

export type ContactPageContentDraftInput = z.infer<
  typeof contactPageContentDraftSchema
>;
