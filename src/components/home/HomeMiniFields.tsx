'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type {
  BakersPercentageHomeState,
  DoughScalingHomeState,
  HomeFormState,
  HomeModeId,
  PizzaDoughHomeState,
  SourdoughHydrationHomeState,
  StarterFeedingHomeState
} from './homeModes';
import { starterRatioPresets } from './homeModes';

type HomeMiniFieldsProps = {
  activeMode: HomeModeId;
  state: HomeFormState;
  onModeStateChange: <TMode extends HomeModeId>(mode: TMode, nextState: HomeFormState[TMode]) => void;
};

export function HomeMiniFields({ activeMode, state, onModeStateChange }: HomeMiniFieldsProps) {
  if (activeMode === 'dough-scaling') {
    const value = state['dough-scaling'];
    const update = (patch: Partial<DoughScalingHomeState>) => onModeStateChange('dough-scaling', { ...value, ...patch });
    return (
      <FieldGrid>
        <NumberField label="Target dough" suffix="g" value={value.targetDoughWeightGrams} step={50} min={1} onChange={(next) => update({ targetDoughWeightGrams: next })} />
        <NumberField label="Loaves" value={value.loafCount} step={1} min={1} onChange={(next) => update({ loafCount: next })} />
        <NumberField label="Hydration" suffix="%" value={value.hydrationPct} step={1} min={1} onChange={(next) => update({ hydrationPct: next })} />
        <NumberField label="Starter" suffix="%" value={value.starterPct} step={5} min={0} onChange={(next) => update({ starterPct: next })} />
        <NumberField label="Starter hydration" suffix="%" value={value.starterHydrationPct} step={5} min={0} onChange={(next) => update({ starterHydrationPct: next })} />
        <NumberField label="Salt" suffix="%" value={value.saltPct} step={0.1} min={0} onChange={(next) => update({ saltPct: next })} />
      </FieldGrid>
    );
  }

  if (activeMode === 'sourdough-hydration') {
    const value = state['sourdough-hydration'];
    const update = (patch: Partial<SourdoughHydrationHomeState>) => onModeStateChange('sourdough-hydration', { ...value, ...patch });
    return (
      <FieldGrid>
        <NumberField label="Main flour" suffix="g" value={value.mainFlourGrams} step={25} min={1} onChange={(next) => update({ mainFlourGrams: next })} />
        <NumberField label="Added water" suffix="g" value={value.addedWaterGrams} step={25} min={0} onChange={(next) => update({ addedWaterGrams: next })} />
        <NumberField label="Starter" suffix="g" value={value.starterWeightGrams} step={25} min={0} onChange={(next) => update({ starterWeightGrams: next })} />
        <NumberField label="Starter hydration" suffix="%" value={value.starterHydrationPct} step={5} min={0} onChange={(next) => update({ starterHydrationPct: next })} />
        <NumberField label="Salt" suffix="g" value={value.saltWeightGrams} step={1} min={0} onChange={(next) => update({ saltWeightGrams: next })} />
      </FieldGrid>
    );
  }

  if (activeMode === 'starter-feeding') {
    const value = state['starter-feeding'];
    const update = (patch: Partial<StarterFeedingHomeState>) => onModeStateChange('starter-feeding', { ...value, ...patch });
    return (
      <div className="space-y-3">
        <FieldGrid>
          <NumberField label="Starter needed" suffix="g" value={value.targetStarterWeightGrams} step={10} min={1} onChange={(next) => update({ targetStarterWeightGrams: next })} />
          <NumberField label="Extra to keep" suffix="g" value={value.extraGrams} step={5} min={0} onChange={(next) => update({ extraGrams: next })} />
          <NumberField label="Seed part" value={value.seedPart} step={1} min={0.1} onChange={(next) => update({ seedPart: next })} />
          <NumberField label="Flour part" value={value.flourPart} step={1} min={0.1} onChange={(next) => update({ flourPart: next })} />
          <NumberField label="Water part" value={value.waterPart} step={1} min={0.1} onChange={(next) => update({ waterPart: next })} />
        </FieldGrid>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Ratio presets</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {starterRatioPresets.map((preset) => {
              const active = value.seedPart === preset.seedPart && value.flourPart === preset.flourPart && value.waterPart === preset.waterPart;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => update({ seedPart: preset.seedPart, flourPart: preset.flourPart, waterPart: preset.waterPart })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${active ? 'border-dough-700 bg-dough-900 text-white' : 'border-amber-200 bg-white text-stone-700 hover:bg-amber-50'}`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeMode === 'bakers-percentage') {
    const value = state['bakers-percentage'];
    const update = (patch: Partial<BakersPercentageHomeState>) => onModeStateChange('bakers-percentage', { ...value, ...patch });
    return (
      <FieldGrid>
        <NumberField label="Flour" suffix="g" value={value.flourWeightGrams} step={25} min={1} onChange={(next) => update({ flourWeightGrams: next })} />
        <NumberField label="Hydration" suffix="%" value={value.hydrationPct} step={1} min={0} onChange={(next) => update({ hydrationPct: next })} />
        <NumberField label="Starter" suffix="%" value={value.starterPct} step={5} min={0} onChange={(next) => update({ starterPct: next })} />
        <NumberField label="Salt" suffix="%" value={value.saltPct} step={0.1} min={0} onChange={(next) => update({ saltPct: next })} />
      </FieldGrid>
    );
  }

  const value = state['pizza-dough'];
  const update = (patch: Partial<PizzaDoughHomeState>) => onModeStateChange('pizza-dough', { ...value, ...patch });
  return (
    <div className="space-y-3">
      <FieldGrid>
        <NumberField label="Pizzas" value={value.pizzaCount} step={1} min={1} onChange={(next) => update({ pizzaCount: next })} />
        <NumberField label="Ball weight" suffix="g" value={value.ballWeightGrams} step={10} min={1} onChange={(next) => update({ ballWeightGrams: next })} />
        <NumberField label="Hydration" suffix="%" value={value.hydrationPct} step={1} min={1} onChange={(next) => update({ hydrationPct: next })} />
        <NumberField label="Salt" suffix="%" value={value.saltPct} step={0.1} min={0} onChange={(next) => update({ saltPct: next })} />
        {value.leaveningType === 'yeast' ? (
          <NumberField label="Yeast" suffix="%" value={value.yeastPct} step={0.05} min={0} onChange={(next) => update({ yeastPct: next })} />
        ) : (
          <NumberField label="Starter" suffix="%" value={value.starterPct} step={5} min={0} onChange={(next) => update({ starterPct: next })} />
        )}
        {value.leaveningType === 'sourdough' ? <NumberField label="Starter hydration" suffix="%" value={value.starterHydrationPct} step={5} min={0} onChange={(next) => update({ starterHydrationPct: next })} /> : null}
      </FieldGrid>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Leavening</p>
        <div className="mt-2 flex rounded-2xl border border-amber-200 bg-white p-1">
          {(['yeast', 'sourdough'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update({ leaveningType: option })}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold capitalize ${value.leaveningType === option ? 'bg-dough-900 text-white' : 'text-stone-700 hover:bg-amber-50'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-2.5 sm:grid-cols-2">{children}</div>;
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
};

function NumberField({ label, value, onChange, suffix, step = 1, min = 0 }: NumberFieldProps) {
  const [draftValue, setDraftValue] = useState(formatDraftValue(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) setDraftValue(formatDraftValue(value));
  }, [isFocused, value]);

  const parseDraft = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') return null;
    const next = Number(trimmed);
    return Number.isFinite(next) ? Math.max(min, next) : null;
  };

  const updateDraft = (raw: string) => {
    setDraftValue(raw);
    const next = parseDraft(raw);
    if (next !== null) onChange(next);
  };

  const commitOrRestoreDraft = () => {
    setIsFocused(false);
    const next = parseDraft(draftValue);
    if (next === null) {
      setDraftValue(formatDraftValue(value));
      return;
    }
    onChange(next);
    setDraftValue(formatDraftValue(next));
  };

  return (
    <label className="block rounded-2xl border border-amber-200/80 bg-white px-3 py-2 shadow-sm">
      <span className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-stone-500">{label}</span>
      <span className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={draftValue}
          min={min}
          step={step}
          onFocus={() => setIsFocused(true)}
          onBlur={commitOrRestoreDraft}
          onChange={(event) => updateDraft(event.target.value)}
          className="min-h-8 w-full rounded-xl border border-transparent bg-stone-50 px-3 text-base font-black text-stone-950 outline-none focus:border-dough-500/40 focus:bg-white focus:ring-2 focus:ring-dough-500/20"
        />
        {suffix ? <span className="text-sm font-black text-stone-500">{suffix}</span> : null}
      </span>
    </label>
  );
}

function formatDraftValue(value: number) {
  return Number.isFinite(value) ? String(value) : '';
}
