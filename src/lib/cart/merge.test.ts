import { describe, expect, it } from 'vitest';

import { canAddNewCartLine, computeMergedQuantity } from '@/lib/cart/merge';

describe('computeMergedQuantity', () => {
	it('merges into an empty customer line', () => {
		expect(computeMergedQuantity(0, 2, 10)).toBe(2);
	});

	it('combines matching product quantities', () => {
		expect(computeMergedQuantity(3, 2, 10)).toBe(5);
	});

	it('caps quantity at available stock', () => {
		expect(computeMergedQuantity(4, 5, 6)).toBe(6);
	});

	it('returns zero when stock is exhausted', () => {
		expect(computeMergedQuantity(2, 1, 0)).toBe(0);
	});

	it('ignores negative inputs safely', () => {
		expect(computeMergedQuantity(-1, 2, 5)).toBe(2);
		expect(computeMergedQuantity(2, -1, 5)).toBe(2);
	});
});

describe('canAddNewCartLine', () => {
	it('allows lines under the limit', () => {
		expect(canAddNewCartLine(0)).toBe(true);
		expect(canAddNewCartLine(49)).toBe(true);
	});

	it('blocks lines at the limit', () => {
		expect(canAddNewCartLine(50)).toBe(false);
	});
});
