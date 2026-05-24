import { describe, expect, it } from 'vitest';
import { buildShareUrl, readNumberParam } from '@/lib/urlState';

describe('url state helpers', () => {
  it('reads safe numeric params', () => {
    const params = new URLSearchParams('hyd=75&bad=abc&empty=');
    expect(readNumberParam(params, 'hyd', 70)).toBe(75);
    expect(readNumberParam(params, 'bad', 70)).toBe(70);
    expect(readNumberParam(params, 'empty', 70)).toBe(70);
  });

  it('builds share URLs only from allowed keys', () => {
    const url = buildShareUrl('/dough-scaling-calculator', { hyd: 75, starter: 20, note: 'private' });
    expect(url).toContain('hyd=75');
    expect(url).toContain('starter=20');
    expect(url).not.toContain('note=');
  });
});
