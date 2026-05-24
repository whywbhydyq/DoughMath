import type { MetadataRoute } from 'next';
import { allPages, BASE_URL } from '@/lib/pageData';
import { guidePaths } from '@/lib/guideData';

const extraPages = [
  { canonicalPath: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
  { canonicalPath: '/affiliate-disclosure', priority: 0.4, changeFrequency: 'yearly' as const }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [...allPages, ...guidePaths, ...extraPages].map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
