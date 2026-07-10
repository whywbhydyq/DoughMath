import type { ResultMicrocopy, ExplanationModule, PresetModule, LinkCardCopy } from '@/types/content';
import type { ToolPageData } from '@/lib/pageData';

function value(input: Record<string, number | string>, key: string, suffix = '') {
  const raw = input[key];
  if (raw === undefined || raw === '') return undefined;
  return `${raw}${suffix}`;
}

function addParam(params: PresetModule['parameters'], label: string, raw?: string, note?: string) {
  if (!raw) return;
  params.push({ label, value: raw, note });
}

function getLongTailContext(page: ToolPageData) {
  if (!page.isLongTail) return undefined;
  const firstExample = page.examples[0];
  const exampleText = firstExample ? ` The example on this page uses ${firstExample.input.toLowerCase()} and explains the resulting weights without changing the calculator logic.` : '';
  return `This preset is tuned for ${page.h1.toLowerCase()}. The calculator above starts with the preset values, but every field remains editable so you can keep the page as a starting point instead of a fixed recipe.${exampleText}`;
}

function withLongTailContext(module: ExplanationModule, page: ToolPageData): ExplanationModule {
  const context = getLongTailContext(page);
  if (!context) return module;
  return { ...module, paragraphs: [context, ...module.paragraphs] };
}

export function getResultMicrocopy(page: ToolPageData): ResultMicrocopy {
  switch (page.calculatorType) {
    case 'bakers-percentage':
      return {
        summary: 'Read the top cards first: they show the dough size and formula percentage after the current inputs. Then use Add to bowl for the weights you actually measure.',
        addToBowl: 'These are the ingredient weights to put on the scale. Flour stays the 100% reference line; water, salt, starter, oil, sugar, and custom items are scaled from that flour weight.',
        formulaTotals: 'Use these totals to check whether the formula size and percentages match your target before mixing.',
        warnings: 'Warnings flag unusual percentages or flour blends, not automatic failures.',
        error: 'Check flour weight and percentage fields. Baker’s math needs a positive flour baseline before it can calculate ratios.',
        copyHint: 'Copy the result after the weights look right, then paste it into your bake notes or production sheet.'
      };
    case 'sourdough-hydration':
      return {
        summary: 'Use the hydration cards to compare added water with true total hydration after starter flour and starter water are included.',
        addToBowl: 'These are the measured inputs: main flour, added water, starter, and salt. Do not add the starter flour and starter water again as separate ingredients.',
        formulaTotals: 'These totals split the starter internally so hydration, salt percentage, and total dough weight use the full flour and water in the formula.',
        starterSplit: 'Starter split explains how much flour and water your starter contributes to the formula math.',
        warnings: 'Warnings are checks for unusual hydration, salt, starter, or flour blend values.',
        error: 'Check flour, water, starter weight, and starter hydration. Negative or non-finite values cannot produce a hydration result.',
        copyHint: 'Copy this when you need to compare recipe hydration definitions or adjust added water.'
      };
    case 'starter-feeding':
      return {
        summary: 'The result tells you how much seed starter, flour, and water to mix for the selected feeding ratio and target amount.',
        addToBowl: 'Measure these three weights into a clean container. The total includes the starter needed for the dough plus any extra amount you chose to keep.',
        formulaTotals: 'Starter feeding is ratio math, so the final starter weight is divided by total ratio parts.',
        warnings: 'Timing notes are informational. Peak time still depends on temperature, flour, hydration, and starter activity.',
        error: 'Check the target starter weight and ratio parts. Each ratio part must be greater than zero.',
        copyHint: 'Copy the feeding weights when you want a quick levain build note for your schedule.'
      };
    case 'dough-scaling':
      return {
        summary: 'Start with Total dough and Add to bowl. The calculator solves the flour, water, starter, and salt needed for your target dough weight without counting starter twice.',
        addToBowl: 'These are the weights to measure. Starter appears as one ingredient because it already contains its own flour and water.',
        formulaTotals: 'Formula totals show the internal math after starter is split into flour and water for hydration and percentage checks.',
        starterSplit: 'Use this only for understanding hydration. Do not add these flour and water amounts again.',
        perUnit: 'Use the per-loaf split after mixing or scaling if you divide the batch into equal loaves.',
        warnings: 'Warnings flag values that may make the dough hard to handle or indicate a likely input mistake.',
        error: 'Check the target weight, hydration, starter percentage, and starter hydration. A formula cannot require negative added flour or water.',
        copyHint: 'Copy the result once the Add to bowl section matches the batch you want to mix.'
      };
    case 'pizza-dough':
      return {
        summary: 'Use Total dough and Per dough ball together: one checks the full batch, the other checks each portion before balling.',
        addToBowl: 'These are the batch weights for flour, water, salt, and yeast or starter. Oil and sugar appear only when entered above zero.',
        formulaTotals: 'Formula totals show whether the hydration, salt, and total dough percentage match the pizza style you are targeting.',
        starterSplit: 'In sourdough mode, starter is split internally for hydration math but measured as one ingredient.',
        perUnit: 'Per dough ball shows the approximate ingredient share for each pizza ball; divide the mixed dough by ball weight for practical portioning.',
        warnings: 'Warnings flag large batches or unusual percentages. They are planning notes, not baking rules.',
        error: 'Check pizza count, ball weight, hydration, and leavening values. Count and ball weight must be greater than zero.',
        copyHint: 'Copy the result for a dough prep note, then adjust fermentation time outside this calculator.'
      };
  }
}

