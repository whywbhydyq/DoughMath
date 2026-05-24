'use client';

export function NumberField(props: { label: string; value: number; onChange: (value: number) => void; unit: string; step?: number; min?: number; helper?: string }) {
  const step = props.step ?? 1;
  const min = props.min ?? 0;
  const update = (next: number) => props.onChange(Math.max(min, Number.isFinite(next) ? next : props.value));
  return (
    <label className="rounded-2xl border bg-white p-4">
      <span className="text-sm font-medium">{props.label}</span>
      <span className="mt-2 flex overflow-hidden rounded-xl border">
        <button className="w-11 bg-stone-50" onClick={() => update(props.value - step)} type="button">−</button>
        <input className="min-h-12 w-full px-3" inputMode="decimal" type="number" value={props.value} min={min} step={step} onChange={(event) => update(Number(event.target.value))} />
        <span className="flex min-w-12 items-center justify-center border-l px-2 text-sm text-stone-500">{props.unit}</span>
        <button className="w-11 border-l bg-stone-50" onClick={() => update(props.value + step)} type="button">+</button>
      </span>
      {props.helper ? <span className="mt-1 block text-xs text-stone-500">{props.helper}</span> : null}
    </label>
  );
}
