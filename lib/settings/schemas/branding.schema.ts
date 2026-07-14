import { z } from "zod";

export const brandingMediaReferenceSchema = z.object({
  mediaId: z.string().trim().min(1).nullable(),
  src: z.string().trim().min(1, "Image URL is required."),
  alt: z.string().trim().min(1, "Alt text is required."),
  title: z.string().trim().nullable().optional(),
});

export const brandingSettingsSchema = z.object({
  logo: brandingMediaReferenceSchema.nullable(),
  favicon: brandingMediaReferenceSchema.nullable(),
});
