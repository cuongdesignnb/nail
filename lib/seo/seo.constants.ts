import type { ContentPageKey } from "@/lib/content/content.types";

export const SEO_SITE_SETTING_KEY = "default";

export const SITE_NAME_FALLBACK = "Aera Nail Lounge";

export const DEFAULT_TITLE_TEMPLATE = "%s | Aera Nail Lounge";

export const DEFAULT_DESCRIPTION =
  "Premium manicure, pedicure, gel polish, nail art, spa treatment and beauty packages from Aera Nail Lounge.";

export const ROBOTS_DIRECTIVES = [
  "index,follow",
  "index,nofollow",
  "noindex,follow",
  "noindex,nofollow",
] as const;

export const TWITTER_CARDS = ["summary", "summary_large_image"] as const;

export const STATIC_SEO_PAGE_KEYS: Exclude<ContentPageKey, "global">[] = [
  "home",
  "about",
  "services",
  "gallery",
  "packages",
  "promotions",
  "contact",
  "blog",
];

export const STATIC_PAGE_PATHS: Record<Exclude<ContentPageKey, "global">, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  packages: "/packages",
  promotions: "/promotions",
  contact: "/contact",
  blog: "/blog",
};

export const STATIC_SEO_SCOPE_KEYS = new Set<string>(STATIC_SEO_PAGE_KEYS);

export const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/login",
  "/preview",
  "/internal",
  "/_next",
];

export const SCHEMA_TYPE_ALLOWLIST = new Set([
  "WebSite",
  "Organization",
  "NailSalon",
  "BreadcrumbList",
  "FAQPage",
  "BlogPosting",
  "Article",
  "Service",
  "Offer",
  "CollectionPage",
]);

