import { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/seo/sitemap.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
