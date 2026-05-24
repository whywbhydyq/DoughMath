import { describe, expect, it } from 'vitest';
import { calculateBakersPercentage, calculateDoughScaling, calculatePizzaDough, calculateSourdoughHydration, calculateStarterFeeding } from '@/lib/bakingMath';
describe('baking math', () => {
  it('calculates baker percentages', () => { const r = calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2 }); expect(Math.round(r.totalDoughWeightGrams)).toBe(985); });
  it('splits 100% starter hydration', () => { const r = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 }); expect(Math.round(r.starterSplit.flourGrams)).toBe(50); expect(Math.round(r.starterSplit.waterGrams)).toBe(50); });
  it('calculates starter feeding', () => { const r = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 0 }); expect(Math.round(r.seedStarterGrams)).toBe(20); expect(Math.round(r.feedingFlourGrams)).toBe(40); expect(Math.round(r.feedingWaterGrams)).toBe(40); });
  it('calculates target dough scaling', () => { const r = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1500, loafCount: 2, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 }); expect(r.perUnit?.length).toBeGreaterThan(0); });
  it('calculates pizza dough', () => { const r = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 2, sugarPct: 0, yeastPct: 0.2, leaveningType: 'yeast' }); expect(Math.round(r.totalDoughWeightGrams)).toBe(840); });
});
