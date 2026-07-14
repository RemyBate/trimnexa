import type { APIRoute } from 'astro';

import { createCustomerAddress, listCustomerAddresses } from '@/lib/account/addresses';
import { jsonResponse, readJsonBody, requireAccountApiUser } from '@/lib/account/api-auth';
import { addressInputSchema } from '@/lib/account/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const addresses = await listCustomerAddresses(authResult.userId);
	return jsonResponse({ addresses });
};

export const POST: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = addressInputSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const address = await createCustomerAddress(authResult.userId, parsed.data);
	return jsonResponse({ address }, 201);
};
