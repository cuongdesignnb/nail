import type { BlogPostingInput } from "./schema.types";
import { compactSchema } from "./schema.validation";

function iso(value: string | Date | null | undefined) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

export function buildBlogPostingSchema(input: BlogPostingInput) {
  return compactSchema({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    image: input.image || undefined,
    author: {
      "@type": input.authorName ? "Person" : "Organization",
      name: input.authorName || input.publisherName,
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      logo: input.publisherLogo ? { "@type": "ImageObject", url: input.publisherLogo } : undefined,
    },
    datePublished: iso(input.datePublished),
    dateModified: iso(input.dateModified) || iso(input.datePublished),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
  });
}

