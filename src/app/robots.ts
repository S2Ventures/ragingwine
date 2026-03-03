import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/submit/guide'],
      },
    ],
    sitemap: 'https://ragingwine.com/sitemap.xml',
  };
}
