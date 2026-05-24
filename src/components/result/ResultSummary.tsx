export function ResultSummary({ total, hydration }: { total: string; hydration?: string }) {
  return <div className="grid gap-3 sm:grid-cols-3"><b className="rounded-2xl border bg-white p-4">Total {total}</b>{hydration ? <b className="rounded-2xl border bg-white p-4">Total hydration {hydration}</b> : null}</div>;
}
