import { describe, expect, it } from 'vitest';

import {
	cartAddItemSchema,
	cartUpdateQuantitySchema,
	wishlistAddItemSchema,
} from '@/lib/cart/validation';

describe('cartAddItemSchema', () => {
	it('accepts valid add-to-cart payloads', () => {
		const parsed = cartAddItemSchema.safeParse({
			productId: 'prod_123',
			quantity: 2,
		});

		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.quantity).toBe(2);
		}
	});

	it('defaults quantity to 1', () => {
		const parsed = cartAddItemSchema.safeParse({ productId: 'prod_123' });
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.quantity).toBe(1);
		}
	});

	it('rejects invalid quantities', () => {
		expect(cartAddItemSchema.safeParse({ productId: 'prod_123', quantity: 0 }).success).toBe(false);
		expect(cartAddItemSchema.safeParse({ productId: 'prod_123', quantity: 100 }).success).toBe(
			false,
		);
	});
});

describe('cartUpdateQuantitySchema', () => {
	it('allows zero to signal removal', () => {
		const parsed = cartUpdateQuantitySchema.safeParse({ quantity: 0 });
		expect(parsed.success).toBe(true);
	});
});

describe('wishlistAddItemSchema', () => {
	it('requires productId', () => {
		expect(wishlistAddItemSchema.safeParse({}).success).toBe(false);
		expect(wishlistAddItemSchema.safeParse({ productId: 'prod_1' }).success).toBe(true);
	});
});
