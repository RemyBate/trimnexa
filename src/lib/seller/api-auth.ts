import type { APIContext } from 'astro';
import { Role } from '@prisma/client';

import { auth } from '@/lib/auth';
import { getMarketplaceUser, hasAnyRole, type MarketplaceUser } from '@/lib/authz';
import { isDatabaseConfigured } from '@/lib/db';
import { getSellerProfileByUserId } from '@/lib/seller/profile';

export interface SellerApiUser {
	userId: string;
	marketplaceUser: MarketplaceUser;
}

export function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function requireSellerApiUser(context: APIContext): Promise<SellerApiUser | Response> {
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

export async function requireApprovedSellerApiUser(
	context: APIContext,
): Promise<SellerApiUser | Response> {
	const authResult = await requireSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	if (hasAnyRole(authResult.marketplaceUser.roles, [Role.ADMINISTRATOR, Role.STAFF])) {
		return authResult;
	}

	if (!hasAnyRole(authResult.marketplaceUser.roles, [Role.SELLER])) {
		return jsonResponse({ error: 'forbidden' }, 403);
	}

	const profile = await getSellerProfileByUserId(authResult.userId);

	if (!profile || profile.status !== 'APPROVED') {
		return jsonResponse({ error: 'seller_not_approved' }, 403);
	}

	return authResult;
}

export async function readJsonBody<T>(request: Request): Promise<T | Response> {
	try {
		return (await request.json()) as T;
	} catch {
		return jsonResponse({ error: 'invalid_json' }, 400);
	}
}
