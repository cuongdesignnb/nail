import { z } from "zod";

export const packagePageSettingSchema = z.object({
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  heroEyebrow: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroHighlight: z.string().optional().nullable(),
  heroDescription: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  heroImageAlt: z.string().optional().nullable(),
  primaryButtonLabel: z.string().optional().nullable(),
  primaryButtonHref: z.string().optional().nullable(),
  secondaryButtonLabel: z.string().optional().nullable(),
  secondaryButtonHref: z.string().optional().nullable(),
  benefitsEyebrow: z.string().optional().nullable(),
  benefitsTitle: z.string().optional().nullable(),
  benefitsDescription: z.string().optional().nullable(),
  benefitsImage: z.string().optional().nullable(),
  benefitsImageAlt: z.string().optional().nullable(),
  benefitsButtonLabel: z.string().optional().nullable(),
  benefitsButtonHref: z.string().optional().nullable(),
  comparisonTitle: z.string().optional().nullable(),
  rewardsTitle: z.string().optional().nullable(),
  occasionsTitle: z.string().optional().nullable(),
  processTitle: z.string().optional().nullable(),
  testimonialsTitle: z.string().optional().nullable(),
  faqTitle: z.string().optional().nullable(),
  ctaTitle: z.string().optional().nullable(),
  ctaDescription: z.string().optional().nullable(),
  ctaButtonLabel: z.string().optional().nullable(),
  ctaButtonHref: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal(""))
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  address: z.string().optional().nullable(),
  hours: z.string().optional().nullable(),
});

export const packageCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const nailPackageSchema = z.object({
  categoryId: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional().nullable(), // backend generated if empty
  subtitle: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  price: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined || val === null ? null : Number(val))),
  priceLabel: z.string().optional().nullable(),
  durationLabel: z.string().optional().nullable(),
  visitCountLabel: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const packageBenefitSchema = z.object({
  icon: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const packageComparisonFeatureSchema = z.object({
  featureName: z.string().min(1, "Feature name is required"),
  essentialValue: z.string().optional().nullable(),
  signatureValue: z.string().optional().nullable(),
  premiumValue: z.string().optional().nullable(),
  vipValue: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const packageRewardSchema = z.object({
  icon: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  promoTitle: z.string().optional().nullable(),
  promoValue: z.string().optional().nullable(),
  buttonLabel: z.string().optional().nullable(),
  buttonHref: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const packageOccasionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const packageProcessStepSchema = z.object({
  step: z.string().min(1, "Step indicator is required"),
  icon: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
