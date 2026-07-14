import { ApplicationStatus, SellerStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { getApprovalBlockReason, getRejectionBlockReason } from '@/lib/admin/seller-review';
import { sellerRejectionSchema, sellerReviewSchema } from '@/lib/seller/validation';

describe('seller review transitions', () => {
	it('allows approval for submitted applications', () => {
		expect(
			getApprovalBlockReason({
				profileStatus: SellerStatus.PENDING,
				applicationStatus: ApplicationStatus.SUBMITTED,
			}),
		).toBeNull();
	});

	it('blocks duplicate approval', () => {
		expect(
			getApprovalBlockReason({
				profileStatus: SellerStatus.APPROVED,
				applicationStatus: ApplicationStatus.APPROVED,
			}),
		).toBe('already_reviewed');
	});

	it('blocks rejection after approval', () => {
		expect(
			getRejectionBlockReason({
				profileStatus: SellerStatus.APPROVED,
				applicationStatus: ApplicationStatus.APPROVED,
			}),
		).toBe('already_reviewed');
	});

	it('blocks when application is missing', () => {
		expect(
			getApprovalBlockReason({
				profileStatus: SellerStatus.PENDING,
				applicationStatus: null,
			}),
		).toBe('not_found');
	});
});

describe('seller rejection validation', () => {
	it('requires a rejection reason', () => {
		const result = sellerRejectionSchema.safeParse({ reviewNotes: '' });
		expect(result.success).toBe(false);
	});

	it('accepts optional review notes for approval', () => {
		const result = sellerReviewSchema.safeParse({});
		expect(result.success).toBe(true);
	});
});
