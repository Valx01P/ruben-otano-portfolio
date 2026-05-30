import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { projects } from '@/lib/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  for (const p of projects) {
    routes.push({
      url: `${site.url}/demos/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return routes;
}
