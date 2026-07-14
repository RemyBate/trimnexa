import type { PageContext } from '@/i18n';

export interface AccountNavItem {
	key: string;
	href: string;
	label: string;
}

export function getAccountNavItems(t: PageContext['t']): AccountNavItem[] {
	return [
		{ key: 'dashboard', href: '/account', label: t('account.nav.dashboard') },
		{ key: 'profile', href: '/account/profile', label: t('account.nav.profile') },
		{ key: 'orders', href: '/account/orders', label: t('account.nav.orders') },
		{ key: 'addresses', href: '/account/addresses', label: t('account.nav.addresses') },
		{ key: 'wishlist', href: '/account/wishlist', label: t('account.nav.wishlist') },
		{ key: 'notifications', href: '/account/notifications', label: t('account.nav.notifications') },
		{ key: 'support', href: '/account/support', label: t('account.nav.support') },
	];
}
