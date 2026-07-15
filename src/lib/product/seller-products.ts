import type { ProductStatus } from '@prisma/client';

import { prisma } from '@/lib/db';
import { xafFromMajor } from '@/lib/money';
import { isCategoryAvailable } from '@/lib/product/categories';
import { recordInventoryAdjustment, resolveStockStatus } from '@/lib/product/inventory';
import { assertProductContentAllowed } from '@/lib/product/prohibited';
import { mapProduct, type ProductView } from '@/lib/product/serialize';
import { generateUniqueProductSlug } from '@/lib/product/slug';
import type { ProductInput } from '@/lib/product/validation';
import { getSellerProfileByUserId } from '@/lib/seller/profile';

const SELLER_EDITABLE_STATUSES: ProductStatus[] = ['DRAFT', 'REJECTED', 'ACTIVE', 'OUT_OF_STOCK'];

export type SellerProductErrorCode =
	| 'not_found'
	| 'forbidden'
	| 'invalid_category'
	| 'prohibited_content'
	| 'invalid_transition'
	| 'image_limit_reached';

export type SellerProductResult<T> = { ok: true; data: T } | { ok: false; code: SellerProductErrorCode };

const productInclude = {
	images: {
		orderBy: { sortOrder: 'asc' as const },
	},
};

async function getApprovedSellerProfileId(userId: string): Promise<string | null> {
	const profile = await getSellerProfileByUserId(userId);
	return profile?.status === 'APPROVED' ? profile.id : null;
}

export async function listSellerProducts(userId: string): Promise<ProductView[]> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return [];
	}

	const products = await prisma.product.findMany({
		where: { sellerProfileId },
		orderBy: { updatedAt: 'desc' },
		include: productInclude,
	});

	return products.map(mapProduct);
}

export async function getSellerProduct(
	userId: string,
	productId: string,
): Promise<ProductView | null> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return null;
	}

	const product = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
		include: productInclude,
	});

	return product ? mapProduct(product) : null;
}

export async function createSellerProduct(
	userId: string,
	input: ProductInput,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	if (!(await isCategoryAvailable(input.categoryId))) {
		return { ok: false, code: 'invalid_category' };
	}

	try {
		assertProductContentAllowed(input.title, input.description);
	} catch {
		return { ok: false, code: 'prohibited_content' };
	}

	const slug = await generateUniqueProductSlug(input.title);

	const product = await prisma.product.create({
		data: {
			sellerProfileId,
			categoryId: input.categoryId,
			title: input.title,
			slug,
			description: input.description?.trim() || null,
			priceMinor: xafFromMajor(input.priceMajor),
			stockQty: input.stockQty,
			status: 'DRAFT',
		},
		include: productInclude,
	});

	return { ok: true, data: mapProduct(product) };
}

export async function updateSellerProduct(
	userId: string,
	productId: string,
	input: ProductInput,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	const existing = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
	});

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (!SELLER_EDITABLE_STATUSES.includes(existing.status)) {
		return { ok: false, code: 'invalid_transition' };
	}

	if (!(await isCategoryAvailable(input.categoryId))) {
		return { ok: false, code: 'invalid_category' };
	}

	try {
		assertProductContentAllowed(input.title, input.description);
	} catch {
		return { ok: false, code: 'prohibited_content' };
	}

	const slug =
		input.title.trim() !== existing.title
			? await generateUniqueProductSlug(input.title, productId)
			: existing.slug;

	const product = await prisma.$transaction(async (tx) => {
		const updated = await tx.product.update({
			where: { id: productId },
			data: {
				categoryId: input.categoryId,
				title: input.title,
				slug,
				description: input.description?.trim() || null,
				priceMinor: xafFromMajor(input.priceMajor),
			},
			include: productInclude,
		});

		if (input.stockQty !== existing.stockQty) {
			await recordInventoryAdjustment(tx, {
				productId,
				actorId: userId,
				previousQty: existing.stockQty,
				newQty: input.stockQty,
				reason: 'seller_stock_update',
			});

			const nextStatus =
				existing.status === 'ACTIVE' || existing.status === 'OUT_OF_STOCK'
					? resolveStockStatus(input.stockQty)
					: existing.status;

			return tx.product.update({
				where: { id: productId },
				data: {
					stockQty: input.stockQty,
					status: nextStatus,
				},
				include: productInclude,
			});
		}

		return updated;
	});

	return { ok: true, data: mapProduct(product) };
}

export async function submitSellerProductForReview(
	userId: string,
	productId: string,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	const existing = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
		include: { images: true },
	});

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (existing.status !== 'DRAFT' && existing.status !== 'REJECTED') {
		return { ok: false, code: 'invalid_transition' };
	}

	if (existing.images.length === 0) {
		return { ok: false, code: 'invalid_transition' };
	}

	try {
		assertProductContentAllowed(existing.title, existing.description);
	} catch {
		return { ok: false, code: 'prohibited_content' };
	}

	const product = await prisma.product.update({
		where: { id: productId },
		data: {
			status: 'PENDING_REVIEW',
			submittedAt: new Date(),
			reviewNotes: null,
			reviewedAt: null,
			reviewedById: null,
		},
		include: productInclude,
	});

	return { ok: true, data: mapProduct(product) };
}

export async function archiveSellerProduct(
	userId: string,
	productId: string,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	const existing = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
	});

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (existing.status === 'PENDING_REVIEW') {
		return { ok: false, code: 'invalid_transition' };
	}

	const product = await prisma.product.update({
		where: { id: productId },
		data: { status: 'ARCHIVED' },
		include: productInclude,
	});

	return { ok: true, data: mapProduct(product) };
}

export async function addProductImage(
	userId: string,
	productId: string,
	path: string,
	altText?: string,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	const existing = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
		include: { images: true },
	});

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (!SELLER_EDITABLE_STATUSES.includes(existing.status)) {
		return { ok: false, code: 'invalid_transition' };
	}

	if (existing.images.length >= 8) {
		return { ok: false, code: 'image_limit_reached' };
	}

	const sortOrder = existing.images.length;

	await prisma.productImage.create({
		data: {
			productId,
			path,
			altText: altText?.trim() || null,
			sortOrder,
		},
	});

	const product = await prisma.product.findUniqueOrThrow({
		where: { id: productId },
		include: productInclude,
	});

	return { ok: true, data: mapProduct(product) };
}

export async function removeProductImage(
	userId: string,
	productId: string,
	imageId: string,
): Promise<SellerProductResult<ProductView>> {
	const sellerProfileId = await getApprovedSellerProfileId(userId);
	if (!sellerProfileId) {
		return { ok: false, code: 'forbidden' };
	}

	const existing = await prisma.product.findFirst({
		where: { id: productId, sellerProfileId },
	});

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (!SELLER_EDITABLE_STATUSES.includes(existing.status)) {
		return { ok: false, code: 'invalid_transition' };
	}

	const image = await prisma.productImage.findFirst({
		where: { id: imageId, productId },
	});

	if (!image) {
		return { ok: false, code: 'not_found' };
	}

	await prisma.productImage.delete({ where: { id: imageId } });

	const product = await prisma.product.findUniqueOrThrow({
		where: { id: productId },
		include: productInclude,
	});

	return { ok: true, data: mapProduct(product) };
}
