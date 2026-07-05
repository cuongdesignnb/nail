import { compactSchema } from "./schema.validation";

export function buildWebSiteSchema(input: { name: string; url: string }) {
  return compactSchema({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
  });
}

