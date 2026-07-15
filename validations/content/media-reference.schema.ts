import { z } from "zod";

export const imageSrcSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("https://images.unsplash.com/") ||
      value.startsWith(process.env.NEXT_PUBLIC_CDN_HOST ?? "https://cdn.invalid/"),
    "Use a persistent public path, Unsplash URL, or configured CDN URL",
  );

const mediaReferenceObjectSchema = z
  .object({
    mediaId: z.string().trim().min(1).nullable().optional(),
    src: imageSrcSchema,
    alt: z.string().trim(),
    title: z.string().trim().nullable().optional(),
  })
  .passthrough();

function legacyAlt(src: string) {
  const fileName = src.split(/[/?#]/).filter(Boolean).pop() || "Image";
  return decodeURIComponent(fileName).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
}

function normalizeLegacyMediaReference(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    const src = value.trim();
    return { mediaId: null, src, alt: legacyAlt(src), title: null };
  }
  return value;
}

export const mediaReferenceSchema = z.preprocess(
  normalizeLegacyMediaReference,
  mediaReferenceObjectSchema,
);

export const requiredMediaReferenceSchema = z.preprocess(
  normalizeLegacyMediaReference,
  mediaReferenceObjectSchema.extend({
    alt: z.string().trim().min(1, "Alt text is required.").max(160),
  }),
);

export type CanonicalMediaReference = z.infer<typeof mediaReferenceSchema>;
