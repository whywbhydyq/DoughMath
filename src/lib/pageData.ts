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
  commonMistakes: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  isLongTail?: boolean;
}

export const BASE_URL = 'https://doughmath.ymirtool.com';

type PageArgs = Omit<ToolPageData, 'title' | 'canonicalPath'> & { title: string };

function page(args: PageArgs): ToolPageData {
  return { ...args, title: `${args.title} | DoughMath`, canonicalPath: `/${args.slug}` };
}

const sharedFaqs = [
  { question: 'Does DoughMath save my recipe?', answer: 'No. The calculators run in your browser. There is no account system, upload flow, or cloud recipe storage.' },
  { question: 'Can I use ounces or pounds?', answer: 'Yes. Calculations are stored internally in grams, and the display unit can be switched to grams, ounces, or pounds without changing the underlying formula.' }
];

const sharedMistakes = [
  'Do not mix cups and grams in the same formula unless you have weighed the cup measurements first.',
  'Do not treat a 100% hydration starter as 100% water. It is equal parts flour and water by weight.',
  'Use the result as a starting point. Dough feel still depends on flour, temperature, starter activity, mixing, and fermentation.'
];

export const toolPages: ToolPageData[] = [
  page({
    slug: 'bakers-percentage-calculator',
    title: "Baker’s Percentage Calculator for Bread",
    description: "Calculate baker’s percentages and ingredient weights for bread dough, including hydration, starter, salt, oil, sugar, and flour blend percentages by weight.",
    h1: "Baker's Percentage Calculator",
    calculatorType: 'bakers-percentage',
    defaultInputs: { flour: 500, hyd: 75, starter: 20, salt: 2, oil: 0, sugar: 0, bakerMode: 'percentages', breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: "Convert bread formulas between baker's percentages and gram weights. Use this when flour is your 100% reference and you want every ingredient scaled from it.",
    formulaNotes: ['Flour is always 100% in baker’s math.', 'Ingredient weight = flour weight × baker’s percentage ÷ 100.', 'Total dough weight is the sum of all measured ingredients.', 'Flour blend percentages split the flour line while keeping total flour at 100%.'],
    examples: [{ title: '500g flour at 75% hydration', input: 'Flour 500g, hydration 75%, starter 20%, salt 2%.', output: 'Water 375g, starter 100g, salt 10g, total dough 985g.' }],
    commonMistakes: ['Do not make water 100%. Flour is the 100% baseline.', 'If you enter starter as a baker’s percentage here, it is shown as total starter weight. Use the sourdough hydration calculator to split starter into flour and water.', 'Keep flour blend percentages at exactly 100%.', ...sharedMistakes],
    faqs: [{ question: 'Why does the total percentage exceed 100%?', answer: 'Because flour is the baseline. Water, salt, starter, oil, and other ingredients are added on top of the 100% flour line.' }, { question: 'Can I enter ingredient weights instead of percentages?', answer: 'Yes. Switch the calculator mode to percentages from weights.' }, ...sharedFaqs],
    relatedSlugs: ['grams-to-bakers-percentage', 'bakers-percentage-to-grams', 'sourdough-hydration-calculator'],
  }),
  page({
    slug: 'sourdough-hydration-calculator',
    title: 'Sourdough Hydration Calculator for Starter',
    description: 'Split sourdough starter into flour and water, then calculate added hydration, total hydration, salt percentage, and final dough weight from gram inputs.',
    h1: 'Sourdough Hydration Calculator',
    calculatorType: 'sourdough-hydration',
    defaultInputs: { flour: 500, water: 350, starter: 100, sh: 100, saltg: 10, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Calculate total sourdough hydration by including the flour and water inside your starter or levain.',
    formulaNotes: ['Starter flour = starter weight ÷ (1 + starter hydration ÷ 100).', 'Starter water = starter weight − starter flour.', 'Total hydration = total water ÷ total flour × 100.', 'Salt percentage is calculated against total flour, including starter flour.'],
    examples: [{ title: '100g of 100% hydration starter', input: 'Main flour 500g, added water 350g, starter 100g, salt 10g.', output: 'Starter flour 50g, starter water 50g, total hydration 72.7%, salt 1.8%.' }],
    commonMistakes: ['Do not calculate salt percentage from main flour only if you want total formula salt percentage.', 'Do not add starter flour and water again to the bowl. The starter itself is the measured ingredient.', ...sharedMistakes],
    faqs: [{ question: 'Does starter count toward hydration?', answer: 'In this calculator, yes. The starter is split into internal flour and water before total hydration is calculated.' }, { question: 'Is 100g of 100% hydration starter 100g of water?', answer: 'No. It is about 50g flour and 50g water.' }, ...sharedFaqs],
    relatedSlugs: ['total-hydration-calculator', 'bakers-percentage-calculator', 'starter-feeding-calculator'],
  }),
  page({
    slug: 'starter-feeding-calculator',
    title: 'Sourdough Starter Feeding Calculator Ratios',
    description: 'Calculate seed starter, flour, and water for 1:1:1, 1:2:2, 1:5:5, or custom sourdough feeding ratios, including extra starter to keep for baking later.',
    h1: 'Sourdough Starter Feeding Calculator',
    calculatorType: 'starter-feeding',
    defaultInputs: { target: 100, seed: 1, flourpart: 2, waterpart: 2, extra: 10 },
    intro: 'Enter how much active starter you need, how much you want to keep, and your feeding ratio. The calculator gives seed starter, flour, and water weights.',
    formulaNotes: ['Final target = starter needed for recipe + extra starter to keep.', 'Each part weight = final target ÷ total ratio parts.', 'Seed starter, flour, and water are calculated from their ratio parts.', 'Peak time is not predicted because temperature, flour, and starter activity matter.'],
    examples: [{ title: 'Need 100g and keep 10g at 1:2:2', input: 'Starter needed 100g, extra 10g, ratio 1:2:2.', output: 'Mix 22g seed starter, 44g flour, and 44g water for 110g total starter.' }],
    commonMistakes: ['Do not forget to include the starter you want to keep for the next feeding.', 'Do not assume a high feeding ratio will peak at the same time as 1:1:1.', 'Use clean containers and food-safe handling; this is a math tool, not a food safety tool.'],
    faqs: [{ question: 'What does 1:2:2 mean?', answer: 'It means 1 part seed starter, 2 parts flour, and 2 parts water by weight.' }, { question: 'Does this predict when my starter will peak?', answer: 'No. It only calculates weights. Temperature, flour, starter activity, and hydration affect timing.' }, ...sharedFaqs],
    relatedSlugs: ['sourdough-starter-ratio-1-2-2', 'sourdough-starter-ratio-1-5-5', 'levain-calculator'],
  }),
  page({
    slug: 'dough-scaling-calculator',
    title: 'Dough Scaling Calculator by Weight or Loaves',
    description: 'Scale bread dough from target dough weight, flour weight, or loaf count, with hydration, starter percentage, starter hydration, salt, oil, and sugar included.',
    h1: 'Dough Scaling Calculator',
    calculatorType: 'dough-scaling',
    defaultInputs: { mode: 'target', target: 1000, perLoaf: 750, flour: 500, loaves: 1, hyd: 75, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Scale a bread or sourdough formula by final dough weight or total flour weight. The result separates what to add to the bowl from total formula hydration.',
    formulaNotes: ['Target mode solves total flour from final dough weight.', 'Starter percentage is starter total weight divided by total flour.', 'Starter is split into flour and water for formula totals, but measured as one ingredient in Add to bowl.', 'Total dough is total flour + total water + salt + optional oil or sugar; starter is not counted twice.'],
    examples: [{ title: '1000g target dough', input: 'Target 1000g, hydration 75%, starter 20%, starter hydration 100%, salt 2%.', output: 'About 508g added flour, 367g added water, 113g starter, 11g salt; total dough stays 1000g.' }],
    commonMistakes: ['Do not add starter as an extra ingredient after already counting its flour and water.', 'If added water becomes negative, reduce starter, raise hydration, or use a stiffer starter.', 'Check per-loaf weights before dividing dough.', ...sharedMistakes],
    faqs: [{ question: 'Why is Add to bowl different from Formula totals?', answer: 'Add to bowl shows what you weigh. Formula totals split starter into internal flour and water for hydration math.' }, { question: 'What does starter percentage mean here?', answer: 'It means total starter weight divided by total flour weight.' }, ...sharedFaqs],
    relatedSlugs: ['bread-recipe-scaler', 'dough-weight-calculator', 'sourdough-hydration-calculator'],
  }),
  page({
    slug: 'pizza-dough-calculator',
    title: 'Pizza Dough Calculator for Balls and Hydration',
    description: 'Calculate pizza dough flour, water, salt, oil, yeast or starter, total dough weight, and per-ball weights from pizza count and dough ball size in grams.',
    h1: 'Pizza Dough Calculator',
    calculatorType: 'pizza-dough',
    defaultInputs: { count: 3, ball: 280, hyd: 65, salt: 2.5, oil: 0, sugar: 0, yeast: 0.2, starter: 20, sh: 100, lev: 'yeast', breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Calculate pizza dough from dough ball weight, pizza count, hydration, salt, oil, and either yeast or sourdough starter.',
    formulaNotes: ['Target dough weight = pizza count × dough ball weight.', 'Yeast mode divides the target by total baker’s percentage.', 'Sourdough mode splits starter into flour and water without counting it twice.', 'Per-ball results are scaled evenly from the total formula.'],
    examples: [{ title: 'Three 280g pizza balls', input: '3 pizzas, 280g each, 65% hydration, 2.5% salt, 0.2% yeast.', output: 'Total dough 840g, about 501g flour, 326g water, 13g salt, and 1g yeast.' }],
    commonMistakes: ['Do not use sourdough starter and yeast percentages together unless you intentionally want both.', 'Neapolitan-ish, pan, and focaccia-ish hydration ranges are starting points, not absolute standards.', 'Cold fermentation timing is not calculated here.', ...sharedMistakes],
    faqs: [{ question: 'Can this calculate sourdough pizza?', answer: 'Yes. Switch leavening to sourdough starter and enter starter percentage and starter hydration.' }, { question: 'Does oil count in total dough weight?', answer: 'Yes. Oil and sugar are included in target dough weight when their percentages are above zero.' }, ...sharedFaqs],
    relatedSlugs: ['pizza-dough-ball-weight-calculator', 'sourdough-pizza-calculator', 'dough-scaling-calculator'],
  }),
  page({
    slug: 'total-hydration-calculator',
    title: 'Total Hydration Calculator with Starter',
    description: 'Calculate total dough hydration including starter flour and starter water, then compare it with added hydration from main flour and added water by weight.',
    h1: 'Total Hydration Calculator',
    calculatorType: 'sourdough-hydration',
    defaultInputs: { flour: 600, water: 420, starter: 150, sh: 100, saltg: 12, breadPct: 80, wholePct: 20, ryePct: 0 },
    intro: 'Use this preset when a recipe lists added water but you want hydration after including starter flour and water.',
    formulaNotes: ['Added hydration looks only at main flour and added water.', 'Total hydration includes starter flour and starter water.', 'Both numbers can be useful because recipes do not always define hydration the same way.'],
    examples: [{ title: 'Added vs total hydration', input: '600g flour, 420g water, 150g starter at 100%.', output: 'Added hydration is 70%; total hydration is about 73.3% with a 100% hydration starter.' }],
    commonMistakes: ['Do not compare total hydration to a recipe that only reports added hydration without checking the definition.', ...sharedMistakes],
    faqs: [{ question: 'Why are added hydration and total hydration different?', answer: 'Because starter contributes both flour and water. Total hydration includes those internal amounts.' }, ...sharedFaqs],
    relatedSlugs: ['sourdough-hydration-calculator', 'dough-scaling-calculator', 'bakers-percentage-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'sourdough-starter-ratio-1-2-2',
    title: '1:2:2 Starter Feeding Calculator by Weight',
    description: 'Use this 1:2:2 sourdough starter feeding preset to calculate seed starter, flour, water, total build weight, and extra starter to keep by weight in grams.',
    h1: '1:2:2 Starter Feeding Calculator',
    calculatorType: 'starter-feeding',
    defaultInputs: { target: 100, seed: 1, flourpart: 2, waterpart: 2, extra: 10 },
    intro: 'Calculate a 1:2:2 feeding when you want a moderate refresh and enough starter for a recipe plus a small amount to keep.',
    formulaNotes: ['1:2:2 means one part seed starter, two parts flour, and two parts water.', 'The calculator first adds extra starter to keep, then divides the final target into five parts.'],
    examples: [{ title: '100g for dough plus 10g to keep', input: 'Need 100g, keep 10g, ratio 1:2:2.', output: '22g seed starter, 44g flour, 44g water.' }],
    commonMistakes: ['Do not calculate only 100g if you also need starter to keep.', 'Do not assume 1:2:2 peaks at the same time in every kitchen.'],
    faqs: [{ question: 'How many total parts are in 1:2:2?', answer: 'Five parts: one seed part, two flour parts, and two water parts.' }, ...sharedFaqs],
    relatedSlugs: ['starter-feeding-calculator', 'sourdough-starter-ratio-1-5-5', 'levain-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'sourdough-starter-ratio-1-5-5',
    title: '1:5:5 Starter Feeding Calculator by Weight',
    description: 'Use this 1:5:5 sourdough starter feeding preset to calculate seed starter, flour, water, total build weight, and extra starter to keep by weight in grams.',
    h1: '1:5:5 Starter Feeding Calculator',
    calculatorType: 'starter-feeding',
    defaultInputs: { target: 200, seed: 1, flourpart: 5, waterpart: 5, extra: 20 },
    intro: 'Calculate a 1:5:5 feeding for a larger refresh or a longer interval before baking.',
    formulaNotes: ['1:5:5 has eleven total parts.', 'Higher feeding ratios usually take longer to peak, but timing is not guaranteed.'],
    examples: [{ title: '200g for dough plus 20g to keep', input: 'Need 200g, keep 20g, ratio 1:5:5.', output: '20g seed starter, 100g flour, 100g water.' }],
    commonMistakes: ['Do not use 1:5:5 for a fast bake unless your starter and room temperature support it.', 'Do not discard all remaining starter if you want to keep a culture going.'],
    faqs: [{ question: 'Why use 1:5:5?', answer: 'It gives the starter more fresh flour and water relative to seed starter, often useful for longer intervals.' }, ...sharedFaqs],
    relatedSlugs: ['starter-feeding-calculator', 'sourdough-starter-ratio-1-2-2', 'levain-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'levain-calculator',
    title: 'Levain Calculator for Sourdough Builds',
    description: 'Calculate levain build weights from a target amount and feeding ratio, including seed starter, flour, water, and optional extra starter to keep for baking.',
    h1: 'Levain Calculator',
    calculatorType: 'starter-feeding',
    defaultInputs: { target: 180, seed: 1, flourpart: 3, waterpart: 3, extra: 0 },
    intro: 'Build the amount of levain your formula needs from a small amount of seed starter, flour, and water.',
    formulaNotes: ['Levain math is the same ratio math used for starter feeding.', 'Extra starter can be set to zero if the build is only for the dough.'],
    examples: [{ title: '180g levain at 1:3:3', input: 'Target 180g, ratio 1:3:3.', output: 'About 26g seed starter, 77g flour, 77g water.' }],
    commonMistakes: ['Do not confuse levain target weight with total dough weight.', 'Do not rely on this calculator for peak time prediction.'],
    faqs: [{ question: 'Is levain different from starter?', answer: 'A levain is usually a build made from starter for a specific dough. The weight calculation is the same ratio concept.' }, ...sharedFaqs],
    relatedSlugs: ['starter-feeding-calculator', 'sourdough-hydration-calculator', 'sourdough-starter-ratio-1-2-2'],
    isLongTail: true
  }),
  page({
    slug: 'bread-recipe-scaler',
    title: 'Bread Recipe Scaler by Flour or Dough Weight',
    description: 'Scale a bread formula by target dough weight, flour weight, or loaf count, then calculate flour, water, starter, salt, and optional ingredients by grams.',
    h1: 'Bread Recipe Scaler',
    calculatorType: 'dough-scaling',
    defaultInputs: { mode: 'flour', flour: 800, perLoaf: 750, loaves: 2, hyd: 72, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, breadPct: 80, wholePct: 20, ryePct: 0 },
    intro: 'Use this preset when you already know the flour amount or want to scale a recipe into multiple loaves.',
    formulaNotes: ['Known flour mode treats the flour input as total formula flour.', 'Per-loaf results divide each measured ingredient evenly.'],
    examples: [{ title: 'Two loaves from 800g flour', input: '800g total flour, 72% hydration, 20% starter, 2% salt, two loaves.', output: 'The result shows total Add to bowl weights and a per-loaf split.' }],
    commonMistakes: ['Do not divide only flour by loaf count; divide the whole formula.', ...sharedMistakes],
    faqs: [{ question: 'Can I scale from final dough weight instead?', answer: 'Yes. Switch the mode to target dough weight.' }, ...sharedFaqs],
    relatedSlugs: ['dough-scaling-calculator', 'dough-weight-calculator', 'bakers-percentage-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'dough-weight-calculator',
    title: 'Dough Weight Calculator for Bread Loaves',
    description: 'Calculate total dough weight, per-loaf dough weight, and ingredient weights from hydration, starter percentage, salt, flour, and loaf count in grams accurately.',
    h1: 'Dough Weight Calculator',
    calculatorType: 'dough-scaling',
    defaultInputs: { mode: 'per-loaf', target: 1000, perLoaf: 1000, loaves: 1, hyd: 70, starter: 20, sh: 100, salt: 2, oil: 0, sugar: 0, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Start with the final dough weight you want and work backward to flour, water, starter, and salt.',
    formulaNotes: ['Target mode solves total flour first.', 'The target includes flour, water, salt, starter as measured, and optional ingredients.'],
    examples: [{ title: 'One 1000g dough', input: 'Target 1000g, 70% hydration, 20% starter, 2% salt.', output: 'Add to bowl weights sum to 1000g.' }],
    commonMistakes: ['Do not use baked loaf weight as final dough weight; bread loses water during baking.', ...sharedMistakes],
    faqs: [{ question: 'Is final dough weight the same as baked bread weight?', answer: 'No. The baked loaf is lighter because water evaporates during baking.' }, ...sharedFaqs],
    relatedSlugs: ['dough-scaling-calculator', 'bread-recipe-scaler', 'bakers-percentage-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'pizza-dough-ball-weight-calculator',
    title: 'Pizza Dough Ball Weight Calculator by Count',
    description: 'Calculate pizza dough ingredients by ball weight and number of pizzas, including flour, water, salt, oil, yeast or starter, and per-ball totals in grams.',
    h1: 'Pizza Dough Ball Weight Calculator',
    calculatorType: 'pizza-dough',
    defaultInputs: { count: 4, ball: 250, hyd: 65, salt: 2.5, oil: 0, sugar: 0, yeast: 0.2, starter: 20, sh: 100, lev: 'yeast', breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Enter how many dough balls you need and the weight of each ball. The calculator scales the full pizza formula.',
    formulaNotes: ['Total dough = number of balls × ball weight.', 'Per-ball results divide the full formula evenly.'],
    examples: [{ title: 'Four 250g balls', input: '4 pizzas at 250g each.', output: 'The total dough target is 1000g and the table shows each ball split.' }],
    commonMistakes: ['Do not confuse ball weight before fermentation with finished pizza size.', 'Container size and fermentation schedule are not calculated here.'],
    faqs: [{ question: 'Can I change the dough ball weight?', answer: 'Yes. Use any ball weight that matches your pizza size and style.' }, ...sharedFaqs],
    relatedSlugs: ['pizza-dough-calculator', 'sourdough-pizza-calculator', 'dough-scaling-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'sourdough-pizza-calculator',
    title: 'Sourdough Pizza Calculator with Starter',
    description: 'Calculate sourdough pizza dough using starter percentage and starter hydration, with flour, water, salt, oil, total dough, and per-ball weights in grams.',
    h1: 'Sourdough Pizza Calculator',
    calculatorType: 'pizza-dough',
    defaultInputs: { count: 3, ball: 280, hyd: 65, salt: 2.5, oil: 0, sugar: 0, starter: 20, sh: 100, lev: 'sourdough', yeast: 0, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Use sourdough starter instead of yeast and keep the target dough ball weight accurate without double-counting starter.',
    formulaNotes: ['Starter is measured as one Add to bowl ingredient.', 'For hydration, the starter is split into internal flour and water.', 'The total dough target remains pizza count multiplied by ball weight.'],
    examples: [{ title: 'Three sourdough pizza balls', input: '3 balls at 280g, 65% hydration, 20% starter.', output: 'Add to bowl weights sum to 840g and starter is not counted twice.' }],
    commonMistakes: ['Do not add yeast percentage unless you intentionally want hybrid dough.', 'Do not count starter once as an ingredient and again as flour and water.'],
    faqs: [{ question: 'Why is added water lower in sourdough mode?', answer: 'Because the starter already contributes water that counts toward total hydration.' }, ...sharedFaqs],
    relatedSlugs: ['pizza-dough-calculator', 'sourdough-hydration-calculator', 'pizza-dough-ball-weight-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'grams-to-bakers-percentage',
    title: 'Grams to Baker’s Percentage Calculator',
    description: 'Convert ingredient gram weights into baker’s percentages, including hydration, starter, salt, oil, sugar, and custom ingredients against total flour weight.',
    h1: 'Grams to Baker’s Percentage Calculator',
    calculatorType: 'bakers-percentage',
    defaultInputs: { bakerMode: 'weights', flour: 1000, bpWater: 700, bpStarter: 0, bpSalt: 20, bpOil: 0, bpSugar: 0, bpOther: 0, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Paste or enter gram weights and see each ingredient as a baker’s percentage of flour.',
    formulaNotes: ['Baker’s percentage = ingredient weight ÷ flour weight × 100.', 'Flour remains the 100% baseline.'],
    examples: [{ title: '700g water from 1000g flour', input: 'Flour 1000g, water 700g, salt 20g.', output: 'Water 70%, salt 2%.' }],
    commonMistakes: ['Do not divide by total dough weight. Divide by flour weight.', ...sharedMistakes],
    faqs: [{ question: 'Can starter be converted too?', answer: 'Yes. Starter weight can be expressed as a percentage of flour weight.' }, ...sharedFaqs],
    relatedSlugs: ['bakers-percentage-calculator', 'bakers-percentage-to-grams', 'dough-scaling-calculator'],
    isLongTail: true
  }),
  page({
    slug: 'bakers-percentage-to-grams',
    title: 'Baker’s Percentage to Grams Calculator',
    description: 'Convert baker percentages into gram ingredient weights for bread dough, including hydration, starter, salt, oil, sugar, and flour blend percentages by weight.',
    h1: 'Baker’s Percentage to Grams Calculator',
    calculatorType: 'bakers-percentage',
    defaultInputs: { bakerMode: 'percentages', flour: 1000, hyd: 70, starter: 0, salt: 2, oil: 0, sugar: 0, otherPct: 0, breadPct: 100, wholePct: 0, ryePct: 0 },
    intro: 'Start with flour weight and baker’s percentages, then calculate gram weights for each ingredient.',
    formulaNotes: ['Ingredient grams = flour grams × percentage ÷ 100.', 'Optional oil, sugar, and add-ins are included in total dough weight.'],
    examples: [{ title: '70% hydration from 1000g flour', input: 'Flour 1000g, water 70%, salt 2%.', output: 'Water 700g, salt 20g.' }],
    commonMistakes: ['Do not use the final dough weight as the flour input.', ...sharedMistakes],
    faqs: [{ question: 'Can I split the flour into whole wheat or rye?', answer: 'Yes. Adjust the flour blend fields; they must add up to 100%.' }, ...sharedFaqs],
    relatedSlugs: ['bakers-percentage-calculator', 'grams-to-bakers-percentage', 'dough-scaling-calculator'],
    isLongTail: true
  })
];

export const legalPages = [
  { slug: 'about', title: 'About DoughMath Bread and Sourdough Calculators Online', description: 'Learn what DoughMath does, how its browser-only bread calculators handle formula math, and what the site does not store, predict, upload, or replace online.', canonicalPath: '/about' },
  { slug: 'privacy', title: 'DoughMath Privacy Policy for Browser-Only Calculators', description: 'Read how DoughMath handles browser-only calculator inputs, share URLs, analytics, advertising disclosures, and contact information for privacy questions.', canonicalPath: '/privacy' },
  { slug: 'terms', title: 'DoughMath Terms of Use for Bread Formula Calculators', description: 'Review DoughMath terms for using browser-only bread calculators, formula outputs, share links, guide content, affiliate disclosures, and project feedback.', canonicalPath: '/terms' },
  { slug: 'disclaimer', title: 'DoughMath Bread Calculator Disclaimer and Baking Limits', description: 'Read DoughMath’s calculator disclaimer about bread formula math, fermentation variables, food safety, baking outcomes, and professional advice limits.', canonicalPath: '/disclaimer' },
  { slug: 'contact', title: 'Contact DoughMath for Calculator Feedback and Formula Issues', description: 'Contact DoughMath about formula corrections, calculator feedback, accessibility issues, advertising disclosures, or GitHub project issue reports for the site.', canonicalPath: '/contact' },
  { slug: 'affiliate-disclosure', title: 'DoughMath Affiliate Disclosure for Baking Tool Links', description: 'Read DoughMath’s affiliate disclosure for baking tool links, calculator independence, advertising separation, and how recommendations stay outside results.', canonicalPath: '/affiliate-disclosure' }
] as const;

export const allPages = [
  { canonicalPath: '/' },
  ...toolPages.map((page) => ({ canonicalPath: page.canonicalPath })),
  ...legalPages.map((page) => ({ canonicalPath: page.canonicalPath }))
];
export const longTailPages = toolPages.filter((page) => page.isLongTail);
export function getToolPage(slug: string) { return toolPages.find((page) => page.slug === slug); }
export function getToolPageOrThrow(slug: string) { const page = getToolPage(slug); if (!page) throw new Error(`Unknown tool page: ${slug}`); return page; }
