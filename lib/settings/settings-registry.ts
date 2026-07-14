export type SettingsRegistryEntry = {
  key: string;
  adminTab: string;
  storage: string;
  apiEndpoint: string;
  publicConsumers: string[];
  cacheTags: string[];
  secret: boolean;
};

export const SETTINGS_REGISTRY: SettingsRegistryEntry[] = [
  {
    key: "salon-profile",
    adminTab: "Salon Info",
    storage: "SitePageContent.global (brand/defaultContact/footer)",
    apiEndpoint: "/api/admin/settings/salon-profile",
    publicConsumers: ["header", "footer", "home", "contact", "emails", "structured-data"],
    cacheTags: ["public-settings", "global-content", "public-shell", "public-header", "public-footer"],
    secret: false,
  },
  {
    key: "business-hours",
    adminTab: "Business Hours",
    storage: "SitePageContent.global (businessHours/defaultContact/footer)",
    apiEndpoint: "/api/admin/settings/business-hours",
    publicConsumers: ["home", "contact", "footer", "booking-availability", "structured-data", "emails"],
    cacheTags: ["public-settings", "business-hours", "global-content", "public-footer"],
    secret: false,
  },
  {
    key: "booking-policies",
    adminTab: "Booking Policies",
    storage: "SitePageContent.global (bookingPolicies)",
    apiEndpoint: "/api/admin/settings/booking-policies",
    publicConsumers: ["booking-catalog", "booking-availability", "booking-validation"],
    cacheTags: ["public-settings", "booking-policies"],
    secret: false,
  },
  {
    key: "branding",
    adminTab: "Branding",
    storage: "SitePageContent.global (brand.logo/brand.favicon)",
    apiEndpoint: "/api/admin/settings/branding",
    publicConsumers: ["header", "mobile-header", "footer", "metadata", "structured-data", "emails"],
    cacheTags: ["public-settings", "global-content", "public-shell", "public-header", "public-footer"],
    secret: false,
  },
  {
    key: "general",
    adminTab: "General",
    storage: "BusinessSetting",
    apiEndpoint: "/api/admin/settings/general",
    publicConsumers: ["booking", "reports", "scheduling", "currency-formatting"],
    cacheTags: ["public-settings", "general-settings"],
    secret: false,
  },
  {
    key: "paypal-gift-cards",
    adminTab: "Payments",
    storage: "PaymentGatewayConfig",
    apiEndpoint: "/api/admin/settings/payments/paypal",
    publicConsumers: ["gift-card-checkout"],
    cacheTags: ["gift-card-payments"],
    secret: true,
  },
  {
    key: "smtp",
    adminTab: "Email & SMTP",
    storage: "EmailSmtpSetting",
    apiEndpoint: "/api/admin/settings/email",
    publicConsumers: ["booking-email", "gift-card-email", "promotion-email"],
    cacheTags: [],
    secret: true,
  },
  {
    key: "ai-content",
    adminTab: "AI Content",
    storage: "AiProviderSetting",
    apiEndpoint: "/api/admin/settings/ai-content",
    publicConsumers: ["AI content jobs"],
    cacheTags: [],
    secret: true,
  },
  {
    key: "seo",
    adminTab: "SEO & Search Visibility",
    storage: "SeoSiteSetting",
    apiEndpoint: "/api/admin/seo/site-settings",
    publicConsumers: ["metadata", "robots", "sitemap", "structured-data"],
    cacheTags: ["seo-site-settings", "seo-sitemap"],
    secret: false,
  },
];
