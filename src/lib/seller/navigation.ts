import type { PageContext } from '@/i18n';

export interface SellerNavItem {
	key: string;
	href: string;
	label: string;
}

export function getSellerNavItems(t: PageContext['t']): SellerNavItem[] {
	return [
		{ key: 'dashboard', href: '/seller', label: t('seller.nav.dashboard') },
		{ key: 'products', href: '/seller/products', label: t('seller.nav.products') },
		{ key: 'shop', href: '/seller/shop', label: t('seller.nav.shop') },
		{ key: 'onboarding', href: '/seller/onboarding', label: t('seller.nav.onboarding') },
	];
}
