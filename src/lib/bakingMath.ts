import type {
  CalculatorResult,
  CustomIngredientInput,
  DoughScalingInput,
  FlourBlendItem,
  FormulaWarning,
  Ingredient,
  PizzaDoughInput,
  StarterFeedingInput,
  StarterSplit
} from '../types/baking';

export type Warn = FormulaWarning;
export type { Ingredient } from '../types/baking';

export const round = (value: number, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits;
export const pct = (value: number) => `${round(value)}%`;
export const grams = (value: number) => `${Math.round(value)} g`;

const EPSILON = 0.000001;

function assertNonNegative(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} cannot be negative.`);
}

function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be greater than zero.`);
}

function optionalPct(value?: number) {
  return Number.isFinite(value ?? 0) ? value ?? 0 : 0;
}

export function splitStarter(starterWeightGrams: number, starterHydrationPct: number): StarterSplit {
  assertNonNegative('starter weight', starterWeightGrams);
  assertNonNegative('starter hydration', starterHydrationPct);
  if (starterWeightGrams === 0) {
    return { starterWeightGrams: 0, flourGrams: 0, waterGrams: 0, hydrationPct: starterHydrationPct };
  }
  const flourGrams = starterWeightGrams / (1 + starterHydrationPct / 100);
  return { starterWeightGrams, flourGrams, waterGrams: starterWeightGrams - flourGrams, hydrationPct: starterHydrationPct };
}

function validateFlourBlend(blend?: FlourBlendItem[]) {
  const cleaned = (blend ?? [])
    .map((item) => ({ name: item.name.trim() || 'Flour', percent: item.percent }))
    .filter((item) => item.percent > 0);
  if (!cleaned.length) return [{ name: 'Bread flour', percent: 100 }];
  const total = cleaned.reduce((sum, item) => sum + item.percent, 0);
  if (Math.abs(total - 100) > 0.05) {
    throw new Error(`Flour blend must add up to 100%. Current total is ${round(total)}%.`);
  }
  return cleaned;
}

function flourBlendItems(totalFlourGrams: number, blend?: FlourBlendItem[], note = 'Flour blend'): Ingredient[] {
  return validateFlourBlend(blend).map((item) => ({
    name: item.name,
    role: 'flour',
    weightGrams: totalFlourGrams * item.percent / 100,
    bakerPercentage: item.percent,
    note
  }));
}

function addedFlourBlendItems(totalFlourGrams: number, starterFlourGrams: number, blend?: FlourBlendItem[]): Ingredient[] {
  let starterFlourRemaining = Math.max(0, starterFlourGrams);
  return validateFlourBlend(blend)
    .map((item) => {
      const formulaWeight = totalFlourGrams * item.percent / 100;
      const starterContribution = Math.min(formulaWeight, starterFlourRemaining);
      starterFlourRemaining -= starterContribution;
      return {
        name: item.name,
        role: 'flour' as const,
        weightGrams: formulaWeight - starterContribution,
        bakerPercentage: item.percent,
        note: starterContribution > EPSILON
          ? `Total formula share; ${grams(starterContribution)} is already contributed by starter flour.`
          : 'Total formula share; no starter flour deducted from this line.'
      };
    })
    .filter((item) => item.weightGrams > EPSILON);
}

function normalizeCustomIngredient(input: CustomIngredientInput, flourWeightGrams: number): Ingredient | undefined {
  const name = input.name.trim() || 'Custom ingredient';
  const percentage = input.lockMode === 'weight'
    ? (input.weightGrams ?? 0) / flourWeightGrams * 100
    : (input.percentage ?? 0);
  const weightGrams = input.lockMode === 'weight'
    ? (input.weightGrams ?? 0)
    : flourWeightGrams * percentage / 100;
  if (!Number.isFinite(weightGrams) || weightGrams <= EPSILON) return undefined;
  return { name, role: 'other', weightGrams, bakerPercentage: percentage, note: input.lockMode === 'weight' ? 'Custom; weight locked' : 'Custom; percentage locked' };
}

