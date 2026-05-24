import { describe, expect, it } from 'vitest';
import { displayRound, r1, r2, r3 } from '@/lib/rounding';
describe('rounding', () => { it('rounds display values', () => { expect(r1(1.24)).toBe(1.2); expect(r2(1.235)).toBe(1.24); expect(r3(1.2345)).toBe(1.235); expect(displayRound(12.6, 'g')).toBe(13); }); });
