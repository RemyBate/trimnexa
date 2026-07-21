import { ProductStatus } from '@prisma/client';

import { AuditActions, recordAuditLog } from '@/lib/audit/record-audit-log';
import { prisma } from '@/lib/db';
import { resolveStockStatus } from '@/lib/product/inventory';
import { mapProduct, type ProductView } from '@/lib/product/serialize';
import type { ProductRejectionInput, ProductReviewInput } from '@/lib/product/validation';

export type AdminProductErrorCode =
	'not_found' | 'already_reviewed' | 'invalid_transition' | 'profile_suspended';

export type AdminProductResult<T> =
	{ ok: true; data: T } | { ok: false; code: AdminProductErrorCode };

export interface AdminProductListItem {
	id: string;
	title: string;
	slug: string;
	status: ProductStatus;
	priceFormatted: string;
	stockQty: number;
	sellerShopName: string | null;
	sellerEmail: string;
	categoryName: string;
	submittedAt: Date | null;
	updatedAt: Date;
}

export interface AdminProductDetail extends ProductView {
	sellerEmail: string;
	sellerShopName: string | null;
	categoryName: string;
}

const productInclude = {
	images: {
		orderBy: { sortOrder: 'asc' as const },
	},
	sellerProfile: {
		select: {
			shopName: true,
			user: { select: { email: true } },
		},
	},
	category: {
		include: {
			translations: {
				where: { locale: 'en' },
				take: 1,
			},
		},
	},
};

function mapAdminListItem(product: {
	// Fields required by `mapProduct()`
	id: string;
	sellerProfileId: string;
	categoryId: string;
	title: string;
	slug: string;
	description: string | null;
	priceMinor: bigint;
	currency: string;
	stockQty: number;
	status: ProductStatus;
	submittedAt: Date | null;
	reviewedAt: Date | null;
	reviewNotes: string | null;
	createdAt: Date;
	updatedAt: Date;
	images?: Array<{
		id: string;
		path: string;
		altText: string | null;
		sortOrder: number;
	}>;

	// Extra fields used for the admin list item
	sellerProfile: { shopName: string | null; user: { email: string } };
	category: { translations: Array<{ name: string }> };
}): AdminProductListItem {
	const mapped = mapProduct(product);

	return {
		id: product.id,
		title: product.title,
		slug: product.slug,
		status: product.status,
		priceFormatted: mapped.priceFormatted,
		stockQty: product.stockQty,
		sellerShopName: product.sellerProfile.shopName,
		sellerEmail: product.sellerProfile.user.email,
		categoryName: product.category.translations[0]?.name ?? '—',
		submittedAt: product.submittedAt,
		updatedAt: product.updatedAt,
	};
}

export async function listProductsForReview(): Promise<AdminProductListItem[]> {
	const products = await prisma.product.findMany({
		where: {
			status: {
				in: ['PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'OUT_OF_STOCK', 'SUSPENDED'],
			},
		},
		orderBy: [{ status: 'asc' }, { submittedAt: 'desc' }, { updatedAt: 'desc' }],
		include: {
			sellerProfile: {
				select: {
					shopName: true,
					user: { select: { email: true } },
				},
			},
			category: {
				include: {
					translations: {
						where: { locale: 'en' },
						take: 1,
					},
				},
			},
		},
	});

	return products.map(mapAdminListItem);
}

export async function getProductDetailForAdmin(
	productId: string,
): Promise<AdminProductDetail | null> {
	const product = await prisma.product.findUnique({
		where: { id: productId },
		include: productInclude,
	});

	if (!product) {
		return null;
	}

	const mapped = mapProduct(product);

	return {
		...mapped,
		sellerEmail: product.sellerProfile.user.email,
		sellerShopName: product.sellerProfile.shopName,
		categoryName: product.category.translations[0]?.name ?? '—',
	};
}

export async function approveProduct(
	productId: string,
	adminUserId: string,
	input: ProductReviewInput,
): Promise<AdminProductResult<AdminProductDetail>> {
	const existing = await prisma.product.findUnique({ where: { id: productId } });

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (existing.status !== ProductStatus.PENDING_REVIEW) {
		return { ok: false, code: 'already_reviewed' };
	}

	const nextStatus = resolveStockStatus(existing.stockQty);

	await prisma.product.update({
		where: { id: productId },
		data: {
			status: nextStatus,
			reviewedAt: new Date(),
			reviewedById: adminUserId,
			reviewNotes: input.reviewNotes?.trim() || null,
		},
	});

	await recordAuditLog({
		action: AuditActions.PRODUCT_APPROVED,
		entityType: 'product',
		entityId: productId,
		actorId: adminUserId,
		metadata: { status: nextStatus },
	});

	const detail = await getProductDetailForAdmin(productId);
	return detail ? { ok: true, data: detail } : { ok: false, code: 'not_found' };
}

export async function rejectProduct(
	productId: string,
	adminUserId: string,
	input: ProductRejectionInput,
): Promise<AdminProductResult<AdminProductDetail>> {
	const existing = await prisma.product.findUnique({ where: { id: productId } });

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (existing.status !== ProductStatus.PENDING_REVIEW) {
		return { ok: false, code: 'already_reviewed' };
	}

	await prisma.product.update({
		where: { id: productId },
		data: {
			status: ProductStatus.REJECTED,
			reviewedAt: new Date(),
			reviewedById: adminUserId,
			reviewNotes: input.reviewNotes.trim(),
		},
	});

	await recordAuditLog({
		action: AuditActions.PRODUCT_REJECTED,
		entityType: 'product',
		entityId: productId,
		actorId: adminUserId,
	});

	const detail = await getProductDetailForAdmin(productId);
	return detail ? { ok: true, data: detail } : { ok: false, code: 'not_found' };
}

export async function suspendProduct(
	productId: string,
	adminUserId: string,
	reason: string,
): Promise<AdminProductResult<AdminProductDetail>> {
	const existing = await prisma.product.findUnique({ where: { id: productId } });

	if (!existing) {
		return { ok: false, code: 'not_found' };
	}

	if (existing.status !== ProductStatus.ACTIVE && existing.status !== ProductStatus.OUT_OF_STOCK) {
		return { ok: false, code: 'invalid_transition' };
	}

	await prisma.product.update({
		where: { id: productId },
		data: {
			status: ProductStatus.SUSPENDED,
			reviewNotes: reason.trim(),
		},
	});

	await recordAuditLog({
		action: AuditActions.PRODUCT_SUSPENDED,
		entityType: 'product',
		entityId: productId,
		actorId: adminUserId,
		metadata: { reason },
	});

	const detail = await getProductDetailForAdmin(productId);
	return detail ? { ok: true, data: detail } : { ok: false, code: 'not_found' };
}
