import type { APIRoute } from 'astro';

import { getSellerApplicationState, submitSellerApplication } from '@/lib/seller/application';
import { jsonResponse, readJsonBody, requireSellerApiUser } from '@/lib/seller/api-auth';
import { sellerApplicationSchema } from '@/lib/seller/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const state = await getSellerApplicationState(authResult.userId);
	return jsonResponse(state);
};

export const POST: APIRoute = async (context) => {
	const authResult = await requireSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = sellerApplicationSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	try {
		const result = await submitSellerApplication(authResult.userId, parsed.data);
		return jsonResponse(result, 201);
	} catch (error) {
		if (error instanceof Error) {
			return jsonResponse({ error: error.message }, 409);
		}

		return jsonResponse({ error: 'application_failed' }, 500);
	}
};
