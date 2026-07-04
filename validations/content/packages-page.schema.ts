/**
 * Validation schema for PackagesPageContent.
 * Validates hero, categories, packages, benefits, comparison table,
 * rewards, occasions, process, testimonials, FAQs, and CTA.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  simpleSeoSchema,
  imageFieldSchema,
  buttonFieldSchema,
  ctaFieldsSchema,
  optionalImageFieldSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Sub-schemas matching PackagesPageContent nested types             */
/* ------------------------------------------------------------------ */

const packageCategorySchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  slug: requiredText(120),
  description: optionalText(500),
});

const nailPackageSchema = z.object({
  id: requiredText(80),
  categoryId: optionalText(80),
  name: requiredText(160),
  slug: requiredText(160),
  subtitle: optionalText(160),
  shortDescription: optionalText(500),
  description: optionalText(2000),
  image: optionalText(500),
  imageAlt: optionalText(160),
  price: z.union([z.number(), z.string()]).optional(),
  priceLabel: optionalText(80),
  durationLabel: optionalText(80),
  visitCountLabel: optionalText(80),
  badge: optionalText(60),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const packageBenefitSchema = z.object({
  id: requiredText(80),
  icon: optionalText(60),
  title: requiredText(160),
  description: requiredText(500),
});

const comparisonColumnSchema = z.object({
  key: z.enum([
    "essentialValue",
    "signatureValue",
    "premiumValue",
    "vipValue",
  ]),
  label: requiredText(80),
  priceLabel: requiredText(80),
});

const comparisonFeatureSchema = z.object({
  id: requiredText(80),
  featureName: requiredText(160),
  essentialValue: optionalText(80),
  signatureValue: optionalText(80),
  premiumValue: optionalText(80),
  vipValue: optionalText(80),
});

const packageRewardSchema = z.object({
  id: requiredText(80),
  icon: optionalText(60),
  title: requiredText(160),
  description: requiredText(500),
  image: optionalText(500),
  imageAlt: optionalText(160),
  promoTitle: optionalText(160),
  promoValue: optionalText(80),
  buttonLabel: optionalText(80),
  buttonHref: optionalText(500),
});

const packageOccasionSchema = z.object({
  id: requiredText(80),
  title: requiredText(160),
  description: requiredText(500),
  image: optionalText(500),
  imageAlt: optionalText(160),
  icon: optionalText(60),
});

const packageProcessStepSchema = z.object({
  id: requiredText(80),
  step: requiredText(20),
  icon: optionalText(60),
  title: requiredText(160),
  description: requiredText(500),
});

const pageTestimonialSchema = z.object({
  id: requiredText(80),
  pageKey: requiredText(40),
  name: requiredText(120),
  role: optionalText(120),
  avatar: optionalText(500),
  avatarAlt: optionalText(160),
  rating: z.number().min(1).max(5),
  quote: requiredText(1200),
});

const pageFaqSchema = z.object({
  id: requiredText(80),
  pageKey: requiredText(40),
  question: requiredText(500),
  answer: requiredText(2000),
});

const packagesHeroSchema = z.object({
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

export const packagesPageContentSchema = z.object({
  seo: simpleSeoSchema,
  hero: packagesHeroSchema,
  categories: z
    .array(packageCategorySchema)
    .refine(uniqueIds, "Category IDs must be unique"),
  packages: z
    .array(nailPackageSchema)
    .refine(uniqueIds, "Package IDs must be unique"),
  benefits: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    description: requiredText(500),
    image: imageFieldSchema,
    button: buttonFieldSchema,
    items: z
      .array(packageBenefitSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Benefit IDs must be unique"),
  }),
  comparison: z.object({
    title: requiredText(160),
    columns: z.array(comparisonColumnSchema).min(1).max(4),
    features: z
      .array(comparisonFeatureSchema)
      .refine(uniqueIds, "Feature IDs must be unique"),
  }),
  rewards: z.object({
    title: requiredText(160),
    items: z
      .array(packageRewardSchema)
      .refine(uniqueIds, "Reward IDs must be unique"),
    promo: z.object({
      title: requiredText(160),
      value: requiredText(80),
      description: optionalText(500),
      image: optionalImageFieldSchema,
      button: buttonFieldSchema,
    }),
  }),
  occasions: z.object({
    title: requiredText(160),
    items: z
      .array(packageOccasionSchema)
      .refine(uniqueIds, "Occasion IDs must be unique"),
  }),
  process: z.object({
    title: requiredText(160),
    steps: z
      .array(packageProcessStepSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "Step IDs must be unique"),
  }),
  testimonials: z.object({
    title: requiredText(160),
    items: z
      .array(pageTestimonialSchema)
      .refine(uniqueIds, "Testimonial IDs must be unique"),
  }),
  faqs: z.object({
    title: requiredText(160),
    items: z
      .array(pageFaqSchema)
      .refine(uniqueIds, "FAQ IDs must be unique"),
  }),
  cta: ctaFieldsSchema,
});

export type PackagesPageContentInput = z.infer<
  typeof packagesPageContentSchema
>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const packagesPageContentDraftSchema = makeDraftSchema(
  packagesPageContentSchema,
);

export type PackagesPageContentDraftInput = z.infer<
  typeof packagesPageContentDraftSchema
>;
