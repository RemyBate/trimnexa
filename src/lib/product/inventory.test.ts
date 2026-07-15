import { describe, expect, it } from 'vitest';

import { resolveStockStatus } from '@/lib/product/inventory';

describe('resolveStockStatus', () => {
	it('returns ACTIVE when stock is available', () => {
		expect(resolveStockStatus(3)).toBe('ACTIVE');
	});

	it('returns OUT_OF_STOCK when quantity is zero', () => {
		expect(resolveStockStatus(0)).toBe('OUT_OF_STOCK');
	});
});
