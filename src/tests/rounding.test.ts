import { describe, expect, it } from 'vitest';
import { displayRound, r1, r2, r3 } from '@/lib/rounding';

describe('rounding helpers', () => {
  it('rounds common display values', () => {
    expect(r1(72.727)).toBe(72.7);
    expect(r2(1.236)).toBe(1.24);
    expect(r3(2.3456)).toBe(2.346);
  });

  it('rounds by unit', () => {
    expect(displayRound(12.6, 'g')).toBe(13);
    expect(displayRound(1.236, 'oz')).toBe(1.24);
    expect(displayRound(2.3456, 'lb')).toBe(2.346);
  });
});
