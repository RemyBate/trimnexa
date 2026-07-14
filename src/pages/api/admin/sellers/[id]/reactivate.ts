import type { APIRoute } from 'astro';

import { reactivateSeller } from '@/lib/admin/sellers';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse } from '@/lib/seller/api-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireAdminApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const sellerId = context.params.id;

	if (!sellerId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const seller = await reactivateSeller(authResult.userId, sellerId);

	if (!seller) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ seller });
};
