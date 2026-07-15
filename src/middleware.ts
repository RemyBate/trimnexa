import { defineMiddleware } from 'astro:middleware';

import { auth } from '@/lib/auth';
import {
	isPasswordResetRequestPath,
	isPasswordResetSubmitPath,
	normalizeEmailForRateLimit,
	PASSWORD_RESET_REQUEST_EMAIL_LIMIT,
	PASSWORD_RESET_REQUEST_IP_LIMIT,
	PASSWORD_RESET_REQUEST_WINDOW_MS,
	PASSWORD_RESET_SUBMIT_IP_LIMIT,
	PASSWORD_RESET_SUBMIT_WINDOW_MS,
} from '@/lib/auth/password-reset-rate-limit';
import { isDatabaseConfigured } from '@/lib/db';
import { canAccessAdminArea, canAccessSellerArea, getMarketplaceUser } from '@/lib/authz';
import { isAuthApiPath, isProtectedAppPath, stripLocalePrefix } from '@/lib/authz/paths';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { localizedPath } from '@/i18n';

const AUTH_RATE_LIMIT = 20;
const AUTH_RATE_WINDOW_MS = 60_000;

function rateLimitResponse(retryAfterSeconds: number): Response {
	return new Response(JSON.stringify({ error: 'rate_limit_exceeded' }), {
		status: 429,
		headers: {
			'Content-Type': 'application/json',
			'Retry-After': String(retryAfterSeconds),
		},
	});
}

async function enforcePasswordResetRateLimits(
	pathname: string,
	request: Request,
): Promise<Response | null> {
	const clientIp = getClientIp(request);

	if (isPasswordResetRequestPath(pathname)) {
		const ipLimit = checkRateLimit(
			`pwd-reset:ip:${clientIp}`,
			PASSWORD_RESET_REQUEST_IP_LIMIT,
			PASSWORD_RESET_REQUEST_WINDOW_MS,
		);

		if (!ipLimit.allowed) {
			return rateLimitResponse(ipLimit.retryAfterSeconds);
		}

		try {
			const clone = request.clone();
			const body = (await clone.json()) as { email?: unknown };
			const email = typeof body.email === 'string' ? normalizeEmailForRateLimit(body.email) : '';

			if (email) {
				const emailLimit = checkRateLimit(
					`pwd-reset:email:${email}`,
					PASSWORD_RESET_REQUEST_EMAIL_LIMIT,
					PASSWORD_RESET_REQUEST_WINDOW_MS,
				);

				if (!emailLimit.allowed) {
					return rateLimitResponse(emailLimit.retryAfterSeconds);
				}
			}
		} catch {
			// Invalid JSON is handled by Better Auth; do not block here.
		}
	}

	if (isPasswordResetSubmitPath(pathname)) {
		const submitLimit = checkRateLimit(
			`pwd-reset-submit:ip:${clientIp}`,
			PASSWORD_RESET_SUBMIT_IP_LIMIT,
			PASSWORD_RESET_SUBMIT_WINDOW_MS,
		);

		if (!submitLimit.allowed) {
			return rateLimitResponse(submitLimit.retryAfterSeconds);
		}
	}

	return null;
}

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
			return rateLimitResponse(rateLimit.retryAfterSeconds);
		}

		const passwordResetLimit = await enforcePasswordResetRateLimits(
			context.url.pathname,
			context.request,
		);

		if (passwordResetLimit) {
			return passwordResetLimit;
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

		if (path === '/seller/application') {
			// Logged-in customers may submit or track a seller application.
		} else if (path === '/seller' || path.startsWith('/seller/')) {
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
