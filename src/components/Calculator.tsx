'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  calculateBakersPercentage,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding,
  grams,
  pct,
  type Ingredient,
  type Warn
} from '@/lib/bakingMath';
import { trackCalculatorEvent } from '@/lib/analytics';

type CalculatorSlug =
  | 'bakers-percentage-calculator'
  | 'sourdough-hydration-calculator'
  | 'starter-feeding-calculator'
  | 'dough-scaling-calculator'
  | 'pizza-dough-calculator';

type State = {
  flour: number;
  hyd: number;
  starter: number;
  salt: number;
  water: number;
  sh: number;
  saltg: number;
  target: number;
  loaves: number;
  count: number;
  ball: number;
  oil: number;
  sugar: number;
  yeast: number;
  seed: number;
  flourpart: number;
  waterpart: number;
  extra: number;
  mode: 'target' | 'flour';
  lev: 'yeast' | 'sourdough';
};

const numericDefaults: State = {
  flour: 500,
  hyd: 75,
  starter: 20,
  salt: 2,
  water: 350,
  sh: 100,
  saltg: 10,
  target: 1500,
  loaves: 2,
  count: 3,
  ball: 280,
  oil: 0,
  sugar: 0,
  yeast: 0.2,
  seed: 1,
  flourpart: 2,
  waterpart: 2,
  extra: 0,
  mode: 'target',
  lev: 'yeast'
};

