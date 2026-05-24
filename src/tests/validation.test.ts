import { describe, expect, it } from 'vitest';
import { formulaWarnings, isValidRatio, requiredPositive } from '@/lib/validation';
describe('validation', () => { it('validates positive values', () => { expect(requiredPositive('flour', 1).valid).toBe(true); expect(requiredPositive('flour', 0).valid).toBe(false); }); it('validates ratios', () => { expect(isValidRatio(1,2,2)).toBe(true); expect(isValidRatio(1,0,2)).toBe(false); }); it('warns on high hydration', () => { expect(formulaWarnings({ hydrationPct: 90 }).some(w => w.code === 'high-hydration')).toBe(true); }); });
