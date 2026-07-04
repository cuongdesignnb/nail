/**
 * Validation schema for PromotionsPageContent.
 * Validates hero, promo intro, featured promotions, terms,
 * how-to-redeem steps, FAQ, and CTA.
 */

import { z } from "zod";
import {
  requiredText,
  richTextSchema,
  seoFieldsSchema,
  heroFieldsSchema,
  ctaFieldsSchema,
  processStepItemSchema,
  faqItemSchema,
  idArraySchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const promotionsPageContentSchema = z.object({
  seo: seoFieldsSchema,
  hero: heroFieldsSchema,
  promotionIntro: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
  }),
  featuredPromotions: z.object({
    title: requiredText(160),
    featuredPromotionIds: idArraySchema,
    showAll: z.boolean(),
  }),
  termsAndConditions: z.object({
    title: requiredText(160),
    content: richTextSchema, // Rich text (HTML from TipTap)
  }),
  howToRedeem: z.object({
    title: requiredText(160),
    steps: z
      .array(processStepItemSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Step IDs must be unique"),
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

export type PromotionsPageContentInput = z.infer<
  typeof promotionsPageContentSchema
>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const promotionsPageContentDraftSchema = makeDraftSchema(
  promotionsPageContentSchema,
);

export type PromotionsPageContentDraftInput = z.infer<
  typeof promotionsPageContentDraftSchema
>;
