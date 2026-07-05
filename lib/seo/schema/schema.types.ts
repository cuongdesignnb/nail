export type JsonLdObject = Record<string, unknown>;

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

export type BusinessIdentity = {
  name: string;
  url: string;
  logo?: string;
  image?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  socialUrls?: string[];
  priceRange?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  googleMapsUrl?: string | null;
};

export type BlogPostingInput = {
  headline: string;
  description: string;
  image?: string | null;
  authorName?: string | null;
  publisherName: string;
  publisherLogo?: string | null;
  datePublished: string | Date;
  dateModified?: string | Date | null;
  url: string;
};

export type ServiceSchemaInput = {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  providerName: string;
};

export type OfferSchemaInput = {
  url: string;
  price?: number | string | null;
  priceCurrency?: string | null;
  name?: string | null;
};

