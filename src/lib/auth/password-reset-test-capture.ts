const tokenByEmail = new Map<string, string>();

export function capturePasswordResetTokenForTests(email: string, token: string): void {
	const provider = import.meta.env.EMAIL_PROVIDER ?? process.env.EMAIL_PROVIDER;
	if (provider !== 'capture') {
		return;
	}

	tokenByEmail.set(email.trim().toLowerCase(), token);
}

export function getCapturedPasswordResetToken(email: string): string | undefined {
	return tokenByEmail.get(email.trim().toLowerCase());
}

export function clearCapturedPasswordResetTokens(): void {
	tokenByEmail.clear();
}
