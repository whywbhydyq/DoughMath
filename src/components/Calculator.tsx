'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { copyText } from '@/lib/clipboard';
import { readCustomQueryParam, setCalculatorUrlState } from '@/lib/urlState';
import { PrintableRecipeCard } from '@/components/result/PrintableRecipeCard';
import { formatWeight, fromGrams, toGrams, type WeightUnit } from '@/lib/units';
import type { CalculatorResult, CalculatorType, CustomIngredientInput, FlourBlendItem } from '@/types/baking';
import type { ResultMicrocopy } from '@/types/content';

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
  bpOther: number;
  target: number;
  perLoaf: number;
  loaves: number;
  count: number;
  ball: number;
  oil: number;
  sugar: number;
  yeast: number;
  otherPct: number;
  seed: number;
  flourpart: number;
  waterpart: number;
  extra: number;
  mode: 'target' | 'per-loaf' | 'flour';
  lev: 'yeast' | 'sourdough';
  unit: WeightUnit;
  breadPct: number;
  wholePct: number;
  ryePct: number;
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
  bpOther: 0,
  target: 1500,
  perLoaf: 750,
  loaves: 2,
  count: 3,
  ball: 280,
  oil: 0,
  sugar: 0,
  yeast: 0.2,
  otherPct: 0,
  seed: 1,
  flourpart: 2,
  waterpart: 2,
  extra: 0,
  mode: 'target',
  lev: 'yeast',
  unit: 'g',
  breadPct: 100,
  wholePct: 0,
  ryePct: 0
};

const numberKeys: (keyof State)[] = [
  'flour', 'hyd', 'starter', 'salt', 'water', 'sh', 'saltg', 'bpWater', 'bpStarter',
  'bpSalt', 'bpOil', 'bpSugar', 'bpOther', 'target', 'perLoaf', 'loaves', 'count', 'ball', 'oil', 'sugar',
  'yeast', 'otherPct', 'seed', 'flourpart', 'waterpart', 'extra', 'breadPct', 'wholePct', 'ryePct'
];

const weightKeys = new Set<keyof State>(['flour', 'water', 'saltg', 'bpWater', 'bpStarter', 'bpSalt', 'bpOil', 'bpSugar', 'bpOther', 'target', 'perLoaf', 'ball', 'extra']);

type CustomIngredientForm = CustomIngredientInput & { id: string; lockMode: 'percentage' | 'weight'; percentage: number; weightGrams: number };

function sanitizeCustomIngredient(input: Partial<CustomIngredientInput> & { id?: string }, index: number): CustomIngredientForm {
  const lockMode = input.lockMode === 'weight' ? 'weight' : 'percentage';
  return {
    id: input.id || `custom-${Date.now()}-${index}`,
    name: typeof input.name === 'string' && input.name.trim() ? input.name : `Custom ingredient ${index + 1}`,
    lockMode,
    percentage: Number.isFinite(input.percentage ?? 0) ? Math.max(0, input.percentage ?? 0) : 0,
    weightGrams: Number.isFinite(input.weightGrams ?? 0) ? Math.max(0, input.weightGrams ?? 0) : 0
  };
}

function readCustomIngredients(params: URLSearchParams): CustomIngredientForm[] {
  const raw = readCustomQueryParam(params);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 8).map((item, index) => sanitizeCustomIngredient(item, index));
  } catch {
    return [];
  }
}

function serializeCustomIngredients(rows: CustomIngredientForm[]) {
  const payload = rows
    .map((row) => ({
      name: row.name,
      lockMode: row.lockMode,
      percentage: row.lockMode === 'percentage' ? row.percentage : undefined,
      weightGrams: row.lockMode === 'weight' ? row.weightGrams : undefined
    }))
    .filter((row) => row.lockMode === 'percentage' ? (row.percentage ?? 0) > 0 : (row.weightGrams ?? 0) > 0);
  return payload.length ? JSON.stringify(payload) : '';
}

function activeCustomIngredients(rows: CustomIngredientForm[]): CustomIngredientInput[] {
  return rows
    .map((row) => ({
      name: row.name,
      lockMode: row.lockMode,
      percentage: row.lockMode === 'percentage' ? row.percentage : undefined,
      weightGrams: row.lockMode === 'weight' ? row.weightGrams : undefined
    }))
    .filter((row) => row.lockMode === 'percentage' ? (row.percentage ?? 0) > 0 : (row.weightGrams ?? 0) > 0);
}


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
  state.mode = mode === 'flour' || mode === 'target' || mode === 'per-loaf' ? mode : defaults.mode;
  state.lev = lev === 'sourdough' || lev === 'yeast' ? lev : defaults.lev;
  state.unit = readUnit(params, defaults.unit);
  return state;
}

function flourBlendFromState(state: State): FlourBlendItem[] {
  return [
    { name: 'Bread flour', percent: state.breadPct },
    { name: 'Whole wheat flour', percent: state.wholePct },
    { name: 'Rye flour', percent: state.ryePct }
  ];
}

