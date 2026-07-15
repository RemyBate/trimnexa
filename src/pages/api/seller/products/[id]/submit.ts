import type { APIRoute } from 'astro';

import { submitSellerProductForReview } from '@/lib/product/seller-products';
import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	if (!productId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const result = await submitSellerProductForReview(authResult.userId, productId);
	if (!result.ok) {
		const status =
			result.code === 'not_found'
				? 404
				: result.code === 'forbidden'
					? 403
					: result.code === 'prohibited_content'
						? 422
						: 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data });
};
