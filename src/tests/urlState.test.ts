import { describe, expect, it } from 'vitest';
import { parseNumberParam, readEnumParam } from '@/lib/urlState';

describe('url helpers', () => {
  it('uses fallback for invalid numbers', () => {
    const params = new URLSearchParams('flour=500&bad=abc');
    expect(parseNumberParam(params, 'flour', 100)).toBe(500);
    expect(parseNumberParam(params, 'bad', 100)).toBe(100);
  });

  it('uses fallback for invalid enum values', () => {
    const params = new URLSearchParams('mode=target&lev=invalid');
    expect(readEnumParam(params, 'mode', ['target', 'flour'] as const, 'flour')).toBe('target');
    expect(readEnumParam(params, 'lev', ['yeast', 'sourdough'] as const, 'yeast')).toBe('yeast');
  });
});
