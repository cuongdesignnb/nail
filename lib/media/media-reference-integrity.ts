import { prisma } from "@/lib/db";
import { normalizeMediaUrl } from "./resolve-media";

export type MediaIntegrityIssue = {
  path: string;
  message: string;
};

type FoundReference = { path: string; mediaId: string; src: string };
const FORBIDDEN_MEDIA_SOURCE = /^(?:blob:|data:|file:)|(?:^|\/)localhost(?::\d+)?(?:\/|$)/i;
const IMAGE_FIELD_NAME = /(?:image|avatar|logo|favicon|thumbnail|photo|cover|src)$/i;

function inspect(
  value: unknown,
  path: string,
  fieldName: string,
  references: FoundReference[],
  issues: MediaIntegrityIssue[],
) {
  if (typeof value === "string") {
    if (IMAGE_FIELD_NAME.test(fieldName) && FORBIDDEN_MEDIA_SOURCE.test(value.trim())) {
      issues.push({ path, message: "Use a persistent media URL, not a browser-local URL." });
    }
    for (const match of Array.from(value.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi))) {
      if (FORBIDDEN_MEDIA_SOURCE.test(match[1])) {
        issues.push({ path, message: "Rich text images must use persistent media URLs." });
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, `${path}.${index}`, fieldName, references, issues));
    return;
  }
  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  if (typeof record.src === "string") {
    if (FORBIDDEN_MEDIA_SOURCE.test(record.src.trim())) {
      issues.push({ path: `${path}.src`, message: "Use a persistent media URL." });
    }
    if (typeof record.mediaId === "string" && record.mediaId.trim()) {
      references.push({ path, mediaId: record.mediaId.trim(), src: record.src });
    }
  }
  for (const [key, item] of Object.entries(record)) {
    inspect(item, path ? `${path}.${key}` : key, key, references, issues);
  }
}

export async function validateMediaReferenceIntegrity(content: unknown) {
  const references: FoundReference[] = [];
  const issues: MediaIntegrityIssue[] = [];
  inspect(content, "content", "content", references, issues);

  const ids = Array.from(new Set(references.map((reference) => reference.mediaId)));
  const assets = ids.length
    ? await prisma.mediaAsset.findMany({
        where: { id: { in: ids }, isDeleted: false },
        select: { id: true, url: true },
      })
    : [];
  const byId = new Map(assets.map((asset) => [asset.id, normalizeMediaUrl(asset.url)]));

  for (const reference of references) {
    const assetUrl = byId.get(reference.mediaId);
    if (!assetUrl) {
      issues.push({ path: `${reference.path}.mediaId`, message: "The selected media asset no longer exists." });
    } else if (assetUrl !== normalizeMediaUrl(reference.src)) {
      issues.push({ path: `${reference.path}.src`, message: "The image URL does not match the selected media asset." });
    }
  }

  return { valid: issues.length === 0, issues };
}
