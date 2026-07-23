import type { Prisma } from '@prisma/client';

import { PUBLIC_PRODUCT_STATUSES } from '@/lib/catalogue/types';
import {
	canAddNewCartLine,
	computeMergedQuantity,
	type GuestCartMergeResult,
} from '@/lib/cart/merge';
import { MAX_CART_LINES } from '@/lib/cart/validation';
import { prisma } from '@/lib/db';
import { formatMoney, xafFromMinor } from '@/lib/money';

export type CartErrorCode =
	| 'product_not_found'
	| 'product_unavailable'
	| 'out_of_stock'
	| 'insufficient_stock'
	| 'cart_item_not_found'
	| 'cart_full'
	| 'profile_not_found';

export type CartResult<T> = { ok: true; data: T } | { ok: false; code: CartErrorCode };

export interface CartLineView {
	id: string;
	productId: string;
	productSlug: string;
	productTitle: string;
	quantity: number;
	stockQty: number;
	inStock: boolean;
	unitPriceMinor: string;
	unitPriceFormatted: string;
	lineTotalMinor: string;
	lineTotalFormatted: string;
	imageUrl: string | null;
	imageAlt: string | null;
	sellerShopName: string | null;
	sellerShopSlug: string | null;
	sellerProfileId: string;
	maxQuantity: number;
	quantityClamped: boolean;
}

export interface CartSellerGroup {
	sellerProfileId: string;
	sellerShopName: string | null;
	sellerShopSlug: string | null;
	items: CartLineView[];
	subtotalMinor: string;
	subtotalFormatted: string;
}

export interface CartView {
	id: string;
	itemCount: number;
	groups: CartSellerGroup[];
	subtotalMinor: string;
	subtotalFormatted: string;
	currency: string;
	hasUnavailableItems: boolean;
}

const cartItemInclude = {
	product: {
		include: {
			images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
			sellerProfile: {
				select: {
					id: true,
					shopName: true,
					shopSlug: true,
					status: true,
				},
			},
			category: { select: { isActive: true } },
		},
	},
} satisfies Prisma.CartItemInclude;

function toPublicMediaUrl(path: string | null | undefined): string | null {
	return path ? `/${path.replace(/^\/+/, '')}` : null;
}

function isPubliclyPurchasable(product: {
	status: string;
	stockQty: number;
	category: { isActive: boolean };
	sellerProfile: { status: string };
}): boolean {
	return (
		PUBLIC_PRODUCT_STATUSES.includes(product.status as (typeof PUBLIC_PRODUCT_STATUSES)[number]) &&
		product.category.isActive &&
		product.sellerProfile.status === 'APPROVED' &&
		product.status === 'ACTIVE' &&
		product.stockQty > 0
	);
}

function mapCartLine(
	item: {
		id: string;
		quantity: number;
		product: {
			id: string;
			slug: string;
			title: string;
			priceMinor: bigint;
			currency: string;
			stockQty: number;
			status: string;
			images: Array<{ path: string; altText: string | null }>;
			sellerProfile: {
				id: string;
				shopName: string | null;
				shopSlug: string | null;
				status: string;
			};
			category: { isActive: boolean };
		};
	},
	locale: string,
): CartLineView {
	const available = isPubliclyPurchasable(item.product);
	const maxQuantity = available ? item.product.stockQty : 0;
	const effectiveQty = available ? Math.min(item.quantity, maxQuantity) : 0;
	const quantityClamped = available && effectiveQty !== item.quantity;
	const unit = xafFromMinor(item.product.priceMinor);
	const lineTotal = {
		amountMinor: unit.amountMinor * BigInt(effectiveQty),
		currency: unit.currency,
	};
	const primaryImage = item.product.images[0];

	return {
		id: item.id,
		productId: item.product.id,
		productSlug: item.product.slug,
		productTitle: item.product.title,
		quantity: item.quantity,
		stockQty: item.product.stockQty,
		inStock: available,
		unitPriceMinor: item.product.priceMinor.toString(),
		unitPriceFormatted: formatMoney(unit, locale === 'fr' ? 'fr-CM' : 'en-CM'),
		lineTotalMinor: lineTotal.amountMinor.toString(),
		lineTotalFormatted: formatMoney(lineTotal, locale === 'fr' ? 'fr-CM' : 'en-CM'),
		imageUrl: primaryImage ? toPublicMediaUrl(primaryImage.path) : null,
		imageAlt: primaryImage?.altText ?? item.product.title,
		sellerShopName: item.product.sellerProfile.shopName,
		sellerShopSlug: item.product.sellerProfile.shopSlug,
		sellerProfileId: item.product.sellerProfile.id,
		maxQuantity,
		quantityClamped,
	};
}

