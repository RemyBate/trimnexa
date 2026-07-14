import { z } from 'zod';

const phoneSchema = z
	.string()
	.trim()
	.min(7)
	.max(20)
	.refine((value) => /^[+]?[\d\s()-]{7,20}$/.test(value), {
		message: 'invalid_phone',
	});

const emailSchema = z.string().trim().email().max(160);

export const sellerApplicationSchema = z.object({
	businessName: z.string().trim().min(2).max(120),
	description: z.string().trim().max(2000).optional().or(z.literal('')),
	contactPhone: phoneSchema,
	contactEmail: emailSchema,
	businessCity: z.string().trim().min(1).max(80),
	businessRegion: z.string().trim().min(1).max(80),
});

export type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;

export const shopProfileUpdateSchema = z.object({
	shopName: z.string().trim().min(2).max(120),
	description: z.string().trim().max(2000).optional().or(z.literal('')),
	shopPhone: phoneSchema,
	shopEmail: emailSchema.optional().or(z.literal('')),
	addressLine1: z.string().trim().min(1).max(160),
	addressLine2: z.string().trim().max(160).optional().or(z.literal('')),
	city: z.string().trim().min(1).max(80),
	region: z.string().trim().min(1).max(80),
	country: z.string().trim().length(2).default('CM'),
	returnPolicy: z.string().trim().max(4000).optional().or(z.literal('')),
	shippingPolicy: z.string().trim().max(4000).optional().or(z.literal('')),
});

export type ShopProfileUpdateInput = z.infer<typeof shopProfileUpdateSchema>;

export const sellerReviewSchema = z.object({
	reviewNotes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type SellerReviewInput = z.infer<typeof sellerReviewSchema>;

export const sellerRejectionSchema = z.object({
	reviewNotes: z.string().trim().min(3, 'rejection_reason_required').max(2000),
});

export type SellerRejectionInput = z.infer<typeof sellerRejectionSchema>;

export const sellerSuspensionSchema = z.object({
	reason: z.string().trim().min(3).max(500),
});

export type SellerSuspensionInput = z.infer<typeof sellerSuspensionSchema>;