function warnings(input: {
  hydrationPct?: number;
  addedHydrationPct?: number;
  saltPct?: number;
  starterPct?: number;
  starterHydrationPct?: number;
  loafCount?: number;
  pizzaCount?: number;
  flourBlend?: FlourBlendItem[];
}): Warn[] {
  const out: Warn[] = [];
  const hydration = input.hydrationPct ?? input.addedHydrationPct ?? 0;
  if (hydration > 0 && hydration < 55) out.push({ code: 'low-hydration', level: 'info', message: 'This is a low hydration dough. It may feel stiff and may be better suited for bagels, pretzels, or some pizza styles.' });
  if (hydration > 100) out.push({ code: 'very-high-hydration', level: 'warning', message: 'This is a very high hydration dough and may be sticky and difficult to handle, especially for beginners.' });
  else if (hydration > 85) out.push({ code: 'high-hydration', level: 'info', message: 'Hydration is high; expect a wetter dough.' });
  if ((input.saltPct ?? 0) > 3) out.push({ code: 'high-salt', level: 'warning', message: 'This salt percentage is higher than most bread formulas. Check whether you entered grams or percent correctly.' });
  if ((input.starterPct ?? 0) > 60) out.push({ code: 'high-starter', level: 'warning', message: 'This formula uses a large amount of starter. It may ferment faster than expected.' });
  if ((input.starterHydrationPct ?? 100) === 0) out.push({ code: 'stiff-starter', level: 'info', message: 'A 0% hydration starter would contain no water. Check this value if that is not intentional.' });
  if ((input.starterHydrationPct ?? 0) > 200) out.push({ code: 'liquid-starter', level: 'warning', message: 'This is an unusually liquid starter. The calculator can still run, but check your input.' });
  if ((input.loafCount ?? 0) > 24) out.push({ code: 'large-loaf-count', level: 'info', message: 'This is a large batch. Check mixer capacity, bowl size, and proofing space.' });
  if ((input.pizzaCount ?? 0) > 20) out.push({ code: 'large-pizza-count', level: 'info', message: 'This is a large pizza batch. Check tray space and cold fermentation containers.' });
  if ((input.flourBlend ?? []).some((item) => /whole|wheat|rye/i.test(item.name) && item.percent > 0)) {
    out.push({ code: 'whole-grain-water-note', level: 'info', message: 'Whole wheat and rye often absorb more water. Use the result as a starting point and adjust by dough feel.' });
  }
  return out;
}

function sum(items: Ingredient[]) {
  return items.reduce((total, item) => total + item.weightGrams, 0);
}

function perUnit(items: Ingredient[], count: number): Ingredient[] {
  assertPositive('unit count', count);
  return items.map((item) => ({ ...item, weightGrams: item.weightGrams / count }));
}

function resultFromSections(args: Omit<CalculatorResult, 'ingredients' | 'totalDoughWeightGrams'> & { ingredients?: Ingredient[]; totalDoughWeightGrams?: number }): CalculatorResult {
  const ingredients = args.ingredients ?? args.addToBowl ?? [];
  const totalDoughWeightGrams = args.totalDoughWeightGrams ?? args.formulaTotals?.totalDoughWeightGrams ?? sum(ingredients);
  return { ...args, ingredients, totalDoughWeightGrams, warnings: args.warnings ?? [] };
}

