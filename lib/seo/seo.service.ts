import { prisma } from "@/lib/db";
import type { ContentPageKey, GlobalContent, SeoFields } from "@/lib/content/content.types";
import { getDefaultContent } from "@/lib/content/content-defaults";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE_TEMPLATE,
  SEO_SITE_SETTING_KEY,
  SITE_NAME_FALLBACK,
  STATIC_PAGE_PATHS,
} from "./seo.constants";
import type {
  EntitySeoRecord,
  ResolvedSeoMetadata,
  RobotsDirective,
  SeoMetadataInput,
  SeoSiteSettings,
  StaticPageSeoResult,
  TwitterCard,
} from "./seo.types";
import { buildPageMetadata } from "./build-metadata";
import { imageToAlt, imageToUrl, keywordsToArray, mapContentHubSeo, mapEntitySeoRecord } from "./seo.mapper";
import { normalizeCanonicalPath } from "./site-url";

const siteSettingsFallback: SeoSiteSettings = {
  titleTemplate: DEFAULT_TITLE_TEMPLATE,
  defaultRobots: "index,follow",
  locale: "en_US",
  twitterCard: "summary_large_image",
  twitterHandle: null,
  enableWebSiteSchema: true,
  enableNailSalonSchema: true,
  enableBreadcrumbSchema: true,
  enableFaqSchema: true,
  enableArticleSchema: true,
  enableServiceSchema: true,
  businessType: "NailSalon",
  priceRange: "$$",
  latitude: null,
  longitude: null,
  googleBusinessProfileUrl: null,
  googleMapsUrl: null,
  sameAs: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
};

function sanitizeRobots(value: string | null | undefined, fallback: RobotsDirective): RobotsDirective {
  if (
    value === "index,follow" ||
    value === "index,nofollow" ||
    value === "noindex,follow" ||
    value === "noindex,nofollow"
  ) {
    return value;
  }
  return fallback;
}

function sanitizeTwitterCard(value: string | null | undefined, fallback: TwitterCard): TwitterCard {
  return value === "summary" || value === "summary_large_image" ? value : fallback;
}

function mapSiteSettings(record: Record<string, unknown> | null | undefined): SeoSiteSettings {
  if (!record) return siteSettingsFallback;
  return {
    ...siteSettingsFallback,
    ...record,
    defaultRobots: sanitizeRobots(record.defaultRobots as string | undefined, siteSettingsFallback.defaultRobots),
    twitterCard: sanitizeTwitterCard(record.twitterCard as string | undefined, siteSettingsFallback.twitterCard),
  };
}

export async function getSeoSiteSettings(): Promise<SeoSiteSettings> {
  return loadSeoSiteSettings();
}

async function loadSeoSiteSettings(): Promise<SeoSiteSettings> {
  try {
    const record = await prisma.seoSiteSetting.upsert({
      where: { key: SEO_SITE_SETTING_KEY },
      create: { key: SEO_SITE_SETTING_KEY },
      update: {},
    });
    return mapSiteSettings(record as unknown as Record<string, unknown>);
  } catch (error) {
    console.error("Failed to load SEO site settings.", error);
    return siteSettingsFallback;
  }
}

async function getPublishedContentDirect<T>(pageKey: ContentPageKey): Promise<T> {
  return loadPublishedContentDirect<T>(pageKey);
}

async function loadPublishedContentDirect<T>(pageKey: ContentPageKey): Promise<T> {
  const record = await prisma.sitePageContent.findUnique({ where: { slug: pageKey } });
  if (record?.publishedContent) return record.publishedContent as T;
  return getDefaultContent(pageKey) as T;
}

export async function getSeoMetadata(scopeKey: string) {
  return prisma.seoMetadata.findUnique({ where: { scopeKey } });
}

function getBrandName(globalContent: GlobalContent) {
  return globalContent.brand?.name?.trim() || SITE_NAME_FALLBACK;
}

function mergeSeo(input: {
  primary?: SeoMetadataInput;
  secondary?: SeoMetadataInput;
  fallbackTitle: string;
  fallbackDescription: string;
  pathname: string;
  siteSettings: SeoSiteSettings;
  globalContent: GlobalContent;
  metadataSource: string;
  noindex?: boolean;
}): ResolvedSeoMetadata {
  const primary = input.primary || {};
  const secondary = input.secondary || {};
  const globalShare = input.globalContent.defaultShareImage;
  const title = primary.title || secondary.title || input.fallbackTitle || getBrandName(input.globalContent);
  const description =
    primary.description || secondary.description || input.fallbackDescription || DEFAULT_DESCRIPTION;
  const robots = input.noindex
    ? "noindex,nofollow"
    : sanitizeRobots(primary.robots || secondary.robots, input.siteSettings.defaultRobots);
  const ogImageValue =
    imageToUrl(primary.ogImage) ||
    imageToUrl(secondary.ogImage) ||
    imageToUrl(globalShare);
  const ogImageAlt =
    imageToAlt(primary.ogImage, primary.ogImageAlt) ||
    imageToAlt(secondary.ogImage, secondary.ogImageAlt) ||
    globalShare?.alt;

  return {
    title,
    description,
    keywords: keywordsToArray(primary.keywords || secondary.keywords),
    focusKeyphrase: primary.focusKeyphrase || secondary.focusKeyphrase || undefined,
    canonicalPath: normalizeCanonicalPath(primary.canonicalPath || secondary.canonicalPath || input.pathname),
    robots,
    ogTitle: primary.ogTitle || secondary.ogTitle || undefined,
    ogDescription: primary.ogDescription || secondary.ogDescription || undefined,
    ogImage: ogImageValue,
    ogImageAlt,
    twitterCard: sanitizeTwitterCard(primary.twitterCard || secondary.twitterCard, input.siteSettings.twitterCard),
    metadataSource: input.metadataSource,
    noindex: robots.includes("noindex"),
    schemaJson: primary.schemaJson || secondary.schemaJson,
    siteSettings: input.siteSettings,
    globalContent: input.globalContent,
  };
}

