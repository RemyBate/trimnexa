import type { APIContext } from 'astro';
import { Role } from '@prisma/client';

import { auth } from '@/lib/auth';
import { getMarketplaceUser, hasAnyRole, type MarketplaceUser } from '@/lib/authz';
import { isDatabaseConfigured } from '@/lib/db';
import { jsonResponse } from '@/lib/seller/api-auth';

export interface AdminApiUser {
	userId: string;
	marketplaceUser: MarketplaceUser;
}

export async function requireAdminApiUser(context: APIContext): Promise<AdminApiUser | Response> {
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

	if (!hasAnyRole(marketplaceUser.roles, [Role.ADMINISTRATOR, Role.STAFF])) {
		return jsonResponse({ error: 'forbidden' }, 403);
	}

	return {
		userId: session.user.id,
		marketplaceUser,
	};
}
