import type { GlobalContent } from "@/lib/content/content.types";
import type { MediaReference } from "@/lib/media/media.types";

export type BrandingData = {
  logo: MediaReference | null;
  favicon: MediaReference | null;
};

export function normalizeLegacyMedia(
  value: unknown,
  fallbackAlt = "",
): MediaReference | null {
  if (typeof value === "string") {
    const src = value.trim();
    return src ? { mediaId: null, src, alt: fallbackAlt, title: null } : null;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const media = value as Record<string, unknown>;
  const src = typeof media.src === "string" ? media.src.trim() : "";
  if (!src) return null;

  return {
    mediaId: typeof media.mediaId === "string" ? media.mediaId : null,
    src,
    alt: typeof media.alt === "string" ? media.alt : fallbackAlt,
    title: typeof media.title === "string" ? media.title : null,
  };
}

export function buildBrandingContent(
  currentContent: Record<string, unknown>,
  selected: BrandingData,
): Record<string, unknown> {
  const currentBrand =
    currentContent.brand && typeof currentContent.brand === "object"
      ? (currentContent.brand as Record<string, unknown>)
      : {};

  return {
    ...currentContent,
    brand: {
      ...currentBrand,
      logo: selected.logo ? { ...selected.logo } : null,
      favicon: selected.favicon ? { ...selected.favicon } : null,
    },
  };
}

type GlobalContentLike = Pick<GlobalContent, "brand"> | Record<string, unknown>;

export function hydrateBrandingContent(
  content: GlobalContentLike | null | undefined,
): BrandingData {
  const brand =
    content && typeof content === "object" && "brand" in content
      ? (content.brand as Record<string, unknown> | undefined)
      : undefined;
  const name = typeof brand?.name === "string" ? brand.name : "";
  return {
    logo: normalizeLegacyMedia(brand?.logo, name ? `${name} logo` : ""),
    favicon: normalizeLegacyMedia(brand?.favicon, name ? `${name} favicon` : ""),
  };
}

function referencesMatch(
  selected: MediaReference | null,
  persisted: MediaReference | null,
): boolean {
  if (!selected || !persisted) return selected === persisted;
  return (
    (selected.mediaId ?? null) === (persisted.mediaId ?? null) &&
    selected.src === persisted.src &&
    selected.alt === persisted.alt
  );
}

export type BrandingVerificationInput = {
  selectedLogo: MediaReference | null;
  selectedFavicon: MediaReference | null;
  draftContent: GlobalContentLike;
  publishedContent: GlobalContentLike | null;
};

export function verifyBrandingPersistence(input: BrandingVerificationInput) {
  const draft = hydrateBrandingContent(input.draftContent);
  const published = hydrateBrandingContent(input.publishedContent);
  const logoMatches =
    referencesMatch(input.selectedLogo, draft.logo) &&
    referencesMatch(input.selectedLogo, published.logo);
  const faviconMatches =
    referencesMatch(input.selectedFavicon, draft.favicon) &&
    referencesMatch(input.selectedFavicon, published.favicon);

  return { logoMatches, faviconMatches, matches: logoMatches && faviconMatches };
}
