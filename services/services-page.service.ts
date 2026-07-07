import { prisma } from "@/lib/db";
import { defaultServicesContent } from "@/data/services.default";
import { ServicesPageContent } from "@/types/services";

export async function fetchServicesPageContent(): Promise<ServicesPageContent> {
  try {
    // 1. Fetch Setting (get first or default)
    const dbSetting = await prisma.servicesPageSetting.findFirst();

    // 2. Fetch Active Categories
    const dbCategories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    // 3. Fetch Active Services
    const dbServices = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { subcategory: true },
    });

    // 4. Fetch Active Addons
    const dbAddons = await prisma.serviceAddon.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 5. Fetch Active Packages
    const dbPackages = await prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 6. Fetch Active FAQs
    const dbFaqs = await prisma.serviceFaq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 7. Fetch Active Gallery Items
    const dbGallery = await prisma.serviceGalleryItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // If setting does not exist and DB is empty, fallback to static defaults
    if (!dbSetting && dbCategories.length === 0 && dbServices.length === 0) {
      return defaultServicesContent;
    }

    // Mapping logic
    const mappedCategories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || undefined,
      icon: c.icon || undefined,
      subcategories: c.subcategories.map((sub) => ({
        id: sub.id,
        categoryId: sub.categoryId,
        name: sub.name,
        slug: sub.slug,
        description: sub.description || undefined,
        sortOrder: sub.sortOrder,
      })),
    }));

    const mappedServices = dbServices.map((s) => ({
      id: s.id,
      categoryId: s.categoryId || undefined,
      subcategoryId: s.subcategoryId || undefined,
      subcategory: s.subcategory ? {
        id: s.subcategory.id,
        categoryId: s.subcategory.categoryId,
        name: s.subcategory.name,
        slug: s.subcategory.slug,
        description: s.subcategory.description || undefined,
        sortOrder: s.subcategory.sortOrder,
      } : undefined,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription || undefined,
      description: s.description || undefined,
      image: s.image || undefined,
      imageAlt: s.imageAlt || undefined,
      price: s.price ? s.price.toString() : undefined,
      priceLabel: s.priceLabel || undefined,
      durationMinutes: s.durationMinutes || undefined,
      durationLabel: s.durationLabel || undefined,
      features: Array.isArray(s.features) ? (s.features as string[]) : [],
      isFeatured: s.isFeatured,
    }));

    const mappedAddons = dbAddons.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price ? a.price.toString() : undefined,
      priceLabel: a.priceLabel || undefined,
      description: a.description || undefined,
    }));

    const mappedPackages = dbPackages.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle || undefined,
      price: p.price ? p.price.toString() : undefined,
      priceLabel: p.priceLabel || undefined,
      badge: p.badge || undefined,
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
      isPopular: p.isPopular,
    }));

    const mappedFaqs = dbFaqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));

    const mappedGallery = dbGallery.map((g) => ({
      id: g.id,
      title: g.title || undefined,
      image: g.image,
      imageAlt: g.imageAlt || undefined,
      tag: g.tag || undefined,
    }));

    // Group pricing items dynamically for pricing matrix based on categories
    const pricingCategories = dbCategories.map((cat) => {
      const catServices = dbServices.filter((s) => s.categoryId === cat.id);
      const sections = cat.subcategories
        .map((sub) => {
          const items = catServices
            .filter((s) => s.subcategoryId === sub.id)
            .map((s) => ({
              name: s.name,
              priceLabel: s.priceLabel || `$${s.price ? s.price.toString() : "0"}`,
            }));
          return { id: sub.id, title: sub.name, items };
        })
        .filter((section) => section.items.length > 0);
      const unsectionedItems = catServices
        .filter((s) => !s.subcategoryId)
        .map((s) => ({
          name: s.name,
          priceLabel: s.priceLabel || `$${s.price ? s.price.toString() : "0"}`,
        }));
      return {
        id: cat.id,
        title: cat.name,
        items: sections.length > 0 ? unsectionedItems : catServices.map((s) => ({
          name: s.name,
          priceLabel: s.priceLabel || `$${s.price ? s.price.toString() : "0"}`,
        })),
        sections,
      };
    });

    // Add Add-ons as a special category in pricing matrix if addons exist
    if (mappedAddons.length > 0) {
      pricingCategories.push({
        id: "pm-addons",
        title: "Add-Ons",
        items: mappedAddons.map((a) => ({
          name: a.name,
          priceLabel: a.priceLabel || `$${a.price ? a.price.toString() : "0"}`,
        })),
        sections: [],
      });
    }

    return {
      seo: {
        title: dbSetting?.seoTitle || defaultServicesContent.seo.title,
        description: dbSetting?.seoDescription || defaultServicesContent.seo.description,
      },
      hero: {
        eyebrow: dbSetting?.heroEyebrow || defaultServicesContent.hero.eyebrow,
        title: dbSetting?.heroTitle || defaultServicesContent.hero.title,
        highlight: dbSetting?.heroHighlight || defaultServicesContent.hero.highlight,
        description: dbSetting?.heroDescription || defaultServicesContent.hero.description,
        image: {
          src: dbSetting?.heroImage || defaultServicesContent.hero.image.src,
          alt: dbSetting?.heroImageAlt || defaultServicesContent.hero.image.alt,
        },
        primaryButton: {
          label: dbSetting?.primaryButtonLabel || defaultServicesContent.hero.primaryButton.label,
          href: dbSetting?.primaryButtonHref || defaultServicesContent.hero.primaryButton.href,
          variant: "primary",
        },
        secondaryButton: {
          label: dbSetting?.secondaryButtonLabel || defaultServicesContent.hero.secondaryButton.label,
          href: dbSetting?.secondaryButtonHref || defaultServicesContent.hero.secondaryButton.href,
          variant: "secondary",
        },
      },
      categories: mappedCategories,
      signatureServices: mappedServices.filter((s) => s.isFeatured),
      whyChoose: {
        title: dbSetting?.whyChooseTitle || defaultServicesContent.whyChoose.title,
        description: dbSetting?.whyChooseDescription || defaultServicesContent.whyChoose.description,
        image: {
          src: dbSetting?.whyChooseImage || defaultServicesContent.whyChoose.image.src,
          alt: "Why choose us",
        },
        features: defaultServicesContent.whyChoose.features,
      },
      pricing: {
        categories: pricingCategories,
      },
      process: defaultServicesContent.process,
      gallery: mappedGallery,
      packages: mappedPackages,
      addons: mappedAddons,
      faqs: mappedFaqs,
      cta: {
        title: dbSetting?.ctaTitle || defaultServicesContent.cta.title,
        description: dbSetting?.ctaDescription || defaultServicesContent.cta.description,
        button: {
          label: dbSetting?.ctaButtonLabel || defaultServicesContent.cta.button.label,
          href: dbSetting?.ctaButtonHref || defaultServicesContent.cta.button.href,
          variant: "primary",
        },
        phone: dbSetting?.phone || defaultServicesContent.cta.phone,
        email: dbSetting?.email || defaultServicesContent.cta.email,
        address: dbSetting?.address || defaultServicesContent.cta.address,
        hours: dbSetting?.hours || defaultServicesContent.cta.hours,
      },
    };
  } catch (error) {
    console.error("fetchServicesPageContent error, falling back:", error);
    return defaultServicesContent;
  }
}
