/**
 * Content Hub CMS — Content Service
 *
 * Server-side service layer with caching for public page consumption.
 * Admin operations use the repository directly.
 */

import { unstable_cache } from "next/cache";
import { ContentPageKey } from "./content.types";
import { getPublishedContent } from "./content.repository";
import { contentCacheTag, CONTENT_CACHE_REVALIDATE } from "./content-cache";
import { normalizeGlobalContent } from "@/lib/settings/normalize-global-content";

/* ------------------------------------------------------------------ */
/*  Cached Published Content Getters                                  */
/* ------------------------------------------------------------------ */

function createCachedGetter<T>(pageKey: ContentPageKey) {
  return unstable_cache(
    async (): Promise<T> => {
      try {
        const content = await getPublishedContent(pageKey);
        return content as T;
      } catch (error) {
        console.error(`Failed to load published ${pageKey} content. Falling back to default.`, error);
        const { getDefaultContent } = await import("./content-defaults");
        return getDefaultContent(pageKey) as T;
      }
    },
    [`content-${pageKey}`],
    {
      tags: [contentCacheTag(pageKey)],
      revalidate: CONTENT_CACHE_REVALIDATE,
    }
  );
}

/* ------------------------------------------------------------------ */
/*  Page-Specific Getters                                             */
/* ------------------------------------------------------------------ */

import type {
  HomePageContent,
  PromotionsPageContent,
  ContactPageContent,
  GlobalContent,
} from "./content.types";
import type { AboutPageContent } from "@/types/about";
import type { ServicesPageContent } from "@/types/services";
import type { GalleryPageContent } from "@/types/gallery";
import type { PackagesPageContent } from "@/types/packages";
import type { BlogPageContent } from "@/types/blog";

const getPublishedGlobalContentRaw = createCachedGetter<GlobalContent>("global");
export async function getPublishedGlobalContent(): Promise<GlobalContent> {
  return normalizeGlobalContent(await getPublishedGlobalContentRaw());
}
export const getPublishedHomeContent = createCachedGetter<HomePageContent>("home");
export const getPublishedAboutContent = createCachedGetter<AboutPageContent>("about");
export const getPublishedServicesPageContent = createCachedGetter<ServicesPageContent>("services");
export const getPublishedGalleryPageContent = createCachedGetter<GalleryPageContent>("gallery");
export const getPublishedPackagesPageContent = createCachedGetter<PackagesPageContent>("packages");
export const getPublishedPromotionsPageContent = createCachedGetter<PromotionsPageContent>("promotions");
export const getPublishedContactPageContent = createCachedGetter<ContactPageContent>("contact");
export const getPublishedBlogPageContent = createCachedGetter<BlogPageContent>("blog");

/* ------------------------------------------------------------------ */
/*  Generic Published Content Getter                                  */
/* ------------------------------------------------------------------ */

/**
 * Get published content for any page key with caching.
 * Prefer the typed getters above when possible.
 */
export async function getPublishedPageContent(pageKey: ContentPageKey): Promise<Record<string, unknown>> {
  switch (pageKey) {
    case "global": return await getPublishedGlobalContent() as unknown as Record<string, unknown>;
    case "home": return await getPublishedHomeContent() as unknown as Record<string, unknown>;
    case "about": return await getPublishedAboutContent() as unknown as Record<string, unknown>;
    case "services": return await getPublishedServicesPageContent() as unknown as Record<string, unknown>;
    case "gallery": return await getPublishedGalleryPageContent() as unknown as Record<string, unknown>;
    case "packages": return await getPublishedPackagesPageContent() as unknown as Record<string, unknown>;
    case "promotions": return await getPublishedPromotionsPageContent() as unknown as Record<string, unknown>;
    case "contact": return await getPublishedContactPageContent() as unknown as Record<string, unknown>;
    case "blog": return await getPublishedBlogPageContent() as unknown as Record<string, unknown>;
    default:
      throw new Error(`Unknown page key: ${pageKey}`);
  }
}
