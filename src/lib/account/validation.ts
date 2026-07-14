import { z } from 'zod';

import { localeSchema } from '@/lib/validation/common';

export const profileUpdateSchema = z.object({
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().max(80).optional().or(z.literal('')),
	phone: z
		.string()
		.trim()
		.max(20)
		.optional()
		.or(z.literal(''))
		.refine((value) => !value || /^[+]?[\d\s()-]{7,20}$/.test(value), {
			message: 'invalid_phone',
		}),
	locale: localeSchema,
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const addressInputSchema = z.object({
	label: z.string().trim().min(1).max(40),
	recipientName: z.string().trim().min(1).max(120),
	phone: z
		.string()
		.trim()
		.min(7)
		.max(20)
		.refine((value) => /^[+]?[\d\s()-]{7,20}$/.test(value), {
			message: 'invalid_phone',
		}),
	line1: z.string().trim().min(1).max(160),
	line2: z.string().trim().max(160).optional().or(z.literal('')),
	city: z.string().trim().min(1).max(80),
	region: z.string().trim().min(1).max(80),
	country: z.string().trim().length(2).default('CM'),
	isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

export const supportTicketSchema = z.object({
	subject: z.string().trim().min(3).max(120),
	message: z.string().trim().min(10).max(2000),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
