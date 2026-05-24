import type { MetadataRoute } from 'next';
import { allPages, BASE_URL } from '@/lib/pageData';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allPages.map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
