import { describe, expect, it } from 'vitest';

import { buildRegistrationSuccessLoginPath } from '@/lib/auth/register-flow';
import en from '@/i18n/locales/en.json';
import fr from '@/i18n/locales/fr.json';

const requiredAuthKeys = [
	'auth.loginTitle',
	'auth.registerTitle',
	'auth.email',
	'auth.password',
	'auth.fullName',
	'auth.confirmPassword',
	'auth.loginSubmit',
	'auth.registerSubmit',
	'auth.registerSuccess',
	'auth.errorInvalidCredentials',
	'auth.errorDuplicateEmail',
] as const;

function readKey(dictionary: Record<string, unknown>, key: string): string {
	const segments = key.split('.');
	let current: unknown = dictionary;

	for (const segment of segments) {
		if (typeof current !== 'object' || current === null || !(segment in current)) {
			return '';
		}

		current = (current as Record<string, unknown>)[segment];
	}

	return typeof current === 'string' ? current : '';
}

describe('auth form copy', () => {
	it('includes required English and French auth labels', () => {
		for (const key of requiredAuthKeys) {
			expect(readKey(en, key).length).toBeGreaterThan(0);
			expect(readKey(fr, key).length).toBeGreaterThan(0);
		}
	});

	it('uses the approved registration success messages', () => {
		expect(en.auth.registerSuccess).toBe(
			'Your account has been created successfully. Please sign in.',
		);
		expect(fr.auth.registerSuccess).toBe(
			'Votre compte a été créé avec succès. Veuillez vous connecter.',
		);
	});
});

describe('registration success redirect', () => {
	it('builds a safe login redirect without private data', () => {
		expect(buildRegistrationSuccessLoginPath('en')).toBe('/en/auth/login?registered=1');
		expect(buildRegistrationSuccessLoginPath('fr')).toBe('/fr/auth/login?registered=1');
	});
});
