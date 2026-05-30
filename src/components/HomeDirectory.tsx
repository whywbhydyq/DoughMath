'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Item = { href: string; title: string; description: string; type: 'Core calculator' | 'Preset calculator' | 'Guide' };

export function HomeDirectory({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(q));
  }, [items, query]);
  const core = filtered.filter((item) => item.type === 'Core calculator');
  const other = filtered.filter((item) => item.type !== 'Core calculator');

  return (
    <section className="mt-8 space-y-6 border-t border-amber-200/70 pt-8" aria-labelledby="directory-title">
      <div className="grid gap-4 rounded-[2rem] border border-amber-200/80 bg-white/90 p-4 shadow-soft sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-dough-700">More calculators and guides</p>
          <h2 id="directory-title" className="mt-2 text-2xl font-black text-stone-950">Find a full DoughMath tool</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Use the homepage workspace first, then open a full calculator page, preset page, or guide when you need detailed notes, print cards, and share URLs.</p>
        </div>
        <label className="block">
          <span className="text-sm font-bold text-stone-950">Search calculators and guides</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-base outline-none focus:ring-2 focus:ring-dough-500/30" placeholder="Try hydration, starter ratio, pizza, scaling…" />
        </label>
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-stone-950">Full calculator pages</h2>
          <span className="text-sm font-medium text-stone-500">{core.length} shown</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {core.map((item) => <ToolCard item={item} key={item.href} compact />)}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-stone-950">Preset pages and guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {other.map((item) => <ToolCard item={item} key={item.href} compact />)}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ item, compact = false }: { item: Item; compact?: boolean }) {
  return (
    <Link href={item.href} className={`group rounded-3xl border border-amber-200/80 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-hover ${compact ? 'min-h-28' : 'min-h-40'}`}>
      <span className="rounded-full bg-amber-50 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-dough-700">{item.type}</span>
      <h3 className="mt-3 text-lg font-black leading-6 text-stone-950 group-hover:text-dough-900">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
    </Link>
  );
}
