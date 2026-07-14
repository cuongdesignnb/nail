import { PublicSiteShell } from "@/components/public/shell/PublicSiteShell";
import type { Metadata } from "next";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { getSeoSiteSettings } from "@/lib/seo/seo.service";
import { buildAbsoluteUrl } from "@/lib/seo/site-url";
import { DEFAULT_DESCRIPTION } from "@/lib/seo/seo.constants";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const [globalContent, settings, publicSettings] = await Promise.all([
    getPublishedGlobalContent(),
    getSeoSiteSettings(),
    getPublicSiteSettings(),
  ]);
  const siteName = publicSettings.brand.name;
  const shareImageSrc = normalizeMediaUrl(globalContent.defaultShareImage?.src);
  const shareImage = shareImageSrc
    ? buildAbsoluteUrl(shareImageSrc)
    : undefined;

  return {
    metadataBase: new URL(buildAbsoluteUrl("/")),
    title: {
      default: siteName,
      template: settings.titleTemplate,
    },
    description: globalContent.brand?.tagline || DEFAULT_DESCRIPTION,
    applicationName: siteName,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    icons: publicSettings.brand.favicon?.src ? {
      icon: normalizeMediaUrl(publicSettings.brand.favicon.src),
      shortcut: normalizeMediaUrl(publicSettings.brand.favicon.src),
      apple: normalizeMediaUrl(publicSettings.brand.favicon.src),
    } : undefined,
    openGraph: {
      siteName,
      type: "website",
      locale: settings.locale,
      url: buildAbsoluteUrl("/"),
      title: siteName,
      description: globalContent.brand?.tagline || DEFAULT_DESCRIPTION,
      images: shareImage
        ? [{ url: shareImage, alt: globalContent.defaultShareImage?.alt || siteName }]
        : undefined,
    },
    twitter: {
      card: settings.twitterCard,
      site: settings.twitterHandle || undefined,
      creator: settings.twitterHandle || undefined,
      images: shareImage ? [shareImage] : undefined,
    },
    robots: settings.defaultRobots,
    verification: {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification
        ? { "msvalidate.01": settings.bingSiteVerification }
        : undefined,
    },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <PublicSiteShell>{children}</PublicSiteShell>;
}
