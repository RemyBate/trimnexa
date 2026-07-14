export type AuthAction = 'login' | 'register' | 'forgot_password' | 'reset_password';

interface AuthErrorInput {
	code?: string | null;
	message?: string | null;
	status?: number | null;
}

/**
 * Maps Better Auth responses to safe, user-facing messages.
 * Never exposes stack traces or internal provider details.
 */
export function mapAuthError(
	action: AuthAction,
	error: AuthErrorInput | null | undefined,
	labels: {
		generic: string;
		suspended: string;
		invalidCredentials: string;
		duplicateEmail: string;
		serviceUnavailable?: string;
	},
): string {
	if (!error) {
		return labels.generic;
	}

	if (error.status === 503 || error.status === 500) {
		return labels.serviceUnavailable ?? labels.generic;
	}

	const code = (error.code ?? '').toUpperCase();
	const message = (error.message ?? '').toUpperCase();

	if (message.includes('SUSPENDED') || code.includes('SUSPENDED')) {
		return labels.suspended;
	}

	if (action === 'login') {
		if (error.status === 401 || code.includes('INVALID') || message.includes('INVALID')) {
			return labels.invalidCredentials;
		}
	}

	if (action === 'register') {
		if (
			code.includes('USER_ALREADY_EXISTS') ||
			code.includes('EMAIL_ALREADY') ||
			code.includes('ALREADY_EXISTS') ||
			message.includes('ALREADY EXISTS') ||
			message.includes('ALREADY IN USE')
		) {
			return labels.duplicateEmail;
		}
	}

	return labels.generic;
}

export function logAuthClientFailure(action: AuthAction, error: unknown): void {
	if (!import.meta.env.DEV) {
		return;
	}

	console.error(`[auth] ${action} request failed`, error);
}
