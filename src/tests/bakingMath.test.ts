import { describe, expect, it } from 'vitest';
import { bakerPercentage, baseFlourFromTargetDoughWeight, calculateBakersPercentage, calculateBakersPercentagesFromWeights, calculateDoughScaling, calculatePizzaDough, calculateSourdoughHydration, calculateStarterFeeding, calculateTotalHydration, splitStarterByHydration } from '@/lib/bakingMath';

const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 1);

describe('DoughMath formulas', () => {
  it('calculates baker percentages from raw weights', () => {
    expect(bakerPercentage(700, 1000)).toBeCloseTo(70, 2);
    expect(bakerPercentage(20, 1000)).toBeCloseTo(2, 2);
  });

  it('calculates baker percentages from percentage inputs', () => {
    const result = calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2, customIngredients: [{ name: 'Seeds', percentage: 5 }] });
    close(result.waterGrams, 375);
    close(result.starterWeightGrams, 100);
    close(result.saltGrams, 10);
    close(result.totalDoughWeightGrams, 1010);
    close(result.totalFormulaPct, 202);
  });

  it('calculates baker percentages from ingredient weights', () => {
    const result = calculateBakersPercentagesFromWeights({ flourWeightGrams: 500, waterWeightGrams: 375, starterWeightGrams: 100, saltWeightGrams: 10, customIngredients: [{ name: 'Seeds', weightGrams: 25 }] });
    close(result.totalDoughWeightGrams, 1010);
    close(result.totalFormulaPct, 202);
    expect(result.ingredients.find((item) => item.name === 'Water')?.bakerPercentage).toBeCloseTo(75, 1);
    expect(result.ingredients.find((item) => item.name === 'Seeds')?.bakerPercentage).toBeCloseTo(5, 1);
  });

  it('calculates base flour from target dough weight', () => {
    const flour = baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: 1000, hydrationPct: 70, starterPct: 20, saltPct: 2 });
    expect(flour).toBeCloseTo(520.83, 2);
  });

  it('splits starter hydration at 50%, 100%, and 125%', () => {
    let split = splitStarterByHydration(100, 100);
    close(split.flourGrams, 50);
    close(split.waterGrams, 50);
    split = splitStarterByHydration(150, 50);
    close(split.flourGrams, 100);
    close(split.waterGrams, 50);
    split = splitStarterByHydration(225, 125);
    close(split.flourGrams, 100);
    close(split.waterGrams, 125);
  });

  it('calculates standalone total hydration', () => {
    const result = calculateTotalHydration({ baseFlourGrams: 1000, addedWaterGrams: 700, starter: { weightGrams: 200, hydrationPct: 100 } });
    close(result.totalFlourGrams, 1100);
    close(result.totalWaterGrams, 800);
    expect(result.totalHydrationPct).toBeCloseTo(72.73, 2);
  });

  it('calculates added and total sourdough hydration', () => {
    const result = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 });
    close(result.totalFlourGrams, 550);
    close(result.totalWaterGrams, 400);
    expect(result.addedHydrationPct).toBeCloseTo(70, 1);
    expect(result.totalHydrationPct).toBeCloseTo(72.7, 1);
  });

  it('scales target dough by loaf count', () => {
    const result = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1000, loafCount: 2, hydrationPct: 70, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    close(result.baseFlourGrams, 520.83);
    close(result.starterWeightGrams, 104.17);
    close(result.saltGrams, 10.42);
    close(result.totalDoughWeightGrams, 1000);
    close(result.perLoafWeightGrams, 500);
  });

  it('calculates starter feeding with final and retained amounts', () => {
    const result = calculateStarterFeeding({ targetStarterWeightGrams: 150, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 0 });
    close(result.seedStarterGrams, 30);
    close(result.feedingFlourGrams, 60);
    close(result.feedingWaterGrams, 60);
    close(result.finalStarterWeightGrams, 150);
  });

  it('calculates yeast pizza dough', () => {
    const result = calculatePizzaDough({ pizzaCount: 4, ballWeightGrams: 250, hydrationPct: 65, saltPct: 2.5, oilPct: 2, yeastPct: 0.2, leaveningType: 'yeast' });
    close(result.totalDoughWeightGrams, 1000);
    close(result.baseFlourGrams, 589.28);
    close(result.perBallWeightGrams, 250);
  });

  it('calculates sourdough pizza total hydration', () => {
    const result = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 2, starterPct: 20, starterHydrationPct: 100, leaveningType: 'sourdough' });
    close(result.totalDoughWeightGrams, 840);
    expect(result.totalHydrationPct).toBeGreaterThan(65);
  });
});
