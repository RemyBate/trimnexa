import type { APIRoute } from 'astro';

import {
	archiveSellerProduct,
	getSellerProduct,
	updateSellerProduct,
} from '@/lib/product/seller-products';
import { jsonResponse, readJsonBody, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { productInputSchema } from '@/lib/product/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	if (!productId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const product = await getSellerProduct(authResult.userId, productId);
	if (!product) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ product });
};

export const PATCH: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
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

	const parsed = productInputSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const result = await updateSellerProduct(authResult.userId, productId, parsed.data);
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

export const DELETE: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const productId = context.params.id;
	if (!productId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const result = await archiveSellerProduct(authResult.userId, productId);
	if (!result.ok) {
		const status = result.code === 'not_found' ? 404 : 400;
		return jsonResponse({ error: result.code }, status);
	}

	return jsonResponse({ product: result.data });
};
