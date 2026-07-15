import { z } from 'zod';

export const productInputSchema = z.object({
	title: z.string().trim().min(3).max(200),
	description: z.string().trim().max(5000).optional().or(z.literal('')),
	categoryId: z.string().trim().min(1),
	priceMajor: z.coerce.number().int().positive().max(999_999_999),
	stockQty: z.coerce.number().int().min(0).max(999_999),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const productReviewSchema = z.object({
	reviewNotes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type ProductReviewInput = z.infer<typeof productReviewSchema>;

export const productRejectionSchema = z.object({
	reviewNotes: z.string().trim().min(3, 'rejection_reason_required').max(2000),
});

export type ProductRejectionInput = z.infer<typeof productRejectionSchema>;

export const categoryToggleSchema = z.object({
	isActive: z.boolean(),
});

export type CategoryToggleInput = z.infer<typeof categoryToggleSchema>;
