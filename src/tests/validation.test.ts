import { describe, expect, it } from 'vitest';
import { isPositiveFinite, warning } from '@/lib/validation';

describe('validation helpers', () => {
  it('checks positive finite values', () => {
    expect(isPositiveFinite(1)).toBe(true);
    expect(isPositiveFinite(0)).toBe(false);
  });

  it('creates warning records', () => {
    const item = warning('check', 'Check value');
    expect(item.code).toBe('check');
    expect(item.severity).toBe('warning');
  });
});
