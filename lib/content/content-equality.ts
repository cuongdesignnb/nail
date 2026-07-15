import type { ContentPageKey } from "./content.types";
import { normalizePageContent } from "./normalize-page-content";

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  }
  return value;
}

export function canonicalContentEqual(
  submitted: unknown,
  persisted: unknown,
  pageKey: ContentPageKey,
): boolean {
  return JSON.stringify(stableValue(normalizePageContent(submitted, pageKey))) ===
    JSON.stringify(stableValue(normalizePageContent(persisted, pageKey)));
}
