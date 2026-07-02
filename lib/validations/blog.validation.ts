import { z } from "zod";

export const blogPageSettingSchema = z.object({
  seoTitle: z.string().min(1, "SEO Title is required").optional().nullable(),
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

  latestTitle: z.string().optional().nullable(),
  browseTitle: z.string().optional().nullable(),
  editorsPickTitle: z.string().optional().nullable(),
  testimonialsTitle: z.string().optional().nullable(),

  sidebarCategoriesTitle: z.string().optional().nullable(),
  sidebarTrendingTitle: z.string().optional().nullable(),
  newsletterTitle: z.string().optional().nullable(),
  newsletterDescription: z.string().optional().nullable(),
  newsletterPlaceholder: z.string().optional().nullable(),
  newsletterButtonLabel: z.string().optional().nullable(),

  ctaTitle: z.string().optional().nullable(),
  ctaDescription: z.string().optional().nullable(),
  ctaButtonLabel: z.string().optional().nullable(),
  ctaButtonHref: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email").or(z.literal("")).optional().nullable(),
  address: z.string().optional().nullable(),
  hours: z.string().optional().nullable(),
});

export const blogCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required").optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const blogPostSchema = z.object({
  categoryId: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  coverImageAlt: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  authorAvatar: z.string().optional().nullable(),
  authorRole: z.string().optional().nullable(),
  readTimeMinutes: z.number().int().min(1, "Read time must be at least 1 minute").optional().nullable(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isEditorsPick: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  publishedAt: z.string().datetime({ precision: 3 }).or(z.date()).optional().nullable(),
  scheduledAt: z.string().datetime({ precision: 3 }).or(z.date()).optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().nullable(),
  products: z.array(z.object({
    image: z.string(),
    name: z.string(),
    description: z.string(),
    shopUrl: z.string()
  })).optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const mediaAssetSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  originalName: z.string().optional().nullable(),
  url: z.string().url("Must be a valid URL or path"),
  mimeType: z.string().optional().nullable(),
  size: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  alt: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  folder: z.string().optional().nullable(),
});
