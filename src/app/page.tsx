import type { Metadata } from 'next';
import { HomeDirectory } from '@/components/HomeDirectory';
import { HomeItemListJsonLd, SiteJsonLd } from '@/components/seo/JsonLd';
import { HomeWorkspace } from '@/components/home/HomeWorkspace';
import { guidePages } from '@/lib/guideData';
import { BASE_URL, toolPages } from '@/lib/pageData';
import { directoryClusters, getDirectoryClusterId } from '@/lib/seoClusters';

export const metadata: Metadata = {
  title: 'Bread & Sourdough Calculators for Baker’s Math | DoughMath',
  description: 'Use DoughMath to scale bread dough, calculate sourdough hydration, feed starter, convert baker’s percentages, and plan pizza dough weights in your browser.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Bread & Sourdough Calculators for Baker’s Math | DoughMath',
    description: 'A browser-only baker’s math workspace for dough scaling, sourdough hydration, starter feeding, baker’s percentages, pizza dough, and formula conversions.',
    url: `${BASE_URL}/`
  }
};

export default function Home() {
  const coreSlugs = new Set(['bakers-percentage-calculator', 'sourdough-hydration-calculator', 'starter-feeding-calculator', 'dough-scaling-calculator', 'pizza-dough-calculator']);
  const items = [
    ...toolPages.map((page) => ({ href: page.canonicalPath, title: page.h1, description: page.description, type: coreSlugs.has(page.slug) ? 'Core calculator' as const : 'Preset calculator' as const, clusterId: getDirectoryClusterId(page.canonicalPath) })),
    ...guidePages.map((page) => ({ href: page.canonicalPath, title: page.h1, description: page.description, type: 'Guide' as const, clusterId: getDirectoryClusterId(page.canonicalPath) }))
  ];
  const structuredDataItems = items.filter((item) => item.type === 'Core calculator');

  return (
    <>
      <SiteJsonLd />
      <HomeItemListJsonLd items={structuredDataItems} />
      <main className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-4">
      <section className="mb-3 rounded-[1.7rem] border border-amber-200/80 bg-white/85 px-5 py-3.5 shadow-soft sm:px-6 lg:px-6 lg:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-dough-700">DoughMath</p>
            <h1 className="mt-1.5 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.02]">Bread & Sourdough Calculators</h1>
            <p className="mt-2 max-w-3xl text-base leading-6 text-stone-600">Scale dough, check hydration, feed starter, and calculate pizza dough weights with browser-only baker’s math.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-stone-600 lg:max-w-xs lg:justify-end">
            <span className="rounded-full bg-amber-50 px-3 py-1.5">Browser-only</span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5">No uploads</span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5">Copy results</span>
          </div>
        </div>
      </section>

      <HomeWorkspace />

      <HomeDirectory items={items} clusters={directoryClusters} />
      </main>
    </>
  );
}
