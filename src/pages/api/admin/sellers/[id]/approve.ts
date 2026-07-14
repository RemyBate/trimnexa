import type { APIRoute } from 'astro';

import { sellerActionErrorResponse } from '@/lib/admin/api-errors';
import { requireAdminApiUser } from '@/lib/admin/api-auth';
import { approveSeller } from '@/lib/admin/sellers';
import { jsonResponse, readJsonBody } from '@/lib/seller/api-auth';
import { sellerReviewSchema } from '@/lib/seller/validation';

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

	const parsed = sellerReviewSchema.safeParse(body ?? {});
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	try {
		const result = await approveSeller(authResult.userId, sellerId, parsed.data);

		if (!result.ok) {
			return sellerActionErrorResponse(result.code);
		}

		return jsonResponse({ seller: result.data, message: 'approved' });
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error('[admin] Failed to approve seller', { sellerId, error });
		}

		return jsonResponse({ error: 'approval_failed' }, 500);
	}
};
