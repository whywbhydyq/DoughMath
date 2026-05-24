export function HydrationBreakdown({ added, total }: { added?: string; total?: string }) {
  return <div className="grid gap-3 sm:grid-cols-2">{added ? <b className="rounded-2xl border bg-white p-4">Added hydration {added}</b> : null}{total ? <b className="rounded-2xl border bg-white p-4">Total hydration {total}</b> : null}</div>;
}
