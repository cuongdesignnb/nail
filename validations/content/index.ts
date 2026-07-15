/**
 * Content Hub CMS — Validation Schemas barrel export.
 *
 * Re-exports every page schema and provides a `getSchemaForPage` helper
 * that returns the correct publish / draft schema for a given page key.
 */

import type { ZodTypeAny } from "zod";
import type { ContentPageKey } from "@/lib/content/content.types";

/* ------------------------------------------------------------------ */
/*  Re-exports: shared                                                */
/* ------------------------------------------------------------------ */

export * from "./shared.schema";
export * from "./media-reference.schema";

/* ------------------------------------------------------------------ */
/*  Re-exports: page schemas                                          */
/* ------------------------------------------------------------------ */

export {
  globalContentSchema,
  globalContentDraftSchema,
  type GlobalContentInput,
  type GlobalContentDraftInput,
} from "./global.schema";

export {
  homePageContentSchema,
  homePageContentDraftSchema,
  type HomePageContentInput,
  type HomePageContentDraftInput,
} from "./home.schema";

export {
  aboutPageContentSchema,
  aboutPageContentDraftSchema,
  type AboutPageContentInput,
  type AboutPageContentDraftInput,
} from "./about.schema";

export {
  servicesPageContentSchema,
  servicesPageContentDraftSchema,
  type ServicesPageContentInput,
  type ServicesPageContentDraftInput,
} from "./services-page.schema";

export {
  galleryPageContentSchema,
  galleryPageContentDraftSchema,
  type GalleryPageContentInput,
  type GalleryPageContentDraftInput,
} from "./gallery-page.schema";

export {
  packagesPageContentSchema,
  packagesPageContentDraftSchema,
  type PackagesPageContentInput,
  type PackagesPageContentDraftInput,
} from "./packages-page.schema";

export {
  promotionsPageContentSchema,
  promotionsPageContentDraftSchema,
  type PromotionsPageContentInput,
  type PromotionsPageContentDraftInput,
} from "./promotions-page.schema";

export {
  contactPageContentSchema,
  contactPageContentDraftSchema,
  type ContactPageContentInput,
  type ContactPageContentDraftInput,
} from "./contact.schema";

export {
  blogPageContentSchema,
  blogPageContentDraftSchema,
  type BlogPageContentInput,
  type BlogPageContentDraftInput,
} from "./blog-page.schema";

/* ------------------------------------------------------------------ */
/*  Schema lookup maps                                                */
/* ------------------------------------------------------------------ */

import { globalContentSchema, globalContentDraftSchema } from "./global.schema";
import { homePageContentSchema, homePageContentDraftSchema } from "./home.schema";
import { aboutPageContentSchema, aboutPageContentDraftSchema } from "./about.schema";
import { servicesPageContentSchema, servicesPageContentDraftSchema } from "./services-page.schema";
import { galleryPageContentSchema, galleryPageContentDraftSchema } from "./gallery-page.schema";
import { packagesPageContentSchema, packagesPageContentDraftSchema } from "./packages-page.schema";
import { promotionsPageContentSchema, promotionsPageContentDraftSchema } from "./promotions-page.schema";
import { contactPageContentSchema, contactPageContentDraftSchema } from "./contact.schema";
import { blogPageContentSchema, blogPageContentDraftSchema } from "./blog-page.schema";

const publishSchemaMap: Record<ContentPageKey, ZodTypeAny> = {
  global: globalContentSchema,
  home: homePageContentSchema,
  about: aboutPageContentSchema,
  services: servicesPageContentSchema,
  gallery: galleryPageContentSchema,
  packages: packagesPageContentSchema,
  promotions: promotionsPageContentSchema,
  contact: contactPageContentSchema,
  blog: blogPageContentSchema,
};

const draftSchemaMap: Record<ContentPageKey, ZodTypeAny> = {
  global: globalContentDraftSchema,
  home: homePageContentDraftSchema,
  about: aboutPageContentDraftSchema,
  services: servicesPageContentDraftSchema,
  gallery: galleryPageContentDraftSchema,
  packages: packagesPageContentDraftSchema,
  promotions: promotionsPageContentDraftSchema,
  contact: contactPageContentDraftSchema,
  blog: blogPageContentDraftSchema,
};

/* ------------------------------------------------------------------ */
/*  Public helper                                                     */
/* ------------------------------------------------------------------ */

/**
 * Returns the Zod schema for a given page key.
 *
 * @param pageKey   One of the ContentPageKey values
 * @param mode      `"publish"` (strict, all required fields enforced)
 *                  or `"draft"` (permissive, most fields optional).
 *                  Defaults to `"publish"`.
 */
export function getSchemaForPage(
  pageKey: ContentPageKey,
  mode: "publish" | "draft" = "publish",
): ZodTypeAny {
  const map = mode === "draft" ? draftSchemaMap : publishSchemaMap;
  const schema = map[pageKey];
  if (!schema) {
    throw new Error(`No validation schema registered for page key "${pageKey}"`);
  }
  return schema;
}
