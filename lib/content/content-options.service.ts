import { prisma } from "@/lib/db";

export interface EntityOption {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
  status?: string;
}

function normalizeOptionType(type: string) {
  const aliases: Record<string, string> = {
    services: "service",
    "service-categories": "serviceCategory",
    packages: "package",
    promotions: "promotion",
    technicians: "technician",
    reviews: "review",
    "blog-posts": "blogPost",
    "blog-categories": "blogCategory",
    "gallery-items": "galleryItem",
    "gallery-collections": "galleryCollection",
    "gallery-trends": "galleryTrend",
  };

  return aliases[type] ?? type;
}

export async function getEntityOptions(type: string): Promise<EntityOption[]> {
  switch (normalizeOptionType(type)) {
    case 'service': {
      const items = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        subtitle: item.shortDescription || item.slug,
        image: item.image || undefined,
        status: item.isActive ? 'active' : 'inactive',
      }));
    }

    case 'serviceCategory': {
      const items = await prisma.serviceCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        subtitle: item.description || item.slug,
        status: 'active',
      }));
    }

    case 'package': {
      const items = await prisma.nailPackage.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        subtitle: item.subtitle || item.shortDescription || item.slug,
        image: item.image || undefined,
        status: item.isActive ? 'active' : 'inactive',
      }));
    }

    case 'technician': {
      const items = await prisma.technician.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        subtitle: `${item.role} • ${item.specialty}`,
        image: item.avatar || undefined,
        status: item.isActive ? 'active' : 'inactive',
      }));
    }

    case 'promotion': {
      const items = await prisma.promotion.findMany({
        where: { active: true },
        orderBy: { title: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        subtitle: `${item.code} • ${item.type}`,
        image: item.bannerImage || undefined,
        status: item.active ? 'active' : 'inactive',
      }));
    }

    case 'galleryCollection': {
      const items = await prisma.galleryCollection.findMany({
        where: { isActive: true },
        orderBy: { title: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        subtitle: item.slug,
        image: item.image || undefined,
        status: item.isActive ? 'active' : 'inactive',
      }));
    }

    case 'galleryItem': {
      const items = await prisma.galleryItem.findMany({
        where: { isActive: true },
        orderBy: { title: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        subtitle: item.description || item.slug,
        image: item.image || undefined,
        status: 'active',
      }));
    }

    case 'galleryTrend': {
      const items = await prisma.galleryTrend.findMany({
        where: { isActive: true },
        orderBy: { title: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        subtitle: item.slug,
        image: item.image || undefined,
        status: 'active',
      }));
    }

    case 'review': {
      const items = await prisma.review.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.customer,
        subtitle: `Rating: ${item.rating}★ • "${item.text.slice(0, 40)}..."`,
        status: item.approved ? 'approved' : 'pending',
      }));
    }

    case 'blogPost': {
      const items = await prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { title: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        subtitle: item.authorName || undefined,
        image: item.coverImage || undefined,
        status: item.status.toLowerCase(),
      }));
    }

    case 'blogCategory': {
      const items = await prisma.blogCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        subtitle: item.description || item.slug,
        status: 'active',
      }));
    }

    default:
      throw new Error(`Unsupported option type: ${type}`);
  }
}
