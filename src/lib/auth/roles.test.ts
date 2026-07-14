import { Role } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { DEFAULT_SIGNUP_ROLES, isDefaultSignupRole } from '@/lib/auth/roles';

describe('default signup roles', () => {
	it('assigns only CUSTOMER on self-service registration', () => {
		expect(DEFAULT_SIGNUP_ROLES).toEqual([Role.CUSTOMER]);
		expect(isDefaultSignupRole(Role.CUSTOMER)).toBe(true);
		expect(isDefaultSignupRole(Role.SELLER)).toBe(false);
		expect(isDefaultSignupRole(Role.ADMINISTRATOR)).toBe(false);
	});
});
