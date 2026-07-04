/**
 * Validation schema for GalleryPageContent.
 * Validates hero, categories, collections, items, why-choose,
 * trends, process steps, testimonials, and CTA.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  simpleSeoSchema,
  imageFieldSchema,
  buttonFieldSchema,
  ctaFieldsSchema,
  iconCardSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Sub-schemas matching GalleryPageContent nested types              */
/* ------------------------------------------------------------------ */

const galleryCategorySchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  slug: requiredText(120),
  description: optionalText(500),
});

const galleryCollectionSchema = z.object({
  id: requiredText(80),
  title: requiredText(160),
  slug: requiredText(160),
  description: optionalText(500),
  image: requiredText(500),
  imageAlt: optionalText(160),
  designCount: z.number().int().min(0),
});

const galleryItemSchema = z.object({
  id: requiredText(80),
  categoryId: optionalText(80),
  title: requiredText(160),
  slug: requiredText(160),
  description: optionalText(500),
  image: requiredText(500),
  imageAlt: optionalText(160),
  tag: optionalText(60),
  isHighlight: z.boolean().optional(),
});

const galleryTrendSchema = z.object({
  id: requiredText(80),
  title: requiredText(160),
  slug: requiredText(160),
  image: optionalText(500),
  imageAlt: optionalText(160),
});

const galleryProcessStepSchema = z.object({
  id: requiredText(80),
  step: requiredText(20),
  icon: optionalText(60),
  title: requiredText(160),
  description: requiredText(500),
});

const galleryTestimonialSchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  avatar: optionalText(500),
  avatarAlt: optionalText(160),
  rating: z.number().min(1).max(5),
  quote: requiredText(1200),
});

const galleryHeroSchema = z.object({
  eyebrow: requiredText(120),
  title: requiredText(160),
  highlight: requiredText(160),
  description: requiredText(500),
  image: imageFieldSchema,
  primaryButton: buttonFieldSchema,
  secondaryButton: buttonFieldSchema,
});

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const galleryPageContentSchema = z.object({
  seo: simpleSeoSchema,
  hero: galleryHeroSchema,
  categories: z
    .array(galleryCategorySchema)
    .refine(uniqueIds, "Category IDs must be unique"),
  collections: z
    .array(galleryCollectionSchema)
    .refine(uniqueIds, "Collection IDs must be unique"),
  items: z
    .array(galleryItemSchema)
    .refine(uniqueIds, "Gallery item IDs must be unique"),
  whyChoose: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
    image: imageFieldSchema,
    features: z
      .array(iconCardSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Feature IDs must be unique"),
  }),
  trends: z
    .array(galleryTrendSchema)
    .refine(uniqueIds, "Trend IDs must be unique"),
  processSteps: z
    .array(galleryProcessStepSchema)
    .min(1)
    .max(8)
    .refine(uniqueIds, "Process step IDs must be unique"),
  testimonials: z
    .array(galleryTestimonialSchema)
    .refine(uniqueIds, "Testimonial IDs must be unique"),
  cta: ctaFieldsSchema,
});

export type GalleryPageContentInput = z.infer<
  typeof galleryPageContentSchema
>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const galleryPageContentDraftSchema = makeDraftSchema(
  galleryPageContentSchema,
);

export type GalleryPageContentDraftInput = z.infer<
  typeof galleryPageContentDraftSchema
>;
