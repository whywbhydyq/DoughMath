import type { MetadataRoute } from 'next';
import { BASE_URL, legalPages, toolPages } from '@/lib/pageData';
import { guidePaths } from '@/lib/guideData';
import { isIndexableToolSlug } from '@/lib/publicPolicy';
const SITE_LAST_MODIFIED = new Date('2026-07-10T00:00:00.000Z');
export default function sitemap(): MetadataRoute.Sitemap {
  const pages=[{canonicalPath:'/',priority:1,changeFrequency:'weekly' as const}, ...toolPages.filter((p)=>isIndexableToolSlug(p.slug)).map((p)=>({canonicalPath:p.canonicalPath,priority:p.priority,changeFrequency:'weekly' as const})), ...guidePaths, ...legalPages.map((p)=>({canonicalPath:p.canonicalPath,priority:p.priority,changeFrequency:'yearly' as const}))];
  return Array.from(new Map(pages.map((p)=>[p.canonicalPath,p])).values()).map((p)=>({url:`${BASE_URL}${p.canonicalPath}`,lastModified:SITE_LAST_MODIFIED,changeFrequency:p.changeFrequency,priority:p.priority}));
}
