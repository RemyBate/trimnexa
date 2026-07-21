import { describe, expect, it, vi } from 'vitest';

import { emptyPaginatedResult, withCatalogueDb } from '@/lib/catalogue/runtime';

vi.mock('@/lib/db', () => ({
	isDatabaseConfigured: vi.fn(),
}));

import { isDatabaseConfigured } from '@/lib/db';

describe('emptyPaginatedResult', () => {
	it('returns an empty paginated payload', () => {
		expect(emptyPaginatedResult(2, 12)).toEqual({
			items: [],
			page: 2,
			pageSize: 12,
			totalItems: 0,
			totalPages: 0,
		});
	});
});

describe('withCatalogueDb', () => {
	it('returns fallback when database is not configured', async () => {
		vi.mocked(isDatabaseConfigured).mockReturnValue(false);

		const result = await withCatalogueDb('test', [], async () => ['unexpected']);

		expect(result).toEqual([]);
	});

	it('returns query result when database is configured', async () => {
		vi.mocked(isDatabaseConfigured).mockReturnValue(true);

		const result = await withCatalogueDb('test', [], async () => ['ok']);

		expect(result).toEqual(['ok']);
	});

	it('returns fallback when query throws', async () => {
		vi.mocked(isDatabaseConfigured).mockReturnValue(true);

		const result = await withCatalogueDb('test', null, async () => {
			throw new Error('connection refused');
		});

		expect(result).toBeNull();
	});
});
