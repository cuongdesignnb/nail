import { revalidatePath, revalidateTag } from "next/cache";

const PUBLIC_PATHS = [
  "/", "/about", "/services", "/gallery", "/packages", "/promotions",
  "/gift-cards", "/gift-cards/terms", "/blog", "/contact", "/booking",
];

const BASE_TAGS = [
  "content:global", "global-content", "public-settings", "public-shell", "public-header", "public-footer",
];

export function settingsConsumerTags(changedKeys: string[]) {
  const tags = new Set(BASE_TAGS);
  for (const key of changedKeys) {
    if (key === "business-hours") tags.add("business-hours");
    if (key === "booking-policies") tags.add("booking-policies");
    if (key === "general") tags.add("general-settings");
    if (key === "seo") {
      tags.add("seo-site-settings");
      tags.add("seo-sitemap");
      tags.add("seo-schema");
    }
  }
  return Array.from(tags);
}

export function revalidateSettingsConsumers(changedKeys: string[]) {
  for (const tag of settingsConsumerTags(changedKeys)) revalidateTag(tag);
  for (const path of PUBLIC_PATHS) revalidatePath(path);
  return true;
}
