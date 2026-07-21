import { site } from '@/config/site';
import type { CatalogueProductDetail } from '@/lib/catalogue/types';

export function buildProductStructuredData(
	product: CatalogueProductDetail,
	pageUrl: string,
): Record<string, unknown> {
	const primaryImage = product.images[0]?.url;
	const availability = product.inStock
		? 'https://schema.org/InStock'
		: 'https://schema.org/OutOfStock';

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		description: product.description ?? product.title,
		image: product.images.map((image) => image.url),
		sku: product.slug,
		offers: {
			'@type': 'Offer',
			url: pageUrl,
			priceCurrency: product.currency || site.currency.code,
			price: Number(product.priceMinor),
			availability,
			seller: product.sellerShopName
				? {
						'@type': 'Organization',
						name: product.sellerShopName,
					}
				: undefined,
		},
		...(primaryImage ? { image: primaryImage } : {}),
	};
}

export function buildBreadcrumbStructuredData(
	items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
