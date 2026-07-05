import type { BusinessIdentity } from "./schema.types";
import { compactSchema } from "./schema.validation";

export function buildOrganizationSchema(input: BusinessIdentity) {
  return compactSchema({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    image: input.image,
    email: input.email,
    telephone: input.phone,
    sameAs: input.socialUrls,
  });
}

