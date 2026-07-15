import { describe, expect, it } from 'vitest';

import { findProhibitedTerms, assertProductContentAllowed } from '@/lib/product/prohibited';
import { slugifyProductTitle } from '@/lib/product/slug';
import { productInputSchema } from '@/lib/product/validation';

describe('product prohibited content', () => {
	it('detects prohibited keywords', () => {
		expect(findProhibitedTerms('Premium counterfeit wallet')).toContain('counterfeit');
	});

	it('allows normal product copy', () => {
		expect(() => assertProductContentAllowed('Bamboo cutting board', 'Kitchen essential')).not.toThrow();
	});

	it('blocks prohibited listings', () => {
		expect(() => assertProductContentAllowed('Illegal drug sample')).toThrow('prohibited_content');
	});
});

describe('product slugify', () => {
	it('normalizes titles into URL-safe slugs', () => {
		expect(slugifyProductTitle('Bamboo Cutting Board')).toBe('bamboo-cutting-board');
	});
});

describe('productInputSchema', () => {
	it('accepts valid product payloads', () => {
		const parsed = productInputSchema.safeParse({
			title: 'Kitchen towel set',
			description: 'Soft cotton towels',
			categoryId: 'cat_123',
			priceMajor: 3500,
			stockQty: 10,
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects invalid prices', () => {
		const parsed = productInputSchema.safeParse({
			title: 'Kitchen towel set',
			categoryId: 'cat_123',
			priceMajor: 0,
			stockQty: 10,
		});

		expect(parsed.success).toBe(false);
	});
});
