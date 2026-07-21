import type { APIRoute } from 'astro';

import { createSellerProduct, listSellerProducts } from '@/lib/product/seller-products';
import { jsonResponse, readJsonBody, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { productInputSchema } from '@/lib/product/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const products = await listSellerProducts(authResult.userId);
	return jsonResponse({ products });
};

export const POST: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = productInputSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await createSellerProduct(authResult.userId, parsed.data);
	if (!result.ok) {
		const status =
			result.code === 'forbidden' ? 403 : result.code === 'prohibited_content' ? 422 : 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data }, 201);
};
