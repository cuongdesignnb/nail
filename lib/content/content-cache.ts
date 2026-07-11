/**
 * Content Hub CMS — Cache Utilities
 *
 * Cache tag constants and revalidation helpers.
 */

import { revalidateTag, revalidatePath } from "next/cache";
import { ContentPageKey } from "./content.types";
import { getRegistryItem, getAllPublicPaths } from "./content-registry";

/* ------------------------------------------------------------------ */
/*  Cache Tags                                                        */
/* ------------------------------------------------------------------ */

export function contentCacheTag(pageKey: ContentPageKey): string {
  return `content:${pageKey}`;
}

export const CACHE_TAGS = {
  home: "content:home",
  about: "content:about",
  services: "content:services",
  gallery: "content:gallery",
  packages: "content:packages",
  promotions: "content:promotions",
  contact: "content:contact",
  blog: "content:blog",
  global: "content:global",
} as const;

/* ------------------------------------------------------------------ */
/*  Revalidation Helpers                                              */
/* ------------------------------------------------------------------ */

/**
 * Revalidate cache for a specific page after publish.
 * If global, revalidate ALL public pages.
 */
export function revalidateContentCache(pageKey: ContentPageKey) {
  // Always revalidate the page's own tag
  revalidateTag(contentCacheTag(pageKey));

  if (pageKey === "global") {
    // Global content affects all pages — revalidate everything
    const allPaths = getAllPublicPaths();
    for (const path of allPaths) {
      revalidatePath(path);
    }
    // Gift cards uses the global shell but is not a Content Hub page key.
    revalidatePath("/gift-cards");
    // Also revalidate all content tags since global data (header/footer) is used everywhere
    Object.values(CACHE_TAGS).forEach((tag) => {
      if (tag !== CACHE_TAGS.global) {
        revalidateTag(tag);
      }
    });
    // Revalidate public shell/header/footer tags
    revalidateTag("global-content");
    revalidateTag("public-shell");
    revalidateTag("public-header");
    revalidateTag("public-footer");
  } else {
    // Revalidate the public path for this specific page
    const item = getRegistryItem(pageKey);
    if (item?.publicPath) {
      revalidatePath(item.publicPath);
    }
  }
}

/** Cache revalidation interval in seconds */
export const CONTENT_CACHE_REVALIDATE = 60;
