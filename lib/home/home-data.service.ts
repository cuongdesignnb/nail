import { prisma } from "@/lib/db";

export type PublicHomeData = {
  services: Array<{ name: string; description: string; slug: string }>;
  gallery: Array<{ image: string; alt: string }>;
  packages: Array<{
    name: string;
    price: string;
    description: string;
    items: string[];
    popular: boolean;
  }>;
  technicians: Array<{ name: string; role: string; avatar: string }>;
};

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function getPublicHomeData(): Promise<PublicHomeData> {
  const [services, gallery, packages, technicians] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      take: 6,
      select: { name: true, slug: true, shortDescription: true, description: true },
    }),
    prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: [{ isHighlight: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
      select: { image: true, imageAlt: true, title: true },
    }),
    prisma.nailPackage.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ isPopular: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      take: 3,
      select: {
        name: true,
        price: true,
        priceLabel: true,
        shortDescription: true,
        description: true,
        features: true,
        isPopular: true,
      },
    }),
    prisma.technician.findMany({
      where: { isActive: true },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
      take: 3,
      select: { name: true, role: true, avatar: true },
    }),
  ]);

  return {
    services: services.map((service) => ({
      name: service.name,
      slug: service.slug,
      description: service.shortDescription || service.description || "",
    })),
    gallery: gallery.map((item) => ({ image: item.image, alt: item.imageAlt || item.title })),
    packages: packages.map((item) => ({
      name: item.name,
      price: item.priceLabel || (item.price === null ? "" : item.price.toString()),
      description: item.shortDescription || item.description || "",
      items: stringList(item.features),
      popular: item.isPopular,
    })),
    technicians: technicians.map((item) => ({
      name: item.name,
      role: item.role,
      avatar: item.avatar || "/nail-salon-interior.png",
    })),
  };
}
