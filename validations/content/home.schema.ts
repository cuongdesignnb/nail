/**
 * Validation schema for HomePageContent.
 * Validates all sections of the home page including hero, featured entities,
 * testimonials, booking steps, FAQ, and CTA.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  seoFieldsSchema,
  heroFieldsSchema,
  ctaFieldsSchema,
  imageFieldSchema,
  buttonFieldSchema,
  testimonialItemSchema,
  faqItemSchema,
  processStepItemSchema,
  hrefSchema,
  idArraySchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const homePageContentSchema = z.object({
  seo: seoFieldsSchema,
  hero: heroFieldsSchema,
  signatureServices: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
    featuredServiceIds: idArraySchema,
    showViewAll: z.boolean(),
  }),
  aboutPreview: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
    image: imageFieldSchema,
    button: buttonFieldSchema,
  }),
  featuredGallery: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    featuredItemIds: idArraySchema,
    showViewAll: z.boolean(),
  }),
  packagesPreview: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
    featuredPackageIds: idArraySchema,
  }),
  promotionBanner: z.object({
    isVisible: z.boolean(),
    title: requiredText(160),
    description: requiredText(500),
    code: optionalText(40),
    button: buttonFieldSchema,
    featuredPromotionIds: idArraySchema,
  }),
  teamPreview: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    featuredTechnicianIds: idArraySchema,
  }),
  testimonials: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    items: z
      .array(testimonialItemSchema)
      .min(1)
      .max(10)
      .refine(uniqueIds, "Testimonial IDs must be unique"),
  }),
  bookingSteps: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    steps: z
      .array(processStepItemSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Step IDs must be unique"),
  }),
  instagramPreview: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    instagramUrl: hrefSchema,
    showSection: z.boolean(),
  }),
  faq: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    items: z
      .array(faqItemSchema)
      .min(1)
      .max(20)
      .refine(uniqueIds, "FAQ IDs must be unique"),
  }),
  finalCta: ctaFieldsSchema,
});

export type HomePageContentInput = z.infer<typeof homePageContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const homePageContentDraftSchema = makeDraftSchema(
  homePageContentSchema,
);

export type HomePageContentDraftInput = z.infer<
  typeof homePageContentDraftSchema
>;
