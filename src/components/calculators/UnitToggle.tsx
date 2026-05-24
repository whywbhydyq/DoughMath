'use client';

export function UnitToggle({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-2xl border bg-white p-4">
      <span className="text-sm font-medium">Display unit</span>
      <select className="mt-2 min-h-12 w-full rounded-xl border px-3" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="g">grams</option>
        <option value="oz">ounces</option>
        <option value="lb">pounds</option>
      </select>
    </label>
  );
}
