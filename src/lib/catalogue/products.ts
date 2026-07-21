import type { Prisma } from '@prisma/client';

import {
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	PUBLIC_PRODUCT_STATUSES,
	type CatalogueProductCard,
	type CatalogueProductDetail,
	type CatalogueQueryInput,
	type CatalogueShopSummary,
	type CatalogueSort,
	type PaginatedResult,
} from '@/lib/catalogue/types';
import { emptyPaginatedResult, withCatalogueDb } from '@/lib/catalogue/runtime';
import { prisma } from '@/lib/db';
import { xafFromMajor, formatMoney, xafFromMinor } from '@/lib/money';

const productCardInclude = {
	images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
	category: {
		include: {
			translations: { where: { locale: { in: ['en', 'fr'] } } },
		},
	},
	sellerProfile: {
		select: {
			shopName: true,
			shopSlug: true,
			status: true,
		},
	},
} satisfies Prisma.ProductInclude;

function toPublicMediaUrl(path: string | null | undefined): string | null {
	return path ? `/${path.replace(/^\/+/, '')}` : null;
}

function pickTranslation<T extends { locale: string }>(
	translations: T[],
	locale: string,
	pickName: (item: T) => string,
): string {
	const match = translations.find((item) => item.locale === locale);
	if (match) {
		return pickName(match);
	}

	const fallback = translations.find((item) => item.locale === 'en');
	return fallback ? pickName(fallback) : '';
}

function mapProductCard(
	product: {
		id: string;
		title: string;
		slug: string;
		priceMinor: bigint;
		currency: string;
		stockQty: number;
		images: Array<{ path: string; altText: string | null }>;
		category: { slug: string; translations: Array<{ locale: string; name: string }> };
		sellerProfile: { shopName: string | null; shopSlug: string | null; status: string };
	},
	locale: string,
): CatalogueProductCard {
	const money = xafFromMinor(product.priceMinor);
	const primaryImage = product.images[0];

	return {
		id: product.id,
		title: product.title,
		slug: product.slug,
		priceFormatted: formatMoney(money),
		priceMinor: product.priceMinor.toString(),
		currency: product.currency,
		stockQty: product.stockQty,
		inStock: product.stockQty > 0,
		imageUrl: primaryImage ? toPublicMediaUrl(primaryImage.path) : null,
		imageAlt: primaryImage?.altText ?? product.title,
		categoryName:
			pickTranslation(product.category.translations, locale, (item) => item.name) ||
			product.category.slug,
		categorySlug: product.category.slug,
		sellerShopName: product.sellerProfile.shopName,
		sellerShopSlug: product.sellerProfile.shopSlug,
	};
}

function resolveSortOrder(sort: CatalogueSort): Prisma.ProductOrderByWithRelationInput {
	switch (sort) {
		case 'price_asc':
			return { priceMinor: 'asc' };
		case 'price_desc':
			return { priceMinor: 'desc' };
		case 'title_asc':
			return { title: 'asc' };
		default:
			return { createdAt: 'desc' };
	}
}

async function resolveCategoryIds(categorySlug?: string): Promise<string[] | undefined> {
	if (!categorySlug) {
		return undefined;
	}

	const category = await prisma.category.findFirst({
		where: { slug: categorySlug, isActive: true },
		include: { children: { where: { isActive: true }, select: { id: true } } },
	});

	if (!category) {
		return [];
	}

	return [category.id, ...category.children.map((child) => child.id)];
}

async function resolveSellerProfileId(sellerSlug?: string): Promise<string | null | undefined> {
	if (!sellerSlug) {
		return undefined;
	}

	const seller = await prisma.sellerProfile.findFirst({
		where: { shopSlug: sellerSlug, status: 'APPROVED' },
		select: { id: true },
	});

	return seller?.id ?? null;
}

