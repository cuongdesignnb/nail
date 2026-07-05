import type { JsonLdObject } from "@/lib/seo/schema/schema.types";
import { serializeJsonLd } from "@/lib/seo/schema/schema.serialize";
import { isValidSchema } from "@/lib/seo/schema/schema.validation";

export function JsonLd({ schema }: { schema: JsonLdObject | JsonLdObject[] | null | undefined }) {
  if (!schema) return null;
  const schemas = Array.isArray(schema) ? schema : [schema];
  const valid = schemas.filter(isValidSchema);
  if (valid.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(valid.length === 1 ? valid[0] : { "@context": "https://schema.org", "@graph": valid }),
      }}
    />
  );
}

