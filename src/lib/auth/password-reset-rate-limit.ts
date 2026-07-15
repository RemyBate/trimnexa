import { env } from '@/config/env';

export const PASSWORD_RESET_REQUEST_IP_LIMIT = 10;
export const PASSWORD_RESET_REQUEST_EMAIL_LIMIT = 5;
export const PASSWORD_RESET_REQUEST_WINDOW_MS = 60 * 60 * 1000;

export const PASSWORD_RESET_SUBMIT_IP_LIMIT = 15;
export const PASSWORD_RESET_SUBMIT_WINDOW_MS = 15 * 60 * 1000;

export function isPasswordResetRequestPath(pathname: string): boolean {
	return pathname.endsWith('/request-password-reset');
}

export function isPasswordResetSubmitPath(pathname: string): boolean {
	return pathname.endsWith('/reset-password');
}

export function normalizeEmailForRateLimit(email: string): string {
	return email.trim().toLowerCase();
}

export function isProductionEnvironment(): boolean {
	return env.APP_ENV === 'production' || import.meta.env.PROD;
}
