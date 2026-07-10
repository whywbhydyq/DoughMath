export type WeightUnit = 'g' | 'oz' | 'lb';
export function toGrams(value: number, unit: WeightUnit) { return unit === 'g' ? value : unit === 'oz' ? value * 28.349523125 : value * 453.59237; }
export function fromGrams(value: number, unit: WeightUnit) { return unit === 'g' ? value : unit === 'oz' ? value / 28.349523125 : value / 453.59237; }
export function formatWeight(value: number, unit: WeightUnit = 'g') { const converted = fromGrams(value, unit); if (unit === 'g') return `${Math.round(converted)} g`; if (unit === 'oz') return `${Math.round(converted * 100) / 100} oz`; return `${Math.round(converted * 1000) / 1000} lb`; }