export function calculateBakersPercentage(input: {
  flourWeightGrams: number;
  hydrationPct: number;
  starterPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  customIngredients?: CustomIngredientInput[];
  flourBlend?: FlourBlendItem[];
}): CalculatorResult {
  assertPositive('flour', input.flourWeightGrams);
  const flour = input.flourWeightGrams;
  const addToBowl: Ingredient[] = [
    ...flourBlendItems(flour, input.flourBlend),
    { name: 'Water', role: 'water', weightGrams: flour * input.hydrationPct / 100, bakerPercentage: input.hydrationPct, note: 'Added water' },
    { name: 'Starter', role: 'starter', weightGrams: flour * input.starterPct / 100, bakerPercentage: input.starterPct, note: 'Total starter weight' },
    { name: 'Salt', role: 'salt', weightGrams: flour * input.saltPct / 100, bakerPercentage: input.saltPct, note: 'Salt' }
  ];
  if (optionalPct(input.oilPct) > 0) addToBowl.push({ name: 'Oil', role: 'oil', weightGrams: flour * optionalPct(input.oilPct) / 100, bakerPercentage: optionalPct(input.oilPct), note: 'Optional' });
  if (optionalPct(input.sugarPct) > 0) addToBowl.push({ name: 'Sugar', role: 'sugar', weightGrams: flour * optionalPct(input.sugarPct) / 100, bakerPercentage: optionalPct(input.sugarPct), note: 'Optional' });
  (input.customIngredients ?? []).forEach((item) => {
    const normalized = normalizeCustomIngredient(item, flour);
    if (normalized) addToBowl.push(normalized);
  });
  const total = sum(addToBowl);
  const totalFormulaPct = addToBowl.reduce((value, item) => value + (item.bakerPercentage ?? 0), 0);
  return resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    formulaTotals: { totalFlourGrams: flour, totalWaterGrams: flour * input.hydrationPct / 100, totalDoughWeightGrams: total, totalFormulaPct, saltPct: input.saltPct },
    totalFormulaPct,
    warnings: warnings({ hydrationPct: input.hydrationPct, saltPct: input.saltPct, starterPct: input.starterPct, flourBlend: input.flourBlend })
  });
}

export function calculateBakersPercentagesFromWeights(input: {
  flourWeightGrams: number;
  waterWeightGrams: number;
  starterWeightGrams: number;
  saltWeightGrams: number;
  oilWeightGrams?: number;
  sugarWeightGrams?: number;
  customIngredients?: CustomIngredientInput[];
  flourBlend?: FlourBlendItem[];
}): CalculatorResult {
  assertPositive('flour', input.flourWeightGrams);
  const flour = input.flourWeightGrams;
  const add = (name: string, weightGrams: number, note: string, role: Ingredient['role']): Ingredient => ({ name, role, weightGrams, bakerPercentage: weightGrams / flour * 100, note });
  const addToBowl = [
    ...flourBlendItems(flour, input.flourBlend),
    add('Water', input.waterWeightGrams, 'Added water', 'water'),
    add('Starter', input.starterWeightGrams, 'Total starter weight', 'starter'),
    add('Salt', input.saltWeightGrams, 'Salt', 'salt')
  ];
  if ((input.oilWeightGrams ?? 0) > 0) addToBowl.push(add('Oil', input.oilWeightGrams ?? 0, 'Optional', 'oil'));
  if ((input.sugarWeightGrams ?? 0) > 0) addToBowl.push(add('Sugar', input.sugarWeightGrams ?? 0, 'Optional', 'sugar'));
  (input.customIngredients ?? []).forEach((item) => {
    const normalized = normalizeCustomIngredient({ ...item, lockMode: 'weight' }, flour);
    if (normalized) addToBowl.push({ ...normalized, note: 'Custom; weight locked' });
  });
  const hydrationPct = input.waterWeightGrams / flour * 100;
  const saltPct = input.saltWeightGrams / flour * 100;
  const starterPct = input.starterWeightGrams / flour * 100;
  const total = sum(addToBowl);
  const totalFormulaPct = addToBowl.reduce((value, item) => value + (item.bakerPercentage ?? 0), 0);
  return resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    formulaTotals: { totalFlourGrams: flour, totalWaterGrams: input.waterWeightGrams, totalDoughWeightGrams: total, totalFormulaPct, saltPct },
    totalFormulaPct,
    warnings: warnings({ hydrationPct, saltPct, starterPct, flourBlend: input.flourBlend })
  });
}

