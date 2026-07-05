import { MetadataRoute } from 'next';
import { buildAbsoluteUrl } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/login/',
        '/preview/',
        '/admin/content/',
        '/internal/',
        '/api/internal/',
      ],
    },
    sitemap: buildAbsoluteUrl('/sitemap.xml'),
  };
}
