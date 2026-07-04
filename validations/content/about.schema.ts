/**
 * Validation schema for AboutPageContent.
 *
 * Adapted from the original validations/about-content.schema.ts to use the
 * shared field schemas and add a draft-permissive variant.
 */

import { z } from "zod";
import {
  requiredText,
  optionalText,
  simpleSeoSchema,
  imageFieldSchema,
  buttonFieldSchema,
  linkSchema,
  iconCardSchema,
  hrefSchema,
  colorSchema,
  uniqueIds,
  makeDraftSchema,
} from "./shared.schema";

/* ------------------------------------------------------------------ */
/*  Publish (strict) schema                                           */
/* ------------------------------------------------------------------ */

export const aboutPageContentSchema = z.object({
  seo: simpleSeoSchema,
  header: z.object({
    logo: imageFieldSchema,
    brandName: z.literal("Aera Nail Lounge"),
    navItems: z.array(linkSchema).min(1).max(10),
    cta: buttonFieldSchema,
  }),
  hero: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    highlightText: requiredText(160),
    description: requiredText(500),
    primaryButton: buttonFieldSchema,
    secondaryButton: buttonFieldSchema,
    image: imageFieldSchema,
    watermark: optionalText(40),
  }),
  story: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    paragraphs: z.array(requiredText(1200)).min(1).max(6),
    images: z.array(imageFieldSchema).min(1).max(4),
    statCard: z.object({
      value: requiredText(40),
      label: requiredText(80),
      icon: requiredText(60),
    }),
    highlights: z
      .array(iconCardSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  missionVisionValues: z
    .array(iconCardSchema)
    .min(1)
    .max(8)
    .refine(uniqueIds, "IDs must be unique"),
  benefits: z.object({
    eyebrow: requiredText(120),
    items: z
      .array(iconCardSchema)
      .min(1)
      .max(8)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  experts: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    members: z
      .array(
        z.object({
          id: requiredText(80),
          name: requiredText(120),
          role: requiredText(120),
          avatar: imageFieldSchema,
          socials: z
            .object({
              instagram: hrefSchema.optional(),
              facebook: hrefSchema.optional(),
              tiktok: hrefSchema.optional(),
            })
            .optional(),
        }),
      )
      .min(1)
      .max(12)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  salonExperience: z.object({
    eyebrow: requiredText(120),
    images: z
      .array(
        z.object({
          id: requiredText(80),
          image: imageFieldSchema,
          title: optionalText(120),
        }),
      )
      .min(1)
      .max(12)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  process: z.object({
    eyebrow: requiredText(120),
    steps: z
      .array(
        z.object({
          id: requiredText(80),
          step: requiredText(20),
          icon: requiredText(60),
          title: requiredText(160),
          description: requiredText(500),
        }),
      )
      .min(1)
      .max(8)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  testimonials: z.object({
    eyebrow: requiredText(120),
    items: z
      .array(
        z.object({
          id: requiredText(80),
          name: requiredText(120),
          role: optionalText(120),
          avatar: imageFieldSchema.optional(),
          rating: z.number().min(1).max(5),
          quote: requiredText(1200),
        }),
      )
      .min(1)
      .max(10)
      .refine(uniqueIds, "IDs must be unique"),
  }),
  cta: z.object({
    title: requiredText(160),
    description: requiredText(500),
    button: buttonFieldSchema,
    contactSnippets: z
      .array(
        z.object({
          icon: requiredText(60),
          label: requiredText(80),
          value: requiredText(160),
          href: hrefSchema.optional(),
        }),
      )
      .max(5),
  }),
  footer: z.object({
    brandText: requiredText(500),
    quickLinks: z.array(linkSchema).max(10),
    services: z.array(linkSchema).max(10),
    contact: z
      .array(
        z.object({
          icon: requiredText(60),
          label: requiredText(80),
          value: requiredText(160),
          href: hrefSchema.optional(),
        }),
      )
      .max(5),
    newsletter: z.object({
      title: requiredText(120),
      description: requiredText(300),
      placeholder: requiredText(120),
    }),
    copyright: requiredText(160),
  }),
  theme: z
    .object({
      primaryColor: colorSchema,
      secondaryColor: colorSchema,
      backgroundColor: colorSchema,
      textColor: colorSchema,
    })
    .optional(),
});

export type AboutPageContentInput = z.infer<typeof aboutPageContentSchema>;

/* ------------------------------------------------------------------ */
/*  Draft (permissive) schema                                         */
/* ------------------------------------------------------------------ */

export const aboutPageContentDraftSchema = makeDraftSchema(
  aboutPageContentSchema,
);

export type AboutPageContentDraftInput = z.infer<
  typeof aboutPageContentDraftSchema
>;
