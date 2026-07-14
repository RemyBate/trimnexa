import { defineMiddleware } from 'astro:middleware';

import { auth } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/db';
import { canAccessAdminArea, canAccessSellerArea, getMarketplaceUser } from '@/lib/authz';
import { isAuthApiPath, isProtectedAppPath, stripLocalePrefix } from '@/lib/authz/paths';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { localizedPath } from '@/i18n';

const AUTH_RATE_LIMIT = 20;
const AUTH_RATE_WINDOW_MS = 60_000;

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.user = null;
	context.locals.session = null;

	if (isAuthApiPath(context.url.pathname)) {
		const rateLimit = checkRateLimit(
			`auth:${getClientIp(context.request)}`,
			AUTH_RATE_LIMIT,
			AUTH_RATE_WINDOW_MS,
		);

		if (!rateLimit.allowed) {
			return new Response('Too many requests', {
				status: 429,
				headers: {
					'Retry-After': String(rateLimit.retryAfterSeconds),
				},
			});
		}

		if (!isDatabaseConfigured()) {
			return new Response('Authentication service unavailable', { status: 503 });
		}

		// Better Auth is mounted at src/pages/api/auth/[...all].ts
		return next();
	}

	if (!isDatabaseConfigured()) {
		return next();
	}

	const sessionResult = await auth.api.getSession({
		headers: context.request.headers,
	});

	if (sessionResult) {
		const marketplaceUser = await getMarketplaceUser(sessionResult.user.id);

		if (marketplaceUser?.status === 'SUSPENDED') {
			await auth.api.signOut({
				headers: context.request.headers,
			});
		} else {
			context.locals.user = sessionResult.user;
			context.locals.session = sessionResult.session;
		}
	}

	const { locale, path } = stripLocalePrefix(context.url.pathname);

	if (locale && isProtectedAppPath(path)) {
		if (!context.locals.user) {
			const returnTo = context.url.pathname;
			const params = new URLSearchParams({ returnTo });
			return context.redirect(`${localizedPath(locale, '/auth/login')}?${params.toString()}`);
		}

		const marketplaceUser = await getMarketplaceUser(context.locals.user.id);

		if (!marketplaceUser) {
			return context.redirect(localizedPath(locale, '/auth/login'));
		}

		if (path === '/seller' || path.startsWith('/seller/')) {
			if (!canAccessSellerArea(marketplaceUser.roles)) {
				return context.redirect(localizedPath(locale, '/'));
			}
		}

		if (path === '/admin' || path.startsWith('/admin/')) {
			if (!canAccessAdminArea(marketplaceUser.roles)) {
				return context.redirect(localizedPath(locale, '/'));
			}
		}
	}

	return next();
});
