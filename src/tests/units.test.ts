import { describe, expect, it } from 'vitest';
import { fromGrams, formatWeight, toGrams } from '@/lib/units';

describe('unit conversion', () => {
  it('converts ounces and pounds to grams', () => {
    expect(toGrams(1, 'oz')).toBeCloseTo(28.3495, 3);
    expect(toGrams(1, 'lb')).toBeCloseTo(453.592, 3);
  });

  it('converts grams to display units', () => {
    expect(fromGrams(28.349523125, 'oz')).toBeCloseTo(1, 4);
    expect(formatWeight(453.59237, 'lb')).toBe('1 lb');
  });
});
