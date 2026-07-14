import type { MediaReference } from "./media.types";

type LegacyMediaValue = MediaReference | string | null | undefined;

export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  // Preserve canonical absolute and root-relative URLs exactly. Only legacy bare
  // storage keys (for example "branding/70dfa3...") belong under /uploads/.
  if (
    !url.startsWith("http") &&
    !url.startsWith("data:") &&
    !url.startsWith("/")
  ) {
    return `/uploads/${url}`;
  }
  return url;
}

export function resolveMedia(reference: LegacyMediaValue, fallbackAlt = "") {
  if (!reference) {
    return { src: null, alt: fallbackAlt, mediaId: null };
  }

  if (typeof reference === "string") {
    return {
      src: normalizeMediaUrl(reference) || null,
      alt: fallbackAlt,
      mediaId: null,
    };
  }

  return {
    src: normalizeMediaUrl(reference.src) || null,
    alt: reference.alt || fallbackAlt,
    mediaId: reference.mediaId ?? null,
  };
}
