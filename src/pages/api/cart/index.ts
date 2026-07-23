import type { APIRoute } from 'astro';

import { jsonResponse, resolveCartApiContext } from '@/lib/cart/api';
import { getCartById } from '@/lib/cart/service';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const resolved = await resolveCartApiContext(context);
	if (resolved instanceof Response) {
		return resolved;
	}

	const cart = await getCartById(resolved.cartId, resolved.locale);
	return jsonResponse({ cart });
};
