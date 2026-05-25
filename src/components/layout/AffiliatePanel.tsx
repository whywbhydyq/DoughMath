'use client';

import { trackCalculatorEvent } from '@/lib/analytics';

const items = ['digital kitchen scale', 'bench scraper', 'instant-read thermometer', 'banneton', 'pizza steel'];

export function AffiliatePanel() {
  return (
    <section className="no-print rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-stone-700">
      <h2 className="font-semibold text-stone-950">Measuring tools that pair well with baker’s math</h2>
      <p className="mt-2">These categories are useful when you need repeatable gram-based formulas. They stay separate from calculator results and are hidden from print output.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((category) => (
          <button key={category} type="button" className="min-h-10 rounded-full border bg-white px-3 py-1 text-left" onClick={() => trackCalculatorEvent('affiliate_clicked', 'site', { category })}>
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
