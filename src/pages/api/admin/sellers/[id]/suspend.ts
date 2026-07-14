import type { APIRoute } from 'astro';

import { suspendSeller } from '@/lib/admin/sellers';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { jsonResponse, readJsonBody } from '@/lib/seller/api-auth';
import { sellerSuspensionSchema } from '@/lib/seller/validation';

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

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = sellerSuspensionSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const seller = await suspendSeller(authResult.userId, sellerId, parsed.data);

	if (!seller) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ seller });
};
