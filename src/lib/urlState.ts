export function parseNumberParam(params: URLSearchParams, key: string, fallback: number, min = 0): number {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value >= min ? value : fallback;
}

export function setUrlState(values: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  window.history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`);
}

export function readEnumParam<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[], fallback: T): T {
  const value = params.get(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}
