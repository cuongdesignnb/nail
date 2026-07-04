/**
 * Content Hub CMS — Content Status Utilities
 *
 * Pure functions that derive status and completion info from
 * a content record. No side-effects, no DB access.
 */

import type {
  ContentPageKey,
  ContentStatus,
  ContentCompletionInfo,
} from "./content.types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Minimal shape expected from a content DB record. */
export type ContentRecord = {
  draftContent: Record<string, unknown>;
  publishedContent: Record<string, unknown> | null;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function deepGet(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc !== null && acc !== undefined && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

/* ------------------------------------------------------------------ */
/*  Required Field Definitions per Page                                */
/* ------------------------------------------------------------------ */

type RequiredField = {
  path: string;
  label: string;
  check: "string" | "array" | "image";
};

/**
 * Image fields require both `src` and `alt` to be non-empty strings.
 */
function checkImageField(obj: Record<string, unknown>, path: string): boolean {
  const img = deepGet(obj, path);
  if (!img || typeof img !== "object") return false;
  const record = img as Record<string, unknown>;
  return isNonEmptyString(record.src) && isNonEmptyString(record.alt);
}

/** Fields every page must have. */
const commonFields: RequiredField[] = [
  { path: "seo.title", label: "SEO title", check: "string" },
  { path: "seo.description", label: "SEO description", check: "string" },
  { path: "hero.image", label: "Hero image", check: "image" },
];

/** Page-specific additional required fields. */
const pageSpecificFields: Partial<Record<ContentPageKey, RequiredField[]>> = {
  home: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "aboutPreview.title", label: "About preview title", check: "string" },
    { path: "aboutPreview.image", label: "About preview image", check: "image" },
    { path: "finalCta.title", label: "Final CTA title", check: "string" },
    { path: "finalCta.button.label", label: "Final CTA button label", check: "string" },
  ],
  about: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
  ],
  services: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "cta.title", label: "CTA section title", check: "string" },
    { path: "cta.button.label", label: "CTA button label", check: "string" },
  ],
  gallery: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "cta.title", label: "CTA section title", check: "string" },
    { path: "cta.button.label", label: "CTA button label", check: "string" },
  ],
  packages: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "cta.title", label: "CTA section title", check: "string" },
    { path: "cta.button.label", label: "CTA button label", check: "string" },
  ],
  promotions: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "promotionIntro.title", label: "Promotion intro title", check: "string" },
    { path: "finalCta.title", label: "Final CTA title", check: "string" },
    { path: "finalCta.button.label", label: "Final CTA button label", check: "string" },
  ],
  contact: [
    { path: "contactInfo.phone", label: "Contact phone number", check: "string" },
    { path: "contactInfo.email", label: "Contact email address", check: "string" },
    { path: "contactInfo.address", label: "Contact address", check: "string" },
    { path: "openingHours.schedule", label: "Opening hours schedule", check: "array" },
    { path: "finalCta.title", label: "Final CTA title", check: "string" },
    { path: "finalCta.button.label", label: "Final CTA button label", check: "string" },
  ],
  blog: [
    { path: "hero.primaryButton.label", label: "Hero primary CTA label", check: "string" },
    { path: "hero.primaryButton.href", label: "Hero primary CTA link", check: "string" },
    { path: "newsletter.title", label: "Newsletter section title", check: "string" },
    { path: "cta.title", label: "CTA section title", check: "string" },
    { path: "cta.button.label", label: "CTA button label", check: "string" },
  ],
  global: [
    { path: "brand.name", label: "Brand name", check: "string" },
    { path: "brand.logo", label: "Brand logo", check: "image" },
    { path: "headerNav.cta.label", label: "Header CTA label", check: "string" },
    { path: "headerNav.cta.href", label: "Header CTA link", check: "string" },
    { path: "headerNav.items", label: "Header navigation items", check: "array" },
    { path: "footer.quickLinks", label: "Footer quick links", check: "array" },
    { path: "footer.contact.phone", label: "Footer contact phone", check: "string" },
    { path: "footer.contact.email", label: "Footer contact email", check: "string" },
    { path: "defaultContact.phone", label: "Default contact phone", check: "string" },
    { path: "defaultContact.email", label: "Default contact email", check: "string" },
  ],
};

/* ------------------------------------------------------------------ */
/*  computeCompletion                                                  */
/* ------------------------------------------------------------------ */

/**
 * Evaluates how complete a page's content is by checking required fields.
 * Returns a `ContentCompletionInfo` object with completed/total counts
 * and a list of human-readable labels for missing items.
 */
export function computeCompletion(
  content: Record<string, unknown>,
  pageKey: ContentPageKey,
): ContentCompletionInfo {
  // Global page has no hero/SEO at root level — use only page-specific fields
  const baseFields = pageKey === "global" ? [] : commonFields;
  const extraFields = pageSpecificFields[pageKey] ?? [];
  const allFields = [...baseFields, ...extraFields];

  const missing: string[] = [];

  for (const field of allFields) {
    let satisfied = false;

    switch (field.check) {
      case "string":
        satisfied = isNonEmptyString(deepGet(content, field.path));
        break;
      case "array":
        satisfied = isNonEmptyArray(deepGet(content, field.path));
        break;
      case "image":
        satisfied = checkImageField(content, field.path);
        break;
    }

    if (!satisfied) {
      missing.push(field.label);
    }
  }

  return {
    completed: allFields.length - missing.length,
    total: allFields.length,
    missing,
  };
}

/* ------------------------------------------------------------------ */
/*  computeContentStatus                                               */
/* ------------------------------------------------------------------ */

/**
 * Derives the display status of a content page from its draft and
 * published content.
 *
 * Priority order:
 *  1. `not-published`   — publishedContent is null (never published)
 *  2. `needs-attention`  — required fields are missing in the draft
 *  3. `draft-changes`    — draft differs from published
 *  4. `published`        — draft matches published, all fields present
 */
export function computeContentStatus(
  record: ContentRecord,
  pageKey: ContentPageKey,
): ContentStatus {
  // Never been published
  if (record.publishedContent === null) {
    return "not-published";
  }

  // Check completion of the draft
  const completion = computeCompletion(record.draftContent, pageKey);
  if (completion.missing.length > 0) {
    return "needs-attention";
  }

  // Compare draft vs published
  const draftJson = JSON.stringify(record.draftContent);
  const publishedJson = JSON.stringify(record.publishedContent);
  if (draftJson !== publishedJson) {
    return "draft-changes";
  }

  return "published";
}
