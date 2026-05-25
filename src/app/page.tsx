import { HomeDirectory } from '@/components/HomeDirectory';
import { guidePages } from '@/lib/guideData';
import { toolPages } from '@/lib/pageData';

export default function Home() {
  const coreSlugs = new Set(['bakers-percentage-calculator', 'sourdough-hydration-calculator', 'starter-feeding-calculator', 'dough-scaling-calculator', 'pizza-dough-calculator']);
  const items = [
    ...toolPages.map((page) => ({ href: page.canonicalPath, title: page.h1, description: page.description, type: coreSlugs.has(page.slug) ? 'Core calculator' as const : 'Preset calculator' as const })),
    ...guidePages.map((page) => ({ href: page.canonicalPath, title: page.h1, description: page.description, type: 'Guide' as const }))
  ];
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <section className="rounded-[2.25rem] border border-amber-200/80 bg-white/85 p-6 shadow-soft sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-dough-700">DoughMath</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-6xl">Bread & Sourdough Calculator</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">Calculate baker’s percentages, sourdough hydration, starter feedings, dough scaling, and pizza dough weights with printable formula cards.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-stone-600">
            <span className="rounded-full bg-amber-50 px-3 py-2">Browser-only math</span>
            <span className="rounded-full bg-amber-50 px-3 py-2">No uploads</span>
            <span className="rounded-full bg-amber-50 px-3 py-2">Add to Bowl results</span>
            <span className="rounded-full bg-amber-50 px-3 py-2">Print and share</span>
          </div>
        </div>
      </section>
      <HomeDirectory items={items} />
    </main>
  );
}
