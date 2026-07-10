import type { MediaReference } from "./media.types";

type LegacyMediaValue = MediaReference | string | null | undefined;

export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  // If it's a relative path to a local upload (e.g. "b0eda75c..." or "branding/70dfa3..."),
  // and doesn't start with "/" or "http" or "/uploads/" or "/images/", prepend "/uploads/"
  if (
    !url.startsWith("http") &&
    !url.startsWith("data:") &&
    !url.startsWith("/uploads/") &&
    !url.startsWith("/images/")
  ) {
    const clean = url.startsWith("/") ? url.substring(1) : url;
    return `/uploads/${clean}`;
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

