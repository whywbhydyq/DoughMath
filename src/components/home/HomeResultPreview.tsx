'use client';

import type { CalculatorResult, FormulaWarning, Ingredient } from '@/types/baking';
import { grams, pct } from '@/lib/bakingMath';
import type { HomeModeConfig, HomeModeId } from './homeModes';

type HomeResultPreviewProps = {
  mode: HomeModeId;
  modeConfig: HomeModeConfig;
  result?: CalculatorResult;
  error?: string;
  statusText: string;
  copied: boolean;
  onCopy: () => void;
};

export function HomeResultPreview({ mode, modeConfig, result, error, statusText, copied, onCopy }: HomeResultPreviewProps) {
  if (error || !result) {
    return (
      <section className="flex min-h-[26rem] flex-col rounded-[1.7rem] border border-red-200 bg-red-50/80 p-4 shadow-soft lg:min-h-[28rem]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-700">Result preview</p>
        <div className="mt-8 rounded-3xl border border-red-200 bg-white p-5">
          <h2 className="text-2xl font-black text-red-900">Fix the input before copying.</h2>
          <p className="mt-3 text-sm leading-6 text-red-700">{error ?? 'The calculator could not produce a result from these inputs.'}</p>
        </div>
      </section>
    );
  }

  const metrics = getMetrics(mode, result);
  const rows = getRows(result);
  const warning = result.warnings[0];

  return (
    <section className="flex min-h-[26rem] flex-col rounded-[1.7rem] border border-amber-200/90 bg-white p-3.5 shadow-soft sm:p-4 lg:min-h-[28rem]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-dough-700">Result preview</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">{statusText}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-dough-800">{modeConfig.shortTitle}</span>
      </div>

      <div className="mt-3 rounded-[1.5rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-3.5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{primaryMetricLabel(mode)}</p>
        <p className="mt-1 text-3xl font-black tabular-nums tracking-tight text-stone-950 sm:text-4xl">{primaryMetricValue(mode, result)}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-amber-100 bg-amber-50/60 p-2.5">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-stone-500">{metric.label}</p>
            <p className="mt-1 text-lg font-black tabular-nums text-stone-950">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex-1 rounded-[1.5rem] border border-stone-200 bg-stone-50/70 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-black text-stone-950">{modeConfig.resultLabel}</h3>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">grams</span>
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((item) => (
            <div key={`${item.name}-${item.weightGrams}`} className="flex items-baseline justify-between gap-4 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm">
              <span className="min-w-0 truncate font-bold text-stone-700">{item.name}</span>
              <span className="shrink-0 font-black tabular-nums text-stone-950">{grams(item.weightGrams)}</span>
            </div>
          ))}
        </div>
      </div>

      {warning ? <p className={`mt-3 rounded-2xl border px-3 py-2 text-xs font-semibold leading-5 ${warningToneClass(warning)}`}>{warning.message}</p> : null}

      <button
        type="button"
        onClick={onCopy}
        className="mt-3 min-h-11 rounded-2xl bg-dough-900 px-5 text-base font-black text-white shadow-soft transition hover:bg-dough-800"
      >
        {copied ? 'Copied.' : 'Copy result'}
      </button>
    </section>
  );
}

function warningToneClass(warning: FormulaWarning) {
  if (warning.level === 'danger') return 'border-red-200 bg-red-50 text-red-900';
  if (warning.level === 'warning') return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-stone-200 bg-stone-50 text-stone-700';
}

function getRows(result: CalculatorResult): Ingredient[] {
  const rows = result.addToBowl?.length ? result.addToBowl : result.ingredients;
  return rows.filter((item) => Number.isFinite(item.weightGrams) && item.weightGrams > 0).slice(0, 7);
}

function getMetrics(mode: HomeModeId, result: CalculatorResult) {
  if (mode === 'starter-feeding') {
    return [
      { label: 'Seed', value: grams(result.seedStarterGrams ?? 0) },
      { label: 'Flour', value: grams(result.feedingFlourGrams ?? 0) },
      { label: 'Water', value: grams(result.feedingWaterGrams ?? 0) }
    ];
  }
  if (mode === 'sourdough-hydration') {
    return [
      { label: 'Total hydration', value: pct(result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ?? 0) },
      { label: 'Added hydration', value: pct(result.addedHydrationPct ?? result.formulaTotals?.addedHydrationPct ?? 0) },
      { label: 'Total flour', value: grams(result.formulaTotals?.totalFlourGrams ?? 0) }
    ];
  }
  if (mode === 'pizza-dough') {
    return [
      { label: 'Per ball', value: grams(result.perUnit?.reduce((sum, item) => sum + item.weightGrams, 0) ?? 0) },
      { label: 'Hydration', value: pct(result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ?? 0) },
      { label: 'Flour', value: grams(result.formulaTotals?.totalFlourGrams ?? 0) }
    ];
  }
  return [
    { label: 'Flour', value: grams(result.formulaTotals?.totalFlourGrams ?? 0) },
    { label: 'Hydration', value: pct(result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ?? 0) },
    { label: 'Salt', value: pct(result.formulaTotals?.saltPct ?? 0) }
  ];
}

function primaryMetricLabel(mode: HomeModeId) {
  if (mode === 'sourdough-hydration') return 'Total hydration';
  if (mode === 'starter-feeding') return 'Total starter';
  return 'Total dough';
}

function primaryMetricValue(mode: HomeModeId, result: CalculatorResult) {
  if (mode === 'sourdough-hydration') return pct(result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ?? 0);
  if (mode === 'starter-feeding') return grams(result.finalStarterWeightGrams ?? result.totalNeededStarterGrams ?? result.totalDoughWeightGrams);
  return grams(result.totalDoughWeightGrams);
}
