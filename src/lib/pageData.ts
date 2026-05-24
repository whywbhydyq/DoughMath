import type { CalculatorType } from '@/types/baking';

export interface ToolPageData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  calculatorType: CalculatorType;
  canonicalPath: string;
  defaultInputs: Record<string, number | string>;
  intro: string;
  formulaNotes: string[];
  examples: { title: string; input: string; output: string }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  priority: number;
  isLongTail?: boolean;
}

export const BASE_URL = 'https://doughmath.ymirtool.com';

export const toolPages: ToolPageData[] = [
  {
    slug: 'bakers-percentage-calculator',
    title: "Baker's Percentage Calculator | DoughMath",
    description: "Calculate baker's percentages and ingredient weights from flour, hydration, starter, salt, oil, and sugar in grams.",
    h1: "Baker's Percentage Calculator",
    calculatorType: 'bakers-percentage',
    canonicalPath: '/bakers-percentage-calculator',
    defaultInputs: { flour: 500, hyd: 75, starter: 20, salt: 2, oil: 0, sugar: 0, bakerMode: 'percentages' },
    intro: "Use total flour as 100% and calculate water, starter, salt, oil, sugar, and total dough weight in grams. Switch modes to calculate percentages from ingredient weights.",
    formulaNotes: ["Baker's percentage means every ingredient is calculated relative to total flour weight.", 'The weights mode converts ingredient grams back to baker percentages.', 'Internal calculations use raw numbers; display values are rounded only for readability.'],
    examples: [{ title: 'Basic 75% dough', input: '500g flour, 75% hydration, 20% starter, 2% salt', output: '375g water, 100g starter, 10g salt, 197% total formula' }],
    faqs: [{ question: 'Why is flour always 100%?', answer: "Baker's math uses total flour as the baseline so recipes scale cleanly." }, { question: 'Can I enter ingredient weights?', answer: 'Yes. Switch to percentages from weights and enter water, starter, salt, oil, sugar, or custom ingredient weights.' }],
    relatedSlugs: ['grams-to-bakers-percentage', 'bakers-percentage-to-grams', 'sourdough-hydration-calculator'],
    priority: 0.9
  },
  {
    slug: 'sourdough-hydration-calculator',
    title: 'Sourdough Hydration Calculator | DoughMath',
    description: 'Split starter into flour and water, then calculate added hydration, total hydration, salt percentage, and dough weight.',
    h1: 'Sourdough Hydration Calculator',
    calculatorType: 'sourdough-hydration',
    canonicalPath: '/sourdough-hydration-calculator',
    defaultInputs: { flour: 500, water: 350, starter: 100, sh: 100, saltg: 10 },
    intro: 'Calculate how starter flour and starter water affect added hydration and total hydration.',
    formulaNotes: ['100% hydration starter means equal flour and water by weight, not 100% water.', 'Added hydration uses only added water divided by main flour.', 'Total hydration includes starter flour and starter water.'],
    examples: [{ title: '100% starter split', input: '500g main flour, 350g water, 100g starter at 100% hydration', output: '50g starter flour, 50g starter water, 72.7% total hydration' }],
    faqs: [{ question: 'Why is total hydration higher than added hydration?', answer: 'Starter contributes extra water and flour, so the total ratio changes.' }, { question: 'Can I use stiff starter?', answer: 'Yes. Enter a lower starter hydration such as 50% and the split is recalculated.' }],
    relatedSlugs: ['total-hydration-calculator', 'bakers-percentage-calculator', 'starter-feeding-calculator'],
    priority: 0.9
  },
  {
    slug: 'starter-feeding-calculator',
    title: 'Starter Feeding Calculator | DoughMath',
    description: 'Calculate seed starter, flour, and water for 1:1:1, 1:2:2, 1:3:3, 1:5:5, or custom starter feeding ratios.',
    h1: 'Starter Feeding Calculator',
    calculatorType: 'starter-feeding',
    canonicalPath: '/starter-feeding-calculator',
    defaultInputs: { target: 100, seed: 1, flourpart: 2, waterpart: 2, extra: 0 },
    intro: 'Enter a target starter weight and feeding ratio to calculate seed starter, flour, and water.',
    formulaNotes: ['A 1:2:2 feeding has five total parts: one part seed, two parts flour, and two parts water.', 'Extra retained starter is included in the total amount to prepare.', 'This calculator does not predict peak time or starter activity.'],
    examples: [{ title: '1:2:2 feeding', input: '100g target starter, ratio 1:2:2', output: '20g seed starter, 40g flour, 40g water' }],
    faqs: [{ question: 'What does 1:2:2 mean?', answer: 'It means one part existing starter, two parts flour, and two parts water by weight.' }, { question: 'Does this predict when my starter peaks?', answer: 'No. It calculates weights only.' }],
    relatedSlugs: ['sourdough-starter-ratio-1-2-2', 'sourdough-starter-ratio-1-5-5', 'levain-calculator'],
    priority: 0.85
  },
  {
    slug: 'dough-scaling-calculator',
    title: 'Dough Scaling Calculator | DoughMath',
    description: 'Scale bread dough from target dough weight, flour weight, loaf count, hydration, starter percentage, and salt percentage.',
    h1: 'Dough Scaling Calculator',
    calculatorType: 'dough-scaling',
    canonicalPath: '/dough-scaling-calculator',
    defaultInputs: { mode: 'target', target: 1500, flour: 500, loaves: 2, hyd: 75, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, yeast: 0 },
    intro: 'Reverse-calculate a bread formula from target dough weight or scale from a known flour weight.',
    formulaNotes: ['Starter percentage means total starter weight divided by base flour weight.', 'This MVP intentionally does not use prefermented flour percentage mode.', 'Per-loaf values divide the full formula evenly by loaf count.'],
    examples: [{ title: 'Two 750g loaves', input: '1500g target dough, 75% hydration, 20% starter, 2% salt, 2 loaves', output: 'Total formula plus 750g per loaf allocation' }],
    faqs: [{ question: 'Can I calculate from final dough weight?', answer: 'Yes. Use target dough mode to reverse-calculate base flour and ingredients.' }, { question: 'Are starter flour and water included in total hydration?', answer: 'Yes, the hydration summary includes the starter split.' }],
    relatedSlugs: ['bread-recipe-scaler', 'dough-weight-calculator', 'sourdough-hydration-calculator'],
    priority: 0.95
  },
  {
    slug: 'pizza-dough-calculator',
    title: 'Pizza Dough Calculator | DoughMath',
    description: 'Calculate flour, water, salt, oil, yeast or starter, total dough weight, and per-ball weights for pizza dough.',
    h1: 'Pizza Dough Calculator',
    calculatorType: 'pizza-dough',
    canonicalPath: '/pizza-dough-calculator',
    defaultInputs: { count: 3, ball: 280, hyd: 65, salt: 2.5, oil: 2, sugar: 0, yeast: 0.2, starter: 20, sh: 100, lev: 'yeast' },
    intro: 'Calculate pizza dough by pizza count and dough ball weight, with yeast or sourdough mode.',
    formulaNotes: ['Total dough weight equals pizza count multiplied by dough ball weight.', 'Yeast mode uses yeast percentage relative to flour.', 'Sourdough mode uses starter total weight percentage and starter hydration split.'],
    examples: [{ title: 'Three pizza balls', input: '3 balls, 280g each, 65% hydration, 2.5% salt', output: '840g total dough and per-ball ingredient allocation' }],
    faqs: [{ question: 'Can I use sourdough starter for pizza?', answer: 'Yes. Switch leavening mode to sourdough and enter starter percentage and hydration.' }, { question: 'Is ball weight before or after baking?', answer: 'It is raw dough ball weight before proofing and baking.' }],
    relatedSlugs: ['pizza-dough-ball-weight-calculator', 'sourdough-pizza-calculator', 'dough-scaling-calculator'],
    priority: 0.9
  },
  { slug: 'total-hydration-calculator', title: 'Total Hydration Calculator | DoughMath', description: 'Calculate total dough hydration including starter flour and starter water.', h1: 'Total Hydration Calculator', calculatorType: 'sourdough-hydration', canonicalPath: '/total-hydration-calculator', defaultInputs: { flour: 600, water: 420, starter: 150, sh: 100, saltg: 12 }, intro: 'Use this hydration preset when you mainly need total flour, total water, and total hydration.', formulaNotes: ['Starter flour and water are split before hydration is calculated.', 'Added hydration and total hydration can differ substantially.'], examples: [{ title: 'Starter-adjusted hydration', input: '600g flour, 420g water, 150g starter at 100%', output: '675g total flour and 495g total water.' }], faqs: [{ question: 'Is this different from added hydration?', answer: 'Yes. Total hydration includes starter flour and water.' }, { question: 'Can I use a stiff starter?', answer: 'Yes. Change starter hydration below 100%.' }], relatedSlugs: ['sourdough-hydration-calculator', 'dough-scaling-calculator'], priority: 0.75, isLongTail: true },
  { slug: 'sourdough-starter-ratio-1-2-2', title: '1:2:2 Starter Feeding Calculator | DoughMath', description: 'Preset starter feeding calculator for a 1:2:2 sourdough starter ratio.', h1: '1:2:2 Starter Feeding Calculator', calculatorType: 'starter-feeding', canonicalPath: '/sourdough-starter-ratio-1-2-2', defaultInputs: { target: 150, seed: 1, flourpart: 2, waterpart: 2, extra: 0 }, intro: 'Calculate seed starter, flour, and water for a 1:2:2 feeding.', formulaNotes: ['1:2:2 means one part seed, two parts flour, and two parts water.', 'The total ratio is five parts.'], examples: [{ title: '150g 1:2:2 feeding', input: '150g target starter', output: '30g seed, 60g flour, 60g water.' }], faqs: [{ question: 'Is 1:2:2 a 100% hydration feeding?', answer: 'Yes, flour and water parts are equal.' }, { question: 'Can I keep extra starter?', answer: 'Yes. Add extra retained starter in the calculator.' }], relatedSlugs: ['starter-feeding-calculator', 'sourdough-starter-ratio-1-5-5'], priority: 0.7, isLongTail: true },
  { slug: 'sourdough-starter-ratio-1-5-5', title: '1:5:5 Starter Feeding Calculator | DoughMath', description: 'Preset starter feeding calculator for a 1:5:5 sourdough starter ratio.', h1: '1:5:5 Starter Feeding Calculator', calculatorType: 'starter-feeding', canonicalPath: '/sourdough-starter-ratio-1-5-5', defaultInputs: { target: 220, seed: 1, flourpart: 5, waterpart: 5, extra: 0 }, intro: 'Calculate a larger 1:5:5 starter feeding for longer fermentation windows.', formulaNotes: ['1:5:5 has eleven total parts.', 'A smaller seed amount often slows the feeding cycle, but this tool calculates weights only.'], examples: [{ title: '220g 1:5:5 feeding', input: '220g target starter', output: '20g seed, 100g flour, 100g water.' }], faqs: [{ question: 'Does this predict peak time?', answer: 'No. It only calculates ingredient weights.' }, { question: 'Is 1:5:5 equal hydration?', answer: 'Yes, flour and water parts match.' }], relatedSlugs: ['starter-feeding-calculator', 'sourdough-starter-ratio-1-2-2'], priority: 0.7, isLongTail: true },
  { slug: 'levain-calculator', title: 'Levain Calculator | DoughMath', description: 'Calculate levain build weights using starter feeding ratios.', h1: 'Levain Calculator', calculatorType: 'starter-feeding', canonicalPath: '/levain-calculator', defaultInputs: { target: 180, seed: 1, flourpart: 3, waterpart: 3, extra: 0 }, intro: 'Build a levain by target weight and feeding ratio without saving recipes online.', formulaNotes: ['Levain here is treated as a planned starter build.', 'This tool does not estimate fermentation timing.'], examples: [{ title: '180g levain build', input: '1:3:3 ratio', output: 'About 25.7g seed, 77.1g flour, 77.1g water.' }], faqs: [{ question: 'Is levain different from starter here?', answer: 'The math is the same; levain is just a planned build for a dough.' }, { question: 'Can I change the ratio?', answer: 'Yes. Edit seed, flour, and water parts.' }], relatedSlugs: ['starter-feeding-calculator', 'sourdough-hydration-calculator'], priority: 0.72, isLongTail: true },
  { slug: 'bread-recipe-scaler', title: 'Bread Recipe Scaler | DoughMath', description: 'Scale a bread formula by target dough weight or flour weight.', h1: 'Bread Recipe Scaler', calculatorType: 'dough-scaling', canonicalPath: '/bread-recipe-scaler', defaultInputs: { mode: 'flour', flour: 800, loaves: 2, hyd: 72, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, yeast: 0 }, intro: 'Scale bread ingredients while keeping baker percentages consistent.', formulaNotes: ['Known flour mode is useful when you already know how much flour you want to use.', 'Per-loaf values are divided evenly.'], examples: [{ title: 'Scale by flour', input: '800g flour, 72% hydration, 2% salt', output: 'Scaled total dough and per-loaf weights.' }], faqs: [{ question: 'Can I scale by final dough weight?', answer: 'Yes. Switch the calculation mode.' }, { question: 'Does it save recipes?', answer: 'No. It calculates locally only.' }], relatedSlugs: ['dough-scaling-calculator', 'dough-weight-calculator'], priority: 0.72, isLongTail: true },
  { slug: 'dough-weight-calculator', title: 'Dough Weight Calculator | DoughMath', description: 'Calculate total dough weight and per-loaf dough weight from a bread formula.', h1: 'Dough Weight Calculator', calculatorType: 'dough-scaling', canonicalPath: '/dough-weight-calculator', defaultInputs: { mode: 'target', target: 1000, loaves: 1, hyd: 70, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, yeast: 0 }, intro: 'Reverse-calculate flour and ingredients from a desired total dough weight.', formulaNotes: ['Target mode solves flour weight from total formula percentage.', 'This is useful for pan capacity and loaf planning.'], examples: [{ title: 'One 1000g dough', input: '1000g target, 70% hydration, 20% starter, 2% salt', output: 'Formula totals approximately 1000g.' }], faqs: [{ question: 'Is target weight before baking?', answer: 'Yes. It is raw dough weight.' }, { question: 'Can I make multiple loaves?', answer: 'Yes. Set loaf count.' }], relatedSlugs: ['dough-scaling-calculator', 'bread-recipe-scaler'], priority: 0.72, isLongTail: true },
  { slug: 'pizza-dough-ball-weight-calculator', title: 'Pizza Dough Ball Weight Calculator | DoughMath', description: 'Calculate pizza dough ingredients by ball weight and number of pizzas.', h1: 'Pizza Dough Ball Weight Calculator', calculatorType: 'pizza-dough', canonicalPath: '/pizza-dough-ball-weight-calculator', defaultInputs: { count: 4, ball: 250, hyd: 65, salt: 2.5, oil: 2, sugar: 0, yeast: 0.2, starter: 20, sh: 100, lev: 'yeast' }, intro: 'Plan pizza dough from the dough ball size you want to shape.', formulaNotes: ['Total dough weight equals pizza count times ball weight.', 'Ingredient weights are calculated backwards from total formula percentage.'], examples: [{ title: 'Four 250g balls', input: '4 pizzas, 250g each', output: '1000g total dough with per-ball allocation.' }], faqs: [{ question: 'Is ball weight raw dough?', answer: 'Yes. It is weight before proofing and baking.' }, { question: 'Can I use sourdough?', answer: 'Yes. Switch leavening to sourdough.' }], relatedSlugs: ['pizza-dough-calculator', 'sourdough-pizza-calculator'], priority: 0.72, isLongTail: true },
  { slug: 'sourdough-pizza-calculator', title: 'Sourdough Pizza Calculator | DoughMath', description: 'Calculate sourdough pizza dough using starter percentage and starter hydration.', h1: 'Sourdough Pizza Calculator', calculatorType: 'pizza-dough', canonicalPath: '/sourdough-pizza-calculator', defaultInputs: { count: 3, ball: 280, hyd: 65, salt: 2.5, oil: 2, sugar: 0, starter: 20, sh: 100, lev: 'sourdough', yeast: 0 }, intro: 'Calculate pizza dough with sourdough starter instead of commercial yeast.', formulaNotes: ['Starter is split into flour and water for total hydration.', 'Starter percentage here means total starter weight relative to base flour.'], examples: [{ title: 'Sourdough pizza batch', input: '3 balls, 280g each, 20% starter', output: '840g total dough with starter-adjusted hydration.' }], faqs: [{ question: 'Does this predict fermentation?', answer: 'No. It calculates weights only.' }, { question: 'Can I change starter hydration?', answer: 'Yes. Edit starter hydration.' }], relatedSlugs: ['pizza-dough-calculator', 'sourdough-hydration-calculator'], priority: 0.72, isLongTail: true },
  { slug: 'grams-to-bakers-percentage', title: 'Grams to Baker’s Percentage Calculator | DoughMath', description: 'Convert ingredient gram weights into baker’s percentages.', h1: 'Grams to Baker’s Percentage Calculator', calculatorType: 'bakers-percentage', canonicalPath: '/grams-to-bakers-percentage', defaultInputs: { bakerMode: 'weights', flour: 1000, bpWater: 700, bpStarter: 0, bpSalt: 20, bpOil: 0, bpSugar: 0 }, intro: 'Enter ingredient weights in grams and convert them to baker percentages.', formulaNotes: ['Flour is 100%.', 'Every other ingredient is divided by flour weight.'], examples: [{ title: 'Convert a basic formula', input: '1000g flour, 700g water, 20g salt', output: '70% hydration and 2% salt.' }], faqs: [{ question: 'Can I add custom ingredients?', answer: 'Yes. Use the custom ingredient rows.' }, { question: 'Does this change the dough?', answer: 'No. It only converts units into baker percentages.' }], relatedSlugs: ['bakers-percentage-calculator', 'bakers-percentage-to-grams'], priority: 0.72, isLongTail: true },
  { slug: 'bakers-percentage-to-grams', title: 'Baker’s Percentage to Grams Calculator | DoughMath', description: 'Convert baker percentages into gram ingredient weights.', h1: 'Baker’s Percentage to Grams Calculator', calculatorType: 'bakers-percentage', canonicalPath: '/bakers-percentage-to-grams', defaultInputs: { bakerMode: 'percentages', flour: 1000, hyd: 70, starter: 0, salt: 2, oil: 0, sugar: 0 }, intro: 'Enter flour weight and baker percentages to calculate ingredient grams.', formulaNotes: ['Ingredient weight equals flour weight multiplied by ingredient percentage.', 'Use this preset when adapting professional formulas.'], examples: [{ title: 'Convert percentages', input: '1000g flour, 70% water, 2% salt', output: '700g water and 20g salt.' }], faqs: [{ question: 'Is flour included in total formula percentage?', answer: 'Yes. Flour is always 100%.' }, { question: 'Can I enter starter?', answer: 'Yes. Starter is treated as a total ingredient percentage.' }], relatedSlugs: ['bakers-percentage-calculator', 'grams-to-bakers-percentage'], priority: 0.72, isLongTail: true }
];

export const longTailPages = toolPages.filter((page) => page.isLongTail);

export const legalPages = [
  { slug: 'about', title: 'About DoughMath', description: 'About the DoughMath bread and sourdough calculator site.', canonicalPath: '/about', priority: 0.5 },
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy for DoughMath browser-only calculators.', canonicalPath: '/privacy', priority: 0.5 },
  { slug: 'disclaimer', title: 'Disclaimer', description: 'Baking calculation disclaimer for DoughMath.', canonicalPath: '/disclaimer', priority: 0.5 }
] as const;

export const allPages = [
  { canonicalPath: '/', priority: 1, changeFrequency: 'weekly' as const },
  ...toolPages.map((page) => ({ canonicalPath: page.canonicalPath, priority: page.priority, changeFrequency: page.isLongTail ? 'monthly' as const : 'weekly' as const })),
  ...legalPages.map((page) => ({ canonicalPath: page.canonicalPath, priority: page.priority, changeFrequency: 'yearly' as const }))
];

export function getToolPage(slug: string) {
  return toolPages.find((page) => page.slug === slug);
}

export function getToolPageOrThrow(slug: string) {
  const page = getToolPage(slug);
  if (!page) throw new Error(`Unknown tool page: ${slug}`);
  return page;
}
