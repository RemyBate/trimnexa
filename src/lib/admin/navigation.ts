import type { PageContext } from '@/i18n';

export interface AdminNavItem {
	key: string;
	href: string;
	label: string;
}

export function getAdminNavItems(t: PageContext['t']): AdminNavItem[] {
	return [
		{ key: 'dashboard', href: '/admin', label: t('admin.nav.dashboard') },
		{ key: 'sellers', href: '/admin/sellers', label: t('admin.nav.sellers') },
		{ key: 'products', href: '/admin/products', label: t('admin.nav.products') },
		{ key: 'categories', href: '/admin/categories', label: t('admin.nav.categories') },
	];
}
