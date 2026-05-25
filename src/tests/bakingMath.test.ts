import { describe, expect, it } from 'vitest';
import {
  calculateBakersPercentage,
  calculateBakersPercentagesFromWeights,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding
} from '@/lib/bakingMath';

describe('baking math requirement cases', () => {
  it('calculates baker percentages from percentage inputs', () => {
    const r = calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2 });
    expect(Math.round(r.totalDoughWeightGrams)).toBe(985);
    expect(r.addToBowl?.find((i) => i.name === 'Water')?.weightGrams).toBeCloseTo(375, 4);
    expect(r.addToBowl?.find((i) => i.name === 'Starter')?.weightGrams).toBeCloseTo(100, 4);
    expect(r.addToBowl?.find((i) => i.name === 'Salt')?.weightGrams).toBeCloseTo(10, 4);
  });

  it('calculates baker percentages from weights', () => {
    const r = calculateBakersPercentagesFromWeights({ flourWeightGrams: 500, waterWeightGrams: 375, starterWeightGrams: 0, saltWeightGrams: 10 });
    expect(r.addToBowl?.find((i) => i.name === 'Water')?.bakerPercentage).toBeCloseTo(75, 4);
    expect(r.addToBowl?.find((i) => i.name === 'Salt')?.bakerPercentage).toBeCloseTo(2, 4);
    expect(Math.round(r.totalDoughWeightGrams)).toBe(885);
  });

  it('splits 100% starter hydration and calculates total hydration', () => {
    const r = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 });
    expect(r.starterSplit?.flourGrams).toBeCloseTo(50, 4);
    expect(r.starterSplit?.waterGrams).toBeCloseTo(50, 4);
    expect(r.formulaTotals?.totalFlourGrams).toBeCloseTo(550, 4);
    expect(r.formulaTotals?.totalWaterGrams).toBeCloseTo(400, 4);
    expect(r.formulaTotals?.addedHydrationPct).toBeCloseTo(70, 4);
    expect(r.formulaTotals?.totalHydrationPct).toBeCloseTo(72.727, 3);
    expect(r.formulaTotals?.saltPct).toBeCloseTo(1.818, 3);
    expect(Math.round(r.totalDoughWeightGrams)).toBe(960);
  });

  it('splits 50% hydration starter', () => {
    const r = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 150, starterHydrationPct: 50, saltWeightGrams: 10 });
    expect(r.starterSplit?.flourGrams).toBeCloseTo(100, 4);
    expect(r.starterSplit?.waterGrams).toBeCloseTo(50, 4);
  });

  it('calculates target dough scaling without double-counting starter', () => {
    const r = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1000, loafCount: 1, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    expect(r.totalDoughWeightGrams).toBeCloseTo(1000, 4);
    expect(r.formulaTotals?.totalFlourGrams).toBeCloseTo(564.97, 2);
    expect(r.formulaTotals?.totalWaterGrams).toBeCloseTo(423.73, 2);
    expect(r.addToBowl?.find((i) => i.name === 'Active starter')?.weightGrams).toBeCloseTo(112.99, 2);
    expect(r.starterSplit?.flourGrams).toBeCloseTo(56.50, 2);
    expect(r.starterSplit?.waterGrams).toBeCloseTo(56.50, 2);
    expect(r.addToBowl?.find((i) => i.name === 'Bread flour')?.weightGrams).toBeCloseTo(508.47, 2);
    expect(r.addToBowl?.find((i) => i.name === 'Water')?.weightGrams).toBeCloseTo(367.23, 2);
  });

  it('calculates two 750g loaves with per loaf split', () => {
    const r = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1500, loafCount: 2, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    expect(r.totalDoughWeightGrams).toBeCloseTo(1500, 4);
    expect(r.perUnit?.reduce((sum, i) => sum + i.weightGrams, 0)).toBeCloseTo(750, 4);
  });

  it('errors when starter water exceeds target hydration', () => {
    expect(() => calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1000, loafCount: 1, hydrationPct: 40, starterPct: 100, starterHydrationPct: 200, saltPct: 2 })).toThrow(/starter already contributes more water/i);
  });

  it('calculates starter feeding ratios', () => {
    const r = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 0 });
    expect(r.seedStarterGrams).toBeCloseTo(20, 4);
    expect(r.feedingFlourGrams).toBeCloseTo(40, 4);
    expect(r.feedingWaterGrams).toBeCloseTo(40, 4);
  });

  it('calculates starter feeding with extra to keep', () => {
    const r = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 10 });
    expect(r.finalStarterWeightGrams).toBeCloseTo(110, 4);
    expect(r.seedStarterGrams).toBeCloseTo(22, 4);
    expect(r.feedingFlourGrams).toBeCloseTo(44, 4);
    expect(r.feedingWaterGrams).toBeCloseTo(44, 4);
  });

  it('calculates yeast pizza by dough ball target', () => {
    const r = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 0, sugarPct: 0, yeastPct: 0.2, leaveningType: 'yeast' });
    expect(r.totalDoughWeightGrams).toBeCloseTo(840, 4);
    expect(r.formulaTotals?.totalFlourGrams).toBeCloseTo(500.89, 2);
    expect(r.formulaTotals?.totalWaterGrams).toBeCloseTo(325.58, 2);
    expect(r.addToBowl?.find((i) => i.name === 'Salt')?.weightGrams).toBeCloseTo(12.52, 2);
    expect(r.addToBowl?.find((i) => i.name === 'Yeast')?.weightGrams).toBeCloseTo(1.00, 2);
  });

  it('calculates sourdough pizza without double-counting starter', () => {
    const r = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 0, sugarPct: 0, starterPct: 20, starterHydrationPct: 100, leaveningType: 'sourdough' });
    expect(r.totalDoughWeightGrams).toBeCloseTo(840, 4);
    expect(r.addToBowl?.reduce((sum, item) => sum + item.weightGrams, 0)).toBeCloseTo(840, 4);
    expect(r.starterSplit?.flourGrams).toBeGreaterThan(0);
  });

  it('validates flour blend sum', () => {
    expect(() => calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2, flourBlend: [{ name: 'Bread flour', percent: 80 }, { name: 'Rye flour', percent: 10 }] })).toThrow(/100%/);
  });
});

