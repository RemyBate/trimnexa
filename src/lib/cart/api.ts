import type { APIContext } from 'astro';

import { auth } from '@/lib/auth';
import {
	clearGuestCartCookie,
	createGuestCartToken,
	readGuestCartToken,
	setGuestCartCookie,
} from '@/lib/cart/guest-cookie';
import { ensureGuestCart, ensureUserCart, mergeGuestCartIntoUser } from '@/lib/cart/service';
import { isDatabaseConfigured } from '@/lib/db';

export function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function readJsonBody<T>(request: Request): Promise<T | Response> {
	try {
		return (await request.json()) as T;
	} catch {
		return jsonResponse({ error: 'invalid_json' }, 400);
	}
}

export interface CartApiContext {
	userId: string | null;
	cartId: string;
	locale: string;
}

export async function resolveCartApiContext(
	context: APIContext,
	localeHint?: string,
): Promise<CartApiContext | Response> {
	if (!isDatabaseConfigured()) {
		return jsonResponse({ error: 'service_unavailable' }, 503);
	}

	const locale =
		localeHint ??
		context.request.headers.get('x-trimnexa-locale') ??
		context.cookies.get('trimnexa_locale')?.value ??
		'en';

	const session = await auth.api.getSession({
		headers: context.request.headers,
	});

	try {
		if (session?.user) {
			const guestToken = readGuestCartToken(context.cookies);
			if (guestToken) {
				await mergeGuestCartIntoUser(session.user.id, guestToken);
				clearGuestCartCookie(context.cookies);
			}

			const cartId = await ensureUserCart(session.user.id);
			return { userId: session.user.id, cartId, locale };
		}

		let guestToken = readGuestCartToken(context.cookies);
		if (!guestToken) {
			guestToken = createGuestCartToken();
			setGuestCartCookie(context.cookies, guestToken);
		}

		const cartId = await ensureGuestCart(guestToken);
		return { userId: null, cartId, locale };
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error('[cart] resolveCartApiContext failed', error);
		}
		return jsonResponse({ error: 'service_unavailable' }, 503);
	}
}
