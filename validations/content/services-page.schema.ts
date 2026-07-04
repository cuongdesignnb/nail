/**
 * Validation schema for ServicesPageContent.
 * Validates all sections: hero, categories, services, why-choose,
 * pricing, process, gallery, packages, add-ons, FAQs, and CTA.
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
  imageSrcSchema,
  hrefSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Sub-schemas matching ServicesPageContent nested types              */
/* ------------------------------------------------------------------ */

const serviceCategorySchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  slug: requiredText(120),
  description: optionalText(500),
  icon: optionalText(60),
});

const serviceSchema = z.object({
  id: requiredText(80),
  categoryId: optionalText(80),
  name: requiredText(160),
  slug: requiredText(160),
  shortDescription: optionalText(500),
  description: optionalText(2000),
  image: optionalText(500),
  imageAlt: optionalText(160),
  price: z.union([z.number(), z.string()]).optional(),
  priceLabel: optionalText(80),
  durationMinutes: z.number().optional(),
  durationLabel: optionalText(80),
  features: z.array(z.string()),
  isFeatured: z.boolean(),
});

const serviceAddonSchema = z.object({
  id: requiredText(80),
  name: requiredText(160),
  price: z.union([z.number(), z.string()]).optional(),
  priceLabel: optionalText(80),
  description: optionalText(500),
});

const servicePackageSchema = z.object({
  id: requiredText(80),
  name: requiredText(160),
  subtitle: optionalText(160),
  price: z.union([z.number(), z.string()]).optional(),
  priceLabel: optionalText(80),
  badge: optionalText(60),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
});

const serviceFaqSchema = z.object({
  id: requiredText(80),
  question: requiredText(500),
  answer: requiredText(2000),
});

const serviceGalleryItemSchema = z.object({
  id: requiredText(80),
  title: optionalText(160),
  image: requiredText(500),
  imageAlt: optionalText(160),
  tag: optionalText(60),
});

const serviceHeroSchema = z.object({
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

export const servicesPageContentSchema = z.object({
  seo: simpleSeoSchema,
  hero: serviceHeroSchema,
  categories: z
    .array(serviceCategorySchema)
    .refine(uniqueIds, "Category IDs must be unique"),
  signatureServices: z
    .array(serviceSchema)
    .refine(uniqueIds, "Service IDs must be unique"),
  whyChoose: z.object({
    title: requiredText(160),
    description: requiredText(500),
    image: imageFieldSchema,
    features: z
      .array(iconCardSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Feature IDs must be unique"),
  }),
  pricing: z.object({
    categories: z
      .array(
        z.object({
          id: requiredText(80),
          title: requiredText(160),
          items: z.array(
            z.object({
              name: requiredText(160),
              priceLabel: requiredText(80),
            }),
          ),
        }),
      )
      .refine(uniqueIds, "Pricing category IDs must be unique"),
  }),
  process: z
    .array(
      z.object({
        id: requiredText(80),
        step: requiredText(20),
        title: requiredText(160),
        description: requiredText(500),
        icon: requiredText(60),
      }),
    )
    .min(1)
    .max(8)
    .refine(uniqueIds, "Step IDs must be unique"),
  gallery: z
    .array(serviceGalleryItemSchema)
    .refine(uniqueIds, "Gallery IDs must be unique"),
  packages: z
    .array(servicePackageSchema)
    .refine(uniqueIds, "Package IDs must be unique"),
  addons: z
    .array(serviceAddonSchema)
    .refine(uniqueIds, "Add-on IDs must be unique"),
  faqs: z
    .array(serviceFaqSchema)
    .refine(uniqueIds, "FAQ IDs must be unique"),
  cta: ctaFieldsSchema,
});

export type ServicesPageContentInput = z.infer<
  typeof servicesPageContentSchema
>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const servicesPageContentDraftSchema = makeDraftSchema(
  servicesPageContentSchema,
);

export type ServicesPageContentDraftInput = z.infer<
  typeof servicesPageContentDraftSchema
>;
