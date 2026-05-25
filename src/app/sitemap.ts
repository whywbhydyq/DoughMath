import type { MetadataRoute } from 'next';
import { allPages, BASE_URL } from '@/lib/pageData';
import { guidePaths } from '@/lib/guideData';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const unique = new Map([...allPages, ...guidePaths].map((page) => [page.canonicalPath, page]));
  return Array.from(unique.values()).map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
