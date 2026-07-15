import type { APIRoute } from 'astro';

import { removeProductImage } from '@/lib/product/seller-products';
import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';

export const prerender = false;

export const DELETE: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	const imageId = context.params.imageId;
	if (!productId || !imageId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const result = await removeProductImage(authResult.userId, productId, imageId);
	if (!result.ok) {
		const status = result.code === 'not_found' ? 404 : 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data });
};