function buildCartView(
	cartId: string,
	items: Array<Parameters<typeof mapCartLine>[0]>,
	locale: string,
): CartView {
	const lines = items.map((item) => mapCartLine(item, locale));
	const groupMap = new Map<string, CartSellerGroup>();

	for (const line of lines) {
		const existing = groupMap.get(line.sellerProfileId);
		if (existing) {
			existing.items.push(line);
		} else {
			groupMap.set(line.sellerProfileId, {
				sellerProfileId: line.sellerProfileId,
				sellerShopName: line.sellerShopName,
				sellerShopSlug: line.sellerShopSlug,
				items: [line],
				subtotalMinor: '0',
				subtotalFormatted: '',
			});
		}
	}

	const groups = [...groupMap.values()].map((group) => {
		const subtotal = group.items.reduce((sum, item) => sum + BigInt(item.lineTotalMinor), 0n);
		const money = xafFromMinor(subtotal);
		return {
			...group,
			subtotalMinor: subtotal.toString(),
			subtotalFormatted: formatMoney(money, locale === 'fr' ? 'fr-CM' : 'en-CM'),
		};
	});

	const subtotal = lines.reduce((sum, item) => sum + BigInt(item.lineTotalMinor), 0n);
	const money = xafFromMinor(subtotal);

	return {
		id: cartId,
		itemCount: lines.reduce(
			(sum, item) => sum + (item.inStock ? Math.min(item.quantity, item.maxQuantity) : 0),
			0,
		),
		groups,
		subtotalMinor: subtotal.toString(),
		subtotalFormatted: formatMoney(money, locale === 'fr' ? 'fr-CM' : 'en-CM'),
		currency: 'XAF',
		hasUnavailableItems: lines.some((item) => !item.inStock || item.quantityClamped),
	};
}

async function getCustomerProfileId(userId: string): Promise<string | null> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		select: { id: true },
	});
	return profile?.id ?? null;
}

export async function ensureUserCart(userId: string): Promise<string> {
	const profileId = await getCustomerProfileId(userId);
	if (!profileId) {
		throw new Error('profile_not_found');
	}

	const existing = await prisma.cart.findUnique({
		where: { customerProfileId: profileId },
		select: { id: true },
	});

	if (existing) {
		return existing.id;
	}

	const cart = await prisma.cart.create({
		data: { customerProfileId: profileId },
	});

	return cart.id;
}

export async function ensureGuestCart(guestToken: string): Promise<string> {
	const existing = await prisma.cart.findUnique({
		where: { guestToken },
		select: { id: true },
	});

	if (existing) {
		return existing.id;
	}

	const cart = await prisma.cart.create({
		data: { guestToken },
	});

	return cart.id;
}

async function loadCartView(cartId: string, locale: string): Promise<CartView> {
	const cart = await prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			items: {
				orderBy: { createdAt: 'asc' },
				include: cartItemInclude,
			},
		},
	});

	if (!cart) {
		return {
			id: cartId,
			itemCount: 0,
			groups: [],
			subtotalMinor: '0',
			subtotalFormatted: formatMoney(xafFromMinor(0n), locale === 'fr' ? 'fr-CM' : 'en-CM'),
			currency: 'XAF',
			hasUnavailableItems: false,
		};
	}

	return buildCartView(cart.id, cart.items, locale);
}

export async function getCartById(cartId: string, locale: string): Promise<CartView> {
	return loadCartView(cartId, locale);
}

export async function getCartForUser(userId: string, locale: string): Promise<CartView> {
	const cartId = await ensureUserCart(userId);
	return loadCartView(cartId, locale);
}

export async function getCartForGuest(guestToken: string, locale: string): Promise<CartView> {
	const cartId = await ensureGuestCart(guestToken);
	return loadCartView(cartId, locale);
}

export async function countCartItemsForUser(userId: string): Promise<number> {
	const profileId = await getCustomerProfileId(userId);
	if (!profileId) {
		return 0;
	}

	const cart = await prisma.cart.findUnique({
		where: { customerProfileId: profileId },
		select: { items: { select: { quantity: true } } },
	});

	return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export async function countCartItemsForGuest(guestToken: string): Promise<number> {
	const cart = await prisma.cart.findUnique({
		where: { guestToken },
		select: { items: { select: { quantity: true } } },
	});

	return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

async function resolvePurchasableProduct(productId: string) {
	return prisma.product.findFirst({
		where: {
			id: productId,
			status: 'ACTIVE',
			stockQty: { gt: 0 },
			category: { isActive: true },
			sellerProfile: { status: 'APPROVED' },
		},
		select: { id: true, stockQty: true },
	});
}

export async function addCartItem(
	cartId: string,
	productId: string,
	quantity: number,
	locale: string,
): Promise<CartResult<CartView>> {
	const product = await resolvePurchasableProduct(productId);
	if (!product) {
		const exists = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true },
		});
		return { ok: false, code: exists ? 'product_unavailable' : 'product_not_found' };
	}

	const existing = await prisma.cartItem.findUnique({
		where: { cartId_productId: { cartId, productId } },
	});

	const nextQty = (existing?.quantity ?? 0) + quantity;
	if (nextQty > product.stockQty) {
		return { ok: false, code: 'insufficient_stock' };
	}

	if (!existing) {
		const lineCount = await prisma.cartItem.count({ where: { cartId } });
		if (lineCount >= MAX_CART_LINES) {
			return { ok: false, code: 'cart_full' };
		}
	}

	await prisma.cartItem.upsert({
		where: { cartId_productId: { cartId, productId } },
		create: { cartId, productId, quantity: nextQty },
		update: { quantity: nextQty },
	});

	return { ok: true, data: await loadCartView(cartId, locale) };
}

