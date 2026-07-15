import type { APIRoute } from 'astro';

import { rejectProduct } from '@/lib/admin/products';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { productRejectionSchema } from '@/lib/product/validation';
import { jsonResponse, readJsonBody } from '@/lib/seller/api-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	if (!productId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = productRejectionSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await rejectProduct(productId, authResult.userId, parsed.data);
	if (!result.ok) {
		const status = result.code === 'not_found' ? 404 : 409;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data });
};
