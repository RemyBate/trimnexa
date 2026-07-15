import type { ProductStatus } from '@prisma/client';

import { DEFAULT_CURRENCY, formatMoney, xafFromMinor } from '@/lib/money';

export interface ProductImageView {
	id: string;
	url: string;
	altText: string | null;
	sortOrder: number;
}

export interface ProductView {
	id: string;
	sellerProfileId: string;
	categoryId: string;
	title: string;
	slug: string;
	description: string | null;
	priceMinor: string;
	currency: string;
	priceFormatted: string;
	stockQty: number;
	status: ProductStatus;
	submittedAt: string | null;
	reviewedAt: string | null;
	reviewNotes: string | null;
	createdAt: string;
	updatedAt: string;
	images: ProductImageView[];
}

function toPublicMediaUrl(path: string): string {
	return `/${path.replace(/^\/+/, '')}`;
}

export function mapProductImage(image: {
	id: string;
	path: string;
	altText: string | null;
	sortOrder: number;
}): ProductImageView {
	return {
		id: image.id,
		url: toPublicMediaUrl(image.path),
		altText: image.altText,
		sortOrder: image.sortOrder,
	};
}

export function mapProduct(product: {
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
}): ProductView {
	const money = xafFromMinor(product.priceMinor);

	return {
		id: product.id,
		sellerProfileId: product.sellerProfileId,
		categoryId: product.categoryId,
		title: product.title,
		slug: product.slug,
		description: product.description,
		priceMinor: product.priceMinor.toString(),
		currency: product.currency || DEFAULT_CURRENCY,
		priceFormatted: formatMoney(money),
		stockQty: product.stockQty,
		status: product.status,
		submittedAt: product.submittedAt?.toISOString() ?? null,
		reviewedAt: product.reviewedAt?.toISOString() ?? null,
		reviewNotes: product.reviewNotes,
		createdAt: product.createdAt.toISOString(),
		updatedAt: product.updatedAt.toISOString(),
		images: (product.images ?? []).map(mapProductImage),
	};
}
