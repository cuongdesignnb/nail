/**
 * Content Hub CMS — Content Mapper
 *
 * Maps between legacy service types and unified content types.
 * Provides backward compatibility during migration period.
 */

import { ContentPageKey } from "./content.types";
import type { AboutPageContent } from "@/types/about";
import type { ServicesPageContent } from "@/types/services";
import type { GalleryPageContent } from "@/types/gallery";
import type { PackagesPageContent } from "@/types/packages";
import type { BlogPageContent } from "@/types/blog";

/* ------------------------------------------------------------------ */
/*  Type Guards                                                       */
/* ------------------------------------------------------------------ */

export function isAboutContent(content: unknown): content is AboutPageContent {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  return "hero" in c && "story" in c && "missionVisionValues" in c;
}

export function isServicesContent(content: unknown): content is ServicesPageContent {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  return "hero" in c && "categories" in c && "signatureServices" in c;
}

export function isGalleryContent(content: unknown): content is GalleryPageContent {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  return "hero" in c && "collections" in c && "items" in c;
}

export function isPackagesContent(content: unknown): content is PackagesPageContent {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  return "hero" in c && "packages" in c && "benefits" in c;
}

export function isBlogContent(content: unknown): content is BlogPageContent {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  return "hero" in c && "newsletter" in c;
}

/* ------------------------------------------------------------------ */
/*  Content Casting                                                   */
/* ------------------------------------------------------------------ */

/**
 * Safely cast generic content record to a typed page content.
 * Returns null if the content doesn't match the expected shape.
 */
export function castContentForPage<T>(
  content: Record<string, unknown>,
  pageKey: ContentPageKey
): T | null {
  const guards: Record<string, (c: unknown) => boolean> = {
    about: isAboutContent,
    services: isServicesContent,
    gallery: isGalleryContent,
    packages: isPackagesContent,
    blog: isBlogContent,
  };

  const guard = guards[pageKey];
  if (guard && !guard(content)) return null;

  return content as T;
}

/**
 * Deep merge default content with partial content.
 * Used when migrating or when content may be incomplete.
 */
export function mergeWithDefaults<T extends Record<string, unknown>>(
  partial: Partial<T>,
  defaults: T
): T {
  const result = { ...defaults } as Record<string, unknown>;

  for (const key of Object.keys(partial)) {
    const partialValue = (partial as Record<string, unknown>)[key];
    const defaultValue = (defaults as Record<string, unknown>)[key];

    if (
      partialValue !== null &&
      partialValue !== undefined &&
      typeof partialValue === "object" &&
      !Array.isArray(partialValue) &&
      typeof defaultValue === "object" &&
      !Array.isArray(defaultValue) &&
      defaultValue !== null
    ) {
      result[key] = mergeWithDefaults(
        partialValue as Record<string, unknown>,
        defaultValue as Record<string, unknown>
      );
    } else if (partialValue !== undefined) {
      result[key] = partialValue;
    }
  }

  return result as T;
}
