'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  calculateBakersPercentage,
  calculateBakersPercentagesFromWeights,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding,
  pct,
  type Ingredient,
  type Warn
} from '@/lib/bakingMath';
import { trackCalculatorEvent } from '@/lib/analytics';
import { formatWeight, type WeightUnit } from '@/lib/units';
import type { CalculatorType } from '@/types/baking';

type DefaultInputs = Record<string, number | string>;

type State = {
  bakerMode: 'percentages' | 'weights';
  flour: number;
  hyd: number;
  starter: number;
  salt: number;
  water: number;
  sh: number;
  saltg: number;
  bpWater: number;
  bpStarter: number;
  bpSalt: number;
  bpOil: number;
  bpSugar: number;
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
  unit: WeightUnit;
};

type AnyResult = {
  ingredients: Ingredient[];
  perUnit?: Ingredient[];
  warnings?: Warn[];
  totalDoughWeightGrams?: number;
  totalNeededStarterGrams?: number;
  totalHydrationPct?: number;
  totalFormulaPct?: number;
  seedStarterGrams?: number;
  feedingFlourGrams?: number;
  feedingWaterGrams?: number;
  finalStarterWeightGrams?: number;
  retainedExtraStarterGrams?: number;
};

const baseDefaults: State = {
  bakerMode: 'percentages',
  flour: 500,
  hyd: 75,
  starter: 20,
  salt: 2,
  water: 350,
  sh: 100,
  saltg: 10,
  bpWater: 375,
  bpStarter: 100,
  bpSalt: 10,
  bpOil: 0,
  bpSugar: 0,
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
  lev: 'yeast',
  unit: 'g'
};

const numberKeys: (keyof State)[] = [
  'flour', 'hyd', 'starter', 'salt', 'water', 'sh', 'saltg', 'bpWater', 'bpStarter',
  'bpSalt', 'bpOil', 'bpSugar', 'target', 'loaves', 'count', 'ball', 'oil', 'sugar',
  'yeast', 'seed', 'flourpart', 'waterpart', 'extra'
];

function mergedDefaults(input?: DefaultInputs): State {
  return { ...baseDefaults, ...input } as State;
}

