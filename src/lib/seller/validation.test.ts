import { describe, expect, it } from 'vitest';

import {
	sellerApplicationSchema,
	sellerRejectionSchema,
	shopProfileUpdateSchema,
} from '@/lib/seller/validation';
import { slugifyShopName } from '@/lib/seller/slug';

describe('seller validation', () => {
	it('accepts valid seller applications', () => {
		const result = sellerApplicationSchema.safeParse({
			businessName: 'Douala Crafts',
			description: 'Handmade goods',
			contactPhone: '+237 699 00 00 00',
			contactEmail: 'shop@example.com',
			businessCity: 'Douala',
			businessRegion: 'Littoral',
		});

		expect(result.success).toBe(true);
	});

	it('rejects invalid shop profile phone', () => {
		const result = shopProfileUpdateSchema.safeParse({
			shopName: 'Douala Crafts',
			shopPhone: 'abc',
			addressLine1: '123 Street',
			city: 'Douala',
			region: 'Littoral',
			country: 'CM',
		});

		expect(result.success).toBe(false);
	});

	it('requires rejection reason with minimum length', () => {
		const result = sellerRejectionSchema.safeParse({ reviewNotes: 'no' });
		expect(result.success).toBe(false);
	});
});

describe('seller slug', () => {
	it('slugifies shop names', () => {
		expect(slugifyShopName('Douala Crafts & Co.')).toBe('douala-crafts-co');
	});
});
