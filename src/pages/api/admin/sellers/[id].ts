import type { APIRoute } from 'astro';

import { getSellerDetailForAdmin } from '@/lib/admin/sellers';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse } from '@/lib/seller/api-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const sellerId = context.params.id;

	if (!sellerId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const seller = await getSellerDetailForAdmin(sellerId);

	if (!seller) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ seller });
};
