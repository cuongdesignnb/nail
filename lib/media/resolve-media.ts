import type { MediaReference } from "./media.types";

type LegacyMediaValue = MediaReference | string | null | undefined;

export function resolveMedia(reference: LegacyMediaValue, fallbackAlt = "") {
  if (!reference) {
    return { src: null, alt: fallbackAlt, mediaId: null };
  }

  if (typeof reference === "string") {
    return {
      src: reference || null,
      alt: fallbackAlt,
      mediaId: null,
    };
  }

  return {
    src: reference.src || null,
    alt: reference.alt || fallbackAlt,
    mediaId: reference.mediaId ?? null,
  };
}
