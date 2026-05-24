export type CalculatorType = 'bakers-percentage' | 'sourdough-hydration' | 'starter-feeding' | 'dough-scaling' | 'pizza-dough';
export type Ingredient = { name: string; weightGrams: number; bakerPercentage?: number; note?: string };
export type StarterSplit = { flourGrams: number; waterGrams: number; hydrationPct: number };
export type FormulaWarning = { code: string; message: string };
export type DoughScalingInput = { mode: 'by-flour-weight' | 'by-target-dough-weight'; flourWeightGrams?: number; targetDoughWeightGrams?: number; loafCount: number; hydrationPct: number; starterPct: number; starterHydrationPct: number; saltPct: number; oilPct?: number; sugarPct?: number; yeastPct?: number };
export type StarterFeedingInput = { targetStarterWeightGrams: number; seedPart: number; flourPart: number; waterPart: number; extraGrams?: number };
export type PizzaDoughInput = { pizzaCount: number; ballWeightGrams: number; hydrationPct: number; saltPct: number; oilPct?: number; sugarPct?: number; yeastPct?: number; starterPct?: number; starterHydrationPct?: number; leaveningType: 'yeast' | 'sourdough' };
