import { describe, expect, it } from 'vitest';
import {
  bakerPercentage,
  baseFlourFromTargetDoughWeight,
  calculateBakersPercentage,
  calculateBakersPercentagesFromWeights,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding,
  calculateTotalHydration,
  splitStarterByHydration,
  totalFlourFromSourdoughTargetDoughWeight
} from '@/lib/bakingMath';

const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 1);

describe('DoughMath formulas', () => {
  it('calculates baker percentages from raw weights', () => {
    expect(bakerPercentage(700, 1000)).toBeCloseTo(70, 2);
    expect(bakerPercentage(20, 1000)).toBeCloseTo(2, 2);
  });

  it('matches the MVP baker percentage weights case', () => {
    const result = calculateBakersPercentagesFromWeights({ flourWeightGrams: 500, waterWeightGrams: 375, saltWeightGrams: 10 });
    close(result.totalDoughWeightGrams, 885);
    expect(result.ingredients.find((item) => item.name === 'Water')?.bakerPercentage).toBeCloseTo(75, 1);
    expect(result.ingredients.find((item) => item.name === 'Salt')?.bakerPercentage).toBeCloseTo(2, 1);
  });

  it('matches the MVP baker percentage to grams case', () => {
    const result = calculateBakersPercentage({ flourWeightGrams: 1000, hydrationPct: 70, starterPct: 0, saltPct: 2 });
    close(result.waterGrams, 700);
    close(result.saltGrams, 20);
    close(result.totalDoughWeightGrams, 1720);
  });

  it('calculates baker percentages with custom ingredients', () => {
    const result = calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 75, starterPct: 20, saltPct: 2, customIngredients: [{ name: 'Seeds', percentage: 5 }] });
    close(result.totalDoughWeightGrams, 1010);
    close(result.totalFormulaPct, 202);
  });

  it('keeps generic target flour available for non-sourdough additive formulas', () => {
    const flour = baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: 840, hydrationPct: 65, saltPct: 2.5, yeastPct: 0.2 });
    expect(flour).toBeCloseTo(500.89, 2);
  });

  it('uses strict sourdough target flour without counting starter as an extra ingredient', () => {
    const flour = totalFlourFromSourdoughTargetDoughWeight({ targetDoughWeightGrams: 1000, hydrationPct: 75, saltPct: 2 });
    expect(flour).toBeCloseTo(564.97, 2);
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

  it('matches the MVP sourdough hydration case', () => {
    const result = calculateSourdoughHydration({ mainFlourGrams: 500, addedWaterGrams: 350, starterWeightGrams: 100, starterHydrationPct: 100, saltWeightGrams: 10 });
    close(result.starterSplit.flourGrams, 50);
    close(result.starterSplit.waterGrams, 50);
    close(result.totalFlourGrams, 550);
    close(result.totalWaterGrams, 400);
    expect(result.addedHydrationPct).toBeCloseTo(70, 1);
    expect(result.totalHydrationPct).toBeCloseTo(72.7, 1);
    expect(result.saltPct).toBeCloseTo(1.8, 1);
    close(result.totalDoughWeightGrams, 960);
  });

  it('matches the MVP strict target dough scaling case', () => {
    const result = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1000, loafCount: 1, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    close(result.totalFlourGrams, 564.97);
    close(result.totalWaterGrams, 423.73);
    close(result.saltGrams, 11.3);
    close(result.starterWeightGrams, 112.99);
    close(result.starterFlourGrams, 56.5);
    close(result.starterWaterGrams, 56.5);
    close(result.addedFlourGrams, 508.47);
    close(result.addedWaterGrams, 367.23);
    close(result.totalDoughWeightGrams, 1000);
    close(result.perLoafWeightGrams, 1000);
  });

  it('scales two 750g loaves from the strict target dough formula', () => {
    const result = calculateDoughScaling({ mode: 'by-target-dough-weight', targetDoughWeightGrams: 1500, loafCount: 2, hydrationPct: 75, starterPct: 20, starterHydrationPct: 100, saltPct: 2 });
    close(result.totalDoughWeightGrams, 1500);
    close(result.perLoafWeightGrams, 750);
    close(result.perUnit[0].weightGrams, result.ingredients[0].weightGrams / 2);
  });

  it('calculates starter feeding with extra kept starter', () => {
    const result = calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 1, flourPart: 2, waterPart: 2, extraGrams: 10 });
    close(result.totalNeededStarterGrams, 110);
    close(result.seedStarterGrams, 22);
    close(result.feedingFlourGrams, 44);
    close(result.feedingWaterGrams, 44);
    close(result.finalStarterWeightGrams, 100);
    close(result.retainedExtraStarterGrams, 10);
  });

  it('matches the MVP yeast pizza dough case', () => {
    const result = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 0, sugarPct: 0, yeastPct: 0.2, leaveningType: 'yeast' });
    close(result.totalDoughWeightGrams, 840);
    expect(result.baseFlourGrams).toBeCloseTo(500.89, 2);
    expect(result.waterGrams).toBeCloseTo(325.58, 2);
    expect(result.saltGrams).toBeCloseTo(12.52, 2);
    expect(result.yeastGrams).toBeCloseTo(1, 1);
  });

  it('calculates sourdough pizza without counting starter twice', () => {
    const result = calculatePizzaDough({ pizzaCount: 3, ballWeightGrams: 280, hydrationPct: 65, saltPct: 2.5, oilPct: 2, starterPct: 20, starterHydrationPct: 100, leaveningType: 'sourdough' });
    close(result.totalDoughWeightGrams, 840);
    expect(result.totalFlourGrams).toBeCloseTo(495.58, 2);
    expect(result.totalWaterGrams).toBeCloseTo(322.12, 2);
    expect(result.starterWeightGrams).toBeCloseTo(99.12, 2);
    expect(result.addedFlourGrams).toBeCloseTo(446.02, 2);
    expect(result.addedWaterGrams).toBeCloseTo(272.57, 2);
    expect(result.totalHydrationPct).toBeCloseTo(65, 2);
  });
});
