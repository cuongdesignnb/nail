import { unstable_cache } from "next/cache";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { getPublishedContent } from "@/lib/content/content.repository";
import type { GlobalContent } from "@/lib/content/content.types";
import { getBusinessSettings } from "./settings.service";
import { prisma } from "@/lib/db";
import { mapPublicSiteSettings } from "./public-settings.mapper";

async function loadPublicSiteSettings(options?: { uncached?: boolean }) {
  const [global, business, seo] = await Promise.all([
    options?.uncached
      ? getPublishedContent("global") as Promise<GlobalContent>
      : getPublishedGlobalContent(),
    getBusinessSettings(),
    prisma.seoSiteSetting.findUnique({ where: { key: "default" }, select: { googleMapsUrl: true } }),
  ]);
  return mapPublicSiteSettings({ global, business: business.data, googleMapsUrl: seo?.googleMapsUrl });
}

const cachedPublicSiteSettings = unstable_cache(
  loadPublicSiteSettings,
  ["public-settings"],
  {
    tags: [
      "public-settings", "global-content", "public-shell", "public-header", "public-footer",
      "business-hours", "booking-policies", "general-settings",
    ],
    revalidate: 300,
  },
);

export function getPublicSiteSettings(options?: { uncached?: boolean }) {
  return options?.uncached ? loadPublicSiteSettings({ uncached: true }) : cachedPublicSiteSettings();
}
