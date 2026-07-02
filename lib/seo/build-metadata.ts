import type { Metadata } from 'next';

interface SeoData {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonicalPath?: string | null;
  robots?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogImageAlt?: string | null;
  twitterCard?: string | null;
}

interface BuildMetadataDefaults {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata(
  seo: SeoData | null | undefined,
  defaults: BuildMetadataDefaults,
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;

  return {
    title,
    description,
    keywords: seo?.keywords || undefined,
    alternates: {
      canonical: seo?.canonicalPath
        ? `${siteUrl}${seo.canonicalPath}`
        : `${siteUrl}${defaults.path}`,
    },
    robots: seo?.robots || 'index,follow',
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: `${siteUrl}${defaults.path}`,
      siteName: 'Aera Nail Lounge',
      images: seo?.ogImage
        ? [{ url: seo.ogImage, alt: seo.ogImageAlt || '' }]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: (seo?.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
    },
  };
}
