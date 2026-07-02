import { prisma } from "@/lib/db";
import { defaultPackagesContent } from "@/data/packages.default";
import { PackagesPageContent } from "@/types/packages";

export async function fetchPackagesPageContent(): Promise<PackagesPageContent> {
  try {
    // 1. Fetch Page Setting
    const dbSetting = await prisma.packagePageSetting.findFirst();

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

    // If DB is completely empty for packages settings, fallback to defaults
    if (!dbSetting && dbCategories.length === 0 && dbPackages.length === 0) {
      return defaultPackagesContent;
    }

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
      seo: {
        title: dbSetting?.seoTitle || defaultPackagesContent.seo.title,
        description: dbSetting?.seoDescription || defaultPackagesContent.seo.description,
      },
      hero: {
        eyebrow: dbSetting?.heroEyebrow || defaultPackagesContent.hero.eyebrow,
        title: dbSetting?.heroTitle || defaultPackagesContent.hero.title,
        highlight: dbSetting?.heroHighlight || defaultPackagesContent.hero.highlight,
        description: dbSetting?.heroDescription || defaultPackagesContent.hero.description,
        image: {
          src: dbSetting?.heroImage || defaultPackagesContent.hero.image.src,
          alt: dbSetting?.heroImageAlt || defaultPackagesContent.hero.image.alt,
        },
        primaryButton: {
          label: dbSetting?.primaryButtonLabel || defaultPackagesContent.hero.primaryButton.label,
          href: dbSetting?.primaryButtonHref || defaultPackagesContent.hero.primaryButton.href,
        },
        secondaryButton: {
          label: dbSetting?.secondaryButtonLabel || defaultPackagesContent.hero.secondaryButton.label,
          href: dbSetting?.secondaryButtonHref || defaultPackagesContent.hero.secondaryButton.href,
        },
      },
      categories: mappedCategories.length > 0 ? mappedCategories : defaultPackagesContent.categories,
      packages: mappedPackages.length > 0 ? mappedPackages : defaultPackagesContent.packages,
      benefits: {
        eyebrow: dbSetting?.benefitsEyebrow || defaultPackagesContent.benefits.eyebrow,
        title: dbSetting?.benefitsTitle || defaultPackagesContent.benefits.title,
        description: dbSetting?.benefitsDescription || defaultPackagesContent.benefits.description,
        image: {
          src: dbSetting?.benefitsImage || defaultPackagesContent.benefits.image.src,
          alt: dbSetting?.benefitsImageAlt || defaultPackagesContent.benefits.image.alt,
        },
        button: {
          label: dbSetting?.benefitsButtonLabel || defaultPackagesContent.benefits.button.label,
          href: dbSetting?.benefitsButtonHref || defaultPackagesContent.benefits.button.href,
        },
        items: mappedBenefits.length > 0 ? mappedBenefits : defaultPackagesContent.benefits.items,
      },
      comparison: {
        title: dbSetting?.comparisonTitle || defaultPackagesContent.comparison.title,
        columns: defaultPackagesContent.comparison.columns,
        features: mappedComparison.length > 0 ? mappedComparison : defaultPackagesContent.comparison.features,
      },
      rewards: {
        title: dbSetting?.rewardsTitle || defaultPackagesContent.rewards.title,
        items: mappedRewards.filter((r) => !r.promoValue),
        promo: {
          title: promoItem?.promoTitle || defaultPackagesContent.rewards.promo.title,
          value: promoItem?.promoValue || defaultPackagesContent.rewards.promo.value,
          description: promoItem?.description || defaultPackagesContent.rewards.promo.description,
          image: promoItem?.image ? { src: promoItem.image, alt: promoItem.imageAlt || "" } : defaultPackagesContent.rewards.promo.image,
          button: {
            label: promoItem?.buttonLabel || defaultPackagesContent.rewards.promo.button.label,
            href: promoItem?.buttonHref || defaultPackagesContent.rewards.promo.button.href,
          },
        },
      },
      occasions: {
        title: dbSetting?.occasionsTitle || defaultPackagesContent.occasions.title,
        items: mappedOccasions.length > 0 ? mappedOccasions : defaultPackagesContent.occasions.items,
      },
      process: {
        title: dbSetting?.processTitle || defaultPackagesContent.process.title,
        steps: mappedSteps.length > 0 ? mappedSteps : defaultPackagesContent.process.steps,
      },
      testimonials: {
        title: dbSetting?.testimonialsTitle || defaultPackagesContent.testimonials.title,
        items: mappedTestimonials.length > 0 ? mappedTestimonials : defaultPackagesContent.testimonials.items,
      },
      faqs: {
        title: dbSetting?.faqTitle || defaultPackagesContent.faqs.title,
        items: mappedFaqs.length > 0 ? mappedFaqs : defaultPackagesContent.faqs.items,
      },
      cta: {
        title: dbSetting?.ctaTitle || defaultPackagesContent.cta.title,
        description: dbSetting?.ctaDescription || defaultPackagesContent.cta.description,
        button: {
          label: dbSetting?.ctaButtonLabel || defaultPackagesContent.cta.button.label,
          href: dbSetting?.ctaButtonHref || defaultPackagesContent.cta.button.href,
        },
        phone: dbSetting?.phone || defaultPackagesContent.cta.phone,
        email: dbSetting?.email || defaultPackagesContent.cta.email,
        address: dbSetting?.address || defaultPackagesContent.cta.address,
        hours: dbSetting?.hours || defaultPackagesContent.cta.hours,
      },
    };

    return pageContent;
  } catch (error) {
    console.error("fetchPackagesPageContent Error, falling back to default:", error);
    return defaultPackagesContent;
  }
}
