import type { Role, UserStatus } from '@prisma/client';
import type { APIContext } from 'astro';

import { localizedPath } from '@/i18n';
import type { SupportedLocale } from '@/config/site';
import { hasAnyRole } from '@/lib/authz/roles';
import { prisma } from '@/lib/db';

export {
	canAccessAdminArea,
	canAccessSellerArea,
	hasAllRoles,
	hasAnyRole,
	hasRole,
} from '@/lib/authz/roles';

export interface MarketplaceUser {
	id: string;
	email: string;
	status: UserStatus;
	roles: Role[];
}

export async function getMarketplaceUser(userId: string): Promise<MarketplaceUser | null> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			status: true,
			roles: {
				select: { role: true },
			},
		},
	});

	if (!user) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		status: user.status,
		roles: user.roles.map((assignment) => assignment.role),
	};
}

export function buildLoginRedirect(locale: SupportedLocale, returnTo: string): string {
	const params = new URLSearchParams({ returnTo });
	return `${localizedPath(locale, '/auth/login')}?${params.toString()}`;
}

export async function requireSessionUser(
	context: APIContext,
	locale: SupportedLocale,
): Promise<MarketplaceUser> {
	const sessionUser = context.locals.user;

	if (!sessionUser) {
		return context.redirect(buildLoginRedirect(locale, context.url.pathname)) as never;
	}

	const marketplaceUser = await getMarketplaceUser(sessionUser.id);

	if (!marketplaceUser) {
		return context.redirect(buildLoginRedirect(locale, context.url.pathname)) as never;
	}

	if (marketplaceUser.status === 'SUSPENDED') {
		return context.redirect(localizedPath(locale, '/auth/login?error=account_suspended')) as never;
	}

	return marketplaceUser;
}

export async function requireRoles(
	context: APIContext,
	locale: SupportedLocale,
	allowedRoles: Role[],
): Promise<MarketplaceUser> {
	const user = await requireSessionUser(context, locale);

	if (!hasAnyRole(user.roles, allowedRoles)) {
		return context.redirect(localizedPath(locale, '/')) as never;
	}

	return user;
}
