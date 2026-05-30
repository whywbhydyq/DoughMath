import type { MetadataRoute } from 'next';
import { allPages, BASE_URL } from '@/lib/pageData';
import { guidePaths } from '@/lib/guideData';

const SITE_LAST_MODIFIED = new Date('2026-05-30T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const unique = new Map([...allPages, ...guidePaths].map((page) => [page.canonicalPath, page]));
  return Array.from(unique.values()).map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
