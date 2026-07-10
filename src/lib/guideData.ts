export type GuidePage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  canonicalPath: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  related: { href: string; label: string }[];
};

export const guidePages: GuidePage[] = [
  {
    slug: 'bakers-percentage',
    title: "Baker's Percentage Guide | DoughMath",
    description: "Learn how baker's percentage works, why flour is 100%, and how to verify ingredient weights when scaling bread formulas.",
    h1: "How Baker's Percentage Works",
    canonicalPath: '/guides/bakers-percentage',
    intro: "Baker's percentage expresses every ingredient relative to total flour weight. It is a ratio system, not a statement that the finished dough adds up to 100%.",
    sections: [
      {
        heading: 'The reference line is total flour',
        body: [
          'Add every flour in the formula before calculating percentages. Bread flour, whole wheat flour, rye flour, and flour contributed by a preferment all belong to the total-flour reference when you are comparing complete formulas.',
          'Once total flour is known, divide each ingredient weight by total flour and multiply by 100. A formula with 500 g flour and 375 g water has 75% hydration because 375 ÷ 500 × 100 = 75.'
        ]
      },
      {
        heading: 'Worked scaling example',
        body: [
          'For 500 g flour at 75% water, 2% salt, and 20% starter, the direct ingredient weights are 375 g water, 10 g salt, and 100 g starter. The measured total is 985 g when starter is treated as a single ingredient line.',
          'To scale the same ratios to 800 g flour, multiply each percentage by 800 g: 600 g water, 16 g salt, and 160 g starter. The percentages stay unchanged even though every weight is larger.'
        ]
      },
      {
        heading: 'How to verify a converted formula',
        body: [
          'Recalculate one line by hand before trusting a copied recipe. Water weight divided by flour weight should return the displayed hydration, and salt weight divided by flour weight should return the displayed salt percentage.',
          'Do not mix the “starter as one ingredient” view with a “starter split into flour and water” view in the same total. Use the sourdough hydration calculator when you need total flour and total water after splitting the starter.'
        ]
      }
    ],
    related: [
      { href: '/bakers-percentage-calculator', label: "Baker's Percentage Calculator" },
      { href: '/grams-to-bakers-percentage', label: 'Grams to Baker’s Percentage' },
      { href: '/bakers-percentage-to-grams', label: 'Baker’s Percentage to Grams' }
    ]
  },
  {
    slug: 'total-hydration-vs-added-hydration',
    title: 'Total Hydration vs Added Hydration | DoughMath',
    description: 'Understand added hydration and total hydration when sourdough starter contributes both flour and water.',
    h1: 'Total Hydration vs Added Hydration',
    canonicalPath: '/guides/total-hydration-vs-added-hydration',
    intro: 'Two recipes can list the same added water but produce different total hydration when their starters have different weights or hydration levels.',
    sections: [
      {
        heading: 'Added hydration only uses the main mix',
        body: [
          'Added hydration divides water poured into the final dough by the main flour added to the final dough. With 500 g main flour and 350 g added water, added hydration is 70%.',
          'This number is useful when following a simple mixing instruction, but it does not describe the complete formula if a starter or levain is present.'
        ]
      },
      {
        heading: 'Total hydration includes the starter split',
        body: [
          'A 100 g starter at 100% hydration contains 50 g flour and 50 g water. Combined with 500 g main flour and 350 g added water, the formula contains 550 g total flour and 400 g total water.',
          'Total hydration is therefore 400 ÷ 550 × 100, or about 72.7%. Salt percentage should also be calculated against 550 g total flour when you want the complete formula percentage.'
        ]
      },
      {
        heading: 'Cases that deserve a manual check',
        body: [
          'A stiff starter contributes proportionally more flour; a liquid starter contributes proportionally more water. Enter the actual starter hydration instead of assuming every starter is 100%.',
          'If a calculated amount of added water becomes negative, the starter already contains more water than the target hydration allows. Reduce the starter, increase the target hydration, or use a stiffer starter rather than rounding the negative value to zero.'
        ]
      }
    ],
    related: [
      { href: '/sourdough-hydration-calculator', label: 'Sourdough Hydration Calculator' },
      { href: '/total-hydration-calculator', label: 'Total Hydration Calculator' },
      { href: '/dough-scaling-calculator', label: 'Dough Scaling Calculator' }
    ]
  },
  {
    slug: 'sourdough-starter-feeding-ratios',
    title: 'Sourdough Starter Feeding Ratios Guide | DoughMath',
    description: 'Learn how to calculate 1:1:1, 1:2:2, 1:5:5, and custom sourdough starter feedings by weight.',
    h1: 'Sourdough Starter Feeding Ratios',
    canonicalPath: '/guides/sourdough-starter-feeding-ratios',
    intro: 'A starter feeding ratio lists seed starter, flour, and water parts in that order. The parts are weights, not volume measures.',
    sections: [
      {
        heading: 'Convert a target weight into parts',
        body: [
          'For a 1:2:2 feeding, add the ratio parts: 1 + 2 + 2 = 5. Divide the desired final starter weight by 5 to find the weight of one part.',
          'A 100 g final target therefore uses 20 g seed starter, 40 g flour, and 40 g water. If you need 100 g for a recipe and want to keep 10 g, calculate against a 110 g final target instead.'
        ]
      },
      {
        heading: 'Hydration follows the flour and water parts',
        body: [
          'Equal flour and water parts make a 100% hydration feeding. A 1:2:1 feeding uses half as much water as flour and produces a 50% hydration feed, regardless of the seed part.',
          'The seed starter already contains flour and water, so the exact hydration of the entire refreshed starter can differ slightly when the seed hydration differs from the feed ratio.'
        ]
      },
      {
        heading: 'The calculator does not predict peak time',
        body: [
          'A larger feed ratio generally supplies more fresh food per gram of seed, but temperature, flour type, inoculation strength, container shape, and starter health all affect timing.',
          'Use the weight result to mix the feed, then observe rise, bubbles, aroma, and your normal maturity markers. Do not convert the ratio output into a fixed food-safety or fermentation-time guarantee.'
        ]
      }
    ],
    related: [
      { href: '/starter-feeding-calculator', label: 'Starter Feeding Calculator' },
      { href: '/sourdough-starter-ratio-1-5-5', label: '1:5:5 Starter Feeding' },
      { href: '/sourdough-starter-ratio-1-2-2', label: '1:2:2 Starter Feeding' }
    ]
  },
  {
    slug: 'how-to-scale-bread-recipes',
    title: 'How to Scale Bread Recipes | DoughMath',
    description: 'Scale bread recipes by flour weight, target dough weight, and loaf count without double-counting starter.',
    h1: 'How to Scale Bread Recipes',
    canonicalPath: '/guides/how-to-scale-bread-recipes',
    intro: 'Choose the scaling method from the constraint you actually know: available flour, desired batch weight, or finished loaf count.',
    sections: [
      {
        heading: 'Scale from a known flour weight',
        body: [
          'When flour weight is fixed, multiply that weight by each baker’s percentage. For 600 g flour at 70% hydration and 2% salt, water is 420 g and salt is 12 g before any preferment split.',
          'This method is useful when your bag, mixer, or recipe sets the flour amount. It also makes flour-blend percentages easy to verify because the blend lines must add to the total flour weight.'
        ]
      },
      {
        heading: 'Solve backward from target dough weight',
        body: [
          'When the final batch must weigh a specific amount, divide the target by the sum of the formula factors. A formula with 70% water and 2% salt has a factor of 1.72 before optional ingredients.',
          'For sourdough formulas, DoughMath solves total flour first, then splits the starter into internal flour and water. The starter is still measured once in the bowl and must not be added again after its components appear in formula totals.'
        ]
      },
      {
        heading: 'Check per-loaf and rounding effects',
        body: [
          'Divide the calculated batch by loaf count only after the complete formula is known. Rounding each ingredient before scaling can create a different final total than scaling first and rounding once.',
          'For large batches, compare the calculated total with mixer capacity and proofing space. For small batches, keep decimal weights for salt and yeast until the final display step.'
        ]
      }
    ],
    related: [
      { href: '/dough-scaling-calculator', label: 'Dough Scaling Calculator' },
      { href: '/bread-recipe-scaler', label: 'Bread Recipe Scaler' },
      { href: '/dough-weight-calculator', label: 'Dough Weight Calculator' }
    ]
  },
  {
    slug: 'why-use-grams-for-bread-baking',
    title: 'Why Use Grams for Bread Baking | DoughMath',
    description: 'Why weighing bread ingredients in grams makes hydration, salt percentage, and recipe scaling more repeatable.',
    h1: 'Why Use Grams for Bread Baking',
    canonicalPath: '/guides/why-use-grams-for-bread-baking',
    intro: 'Bread formulas depend on ratios, and weight measurements preserve those ratios more reliably than packed or scooped volume measurements.',
    sections: [
      {
        heading: 'Volume changes with packing and ingredient shape',
        body: [
          'A cup of flour can hold different weights depending on how it was filled, leveled, sifted, or compressed. Salt crystal size and starter bubbles also make volume conversions inconsistent.',
          'Those differences affect hydration and salt percentage directly. A small measuring error may be hard to notice in one loaf but becomes larger when the recipe is multiplied.'
        ]
      },
      {
        heading: 'Weight supports direct percentage checks',
        body: [
          'With grams, hydration is simply water weight divided by flour weight. Salt percentage is salt weight divided by flour weight. The units cancel, which makes the ratio easy to audit.',
          'A scale also lets you tare the bowl between ingredients, compare the measured total with the calculated total, and divide dough into equal portions without relying on visual estimates.'
        ]
      },
      {
        heading: 'Use suitable precision',
        body: [
          'A normal kitchen scale is usually adequate for flour and water. Very small yeast or salt quantities may need a scale with finer resolution, especially when making a small batch.',
          'Unit conversion does not create precision that was not measured. Converting a rounded ounce value to grams can look exact while still carrying the original rounding error, so keep the original measured unit and precision in your notes.'
        ]
      }
    ],
    related: [
      { href: '/bakers-percentage-calculator', label: "Baker's Percentage Calculator" },
      { href: '/pizza-dough-calculator', label: 'Pizza Dough Calculator' },
      { href: '/dough-scaling-calculator', label: 'Dough Scaling Calculator' }
    ]
  }
];

export const guidePaths = guidePages.map((page) => ({
  canonicalPath: page.canonicalPath,
  priority: 0.65,
  changeFrequency: 'monthly' as const
}));

export const getGuidePage = (slug: string) => guidePages.find((page) => page.slug === slug);
