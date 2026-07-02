import { z } from "zod";

export const settingsSchema = z.object({
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
  whyEyebrow: z.string().optional().nullable(),
  whyTitle: z.string().optional().nullable(),
  whyDescription: z.string().optional().nullable(),
  whyImage: z.string().optional().nullable(),
  whyImageAlt: z.string().optional().nullable(),
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

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Image path is required"),
  imageAlt: z.string().optional().nullable(),
  designCount: z
    .union([z.number(), z.string()])
    .default(0)
    .transform((val) => Number(val) || 0),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const galleryItemSchema = z.object({
  categoryId: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().nullable(), // backend generated if empty
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Image path is required"),
  imageAlt: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  isHighlight: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const trendSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const processStepSchema = z.object({
  step: z.string().min(1, "Step indicator is required"),
  icon: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().optional().nullable(),
  avatarAlt: z.string().optional().nullable(),
  rating: z
    .union([z.number(), z.string()])
    .default(5)
    .transform((val) => {
      const num = Number(val);
      return num >= 1 && num <= 5 ? num : 5;
    }),
  quote: z.string().min(1, "Quote is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
