import type { FormulaWarning, Ingredient, PizzaDoughInput, StarterFeedingInput, StarterSplit } from '@/types/baking';
import { HYDRATION_HIGH_WARNING, HYDRATION_LOW_WARNING, LARGE_BATCH_GRAMS, LARGE_PIZZA_BALL_GRAMS, SALT_HIGH_WARNING, SMALL_PIZZA_BALL_GRAMS, STARTER_HIGH_WARNING } from '@/lib/bakingMath.constants';

export type Warn = FormulaWarning;
export type { Ingredient };

type CustomBakerIngredient = { name?: string; percentage?: number; weightGrams?: number };

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

export function splitStarterByHydration(starterWeightGrams: number, starterHydrationPct: number): StarterSplit {
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
  if (hydration < HYDRATION_LOW_WARNING) list.push(w('low-hydration', 'This is a very stiff dough. Check whether the hydration value is intended.'));
  if (hydration > HYDRATION_HIGH_WARNING) list.push(w('high-hydration', 'This is a very high-hydration dough and may be difficult to handle.'));
  if (salt > SALT_HIGH_WARNING) list.push(w('high-salt', 'Salt above 4% is unusually high for most bread formulas.'));
  if (starter > STARTER_HIGH_WARNING) list.push(w('high-starter', 'A high starter percentage can speed fermentation significantly.'));
  if (starterHydration !== 100) list.push(w('custom-starter-hydration', 'Starter has been split using your custom hydration setting.', 'info'));
  if (total > LARGE_BATCH_GRAMS) list.push(w('large-batch', 'Large batch. Check scale capacity and mixing method.'));
  if (ball && ball < SMALL_PIZZA_BALL_GRAMS) list.push(w('small-pizza-ball', 'This is a small dough ball. Check pizza size.'));
  if (ball && ball > LARGE_PIZZA_BALL_GRAMS) list.push(w('large-pizza-ball', 'This is a large dough ball. Check pizza size and style.'));
  return list;
};

const ingredient = (name: string, weight: number, base: number, note = '', role?: Ingredient['role']): Ingredient => ({ name, weightGrams: weight, bakerPercentage: bakerPercentage(weight, base), note, role });

function customByPercentage(flour: number, customIngredients: CustomBakerIngredient[] = []) {
  return customIngredients
    .filter((item) => (item.percentage ?? 0) > 0)
    .map((item, index) => ingredient(item.name?.trim() || `Custom ${index + 1}`, weightFromBakerPercentage(flour, item.percentage ?? 0), flour, 'Custom ingredient.', 'other'));
}

function customByWeight(flour: number, customIngredients: CustomBakerIngredient[] = []) {
  return customIngredients
    .filter((item) => (item.weightGrams ?? 0) > 0)
    .map((item, index) => ingredient(item.name?.trim() || `Custom ${index + 1}`, item.weightGrams ?? 0, flour, 'Custom ingredient.', 'other'));
}

export function calculateBakersPercentage(input: { flourWeightGrams: number; hydrationPct: number; starterPct: number; saltPct: number; oilPct?: number; sugarPct?: number; customIngredients?: CustomBakerIngredient[] }) {
  pos(input.flourWeightGrams, 'Flour weight');
  const flour = input.flourWeightGrams;
  const water = weightFromBakerPercentage(flour, input.hydrationPct);
  const starter = weightFromBakerPercentage(flour, input.starterPct);
  const salt = weightFromBakerPercentage(flour, input.saltPct);
  const oil = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugar = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const ingredients = [ingredient('Flour', flour, flour, 'Always 100%', 'flour'), ingredient('Water', water, flour, '', 'water'), ingredient('Starter', starter, flour, 'Starter is treated as total ingredient.', 'starter'), ingredient('Salt', salt, flour, '', 'salt')];
  if (oil) ingredients.push(ingredient('Oil', oil, flour, '', 'oil'));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour, '', 'sugar'));
  ingredients.push(...customByPercentage(flour, input.customIngredients));
  return { ingredients, totalDoughWeightGrams: ingredients.reduce((sum, item) => sum + item.weightGrams, 0), totalFormulaPct: ingredients.reduce((sum, item) => sum + (item.bakerPercentage ?? 0), 0), waterGrams: water, starterWeightGrams: starter, saltGrams: salt, warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct) };
}

