import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, requireAccountApiUser } from '@/lib/account/api-auth';
import { addWishlistItem, listWishlistItemDetails } from '@/lib/account/wishlist-mutations';
import { wishlistAddItemSchema } from '@/lib/cart/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const locale = context.request.headers.get('x-trimnexa-locale') ?? 'en';
	const items = await listWishlistItemDetails(authResult.userId, locale);
	return jsonResponse({ items });
};

export const POST: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = wishlistAddItemSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const locale = context.request.headers.get('x-trimnexa-locale') ?? 'en';
	const result = await addWishlistItem(authResult.userId, parsed.data.productId, locale);

	if (!result.ok) {
		return jsonResponse({ error: result.code }, result.code === 'product_not_found' ? 404 : 400);
	}

	return jsonResponse({ items: result.data }, 201);
};
