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
    <section className="mt-8 space-y-6">
      <div className="rounded-[2rem] border border-amber-200/80 bg-white p-4 shadow-soft sm:p-5">
        <label className="block">
          <span className="text-sm font-bold text-stone-950">Search calculators and guides</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-base outline-none focus:ring-2 focus:ring-dough-500/30" placeholder="Try hydration, starter ratio, pizza, scaling…" />
        </label>
      </div>
      <div>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-stone-950">Featured calculators</h2>
          <span className="text-sm font-medium text-stone-500">{core.length} shown</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((item) => <ToolCard item={item} key={item.href} />)}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-stone-950">More tools and guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {other.map((item) => <ToolCard item={item} key={item.href} compact />)}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ item, compact = false }: { item: Item; compact?: boolean }) {
  return (
    <Link href={item.href} className={`group rounded-3xl border border-amber-200/80 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-hover ${compact ? 'min-h-32' : 'min-h-44'}`}>
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-dough-700">{item.type}</span>
      <h3 className="mt-4 text-xl font-black text-stone-950 group-hover:text-dough-900">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
    </Link>
  );
}
