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
    title: "Baker’s Percentage Guide for Bread Math | DoughMath",
    description: "Learn how baker’s percentage works in bread formulas, why total flour is 100%, and how to convert hydration, salt, and starter into gram weights easily.",
    h1: "How Baker's Percentage Works",
    canonicalPath: '/guides/bakers-percentage',
    intro: "Baker's percentage is the scaling system behind repeatable bread formulas.",
    sections: [
      {
        heading: 'Core idea',
        body: [
          'Total flour is always 100%. If a dough uses multiple flours, add the flour weights first, then treat that combined flour weight as the reference line.',
          'Every other ingredient is measured as a percentage of total flour weight. Water becomes hydration, salt becomes salt percentage, and starter can be recorded as total starter weight or split into flour and water for sourdough math.',
          'This lets a formula scale from one loaf to many loaves without changing the ratio between ingredients.'
        ]
      },
      {
        heading: 'Formula to remember',
        body: [
          'Ingredient weight = flour weight × baker’s percentage ÷ 100.',
          'Baker’s percentage = ingredient weight ÷ flour weight × 100.',
          'These two formulas are enough to move between gram weights and percentage formulas for most bread dough planning.'
        ]
      },
      {
        heading: 'Example',
        body: [
          'If flour is 500g and water is 375g, hydration is 75%. The water percentage is 375 ÷ 500 × 100.',
          'If salt is 10g, salt is 2%. The salt percentage is 10 ÷ 500 × 100.',
          'If starter is entered as 20% of flour, the measured starter weight is 100g. For total sourdough hydration, that starter still needs to be split into its own flour and water.'
        ]
      },
      {
        heading: 'Common interpretation mistakes',
        body: [
          'Baker’s percentage totals often exceed 100% because every ingredient is added on top of the flour baseline. A 75% hydration dough with 2% salt is already 177% before starter, oil, or sugar are counted.',
          'Water is not the 100% line. Flour is the 100% line. This is the most common mistake when converting a normal recipe into baker’s math.'
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
    title: 'Total vs Added Hydration Guide for Sourdough | DoughMath',
    description: 'Understand added hydration versus total hydration in sourdough formulas, including how starter flour and starter water change the final dough percentage.',
    h1: 'Total Hydration vs Added Hydration',
    canonicalPath: '/guides/total-hydration-vs-added-hydration',
    intro: 'Sourdough formulas can look wetter or drier depending on whether starter flour and water are included.',
    sections: [
      {
        heading: 'Added hydration',
        body: [
          'Added hydration uses only the water poured into the bowl divided by the main flour. It is useful when following a simple recipe written without preferment math.',
          'Added hydration can understate how wet the dough really is when a large levain or starter is included, because starter already contributes water.'
        ]
      },
      {
        heading: 'Total hydration',
        body: [
          'Total hydration adds starter flour to total flour and starter water to total water before calculating the percentage.',
          'This is the more accurate number for comparing sourdough formulas because it uses all flour and all water in the dough, not just the ingredients added separately.'
        ]
      },
      {
        heading: 'Starter split example',
        body: [
          'A 100g starter at 100% hydration contains about 50g flour and 50g water.',
          'If the dough also has 500g main flour and 350g added water, total flour becomes 550g and total water becomes 400g.',
          'The total hydration is therefore about 72.7%, even though added water divided by main flour looks like 70%.'
        ]
      },
      {
        heading: 'When to use each number',
        body: [
          'Use added hydration when you are adjusting the water you pour into the bowl.',
          'Use total hydration when you are comparing two sourdough formulas, checking salt percentage, or moving a recipe between different starter amounts.'
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
    description: 'Learn what 1:1:1, 1:2:2, 1:5:5, and 1:10:10 starter feeding ratios mean by weight, and how to calculate each sourdough build in grams for home baking.',
    h1: 'Sourdough Starter Feeding Ratios',
    canonicalPath: '/guides/sourdough-starter-feeding-ratios',
    intro: 'Starter feeding ratios are weight ratios for seed starter, flour, and water.',
    sections: [
      {
        heading: 'Reading a ratio',
        body: [
          'A ratio such as 1:2:2 means one part seed starter, two parts flour, and two parts water by weight.',
          'The numbers are not cups or spoons. They are parts of the final build. A 1:2:2 build has five total parts.'
        ]
      },
      {
        heading: 'Example calculation',
        body: [
          'For a 100g target at 1:2:2, divide 100g by five total parts. One part is 20g.',
          'The build uses 20g seed starter, 40g flour, and 40g water.',
          'If you need 100g for a dough and want 10g left to keep, calculate against 110g instead of 100g.'
        ]
      },
      {
        heading: 'Choosing ratios',
        body: [
          'Higher feedings such as 1:5:5 or 1:10:10 use less seed starter relative to fresh flour and water.',
          'That can be useful for overnight builds or warmer rooms, but peak time still depends on starter strength, flour, hydration, and temperature.'
        ]
      },
      {
        heading: 'What the calculator does not predict',
        body: [
          'DoughMath calculates weights only and does not predict peak time.',
          'Use the output as a weighing plan, then rely on starter rise, aroma, dome shape, and recipe timing to decide when the build is ready.'
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
    title: 'How to Scale Bread Recipes by Dough Weight | DoughMath',
    description: 'Learn how to scale bread recipes by flour weight, target dough weight, and loaf count using baker percentages and gram-based dough math for consistent bakes.',
    h1: 'How to Scale Bread Recipes',
    canonicalPath: '/guides/how-to-scale-bread-recipes',
    intro: 'Scaling bread is easiest when the recipe is expressed with baker percentages.',
    sections: [
      {
        heading: 'Scale from flour weight',
        body: [
          'Use known flour weight when you already know how much flour you want to use.',
          'Water, starter, salt, and optional ingredients are calculated from flour. This is the simplest approach when adapting a formula to the flour you have available.'
        ]
      },
      {
        heading: 'Scale from target dough weight',
        body: [
          'Use target dough weight when you need a specific loaf, pan, or batch size.',
          'The calculator solves backward from final dough weight to the flour amount required by hydration, starter, salt, oil, sugar, and other percentages.'
        ]
      },
      {
        heading: 'Scale by loaf count',
        body: [
          'Loaf count scaling starts with the number of loaves and the desired dough weight per loaf.',
          'For example, two 750g loaves need a 1500g dough target before dividing. After mixing and bulk fermentation, divide the dough by weight for consistent loaves.'
        ]
      },
      {
        heading: 'Sourdough scaling detail',
        body: [
          'For sourdough, starter flour and starter water should be included in total flour and total water.',
          'This prevents the starter from being counted twice and keeps total hydration accurate when starter percentage changes.'
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
    title: 'Why Use Grams for Bread Baking Formulas | DoughMath',
    description: 'Learn why grams are more reliable than cups for bread, sourdough, and pizza dough formulas, especially when scaling hydration, starter, salt, and flour.',
    h1: 'Why Use Grams for Bread Baking',
    canonicalPath: '/guides/why-use-grams-for-bread-baking',
    intro: 'Bread formulas depend on ratios, and ratios depend on accurate weight.',
    sections: [
      {
        heading: 'Cups vary',
        body: [
          'A cup of flour can weigh very different amounts depending on flour type, humidity, how the flour was scooped, and how tightly it was packed.',
          'Small differences become large when scaling dough, especially when hydration or salt percentage needs to stay consistent.'
        ]
      },
      {
        heading: 'Grams repeat',
        body: [
          'A gram is a direct weight measurement, so the same formula can be repeated more accurately across batches.',
          'Using grams makes hydration, salt percentage, starter percentage, and pizza ball weight easier to compare.'
        ]
      },
      {
        heading: 'Baker’s percentage depends on weight',
        body: [
          'Baker’s math compares ingredient weights to flour weight. That means the system works best when all major ingredients are weighed.',
          'Once everything is in grams, changing a formula from one loaf to four loaves is a ratio problem instead of a cup conversion problem.'
        ]
      },
      {
        heading: 'When volume can still help',
        body: [
          'Small flavor ingredients can still be described by spoons in informal recipes, but flour, water, starter, and salt should be weighed for dough formulas.',
          'If you start from a cup-based recipe, weigh each ingredient once, then convert the weights into baker’s percentages for future scaling.'
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

export const guidePaths = guidePages.map((page) => ({ canonicalPath: page.canonicalPath }));
export const getGuidePage = (slug: string) => guidePages.find((page) => page.slug === slug);
