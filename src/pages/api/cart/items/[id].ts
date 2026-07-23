import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, resolveCartApiContext } from '@/lib/cart/api';
import { removeCartItem, updateCartItemQuantity } from '@/lib/cart/service';
import { cartUpdateQuantitySchema } from '@/lib/cart/validation';

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const resolved = await resolveCartApiContext(context);
	if (resolved instanceof Response) {
		return resolved;
	}

	const itemId = context.params.id;
	if (!itemId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = cartUpdateQuantitySchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await updateCartItemQuantity(
		resolved.cartId,
		itemId,
		parsed.data.quantity,
		resolved.locale,
	);

	if (!result.ok) {
		const status =
			result.code === 'cart_item_not_found'
				? 404
				: result.code === 'insufficient_stock'
					? 409
					: 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ cart: result.data });
};

export const DELETE: APIRoute = async (context) => {
	const resolved = await resolveCartApiContext(context);
	if (resolved instanceof Response) {
		return resolved;
	}

	const itemId = context.params.id;
	if (!itemId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const result = await removeCartItem(resolved.cartId, itemId, resolved.locale);
	if (!result.ok) {
		return jsonResponse({ error: result.code }, result.code === 'cart_item_not_found' ? 404 : 400);
	}

	return jsonResponse({ cart: result.data });
};
