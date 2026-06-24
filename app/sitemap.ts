import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';

const BASE = 'https://flomdigital.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const admin = createAdminClient();

  const [{ data: products }, { data: posts }] = await Promise.all([
    admin.from('platform_products').select('slug, updated_at').eq('is_active', true),
    admin.from('blog_posts').select('slug, updated_at').eq('status', 'published'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                        priority: 1.0,  changeFrequency: 'weekly'  },
    { url: `${BASE}/academy`,           priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/shop`,              priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/blog`,              priority: 0.8,  changeFrequency: 'daily'   },
    { url: `${BASE}/business-tools`,    priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/services`,          priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/about`,             priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,           priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${BASE}/resources`,         priority: 0.6,  changeFrequency: 'weekly'  },
    { url: `${BASE}/faq`,               priority: 0.5,  changeFrequency: 'monthly' },
    { url: `${BASE}/success-stories`,   priority: 0.5,  changeFrequency: 'monthly' },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url:             `${BASE}/academy/${p.slug}`,
    lastModified:    p.updated_at ? new Date(p.updated_at) : new Date(),
    priority:        0.85,
    changeFrequency: 'monthly' as const,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
    url:             `${BASE}/blog/${p.slug}`,
    lastModified:    p.updated_at ? new Date(p.updated_at) : new Date(),
    priority:        0.75,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
