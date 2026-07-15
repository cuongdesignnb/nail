import type { ContentPageKey } from "./content.types";
import { getDefaultContent } from "./content-defaults";
import { mergeWithDefaults } from "./content-mapper";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMediaReferenceHint(value: unknown): value is JsonRecord {
  return isRecord(value) && typeof value.src === "string" && "alt" in value;
}

function altFromSource(src: string) {
  const name = src.split(/[/?#]/).filter(Boolean).pop() || "Image";
  try {
    return decodeURIComponent(name).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
  } catch {
    return name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
  }
}

function canonicalMedia(value: unknown, hint?: JsonRecord): JsonRecord {
  const source =
    typeof value === "string"
      ? value
      : isRecord(value) && typeof value.src === "string"
        ? value.src
        : typeof hint?.src === "string"
          ? hint.src
          : "";
  const input = isRecord(value) ? value : {};
  const src = normalizeMediaUrl(source.trim());
  const alt =
    (typeof input.alt === "string" && input.alt.trim()) ||
    (typeof hint?.alt === "string" && hint.alt.trim()) ||
    altFromSource(src);
  const mediaId =
    typeof input.mediaId === "string" && input.mediaId.trim()
      ? input.mediaId.trim()
      : null;
  const title = typeof input.title === "string" && input.title.trim() ? input.title.trim() : null;
  return { ...input, mediaId, src, alt, title };
}

function canonicalize(value: unknown, hint: unknown): unknown {
  if (isMediaReferenceHint(hint) || isMediaReferenceHint(value)) {
    return canonicalMedia(value, isRecord(hint) ? hint : undefined);
  }
  if (Array.isArray(value)) {
    const hints = Array.isArray(hint) ? hint : [];
    return value.map((item, index) => canonicalize(item, hints[index] ?? hints[0]));
  }
  if (isRecord(value)) {
    const hintRecord = isRecord(hint) ? hint : {};
    const result: JsonRecord = {};
    for (const key of Object.keys(value)) {
      if (value[key] !== undefined) result[key] = canonicalize(value[key], hintRecord[key]);
    }
    return result;
  }
  return value;
}

export function normalizePageContent(
  content: unknown,
  pageKey: ContentPageKey,
): Record<string, unknown> {
  const defaults = getDefaultContent(pageKey) as Record<string, unknown>;
  const merged = isRecord(content) ? mergeWithDefaults(content, defaults) : defaults;
  return normalizeMediaReferences(merged, pageKey);
}

export function normalizeMediaReferences(
  content: Record<string, unknown>,
  pageKey: ContentPageKey,
): Record<string, unknown> {
  const defaults = getDefaultContent(pageKey) as Record<string, unknown>;
  return canonicalize(content, defaults) as Record<string, unknown>;
}
