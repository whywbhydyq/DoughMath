import type { FormulaWarning } from '@/types/baking';
export type CheckResult = { valid: boolean; error?: string };
export const requiredPositive = (label: string, value: number): CheckResult => Number.isFinite(value) && value > 0 ? { valid: true } : { valid: false, error: `${label} must be greater than zero.` };
export const requiredNonNegative = (label: string, value: number): CheckResult => Number.isFinite(value) && value >= 0 ? { valid: true } : { valid: false, error: `${label} must not be negative.` };
export const isValidRatio = (...parts: number[]) => parts.every((part) => Number.isFinite(part) && part > 0);
export const formulaWarnings = (input: { hydrationPct?: number; saltPct?: number; starterPct?: number; starterHydrationPct?: number; pizzaBallGrams?: number; totalDoughGrams?: number }) => {
  const out: FormulaWarning[] = [];
  if ((input.hydrationPct ?? 0) < 55) out.push({ code: 'low-hydration', message: 'Hydration is low.' });
  if ((input.hydrationPct ?? 0) > 85) out.push({ code: 'high-hydration', message: 'Hydration is high.' });
  if ((input.saltPct ?? 0) > 3) out.push({ code: 'high-salt', message: 'Salt percentage is high.' });
  if ((input.starterPct ?? 0) > 40) out.push({ code: 'high-starter', message: 'Starter percentage is high.' });
  return out;
};
export const isPositiveFinite = (value: number) => Number.isFinite(value) && value > 0;
export function assertPositiveFinite(label: string, value: number) { if (!isPositiveFinite(value)) throw new Error(`${label} must be greater than zero.`); }
export function assertNonNegativeFinite(label: string, value: number) { if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must not be negative.`); }
export const warning = (code: string, message: string): FormulaWarning => ({ code, message });
