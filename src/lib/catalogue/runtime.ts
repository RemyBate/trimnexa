import type { PaginatedResult } from '@/lib/catalogue/types';
import { isDatabaseConfigured } from '@/lib/db';

export function emptyPaginatedResult<T>(page = 1, pageSize = 24): PaginatedResult<T> {
	return {
		items: [],
		page,
		pageSize,
		totalItems: 0,
		totalPages: 0,
	};
}

export async function withCatalogueDb<T>(
	context: string,
	fallback: T,
	query: () => Promise<T>,
): Promise<T> {
	if (!isDatabaseConfigured()) {
		if (import.meta.env.DEV) {
			console.warn(`[catalogue] ${context}: DATABASE_URL is not configured; using fallback.`);
		}
		return fallback;
	}

	try {
		return await query();
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error(`[catalogue] ${context}: database query failed`, error);
		}
		return fallback;
	}
}
