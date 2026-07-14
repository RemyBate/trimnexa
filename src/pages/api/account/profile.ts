import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, requireAccountApiUser } from '@/lib/account/api-auth';
import { updateCustomerProfile } from '@/lib/account/profile';
import { profileUpdateSchema } from '@/lib/account/validation';

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = profileUpdateSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const profile = await updateCustomerProfile(authResult.userId, parsed.data);
	return jsonResponse({ profile });
};
