export type UnitSystem = 'metric' | 'imperial';

export type CalculatorType =
  | 'bakers-percentage'
  | 'sourdough-hydration'
  | 'starter-feeding'
  | 'dough-scaling'
  | 'pizza-dough';

export type IngredientRole = 'flour' | 'water' | 'salt' | 'starter' | 'yeast' | 'oil' | 'sugar' | 'other';

export interface Ingredient {
  id?: string;
  name: string;
  weightGrams: number;
  bakerPercentage?: number;
  role?: IngredientRole;
  note?: string;
}

export interface StarterConfig {
  weightGrams: number;
  hydrationPct: number;
}

export interface StarterSplit {
  starterWeightGrams: number;
  flourGrams: number;
  waterGrams: number;
  hydrationPct: number;
}

export interface FormulaWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface DoughScalingInput {
  mode: 'by-flour-weight' | 'by-target-dough-weight';
  flourWeightGrams?: number;
  targetDoughWeightGrams?: number;
  loafCount: number;
  hydrationPct: number;
  starterPct: number;
  starterHydrationPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
}

export interface FeedingRatio {
  seedPart: number;
  flourPart: number;
  waterPart: number;
}

export interface StarterFeedingInput {
  targetStarterWeightGrams: number;
  seedPart: number;
  flourPart: number;
  waterPart: number;
  extraGrams?: number;
}

export interface PizzaDoughInput {
  pizzaCount: number;
  ballWeightGrams: number;
  hydrationPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
  starterPct?: number;
  starterHydrationPct?: number;
  leaveningType: 'yeast' | 'sourdough';
}
