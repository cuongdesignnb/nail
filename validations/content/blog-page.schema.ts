/**
 * Validation schema for BlogPageContent.
 * Validates hero, categories, featured/trending/editor-pick posts,
 * testimonials, newsletter, CTA, and optional pagination.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  simpleSeoSchema,
  imageFieldSchema,
  buttonFieldSchema,
  ctaFieldsSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Sub-schemas matching BlogPageContent nested types                 */
/* ------------------------------------------------------------------ */

const blogCategorySchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  slug: requiredText(120),
  description: z.string().nullish(),
  image: z.string().nullish(),
  imageAlt: z.string().nullish(),
  icon: z.string().nullish(),
  postCount: z.number().int().min(0).optional(),
});

const blogPostFaqSchema = z.object({
  question: requiredText(500),
  answer: requiredText(2000),
});

const blogPostProductSchema = z.object({
  image: requiredText(500),
  name: requiredText(160),
  description: requiredText(500),
  shopUrl: requiredText(500),
});

const blogPostSchema = z.object({
  id: requiredText(80),
  categoryId: z.string().nullish(),
  category: blogCategorySchema.nullish(),
  title: requiredText(250),
  slug: requiredText(250),
  excerpt: z.string().nullish(),
  content: z.string().nullish(), // Rich text / HTML
  coverImage: z.string().nullish(),
  coverImageAlt: z.string().nullish(),
  authorName: z.string().nullish(),
  authorAvatar: z.string().nullish(),
  authorRole: z.string().nullish(),
  readTimeMinutes: z.number().nullish(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isEditorsPick: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  publishedAt: z.string().nullish(),
  scheduledAt: z.string().nullish(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
  seoKeywords: z.string().nullish(),
  faqs: z.array(blogPostFaqSchema).nullish(),
  products: z.array(blogPostProductSchema).nullish(),
  sortOrder: z.number().optional(),
});

const blogTestimonialSchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  role: z.string().nullish(),
  avatar: z.string().nullish(),
  avatarAlt: z.string().nullish(),
  rating: z.number().min(1).max(5),
  quote: requiredText(1200),
});

const blogHeroSchema = z.object({
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

export const blogPageContentSchema = z.object({
  seo: simpleSeoSchema,
  hero: blogHeroSchema,
  categories: z
    .array(blogCategorySchema)
    .refine(uniqueIds, "Category IDs must be unique"),
  featuredPost: blogPostSchema.optional(),
  sideFeaturedPosts: z
    .array(blogPostSchema)
    .refine(uniqueIds, "Side featured post IDs must be unique"),
  latestPosts: z
    .array(blogPostSchema)
    .refine(uniqueIds, "Latest post IDs must be unique"),
  popularCategories: z
    .array(blogCategorySchema)
    .refine(uniqueIds, "Popular category IDs must be unique"),
  trendingPosts: z
    .array(blogPostSchema)
    .refine(uniqueIds, "Trending post IDs must be unique"),
  editorsPicks: z
    .array(blogPostSchema)
    .refine(uniqueIds, "Editor pick IDs must be unique"),
  testimonials: z.object({
    title: requiredText(160),
    items: z
      .array(blogTestimonialSchema)
      .refine(uniqueIds, "Testimonial IDs must be unique"),
  }),
  newsletter: z.object({
    title: requiredText(160),
    description: requiredText(500),
    placeholder: requiredText(120),
    buttonLabel: requiredText(60),
  }),
  cta: ctaFieldsSchema,
  pagination: z
    .object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    })
    .optional(),
});

export type BlogPageContentInput = z.infer<typeof blogPageContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const blogPageContentDraftSchema = makeDraftSchema(
  blogPageContentSchema,
);

export type BlogPageContentDraftInput = z.infer<
  typeof blogPageContentDraftSchema
>;
