export type ImageConfig = {
  src: string;
  alt: string;
};

export type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type PackageCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type NailPackageDTO = {
  id: string;
  categoryId?: string;
  name: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  price?: number | string;
  priceLabel?: string;
  durationLabel?: string;
  visitCountLabel?: string;
  badge?: string;
  features: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
};

export type PackageBenefitDTO = {
  id: string;
  icon?: string;
  title: string;
  description: string;
};

export type PackageComparisonFeatureDTO = {
  id: string;
  featureName: string;
  essentialValue?: string;
  signatureValue?: string;
  premiumValue?: string;
  vipValue?: string;
};

export type PackageRewardDTO = {
  id: string;
  icon?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  promoTitle?: string;
  promoValue?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export type PackageOccasionDTO = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  icon?: string;
};

export type PackageProcessStepDTO = {
  id: string;
  step: string;
  icon?: string;
  title: string;
  description: string;
};

export type PageTestimonialDTO = {
  id: string;
  pageKey: string;
  name: string;
  role?: string;
  avatar?: string;
  avatarAlt?: string;
  rating: number;
  quote: string;
};

export type PageFaqDTO = {
  id: string;
  pageKey: string;
  question: string;
  answer: string;
};

export type PackagesPageContent = {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    image: ImageConfig;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
  categories: PackageCategoryDTO[];
  packages: NailPackageDTO[];
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    image: ImageConfig;
    button: ButtonConfig;
    items: PackageBenefitDTO[];
  };
  comparison: {
    title: string;
    columns: {
      key: "essentialValue" | "signatureValue" | "premiumValue" | "vipValue";
      label: string;
      priceLabel: string;
    }[];
    features: PackageComparisonFeatureDTO[];
  };
  rewards: {
    title: string;
    items: PackageRewardDTO[];
    promo: {
      title: string;
      value: string;
      description?: string;
      image?: ImageConfig;
      button: ButtonConfig;
    };
  };
  occasions: {
    title: string;
    items: PackageOccasionDTO[];
  };
  process: {
    title: string;
    steps: PackageProcessStepDTO[];
  };
  testimonials: {
    title: string;
    items: PageTestimonialDTO[];
  };
  faqs: {
    title: string;
    items: PageFaqDTO[];
  };
  cta: {
    title: string;
    description: string;
    button: ButtonConfig;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
};
