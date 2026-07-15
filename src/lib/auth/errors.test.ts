import { describe, expect, it } from 'vitest';

import { mapAuthError } from '@/lib/auth/errors';

const labels = {
	generic: 'Generic error',
	suspended: 'Suspended',
	invalidCredentials: 'Invalid credentials',
	duplicateEmail: 'Duplicate email',
};

describe('mapAuthError', () => {
	it('maps suspended accounts', () => {
		expect(mapAuthError('login', { message: 'ACCOUNT_SUSPENDED' }, labels)).toBe('Suspended');
	});

	it('maps invalid login credentials', () => {
		expect(mapAuthError('login', { status: 401 }, labels)).toBe('Invalid credentials');
	});

	it('maps duplicate registration email', () => {
		expect(mapAuthError('register', { code: 'USER_ALREADY_EXISTS' }, labels)).toBe(
			'Duplicate email',
		);
	});

	it('maps service unavailable responses', () => {
		expect(
			mapAuthError(
				'register',
				{ status: 503 },
				{ ...labels, serviceUnavailable: 'Service unavailable' },
			),
		).toBe('Service unavailable');
	});

	it('falls back to generic message', () => {
		expect(mapAuthError('login', { message: 'internal failure' }, labels)).toBe('Generic error');
	});

	it('maps invalid reset tokens', () => {
		expect(
			mapAuthError(
				'reset_password',
				{ code: 'INVALID_TOKEN' },
				{ ...labels, invalidResetToken: 'Invalid token' },
			),
		).toBe('Invalid token');
	});

	it('maps forgot-password rate limiting', () => {
		expect(
			mapAuthError(
				'forgot_password',
				{ status: 429 },
				{ ...labels, rateLimited: 'Too many attempts' },
			),
		).toBe('Too many attempts');
	});
});
