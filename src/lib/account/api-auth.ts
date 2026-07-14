import type { APIContext } from 'astro';

import { auth } from '@/lib/auth';
import { getMarketplaceUser, type MarketplaceUser } from '@/lib/authz';
import { isDatabaseConfigured } from '@/lib/db';

export interface AccountApiUser {
	userId: string;
	marketplaceUser: MarketplaceUser;
}

export function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function requireAccountApiUser(
	context: APIContext,
): Promise<AccountApiUser | Response> {
	if (!isDatabaseConfigured()) {
		return jsonResponse({ error: 'service_unavailable' }, 503);
	}

	const session = await auth.api.getSession({
		headers: context.request.headers,
	});

	if (!session?.user) {
		return jsonResponse({ error: 'unauthorized' }, 401);
	}

	const marketplaceUser = await getMarketplaceUser(session.user.id);

	if (!marketplaceUser || marketplaceUser.status === 'SUSPENDED') {
		return jsonResponse({ error: 'unauthorized' }, 401);
	}

	return {
		userId: session.user.id,
		marketplaceUser,
	};
}

export async function readJsonBody<T>(request: Request): Promise<T | Response> {
	try {
		return (await request.json()) as T;
	} catch {
		return jsonResponse({ error: 'invalid_json' }, 400);
	}
}
