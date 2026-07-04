/**
 * Content Hub CMS — Core Types
 *
 * Central type definitions for the unified content management system.
 * All page editors, APIs, and services reference these types.
 */

/* ------------------------------------------------------------------ */
/*  Page Keys                                                         */
/* ------------------------------------------------------------------ */

export type ContentPageKey =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "packages"
  | "promotions"
  | "contact"
  | "blog"
  | "global";

export const CONTENT_PAGE_KEYS: ContentPageKey[] = [
  "home",
  "about",
  "services",
  "gallery",
  "packages",
  "promotions",
  "contact",
  "blog",
  "global",
];

/* ------------------------------------------------------------------ */
/*  Content Status                                                    */
/* ------------------------------------------------------------------ */

export type ContentStatus =
  | "published"
  | "draft-changes"
  | "not-published"
  | "needs-attention";

/* ------------------------------------------------------------------ */
/*  Registry Types                                                    */
/* ------------------------------------------------------------------ */

export type ContentSectionDef = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type ContentRegistryItem = {
  key: ContentPageKey;
  label: string;
  description: string;
  publicPath: string | null;
  seoScopeKey: string | null;
  icon: string;
  sections: ContentSectionDef[];
  previewEnabled: boolean;
};

/* ------------------------------------------------------------------ */
/*  Page Metadata (returned by APIs)                                  */
/* ------------------------------------------------------------------ */

export type ContentCompletionInfo = {
  completed: number;
  total: number;
  missing: string[];
};

export type ContentPageMeta = {
  key: ContentPageKey;
  status: ContentStatus;
  updatedAt: string | null;
  updatedBy: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  version: number;
  hasUnpublishedChanges: boolean;
  completion: ContentCompletionInfo;
};

/* ------------------------------------------------------------------ */
/*  Editor State                                                      */
/* ------------------------------------------------------------------ */

export type ContentEditorState = {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  latestVersion: number;
  hasSavedDraftChanges: boolean;
  hasUnpublishedChanges: boolean;
};

/* ------------------------------------------------------------------ */
/*  API Response Types                                                */
/* ------------------------------------------------------------------ */

export type ContentPageData = {
  key: ContentPageKey;
  draftContent: Record<string, unknown>;
  publishedContent: Record<string, unknown> | null;
  version: number;
  updatedAt: string | null;
  updatedBy: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  hasUnpublishedChanges: boolean;
};

/* ------------------------------------------------------------------ */
/*  Shared Content Structures (used across multiple page types)       */
/* ------------------------------------------------------------------ */

export type ImageField = {
  src: string;
  alt: string;
};

export type ButtonField = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: string;
};

export type ContactField = {
  phone: string;
  email: string;
  address: string;
  hours: string;
};

export type SeoFields = {
  title: string;
  description: string;
  focusKeyphrase?: string;
  keywords?: string[];
  canonicalUrl?: string;
  robotsDirective?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: ImageField;
  twitterCard?: string;
  structuredData?: Record<string, unknown>;
};

export type HeroFields = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: ImageField;
  primaryButton: ButtonField;
  secondaryButton: ButtonField;
};

export type CtaFields = {
  title: string;
  description: string;
  button: ButtonField;
  phone: string;
  email: string;
  address: string;
  hours: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  role?: string;
  avatar?: ImageField;
  rating: number;
  quote: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ProcessStepItem = {
  id: string;
  step: string;
  icon: string;
  title: string;
  description: string;
};

/* ------------------------------------------------------------------ */
/*  Page-Specific Content Types                                       */
/* ------------------------------------------------------------------ */

export type HomePageContent = {
  seo: SeoFields;
  hero: HeroFields;
  signatureServices: {
    eyebrow: string;
    title: string;
    description: string;
    featuredServiceIds: string[];
    showViewAll: boolean;
  };
  aboutPreview: {
    eyebrow: string;
    title: string;
    description: string;
    image: ImageField;
    button: ButtonField;
  };
  featuredGallery: {
    eyebrow: string;
    title: string;
    featuredItemIds: string[];
    showViewAll: boolean;
  };
  packagesPreview: {
    eyebrow: string;
    title: string;
    description: string;
    featuredPackageIds: string[];
  };
  promotionBanner: {
    isVisible: boolean;
    title: string;
    description: string;
    code: string;
    button: ButtonField;
    featuredPromotionIds: string[];
  };
  teamPreview: {
    eyebrow: string;
    title: string;
    featuredTechnicianIds: string[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  bookingSteps: {
    eyebrow: string;
    title: string;
    steps: ProcessStepItem[];
  };
  instagramPreview: {
    eyebrow: string;
    title: string;
    instagramUrl: string;
    showSection: boolean;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  finalCta: CtaFields;
};

export type PromotionsPageContent = {
  seo: SeoFields;
  hero: HeroFields;
  promotionIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  featuredPromotions: {
    title: string;
    featuredPromotionIds: string[];
    showAll: boolean;
  };
  termsAndConditions: {
    title: string;
    content: string;
  };
  howToRedeem: {
    title: string;
    steps: ProcessStepItem[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  finalCta: CtaFields;
};

export type ContactPageContent = {
  seo: SeoFields;
  hero: HeroFields;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    googleMapsUrl: string;
  };
  openingHours: {
    title: string;
    schedule: {
      id: string;
      days: string;
      hours: string;
    }[];
  };
  mapLocation: {
    title: string;
    googleMapsEmbedUrl: string;
  };
  contactForm: {
    title: string;
    description: string;
    submitLabel: string;
  };
  socialLinks: {
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  finalCta: CtaFields;
};

export type GlobalContent = {
  brand: {
    name: string;
    logo: ImageField;
    tagline: string;
  };
  headerNav: {
    items: {
      id: string;
      label: string;
      href: string;
    }[];
    cta: ButtonField;
  };
  footer: {
    brandText: string;
    quickLinks: {
      id: string;
      label: string;
      href: string;
    }[];
    serviceLinks: {
      id: string;
      label: string;
      href: string;
    }[];
    contact: ContactField;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
    };
    copyright: string;
  };
  socialLinks: {
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
  };
  defaultContact: ContactField;
  defaultShareImage: ImageField;
};
