export function buildRegistrationSuccessLoginPath(locale: string): string {
	return `/${locale}/auth/login?registered=1`;
}
