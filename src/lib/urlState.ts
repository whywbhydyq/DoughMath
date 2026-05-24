export type QueryValue = string | number | undefined;
export type QueryBag = Record<string, QueryValue>;
export const queryKeys = ['bakerMode','flour','hyd','starter','salt','water','sh','saltg','bpWater','bpStarter','bpSalt','bpOil','bpSugar','customCount','customPct1','customWeight1','customPct2','customWeight2','customPct3','customWeight3','target','loaves','count','ball','oil','sugar','yeast','seed','flourpart','waterpart','extra','mode','lev','unit'] as const;
export function readNumberParam(params: URLSearchParams, key: string, fallback: number, min = 0) { const raw = params.get(key); if (raw === null || raw === '') return fallback; const next = Number(raw); return Number.isFinite(next) && next >= min ? next : fallback; }
export function buildShareUrl(pathname: string, values: QueryBag) { const params = new URLSearchParams(); queryKeys.forEach((key) => { const value = values[key]; if (value !== undefined && value !== '') params.set(key, String(value)); }); const query = params.toString(); return query ? `${pathname}?${query}` : pathname; }
export const parseNumberParam = readNumberParam;
export function readEnumParam<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[], fallback: T) { const raw = params.get(key) as T | null; return raw && allowed.includes(raw) ? raw : fallback; }
export function setUrlState(values: QueryBag) { if (typeof window === 'undefined') return; const next = buildShareUrl(window.location.pathname, values); window.history.replaceState(null, '', next); }
