/**
 * Content Hub CMS — Content Repository
 *
 * Unified CRUD operations on SitePageContent.
 * All page content is stored in a single table, keyed by slug (= pageKey).
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ContentPageKey, ContentPageMeta, ContentPageData } from "./content.types";
import { isValidPageKey } from "./content-registry";
import { computeContentStatus, computeCompletion } from "./content-status";
import { mergeWithDefaults } from "./content-mapper";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/**
 * Lazily load defaults to avoid circular dependency at module load time.
 * content-defaults.ts may not exist yet during initial setup.
 */
async function getDefaultForPage(pageKey: ContentPageKey): Promise<Record<string, unknown>> {
  const { getDefaultContent } = await import("./content-defaults");
  return getDefaultContent(pageKey) as Record<string, unknown>;
}

async function ensurePageRecord(pageKey: ContentPageKey) {
  const defaultContent = await getDefaultForPage(pageKey);
  return prisma.sitePageContent.upsert({
    where: { slug: pageKey },
    update: {},
    create: {
      slug: pageKey,
      draftContent: defaultContent as unknown as Prisma.InputJsonValue,
      publishedContent: defaultContent as unknown as Prisma.InputJsonValue,
    },
  });
}

async function withDefaultContent(
  pageKey: ContentPageKey,
  content: unknown
): Promise<Record<string, unknown>> {
  const defaults = await getDefaultForPage(pageKey);
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return defaults;
  }
  return mergeWithDefaults(content as Record<string, unknown>, defaults);
}

