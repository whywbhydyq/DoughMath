export const indexableToolSlugs = new Set([
  'bakers-percentage-calculator',
  'sourdough-hydration-calculator',
  'starter-feeding-calculator',
  'dough-scaling-calculator',
  'pizza-dough-calculator'
]);
export const adsenseAllowedPaths = new Set(['/', ...Array.from(indexableToolSlugs, (slug) => `/${slug}`)]);
export const isIndexableToolSlug = (slug: string) => indexableToolSlugs.has(slug);
export function isAdsenseAllowedPath(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return adsenseAllowedPaths.has(normalized);
}
