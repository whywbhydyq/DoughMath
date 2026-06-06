export type DirectoryClusterId =
  | 'bread-formula-math'
  | 'sourdough-hydration'
  | 'starter-and-levain'
  | 'dough-scaling'
  | 'pizza-dough'
  | 'method-guides';

export type DirectoryCluster = {
  id: DirectoryClusterId;
  title: string;
  description: string;
};

export const directoryClusters: DirectoryCluster[] = [
  {
    id: 'bread-formula-math',
    title: 'Bread formula math',
    description: 'Convert between baker’s percentages and ingredient weights when flour is the 100% baseline.'
  },
  {
    id: 'sourdough-hydration',
    title: 'Sourdough hydration',
    description: 'Calculate total hydration, added hydration, and starter flour or water contributions.'
  },
  {
    id: 'starter-and-levain',
    title: 'Starter and levain builds',
    description: 'Plan starter feedings and levain builds from target weights and ratio parts.'
  },
  {
    id: 'dough-scaling',
    title: 'Dough scaling',
    description: 'Scale bread by flour weight, target dough weight, loaf count, or final dough size.'
  },
  {
    id: 'pizza-dough',
    title: 'Pizza dough',
    description: 'Calculate pizza dough by ball count, ball weight, hydration, salt, yeast, or starter.'
  },
  {
    id: 'method-guides',
    title: 'Method guides',
    description: 'Use the guides when you need the calculation concepts before choosing a tool.'
  }
];

const pathToCluster: Record<string, DirectoryClusterId> = {
  '/bakers-percentage-calculator': 'bread-formula-math',
  '/grams-to-bakers-percentage': 'bread-formula-math',
  '/bakers-percentage-to-grams': 'bread-formula-math',
  '/sourdough-hydration-calculator': 'sourdough-hydration',
  '/total-hydration-calculator': 'sourdough-hydration',
  '/starter-feeding-calculator': 'starter-and-levain',
  '/sourdough-starter-ratio-1-2-2': 'starter-and-levain',
  '/sourdough-starter-ratio-1-5-5': 'starter-and-levain',
  '/levain-calculator': 'starter-and-levain',
  '/dough-scaling-calculator': 'dough-scaling',
  '/bread-recipe-scaler': 'dough-scaling',
  '/dough-weight-calculator': 'dough-scaling',
  '/pizza-dough-calculator': 'pizza-dough',
  '/pizza-dough-ball-weight-calculator': 'pizza-dough',
  '/sourdough-pizza-calculator': 'pizza-dough',
  '/guides/bakers-percentage': 'method-guides',
  '/guides/total-hydration-vs-added-hydration': 'method-guides',
  '/guides/sourdough-starter-feeding-ratios': 'method-guides',
  '/guides/how-to-scale-bread-recipes': 'method-guides',
  '/guides/why-use-grams-for-bread-baking': 'method-guides'
};

export function getDirectoryClusterId(path: string): DirectoryClusterId {
  return pathToCluster[path] ?? 'method-guides';
}