export function calculateBakersPercentagesFromWeights(input: { flourWeightGrams: number; waterWeightGrams: number; starterWeightGrams?: number; saltWeightGrams?: number; oilWeightGrams?: number; sugarWeightGrams?: number; customIngredients?: CustomBakerIngredient[] }) {
  pos(input.flourWeightGrams, 'Flour weight');
  nonneg(input.waterWeightGrams, 'Water weight');
  const flour = input.flourWeightGrams;
  const water = input.waterWeightGrams;
  const starter = input.starterWeightGrams ?? 0;
  const salt = input.saltWeightGrams ?? 0;
  const oil = input.oilWeightGrams ?? 0;
  const sugar = input.sugarWeightGrams ?? 0;
  [starter, salt, oil, sugar].forEach((value, index) => nonneg(value, ['Starter weight', 'Salt weight', 'Oil weight', 'Sugar weight'][index]));
  const ingredients = [ingredient('Flour', flour, flour, 'Always 100%', 'flour'), ingredient('Water', water, flour, '', 'water'), ingredient('Starter', starter, flour, 'Starter is treated as total ingredient.', 'starter'), ingredient('Salt', salt, flour, '', 'salt')];
  if (oil) ingredients.push(ingredient('Oil', oil, flour, '', 'oil'));
  if (sugar) ingredients.push(ingredient('Sugar', sugar, flour, '', 'sugar'));
  ingredients.push(...customByWeight(flour, input.customIngredients));
  const totalFormulaPct = ingredients.reduce((sum, item) => sum + (item.bakerPercentage ?? 0), 0);
  return { ingredients, totalDoughWeightGrams: ingredients.reduce((sum, item) => sum + item.weightGrams, 0), totalFormulaPct, waterGrams: water, starterWeightGrams: starter, saltGrams: salt, warnings: warnings(bakerPercentage(water, flour), bakerPercentage(salt, flour), bakerPercentage(starter, flour)) };
}

export function calculateTotalHydration(input: { baseFlourGrams: number; addedWaterGrams: number; starter?: { weightGrams: number; hydrationPct: number } }) {
  pos(input.baseFlourGrams, 'Base flour');
  nonneg(input.addedWaterGrams, 'Added water');
  const starterSplit = input.starter ? splitStarterByHydration(input.starter.weightGrams, input.starter.hydrationPct) : undefined;
  const totalFlourGrams = input.baseFlourGrams + (starterSplit?.flourGrams ?? 0);
  const totalWaterGrams = input.addedWaterGrams + (starterSplit?.waterGrams ?? 0);
  return {
    totalFlourGrams,
    totalWaterGrams,
    addedHydrationPct: bakerPercentage(input.addedWaterGrams, input.baseFlourGrams),
    totalHydrationPct: bakerPercentage(totalWaterGrams, totalFlourGrams),
    starterSplit
  };
}

export function calculateSourdoughHydration(input: { mainFlourGrams: number; addedWaterGrams: number; starterWeightGrams: number; starterHydrationPct: number; saltWeightGrams: number }) {
  const hydration = calculateTotalHydration({ baseFlourGrams: input.mainFlourGrams, addedWaterGrams: input.addedWaterGrams, starter: { weightGrams: input.starterWeightGrams, hydrationPct: input.starterHydrationPct } });
  const starterSplit = hydration.starterSplit!;
  const saltPct = bakerPercentage(input.saltWeightGrams, hydration.totalFlourGrams);
  return {
    ...hydration,
    saltPct,
    totalDoughWeightGrams: input.mainFlourGrams + input.addedWaterGrams + input.starterWeightGrams + input.saltWeightGrams,
    ingredients: [ingredient('Main flour', input.mainFlourGrams, hydration.totalFlourGrams, '', 'flour'), ingredient('Added water', input.addedWaterGrams, hydration.totalFlourGrams, '', 'water'), ingredient('Starter', input.starterWeightGrams, hydration.totalFlourGrams, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`, 'starter'), ingredient('Salt', input.saltWeightGrams, hydration.totalFlourGrams, '', 'salt')],
    warnings: warnings(hydration.totalHydrationPct, saltPct, 0, input.starterHydrationPct)
  };
}

export function calculateDoughScaling(input: { mode: 'by-flour-weight' | 'by-target-dough-weight'; flourWeightGrams?: number; targetDoughWeightGrams?: number; loafCount: number; hydrationPct: number; starterPct: number; starterHydrationPct: number; saltPct: number; oilPct?: number; sugarPct?: number; yeastPct?: number }) {
  pos(input.loafCount, 'Loaf count');
  const flour = input.mode === 'by-target-dough-weight' ? baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: input.targetDoughWeightGrams ?? 0, hydrationPct: input.hydrationPct, starterPct: input.starterPct, saltPct: input.saltPct, oilPct: input.oilPct, sugarPct: input.sugarPct, yeastPct: input.yeastPct }) : (input.flourWeightGrams ?? 0);
  pos(flour, 'Flour weight');
  const addedWaterGrams = weightFromBakerPercentage(flour, input.hydrationPct);
  const starterWeightGrams = weightFromBakerPercentage(flour, input.starterPct);
  const saltGrams = weightFromBakerPercentage(flour, input.saltPct);
  const oilGrams = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugarGrams = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const yeastGrams = weightFromBakerPercentage(flour, input.yeastPct ?? 0);
  const hydration = calculateTotalHydration({ baseFlourGrams: flour, addedWaterGrams, starter: { weightGrams: starterWeightGrams, hydrationPct: input.starterHydrationPct } });
  const starterSplit = hydration.starterSplit!;
  const ingredients = [ingredient('Flour', flour, flour, '', 'flour'), ingredient('Added water', addedWaterGrams, flour, '', 'water'), ingredient('Starter', starterWeightGrams, flour, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`, 'starter'), ingredient('Salt', saltGrams, flour, '', 'salt')];
  if (oilGrams) ingredients.push(ingredient('Oil', oilGrams, flour, '', 'oil'));
  if (sugarGrams) ingredients.push(ingredient('Sugar', sugarGrams, flour, '', 'sugar'));
  if (yeastGrams) ingredients.push(ingredient('Yeast', yeastGrams, flour, '', 'yeast'));
  const total = ingredients.reduce((sum, item) => sum + item.weightGrams, 0);
  return { ingredients, perUnit: ingredients.map((item) => ({ ...item, weightGrams: item.weightGrams / input.loafCount })), totalDoughWeightGrams: total, baseFlourGrams: flour, addedWaterGrams, starterWeightGrams, starterFlourGrams: starterSplit.flourGrams, starterWaterGrams: starterSplit.waterGrams, totalFlourGrams: hydration.totalFlourGrams, totalWaterGrams: hydration.totalWaterGrams, addedHydrationPct: hydration.addedHydrationPct, totalHydrationPct: hydration.totalHydrationPct, saltGrams, oilGrams, sugarGrams, yeastGrams, perLoafWeightGrams: total / input.loafCount, warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct, input.starterHydrationPct, total) };
}

