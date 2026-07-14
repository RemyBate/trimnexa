import type { APIRoute } from 'astro';

import { jsonResponse, readJsonBody, requireAccountApiUser } from '@/lib/account/api-auth';
import { createSupportTicket } from '@/lib/account/support';
import { supportTicketSchema } from '@/lib/account/validation';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const body = await readJsonBody<unknown>(context.request);
	if (body instanceof Response) {
		return body;
	}

	const parsed = supportTicketSchema.safeParse(body);
	if (!parsed.success) {
		return jsonResponse({ error: 'validation_failed', issues: parsed.error.flatten() }, 400);
	}

	const ticket = await createSupportTicket(authResult.userId, parsed.data);
	return jsonResponse({ ticket }, 201);
};