export async function listPublicProducts(
	input: CatalogueQueryInput,
): Promise<PaginatedResult<CatalogueProductCard>> {
	const page = input.page ?? 1;
	const pageSize = Math.min(input.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

	return withCatalogueDb('listPublicProducts', emptyPaginatedResult(page, pageSize), async () => {
		const sort = input.sort ?? 'newest';

		const categoryIds = await resolveCategoryIds(input.categorySlug);
		if (categoryIds && categoryIds.length === 0) {
			return emptyPaginatedResult(page, pageSize);
		}

		const sellerProfileId = await resolveSellerProfileId(input.sellerSlug);
		if (sellerProfileId === null) {
			return emptyPaginatedResult(page, pageSize);
		}

		const where: Prisma.ProductWhereInput = {
			status: { in: PUBLIC_PRODUCT_STATUSES },
			sellerProfile: { status: 'APPROVED' },
			category: { isActive: true },
			...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
			...(sellerProfileId ? { sellerProfileId } : {}),
			...(input.inStockOnly ? { stockQty: { gt: 0 }, status: 'ACTIVE' } : {}),
			...(input.minPriceMajor !== undefined
				? { priceMinor: { gte: xafFromMajor(input.minPriceMajor) } }
				: {}),
			...(input.maxPriceMajor !== undefined
				? { priceMinor: { lte: xafFromMajor(input.maxPriceMajor) } }
				: {}),
		};

		if (input.q?.trim()) {
			const term = input.q.trim();
			where.OR = [
				{ title: { contains: term, mode: 'insensitive' } },
				{ description: { contains: term, mode: 'insensitive' } },
			];
		}

		const [totalItems, products] = await Promise.all([
			prisma.product.count({ where }),
			prisma.product.findMany({
				where,
				orderBy: resolveSortOrder(sort),
				skip: (page - 1) * pageSize,
				take: pageSize,
				include: productCardInclude,
			}),
		]);

		return {
			items: products.map((product) => mapProductCard(product, input.locale)),
			page,
			pageSize,
			totalItems,
			totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
		};
	});
}

export async function getPublicProductBySlug(
	slug: string,
	locale: string,
): Promise<CatalogueProductDetail | null> {
	return withCatalogueDb('getPublicProductBySlug', null, async () => {
		const product = await prisma.product.findFirst({
			where: {
				slug,
				status: { in: PUBLIC_PRODUCT_STATUSES },
				sellerProfile: { status: 'APPROVED' },
				category: { isActive: true },
			},
			include: {
				images: { orderBy: { sortOrder: 'asc' } },
				category: {
					include: {
						translations: { where: { locale: { in: ['en', 'fr'] } } },
					},
				},
				sellerProfile: {
					select: { shopName: true, shopSlug: true, status: true },
				},
			},
		});

		if (!product) {
			return null;
		}

		const card = mapProductCard(product, locale);

		return {
			...card,
			description: product.description,
			images: product.images
				.map((image) => {
					const url = toPublicMediaUrl(image.path);
					return url ? { url, altText: image.altText } : null;
				})
				.filter((image): image is { url: string; altText: string | null } => image !== null),
			updatedAt: product.updatedAt.toISOString(),
		};
	});
}

export async function listFeaturedProducts(
	locale: string,
	limit = 8,
): Promise<CatalogueProductCard[]> {
	const result = await listPublicProducts({
		locale,
		page: 1,
		pageSize: limit,
		sort: 'newest',
		inStockOnly: false,
	});

	return result.items;
}

export async function listPublicShops(_locale: string): Promise<CatalogueShopSummary[]> {
	return withCatalogueDb('listPublicShops', [], async () => {
		const sellers = await prisma.sellerProfile.findMany({
			where: {
				status: 'APPROVED',
				shopSlug: { not: null },
				shopName: { not: null },
				products: {
					some: {
						status: { in: PUBLIC_PRODUCT_STATUSES },
						category: { isActive: true },
					},
				},
			},
			orderBy: { shopName: 'asc' },
			select: {
				id: true,
				shopName: true,
				shopSlug: true,
				description: true,
				logoPath: true,
				city: true,
				region: true,
				_count: {
					select: {
						products: {
							where: {
								status: { in: PUBLIC_PRODUCT_STATUSES },
								category: { isActive: true },
							},
						},
					},
				},
			},
		});

		return sellers.map((seller) => ({
			id: seller.id,
			shopName: seller.shopName!,
			shopSlug: seller.shopSlug!,
			description: seller.description,
			logoUrl: toPublicMediaUrl(seller.logoPath),
			city: seller.city,
			region: seller.region,
			productCount: seller._count.products,
		}));
	});
}

export async function getPublicShopBySlug(
	shopSlug: string,
): Promise<(Omit<CatalogueShopSummary, 'productCount'> & { productCount: number }) | null> {
	return withCatalogueDb('getPublicShopBySlug', null, async () => {
		const seller = await prisma.sellerProfile.findFirst({
			where: { shopSlug, status: 'APPROVED' },
			select: {
				id: true,
				shopName: true,
				shopSlug: true,
				description: true,
				logoPath: true,
				bannerPath: true,
				city: true,
				region: true,
				returnPolicy: true,
				shippingPolicy: true,
				_count: {
					select: {
						products: {
							where: {
								status: { in: PUBLIC_PRODUCT_STATUSES },
								category: { isActive: true },
							},
						},
					},
				},
			},
		});

		if (!seller?.shopName || !seller.shopSlug) {
			return null;
		}

		return {
			id: seller.id,
			shopName: seller.shopName,
			shopSlug: seller.shopSlug,
			description: seller.description,
			logoUrl: toPublicMediaUrl(seller.logoPath),
			city: seller.city,
			region: seller.region,
			productCount: seller._count.products,
		};
	});
}
