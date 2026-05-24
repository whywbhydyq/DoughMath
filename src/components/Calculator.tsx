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

function mergedDefaults(defaultInputs?: DefaultInputs): State {
  return { ...baseDefaults, ...defaultInputs } as State;
}

function readNumber(params: URLSearchParams, key: keyof State, fallback: number) {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function readUnit(params: URLSearchParams, fallback: WeightUnit): WeightUnit {
  const unit = params.get('unit');
  return unit === 'oz' || unit === 'lb' || unit === 'g' ? unit : fallback;
}

function readBakerMode(params: URLSearchParams, fallback: 'percentages' | 'weights') {
  const value = params.get('bakerMode');
  return value === 'weights' || value === 'percentages' ? value : fallback;
}

function Field(props: { label: string; value: number; set: (next: number) => void; unit: string; step?: number; min?: number; helper?: string }) {
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

function ResultTable({ items, title, unit }: { items: Ingredient[]; title: string; unit: WeightUnit }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <h2 className="bg-stone-50 px-4 py-3 font-semibold">{title}</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr><th className="p-3">Ingredient</th><th className="p-3 text-right">Weight</th><th className="p-3 text-right">Baker's %</th><th className="p-3">Notes</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-t" key={item.name}>
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3 text-right tabular-nums">{formatWeight(item.weightGrams, unit)}</td>
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
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm"><b>Checks and notes</b><ul className="mt-2 space-y-1">{items.map((warning) => <li key={warning.code}>• {warning.message}</li>)}</ul></div>;
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
  const presets = [['1:1:1', 1, 1, 1], ['1:2:2', 1, 2, 2], ['1:3:3', 1, 3, 3], ['1:5:5', 1, 5, 5]] as const;
  return <div className="no-print flex flex-wrap gap-2">{presets.map(([label, seed, flour, water]) => <button key={label} type="button" className="rounded-full border bg-white px-3 py-1 text-sm" onClick={() => { set('seed', seed); set('flourpart', flour); set('waterpart', water); }}>{label}</button>)}</div>;
}

function useCalculatorState(slug: string, defaultInputs?: DefaultInputs) {
  const params = useSearchParams();
  const defaults = mergedDefaults(defaultInputs);
  const [state, setState] = useState<State>(() => ({
    ...defaults,
    bakerMode: readBakerMode(params, defaults.bakerMode),
    flour: readNumber(params, 'flour', defaults.flour),
    hyd: readNumber(params, 'hyd', defaults.hyd),
    starter: readNumber(params, 'starter', defaults.starter),
    salt: readNumber(params, 'salt', defaults.salt),
    water: readNumber(params, 'water', defaults.water),
    sh: readNumber(params, 'sh', defaults.sh),
    saltg: readNumber(params, 'saltg', defaults.saltg),
    bpWater: readNumber(params, 'bpWater', defaults.bpWater),
    bpStarter: readNumber(params, 'bpStarter', defaults.bpStarter),
    bpSalt: readNumber(params, 'bpSalt', defaults.bpSalt),
    bpOil: readNumber(params, 'bpOil', defaults.bpOil),
    bpSugar: readNumber(params, 'bpSugar', defaults.bpSugar),
    target: readNumber(params, 'target', defaults.target),
    loaves: readNumber(params, 'loaves', defaults.loaves),
    count: readNumber(params, 'count', defaults.count),
    ball: readNumber(params, 'ball', defaults.ball),
    oil: readNumber(params, 'oil', defaults.oil),
    sugar: readNumber(params, 'sugar', defaults.sugar),
    yeast: readNumber(params, 'yeast', defaults.yeast),
    seed: readNumber(params, 'seed', defaults.seed),
    flourpart: readNumber(params, 'flourpart', defaults.flourpart),
    waterpart: readNumber(params, 'waterpart', defaults.waterpart),
    extra: readNumber(params, 'extra', defaults.extra),
    mode: params.get('mode') === 'flour' || params.get('mode') === 'target' ? (params.get('mode') as 'target' | 'flour') : defaults.mode,
    lev: params.get('lev') === 'sourdough' || params.get('lev') === 'yeast' ? (params.get('lev') as 'yeast' | 'sourdough') : defaults.lev,
    unit: readUnit(params, defaults.unit)
  }));

  useEffect(() => { trackCalculatorEvent('calculator_view', slug); }, [slug]);
  useEffect(() => { const url = new URL(location.href); Object.entries(state).forEach(([key, value]) => url.searchParams.set(key, String(value))); history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`); }, [state]);
  const set = (key: keyof State, value: number | string) => setState((current) => ({ ...current, [key]: value }));
  return { state, set };
}

export default function Calculator({ slug, defaultInputs }: { slug: string; defaultInputs?: DefaultInputs }) {
  const { state, set } = useCalculatorState(slug, defaultInputs);
  const result = useMemo(() => {
    if (slug === 'bakers-percentage-calculator') {
      return state.bakerMode === 'weights'
        ? calculateBakersPercentagesFromWeights({ flourWeightGrams: state.flour, waterWeightGrams: state.bpWater, starterWeightGrams: state.bpStarter, saltWeightGrams: state.bpSalt, oilWeightGrams: state.bpOil, sugarWeightGrams: state.bpSugar })
        : calculateBakersPercentage({ flourWeightGrams: state.flour, hydrationPct: state.hyd, starterPct: state.starter, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar });
    }
    if (slug === 'sourdough-hydration-calculator') return calculateSourdoughHydration({ mainFlourGrams: state.flour, addedWaterGrams: state.water, starterWeightGrams: state.starter, starterHydrationPct: state.sh, saltWeightGrams: state.saltg });
    if (slug === 'starter-feeding-calculator') return calculateStarterFeeding({ targetStarterWeightGrams: state.target, seedPart: state.seed, flourPart: state.flourpart, waterPart: state.waterpart, extraGrams: state.extra });
    if (slug === 'pizza-dough-calculator') return calculatePizzaDough({ pizzaCount: state.count, ballWeightGrams: state.ball, hydrationPct: state.hyd, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: state.yeast, starterPct: state.starter, starterHydrationPct: state.sh, leaveningType: state.lev });
    return calculateDoughScaling({ mode: state.mode === 'flour' ? 'by-flour-weight' : 'by-target-dough-weight', flourWeightGrams: state.flour, targetDoughWeightGrams: state.target, loafCount: state.loaves, hydrationPct: state.hyd, starterPct: state.starter, starterHydrationPct: state.sh, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar });
  }, [state, slug]);

  const items = result.ingredients as Ingredient[];
  const perUnit = 'perUnit' in result ? (result.perUnit as Ingredient[]) : undefined;
  const total = 'totalDoughWeightGrams' in result ? result.totalDoughWeightGrams : result.totalNeededStarterGrams;
  const hydration = 'totalHydrationPct' in result ? result.totalHydrationPct : undefined;
  const totalFormulaPct = 'totalFormulaPct' in result ? result.totalFormulaPct : undefined;
  const copyText = `${items.map((item) => `${item.name}: ${formatWeight(item.weightGrams, state.unit)}${item.bakerPercentage === undefined ? '' : ` (${pct(item.bakerPercentage)})`}`).join('\n')}\nTotal: ${formatWeight(total, state.unit)}`;

  return (
    <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SelectField label="Display unit" value={state.unit} set={(value) => set('unit', value)} options={[{ value: 'g', label: 'grams' }, { value: 'oz', label: 'ounces' }, { value: 'lb', label: 'pounds' }]} />
        {slug === 'bakers-percentage-calculator' ? <><SelectField label="Baker's math mode" value={state.bakerMode} set={(value) => set('bakerMode', value)} options={[{ value: 'percentages', label: 'Weights from percentages' }, { value: 'weights', label: 'Percentages from weights' }]} /><Field label="Total flour weight" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} />{state.bakerMode === 'weights' ? <><Field label="Water weight" value={state.bpWater} set={(value) => set('bpWater', value)} unit="g" step={10} /><Field label="Starter weight" value={state.bpStarter} set={(value) => set('bpStarter', value)} unit="g" step={10} /><Field label="Salt weight" value={state.bpSalt} set={(value) => set('bpSalt', value)} unit="g" step={1} /><Field label="Oil weight" value={state.bpOil} set={(value) => set('bpOil', value)} unit="g" step={5} /><Field label="Sugar weight" value={state.bpSugar} set={(value) => set('bpSugar', value)} unit="g" step={5} /></> : <><Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" /><Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" /><Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} /><Field label="Oil" value={state.oil} set={(value) => set('oil', value)} unit="%" step={0.5} /><Field label="Sugar" value={state.sugar} set={(value) => set('sugar', value)} unit="%" step={0.5} /></>}</> : null}
        {slug === 'sourdough-hydration-calculator' ? <><Field label="Main flour" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} /><Field label="Added water" value={state.water} set={(value) => set('water', value)} unit="g" step={10} /><Field label="Starter weight" value={state.starter} set={(value) => set('starter', value)} unit="g" step={10} /><Field label="Starter hydration" value={state.sh} set={(value) => set('sh', value)} unit="%" /><Field label="Salt weight" value={state.saltg} set={(value) => set('saltg', value)} unit="g" /></> : null}
        {slug === 'starter-feeding-calculator' ? <><Field label="Target starter" value={state.target} set={(value) => set('target', value)} unit="g" step={10} /><Field label="Seed part" value={state.seed} set={(value) => set('seed', value)} unit="part" step={0.5} /><Field label="Flour part" value={state.flourpart} set={(value) => set('flourpart', value)} unit="part" step={0.5} /><Field label="Water part" value={state.waterpart} set={(value) => set('waterpart', value)} unit="part" step={0.5} /><Field label="Extra starter" value={state.extra} set={(value) => set('extra', value)} unit="g" step={5} helper="Optional retained extra starter." /></> : null}
        {slug === 'pizza-dough-calculator' ? <><SelectField label="Leavening" value={state.lev} set={(value) => set('lev', value)} options={[{ value: 'yeast', label: 'Yeast' }, { value: 'sourdough', label: 'Sourdough starter' }]} /><Field label="Pizza count" value={state.count} set={(value) => set('count', value)} unit="pizzas" /><Field label="Ball weight" value={state.ball} set={(value) => set('ball', value)} unit="g" step={10} /><Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" /><Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} /><Field label="Oil" value={state.oil} set={(value) => set('oil', value)} unit="%" step={0.5} />{state.lev === 'yeast' ? <Field label="Yeast" value={state.yeast} set={(value) => set('yeast', value)} unit="%" step={0.1} /> : <><Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" /><Field label="Starter hydration" value={state.sh} set={(value) => set('sh', value)} unit="%" /></>}</> : null}
        {slug === 'dough-scaling-calculator' ? <><SelectField label="Calculation mode" value={state.mode} set={(value) => set('mode', value)} options={[{ value: 'target', label: 'Target dough weight' }, { value: 'flour', label: 'Known flour weight' }]} />{state.mode === 'target' ? <Field label="Target dough" value={state.target} set={(value) => set('target', value)} unit="g" step={50} /> : <Field label="Flour weight" value={state.flour} set={(value) => set('flour', value)} unit="g" step={10} />}<Field label="Loaf count" value={state.loaves} set={(value) => set('loaves', value)} unit="loaves" /><Field label="Hydration" value={state.hyd} set={(value) => set('hyd', value)} unit="%" /><Field label="Starter" value={state.starter} set={(value) => set('starter', value)} unit="%" /><Field label="Starter hydration" value={state.sh} set={(value) => set('sh', value)} unit="%" /><Field label="Salt" value={state.salt} set={(value) => set('salt', value)} unit="%" step={0.1} /></> : null}
      </div>
      {slug === 'starter-feeding-calculator' ? <div className="mt-4"><Presets set={set} /></div> : null}
      <div className="mt-6 space-y-5 print-card">
        <div className="grid gap-3 sm:grid-cols-3"><b className="rounded-2xl border bg-white p-4">Total {formatWeight(total, state.unit)}</b>{hydration ? <b className="rounded-2xl border bg-white p-4">Total hydration {pct(hydration)}</b> : null}{totalFormulaPct ? <b className="rounded-2xl border bg-white p-4">Total formula {pct(totalFormulaPct)}</b> : null}</div>
        <ResultTable title="Ingredient weights" items={items} unit={state.unit} />
        {perUnit ? <ResultTable title="Per loaf / per ball" items={perUnit} unit={state.unit} /> : null}
        <WarningList items={result.warnings ?? []} />
        <Actions text={copyText} slug={slug} />
      </div>
    </section>
  );
}