describe('completed advanced requirement cases', () => {
  it('supports custom ingredients locked by percentage and by weight', () => {
    const r = calculateBakersPercentage({
      flourWeightGrams: 500,
      hydrationPct: 70,
      starterPct: 20,
      saltPct: 2,
      customIngredients: [
        { name: 'Seeds', lockMode: 'percentage', percentage: 8 },
        { name: 'Honey', lockMode: 'weight', weightGrams: 25 }
      ]
    });
    expect(r.addToBowl?.find((i) => i.name === 'Seeds')?.weightGrams).toBeCloseTo(40, 4);
    expect(r.addToBowl?.find((i) => i.name === 'Honey')?.bakerPercentage).toBeCloseTo(5, 4);
  });

  it('treats flour blend percentages as total flour in sourdough scaling', () => {
    const r = calculateDoughScaling({
      mode: 'by-target-dough-weight',
      targetDoughWeightGrams: 1000,
      loafCount: 1,
      hydrationPct: 75,
      starterPct: 20,
      starterHydrationPct: 100,
      saltPct: 2,
      flourBlend: [
        { name: 'Bread flour', percent: 80 },
        { name: 'Whole wheat flour', percent: 20 }
      ]
    });
    expect(r.formulaTotals?.totalFlourGrams).toBeCloseTo(564.97, 2);
    expect(r.flourBlend?.find((i) => i.name === 'Bread flour')?.weightGrams).toBeCloseTo(451.98, 2);
    expect(r.flourBlend?.find((i) => i.name === 'Whole wheat flour')?.weightGrams).toBeCloseTo(112.99, 2);
    expect(r.addToBowl?.filter((i) => i.role === 'flour').reduce((sum, item) => sum + item.weightGrams, 0)).toBeCloseTo(508.47, 2);
  });
});
