import type { APIRoute } from 'astro';

import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';
import { completeSellerOnboarding } from '@/lib/seller/profile';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const profile = await completeSellerOnboarding(authResult.userId);

	if (!profile) {
		return jsonResponse({ error: 'onboarding_incomplete' }, 400);
	}

	return jsonResponse({ profile });
};
