import type { APIRoute } from 'astro';

import { getSellerProfileByUserId } from '@/lib/seller/profile';
import { addProductImage } from '@/lib/product/seller-products';
import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { saveProductMediaFile } from '@/lib/storage/product-media';

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

	const profile = await getSellerProfileByUserId(authResult.userId);
	if (!profile) {
		return jsonResponse({ error: 'forbidden' }, 403);
	}

	let formData: FormData;
	try {
		formData = await context.request.formData();
	} catch {
		return jsonResponse({ error: 'invalid_form' }, 400);
	}

	const file = formData.get('file');
	if (!(file instanceof File)) {
		return jsonResponse({ error: 'file_required' }, 400);
	}

	const altText = formData.get('altText');
	const altTextValue = typeof altText === 'string' ? altText : undefined;

	try {
		const saved = await saveProductMediaFile(profile.id, productId, file);
		const result = await addProductImage(
			authResult.userId,
			productId,
			saved.relativePath,
			altTextValue,
		);

		if (!result.ok) {
			const status =
				result.code === 'not_found'
					? 404
					: result.code === 'image_limit_reached'
						? 413
						: 400;
			return jsonResponse({ error: result.code }, status);
		}

		return jsonResponse({ product: result.data }, 201);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'unsupported_media_type') {
				return jsonResponse({ error: 'unsupported_media_type' }, 415);
			}
			if (error.message === 'file_too_large') {
				return jsonResponse({ error: 'file_too_large' }, 413);
			}
		}

		return jsonResponse({ error: 'upload_failed' }, 500);
	}
};
