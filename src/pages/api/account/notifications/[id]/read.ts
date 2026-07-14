import type { APIRoute } from 'astro';

import { jsonResponse, requireAccountApiUser } from '@/lib/account/api-auth';
import { markNotificationRead } from '@/lib/account/notifications';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const authResult = await requireAccountApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const notificationId = context.params.id;
	if (!notificationId) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	const notification = await markNotificationRead(authResult.userId, notificationId);
	if (!notification) {
		return jsonResponse({ error: 'not_found' }, 404);
	}

	return jsonResponse({ notification });
};
