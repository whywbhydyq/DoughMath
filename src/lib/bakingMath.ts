export type Warn = { code: string; message: string; severity: 'info' | 'warning' | 'error' };
export type Ingredient = { name: string; weightGrams: number; bakerPercentage?: number; note?: string };

const pos = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be greater than 0.`);
};
const nonneg = (value: number, name: string) => {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be 0 or greater.`);
};
const w = (code: string, message: string, severity: Warn['severity'] = 'warning'): Warn => ({ code, message, severity });

export const round = (value: number, decimals = 1) => Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
export const grams = (value: number) => `${round(value, value < 10 ? 1 : 0)} g`;
export const pct = (value: number) => `${round(value, 1)}%`;

export function bakerPercentage(ingredientWeightGrams: number, totalFlourWeightGrams: number) {
  nonneg(ingredientWeightGrams, 'Ingredient weight');
  pos(totalFlourWeightGrams, 'Total flour weight');
  return (ingredientWeightGrams / totalFlourWeightGrams) * 100;
}

export function weightFromBakerPercentage(flourWeightGrams: number, percentage: number) {
  pos(flourWeightGrams, 'Flour weight');
  nonneg(percentage, "Baker's percentage");
  return (flourWeightGrams * percentage) / 100;
}

export function splitStarterByHydration(starterWeightGrams: number, starterHydrationPct: number) {
  nonneg(starterWeightGrams, 'Starter weight');
  pos(starterHydrationPct, 'Starter hydration');
  const flourGrams = starterWeightGrams / (1 + starterHydrationPct / 100);
  return { starterWeightGrams, flourGrams, waterGrams: starterWeightGrams - flourGrams, hydrationPct: starterHydrationPct };
}

export function baseFlourFromTargetDoughWeight(input: { targetDoughWeightGrams: number; hydrationPct: number; starterPct?: number; saltPct?: number; oilPct?: number; sugarPct?: number; yeastPct?: number }) {
  pos(input.targetDoughWeightGrams, 'Target dough weight');
  pos(input.hydrationPct, 'Hydration');
  const totalPct = 100 + input.hydrationPct + (input.starterPct ?? 0) + (input.saltPct ?? 0) + (input.oilPct ?? 0) + (input.sugarPct ?? 0) + (input.yeastPct ?? 0);
  return input.targetDoughWeightGrams / (totalPct / 100);
}

const warnings = (hydration: number, salt = 0, starter = 0, starterHydration = 100, total = 0, ball = 0) => {
  const list: Warn[] = [];
  if (hydration < 40) list.push(w('low-hydration', 'This is a very stiff dough. Check whether the hydration value is intended.'));
  if (hydration > 100) list.push(w('high-hydration', 'This is a very high-hydration dough and may be difficult to handle.'));
  if (salt > 4) list.push(w('high-salt', 'Salt above 4% is unusually high for most bread formulas.'));
  if (starter > 60) list.push(w('high-starter', 'A high starter percentage can speed fermentation significantly.'));
  if (starterHydration !== 100) list.push(w('custom-starter-hydration', 'Starter has been split using your custom hydration setting.', 'info'));
  if (total > 10000) list.push(w('large-batch', 'Large batch. Check scale capacity and mixing method.'));
  if (ball && ball < 120) list.push(w('small-pizza-ball', 'This is a small dough ball. Check pizza size.'));
  if (ball && ball > 500) list.push(w('large-pizza-ball', 'This is a large dough ball. Check pizza size and style.'));
  return list;
};

const ingredient = (name: string, weight: number, base: number, note = ''): Ingredient => ({ name, weightGrams: weight, bakerPercentage: bakerPercentage(weight, base), note });

export function calculateBakersPercentage(input: { flourWeightGrams: number; hydrationPct: number; starterPct: number; saltPct: number; oilPct?: number; sugarPct?: number }) {
  pos(input.flourWeightGrams, 'Flour weight');
  const flour = input.flourWeightGrams;
  const water = weightFromBakerPercentage(flour, input.hydrationPct);
  const starter = weightFromBakerPercentage(flour, input.starterPct);
  const salt = weightFromBakerPercentage(flour, input.saltPct);
  const oil = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugar = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const ingredients = [ingredient('Flour', flour, flour, 'Always 100%'), ingredient('Water', water, flour), ingredient('Starter', starter, flour, 'Starter is treated as total ingredient.'), ingredient('Salt', salt, flour)];
  if (oil) ingredients.push(ingredient('Oil', oil, flour));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour));
  return { ingredients, totalDoughWeightGrams: ingredients.reduce((sum, item) => sum + item.weightGrams, 0), totalFormulaPct: ingredients.reduce((sum, item) => sum + (item.bakerPercentage ?? 0), 0), waterGrams: water, starterWeightGrams: starter, saltGrams: salt, warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct) };
}

