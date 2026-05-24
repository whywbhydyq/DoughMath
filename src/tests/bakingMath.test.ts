import { describe, expect, it } from 'vitest';
import { bakerPercentage, baseFlourFromTargetDoughWeight, calculateDoughScaling, calculatePizzaDough, calculateSourdoughHydration, calculateStarterFeeding, splitStarterByHydration, totalFlourFromSourdoughTargetDoughWeight } from '@/lib/bakingMath';

const close = (a: number, e: number) => expect(a).toBeCloseTo(e, 1);

describe('DoughMath MVP formulas', () => {
  it('calculates baker percentages', () => {
    expect(bakerPercentage(700, 1000)).toBeCloseTo(70, 2);
    expect(bakerPercentage(20, 1000)).toBeCloseTo(2, 2);
  });

  it('keeps generic target flour for yeast formulas', () => {
    expect(baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: 840, hydrationPct: 65, saltPct: 2.5, yeastPct: 0.2 })).toBeCloseTo(500.89, 2);
  });

  it('uses strict sourdough target flour without counting starter as an extra ingredient', () => {
    expect(totalFlourFromSourdoughTargetDoughWeight({ targetDoughWeightGrams: 1000, hydrationPct: 75, saltPct: 2 })).toBeCloseTo(564.97, 2);
  });

  it('splits starter hydration at 50, 100, and 125 percent', () => {
    close(splitStarterByHydration(100, 100).flourGrams, 50);
    close(splitStarterByHydration(100, 100).waterGrams, 50);
    close(splitStarterByHydration(150, 50).flourGrams, 100);
    close(splitStarterByHydration(150, 50).waterGrams, 50);
    close(splitStarterByHydration(225, 125).flourGrams, 100);
    close(splitStarterByHydration(225, 125).waterGrams, 125);
  });

  it('calculates total sourdough hydration', () => {
    const r = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 });
    close(r.starterSplit!.flourGrams, 50);
    close(r.starterSplit!.waterGrams, 50);
    close(r.totalFlourGrams, 550);
    close(r.totalWaterGrams, 400);
    expect(r.totalHydrationPct).toBeCloseTo(72.7, 1);
  });

  it('matches the strict MVP target dough scaling case', () => {
    const r = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1000, loafCount: 1, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    close(r.totalFlourGrams, 564.97);
    close(r.totalWaterGrams, 423.73);
    close(r.starterWeightGrams, 112.99);
    close(r.starterFlourGrams, 56.5);
    close(r.starterWaterGrams, 56.5);
    close(r.addedFlourGrams, 508.47);
    close(r.addedWaterGrams, 367.23);
    close(r.totalDoughWeightGrams, 1000);
  });

  it('calculates starter feeding with extra starter kept', () => {
    const r = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 10 });
    close(r.totalNeededStarterGrams, 110);
    close(r.seedStarterGrams, 22);
    close(r.feedingFlourGrams, 44);
    close(r.feedingWaterGrams, 44);
  });

  it('calculates yeast pizza dough balls', () => {
    const r = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 0, sugarPct: 0, yeastPct: 0.2, leaveningType: 'yeast' });
    close(r.totalDoughWeightGrams, 840);
    expect(r.baseFlourGrams).toBeCloseTo(500.89, 2);
  });
});