export function calculateSourdoughHydration(input: {
  mainFlourGrams: number;
  addedWaterGrams: number;
  starterWeightGrams: number;
  starterHydrationPct: number;
  saltWeightGrams: number;
  flourBlend?: FlourBlendItem[];
}): CalculatorResult {
  assertPositive('main flour', input.mainFlourGrams);
  assertNonNegative('added water', input.addedWaterGrams);
  assertNonNegative('salt', input.saltWeightGrams);
  const starterSplit = splitStarter(input.starterWeightGrams, input.starterHydrationPct);
  const totalFlourGrams = input.mainFlourGrams + starterSplit.flourGrams;
  const totalWaterGrams = input.addedWaterGrams + starterSplit.waterGrams;
  const addedHydrationPct = input.addedWaterGrams / input.mainFlourGrams * 100;
  const totalHydrationPct = totalWaterGrams / totalFlourGrams * 100;
  const saltPct = input.saltWeightGrams / totalFlourGrams * 100;
  const addToBowl: Ingredient[] = [
    ...flourBlendItems(input.mainFlourGrams, input.flourBlend, 'Added main flour'),
    { name: 'Added water', role: 'water', weightGrams: input.addedWaterGrams, bakerPercentage: addedHydrationPct, note: 'Water added outside the starter' },
    { name: 'Active starter', role: 'starter', weightGrams: input.starterWeightGrams, bakerPercentage: input.starterWeightGrams / totalFlourGrams * 100, note: 'Split into flour and water in formula totals' },
    { name: 'Salt', role: 'salt', weightGrams: input.saltWeightGrams, bakerPercentage: saltPct, note: 'Salt as % of total flour' }
  ];
  const totalDoughWeightGrams = sum(addToBowl);
  return resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    starterSplit,
    flourBlend: flourBlendItems(totalFlourGrams, input.flourBlend, 'Formula total flour blend'),
    formulaTotals: { totalFlourGrams, totalWaterGrams, totalHydrationPct, addedHydrationPct, saltPct, totalDoughWeightGrams },
    totalHydrationPct,
    addedHydrationPct,
    warnings: warnings({ hydrationPct: totalHydrationPct, addedHydrationPct, saltPct, starterHydrationPct: input.starterHydrationPct, flourBlend: input.flourBlend })
  });
}

export function calculateStarterFeeding(input: StarterFeedingInput): CalculatorResult {
  assertPositive('target starter', input.targetStarterWeightGrams);
  assertPositive('seed part', input.seedPart);
  assertPositive('flour part', input.flourPart);
  assertPositive('water part', input.waterPart);
  assertNonNegative('extra starter', input.extraGrams ?? 0);
  const finalTarget = input.targetStarterWeightGrams + (input.extraGrams ?? 0);
  const part = finalTarget / (input.seedPart + input.flourPart + input.waterPart);
  const seedStarterGrams = part * input.seedPart;
  const feedingFlourGrams = part * input.flourPart;
  const feedingWaterGrams = part * input.waterPart;
  const hydration = input.waterPart / input.flourPart * 100;
  const addToBowl: Ingredient[] = [
    { name: 'Seed starter', role: 'seed', weightGrams: seedStarterGrams, note: 'Existing starter to keep from your jar' },
    { name: 'Flour to add', role: 'flour', weightGrams: feedingFlourGrams, note: 'Feeding flour' },
    { name: 'Water to add', role: 'water', weightGrams: feedingWaterGrams, note: 'Feeding water' }
  ];
  return resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    formulaTotals: { totalFlourGrams: feedingFlourGrams, totalWaterGrams: feedingWaterGrams, totalHydrationPct: hydration, totalDoughWeightGrams: finalTarget },
    totalNeededStarterGrams: finalTarget,
    finalStarterWeightGrams: finalTarget,
    starterForRecipeGrams: input.targetStarterWeightGrams,
    retainedExtraStarterGrams: input.extraGrams ?? 0,
    seedStarterGrams,
    feedingFlourGrams,
    feedingWaterGrams,
    totalHydrationPct: hydration,
    warnings: [{ code: 'feeding-time-note', level: 'info', message: 'Higher feeding ratios usually take longer to peak. Actual timing depends on temperature, flour, starter activity, and hydration.' }]
  });
}

