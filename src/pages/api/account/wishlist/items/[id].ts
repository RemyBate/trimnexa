import type { APIRoute } from 'astro';

import { jsonResponse, requireAccountApiUser } from '@/lib/account/api-auth';
import { removeWishlistItem } from '@/lib/account/wishlist-mutations';

export const prerender = false;

export const DELETE: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const itemId = context.params.id;
	if (!itemId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const locale = context.request.headers.get('x-trimnexa-locale') ?? 'en';
	const result = await removeWishlistItem(authResult.userId, itemId, locale);

	if (!result.ok) {
		return jsonResponse({ error: result.code }, result.code === 'item_not_found' ? 404 : 400);
	}

	return jsonResponse({ items: result.data });
};
