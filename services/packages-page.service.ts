import { prisma } from "@/lib/db";
import { defaultPackagesContent } from "@/data/packages.default";
import { PackagesPageContent } from "@/types/packages";
import { getPublishedContent } from "@/lib/content/content.repository";

export async function fetchPackagesPageContent(): Promise<PackagesPageContent> {
  try {
    const pageCopy = await getPublishedContent("packages") as unknown as PackagesPageContent;

    // 2. Fetch Active Categories
    const dbCategories = await prisma.packageCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 3. Fetch Active Packages
    const dbPackages = await prisma.nailPackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 4. Fetch Active Benefits
    const dbBenefits = await prisma.packageBenefit.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 5. Fetch Active Comparison Features
    const dbComparison = await prisma.packageComparisonFeature.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 6. Fetch Active Rewards
    const dbRewards = await prisma.packageReward.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 7. Fetch Active Occasions
    const dbOccasions = await prisma.packageOccasion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 8. Fetch Active Process Steps
    const dbSteps = await prisma.packageProcessStep.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // 9. Fetch Active Testimonials (generic, pageKey = packages)
    const dbTestimonials = await prisma.pageTestimonial.findMany({
      where: { isActive: true, pageKey: "packages" },
      orderBy: { sortOrder: "asc" },
    });

    // 10. Fetch Active FAQs (generic, pageKey = packages)
    const dbFaqs = await prisma.pageFaq.findMany({
      where: { isActive: true, pageKey: "packages" },
      orderBy: { sortOrder: "asc" },
    });

    // Mapping DTO transformations
    const mappedCategories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || undefined,
    }));

    const mappedPackages = dbPackages.map((p) => ({
      id: p.id,
      categoryId: p.categoryId || undefined,
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      shortDescription: p.shortDescription || undefined,
      description: p.description || undefined,
      image: p.image || undefined,
      imageAlt: p.imageAlt || undefined,
      price: p.price ? p.price.toString() : undefined,
      priceLabel: p.priceLabel || undefined,
      durationLabel: p.durationLabel || undefined,
      visitCountLabel: p.visitCountLabel || undefined,
      badge: p.badge || undefined,
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
    }));

    const mappedBenefits = dbBenefits.map((b) => ({
      id: b.id,
      icon: b.icon || undefined,
      title: b.title,
      description: b.description,
    }));

    const mappedComparison = dbComparison.map((comp) => ({
      id: comp.id,
      featureName: comp.featureName,
      essentialValue: comp.essentialValue || undefined,
      signatureValue: comp.signatureValue || undefined,
      premiumValue: comp.premiumValue || undefined,
      vipValue: comp.vipValue || undefined,
    }));

    const mappedRewards = dbRewards.map((rew) => ({
      id: rew.id,
      icon: rew.icon || undefined,
      title: rew.title,
      description: rew.description,
      image: rew.image || undefined,
      imageAlt: rew.imageAlt || undefined,
      promoTitle: rew.promoTitle || undefined,
      promoValue: rew.promoValue || undefined,
      buttonLabel: rew.buttonLabel || undefined,
      buttonHref: rew.buttonHref || undefined,
    }));

    const mappedOccasions = dbOccasions.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      image: o.image || undefined,
      imageAlt: o.imageAlt || undefined,
      icon: o.icon || undefined,
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
      pageKey: t.pageKey,
      name: t.name,
      role: t.role || undefined,
      avatar: t.avatar || undefined,
      avatarAlt: t.avatarAlt || undefined,
      rating: t.rating,
      quote: t.quote,
    }));

    const mappedFaqs = dbFaqs.map((f) => ({
      id: f.id,
      pageKey: f.pageKey,
      question: f.question,
      answer: f.answer,
    }));

    // Find the promo reward config from rewards if any, else use default promo settings
    const promoItem = mappedRewards.find((r) => r.promoValue !== undefined);

    const pageContent: PackagesPageContent = {
      ...pageCopy,
      seo: pageCopy.seo,
      hero: pageCopy.hero,
      categories: mappedCategories.length > 0 ? mappedCategories : pageCopy.categories,
      packages: mappedPackages.length > 0 ? mappedPackages : pageCopy.packages,
      benefits: {
        ...pageCopy.benefits,
        items: mappedBenefits.length > 0 ? mappedBenefits : pageCopy.benefits.items,
      },
      comparison: {
        ...pageCopy.comparison,
        features: mappedComparison.length > 0 ? mappedComparison : pageCopy.comparison.features,
      },
      rewards: {
        ...pageCopy.rewards,
        items: mappedRewards.filter((reward) => !reward.promoValue).length ? mappedRewards.filter((reward) => !reward.promoValue) : pageCopy.rewards.items,
        promo: promoItem ? {
          ...pageCopy.rewards.promo,
          title: promoItem.promoTitle || pageCopy.rewards.promo.title,
          value: promoItem.promoValue || pageCopy.rewards.promo.value,
          description: promoItem.description || pageCopy.rewards.promo.description,
          image: promoItem.image ? { src: promoItem.image, alt: promoItem.imageAlt || "" } : pageCopy.rewards.promo.image,
          button: {
            label: promoItem.buttonLabel || pageCopy.rewards.promo.button.label,
            href: promoItem.buttonHref || pageCopy.rewards.promo.button.href,
          },
        } : pageCopy.rewards.promo,
      },
      occasions: {
        ...pageCopy.occasions,
        items: mappedOccasions.length > 0 ? mappedOccasions : pageCopy.occasions.items,
      },
      process: {
        ...pageCopy.process,
        steps: mappedSteps.length > 0 ? mappedSteps : pageCopy.process.steps,
      },
      testimonials: {
        ...pageCopy.testimonials,
        items: mappedTestimonials.length > 0 ? mappedTestimonials : pageCopy.testimonials.items,
      },
      faqs: {
        ...pageCopy.faqs,
        items: mappedFaqs.length > 0 ? mappedFaqs : pageCopy.faqs.items,
      },
      cta: pageCopy.cta,
    };

    return pageContent;
  } catch (error) {
    console.error("fetchPackagesPageContent Error, falling back to default:", error);
    return defaultPackagesContent;
  }
}
