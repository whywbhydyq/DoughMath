import type { FormulaWarning } from '@/types/baking';

export type CheckResult = { ok: boolean; message?: string };
export const requiredPositive = (value: number, label: string): CheckResult => Number.isFinite(value) && value > 0 ? { ok: true } : { ok: false, message: `${label} must be greater than 0.` };
export const requiredNonNegative = (value: number, label: string): CheckResult => Number.isFinite(value) && value >= 0 ? { ok: true } : { ok: false, message: `${label} must be 0 or greater.` };
export const isValidRatio = (seed: number, flour: number, water: number) => [seed, flour, water].every((value) => Number.isFinite(value) && value > 0);

export function formulaWarnings(input: { hydrationPct?: number; saltPct?: number; starterPct?: number; starterHydrationPct?: number; targetWeightGrams?: number; pizzaBallWeightGrams?: number }): FormulaWarning[] {
  const out: FormulaWarning[] = [];
  const hydration = input.hydrationPct ?? 0;
  const salt = input.saltPct ?? 0;
  const starter = input.starterPct ?? 0;
  const starterHydration = input.starterHydrationPct ?? 100;
  if (hydration > 0 && hydration < 40) out.push({ code: 'low-hydration', message: 'This is a very stiff dough. Check whether the hydration value is intended.', severity: 'warning' });
  if (hydration > 100) out.push({ code: 'high-hydration', message: 'This is a very high-hydration dough and may be difficult to handle.', severity: 'warning' });
  if (salt > 4) out.push({ code: 'high-salt', message: 'Salt above 4% is unusually high for most bread formulas.', severity: 'warning' });
  if (starter > 60) out.push({ code: 'high-starter', message: 'A high starter percentage can speed fermentation significantly.', severity: 'warning' });
  if (starterHydration !== 100) out.push({ code: 'custom-starter-hydration', message: 'Starter has been split using your custom hydration setting.', severity: 'info' });
  if ((input.targetWeightGrams ?? 0) > 10000) out.push({ code: 'large-batch', message: 'Large batch. Check scale capacity and mixing method.', severity: 'warning' });
  const ball = input.pizzaBallWeightGrams ?? 0;
  if (ball > 0 && ball < 120) out.push({ code: 'small-pizza-ball', message: 'This is a small dough ball. Check pizza size.', severity: 'warning' });
  if (ball > 500) out.push({ code: 'large-pizza-ball', message: 'This is a large dough ball. Check pizza size and style.', severity: 'warning' });
  return out;
}
