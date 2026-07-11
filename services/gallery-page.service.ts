import { prisma } from "@/lib/db";
import { getPublishedContent } from "@/lib/content/content.repository";
import { defaultGalleryContent } from "@/data/gallery.default";
import type { GalleryPageContent } from "@/types/gallery";

export async function fetchGalleryPageContent(): Promise<GalleryPageContent> {
  try {
    const [copy, categories, collections, items, trends, processSteps, testimonials] = await Promise.all([
      getPublishedContent("gallery") as Promise<Record<string, unknown>>,
      prisma.galleryCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryCollection.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryTrend.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryProcessStep.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryTestimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    ]);

    const pageCopy = { ...defaultGalleryContent, ...copy } as GalleryPageContent;
    return {
      ...pageCopy,
      categories: categories.map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description || undefined })),
      collections: collections.map((row) => ({ id: row.id, title: row.title, slug: row.slug, description: row.description || undefined, image: row.image, imageAlt: row.imageAlt || undefined, designCount: row.designCount })),
      items: items.map((row) => ({ id: row.id, categoryId: row.categoryId || undefined, title: row.title, slug: row.slug, description: row.description || undefined, image: row.image, imageAlt: row.imageAlt || undefined, tag: row.tag || undefined, isHighlight: row.isHighlight })),
      trends: trends.map((row) => ({ id: row.id, title: row.title, slug: row.slug, image: row.image || undefined, imageAlt: row.imageAlt || undefined })),
      processSteps: processSteps.map((row) => ({ id: row.id, step: row.step, icon: row.icon || undefined, title: row.title, description: row.description })),
      testimonials: testimonials.map((row) => ({ id: row.id, name: row.name, avatar: row.avatar || undefined, avatarAlt: row.avatarAlt || undefined, rating: row.rating, quote: row.quote })),
    };
  } catch (error) {
    console.error(JSON.stringify({ event: "GALLERY_LOAD_FAILED", error: error instanceof Error ? error.message : "unknown" }));
    return defaultGalleryContent;
  }
}