export function calculateStarterFeeding(input: StarterFeedingInput) {
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
  return { seedStarterGrams: seed, feedingFlourGrams: flour, feedingWaterGrams: water, finalStarterWeightGrams: input.targetStarterWeightGrams, retainedExtraStarterGrams: extra, totalNeededStarterGrams, ingredients: [{ name: 'Seed starter', weightGrams: seed, note: 'Existing mature starter.' }, { name: 'Flour', weightGrams: flour, note: 'Fresh flour.' }, { name: 'Water', weightGrams: water, note: 'Water for feeding.' }], warnings: extra ? [w('extra', 'Feed includes retained extra starter.', 'info')] : [] };
}

export function calculatePizzaDough(input: PizzaDoughInput) {
  pos(input.pizzaCount, 'Pizza count');
  pos(input.ballWeightGrams, 'Ball weight');
  const target = input.pizzaCount * input.ballWeightGrams;
  const leaveningPct = input.leaveningType === 'yeast' ? (input.yeastPct ?? 0) : (input.starterPct ?? 0);
  const flour = baseFlourFromTargetDoughWeight({ targetDoughWeightGrams: target, hydrationPct: input.hydrationPct, saltPct: input.saltPct, oilPct: input.oilPct, sugarPct: input.sugarPct, yeastPct: input.leaveningType === 'yeast' ? leaveningPct : 0, starterPct: input.leaveningType === 'sourdough' ? leaveningPct : 0 });
  const waterGrams = weightFromBakerPercentage(flour, input.hydrationPct);
  const saltGrams = weightFromBakerPercentage(flour, input.saltPct);
  const oilGrams = weightFromBakerPercentage(flour, input.oilPct ?? 0);
  const sugarGrams = weightFromBakerPercentage(flour, input.sugarPct ?? 0);
  const yeastGrams = input.leaveningType === 'yeast' ? weightFromBakerPercentage(flour, leaveningPct) : 0;
  const starterWeightGrams = input.leaveningType === 'sourdough' ? weightFromBakerPercentage(flour, leaveningPct) : 0;
  const ingredients = [ingredient('Flour', flour, flour, '', 'flour'), ingredient('Water', waterGrams, flour, '', 'water'), ingredient('Salt', saltGrams, flour, '', 'salt')];
  if (oilGrams) ingredients.push(ingredient('Oil', oilGrams, flour, '', 'oil'));
  if (sugarGrams) ingredients.push(ingredient('Sugar', sugarGrams, flour, '', 'sugar'));
  if (yeastGrams) ingredients.push(ingredient('Yeast', yeastGrams, flour, '', 'yeast'));
  let totalHydrationPct = input.hydrationPct;
  let starterFlourGrams = 0;
  let starterWaterGrams = 0;
  if (starterWeightGrams) {
    const starterSplit = splitStarterByHydration(starterWeightGrams, input.starterHydrationPct ?? 100);
    starterFlourGrams = starterSplit.flourGrams;
    starterWaterGrams = starterSplit.waterGrams;
    ingredients.push(ingredient('Starter', starterWeightGrams, flour, `${round(starterSplit.flourGrams)}g flour + ${round(starterSplit.waterGrams)}g water`, 'starter'));
    totalHydrationPct = bakerPercentage(waterGrams + starterSplit.waterGrams, flour + starterSplit.flourGrams);
  }
  return { ingredients, perUnit: ingredients.map((item) => ({ ...item, weightGrams: item.weightGrams / input.pizzaCount })), totalDoughWeightGrams: target, baseFlourGrams: flour, waterGrams, saltGrams, oilGrams, sugarGrams, yeastGrams, starterWeightGrams, starterFlourGrams, starterWaterGrams, totalHydrationPct, perBallWeightGrams: input.ballWeightGrams, warnings: warnings(input.hydrationPct, input.saltPct, input.starterPct ?? 0, input.starterHydrationPct ?? 100, target, input.ballWeightGrams) };
}
