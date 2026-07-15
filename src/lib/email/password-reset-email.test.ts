import { describe, expect, it } from 'vitest';

import { buildPasswordResetEmail } from '@/lib/email/templates/password-reset';

describe('password reset email template', () => {
	it('builds English copy with reset URL', () => {
		const message = buildPasswordResetEmail({
			locale: 'en',
			resetUrl: 'http://localhost:4321/en/auth/reset-password?token=abc',
			expiresMinutes: 45,
		});

		expect(message.subject).toContain('Trimnexa');
		expect(message.text).toContain('http://localhost:4321/en/auth/reset-password?token=abc');
		expect(message.html).toContain('/en/auth/reset-password?token=abc');
	});

	it('builds French copy', () => {
		const message = buildPasswordResetEmail({
			locale: 'fr',
			resetUrl: 'http://localhost:4321/fr/auth/reset-password?token=abc',
			expiresMinutes: 45,
		});

		expect(message.subject).toContain('Réinitialisez');
		expect(message.text).toContain('/fr/auth/reset-password?token=abc');
	});
});
