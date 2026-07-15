import type { APIRoute } from 'astro';

import { listProductsForReview } from '@/lib/admin/products';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse } from '@/lib/seller/api-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const products = await listProductsForReview();
	return jsonResponse({ products });
};
