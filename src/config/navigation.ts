import type { SupportedLocale } from '@/config/site';

export interface NavLink {
	key: string;
	href: string;
	external?: boolean;
}

export interface CategoryLink {
	key: string;
	slug: string;
}

export const mainNavLinks: NavLink[] = [
	{ key: 'nav.home', href: '/' },
	{ key: 'nav.deals', href: '/deals' },
	{ key: 'nav.shops', href: '/shops' },
	{ key: 'nav.help', href: '/help' },
];

export const categoryLinks: CategoryLink[] = [
	{ key: 'categories.electronics', slug: 'electronics' },
	{ key: 'categories.fashion', slug: 'fashion' },
	{ key: 'categories.home', slug: 'home' },
	{ key: 'categories.beauty', slug: 'beauty' },
	{ key: 'categories.groceries', slug: 'groceries' },
	{ key: 'categories.sports', slug: 'sports' },
];

export interface FooterSection {
	titleKey: string;
	links: NavLink[];
}

export const footerSections: FooterSection[] = [
	{
		titleKey: 'footer.shop',
		links: [
			{ key: 'nav.categories', href: '/#categories' },
			{ key: 'nav.deals', href: '/deals' },
			{ key: 'nav.shops', href: '/shops' },
		],
	},
	{
		titleKey: 'footer.sell',
		links: [{ key: 'nav.becomeSeller', href: '/become-a-seller' }],
	},
	{
		titleKey: 'footer.support',
		links: [
			{ key: 'nav.help', href: '/help' },
			{ key: 'nav.contact', href: '/contact' },
			{ key: 'nav.about', href: '/about' },
		],
	},
	{
		titleKey: 'footer.legal',
		links: [
			{ key: 'privacy.title', href: '/privacy' },
			{ key: 'terms.title', href: '/terms' },
			{ key: 'returns.title', href: '/returns' },
			{ key: 'sellerPolicy.title', href: '/seller-policy' },
			{ key: 'prohibitedProducts.title', href: '/prohibited-products' },
		],
	},
];

export function resolveNavHref(locale: SupportedLocale, href: string): string {
	if (href.startsWith('http') || href.startsWith('#')) {
		return href;
	}

	const base = `/${locale}`;
	return href === '/' ? `${base}/` : `${base}${href}`;
}
