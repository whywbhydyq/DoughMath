import type { Warn } from '@/lib/bakingMath';

export function WarningList({ items }: { items: Warn[] }) {
  if (!items.length) return null;
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm"><b>Checks and notes</b><ul className="mt-2 space-y-1">{items.map((item) => <li key={item.code}>• {item.message}</li>)}</ul></div>;
}
