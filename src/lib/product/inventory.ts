import type { Prisma } from '@prisma/client';

export async function recordInventoryAdjustment(
	tx: Prisma.TransactionClient,
	input: {
		productId: string;
		actorId?: string;
		previousQty: number;
		newQty: number;
		reason: string;
	},
): Promise<void> {
	if (input.previousQty === input.newQty) {
		return;
	}

	await tx.inventoryAdjustment.create({
		data: {
			productId: input.productId,
			actorId: input.actorId,
			delta: input.newQty - input.previousQty,
			previousQty: input.previousQty,
			newQty: input.newQty,
			reason: input.reason,
		},
	});
}

export function resolveStockStatus(stockQty: number): 'ACTIVE' | 'OUT_OF_STOCK' {
	return stockQty > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
}
