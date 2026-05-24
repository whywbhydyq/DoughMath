export type CalculatorType =
  | 'bakers-percentage'
  | 'sourdough-hydration'
  | 'starter-feeding'
  | 'dough-scaling'
  | 'pizza-dough';

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
    defaultInputs: { flour: 500, hyd: 75, starter: 20, salt: 2, oil: 0, sugar: 0 },
    intro: "Use total flour as 100% and calculate water, starter, salt, oil, sugar, and total dough weight in grams.",
    formulaNotes: [
      "Baker's percentage means every ingredient is calculated relative to total flour weight.",
      "In this calculator, starter is treated as one ingredient. Use the hydration calculator when you need starter flour and water split.",
      "Internal calculations use raw numbers; display values are rounded only for readability."
    ],
    examples: [{ title: 'Basic 75% dough', input: '500g flour, 75% hydration, 20% starter, 2% salt', output: '375g water, 100g starter, 10g salt, 985g total dough' }],
    faqs: [
      { question: 'Why is flour always 100%?', answer: "Baker's math uses total flour as the baseline so recipes scale cleanly." },
      { question: 'Does starter count toward hydration here?', answer: 'This page treats starter as a single ingredient. Use the sourdough hydration calculator for total hydration.' }
    ],
    relatedSlugs: ['sourdough-hydration-calculator', 'dough-scaling-calculator', 'pizza-dough-calculator'],
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
    formulaNotes: [
      '100% hydration starter means equal flour and water by weight, not 100% water.',
      'Added hydration uses only added water divided by main flour.',
      'Total hydration includes starter flour and starter water.'
    ],
    examples: [{ title: '100% starter split', input: '500g main flour, 350g water, 100g starter at 100% hydration', output: '50g starter flour, 50g starter water, 72.7% total hydration' }],
    faqs: [
      { question: 'Why is total hydration higher than added hydration?', answer: 'Starter contributes extra water and flour, so the total ratio changes.' },
      { question: 'Can I use stiff starter?', answer: 'Yes. Enter a lower starter hydration such as 50% and the split is recalculated.' }
    ],
    relatedSlugs: ['bakers-percentage-calculator', 'dough-scaling-calculator', 'starter-feeding-calculator'],
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
    formulaNotes: [
      'A 1:2:2 feeding has five total parts: one part seed, two parts flour, and two parts water.',
      'Extra retained starter is included in the total amount to prepare.',
      'This calculator does not predict peak time or starter activity.'
    ],
    examples: [{ title: '1:2:2 feeding', input: '100g target starter, ratio 1:2:2', output: '20g seed starter, 40g flour, 40g water' }],
    faqs: [
      { question: 'What does 1:2:2 mean?', answer: 'It means one part existing starter, two parts flour, and two parts water by weight.' },
      { question: 'Does this predict when my starter peaks?', answer: 'No. It calculates weights only.' }
    ],
    relatedSlugs: ['sourdough-hydration-calculator', 'dough-scaling-calculator'],
    priority: 0.85
  },
  {
    slug: 'dough-scaling-calculator',
    title: 'Dough Scaling Calculator | DoughMath',
    description: 'Scale bread dough from target dough weight, flour weight, loaf count, hydration, starter percentage, and salt percentage.',
    h1: 'Dough Scaling Calculator',
    calculatorType: 'dough-scaling',
    canonicalPath: '/dough-scaling-calculator',
    defaultInputs: { mode: 'target', target: 1500, flour: 500, loaves: 2, hyd: 75, starter: 20, sh: 100, salt: 2 },
    intro: 'Reverse-calculate a bread formula from target dough weight or scale from a known flour weight.',
    formulaNotes: [
      'Starter percentage means total starter weight divided by base flour weight.',
      'This MVP intentionally does not use prefermented flour percentage mode.',
      'Per-loaf values divide the full formula evenly by loaf count.'
    ],
    examples: [{ title: 'Two 750g loaves', input: '1500g target dough, 75% hydration, 20% starter, 2% salt, 2 loaves', output: 'Total formula plus 750g per loaf allocation' }],
    faqs: [
      { question: 'Can I calculate from final dough weight?', answer: 'Yes. Use target dough mode to reverse-calculate base flour and ingredients.' },
      { question: 'Are starter flour and water included in total hydration?', answer: 'Yes, the hydration summary includes the starter split.' }
    ],
    relatedSlugs: ['bakers-percentage-calculator', 'sourdough-hydration-calculator', 'pizza-dough-calculator'],
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
    formulaNotes: [
      'Total dough weight equals pizza count multiplied by dough ball weight.',
      'Yeast mode uses yeast percentage relative to flour.',
      'Sourdough mode uses starter total weight percentage and starter hydration split.'
    ],
    examples: [{ title: 'Three pizza balls', input: '3 balls, 280g each, 65% hydration, 2.5% salt', output: '840g total dough and per-ball ingredient allocation' }],
    faqs: [
      { question: 'Can I use sourdough starter for pizza?', answer: 'Yes. Switch leavening mode to sourdough and enter starter percentage and hydration.' },
      { question: 'Is ball weight before or after baking?', answer: 'It is raw dough ball weight before proofing and baking.' }
    ],
    relatedSlugs: ['dough-scaling-calculator', 'bakers-percentage-calculator'],
    priority: 0.9
  }
];

export const legalPages = [
  { slug: 'about', title: 'About DoughMath', description: 'About the DoughMath bread and sourdough calculator site.', canonicalPath: '/about', priority: 0.5 },
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy for DoughMath browser-only calculators.', canonicalPath: '/privacy', priority: 0.5 },
  { slug: 'disclaimer', title: 'Disclaimer', description: 'Baking calculation disclaimer for DoughMath.', canonicalPath: '/disclaimer', priority: 0.5 }
] as const;

export const allPages = [
  { canonicalPath: '/', priority: 1, changeFrequency: 'weekly' as const },
  ...toolPages.map((page) => ({ canonicalPath: page.canonicalPath, priority: page.priority, changeFrequency: 'monthly' as const })),
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
