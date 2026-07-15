import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { getSeoSiteSettings } from "../seo.service";
import { buildAbsoluteUrl } from "../site-url";
import { buildWebSiteSchema } from "./website.schema";
import { buildOrganizationSchema } from "./organization.schema";
import { buildNailSalonSchema } from "./nail-salon.schema";
import { buildBreadcrumbSchema } from "./breadcrumb.schema";
import type { BreadcrumbItem, FaqSchemaItem, JsonLdObject } from "./schema.types";
import { buildFaqSchema } from "./faq.schema";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

function absoluteMediaUrl(value: string | null | undefined) {
  const normalized = normalizeMediaUrl(value);
  if (!normalized) return undefined;
  return /^https?:\/\//i.test(normalized) ? normalized : buildAbsoluteUrl(normalized);
}

function socialUrls(globalContent: Awaited<ReturnType<typeof getPublishedGlobalContent>>) {
  return [
    globalContent.socialLinks?.instagramUrl,
    globalContent.socialLinks?.facebookUrl,
    globalContent.socialLinks?.tiktokUrl,
  ].filter((url): url is string => Boolean(url && /^https?:\/\//i.test(url)));
}

export async function buildGlobalSchemas() {
  const [globalContent, settings] = await Promise.all([
    getPublishedGlobalContent(),
    getSeoSiteSettings(),
  ]);
  const siteUrl = buildAbsoluteUrl("/");
  const identity = {
    name: globalContent.brand?.name || "Aera Nail Lounge",
    url: siteUrl,
    logo: absoluteMediaUrl(globalContent.brand?.logo?.src),
    image: absoluteMediaUrl(globalContent.defaultShareImage?.src),
    description: globalContent.brand?.tagline,
    phone: globalContent.defaultContact?.phone,
    email: globalContent.defaultContact?.email,
    address: globalContent.defaultContact?.address,
    hours: globalContent.defaultContact?.hours,
    socialUrls: socialUrls(globalContent),
    priceRange: settings.priceRange,
    latitude: settings.latitude,
    longitude: settings.longitude,
    googleMapsUrl: settings.googleMapsUrl,
  };
  const schemas: JsonLdObject[] = [];
  if (settings.enableWebSiteSchema) schemas.push(buildWebSiteSchema(identity));
  schemas.push(buildOrganizationSchema(identity));
  if (settings.enableNailSalonSchema) schemas.push(buildNailSalonSchema(identity));
  return schemas;
}

export function buildPageBreadcrumbSchema(pathname: string, title: string) {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "Home", url: buildAbsoluteUrl("/") }];
  let path = "";
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    items.push({
      name: index === segments.length - 1 ? title : segment.replace(/-/g, " "),
      url: buildAbsoluteUrl(path),
    });
  });
  return buildBreadcrumbSchema(items);
}

export function buildVisibleFaqSchema(items: FaqSchemaItem[] | undefined | null) {
  return buildFaqSchema(items || []);
}