export function getExplanationModule(page: ToolPageData): ExplanationModule {
  if (page.calculatorType === 'bakers-percentage') {
    return withLongTailContext({
      eyebrow: 'Use the result',
      heading: 'How to use the baker’s percentage result',
      paragraphs: [
        'Baker’s math treats flour as the 100% reference line. That makes the formula easier to scale than a normal recipe because every ingredient is tied to flour weight instead of to a fixed batch size. Enter a flour weight and the percentages you want, or switch to weight mode to convert an existing gram formula back into percentages.',
        'The Add to bowl section is the practical weighing list. It is what goes on the scale. The formula totals are the check layer: they show total dough weight, total formula percentage, and the resulting ingredient ratios. Use those totals before mixing, especially when you add starter, oil, sugar, or custom ingredients.',
        'This page is not trying to choose the “right” bread style for you. It keeps the arithmetic consistent so you can compare formulas, resize a batch, or translate notes from one flour amount to another. Dough feel still depends on flour absorption, mixing, fermentation, and temperature.'
      ],
      bullets: ['Use flour as the 100% baseline.', 'Use Add to bowl for scale weights.', 'Use formula totals to check the batch before mixing.']
    }, page);
  }
  if (page.calculatorType === 'sourdough-hydration') {
    return withLongTailContext({
      eyebrow: 'Hydration check',
      heading: 'How to read added hydration and total hydration',
      paragraphs: [
        'Sourdough hydration can be confusing because a starter or levain already contains flour and water. This calculator separates the measured starter into its internal flour and water, then adds those amounts to the main formula totals. That gives you a total hydration number that reflects the whole dough, not only the water poured into the bowl.',
        'Use the Add to bowl section for weighing: main flour, added water, starter, and salt. Use the Starter split and Formula totals sections for interpretation. The split is not an extra ingredient list; it is the accounting that explains why the total hydration can differ from the simple added-water percentage.',
        'This is useful when comparing recipes that report hydration differently. Some recipes mean added water divided by main flour. Others include levain flour and levain water. DoughMath shows both concepts where possible so you can adjust water without accidentally double-counting the starter.'
      ],
      bullets: ['Starter is measured once but split for formula math.', 'Total hydration includes starter flour and water.', 'Salt percentage is checked against total flour.']
    }, page);
  }
  if (page.calculatorType === 'starter-feeding') {
    return withLongTailContext({
      eyebrow: 'Feeding weights',
      heading: 'How to use the starter feeding result',
      paragraphs: [
        'Starter feeding is ratio math. A 1:2:2 build means one part seed starter, two parts flour, and two parts water by weight. The calculator first adds the amount you need for the recipe and any extra starter you want to keep, then divides that final target by the total number of ratio parts.',
        'The result is a weighing plan, not a fermentation schedule. Higher feeding ratios usually give the starter more food relative to seed starter, but peak time still depends on room temperature, flour type, hydration, inoculation strength, and how active the starter was before feeding.',
        'Use the output when you know how much levain or ripe starter your dough needs and want to avoid guessing. If you need 100 g for the dough and want 10 g left for the next refresh, include both amounts so the final build does not leave you short.'
      ],
      bullets: ['Final target includes recipe starter plus extra to keep.', 'Ratio parts determine seed, flour, and water weights.', 'Peak time is not predicted by this calculator.']
    }, page);
  }
  if (page.calculatorType === 'dough-scaling') {
    return withLongTailContext({
      eyebrow: 'Batch planning',
      heading: 'How to use the dough scaling result',
      paragraphs: [
        'Use this calculator when you know the final dough weight, loaf count, or flour amount you want, and need the formula scaled back into practical ingredient weights. In target-weight mode, DoughMath solves the total flour required from the hydration, starter percentage, salt, and optional ingredients, then builds the Add to bowl list from that flour amount.',
        'The important detail is that starter is not counted twice. The starter appears as one measured ingredient in Add to bowl. For the formula totals, it is also split into starter flour and starter water so hydration and total flour percentages stay accurate. That is why Add to bowl and Formula totals answer different questions.',
        'Use the per-loaf section when dividing the mixed dough. Use the formula totals when checking hydration or comparing formulas. If the calculator warns about negative added water or very high starter, change the starter percentage, hydration, or starter hydration before mixing.'
      ],
      bullets: ['Target mode solves flour from final dough weight.', 'Starter is measured once and split only for math.', 'Per-loaf numbers help divide the mixed batch.']
    }, page);
  }
  return withLongTailContext({
    eyebrow: 'Pizza formula',
    heading: 'How to use the pizza dough result',
    paragraphs: [
      'Pizza dough planning usually starts with count and dough ball weight. This calculator multiplies those values to get a total dough target, then solves the flour, water, salt, and leavening weights from the percentages you enter. In yeast mode, yeast is a baker’s percentage of flour. In sourdough mode, starter is treated as one measured ingredient and split internally for hydration math.',
      'Use Add to bowl for the batch ingredients and Per dough ball for portioning. The per-ball section is not meant to tell you how much flour went into each ball before mixing; it is a practical share of the final formula. In the kitchen, mix the full dough, ferment it, then divide by target ball weight.',
      'The calculator does not prescribe a fermentation schedule, oven setting, or pizza style. It keeps the batch math consistent so you can adjust hydration, salt, oil, sugar, yeast, or starter without losing the target ball weight.'
    ],
    bullets: ['Total dough = pizza count × dough ball weight.', 'Use Add to bowl for the batch.', 'Use Per dough ball for portioning.']
  }, page);
}

