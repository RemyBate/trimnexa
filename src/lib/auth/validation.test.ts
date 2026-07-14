import { describe, expect, it } from 'vitest';

import {
	PASSWORD_MIN_LENGTH,
	getConfirmPasswordError,
	hasValidationErrors,
	isValidEmail,
	validateLoginForm,
	validateRegisterForm,
} from '@/lib/auth/validation';

describe('auth validation', () => {
	it('validates email format', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
		expect(isValidEmail('not-an-email')).toBe(false);
		expect(isValidEmail('')).toBe(false);
	});

	it('requires login fields', () => {
		const errors = validateLoginForm({ email: '', password: '' });
		expect(errors.email).toBe('required');
		expect(errors.password).toBe('required');
		expect(hasValidationErrors(errors)).toBe(true);
	});

	it('rejects invalid login email', () => {
		const errors = validateLoginForm({ email: 'bad', password: 'secret123' });
		expect(errors.email).toBe('invalid_email');
	});

	it('validates registration fields', () => {
		const errors = validateRegisterForm({
			fullName: '',
			email: 'user@example.com',
			password: 'short',
			confirmPassword: 'different',
		});

		expect(errors.fullName).toBe('name_required');
		expect(errors.password).toBe('password_too_short');
		expect(errors.confirmPassword).toBe('password_mismatch');
	});

	it('accepts valid registration input with matching passwords', () => {
		const password = 'a'.repeat(PASSWORD_MIN_LENGTH);
		const errors = validateRegisterForm({
			fullName: 'Jane Doe',
			email: 'jane@example.com',
			password,
			confirmPassword: password,
		});

		expect(errors.confirmPassword).toBeUndefined();
		expect(hasValidationErrors(errors)).toBe(false);
	});

	it('rejects mismatched passwords when both fields are filled', () => {
		const password = 'a'.repeat(PASSWORD_MIN_LENGTH);
		const errors = validateRegisterForm({
			fullName: 'Jane Doe',
			email: 'jane@example.com',
			password,
			confirmPassword: `${password}!`,
		});

		expect(errors.confirmPassword).toBe('password_mismatch');
	});

	it('does not report mismatch when password is empty but confirm is filled', () => {
		const password = 'a'.repeat(PASSWORD_MIN_LENGTH);
		const errors = validateRegisterForm({
			fullName: 'Jane Doe',
			email: 'jane@example.com',
			password: '',
			confirmPassword: password,
		});

		expect(errors.password).toBe('required');
		expect(errors.confirmPassword).toBeUndefined();
	});
});

describe('getConfirmPasswordError', () => {
	it('passes when passwords match exactly', () => {
		const password = 'ExactMatch1';
		expect(getConfirmPasswordError(password, password)).toBeUndefined();
	});

	it('fails when passwords differ', () => {
		expect(getConfirmPasswordError('ExactMatch1', 'ExactMatch2')).toBe('password_mismatch');
	});

	it('requires confirm password when empty', () => {
		expect(getConfirmPasswordError('ExactMatch1', '')).toBe('required');
	});

	it('does not report mismatch when password is still empty', () => {
		expect(getConfirmPasswordError('', 'ExactMatch1')).toBeUndefined();
	});
});
