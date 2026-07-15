/**
 * Shared Zod field schemas used across all Content Hub page schemas.
 *
 * These mirror the shared types in lib/content/content.types.ts.
 */

import { z } from "zod";
import {
  imageSrcSchema,
  mediaReferenceSchema,
  requiredMediaReferenceSchema,
} from "./media-reference.schema";

export { imageSrcSchema, mediaReferenceSchema } from "./media-reference.schema";

/* ------------------------------------------------------------------ */
/*  Text helpers                                                      */
/* ------------------------------------------------------------------ */

export const requiredText = (max = 160) =>
  z.string().trim().min(1, "Required").max(max);

export const optionalText = (max = 160) =>
  z.string().trim().max(max).optional();

export const richTextSchema = z.string().min(1, "Required");

export const optionalRichText = z.string().optional();

/* ------------------------------------------------------------------ */
/*  Links & URLs                                                      */
/* ------------------------------------------------------------------ */

export const hrefSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("https://") ||
      value.startsWith("http://") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:") ||
      value.startsWith("#"),
    "Use a safe link: /, https://, mailto:, tel:, or #section",
  );

export const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .optional();

/* ------------------------------------------------------------------ */
/*  Compound field schemas                                            */
/* ------------------------------------------------------------------ */

/** Image field — matches ImageField type */
export const imageFieldSchema = requiredMediaReferenceSchema;

/** Optional image field */
export const optionalImageFieldSchema = imageFieldSchema.optional();

/** Button field — matches ButtonField type */
export const buttonFieldSchema = z.object({
  label: requiredText(80),
  href: hrefSchema,
  variant: z.enum(["primary", "secondary", "ghost"]).optional(),
  icon: optionalText(40),
});

/** Link (label + href) */
export const linkSchema = z.object({
  label: requiredText(80),
  href: hrefSchema,
});

/** Navigable link with id */
export const navLinkSchema = z.object({
  id: requiredText(80),
  label: requiredText(80),
  href: hrefSchema,
});

/** Contact field — matches ContactField type */
export const contactFieldSchema = z.object({
  phone: requiredText(40),
  email: requiredText(160),
  address: requiredText(300),
  hours: requiredText(160),
});

/** SEO fields — matches SeoFields type */
export const seoFieldsSchema = z.object({
  title: requiredText(160),
  description: requiredText(500),
  focusKeyphrase: optionalText(160),
  keywords: z.array(z.string().trim()).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  robotsDirective: optionalText(160),
  ogTitle: optionalText(160),
  ogDescription: optionalText(500),
  ogImage: optionalImageFieldSchema,
  twitterCard: optionalText(40),
  structuredData: z.record(z.string(), z.unknown()).optional(),
});

/** Simple seo (title + description only, used by older page types) */
export const simpleSeoSchema = z.object({
  title: requiredText(160),
  description: requiredText(500),
});

/** Hero fields — matches HeroFields type */
export const heroFieldsSchema = z.object({
  eyebrow: requiredText(120),
  title: requiredText(160),
  highlight: requiredText(160),
  description: requiredText(500),
  image: imageFieldSchema,
  primaryButton: buttonFieldSchema,
  secondaryButton: buttonFieldSchema,
});

/** CTA section — matches CtaFields type */
export const ctaFieldsSchema = z.object({
  title: requiredText(160),
  description: requiredText(500),
  button: buttonFieldSchema,
  phone: requiredText(40),
  email: requiredText(160),
  address: requiredText(300),
  hours: requiredText(160),
});

/** Testimonial item — matches TestimonialItem type */
export const testimonialItemSchema = z.object({
  id: requiredText(80),
  name: requiredText(120),
  role: optionalText(120),
  avatar: optionalImageFieldSchema,
  rating: z.number().min(1).max(5),
  quote: requiredText(1200),
});

/** FAQ item — matches FaqItem type */
export const faqItemSchema = z.object({
  id: requiredText(80),
  question: requiredText(500),
  answer: requiredText(2000),
});

/** Process step — matches ProcessStepItem type */
export const processStepItemSchema = z.object({
  id: requiredText(80),
  step: requiredText(20),
  icon: requiredText(60),
  title: requiredText(160),
  description: requiredText(500),
});

/** Icon card (id, icon, title, description) */
export const iconCardSchema = z.object({
  id: requiredText(80),
  icon: requiredText(60),
  title: requiredText(160),
  description: requiredText(500),
});

/* ------------------------------------------------------------------ */
/*  Array helpers                                                     */
/* ------------------------------------------------------------------ */

export const uniqueIds = <T extends { id: string }>(items: T[]) =>
  new Set(items.map((item) => item.id)).size === items.length;

export const idArraySchema = z.array(z.string().min(1));

/* ------------------------------------------------------------------ */
/*  Draft-permissive wrappers                                         */
/* ------------------------------------------------------------------ */

/**
 * Make every top-level field in a Zod object optional.
 * Useful for building draft schemas from strict publish schemas.
 * Zod v4 does not support deepPartial — use .partial() instead.
 */
export function makeDraftSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return schema.partial();
}