export function calculateBakersPercentagesFromWeights(input: { flourWeightGrams: number; waterWeightGrams: number; starterWeightGrams?: number; saltWeightGrams?: number; oilWeightGrams?: number; sugarWeightGrams?: number }) {
  pos(input.flourWeightGrams, 'Flour weight');
  nonneg(input.waterWeightGrams, 'Water weight');
  const flour = input.flourWeightGrams;
  const water = input.waterWeightGrams;
  const starter = input.starterWeightGrams ?? 0;
  const salt = input.saltWeightGrams ?? 0;
  const oil = input.oilWeightGrams ?? 0;
  const sugar = input.sugarWeightGrams ?? 0;
  [starter, salt, oil, sugar].forEach((value, index) => nonneg(value, ['Starter weight', 'Salt weight', 'Oil weight', 'Sugar weight'][index]));
  const ingredients = [ingredient('Flour', flour, flour, 'Always 100%'), ingredient('Water', water, flour), ingredient('Starter', starter, flour, 'Starter is treated as total ingredient.'), ingredient('Salt', salt, flour)];
  if (oil) ingredients.push(ingredient('Oil', oil, flour));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour));
  const totalFormulaPct = ingredients.reduce((sum, item) => sum + (item.bakerPercentage ?? 0), 0);
  return { ingredients, totalDoughWeightGrams: ingredients.reduce((sum, item) => sum + item.weightGrams, 0), totalFormulaPct, waterGrams: water, starterWeightGrams: starter, saltGrams: salt, warnings: warnings(bakerPercentage(water, flour), bakerPercentage(salt, flour), bakerPercentage(starter, flour)) };
}

export function calculateSourdoughHydration(input: { mainFlourGrams: number; addedWaterGrams: number; starterWeightGrams: number; starterHydrationPct: number; saltWeightGrams: number }) {
  pos(input.mainFlourGrams, 'Main flour');
  const starterSplit = splitStarterByHydration(input.starterWeightGrams, input.starterHydrationPct);
  const totalFlour = input.mainFlourGrams + starterSplit.flourGrams;
  const totalWater = input.addedWaterGrams + starterSplit.waterGrams;
  const addedHydration = bakerPercentage(input.addedWaterGrams, input.mainFlourGrams);
  const totalHydration = bakerPercentage(totalWater, totalFlour);
  const saltPct = bakerPercentage(input.saltWeightGrams, totalFlour);
  return {
    starterSplit,
    totalFlourGrams: totalFlour,
    totalWaterGrams: totalWater,
    addedHydrationPct: addedHydration,
    totalHydrationPct: totalHydration,
    saltPct,
    totalDoughWeightGrams: input.mainFlourGrams + input.addedWaterGrams + input.starterWeightGrams + input.saltWeightGrams,
    ingredients: [ingredient('Main flour', input.mainFlourGrams, totalFlour), ingredient('Added water', input.addedWaterGrams, totalFlour), ingredient('Starter', input.starterWeightGrams, totalFlour, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`), ingredient('Salt', input.saltWeightGrams, totalFlour)],
    warnings: warnings(totalHydration, saltPct, 0, input.starterHydrationPct)
  };
}

export function calculateDoughScaling(input: { mode: 'by-flour-weight' | 'by-target-dough-weight'; flourWeightGrams?: number; targetDoughWeightGrams?: number; loafCount: number; hydrationPct: number; starterPct: number; starterHydrationPct: number; saltPct: number; oilPct?: number; sugarPct?: number }) {
  pos(input.loafCount, 'Loaf count');
  const flour = input.mode === 'by-target-dough-weight' ? baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: input.targetDoughWeightGrams ?? 0, hydrationPct: input.hydrationPct, starterPct: input.starterPct, saltPct: input.saltPct, oilPct: input.oilPct, sugarPct: input.sugarPct }) : (input.flourWeightGrams ?? 0);
  pos(flour, 'Flour weight');
  const water = weightFromBakerPercentage(flour, input.hydrationPct);
  const starter = weightFromBakerPercentage(flour, input.starterPct);
  const salt = weightFromBakerPercentage(flour, input.saltPct);
  const oil = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugar = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const starterSplit = splitStarterByHydration(starter, input.starterHydrationPct);
  const ingredients = [ingredient('Flour', flour, flour), ingredient('Added water', water, flour), ingredient('Starter', starter, flour, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`), ingredient('Salt', salt, flour)];
  if (oil) ingredients.push(ingredient('Oil', oil, flour));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour));
  const total = ingredients.reduce((sum, item) => sum + item.weightGrams, 0);
  const totalFlour = flour + starterSplit.flourGrams;
  const totalWater = water + starterSplit.waterGrams;
  return { ingredients, perUnit: ingredients.map((item) => ({ ...item, weightGrams: item.weightGrams / input.loafCount })), totalDoughWeightGrams: total, perLoafWeightGrams: total / input.loafCount, totalFlourGrams: totalFlour, totalWaterGrams: totalWater, addedHydrationPct: bakerPercentage(water, flour), totalHydrationPct: bakerPercentage(totalWater, totalFlour), warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct, input.starterHydrationPct, total) };
}