export async function updateCartItemQuantity(
	cartId: string,
	itemId: string,
	quantity: number,
	locale: string,
): Promise<CartResult<CartView>> {
	const item = await prisma.cartItem.findFirst({
		where: { id: itemId, cartId },
		include: { product: { select: { id: true, stockQty: true, status: true } } },
	});

	if (!item) {
		return { ok: false, code: 'cart_item_not_found' };
	}

	if (quantity === 0) {
		await prisma.cartItem.delete({ where: { id: item.id } });
		return { ok: true, data: await loadCartView(cartId, locale) };
	}

	const product = await resolvePurchasableProduct(item.productId);
	if (!product) {
		return { ok: false, code: 'product_unavailable' };
	}

	if (quantity > product.stockQty) {
		return { ok: false, code: 'insufficient_stock' };
	}

	await prisma.cartItem.update({
		where: { id: item.id },
		data: { quantity },
	});

	return { ok: true, data: await loadCartView(cartId, locale) };
}

export async function removeCartItem(
	cartId: string,
	itemId: string,
	locale: string,
): Promise<CartResult<CartView>> {
	const item = await prisma.cartItem.findFirst({
		where: { id: itemId, cartId },
		select: { id: true },
	});

	if (!item) {
		return { ok: false, code: 'cart_item_not_found' };
	}

	await prisma.cartItem.delete({ where: { id: item.id } });
	return { ok: true, data: await loadCartView(cartId, locale) };
}

export async function setBuyNowItem(
	cartId: string,
	productId: string,
	locale: string,
): Promise<CartResult<CartView>> {
	const product = await resolvePurchasableProduct(productId);
	if (!product) {
		const exists = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true },
		});
		return { ok: false, code: exists ? 'product_unavailable' : 'product_not_found' };
	}

	await prisma.cartItem.upsert({
		where: { cartId_productId: { cartId, productId } },
		create: { cartId, productId, quantity: 1 },
		update: { quantity: 1 },
	});

	return { ok: true, data: await loadCartView(cartId, locale) };
}

/** Merge guest cart into authenticated user cart, then delete guest cart. */
export async function mergeGuestCartIntoUser(
	userId: string,
	guestToken: string,
): Promise<GuestCartMergeResult> {
	const profileId = await getCustomerProfileId(userId);
	if (!profileId) {
		throw new Error('profile_not_found');
	}

	const guestCart = await prisma.cart.findUnique({
		where: { guestToken },
		include: { items: true },
	});

	if (!guestCart) {
		return { merged: false, linesMerged: 0, linesSkipped: 0, guestCartDeleted: false };
	}

	if (guestCart.items.length === 0) {
		await prisma.cart.delete({ where: { id: guestCart.id } });
		return { merged: false, linesMerged: 0, linesSkipped: 0, guestCartDeleted: true };
	}

	// Do not merge a guest cart that already belongs to a customer profile.
	if (guestCart.customerProfileId) {
		throw new Error('guest_cart_invalid');
	}

	const userCartId = await ensureUserCart(userId);

	const result = await prisma.$transaction(async (tx) => {
		let linesMerged = 0;
		let linesSkipped = 0;

		for (const guestItem of guestCart.items) {
			const product = await tx.product.findFirst({
				where: {
					id: guestItem.productId,
					status: 'ACTIVE',
					stockQty: { gt: 0 },
					category: { isActive: true },
					sellerProfile: { status: 'APPROVED' },
				},
				select: { id: true, stockQty: true },
			});

			if (!product) {
				linesSkipped += 1;
				continue;
			}

			const existing = await tx.cartItem.findUnique({
				where: {
					cartId_productId: { cartId: userCartId, productId: guestItem.productId },
				},
			});

			const nextQty = computeMergedQuantity(
				existing?.quantity ?? 0,
				guestItem.quantity,
				product.stockQty,
			);

			if (nextQty <= 0) {
				linesSkipped += 1;
				continue;
			}

			if (!existing) {
				const lineCount = await tx.cartItem.count({ where: { cartId: userCartId } });
				if (!canAddNewCartLine(lineCount)) {
					linesSkipped += 1;
					continue;
				}
			}

			await tx.cartItem.upsert({
				where: {
					cartId_productId: { cartId: userCartId, productId: guestItem.productId },
				},
				create: {
					cartId: userCartId,
					productId: guestItem.productId,
					quantity: nextQty,
				},
				update: { quantity: nextQty },
			});
			linesMerged += 1;
		}

		await tx.cart.delete({ where: { id: guestCart.id } });

		return {
			merged: linesMerged > 0 || linesSkipped > 0,
			linesMerged,
			linesSkipped,
			guestCartDeleted: true,
		} satisfies GuestCartMergeResult;
	});

	return result;
}