function readNumber(params: URLSearchParams, key: keyof State, fallback: number) {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function Field(props: {
  label: string;
  value: number;
  set: (next: number) => void;
  unit: string;
  step?: number;
  min?: number;
  helper?: string;
}) {
  const step = props.step ?? 1;
  const min = props.min ?? 0;
  const update = (value: number) => props.set(Math.max(min, Number.isFinite(value) ? value : props.value));

  return (
    <label className="rounded-2xl border bg-white p-4">
      <span className="text-sm font-medium">{props.label}</span>
      <span className="mt-2 flex overflow-hidden rounded-xl border">
        <button className="w-11 bg-stone-50" onClick={() => update(props.value - step)} type="button" aria-label={`Decrease ${props.label}`}>−</button>
        <input className="min-h-12 w-full px-3" inputMode="decimal" type="number" value={props.value} min={min} step={step} onChange={(event) => update(Number(event.target.value))} aria-label={props.label} />
        <span className="flex min-w-12 items-center justify-center border-l px-2 text-sm text-stone-500">{props.unit}</span>
        <button className="w-11 border-l bg-stone-50" onClick={() => update(props.value + step)} type="button" aria-label={`Increase ${props.label}`}>+</button>
      </span>
      {props.helper ? <span className="mt-1 block text-xs text-stone-500">{props.helper}</span> : null}
    </label>
  );
}

function SelectField(props: { label: string; value: string; set: (next: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="rounded-2xl border bg-white p-4">
      <span className="text-sm font-medium">{props.label}</span>
      <select className="mt-2 min-h-12 w-full rounded-xl border px-3" value={props.value} onChange={(event) => props.set(event.target.value)} aria-label={props.label}>
        {props.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function ResultTable({ items, title }: { items: Ingredient[]; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <h2 className="bg-stone-50 px-4 py-3 font-semibold">{title}</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="p-3">Ingredient</th>
            <th className="p-3 text-right">Weight</th>
            <th className="p-3 text-right">Baker's %</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-t" key={item.name}>
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3 text-right tabular-nums">{grams(item.weightGrams)}</td>
              <td className="p-3 text-right tabular-nums">{item.bakerPercentage === undefined ? '—' : pct(item.bakerPercentage)}</td>
              <td className="p-3 text-stone-500">{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarningList({ items }: { items: Warn[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
      <b>Checks and notes</b>
      <ul className="mt-2 space-y-1">
        {items.map((warning) => <li key={warning.code}>• {warning.message}</li>)}
      </ul>
    </div>
  );
}

function Actions({ text, slug }: { text: string; slug: string }) {
  const [status, setStatus] = useState('');
  return (
    <div className="no-print flex flex-wrap gap-3">
      <button className="rounded-xl bg-dough-900 px-4 py-2 text-white" onClick={async () => { await navigator.clipboard.writeText(text); trackCalculatorEvent('calculator_copy', slug); setStatus('Result copied.'); }}>Copy result</button>
      <button className="rounded-xl border bg-white px-4 py-2" onClick={() => { trackCalculatorEvent('calculator_print', slug); window.print(); }}>Print recipe card</button>
      <button className="rounded-xl border bg-white px-4 py-2" onClick={async () => { await navigator.clipboard.writeText(location.href); trackCalculatorEvent('calculator_share', slug); setStatus('Share URL copied.'); }}>Copy share URL</button>
      <span className="self-center text-sm text-stone-500">{status}</span>
    </div>
  );
}

function Presets({ set }: { set: (key: keyof State, value: number | string) => void }) {
  const presets = [
    ['1:1:1', 1, 1, 1],
    ['1:2:2', 1, 2, 2],
    ['1:3:3', 1, 3, 3],
    ['1:5:5', 1, 5, 5]
  ] as const;
  return (
    <div className="no-print flex flex-wrap gap-2">
      {presets.map(([label, seed, flour, water]) => (
        <button key={label} type="button" className="rounded-full border bg-white px-3 py-1 text-sm" onClick={() => { set('seed', seed); set('flourpart', flour); set('waterpart', water); }}>{label}</button>
      ))}
    </div>
  );
}

function useCalculatorState(slug: string) {
  const params = useSearchParams();
  const [state, setState] = useState<State>(() => ({
    ...numericDefaults,
    flour: readNumber(params, 'flour', numericDefaults.flour),
    hyd: readNumber(params, 'hyd', numericDefaults.hyd),
    starter: readNumber(params, 'starter', numericDefaults.starter),
    salt: readNumber(params, 'salt', numericDefaults.salt),
    water: readNumber(params, 'water', numericDefaults.water),
    sh: readNumber(params, 'sh', numericDefaults.sh),
    saltg: readNumber(params, 'saltg', numericDefaults.saltg),
    target: readNumber(params, 'target', numericDefaults.target),
    loaves: readNumber(params, 'loaves', numericDefaults.loaves),
    count: readNumber(params, 'count', numericDefaults.count),
    ball: readNumber(params, 'ball', numericDefaults.ball),
    oil: readNumber(params, 'oil', numericDefaults.oil),
    sugar: readNumber(params, 'sugar', numericDefaults.sugar),
    yeast: readNumber(params, 'yeast', numericDefaults.yeast),
    seed: readNumber(params, 'seed', numericDefaults.seed),
    flourpart: readNumber(params, 'flourpart', numericDefaults.flourpart),
    waterpart: readNumber(params, 'waterpart', numericDefaults.waterpart),
    extra: readNumber(params, 'extra', numericDefaults.extra),
    mode: params.get('mode') === 'flour' ? 'flour' : 'target',
    lev: params.get('lev') === 'sourdough' ? 'sourdough' : 'yeast'
  }));

  useEffect(() => {
    trackCalculatorEvent('calculator_view', slug);
  }, [slug]);

  useEffect(() => {
    const url = new URL(location.href);
    Object.entries(state).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`);
  }, [state]);

  const set = (key: keyof State, value: number | string) => setState((current) => ({ ...current, [key]: value }));
  return { state, set };
}

export default function Calculator({ slug }: { slug: string }) {
  const { state, set } = useCalculatorState(slug);

  const result = useMemo(() => {
    if (slug === 'bakers-percentage-calculator') {
      return calculateBakersPercentage({ flourWeightGrams: state.flour, hydrationPct: state.hyd, starterPct: state.starter, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar });
    }
    if (slug === 'sourdough-hydration-calculator') {
      return calculateSourdoughHydration({ mainFlourGrams: state.flour, addedWaterGrams: state.water, starterWeightGrams: state.starter, starterHydrationPct: state.sh, saltWeightGrams: state.saltg });
    }
    if (slug === 'starter-feeding-calculator') {
      return calculateStarterFeeding({ targetStarterWeightGrams: state.target, seedPart: state.seed, flourPart: state.flourpart, waterPart: state.waterpart, extraGrams: state.extra });
    }
    if (slug === 'pizza-dough-calculator') {
      return calculatePizzaDough({ pizzaCount: state.count, ballWeightGrams: state.ball, hydrationPct: state.hyd, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: state.yeast, starterPct: state.starter, starterHydrationPct: state.sh, leaveningType: state.lev });
    }
    return calculateDoughScaling({ mode: state.mode === 'flour' ? 'by-flour-weight' : 'by-target-dough-weight', flourWeightGrams: state.flour, targetDoughWeightGrams: state.target, loafCount: state.loaves, hydrationPct: state.hyd, starterPct: state.starter, starterHydrationPct: state.sh, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar });
  }, [state, slug]);

  const items = result.ingredients as Ingredient[];
  const perUnit = 'perUnit' in result ? (result.perUnit as Ingredient[]) : undefined;
  const total = 'totalDoughWeightGrams' in result ? result.totalDoughWeightGrams : result.totalNeededStarterGrams;
  const hydration = 'totalHydrationPct' in result ? result.totalHydrationPct : undefined;
  const copyText = `${items.map((item) => `${item.name}: ${grams(item.weightGrams)}`).join('\n')}\nTotal: ${grams(total)}`;

  return (
    <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slug === 'sourdough-hydration-calculator' ? (
          <>
            <Field label="Main flour" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} />
            <Field label="Added water" value={state.water} set={(value) => set('water', value)} unit="g" step={10} />
            <Field label="Starter weight" value={state.starter} set={(value) => set('starter', value)} unit="g" step={10} />
            <Field label="Starter hydration" value={state.sh} set={(value) => set('sh', value)} unit="%" />
            <Field label="Salt weight" value={state.saltg} set={(value) => set('saltg', value)} unit="g" />
          </>
        ) : slug === 'starter-feeding-calculator' ? (
          <>
            <Field label="Target starter" value={state.target} set={(value) => set('target', value)} unit="g" step={10} />
            <Field label="Seed part" value={state.seed} set={(value) => set('seed', value)} unit="part" step={0.5} />
            <Field label="Flour part" value={state.flourpart} set={(value) => set('flourpart', value)} unit="part" step={0.5} />
            <Field label="Water part" value={state.waterpart} set={(value) => set('waterpart', value)} unit="part" step={0.5} />
            <Field label="Extra starter" value={state.extra} set={(value) => set('extra', value)} unit="g" step={5} helper="Optional retained extra starter." />
          </>
        ) : slug === 'pizza-dough-calculator' ? (
          <>
            <SelectField label="Leavening" value={state.lev} set={(value) => set('lev', value)} options={[{ value: 'yeast', label: 'Yeast' }, { value: 'sourdough', label: 'Sourdough starter' }]} />
            <Field label="Pizza count" value={state.count} set={(value) => set('count', value)} unit="pizzas" />
            <Field label="Ball weight" value={state.ball} set={(value) => set('ball', value)} unit="g" step={10} />
            <Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" />
            <Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} />
            <Field label="Oil" value={state.oil} set={(value) => set('oil', value)} unit="%" step={0.5} />
            {state.lev === 'yeast' ? <Field label="Yeast" value={state.yeast} set={(value) => set('yeast', value)} unit="%" step={0.1} /> : <Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" />}
          </>
        ) : slug === 'dough-scaling-calculator' ? (
          <>
            <SelectField label="Calculation mode" value={state.mode} set={(value) => set('mode', value)} options={[{ value: 'target', label: 'Target dough weight' }, { value: 'flour', label: 'Known flour weight' }]} />
            <Field label="Target dough" value={state.target} set={(value) => set('target', value)} unit="g" step={50} />
            <Field label="Flour weight" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} />
            <Field label="Loaf count" value={state.loaves} set={(value) => set('loaves', value)} unit="loaves" />
            <Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" />
            <Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" />
            <Field label="Starter hydration" value={state.sh} set={(value) => set('sh', value)} unit="%" />
            <Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} />
          </>
        ) : (
          <>
            <Field label="Total flour weight" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} />
            <Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" />
            <Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" />
            <Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} />
            <Field label="Oil" value={state.oil} set={(value) => set('oil', value)} unit="%" step={0.5} />
            <Field label="Sugar" value={state.sugar} set={(value) => set('sugar', value)} unit="%" step={0.5} />
          </>
        )}
      </div>

      {slug === 'starter-feeding-calculator' ? <div className="mt-4"><Presets set={set} /></div> : null}

      <div className="mt-6 space-y-5 print-card">
        <div className="grid gap-3 sm:grid-cols-3">
          <b className="rounded-2xl border bg-white p-4">Total {grams(total)}</b>
          {hydration ? <b className="rounded-2xl border bg-white p-4">Total hydration {pct(hydration)}</b> : null}
        </div>
        <ResultTable title="Ingredient weights" items={items} />
        {perUnit ? <ResultTable title="Per loaf / per ball" items={perUnit} /> : null}
        <WarningList items={result.warnings ?? []} />
        <Actions text={copyText} slug={slug} />
      </div>
    </section>
  );
}
