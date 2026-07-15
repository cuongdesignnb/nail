export const MEDIA_FOLDERS = {
  UPLOADS: "uploads",
  HEROES: "heroes",
  CONTENT: "content",
  BRANDING: "branding",
  SERVICES: "services",
  GALLERY: "gallery",
  PACKAGES: "packages",
  PROMOTIONS: "promotions",
  BLOG: "blog",
  TEAM: "team",
  TESTIMONIALS: "testimonials",
  RICH_TEXT: "rich-text",
} as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[keyof typeof MEDIA_FOLDERS];

export function normalizeMediaFolder(value: FormDataEntryValue | string | null): string {
  const raw = typeof value === "string" ? value : "";
  const normalized = raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized === "brand") return MEDIA_FOLDERS.BRANDING;
  return normalized || MEDIA_FOLDERS.UPLOADS;
}
