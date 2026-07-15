import type { APIRoute } from 'astro';

import { suspendProduct } from '@/lib/admin/products';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse, readJsonBody } from '@/lib/seller/api-auth';
import { z } from 'zod';

export const prerender = false;

const suspendSchema = z.object({
	reason: z.string().trim().min(3).max(500),
});

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

	const parsed = suspendSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await suspendProduct(productId, authResult.userId, parsed.data.reason);
	if (!result.ok) {
		const status = result.code === 'not_found' ? 404 : 409;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data });
};