function calculateSourdoughFormulaFromTotalFlour(args: {
  totalFlourGrams: number;
  hydrationPct: number;
  starterPct: number;
  starterHydrationPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
  flourBlend?: FlourBlendItem[];
  unitCount?: number;
  perUnitLabel?: string;
}): CalculatorResult {
  assertPositive('total flour', args.totalFlourGrams);
  const totalFlourGrams = args.totalFlourGrams;
  const totalWaterGrams = totalFlourGrams * args.hydrationPct / 100;
  const starterWeightGrams = totalFlourGrams * args.starterPct / 100;
  const starterSplit = splitStarter(starterWeightGrams, args.starterHydrationPct);
  const addedFlourGrams = totalFlourGrams - starterSplit.flourGrams;
  const addedWaterGrams = totalWaterGrams - starterSplit.waterGrams;
  if (addedFlourGrams < -EPSILON) throw new Error('The starter already contributes more flour than the target formula allows. Lower the starter amount or use more total flour.');
  if (addedWaterGrams < -EPSILON) throw new Error('Your starter already contributes more water than the target hydration allows. Lower the starter amount, increase target hydration, or use a stiffer starter.');
  const saltWeight = totalFlourGrams * args.saltPct / 100;
  const oilWeight = totalFlourGrams * optionalPct(args.oilPct) / 100;
  const sugarWeight = totalFlourGrams * optionalPct(args.sugarPct) / 100;
  const yeastWeight = totalFlourGrams * optionalPct(args.yeastPct) / 100;
  const addToBowl: Ingredient[] = [
    ...addedFlourBlendItems(totalFlourGrams, starterSplit.flourGrams, args.flourBlend),
    { name: 'Water', role: 'water', weightGrams: Math.max(0, addedWaterGrams), bakerPercentage: Math.max(0, addedWaterGrams) / totalFlourGrams * 100, note: 'Water to add outside the starter' },
    { name: 'Active starter', role: 'starter', weightGrams: starterWeightGrams, bakerPercentage: args.starterPct, note: 'Already contains starter flour and starter water' },
    { name: 'Salt', role: 'salt', weightGrams: saltWeight, bakerPercentage: args.saltPct, note: 'Salt' }
  ];
  if (oilWeight > 0) addToBowl.push({ name: 'Oil', role: 'oil', weightGrams: oilWeight, bakerPercentage: optionalPct(args.oilPct), note: 'Optional' });
  if (sugarWeight > 0) addToBowl.push({ name: 'Sugar', role: 'sugar', weightGrams: sugarWeight, bakerPercentage: optionalPct(args.sugarPct), note: 'Optional' });
  if (yeastWeight > 0) addToBowl.push({ name: 'Yeast', role: 'yeast', weightGrams: yeastWeight, bakerPercentage: optionalPct(args.yeastPct), note: 'Yeast percentage by total flour' });
  const totalDoughWeightGrams = totalFlourGrams + totalWaterGrams + saltWeight + oilWeight + sugarWeight + yeastWeight;
  const result = resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    starterSplit,
    flourBlend: flourBlendItems(totalFlourGrams, args.flourBlend, 'Formula total flour blend'),
    formulaTotals: {
      totalFlourGrams,
      totalWaterGrams,
      totalHydrationPct: args.hydrationPct,
      saltPct: args.saltPct,
      totalDoughWeightGrams,
      totalFormulaPct: 100 + args.hydrationPct + args.saltPct + optionalPct(args.oilPct) + optionalPct(args.sugarPct) + optionalPct(args.yeastPct)
    },
    totalHydrationPct: args.hydrationPct,
    totalFormulaPct: 100 + args.hydrationPct + args.saltPct + optionalPct(args.oilPct) + optionalPct(args.sugarPct) + optionalPct(args.yeastPct),
    perUnit: args.unitCount ? perUnit(addToBowl, args.unitCount) : undefined,
    perUnitLabel: args.perUnitLabel,
    warnings: warnings({ hydrationPct: args.hydrationPct, saltPct: args.saltPct, starterPct: args.starterPct, starterHydrationPct: args.starterHydrationPct, loafCount: args.perUnitLabel === 'Per loaf' ? args.unitCount : undefined, pizzaCount: args.perUnitLabel === 'Per dough ball' ? args.unitCount : undefined, flourBlend: args.flourBlend })
  });
  return result;
}

