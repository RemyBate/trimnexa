import type { APIRoute } from 'astro';

import { listCategoriesForAdmin } from '@/lib/admin/categories';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse } from '@/lib/seller/api-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const categories = await listCategoriesForAdmin();
	return jsonResponse({ categories });
};
