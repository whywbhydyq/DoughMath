const items = ['digital kitchen scale', 'bench scraper', 'instant-read thermometer', 'banneton', 'pizza steel'];

export function AffiliatePanel() {
  return (
    <section className="no-print rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-stone-700">
      <h2 className="font-semibold text-stone-950">Measuring tools that pair well with baker’s math</h2>
      <p className="mt-2">These equipment categories are useful for repeatable gram-based formulas. No affiliate links are configured, so they are shown as reference tags only.</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Equipment categories">
        {items.map((category) => (
          <span key={category} className="rounded-full border bg-white px-3 py-1">
            {category}
          </span>
        ))}
      </div>
    </section>
  );
}
