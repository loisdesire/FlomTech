import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/members', '/login', '/register', '/checkout'],
      },
    ],
    sitemap: 'https://flomdigital.com/sitemap.xml',
  };
}
