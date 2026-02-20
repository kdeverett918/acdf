import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://acdf.onrender.com';
  const routes = ['', '/outcomes', '/prevalence', '/patients', '/calculator', '/simulator', '/concordance', '/about'];

  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date('2025-01-01'),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
