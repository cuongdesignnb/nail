/**
 * Content Hub CMS — Content Registry
 *
 * Single source of truth for all page configurations.
 * Maps page keys to labels, descriptions, routes, sections, and icons.
 * This is static configuration data — not business content.
 */

import { ContentPageKey, ContentRegistryItem, CONTENT_PAGE_KEYS } from "./content.types";

/* ------------------------------------------------------------------ */
/*  Registry Definitions                                              */
/* ------------------------------------------------------------------ */

const registry: Record<ContentPageKey, ContentRegistryItem> = {
  home: {
    key: "home",
    label: "Homepage",
    description: "Hero section, featured services, gallery, packages, testimonials, and booking steps.",
    publicPath: "/",
    seoScopeKey: "home",
    icon: "Home",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Main hero banner with CTA", icon: "Image" },
      { id: "signatureServices", label: "Signature Services", description: "Featured services showcase", icon: "Sparkles" },
      { id: "aboutPreview", label: "About Preview", description: "Brief about section with link", icon: "Info" },
      { id: "featuredGallery", label: "Featured Gallery", description: "Gallery items showcase", icon: "Images" },
      { id: "packagesPreview", label: "Packages Preview", description: "Featured packages highlight", icon: "Package" },
      { id: "promotionBanner", label: "Promotion Banner", description: "Active promotions display", icon: "Tags" },
      { id: "teamPreview", label: "Team Preview", description: "Featured team members", icon: "Users" },
      { id: "testimonials", label: "Testimonials", description: "Client testimonials and reviews", icon: "Quote" },
      { id: "bookingSteps", label: "Booking Steps", description: "Booking process walkthrough", icon: "ListChecks" },
      { id: "instagramPreview", label: "Instagram Preview", description: "Instagram feed integration", icon: "Instagram" },
      { id: "faq", label: "FAQ", description: "Frequently asked questions", icon: "HelpCircle" },
      { id: "finalCta", label: "Final CTA", description: "Bottom call-to-action section", icon: "MousePointerClick" },
    ],
  },

  about: {
    key: "about",
    label: "About Page",
    description: "Our story, mission & values, team, salon experience, process, and testimonials.",
    publicPath: "/about",
    seoScopeKey: "about",
    icon: "Info",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "About page hero section", icon: "Image" },
      { id: "story", label: "Our Story", description: "Brand story and history", icon: "BookOpen" },
      { id: "missionVisionValues", label: "Mission, Vision & Values", description: "Core values and mission", icon: "Target" },
      { id: "benefits", label: "Benefits", description: "Why choose us benefits", icon: "Star" },
      { id: "experts", label: "Experts", description: "Team members and experts", icon: "Users" },
      { id: "salonExperience", label: "Salon Experience", description: "Gallery of salon experience", icon: "Camera" },
      { id: "process", label: "Process", description: "Our service process steps", icon: "ListChecks" },
      { id: "testimonials", label: "Testimonials", description: "Client testimonials", icon: "Quote" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  services: {
    key: "services",
    label: "Services Page",
    description: "Service categories, signature services, pricing, process, and design inspiration.",
    publicPath: "/services",
    seoScopeKey: "services",
    icon: "Sparkles",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Services page hero section", icon: "Image" },
      { id: "quickCategories", label: "Quick Categories", description: "Category navigation", icon: "LayoutGrid" },
      { id: "signatureServices", label: "Signature Services", description: "Featured services display", icon: "Sparkles" },
      { id: "whyChoose", label: "Why Choose Us", description: "Benefits and differentiators", icon: "Award" },
      { id: "pricingMatrix", label: "Pricing Matrix", description: "Service pricing overview", icon: "DollarSign" },
      { id: "process", label: "Appointment Process", description: "Booking process steps", icon: "ListChecks" },
      { id: "designInspiration", label: "Design Inspiration", description: "Gallery showcase", icon: "Palette" },
      { id: "featuredPackages", label: "Featured Packages", description: "Package highlights", icon: "Package" },
      { id: "faq", label: "FAQ", description: "Frequently asked questions", icon: "HelpCircle" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  gallery: {
    key: "gallery",
    label: "Gallery Page",
    description: "Collections, masonry gallery, trends, process steps, and testimonials.",
    publicPath: "/gallery",
    seoScopeKey: "gallery",
    icon: "Image",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Gallery page hero section", icon: "Image" },
      { id: "filterLabels", label: "Filter Labels", description: "Category filter labels", icon: "Filter" },
      { id: "featuredCollections", label: "Featured Collections", description: "Highlighted collections", icon: "FolderHeart" },
      { id: "masonryIntro", label: "Masonry Gallery Intro", description: "Gallery intro section", icon: "LayoutGrid" },
      { id: "whyChoose", label: "Why Choose Us", description: "Benefits and differentiators", icon: "Award" },
      { id: "trendingInspirations", label: "Trending Inspiration", description: "Trending design styles", icon: "TrendingUp" },
      { id: "process", label: "Process", description: "Our process steps", icon: "ListChecks" },
      { id: "testimonials", label: "Testimonials", description: "Client testimonials", icon: "Quote" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  packages: {
    key: "packages",
    label: "Packages Page",
    description: "Package benefits, comparison, rewards, occasion cards, and process steps.",
    publicPath: "/packages",
    seoScopeKey: "packages",
    icon: "Package",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Packages page hero section", icon: "Image" },
      { id: "benefits", label: "Package Benefits", description: "Benefits overview", icon: "Star" },
      { id: "comparison", label: "Package Comparison", description: "Comparison table copy", icon: "Columns" },
      { id: "rewards", label: "Rewards Section", description: "Loyalty rewards details", icon: "Gift" },
      { id: "occasions", label: "Occasion Cards", description: "Special occasion packages", icon: "Calendar" },
      { id: "process", label: "Process", description: "How it works steps", icon: "ListChecks" },
      { id: "testimonials", label: "Testimonials", description: "Client testimonials", icon: "Quote" },
      { id: "faq", label: "FAQ", description: "Frequently asked questions", icon: "HelpCircle" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  promotions: {
    key: "promotions",
    label: "Promotions Page",
    description: "Active promotions, terms & conditions, and how to redeem.",
    publicPath: "/promotions",
    seoScopeKey: "promotions",
    icon: "Tags",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Promotions page hero section", icon: "Image" },
      { id: "promotionIntro", label: "Promotion Intro", description: "Introductory section copy", icon: "FileText" },
      { id: "featuredPromotions", label: "Featured Promotions", description: "Highlighted active promotions", icon: "Tags" },
      { id: "termsAndConditions", label: "Terms & Conditions", description: "Promotion terms", icon: "ScrollText" },
      { id: "howToRedeem", label: "How to Redeem", description: "Redemption process", icon: "ListChecks" },
      { id: "faq", label: "FAQ", description: "Frequently asked questions", icon: "HelpCircle" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  contact: {
    key: "contact",
    label: "Contact Page",
    description: "Contact information, opening hours, map, contact form, and social links.",
    publicPath: "/contact",
    seoScopeKey: "contact",
    icon: "Phone",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Contact page hero section", icon: "Image" },
      { id: "contactInfo", label: "Contact Information", description: "Phone, email, address", icon: "Phone" },
      { id: "openingHours", label: "Opening Hours", description: "Business hours schedule", icon: "Clock" },
      { id: "mapLocation", label: "Map Location", description: "Google Maps location", icon: "MapPin" },
      { id: "contactForm", label: "Contact Form Intro", description: "Form header and description", icon: "Mail" },
      { id: "socialLinks", label: "Social Links", description: "Social media profiles", icon: "Share2" },
      { id: "faq", label: "FAQ", description: "Frequently asked questions", icon: "HelpCircle" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  blog: {
    key: "blog",
    label: "Beauty Journal",
    description: "Blog landing page copy, featured posts, category navigation, and newsletter.",
    publicPath: "/blog",
    seoScopeKey: "blog",
    icon: "BookOpen",
    previewEnabled: true,
    sections: [
      { id: "seo", label: "SEO", description: "Search engine optimization settings", icon: "Search" },
      { id: "hero", label: "Hero", description: "Blog page hero section", icon: "Image" },
      { id: "latestStories", label: "Latest Stories", description: "Latest posts section config", icon: "Newspaper" },
      { id: "categoryNav", label: "Category Navigation", description: "Category navigation settings", icon: "LayoutGrid" },
      { id: "editorsPicks", label: "Editor's Picks", description: "Curated post selections", icon: "Star" },
      { id: "trendingStories", label: "Trending Stories", description: "Trending posts section", icon: "TrendingUp" },
      { id: "newsletter", label: "Newsletter", description: "Newsletter signup section", icon: "Mail" },
      { id: "testimonials", label: "Testimonials", description: "Client testimonials", icon: "Quote" },
      { id: "cta", label: "Final CTA", description: "Bottom call-to-action", icon: "MousePointerClick" },
    ],
  },

  global: {
    key: "global",
    label: "Global Header & Footer",
    description: "Brand identity, navigation, footer links, contact details, social links, and newsletter.",
    publicPath: null,
    seoScopeKey: "global",
    icon: "Globe",
    previewEnabled: false,
    sections: [
      { id: "brand", label: "Brand Identity", description: "Logo, name, and tagline", icon: "Palette" },
      { id: "headerNav", label: "Header Navigation", description: "Navigation items and CTA", icon: "Menu" },
      { id: "footer", label: "Footer", description: "Footer content and links", icon: "PanelBottom" },
      { id: "socialLinks", label: "Social Links", description: "Social media profiles", icon: "Share2" },
      { id: "defaultContact", label: "Default Contact", description: "Default contact information", icon: "Phone" },
      { id: "defaultShareImage", label: "Default Share Image", description: "Default Open Graph image", icon: "Image" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

export function getContentRegistry(): Record<ContentPageKey, ContentRegistryItem> {
  return registry;
}

export function getRegistryItem(key: ContentPageKey): ContentRegistryItem | undefined {
  return registry[key];
}

export function getRegistryItemOrThrow(key: ContentPageKey): ContentRegistryItem {
  const item = registry[key];
  if (!item) throw new Error(`Unknown content page key: ${key}`);
  return item;
}

export function isValidPageKey(key: string): key is ContentPageKey {
  return CONTENT_PAGE_KEYS.includes(key as ContentPageKey);
}

export function getAllPageKeys(): ContentPageKey[] {
  return CONTENT_PAGE_KEYS;
}

export function getPublicPageKeys(): ContentPageKey[] {
  return CONTENT_PAGE_KEYS.filter((k) => registry[k].publicPath !== null);
}

export function getAllPublicPaths(): string[] {
  return CONTENT_PAGE_KEYS
    .map((k) => registry[k].publicPath)
    .filter((p): p is string => p !== null);
}
