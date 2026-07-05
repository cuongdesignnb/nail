import type { OfferSchemaInput } from "./schema.types";
import { compactSchema } from "./schema.validation";

export function buildOfferSchema(input: OfferSchemaInput) {
  if (input.price === undefined || input.price === null || input.price === "") return null;
  return compactSchema({
    "@context": "https://schema.org",
    "@type": "Offer",
    name: input.name || undefined,
    url: input.url,
    price: String(input.price),
    priceCurrency: input.priceCurrency || "USD",
  });
}