export async function resolveStaticPageSeo(pageKey: Exclude<ContentPageKey, "global">): Promise<ResolvedSeoMetadata> {
  const [pageContent, siteSettings, globalContent] = await Promise.all([
    getPublishedContentDirect<Record<string, unknown>>(pageKey),
    getSeoSiteSettings(),
    getPublishedContentDirect<GlobalContent>("global"),
  ]);
  const seo = mapContentHubSeo(pageContent.seo as SeoFields | undefined);
  const fallbackTitle = typeof pageContent.hero === "object" && pageContent.hero && "title" in pageContent.hero
    ? String((pageContent.hero as { title?: unknown }).title || getBrandName(globalContent))
    : getBrandName(globalContent);
  const fallbackDescription = typeof pageContent.hero === "object" && pageContent.hero && "description" in pageContent.hero
    ? String((pageContent.hero as { description?: unknown }).description || DEFAULT_DESCRIPTION)
    : DEFAULT_DESCRIPTION;

  return mergeSeo({
    primary: seo,
    fallbackTitle,
    fallbackDescription,
    pathname: STATIC_PAGE_PATHS[pageKey],
    siteSettings,
    globalContent,
    metadataSource: `Published SitePageContent.seo:${pageKey}`,
  });
}

export async function buildStaticPageMetadata(pageKey: Exclude<ContentPageKey, "global">): Promise<StaticPageSeoResult> {
  const resolved = await resolveStaticPageSeo(pageKey);
  const metadata = buildPageMetadata({
    pageTitle: resolved.title,
    pageDescription: resolved.description,
    pathname: resolved.canonicalPath,
    robots: resolved.robots,
    keywords: resolved.keywords,
    ogTitle: resolved.ogTitle,
    ogDescription: resolved.ogDescription,
    ogImage: resolved.ogImage,
    ogImageAlt: resolved.ogImageAlt,
    twitterCard: resolved.twitterCard,
    locale: resolved.siteSettings.locale,
    siteName: getBrandName(resolved.globalContent),
    titleTemplate: resolved.siteSettings.titleTemplate,
    twitterHandle: resolved.siteSettings.twitterHandle,
    publisher: getBrandName(resolved.globalContent),
  });
  return { metadata, resolved };
}

export async function resolveEntitySeoMetadata(input: {
  scopeKey: string;
  pageKey: string;
  pathname: string;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  fallbackImage?: string | null;
  fallbackImageAlt?: string | null;
  noindex?: boolean;
  entitySeo?: SeoMetadataInput;
}): Promise<ResolvedSeoMetadata> {
  const [record, siteSettings, globalContent] = await Promise.all([
    getSeoMetadata(input.scopeKey),
    getSeoSiteSettings(),
    getPublishedContentDirect<GlobalContent>("global"),
  ]);
  const recordSeo = mapEntitySeoRecord(record as EntitySeoRecord | null);
  const fallbackSeo: SeoMetadataInput = {
    ...input.entitySeo,
    title: input.entitySeo?.title || input.fallbackTitle,
    description: input.entitySeo?.description || input.fallbackDescription || DEFAULT_DESCRIPTION,
    ogImage: input.entitySeo?.ogImage || input.fallbackImage,
    ogImageAlt: input.entitySeo?.ogImageAlt || input.fallbackImageAlt,
  };

  return mergeSeo({
    primary: recordSeo,
    secondary: fallbackSeo,
    fallbackTitle: input.fallbackTitle,
    fallbackDescription: input.fallbackDescription || DEFAULT_DESCRIPTION,
    pathname: input.pathname,
    siteSettings,
    globalContent,
    metadataSource: record ? `SeoMetadata:${input.scopeKey}` : `Entity:${input.pageKey}`,
    noindex: input.noindex,
  });
}

export async function buildEntityPageMetadata(input: Parameters<typeof resolveEntitySeoMetadata>[0]) {
  const resolved = await resolveEntitySeoMetadata(input);
  return buildPageMetadata({
    pageTitle: resolved.title,
    pageDescription: resolved.description,
    pathname: resolved.canonicalPath,
    robots: resolved.robots,
    keywords: resolved.keywords,
    ogTitle: resolved.ogTitle,
    ogDescription: resolved.ogDescription,
    ogImage: resolved.ogImage,
    ogImageAlt: resolved.ogImageAlt,
    twitterCard: resolved.twitterCard,
    locale: resolved.siteSettings.locale,
    siteName: getBrandName(resolved.globalContent),
    titleTemplate: resolved.siteSettings.titleTemplate,
    twitterHandle: resolved.siteSettings.twitterHandle,
    publisher: getBrandName(resolved.globalContent),
  });
}
