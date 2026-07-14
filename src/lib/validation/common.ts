import { z } from 'zod';

import { site } from '@/config/site';

/** CUID-like id used across Prisma models. */
export const entityIdSchema = z.string().min(1);

export const emailSchema = z.email();

export const localeSchema = z.enum(site.supportedLocales);

export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function parsePagination(input: unknown): PaginationInput {
	return paginationSchema.parse(input);
}