export function calculateDoughScaling(input: DoughScalingInput): CalculatorResult {
  const totalFlourGrams = input.mode === 'by-flour-weight'
    ? input.flourWeightGrams ?? 0
    : (input.targetDoughWeightGrams ?? 0) / (1 + input.hydrationPct / 100 + input.saltPct / 100 + optionalPct(input.oilPct) / 100 + optionalPct(input.sugarPct) / 100 + optionalPct(input.yeastPct) / 100);
  const result = calculateSourdoughFormulaFromTotalFlour({
    totalFlourGrams,
    hydrationPct: input.hydrationPct,
    starterPct: input.starterPct,
    starterHydrationPct: input.starterHydrationPct,
    saltPct: input.saltPct,
    oilPct: input.oilPct,
    sugarPct: input.sugarPct,
    yeastPct: input.yeastPct,
    flourBlend: input.flourBlend,
    unitCount: input.loafCount,
    perUnitLabel: 'Per loaf'
  });
  return result;
}

export function calculatePizzaDough(input: PizzaDoughInput): CalculatorResult {
  assertPositive('pizza count', input.pizzaCount);
  assertPositive('dough ball weight', input.ballWeightGrams);
  const target = input.pizzaCount * input.ballWeightGrams;
  if (input.leaveningType === 'sourdough') {
    const totalFlourGrams = target / (1 + input.hydrationPct / 100 + input.saltPct / 100 + optionalPct(input.oilPct) / 100 + optionalPct(input.sugarPct) / 100);
    return calculateSourdoughFormulaFromTotalFlour({
      totalFlourGrams,
      hydrationPct: input.hydrationPct,
      starterPct: input.starterPct ?? 20,
      starterHydrationPct: input.starterHydrationPct ?? 100,
      saltPct: input.saltPct,
      oilPct: input.oilPct,
      sugarPct: input.sugarPct,
      flourBlend: input.flourBlend,
      unitCount: input.pizzaCount,
      perUnitLabel: 'Per dough ball'
    });
  }
  const totalPercentage = 100 + input.hydrationPct + input.saltPct + optionalPct(input.yeastPct) + optionalPct(input.oilPct) + optionalPct(input.sugarPct);
  const flour = target / (totalPercentage / 100);
  const addToBowl: Ingredient[] = [
    ...flourBlendItems(flour, input.flourBlend),
    { name: 'Water', role: 'water', weightGrams: flour * input.hydrationPct / 100, bakerPercentage: input.hydrationPct, note: 'Water' },
    { name: 'Salt', role: 'salt', weightGrams: flour * input.saltPct / 100, bakerPercentage: input.saltPct, note: 'Salt' },
    { name: 'Yeast', role: 'yeast', weightGrams: flour * optionalPct(input.yeastPct) / 100, bakerPercentage: optionalPct(input.yeastPct), note: 'Yeast' }
  ];
  const oilWeight = flour * optionalPct(input.oilPct) / 100;
  const sugarWeight = flour * optionalPct(input.sugarPct) / 100;
  if (oilWeight > 0) addToBowl.push({ name: 'Oil', role: 'oil', weightGrams: oilWeight, bakerPercentage: optionalPct(input.oilPct), note: 'Optional' });
  if (sugarWeight > 0) addToBowl.push({ name: 'Sugar', role: 'sugar', weightGrams: sugarWeight, bakerPercentage: optionalPct(input.sugarPct), note: 'Optional' });
  return resultFromSections({
    addToBowl,
    ingredients: addToBowl,
    formulaTotals: { totalFlourGrams: flour, totalWaterGrams: flour * input.hydrationPct / 100, totalHydrationPct: input.hydrationPct, saltPct: input.saltPct, totalDoughWeightGrams: target, totalFormulaPct: totalPercentage },
    totalFormulaPct: totalPercentage,
    totalHydrationPct: input.hydrationPct,
    perUnit: perUnit(addToBowl, input.pizzaCount),
    perUnitLabel: 'Per dough ball',
    warnings: warnings({ hydrationPct: input.hydrationPct, saltPct: input.saltPct, pizzaCount: input.pizzaCount, flourBlend: input.flourBlend }),
    totalDoughWeightGrams: target
  });
}
