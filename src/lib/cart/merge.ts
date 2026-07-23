import { MAX_CART_LINES } from '@/lib/cart/validation';

/** Combine guest and customer quantities without exceeding stock. */
export function computeMergedQuantity(
	existingQty: number,
	guestQty: number,
	stockQty: number,
): number {
	if (stockQty <= 0) {
		return 0;
	}
	return Math.min(Math.max(0, existingQty) + Math.max(0, guestQty), stockQty);
}

export function canAddNewCartLine(currentLineCount: number, maxLines = MAX_CART_LINES): boolean {
	return currentLineCount < maxLines;
}

export type GuestCartMergeResult = {
	merged: boolean;
	linesMerged: number;
	linesSkipped: number;
	guestCartDeleted: boolean;
};
