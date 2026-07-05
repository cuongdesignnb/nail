import { prisma } from "@/lib/db";
import { STATIC_PAGE_PATHS, STATIC_SEO_PAGE_KEYS, STATIC_SEO_SCOPE_KEYS } from "./seo.constants";
import { resolveStaticPageSeo } from "./seo.service";
import { buildAbsoluteUrl } from "./site-url";
import type { SeoAuditRow } from "./seo.types";

function status(value: unknown, ok = "OK", missing = "Missing") {
  return value ? ok : missing;
}

export async function getSeoAuditRows(): Promise<SeoAuditRow[]> {
  const rows: SeoAuditRow[] = [];

  for (const pageKey of STATIC_SEO_PAGE_KEYS) {
    const seo = await resolveStaticPageSeo(pageKey);
    rows.push({
      url: buildAbsoluteUrl(STATIC_PAGE_PATHS[pageKey]),
      type: "Static Page",
      metadataSource: seo.metadataSource,
      titleStatus: status(seo.title),
      descriptionStatus: status(seo.description),
      canonicalStatus: seo.noindex ? "Noindex" : status(seo.canonicalPath),
      ogStatus: status(seo.ogImage, "OK", "Missing image"),
      schemaStatus: pageKey === "home" || pageKey === "contact" ? "Eligible" : "Breadcrumb",
      sitemapStatus: seo.noindex ? "Excluded" : "Included",
      action: `/admin/content/${pageKey}?tab=seo`,
    });
  }

  const [legacyStatic, posts, services] = await Promise.all([
    prisma.seoMetadata.findMany({
      where: { scopeKey: { in: Array.from(STATIC_SEO_SCOPE_KEYS) } },
      select: { scopeKey: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true, excerpt: true, seoTitle: true, seoDescription: true, coverImage: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, image: true },
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
  ]);

  for (const record of legacyStatic) {
    rows.push({
      url: record.scopeKey,
      type: "Legacy Static SeoMetadata",
      metadataSource: "SeoMetadata",
      titleStatus: "Duplicate source",
      descriptionStatus: "Duplicate source",
      canonicalStatus: "Needs migration",
      ogStatus: "Needs migration",
      schemaStatus: "Needs migration",
      sitemapStatus: "Not applicable",
      action: `/admin/content/${record.scopeKey}?tab=seo`,
    });
  }

  for (const post of posts) {
    rows.push({
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
      type: "Blog Article",
      metadataSource: `BlogPost + SeoMetadata blog:${post.id}`,
      titleStatus: status(post.seoTitle || post.title),
      descriptionStatus: status(post.seoDescription || post.excerpt),
      canonicalStatus: "OK",
      ogStatus: status(post.coverImage, "OK", "Missing image"),
      schemaStatus: "BlogPosting",
      sitemapStatus: "Included",
      action: `/admin/seo?scopeKey=blog:${post.id}`,
    });
  }

  for (const service of services) {
    rows.push({
      url: buildAbsoluteUrl(`/services/${service.slug}`),
      type: "Service",
      metadataSource: `Service + SeoMetadata service:${service.id}`,
      titleStatus: status(service.name),
      descriptionStatus: "Entity fallback",
      canonicalStatus: "OK",
      ogStatus: status(service.image, "OK", "Missing image"),
      schemaStatus: "Service",
      sitemapStatus: "Included",
      action: `/admin/seo?scopeKey=service:${service.id}`,
    });
  }

  return rows;
}
