import { z } from "zod";
import { ROBOTS_DIRECTIVES, SCHEMA_TYPE_ALLOWLIST, TWITTER_CARDS } from "./seo.constants";
import { isAllowedPublicPath, normalizeCanonicalPath } from "./site-url";

const dangerousProtocol = /^(javascript|data|vbscript|file):/i;

export const robotsDirectiveSchema = z.enum(ROBOTS_DIRECTIVES);
export const twitterCardSchema = z.enum(TWITTER_CARDS);

export const canonicalPathSchema = z
  .string()
  .trim()
  .transform((value) => normalizeCanonicalPath(value))
  .refine((value) => value.startsWith("/"), "Canonical path must begin with /")
  .refine((value) => isAllowedPublicPath(value), "Canonical path cannot target private routes");

export const safeUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => !dangerousProtocol.test(value), "Unsafe URL protocol");

export const seoSiteSettingsSchema = z.object({
  titleTemplate: z.string().trim().min(1).max(160).default("%s | Aera Nail Lounge"),
  defaultRobots: robotsDirectiveSchema.default("index,follow"),
  locale: z.string().trim().min(2).max(20).default("en_US"),
  twitterCard: twitterCardSchema.default("summary_large_image"),
  twitterHandle: z.string().trim().max(80).optional().nullable(),
  enableWebSiteSchema: z.boolean().default(true),
  enableNailSalonSchema: z.boolean().default(true),
  enableBreadcrumbSchema: z.boolean().default(true),
  enableFaqSchema: z.boolean().default(true),
  enableArticleSchema: z.boolean().default(true),
  enableServiceSchema: z.boolean().default(true),
  businessType: z.string().trim().min(1).max(80).default("NailSalon"),
  priceRange: z.string().trim().max(20).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  googleBusinessProfileUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  googleMapsUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  sameAs: z.unknown().optional().nullable(),
  googleSiteVerification: z.string().trim().max(180).optional().nullable(),
  bingSiteVerification: z.string().trim().max(180).optional().nullable(),
});

export const seoEntitySchema = z.object({
  pageKey: z.string().trim().min(1),
  title: z.string().trim().max(160).optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  keywords: z.string().trim().max(500).optional().nullable(),
  focusKeyphrase: z.string().trim().max(160).optional().nullable(),
  canonicalPath: canonicalPathSchema.optional().nullable().or(z.literal("")),
  robots: robotsDirectiveSchema.optional().nullable(),
  ogTitle: z.string().trim().max(160).optional().nullable(),
  ogDescription: z.string().trim().max(500).optional().nullable(),
  ogImage: z.string().trim().max(1000).optional().nullable(),
  ogImageMediaId: z.string().trim().max(120).optional().nullable(),
  ogImageAlt: z.string().trim().max(180).optional().nullable(),
  twitterCard: twitterCardSchema.optional().nullable(),
  schemaJson: z.unknown().optional().nullable(),
});

export function validateLegacySchemaJson(value: unknown) {
  if (!value || typeof value !== "object") return { valid: true };
  const schema = value as Record<string, unknown>;
  const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
  const invalid = types.filter((type) => typeof type === "string" && !SCHEMA_TYPE_ALLOWLIST.has(type));
  if (invalid.length > 0) {
    return { valid: false, error: `Unsupported schema type: ${invalid.join(", ")}` };
  }
  const serialized = JSON.stringify(value);
  if (/<script|javascript:|data:|vbscript:/i.test(serialized)) {
    return { valid: false, error: "Schema contains unsafe script or URL content." };
  }
  return { valid: true };
}

export function seoWarnings(input: { title?: string | null; description?: string | null; ogImage?: string | null; ogImageAlt?: string | null }) {
  const warnings: string[] = [];
  if (!input.title?.trim()) warnings.push("Missing SEO title.");
  if (!input.description?.trim()) warnings.push("Missing meta description.");
  if (input.title && (input.title.length < 20 || input.title.length > 70)) {
    warnings.push("SEO title is outside the recommended 20-70 character range.");
  }
  if (input.description && (input.description.length < 70 || input.description.length > 170)) {
    warnings.push("Meta description is outside the recommended 70-170 character range.");
  }
  if (input.ogImage && !input.ogImageAlt?.trim()) warnings.push("Open Graph image needs alt text.");
  return warnings;
}

