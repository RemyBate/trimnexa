import { PUBLIC_PRODUCT_STATUSES } from '@/lib/catalogue/types';
import { prisma } from '@/lib/db';
import { formatMoney, xafFromMinor } from '@/lib/money';
import { ensureCustomerWishlist } from '@/lib/account/wishlist';

export type WishlistErrorCode = 'product_not_found' | 'product_unavailable' | 'item_not_found';

export type WishlistMutationResult<T> =
	{ ok: true; data: T } | { ok: false; code: WishlistErrorCode };

export interface WishlistItemDetail {
	id: string;
	productId: string | null;
	productSlug: string;
	productTitle: string;
	priceFormatted: string | null;
	imageUrl: string | null;
	inStock: boolean;
	available: boolean;
	addedAt: Date;
}

function toPublicMediaUrl(path: string | null | undefined): string | null {
	return path ? `/${path.replace(/^\/+/, '')}` : null;
}

export async function listWishlistItemDetails(
	userId: string,
	locale: string,
): Promise<WishlistItemDetail[]> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		include: {
			wishlist: {
				include: {
					items: {
						orderBy: { addedAt: 'desc' },
						include: {
							product: {
								include: {
									images: { orderBy: { sortOrder: 'asc' }, take: 1 },
									sellerProfile: { select: { status: true } },
									category: { select: { isActive: true } },
								},
							},
						},
					},
				},
			},
		},
	});

	const items = profile?.wishlist?.items ?? [];

	return items.map((item) => {
		const product = item.product;
		const available = Boolean(
			product &&
			PUBLIC_PRODUCT_STATUSES.includes(product.status) &&
			product.category.isActive &&
			product.sellerProfile.status === 'APPROVED',
		);
		const inStock = Boolean(
			available && product && product.status === 'ACTIVE' && product.stockQty > 0,
		);
		const money = product ? xafFromMinor(product.priceMinor) : null;

		return {
			id: item.id,
			productId: item.productId,
			productSlug: item.productSlug,
			productTitle: item.productTitle,
			priceFormatted: money ? formatMoney(money, locale === 'fr' ? 'fr-CM' : 'en-CM') : null,
			imageUrl: product?.images[0] ? toPublicMediaUrl(product.images[0].path) : null,
			inStock,
			available,
			addedAt: item.addedAt,
		};
	});
}

export async function addWishlistItem(
	userId: string,
	productId: string,
	locale: string,
): Promise<WishlistMutationResult<WishlistItemDetail[]>> {
	const product = await prisma.product.findFirst({
		where: {
			id: productId,
			status: { in: PUBLIC_PRODUCT_STATUSES },
			category: { isActive: true },
			sellerProfile: { status: 'APPROVED' },
		},
		select: { id: true, slug: true, title: true },
	});

	if (!product) {
		const exists = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true },
		});
		return { ok: false, code: exists ? 'product_unavailable' : 'product_not_found' };
	}

	const wishlistId = await ensureCustomerWishlist(userId);

	await prisma.wishlistItem.upsert({
		where: {
			wishlistId_productSlug: {
				wishlistId,
				productSlug: product.slug,
			},
		},
		create: {
			wishlistId,
			productId: product.id,
			productSlug: product.slug,
			productTitle: product.title,
		},
		update: {
			productId: product.id,
			productTitle: product.title,
		},
	});

	return { ok: true, data: await listWishlistItemDetails(userId, locale) };
}

export async function removeWishlistItem(
	userId: string,
	itemId: string,
	locale: string,
): Promise<WishlistMutationResult<WishlistItemDetail[]>> {
	const wishlistId = await ensureCustomerWishlist(userId);
	const item = await prisma.wishlistItem.findFirst({
		where: { id: itemId, wishlistId },
		select: { id: true },
	});

	if (!item) {
		return { ok: false, code: 'item_not_found' };
	}

	await prisma.wishlistItem.delete({ where: { id: item.id } });
	return { ok: true, data: await listWishlistItemDetails(userId, locale) };
}

export async function isProductInWishlist(userId: string, productId: string): Promise<boolean> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		include: {
			wishlist: {
				include: {
					items: {
						where: { productId },
						select: { id: true },
						take: 1,
					},
				},
			},
		},
	});

	return (profile?.wishlist?.items.length ?? 0) > 0;
}
