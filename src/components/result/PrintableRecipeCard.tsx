import type { Ingredient } from '@/lib/bakingMath';
import { formatWeight, type WeightUnit } from '@/lib/units';

export function PrintableRecipeCard({ title, items, unit = 'g' }: { title: string; items: Ingredient[]; unit?: WeightUnit }) {
  return <section className="print-card rounded-2xl border bg-white p-4"><h2 className="text-xl font-semibold">{title}</h2><ul className="mt-3 space-y-1 text-sm">{items.map((item) => <li key={item.name}>{item.name}: {formatWeight(item.weightGrams, unit)}</li>)}</ul></section>;
}
