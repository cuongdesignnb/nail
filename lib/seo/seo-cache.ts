export const SEO_CACHE_REVALIDATE = 300;

export const SEO_CACHE_TAGS = {
  siteSettings: "seo:site-settings",
  sitemap: "seo:sitemap",
  staticPage: (pageKey: string) => `seo:static:${pageKey}`,
  entity: (scopeKey: string) => `seo:entity:${scopeKey}`,
};