function Field(props: {
  label: string;
  value: number;
  set: (next: number) => void;
  unit: string;
  step?: number;
  min?: number;
  helper?: string;
  isWeight?: boolean;
  displayUnit?: WeightUnit;
}) {
  const step = props.step ?? 1;
  const min = props.min ?? 0;
  const displayValue = props.isWeight && props.displayUnit ? fromGrams(props.value, props.displayUnit) : props.value;
  const displayStep = props.isWeight && props.displayUnit ? fromGrams(step, props.displayUnit) : step;
  const shownUnit = props.isWeight && props.displayUnit ? props.displayUnit : props.unit;
  const commitDisplay = (displayNext: number) => {
    const canonical = props.isWeight && props.displayUnit ? toGrams(displayNext, props.displayUnit) : displayNext;
    props.set(Number.isFinite(canonical) ? Math.max(min, canonical) : props.value);
  };
  const nudge = (deltaGramsOrValue: number) => props.set(Math.max(min, props.value + deltaGramsOrValue));
  return (
    <label className="group rounded-2xl border border-amber-200/70 bg-white/95 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover focus-within:ring-2 focus-within:ring-dough-500/30">
      <span className="text-sm font-semibold text-stone-900">{props.label}</span>
      <span className="mt-2 flex min-h-12 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
        <button className="min-h-12 w-12 bg-white text-lg font-semibold text-dough-800 transition hover:bg-amber-50" onClick={() => nudge(-step)} type="button" aria-label={`Decrease ${props.label}`}>−</button>
        <input className="min-h-12 w-full bg-white px-3 text-base tabular-nums outline-none" inputMode="decimal" type="number" value={roundForInput(displayValue)} min={props.isWeight && props.displayUnit ? fromGrams(min, props.displayUnit) : min} step={displayStep} onChange={(event) => commitDisplay(Number(event.target.value))} aria-label={props.label} />
        <span className="flex min-w-14 items-center justify-center border-l border-stone-200 bg-stone-50 px-2 text-sm font-medium text-stone-500">{shownUnit}</span>
        <button className="min-h-12 w-12 border-l border-stone-200 bg-white text-lg font-semibold text-dough-800 transition hover:bg-amber-50" onClick={() => nudge(step)} type="button" aria-label={`Increase ${props.label}`}>+</button>
      </span>
      {props.helper ? <span className="mt-2 block text-xs leading-relaxed text-stone-500">{props.helper}</span> : null}
    </label>
  );
}

function roundForInput(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (Math.abs(value) >= 100) return Math.round(value * 10) / 10;
  return Math.round(value * 1000) / 1000;
}

