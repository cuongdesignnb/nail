import type { JsonLdObject } from "./schema.types";
import { validateLegacySchemaJson } from "../seo.validation";

export function isValidSchema(schema: unknown): schema is JsonLdObject {
  if (!schema || typeof schema !== "object") return false;
  const result = validateLegacySchemaJson(schema);
  return result.valid;
}

export function compactSchema<T extends JsonLdObject>(schema: T): T {
  return Object.fromEntries(
    Object.entries(schema).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  ) as T;
}

