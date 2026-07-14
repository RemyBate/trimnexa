import type { APIRoute } from 'astro';

import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { getSellerProfileByUserId, updateSellerMediaPath } from '@/lib/seller/profile';
import { saveSellerMediaFile } from '@/lib/storage/seller-media';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const profile = await getSellerProfileByUserId(authResult.userId);

	if (!profile) {
		return jsonResponse({ error: 'forbidden' }, 403);
	}

	const formData = await context.request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) {
		return jsonResponse({ error: 'file_required' }, 400);
	}

	try {
		const saved = await saveSellerMediaFile(profile.id, 'logo', file);
		const updated = await updateSellerMediaPath(authResult.userId, 'logoPath', saved.relativePath);

		return jsonResponse({ profile: updated, url: saved.publicUrl });
	} catch (error) {
		if (error instanceof Error) {
			return jsonResponse({ error: error.message }, 400);
		}

		return jsonResponse({ error: 'upload_failed' }, 500);
	}
};
