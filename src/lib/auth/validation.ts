export const PASSWORD_MIN_LENGTH = 8;

export type AuthFieldErrorCode =
	'required' | 'invalid_email' | 'password_too_short' | 'password_mismatch' | 'name_required';

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface RegisterFormValues {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export function isValidEmail(value: string): boolean {
	const normalized = value.trim();

	if (!normalized) {
		return false;
	}

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function validateLoginForm(
	values: LoginFormValues,
): Partial<Record<keyof LoginFormValues, AuthFieldErrorCode>> {
	const errors: Partial<Record<keyof LoginFormValues, AuthFieldErrorCode>> = {};

	if (!values.email.trim()) {
		errors.email = 'required';
	} else if (!isValidEmail(values.email)) {
		errors.email = 'invalid_email';
	}

	if (!values.password) {
		errors.password = 'required';
	}

	return errors;
}

export function validateRegisterForm(
	values: RegisterFormValues,
): Partial<Record<keyof RegisterFormValues, AuthFieldErrorCode>> {
	const errors: Partial<Record<keyof RegisterFormValues, AuthFieldErrorCode>> = {};

	if (!values.fullName.trim()) {
		errors.fullName = 'name_required';
	}

	if (!values.email.trim()) {
		errors.email = 'required';
	} else if (!isValidEmail(values.email)) {
		errors.email = 'invalid_email';
	}

	const passwordErrors = validatePasswordFields(values.password, values.confirmPassword);
	Object.assign(errors, passwordErrors);

	return errors;
}

export function validatePasswordFields(
	password: string,
	confirmPassword: string,
): Partial<Record<'password' | 'confirmPassword', AuthFieldErrorCode>> {
	const errors: Partial<Record<'password' | 'confirmPassword', AuthFieldErrorCode>> = {};

	if (!password) {
		errors.password = 'required';
	} else if (password.length < PASSWORD_MIN_LENGTH) {
		errors.password = 'password_too_short';
	}

	const confirmPasswordError = getConfirmPasswordError(password, confirmPassword);
	if (confirmPasswordError) {
		errors.confirmPassword = confirmPasswordError;
	}

	return errors;
}

/**
 * Validates confirm password against the primary password.
 * Mismatch is reported only when both fields contain a value.
 */
export function getConfirmPasswordError(
	password: string,
	confirmPassword: string,
): 'required' | 'password_mismatch' | undefined {
	if (!confirmPassword) {
		return 'required';
	}

	if (password && password !== confirmPassword) {
		return 'password_mismatch';
	}

	return undefined;
}

export function readRegisterFormValues(form: HTMLFormElement): RegisterFormValues {
	const fullNameEl = form.elements.namedItem('fullName');
	const emailEl = form.elements.namedItem('email');
	const passwordEl = form.elements.namedItem('password');
	const confirmPasswordEl = form.elements.namedItem('confirmPassword');

	return {
		fullName: fullNameEl instanceof HTMLInputElement ? fullNameEl.value : '',
		email: emailEl instanceof HTMLInputElement ? emailEl.value : '',
		password: passwordEl instanceof HTMLInputElement ? passwordEl.value : '',
		confirmPassword: confirmPasswordEl instanceof HTMLInputElement ? confirmPasswordEl.value : '',
	};
}

export function hasValidationErrors<T extends object>(
	errors: Partial<Record<keyof T, AuthFieldErrorCode>>,
): boolean {
	return Object.keys(errors).length > 0;
}
