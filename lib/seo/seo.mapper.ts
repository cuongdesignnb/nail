import type { ImageField, SeoFields } from "@/lib/content/content.types";
import type { EntitySeoRecord, SeoMetadataInput } from "./seo.types";
import { normalizeCanonicalPath } from "./site-url";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function keywordsToArray(value: string | string[] | null | undefined): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value.map((item) => item.trim()).filter(Boolean);
    return items.length ? items : undefined;
  }
  if (!value) return undefined;
  const items = value.split(",").map((item) => item.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

export function imageToUrl(value: string | ImageField | null | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return normalizeMediaUrl(value) || undefined;
  return normalizeMediaUrl(value.src) || undefined;
}

export function imageToAlt(value: string | ImageField | null | undefined, explicitAlt?: string | null): string | undefined {
  if (explicitAlt) return explicitAlt;
  if (value && typeof value !== "string") return value.alt || undefined;
  return undefined;
}

export function mapContentHubSeo(seo: SeoFields | null | undefined): SeoMetadataInput {
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    focusKeyphrase: seo.focusKeyphrase,
    canonicalPath: seo.canonicalUrl ? normalizeCanonicalPath(seo.canonicalUrl) : undefined,
    robots: seo.robotsDirective,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    ogImageMediaId: seo.ogImage?.mediaId,
    ogImageAlt: seo.ogImage?.alt,
    twitterCard: seo.twitterCard,
    schemaJson: seo.structuredData,
  };
}

export function mapEntitySeoRecord(record: EntitySeoRecord | null | undefined): SeoMetadataInput {
  if (!record) return {};
  return {
    title: record.title,
    description: record.description,
    keywords: record.keywords,
    focusKeyphrase: record.focusKeyphrase,
    canonicalPath: record.canonicalPath,
    robots: record.robots,
    ogTitle: record.ogTitle,
    ogDescription: record.ogDescription,
    ogImage: record.ogImage,
    ogImageMediaId: record.ogImageMediaId,
    ogImageAlt: record.ogImageAlt,
    twitterCard: record.twitterCard,
    schemaJson: record.schemaJson,
  };
}

export function stripDuplicateTitleSuffix(title: string, siteName: string) {
  const suffixes = [` | ${siteName}`, ` - ${siteName}`];
  let next = title.trim();
  for (const suffix of suffixes) {
    while (next.endsWith(`${suffix}${suffix}`)) next = next.slice(0, -suffix.length);
  }
  return next;
}