function readNumber(params: URLSearchParams, key: keyof State, fallback: number) {
  const raw = params.get(key);
  if (raw === null || raw === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function readUnit(params: URLSearchParams, fallback: WeightUnit): WeightUnit {
  const value = params.get('unit');
  return value === 'oz' || value === 'lb' || value === 'g' ? value : fallback;
}

function readState(params: URLSearchParams, defaults: State): State {
  const state = { ...defaults };
  numberKeys.forEach((key) => {
    state[key] = readNumber(params, key, defaults[key] as number) as never;
  });
  const bakerMode = params.get('bakerMode');
  const mode = params.get('mode');
  const lev = params.get('lev');
  state.bakerMode = bakerMode === 'weights' || bakerMode === 'percentages' ? bakerMode : defaults.bakerMode;
  state.mode = mode === 'flour' || mode === 'target' ? mode : defaults.mode;
  state.lev = lev === 'sourdough' || lev === 'yeast' ? lev : defaults.lev;
  state.unit = readUnit(params, defaults.unit);
  return state;
}

function Field(props: { label: string; value: number; set: (next: number) => void; unit: string; step?: number; min?: number; helper?: string }) {
  const step = props.step ?? 1;
  const min = props.min ?? 0;
  const update = (value: number) => props.set(Number.isFinite(value) ? Math.max(min, value) : props.value);
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

function ResultTable({ items, title, unit }: { items: Ingredient[]; title: string; unit: WeightUnit }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <h2 className="bg-stone-50 px-4 py-3 font-semibold">{title}</h2>
      <table className="w-full text-left text-sm">
        <thead><tr><th className="p-3">Ingredient</th><th className="p-3 text-right">Weight</th><th className="p-3 text-right">Baker&apos;s %</th><th className="p-3">Notes</th></tr></thead>
        <tbody>{items.map((item) => <tr className="border-t" key={`${title}-${item.name}`}><td className="p-3 font-medium">{item.name}</td><td className="p-3 text-right tabular-nums">{formatWeight(item.weightGrams, unit)}</td><td className="p-3 text-right tabular-nums">{item.bakerPercentage === undefined ? '—' : pct(item.bakerPercentage)}</td><td className="p-3 text-stone-500">{item.note}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function WarningList({ items, slug }: { items: Warn[]; slug: string }) {
  useEffect(() => {
    items.forEach((warning) => trackCalculatorEvent('warning_shown', slug, { warning_code: warning.code }));
  }, [items, slug]);
  if (!items.length) return null;
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm"><b>Checks and notes</b><ul className="mt-2 space-y-1">{items.map((warning) => <li key={warning.code}>• {warning.message}</li>)}</ul></div>;
}

function useCalculatorState(slug: string, defaultInputs?: DefaultInputs) {
  const params = useSearchParams();
  const defaults = mergedDefaults(defaultInputs);
  const [state, setState] = useState<State>(() => readState(params, defaults));
  useEffect(() => { trackCalculatorEvent('calculator_view', slug); }, [slug]);
  useEffect(() => {
    const url = new URL(location.href);
    Object.entries(state).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`);
    trackCalculatorEvent('calculate_click', slug);
  }, [state, slug]);
  const set = (key: keyof State, value: number | string) => setState((current) => ({ ...current, [key]: value }));
  const reset = () => setState(defaults);
  const setUnit = (value: string) => setState((current) => ({ ...current, unit: value === 'oz' || value === 'lb' || value === 'g' ? value : current.unit }));
  return { state, set, setUnit, reset };
}

function compute(calculatorType: CalculatorType, state: State) {
  if (calculatorType === 'bakers-percentage') {
    return state.bakerMode === 'weights'
      ? calculateBakersPercentagesFromWeights({ flourWeightGrams: state.flour, waterWeightGrams: state.bpWater, starterWeightGrams: state.bpStarter, saltWeightGrams: state.bpSalt, oilWeightGrams: state.bpOil, sugarWeightGrams: state.bpSugar })
      : calculateBakersPercentage({ flourWeightGrams: state.flour, hydrationPct: state.hyd, starterPct: state.starter, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar });
  }
  if (calculatorType === 'sourdough-hydration') return calculateSourdoughHydration({ mainFlourGrams: state.flour, addedWaterGrams: state.water, starterWeightGrams: state.starter, starterHydrationPct: state.sh, saltWeightGrams: state.saltg });
  if (calculatorType === 'starter-feeding') return calculateStarterFeeding({ targetStarterWeightGrams: state.target, seedPart: state.seed, flourPart: state.flourpart, waterPart: state.waterpart, extraGrams: state.extra });
  if (calculatorType === 'pizza-dough') return calculatePizzaDough({ pizzaCount: state.count, ballWeightGrams: state.ball, hydrationPct: state.hyd, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: state.yeast, starterPct: state.starter, starterHydrationPct: state.sh, leaveningType: state.lev });
  return calculateDoughScaling({ mode: state.mode === 'flour' ? 'by-flour-weight' : 'by-target-dough-weight', flourWeightGrams: state.flour, targetDoughWeightGrams: state.target, loafCount: state.loaves, hydrationPct: state.hyd, starterPct: state.starter, starterHydrationPct: state.sh, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: state.yeast });
}

function StarterPresets({ set }: { set: (key: keyof State, value: number | string) => void }) {
  const presets = [['1:1:1', 1, 1, 1], ['1:2:2', 1, 2, 2], ['1:3:3', 1, 3, 3], ['1:5:5', 1, 5, 5], ['1:10:10', 1, 10, 10]] as const;
  return <div className="no-print mt-4 flex flex-wrap gap-2">{presets.map(([label, seed, flour, water]) => <button key={label} type="button" className="rounded-full border bg-white px-3 py-1 text-sm" onClick={() => { set('seed', seed); set('flourpart', flour); set('waterpart', water); }}>{label}</button>)}</div>;
}

function CopyButtons({ text, slug, reset }: { text: string; slug: string; reset: () => void }) {
  const [status, setStatus] = useState('');
  return <div className="no-print flex flex-wrap gap-3"><button className="rounded-xl bg-dough-900 px-4 py-2 text-white" onClick={async () => { await navigator.clipboard.writeText(text); trackCalculatorEvent('copy_result', slug); setStatus('Result copied.'); }}>Copy result</button><button className="rounded-xl border bg-white px-4 py-2" onClick={() => { trackCalculatorEvent('print_recipe', slug); window.print(); }}>Print recipe card</button><button className="rounded-xl border bg-white px-4 py-2" onClick={async () => { await navigator.clipboard.writeText(location.href); trackCalculatorEvent('share_url', slug); setStatus('Share URL copied.'); }}>Copy share URL</button><button className="rounded-xl border bg-white px-4 py-2" onClick={() => { reset(); setStatus('Inputs reset.'); }}>Reset</button><span className="self-center text-sm text-stone-500">{status}</span></div>;
}

export default function Calculator({ slug, calculatorType, defaultInputs }: { slug: string; calculatorType: CalculatorType; defaultInputs?: DefaultInputs }) {
  const { state, set, setUnit, reset } = useCalculatorState(slug, defaultInputs);
  const computed = useMemo(() => {
    try { return { result: compute(calculatorType, state) as AnyResult, error: '' }; }
    catch (error) { return { result: undefined, error: error instanceof Error ? error.message : 'Check your inputs and try again.' }; }
  }, [state, calculatorType]);
  const result = computed.result;
  const items = result?.ingredients ?? [];
  const total = result ? (result.totalDoughWeightGrams ?? result.totalNeededStarterGrams ?? 0) : 0;
  const lineBreak = String.fromCharCode(10);
  const copyText = result
    ? [...items.map((item) => `${item.name}: ${formatWeight(item.weightGrams, state.unit)}${item.bakerPercentage === undefined ? '' : ` (${pct(item.bakerPercentage)})`}`), `Total: ${formatWeight(total, state.unit)}`].join(lineBreak)
    : computed.error;

  return (
    <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SelectField label="Display unit" value={state.unit} set={setUnit} options={[{ value: 'g', label: 'grams' }, { value: 'oz', label: 'ounces' }, { value: 'lb', label: 'pounds' }]} />
        {calculatorType === 'bakers-percentage' && <><SelectField label="Baker&apos;s math mode" value={state.bakerMode} set={(value) => set('bakerMode', value)} options={[{ value: 'percentages', label: 'Weights from percentages' }, { value: 'weights', label: 'Percentages from weights' }]} /><Field label="Total flour weight" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} />{state.bakerMode === 'weights' ? <><Field label="Water weight" value={state.bpWater} set={(v) => set('bpWater', v)} unit="g" step={10} /><Field label="Starter weight" value={state.bpStarter} set={(v) => set('bpStarter', v)} unit="g" step={10} /><Field label="Salt weight" value={state.bpSalt} set={(v) => set('bpSalt', v)} unit="g" step={1} /></> : <><Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" /><Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" /><Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} /><Field label="Oil" value={state.oil} set={(v) => set('oil', v)} unit="%" step={0.5} /><Field label="Sugar" value={state.sugar} set={(v) => set('sugar', v)} unit="%" step={0.5} /></>}</>}
        {calculatorType === 'sourdough-hydration' && <><Field label="Main flour" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} /><Field label="Added water" value={state.water} set={(v) => set('water', v)} unit="g" step={10} /><Field label="Starter weight" value={state.starter} set={(v) => set('starter', v)} unit="g" step={10} /><Field label="Starter hydration" value={state.sh} set={(v) => set('sh', v)} unit="%" /><Field label="Salt weight" value={state.saltg} set={(v) => set('saltg', v)} unit="g" /></>}
        {calculatorType === 'starter-feeding' && <><Field label="Target starter" value={state.target} set={(v) => set('target', v)} unit="g" step={10} /><Field label="Seed part" value={state.seed} set={(v) => set('seed', v)} unit="part" step={0.5} min={0.1} /><Field label="Flour part" value={state.flourpart} set={(v) => set('flourpart', v)} unit="part" step={0.5} min={0.1} /><Field label="Water part" value={state.waterpart} set={(v) => set('waterpart', v)} unit="part" step={0.5} min={0.1} /><Field label="Extra starter" value={state.extra} set={(v) => set('extra', v)} unit="g" step={5} /></>}
        {calculatorType === 'pizza-dough' && <><SelectField label="Leavening" value={state.lev} set={(v) => set('lev', v)} options={[{ value: 'yeast', label: 'Yeast' }, { value: 'sourdough', label: 'Sourdough starter' }]} /><Field label="Pizza count" value={state.count} set={(v) => set('count', v)} unit="pizzas" min={1} /><Field label="Ball weight" value={state.ball} set={(v) => set('ball', v)} unit="g" step={10} /><Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" /><Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} />{state.lev === 'yeast' ? <Field label="Yeast" value={state.yeast} set={(v) => set('yeast', v)} unit="%" step={0.1} /> : <><Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" /><Field label="Starter hydration" value={state.sh} set={(v) => set('sh', v)} unit="%" /></>}</>}
        {calculatorType === 'dough-scaling' && <><SelectField label="Calculation mode" value={state.mode} set={(v) => set('mode', v)} options={[{ value: 'target', label: 'Target dough weight' }, { value: 'flour', label: 'Known flour weight' }]} />{state.mode === 'target' ? <Field label="Target dough" value={state.target} set={(v) => set('target', v)} unit="g" step={50} /> : <Field label="Flour weight" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} />}<Field label="Loaf count" value={state.loaves} set={(v) => set('loaves', v)} unit="loaves" min={1} /><Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" /><Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" /><Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} /></>}
      </div>
      {calculatorType === 'starter-feeding' && <StarterPresets set={set} />}
      {computed.error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert"><b>Calculation cannot run with the current inputs.</b><p className="mt-2">{computed.error}</p><button className="mt-3 rounded-xl border bg-white px-4 py-2" onClick={reset}>Reset inputs</button></div>}
      {result && <div className="mt-6 space-y-5 print-card"><div className="grid gap-3 sm:grid-cols-3"><b className="rounded-2xl border bg-white p-4">Total {formatWeight(total, state.unit)}</b>{result.totalHydrationPct ? <b className="rounded-2xl border bg-white p-4">Total hydration {pct(result.totalHydrationPct)}</b> : null}{result.totalFormulaPct ? <b className="rounded-2xl border bg-white p-4">Total formula {pct(result.totalFormulaPct)}</b> : null}</div>{result.seedStarterGrams !== undefined ? <div className="grid gap-3 sm:grid-cols-3"><b className="rounded-2xl border bg-white p-4">Seed {formatWeight(result.seedStarterGrams, state.unit)}</b><b className="rounded-2xl border bg-white p-4">Flour {formatWeight(result.feedingFlourGrams ?? 0, state.unit)}</b><b className="rounded-2xl border bg-white p-4">Water {formatWeight(result.feedingWaterGrams ?? 0, state.unit)}</b></div> : null}<ResultTable title="Ingredient weights" items={items} unit={state.unit} />{result.perUnit ? <ResultTable title="Per loaf / per ball" items={result.perUnit} unit={state.unit} /> : null}<WarningList items={result.warnings ?? []} slug={slug} /><CopyButtons text={copyText} slug={slug} reset={reset} /></div>}
    </section>
  );
}
