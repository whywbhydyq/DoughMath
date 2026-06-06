export type ResultMicrocopy = {
  summary: string;
  addToBowl: string;
  formulaTotals: string;
  starterSplit?: string;
  perUnit?: string;
  warnings?: string;
  error?: string;
  copyHint?: string;
};

export type ExplanationModule = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type SearchIntentModule = {
  eyebrow: string;
  heading: string;
  quickAnswer: string;
  userGoal: string;
  bestFor: string[];
  notFor: string[];
};

export type CalculationStepModule = {
  eyebrow: string;
  heading: string;
  steps: string[];
};

export type PresetModule = {
  eyebrow: string;
  heading: string;
  description: string;
  parameters: { label: string; value: string; note?: string }[];
  exampleNote: string;
  ctaLabel: string;
};

export type LinkCardCopy = {
  eyebrow: string;
  description: string;
  cta: string;
};
