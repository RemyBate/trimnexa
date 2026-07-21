import type { ProductStatus } from '@prisma/client';

/** Product statuses visible on the public marketplace. */
export const PUBLIC_PRODUCT_STATUSES: ProductStatus[] = ['ACTIVE', 'OUT_OF_STOCK'];

export type CatalogueSort = 'newest' | 'price_asc' | 'price_desc' | 'title_asc';

export interface CatalogueQueryInput {
	locale: string;
	page?: number;
	pageSize?: number;
	sort?: CatalogueSort;
	q?: string;
	categorySlug?: string;
	sellerSlug?: string;
	minPriceMajor?: number;
	maxPriceMajor?: number;
	inStockOnly?: boolean;
}

export interface PaginatedResult<T> {
	items: T[];
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

export interface CatalogueProductCard {
	id: string;
	title: string;
	slug: string;
	priceFormatted: string;
	priceMinor: string;
	currency: string;
	stockQty: number;
	inStock: boolean;
	imageUrl: string | null;
	imageAlt: string | null;
	categoryName: string;
	categorySlug: string;
	sellerShopName: string | null;
	sellerShopSlug: string | null;
}

export interface CatalogueProductDetail extends CatalogueProductCard {
	description: string | null;
	images: Array<{ url: string; altText: string | null }>;
	updatedAt: string;
}

export interface CatalogueShopSummary {
	id: string;
	shopName: string;
	shopSlug: string;
	description: string | null;
	logoUrl: string | null;
	city: string | null;
	region: string | null;
	productCount: number;
}

export interface CatalogueCategoryPage {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	parent: { slug: string; name: string } | null;
	children: Array<{ slug: string; name: string }>;
	breadcrumbs: Array<{ label: string; href: string }>;
}

export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 48;
