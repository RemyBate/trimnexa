import { describe, expect, it } from 'vitest';

import {
	isPasswordResetRequestPath,
	isPasswordResetSubmitPath,
	normalizeEmailForRateLimit,
} from '@/lib/auth/password-reset-rate-limit';
import { checkRateLimit } from '@/lib/rate-limit';

describe('password reset rate limit helpers', () => {
	it('detects Better Auth reset paths', () => {
		expect(isPasswordResetRequestPath('/api/auth/request-password-reset')).toBe(true);
		expect(isPasswordResetSubmitPath('/api/auth/reset-password')).toBe(true);
	});

	it('normalizes email addresses', () => {
		expect(normalizeEmailForRateLimit('  User@Example.COM ')).toBe('user@example.com');
	});

	it('blocks repeated reset requests for the same email', () => {
		const email = 'buyer@example.com';
		const key = `pwd-reset:email:${email}`;

		for (let attempt = 0; attempt < 5; attempt += 1) {
			expect(checkRateLimit(key, 5, 60_000).allowed).toBe(true);
		}

		expect(checkRateLimit(key, 5, 60_000).allowed).toBe(false);
	});
});
