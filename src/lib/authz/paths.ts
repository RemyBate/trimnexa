import { isValidLocale } from '@/i18n';
import type { SupportedLocale } from '@/config/site';

export interface LocalePath {
	locale?: SupportedLocale;
	path: string;
}

export function stripLocalePrefix(pathname: string): LocalePath {
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) {
		return { path: '/' };
	}

	const first = segments[0];

	if (isValidLocale(first)) {
		const rest = segments.slice(1);
		return {
			locale: first,
			path: rest.length === 0 ? '/' : `/${rest.join('/')}`,
		};
	}

	return { path: pathname };
}

export function isAuthApiPath(pathname: string): boolean {
	return pathname.startsWith('/api/auth');
}

export function isProtectedAppPath(path: string): boolean {
	return (
		path === '/account' ||
		path.startsWith('/account/') ||
		path === '/seller' ||
		path.startsWith('/seller/') ||
		path === '/admin' ||
		path.startsWith('/admin/')
	);
}
