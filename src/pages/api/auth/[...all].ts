import type { APIRoute } from 'astro';

import { auth } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/db';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
	if (!isDatabaseConfigured()) {
		return new Response('Authentication service unavailable', { status: 503 });
	}

	try {
		const response = await auth.handler(context.request);

		if (import.meta.env.DEV && response.status >= 500) {
			const body = await response.clone().text();
			console.error('[auth] Better Auth request failed', {
				path: context.url.pathname,
				status: response.status,
				body,
			});
		}

		return response;
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error('[auth] Better Auth handler threw', {
				path: context.url.pathname,
				error,
			});
		}

		return new Response('Authentication service unavailable', { status: 503 });
	}
};
