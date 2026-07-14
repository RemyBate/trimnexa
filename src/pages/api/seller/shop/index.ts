import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { updateSellerShopProfile } from '@/lib/seller/profile';
import { shopProfileUpdateSchema } from '@/lib/seller/validation';

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = shopProfileUpdateSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const profile = await updateSellerShopProfile(authResult.userId, parsed.data);

	if (!profile) {
		return jsonResponse({ error: 'forbidden' }, 403);
	}

	return jsonResponse({ profile });
};
