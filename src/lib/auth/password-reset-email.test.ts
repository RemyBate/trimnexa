import { describe, expect, it } from 'vitest';

import { buildLocalizedPasswordResetUrl } from '@/lib/auth/password-reset-email';

describe('buildLocalizedPasswordResetUrl', () => {
	it('includes locale and encoded token in reset link', () => {
		const url = buildLocalizedPasswordResetUrl('fr', 'abc+/=');
		expect(url).toContain('/fr/auth/reset-password?token=');
		expect(url).toContain(encodeURIComponent('abc+/='));
	});
});
