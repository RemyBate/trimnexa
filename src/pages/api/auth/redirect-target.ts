import type { APIRoute } from 'astro';

import { isValidLocale } from '@/i18n';
import { auth } from '@/lib/auth';
import { getPostLoginRedirectPath } from '@/lib/auth/redirect';
import { getMarketplaceUser } from '@/lib/authz';
import { isDatabaseConfigured } from '@/lib/db';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	if (!isDatabaseConfigured()) {
		return new Response(JSON.stringify({ error: 'service_unavailable' }), {
			status: 503,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const session = await auth.api.getSession({
		headers: context.request.headers,
	});

	if (!session?.user) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const marketplaceUser = await getMarketplaceUser(session.user.id);

	if (!marketplaceUser) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const localeParam = context.url.searchParams.get('locale') ?? 'en';
	const locale = isValidLocale(localeParam) ? localeParam : 'en';
	const returnTo = context.url.searchParams.get('returnTo');
	const path = getPostLoginRedirectPath(locale, marketplaceUser.roles, returnTo);

	return new Response(JSON.stringify({ path }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
