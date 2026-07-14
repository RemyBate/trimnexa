import type { Role } from '@prisma/client';

import type { SupportedLocale } from '@/config/site';
import { localizedPath } from '@/i18n';
import { canAccessAdminArea, canAccessSellerArea } from '@/lib/authz/roles';

function isSafeReturnPath(locale: SupportedLocale, returnTo: string): boolean {
	if (!returnTo.startsWith(`/${locale}/`)) {
		return false;
	}

	if (returnTo.includes('/auth/')) {
		return false;
	}

	return true;
}

/**
 * Chooses a post-login destination based on marketplace roles.
 * Honors returnTo when it points to a safe in-app path for the locale.
 */
export function getPostLoginRedirectPath(
	locale: SupportedLocale,
	roles: Role[],
	returnTo?: string | null,
): string {
	if (returnTo && isSafeReturnPath(locale, returnTo)) {
		return returnTo;
	}

	if (canAccessAdminArea(roles)) {
		return localizedPath(locale, '/admin');
	}

	if (canAccessSellerArea(roles)) {
		return localizedPath(locale, '/seller');
	}

	return localizedPath(locale, '/account');
}
