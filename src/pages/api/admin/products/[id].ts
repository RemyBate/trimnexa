import type { APIRoute } from 'astro';

import { getProductDetailForAdmin } from '@/lib/admin/products';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse } from '@/lib/seller/api-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	if (!productId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const product = await getProductDetailForAdmin(productId);
	if (!product) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ product });
};
