import { prisma } from "@/lib/db";
import { defaultGalleryContent } from "@/data/gallery.default";
import { GalleryPageContent } from "@/types/gallery";

export async function fetchGalleryPageContent(): Promise<GalleryPageContent> {
  try {
    // 1. Fetch Setting (get first or default)
    const dbSetting = await prisma.galleryPageSetting.findFirst();

    // 2. Fetch Active Categories
    const dbCategories = await prisma.galleryCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 3. Fetch Active Collections
    const dbCollections = await prisma.galleryCollection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 4. Fetch Active Gallery Items
    const dbItems = await prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 5. Fetch Active Trends
    const dbTrends = await prisma.galleryTrend.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 6. Fetch Active Process Steps
    const dbSteps = await prisma.galleryProcessStep.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 7. Fetch Active Testimonials
    const dbTestimonials = await prisma.galleryTestimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // If DB is empty, fallback to static defaults
    if (!dbSetting && dbCategories.length === 0 && dbItems.length === 0) {
      return defaultGalleryContent;
    }

    // Mapping logic
    const mappedCategories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || undefined,
    }));

    const mappedCollections = dbCollections.map((col) => ({
      id: col.id,
      title: col.title,
      slug: col.slug,
      description: col.description || undefined,
      image: col.image,
      imageAlt: col.imageAlt || undefined,
      designCount: col.designCount,
    }));

    const mappedItems = dbItems.map((item) => ({
      id: item.id,
      categoryId: item.categoryId || undefined,
      title: item.title,
      slug: item.slug,
      description: item.description || undefined,
      image: item.image,
      imageAlt: item.imageAlt || undefined,
      tag: item.tag || undefined,
      isHighlight: item.isHighlight,
    }));

    const mappedTrends = dbTrends.map((tr) => ({
      id: tr.id,
      title: tr.title,
      slug: tr.slug,
      image: tr.image || undefined,
      imageAlt: tr.imageAlt || undefined,
    }));

    const mappedSteps = dbSteps.map((st) => ({
      id: st.id,
      step: st.step,
      icon: st.icon || undefined,
      title: st.title,
      description: st.description,
    }));

    const mappedTestimonials = dbTestimonials.map((t) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar || undefined,
      avatarAlt: t.avatarAlt || undefined,
      rating: t.rating,
      quote: t.quote,
    }));

    return {
      seo: {
        title: dbSetting?.seoTitle || defaultGalleryContent.seo.title,
        description: dbSetting?.seoDescription || defaultGalleryContent.seo.description,
      },
      hero: {
        eyebrow: dbSetting?.heroEyebrow || defaultGalleryContent.hero.eyebrow,
        title: dbSetting?.heroTitle || defaultGalleryContent.hero.title,
        highlight: dbSetting?.heroHighlight || defaultGalleryContent.hero.highlight,
        description: dbSetting?.heroDescription || defaultGalleryContent.hero.description,
        image: {
          src: dbSetting?.heroImage || defaultGalleryContent.hero.image.src,
          alt: dbSetting?.heroImageAlt || defaultGalleryContent.hero.image.alt,
        },
        primaryButton: {
          label: dbSetting?.primaryButtonLabel || defaultGalleryContent.hero.primaryButton.label,
          href: dbSetting?.primaryButtonHref || defaultGalleryContent.hero.primaryButton.href,
        },
        secondaryButton: {
          label: dbSetting?.secondaryButtonLabel || defaultGalleryContent.hero.secondaryButton.label,
          href: dbSetting?.secondaryButtonHref || defaultGalleryContent.hero.secondaryButton.href,
        },
      },
      categories: mappedCategories.length > 0 ? mappedCategories : defaultGalleryContent.categories,
      collections: mappedCollections.length > 0 ? mappedCollections : defaultGalleryContent.collections,
      items: mappedItems.length > 0 ? mappedItems : defaultGalleryContent.items,
      whyChoose: {
        eyebrow: dbSetting?.whyEyebrow || defaultGalleryContent.whyChoose.eyebrow,
        title: dbSetting?.whyTitle || defaultGalleryContent.whyChoose.title,
        description: dbSetting?.whyDescription || defaultGalleryContent.whyChoose.description,
        image: {
          src: dbSetting?.whyImage || defaultGalleryContent.whyChoose.image.src,
          alt: dbSetting?.whyImageAlt || defaultGalleryContent.whyChoose.image.alt,
        },
        features: defaultGalleryContent.whyChoose.features,
      },
      trends: mappedTrends.length > 0 ? mappedTrends : defaultGalleryContent.trends,
      processSteps: mappedSteps.length > 0 ? mappedSteps : defaultGalleryContent.processSteps,
      testimonials: mappedTestimonials.length > 0 ? mappedTestimonials : defaultGalleryContent.testimonials,
      cta: {
        title: dbSetting?.ctaTitle || defaultGalleryContent.cta.title,
        description: dbSetting?.ctaDescription || defaultGalleryContent.cta.description,
        button: {
          label: dbSetting?.ctaButtonLabel || defaultGalleryContent.cta.button.label,
          href: dbSetting?.ctaButtonHref || defaultGalleryContent.cta.button.href,
        },
        phone: dbSetting?.phone || defaultGalleryContent.cta.phone,
        email: dbSetting?.email || defaultGalleryContent.cta.email,
        address: dbSetting?.address || defaultGalleryContent.cta.address,
        hours: dbSetting?.hours || defaultGalleryContent.cta.hours,
      },
    };
  } catch (error) {
    console.error("fetchGalleryPageContent error, falling back:", error);
    return defaultGalleryContent;
  }
}