export function getPresetModule(page: ToolPageData): PresetModule | undefined {
  if (!page.isLongTail) return undefined;
  const params: PresetModule['parameters'] = [];
  addParam(params, 'Mode', value(page.defaultInputs, 'mode'), 'Preset calculation mode');
  addParam(params, 'Flour', value(page.defaultInputs, 'flour', ' g'));
  addParam(params, 'Target dough', value(page.defaultInputs, 'target', ' g'));
  addParam(params, 'Per loaf', value(page.defaultInputs, 'perLoaf', ' g'));
  addParam(params, 'Loaves', value(page.defaultInputs, 'loaves'));
  addParam(params, 'Pizza count', value(page.defaultInputs, 'count'));
  addParam(params, 'Ball weight', value(page.defaultInputs, 'ball', ' g'));
  addParam(params, 'Hydration', value(page.defaultInputs, 'hyd', '%'));
  addParam(params, 'Starter', value(page.defaultInputs, 'starter', page.calculatorType === 'sourdough-hydration' ? ' g' : '%'));
  addParam(params, 'Starter hydration', value(page.defaultInputs, 'sh', '%'));
  addParam(params, 'Salt', value(page.defaultInputs, 'salt', '%'));
  addParam(params, 'Salt weight', value(page.defaultInputs, 'saltg', ' g'));
  addParam(params, 'Seed part', value(page.defaultInputs, 'seed'));
  addParam(params, 'Flour part', value(page.defaultInputs, 'flourpart'));
  addParam(params, 'Water part', value(page.defaultInputs, 'waterpart'));
  addParam(params, 'Extra to keep', value(page.defaultInputs, 'extra', ' g'));
  addParam(params, 'Leavening', value(page.defaultInputs, 'lev'));
  addParam(params, 'Yeast', value(page.defaultInputs, 'yeast', '%'));
  addParam(params, 'Bread flour', value(page.defaultInputs, 'breadPct', '%'));
  addParam(params, 'Whole wheat', value(page.defaultInputs, 'wholePct', '%'));
  addParam(params, 'Rye', value(page.defaultInputs, 'ryePct', '%'));

  return {
    eyebrow: 'Loaded preset',
    heading: `${page.h1} preset`,
    description: 'The calculator above is already loaded with these starting values. Change any field to turn the preset into your own formula.',
    parameters: params,
    exampleNote: page.examples[0]
      ? `Example shown on this page: ${page.examples[0].input} → ${page.examples[0].output}`
      : 'Example output updates from the calculator above.',
    ctaLabel: 'Edit this preset in the calculator'
  };
}

export function getLinkCardCopy(page: ToolPageData, target: ToolPageData): LinkCardCopy {
  if (target.calculatorType === page.calculatorType) {
    return {
      eyebrow: target.isLongTail ? 'Related preset' : 'Full calculator',
      description: `Use ${target.h1} when you want the same type of dough math with a different starting point.`,
      cta: target.isLongTail ? 'Open related preset' : 'Open full calculator'
    };
  }
  if (target.calculatorType === 'sourdough-hydration') {
    return { eyebrow: 'Hydration check', description: 'Split starter into flour and water so total hydration is not guessed.', cta: 'Check hydration' };
  }
  if (target.calculatorType === 'dough-scaling') {
    return { eyebrow: 'Scale batch', description: 'Move from percentages or starter math to a practical Add to bowl formula.', cta: 'Scale dough' };
  }
  if (target.calculatorType === 'starter-feeding') {
    return { eyebrow: 'Build starter', description: 'Calculate seed starter, flour, and water for a feeding or levain build.', cta: 'Calculate feeding' };
  }
  if (target.calculatorType === 'pizza-dough') {
    return { eyebrow: 'Pizza batch', description: 'Plan dough balls by count, weight, hydration, salt, and leavening.', cta: 'Calculate pizza dough' };
  }
  return { eyebrow: 'Baker’s math', description: 'Convert flour-based percentages into practical weights.', cta: 'Open calculator' };
}
