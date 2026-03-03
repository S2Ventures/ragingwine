import type { MetadataRoute } from 'next';
import { getReviews, getCities, getWineryStates } from '@/lib/sanity';
import { getAllWine101Articles } from '@/lib/wine101';

const BASE_URL = 'https://ragingwine.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/reviews`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/wine-101`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/wineries`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/suggest`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/submit`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/quiz`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/shop`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/adventures`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  // Review pages — highest content value
  const reviews = await getReviews();
  const reviewPages: MetadataRoute.Sitemap = reviews.map((r) => ({
    url: `${BASE_URL}/reviews/${r.slug}`,
    lastModified: r.publishedAt ? new Date(r.publishedAt) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // City pages
  const cities = await getCities();
  const cityPages: MetadataRoute.Sitemap = cities
    .filter((c) => !c.comingSoon)
    .map((c) => ({
      url: `${BASE_URL}/cities/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Wine 101 articles
  const articles = getAllWine101Articles();
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/wine-101/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Winery state pages
  const wineryStates = await getWineryStates();
  const wineryPages: MetadataRoute.Sitemap = wineryStates.map((s) => ({
    url: `${BASE_URL}/wineries/${s.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...reviewPages, ...cityPages, ...articlePages, ...wineryPages];
}
