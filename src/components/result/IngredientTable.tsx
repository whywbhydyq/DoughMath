import type { Ingredient } from '@/lib/bakingMath';
import { grams, pct } from '@/lib/bakingMath';

export function IngredientTable({ items, title }: { items: Ingredient[]; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <h2 className="bg-stone-50 px-4 py-3 font-semibold">{title}</h2>
      <table className="w-full text-left text-sm">
        <thead><tr><th className="p-3">Ingredient</th><th className="p-3 text-right">Weight</th><th className="p-3 text-right">Baker's %</th><th className="p-3">Notes</th></tr></thead>
        <tbody>{items.map((item) => <tr className="border-t" key={item.name}><td className="p-3 font-medium">{item.name}</td><td className="p-3 text-right tabular-nums">{grams(item.weightGrams)}</td><td className="p-3 text-right tabular-nums">{item.bakerPercentage === undefined ? '—' : pct(item.bakerPercentage)}</td><td className="p-3 text-stone-500">{item.note}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
