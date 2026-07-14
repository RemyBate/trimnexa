import { describe, expect, it } from 'vitest';

import {
	addressInputSchema,
	profileUpdateSchema,
	supportTicketSchema,
} from '@/lib/account/validation';

describe('account validation', () => {
	it('accepts valid profile updates', () => {
		const result = profileUpdateSchema.safeParse({
			firstName: 'Remy',
			lastName: 'Bate',
			phone: '+237 699 00 00 00',
			locale: 'en',
		});

		expect(result.success).toBe(true);
	});

	it('rejects empty first name', () => {
		const result = profileUpdateSchema.safeParse({
			firstName: '',
			locale: 'en',
		});

		expect(result.success).toBe(false);
	});

	it('accepts valid addresses', () => {
		const result = addressInputSchema.safeParse({
			label: 'Home',
			recipientName: 'Remy Bate',
			phone: '+237699000000',
			line1: '123 Main Street',
			city: 'Douala',
			region: 'Littoral',
			country: 'CM',
			isDefault: true,
		});

		expect(result.success).toBe(true);
	});

	it('rejects invalid support tickets', () => {
		const result = supportTicketSchema.safeParse({
			subject: 'Hi',
			message: 'Too short',
		});

		expect(result.success).toBe(false);
	});

	it('accepts valid support tickets', () => {
		const result = supportTicketSchema.safeParse({
			subject: 'Delivery question',
			message: 'I need help updating my delivery address before checkout launches.',
		});

		expect(result.success).toBe(true);
	});
});
