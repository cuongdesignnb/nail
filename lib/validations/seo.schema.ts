import { z } from 'zod';

export const seoMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  canonicalPath: z.string().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  twitterCard: z.string().optional(),
  schemaJson: z.any().optional(),
});

export type SeoMetadataInput = z.infer<typeof seoMetadataSchema>;
