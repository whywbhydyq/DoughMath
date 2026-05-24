import { describe, expect, it } from 'vitest';
import { calculateBakersPercentage, calculateDoughScaling, calculatePizzaDough, calculateSourdoughHydration, calculateStarterFeeding, splitStarterByHydration } from '@/lib/bakingMath';

const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 1);

describe('DoughMath formulas', () => {
  it('calculates baker percentages', () => {
    const result = calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2 });
    close(result.waterGrams, 375);
    close(result.starterWeightGrams, 100);
    close(result.saltGrams, 10);
    close(result.totalDoughWeightGrams, 985);
  });

  it('splits starter hydration', () => {
    let split = splitStarterByHydration(100, 100);
    close(split.flourGrams, 50);
    close(split.waterGrams, 50);
    split = splitStarterByHydration(150, 50);
    close(split.flourGrams, 100);
    close(split.waterGrams, 50);
  });

  it('calculates added and total sourdough hydration', () => {
    const result = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 });
    close(result.totalFlourGrams, 550);
    close(result.totalWaterGrams, 400);
    expect(result.addedHydrationPct).toBeCloseTo(70, 1);
    expect(result.totalHydrationPct).toBeCloseTo(72.7, 1);
  });

  it('scales target dough by loaf count', () => {
    const result = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1500, loafCount: 2, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    close(result.totalDoughWeightGrams, 1500);
    close(result.perLoafWeightGrams, 750);
    expect(result.totalHydrationPct).toBeGreaterThan(result.addedHydrationPct);
  });

  it('calculates starter feeding with final and retained amounts', () => {
    const result = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 20 });
    close(result.seedStarterGrams, 24);
    close(result.feedingFlourGrams, 48);
    close(result.feedingWaterGrams, 48);
    close(result.finalStarterWeightGrams, 100);
    close(result.retainedExtraStarterGrams, 20);
    close(result.totalNeededStarterGrams, 120);
  });

  it('calculates yeast pizza dough', () => {
    const result = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 2, yeastPct: 0.2, leaveningType: 'yeast' });
    close(result.totalDoughWeightGrams, 840);
    close(result.perBallWeightGrams, 280);
  });

  it('calculates sourdough pizza total hydration', () => {
    const result = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 2, starterPct: 20, starterHydrationPct: 100, leaveningType: 'sourdough' });
    close(result.totalDoughWeightGrams, 840);
    expect(result.totalHydrationPct).toBeGreaterThan(65);
  });
});