async function audit(action: string, actor: string, pageKey: string) {
  try {
    await prisma.auditLog.create({
      data: { actor, action, entity: `SitePageContent:${pageKey}` },
    });
  } catch {
    // AuditLog is best-effort — don't fail content operations
    console.warn(`Failed to write audit log: ${action} by ${actor} on ${pageKey}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Read Operations                                                   */
/* ------------------------------------------------------------------ */

/**
 * Get full content data for a page (used by admin editor).
 */
export async function getPageContent(pageKey: ContentPageKey): Promise<ContentPageData> {
  const record = await ensurePageRecord(pageKey);
  const draft = await withDefaultContent(pageKey, record.draftContent);
  const published = record.publishedContent
    ? await withDefaultContent(pageKey, record.publishedContent)
    : null;

  return {
    key: pageKey,
    draftContent: draft,
    publishedContent: published,
    version: record.version,
    updatedAt: record.updatedAt?.toISOString() ?? null,
    updatedBy: record.updatedBy ?? null,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    publishedBy: record.publishedBy ?? null,
    hasUnpublishedChanges: published
      ? JSON.stringify(draft) !== JSON.stringify(published)
      : true,
  };
}

/**
 * Get metadata for all pages (used by Content Hub overview).
 */
export async function getAllPageMeta(): Promise<ContentPageMeta[]> {
  // Ensure all pages exist
  const allKeys: ContentPageKey[] = [
    "home", "about", "services", "gallery", "packages",
    "promotions", "contact", "blog", "global",
  ];

  const results: ContentPageMeta[] = [];

  for (const pageKey of allKeys) {
    const record = await ensurePageRecord(pageKey);
    const draft = await withDefaultContent(pageKey, record.draftContent);
    const published = record.publishedContent
      ? await withDefaultContent(pageKey, record.publishedContent)
      : null;
    const hasUnpublishedChanges = published
      ? JSON.stringify(draft) !== JSON.stringify(published)
      : true;

    const completion = computeCompletion(draft, pageKey);
    const status = computeContentStatus(
      { draftContent: draft, publishedContent: published },
      pageKey
    );

    results.push({
      key: pageKey,
      status,
      updatedAt: record.updatedAt?.toISOString() ?? null,
      updatedBy: record.updatedBy ?? null,
      publishedAt: record.publishedAt?.toISOString() ?? null,
      publishedBy: record.publishedBy ?? null,
      version: record.version,
      hasUnpublishedChanges,
      completion,
    });
  }

  return results;
}

/**
 * Get published content only (used by public pages).
 */
export async function getPublishedContent(pageKey: ContentPageKey): Promise<Record<string, unknown>> {
  const record = await ensurePageRecord(pageKey);
  if (record.publishedContent) {
    return await withDefaultContent(pageKey, record.publishedContent);
  }
  return await getDefaultForPage(pageKey);
}

/**
 * Get draft content only (used by preview).
 */
export async function getDraftContent(pageKey: ContentPageKey): Promise<Record<string, unknown>> {
  const record = await ensurePageRecord(pageKey);
  return await withDefaultContent(pageKey, record.draftContent);
}

/* ------------------------------------------------------------------ */
/*  Write Operations                                                  */
/* ------------------------------------------------------------------ */

/**
 * Save draft content with optimistic locking.
 */
export async function saveDraftContent(input: {
  pageKey: ContentPageKey;
  content: Record<string, unknown>;
  version: number;
  actor: string;
}) {
  if (!isValidPageKey(input.pageKey)) {
    throw Object.assign(new Error("Invalid page key"), { name: "NOT_FOUND" });
  }

  const record = await ensurePageRecord(input.pageKey);

  if (record.version !== input.version) {
    throw Object.assign(
      new Error("This content was updated by another administrator. Reload the latest version before saving your changes."),
      { name: "VERSION_CONFLICT" }
    );
  }

  const updated = await prisma.sitePageContent.update({
    where: { slug: input.pageKey },
    data: {
      draftContent: input.content as unknown as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: input.actor,
    },
  });

  await audit("CONTENT_DRAFT_SAVED", input.actor, input.pageKey);
  return updated;
}

/**
 * Publish: copy draft → published.
 */
export async function publishContent(input: {
  pageKey: ContentPageKey;
  version: number;
  actor: string;
}) {
  if (!isValidPageKey(input.pageKey)) {
    throw Object.assign(new Error("Invalid page key"), { name: "NOT_FOUND" });
  }

  const record = await ensurePageRecord(input.pageKey);

  if (record.version !== input.version) {
    throw Object.assign(
      new Error("This content was updated by another administrator. Reload the latest version before saving your changes."),
      { name: "VERSION_CONFLICT" }
    );
  }

  const updated = await prisma.sitePageContent.update({
    where: { slug: input.pageKey },
    data: {
      publishedContent: record.draftContent as Prisma.InputJsonValue,
      publishedAt: new Date(),
      publishedBy: input.actor,
      version: { increment: 1 },
    },
  });

  await audit("CONTENT_PUBLISHED", input.actor, input.pageKey);
  return updated;
}

/**
 * Discard draft: reset draft to match published content.
 */
export async function discardDraft(input: {
  pageKey: ContentPageKey;
  actor: string;
}) {
  if (!isValidPageKey(input.pageKey)) {
    throw Object.assign(new Error("Invalid page key"), { name: "NOT_FOUND" });
  }

  const record = await ensurePageRecord(input.pageKey);
  const fallback = await getDefaultForPage(input.pageKey);

  const updated = await prisma.sitePageContent.update({
    where: { slug: input.pageKey },
    data: {
      draftContent: (record.publishedContent ?? fallback) as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: input.actor,
    },
  });

  await audit("CONTENT_DRAFT_DISCARDED", input.actor, input.pageKey);
  return updated;
}

/**
 * Restore default: reset draft to factory default content.
 */
export async function restoreDefault(input: {
  pageKey: ContentPageKey;
  actor: string;
}) {
  if (!isValidPageKey(input.pageKey)) {
    throw Object.assign(new Error("Invalid page key"), { name: "NOT_FOUND" });
  }

  const fallback = await getDefaultForPage(input.pageKey);

  const updated = await prisma.sitePageContent.update({
    where: { slug: input.pageKey },
    data: {
      draftContent: fallback as unknown as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: input.actor,
    },
  });

  await audit("CONTENT_DEFAULT_RESTORED", input.actor, input.pageKey);
  return updated;
}
