import type { BusinessIdentity } from "./schema.types";
import { compactSchema } from "./schema.validation";

export function buildNailSalonSchema(input: BusinessIdentity) {
  const geo = input.latitude && input.longitude
    ? { "@type": "GeoCoordinates", latitude: input.latitude, longitude: input.longitude }
    : undefined;

  return compactSchema({
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: input.name,
    url: input.url,
    logo: input.logo,
    image: input.image,
    description: input.description,
    telephone: input.phone,
    email: input.email,
    address: input.address,
    openingHours: input.hours,
    priceRange: input.priceRange,
    geo,
    hasMap: input.googleMapsUrl,
    sameAs: input.socialUrls,
  });
}

