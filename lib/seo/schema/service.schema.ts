import type { ServiceSchemaInput } from "./schema.types";
import { compactSchema } from "./schema.validation";

export function buildServiceSchema(input: ServiceSchemaInput) {
  return compactSchema({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description || undefined,
    url: input.url,
    image: input.image || undefined,
    provider: {
      "@type": "NailSalon",
      name: input.providerName,
    },
  });
}

