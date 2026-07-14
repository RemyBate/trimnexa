import { Role } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { getPostLoginRedirectPath } from '@/lib/auth/redirect';

describe('getPostLoginRedirectPath', () => {
	it('redirects customers to account', () => {
		expect(getPostLoginRedirectPath('en', [Role.CUSTOMER])).toBe('/en/account');
	});

	it('redirects sellers to seller dashboard', () => {
		expect(getPostLoginRedirectPath('fr', [Role.CUSTOMER, Role.SELLER])).toBe('/fr/seller');
	});

	it('redirects administrators to admin dashboard', () => {
		expect(getPostLoginRedirectPath('en', [Role.ADMINISTRATOR])).toBe('/en/admin');
	});

	it('honors safe returnTo paths', () => {
		expect(getPostLoginRedirectPath('en', [Role.CUSTOMER], '/en/help')).toBe('/en/help');
	});

	it('ignores unsafe auth returnTo paths', () => {
		expect(getPostLoginRedirectPath('en', [Role.CUSTOMER], '/en/auth/login')).toBe('/en/account');
	});
});
