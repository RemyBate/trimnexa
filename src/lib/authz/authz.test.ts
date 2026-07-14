import { describe, expect, it } from 'vitest';
import { Role } from '@prisma/client';

import {
	canAccessAdminArea,
	canAccessSellerArea,
	hasAllRoles,
	hasAnyRole,
	hasRole,
} from '@/lib/authz/roles';

describe('authz role helpers', () => {
	const customerOnly = [Role.CUSTOMER];
	const sellerRoles = [Role.CUSTOMER, Role.SELLER];
	const adminRoles = [Role.ADMINISTRATOR];
	const staffRoles = [Role.STAFF];

	it('detects individual roles', () => {
		expect(hasRole(customerOnly, Role.CUSTOMER)).toBe(true);
		expect(hasRole(customerOnly, Role.SELLER)).toBe(false);
	});

	it('detects any required role', () => {
		expect(hasAnyRole(sellerRoles, [Role.SELLER, Role.ADMINISTRATOR])).toBe(true);
		expect(hasAnyRole(customerOnly, [Role.SELLER, Role.ADMINISTRATOR])).toBe(false);
	});

	it('detects all required roles', () => {
		expect(hasAllRoles(sellerRoles, [Role.CUSTOMER, Role.SELLER])).toBe(true);
		expect(hasAllRoles(sellerRoles, [Role.CUSTOMER, Role.ADMINISTRATOR])).toBe(false);
	});

	it('isolates seller area access', () => {
		expect(canAccessSellerArea(customerOnly)).toBe(false);
		expect(canAccessSellerArea(sellerRoles)).toBe(true);
		expect(canAccessSellerArea(adminRoles)).toBe(true);
		expect(canAccessSellerArea(staffRoles)).toBe(true);
	});

	it('isolates admin area access', () => {
		expect(canAccessAdminArea(customerOnly)).toBe(false);
		expect(canAccessAdminArea(sellerRoles)).toBe(false);
		expect(canAccessAdminArea(adminRoles)).toBe(true);
		expect(canAccessAdminArea(staffRoles)).toBe(true);
	});
});

describe('authz path helpers', () => {
	it('strips locale prefixes', async () => {
		const { stripLocalePrefix, isProtectedAppPath } = await import('@/lib/authz/paths');

		expect(stripLocalePrefix('/en/account')).toEqual({ locale: 'en', path: '/account' });
		expect(stripLocalePrefix('/fr/seller/orders')).toEqual({
			locale: 'fr',
			path: '/seller/orders',
		});
		expect(isProtectedAppPath('/account')).toBe(true);
		expect(isProtectedAppPath('/auth/login')).toBe(false);
	});
});
