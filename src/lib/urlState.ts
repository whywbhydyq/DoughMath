import type { CalculatorType } from '@/types/baking';

export type QueryValue = string | number | undefined;
export type QueryBag = Record<string, QueryValue>;

export const queryKeys = [
  'bakerMode',
  'flour',
  'hyd',
  'starter',
  'salt',
  'water',
  'sh',
  'saltg',
  'bpWater',
  'bpStarter',
  'bpSalt',
  'bpOil',
  'bpSugar',
  'target',
  'perLoaf',
  'loaves',
  'count',
  'ball',
  'oil',
  'sugar',
  'yeast',
  'seed',
  'flourpart',
  'waterpart',
  'extra',
  'mode',
  'lev',
  'unit',
  'breadPct',
  'wholePct',
  'ryePct',
  'custom'
] as const;

type QueryKey = (typeof queryKeys)[number];

const calculatorQueryKeys: Record<CalculatorType, readonly QueryKey[]> = {
  'bakers-percentage': [
    'unit',
    'bakerMode',
    'flour',
    'hyd',
    'starter',
    'salt',
    'bpWater',
    'bpStarter',
    'bpSalt',
    'bpOil',
    'bpSugar',
    'oil',
    'sugar',
    'breadPct',
    'wholePct',
    'ryePct',
    'custom'
  ],
  'sourdough-hydration': ['unit', 'flour', 'water', 'starter', 'sh', 'saltg', 'breadPct', 'wholePct', 'ryePct'],
  'starter-feeding': ['unit', 'target', 'seed', 'flourpart', 'waterpart', 'extra'],
  'dough-scaling': [
    'unit',
    'mode',
    'target',
    'perLoaf',
    'loaves',
    'flour',
    'hyd',
    'starter',
    'sh',
    'salt',
    'oil',
    'sugar',
    'breadPct',
    'wholePct',
    'ryePct'
  ],
  'pizza-dough': [
    'unit',
    'lev',
    'count',
    'ball',
    'hyd',
    'salt',
    'yeast',
    'starter',
    'sh',
    'oil',
    'sugar',
    'breadPct',
    'wholePct',
    'ryePct'
  ]
};

const MAX_CUSTOM_QUERY_LENGTH = 1600;

export function readNumberParam(params: URLSearchParams, key: string, fallback: number, min = 0) {
  const raw = params.get(key);
  if (raw === null || raw === '') return fallback;
  const next = Number(raw);
  return Number.isFinite(next) && next >= min ? next : fallback;
}

function isDefaultValue(value: QueryValue, defaultValue: QueryValue) {
  if (value === undefined || value === '') return true;
  if (defaultValue === undefined) return false;
  if (typeof value === 'number' || typeof defaultValue === 'number') {
    const currentNumber = Number(value);
    const defaultNumber = Number(defaultValue);
    return Number.isFinite(currentNumber) && Number.isFinite(defaultNumber) && Math.abs(currentNumber - defaultNumber) < 0.000001;
  }
  return String(value) === String(defaultValue);
}

function setQueryParam(params: URLSearchParams, key: string, value: QueryValue) {
  if (value === undefined || value === '') return;
  if (key === 'custom' && String(value).length > MAX_CUSTOM_QUERY_LENGTH) return;
  params.set(key, String(value));
}

export function buildShareUrl(pathname: string, values: QueryBag) {
  const params = new URLSearchParams();
  queryKeys.forEach((key) => setQueryParam(params, key, values[key]));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function buildCalculatorShareUrl(
  calculatorType: CalculatorType,
  pathname: string,
  values: QueryBag,
  defaults: QueryBag = {},
  custom?: string
) {
  const params = new URLSearchParams();
  calculatorQueryKeys[calculatorType].forEach((key) => {
    const value = key === 'custom' ? custom : values[key];
    if (!isDefaultValue(value, defaults[key])) setQueryParam(params, key, value);
  });
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export const parseNumberParam = readNumberParam;

export function readEnumParam<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[], fallback: T) {
  const raw = params.get(key) as T | null;
  return raw && allowed.includes(raw) ? raw : fallback;
}

export function setUrlState(values: QueryBag) {
  if (typeof window === 'undefined') return;
  const next = buildShareUrl(window.location.pathname, values);
  window.history.replaceState(null, '', next);
}

export function setCalculatorUrlState(calculatorType: CalculatorType, values: QueryBag, defaults: QueryBag = {}, custom?: string) {
  if (typeof window === 'undefined') return;
  const next = buildCalculatorShareUrl(calculatorType, window.location.pathname, values, defaults, custom);
  window.history.replaceState(null, '', next);
}
