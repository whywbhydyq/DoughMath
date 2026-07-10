import assert from 'node:assert/strict';
import {
  calculateBakersPercentage,
  calculateDoughScaling,
  calculatePizzaDough,
  calculateSourdoughHydration,
  calculateStarterFeeding,
  splitStarter
} from '../src/lib/bakingMath';
import { fromGrams, toGrams } from '../src/lib/units';

const close = (actual: number | undefined, expected: number, tolerance = 0.01) => {
  assert.notEqual(actual, undefined);
  assert.ok(Math.abs((actual as number) - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};

const starter = splitStarter(100, 100);
close(starter.flourGrams, 50);
close(starter.waterGrams, 50);

const bakers = calculateBakersPercentage({
  flourWeightGrams: 500,
  hydrationPct: 75,
  starterPct: 20,
  saltPct: 2
});
close(bakers.totalDoughWeightGrams, 985);
close(bakers.formulaTotals?.totalWaterGrams, 375);

const hydration = calculateSourdoughHydration({
  mainFlourGrams: 500,
  addedWaterGrams: 350,
  starterWeightGrams: 100,
  starterHydrationPct: 100,
  saltWeightGrams: 10
});
close(hydration.formulaTotals?.totalFlourGrams, 550);
close(hydration.formulaTotals?.totalWaterGrams, 400);
close(hydration.totalHydrationPct, 72.7272727, 0.001);

const feeding = calculateStarterFeeding({
  targetStarterWeightGrams: 100,
  extraGrams: 10,
  seedPart: 1,
  flourPart: 2,
  waterPart: 2
});
close(feeding.seedStarterGrams, 22);
close(feeding.feedingFlourGrams, 44);
close(feeding.feedingWaterGrams, 44);
close(feeding.finalStarterWeightGrams, 110);

const scaled = calculateDoughScaling({
  mode: 'by-target-dough-weight',
  targetDoughWeightGrams: 1000,
  loafCount: 2,
  hydrationPct: 75,
  starterPct: 20,
  starterHydrationPct: 100,
  saltPct: 2
});
close(scaled.totalDoughWeightGrams, 1000, 0.001);
assert.equal(scaled.perUnitLabel, 'Per loaf');
assert.ok((scaled.perUnit ?? []).length > 0);

const pizza = calculatePizzaDough({
  pizzaCount: 3,
  ballWeightGrams: 280,
  hydrationPct: 65,
  saltPct: 2.5,
  yeastPct: 0.2,
  leaveningType: 'yeast'
});
close(pizza.totalDoughWeightGrams, 840, 0.001);
assert.equal(pizza.perUnit?.length, pizza.addToBowl?.length);

close(toGrams(1, 'lb'), 453.59237, 0.00001);
close(fromGrams(28.349523125, 'oz'), 1, 0.00001);

assert.throws(() => splitStarter(-1, 100), /cannot be negative/);
assert.throws(() => calculateStarterFeeding({ targetStarterWeightGrams: 100, seedPart: 0, flourPart: 2, waterPart: 2 }), /greater than zero/);
assert.throws(() => calculateBakersPercentage({ flourWeightGrams: 500, hydrationPct: 70, starterPct: 0, saltPct: 2, flourBlend: [{ name: 'Bread', percent: 90 }] }), /add up to 100/);

console.log('DoughMath formula tests passed');
