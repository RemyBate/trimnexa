import type { APIRoute } from 'astro';

import {
	deleteCustomerAddress,
	setDefaultCustomerAddress,
	updateCustomerAddress,
} from '@/lib/account/addresses';
import { jsonResponse, readJsonBody, requireAccountApiUser } from '@/lib/account/api-auth';
import { addressInputSchema } from '@/lib/account/validation';

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const addressId = context.params.id;
	if (!addressId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	if (
		typeof body === 'object' &&
		body !== null &&
		'action' in body &&
		body.action === 'set_default'
	) {
		const address = await setDefaultCustomerAddress(authResult.userId, addressId);
		if (!address) {
			return jsonResponse({ error: 'not_found' }, 404);
		}

		return jsonResponse({ address });
	}

	const parsed = addressInputSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const address = await updateCustomerAddress(authResult.userId, addressId, parsed.data);
	if (!address) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ address });
};

export const DELETE: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const addressId = context.params.id;
	if (!addressId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const deleted = await deleteCustomerAddress(authResult.userId, addressId);
	if (!deleted) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ success: true });
};
