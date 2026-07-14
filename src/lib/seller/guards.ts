import type { APIContext } from 'astro';
import { Role } from '@prisma/client';

import { localizedPath } from '@/i18n';
import type { SupportedLocale } from '@/config/site';
import { hasAnyRole, hasRole, requireSessionUser } from '@/lib/authz';
import { getSellerApplicationState } from '@/lib/seller/application';
import { getSellerProfileByUserId } from '@/lib/seller/profile';

export async function requireApprovedSeller(context: APIContext, locale: SupportedLocale) {
	const user = await requireSessionUser(context, locale);

	if (hasAnyRole(user.roles, [Role.ADMINISTRATOR, Role.STAFF])) {
		return user;
	}

	if (!hasRole(user.roles, Role.SELLER)) {
		return context.redirect(localizedPath(locale, '/seller/application')) as never;
	}

	const profile = await getSellerProfileByUserId(user.id);

	if (!profile) {
		return context.redirect(localizedPath(locale, '/seller/application')) as never;
	}

	if (profile.status === 'SUSPENDED') {
		return context.redirect(localizedPath(locale, '/seller/application?status=suspended')) as never;
	}

	if (profile.status !== 'APPROVED') {
		return context.redirect(localizedPath(locale, '/seller/application')) as never;
	}

	return user;
}

export async function getUserSellerMenuState(userId: string): Promise<{
	showSellerDashboard: boolean;
	showSellerApplication: boolean;
	showBecomeSeller: boolean;
}> {
	const { accessState } = await getSellerApplicationState(userId);

	return {
		showSellerDashboard: accessState === 'approved',
		showSellerApplication:
			accessState === 'pending' ||
			accessState === 'under_review' ||
			accessState === 'rejected' ||
			accessState === 'suspended',
		showBecomeSeller: accessState === 'none',
	};
}
