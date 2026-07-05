import type { Metadata } from "next";
import type { BuildPageMetadataInput } from "./seo.types";
import { DEFAULT_TITLE_TEMPLATE, SITE_NAME_FALLBACK } from "./seo.constants";
import { buildAbsoluteUrl, normalizeCanonicalPath } from "./site-url";
import { keywordsToArray, stripDuplicateTitleSuffix } from "./seo.mapper";

function isNoindex(robots?: string | null) {
  return robots?.toLowerCase().includes("noindex") ?? false;
}

function dateString(value?: string | Date | null) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

function absoluteImageUrl(image?: string | null) {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return buildAbsoluteUrl(image);
}

export function applyTitleTemplate(title: string, template?: string | null, siteName = SITE_NAME_FALLBACK) {
  const cleanTitle = stripDuplicateTitleSuffix(title, siteName);
  const activeTemplate = template || DEFAULT_TITLE_TEMPLATE;
  if (!activeTemplate.includes("%s")) return cleanTitle;
  if (cleanTitle.includes(siteName)) return cleanTitle;
  return activeTemplate.replace("%s", cleanTitle);
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const siteName = input.siteName || SITE_NAME_FALLBACK;
  const canonicalPath = normalizeCanonicalPath(input.pathname);
  const robots = input.robots || "index,follow";
  const title = applyTitleTemplate(input.pageTitle, input.titleTemplate, siteName);
  const description = input.pageDescription;
  const ogImage = absoluteImageUrl(input.ogImage);
  const canonical = isNoindex(robots) ? undefined : buildAbsoluteUrl(canonicalPath);
  const keywords = keywordsToArray(input.keywords);

  const metadata: Metadata = {
    metadataBase: new URL(buildAbsoluteUrl("/")),
    title,
    description,
    keywords,
    robots,
    openGraph: {
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      url: buildAbsoluteUrl(canonicalPath),
      siteName,
      locale: input.locale || undefined,
      type: input.pageType || "website",
      publishedTime: dateString(input.publishedTime),
      modifiedTime: dateString(input.modifiedTime),
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: input.ogImageAlt || input.ogTitle || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: input.twitterCard === "summary" ? "summary" : "summary_large_image",
      site: input.twitterHandle || undefined,
      creator: input.twitterHandle || undefined,
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
    authors: input.authors,
    publisher: input.publisher || siteName,
    category: input.category || undefined,
  };

  if (canonical) {
    metadata.alternates = { canonical };
  }

  return metadata;
}

export function buildMetadata(
  seo: {
    title?: string | null;
    description?: string | null;
    keywords?: string | string[] | null;
    canonicalPath?: string | null;
    robots?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    ogImageAlt?: string | null;
    twitterCard?: string | null;
  } | null | undefined,
  defaults: { title: string; description: string; path: string },
): Metadata {
  return buildPageMetadata({
    pageTitle: seo?.title || defaults.title,
    pageDescription: seo?.description || defaults.description,
    pathname: seo?.canonicalPath || defaults.path,
    robots: seo?.robots,
    keywords: seo?.keywords,
    ogTitle: seo?.ogTitle,
    ogDescription: seo?.ogDescription,
    ogImage: seo?.ogImage,
    ogImageAlt: seo?.ogImageAlt,
    twitterCard: seo?.twitterCard,
  });
}
