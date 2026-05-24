import { describe, expect, it } from 'vitest';
import { formulaWarnings, isValidRatio, requiredNonNegative, requiredPositive } from '@/lib/validation';

describe('validation helpers', () => {
  it('validates positive and non-negative values', () => {
    expect(requiredPositive(1, 'Weight').ok).toBe(true);
    expect(requiredPositive(0, 'Weight').ok).toBe(false);
    expect(requiredNonNegative(0, 'Salt').ok).toBe(true);
    expect(requiredNonNegative(-1, 'Salt').ok).toBe(false);
  });

  it('validates feeding ratios', () => {
    expect(isValidRatio(1, 2, 2)).toBe(true);
    expect(isValidRatio(1, 0, 2)).toBe(false);
  });

  it('returns expected warning codes', () => {
    const codes = formulaWarnings({ hydrationPct: 110, saltPct: 5, starterPct: 70, starterHydrationPct: 80, targetWeightGrams: 12000, pizzaBallWeightGrams: 100 }).map((item) => item.code);
    expect(codes).toContain('high-hydration');
    expect(codes).toContain('high-salt');
    expect(codes).toContain('high-starter');
    expect(codes).toContain('custom-starter-hydration');
    expect(codes).toContain('large-batch');
    expect(codes).toContain('small-pizza-ball');
  });
});
