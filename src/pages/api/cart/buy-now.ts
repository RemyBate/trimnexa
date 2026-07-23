import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, resolveCartApiContext } from '@/lib/cart/api';
import { setBuyNowItem } from '@/lib/cart/service';
import { cartAddItemSchema } from '@/lib/cart/validation';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const resolved = await resolveCartApiContext(context);
	if (resolved instanceof Response) {
		return resolved;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = cartAddItemSchema.safeParse({
		...(typeof body === 'object' && body !== null ? body : {}),
		quantity: 1,
	});

	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await setBuyNowItem(resolved.cartId, parsed.data.productId, resolved.locale);
	if (!result.ok) {
		const status =
			result.code === 'product_not_found'
				? 404
				: result.code === 'product_unavailable' || result.code === 'out_of_stock'
					? 409
					: 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ cart: result.data, redirectTo: 'cart' });
};
