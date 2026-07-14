import { describe, expect, it } from 'vitest';

import { formatWelcomeMessage, getUserFirstName } from '@/lib/auth/display-name';

describe('getUserFirstName', () => {
	it('prefers firstName when available', () => {
		expect(
			getUserFirstName({
				firstName: 'Remy',
				name: 'Mbu Remy Bate',
				email: 'remy@example.com',
			}),
		).toBe('Remy');
	});

	it('falls back to the first token of name', () => {
		expect(
			getUserFirstName({
				firstName: null,
				name: 'Jane Doe',
				email: 'jane@example.com',
			}),
		).toBe('Jane');
	});

	it('falls back to the email local part', () => {
		expect(
			getUserFirstName({
				firstName: null,
				name: null,
				email: 'remymbu12@gmail.com',
			}),
		).toBe('remymbu12');
	});
});

describe('formatWelcomeMessage', () => {
	it('replaces the name placeholder', () => {
		expect(formatWelcomeMessage('Welcome back, {name}!', 'Remy')).toBe('Welcome back, Remy!');
	});
});
