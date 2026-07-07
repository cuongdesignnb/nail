import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const serviceSchema = z.object({
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional().nullable(), // optional, generated on backend if missing
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  priceLabel: z.string().optional().nullable(),
  durationMinutes: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  durationLabel: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
});

export const addonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  priceLabel: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subtitle: z.string().optional().nullable(),
  price: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  priceLabel: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  image: z.string().min(1, "Media Library image is required"),
  imageAlt: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const settingsSchema = z.object({
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
  whyChooseTitle: z.string().optional().nullable(),
  whyChooseDescription: z.string().optional().nullable(),
  whyChooseImage: z.string().optional().nullable(),
  ctaTitle: z.string().optional().nullable(),
  ctaDescription: z.string().optional().nullable(),
  ctaButtonLabel: z.string().optional().nullable(),
  ctaButtonHref: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal(""))
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  address: z.string().optional().nullable(),
  hours: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});
