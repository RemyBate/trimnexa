import { describe, expect, it } from 'vitest';

import {
	buildCatalogueQueryString,
	catalogueQuerySchema,
	parseCatalogueSearchParams,
} from '@/lib/catalogue/validation';

describe('catalogueQuerySchema', () => {
	it('applies defaults for empty input', () => {
		const parsed = catalogueQuerySchema.parse({});

		expect(parsed.page).toBe(1);
		expect(parsed.pageSize).toBe(24);
		expect(parsed.sort).toBe('newest');
		expect(parsed.inStock).toBeFalsy();
	});

	it('coerces and validates query parameters', () => {
		const parsed = catalogueQuerySchema.parse({
			page: '2',
			sort: 'price_asc',
			q: 'bamboo',
			minPrice: '1000',
			maxPrice: '50000',
			inStock: '1',
		});

		expect(parsed.page).toBe(2);
		expect(parsed.sort).toBe('price_asc');
		expect(parsed.q).toBe('bamboo');
		expect(parsed.minPrice).toBe(1000);
		expect(parsed.maxPrice).toBe(50000);
		expect(parsed.inStock).toBe(true);
	});

	it('rejects invalid sort values', () => {
		const parsed = catalogueQuerySchema.safeParse({ sort: 'invalid' });
		expect(parsed.success).toBe(false);
	});
});

describe('parseCatalogueSearchParams', () => {
	it('reads URLSearchParams safely', () => {
		const params = new URLSearchParams('page=3&sort=title_asc&inStock=true');
		const parsed = parseCatalogueSearchParams(params);

		expect(parsed.page).toBe(3);
		expect(parsed.sort).toBe('title_asc');
		expect(parsed.inStock).toBe(true);
	});

	it('falls back to defaults for invalid query parameters', () => {
		const params = new URLSearchParams('sort=invalid&page=-1');
		const parsed = parseCatalogueSearchParams(params);

		expect(parsed.page).toBe(1);
		expect(parsed.sort).toBe('newest');
	});
});

describe('buildCatalogueQueryString', () => {
	it('omits empty and false values', () => {
		expect(
			buildCatalogueQueryString({
				page: 2,
				sort: 'newest',
				q: '',
				inStock: false,
			}),
		).toBe('?page=2&sort=newest');
	});

	it('serializes active filters', () => {
		expect(
			buildCatalogueQueryString({
				q: 'board',
				minPrice: 500,
				inStock: true,
			}),
		).toBe('?q=board&minPrice=500&inStock=true');
	});
});
