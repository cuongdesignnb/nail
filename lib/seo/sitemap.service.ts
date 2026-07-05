import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { STATIC_PAGE_PATHS, STATIC_SEO_PAGE_KEYS } from "./seo.constants";
import { buildAbsoluteUrl } from "./site-url";

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const staticContent = await prisma.sitePageContent.findMany({
    where: {
      slug: { in: STATIC_SEO_PAGE_KEYS },
      publishedContent: { not: undefined },
    },
    select: {
      slug: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  const contentBySlug = new Map(staticContent.map((item) => [item.slug, item]));

  const staticEntries: MetadataRoute.Sitemap = STATIC_SEO_PAGE_KEYS.map((pageKey) => {
    const content = contentBySlug.get(pageKey);
    return {
      url: buildAbsoluteUrl(STATIC_PAGE_PATHS[pageKey]),
      lastModified: content?.publishedAt || content?.updatedAt || new Date(),
      changeFrequency: pageKey === "blog" ? "daily" : "weekly",
      priority: pageKey === "home" ? 1 : pageKey === "services" ? 0.9 : 0.7,
    };
  });

  const now = new Date();
  const [posts, services] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: now },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: buildAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: buildAbsoluteUrl(`/services/${service.slug}`),
    lastModified: service.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}

