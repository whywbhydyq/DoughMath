export type HomeModeId =
  | 'dough-scaling'
  | 'sourdough-hydration'
  | 'starter-feeding'
  | 'bakers-percentage'
  | 'pizza-dough';

export type DoughScalingHomeState = {
  targetDoughWeightGrams: number;
  loafCount: number;
  hydrationPct: number;
  starterPct: number;
  starterHydrationPct: number;
  saltPct: number;
};

export type SourdoughHydrationHomeState = {
  mainFlourGrams: number;
  addedWaterGrams: number;
  starterWeightGrams: number;
  starterHydrationPct: number;
  saltWeightGrams: number;
};

export type StarterFeedingHomeState = {
  targetStarterWeightGrams: number;
  extraGrams: number;
  seedPart: number;
  flourPart: number;
  waterPart: number;
};

export type BakersPercentageHomeState = {
  flourWeightGrams: number;
  hydrationPct: number;
  starterPct: number;
  saltPct: number;
};

export type PizzaDoughHomeState = {
  pizzaCount: number;
  ballWeightGrams: number;
  hydrationPct: number;
  saltPct: number;
  leaveningType: 'yeast' | 'sourdough';
  yeastPct: number;
  starterPct: number;
  starterHydrationPct: number;
};

export type HomeFormState = {
  'dough-scaling': DoughScalingHomeState;
  'sourdough-hydration': SourdoughHydrationHomeState;
  'starter-feeding': StarterFeedingHomeState;
  'bakers-percentage': BakersPercentageHomeState;
  'pizza-dough': PizzaDoughHomeState;
};

export type HomeModeConfig = {
  id: HomeModeId;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  resultLabel: string;
};

export const homeModes: HomeModeConfig[] = [
  {
    id: 'dough-scaling',
    title: 'Scale dough',
    shortTitle: 'Scaling',
    description: 'Target weight → flour, water, starter',
    href: '/dough-scaling-calculator',
    resultLabel: 'Add to bowl'
  },
  {
    id: 'sourdough-hydration',
    title: 'Check hydration',
    shortTitle: 'Hydration',
    description: 'Include starter flour and water',
    href: '/sourdough-hydration-calculator',
    resultLabel: 'Formula totals'
  },
  {
    id: 'starter-feeding',
    title: 'Feed starter',
    shortTitle: 'Starter',
    description: 'Ratio → seed, flour, water',
    href: '/starter-feeding-calculator',
    resultLabel: 'Feeding build'
  },
  {
    id: 'bakers-percentage',
    title: 'Baker’s %',
    shortTitle: 'Baker’s %',
    description: 'Percentages → ingredient weights',
    href: '/bakers-percentage-calculator',
    resultLabel: 'Formula weights'
  },
  {
    id: 'pizza-dough',
    title: 'Pizza dough',
    shortTitle: 'Pizza',
    description: 'Balls × weight → formula',
    href: '/pizza-dough-calculator',
    resultLabel: 'Pizza batch'
  }
];

export const defaultHomeState: HomeFormState = {
  'dough-scaling': {
    targetDoughWeightGrams: 1000,
    loafCount: 1,
    hydrationPct: 75,
    starterPct: 20,
    starterHydrationPct: 100,
    saltPct: 2
  },
  'sourdough-hydration': {
    mainFlourGrams: 600,
    addedWaterGrams: 420,
    starterWeightGrams: 150,
    starterHydrationPct: 100,
    saltWeightGrams: 12
  },
  'starter-feeding': {
    targetStarterWeightGrams: 100,
    extraGrams: 10,
    seedPart: 1,
    flourPart: 2,
    waterPart: 2
  },
  'bakers-percentage': {
    flourWeightGrams: 500,
    hydrationPct: 75,
    starterPct: 20,
    saltPct: 2
  },
  'pizza-dough': {
    pizzaCount: 3,
    ballWeightGrams: 280,
    hydrationPct: 65,
    saltPct: 2.5,
    leaveningType: 'yeast',
    yeastPct: 0.2,
    starterPct: 20,
    starterHydrationPct: 100
  }
};

export const starterRatioPresets = [
  { label: '1:1:1', seedPart: 1, flourPart: 1, waterPart: 1 },
  { label: '1:2:2', seedPart: 1, flourPart: 2, waterPart: 2 },
  { label: '1:3:3', seedPart: 1, flourPart: 3, waterPart: 3 },
  { label: '1:5:5', seedPart: 1, flourPart: 5, waterPart: 5 }
];
