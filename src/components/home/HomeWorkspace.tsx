'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  calculateBakersPercentage,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding,
  grams,
  pct
} from '@/lib/bakingMath';
import { trackCalculatorEvent } from '@/lib/analytics';
import { buildCalculatorShareUrl } from '@/lib/urlState';
import type { CalculatorResult, Ingredient } from '@/types/baking';
import { HomeMiniFields } from './HomeMiniFields';
import { HomeModeCards } from './HomeModeCards';
import { HomeResultPreview } from './HomeResultPreview';
import { defaultHomeState, homeModes, type HomeFormState, type HomeModeId } from './homeModes';

export function HomeWorkspace() {
  const [activeMode, setActiveMode] = useState<HomeModeId>('dough-scaling');
  const [formState, setFormState] = useState<HomeFormState>(defaultHomeState);
  const [hasEdited, setHasEdited] = useState(false);
  const [copied, setCopied] = useState(false);

  const modeConfig = homeModes.find((mode) => mode.id === activeMode) ?? homeModes[0];
  const calculation = useMemo(() => calculateHomeResult(activeMode, formState), [activeMode, formState]);
  const fullCalculatorHref = useMemo(() => buildHomeCalculatorHref(activeMode, modeConfig.href, formState), [activeMode, formState, modeConfig.href]);
  const statusText = hasEdited ? 'Updated from your inputs' : 'Example result — updates as you edit';

  const updateModeState = <TMode extends HomeModeId>(mode: TMode, nextState: HomeFormState[TMode]) => {
    setFormState((current) => ({ ...current, [mode]: nextState } as HomeFormState));
    setHasEdited(true);
    setCopied(false);
  };

  const selectMode = (mode: HomeModeId) => {
    setActiveMode(mode);
    setHasEdited(!isModeStateDefault(mode, formState[mode]));
    setCopied(false);
    trackCalculatorEvent('home_mode_selected', mode, { source: 'homepage' });
  };

  const resetCurrentMode = () => {
    setFormState((current) => ({ ...current, [activeMode]: defaultHomeState[activeMode] } as HomeFormState));
    setHasEdited(false);
    setCopied(false);
    trackCalculatorEvent('home_sample_reset', activeMode, { source: 'homepage' });
  };

  const copyResult = async () => {
    if (!calculation.result) return;
    const text = buildCopyText(modeConfig.title, calculation.result);
    try {
      await copyTextToClipboard(text);
      setCopied(true);
      trackCalculatorEvent('home_result_copied', activeMode, { source: 'homepage' });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section aria-labelledby="workspace-title" className="space-y-4">
      <HomeModeCards activeMode={activeMode} onSelect={selectMode} />
      <div className="grid gap-3 lg:grid-cols-[minmax(330px,0.86fr)_minmax(500px,1.14fr)] lg:items-stretch">
        <section className="rounded-[1.7rem] border border-amber-200/90 bg-amber-50/75 p-3.5 shadow-soft sm:p-4 lg:min-h-[28rem]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-dough-700">Default workspace</p>
              <h2 id="workspace-title" className="mt-1 text-xl font-black tracking-tight text-stone-950 sm:text-2xl">{modeConfig.title}</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-stone-600">{modeConfig.description}. Need blends, print, or share URLs? Open the full calculator.</p>
            </div>
            <button type="button" onClick={resetCurrentMode} className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-black text-stone-700 transition hover:bg-amber-100">
              Reset sample
            </button>
          </div>

          <div className="mt-3">
            <HomeMiniFields activeMode={activeMode} state={formState} onModeStateChange={updateModeState} />
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link
              href={fullCalculatorHref}
              onClick={() => trackCalculatorEvent('home_full_calculator_opened', activeMode, { source: 'homepage' })}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-dough-900 bg-white px-4 text-center text-sm font-black text-dough-900 transition hover:bg-amber-50"
            >
              Open full calculator
            </Link>
            <p className="flex flex-1 items-center rounded-2xl bg-white/80 px-4 py-2.5 text-xs font-semibold leading-5 text-stone-600">
              Current inputs carry into the full tool for detailed notes, print, and share options.
            </p>
          </div>
        </section>

        <HomeResultPreview
          mode={activeMode}
          modeConfig={modeConfig}
          result={calculation.result}
          error={calculation.error}
          statusText={statusText}
          copied={copied}
          onCopy={copyResult}
        />
      </div>
    </section>
  );
}

function isModeStateDefault<TMode extends HomeModeId>(mode: TMode, value: HomeFormState[TMode]) {
  return JSON.stringify(defaultHomeState[mode]) === JSON.stringify(value);
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function calculateHomeResult(mode: HomeModeId, state: HomeFormState): { result?: CalculatorResult; error?: string } {
  try {
    switch (mode) {
      case 'dough-scaling': {
        const value = state['dough-scaling'];
        return {
          result: calculateDoughScaling({
            mode: 'by-target-dough-weight',
            targetDoughWeightGrams: value.targetDoughWeightGrams,
            loafCount: value.loafCount,
            hydrationPct: value.hydrationPct,
            starterPct: value.starterPct,
            starterHydrationPct: value.starterHydrationPct,
            saltPct: value.saltPct,
            oilPct: 0,
            sugarPct: 0
          })
        };
      }
      case 'sourdough-hydration': {
        return { result: calculateSourdoughHydration(state['sourdough-hydration']) };
      }
      case 'starter-feeding': {
        return { result: calculateStarterFeeding(state['starter-feeding']) };
      }
      case 'bakers-percentage': {
        return { result: calculateBakersPercentage(state['bakers-percentage']) };
      }
      case 'pizza-dough': {
        const value = state['pizza-dough'];
        return {
          result: calculatePizzaDough({
            pizzaCount: value.pizzaCount,
            ballWeightGrams: value.ballWeightGrams,
            hydrationPct: value.hydrationPct,
            saltPct: value.saltPct,
            leaveningType: value.leaveningType,
            yeastPct: value.leaveningType === 'yeast' ? value.yeastPct : 0,
            starterPct: value.leaveningType === 'sourdough' ? value.starterPct : undefined,
            starterHydrationPct: value.leaveningType === 'sourdough' ? value.starterHydrationPct : undefined,
            oilPct: 0,
            sugarPct: 0
          })
        };
      }
      default:
        return assertNever(mode);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'The calculator could not produce a result from these inputs.' };
  }
}

function buildHomeCalculatorHref(mode: HomeModeId, href: string, state: HomeFormState) {
  switch (mode) {
    case 'dough-scaling': {
      const value = state['dough-scaling'];
      return buildCalculatorShareUrl(mode, href, {
        mode: 'target',
        target: value.targetDoughWeightGrams,
        loaves: value.loafCount,
        hyd: value.hydrationPct,
        starter: value.starterPct,
        sh: value.starterHydrationPct,
        salt: value.saltPct
      });
    }
    case 'sourdough-hydration': {
      const value = state['sourdough-hydration'];
      return buildCalculatorShareUrl(mode, href, {
        flour: value.mainFlourGrams,
        water: value.addedWaterGrams,
        starter: value.starterWeightGrams,
        sh: value.starterHydrationPct,
        saltg: value.saltWeightGrams
      });
    }
    case 'starter-feeding': {
      const value = state['starter-feeding'];
      return buildCalculatorShareUrl(mode, href, {
        target: value.targetStarterWeightGrams,
        extra: value.extraGrams,
        seed: value.seedPart,
        flourpart: value.flourPart,
        waterpart: value.waterPart
      });
    }
    case 'bakers-percentage': {
      const value = state['bakers-percentage'];
      return buildCalculatorShareUrl(mode, href, {
        bakerMode: 'percentages',
        flour: value.flourWeightGrams,
        hyd: value.hydrationPct,
        starter: value.starterPct,
        salt: value.saltPct
      });
    }
    case 'pizza-dough': {
      const value = state['pizza-dough'];
      return buildCalculatorShareUrl(mode, href, {
        count: value.pizzaCount,
        ball: value.ballWeightGrams,
        hyd: value.hydrationPct,
        salt: value.saltPct,
        lev: value.leaveningType,
        yeast: value.leaveningType === 'yeast' ? value.yeastPct : undefined,
        starter: value.leaveningType === 'sourdough' ? value.starterPct : undefined,
        sh: value.leaveningType === 'sourdough' ? value.starterHydrationPct : undefined
      });
    }
    default:
      return assertNever(mode);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported homepage calculator mode: ${value}`);
}

function buildCopyText(title: string, result: CalculatorResult) {
  const rows = (result.addToBowl?.length ? result.addToBowl : result.ingredients)
    .filter((item) => Number.isFinite(item.weightGrams) && item.weightGrams > 0)
    .map((item) => formatIngredient(item));
  const totals = [
    `Total dough: ${grams(result.totalDoughWeightGrams)}`,
    result.formulaTotals?.totalFlourGrams ? `Total flour: ${grams(result.formulaTotals.totalFlourGrams)}` : undefined,
    result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ? `Hydration: ${pct(result.totalHydrationPct ?? result.formulaTotals?.totalHydrationPct ?? 0)}` : undefined,
    result.formulaTotals?.saltPct ? `Salt: ${pct(result.formulaTotals.saltPct)}` : undefined
  ].filter(Boolean);
  return [`DoughMath — ${title}`, '', ...totals, '', 'Add to bowl:', ...rows].join('\n');
}

function formatIngredient(item: Ingredient) {
  const percentage = Number.isFinite(item.bakerPercentage ?? NaN) ? ` (${pct(item.bakerPercentage ?? 0)})` : '';
  return `${item.name}: ${grams(item.weightGrams)}${percentage}`;
}
