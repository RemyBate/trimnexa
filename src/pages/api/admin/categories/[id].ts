import type { APIRoute } from 'astro';

import { updateCategoryActiveStatus } from '@/lib/admin/categories';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { categoryToggleSchema } from '@/lib/product/validation';
import { jsonResponse, readJsonBody } from '@/lib/seller/api-auth';

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const categoryId = context.params.id;
	if (!categoryId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = categoryToggleSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const category = await updateCategoryActiveStatus(
		categoryId,
		parsed.data.isActive,
		authResult.userId,
	);

	if (!category) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ category });
};
