export type WeightUnit = 'g' | 'oz' | 'lb';

const OZ_IN_GRAMS = 28.349523125;
const LB_IN_GRAMS = 453.59237;

export function toGrams(value: number, unit: WeightUnit): number {
  if (!Number.isFinite(value)) throw new Error('Weight must be a finite number.');
  if (unit === 'g') return value;
  if (unit === 'oz') return value * OZ_IN_GRAMS;
  return value * LB_IN_GRAMS;
}

export function fromGrams(grams: number, unit: WeightUnit): number {
  if (!Number.isFinite(grams)) throw new Error('Weight must be a finite number.');
  if (unit === 'g') return grams;
  if (unit === 'oz') return grams / OZ_IN_GRAMS;
  return grams / LB_IN_GRAMS;
}

export function formatWeight(grams: number, unit: WeightUnit = 'g'): string {
  const value = fromGrams(grams, unit);
  const decimals = unit === 'g' ? (value < 10 ? 1 : 0) : 2;
  return `${Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals} ${unit}`;
}