export function calculateStarterFeeding(input: { targetStarterWeightGrams: number; seedPart: number; flourPart: number; waterPart: number; extraGrams?: number }) {
  pos(input.targetStarterWeightGrams, 'Target starter weight');
  pos(input.seedPart, 'Seed part');
  pos(input.flourPart, 'Flour part');
  pos(input.waterPart, 'Water part');
  const extra = input.extraGrams ?? 0;
  nonneg(extra, 'Extra starter');
  const totalNeededStarterGrams = input.targetStarterWeightGrams + extra;
  const parts = input.seedPart + input.flourPart + input.waterPart;
  const seed = totalNeededStarterGrams * input.seedPart / parts;
  const flour = totalNeededStarterGrams * input.flourPart / parts;
  const water = totalNeededStarterGrams * input.waterPart / parts;
  return {
    seedStarterGrams: seed,
    feedingFlourGrams: flour,
    feedingWaterGrams: water,
    finalStarterWeightGrams: input.targetStarterWeightGrams,
    retainedExtraStarterGrams: extra,
    totalNeededStarterGrams,
    ingredients: [
      { name: 'Seed starter', weightGrams: seed, note: 'Existing mature starter.' },
      { name: 'Flour', weightGrams: flour, note: 'Fresh flour.' },
      { name: 'Water', weightGrams: water, note: 'Water for feeding.' }
    ],
    warnings: extra ? [w('extra', 'Feed includes retained extra starter.', 'info')] : []
  };
}

export function calculatePizzaDough(input: { pizzaCount: number; ballWeightGrams: number; hydrationPct: number; saltPct: number; oilPct?: number; sugarPct?: number; yeastPct?: number; starterPct?: number; starterHydrationPct?: number; leaveningType: 'yeast' | 'sourdough' }) {
  pos(input.pizzaCount, 'Pizza count');
  pos(input.ballWeightGrams, 'Ball weight');
  const target = input.pizzaCount * input.ballWeightGrams;
  const leaveningPct = input.leaveningType === 'yeast' ? (input.yeastPct ?? 0) : (input.starterPct ?? 0);
  const flour = baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: target, hydrationPct: input.hydrationPct, saltPct: input.saltPct, oilPct: input.oilPct, sugarPct: input.sugarPct, yeastPct: input.leaveningType === 'yeast' ? leaveningPct : 0, starterPct: input.leaveningType === 'sourdough' ? leaveningPct : 0 });
  const water = weightFromBakerPercentage(flour, input.hydrationPct);
  const salt = weightFromBakerPercentage(flour, input.saltPct);
  const oil = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugar = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const yeast = input.leaveningType === 'yeast' ? weightFromBakerPercentage(flour, leaveningPct) : 0;
  const starter = input.leaveningType === 'sourdough' ? weightFromBakerPercentage(flour, leaveningPct) : 0;
  const ingredients = [ingredient('Flour', flour, flour), ingredient('Water', water, flour), ingredient('Salt', salt, flour)];
  if (oil) ingredients.push(ingredient('Oil', oil, flour));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour));
  if (yeast) ingredients.push(ingredient('Yeast', yeast, flour));
  let totalHydrationPct = input.hydrationPct;
  if (starter) {
    const starterSplit = splitStarterByHydration(starter, input.starterHydrationPct ?? 100);
    ingredients.push(ingredient('Starter', starter, flour, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`));
    totalHydrationPct = bakerPercentage(water + starterSplit.waterGrams, flour + starterSplit.flourGrams);
  }
  return { ingredients, perUnit: ingredients.map((item) => ({ ...item, weightGrams: item.weightGrams / input.pizzaCount })), totalDoughWeightGrams: target, perBallWeightGrams: input.ballWeightGrams, totalHydrationPct, warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct ?? 0, input.starterHydrationPct ?? 100, target, input.ballWeightGrams) };
}
