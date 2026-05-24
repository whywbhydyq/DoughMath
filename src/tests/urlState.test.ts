import { describe, expect, it } from 'vitest';
import { buildShareUrl, readNumberParam } from '@/lib/urlState';
describe('url state', () => { it('reads safe numbers', () => { expect(readNumberParam(new URLSearchParams('flour=500'), 'flour', 100)).toBe(500); expect(readNumberParam(new URLSearchParams('flour=-1'), 'flour', 100)).toBe(100); }); it('builds a share url', () => { const url = buildShareUrl('/x', { flour: 500, customName1: 'secret' }); expect(url).toContain('flour=500'); expect(url).not.toContain('customName1'); }); });