function SelectField(props: { label: string; value: string; set: (next: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="rounded-2xl border border-amber-200/70 bg-white/95 p-4 shadow-soft focus-within:ring-2 focus-within:ring-dough-500/30">
      <span className="text-sm font-semibold text-stone-900">{props.label}</span>
      <select className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base outline-none" value={props.value} onChange={(event) => props.set(event.target.value)} aria-label={props.label}>
        {props.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'success' | 'warning' }) {
  const toneClass = tone === 'success' ? 'bg-emerald-50 text-emerald-950 border-emerald-200' : tone === 'warning' ? 'bg-amber-50 text-amber-950 border-amber-200' : 'bg-white text-stone-950 border-amber-200/70';
  return <div className={`rounded-2xl border p-4 shadow-soft ${toneClass}`}><p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{value}</p></div>;
}

function IngredientCards({ items, title, unit, caption }: { items: Ingredient[]; title: string; unit: WeightUnit; caption?: string }) {
  if (!items.length) return null;
  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-soft">
      <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-5 py-4">
        <h2 className="text-lg font-bold text-stone-950">{title}</h2>
        {caption ? <p className="mt-1 text-sm text-stone-600">{caption}</p> : null}
      </div>
      <div className="divide-y divide-stone-100">
        {items.map((item) => (
          <div className="grid grid-cols-[1fr_auto] gap-3 px-5 py-3 sm:grid-cols-[1fr_auto_auto]" key={`${title}-${item.name}-${item.note ?? ''}`}>
            <div>
              <p className="font-semibold text-stone-950">{item.name}</p>
              {item.note ? <p className="text-xs text-stone-500">{item.note}</p> : null}
            </div>
            <p className="text-right text-lg font-bold tabular-nums text-dough-900">{formatWeight(item.weightGrams, unit)}</p>
            <p className="hidden text-right text-sm tabular-nums text-stone-500 sm:block">{item.bakerPercentage === undefined ? '—' : pct(item.bakerPercentage)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormulaTotalsCard({ result, unit, caption }: { result: CalculatorResult; unit: WeightUnit; caption?: string }) {
  const totals = result.formulaTotals;
  if (!totals) return null;
  const rows = [
    totals.totalFlourGrams !== undefined ? ['Total flour', formatWeight(totals.totalFlourGrams, unit)] : undefined,
    totals.totalWaterGrams !== undefined ? ['Total water', formatWeight(totals.totalWaterGrams, unit)] : undefined,
    totals.totalHydrationPct !== undefined ? ['Total hydration', pct(totals.totalHydrationPct)] : undefined,
    totals.addedHydrationPct !== undefined ? ['Added hydration', pct(totals.addedHydrationPct)] : undefined,
    totals.saltPct !== undefined ? ['Salt percentage', pct(totals.saltPct)] : undefined,
    totals.totalFormulaPct !== undefined ? ['Total formula', pct(totals.totalFormulaPct)] : undefined,
    ['Total dough', formatWeight(totals.totalDoughWeightGrams, unit)]
  ].filter(Boolean) as [string, string][];
  return (
    <section className="rounded-3xl border border-dough-200 bg-result p-5 shadow-soft">
      <h2 className="text-lg font-bold text-stone-950">Formula totals</h2>
      {caption ? <p className="mt-1 text-sm leading-6 text-stone-700">{caption}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => <div className="rounded-2xl bg-white/85 p-3" key={label}><p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-1 text-xl font-bold tabular-nums text-stone-950">{value}</p></div>)}
      </div>
    </section>
  );
}

function StarterSplitCard({ result, unit, caption }: { result: CalculatorResult; unit: WeightUnit; caption?: string }) {
  const starter = result.starterSplit;
  if (!starter || starter.starterWeightGrams <= 0) return null;
  return (
    <section className="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-soft">
      <h2 className="text-lg font-bold text-sky-950">Starter split</h2>
      <p className="mt-1 text-sm text-sky-800">{caption ?? 'Starter is split into its internal flour and water for total hydration. Do not add these twice.'}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Starter" value={formatWeight(starter.starterWeightGrams, unit)} />
        <Metric label="Starter flour" value={formatWeight(starter.flourGrams, unit)} />
        <Metric label="Starter water" value={formatWeight(starter.waterGrams, unit)} />
      </div>
    </section>
  );
}

function WarningList({ items, slug }: { items: Warn[]; slug: string }) {
  const seenWarnings = useRef<Set<string>>(new Set());
  useEffect(() => {
    seenWarnings.current.clear();
  }, [slug]);
  useEffect(() => {
    items.forEach((warning) => {
      const key = `${slug}:${warning.code}`;
      if (seenWarnings.current.has(key)) return;
      seenWarnings.current.add(key);
      trackCalculatorEvent('warning_shown', slug, { warning_code: warning.code });
    });
  }, [items, slug]);
  if (!items.length) return null;
  return (
    <div className="rounded-3xl border border-amber-300 bg-warning p-5 text-sm text-amber-950 shadow-soft" role="status">
      <b>Checks and notes</b>
      <ul className="mt-2 space-y-2">{items.map((warning) => <li key={warning.code}>• {warning.message}</li>)}</ul>
    </div>
  );
}

function useCalculatorState(slug: string, defaultInputs?: DefaultInputs) {
  const params = useSearchParams();
  const defaults = useMemo(() => mergedDefaults(defaultInputs), [defaultInputs]);
  const [state, setState] = useState<State>(() => readState(params, defaults));
  useEffect(() => { trackCalculatorEvent('calculator_view', slug); }, [slug]);
  const set = (key: keyof State, value: number | string) => setState((current) => {
    trackCalculatorEvent('calculator_input_changed', slug, { field: String(key) });
    return { ...current, [key]: value };
  });
  const reset = () => setState(defaults);
  const setUnit = (value: string) => setState((current) => {
    const unit = value === 'oz' || value === 'lb' || value === 'g' ? value : current.unit;
    if (unit !== current.unit) trackCalculatorEvent('unit_changed', slug, { unit });
    return { ...current, unit };
  });
  return { state, defaults, set, setUnit, reset };
}

function compute(calculatorType: CalculatorType, state: State, customIngredients: CustomIngredientInput[]) {
  const flourBlend = flourBlendFromState(state);
  if (calculatorType === 'bakers-percentage') {
    return state.bakerMode === 'weights'
      ? calculateBakersPercentagesFromWeights({ flourWeightGrams: state.flour, waterWeightGrams: state.bpWater, starterWeightGrams: state.bpStarter, saltWeightGrams: state.bpSalt, oilWeightGrams: state.bpOil, sugarWeightGrams: state.bpSugar, customIngredients, flourBlend })
      : calculateBakersPercentage({ flourWeightGrams: state.flour, hydrationPct: state.hyd, starterPct: state.starter, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, customIngredients, flourBlend });
  }
  if (calculatorType === 'sourdough-hydration') return calculateSourdoughHydration({ mainFlourGrams: state.flour, addedWaterGrams: state.water, starterWeightGrams: state.starter, starterHydrationPct: state.sh, saltWeightGrams: state.saltg, flourBlend });
  if (calculatorType === 'starter-feeding') return calculateStarterFeeding({ targetStarterWeightGrams: state.target, seedPart: state.seed, flourPart: state.flourpart, waterPart: state.waterpart, extraGrams: state.extra });
  if (calculatorType === 'pizza-dough') return calculatePizzaDough({ pizzaCount: state.count, ballWeightGrams: state.ball, hydrationPct: state.hyd, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: state.yeast, starterPct: state.starter, starterHydrationPct: state.sh, leaveningType: state.lev, flourBlend });
  return calculateDoughScaling({ mode: state.mode === 'flour' ? 'by-flour-weight' : 'by-target-dough-weight', flourWeightGrams: state.flour, targetDoughWeightGrams: state.mode === 'per-loaf' ? state.perLoaf * state.loaves : state.target, loafCount: state.loaves, hydrationPct: state.hyd, starterPct: state.starter, starterHydrationPct: state.sh, saltPct: state.salt, oilPct: state.oil, sugarPct: state.sugar, yeastPct: 0, flourBlend });
}

function StarterPresets({ set, slug }: { set: (key: keyof State, value: number | string) => void; slug: string }) {
  const presets = [['1:1:1', 1, 1, 1], ['1:2:2', 1, 2, 2], ['1:3:3', 1, 3, 3], ['1:5:5', 1, 5, 5], ['1:10:10', 1, 10, 10]] as const;
  return <div className="no-print mt-4 flex flex-wrap gap-2">{presets.map(([label, seed, flour, water]) => <button key={label} type="button" className="min-h-11 rounded-full border border-dough-200 bg-white px-4 py-2 text-sm font-semibold text-dough-900 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-dough-500/30" onClick={() => { trackCalculatorEvent('preset_clicked', slug, { preset: label }); set('seed', seed); set('flourpart', flour); set('waterpart', water); }}>{label}</button>)}</div>;
}

function CopyButtons({ text, slug, reset }: { text: string; slug: string; reset: () => void }) {
  const [status, setStatus] = useState('');
  const trackResultUse = (action: 'copy' | 'print' | 'share') => {
    trackCalculatorEvent('calculator_result_used', slug, { action });
  };
  return (
    <div className="no-print flex flex-wrap gap-3 rounded-3xl border border-amber-200/70 bg-white/90 p-4 shadow-soft">
      <button className="min-h-11 rounded-xl bg-dough-900 px-5 py-2 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover" onClick={async () => { const copied = await copyText(text); if (copied) { trackCalculatorEvent('copy_result_clicked', slug); trackResultUse('copy'); setStatus('Result copied.'); } else { setStatus('Copy failed. Select and copy the result manually.'); } }}>Copy result</button>
      <button className="min-h-11 rounded-xl border border-dough-200 bg-white px-5 py-2 font-semibold text-dough-900 transition hover:bg-amber-50" onClick={() => { trackCalculatorEvent('print_clicked', slug); trackResultUse('print'); window.print(); }}>Print recipe card</button>
      <button className="min-h-11 rounded-xl border border-dough-200 bg-white px-5 py-2 font-semibold text-dough-900 transition hover:bg-amber-50" onClick={async () => { const copied = await copyText(location.href); if (copied) { trackCalculatorEvent('share_url_copied', slug); trackResultUse('share'); setStatus('Share URL copied.'); } else { setStatus('Copy failed. Select and copy the URL manually.'); } }}>Copy share URL</button>
      <button className="min-h-11 rounded-xl border border-red-200 bg-red-50 px-5 py-2 font-semibold text-red-800 transition hover:bg-red-100" onClick={() => { reset(); setStatus('Inputs reset.'); }}>Reset</button>
      <span className="self-center text-sm font-medium text-stone-500" role="status">{status}</span>
    </div>
  );
}

function buildCopyText(result: CalculatorResult, unit: WeightUnit) {
  const lines: string[] = [];
  const append = (title: string, items: Ingredient[]) => {
    if (!items.length) return;
    lines.push(title);
    items.forEach((item) => lines.push(`${item.name}: ${formatWeight(item.weightGrams, unit)}${item.bakerPercentage === undefined ? '' : ` (${pct(item.bakerPercentage)})`}`));
    lines.push('');
  };
  append('Add to bowl', result.addToBowl ?? result.ingredients);
  append('Formula flour blend', result.flourBlend ?? []);
  if (result.formulaTotals) {
    lines.push('Formula totals');
    if (result.formulaTotals.totalFlourGrams !== undefined) lines.push(`Total flour: ${formatWeight(result.formulaTotals.totalFlourGrams, unit)}`);
    if (result.formulaTotals.totalWaterGrams !== undefined) lines.push(`Total water: ${formatWeight(result.formulaTotals.totalWaterGrams, unit)}`);
    if (result.formulaTotals.totalHydrationPct !== undefined) lines.push(`Total hydration: ${pct(result.formulaTotals.totalHydrationPct)}`);
    if (result.formulaTotals.saltPct !== undefined) lines.push(`Salt: ${pct(result.formulaTotals.saltPct)}`);
    lines.push(`Total dough: ${formatWeight(result.formulaTotals.totalDoughWeightGrams, unit)}`);
    lines.push('');
  }
  if (result.starterSplit && result.starterSplit.starterWeightGrams > 0) {
    lines.push('Starter split');
    lines.push(`Starter flour: ${formatWeight(result.starterSplit.flourGrams, unit)}`);
    lines.push(`Starter water: ${formatWeight(result.starterSplit.waterGrams, unit)}`);
  }
  return lines.join('\n').trim();
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part === 'and' ? 'and' : part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace('Bakers', "Baker's");
}

function unitLabel(unit: WeightUnit) {
  if (unit === 'g') return 'grams';
  if (unit === 'oz') return 'ounces';
  return 'pounds';
}

function buildInputSummary(calculatorType: CalculatorType, state: State, customIngredients: CustomIngredientForm[]) {
  const lines = [`Display unit: ${unitLabel(state.unit)}`];
  const weight = (value: number) => formatWeight(value, state.unit);
  const blend = `Flour blend: bread ${pct(state.breadPct)}, whole wheat ${pct(state.wholePct)}, rye ${pct(state.ryePct)}`;
  if (calculatorType === 'bakers-percentage') {
    lines.push(`Mode: ${state.bakerMode === 'weights' ? 'percentages from weights' : 'weights from percentages'}`);
    lines.push(`Total flour: ${weight(state.flour)}`);
    if (state.bakerMode === 'weights') {
      lines.push(`Water: ${weight(state.bpWater)}`);
      lines.push(`Starter: ${weight(state.bpStarter)}`);
      lines.push(`Salt: ${weight(state.bpSalt)}`);
      if (state.bpOil > 0) lines.push(`Oil: ${weight(state.bpOil)}`);
      if (state.bpSugar > 0) lines.push(`Sugar: ${weight(state.bpSugar)}`);
    } else {
      lines.push(`Hydration: ${pct(state.hyd)}`);
      lines.push(`Starter: ${pct(state.starter)}`);
      lines.push(`Salt: ${pct(state.salt)}`);
      if (state.oil > 0) lines.push(`Oil: ${pct(state.oil)}`);
      if (state.sugar > 0) lines.push(`Sugar: ${pct(state.sugar)}`);
    }
  } else if (calculatorType === 'sourdough-hydration') {
    lines.push(`Main flour: ${weight(state.flour)}`);
    lines.push(`Added water: ${weight(state.water)}`);
    lines.push(`Starter: ${weight(state.starter)}`);
    lines.push(`Starter hydration: ${pct(state.sh)}`);
    lines.push(`Salt: ${weight(state.saltg)}`);
  } else if (calculatorType === 'starter-feeding') {
    lines.push(`Starter needed for recipe: ${weight(state.target)}`);
    lines.push(`Extra starter to keep: ${weight(state.extra)}`);
    lines.push(`Feeding ratio: ${state.seed}:${state.flourpart}:${state.waterpart}`);
  } else if (calculatorType === 'pizza-dough') {
    lines.push(`Leavening: ${state.lev}`);
    lines.push(`Pizza count: ${state.count}`);
    lines.push(`Dough ball weight: ${weight(state.ball)}`);
    lines.push(`Hydration: ${pct(state.hyd)}`);
    lines.push(`Salt: ${pct(state.salt)}`);
    if (state.lev === 'yeast') lines.push(`Yeast: ${pct(state.yeast)}`);
    else {
      lines.push(`Starter: ${pct(state.starter)}`);
      lines.push(`Starter hydration: ${pct(state.sh)}`);
    }
    if (state.oil > 0) lines.push(`Oil: ${pct(state.oil)}`);
    if (state.sugar > 0) lines.push(`Sugar: ${pct(state.sugar)}`);
  } else {
    lines.push(`Mode: ${state.mode === 'per-loaf' ? 'weight per loaf × loaf count' : state.mode === 'flour' ? 'known total flour weight' : 'target total dough weight'}`);
    if (state.mode === 'target') lines.push(`Target total dough: ${weight(state.target)}`);
    if (state.mode === 'per-loaf') lines.push(`Target weight per loaf: ${weight(state.perLoaf)}`);
    if (state.mode === 'flour') lines.push(`Total flour weight: ${weight(state.flour)}`);
    lines.push(`Loaf count: ${state.loaves}`);
    lines.push(`Hydration: ${pct(state.hyd)}`);
    lines.push(`Starter: ${pct(state.starter)}`);
    lines.push(`Starter hydration: ${pct(state.sh)}`);
    lines.push(`Salt: ${pct(state.salt)}`);
    if (state.oil > 0) lines.push(`Oil: ${pct(state.oil)}`);
    if (state.sugar > 0) lines.push(`Sugar: ${pct(state.sugar)}`);
  }
  if (calculatorType !== 'starter-feeding') lines.push(blend);
  customIngredients.forEach((row) => {
    if (row.lockMode === 'weight' && row.weightGrams > 0) lines.push(`Custom ingredient: ${row.name}, ${weight(row.weightGrams)} locked weight`);
    if (row.lockMode === 'percentage' && row.percentage > 0) lines.push(`Custom ingredient: ${row.name}, ${pct(row.percentage)} locked percentage`);
  });
  return lines;
}

function FlourBlendFields({ state, set }: { state: State; set: (key: keyof State, value: number | string) => void }) {
  const total = state.breadPct + state.wholePct + state.ryePct;
  return (
    <div className="rounded-3xl border border-amber-200/70 bg-white/75 p-4 shadow-soft lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-stone-950">Flour blend</h3>
          <p className="text-xs text-stone-500">The three flour percentages must add up to 100%.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${Math.abs(total - 100) <= 0.05 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>Total {pct(total)}</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Bread flour" value={state.breadPct} set={(v) => set('breadPct', v)} unit="%" step={5} />
        <Field label="Whole wheat" value={state.wholePct} set={(v) => set('wholePct', v)} unit="%" step={5} />
        <Field label="Rye" value={state.ryePct} set={(v) => set('ryePct', v)} unit="%" step={5} />
      </div>
    </div>
  );
}

function CustomIngredientsEditor({
  rows,
  setRows,
  unit,
  slug
}: {
  rows: CustomIngredientForm[];
  setRows: (updater: (rows: CustomIngredientForm[]) => CustomIngredientForm[]) => void;
  unit: WeightUnit;
  slug: string;
}) {
  const updateRow = (id: string, patch: Partial<CustomIngredientForm>) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
    trackCalculatorEvent('calculator_input_changed', slug, { field: 'custom_ingredient' });
  };
  const addRow = () => {
    setRows((current) => [...current, sanitizeCustomIngredient({ name: `Custom ingredient ${current.length + 1}`, lockMode: 'percentage', percentage: 0, weightGrams: 0 }, current.length)]);
    trackCalculatorEvent('calculator_input_changed', slug, { field: 'custom_ingredient_add' });
  };
  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    trackCalculatorEvent('calculator_input_changed', slug, { field: 'custom_ingredient_remove' });
  };
  return (
    <div className="rounded-3xl border border-amber-200/70 bg-white/75 p-4 shadow-soft lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-950">Custom ingredients</h3>
          <p className="text-xs text-stone-500">Add oil alternatives, seeds, honey, malt, inclusions, or other formula lines. Lock each line by baker’s percentage or exact weight.</p>
        </div>
        <button type="button" className="min-h-11 rounded-xl bg-dough-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover" onClick={addRow}>Add ingredient</button>
      </div>
      {rows.length ? (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-stone-200 bg-white p-3">
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_1fr_auto]">
                <label className="block">
                  <span className="text-xs font-bold text-stone-700">Ingredient name</span>
                  <input className="mt-1 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base outline-none focus:ring-2 focus:ring-dough-500/30" value={row.name} onChange={(event) => updateRow(row.id, { name: event.target.value })} aria-label="Custom ingredient name" />
                </label>
                <SelectField label="Lock mode" value={row.lockMode} set={(value) => updateRow(row.id, { lockMode: value === 'weight' ? 'weight' : 'percentage' })} options={[{ value: 'percentage', label: 'Lock %' }, { value: 'weight', label: 'Lock weight' }]} />
                {row.lockMode === 'weight' ? (
                  <Field label="Weight" value={row.weightGrams} set={(value) => updateRow(row.id, { weightGrams: value })} unit="g" step={10} isWeight displayUnit={unit} />
                ) : (
                  <Field label="Baker’s %" value={row.percentage} set={(value) => updateRow(row.id, { percentage: value })} unit="%" step={0.5} />
                )}
                <button type="button" className="min-h-12 self-end rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100" onClick={() => removeRow(row.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-amber-50/80 p-3 text-sm text-stone-600">No custom ingredients added. Use this for seeds, honey, malt, inclusions, or any ingredient not covered by the standard fields.</p>
      )}
    </div>
  );
}

export default function Calculator({ slug, calculatorType, defaultInputs, resultMicrocopy }: { slug: string; calculatorType: CalculatorType; defaultInputs?: DefaultInputs; resultMicrocopy?: ResultMicrocopy }) {
  const { state, defaults, set, setUnit, reset } = useCalculatorState(slug, defaultInputs);
  const params = useSearchParams();
  const [customIngredients, setCustomIngredients] = useState<CustomIngredientForm[]>(() => readCustomIngredients(params));
  const serializedCustomIngredients = useMemo(() => serializeCustomIngredients(customIngredients), [customIngredients]);
  useEffect(() => {
    setCalculatorUrlState(calculatorType, { ...state }, { ...defaults }, serializedCustomIngredients);
  }, [calculatorType, defaults, serializedCustomIngredients, state]);
  const activeCustom = useMemo(() => activeCustomIngredients(customIngredients), [customIngredients]);
  const resetAll = () => { reset(); setCustomIngredients([]); };
  const computed = useMemo(() => {
    try { return { result: compute(calculatorType, state, activeCustom) as CalculatorResult, error: '' }; }
    catch (error) { return { result: undefined, error: error instanceof Error ? error.message : 'Check your inputs and try again.' }; }
  }, [state, calculatorType, activeCustom]);
  const result = computed.result;
  const total = result ? (result.formulaTotals?.totalDoughWeightGrams ?? result.totalDoughWeightGrams ?? result.totalNeededStarterGrams ?? 0) : 0;
  const copyText = result ? buildCopyText(result, state.unit) : computed.error;
  const inputSummary = buildInputSummary(calculatorType, state, customIngredients);
  const showFlourBlend = calculatorType !== 'starter-feeding';

  return (
    <section className="rounded-[2rem] border border-amber-200/80 bg-workspace p-4 shadow-xl sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-dough-700">Calculator workspace</p>
          <p className="mt-1 text-sm text-stone-600">Adjust inputs on the left. Use the result cards for weighing, copying, printing, or sharing.</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 shadow-soft">Local browser calculation</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
        <div className="no-print rounded-3xl border border-amber-200/70 bg-input p-4 shadow-soft">
          <h2 className="text-lg font-bold text-stone-950">Inputs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <SelectField label="Display unit" value={state.unit} set={setUnit} options={[{ value: 'g', label: 'grams' }, { value: 'oz', label: 'ounces' }, { value: 'lb', label: 'pounds' }]} />
            {calculatorType === 'bakers-percentage' && <>
              <SelectField label="Baker's math mode" value={state.bakerMode} set={(value) => set('bakerMode', value)} options={[{ value: 'percentages', label: 'Weights from percentages' }, { value: 'weights', label: 'Percentages from weights' }]} />
              <Field label="Total flour weight" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              {state.bakerMode === 'weights' ? <>
                <Field label="Water weight" value={state.bpWater} set={(v) => set('bpWater', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
                <Field label="Starter weight" value={state.bpStarter} set={(v) => set('bpStarter', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
                <Field label="Salt weight" value={state.bpSalt} set={(v) => set('bpSalt', v)} unit="g" step={1} isWeight displayUnit={state.unit} />
                <Field label="Oil weight" value={state.bpOil} set={(v) => set('bpOil', v)} unit="g" step={5} isWeight displayUnit={state.unit} />
                <Field label="Sugar weight" value={state.bpSugar} set={(v) => set('bpSugar', v)} unit="g" step={5} isWeight displayUnit={state.unit} />
              </> : <>
                <Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" />
                <Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" />
                <Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} />
                <Field label="Oil" value={state.oil} set={(v) => set('oil', v)} unit="%" step={0.5} />
                <Field label="Sugar" value={state.sugar} set={(v) => set('sugar', v)} unit="%" step={0.5} />
              </>}
              <CustomIngredientsEditor rows={customIngredients} setRows={setCustomIngredients} unit={state.unit} slug={slug} />
            </>}
            {calculatorType === 'sourdough-hydration' && <>
              <Field label="Main flour" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              <Field label="Added water" value={state.water} set={(v) => set('water', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              <Field label="Starter weight" value={state.starter} set={(v) => set('starter', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              <Field label="Starter hydration" value={state.sh} set={(v) => set('sh', v)} unit="%" />
              <Field label="Salt weight" value={state.saltg} set={(v) => set('saltg', v)} unit="g" step={1} isWeight displayUnit={state.unit} />
            </>}
            {calculatorType === 'starter-feeding' && <>
              <Field label="Starter needed for recipe" value={state.target} set={(v) => set('target', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              <Field label="Seed part" value={state.seed} set={(v) => set('seed', v)} unit="part" step={0.5} min={0.1} />
              <Field label="Flour part" value={state.flourpart} set={(v) => set('flourpart', v)} unit="part" step={0.5} min={0.1} />
              <Field label="Water part" value={state.waterpart} set={(v) => set('waterpart', v)} unit="part" step={0.5} min={0.1} />
              <Field label="Extra starter to keep" value={state.extra} set={(v) => set('extra', v)} unit="g" step={5} isWeight displayUnit={state.unit} />
            </>}
            {calculatorType === 'pizza-dough' && <>
              <SelectField label="Leavening" value={state.lev} set={(v) => set('lev', v)} options={[{ value: 'yeast', label: 'Yeast' }, { value: 'sourdough', label: 'Sourdough starter' }]} />
              <Field label="Pizza count" value={state.count} set={(v) => set('count', v)} unit="pizzas" min={1} />
              <Field label="Dough ball weight" value={state.ball} set={(v) => set('ball', v)} unit="g" step={10} isWeight displayUnit={state.unit} />
              <Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" />
              <Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} />
              {state.lev === 'yeast' ? <Field label="Yeast" value={state.yeast} set={(v) => set('yeast', v)} unit="%" step={0.1} /> : <>
                <Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" />
                <Field label="Starter hydration" value={state.sh} set={(v) => set('sh', v)} unit="%" />
              </>}
              <Field label="Oil" value={state.oil} set={(v) => set('oil', v)} unit="%" step={0.5} />
              <Field label="Sugar" value={state.sugar} set={(v) => set('sugar', v)} unit="%" step={0.5} />
            </>}
            {calculatorType === 'dough-scaling' && <>
              <SelectField label="Calculation mode" value={state.mode} set={(v) => set('mode', v)} options={[{ value: 'target', label: 'Target total dough weight' }, { value: 'per-loaf', label: 'Weight per loaf × loaf count' }, { value: 'flour', label: 'Known total flour weight' }]} />
              {state.mode === 'target' ? <Field label="Target total dough" value={state.target} set={(v) => set('target', v)} unit="g" step={50} isWeight displayUnit={state.unit} /> : state.mode === 'per-loaf' ? <Field label="Target weight per loaf" value={state.perLoaf} set={(v) => set('perLoaf', v)} unit="g" step={25} isWeight displayUnit={state.unit} /> : <Field label="Total flour weight" value={state.flour} set={(v) => set('flour', v)} unit="g" step={10} isWeight displayUnit={state.unit} />}
              <Field label="Loaf count" value={state.loaves} set={(v) => set('loaves', v)} unit="loaves" min={1} />
              <Field label="Hydration" value={state.hyd} set={(v) => set('hyd', v)} unit="%" />
              <Field label="Starter" value={state.starter} set={(v) => set('starter', v)} unit="%" />
              <Field label="Starter hydration" value={state.sh} set={(v) => set('sh', v)} unit="%" />
              <Field label="Salt" value={state.salt} set={(v) => set('salt', v)} unit="%" step={0.1} />
              <Field label="Oil" value={state.oil} set={(v) => set('oil', v)} unit="%" step={0.5} />
              <Field label="Sugar" value={state.sugar} set={(v) => set('sugar', v)} unit="%" step={0.5} />
            </>}
            {showFlourBlend ? <FlourBlendFields state={state} set={set} /> : null}
          </div>
          {calculatorType === 'starter-feeding' && <StarterPresets set={set} slug={slug} />}
        </div>
        <div className="space-y-5 print-card">
          {computed.error && <div className="no-print rounded-3xl border border-red-300 bg-danger p-5 text-sm text-red-950 shadow-soft" role="alert"><b>Calculation cannot run with the current inputs.</b><p className="mt-2">{resultMicrocopy?.error ?? computed.error}</p><p className="mt-1 text-xs text-red-800">{computed.error}</p><button className="mt-4 min-h-11 rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold" onClick={resetAll}>Reset inputs</button></div>}
          {result && <>
            <PrintableRecipeCard title={titleFromSlug(slug)} result={result} unit={state.unit} inputSummary={inputSummary} />
            <div className="no-print space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Total dough" value={formatWeight(total, state.unit)} tone="success" />
                {result.totalHydrationPct !== undefined ? <Metric label="Hydration" value={pct(result.totalHydrationPct)} /> : null}
                {result.totalFormulaPct !== undefined ? <Metric label="Formula" value={pct(result.totalFormulaPct)} /> : null}
                {result.starterForRecipeGrams !== undefined ? <Metric label="For recipe" value={formatWeight(result.starterForRecipeGrams, state.unit)} /> : null}
              </div>
              {resultMicrocopy?.summary ? <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-stone-700"><b>How to read this result:</b> {resultMicrocopy.summary}</div> : null}
              <IngredientCards title="Add to bowl" caption={resultMicrocopy?.addToBowl ?? "These are the weights you actually measure and mix."} items={result.addToBowl ?? result.ingredients} unit={state.unit} />
              <FormulaTotalsCard result={result} unit={state.unit} caption={resultMicrocopy?.formulaTotals} />
              <StarterSplitCard result={result} unit={state.unit} caption={resultMicrocopy?.starterSplit} />
              {result.flourBlend ? <IngredientCards title="Formula flour blend" caption="These percentages apply to total flour. In sourdough formulas, starter flour is counted here and deducted from the flour you add to the bowl." items={result.flourBlend} unit={state.unit} /> : null}
              {result.perUnit ? <IngredientCards title={result.perUnitLabel ?? 'Per unit'} caption={resultMicrocopy?.perUnit ?? "Scaled from the total formula."} items={result.perUnit} unit={state.unit} /> : null}
              <WarningList items={result.warnings ?? []} slug={slug} />
              {resultMicrocopy?.copyHint ? <p className="rounded-2xl bg-stone-50 p-3 text-sm leading-6 text-stone-600">{resultMicrocopy.copyHint}</p> : null}
              <CopyButtons text={copyText} slug={slug} reset={resetAll} />
            </div>
          </>}
        </div>
      </div>
    </section>
  );
}
