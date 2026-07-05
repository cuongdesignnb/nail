import type { Metadata } from "next";
import type { SeoFields, GlobalContent, ImageField } from "@/lib/content/content.types";

export type RobotsDirective =
  | "index,follow"
  | "index,nofollow"
  | "noindex,follow"
  | "noindex,nofollow";

export type TwitterCard = "summary" | "summary_large_image";

export type SeoSiteSettings = {
  titleTemplate: string;
  defaultRobots: RobotsDirective;
  locale: string;
  twitterCard: TwitterCard;
  twitterHandle?: string | null;
  enableWebSiteSchema: boolean;
  enableNailSalonSchema: boolean;
  enableBreadcrumbSchema: boolean;
  enableFaqSchema: boolean;
  enableArticleSchema: boolean;
  enableServiceSchema: boolean;
  businessType: string;
  priceRange?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  googleBusinessProfileUrl?: string | null;
  googleMapsUrl?: string | null;
  sameAs?: unknown;
  googleSiteVerification?: string | null;
  bingSiteVerification?: string | null;
};

export type SeoMetadataInput = {
  title?: string | null;
  description?: string | null;
  keywords?: string | string[] | null;
  focusKeyphrase?: string | null;
  canonicalPath?: string | null;
  robots?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | ImageField | null;
  ogImageMediaId?: string | null;
  ogImageAlt?: string | null;
  twitterCard?: string | null;
  schemaJson?: unknown;
};

export type ResolvedSeoMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  focusKeyphrase?: string;
  canonicalPath: string;
  robots: RobotsDirective;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard: TwitterCard;
  metadataSource: string;
  noindex: boolean;
  schemaJson?: unknown;
  siteSettings: SeoSiteSettings;
  globalContent: GlobalContent;
};

export type BuildPageMetadataInput = {
  pageTitle: string;
  pageDescription: string;
  pathname: string;
  robots?: string | null;
  keywords?: string[] | string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogImageAlt?: string | null;
  twitterCard?: string | null;
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
  pageType?: "website" | "article";
  locale?: string | null;
  siteName?: string | null;
  titleTemplate?: string | null;
  twitterHandle?: string | null;
  authors?: Metadata["authors"];
  publisher?: string | null;
  category?: string | null;
};

export type StaticPageSeoResult = {
  metadata: Metadata;
  resolved: ResolvedSeoMetadata;
};

export type EntitySeoRecord = {
  scopeKey: string;
  pageKey: string;
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  focusKeyphrase?: string | null;
  canonicalPath?: string | null;
  robots?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogImageMediaId?: string | null;
  ogImageAlt?: string | null;
  twitterCard?: string | null;
  schemaJson?: unknown;
};

export type SeoAuditRow = {
  url: string;
  type: string;
  metadataSource: string;
  titleStatus: string;
  descriptionStatus: string;
  canonicalStatus: string;
  ogStatus: string;
  schemaStatus: string;
  sitemapStatus: string;
  action: string;
};

